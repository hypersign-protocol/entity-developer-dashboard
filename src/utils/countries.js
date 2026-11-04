import isoCountries from 'i18n-iso-countries';
import { SUPPORTED_COUNTRY_CODES } from './kybIdentifierTypes';

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

// ---- ISO 3166-1 alpha-2: what the onboarding and company verification (KYB) APIs take.
// The backend accepts only these codes (XX = any other country); the KYB list is the same one.

export const OTHER_COUNTRY_CODE = 'XX';
export const ACCEPTED_COUNTRY_CODES = SUPPORTED_COUNTRY_CODES;

// "DE" -> "Germany", "XX" -> "Other"
export function countryNameFromCode(alpha2) {
  if (!alpha2) return '';
  if (alpha2 === OTHER_COUNTRY_CODE) return COUNTRY_OPTIONS.XXX;
  const alpha3 = isoCountries.alpha2ToAlpha3(alpha2);
  return (alpha3 && COUNTRY_OPTIONS[alpha3]) || alpha2;
}

// Any stored value -> an accepted alpha-2 code, or '' when it isn't one.
// Older onboarding records hold alpha-3 ("IND"); "UK" is sent as "GB".
export function toAcceptedCountryCode(value) {
  const code = String(value || '').trim().toUpperCase();
  if (!code) return '';
  let alpha2 = code;
  if (code === 'UK') alpha2 = 'GB';
  else if (code === 'XXX') alpha2 = OTHER_COUNTRY_CODE;
  else if (code.length === 3) alpha2 = isoCountries.alpha3ToAlpha2(code) || '';
  return ACCEPTED_COUNTRY_CODES.includes(alpha2) ? alpha2 : '';
}

// Picker options: the name (with its flag) is shown, the alpha-2 code is the value. "Other" last.
export function acceptedCountryOptions() {
  return ACCEPTED_COUNTRY_CODES
    .map(value => {
      const name = countryNameFromCode(value);
      const alpha3 = value === OTHER_COUNTRY_CODE ? 'XXX' : isoCountries.alpha2ToAlpha3(value);
      return { value, name, text: countryOptionLabel(alpha3, name) };
    })
    .sort((a, b) => (a.value === OTHER_COUNTRY_CODE) - (b.value === OTHER_COUNTRY_CODE) || a.name.localeCompare(b.name))
    .map(({ value, text }) => ({ value, text }));
}

// "+91" for "IN"; '' when we don't list one
export function callingCodeFor(alpha2) {
  const alpha3 = alpha2 && isoCountries.alpha2ToAlpha3(alpha2);
  return (alpha3 && CALLING_CODES[alpha3]) || '';
}

// Best-effort guess from the visitor's IP, as an accepted alpha-2 code ('' when unknown)
export async function detectCountryCodeFromIp() {
  return toAcceptedCountryCode(await detectCountryFromIp());
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
