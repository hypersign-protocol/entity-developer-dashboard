// API transactions: every API call an app made (from the KYC service request log), for the
// API Transactions page. Three endpoints, all on the KYC service and needing READ_USAGE:
//
//   GET /api/v1/usage/transactions/summary?serviceId&from&to&env&interval=day|hour
//     -> { totals: { total, '2xx', '4xx', '5xx' },
//          series: [{ bucket: ISO date, '2xx', '4xx', '5xx' }],
//          endpoints: [{ method, route, product, total, '2xx', '4xx', '5xx', avgDurationMs }] }
//
//   GET /api/v1/usage/transactions?serviceId&from&to&env&status&route&product&search&cursor&limit
//     status: '2xx' | '4xx' | '5xx' or an exact code; search: exact requestId / refId / upstream txn id
//     -> { items: [Transaction], nextCursor: string | null }   (newest first)
//
//   GET /api/v1/usage/transactions/:id?serviceId
//     -> Transaction
//
// Transaction = { id, requestId, createdAt, method, route, path, product, statusCode, durationMs,
//                 env, ip, userAgent, creditKey, credits, refId, errorMessage,
//                 upstream: { status, txnId, message } | null }
//
// Request headers and bodies are never stored or returned (privacy). Logs are kept 90 days.
//
// Until the backend endpoints exist this returns generated sample data; set USE_MOCK to false
// to call the real API. The page doesn't change either way.

export const USE_MOCK = true;
export const RETENTION_DAYS = 90;

export async function fetchTransactionSummary(store, params) {
  if (USE_MOCK) return delay(mockSummary(params));
  return store.dispatch('mainStore/fetchKycUsageEndpoint', { path: 'usage/transactions/summary', query: params });
}

export async function fetchTransactions(store, params) {
  if (USE_MOCK) return delay(mockList(params));
  return store.dispatch('mainStore/fetchKycUsageEndpoint', { path: 'usage/transactions', query: params });
}

export async function fetchTransaction(store, id) {
  if (USE_MOCK) return delay(mockDetail(id));
  return store.dispatch('mainStore/fetchKycUsageEndpoint', { path: `usage/transactions/${encodeURIComponent(id)}` });
}

export function statusClass(code) {
  if (code >= 500) return '5xx';
  if (code >= 400) return '4xx';
  return '2xx';
}

// ---------------------------------------------------------------------------------------
// Sample data (only used while USE_MOCK is true)
// ---------------------------------------------------------------------------------------

const ENDPOINTS = [
  { method: 'POST', route: '/api/v1/e-kyc/verification/session', product: 'KYC', creditKey: 'WRITE_SESSION', credits: 4, weight: 14, latency: [120, 600], session: true },
  { method: 'GET', route: '/api/v1/e-kyc/verification/session/:sessionId', product: 'KYC', creditKey: 'READ_SESSION', credits: 0, weight: 10, latency: [60, 300], session: true },
  { method: 'POST', route: '/api/v1/e-kyc/verification/passive-liveliness', product: 'KYC', creditKey: 'WRITE_PASSIVE_LIVELINESS', credits: 15, weight: 9, latency: [900, 4200], session: true },
  { method: 'POST', route: '/api/v1/e-kyc/verification/doc-ocr', product: 'KYC', creditKey: 'WRITE_DOC_OCR', credits: 30, weight: 8, latency: [1500, 6800], session: true },
  { method: 'POST', route: '/api/v1/e-kyc/verification/user-consent', product: 'KYC', creditKey: 'WRITE_USER_CONSENT', credits: 5, weight: 6, latency: [150, 700], session: true },
  { method: 'POST', route: '/api/v1/aadhaar/okyc/otp', product: 'KYC', creditKey: 'WRITE_SESSION', credits: 2, weight: 8, latency: [300, 8800], session: true, upstream: 'Aadhaar OKYC' },
  { method: 'POST', route: '/api/v1/aadhaar/okyc/otp/verify', product: 'KYC', creditKey: 'WRITE_SESSION', credits: 2, weight: 7, latency: [90, 8600], session: true, upstream: 'Aadhaar OKYC' },
  { method: 'POST', route: '/api/v1/e-kyb/verification/company', product: 'KYB', creditKey: 'WRITE_COMPANY', credits: 10, weight: 4, latency: [400, 2500], session: false },
  { method: 'GET', route: '/api/v1/e-kyb/verification/company', product: 'KYB', creditKey: 'READ_COMPANY', credits: 0, weight: 5, latency: [80, 400], session: false },
  { method: 'POST', route: '/api/v1/compliance', product: 'KYB', creditKey: 'WRITE_COMPLIANCE', credits: 8, weight: 3, latency: [700, 5200], session: false },
];

const CLIENT_ERRORS = [
  { status: 400, message: 'Validation failed: "documentType" must be one of [PASSPORT, AADHAAR, PAN]' },
  { status: 401, message: 'Access token expired' },
  { status: 403, message: 'Permission denied: Missing access rights' },
  { status: 404, message: 'Session not found' },
  { status: 409, message: 'A session with this reference already exists' },
  { status: 422, message: 'Document image is too blurry to read' },
  { status: 429, message: 'Rate limit exceeded, retry after 30s' },
];

const SERVER_ERRORS = [
  { status: 500, message: 'Internal server error' },
  { status: 502, message: 'Upstream provider returned an invalid response' },
  { status: 503, message: 'Upstream provider unavailable' },
  { status: 504, message: 'Upstream provider timed out' },
];

const UPSTREAM_FAILURES = [
  'UIDAI service temporarily unavailable',
  'OTP generation failed: Aadhaar number not linked to a mobile number',
  'Invalid OTP',
  'OTP expired',
];

const USER_AGENTS = ['axios/1.15.0', 'python-requests/2.32.3', 'okhttp/4.12.0', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/129.0 Safari/537.36'];
const IPS = ['34.93.165.114', '13.232.51.207', '103.211.18.42', '49.36.120.9'];

let mockCache = null;

// Deterministic generator so the same sample data shows on every reload
function seededRandom(seed) {
  let value = seed % 2147483647;
  if (value <= 0) value += 2147483646;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

function hex(random, length) {
  let out = '';
  while (out.length < length) out += Math.floor(random() * 16).toString(16);
  return out;
}

function uuid(random) {
  return `${hex(random, 8)}-${hex(random, 4)}-4${hex(random, 3)}-a${hex(random, 3)}-${hex(random, 12)}`;
}

function pickWeighted(random, items) {
  const total = items.reduce((sum, item) => sum + item.weight, 0);
  let roll = random() * total;
  return items.find(item => (roll -= item.weight) < 0) || items[0];
}

function allMockTransactions() {
  if (mockCache) return mockCache;
  const random = seededRandom(20261015);
  const now = Date.now();
  const items = [];
  for (let index = 0; index < 1400; index++) {
    // More traffic in recent days
    const ageDays = Math.pow(random(), 1.8) * RETENTION_DAYS;
    const createdAt = new Date(now - ageDays * 86400000 - random() * 3600000);
    const endpoint = pickWeighted(random, ENDPOINTS);
    const roll = random();
    let statusCode = endpoint.method === 'POST' ? 201 : 200;
    let errorMessage = null;
    let upstream = null;
    if (roll > 0.9) {
      const failure = SERVER_ERRORS[Math.floor(random() * SERVER_ERRORS.length)];
      statusCode = endpoint.upstream && failure.status === 500 ? 503 : failure.status;
      errorMessage = failure.message;
    } else if (roll > 0.83) {
      const failure = CLIENT_ERRORS[Math.floor(random() * CLIENT_ERRORS.length)];
      statusCode = failure.status;
      errorMessage = failure.message;
    }
    if (endpoint.upstream) {
      const failed = statusCode >= 500 || (statusCode >= 400 && random() > 0.5);
      upstream = {
        provider: endpoint.upstream,
        status: failed ? (statusCode >= 500 ? statusCode : 400) : 200,
        txnId: `OKYC${hex(random, 12).toUpperCase()}`,
        message: failed ? UPSTREAM_FAILURES[Math.floor(random() * UPSTREAM_FAILURES.length)] : 'Success',
      };
      if (failed && !errorMessage) errorMessage = upstream.message;
    }
    const [minLatency, maxLatency] = endpoint.latency;
    const durationMs = Math.round(minLatency + random() * (maxLatency - minLatency) * (statusCode === 504 ? 2 : 1));
    const sessionId = endpoint.session ? `${hex(random, 24)}` : null;
    const path = endpoint.route.replace(':sessionId', sessionId || hex(random, 24));
    items.push({
      id: hex(random, 24),
      requestId: uuid(random),
      createdAt: createdAt.toISOString(),
      method: endpoint.method,
      route: endpoint.route,
      path,
      product: endpoint.product,
      statusCode,
      durationMs,
      env: random() > 0.25 ? 'prod' : 'dev',
      ip: IPS[Math.floor(random() * IPS.length)],
      userAgent: USER_AGENTS[Math.floor(random() * USER_AGENTS.length)],
      creditKey: endpoint.creditKey,
      // Only successful calls are charged
      credits: statusCode < 400 ? endpoint.credits : 0,
      refId: sessionId,
      errorMessage,
      upstream,
    });
  }
  items.sort((left, right) => right.createdAt.localeCompare(left.createdAt));
  mockCache = items;
  return items;
}

function inRange(item, { from, to, env }) {
  const time = item.createdAt;
  if (from && time < new Date(from).toISOString()) return false;
  if (to && time > new Date(to).toISOString()) return false;
  if (env && item.env !== env) return false;
  return true;
}

function matchesFilters(item, { status, route, product, search }) {
  if (status) {
    if (/^\dxx$/.test(status) ? statusClass(item.statusCode) !== status : String(item.statusCode) !== String(status)) return false;
  }
  if (route && item.route !== route) return false;
  if (product && item.product !== product) return false;
  if (search) {
    const term = search.trim().toLowerCase();
    const ids = [item.requestId, item.refId, item.upstream && item.upstream.txnId, item.id].filter(Boolean).map(id => id.toLowerCase());
    if (!ids.includes(term)) return false;
  }
  return true;
}

function emptyCounts() {
  return { total: 0, '2xx': 0, '4xx': 0, '5xx': 0 };
}

function mockSummary(params = {}) {
  const items = allMockTransactions().filter(item => inRange(item, params));
  const totals = emptyCounts();
  const buckets = new Map();
  const endpoints = new Map();
  const hourly = params.interval === 'hour';
  items.forEach(item => {
    const group = statusClass(item.statusCode);
    totals.total += 1;
    totals[group] += 1;
    const bucket = hourly ? item.createdAt.slice(0, 13) + ':00:00.000Z' : item.createdAt.slice(0, 10);
    if (!buckets.has(bucket)) buckets.set(bucket, { bucket, '2xx': 0, '4xx': 0, '5xx': 0 });
    buckets.get(bucket)[group] += 1;
    const key = `${item.method} ${item.route}`;
    if (!endpoints.has(key)) endpoints.set(key, { method: item.method, route: item.route, product: item.product, ...emptyCounts(), durationTotal: 0 });
    const row = endpoints.get(key);
    row.total += 1;
    row[group] += 1;
    row.durationTotal += item.durationMs;
  });
  return {
    totals,
    series: [...buckets.values()].sort((left, right) => left.bucket.localeCompare(right.bucket)),
    endpoints: [...endpoints.values()]
      .map(({ durationTotal, ...row }) => ({ ...row, avgDurationMs: Math.round(durationTotal / row.total) }))
      .sort((left, right) => right.total - left.total),
  };
}

function mockList(params = {}) {
  const limit = Number(params.limit) || 25;
  const offset = Number(params.cursor) || 0;
  const items = allMockTransactions().filter(item => inRange(item, params) && matchesFilters(item, params));
  const page = items.slice(offset, offset + limit);
  return { items: page, nextCursor: offset + limit < items.length ? String(offset + limit) : null };
}

function mockDetail(id) {
  const item = allMockTransactions().find(transaction => transaction.id === id || transaction.requestId === id);
  if (!item) throw new Error('Transaction not found');
  return item;
}

function delay(value) {
  return new Promise(resolve => setTimeout(() => resolve(value), 350));
}
