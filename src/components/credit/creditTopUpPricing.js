// Pricing shown in the credit top-up popup, per billing region.
// UI sign-off only: these values move to the backend once payments are wired up.
// Values marked PLACEHOLDER are waiting on the business team.

export const REGIONS = {
  IN: 'IN',
  GLOBAL: 'GLOBAL'
};

const pricing = {
  [REGIONS.IN]: {
    label: 'India',
    currency: 'INR',
    locale: 'en-IN',
    // 1 credit = 1 INR
    creditsPerUnit: 1,
    // Credit Calculator flows offered to this region
    calculatorFlowIds: ['india'],
    // Prices exclude GST. A custom amount must fall between the smallest and largest plan,
    // and gets the discount of the largest plan at or below it.
    plans: [
      { amount: 999, discount: 10 },
      { amount: 2499, discount: 25 },
      { amount: 4999, discount: 28 },
      { amount: 9999, discount: 35 }
    ],
    addOns: [
      { id: 'validity', short: '1-month validity', title: 'Credit validity: 1 month', detail: 'Credits are valid for 1 month and cannot be carried forward.', icon: 'mdi-calendar-clock-outline' },
      { id: 'human-support', short: '24×7 human support', title: 'Human support (24×7)', detail: 'Talk to our team any time.', icon: 'mdi-headset' },
      { id: 'email-support', short: 'Email support', title: 'Email support', detail: 'Get help over email.', icon: 'mdi-email-outline' }
    ]
  },
  [REGIONS.GLOBAL]: {
    label: 'Global',
    currency: 'USD',
    locale: 'en-US',
    // PLACEHOLDER: credits per 1 USD (1 credit = 1 INR, so this is the USD→INR rate we honour)
    creditsPerUnit: 90,
    calculatorFlowIds: ['global', 'business'],
    plans: [
      { amount: 99, discount: 0 },
      { amount: 199, discount: 40 },
      { amount: 299, discount: 46.5 },
      { amount: 499, discount: 52 },
      { amount: 1499, discount: 55 }
    ],
    addOns: [
      { id: 'validity', short: '6-month validity', title: 'Credit validity: 6 months', detail: 'Credits are valid for 6 months and cannot be carried forward.', icon: 'mdi-calendar-clock-outline' },
      { id: 'human-support', short: '24×7 human support', title: 'Human support (24×7)', detail: 'Talk to our team any time.', icon: 'mdi-headset' },
      { id: 'email-support', short: 'Email support', title: 'Email support', detail: 'Get help over email.', icon: 'mdi-email-outline' }
    ]
  }
};

// Coupons are tied to a region. The popup only checks the code and region; who is eligible
// and the usage limits are enforced by the backend.
// `listed` coupons appear in the coupon picker; unlisted ones (e.g. emailed codes) can only be typed.
// `title` / `description` are what the customer sees in the picker.
// PLACEHOLDER: coupons apply to the amount left after the plan discount (stacking not confirmed).
export const coupons = {
  FOUNDING15: { region: REGIONS.GLOBAL, percent: 15, listed: true, title: 'Founding customer offer', description: 'For our first 500 verified customers. Valid on your first 3 purchases within 6 months of KYB approval.', eligibility: 'First 500 KYB-verified entities', limits: 'First 3 purchases within 6 months of KYB approval' },
  FOUNDING8: { region: REGIONS.IN, percent: 8, listed: true, title: 'Founding customer offer', description: 'For our first 500 verified Indian businesses. Valid on your first 3 purchases within 6 months.', eligibility: 'First 500 KYB-verified Indian entities (GSTIN/PAN)', limits: 'First 3 purchases within 6 months' },
  // REFER10: { region: REGIONS.GLOBAL, percent: 10, eligibility: 'Entity referred by a paying customer', limits: 'First purchase only; referrer gets 5% of order as bonus credits after referee uses 50%' },
  // REFER5: { region: REGIONS.IN, percent: 5, eligibility: 'Entity referred by a paying customer', limits: 'First purchase only; referrer gets 5% of order as bonus credits after referee uses 50%' },
  // PARTNER10: { region: REGIONS.GLOBAL, percent: 10, eligibility: 'Accelerator, chain or ecosystem cohorts', limits: 'Per-partner code, max uses per code, expires in 90 days' },
  // PARTNER5: { region: REGIONS.IN, percent: 5, eligibility: 'Accelerator or ecosystem cohorts', limits: 'Per-partner code, max uses per code, expires in 90 days' },
  // WINBACK10: { region: REGIONS.GLOBAL, percent: 10, eligibility: 'No purchase in 60+ days', limits: 'One use, emailed only, expires in 14 days' },
  // WINBACK5: { region: REGIONS.IN, percent: 5, eligibility: 'No purchase in 60+ days', limits: 'One use, emailed only, expires in 14 days' }
};

export function getRegionPricing(region) {
  return pricing[region] || pricing[REGIONS.GLOBAL];
}

export function discountPercentFor(amount, plans) {
  if (!amount || amount <= 0) return 0;
  const plan = plans.filter(p => p.amount <= amount).pop();
  return plan ? plan.discount : 0;
}
