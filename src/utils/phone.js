// Contact phone numbers for onboarding. Uses libphonenumber-js, the same library (and version)
// the dashboard service validates with, so a number the form accepts is one the API accepts.
//
// The form keeps what the user typed plus a "dialling country" (an alpha-2 code shown as the
// +49 chip). It sends the full international number.
import { parsePhoneNumberFromString, getCountryCallingCode, getExampleNumber } from 'libphonenumber-js';
import examples from 'libphonenumber-js/examples.mobile.json';
import { ACCEPTED_COUNTRY_CODES, OTHER_COUNTRY_CODE, countryNameFromCode, countryFlag } from './countries';
import isoCountries from 'i18n-iso-countries';

// The backend's alias for a non-ISO code in its list
const REGION_ALIASES = { UK: 'GB' };
const region = country => REGION_ALIASES[country] || country;

function hasMetadata(country) {
  try {
    getCountryCallingCode(country);
    return true;
  } catch (e) {
    return false;
  }
}

// "DE" -> "+49"; '' for XX or an unknown code
export function dialCodeFor(country) {
  if (!country || country === OTHER_COUNTRY_CODE || !hasMetadata(region(country))) return '';
  return `+${getCountryCallingCode(region(country))}`;
}

// Chip options: every accepted country with its dialling code, by name
export function dialCodeOptions() {
  return ACCEPTED_COUNTRY_CODES
    .filter(code => dialCodeFor(code))
    .map(code => ({
      value: code,
      name: countryNameFromCode(code),
      code: dialCodeFor(code),
      flag: countryFlag(isoCountries.alpha2ToAlpha3(code)),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

// Example after the chip: "1512 3456789" for DE, "81234 56789" for IN
export function examplePlaceholder(country) {
  const dial = dialCodeFor(country);
  if (!dial) return '+44 7123 456789';
  const example = getExampleNumber(region(country), examples);
  if (!example) return '';
  return example.formatInternational().replace(`${dial} `, '');
}

// The same rule as the backend: "+..." names its own country; anything else is read in `country`
export function isValidPhone(phone, country) {
  const text = String(phone || '').trim();
  if (!text) return false;
  if (text.startsWith('+')) return Boolean(parsePhoneNumberFromString(text)?.isValid());
  if (!country || country === OTHER_COUNTRY_CODE) return false;
  return Boolean(parsePhoneNumberFromString(text, region(country))?.isValid());
}

/**
 * What to send: '' when empty; a pasted "+..." number as typed; otherwise the number read in the
 * dialling country, as E.164 ("+493012345678"). That also drops a national leading 0 where the
 * country uses one (but keeps Italy's, which belongs to the number).
 */
export function toInternationalPhone(phone, dialCountry) {
  const text = String(phone || '').trim();
  if (!text) return '';
  if (text.startsWith('+')) return text;
  const dial = dialCodeFor(dialCountry);
  if (!dial) return text;
  const parsed = parsePhoneNumberFromString(text, region(dialCountry));
  return parsed && parsed.isValid() ? parsed.number : `${dial} ${text}`;
}

/**
 * A saved or pasted "+..." number -> { dialCountry, phone } for the chip and the input, e.g.
 * "+919876543210" -> { dialCountry: 'IN', phone: '98765 43210' }. Null when it can't be read,
 * or when the number's country isn't in the list (it then stays as typed).
 */
export function splitInternational(phone) {
  const text = String(phone || '').trim();
  if (!text.startsWith('+')) return null;
  const parsed = parsePhoneNumberFromString(text);
  if (!parsed || !parsed.isValid() || !parsed.country || !ACCEPTED_COUNTRY_CODES.includes(parsed.country)) return null;
  return {
    dialCountry: parsed.country,
    phone: parsed.formatInternational().replace(`+${parsed.countryCallingCode} `, ''),
  };
}

// "Enter a valid phone number for Germany"
export function phoneErrorMessage(dialCountry) {
  if (!dialCountry || dialCountry === OTHER_COUNTRY_CODE) return 'Choose a dialling code, or enter the number with + and the country code.';
  return `Enter a valid phone number for ${countryNameFromCode(dialCountry)}.`;
}

/**
 * The check every phone field runs (on blur and on submit), on the number it will send:
 * '' when fine, otherwise the message to show under the field.
 */
export function phoneFieldProblem(phone, dialCountry, { required = true } = {}) {
  if (!String(phone || '').trim()) return required ? 'Enter a phone number.' : '';
  return isValidPhone(toInternationalPhone(phone, dialCountry), dialCountry) ? '' : phoneErrorMessage(dialCountry);
}

/**
 * Onboarding's phoneNumber -> international form ("030 12345678" with DE -> "+493012345678"),
 * read in onboarding's country. '' when it doesn't parse. Used to suggest a billing phone.
 */
export function phoneFromOnboarding(phoneNumber, country) {
  const text = String(phoneNumber || '').trim();
  if (!text) return '';
  const parsed = parsePhoneNumberFromString(text, text.startsWith('+') ? undefined : region(country));
  return parsed && parsed.isValid() ? parsed.number : '';
}
