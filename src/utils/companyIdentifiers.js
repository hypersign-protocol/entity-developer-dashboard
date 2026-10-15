// Company registration number / tax ID / postal code rules for the company verification
// form. Types and patterns come from kybIdentifierTypes.js (a copy of the backend lists),
// and values are checked the same way the dashboard service checks them:
//   - the type must be one listed for the country of registration ('OTHER' when the
//     country has none)
//   - the number must match that type's pattern, tested on exactly the value we send
//
// Countries are ISO 3166-1 alpha-2 codes ('XX' = other country).

import {
  SUPPORTED_COUNTRY_CODES,
  REGISTRATION_NUMBER_TYPES,
  TAX_ID_TYPES,
  POSTAL_CODE_PATTERNS,
} from './kybIdentifierTypes';

export const OTHER_COUNTRY = 'XX';
export const OTHER_TYPE = 'OTHER';

// One sample value per type, shown as the placeholder and in error messages.
// Every example matches its backend pattern (checked in tests/unit/companyIdentifiers.spec.js).
export const EXAMPLES = {
  // Registration numbers
  'IN:CIN': 'U72900KA2021PTC123456',
  'IN:LLPIN': 'AAB1234',
  'SG:UEN': '201912345K',
  'CN:USCC': '91310000MA1FL1234X',
  'JP:HOJIN_BANGO': '1234567890123',
  'ID:NIB': '1234567890123',
  'VN:ERC': '0123456789',
  'TH:CRN_TH': '0105551234567',
  'MY:ROC': '201901000005',
  'PH:SEC_REG_NO': '2019123456',
  'KR:CRN_KR': '1101111234567',
  'AU:ACN': '123456789',
  'NZ:NZBN': '9429041234567',
  'PK:SECP_REG': 'AB123456',
  'LK:BRN_LK': '123456789',
  'NP:CRN_NP': '1234567',
  'MM:BRN_MM': '123456789',
  'BN:ROCN': '1234567',
  'LA:ERN_LA': '12345678',
  'MN:CRN_MN': '1234567',
  'TL:NIPC_TL': '123456789',
  'GB:CRN_UK': '01234567',
  'DE:HRB': 'HRB123456',
  'FR:SIREN': '123456789',
  'FR:SIRET': '12345678900012',
  'NL:KVK': '12345678',
  'IE:CRO_IE': '123456',
  'CH:CHE_CH': 'CHE-123.456.789',
  'BE:CBE_BE': '0123.456.789',
  'AT:FN_AT': 'FN123456A',
  'SE:ORG_SE': '556123-4567',
  'NO:ORG_NO': '923456789',
  'DK:CVR_DK': '12345678',
  'PL:KRS_PL': '0000123456',
  'SA:CR_SA': '1010123456',
  'QA:CR_QA': '123456',
  'KW:CR_KW': '123456',
  'BH:CR_BH': '12345678',
  'OM:CR_OM': '1234567',
  'ZA:CIPC': '2019/123456/07',
  'NG:RCN': '1234567',
  // Tax IDs
  'IN:PAN': 'ABCDE1234F',
  'IN:GSTIN': '29ABCDE1234F1Z5',
  'HK:BRN': '12345678',
  'US:EIN': '12-3456789',
  'CA:BN': '123456789',
  'AU:ABN': '12345678901',
  'AU:TFN': '123456789',
  'TH:TIN': '0105551234567',
  'MY:TIN': 'C1234567890',
  'PH:TIN': '123456789000',
  'KR:BRN': '1234567890',
  'NZ:IRD': '12345678',
  'BD:BIN': '123456789',
  'BD:e-TIN': '123456789012',
  'PK:NTN': '1234567',
  'PK:STRN': '1234567890123',
  'NP:PAN': '123456789',
  'KH:TRN': '123456789',
  'GB:VAT': 'GB123456789',
  'DE:USTID': 'DE123456789',
  'ES:NIF': 'B12345678',
  'IT:Partita IVA': '12345678901',
  'PT:NIF': '123456789',
  'AR:CUIT': '30-12345678-9',
  'CL:RUT': '76123456-7',
  'CO:NIT': '900123456-7',
  'PE:RUC': '20123456789',
  'VE:RIF': 'J-12345678-9',
  'AE:TRN': '100123456700003',
  'BR:CNPJ': '12345678000190',
  'MX:RFC': 'ABC123456XY1',
  'BS:TRN': '123456789',
  'JM:TRN': '123456789',
  'GT:NIT': '1234567-8',
  'DO:RNC': '123456789',
  'CR:NITE': '3101123456',
  'PA:RUC': '1-123-456',
  // Postal codes
  'IN:postal': '560001',
  'SG:postal': '018956',
  'JP:postal': '100-0001',
  'CN:postal': '100000',
  'GB:postal': 'SW1A 1AA',
  'US:postal': '94105',
  'CA:postal': 'K1A 0B1',
  'NL:postal': '1012 AB',
  'IE:postal': 'D02 X285',
  'BR:postal': '01310-100',
  'PL:postal': '00-950',
  'PT:postal': '1000-001',
  'SE:postal': '114 55',
  'AR:postal': 'C1425ABC',
  'BN:postal': 'BS8811',
};

const TYPE_LISTS = { registration: REGISTRATION_NUMBER_TYPES, tax: TAX_ID_TYPES };
const DEFAULT_LABELS = { registration: 'Company registration number', tax: 'Company tax ID', personalTax: 'Personal tax ID' };
const DEFAULT_DOCUMENTS = { registration: 'Certificate of incorporation', tax: 'Tax registration certificate', personalTax: 'Personal tax ID document' };

export function isSupportedCountry(country) {
  return SUPPORTED_COUNTRY_CODES.includes(country);
}

// Value as sent to the backend: upper-case, no whitespace. Hyphens, dots and slashes are
// kept because some formats require them (e.g. Panama RUC, South Africa CIPC).
export function normalizeIdentifier(value) {
  return String(value || '').toUpperCase().replace(/\s+/g, '');
}

// Identifier types the backend accepts for this country, excluding the OTHER fallback.
// kind: 'registration' | 'tax'
export function identifierTypesFor(kind, country) {
  return (TYPE_LISTS[kind] || []).filter(type => type.country === country && type.code !== OTHER_TYPE);
}

function shortName(type) {
  // Short codes read better in a field label ("CIN or LLPIN"); internal-looking codes don't
  return /^[A-Za-z-]{2,6}$/.test(type.code) ? type.code : type.label;
}

function fullName(type) {
  const short = shortName(type);
  return short === type.label ? type.label : `${type.label} (${short})`;
}

// Label, example and document name for the field, based on the country's accepted types.
export function getIdentifierRule(kind, country) {
  const types = identifierTypesFor(kind, country);
  if (!types.length) {
    return { label: DEFAULT_LABELS[kind], example: '', document: DEFAULT_DOCUMENTS[kind], types };
  }
  const label = types.length === 1 ? fullName(types[0]) : types.map(shortName).join(' or ');
  const examples = types.map(type => EXAMPLES[`${country}:${type.code}`]).filter(Boolean);
  const document = kind === 'tax'
    ? `Document showing your ${types.map(shortName).join(' or ')}`
    : DEFAULT_DOCUMENTS[kind];
  return { label, example: examples[0] || '', examples, document, types };
}

// The backend type code for a value: the first of the country's types whose pattern
// matches, OTHER when the country has no types, or '' when nothing matches.
export function detectIdentifierType(kind, country, value) {
  const normalized = normalizeIdentifier(value);
  if (!normalized) return '';
  const types = identifierTypesFor(kind, country);
  if (!types.length) return OTHER_TYPE;
  const match = types.find(type => !type.regex || type.regex.test(normalized));
  return match ? match.code : '';
}

// Returns an error message, or '' when the backend would accept the value.
export function validateIdentifier(kind, country, value) {
  if (!normalizeIdentifier(value)) return '';
  if (kind === 'personalTax') return '';
  if (detectIdentifierType(kind, country, value)) return '';
  const rule = getIdentifierRule(kind, country);
  const examples = rule.examples && rule.examples.length ? ` For example: ${rule.examples.join(' or ')}` : '';
  return `This doesn't look like a valid ${rule.label}.${examples}`;
}

export function postalCodeExample(country) {
  return EXAMPLES[`${country}:postal`] || '';
}

// Returns an error message, or '' when the backend would accept the postal code.
export function validatePostalCode(country, value) {
  const postalCode = String(value || '').trim();
  if (!postalCode) return '';
  const pattern = POSTAL_CODE_PATTERNS[country];
  if (!pattern || pattern.test(postalCode)) return '';
  const example = postalCodeExample(country);
  return `Enter a valid postal code for this country${example ? `, for example ${example}` : ''}.`;
}
