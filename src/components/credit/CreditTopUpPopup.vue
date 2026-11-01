<template>
  <b-modal
    :id="popupId"
    :visible="value"
    size="lg"
    centered
    scrollable
    hide-footer
    modal-class="credit-topup-modal"
    @show="open"
    @change="$emit('input', $event)"
  >
    <template #modal-header="{ close }">
      <div class="topup-header">
        <span class="topup-header-icon"><v-icon small>mdi-wallet-plus-outline</v-icon></span>
        <div class="topup-header-text">
          <h2>Top up credits</h2>
        </div>
        <button type="button" class="topup-close" aria-label="Close" @click="close()">
          <v-icon small>mdi-close</v-icon>
        </button>
      </div>
    </template>

    <div v-if="catalogLoading" class="topup-state" aria-live="polite">
      <b-spinner small variant="secondary" />
      <span>Loading prices…</span>
    </div>

    <!-- Errors that stop the top-up: billing off, no permission, no onboarding, app not billable -->
    <div v-else-if="blocker" class="topup-state" role="alert">
      <v-icon small>mdi-alert-circle-outline</v-icon>
      <span>{{ blocker.message }}</span>
      <button v-if="blocker.action === 'retry'" type="button" class="topup-retry" @click="loadCatalog">Try again</button>
      <router-link v-else-if="blocker.action === 'onboarding'" class="topup-retry" to="/studio/onboarding">Complete onboarding</router-link>
    </div>

    <div v-else-if="catalog" class="topup-layout">
      <div class="topup-main">
        <section class="topup-card">
          <header class="topup-card-header">
            <h3>Choose an amount</h3>
            <p>Bigger plans get a bigger discount.<template v-if="taxIncluded"> Prices exclude GST.</template></p>
          </header>

          <div class="plan-grid" :style="{ '--plan-count': plans.length }">
            <button
              v-for="plan in plans"
              :key="plan.code"
              type="button"
              class="plan-option"
              :class="{ selected: selectedPlanCode === plan.code }"
              :aria-pressed="selectedPlanCode === plan.code"
              @click="selectPlan(plan.code)"
            >
              <span class="plan-amount">{{ formatMoney(plan.priceMinor) }}</span>
              <span v-if="plan.discountBps" class="plan-save">Save {{ formatPercent(plan.discountBps) }}</span>
              <span class="plan-meta">
                <span>{{ formatMoney(plan.totalBeforeTaxMinor) }}</span>
                <span>{{ formatCount(plan.credits) }} credits</span>
              </span>
              <span class="plan-check" aria-hidden="true"><v-icon x-small>mdi-check</v-icon></span>
            </button>
          </div>

          <template v-if="customEnabled">
            <button
              v-if="selectedPlanCode !== 'custom'"
              type="button"
              class="custom-toggle"
              @click="selectCustom"
            >
              <v-icon x-small>mdi-pencil-outline</v-icon>
              Custom amount
            </button>
            <div v-else class="custom-field" :class="{ invalid: customError }">
              <label :for="customInputId">Custom amount</label>
              <div class="custom-control">
                <span class="currency-symbol">{{ currencySymbol }}</span>
                <input
                  :id="customInputId"
                  ref="customInput"
                  v-model="customInput"
                  type="number"
                  inputmode="numeric"
                  step="1"
                  :min="customMinMajor"
                  :max="customMaxMajor"
                  placeholder="Enter amount"
                />
                <span v-if="customHintBps && !customError" class="custom-hint">{{ formatPercent(customHintBps) }} off</span>
              </div>
              <small v-if="customError" class="field-error">
                {{ customError }}
                <a v-if="customErrorSales" href="mailto:sales@hypersign.id">talk to sales</a>.
              </small>
              <small v-else>Between {{ formatMoney(catalog.custom.minMinor) }} and {{ formatMoney(catalog.custom.maxMinor) }}, in whole amounts.</small>
            </div>
          </template>

          <p class="sales-note">
            Need higher volume?
            <a href="mailto:sales@hypersign.id">Talk to sales <v-icon x-small>mdi-arrow-right</v-icon></a>
          </p>
        </section>

        <section v-if="addOns.length" class="topup-card addons-card" :class="{ open: addOnsOpen }">
          <button
            type="button"
            class="addons-toggle"
            :aria-expanded="addOnsOpen ? 'true' : 'false'"
            aria-controls="credit-top-up-addons"
            @click="addOnsOpen = !addOnsOpen"
          >
            <span class="addons-heading">
              <span class="addons-title">Included with every top-up</span>
              <span class="addons-summary">{{ addOnsSummary }}</span>
            </span>
            <span v-if="addOnsFree" class="addon-tag">Free</span>
            <v-icon small class="addons-chevron">mdi-chevron-down</v-icon>
          </button>
          <ul v-show="addOnsOpen" id="credit-top-up-addons" class="addon-list">
            <!-- Add-ons are all included today, so none has a checkbox -->
            <li v-for="addOn in addOns" :key="addOn.code" class="addon-item">
              <span class="addon-icon"><v-icon x-small>{{ addOn.icon || 'mdi-check-circle-outline' }}</v-icon></span>
              <span class="addon-copy">
                <strong>{{ addOn.title }}</strong>
                <small>{{ addOn.description }}</small>
              </span>
              <span class="addon-price">{{ addOn.priceMinor ? formatMoney(addOn.priceMinor) : 'Free' }}</span>
            </li>
          </ul>
        </section>
      </div>

      <aside class="topup-summary" :class="{ pending: quoteLoading }" aria-live="polite">
        <div class="credits-highlight">
          <span class="eyebrow">You'll get</span>
          <div class="credits-value">
            <strong>{{ credits === null ? '—' : formatCount(credits) }}</strong>
            <small>credits</small>
          </div>
          <button type="button" class="credits-help" :disabled="!credits" @click="calculatorOpen = true">
            <v-icon x-small>mdi-help-circle-outline</v-icon>
            Understand your credits
          </button>
        </div>

        <div v-if="quoteError" class="quote-error" role="alert">
          <span>{{ quoteError }}</span>
          <button type="button" class="topup-retry" @click="requestQuote">Try again</button>
        </div>

        <dl v-if="quote" class="summary-lines">
          <div class="summary-line">
            <dt>Top-up amount</dt>
            <dd>{{ formatMoney(quote.subtotalMinor) }}</dd>
          </div>
          <div v-if="quote.planDiscount && quote.planDiscount.amountMinor > 0" class="summary-line saving">
            <dt>Plan discount · {{ formatPercent(quote.planDiscount.percentBps) }}</dt>
            <dd>− {{ formatMoney(quote.planDiscount.amountMinor) }}</dd>
          </div>
          <div v-if="quote.addOns && quote.addOns.length" class="summary-line">
            <dt>Add-ons · {{ quote.addOns.length }}</dt>
            <dd v-if="quote.addOns.every(addOn => !addOn.priceMinor)" class="saving-text">Free</dd>
          </div>
          <div v-for="line in taxLines" :key="line.type" class="summary-line">
            <dt>{{ taxLabel(line) }}</dt>
            <dd>{{ formatMoney(line.amountMinor) }}</dd>
          </div>
          <div v-if="quote.coupon" class="summary-line saving">
            <dt>
              <span class="coupon-chip">
                {{ quote.coupon.code }} · {{ formatPercent(quote.coupon.percentBps) }}
                <button type="button" aria-label="Remove coupon" @click="removeCoupon">
                  <v-icon x-small>mdi-close</v-icon>
                </button>
              </span>
            </dt>
            <dd>− {{ formatMoney(quote.coupon.amountMinor) }}</dd>
          </div>
        </dl>

        <div v-if="couponsEnabled && !(quote && quote.coupon)" class="coupon-area">
          <button type="button" class="coupon-toggle" @click="openCouponDialog">
            <v-icon x-small>mdi-tag-outline</v-icon>
            Apply coupon
            <span v-if="coupons.length" class="coupon-count">· {{ coupons.length }} available</span>
          </button>
          <small v-if="couponNotice" class="field-error">{{ couponNotice }}</small>
        </div>

        <div class="total-line">
          <span>Total due</span>
          <strong>
            {{ quote ? formatMoney(quote.totalMinor) : '—' }}<small v-if="taxAtCheckout && quote" class="plus-tax"> + tax</small>
          </strong>
        </div>

        <span class="pay-button-wrap" :title="payEnabled ? '' : 'Coming soon'">
          <button type="button" class="pay-button" :disabled="!canPay" @click="checkout">
            <v-icon x-small>mdi-lock-outline</v-icon>
            <span>{{ quote ? `Pay ${formatMoney(quote.totalMinor)}` : 'Pay' }}</span>
            <v-icon x-small class="pay-arrow">mdi-arrow-right</v-icon>
          </button>
        </span>
        <p v-if="!payEnabled" class="pay-soon">Online payment is coming soon.</p>

        <p v-if="taxAtCheckout" class="tax-note">Tax is calculated on the secure payment page.</p>

        <!-- Invoices need confirmed billing details; required before Pay in stage 2 -->
        <p v-if="quote && !quote.billingProfileComplete" class="billing-link">
          <button type="button" @click="billingFormOpen = true">
            <v-icon x-small>mdi-card-account-details-outline</v-icon>
            Add billing details
          </button>
        </p>
      </aside>
    </div>

    <b-modal
      :id="couponDialogId"
      :visible="couponDialogOpen"
      centered
      hide-footer
      modal-class="credit-topup-modal credit-coupon-modal"
      @shown="focusCouponInput"
      @change="couponDialogOpen = $event"
    >
      <template #modal-header="{ close }">
        <div class="topup-header">
          <span class="topup-header-icon"><v-icon small>mdi-tag-outline</v-icon></span>
          <div class="topup-header-text">
            <h2>Apply a coupon</h2>
            <p>Enter a code or pick one of the offers below.</p>
          </div>
          <button type="button" class="topup-close" aria-label="Close" @click="close()">
            <v-icon small>mdi-close</v-icon>
          </button>
        </div>
      </template>

      <form class="coupon-form" @submit.prevent="applyCoupon(couponInput)">
        <label :for="couponInputId">Coupon code</label>
        <div class="coupon-form-row">
          <input
            :id="couponInputId"
            ref="couponInput"
            v-model="couponInput"
            type="text"
            placeholder="Enter code"
            autocomplete="off"
            :class="{ invalid: couponError }"
            :disabled="applyingCoupon"
            @input="couponError = ''"
          />
          <button type="submit" :disabled="!couponInput.trim() || applyingCoupon">Apply</button>
        </div>
        <small v-if="couponError" class="field-error">{{ couponError }}</small>
      </form>

      <div v-if="couponsLoading" class="topup-state compact" aria-live="polite">
        <b-spinner small variant="secondary" />
        <span>Loading offers…</span>
      </div>
      <div v-else-if="couponsError" class="topup-state compact" role="alert">
        <v-icon small>mdi-alert-circle-outline</v-icon>
        <span>{{ couponsError }}</span>
        <button type="button" class="topup-retry" @click="loadCoupons">Try again</button>
      </div>
      <!-- An empty list means no offers: only the code input shows -->
      <template v-else-if="coupons.length">
        <div class="coupon-divider"><span>Available offers</span></div>
        <ul class="coupon-list">
          <li v-for="coupon in coupons" :key="coupon.code" class="coupon-offer">
            <div class="coupon-offer-main">
              <div class="coupon-offer-top">
                <span class="coupon-code">{{ coupon.code }}</span>
                <span class="coupon-percent">{{ formatPercent(coupon.percentBps) }} off</span>
              </div>
              <strong>{{ coupon.title }}</strong>
              <small>{{ coupon.description }}</small>
              <small v-if="coupon.previewDiscountMinor > 0" class="coupon-saving">
                Saves {{ formatMoney(coupon.previewDiscountMinor) }} on this top-up
              </small>
            </div>
            <button type="button" class="coupon-apply" :disabled="applyingCoupon" @click="applyCoupon(coupon.code)">Apply</button>
          </li>
        </ul>
      </template>
    </b-modal>

    <b-modal
      :id="billingDialogId"
      :visible="billingFormOpen"
      size="lg"
      centered
      scrollable
      hide-footer
      modal-class="credit-topup-modal credit-billing-modal"
      @change="billingFormOpen = $event"
    >
      <template #modal-header="{ close }">
        <div class="topup-header">
          <span class="topup-header-icon"><v-icon small>mdi-card-account-details-outline</v-icon></span>
          <div class="topup-header-text">
            <h2>Billing details</h2>
            <p>Printed on your invoices.</p>
          </div>
          <button type="button" class="topup-close" aria-label="Close" @click="close()">
            <v-icon small>mdi-close</v-icon>
          </button>
        </div>
      </template>
      <BillingDetails v-if="billingFormOpen" embedded @saved="onBillingSaved" />
    </b-modal>

    <KycCreditCalculator
      v-if="catalog"
      v-model="calculatorOpen"
      mode="topup"
      :remaining-credits="credits || 0"
      :visible-flow-ids="catalog.calculatorFlowIds"
      back-label="Back to Top up credits"
    />
  </b-modal>
</template>

<script>
import KycCreditCalculator from './KycCreditCalculator.vue';
import BillingDetails from '../settings/BillingDetails.vue';
import { getCatalog, getCoupons, createQuote } from '../../utils/billingApi';
import { formatMinor, formatBps, formatCount } from '../../utils/billingFormat';

const QUOTE_DEBOUNCE_MS = 400;
const COUPON_INVALID_MESSAGE = 'This coupon code is not valid.';
const COUPON_RATE_LIMITED_MESSAGE = 'Too many coupon attempts. Please try again later.';

// Errors that stop the top-up altogether (contract §1.5, §2, §3). 403 and 429 carry no code.
function blockerFor(error) {
  if (error.code === 'BILLING_DISABLED') return { message: 'Top-ups are not available for your region yet.' };
  if (error.status === 403) return { message: 'You don\'t have permission to view billing. Ask your account owner for access.' };
  if (error.code === 'ONBOARDING_NOT_FOUND') return { message: 'Complete onboarding to top up credits.', action: 'onboarding' };
  if (error.code === 'APP_NOT_FOUND') return { message: 'This app isn\'t in your organisation, so it can\'t be topped up here.' };
  if (error.code === 'APP_NOT_BILLABLE') return { message: 'Only ID Service apps are topped up here. SSI apps keep their existing credit flow.' };
  return null;
}

const TAX_LABELS = { ZERO_RATED_EXPORT: 'Export (zero-rated)', SALES_TAX: 'Sales tax' };

export default {
  name: 'CreditTopUpPopup',
  components: { KycCreditCalculator, BillingDetails },
  props: {
    value: { type: Boolean, default: false },
    // The ID Service app being topped up; coupons and quotes are per app
    appId: { type: String, default: '' }
  },
  data() {
    return {
      popupId: 'credit-top-up-popup',
      customInputId: 'credit-top-up-custom-amount',
      couponDialogId: 'credit-top-up-coupon-popup',
      couponInputId: 'credit-top-up-coupon-code',
      billingDialogId: 'credit-top-up-billing-popup',
      billingFormOpen: false,
      catalog: null,
      catalogLoading: false,
      blocker: null,
      // A plan code, or 'custom'
      selectedPlanCode: null,
      customInput: '',
      customError: '',
      customErrorSales: false,
      couponCode: null,
      quote: null,
      quoteLoading: false,
      quoteError: '',
      // Responses from older requests are dropped
      quoteRequest: 0,
      quoteTimer: null,
      catalogReloaded: false,
      coupons: [],
      couponsLoading: false,
      couponsError: '',
      couponsRequest: 0,
      couponDialogOpen: false,
      couponInput: '',
      couponError: '',
      couponNotice: '',
      applyingCoupon: false,
      calculatorOpen: false,
      addOnsOpen: false
    };
  },
  computed: {
    currency() {
      return this.catalog ? this.catalog.currency : 'INR';
    },
    currencySymbol() {
      const part = new Intl.NumberFormat(this.currency === 'INR' ? 'en-IN' : 'en-US', { style: 'currency', currency: this.currency })
        .formatToParts(0)
        .find(p => p.type === 'currency');
      return part ? part.value : '';
    },
    plans() {
      if (!this.catalog || !Array.isArray(this.catalog.plans)) return [];
      return [...this.catalog.plans].sort((a, b) => a.displayOrder - b.displayOrder);
    },
    selectedPlan() {
      return this.plans.find(plan => plan.code === this.selectedPlanCode) || null;
    },
    customEnabled() {
      return Boolean(this.catalog && this.catalog.custom && this.catalog.custom.enabled);
    },
    customMinMajor() {
      return this.catalog.custom.minMinor / 100;
    },
    customMaxMajor() {
      return this.catalog.custom.maxMinor / 100;
    },
    // The typed amount in minor units, or null when it isn't a whole number of major units
    customAmountMinor() {
      const text = String(this.customInput).trim();
      if (!/^\d+$/.test(text)) return null;
      return Number(text) * 100;
    },
    // "N% off" while typing: display only, the amounts come from the quote
    customHintBps() {
      if (this.selectedPlanCode !== 'custom' || this.customAmountMinor === null) return 0;
      const range = (this.catalog.custom.discountRanges || [])
        .find(r => this.customAmountMinor >= r.minMinor && this.customAmountMinor <= r.maxMinor);
      return range ? range.discountBps : 0;
    },
    // What the quote is for; coupons are re-fetched when it changes
    selection() {
      if (this.selectedPlanCode === 'custom') {
        return this.customAmountMinor === null || this.customError ? null : { customAmountMinor: this.customAmountMinor };
      }
      return this.selectedPlanCode ? { planCode: this.selectedPlanCode } : null;
    },
    selectionKey() {
      return JSON.stringify(this.selection);
    },
    addOns() {
      return (this.catalog && this.catalog.addOns) || [];
    },
    addOnsFree() {
      return this.addOns.every(addOn => !addOn.priceMinor);
    },
    addOnsSummary() {
      return this.addOns.map(addOn => addOn.shortTitle).join(' · ');
    },
    couponsEnabled() {
      return Boolean(this.catalog && this.catalog.features && this.catalog.features.coupons);
    },
    payEnabled() {
      return Boolean(this.catalog && this.catalog.features && this.catalog.features.pay);
    },
    // Plan credits are server values from the catalog, so they show before the quote lands
    credits() {
      if (this.quote) return this.quote.credits;
      return this.selectedPlan ? this.selectedPlan.credits : null;
    },
    // India: GST is in the quote. Global: NONE, no tax anywhere. CALCULATED_AT_CHECKOUT is reserved (contract §1.4)
    taxIncluded() {
      return Boolean(this.catalog && this.catalog.taxMode === 'INCLUDED_IN_QUOTE');
    },
    taxAtCheckout() {
      const mode = this.quote && this.quote.tax ? this.quote.tax.mode : this.catalog && this.catalog.taxMode;
      return mode === 'CALCULATED_AT_CHECKOUT';
    },
    taxLines() {
      if (!this.quote || !this.quote.tax || this.quote.tax.mode !== 'INCLUDED_IN_QUOTE') return [];
      return this.quote.tax.lines || [];
    },
    canPay() {
      return this.payEnabled && Boolean(this.quote) && !this.quoteLoading;
    }
  },
  watch: {
    customInput() {
      if (this.selectedPlanCode !== 'custom') return;
      this.dropCouponForNewAmount();
      this.validateCustom();
      this.scheduleQuote();
    },
    selectionKey() {
      // Offers carry previewDiscountMinor for the selection, so refresh them when it changes
      if (this.couponDialogOpen) this.loadCoupons();
    }
  },
  beforeDestroy() {
    clearTimeout(this.quoteTimer);
  },
  methods: {
    // Prices load on every open, so a newly published price book shows straight away
    async open() {
      clearTimeout(this.quoteTimer);
      Object.assign(this, {
        blocker: null,
        selectedPlanCode: null,
        customInput: '',
        customError: '',
        couponCode: null,
        quote: null,
        quoteError: '',
        coupons: [],
        couponDialogOpen: false,
        couponNotice: '',
        addOnsOpen: false,
        catalogReloaded: false
      });
      await this.loadCatalog();
    },
    async loadCatalog() {
      this.catalogLoading = true;
      this.blocker = null;
      try {
        this.catalog = await getCatalog();
        if (!this.appId) {
          this.blocker = { message: 'Select an ID Service app to top up.' };
          return;
        }
        const plans = this.plans;
        // Default to the second plan, as in the agreed design
        this.selectedPlanCode = (plans[1] || plans[0] || {}).code || null;
        this.requestQuote();
        if (this.couponsEnabled) this.loadCoupons();
      } catch (error) {
        this.catalog = null;
        this.blocker = blockerFor(error) || {
          message: error.status === 429 ? 'Please try again in a moment.' : 'We couldn\'t load prices.',
          action: 'retry'
        };
      } finally {
        this.catalogLoading = false;
      }
    },
    async loadCoupons() {
      const request = ++this.couponsRequest;
      this.couponsLoading = true;
      this.couponsError = '';
      try {
        const coupons = await getCoupons({ appId: this.appId, ...(this.selection || {}) });
        if (request === this.couponsRequest) this.coupons = coupons;
      } catch (error) {
        if (request !== this.couponsRequest) return;
        const blocker = blockerFor(error);
        if (blocker) {
          this.blocker = blocker;
          return;
        }
        this.coupons = [];
        this.couponsError = error.status === 429 ? 'Please try again in a moment.' : 'We couldn\'t load offers.';
      } finally {
        if (request === this.couponsRequest) this.couponsLoading = false;
      }
    },
    selectPlan(code) {
      if (code === this.selectedPlanCode) return;
      this.dropCouponForNewAmount();
      this.selectedPlanCode = code;
      this.customInput = '';
      this.customError = '';
      this.requestQuote();
    },
    selectCustom() {
      this.dropCouponForNewAmount();
      this.selectedPlanCode = 'custom';
      this.quote = null;
      this.quoteError = '';
      this.$nextTick(() => this.$refs.customInput && this.$refs.customInput.focus());
    },
    // Checks the input only; the range and any discount are the server's
    validateCustom() {
      this.customErrorSales = false;
      const text = String(this.customInput).trim();
      if (!text) {
        this.customError = '';
        return;
      }
      if (this.customAmountMinor === null) {
        this.customError = 'Enter a whole amount, without decimals.';
        return;
      }
      const { minMinor, maxMinor } = this.catalog.custom;
      if (this.customAmountMinor < minMinor || this.customAmountMinor > maxMinor) {
        this.setRangeError({ minMinor, maxMinor });
        return;
      }
      this.customError = '';
    },
    setRangeError({ minMinor, maxMinor }) {
      this.customError = `Enter an amount between ${this.formatMoney(minMinor)} and ${this.formatMoney(maxMinor)}. For larger amounts,`;
      this.customErrorSales = true;
    },
    scheduleQuote() {
      clearTimeout(this.quoteTimer);
      if (!this.selection) {
        // Nothing valid to price: drop the old numbers rather than show them for another amount
        this.quoteRequest++;
        this.quote = null;
        this.quoteLoading = false;
        return;
      }
      this.quoteLoading = true;
      this.quoteTimer = setTimeout(() => this.requestQuote(), QUOTE_DEBOUNCE_MS);
    },
    // Prices the current selection. Resolves once the newest quote (or its error) is in.
    async requestQuote() {
      clearTimeout(this.quoteTimer);
      if (!this.selection || !this.appId) return;
      const request = ++this.quoteRequest;
      this.quoteLoading = true;
      this.quoteError = '';
      const body = { appId: this.appId, ...this.selection };
      if (this.couponCode) body.couponCode = this.couponCode;
      try {
        const quote = await createQuote(body);
        if (request !== this.quoteRequest) return;
        this.quote = quote;
        this.quoteLoading = false;
      } catch (error) {
        if (request !== this.quoteRequest) return;
        await this.handleQuoteError(error);
      }
    },
    async handleQuoteError(error) {
      // A rejected code, or too many rejected codes (this 429 carries a code): price again without it
      const couponMessage = error.code === 'COUPON_INVALID' ? COUPON_INVALID_MESSAGE
        : error.code === 'RATE_LIMITED' && this.couponCode ? COUPON_RATE_LIMITED_MESSAGE : '';
      if (couponMessage) {
        this.couponCode = null;
        this.couponError = couponMessage;
        this.couponNotice = this.couponDialogOpen ? '' : couponMessage;
        return this.requestQuote();
      }
      this.quoteLoading = false;
      this.quote = null;
      if (error.code === 'AMOUNT_OUT_OF_RANGE') {
        this.setRangeError(error.details && error.details.minMinor ? error.details : this.catalog.custom);
        return;
      }
      if (error.code === 'PLAN_NOT_FOUND' && !this.catalogReloaded) {
        // The price book changed under the popup: load it again once
        this.catalogReloaded = true;
        return this.loadCatalog();
      }
      const blocker = blockerFor(error);
      if (blocker) {
        this.blocker = blocker;
        return;
      }
      this.quoteError = error.status === 429 ? 'Please try again in a moment.' : 'We couldn\'t price this top-up.';
    },
    openCouponDialog() {
      this.couponInput = '';
      this.couponError = '';
      this.couponNotice = '';
      this.couponDialogOpen = true;
      this.loadCoupons();
    },
    focusCouponInput() {
      if (this.$refs.couponInput) this.$refs.couponInput.focus();
    },
    // Applying a code means asking for a new quote with it (contract §3.2)
    async applyCoupon(input) {
      const code = String(input || '').trim().toUpperCase();
      if (!code || this.applyingCoupon || !this.selection) return;
      this.applyingCoupon = true;
      this.couponError = '';
      this.couponCode = code;
      try {
        await this.requestQuote();
        if (this.couponCode === code && this.quote && this.quote.coupon) {
          this.couponInput = '';
          this.couponDialogOpen = false;
        }
      } finally {
        this.applyingCoupon = false;
      }
    },
    // Saving can turn the single GST line into CGST + SGST or IGST, so price again
    onBillingSaved() {
      this.billingFormOpen = false;
      this.requestQuote();
    },
    // A coupon is applied to one amount: changing the plan or custom amount removes it,
    // and the customer applies it again if they want it
    dropCouponForNewAmount() {
      this.couponNotice = '';
      if (!this.couponCode) return;
      this.couponCode = null;
    },
    removeCoupon() {
      this.couponCode = null;
      this.couponNotice = '';
      this.requestQuote();
    },
    checkout() {
      if (!this.canPay) return;
      this.$emit('checkout', { quoteId: this.quote.quoteId });
    },
    taxLabel(line) {
      return `${TAX_LABELS[line.type] || line.type} (${this.formatPercent(line.rateBps)})`;
    },
    formatMoney(amountMinor) {
      return formatMinor(amountMinor, this.currency);
    },
    formatPercent(bps) {
      return formatBps(bps, this.currency);
    },
    formatCount(value) {
      return formatCount(value, this.currency);
    }
  }
};
</script>

<style>
/* Modal chrome: same light header/body treatment as the manual review modal */
.credit-topup-modal .modal-dialog { max-width: 920px; }
.credit-topup-modal.credit-coupon-modal .modal-dialog { max-width: 460px; }
.credit-topup-modal.credit-billing-modal .modal-dialog { max-width: 720px; }

.credit-topup-modal .modal-content {
  overflow: hidden;
  border: 1px solid #dbe3ef;
  border-radius: 14px;
  box-shadow: 0 24px 60px -12px rgba(23, 37, 84, .22);
  font-size: 13px;
}

.credit-topup-modal .modal-header {
  padding: 16px 20px;
  border-bottom: 1px solid #edf1f6;
  background: #fff;
}

.credit-topup-modal .modal-body {
  padding: 20px;
  background: #f8fafc;
}
</style>

<style scoped>
/* Header */
.topup-header { display: flex; align-items: center; gap: 12px; width: 100%; }

.topup-header-icon {
  display: inline-flex;
  flex: 0 0 36px;
  width: 36px;
  height: 36px;
  align-items: center;
  justify-content: center;
  border: 1px solid #dbe7fb;
  border-radius: 10px;
  background: linear-gradient(135deg, #f1f6ff, #e6efff);
}

.topup-header-icon .v-icon { color: #2563dc; }

.topup-header-text { flex: 1 1 auto; min-width: 0; }
.topup-header-text h2 { margin: 0; color: #172554; font-size: 16px; font-weight: 700; letter-spacing: -0.01em; }
.topup-header-text p { margin: 2px 0 0; color: #8793a5; font-size: 12px; }

.topup-close {
  display: inline-flex;
  width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  color: #8793a5;
}

.topup-close:hover { background: #f1f5f9; }
.topup-close .v-icon { color: inherit; }

/* Layout */
.topup-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.6fr) minmax(260px, 1fr);
  gap: 16px;
  color: #273448;
}

.topup-main { display: flex; min-width: 0; flex-direction: column; gap: 16px; }

.topup-card {
  padding: 16px 18px;
  border: 1px solid #e1e6ed;
  border-radius: 10px;
  background: #fff;
}

.topup-card-header { margin-bottom: 14px; }
.topup-card-header h3 { margin: 0 0 2px; color: #263244; font-size: 14px; font-weight: 700; }
.topup-card-header p { margin: 0; color: #8793a5; font-size: 11px; }

/* Plans */
.plan-grid { display: grid; grid-template-columns: repeat(var(--plan-count, 4), minmax(0, 1fr)); gap: 8px; }

.plan-option {
  position: relative;
  display: flex;
  min-height: 72px;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  gap: 6px;
  padding: 10px 12px;
  border: 1px solid #d5dde7;
  border-radius: 8px;
  background: #fff;
  text-align: left;
  transition: border-color .15s ease, background-color .15s ease, box-shadow .15s ease;
}

.plan-option:hover { border-color: #a9b8cc; }

.plan-option.selected {
  border-color: #2f6fec;
  background: #f7faff;
  box-shadow: 0 0 0 3px rgba(47, 111, 236, .12);
}

.plan-amount {
  color: #172554;
  font-size: 14px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.01em;
}

.plan-save {
  padding: 1px 7px;
  border-radius: 10px;
  background: #f1f5f9;
  color: #64748b;
  font-size: 10px;
  font-weight: 700;
  white-space: nowrap;
}

.plan-option.selected .plan-save { background: #e6efff; color: #2563dc; }

.plan-check {
  position: absolute;
  top: 8px;
  right: 8px;
  display: none;
  width: 16px;
  height: 16px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #2563dc;
}

.plan-check .v-icon { color: #fff; font-size: 11px !important; }
.plan-option.selected .plan-check { display: inline-flex; }

/* Custom amount: hidden behind a toggle until asked for */
.custom-toggle {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-top: 12px;
  padding: 5px 10px;
  border: 1px dashed #c3cedc;
  border-radius: 6px;
  color: #52627a;
  font-size: 12px;
  font-weight: 600;
  transition: border-color .15s ease, color .15s ease, background-color .15s ease;
}

.custom-toggle:hover { border-color: #2f6fec; background: #f7faff; color: #2563dc; }
.custom-toggle .v-icon { color: inherit; }

.custom-field { margin-top: 14px; }
.custom-field label { display: block; margin-bottom: 6px; color: #475467; font-size: 12px; font-weight: 600; }

.custom-control {
  display: flex;
  height: 38px;
  align-items: center;
  gap: 6px;
  padding: 0 11px;
  border: 1px solid #d5dde7;
  border-radius: 6px;
  background: #fff;
  transition: border-color .15s ease, box-shadow .15s ease;
}

.custom-field .custom-control { border-color: #2f6fec; box-shadow: 0 0 0 2px rgba(47, 111, 236, .12); }
.custom-field.invalid .custom-control { border-color: #f04438; box-shadow: none; }

.currency-symbol { color: #8793a5; font-weight: 600; }

.custom-control input {
  flex: 1 1 auto;
  min-width: 0;
  border: 0;
  outline: none;
  background: transparent;
  color: #27364a;
  font-size: 13px;
  font-variant-numeric: tabular-nums;
}

.custom-field small { display: block; margin-top: 4px; color: #8793a5; font-size: 11px; }
.field-error { display: block; margin-top: 4px; color: #b42318 !important; font-size: 11px; }


.custom-hint {
  flex: 0 0 auto;
  padding: 1px 7px;
  border-radius: 10px;
  background: #e6efff;
  color: #2563dc;
  font-size: 10px;
  font-weight: 700;
}

.field-error a { color: inherit; font-weight: 600; text-decoration: underline; }

/* Plan card details: total before tax and credits, as the catalog returns them */
.plan-meta { display: flex; flex-direction: column; align-items: flex-start; gap: 1px; color: #718198; font-size: 10px; font-variant-numeric: tabular-nums; }
.plan-meta span:first-child { color: #344054; font-weight: 600; }

.sales-note {
  margin: 14px 0 0;
  padding-top: 12px;
  border-top: 1px solid #eef2f6;
  color: #8793a5;
  font-size: 12px;
}

.sales-note a { color: #2563dc; font-weight: 600; text-decoration: none; }
.sales-note a:hover { text-decoration: underline; }
.sales-note .v-icon { color: inherit; }

/* Add-ons: collapsed to one summary row by default */
.addons-card { padding-top: 12px; padding-bottom: 12px; }

.addons-toggle {
  display: flex;
  width: 100%;
  align-items: center;
  gap: 10px;
  padding: 0;
  text-align: left;
}

.addons-heading { display: flex; flex: 1 1 auto; min-width: 0; flex-direction: column; }
.addons-title { color: #263244; font-size: 14px; font-weight: 700; }
.addons-summary { overflow: hidden; margin-top: 2px; color: #8793a5; font-size: 11px; text-overflow: ellipsis; white-space: nowrap; }
.addons-toggle:focus-visible { border-radius: 6px; outline: 3px solid rgba(47, 111, 236, .2); outline-offset: 4px; }

.addons-chevron { color: #8793a5 !important; transition: transform .2s ease; }
.addons-card.open .addons-chevron { transform: rotate(180deg); }

.addon-list { margin: 12px 0 0; padding: 12px 0 0; border-top: 1px solid #eef2f6; list-style: none; }

.addon-item {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 10px;
  align-items: center;
  padding: 9px 0;
  border-top: 1px solid #eef2f6;
}

.addon-item:first-child { padding-top: 0; border-top: 0; }

.addon-icon {
  display: inline-flex;
  width: 28px;
  height: 28px;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: #f1f6ff;
}

.addon-icon .v-icon { color: #2563dc; font-size: 15px !important; }

.addon-copy { display: flex; min-width: 0; flex-direction: column; }
.addon-copy strong { color: #344054; font-size: 13px; font-weight: 600; }
.addon-copy small { color: #8793a5; font-size: 11px; }

.addon-tag {
  padding: 2px 8px;
  border-radius: 10px;
  background: #f1f5f9;
  color: #64748b;
  font-size: 10px;
  font-weight: 700;
}

/* Summary */
.topup-summary {
  position: sticky;
  top: 0;
  display: flex;
  align-self: start;
  flex-direction: column;
  padding: 16px 18px;
  border: 1px solid #e1e6ed;
  border-radius: 10px;
  background: #fff;
}

.credits-highlight {
  padding: 14px;
  border: 1px solid #dbe7fb;
  border-radius: 8px;
  background: linear-gradient(135deg, #f5f9ff 0%, #eaf1ff 100%);
}

.eyebrow {
  display: block;
  color: #718198;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.credits-value { display: flex; align-items: baseline; gap: 6px; margin-top: 4px; }

.credits-value strong {
  color: #2563dc;
  font-size: 28px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.02em;
  line-height: 1.1;
}

.credits-value small { color: #718198; font-size: 12px; font-weight: 600; }

.summary-lines { margin: 14px 0 0; }

.summary-line {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 4px 0;
  font-size: 12px;
}

.summary-line dt { display: flex; align-items: center; color: #718198; font-weight: 500; }
.summary-line dd { margin: 0; color: #263244; font-weight: 600; font-variant-numeric: tabular-nums; white-space: nowrap; }
.summary-line.saving dd,
.summary-line dd.saving-text { color: #2563dc; }

.coupon-chip {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 1px 3px 1px 7px;
  border: 1px dashed #b9cdf5;
  border-radius: 6px;
  background: #f7faff;
  color: #2563dc;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.coupon-chip .v-icon { color: inherit; }

.coupon-area { margin-top: 6px; }

.coupon-toggle {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 0;
  color: #2563dc;
  font-size: 12px;
  font-weight: 600;
}

.coupon-toggle:hover { text-decoration: underline; }
.coupon-toggle .v-icon { color: inherit; }
.coupon-count { color: #8793a5; font-weight: 500; }

/* Coupon dialog */
.coupon-form label { display: block; margin-bottom: 6px; color: #475467; font-size: 12px; font-weight: 600; }
.coupon-form-row { display: flex; gap: 8px; }

.coupon-form input {
  flex: 1 1 auto;
  min-width: 0;
  height: 38px;
  padding: 0 11px;
  border: 1px solid #d5dde7;
  border-radius: 6px;
  background: #fff;
  color: #27364a;
  font-size: 13px;
  letter-spacing: 0.03em;
  outline: none;
  text-transform: uppercase;
}

.coupon-form input::placeholder { letter-spacing: normal; text-transform: none; }
.coupon-form input:focus { border-color: #2f6fec; box-shadow: 0 0 0 2px rgba(47, 111, 236, .12); }
.coupon-form input.invalid { border-color: #f04438; box-shadow: none; }

.coupon-form button,
.coupon-apply {
  height: 38px;
  padding: 0 14px;
  border: 1px solid #6c757d;
  border-radius: 8px;
  background: #6c757d;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
}

.coupon-form button:hover:not(:disabled),
.coupon-apply:hover:not(:disabled) { border-color: #545b62; background: #5a6268; }
.coupon-form button:disabled,
.coupon-apply:disabled { cursor: not-allowed; opacity: .55; }
.coupon-form input:disabled { background: #f8fafc; cursor: not-allowed; }
.coupon-hint { display: block; margin-top: 6px; color: #8793a5; font-size: 11px; }

.coupon-divider {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 18px 0 12px;
  color: #8793a5;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.coupon-divider::before,
.coupon-divider::after { flex: 1; height: 1px; background: #e8edf3; content: ''; }

.coupon-list { display: flex; flex-direction: column; gap: 8px; margin: 0; padding: 0; list-style: none; }

.coupon-offer {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border: 1px solid #e1e6ed;
  border-radius: 10px;
  background: #fff;
}

.coupon-offer-main { display: flex; flex: 1 1 auto; min-width: 0; flex-direction: column; gap: 2px; }
.coupon-offer-top { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }

.coupon-code {
  padding: 2px 8px;
  border: 1px dashed #b9cdf5;
  border-radius: 6px;
  background: #f7faff;
  color: #2563dc;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.coupon-percent { color: #172554; font-size: 12px; font-weight: 700; }
.coupon-offer-main strong { color: #344054; font-size: 13px; font-weight: 600; }
.coupon-offer-main small { color: #8793a5; font-size: 11px; line-height: 1.45; }
.coupon-offer-main small.coupon-saving { color: #2563dc; font-weight: 600; }

.coupon-apply { flex: 0 0 auto; height: 32px; padding: 0 12px; font-size: 12px; }

/* "Understand your credits": deliberately quiet */
.credits-help {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  margin-top: 6px;
  padding: 0;
  color: #718198;
  font-size: 11px;
}

.credits-help:hover:not(:disabled) { color: #2563dc; text-decoration: underline; }
.credits-help:disabled { cursor: default; opacity: .5; }
.credits-help .v-icon { color: inherit; }

.total-line {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #eef2f6;
}

.total-line span { color: #344054; font-size: 13px; font-weight: 600; }

.total-line strong {
  color: #172554;
  font-size: 20px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.01em;
}

.savings-note { margin: 2px 0 0; color: #2563dc; font-size: 11px; font-weight: 600; text-align: right; }

/* Same filled action as the dashboard's other primary buttons */
.pay-button {
  display: flex;
  min-height: 42px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  margin-top: 14px;
  padding: 0 16px;
  border: 1px solid #6c757d;
  border-radius: 8px;
  background: #6c757d;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  transition: background-color .15s ease, border-color .15s ease;
}

.pay-button .v-icon { color: #fff; }
.pay-button .pay-arrow { transition: transform .15s ease; }
.pay-button:hover:not(:disabled) { border-color: #545b62; background: #5a6268; }
.pay-button:hover:not(:disabled) .pay-arrow { transform: translateX(3px); }
.pay-button:focus-visible { outline: 3px solid rgba(108, 117, 125, .3); outline-offset: 2px; }
.pay-button:disabled { cursor: not-allowed; opacity: .55; }

/* Wrapper so the "coming soon" tooltip shows on the disabled button */
.pay-button-wrap { display: block; }
.pay-soon { margin: 6px 0 0; color: #718198; font-size: 11px; font-weight: 600; text-align: center; }

.tax-note { margin: 10px 0 0; color: #8793a5; font-size: 11px; line-height: 1.45; text-align: center; }

.addon-price { margin-left: auto; color: #2563dc; font-size: 11px; font-weight: 600; white-space: nowrap; }

/* Summary while a new quote is on its way */
.topup-summary.pending .summary-lines,
.topup-summary.pending .total-line { opacity: .55; transition: opacity .15s ease; }

.quote-error { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 12px; color: #b42318; font-size: 12px; }
.coupon-area .field-error { margin-top: 2px; }
.plus-tax { color: #718198; font-size: 12px; font-weight: 600; }

.billing-link { margin: 10px 0 0; text-align: center; }
.billing-link button { display: inline-flex; align-items: center; gap: 4px; color: #2563dc; font-size: 11px; font-weight: 600; }
.billing-link button:hover { text-decoration: underline; }
.billing-link .v-icon { color: inherit; }

/* Loading and error states, in the popup and the coupon dialog */
.topup-state {
  display: flex;
  min-height: 160px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #718198;
  font-size: 13px;
}

.topup-state.compact { min-height: 0; margin-top: 18px; justify-content: flex-start; font-size: 12px; }
.topup-state .v-icon { color: inherit; }

.topup-retry { color: #2563dc; font-weight: 600; }
.topup-retry:hover { text-decoration: underline; }

@media (max-width: 767.98px) {
  .topup-layout { grid-template-columns: 1fr; }
  .plan-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .topup-summary { position: static; }
}
</style>
