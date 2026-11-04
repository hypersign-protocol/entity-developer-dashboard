// Shared state of the free-credit promotion, so every PromotionBanner on screen (credits pages,
// Go live, Getting Started) shows the same thing and one claim updates them all.
// The server decides eligibility; this only follows GET /billing/promotion.
import Vue from 'vue';
import EventBus from '../../../eventbus';
import { BillingError, getPromotion, claimPromotion } from '../../../utils/billingApi';

const FRESH_MS = 30 * 1000;
const IN_PROGRESS_WAIT_MS = 3000;
const DISMISS_KEY = 'hs.promotion.dismissed.';

// appId → { status, loadedAt, loading, claiming, result }
//   status: the GET response, or null when it failed (no banner)
//   result: { creditsActive, invoiceId, invoiceNumber } after a claim in this session
export const promotionState = Vue.observable({ apps: {} });

const inFlight = {};

function entry(appId) {
  if (!promotionState.apps[appId]) {
    Vue.set(promotionState.apps, appId, { status: null, loadedAt: 0, loading: false, claiming: false, result: null });
  }
  return promotionState.apps[appId];
}

function patchStatus(appId, changes) {
  const e = entry(appId);
  e.status = { ...(e.status || {}), ...changes };
}

// Reuses a recent answer unless `force`; concurrent callers share one request
export function loadPromotion(appId, { force = false } = {}) {
  if (!appId) return Promise.resolve(null);
  const e = entry(appId);
  if (!force && e.loadedAt && Date.now() - e.loadedAt < FRESH_MS) return Promise.resolve(e.status);
  if (inFlight[appId]) return inFlight[appId];
  e.loading = true;
  inFlight[appId] = getPromotion(appId)
    .then(status => { e.status = status; return status; })
    .catch(error => {
      // 404, 403 or the network: no banner, and never a blocked page
      e.status = null;
      console.info(`Free-credit banner not shown: ${error.code || error.status || ''} ${error.message}`);
      return null;
    })
    .finally(() => {
      e.loading = false;
      e.loadedAt = Date.now();
      delete inFlight[appId];
    });
  return inFlight[appId];
}

// After billing details are saved anywhere: the reason may have changed
export function invalidatePromotions() {
  Object.values(promotionState.apps).forEach(e => { e.loadedAt = 0; });
  Object.keys(promotionState.apps).forEach(appId => loadPromotion(appId, { force: true }));
}

export function isDismissed(appId) {
  try {
    return sessionStorage.getItem(DISMISS_KEY + appId) === '1';
  } catch (e) {
    return false;
  }
}

// On logout: a dismissed banner shows again at the next sign-in, and no status is kept for
// whoever signs in next on this browser
export function resetPromotions() {
  try {
    const keys = [];
    for (let i = 0; i < sessionStorage.length; i++) keys.push(sessionStorage.key(i));
    keys.filter(key => key && key.startsWith(DISMISS_KEY)).forEach(key => sessionStorage.removeItem(key));
  } catch (e) {
    // Storage unavailable: nothing was saved
  }
  Object.keys(promotionState.apps).forEach(appId => Vue.delete(promotionState.apps, appId));
}

// Until logout or the tab closes: claiming is optional and the offer stays open
export function dismissPromotion(appId) {
  try {
    sessionStorage.setItem(DISMISS_KEY + appId, '1');
  } catch (e) {
    // Private mode: the banner just stays
  }
}

function granted(appId, { creditsActive, claim }) {
  const e = entry(appId);
  e.result = {
    creditsActive: creditsActive || null,
    invoiceId: (claim && claim.invoiceId) || null,
    invoiceNumber: (claim && claim.invoiceNumber) || null,
  };
  patchStatus(appId, { eligible: false, claimed: true, reason: 'ALREADY_CLAIMED' });
  // Credit pages reload their history and balance
  EventBus.$emit('promotion-claimed', { appId });
}

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

/**
 * POST /billing/promotion/claim. Never retried automatically; a second click while one is in
 * flight is ignored. Resolves to { ok, message, error } for the caller's toast; onNotice(text)
 * shows an interim message (a claim already in progress).
 */
export async function claimFreeCredits(appId, { onNotice } = {}) {
  const e = entry(appId);
  if (e.claiming) return { ok: false, ignored: true };
  e.claiming = true;
  try {
    const response = await claimPromotion(appId);
    granted(appId, response);
    return {
      ok: true,
      message: response.creditsActive === 'AFTER_CURRENT_PLAN'
        ? 'Free credits added. They start when your current plan ends.'
        : 'Free credits added to your account.',
    };
  } catch (error) {
    return await handleClaimError(appId, error, onNotice);
  } finally {
    e.claiming = false;
  }
}

async function handleClaimError(appId, error, onNotice) {
  const code = error instanceof BillingError ? error.code : null;
  const reason = error.details && error.details.reason;

  if (code === 'PROMOTION_ALREADY_CLAIMED') {
    patchStatus(appId, { eligible: false, claimed: true, reason: 'ALREADY_CLAIMED' });
    return { ok: false, error: 'Free credits have already been claimed for your organisation.' };
  }
  if (code === 'PROMOTION_CLAIM_IN_PROGRESS') {
    // The button stays disabled (claiming) while we look again
    if (onNotice) onNotice('Your claim is being processed…');
    await wait(IN_PROGRESS_WAIT_MS);
    const status = await loadPromotion(appId, { force: true });
    if (status && status.claimed) {
      granted(appId, { creditsActive: null, claim: status.claim });
      return { ok: true, message: 'Free credits added to your account.' };
    }
    return { ok: false };
  }
  if (code === 'PROMOTION_NOT_ELIGIBLE') {
    // Billing details missing: the banner switches to Add billing details
    if (reason === 'BILLING_PROFILE_INCOMPLETE') {
      patchStatus(appId, { eligible: false, reason, missingFields: (error.details && error.details.missingFields) || [] });
      return { ok: false, error: 'Please add your billing details to claim the free credits.' };
    }
    patchStatus(appId, { eligible: false, reason: reason || 'NOT_ELIGIBLE' });
    return { ok: false, error: error.message };
  }
  if (error.status === 403) {
    return { ok: false, error: 'Ask your account owner to claim the free credits.' };
  }
  if (code === 'APP_NOT_FOUND') {
    entry(appId).status = null;
    return { ok: false };
  }
  // 500 or network: safe to try again, it never grants twice
  return { ok: false, error: 'Something went wrong. Please try again.' };
}
