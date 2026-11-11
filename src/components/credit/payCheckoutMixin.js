// Pay with Razorpay, for CreditTopUpPopup (contract §6). The popup supplies the quote,
// requestQuote(), the billing form (billingFormOpen) and formatting; this mixin runs the order:
//
//   Pay → POST /billing/orders (Idempotency-Key per click) → Razorpay popup
//       → handler → POST /orders/:id/confirm → FULFILLED, or poll GET /orders/:id
//       → dismissed → poll briefly → "Payment not completed": Try again / Cancel
//
// Only the server's order status is final; the Razorpay handler and failure events never are.
// While a payment is in progress the page warns before it is closed, a dropped connection is
// waited out (never reported as a failed payment), and the last order is remembered across tabs.
import { v4 as uuidv4 } from 'uuid';
import { BillingError, createOrder, getOrder, confirmOrder, cancelOrder, getInvoice } from '../../utils/billingApi';
import { openRazorpayCheckout } from '../../utils/razorpayCheckout';
import { downloadInvoiceDocument } from './invoice/downloadInvoice';

const POLL_EVERY_MS = 2000;
const POLL_AFTER_CONFIRM_MS = 60000;
// A UPI payment can be approved on the phone after the popup closes
const POLL_AFTER_DISMISS_MS = 10000;
const FINAL_STATUSES = ['FULFILLED', 'EXPIRED', 'CANCELLED', 'FAILED', 'NEEDS_REVIEW'];
const LAST_ORDER_KEY = 'hs.topup.lastOrder';
// Older remembered orders are dropped: the server settles every order long before this
const LAST_ORDER_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;
const UNAVAILABLE_MESSAGE = 'Payments are temporarily unavailable. Please try again.';

const emptyPay = () => ({
  // null (the form) | 'creating' | 'checkout' (Razorpay open) | 'confirming' | 'polling' | 'done'
  stage: null,
  // The latest Order from the server
  order: null,
  // The Pay click being sent: { key, quoteId }. Kept for a retry after a network error or 503.
  attempt: null,
  // Shown under Pay while the form is on screen
  error: '',
  // Shown on the status screen when Razorpay itself couldn't be opened
  failure: '',
  timedOut: false,
  // Razorpay's handler ran: the customer paid, so the order is never shown as unpaid or cancelled
  paymentReported: false,
  // The handler's values, kept until POST /confirm gets through (resent when back online)
  confirmPayload: null,
  // The last call failed without an answer from the server (no connection)
  offline: false,
  busy: false,
  downloading: false,
  downloadError: ''
});

// localStorage, not sessionStorage: a closed tab mustn't hide "Your last payment was successful"
function rememberOrder(order) {
  try {
    localStorage.setItem(LAST_ORDER_KEY, JSON.stringify({ orderId: order.orderId, appId: order.appId, at: Date.now() }));
  } catch (e) { /* storage may be unavailable */ }
}

function forgetOrder() {
  try {
    localStorage.removeItem(LAST_ORDER_KEY);
  } catch (e) { /* storage may be unavailable */ }
}

function rememberedOrder() {
  try {
    const last = JSON.parse(localStorage.getItem(LAST_ORDER_KEY) || 'null');
    if (last && !(Date.now() - last.at < LAST_ORDER_MAX_AGE_MS)) {
      forgetOrder();
      return null;
    }
    return last;
  } catch (e) {
    return null;
  }
}

// A call that got no answer from the server at all, as opposed to an error response
const isNetworkError = error => !(error instanceof BillingError);

// The browser's own "Leave site?" dialog; its wording can't be changed
function warnBeforeLeaving(event) {
  event.preventDefault();
  event.returnValue = '';
  return '';
}

export default {
  data() {
    return {
      pay: emptyPay(),
      // A 403 from the orders API: this user lacks WRITE_BILLING
      payForbidden: false,
      // Pay was clicked with incomplete billing details: continue once they're saved
      payAfterBilling: false,
      // One automatic retry (unchanged total after QUOTE_EXPIRED, or a reused key) per click
      payAutoRetried: false,
      lastPaymentNotice: '',
      pollToken: 0,
      pollTimer: null
    };
  },
  computed: {
    canWriteBilling() {
      return this.$store.getters['mainStore/hasAccess']('DASHBOARD', 'WRITE_BILLING');
    },
    // Pay is shown only when catalog.features.pay is true (Indian accounts, payments on)
    payDisabledReason() {
      if (!this.payEnabled) return 'Coming soon';
      if (!this.canWriteBilling || this.payForbidden) return 'You don\'t have permission to pay. Ask your account owner for the Manage billing permission.';
      return '';
    },
    canPay() {
      return !this.payDisabledReason && Boolean(this.quote) && !this.quoteLoading && !this.applyingCoupon && this.pay.stage === null;
    },
    // Razorpay is open, or a payment is being confirmed: leaving now would interrupt it
    paymentInFlight() {
      const { stage, order } = this.pay;
      if (!['checkout', 'confirming', 'polling'].includes(stage)) return false;
      return !(order && FINAL_STATUSES.includes(order.status));
    },
    // The status screen replaces the form from the moment Razorpay opens
    payScreen() {
      return ['checkout', 'confirming', 'polling', 'done'].includes(this.pay.stage);
    },
    // What the status screen shows (contract §6.3)
    payView() {
      const { order, stage, timedOut, failure, offline, paymentReported } = this.pay;
      const settled = order && FINAL_STATUSES.includes(order.status);
      // No connection: the payment may well have gone through, so wait instead of reporting a failure
      if (offline && !settled) {
        return {
          tone: 'info',
          title: 'You\'re offline',
          text: 'We\'ll finish checking your payment when you\'re back online.',
          actions: ['checkAgain']
        };
      }
      if (failure) return { tone: 'error', title: failure, actions: paymentReported ? ['checkAgain'] : ['tryAgain', 'cancel'] };
      if (!order) return { tone: 'busy', title: 'Starting payment…' };
      const canReopen = Boolean(order.checkout);
      switch (order.status) {
        case 'FULFILLED':
          return { tone: 'success', title: `${this.formatCount(order.credits)} credits added to ${order.appName}` };
        case 'NEEDS_REVIEW':
          return { tone: 'info', title: 'We\'re checking your payment', text: 'Our team will contact you.', actions: ['close'] };
        case 'EXPIRED':
        case 'CANCELLED':
        case 'FAILED':
          return { tone: 'error', title: 'Payment not completed', actions: ['startAgain'] };
        case 'PAID':
          return timedOut
            ? { tone: 'info', title: 'Payment received', text: 'Your credits will appear shortly.', actions: ['close'] }
            : { tone: 'busy', title: 'Adding your credits…' };
        default: {
          // PENDING_PAYMENT
          const retry = canReopen ? ['tryAgain', 'cancel'] : ['startAgain'];
          if (stage === 'checkout') return { tone: 'busy', title: 'Waiting for payment…', text: 'Complete the payment in the Razorpay window.' };
          if (stage === 'confirming') return { tone: 'busy', title: 'Confirming your payment…' };
          // Razorpay said it was paid: never offer Cancel or a second payment for it
          if (paymentReported) {
            return (timedOut || stage === 'done')
              ? {
                tone: 'info',
                title: 'Payment received',
                text: `We're confirming it; your credits will appear shortly. If they don't, contact support with order ${order.orderNumber}.`,
                actions: ['checkAgain']
              }
              : { tone: 'busy', title: 'Confirming your payment…' };
          }
          if (order.lastPaymentError) {
            return { tone: 'error', title: `Payment failed: ${order.lastPaymentError.description}`, actions: retry, busy: stage === 'polling' };
          }
          if (timedOut || stage === 'done') return { tone: 'error', title: 'Payment not completed', actions: retry };
          return { tone: 'busy', title: 'Checking your payment…' };
        }
      }
    }
  },
  watch: {
    paymentInFlight(inFlight) {
      if (inFlight) window.addEventListener('beforeunload', warnBeforeLeaving);
      else window.removeEventListener('beforeunload', warnBeforeLeaving);
    }
  },
  mounted() {
    window.addEventListener('online', this.onBackOnline);
    window.addEventListener('offline', this.onWentOffline);
  },
  beforeDestroy() {
    this.stopPolling();
    window.removeEventListener('beforeunload', warnBeforeLeaving);
    window.removeEventListener('online', this.onBackOnline);
    window.removeEventListener('offline', this.onWentOffline);
  },
  methods: {
    // Called from the popup's open(): a fresh form, and the last order of this tab if any (§6)
    resetPayment() {
      this.stopPolling();
      this.pay = emptyPay();
      this.payAfterBilling = false;
      this.lastPaymentNotice = '';
      this.checkLastOrder();
    },
    async checkLastOrder() {
      const last = rememberedOrder();
      if (!last || last.appId !== this.appId) return;
      try {
        const order = await getOrder(last.orderId);
        if (order.status === 'FULFILLED') {
          this.lastPaymentNotice = `Your last payment was successful: ${this.formatCount(order.credits)} credits added to ${order.appName}.`;
          this.$emit('paid', order);
        }
        if (FINAL_STATUSES.includes(order.status)) forgetOrder();
      } catch (error) {
        if (error.code === 'ORDER_NOT_FOUND') forgetOrder();
      }
    },

    // ---- Pay click

    onPayClick() {
      if (!this.canPay) return;
      this.payAutoRetried = false;
      this.pay.error = '';
      // Invoices need confirmed billing details: ask for them first, then continue (see onBillingSaved)
      if (!this.quote.billingProfileComplete) {
        this.payAfterBilling = true;
        this.billingFormOpen = true;
        return;
      }
      this.startOrder();
    },
    // The popup calls this after the billing form saved and the quote was refreshed.
    // `wasWaiting` is payAfterBilling as it was before the form closed.
    resumePayAfterBilling(wasWaiting) {
      this.payAfterBilling = false;
      if (wasWaiting && this.quote && this.quote.billingProfileComplete && this.canPay) this.startOrder();
    },
    async startOrder() {
      const quoteId = this.quote.quoteId;
      // A new key per click; the same key only to retry this click after a network error or 503
      const attempt = this.pay.attempt && this.pay.attempt.quoteId === quoteId ? this.pay.attempt : { key: uuidv4(), quoteId };
      this.pay = { ...emptyPay(), stage: 'creating', attempt };
      try {
        const order = await createOrder(quoteId, attempt.key);
        rememberOrder(order);
        this.beginCheckout(order);
      } catch (error) {
        await this.handleOrderError(error, attempt);
      }
    },
    async handleOrderError(error, attempt) {
      this.pay = { ...this.pay, stage: null };
      if (!(error instanceof BillingError) || ['PAYMENTS_UNAVAILABLE', 'BILLING_NOT_CONFIGURED'].includes(error.code)) {
        // Keep the attempt: the next click retries with the same key
        this.pay = { ...this.pay, attempt, error: UNAVAILABLE_MESSAGE };
        return;
      }
      this.pay.attempt = null;
      if (error.code === 'QUOTE_EXPIRED') {
        const previousTotal = this.quote && this.quote.totalMinor;
        await this.requestQuote();
        if (this.quote && this.quote.totalMinor === previousTotal && !this.payAutoRetried) {
          this.payAutoRetried = true;
          return this.startOrder();
        }
        this.pay.error = this.quote
          ? `The total is now ${this.formatMoney(this.quote.totalMinor)}. Please check it and click Pay again.`
          : 'Prices have changed. Please check the total and click Pay again.';
        return;
      }
      if (error.code === 'COUPON_INVALID') {
        this.couponCode = null;
        this.couponNotice = '';
        await this.requestQuote();
        this.pay.error = 'This coupon is no longer available. Please check the new total and click Pay again.';
        return;
      }
      if (error.code === 'BILLING_PROFILE_INCOMPLETE') {
        this.payAfterBilling = true;
        this.billingFormOpen = true;
        return;
      }
      if (error.code === 'IDEMPOTENCY_KEY_REUSED') {
        // A dashboard bug: the key went with another quote. Log it and use a new key once.
        console.warn('Idempotency-Key reused for a different quote', attempt);
        if (!this.payAutoRetried) {
          this.payAutoRetried = true;
          return this.startOrder();
        }
      }
      if (error.status === 403) {
        this.payForbidden = true;
        return;
      }
      if (error.status === 429) {
        this.pay.error = 'Please try again in a moment.';
        return;
      }
      this.pay.error = 'We couldn\'t start the payment. Please try again.';
    },

    // ---- Razorpay

    async beginCheckout(order) {
      this.stopPolling();
      this.pay = { ...this.pay, stage: 'checkout', order, failure: '', timedOut: false, error: '' };
      try {
        await openRazorpayCheckout(order, {
          onPaid: response => this.onRazorpayPaid(order.orderId, response),
          onDismiss: () => this.onRazorpayDismissed(order.orderId),
          // Razorpay shows the error and lets the customer retry in its popup: only log it
          onFailed: error => console.info('Razorpay payment failed', error && error.code, error && error.description)
        });
      } catch (e) {
        this.pay = { ...this.pay, stage: 'done', failure: 'We couldn\'t open the payment window. Check your connection and try again.' };
      }
    },
    async onRazorpayPaid(orderId, response) {
      this.pay = {
        ...this.pay,
        stage: 'confirming',
        paymentReported: true,
        confirmPayload: {
          providerOrderId: response.razorpay_order_id,
          paymentId: response.razorpay_payment_id,
          signature: response.razorpay_signature
        }
      };
      if (await this.sendConfirm(orderId)) return;
      this.pollOrder(orderId, POLL_AFTER_CONFIRM_MS);
    },
    // POST /confirm with the handler's values. True when the order is settled.
    async sendConfirm(orderId) {
      const payload = this.pay.confirmPayload;
      if (!payload) return false;
      try {
        const order = await confirmOrder(orderId, payload);
        this.pay = { ...this.pay, order, confirmPayload: null, offline: false };
        if (FINAL_STATUSES.includes(order.status)) {
          this.finishPayment();
          return true;
        }
      } catch (error) {
        // No answer: keep the values to resend. An answer (e.g. PAYMENT_VERIFICATION_FAILED):
        // neither success nor failure, so the server's status decides.
        if (isNetworkError(error)) this.pay.offline = true;
        else this.pay.confirmPayload = null;
      }
      return false;
    },
    onRazorpayDismissed(orderId) {
      // The handler already ran: confirm and polling decide
      if (this.pay.stage !== 'checkout') return;
      this.pollOrder(orderId, POLL_AFTER_DISMISS_MS);
    },

    // ---- Polling: one loop per order, only while the popup shows it

    pollOrder(orderId, durationMs) {
      this.stopPolling();
      const token = this.pollToken;
      const deadline = Date.now() + durationMs;
      this.pay = { ...this.pay, stage: 'polling', timedOut: false };
      const tick = async () => {
        if (token !== this.pollToken) return;
        try {
          const order = await getOrder(orderId);
          if (token !== this.pollToken) return;
          this.pay = { ...this.pay, order, offline: false };
          if (FINAL_STATUSES.includes(order.status)) {
            this.finishPayment();
            return;
          }
        } catch (error) {
          if (token !== this.pollToken) return;
          if (isNetworkError(error)) this.pay.offline = true;
        }
        if (Date.now() >= deadline) {
          // Offline: stop here, onBackOnline() checks again when the connection returns
          this.pay = { ...this.pay, stage: 'done', timedOut: true };
          return;
        }
        this.pollTimer = setTimeout(tick, POLL_EVERY_MS);
      };
      this.pollTimer = setTimeout(tick, POLL_EVERY_MS);
    },
    // The connection is back: resend a confirm that didn't get through, then check the order again
    async onBackOnline() {
      const { order, stage, offline } = this.pay;
      if (!order || !offline || FINAL_STATUSES.includes(order.status) || !['polling', 'done'].includes(stage)) return;
      this.payCheckAgain();
    },
    onWentOffline() {
      if (this.paymentInFlight || (this.pay.stage === 'done' && this.pay.paymentReported)) this.pay.offline = true;
    },
    async payCheckAgain() {
      const { order } = this.pay;
      if (!order) return;
      this.stopPolling();
      this.pay = { ...this.pay, failure: '', offline: false, stage: 'polling', timedOut: false };
      if (await this.sendConfirm(order.orderId)) return;
      this.pollOrder(order.orderId, POLL_AFTER_CONFIRM_MS);
    },
    stopPolling() {
      this.pollToken++;
      clearTimeout(this.pollTimer);
      this.pollTimer = null;
    },
    finishPayment() {
      this.stopPolling();
      const { order } = this.pay;
      this.pay = { ...this.pay, stage: 'done' };
      if (FINAL_STATUSES.includes(order.status)) forgetOrder();
      // The page refreshes its credits list and purchase history
      if (order.status === 'FULFILLED') this.$emit('paid', order);
    },

    // ---- Status screen actions

    // Reopen Razorpay on the same order while it's payable; never create a new order for it
    async payTryAgain() {
      this.stopPolling();
      let { order } = this.pay;
      if (order) {
        try {
          order = await getOrder(order.orderId);
          this.pay.order = order;
        } catch (e) { /* use the last known order */ }
      }
      if (order && FINAL_STATUSES.includes(order.status)) {
        this.finishPayment();
        return;
      }
      if (order && order.checkout) this.beginCheckout(order);
      else this.payStartAgain();
    },
    async payCancel() {
      const { order } = this.pay;
      if (!order || this.pay.busy || this.pay.paymentReported) return;
      this.stopPolling();
      this.pay.busy = true;
      try {
        const cancelled = await cancelOrder(order.orderId);
        this.pay.order = cancelled;
        // The payment went through meanwhile
        if (cancelled.status === 'FULFILLED') {
          this.finishPayment();
          return;
        }
        this.payStartAgain();
      } catch (error) {
        if (error.code === 'ORDER_NOT_CANCELLABLE') {
          // Already paid: show the order as it is now
          try {
            this.pay.order = await getOrder(order.orderId);
          } catch (e) { /* keep the last known order */ }
          if (FINAL_STATUSES.includes(this.pay.order.status)) this.finishPayment();
          else this.pollOrder(order.orderId, POLL_AFTER_CONFIRM_MS);
          return;
        }
        this.pay = { ...this.pay, failure: 'We couldn\'t cancel the payment. Please try again.' };
      } finally {
        this.pay.busy = false;
      }
    },
    // A new quote, then a new Pay click (with a new key)
    payStartAgain() {
      this.stopPolling();
      forgetOrder();
      this.pay = emptyPay();
      this.requestQuote();
      if (this.couponsEnabled) this.loadCoupons();
    },
    async downloadPaidInvoice() {
      const invoice = this.pay.order && this.pay.order.invoice;
      if (!invoice || this.pay.downloading) return;
      this.pay.downloading = true;
      this.pay.downloadError = '';
      try {
        await downloadInvoiceDocument(await getInvoice(invoice.invoiceId));
      } catch (e) {
        this.pay.downloadError = e.message || 'Could not prepare the invoice.';
      } finally {
        this.pay.downloading = false;
      }
    },
    // The top-up popup is closing: stop polling, and give up an unpaid order (frees the coupon).
    // If cancel fails, the server expires the order after 30 minutes.
    leavePayment() {
      const { order, stage } = this.pay;
      this.stopPolling();
      // Never cancel an order Razorpay reported as paid
      if (order && order.status === 'PENDING_PAYMENT' && stage !== 'confirming' && !this.pay.paymentReported) {
        cancelOrder(order.orderId).then(forgetOrderIfFinal, () => {});
      }
      this.pay = emptyPay();
    }
  }
};

function forgetOrderIfFinal(order) {
  if (order && FINAL_STATUSES.includes(order.status)) forgetOrder();
}
