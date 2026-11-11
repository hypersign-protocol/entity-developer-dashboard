// Razorpay Checkout (contract §6.1). The script loads once, on demand. No Razorpay key lives in
// the dashboard: the public keyId comes with each order from POST /billing/orders.

const SCRIPT_URL = 'https://checkout.razorpay.com/v1/checkout.js';
const BRAND_COLOR = '#2563dc';

let loading = null;

export function loadRazorpay() {
  if (typeof window !== 'undefined' && window.Razorpay) return Promise.resolve(window.Razorpay);
  if (!loading) {
    loading = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = SCRIPT_URL;
      script.async = true;
      script.onload = () => (window.Razorpay ? resolve(window.Razorpay) : reject(new Error('Razorpay Checkout did not load')));
      script.onerror = () => reject(new Error('Razorpay Checkout did not load'));
      document.head.appendChild(script);
    }).catch(error => {
      // Allow a later attempt to load it again
      loading = null;
      throw error;
    });
  }
  return loading;
}

/**
 * Opens the Razorpay popup for an order whose checkout is set.
 * @param {object} order  Order from the orders API
 * @param {object} callbacks
 * @param {function} callbacks.onPaid      Razorpay's handler response ({ razorpay_order_id, … })
 * @param {function} callbacks.onDismiss   The customer closed the popup
 * @param {function} [callbacks.onFailed]  A failed attempt; Razorpay lets the customer retry inside
 */
export async function openRazorpayCheckout(order, { onPaid, onDismiss, onFailed }) {
  const Razorpay = await loadRazorpay();
  const c = order.checkout;
  const rzp = new Razorpay({
    key: c.keyId,
    order_id: c.providerOrderId,
    amount: c.amountMinor,
    currency: c.currency,
    name: c.name,
    description: c.description,
    // Name and email; Razorpay asks for the phone itself
    prefill: c.prefill,
    notes: { orderNumber: order.orderNumber },
    theme: { color: BRAND_COLOR },
    handler: response => onPaid(response),
    modal: { ondismiss: () => onDismiss(), confirm_close: true }
  });
  rzp.on('payment.failed', event => {
    if (onFailed) onFailed(event && event.error);
  });
  rzp.open();
  return rzp;
}
