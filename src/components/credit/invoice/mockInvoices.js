// UI sign-off only: dummy invoices attached to the credit packages pulled from
// GET /app/:appId/credits, until GET /billing/invoices exists (ADR §5.1).
// Each package gets one of the four invoice kinds the ADR describes, so every state can be reviewed.
import { REGIONS, getRegionPricing, discountPercentFor } from '../creditTopUpPricing';
import { formatPercentBps } from './invoiceDocument';

export const USE_MOCK_INVOICES = true;

// PLACEHOLDER: our legal entity, address and tax IDs, to be confirmed by Finance
const SUPPLIER = {
  legalName: 'Hypersign',
  address: ['Registered office address', 'Bengaluru, Karnataka 560001, India'],
  gstin: '29AAAAA0000A1Z5',
  pan: 'AAAAA0000A',
  stateCode: '29',
  email: 'billing@hypersign.id',
  supportEmail: 'billing@hypersign.id'
};

const CUSTOMERS = {
  [REGIONS.IN]: {
    legalName: 'Acme Fintech Pvt. Ltd.',
    address: ['4th Floor, Example Towers, Andheri East', 'Mumbai, Maharashtra 400069, India'],
    gstin: '27AAACA1234A1Z5',
    stateCode: '27',
    email: 'accounts@acme.example'
  },
  [REGIONS.GLOBAL]: {
    legalName: 'Acme Identity Inc.',
    address: ['100 Example Street, Suite 200', 'San Francisco, CA 94105, United States'],
    email: 'accounts@acme.example'
  }
};

const KINDS = ['SELF_SERVE', 'ADMIN_OFFLINE', 'COMPLIMENTARY', 'ADMIN_UNPAID'];
const SAC = '998314';
const GST_BPS = 1800;

const percentOf = (amountMinor, bps) => Math.round(amountMinor * bps / 10000);

function financialYear(date) {
  const d = new Date(date);
  const start = d.getMonth() >= 3 ? d.getFullYear() : d.getFullYear() - 1;
  return `${start}-${String((start + 1) % 100).padStart(2, '0')}`;
}

function invoiceNumberFor(region, date, sequence) {
  const seq = String(sequence).padStart(6, '0');
  return region === REGIONS.IN
    ? `HS/IN/${financialYear(date)}/${seq}`
    : `HS/GL/${new Date(date).getFullYear()}/${seq}`;
}

function taxLines(region, customer, taxableMinor) {
  if (!taxableMinor) return [];
  if (region !== REGIONS.IN) {
    // PLACEHOLDER: Global tax treatment is open question 3 (Stripe Tax vs zero-rated export)
    return [{ type: 'ZERO_RATED_EXPORT', label: 'IGST 0% (export of services)', rateBps: 0, amountMinor: 0 }];
  }
  if (customer.stateCode === SUPPLIER.stateCode) {
    const half = percentOf(taxableMinor, GST_BPS / 2);
    return [
      { type: 'CGST', label: 'CGST 9%', rateBps: 900, amountMinor: half },
      { type: 'SGST', label: 'SGST 9%', rateBps: 900, amountMinor: half }
    ];
  }
  return [{ type: 'IGST', label: 'IGST 18%', rateBps: GST_BPS, amountMinor: percentOf(taxableMinor, GST_BPS) }];
}

// Shared by the history-table mock and the super-admin preview. Amounts in minor units.
function buildInvoice({
  region, kind, sequence, issuedAt, credits, validityDays, appName, appId,
  subtotalMinor, discounts = [], couponCode = null, payment = null, recipients = null, idSeed
}) {
  const pricing = getRegionPricing(region);
  const customer = CUSTOMERS[region];
  const discountMinor = discounts.reduce((sum, d) => sum + d.amountMinor, 0);
  const taxableMinor = subtotalMinor - discountMinor;
  const tax = taxLines(region, customer, taxableMinor);
  const taxMinor = tax.reduce((sum, t) => sum + t.amountMinor, 0);
  const totalMinor = taxableMinor + taxMinor;
  const isUnpaid = kind === 'ADMIN_UNPAID';
  const dueAt = new Date(new Date(issuedAt).getTime() + 15 * 86400000).toISOString();
  const shortId = String(idSeed || sequence).slice(-6);

  return {
    invoiceNumber: invoiceNumberFor(region, issuedAt, sequence),
    documentTitle: 'Tax Invoice',
    source: kind === 'SELF_SERVE' ? 'SELF_SERVE' : 'ADMIN',
    status: isUnpaid ? 'UNPAID' : 'PAID',
    settlement: { SELF_SERVE: 'GATEWAY', ADMIN_OFFLINE: 'OFFLINE', COMPLIMENTARY: 'COMPLIMENTARY', ADMIN_UNPAID: 'GATEWAY' }[kind],
    issuedAt,
    dueAt: isUnpaid ? dueAt : null,
    currency: pricing.currency,
    region,
    supplier: SUPPLIER,
    customer: recipients ? { ...customer, email: recipients[0] || customer.email } : customer,
    placeOfSupply: region === REGIONS.IN ? 'Maharashtra (27)' : null,
    orderNumber: kind === 'SELF_SERVE' ? `ORD-${new Date(issuedAt).getFullYear()}-${String(sequence).padStart(6, '0')}` : null,
    app: { name: appName, appId },
    credits,
    validityDays,
    couponCode,
    items: [
      {
        description: 'Prepaid verification credits',
        detail: `${new Intl.NumberFormat(pricing.locale).format(credits)} credits · valid ${validityDays} days from activation · App: ${appName}`,
        sac: SAC,
        quantity: 1,
        amountMinor: subtotalMinor
      },
      ...pricing.addOns.map(addOn => ({
        description: addOn.title,
        detail: addOn.id === 'validity' ? addOn.detail : null,
        included: true,
        amountMinor: 0,
        sac: SAC
      }))
    ],
    discounts,
    tax,
    totals: {
      subtotalMinor,
      discountMinor,
      taxableMinor,
      taxMinor,
      totalMinor,
      amountPaidMinor: isUnpaid ? 0 : totalMinor,
      balanceMinor: isUnpaid ? totalMinor : 0
    },
    payment: isUnpaid ? null : payment,
    paymentLink: isUnpaid
      ? {
        url: region === REGIONS.IN ? `https://rzp.io/i/demo-${shortId}` : `https://buy.stripe.com/demo-${shortId}`,
        expiresAt: dueAt,
        sentTo: recipients || [customer.email]
      }
      : null,
    notes: [
      `Credits are valid for ${validityDays} days from activation and cannot be carried forward.`,
      isUnpaid ? 'Credits on this invoice are activated once the payment is confirmed.' : null,
      region === REGIONS.IN ? 'Tax is payable on reverse charge: No.' : null
    ].filter(Boolean)
  };
}

/**
 * @param {object} credit   A credit package row from GET /app/:appId/credits
 * @param {number} index    Its position in the history table (picks the invoice kind)
 * @param {object} [context]  { region, appName, appId }
 */
export function mockInvoiceForCredit(credit, index, { region = REGIONS.IN, appName = 'My app', appId = '' } = {}) {
  const pricing = getRegionPricing(region);
  const kind = KINDS[index % KINDS.length];
  const issuedAt = credit.createdAt || new Date().toISOString();
  const credits = Number(credit.totalCredits) || 2499;
  const shortId = String(credit._id || index).slice(-6);

  // Self-serve: plan price before discounts = credits / rate. Admin: the amount the admin typed in.
  const listMinor = Math.round((credits / pricing.creditsPerUnit) * 100);
  const subtotalMinor = kind === 'COMPLIMENTARY' ? 0 : listMinor;
  const discounts = [];
  let couponCode = null;

  if (kind === 'SELF_SERVE') {
    const planBps = Math.round(discountPercentFor(listMinor / 100, pricing.plans) * 100);
    const planMinor = percentOf(subtotalMinor, planBps);
    if (planMinor) discounts.push({ label: `Plan discount (${formatPercentBps(planBps)})`, amountMinor: planMinor });
    couponCode = region === REGIONS.IN ? 'FOUNDING8' : 'FOUNDING15';
    const couponBps = region === REGIONS.IN ? 800 : 1500;
    const couponMinor = percentOf(subtotalMinor - planMinor, couponBps);
    discounts.push({ label: `Coupon ${couponCode} (${formatPercentBps(couponBps)})`, amountMinor: couponMinor });
  }

  const payment = {
    SELF_SERVE: region === REGIONS.IN
      ? { provider: 'Razorpay', method: 'UPI', paymentId: `pay_DEMO${shortId}`, paidAt: issuedAt }
      : { provider: 'Stripe', method: 'Card', paymentId: `pi_DEMO${shortId}`, paidAt: issuedAt },
    ADMIN_OFFLINE: { method: 'Bank transfer', reference: `UTR HDFC0000${shortId}`, paidAt: issuedAt },
    COMPLIMENTARY: { method: 'Complimentary', paidAt: issuedAt }
  }[kind] || null;

  return buildInvoice({
    region, kind, sequence: 120 + index, issuedAt, credits,
    validityDays: region === REGIONS.IN ? 30 : 180,
    appName, appId, subtotalMinor, discounts, couponCode, payment, idSeed: credit._id || index
  });
}

// ---- Super admin: Create invoice (ADR §8.2)

// PLACEHOLDER until GET /admin/billing/profiles/:orgId exists: every app is billed to the
// Indian sample customer, except app IDs ending in "g", which are billed to the Global one.
export function mockBillingProfileForApp(appId) {
  const region = /g$/i.test(String(appId).trim()) ? REGIONS.GLOBAL : REGIONS.IN;
  const pricing = getRegionPricing(region);
  return { region, currency: pricing.currency, locale: pricing.locale, ...CUSTOMERS[region], label: pricing.label };
}

export function previewTax(region, amountMinor) {
  const lines = taxLines(region, CUSTOMERS[region], amountMinor);
  return { lines, taxMinor: lines.reduce((sum, t) => sum + t.amountMinor, 0) };
}

let adminSequence = 200;

/**
 * @param {object} input
 * @param {'COMPLIMENTARY'|'OFFLINE'|'UNPAID'} input.type
 * @param {string} input.appId
 * @param {number} input.credits
 * @param {number} input.validityDays
 * @param {number} input.amountMinor        excluding tax; ignored for COMPLIMENTARY
 * @param {object} [input.payment]          OFFLINE: { method, reference, paidAt }
 * @param {string[]} [input.recipients]     UNPAID: who gets the payment link
 */
export function mockAdminInvoice({ type, appId, credits, validityDays, amountMinor, payment, recipients }) {
  const { region } = mockBillingProfileForApp(appId);
  const issuedAt = new Date().toISOString();
  const kind = { COMPLIMENTARY: 'COMPLIMENTARY', OFFLINE: 'ADMIN_OFFLINE', UNPAID: 'ADMIN_UNPAID' }[type];
  adminSequence += 1;
  return buildInvoice({
    region, kind, sequence: adminSequence, issuedAt, credits, validityDays,
    appName: `App ${String(appId).slice(0, 8)}`, appId,
    subtotalMinor: type === 'COMPLIMENTARY' ? 0 : amountMinor,
    payment: type === 'COMPLIMENTARY' ? { method: 'Complimentary', paidAt: issuedAt } : payment,
    recipients,
    idSeed: appId
  });
}
