// Customer-facing onboarding status and retry. Callers branch on the error `status`, which
// RequestHandler drops, so these share the billing client. No timeout on purpose: POST /process
// only responds once every remaining step has run.
import { request } from './billingApi';

export function getOnboarding() {
  return request('/customer-onboarding');
}

export function retryOnboarding(recordId) {
  return request(`/customer-onboarding/${encodeURIComponent(recordId)}/process`, { method: 'POST', body: {} });
}
