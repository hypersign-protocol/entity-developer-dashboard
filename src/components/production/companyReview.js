// Compliance review state of the company details submitted for production access,
// derived from the onboarding record's companyVerificationStatus (Completed | Approved | Rejected).
export const COMPANY_REVIEW = {
  NOT_SUBMITTED: 'NOT_SUBMITTED',
  UNDER_REVIEW: 'UNDER_REVIEW', // Completed: submitted, compliance review still in progress
  VERIFIED: 'VERIFIED', // Approved by compliance
  REJECTED: 'REJECTED', // Rejected by compliance; reason in companyStatusReason
};

const BACKEND_STATUS = {
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
