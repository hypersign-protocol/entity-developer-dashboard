// Format rules for company registration numbers and company/personal tax IDs, keyed by the
// ISO-3 country codes used in COUNTRY_OPTIONS.
//
// These are format checks only (no checksum or registry lookup); compliance still
// verifies the documents. Patterns are matched against the value upper-cased with
// whitespace removed. Countries or fields without a rule fall back to GENERIC.
// When a country accepts several identifiers (e.g. CIN or LLPIN), list them all.

const GENERIC = {
  label: '',
  example: '',
  patterns: [/^[A-Z0-9][A-Z0-9./-]{2,29}$/],
  hint: '3–30 letters, digits, dots, slashes or hyphens',
};

const RULES = {
  IND: {
    registration: { label: 'CIN or LLPIN', example: 'U72900KA2021PTC123456', patterns: [/^[LU]\d{5}[A-Z]{2}\d{4}[A-Z]{3}\d{6}$/, /^[A-Z]{3}-\d{4}$/] },
    tax: { label: 'GSTIN or PAN', example: '29ABCDE1234F1Z5', document: 'GST certificate or PAN card', patterns: [/^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/, /^[A-Z]{5}\d{4}[A-Z]$/] },
    personalTax: { label: 'PAN', example: 'ABCPE1234F', document: 'PAN card', patterns: [/^[A-Z]{5}\d{4}[A-Z]$/] },
  },
  USA: {
    tax: { label: 'EIN', example: '12-3456789', document: 'IRS EIN letter (CP 575 or 147C)', patterns: [/^\d{2}-?\d{7}$/] },
    personalTax: { label: 'SSN or ITIN', example: '123-45-6789', document: 'SSN card or ITIN letter', patterns: [/^\d{3}-?\d{2}-?\d{4}$/] },
  },
  GBR: {
    registration: { label: 'Companies House number', example: '01234567', patterns: [/^(\d{8}|[A-Z]{2}\d{6})$/] },
    tax: { label: 'VAT number or UTR', example: 'GB123456789', document: 'VAT registration certificate or UTR letter', patterns: [/^(GB)?(\d{9}|\d{12})$/, /^\d{10}$/] },
    personalTax: { label: 'National Insurance number or UTR', example: 'AB123456C', document: 'National Insurance or UTR letter', patterns: [/^[A-CEGHJ-PR-TW-Z]{2}\d{6}[A-D]$/, /^\d{10}$/] },
  },
  SGP: {
    registration: { label: 'UEN', example: '201912345K', patterns: [/^(\d{8}[A-Z]|\d{9}[A-Z]|[TSR]\d{2}[A-Z]{2}\d{4}[A-Z])$/] },
    tax: { label: 'GST registration number', example: 'M90312345A', document: 'GST registration letter', patterns: [/^(M\d{8}[A-Z]|\d{8,9}[A-Z]|[TSR]\d{2}[A-Z]{2}\d{4}[A-Z])$/] },
    personalTax: { label: 'NRIC or FIN', example: 'S1234567D', document: 'NRIC or FIN card', patterns: [/^[STFGM]\d{7}[A-Z]$/] },
  },
  AUS: {
    registration: { label: 'ACN', example: '123 456 789', patterns: [/^\d{9}$/] },
    tax: { label: 'ABN', example: '12 345 678 901', document: 'ABN registration extract', patterns: [/^\d{11}$/] },
    personalTax: { label: 'Tax File Number (TFN)', example: '123 456 782', document: 'ATO letter showing your TFN', patterns: [/^\d{8,9}$/] },
  },
  CAN: {
    tax: { label: 'Business Number (BN)', example: '123456789RT0001', document: 'CRA Business Number confirmation', patterns: [/^\d{9}(RT\d{4})?$/] },
    personalTax: { label: 'Social Insurance Number (SIN)', example: '123 456 789', document: 'SIN confirmation letter', patterns: [/^\d{9}$/] },
  },
  DEU: {
    registration: { label: 'Handelsregister number', example: 'HRB 123456', patterns: [/^HR[AB]\d{1,6}[A-Z]{0,2}$/] },
    tax: { label: 'VAT ID (USt-IdNr.)', example: 'DE123456789', document: 'VAT ID confirmation', patterns: [/^(DE)?\d{9}$/] },
    personalTax: { label: 'Tax ID (Steuer-ID)', example: '12345678901', document: 'Steuer-ID letter', patterns: [/^\d{11}$/] },
  },
  FRA: {
    registration: { label: 'SIREN or SIRET', example: '123 456 789', patterns: [/^\d{9}$/, /^\d{14}$/] },
    tax: { label: 'VAT number', example: 'FR12345678901', document: 'VAT registration certificate', patterns: [/^(FR)?[0-9A-Z]{2}\d{9}$/] },
    personalTax: { label: 'Tax number (numéro fiscal)', example: '1234567890123', document: 'Tax notice (avis d\'imposition)', patterns: [/^[0-3]\d{12}$/] },
  },
  NLD: {
    registration: { label: 'KvK number', example: '12345678', patterns: [/^\d{8}$/] },
    tax: { label: 'VAT number', example: 'NL123456789B01', document: 'VAT number confirmation', patterns: [/^(NL)?\d{9}B\d{2}$/] },
    personalTax: { label: 'BSN', example: '123456789', document: 'Document showing your BSN', patterns: [/^\d{9}$/] },
  },
  ARE: {
    tax: { label: 'Tax Registration Number (TRN)', example: '100123456700003', document: 'TRN certificate', patterns: [/^\d{15}$/] },
    personalTax: { label: 'Emirates ID', example: '784-1990-1234567-1', document: 'Emirates ID', patterns: [/^784-?\d{4}-?\d{7}-?\d$/] },
  },
  ZAF: {
    registration: { label: 'CIPC registration number', example: '2019/123456/07', patterns: [/^\d{4}\/\d{6}\/\d{2}$/] },
    tax: { label: 'VAT number', example: '4123456789', document: 'VAT registration certificate', patterns: [/^4\d{9}$/] },
    personalTax: { label: 'Income tax reference number', example: '0123456789', document: 'SARS tax registration notice', patterns: [/^\d{10}$/] },
  },
  BRA: {
    registration: { label: 'CNPJ', example: '12.345.678/0001-90', patterns: [/^\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}$/] },
    tax: { label: 'CNPJ', example: '12.345.678/0001-90', document: 'CNPJ registration card', patterns: [/^\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}$/] },
    personalTax: { label: 'CPF', example: '123.456.789-09', document: 'CPF registration proof', patterns: [/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/] },
  },
  JPN: {
    registration: { label: 'Corporate Number', example: '1234567890123', patterns: [/^\d{13}$/] },
    tax: { label: 'Invoice registration number', example: 'T1234567890123', document: 'Invoice registration notice', patterns: [/^T?\d{13}$/] },
    personalTax: { label: 'My Number', example: '123456789012', document: 'My Number card or notification', patterns: [/^\d{12}$/] },
  },
};

const DEFAULT_LABELS = { registration: 'Company registration number', tax: 'Company tax ID', personalTax: 'Personal tax ID' };
// Name of the supporting document for each identifier, when the country has no specific one
const DEFAULT_DOCUMENTS = { registration: 'Certificate of incorporation', tax: 'Tax registration certificate', personalTax: 'Personal tax ID document' };

// kind: 'registration' | 'tax' (company) | 'personalTax' (owner / representative)
export function getIdentifierRule(kind, country) {
  const rule = (RULES[country] || {})[kind];
  const fallback = { document: DEFAULT_DOCUMENTS[kind] };
  return rule ? { ...fallback, ...rule, hint: '' } : { ...GENERIC, ...fallback, label: DEFAULT_LABELS[kind] };
}

export function normalizeIdentifier(value) {
  return String(value || '').toUpperCase().replace(/\s+/g, '');
}

// Returns an error message, or '' when the value matches the country's format.
export function validateIdentifier(kind, country, value) {
  const normalized = normalizeIdentifier(value);
  if (!normalized) return '';
  const rule = getIdentifierRule(kind, country);
  if (rule.patterns.some(pattern => pattern.test(normalized))) return '';
  return rule.example
    ? `This doesn't look like a valid ${rule.label}. Expected format: ${rule.example}`
    : `Enter a valid ${rule.label.toLowerCase()} (${GENERIC.hint}).`;
}
