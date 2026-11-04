// Client for the billing APIs in the dashboard service (docs/adr/api-contract.md).
// Separate from RequestHandler because billing callers branch on the error `code` and
// `details`, which RequestHandler drops when it turns a failure into a plain Error.
import config from '../config';
import EventBus from '../eventbus';
import { sanitizeUrl } from './common';

const baseUrl = sanitizeUrl(config.apiServer.host) + config.apiServer.basePath;

// A failed billing call. `code` is the machine-readable billing code (contract §1.5).
// 401, 403 and 429 come from the shared guards and carry no code: branch on `status` for those.
export class BillingError extends Error {
  constructor({ status, code, messages, details }) {
    super(messages[0] || `Request failed with status ${status}`);
    this.name = 'BillingError';
    this.status = status;
    this.code = code || null;
    this.messages = messages;
    this.details = details || {};
  }
}

function toMessages(json) {
  if (Array.isArray(json?.message)) return json.message;
  if (typeof json?.message === 'string') return [json.message];
  return [];
}

function toQuery(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') query.append(key, value);
  });
  const text = query.toString();
  return text ? `?${text}` : '';
}

let refreshing = null;

// Same token refresh as RequestHandler: one refresh shared by concurrent calls, then log out
function refreshSession() {
  if (!refreshing) {
    refreshing = fetch(`${config.studioServer.BASE_URL}api/v1/auth/tokens/refresh`, { method: 'POST', credentials: 'include' })
      .then(res => res.ok)
      .catch(() => false)
      .finally(() => { refreshing = null; });
  }
  return refreshing;
}

// The session is in the accessToken cookie, so no Authorization header is sent (contract §1.1)
async function request(path, { method = 'GET', query, body, headers = {}, retry = true } = {}) {
  const options = { method, credentials: 'include', headers: { ...headers } };
  if (body !== undefined) {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${baseUrl}${path}${toQuery(query)}`, options);
  const json = await response.json().catch(() => null);

  if (response.ok) return json;

  // As in RequestHandler, 401 and 403 first try a refresh; a 403 that survives it is a missing permission
  if ((response.status === 401 || response.status === 403) && retry) {
    if (await refreshSession()) return request(path, { method, query, body, headers, retry: false });
    EventBus.$emit('logoutAll');
  }

  throw new BillingError({
    status: response.status,
    code: json?.code,
    messages: toMessages(json),
    details: json?.details
  });
}

// GET /billing/catalog: the published price book for the caller's region (contract §3.1)
export function getCatalog() {
  return request('/billing/catalog');
}

// GET /billing/coupons: listed coupons the account can use now (contract §3.2).
// Pass planCode or customAmountMinor to get previewDiscountMinor for that selection.
export async function getCoupons({ appId, planCode, customAmountMinor } = {}) {
  const json = await request('/billing/coupons', { query: { appId, planCode, customAmountMinor } });
  return Array.isArray(json?.coupons) ? json.coupons : [];
}

// POST /billing/quotes: prices a selection (contract §3.3).
// body: { appId, planCode | customAmountMinor, couponCode? }
export function createQuote(body) {
  return request('/billing/quotes', { method: 'POST', body });
}

// ---- Checkout (contract §6). Amounts are never sent: the server prices the quote.

// POST /billing/orders: Pay. One key per Pay click; reuse it only to retry that click.
export function createOrder(quoteId, idempotencyKey) {
  return request('/billing/orders', { method: 'POST', body: { quoteId }, headers: { 'Idempotency-Key': idempotencyKey } });
}

// GET /billing/orders/:orderId: the order's status (the server re-checks Razorpay while it's open)
export function getOrder(orderId) {
  return request(`/billing/orders/${encodeURIComponent(orderId)}`);
}

// POST /billing/orders/:orderId/confirm: Razorpay's handler values, renamed
export function confirmOrder(orderId, { providerOrderId, paymentId, signature }) {
  return request(`/billing/orders/${encodeURIComponent(orderId)}/confirm`, {
    method: 'POST',
    body: { providerOrderId, paymentId, signature }
  });
}

// POST /billing/orders/:orderId/cancel: gives up on an unpaid order and frees its coupon
export function cancelOrder(orderId) {
  return request(`/billing/orders/${encodeURIComponent(orderId)}/cancel`, { method: 'POST' });
}

// GET /customer-onboarding/billing: the organisation's billing profile, prefilled if never saved (contract §2)
export function getBillingProfile() {
  return request('/customer-onboarding/billing');
}

// PUT /customer-onboarding/billing: saves the profile. Region and currency are never sent.
export function saveBillingProfile(body) {
  return request('/customer-onboarding/billing', { method: 'PUT', body });
}

// GET /billing/invoices: every InvoiceSummary of the organisation for one app, newest first.
// Pages through the list (the server returns at most 100 per page).
export async function getAllInvoices({ appId, status } = {}) {
  const limit = 100;
  const invoices = [];
  for (let page = 1; page <= 50; page++) {
    const json = await request('/billing/invoices', { query: { appId, status, page, limit } });
    const data = Array.isArray(json?.data) ? json.data : [];
    invoices.push(...data);
    if (!data.length || invoices.length >= (Number(json?.total) || 0)) break;
  }
  return invoices;
}

// GET /billing/invoices/:invoiceId: the customer's InvoiceDocument, for Download (contract §4)
export function getInvoice(invoiceId) {
  return request(`/billing/invoices/${encodeURIComponent(invoiceId)}`);
}

// ---- Super admin (contract §5). Same cookie session; the server checks for a super admin.

// GET /admin/billing/profiles?appId: { app, org, profile } for the Billed to card
export function getAdminBillingProfile(appId) {
  return request('/admin/billing/profiles', { query: { appId } });
}

// PATCH /admin/billing/profiles/:orgId: the full profile plus region, unlock and reason
export function updateAdminBillingProfile(orgId, body) {
  return request(`/admin/billing/profiles/${encodeURIComponent(orgId)}`, { method: 'PATCH', body });
}

// POST /admin/billing/invoices/preview: the summary panel's totals. Creates nothing.
export function previewAdminInvoice(body) {
  return request('/admin/billing/invoices/preview', { method: 'POST', body });
}

// POST /admin/billing/invoices. Reuse the same key to retry the same attempt (contract §1.2).
export function createAdminInvoice(body, idempotencyKey) {
  return request('/admin/billing/invoices', { method: 'POST', body, headers: { 'Idempotency-Key': idempotencyKey } });
}

// GET /admin/billing/invoices/:invoiceId: InvoiceDocument plus org, for Download
export function getAdminInvoice(invoiceId) {
  return request(`/admin/billing/invoices/${encodeURIComponent(invoiceId)}`);
}

// ---- Payment links (contract §7). Created by POST /admin/billing/invoices with isPaid: false.

// GET /admin/billing/payment-links: a page of PaymentLink, newest first
export function listAdminPaymentLinks({ appId, orgId, status, page = 1, limit = 10 } = {}) {
  return request('/admin/billing/payment-links', { query: { appId, orgId, status, page, limit } });
}

// GET /admin/billing/payment-links/:orderId: the server asks Razorpay first while the link is open
export function getAdminPaymentLink(orderId) {
  return request(`/admin/billing/payment-links/${encodeURIComponent(orderId)}`);
}

// POST /admin/billing/payment-links/:orderId/resend: Razorpay emails the link again
export function resendAdminPaymentLink(orderId) {
  return request(`/admin/billing/payment-links/${encodeURIComponent(orderId)}/resend`, { method: 'POST' });
}

// POST /admin/billing/payment-links/:orderId/cancel: Void. The link can't be paid any more.
export function cancelAdminPaymentLink(orderId, reason) {
  return request(`/admin/billing/payment-links/${encodeURIComponent(orderId)}/cancel`, { method: 'POST', body: { reason } });
}

// ---- Free-credit promotion: once per organisation and service. The server decides eligibility.

// GET /billing/promotion?appId: { eligible, claimed, reason, missingFields, offer, invoiced, claim }
export function getPromotion(appId) {
  return request('/billing/promotion', { query: { appId } });
}

// POST /billing/promotion/claim: only appId; the server sets the credits and validity
export function claimPromotion(appId) {
  return request('/billing/promotion/claim', { method: 'POST', body: { appId } });
}

// GET /billing/payment-links: the customer's open, unexpired links (contract §7.6)
export async function getPaymentLinks({ appId } = {}) {
  const json = await request('/billing/payment-links', { query: { appId } });
  return Array.isArray(json?.data) ? json.data : [];
}
