// Display rules for billing amounts (docs/adr/api-contract.md §1.3). Amounts come from the
// server in minor units and percentages in basis points; the UI only formats them.

const LOCALE_BY_CURRENCY = { INR: 'en-IN', USD: 'en-US' };

export function localeFor(currency) {
  return LOCALE_BY_CURRENCY[currency] || 'en-US';
}

// 172431 INR → "₹1,724.31"
export function formatMinor(amountMinor, currency) {
  return new Intl.NumberFormat(localeFor(currency), {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format((Number(amountMinor) || 0) / 100);
}

// 4650 → "46.5%"
export function formatBps(bps, currency) {
  return `${new Intl.NumberFormat(localeFor(currency), { maximumFractionDigits: 2 }).format((Number(bps) || 0) / 100)}%`;
}

export function formatCount(value, currency) {
  return new Intl.NumberFormat(localeFor(currency)).format(Number(value) || 0);
}
