// Company statusReason from the KYC service: the company's full status history. Every status
// change, admin decision and compliance finding adds one entry, oldest first; nothing is
// overwritten. Each entry is { status, reason?, owner, time }:
//   status: 'Submitted' | 'InProgress' | 'Approved' | 'Rejected' | 'Completed'
//   reason: a ComplianceCheckFailureReason code (e.g. "COMPANY_INACTIVE") or an admin's
//           free-text rejection reason
//   owner:  'system' for automated entries, otherwise the userId of the deciding admin
//   time:   ISO date
// Old companies can still have plain strings (a reason code only), mixed with new entries.

import config from '../config';

export const SYSTEM_OWNER = 'system';

// [{ status, reason, owner, time }] in recorded order; legacy strings get null status/owner/time
export function normalizeStatusReasons(statusReason) {
  return (Array.isArray(statusReason) ? statusReason : [])
    .map(entry => {
      if (typeof entry === 'string') return { status: null, reason: entry, owner: null, time: null };
      if (!entry || typeof entry !== 'object') return null;
      return {
        status: entry.status || null,
        reason: entry.reason || null,
        owner: entry.owner || null,
        time: entry.time || null,
      };
    })
    .filter(entry => entry && (entry.status || entry.reason));
}

// Unique reason codes, for places that only need to know what went wrong
export function statusReasonCodes(statusReason) {
  return [...new Set(normalizeStatusReasons(statusReason).map(entry => entry.reason).filter(Boolean))];
}

// Unique reason codes recorded since the company entered its current status: what is wrong
// right now. Older reasons (e.g. from a rejection before a resubmission) stay in the history
// only. Legacy string entries have no status, so a legacy-only history keeps all of them.
export function currentStatusReasonCodes(statusReason) {
  let codes = [];
  let previousStatus = null;
  normalizeStatusReasons(statusReason).forEach(entry => {
    if (entry.status && entry.status !== previousStatus) {
      codes = [];
      previousStatus = entry.status;
    }
    if (entry.reason) codes.push(entry.reason);
  });
  return [...new Set(codes)];
}

// Readable text for a code; free-text reasons are shown as written
export function describeStatusReason(reason) {
  return config.COMPLIANCE_CHECK_FAILURE_REASONS[reason] || reason;
}

// What each entry means, given the one before it (entries must be oldest first):
//   'legacy'   old string entry: a reason with no status, owner or time
//   'decision' a manual admin decision (owner is a userId)
//   'status'   an automated status change
//   'finding'  a compliance finding: has a reason but the status didn't change
export function classifyStatusEntries(entries) {
  let previousStatus = null;
  return entries.map(entry => {
    let kind;
    if (!entry.status) kind = 'legacy';
    else if (entry.owner && entry.owner !== SYSTEM_OWNER) kind = 'decision';
    else if (entry.reason && entry.status === previousStatus) kind = 'finding';
    else kind = 'status';
    if (entry.status) previousStatus = entry.status;
    return { ...entry, kind };
  });
}
