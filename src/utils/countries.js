import isoCountries from 'i18n-iso-countries';

// ISO 3166-1 alpha-3 code -> display name. Shared by onboarding and go-live flows.
export const COUNTRY_OPTIONS = {
  AFG: 'Afghanistan', DZA: 'Algeria', AGO: 'Angola', ARG: 'Argentina', ARM: 'Armenia', AUS: 'Australia',
  AUT: 'Austria', AZE: 'Azerbaijan', BHS: 'Bahamas', BHR: 'Bahrain', BGD: 'Bangladesh', BEL: 'Belgium', BWA: 'Botswana',
  BRA: 'Brazil', BRN: 'Brunei', BGR: 'Bulgaria', KHM: 'Cambodia', CMR: 'Cameroon', CAN: 'Canada',
  CHL: 'Chile', CHN: 'China', COL: 'Colombia', CRI: 'Costa Rica', HRV: 'Croatia', CUB: 'Cuba',
  CYP: 'Cyprus', CZE: 'Czech Republic', DNK: 'Denmark', DOM: 'Dominican Republic', ECU: 'Ecuador',
  EGY: 'Egypt', EST: 'Estonia', ETH: 'Ethiopia', FIN: 'Finland', FRA: 'France', GEO: 'Georgia',
  DEU: 'Germany', GHA: 'Ghana', GRC: 'Greece', GTM: 'Guatemala', HKG: 'Hong Kong', HUN: 'Hungary',
  ISL: 'Iceland', IND: 'India', IDN: 'Indonesia', IRN: 'Iran', IRQ: 'Iraq', IRL: 'Ireland',
  ISR: 'Israel', ITA: 'Italy', JAM: 'Jamaica', JPN: 'Japan', JOR: 'Jordan', KEN: 'Kenya',
  KWT: 'Kuwait', LAO: 'Laos', LVA: 'Latvia', LBN: 'Lebanon', LIE: 'Liechtenstein', LTU: 'Lithuania',
  LUX: 'Luxembourg', MYS: 'Malaysia', MLT: 'Malta', MUS: 'Mauritius', MEX: 'Mexico', MNG: 'Mongolia',
  MAR: 'Morocco', MMR: 'Myanmar', NAM: 'Namibia', NPL: 'Nepal', NLD: 'Netherlands', NZL: 'New Zealand',
  NGA: 'Nigeria', NOR: 'Norway', OMN: 'Oman', PAK: 'Pakistan', PAN: 'Panama', PER: 'Peru',
  PHL: 'Philippines', POL: 'Poland', PRT: 'Portugal', QAT: 'Qatar', ROU: 'Romania', RWA: 'Rwanda',
  SAU: 'Saudi Arabia', SEN: 'Senegal', SGP: 'Singapore', SVK: 'Slovakia', SVN: 'Slovenia',
  ZAF: 'South Africa', KOR: 'South Korea', ESP: 'Spain', LKA: 'Sri Lanka', SWE: 'Sweden',
  CHE: 'Switzerland', TWN: 'Taiwan', TZA: 'Tanzania', THA: 'Thailand', TLS: 'Timor-Leste', TUN: 'Tunisia', TUR: 'Turkey',
  UGA: 'Uganda', UKR: 'Ukraine', ARE: 'United Arab Emirates', GBR: 'United Kingdom', USA: 'United States',
  URY: 'Uruguay', UZB: 'Uzbekistan', VEN: 'Venezuela', VNM: 'Vietnam', ZMB: 'Zambia', ZWE: 'Zimbabwe',
  XXX: 'Other',
};

export const CALLING_CODES = {
  AUS: '+61', BGD: '+880', BRA: '+55', CAN: '+1', CHN: '+86', DEU: '+49', EGY: '+20',
  ESP: '+34', FRA: '+33', GBR: '+44', HKG: '+852', IDN: '+62', IND: '+91', IRL: '+353',
  ITA: '+39', JPN: '+81', KEN: '+254', KOR: '+82', MEX: '+52', MYS: '+60', NGA: '+234',
  NLD: '+31', NZL: '+64', PAK: '+92', PHL: '+63', SGP: '+65', THA: '+66', TUR: '+90',
  USA: '+1', ARE: '+971', ZAF: '+27',
};

// Flag emoji for an alpha-3 code ("IND" -> 🇮🇳), the same regional-indicator approach the
// business list uses. "Other" gets a globe. Native <select> options can only hold text,
// so an emoji is the way to show a flag there.
export function countryFlag(alpha3) {
  if (alpha3 === 'XXX') return '🌐';
  const alpha2 = isoCountries.alpha3ToAlpha2(alpha3);
  if (!alpha2) return '';
  return alpha2.toUpperCase().replace(/./g, char => String.fromCodePoint(127397 + char.charCodeAt(0)));
}

// "🇮🇳  India" for dropdown options
export function countryOptionLabel(alpha3, name) {
  const flag = countryFlag(alpha3);
  return flag ? `${flag}  ${name}` : name;
}

export function countryName(code) {
  return COUNTRY_OPTIONS[code] || code || '';
}

// Convert the alpha-3 codes used by the dashboard UI to the backend's alpha-2 codes.
export function countryCodeForApi(code) {
  const normalized = String(code || '').trim().toUpperCase();
  if (normalized === 'XXX' || normalized === 'XX') return 'XX';
  if (normalized.length === 2) return normalized;
  return isoCountries.alpha3ToAlpha2(normalized)?.toUpperCase() || normalized;
}

// Keep the UI's country selector, phone calling codes, and India-specific options alpha-3.
export function countryCodeForUi(code) {
  const normalized = String(code || '').trim().toUpperCase();
  if (normalized === 'XX' || normalized === 'XXX') return 'XXX';
  if (normalized.length === 3) return normalized;
  return isoCountries.alpha2ToAlpha3(normalized)?.toUpperCase() || normalized;
}

// Best-effort country guess from the visitor's IP. Resolves to a COUNTRY_OPTIONS
// code, or '' if the lookup fails, times out (4s) or the country isn't listed.
export async function detectCountryFromIp() {
  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timeout = controller ? setTimeout(() => controller.abort(), 4000) : null;
  try {
    const response = await fetch('https://ipapi.co/json/', controller ? { signal: controller.signal } : undefined);
    if (!response.ok) return '';
    const location = await response.json();
    const match = Object.entries(COUNTRY_OPTIONS).find(([, name]) => name === location.country_name);
    return match ? match[0] : '';
  } catch (error) {
    return '';
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}
