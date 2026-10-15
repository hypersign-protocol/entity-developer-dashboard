// Company identifier types, format patterns and postal code patterns accepted by the
// backend. This is a copy of the dashboard service's
// src/customer-onboarding/constants/identifier-types.ts (the same lists live in the KYC
// service's eKyb company enum) so the form validates exactly what the API will accept.
// Keep it in sync when the backend lists change.
//
// Country codes are ISO 3166-1 alpha-2. 'XX' is the backend's "any other country".

export const SUPPORTED_COUNTRY_CODES = [
  'IN',
  'SG',
  'CN',
  'JP',
  'HK',
  'ID',
  'VN',
  'TH',
  'MY',
  'PH',
  'KR',
  'AU',
  'NZ',
  'US',
  'BD',
  'PK',
  'LK',
  'NP',
  'KH',
  'MM',
  'BN',
  'LA',
  'MN',
  'TL',
  'CA',
  'MX',
  'BS',
  'CR',
  'DO',
  'GT',
  'JM',
  'PA',
  'GB',
  'DE',
  'FR',
  'NL',
  'AT',
  'BE',
  'CH',
  'DK',
  'ES',
  'IE',
  'IT',
  'NO',
  'PL',
  'PT',
  'SE',
  'BR',
  'AR',
  'CL',
  'CO',
  'PE',
  'VE',
  'AE',
  'SA',
  'QA',
  'KW',
  'BH',
  'OM',
  'ZA',
  'NG',
  'XX',
];

export const REGISTRATION_NUMBER_TYPES = [
  // --- India ---
  {
    code: 'CIN',
    label: 'Corporate Identification Number',
    country: 'IN',
    regex: /^[A-Z]{1}\d{5}[A-Z]{2}\d{4}[A-Z]{3}\d{6}$/,
    authority: 'Ministry of Corporate Affairs (MCA)',
  },
  {
    code: 'LLPIN',
    label: 'Limited Liability Partnership Identification Number',
    country: 'IN',
    regex: /^[A-Z]{3}\d{4}$/,
    authority: 'Ministry of Corporate Affairs (MCA)',
  },

  // --- Singapore ---
  {
    code: 'UEN',
    label: 'Unique Entity Number',
    country: 'SG',
    regex: /^(\d{9}[A-Z]|[STFG]\d{7}[A-Z])$/,
    authority: 'ACRA',
  },

  // --- China ---
  {
    code: 'USCC',
    label: 'Unified Social Credit Code',
    country: 'CN',
    regex: /^[0-9A-Z]{18}$/,
    authority: 'State Administration for Market Regulation',
  },

  // --- Japan ---
  {
    code: 'HOJIN_BANGO',
    label: '法人番号 (Corporate Number)',
    country: 'JP',
    regex: /^\d{13}$/,
    authority: 'National Tax Agency',
  },

  // --- Hong Kong ---

  // --- Indonesia ---
  {
    code: 'NIB',
    label: 'Nomor Induk Berusaha',
    country: 'ID',
    regex: /^\d{13}$/,
    authority: 'OSS / BKPM',
  },

  // --- Vietnam ---
  {
    code: 'ERC',
    label: 'Enterprise Registration Certificate',
    country: 'VN',
    regex: /^\d{10}$/,
    authority: 'Ministry of Planning and Investment',
  },

  // --- Thailand ---
  {
    code: 'CRN_TH',
    label: 'Company Registration Number',
    country: 'TH',
    regex: /^\d{13}$/,
    authority: 'Department of Business Development (DBD)',
  },

  // --- Malaysia ---
  {
    code: 'ROC',
    label: 'Company Registration Number',
    country: 'MY',
    regex: /^\d{12}$/,
    authority: 'SSM (Companies Commission of Malaysia)',
  },

  // --- Philippines ---
  {
    code: 'SEC_REG_NO',
    label: 'SEC Registration Number',
    country: 'PH',
    regex: /^\d{8,10}$/,
    authority: 'Securities and Exchange Commission',
  },

  // --- South Korea ---
  {
    code: 'CRN_KR',
    label: 'Corporate Registration Number (법인등록번호)',
    country: 'KR',
    regex: /^\d{13}$/,
    authority: 'Court Registry',
  },

  // --- Australia ---
  {
    code: 'ACN',
    label: 'Australian Company Number',
    country: 'AU',
    regex: /^\d{9}$/,
    authority: 'ASIC',
  },

  // --- New Zealand ---
  {
    code: 'NZBN',
    label: 'New Zealand Business Number',
    country: 'NZ',
    regex: /^\d{13}$/,
    authority: 'Companies Office',
  },

  // --- Bangladesh ---

  // --- Pakistan ---
  {
    code: 'SECP_REG',
    label: 'SECP Company Registration Number',
    country: 'PK',
    regex: /^[A-Z]{2}\d{6}$/,
    authority: 'Securities and Exchange Commission of Pakistan',
  },

  // --- Sri Lanka ---
  {
    code: 'BRN_LK',
    label: 'Business Registration Number',
    country: 'LK',
    regex: /^\d{9}$/,
    authority: 'Registrar of Companies',
  },

  // --- Nepal ---
  {
    code: 'CRN_NP',
    label: 'Company Registration Number',
    country: 'NP',
    regex: /^\d{6,8}$/,
    authority: 'Office of Company Registrar',
  },

  // --- Cambodia ---

  // --- Myanmar ---
  {
    code: 'BRN_MM',
    label: 'Business Registration Number',
    country: 'MM',
    regex: /^\d{9}$/,
    authority: 'Directorate of Investment and Company Administration',
  },

  // --- Brunei ---
  {
    code: 'ROCN',
    label: 'Registry of Companies Number',
    country: 'BN',
    regex: /^\d{6,9}$/,
    authority: 'Registrar of Companies',
  },

  // --- Laos ---
  {
    code: 'ERN_LA',
    label: 'Enterprise Registration Number',
    country: 'LA',
    regex: /^\d{6,10}$/,
    authority: 'Ministry of Industry and Commerce',
  },

  // --- Mongolia ---
  {
    code: 'CRN_MN',
    label: 'Company Registration Number',
    country: 'MN',
    regex: /^\d{7}$/,
    authority: 'General Authority for State Registration',
  },

  // --- Timor-Leste ---
  {
    code: 'NIPC_TL',
    label: 'Business Identification Number',
    country: 'TL',
    regex: /^\d{9}$/,
    authority: 'National Directorate of Business Registration',
  },
  {
    code: 'CRN_UK',
    label: 'Company Registration Number',
    country: 'GB',
    regex: /^[A-Z0-9]{8}$/,
    authority: 'Companies House',
  },
  {
    code: 'HRB',
    label: 'Commercial Register Number',
    country: 'DE',
    regex: /^[A-Z]{1,3}\s?\d+$/,
    authority: 'Handelsregister',
  },
  {
    code: 'SIREN',
    label: 'SIREN Number',
    country: 'FR',
    regex: /^\d{9}$/,
    authority: 'INSEE',
  },
  {
    code: 'SIRET',
    label: 'SIRET Number',
    country: 'FR',
    regex: /^\d{14}$/,
    authority: 'INSEE',
  },
  {
    code: 'KVK',
    label: 'Chamber of Commerce Number',
    country: 'NL',
    regex: /^\d{8}$/,
    authority: 'Dutch Chamber of Commerce',
  },
  {
    code: 'CRO_IE',
    label: 'Company Registration Number',
    country: 'IE',
    regex: /^\d{1,6}[A-Z]?$/i,
    authority: 'Companies Registration Office',
  },
  {
    code: 'CHE_CH',
    label: 'Swiss Company UID',
    country: 'CH',
    regex: /^CHE-?\d{3}\.?\d{3}\.?\d{3}$/i,
    authority: 'Federal Statistical Office',
  },
  {
    code: 'CBE_BE',
    label: 'Enterprise Number',
    country: 'BE',
    regex: /^\d{4}\.?\d{3}\.?\d{3}$/,
    authority: 'Crossroads Bank for Enterprises',
  },
  {
    code: 'FN_AT',
    label: 'Firmenbuch Number',
    country: 'AT',
    regex: /^FN\s?\d+[A-Z]?$/i,
    authority: 'Firmenbuch',
  },
  {
    code: 'ORG_SE',
    label: 'Organisation Number',
    country: 'SE',
    regex: /^\d{6}-?\d{4}$/,
    authority: 'Bolagsverket',
  },
  {
    code: 'ORG_NO',
    label: 'Organisation Number',
    country: 'NO',
    regex: /^\d{9}$/,
    authority: 'Bronnoysund Register Centre',
  },
  {
    code: 'CVR_DK',
    label: 'Central Business Register Number',
    country: 'DK',
    regex: /^\d{8}$/,
    authority: 'Danish Business Authority',
  },
  {
    code: 'KRS_PL',
    label: 'National Court Register Number',
    country: 'PL',
    regex: /^\d{10}$/,
    authority: 'Ministry of Justice',
  },
  {
    code: 'CR_SA',
    label: 'Commercial Registration Number',
    country: 'SA',
    regex: /^\d{10}$/,
    authority: 'Ministry of Commerce',
  },
  {
    code: 'CR_QA',
    label: 'Commercial Registration Number',
    country: 'QA',
    regex: /^\d{6,10}$/,
    authority: 'Ministry of Commerce and Industry',
  },
  {
    code: 'CR_KW',
    label: 'Commercial Registration Number',
    country: 'KW',
    regex: /^\d{6,10}$/,
    authority: 'Ministry of Commerce and Industry',
  },
  {
    code: 'CR_BH',
    label: 'Commercial Registration Number',
    country: 'BH',
    regex: /^\d{8,10}$/,
    authority: 'Ministry of Industry and Commerce',
  },
  {
    code: 'CR_OM',
    label: 'Commercial Registration Number',
    country: 'OM',
    regex: /^\d{7,10}$/,
    authority: 'Ministry of Commerce, Industry and Investment Promotion',
  },
  {
    code: 'CIPC',
    label: 'Company Registration Number',
    country: 'ZA',
    regex: /^\d{4}\/\d{6}\/\d{2}$/,
    authority: 'Companies and Intellectual Property Commission',
  },
  {
    code: 'RCN',
    label: 'Corporate Affairs Commission Number',
    country: 'NG',
    regex: /^\d{1,7}$/,
    authority: 'Corporate Affairs Commission',
  },

  // --- Fallback ---
  {
    code: 'OTHER',
    label: 'Other',
    country: 'XX',
  },
];

export const TAX_ID_TYPES = [
  {
    code: 'PAN',
    label: 'Permanent Account Number',
    country: 'IN',
    regex: /^[A-Z]{5}\d{4}[A-Z]$/,
    authority: 'Income Tax Department, Government of India',
  },
  {
    code: 'GSTIN',
    label: 'Goods and Services Tax Identification Number',
    country: 'IN',
    regex: /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/,
    authority: 'Goods and Services Tax Network (GSTN)',
  },
  {
    code: 'BRN',
    label: 'Business Registration Number',
    country: 'HK',
    regex: /^\d{8}$/,
    authority: 'Inland Revenue Department',
  },
  {
    code: 'EIN',
    label: 'Employer Identification Number',
    country: 'US',
    regex: /^\d{2}-?\d{7}$/,
    authority: 'Internal Revenue Service (IRS)',
  },
  {
    code: 'BN',
    label: 'Business Number',
    country: 'CA',
    regex: /^\d{9}$/,
    authority: 'Canada Revenue Agency (CRA)',
  },
  {
    code: 'ABN',
    label: 'Australian Business Number',
    country: 'AU',
    regex: /^\d{11}$/,
    authority: 'Australian Business Register',
  },
  {
    code: 'TFN',
    label: 'Tax File Number',
    country: 'AU',
    regex: /^\d{9}$/,
    authority: 'Australian Taxation Office (ATO)',
  },
  {
    code: 'TIN',
    label: 'Tax Identification Number',
    country: 'TH',
    regex: /^\d{13}$/,
    authority: 'Revenue Department',
  },
  {
    code: 'TIN',
    label: 'Tax Identification Number',
    country: 'MY',
    regex: /^C\d{10,11}$/,
    authority: 'Inland Revenue Board of Malaysia (HASiL)',
  },
  {
    code: 'TIN',
    label: 'Taxpayer Identification Number',
    country: 'PH',
    regex: /^\d{9,12}$/,
    authority: 'Bureau of Internal Revenue (BIR)',
  },
  {
    code: 'BRN',
    label: 'Business Registration Number',
    country: 'KR',
    regex: /^\d{10}$/,
    authority: 'National Tax Service',
  },
  {
    code: 'IRD',
    label: 'Inland Revenue Number',
    country: 'NZ',
    regex: /^\d{8,9}$/,
    authority: 'Inland Revenue',
  },
  {
    code: 'BIN',
    label: 'Business Identification Number',
    country: 'BD',
    regex: /^\d{9}$/,
    authority: 'National Board of Revenue',
  },
  {
    code: 'e-TIN',
    label: 'Taxpayer Identification Number',
    country: 'BD',
    regex: /^\d{12}$/,
    authority: 'National Board of Revenue',
  },
  {
    code: 'NTN',
    label: 'National Tax Number',
    country: 'PK',
    regex: /^\d{7,9}$/,
    authority: 'Federal Board of Revenue',
  },
  {
    code: 'STRN',
    label: 'Sales Tax Registration Number',
    country: 'PK',
    regex: /^\d{13}$/,
    authority: 'Federal Board of Revenue',
  },
  {
    code: 'PAN',
    label: 'Permanent Account Number',
    country: 'NP',
    regex: /^\d{9}$/,
    authority: 'Inland Revenue Department',
  },
  {
    code: 'TRN',
    label: 'Taxpayer Registration Number',
    country: 'KH',
    regex: /^\d{9}$/,
    authority: 'General Department of Taxation',
  },
  {
    code: 'VAT',
    label: 'VAT Registration Number',
    country: 'GB',
    regex: /^GB\d{9}(?:\d{3})?$/,
    authority: 'HM Revenue & Customs (HMRC)',
  },
  {
    code: 'USTID',
    label: 'VAT Identification Number',
    country: 'DE',
    regex: /^DE\d{9}$/,
    authority: 'Federal Central Tax Office',
  },
  {
    code: 'NIF',
    label: 'Tax Identification Number',
    country: 'ES',
    regex: /^[A-Z0-9]\d{7}[A-Z0-9]$/i,
    authority: 'Agencia Estatal de Administración Tributaria',
  },
  {
    code: 'Partita IVA',
    label: 'Partita IVA',
    country: 'IT',
    regex: /^\d{11}$/,
    authority: 'Agenzia delle Entrate',
  },
  {
    code: 'NIF',
    label: 'Tax Identification Number',
    country: 'PT',
    regex: /^\d{9}$/,
    authority: 'Autoridade Tributária e Aduaneira',
  },
  {
    code: 'CUIT',
    label: 'Tax Identification Number (CUIT)',
    country: 'AR',
    regex: /^\d{2}-?\d{8}-?\d{1}$/,
    authority: 'Administración Federal de Ingresos Públicos',
  },
  {
    code: 'RUT',
    label: 'Tax Identification Number (RUT)',
    country: 'CL',
    regex: /^\d{7,8}-?[0-9K]$/i,
    authority: 'Servicio de Impuestos Internos',
  },
  {
    code: 'NIT',
    label: 'Tax Identification Number (NIT)',
    country: 'CO',
    regex: /^\d{9,10}-?\d?$/,
    authority: 'Dirección de Impuestos y Aduanas Nacionales (DIAN)',
  },
  {
    code: 'RUC',
    label: 'Taxpayer Registry Number (RUC)',
    country: 'PE',
    regex: /^\d{11}$/,
    authority:
      'Superintendencia Nacional de Aduanas y de Administración Tributaria',
  },
  {
    code: 'RIF',
    label: 'Tax Information Registry Number (RIF)',
    country: 'VE',
    regex: /^[JGVEP]-?\d{8}-?\d$/i,
    authority:
      'Servicio Nacional Integrado de Administración Aduanera y Tributaria',
  },
  {
    code: 'TRN',
    label: 'Tax Registration Number',
    country: 'AE',
    regex: /^\d{15}$/,
    authority: 'Federal Tax Authority',
  },
  {
    code: 'CNPJ',
    label: 'National Registry of Legal Entities (CNPJ)',
    country: 'BR',
    regex: /^\d{14}$/,
    authority: 'Receita Federal do Brasil',
  },
  {
    code: 'RFC',
    label: 'Federal Taxpayer Registry Number (RFC)',
    country: 'MX',
    regex: /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/,
    authority: 'Servicio de Administración Tributaria (SAT)',
  },
  {
    code: 'TRN',
    label: 'Taxpayer Registration Number',
    country: 'BS',
    regex: /^\d{9}$/,
    authority: 'Department of Inland Revenue',
  },
  {
    code: 'TRN',
    label: 'Taxpayer Registration Number',
    country: 'JM',
    regex: /^\d{9}$/,
    authority: 'Tax Administration Jamaica',
  },
  {
    code: 'NIT',
    label: 'Taxpayer Identification Number (NIT)',
    country: 'GT',
    regex: /^\d{1,8}-?[0-9K]$/i,
    authority: 'Superintendencia de Administración Tributaria',
  },
  {
    code: 'RNC',
    label: 'National Taxpayer Registry Number (RNC)',
    country: 'DO',
    regex: /^\d{9}$/,
    authority: 'Dirección General de Impuestos Internos',
  },
  {
    code: 'NITE',
    label: 'Tax Identification Number',
    country: 'CR',
    regex: /^\d{10}$/,
    authority: 'Ministerio de Hacienda',
  },
  {
    code: 'RUC',
    label: 'Taxpayer Registry Number (RUC)',
    country: 'PA',
    regex: /^\d{1,2}-\d{1,4}-\d{1,6}$/,
    authority: 'Dirección General de Ingresos',
  },
  {
    code: 'OTHER',
    label: 'Other',
    country: 'XX',
  },
];

// Reference: https://www.geopostcodes.com/blog/international-zip-code-validation/
export const POSTAL_CODE_PATTERNS = {
  IN: /^\d{6}$/,
  SG: /^\d{6}$/,
  JP: /^\d{3}-\d{4}$/,
  CN: /^\d{6}$/,
  ID: /^\d{5}$/,
  VN: /^\d{5}$/,
  TH: /^\d{5}$/,
  MY: /^\d{5}$/,
  PH: /^\d{4}$/,
  KR: /^\d{5}$/,
  AU: /^\d{4}$/,
  NZ: /^\d{4}$/,
  BD: /^\d{4}$/,
  PK: /^\d{5}$/,
  LK: /^\d{5}$/,
  NP: /^\d{5}$/,
  KH: /^\d{6}$/,
  MM: /^\d{7}$/,
  BN: /^[A-Z]{2}\d{4}$/,
  LA: /^\d{5}$/,
  MN: /^\d{5}$/,
  GB: /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i,
  DE: /^\d{5}$/,
  FR: /^\d{5}$/,
  NL: /^\d{4}\s?[A-Z]{2}$/i,
  AT: /^\d{4}$/,
  BE: /^\d{4}$/,
  CH: /^\d{4}$/,
  DK: /^\d{4}$/,
  ES: /^\d{5}$/,
  IE: /^[A-Z0-9]{3}\s?[A-Z0-9]{4}$/i,
  IT: /^\d{5}$/,
  NO: /^\d{4}$/,
  PL: /^\d{2}-\d{3}$/,
  PT: /^\d{4}-\d{3}$/,
  SE: /^\d{3}\s?\d{2}$/,
  US: /^\d{5}(-\d{4})?$/,
  CA: /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i,
  MX: /^\d{5}$/,
  BR: /^\d{5}-?\d{3}$/,
  AR: /^[A-Z]?\d{4}[A-Z]{3}$/i,
  CL: /^\d{7}$/,
  CO: /^\d{6}$/,
  PE: /^\d{5}$/,
  VE: /^\d{4}$/,
  AE: /^\d{5}$/,
  SA: /^\d{5}$/,
  QA: /^\d{5}$/,
  KW: /^\d{5}$/,
  BH: /^\d{3,4}$/,
  OM: /^\d{3}$/,
  ZA: /^\d{4}$/,
  NG: /^\d{6}$/,
  XX: /.*/, // accept anything
};
