// Turns the server's InvoiceDocument (contract §4) into a pdfmake document, choosing the
// template by its templateVersion. Shared by the super-admin recharge page and the customer's
// purchase history.
//
// Rules (contract §4):
// - every template version ever shipped stays here; an unknown version is refused, never
//   rendered with another template;
// - only what's in the document is printed: no amount is recomputed and no current company or
//   customer detail is looked up;
// - derived text (dates, amount in words, badge labels, notes) belongs to the template version.
import isoCountries from 'i18n-iso-countries';
import { COUNTRY_OPTIONS } from '../../../utils/countries';
import { buildInvoiceDocument as buildInvoiceV1, formatPercentBps } from './invoiceDocument';

export class UnknownInvoiceTemplateError extends Error {
  constructor(version) {
    super('Please refresh the dashboard to download this invoice');
    this.name = 'UnknownInvoiceTemplateError';
    this.templateVersion = version;
  }
}

// ---- invoice-v1

const V1_PAYMENT_METHODS = {
  BANK_TRANSFER: 'Bank transfer',
  UPI: 'UPI',
  CHEQUE: 'Cheque',
  CARD_OUTSIDE_DASHBOARD: 'Card (outside dashboard)',
  OTHER_SYSTEM: 'Other system',
  // Razorpay's methods, on self-serve invoices
  upi: 'UPI',
  card: 'Card',
  netbanking: 'Netbanking',
  wallet: 'Wallet',
  emi: 'EMI',
  paylater: 'Pay Later'
};

const V1_PROVIDERS = { razorpay: 'Razorpay', stripe: 'Stripe' };

const V1_TAX_LABELS = { ZERO_RATED_EXPORT: 'Export (zero-rated)', SALES_TAX: 'Sales tax' };

function v1CountryName(alpha2) {
  if (!alpha2) return '';
  const alpha3 = isoCountries.alpha2ToAlpha3(alpha2);
  return (alpha3 && COUNTRY_OPTIONS[alpha3]) || alpha2;
}

// { street, city, province, postalCode, country } → printed lines
function v1AddressLines(address) {
  if (!address) return [];
  const cityLine = [address.city, [address.province, address.postalCode].filter(Boolean).join(' ')]
    .filter(Boolean).join(', ');
  return [address.street, cityLine, v1CountryName(address.country)].filter(Boolean);
}

// invoice-v1's INR line for a USD invoice paid online. Its wording and format are part of
// invoice-v1: "INR equivalent: ₹10,035.57 (1 USD = ₹84.05, Razorpay rate on 5 Nov 2026)".
// A different line would be invoice-v2. null when the invoice has no fx (every invoice issued
// before Global payments, and INR invoices).
function v1FxLine(doc) {
  const fx = doc.fx;
  if (!fx) return null;
  const inr = (value, digits) => new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', minimumFractionDigits: 2, maximumFractionDigits: digits,
  }).format(Number(value) || 0);
  // The supplier is Indian: the rate date is the date in India, whoever opens the PDF
  const date = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' })
    .format(new Date(fx.rateDate));
  const provider = (doc.payment && V1_PROVIDERS[doc.payment.provider]) || 'Razorpay';
  return `INR equivalent: ${inr((fx.totalInrMinor || 0) / 100, 2)} (1 ${doc.currency} = ${inr(fx.inrPerUnit, 4)}, ${provider} rate on ${date})`;
}

function v1Discounts(discounts) {
  const rows = [];
  const plan = discounts && discounts.plan;
  const coupon = discounts && discounts.coupon;
  if (plan && plan.amountMinor) {
    rows.push({ label: plan.percentBps ? `Plan discount (${formatPercentBps(plan.percentBps)})` : 'Plan discount', amountMinor: plan.amountMinor });
  }
  if (coupon && coupon.amountMinor) {
    const percent = coupon.percentBps ? ` (${formatPercentBps(coupon.percentBps)})` : '';
    rows.push({ label: `Coupon${coupon.code ? ` ${coupon.code}` : ''}${percent}`, amountMinor: coupon.amountMinor });
  }
  return rows;
}

const V1_CREDITS_DESCRIPTION = 'Prepaid identity verification credits';

/** InvoiceDocument → the layout model of template invoice-v1. */
export function toInvoiceV1Model(doc) {
  const { supplier, customer, payment } = doc;
  const count = new Intl.NumberFormat(doc.currency === 'INR' ? 'en-IN' : 'en-US').format(doc.credits || 0);
  return {
    invoiceNumber: doc.invoiceNumber,
    documentTitle: 'Tax Invoice',
    status: doc.status,
    settlement: doc.settlement,
    issuedAt: doc.issuedAt,
    dueAt: doc.dueAt,
    currency: doc.currency,
    voidReason: doc.voidReason,
    supplier: {
      legalName: supplier.legalName,
      email: supplier.email,
      address: v1AddressLines(supplier.address),
      ids: [['GSTIN', supplier.gstin], ['CIN', supplier.cin], ['LUT ARN', supplier.lutArn]]
        .filter(([, value]) => value)
    },
    customer: {
      legalName: customer.legalName,
      email: customer.email,
      address: v1AddressLines(customer.address),
      ids: (customer.taxIds || []).map(taxId => [taxId.type, taxId.number])
    },
    orderNumber: doc.orderNumber,
    items: [
      ...(doc.lines || []).map(line => ({
        // Printed as the backend sends it; the constant only covers documents without one
        description: line.description || V1_CREDITS_DESCRIPTION,
        detail: line.detail || `${count} credits`,
        sac: line.sac,
        quantity: line.quantity,
        amountMinor: line.unitPriceMinor
      })),
      // Validity shows its period where the other add-ons say "Included"
      ...(doc.addOnLines || []).map(addOn => (addOn.code === 'VALIDITY'
        ? {
          description: addOn.title,
          detail: 'Counted from the day the credits are activated',
          included: true,
          value: `${doc.validityDays} days`
        }
        : { description: addOn.title, included: true }))
    ],
    discounts: v1Discounts(doc.discounts),
    tax: (doc.tax || []).map(line => ({
      label: `${V1_TAX_LABELS[line.type] || line.type} ${formatPercentBps(line.rateBps)}`,
      amountMinor: line.amountMinor
    })),
    totals: {
      subtotalMinor: doc.totals.subtotalMinor,
      discountMinor: doc.totals.discountMinor,
      taxableMinor: doc.totals.taxableMinor,
      taxMinor: doc.totals.taxMinor,
      totalMinor: doc.totals.totalMinor,
      amountPaidMinor: doc.totals.amountPaidMinor,
      balanceMinor: doc.totals.balanceDueMinor
    },
    payment: payment ? {
      method: V1_PAYMENT_METHODS[payment.method] || payment.method,
      reference: payment.reference,
      provider: V1_PROVIDERS[payment.provider] || payment.provider,
      // Gateway invoices carry the provider's payment id; the summary calls it reference
      paymentId: payment.paymentId || payment.reference,
      paidAt: payment.paidAt || doc.paidAt
    } : null,
    paymentLink: doc.payNowUrl ? { url: doc.payNowUrl } : null,
    fxLine: v1FxLine(doc),
    notes: [
      `Credits are valid for ${doc.validityDays} days from activation and cannot be carried forward.`,
      doc.status === 'UNPAID' ? 'Credits on this invoice are activated once the payment is confirmed.' : null,
      doc.taxNote
    ].filter(Boolean)
  };
}

const TEMPLATES = {
  'invoice-v1': (doc, options) => buildInvoiceV1(toInvoiceV1Model(doc), options)
};

/**
 * @param {object} doc  InvoiceDocument from GET /billing/invoices/:id or /admin/billing/invoices/:id
 * @param {object} [options]  { logo }: the Hypersign logo as a data URL
 * @throws {UnknownInvoiceTemplateError} when this dashboard build doesn't have the template
 */
export function buildInvoicePdfDefinition(doc, options = {}) {
  const template = TEMPLATES[doc && doc.templateVersion];
  if (!template) throw new UnknownInvoiceTemplateError(doc && doc.templateVersion);
  return template(doc, options);
}

// "HS/IN/2026-27/000123" → "HS-IN-2026-27-000123.pdf"
export function invoiceDocumentFileName(doc) {
  return `${String(doc.invoiceNumber).replace(/\//g, '-')}.pdf`;
}
