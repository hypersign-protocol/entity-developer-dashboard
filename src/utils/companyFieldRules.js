// Company field rules the backend enforces when the company details are submitted
// (dashboard service customer-onboarding DTO + KYC service CreateCompanyRequestDto).
// The form checks the same patterns so problems show up on the field, before Submit.

// KYC service CreateCompanyRequestDto.name
const COMPANY_NAME_PATTERN = /^[A-Za-z0-9 .&'-]+$/;
// Dashboard service allows [a-zA-Z0-9-] labels, KYC service also allows "_": use the stricter one
const DOMAIN_PATTERN = /^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
// KYC service AddressDto.street
const STREET_PATTERN = /^(?=.*[a-zA-Z0-9])[a-zA-Z0-9\s,'\-/#.]+$/;
const STREET_MIN_LENGTH = 5;

export function validateCompanyName(value) {
  const name = String(value || '').trim();
  if (!name || COMPANY_NAME_PATTERN.test(name)) return '';
  return "Use only letters, numbers, spaces and . & - ' (no commas or other symbols).";
}

// "https://www.Acme.com/about" -> "www.acme.com": what people paste is usually a URL
export function normalizeDomain(value) {
  return String(value || '')
    .trim()
    .replace(/^[a-z][a-z0-9+.-]*:\/\//i, '')
    .replace(/[/?#].*$/, '')
    .replace(/:\d+$/, '')
    .replace(/\.$/, '')
    .toLowerCase();
}

export function validateDomain(value) {
  const domain = normalizeDomain(value);
  if (!domain || DOMAIN_PATTERN.test(domain)) return '';
  return 'Enter a domain like example.com (no spaces or special characters).';
}

// Street is sent as "line 1, line 2"
export function joinStreet(line1, line2) {
  return [line1, line2].map(part => String(part || '').trim()).filter(Boolean).join(', ');
}

export function validateStreetLine(value) {
  const line = String(value || '').trim();
  if (!line || STREET_PATTERN.test(line)) return '';
  return 'Use only letters, numbers, spaces and , . - / # characters.';
}

export function validateStreet(line1, line2) {
  const street = joinStreet(line1, line2);
  if (!street) return '';
  if (street.length < STREET_MIN_LENGTH) return `Enter at least ${STREET_MIN_LENGTH} characters for the address.`;
  return '';
}
