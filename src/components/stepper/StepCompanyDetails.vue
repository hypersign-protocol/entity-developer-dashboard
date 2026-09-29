<template>
  <form class="form-card" novalidate @submit.prevent="submitStep">
    <header class="card-heading"><h2>Organization details</h2></header>

    <div class="field-grid primary-fields">
      <div class="field-group">
        <label for="organization-name">Organization name <em>*</em></label>
        <input id="organization-name" v-model.trim="localCompany.name" type="text" placeholder="Organization name" autocomplete="organization" />
        <span v-if="errors.name" class="field-error">{{ errors.name }}</span>
      </div>
      <div class="field-group">
        <label for="organization-country">Country or region <em>*</em></label>
        <div class="select-control">
          <select id="organization-country" v-model="localCompany.country" autocomplete="country">
            <option value="" disabled>Select a country</option>
            <option v-for="country in countryOptions" :key="country.value" :value="country.value">{{ country.text }}</option>
          </select>
          <i class="mdi mdi-chevron-down" aria-hidden="true"></i>
        </div>
        <small v-if="isDetectingCountry">Detecting your country…</small>
        <span v-if="errors.country" class="field-error">{{ errors.country }}</span>
      </div>
      <div class="field-group">
        <label for="work-email">Work email <em>*</em></label>
        <div class="input-with-icon">
          <i class="mdi mdi-email-outline" aria-hidden="true"></i>
          <input id="work-email" v-model.trim="localCompany.contact_email" type="email" placeholder="name@organization.com" autocomplete="email" />
        </div>
        <small>We’ll send the review decision here.</small>
        <span v-if="errors.email" class="field-error">{{ errors.email }}</span>
      </div>
      <div class="field-group">
        <label for="organization-domain">Website or domain</label>
        <input id="organization-domain" v-model.trim="localCompany.domain" type="text" placeholder="example.com" autocomplete="url" @input="domainWasAutofilled = false" />
        <div v-if="isGmailAddress" class="personal-email-note">
          <i class="mdi mdi-information-outline" aria-hidden="true"></i>
          <span>Using a personal email? Please enter your company, project, or GitHub website to initialize your workspace.</span>
        </div>
      </div>
    </div>

    <section class="additional-details" :class="{ 'is-open': additionalDetailsOpen }">
      <button type="button" class="section-toggle" :aria-expanded="String(additionalDetailsOpen)" aria-controls="additional-details-fields" @click="additionalDetailsOpen = !additionalDetailsOpen">
        <span class="toggle-title"><i class="mdi mdi-chevron-down" aria-hidden="true"></i>Additional details <small>(Optional)</small></span>
        <i class="mdi mdi-chevron-up toggle-chevron" aria-hidden="true"></i>
      </button>
      <div v-show="additionalDetailsOpen" id="additional-details-fields" class="additional-content">
        <div class="optional-row">
          <div class="row-label"><i class="mdi mdi-phone-outline" aria-hidden="true"></i><span>Contact phone number</span></div>
          <div class="field-group optional-indent phone-field">
            <div class="phone-control">
              <span v-if="selectedCallingCode">{{ selectedCallingCode }}</span>
              <input v-model.trim="localCompany.phone_no" type="tel" placeholder="98765 43210" autocomplete="tel-national" />
            </div>
            <span v-if="errors.phone" class="field-error">{{ errors.phone }}</span>
          </div>
        </div>
        <div class="optional-row">
          <div class="row-label"><i class="mdi mdi-camera-outline" aria-hidden="true"></i><span>Organization logo</span></div>
          <div class="logo-upload-area optional-indent">
            <LogoUploader v-model="localCompany.logo" variant="dropzone" />
          </div>
        </div>
        <div class="optional-row">
          <div class="row-label"><i class="mdi mdi-link-variant" aria-hidden="true"></i><span>Social profiles</span></div>
          <div class="social-grid optional-indent">
            <div class="field-group">
              <label for="twitter-url"><i class="mdi mdi-twitter" aria-hidden="true"></i>Twitter URL</label>
              <input id="twitter-url" v-model.trim="localCompany.twitterUrl" type="url" placeholder="https://x.com/yourhandle" />
              <span v-if="errors.twitter" class="field-error">{{ errors.twitter }}</span>
            </div>
            <div class="field-group">
              <label for="linkedin-url"><i class="mdi mdi-linkedin" aria-hidden="true"></i>LinkedIn URL</label>
              <input id="linkedin-url" v-model.trim="localCompany.linkedinUrl" type="url" placeholder="https://linkedin.com/company" />
              <span v-if="errors.linkedin" class="field-error">{{ errors.linkedin }}</span>
            </div>
            <div class="field-group">
              <label for="telegram-url"><i class="mdi mdi-send" aria-hidden="true"></i>Telegram URL</label>
              <input id="telegram-url" v-model.trim="localCompany.telegramUrl" type="url" placeholder="https://t.me/yourhandle" />
              <span v-if="errors.telegram" class="field-error">{{ errors.telegram }}</span>
            </div>
          </div>
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

<script>
import { mapGetters } from 'vuex/dist/vuex.common.js';
import LogoUploader from '../element/LogoUploader.vue';

const CONSUMER_EMAIL_DOMAINS = new Set([
  'gmail.com', 'googlemail.com', 'yahoo.com', 'yahoo.co.in', 'hotmail.com', 'outlook.com',
  'live.com', 'icloud.com', 'me.com', 'aol.com', 'proton.me', 'protonmail.com', 'mail.com',
]);
const CALLING_CODES = {
  AUS: '+61', BGD: '+880', BRA: '+55', CAN: '+1', CHN: '+86', DEU: '+49', EGY: '+20',
  ESP: '+34', FRA: '+33', GBR: '+44', HKG: '+852', IDN: '+62', IND: '+91', IRL: '+353',
  ITA: '+39', JPN: '+81', KEN: '+254', KOR: '+82', MEX: '+52', MYS: '+60', NGA: '+234',
  NLD: '+31', NZL: '+64', PAK: '+92', PHL: '+63', SGP: '+65', THA: '+66', TUR: '+90',
  USA: '+1', ARE: '+971', ZAF: '+27',
};
const COUNTRY_OPTIONS = {
  AFG: 'Afghanistan', DZA: 'Algeria', AGO: 'Angola', ARG: 'Argentina', ARM: 'Armenia', AUS: 'Australia',
  AUT: 'Austria', AZE: 'Azerbaijan', BHR: 'Bahrain', BGD: 'Bangladesh', BEL: 'Belgium', BWA: 'Botswana',
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
  CHE: 'Switzerland', TWN: 'Taiwan', TZA: 'Tanzania', THA: 'Thailand', TUN: 'Tunisia', TUR: 'Turkey',
  UGA: 'Uganda', UKR: 'Ukraine', ARE: 'United Arab Emirates', GBR: 'United Kingdom', USA: 'United States',
  URY: 'Uruguay', UZB: 'Uzbekistan', VEN: 'Venezuela', VNM: 'Vietnam', ZMB: 'Zambia', ZWE: 'Zimbabwe',
  XXX: 'Other',
};

export default {
  name: 'StepCompanyDetails',
  components: { LogoUploader },
  props: { company: { type: Object, required: true } },
  data() {
    return {
      localCompany: { ...this.company, type: this.company.type || 'BUSINESS' },
      errors: {},
      additionalDetailsOpen: false,
      isDetectingCountry: false,
      domainWasAutofilled: false,
    };
  },
  computed: {
    ...mapGetters('mainStore', ['getUserDetails']),
    selectedCallingCode() { return CALLING_CODES[this.localCompany.country] || ''; },
    countryOptions() {
      return Object.entries(COUNTRY_OPTIONS)
        .map(([value, text]) => ({ value, text }))
        .sort((left, right) => left.text.localeCompare(right.text));
    },
    emailDomain() {
      const parts = (this.localCompany.contact_email || '').trim().toLowerCase().split('@');
      return parts.length === 2 ? parts[1] : '';
    },
    isGmailAddress() { return ['gmail.com', 'googlemail.com'].includes(this.emailDomain); },
    hasErrors() { return Object.keys(this.errors).length > 0; },
  },
  watch: {
    'localCompany.contact_email'() { this.syncDomainFromEmail(); },
  },
  mounted() {
    const loginEmail = this.getUserDetails?.accessAccount?.email
      || this.getUserDetails?.email
      || this.getUserDetails?.emailId
      || '';
    if (!this.localCompany.contact_email && loginEmail) this.localCompany.contact_email = loginEmail;
    this.syncDomainFromEmail();
    this.detectCountry();
  },
  methods: {
    syncDomainFromEmail() {
      if (!this.emailDomain || !this.emailDomain.includes('.')) return;
      if (CONSUMER_EMAIL_DOMAINS.has(this.emailDomain)) {
        if (this.domainWasAutofilled) this.localCompany.domain = '';
        this.domainWasAutofilled = false;
        return;
      }
      if (!this.localCompany.domain || this.domainWasAutofilled) {
        this.localCompany.domain = this.emailDomain;
        this.domainWasAutofilled = true;
      }
    },
    async detectCountry() {
      if (this.localCompany.country) return;
      this.isDetectingCountry = true;
      const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
      const timeout = controller ? setTimeout(() => controller.abort(), 4000) : null;
      try {
        const response = await fetch('https://ipapi.co/json/', controller ? { signal: controller.signal } : undefined);
        if (!response.ok) return;
        const location = await response.json();
        const match = Object.entries(COUNTRY_OPTIONS).find(([, name]) => name === location.country_name);
        if (match && !this.localCompany.country) this.localCompany.country = match[0];
      } catch (error) {
        // Country detection is best-effort; the field remains editable.
      } finally {
        if (timeout) clearTimeout(timeout);
        this.isDetectingCountry = false;
      }
    },
    submitStep() {
      const company = this.localCompany;
      const errors = {};
      if (!company.name?.trim()) errors.name = 'Enter your organization name.';
      if (!company.country) errors.country = 'Select a country or region.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(company.contact_email || '')) errors.email = 'Enter a valid work email address.';
      if (company.phone_no && !/^\+?[\d\s()-]{7,20}$/.test(company.phone_no.trim())) errors.phone = 'Enter a valid contact phone number.';
      if (company.twitterUrl && !/^https?:\/\/(www\.)?(twitter\.com|x\.com)\/[A-Za-z0-9_]+\/?$/.test(company.twitterUrl.trim())) errors.twitter = 'Enter a valid Twitter/X profile URL.';
      if (company.telegramUrl && !/^https?:\/\/(t\.me|telegram\.me)\/[A-Za-z0-9_]+\/?$/.test(company.telegramUrl.trim())) errors.telegram = 'Enter a valid Telegram profile URL.';
      if (company.linkedinUrl && !/^https?:\/\/(www\.)?linkedin\.com\/(in|company)\/[A-Za-z0-9_-]+\/?$/.test(company.linkedinUrl.trim())) errors.linkedin = 'Enter a valid LinkedIn profile URL.';
      this.errors = errors;
      if (Object.keys(errors).length) {
        if (errors.phone || errors.twitter || errors.telegram || errors.linkedin) this.additionalDetailsOpen = true;
        return;
      }
      this.$emit('update:company', { ...company });
      this.$emit('next-step');
    },
  },
};
</script>

<style scoped>
.form-card { padding: 24px; border: 1px solid #d5d9dd; border-radius: 7px; background: #fff; box-shadow: 0 1px 2px rgba(33,37,41,.04); }
.card-heading h2 { margin: 0; color: #17213d; font-size: 18px; font-weight: 700; }
.field-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 22px 16px; }
.primary-fields { margin-top: 26px; }
.field-group { display: flex; min-width: 0; flex-direction: column; }
label { margin-bottom: 7px; color: #253454; font-size: 12px; font-weight: 700; }
em, .field-error, .form-error-summary { color: #e43d4f; font-style: normal; }
.field-group input, .field-group select, .phone-control { width: 100%; height: 40px; padding: 0 11px; border: 1px solid #d5d9dd; border-radius: 5px; background: #fff; color: #20304e; font-size: 13px; outline: none; }
.field-group input:focus, .field-group select:focus, .phone-control:focus-within { border-color: #6c757d; box-shadow: 0 0 0 2px rgba(108,117,125,.14); }
.select-control { position: relative; }
.select-control select { padding-right: 40px; appearance: none; cursor: pointer; }
.select-control > i { position: absolute; top: 50%; right: 12px; color: #6c757d; font-size: 18px; pointer-events: none; transform: translateY(-50%); }
.field-group small { margin-top: 6px; color: #7182a0; font-size: 11px; }
.field-error { margin-top: 5px; font-size: 11px; }
.input-with-icon { position: relative; }
.input-with-icon i { position: absolute; top: 11px; left: 11px; color: #6c757d; font-size: 16px; }
.input-with-icon input { padding-left: 35px; }
.personal-email-note { display: flex; gap: 8px; margin-top: 9px; padding: 9px 10px; border-radius: 5px; background: #f3f4f5; color: #626b73; font-size: 10px; line-height: 1.45; }
.personal-email-note i { flex: 0 0 auto; font-size: 15px; }
.additional-details { margin-top: 26px; border: 1px solid #d5d9dd; border-radius: 6px; overflow: hidden; }
.section-toggle { display: flex; width: 100%; height: 44px; align-items: center; justify-content: space-between; padding: 0 14px; border: 0; background: #f5f6f7; color: #243453; font-size: 13px; font-weight: 700; }
.toggle-title { display: flex; align-items: center; gap: 8px; }
.toggle-title small { color: #737b82; font-size: 10px; font-weight: 600; }
.toggle-title > i, .toggle-chevron { transition: transform .2s ease; }
.additional-details.is-open .toggle-title > i, .additional-details:not(.is-open) .toggle-chevron { transform: rotate(180deg); }
.toggle-chevron { color: #6c757d; }
.additional-content { padding: 18px 14px; border-top: 1px solid #e1e4e7; }
.optional-row + .optional-row { margin-top: 20px; }
.row-label { display: flex; align-items: center; gap: 8px; margin-bottom: 9px; color: #253454; font-size: 12px; font-weight: 700; }
.row-label > i { display: inline-flex; width: 24px; height: 24px; align-items: center; justify-content: center; border-radius: 50%; background: #eceeef; color: #6c757d; }
.optional-indent { margin-left: 32px; }
.phone-field { width: calc(50% - 8px); }
.phone-control { display: flex; align-items: center; gap: 7px; }
.phone-control span { color: #5d6b7e; font-size: 13px; }
.phone-control input { height: 34px; padding: 0; border: 0; box-shadow: none !important; }
.logo-upload-area { display: block; }
.social-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.social-grid label { display: flex; min-height: 18px; align-items: center; gap: 6px; margin-bottom: 7px; color: #50688e; font-size: 10px; line-height: 18px; }
.social-grid label i { display: inline-flex; width: 16px; height: 18px; flex: 0 0 16px; align-items: center; justify-content: center; font-size: 15px; line-height: 18px; }
.social-grid input { font-size: 11px; }
.form-error-summary { margin-top: 16px; font-size: 11px; }
.form-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 24px; padding-top: 18px; border-top: 1px solid #e1e4e7; }
.form-footer > span { color: #7889a3; font-size: 10px; }
.primary-button { min-width: 105px; height: 38px; padding: 0 16px; border: 1px solid #6c757d; border-radius: 5px; background: #6c757d; color: #fff; font-size: 12px; font-weight: 700; }
.primary-button:hover { border-color: #5a6268; background: #5a6268; }
@media (max-width: 650px) {
  .form-card { padding: 18px; }
  .field-grid, .social-grid { grid-template-columns: 1fr; }
  .phone-field { width: auto; }
  .optional-indent { margin-left: 0; }
}
</style>
