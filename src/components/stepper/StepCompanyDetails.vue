<template>
  <form class="form-card" novalidate @submit.prevent="submitStep">
    <div class="card-heading">
      <h2>Organization details</h2>
      <p>A few essentials to create your workspace. You can add branding and social profiles here.</p>
    </div>

    <fieldset class="type-fieldset">
      <legend>Organization type</legend>
      <div class="type-grid">
        <button
          v-for="(label, key) in BUSINESS_TYPE"
          :key="key"
          type="button"
          class="type-option"
          :class="{ 'is-selected': localCompany.type === key }"
          @click="localCompany.type = key"
        >
          <span class="radio-dot"></span>
          <span>
            <strong>{{ label }}</strong>
            <small>{{ key === 'BUSINESS' ? 'A registered company or commercial service' : 'A community, network, or noncommercial project' }}</small>
          </span>
        </button>
      </div>
    </fieldset>

    <div class="field-grid">
      <div class="field-group">
        <label>{{ localCompany.type === 'COMMUNITY' ? 'Community name' : 'Organization name' }} <em>*</em></label>
        <input v-model.trim="localCompany.name" type="text" :placeholder="localCompany.type === 'COMMUNITY' ? 'e.g. Acme Labs' : 'Organization name'" />
        <span v-if="errors.name" class="field-error">{{ errors.name }}</span>
      </div>
      <div class="field-group">
        <label>Country or region <em>*</em></label>
        <select v-model="localCompany.country">
          <option value="" disabled>Select a country</option>
          <option v-for="country in countryOptions" :key="country.value" :value="country.value">{{ country.text }}</option>
        </select>
        <span v-if="errors.country" class="field-error">{{ errors.country }}</span>
      </div>
      <div class="field-group">
        <label>Work email <em>*</em></label>
        <input v-model.trim="localCompany.contact_email" type="email" placeholder="name@organization.com" />
        <small>We’ll send the review decision here.</small>
        <span v-if="errors.email" class="field-error">{{ errors.email }}</span>
      </div>
      <div class="field-group">
        <label>Website or domain</label>
        <input v-model.trim="localCompany.domain" type="text" placeholder="example.com" />
        <small>Adding a domain does not verify ownership.</small>
      </div>
    </div>

    <div class="logo-section">
      <div>
        <label>Organization logo <em>*</em></label>
        <p>Upload the logo used to identify your organization.</p>
        <span v-if="errors.logo" class="field-error">{{ errors.logo }}</span>
      </div>
      <LogoUploader v-model="localCompany.logo" />
    </div>

    <section class="form-section">
      <div class="section-label">Additional details</div>
      <div class="field-grid">
        <div v-if="localCompany.type === 'BUSINESS'" class="field-group">
          <label>Registration number <em>*</em></label>
          <input v-model.trim="localCompany.registration_number" type="text" placeholder="Company registration ID" />
          <span v-if="errors.registration" class="field-error">{{ errors.registration }}</span>
        </div>
        <div class="field-group">
          <label>Contact phone <em v-if="localCompany.type === 'BUSINESS'">*</em></label>
          <div class="phone-control">
            <span v-if="selectedCallingCode">{{ selectedCallingCode }}</span>
            <input v-model.trim="localCompany.phone_no" type="tel" placeholder="Include country code" />
          </div>
          <span v-if="errors.phone" class="field-error">{{ errors.phone }}</span>
        </div>
      </div>
    </section>

    <section class="form-section social-section">
      <div class="section-label">Social profiles · optional</div>
      <div class="field-grid social-grid">
        <div class="field-group">
          <label>Twitter / X</label>
          <input v-model.trim="localCompany.twitterUrl" type="url" placeholder="https://x.com/organization" />
          <span v-if="errors.twitter" class="field-error">{{ errors.twitter }}</span>
        </div>
        <div class="field-group">
          <label>LinkedIn</label>
          <input v-model.trim="localCompany.linkedinUrl" type="url" placeholder="https://linkedin.com/company/organization" />
          <span v-if="errors.linkedin" class="field-error">{{ errors.linkedin }}</span>
        </div>
        <div class="field-group">
          <label>Telegram</label>
          <input v-model.trim="localCompany.telegramUrl" type="url" placeholder="https://t.me/organization" />
          <span v-if="errors.telegram" class="field-error">{{ errors.telegram }}</span>
        </div>
      </div>
    </section>

    <div v-if="hasErrors" class="form-error-summary">Please correct the highlighted fields before continuing.</div>
    <footer class="form-footer">
      <span><em>*</em> Required to continue</span>
      <button type="submit" class="primary-button">Continue <span aria-hidden="true">→</span></button>
    </footer>
  </form>
</template>


<style scoped>
.form-card { padding: 24px; border: 1px solid #dfe5ee; border-radius: 8px; background: #fff; }
.card-heading h2 { margin: 0 0 5px; color: #1d2939; font-size: 18px; font-weight: 700; }
.card-heading p, .logo-section p { margin: 0; color: #718096; font-size: 13px; }
.type-fieldset { margin: 20px 0; padding: 0; border: 0; }
.type-fieldset legend, label { margin-bottom: 7px; color: #344054; font-size: 12px; font-style: normal; font-weight: 700; }
.type-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.type-option { display: flex; gap: 10px; min-height: 64px; padding: 13px; border: 1px solid #d8e0ea; border-radius: 6px; background: #fff; color: #344054; text-align: left; }
.type-option.is-selected { border-color: #2f6fec; background: #f7f9ff; box-shadow: 0 0 0 1px #2f6fec; }
.radio-dot { flex: 0 0 auto; width: 14px; height: 14px; margin-top: 1px; border: 1px solid #aeb8c6; border-radius: 50%; }
.is-selected .radio-dot { border: 4px solid #2f6fec; }
.type-option strong, .type-option small { display: block; }
.type-option strong { font-size: 13px; }
.type-option small { margin-top: 3px; color: #7c8798; font-size: 11px; line-height: 1.4; }
.field-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px 14px; }
.field-group { display: flex; min-width: 0; flex-direction: column; }
.field-group input, .field-group select, .phone-control { width: 100%; height: 38px; padding: 0 11px; border: 1px solid #d7dfe9; border-radius: 5px; background: #fff; color: #243044; font-size: 13px; outline: none; }
.field-group input:focus, .field-group select:focus, .phone-control:focus-within { border-color: #2f6fec; box-shadow: 0 0 0 2px rgba(47,111,236,.12); }
.field-group small { margin-top: 5px; color: #8a95a5; font-size: 11px; }
em, .field-error, .form-error-summary { color: #d92d20; font-style: normal; }
.field-error { margin-top: 5px; font-size: 12px; }
.logo-section { display: flex; align-items: center; justify-content: space-between; gap: 20px; margin-top: 18px; padding: 14px; border: 1px solid #e5eaf1; border-radius: 6px; background: #fafbfd; }
.form-section { margin-top: 22px; padding-top: 18px; border-top: 1px solid #e8edf3; }
.section-label { margin-bottom: 14px; color: #66758a; font-size: 11px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; }
.social-grid { grid-template-columns: repeat(3, 1fr); }
.phone-control { display: flex; align-items: center; gap: 7px; }
.phone-control span { color: #5d6b7e; font-size: 13px; }
.phone-control input { height: 32px; padding: 0; border: 0; box-shadow: none !important; }
.form-error-summary { margin-top: 18px; font-size: 12px; }
.form-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 24px; padding-top: 18px; border-top: 1px solid #e8edf3; }
.form-footer > span { color: #8a95a5; font-size: 11px; }
.primary-button { min-width: 104px; height: 38px; padding: 0 16px; border: 0; border-radius: 5px; background: #6c757d; color: #fff; font-size: 12px; font-weight: 700; }
.primary-button:hover { background: #5a6268; }
@media (max-width: 650px) {
  .form-card { padding: 18px; }
  .field-grid, .type-grid, .social-grid { grid-template-columns: 1fr; }
}
</style>

<script>

const CallingCodeMap = {
  // --- Asia & Oceania ---
  AFG: "+93",  AUS: "+61",  BGD: "+880", BRN: "+673", KHM: "+855", 
  CHN: "+86",  HKG: "+852", IND: "+91",  IDN: "+62",  JPN: "+81",  
  LAO: "+856", MYS: "+60",  MNG: "+976", MMR: "+95",  NPL: "+977", 
  NZL: "+64",  PAK: "+92",  PHL: "+63",  SGP: "+65",  KOR: "+82",  
  LKA: "+94",  TWN: "+886", THA: "+66",  TLS: "+670", VNM: "+84",

  // --- Americas ---
  ARG: "+54",  BRA: "+55",  CAN: "+1",   CHL: "+56",  COL: "+57",  
  CRI: "+506", CUB: "+53",  DOM: "+1",   ECU: "+593", GTM: "+502", 
  JAM: "+1",   MEX: "+52",  PAN: "+507", PER: "+51",  PRI: "+1",   
  URY: "+598", VEN: "+58",  USA: "+1",

  // --- Europe ---
  AUT: "+43",  BEL: "+32",  BGR: "+359", HRV: "+385", CYP: "+357", 
  CZE: "+420", DNK: "+45",  EST: "+372", FIN: "+358", FRA: "+33",  
  DEU: "+49",  GRC: "+30",  HUN: "+36",  ISL: "+354", IRL: "+353", 
  ITA: "+39",  LVA: "+371", LIE: "+423", LTU: "+370", LUX: "+352", 
  MLT: "+356", NLD: "+31",  NOR: "+47",  POL: "+48",  PRT: "+351", 
  ROU: "+40",  RUS: "+7",   SVK: "+421", SVN: "+386", ESP: "+34",  
  SWE: "+46",  CHE: "+41",  TUR: "+90",  UKR: "+380", GBR: "+44",

  // --- Middle East & Central Asia ---
  ARM: "+374", AZE: "+994", BHR: "+973", GEO: "+995", IRN: "+98",  
  IRQ: "+964", ISR: "+972", JOR: "+962", KWT: "+965", LBN: "+961", 
  OMN: "+968", QAT: "+966", SAU: "+966", SYR: "+963", ARE: "+971", 
  UZB: "+998", YEM: "+967",

  // --- Africa ---
  DZA: "+213", AGO: "+244", BWA: "+267", CMR: "+237", EGY: "+20",  
  ETH: "+251", GHA: "+233", KEN: "+254", MAR: "+212", MUS: "+230", 
  NAM: "+264", NGA: "+234", RWA: "+250", SEN: "+221", ZAF: "+27",  
  TZA: "+255", TUN: "+216", UGA: "+256", ZMB: "+260", ZWE: "+263",

  // --- Fallback ---
  XXX: ""
};
export const PhoneRegexMap = {
  // --- Asia & Oceania ---
  AFG: /^[2-7]\d{8}$/,                   // Afghanistan
  AUS: /^4\d{8}$/,                       // Australia (Mobile)
  BGD: /^1[3-9]\d{8}$/,                  // Bangladesh
  BRN: /^[278]\d{6}$/,                   // Brunei
  KHM: /^[1-9]\d{7,8}$/,                 // Cambodia
  CHN: /^1[3-9]\d{9}$/,                  // China
  HKG: /^[4-9]\d{7}$/,                   // Hong Kong
  IND: /^[6-9]\d{9}$/,                   // India
  IDN: /^8[1-9]\d{7,10}$/,               // Indonesia
  JPN: /^[789]0\d{8}$/,                  // Japan (Mobile)
  LAO: /^20\d{8}$/,                      // Laos
  MYS: /^1[0-9]\d{7,8}$/,                // Malaysia
  MNG: /^[89]\d{7}$/,                    // Mongolia
  MMR: /^9\d{7,9}$/,                     // Myanmar
  NPL: /^9[6-8]\d{8}$/,                  // Nepal
  NZL: /^2\d{7,9}$/,                     // New Zealand
  PAK: /^3\d{9}$/,                       // Pakistan
  PHL: /^9\d{9}$/,                       // Philippines
  SGP: /^[89]\d{7}$/,                    // Singapore
  KOR: /^10\d{7,8}$/,                    // South Korea
  LKA: /^7\d{8}$/,                       // Sri Lanka
  TWN: /^9\d{8}$/,                       // Taiwan
  THA: /^[689]\d{8}$/,                   // Thailand
  TLS: /^7[78]\d{6}$/,                   // Timor-Leste
  VNM: /^(3|5|7|8|9)[0-9]{8}$/,          // Vietnam

  // --- Americas ---
  ARG: /^(9\d{2})?\d{7}$/,               // Argentina
  BRA: /^[1-9]{2}9?\d{8}$/,              // Brazil
  CAN: /^\d{10}$/,                       // Canada
  CHL: /^9\d{8}$/,                       // Chile
  COL: /^3\d{9}$/,                       // Colombia
  CRI: /^[2-8]\d{7}$/,                   // Costa Rica
  CUB: /^5\d{7}$/,                       // Cuba
  DOM: /^\d{10}$/,                       // Dominican Republic
  ECU: /^9\d{8}$/,                       // Ecuador
  GTM: /^[1-9]\d{7}$/,                   // Guatemala
  JAM: /^\d{10}$/,                       // Jamaica
  MEX: /^[1-9]\d{9}$/,                   // Mexico
  PAN: /^[68]\d{7}$/,                    // Panama
  PER: /^9\d{8}$/,                       // Peru
  PRI: /^\d{10}$/,                       // Puerto Rico
  URY: /^9\d{7}$/,                       // Uruguay
  VEN: /^[42]\d{9}$/,                    // Venezuela
  USA: /^\d{10}$/,                       // United States

  // --- Europe ---
  AUT: /^6\d{4,12}$/,                    // Austria
  BEL: /^4\d{8}$/,                       // Belgium
  BGR: /^8[7-9]\d{7}$/,                  // Bulgaria
  HRV: /^9\d{7,8}$/,                     // Croatia
  CYP: /^9\d{7}$/,                       // Cyprus
  CZE: /^[1-9]\d{8}$/,                   // Czech Republic
  DNK: /^[1-9]\d{7}$/,                   // Denmark
  EST: /^[58]\d{6,7}$/,                  // Estonia
  FIN: /^4\d{5,10}$/,                    // Finland
  FRA: /^[67]\d{8}$/,                    // France
  DEU: /^1[5-7]\d{8,9}$/,                // Germany
  GRC: /^69\d{8}$/,                      // Greece
  HUN: /^(20|30|31|70)\d{7}$/,           // Hungary
  ISL: /^[1-9]\d{6}$/,                   // Iceland
  IRL: /^8[3-9]\d{7}$/,                  // Ireland
  ITA: /^3\d{8,9}$/,                     // Italy
  LVA: /^2\d{7}$/,                       // Latvia
  LIE: /^[1-9]\d{6}$/,                   // Liechtenstein
  LTU: /^6\d{7}$/,                       // Lithuania
  LUX: /^6[269]1\d{6}$/,                 // Luxembourg
  MLT: /^[79]\d{7}$/,                    // Malta
  NLD: /^6\d{8}$/,                       // Netherlands
  NOR: /^[49]\d{7}$/,                    // Norway
  POL: /^[1-9]\d{8}$/,                   // Poland
  PRT: /^9[1236]\d{7}$/,                 // Portugal
  ROU: /^7\d{8}$/,                       // Romania
  RUS: /^9\d{9}$/,                       // Russia
  SVK: /^9\d{8}$/,                       // Slovakia
  SVN: /^[3-7]\d{7}$/,                   // Slovenia
  ESP: /^[67]\d{8}$/,                    // Spain
  SWE: /^7\d{8}$/,                       // Sweden
  CHE: /^7[4-9]\d{7}$/,                  // Switzerland
  TUR: /^5\d{9}$/,                       // Turkey
  UKR: /^\d{9}$/,                        // Ukraine
  GBR: /^7\d{9}$/,                       // United Kingdom

  // --- Middle East & Africa ---
  ARE: /^5[02456]\d{7}$/,                // UAE
  EGY: /^1[0125]\d{8}$/,                 // Egypt
  KEN: /^[71]\d{8}$/,                    // Kenya
  NGA: /^[789][01]\d{8}$/,               // Nigeria
  SAU: /^5\d{8}$/,                       // Saudi Arabia
  ZAF: /^[1-9]\d{8}$/,                   // South Africa

  // Fallback for others
  XXX: /^\d{4,15}$/
};

import { mapGetters } from 'vuex/dist/vuex.common.js';
import LogoUploader from "../element/LogoUploader.vue";
export default {
  name: "StepCompanyDetails",
  props: ["company"],
  data() {
    return {
      BUSINESS_TYPE: {
        BUSINESS: "Business",
        COMMUNITY: "Community",
      },
      COUNTRY_OPTIONS: {
      // --- Asia & Oceania ---
      AFG: "Afghanistan", AUS: "Australia", BGD: "Bangladesh", BRN: "Brunei", 
      KHM: "Cambodia", CHN: "China", HKG: "Hong Kong", IND: "India", 
      IDN: "Indonesia", JPN: "Japan", LAO: "Laos", MYS: "Malaysia", 
      MNG: "Mongolia", MMR: "Myanmar", NPL: "Nepal", NZL: "New Zealand", 
      PAK: "Pakistan", PHL: "Philippines", SGP: "Singapore", KOR: "South Korea", 
      LKA: "Sri Lanka", TWN: "Taiwan", THA: "Thailand", TLS: "Timor-Leste", 
      VNM: "Vietnam",

      // --- Americas ---
      ARG: "Argentina", BRA: "Brazil", CAN: "Canada", CHL: "Chile", 
      COL: "Colombia", CRI: "Costa Rica", CUB: "Cuba", DOM: "Dominican Republic", 
      ECU: "Ecuador", GTM: "Guatemala", JAM: "Jamaica", MEX: "Mexico", 
      PAN: "Panama", PER: "Peru", PRI: "Puerto Rico", URY: "Uruguay", 
      VEN: "Venezuela", USA: "United States",

      // --- Europe ---
      AUT: "Austria", BEL: "Belgium", BGR: "Bulgaria", HRV: "Croatia", 
      CYP: "Cyprus", CZE: "Czech Republic", DNK: "Denmark", EST: "Estonia", 
      FIN: "Finland", FRA: "France", DEU: "Germany", GRC: "Greece", 
      HUN: "Hungary", ISL: "Iceland", IRL: "Ireland", ITA: "Italy", 
      LVA: "Latvia", LIE: "Liechtenstein", LTU: "Lithuania", LUX: "Luxembourg", 
      MLT: "Malta", NLD: "Netherlands", NOR: "Norway", POL: "Poland", 
      PRT: "Portugal", ROU: "Romania", RUS: "Russia", SVK: "Slovakia", 
      SVN: "Slovenia", ESP: "Spain", SWE: "Sweden", CHE: "Switzerland", 
      TUR: "Turkey", UKR: "Ukraine", GBR: "United Kingdom",

      // --- Middle East & Central Asia ---
      ARM: "Armenia", AZE: "Azerbaijan", BHR: "Bahrain", GEO: "Georgia", 
      IRN: "Iran", IRQ: "Iraq", ISR: "Israel", JOR: "Jordan", 
      KWT: "Kuwait", LBN: "Lebanon", OMN: "Oman", QAT: "Qatar", 
      SAU: "Saudi Arabia", SYR: "Syria", ARE: "United Arab Emirates", 
      UZB: "Uzbekistan", YEM: "Yemen",

      // --- Africa ---
      DZA: "Algeria", AGO: "Angola", BWA: "Botswana", CMR: "Cameroon", 
      EGY: "Egypt", ETH: "Ethiopia", GHA: "Ghana", KEN: "Kenya", 
      MAR: "Morocco", MUS: "Mauritius", NAM: "Namibia", NGA: "Nigeria", 
      RWA: "Rwanda", SEN: "Senegal", ZAF: "South Africa", TZA: "Tanzania", 
      TUN: "Tunisia", UGA: "Uganda", ZMB: "Zambia", ZWE: "Zimbabwe",

      // --- Fallback ---
      XXX: "Other"
      },
      localCompany: {
        ...this.company,
        service_types: this.company.service_types || [],
      },
      errors: {},
    };
  },
  components: {
    LogoUploader,
  },
  computed: {
    ...mapGetters('mainStore', ['getUserDetails']),
    selectedCallingCode() {
      return CallingCodeMap[this.localCompany.country] || '';
    },
    countryOptions() {
      return Object.entries(this.COUNTRY_OPTIONS).map(([value, text]) => ({ value, text }));
    },
    hasErrors() {
      return Object.keys(this.errors).length > 0;
    },
  },

  mounted() {
    if (!this.localCompany.contact_email && this.getUserDetails?.email) {
      this.localCompany.contact_email = this.getUserDetails.email;
    }
  },

  methods: {
    submitStep() {
      const c = this.localCompany;
      const errors = {};
      if (!c.name?.trim()) errors.name = `Enter your ${c.type === 'COMMUNITY' ? 'community' : 'organization'} name.`;
      if (!c.country) errors.country = 'Select a country or region.';
      if (!c.logo?.trim()) errors.logo = 'Upload your organization logo.';
      if (c.type === 'BUSINESS' && !c.registration_number?.trim()) {
        errors.registration = 'Enter your company registration number.';
      }
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(c.contact_email || '')) errors.email = 'Enter a valid work email address.';
      if (c.type === 'BUSINESS' && !c.phone_no?.trim()) {
        errors.phone = 'Enter a contact phone number.';
      } else if (c.phone_no && !this.isPhoneNumberValid()) {
        errors.phone = `Enter a valid phone number${c.country ? ` for ${this.COUNTRY_OPTIONS[c.country]}` : ''}.`;
      }
      if (c.twitterUrl && !/^https?:\/\/(twitter\.com|x\.com)\/[A-Za-z0-9_]+\/?$/.test(c.twitterUrl.trim()))
        errors.twitter = 'Enter a valid Twitter/X profile URL.';
      if (c.telegramUrl && !/^https?:\/\/(t\.me|telegram\.me)\/[A-Za-z0-9_]+\/?$/.test(c.telegramUrl.trim()))
        errors.telegram = 'Enter a valid Telegram profile URL.';
      if (c.linkedinUrl && !/^https?:\/\/(www\.)?linkedin\.com\/(in|company)\/[A-Za-z0-9_-]+\/?$/.test(c.linkedinUrl.trim()))
        errors.linkedin = 'Enter a valid LinkedIn profile URL.';

      this.errors = errors;
      if (Object.keys(errors).length === 0) {
        this.$emit('update:company', { ...this.localCompany });
        this.$emit('next-step');
      }
    },
    isPhoneNumberValid() {
      const c = this.localCompany;
      const phone = c.phone_no.trim();
      const rule = PhoneRegexMap[c.country];
      return rule ? rule.test(phone) : /^\+?\d{4,15}$/.test(phone);
    },
  },
};
</script>
