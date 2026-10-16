// API transactions: every API call an app made (from the KYC service request log), for the
// API Transactions page. Three endpoints on the KYC service usage module, all needing READ_USAGE.
// serviceId is added by mainStore/fetchKycUsageEndpoint; always send env, startDate and endDate
// (the backend can't default them from the token on these routes).
//
//   GET /api/v1/usage/transactions/summary?serviceId&env&startDate&endDate&interval=day|hour&tz
//     tz: IANA time zone (e.g. Asia/Kolkata) so days and hours match the developer's clock
//     -> { totals: { total, '2xx', '4xx', '5xx' },
//          series: [{ bucket: 'YYYY-MM-DD' (day) or 'YYYY-MM-DDTHH:00' (hour), '2xx', '4xx', '5xx' }],
//          endpoints: [{ method, route, total, '2xx', '4xx', '5xx', avgDurationMs | null }] }
//     Buckets without calls are left out; the page fills them with zeros.
//
//   GET /api/v1/usage/transactions?serviceId&env&startDate&endDate&cursor&limit
//     -> { items: [Transaction], nextCursor: string | null }   (newest first)
//
//   GET /api/v1/usage/transactions/:id?serviceId
//     -> Transaction   (404 "Transaction not found" for another app's or an unknown ID)
//
// Transaction = { id, requestId, createdAt, method, path, route, statusCode, durationMs, env,
//                 ip, userAgent, errorMessage }   (null for anything older logs didn't record)
//
// Request headers and bodies are never stored or returned (privacy). Logs are kept 90 days.

export const RETENTION_DAYS = 90;

export function fetchTransactionSummary(store, params) {
  return store.dispatch('mainStore/fetchKycUsageEndpoint', { path: 'usage/transactions/summary', query: params });
}

export function fetchTransactions(store, params) {
  return store.dispatch('mainStore/fetchKycUsageEndpoint', { path: 'usage/transactions', query: params });
}

export function fetchTransaction(store, id) {
  return store.dispatch('mainStore/fetchKycUsageEndpoint', { path: `usage/transactions/${encodeURIComponent(id)}` });
}

// 'none' for old logs without a status code (the backend counts them in no group either)
export function statusClass(code) {
  if (typeof code !== 'number') return 'none';
  if (code >= 500) return '5xx';
  if (code >= 400) return '4xx';
  return '2xx';
}
