// Compliance review state of the company details submitted for production access,
// derived from the onboarding record's companyVerificationStatus
// (Submitted | InProgress | Completed | Approved | Rejected).
export const COMPANY_REVIEW = {
  NOT_SUBMITTED: 'NOT_SUBMITTED',
  PROCESSING: 'PROCESSING', // Submitted: details and documents received, verification check not finished yet
  UNDER_REVIEW: 'UNDER_REVIEW', // Completed: submitted, compliance review still in progress
  VERIFIED: 'VERIFIED', // Approved by compliance
  REJECTED: 'REJECTED', // Rejected by compliance; reason in companyStatusReason
};

const BACKEND_STATUS = {
  Submitted: COMPANY_REVIEW.PROCESSING,
  InProgress: COMPANY_REVIEW.PROCESSING, // ID-Service: a compliance check passed, review continues
  Completed: COMPANY_REVIEW.UNDER_REVIEW,
  Approved: COMPANY_REVIEW.VERIFIED,
  Rejected: COMPANY_REVIEW.REJECTED,
};

export function companyReviewStatus(onboarding) {
  const status = onboarding && onboarding.companyVerificationStatus;
  return BACKEND_STATUS[status] || COMPANY_REVIEW.NOT_SUBMITTED;
}

// Mirrors the backend go-live rule: submitted (Completed) or Approved is enough for production
export function companyAllowsProduction(onboarding) {
  const status = companyReviewStatus(onboarding);
  return status === COMPANY_REVIEW.UNDER_REVIEW || status === COMPANY_REVIEW.VERIFIED;
}

// Mirrors the backend (PATCH /customer-onboarding/:id): company details can be sent
// the first time, or again after a rejection. Every other status, including one we
// don't know yet, is locked, so a company under review is never changed or re-sent.
export function companyCanBeEdited(onboarding) {
  if (!onboarding || !onboarding.companyId) return true;
  return onboarding.companyVerificationStatus === 'Rejected';
}
