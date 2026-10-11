// Compliance review state of the company details submitted for production access,
// derived from the onboarding record's documents[].status (PENDING | APPROVED | REJECTED).
export const COMPANY_REVIEW = {
  NOT_SUBMITTED: 'NOT_SUBMITTED',
  UNDER_REVIEW: 'UNDER_REVIEW',
  VERIFIED: 'VERIFIED',
  ACTION_NEEDED: 'ACTION_NEEDED',
};

export function companyReviewStatus(onboarding) {
  const documents = Array.isArray(onboarding && onboarding.documents) ? onboarding.documents : [];
  if (!documents.length) return COMPANY_REVIEW.NOT_SUBMITTED;
  const statuses = documents.map(doc => String(doc.status || 'PENDING').toUpperCase());
  if (statuses.includes('REJECTED')) return COMPANY_REVIEW.ACTION_NEEDED;
  if (statuses.every(status => status === 'APPROVED')) return COMPANY_REVIEW.VERIFIED;
  return COMPANY_REVIEW.UNDER_REVIEW;
}
