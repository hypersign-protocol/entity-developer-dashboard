// Onboarding progress rules: which steps to show, how each one reads, and when Retry and
// Check status appear. A record is { onboardingStatus, logs, processingActive, interestedService }.

const KYB_INTEREST = 'KNOW YOUR BUSINESS (KYB)';
const FAILED_STEP_MESSAGE = 'This step couldn’t be completed. Please retry.';

// `optional`: the backend carries on past a failure, so the record can still reach APPROVED
export const ONBOARDING_STEPS = [
  { key: 'GIVE_DASHBOARD_ACCESS', title: 'Dashboard access', description: 'Grant access to the identity-verification dashboard.' },
  { key: 'CREATE_TEAM_ROLE', title: 'Team and roles setup', description: 'Create the default workspace team and access roles.' },
  { key: 'CREATE_SSI_SERVICE', title: 'SSI service creation', description: 'Create the organization’s SSI service.' },
  { key: 'CREDIT_SSI_SERVICE', title: 'SSI credit allocation', description: 'Allocate the approved SSI service credits.', optional: true },
  { key: 'CREATE_DID', title: 'Business identity creation', description: 'Create the organization’s decentralized identity.' },
  { key: 'REGISTER_DID', title: 'Blockchain registration', description: 'Register the business identity on the blockchain.', optional: true },
  { key: 'CREATE_KYC_SERVICE', title: 'ID service creation', description: 'Create the requested identity-verification service.' },
  { key: 'SETUP_KYC_WIDGET', title: 'KYC widget setup', description: 'Prepare the default verification widget.' },
  { key: 'SETUP_KYB_WIDGET', title: 'KYB widget setup', description: 'Prepare the default business-verification widget.', kybOnly: true },
  { key: 'CONFIGURE_KYC_VERIFIER_PAGE', title: 'KYC verifier page configuration', description: 'Configure the default identity-verification experience.' },
  { key: 'CONFIGURE_KYB_VERIFIER_PAGE', title: 'KYB verifier page configuration', description: 'Configure the default business-verification experience.', kybOnly: true },
  { key: 'COMPLETED', title: 'Workspace activation', description: 'Finish workspace activation and make the services available.' },
];

function normalizedStatus(record) {
  return String(record.onboardingStatus || '').toUpperCase();
}

function visibleSteps(record) {
  const hasKyb = (record.interestedService || []).some(interest => String(interest).trim().toUpperCase() === KYB_INTEREST);
  return ONBOARDING_STEPS.filter(step => !step.kybOnly || hasKyb);
}

// A retried step can have several logs, and only the newest counts. Logs for steps
// that are no longer shown (CREDIT_KYC_SERVICE on older records) are dropped here.
function latestLogByStep(record, steps) {
  const stepKeys = new Set(steps.map(step => step.key));
  const latest = new Map();
  (record.logs || []).forEach((log) => {
    const key = String(log.step || '').trim().toUpperCase();
    const status = String(log.status || '').toUpperCase();
    if (!stepKeys.has(key) || !['SUCCESS', 'FAILED'].includes(status)) return;
    const time = log.time?.$date || log.time || '';
    const existing = latest.get(key);
    const candidateTime = new Date(time).getTime();
    const existingTime = existing ? new Date(existing.time).getTime() : NaN;
    // Logs arrive oldest first, so without usable times the later one wins
    if (!existing || !(candidateTime < existingTime)) latest.set(key, { status, time });
  });
  return latest;
}

// The rows of the progress list. failureReason is never used: it can hold internal errors.
export function buildTimeline(record) {
  const steps = visibleSteps(record);
  const logs = latestLogByStep(record, steps);
  let isRunningStepFound = record.processingActive !== true;
  return steps.map((step) => {
    const log = logs.get(step.key);
    if (log && log.status === 'SUCCESS') {
      return { ...step, state: 'complete', statusLabel: 'Completed', time: log.time, failureMessage: '' };
    }
    if (log) {
      return {
        ...step,
        state: step.optional ? 'warning' : 'failed',
        statusLabel: step.optional ? 'Needs attention' : 'Failed',
        time: log.time,
        failureMessage: FAILED_STEP_MESSAGE,
      };
    }
    if (!isRunningStepFound) {
      isRunningStepFound = true;
      return { ...step, state: 'active', statusLabel: 'In progress', time: '', failureMessage: '' };
    }
    return { ...step, state: 'pending', statusLabel: 'Not started', time: '', failureMessage: '' };
  });
}

// Reads the newest log per shown step, so a step that a retry fixed, or a dropped step, doesn't count
export function hasFailedStep(record) {
  return buildTimeline(record).some(item => item.state === 'failed' || item.state === 'warning');
}

export function isApproved(record) {
  return normalizedStatus(record) === 'APPROVED';
}

// processingActive is missing when the backend couldn't check it, and that must not offer Retry.
// APPROVED records never include it.
export function shouldShowRetry(record) {
  if (isApproved(record)) return hasFailedStep(record);
  return record.processingActive === false;
}

export function shouldShowCheckStatus(record) {
  return !isApproved(record) || hasFailedStep(record);
}

// What to tell the user after POST /process fails. '' means the refetched rows say it all.
export function retryErrorMessage(error) {
  switch (error?.status) {
    case 500: return '';
    case 409: return 'Setup is still running. Check status shortly.';
    case 429: return 'Please wait a minute and try again.';
    case 403: return 'You don’t have permission to retry this setup.';
    // Timeouts and network errors have no useful status: the backend may still be running
    default: return 'We couldn’t confirm the result. Setup may still be running, so check status shortly.';
  }
}

export function checkStatusErrorMessage(error) {
  if (error?.status === 429) return 'Please wait a minute and try again.';
  return 'We couldn’t check the status. Please try again shortly.';
}
