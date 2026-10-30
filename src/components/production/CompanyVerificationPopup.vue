<template>
  <hf-pop-up :id="popupId" Header="Company verification" size="xl" :hide-header-close="submitting" @hidden="isOpen = false">
    <div class="company-verification">
      <nav class="step-rail" aria-label="Company verification steps">
        <button
          v-for="(step, index) in steps"
          :key="step.value"
          type="button"
          class="step-rail-item"
          :class="{ active: activeStep === step.value, complete: step.complete }"
          @click="goToStep(index)"
        >
          <span class="step-rail-marker">
            <v-icon v-if="step.complete" x-small>mdi-check</v-icon>
            <template v-else>{{ index + 1 }}</template>
          </span>
          <span class="step-rail-text">
            <strong>{{ step.label }}</strong>
            <small>{{ step.hint }}</small>
          </span>
        </button>
      </nav>

      <section class="step-panel">
        <!-- Steps 1 and 2: company details, then legal documents -->
        <template v-if="activeStep !== 'review'">
          <header class="panel-header">
            <h3>{{ activeStep === 'details' ? 'Company details' : 'Legal documents' }}</h3>
            <p v-if="activeStep === 'details'">Our compliance team uses these details to verify your business.</p>
            <p v-else>Your tax and registration details, with the documents that prove them.</p>
          </header>

          <p v-if="loadingOnboarding" class="muted-note">Loading your company details…</p>

          <template v-else>
            <div v-if="alreadySubmitted" class="notice notice-info">
              <v-icon small>mdi-file-check-outline</v-icon>
              <div>
                <strong>Documents already submitted</strong>
                <p>Your company details and documents are with our compliance team. Nothing more is needed here.</p>
              </div>
            </div>

            <template v-else>
              <div v-if="visibleErrorCount" class="notice notice-error" role="alert">
                <v-icon small>mdi-alert-circle-outline</v-icon>
                <div>
                  <strong>Fix {{ visibleErrorCount }} {{ visibleErrorCount === 1 ? 'field' : 'fields' }} to continue</strong>
                  <p>The highlighted fields are missing or in the wrong format.</p>
                </div>
              </div>

              <template v-if="activeStep === 'details'">
              <section class="form-section">
                <header class="form-section-header">
                  <h4>Basic details</h4>
                  <p>Prefilled from onboarding. Update anything that has changed.</p>
                </header>
                <div class="field-grid">
                  <div class="field span-2" :class="{ 'has-error': fieldErrors.companyName }" data-field="companyName">
                    <label>Legal company name <span class="required-marker">*</span></label>
                    <input v-model.trim="form.basic.companyName" type="text" autocomplete="organization" />
                    <small v-if="fieldErrors.companyName" class="field-error">{{ fieldErrors.companyName }}</small>
                  </div>
                  <div class="field" :class="{ 'has-error': fieldErrors.domain }" data-field="domain">
                    <label>
                      Website domain <span class="required-marker">*</span>
                      <span v-if="verifiedDomain" class="verified-tag"><v-icon x-small>mdi-check-decagram</v-icon> Verified</span>
                    </label>
                    <!-- A verified domain is locked: the company is verified against that domain -->
                    <input
                      v-if="verifiedDomain"
                      :value="verifiedDomain"
                      type="text"
                      disabled
                      aria-describedby="verified-domain-note"
                    />
                    <input
                      v-else
                      v-model.trim="form.basic.domain"
                      type="text"
                      placeholder="example.com"
                      @blur="form.basic.domain = normalizeDomain(form.basic.domain)"
                    />
                    <small v-if="verifiedDomain" id="verified-domain-note">Verified for this app, so it can't be changed here.</small>
                    <small v-if="fieldErrors.domain" class="field-error">{{ fieldErrors.domain }}</small>
                  </div>
                  <div class="field" :class="{ 'has-error': fieldErrors.customerEmail }" data-field="customerEmail">
                    <label>Contact email <span class="required-marker">*</span></label>
                    <input v-model.trim="form.basic.customerEmail" type="email" autocomplete="email" />
                    <small v-if="fieldErrors.customerEmail" class="field-error">{{ fieldErrors.customerEmail }}</small>
                  </div>
                  <div class="field" :class="{ 'has-error': fieldErrors.phoneNumber }" data-field="phoneNumber">
                    <label>Phone number</label>
                    <div class="phone-control">
                      <span v-if="callingCode">{{ callingCode }}</span>
                      <input v-model.trim="form.basic.phoneNumber" type="tel" placeholder="9876543210" autocomplete="tel-national" />
                    </div>
                    <small v-if="fieldErrors.phoneNumber" class="field-error">{{ fieldErrors.phoneNumber }}</small>
                  </div>
                  <div class="field" :class="{ 'has-error': fieldErrors.country }" data-field="country">
                    <label>Country of registration <span class="required-marker">*</span></label>
                    <div class="select-control">
                      <select v-model="form.basic.country" autocomplete="country">
                        <option value="" disabled>{{ detectingCountry ? 'Detecting your country…' : 'Select a country' }}</option>
                        <option v-for="option in countryOptions" :key="option.value" :value="option.value">{{ option.text }}</option>
                      </select>
                      <i class="mdi mdi-chevron-down" aria-hidden="true"></i>
                    </div>
                    <small v-if="fieldErrors.country" class="field-error">{{ fieldErrors.country }}</small>
                  </div>
                </div>
              </section>

              <section class="form-section">
                <header class="form-section-header">
                  <h4>Registered address</h4>
                  <p>The official address on your incorporation documents.</p>
                </header>
                <div class="field-grid">
                  <div class="field span-2" :class="{ 'has-error': fieldErrors.line1 }" data-field="line1">
                    <label>Address line 1 <span class="required-marker">*</span></label>
                    <input v-model.trim="form.address.line1" type="text" autocomplete="address-line1" />
                    <small v-if="fieldErrors.line1" class="field-error">{{ fieldErrors.line1 }}</small>
                  </div>
                  <div class="field span-2" :class="{ 'has-error': fieldErrors.line2 }" data-field="line2">
                    <label>Address line 2</label>
                    <input v-model.trim="form.address.line2" type="text" autocomplete="address-line2" />
                    <small v-if="fieldErrors.line2" class="field-error">{{ fieldErrors.line2 }}</small>
                  </div>
                  <div class="field" :class="{ 'has-error': fieldErrors.city }" data-field="city">
                    <label>City <span class="required-marker">*</span></label>
                    <input v-model.trim="form.address.city" type="text" autocomplete="address-level2" />
                    <small v-if="fieldErrors.city" class="field-error">{{ fieldErrors.city }}</small>
                  </div>
                  <div class="field" :class="{ 'has-error': fieldErrors.state }" data-field="state">
                    <label>State / Province <span class="required-marker">*</span></label>
                    <input v-model.trim="form.address.state" type="text" autocomplete="address-level1" />
                    <small v-if="fieldErrors.state" class="field-error">{{ fieldErrors.state }}</small>
                  </div>
                  <div class="field" :class="{ 'has-error': fieldErrors.postalCode }" data-field="postalCode">
                    <label>Postal code <span class="required-marker">*</span></label>
                    <input v-model.trim="form.address.postalCode" type="text" autocomplete="postal-code" :placeholder="postalCodePlaceholder" />
                    <small v-if="fieldErrors.postalCode" class="field-error">{{ fieldErrors.postalCode }}</small>
                  </div>
                  <div class="field">
                    <label>Country</label>
                    <input :value="countryLabel" type="text" disabled />
                    <small>Same as the country of registration.</small>
                  </div>
                </div>
              </section>
              </template>

              <template v-else>
              <section class="form-section">
                <header class="form-section-header">
                  <h4>Tax details</h4>
                  <p>The law requires us to collect a tax ID and supporting document.</p>
                </header>
                <div class="field">
                  <label>Is your business registered for tax (e.g. GST, VAT, EIN)? <span class="required-marker">*</span></label>
                  <div class="segmented">
                    <button type="button" :class="{ active: form.taxApplicable === true }" @click="setTaxApplicable(true)">Yes</button>
                    <button type="button" :class="{ active: form.taxApplicable === false }" @click="setTaxApplicable(false)">No</button>
                  </div>
                </div>

                <p v-if="form.taxApplicable === false" class="section-note">
                  As your business isn't registered for tax, please provide the personal tax ID of the business owner or authorised representative.
                </p>
                <div class="field" :class="{ 'has-error': fieldErrors.taxId }" data-field="taxId">
                  <label>{{ taxRule.label }} <span class="required-marker">*</span></label>
                  <input v-model.trim="form.taxId" type="text" :placeholder="taxRule.example ? `e.g. ${taxRule.example}` : ''" />
                  <small v-if="fieldErrors.taxId" class="field-error">{{ fieldErrors.taxId }}</small>
                </div>
                <div class="field" :class="{ 'has-error': fieldErrors.taxDocument }" data-field="taxDocument">
                  <label>{{ taxRule.document }} <span class="required-marker">*</span></label>
                  <div v-if="form.documents.tax" class="file-chip">
                    <v-icon small>mdi-file-document-outline</v-icon>
                    <span class="file-name">{{ form.documents.tax.fileName }}</span>
                    <small v-if="form.documents.tax.size">{{ formatSize(form.documents.tax.size) }}</small>
                    <button type="button" class="file-remove" aria-label="Remove file" @click="form.documents.tax = null">
                      <v-icon x-small>mdi-close</v-icon>
                    </button>
                  </div>
                  <label v-else class="dropzone">
                    <input type="file" :accept="acceptedTypes" @change="pickFile('tax', $event)" />
                    <v-icon small>mdi-cloud-upload-outline</v-icon>
                    <span>Upload file</span>
                    <small>PDF, PNG or JPG, up to {{ maxFileSizeMb }} MB</small>
                  </label>
                  <small v-if="fieldErrors.taxDocument" class="field-error">{{ fieldErrors.taxDocument }}</small>
                  <small v-if="form.taxApplicable === false">
                    A copy that shows your {{ taxRule.label }}. If your business has a tax exemption certificate, you can upload that instead.
                  </small>
                </div>
              </section>

              <section class="form-section">
                <header class="form-section-header">
                  <h4>
                    Registration
                    <span class="optional-tag">Optional</span>
                  </h4>
                  <p>Your company registration details.</p>
                </header>
                <div class="tip">
                  <v-icon x-small>mdi-lightbulb-on-outline</v-icon>
                  <span>The more information you provide, the faster and easier it is for us to verify your business.</span>
                </div>
                <div class="field" :class="{ 'has-error': fieldErrors.registrationNumber }" data-field="registrationNumber">
                  <label>{{ registrationRule.label }}</label>
                  <input v-model.trim="form.registrationNumber" type="text" :placeholder="registrationRule.example ? `e.g. ${registrationRule.example}` : ''" />
                  <small v-if="fieldErrors.registrationNumber" class="field-error">{{ fieldErrors.registrationNumber }}</small>
                </div>
                <div class="field">
                  <label>Certificate of incorporation</label>
                  <div v-if="form.documents.incorporation" class="file-chip">
                    <v-icon small>mdi-file-document-outline</v-icon>
                    <span class="file-name">{{ form.documents.incorporation.fileName }}</span>
                    <small v-if="form.documents.incorporation.size">{{ formatSize(form.documents.incorporation.size) }}</small>
                    <button type="button" class="file-remove" aria-label="Remove file" @click="form.documents.incorporation = null">
                      <v-icon x-small>mdi-close</v-icon>
                    </button>
                  </div>
                  <label v-else class="dropzone">
                    <input type="file" :accept="acceptedTypes" @change="pickFile('incorporation', $event)" />
                    <v-icon small>mdi-cloud-upload-outline</v-icon>
                    <span>Upload file</span>
                    <small>PDF, PNG or JPG, up to {{ maxFileSizeMb }} MB</small>
                  </label>
                </div>
              </section>
              </template>
            </template>
          </template>
        </template>

        <!-- Step 3: Terms & condition -->
        <template v-else>
          <header class="panel-header">
            <h3>Terms &amp; conditions</h3>
            <p>Confirm your details to send them to our compliance team.</p>
          </header>

          <div class="notice notice-info">
            <v-icon small>mdi-shield-check-outline</v-icon>
            <div>
              <strong>How the review works</strong>
              <ul>
                <li>You get production access straight away. You don't have to wait for the review.</li>
                <li>Our compliance team reviews your company details and documents in parallel.</li>
                <li>If something is missing or doesn't match, we'll contact you at <strong>{{ form.basic.customerEmail || 'your contact email' }}</strong> for clarification.</li>
                <li>We reserve the right to revoke production access if the details or documents can't be verified.</li>
              </ul>
            </div>
          </div>

          <div v-if="!companyDetailsComplete" class="notice notice-warning">
            <v-icon small>mdi-alert-outline</v-icon>
            <div>
              <strong>Not ready yet</strong>
              <p>Fill in all required fields in Company details and Legal documents first.</p>
            </div>
          </div>

          <!-- Submission progress. The steps are paced in the UI (the API is a single request);
               the last step stays in progress until the request really finishes. -->
          <div v-if="submitProgress.length" class="submit-progress" role="status" aria-live="polite">
            <ul>
              <li v-for="(step, index) in submitProgress" :key="step.key" :class="`is-${progressState(index)}`">
                <span class="progress-marker" aria-hidden="true">
                  <v-icon v-if="progressState(index) === 'done'" x-small>mdi-check</v-icon>
                  <v-progress-circular v-else-if="progressState(index) === 'active'" indeterminate size="12" width="2"></v-progress-circular>
                </span>
                {{ step.label }}
              </li>
            </ul>
            <small v-if="!submitFinished">This can take up to 30 seconds. Please keep this window open.</small>
          </div>

          <label v-else class="declaration" :class="{ disabled: !companyDetailsComplete }">
            <input v-model="declarationAccepted" type="checkbox" :disabled="!companyDetailsComplete" />
            <span>
              I confirm that the information and documents provided for
              <strong>{{ form.basic.companyName || 'my company' }}</strong> are accurate, that I'm authorised to submit them,
              and that production access may be revoked if they can't be verified.
            </span>
          </label>
        </template>

        <footer class="panel-footer">
          <button v-if="activeStepIndex > 0" type="button" class="secondary-button" :disabled="submitting" @click="goToStep(activeStepIndex - 1)">Back</button>
          <span class="spacer"></span>
          <button type="button" class="ghost-button" :disabled="submitting" @click="close">Cancel</button>
          <button v-if="activeStepIndex < steps.length - 1" type="button" class="primary-button" @click="goToStep(activeStepIndex + 1)">Next</button>
          <button v-else type="button" class="primary-button" :disabled="!canSubmit || submitting" @click="submit">
            {{ submitting ? 'Submitting…' : 'Submit for review' }}
          </button>
        </footer>
      </section>
    </div>
  </hf-pop-up>
</template>

<script>
import HfPopUp from '../element/hfPopup.vue';
import UtilsMixin from '../../mixins/utils';
import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';
import { COUNTRY_OPTIONS, CALLING_CODES, countryName, countryOptionLabel, detectCountryFromIp } from '../../utils/countries.js';
import {
  OTHER_COUNTRY,
  OTHER_TYPE,
  detectIdentifierType,
  getIdentifierRule,
  isSupportedCountry,
  normalizeIdentifier,
  postalCodeExample,
  validateIdentifier,
  validatePostalCode,
} from '../../utils/companyIdentifiers.js';
import { companyAllowsProduction } from './companyReview.js';

// Fields checked on each form step
const STEP_FIELDS = {
  details: ['companyName', 'domain', 'customerEmail', 'phoneNumber', 'country', 'line1', 'line2', 'city', 'state', 'postalCode'],
  documents: ['taxId', 'taxDocument', 'registrationNumber'],
};
const STEP_OF_FIELD = Object.fromEntries(
  Object.entries(STEP_FIELDS).flatMap(([step, fields]) => fields.map(field => [field, step]))
);
import {
  joinStreet,
  normalizeDomain,
  validateCompanyName,
  validateDomain,
  validateStreet,
  validateStreetLine,
} from '../../utils/companyFieldRules.js';

countries.registerLocale(enLocale);

const MAX_FILE_SIZE_MB = 5;
const ACCEPTED_TYPES = ['application/pdf', 'image/png', 'image/jpeg'];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Same rule as the onboarding company details step
const PHONE_PATTERN = /^\+?[\d\s()-]{7,20}$/;

const emptyForm = () => ({
  basic: { companyName: '', domain: '', customerEmail: '', phoneNumber: '', country: '' },
  registrationNumber: '',
  address: { line1: '', line2: '', city: '', state: '', postalCode: '' },
  taxApplicable: true,
  taxId: '',
  documents: { incorporation: null, tax: null },
});

export default {
  name: 'CompanyVerificationPopup',
  components: { HfPopUp },
  mixins: [UtilsMixin],
  props: {
    value: { type: Boolean, default: false },
    // The app's domain: prefills the field, and is the only allowed value once verified
    domain: { type: String, default: '' },
    domainVerified: { type: Boolean, default: false },
    onboardingRecord: { type: Object, default: () => ({}) },
    onboardingLoading: { type: Boolean, default: false },
  },
  data() {
    return {
      popupId: 'company-verification-popup',
      activeStep: 'details',
      // Per step: set once the user tries to leave it; then its empty required fields show too
      showRequiredErrors: { details: false, documents: false },
      loadingOnboarding: false,
      detectingCountry: false,
      onboarding: {},
      form: emptyForm(),
      declarationAccepted: false,
      submitting: false,
      // Simulated progress shown while the submit request runs
      submitProgress: [],
      submitProgressIndex: 0,
      submitFinished: false,
      submitProgressTimer: null,
      maxFileSizeMb: MAX_FILE_SIZE_MB,
      acceptedTypes: '.pdf,.png,.jpg,.jpeg',
    };
  },
  computed: {
    isOpen: {
      get() { return this.value; },
      set(open) { this.$emit('input', open); },
    },
    countryLabel() {
      return countryName(this.form.basic.country);
    },
    // Only countries the backend accepts for company verification, plus "Other"
    countryOptions() {
      return Object.entries(COUNTRY_OPTIONS)
        .filter(([value]) => isSupportedCountry(this.toCountryCode(value)))
        .sort(([, left], [, right]) => left.localeCompare(right))
        .map(([value, name]) => ({ value, text: countryOptionLabel(value, name) }));
    },
    // ISO alpha-2 code the backend uses ('XX' for "Other")
    countryCode() {
      return this.toCountryCode(this.form.basic.country);
    },
    countryError() {
      const country = this.form.basic.country;
      if (!country || isSupportedCountry(this.countryCode)) return '';
      return `${countryName(country)} isn't supported for company verification yet. Choose "Other" if your country isn't listed.`;
    },
    postalCodeError() {
      return validatePostalCode(this.countryCode, this.form.address.postalCode);
    },
    postalCodePlaceholder() {
      const example = postalCodeExample(this.countryCode);
      return example ? `e.g. ${example}` : '';
    },
    isEmailValid() {
      return EMAIL_PATTERN.test(this.form.basic.customerEmail);
    },
    callingCode() {
      return CALLING_CODES[this.form.basic.country] || '';
    },
    phoneError() {
      const phone = this.form.basic.phoneNumber;
      return phone && !PHONE_PATTERN.test(phone) ? 'Enter a valid phone number.' : '';
    },
    registrationRule() {
      return getIdentifierRule('registration', this.countryCode);
    },
    // Business registered for tax -> company tax ID; otherwise the owner's personal tax ID
    taxIdKind() {
      return this.form.taxApplicable === false ? 'personalTax' : 'tax';
    },
    taxRule() {
      return getIdentifierRule(this.taxIdKind, this.countryCode);
    },
    registrationError() {
      return validateIdentifier('registration', this.countryCode, this.form.registrationNumber);
    },
    taxIdError() {
      return validateIdentifier(this.taxIdKind, this.countryCode, this.form.taxId);
    },
    // Already with compliance (or approved); a rejected submission can be resent
    alreadySubmitted() {
      return companyAllowsProduction(this.onboarding);
    },
    // Wrong-format problems: shown as soon as a field has a value. Same rules the backend applies.
    formatErrors() {
      const { basic, address } = this.form;
      return {
        companyName: validateCompanyName(basic.companyName),
        domain: validateDomain(basic.domain),
        customerEmail: basic.customerEmail && !this.isEmailValid ? 'Enter a valid email address.' : '',
        phoneNumber: this.phoneError,
        country: this.countryError,
        line1: validateStreetLine(address.line1) || validateStreet(address.line1, address.line2),
        line2: validateStreetLine(address.line2),
        postalCode: this.postalCodeError,
        taxId: this.taxIdError,
        registrationNumber: this.registrationError,
      };
    },
    // Missing required values: only shown after the user tries to continue
    requiredErrors() {
      const { basic, address, documents } = this.form;
      const required = {
        companyName: [basic.companyName, 'Enter your legal company name.'],
        domain: [basic.domain, 'Enter your website domain.'],
        customerEmail: [basic.customerEmail, 'Enter a contact email.'],
        country: [basic.country, 'Select your country of registration.'],
        line1: [address.line1, 'Enter your street address.'],
        city: [address.city, 'Enter your city.'],
        state: [address.state, 'Enter your state or province.'],
        postalCode: [address.postalCode, 'Enter your postal code.'],
        taxId: [this.form.taxId, `Enter your ${this.taxRule.label}.`],
        taxDocument: [documents.tax, 'Upload the document.'],
      };
      return Object.fromEntries(Object.entries(required).map(([key, [value, message]]) => [key, value ? '' : message]));
    },
    fieldErrors() {
      const errors = { ...this.formatErrors };
      Object.entries(this.requiredErrors).forEach(([key, message]) => {
        if (message && !errors[key]) errors[key] = this.showRequiredErrors[STEP_OF_FIELD[key]] ? message : '';
      });
      return errors;
    },
    // Errors highlighted on the current step (for the "Fix N fields" box)
    visibleErrorCount() {
      if (!this.showRequiredErrors[this.activeStep]) return 0;
      return (STEP_FIELDS[this.activeStep] || []).filter(key => this.fieldErrors[key]).length;
    },
    detailsComplete() {
      return this.isStepComplete('details');
    },
    documentsComplete() {
      return this.isStepComplete('documents');
    },
    companyDetailsComplete() {
      return this.detailsComplete && this.documentsComplete;
    },
    steps() {
      return [
        { value: 'details', label: 'Company details', hint: 'Business and address', complete: this.detailsComplete },
        { value: 'documents', label: 'Legal documents', hint: 'Tax and registration', complete: this.documentsComplete },
        { value: 'review', label: 'Terms & conditions', hint: 'Confirm and send', complete: false },
      ];
    },
    // Set when the app's domain is verified; the field is then locked to it
    verifiedDomain() {
      return this.domainVerified ? normalizeDomain(this.domain) : '';
    },
    activeStepIndex() {
      return this.steps.findIndex(step => step.value === this.activeStep);
    },
    canSubmit() {
      return this.companyDetailsComplete && !this.alreadySubmitted && this.declarationAccepted;
    },
  },
  beforeDestroy() {
    clearTimeout(this.submitProgressTimer);
  },
  watch: {
    verifiedDomain() {
      this.applyVerifiedDomain();
    },
    value: {
      immediate: true,
      handler(open) {
        if (open) this.reset();
        this.$nextTick(() => {
          this.$root.$emit(open ? 'bv::show::modal' : 'bv::hide::modal', this.popupId);
        });
      },
    },
    onboardingRecord(record) {
      if (this.value) this.populateOnboarding(record);
    },
  },
  methods: {
    reset() {
      this.activeStep = 'details';
      this.showRequiredErrors = { details: false, documents: false };
      this.form = emptyForm();
      this.declarationAccepted = false;
      this.loadOnboarding();
    },
    loadOnboarding() {
      this.loadingOnboarding = this.onboardingLoading;
      this.populateOnboarding(this.onboardingRecord);
    },
    populateOnboarding(onboarding) {
      this.onboarding = onboarding || {};
      const saved = this.onboarding.registeredAddress || {};
      const onboardingCountry = this.normalizeCountry(this.onboarding.country);
      this.form.basic = {
        companyName: this.onboarding.companyName || '',
        domain: this.onboarding.domain || this.domain || '',
        customerEmail: this.onboarding.customerEmail || '',
        phoneNumber: this.onboarding.phoneNumber || '',
        country: onboardingCountry,
      };
      this.form.registrationNumber = this.onboarding.registrationNumber || '';
      this.form.address = {
        ...this.form.address,
        ...saved,
        line1: saved.line1 || this.onboarding.billingAddress || '',
      };
      if (typeof this.onboarding.isTaxApplicable === 'boolean') this.form.taxApplicable = this.onboarding.isTaxApplicable;
      this.form.taxId = this.onboarding.taxId || '';
      if (this.onboarding.companyDetail) this.populateCompany(this.onboarding.companyDetail);
      this.loadingOnboarding = this.onboardingLoading;
      this.applyVerifiedDomain();
      if (!this.form.basic.country) this.detectCountry();
    },
    // Whatever onboarding or a previous submission saved, a verified domain wins
    applyVerifiedDomain() {
      if (this.verifiedDomain) this.form.basic.domain = this.verifiedDomain;
    },
    normalizeCountry(country) {
      return country?.length === 2 ? countries.alpha2ToAlpha3(country) : country || '';
    },
    populateCompany(company) {
      if (!company) return;
      const address = company.address || {};
      const countryCode = company.countryOfRegistration || address.country;
      const country = this.normalizeCountry(countryCode);
      const findDocument = type => (company.documents || []).find(document => document.documentType === type);
      const toFormDocument = document => document && {
        id: document.id,
        fileName: document.fileName || document.file_name || document.originalName || document.originalname || document.filename || document.name,
      };
      Object.assign(this.form, {
        basic: {
          ...this.form.basic,
          companyName: company.name,
          domain: company.domain,
          country: country || this.form.basic.country,
        },
        registrationNumber: company.registrationNumber || '',
        address: {
          line1: address.street || '',
          line2: '',
          city: address.city || '',
          state: address.province || company.region || '',
          postalCode: address.postalCode || '',
        },
        taxId: company.taxIdNumber || '',
        documents: {
          tax: toFormDocument(findDocument('TaxRegistration')),
          incorporation: toFormDocument(findDocument('CertificateOfIncorporation')),
        },
      });
      this.applyVerifiedDomain();
    },
    async detectCountry() {
      this.detectingCountry = true;
      const detected = await detectCountryFromIp();
      if (detected && !this.form.basic.country) this.form.basic.country = detected;
      this.detectingCountry = false;
    },
    setTaxApplicable(value) {
      if (this.form.taxApplicable === value) return;
      // Company and personal tax IDs are different documents; don't carry one over as the other
      this.form.taxId = '';
      this.form.documents.tax = null;
      this.form.taxApplicable = value;
    },
    isStepComplete(step) {
      if (this.alreadySubmitted) return true;
      return (STEP_FIELDS[step] || []).every(key => !this.formatErrors[key] && !this.requiredErrors[key]);
    },
    // Moving forward checks every step on the way; it stops at the first one with problems
    // and points at what's wrong. Going back is always allowed.
    goToStep(index) {
      const step = this.steps[index];
      if (!step) return;
      if (index > this.activeStepIndex) {
        const blocking = this.steps
          .slice(this.activeStepIndex, index)
          .find(({ value }) => STEP_FIELDS[value] && !this.isStepComplete(value));
        if (blocking) {
          this.showRequiredErrors = { ...this.showRequiredErrors, [blocking.value]: true };
          this.activeStep = blocking.value;
          this.$nextTick(this.scrollToFirstError);
          return;
        }
      }
      this.activeStep = step.value;
    },
    scrollToFirstError() {
      const field = this.$el && this.$el.querySelector && this.$el.querySelector('.field.has-error');
      if (!field) return;
      field.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const input = field.querySelector('input, select');
      if (input) input.focus({ preventScroll: true });
    },
    normalizeDomain,
    async pickFile(kind, event) {
      const input = event.target;
      const file = input.files && input.files[0];
      input.value = '';
      if (!file) return;
      if (!ACCEPTED_TYPES.includes(file.type)) {
        this.notifyErr('Please upload a PDF, PNG or JPG file.');
        return;
      }
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        this.notifyErr(`File is too large. Maximum size is ${MAX_FILE_SIZE_MB} MB.`);
        return;
      }
      try {
        const data = await this.readAsDataUrl(file);
        this.form.documents[kind] = { fileName: file.name, mimeType: file.type, size: file.size, data };
      } catch (error) {
        this.notifyErr('Could not read the file. Please try again.');
      }
    },
    readAsDataUrl(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
      });
    },
    formatSize(bytes) {
      if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    },
    dataUrlToBlob(dataUrl, mimeType) {
      const [metadata, encoded] = String(dataUrl || '').split(',');
      if (!metadata || !encoded || !metadata.includes(';base64')) throw new Error('The selected document could not be prepared for upload.');
      const binary = window.atob(encoded);
      const bytes = new Uint8Array(binary.length);
      for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
      return new Blob([bytes], { type: mimeType || metadata.slice(5, metadata.indexOf(';')) });
    },
    toCountryCode(alpha3) {
      if (!alpha3) return '';
      if (alpha3 === 'XXX') return OTHER_COUNTRY;
      return countries.alpha3ToAlpha2(alpha3) || '';
    },
    buildPayload() {
      const { documents } = this.form;
      const { countryCode } = this;
      if (!isSupportedCountry(countryCode)) throw new Error('This country is not supported for company verification.');
      // Same normalisation and type detection the backend validates against.
      // A personal tax ID has no country-specific type, so it goes as OTHER (accepted for any
      // country, no format check) and its document as TaxRegistration.
      const normalizedTaxId = normalizeIdentifier(this.form.taxId);
      const taxIdType = this.form.taxApplicable
        ? detectIdentifierType('tax', countryCode, normalizedTaxId)
        : OTHER_TYPE;
      const registrationNumber = normalizeIdentifier(this.form.registrationNumber);
      const registrationNumberType = registrationNumber
        ? detectIdentifierType('registration', countryCode, registrationNumber)
        : undefined;
      if (!taxIdType || (registrationNumber && !registrationNumberType)) {
        throw new Error('Check the format of your tax ID and registration number.');
      }
      const company = {
        name: this.form.basic.companyName,
        domain: this.verifiedDomain || normalizeDomain(this.form.basic.domain),
        region: this.form.address.state,
        countryOfRegistration: countryCode,
        ...(registrationNumber ? { registrationNumber, registrationNumberType } : {}),
        taxIdType,
        taxIdNumber: normalizedTaxId,
        address: {
          street: joinStreet(this.form.address.line1, this.form.address.line2),
          province: this.form.address.state,
          postalCode: this.form.address.postalCode,
          city: this.form.address.city,
          country: countryCode,
        },
      };
      const documentEntries = [
        { type: 'TaxRegistration', doc: documents.tax },
        { type: 'CertificateOfIncorporation', doc: documents.incorporation },
      ].filter(({ doc }) => doc?.data);
      const formData = new FormData();
      formData.append('onboardingID', this.onboarding._id);
      formData.append('phoneNumber', this.form.basic.phoneNumber || '');
      formData.append('company', JSON.stringify(company));
      formData.append('documents', JSON.stringify(documentEntries.map(({ type }) => ({ type }))));
      documentEntries.forEach(({ doc }, index) => {
        const file = this.dataUrlToBlob(doc.data, doc.mimeType);
        formData.append(`documents[${index}][file]`, file, doc.fileName);
      });
      return formData;
    },
    async submit() {
      if (!this.canSubmit || this.submitting) return;
      this.submitting = true;
      try {
        const payload = this.buildPayload();
        this.startSubmitProgress();
        const updated = await this.$store.dispatch('mainStore/submitProductionDetails', payload);
        // Only now is it really done: tick every step, let the user see it, then close
        this.finishSubmitProgress();
        await new Promise(resolve => setTimeout(resolve, 700));
        this.close();
        this.notifySuccess('Company details submitted for review.');
        this.$emit('submitted', updated);
      } catch (error) {
        this.notifyErr(error.message || 'Could not submit your details. Please try again.');
      } finally {
        this.submitting = false;
        this.resetSubmitProgress();
      }
    },

    // One upload step per document being sent, then the submission itself.
    // Durations add up to roughly the usual request time; the last step has none, so it
    // keeps spinning until the real response arrives (it never claims success early).
    startSubmitProgress() {
      const { documents } = this.form;
      const uploads = [
        documents.tax && documents.tax.data && { key: 'upload-tax', label: 'Uploading tax registration document', duration: 4000 },
        documents.incorporation && documents.incorporation.data && { key: 'upload-incorporation', label: 'Uploading certificate of incorporation', duration: 4000 },
      ].filter(Boolean);
      this.submitProgress = [
        ...uploads,
        { key: 'submit', label: 'Submitting company details for verification', duration: 9000 },
        { key: 'status', label: 'Updating your verification status', duration: null },
      ];
      this.submitProgressIndex = 0;
      this.submitFinished = false;
      this.scheduleNextProgressStep();
    },

    scheduleNextProgressStep() {
      const step = this.submitProgress[this.submitProgressIndex];
      if (!step || !step.duration) return;
      this.submitProgressTimer = setTimeout(() => {
        this.submitProgressIndex += 1;
        this.scheduleNextProgressStep();
      }, step.duration);
    },

    finishSubmitProgress() {
      clearTimeout(this.submitProgressTimer);
      this.submitProgressIndex = this.submitProgress.length;
      this.submitFinished = true;
    },

    resetSubmitProgress() {
      clearTimeout(this.submitProgressTimer);
      this.submitProgressTimer = null;
      this.submitProgress = [];
      this.submitProgressIndex = 0;
      this.submitFinished = false;
    },

    // done | active | pending
    progressState(index) {
      if (index < this.submitProgressIndex) return 'done';
      return index === this.submitProgressIndex ? 'active' : 'pending';
    },
    close() {
      this.isOpen = false;
    },
  },
};
</script>

<style scoped>
.company-verification {
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr);
  min-height: 460px;
  color: #273448;
}

/* Vertical step rail */
.step-rail {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 4px 16px 4px 0;
  border-right: 1px solid #e8edf3;
}

.step-rail-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  text-align: left;
}

.step-rail-item:hover { background: #f8fafc; }
.step-rail-item.active { background: #f1f6ff; }

.step-rail-marker {
  display: inline-flex;
  flex: 0 0 24px;
  width: 24px;
  height: 24px;
  align-items: center;
  justify-content: center;
  border: 1px solid #d5dde7;
  border-radius: 50%;
  background: #fff;
  color: #718198;
  font-size: 11px;
  font-weight: 700;
}

.step-rail-item.active .step-rail-marker { border-color: #2563dc; color: #2563dc; }
.step-rail-item.complete .step-rail-marker { border-color: #b7e2cb; background: #eaf8f0; color: #218459; }
.step-rail-item.complete .step-rail-marker >>> .v-icon { color: #218459 !important; }

.step-rail-text { display: flex; flex-direction: column; min-width: 0; }
.step-rail-text strong { color: #344054; font-size: 13px; font-weight: 700; }
.step-rail-text small { color: #8793a5; font-size: 11px; }
.step-rail-item.active .step-rail-text strong { color: #2563dc; }

/* Content panel */
.step-panel {
  display: flex;
  flex-direction: column;
  min-width: 0;
  padding: 4px 4px 0 24px;
}

.panel-header { margin-bottom: 18px; }
.panel-header h3 { margin: 0 0 4px; color: #263244; font-size: 17px; font-weight: 700; }
.panel-header p { margin: 0; color: #718198; font-size: 12px; line-height: 1.5; }

.muted-note { margin: 6px 0 0; color: #8793a5; font-size: 11px; }


/* Company & documents */
.form-section {
  margin-bottom: 16px;
  padding: 16px 18px 6px;
  border: 1px solid #e1e6ed;
  border-radius: 10px;
  background: #fff;
}

.form-section-header { margin-bottom: 14px; padding-bottom: 10px; border-bottom: 1px solid #eef2f6; }
.form-section-header h4 { margin: 0 0 2px; color: #263244; font-size: 14px; font-weight: 700; }
.form-section-header p { margin: 0; color: #8793a5; font-size: 11px; }

.field-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px 16px; }
.field { margin-bottom: 12px; }
.field-grid { margin-bottom: 12px; }
.field-grid .field { margin-bottom: 0; }
.span-2 { grid-column: span 2; }

.field > label { display: block; margin-bottom: 6px; color: #475467; font-size: 12px; font-weight: 600; }
.field input[type="text"],
.field input[type="email"],
.field input[type="tel"],
.field select {
  width: 100%;
  height: 38px;
  padding: 0 11px;
  border: 1px solid #d5dde7;
  border-radius: 6px;
  background: #fff;
  color: #27364a;
  font-size: 13px;
  outline: none;
}

.field input:focus, .field select:focus { border-color: #2f6fec; box-shadow: 0 0 0 2px rgba(47,111,236,.12); }
.field > small { display: block; margin-top: 4px; color: #8793a5; font-size: 11px; }
.field > small.field-error { color: #b42318; }
.field.has-error input[type="text"],
.field.has-error input[type="email"],
.field.has-error input[type="tel"],
.field.has-error select,
.field.has-error .phone-control,
.field.has-error .dropzone { border-color: #f04438; }

/* Same dropdown affordance as the onboarding country field */
.select-control { position: relative; }
.field .select-control select { padding-right: 36px; appearance: none; -webkit-appearance: none; cursor: pointer; }
.select-control > i {
  position: absolute;
  top: 50%;
  right: 11px;
  color: #64748b;
  font-size: 18px;
  pointer-events: none;
  transform: translateY(-50%);
}

.section-note { margin: 0 0 12px; color: #52627a; font-size: 12px; line-height: 1.5; }

.verified-tag {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  margin-left: 6px;
  padding: 1px 8px;
  border-radius: 10px;
  background: #eaf8f0;
  color: #218459;
  font-size: 10px;
  font-weight: 700;
}
.verified-tag >>> .v-icon { color: inherit !important; }

.optional-tag {
  margin-left: 6px;
  padding: 2px 8px;
  border-radius: 10px;
  background: #f1f5f9;
  color: #64748b;
  font-size: 10px;
  font-weight: 700;
  vertical-align: middle;
}

.tip {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 12px;
  padding: 9px 12px;
  border-radius: 6px;
  background: #f5f8fd;
  color: #3f4f66;
  font-size: 12px;
  line-height: 1.5;
}

.tip > .v-icon { margin-top: 2px; color: #4a6fa5 !important; }

.phone-control {
  display: flex;
  align-items: center;
  gap: 7px;
  height: 38px;
  padding: 0 11px;
  border: 1px solid #d5dde7;
  border-radius: 6px;
  background: #fff;
}

.phone-control:focus-within { border-color: #2f6fec; box-shadow: 0 0 0 2px rgba(47,111,236,.12); }
.phone-control span { color: #5d6b7e; font-size: 13px; }
.field .phone-control input { height: 34px; padding: 0; border: 0; box-shadow: none; }
.field input[type="text"]:disabled { background: #f8fafc; color: #657287; }
.required-marker { color: #dc3545; }

.dropzone {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 14px;
  border: 1px dashed #c9d3df;
  border-radius: 8px;
  background: #fbfcfe;
  color: #475467;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.dropzone:hover { border-color: #2f6fec; background: #f5f8ff; }
.dropzone input { display: none; }
.dropzone small { margin-left: auto; color: #8793a5; font-size: 11px; font-weight: 400; }

.file-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border: 1px solid #d5dde7;
  border-radius: 8px;
  background: #fff;
  font-size: 13px;
}

.file-name { flex: 1; min-width: 0; overflow: hidden; color: #344054; text-overflow: ellipsis; white-space: nowrap; }
.file-chip small { color: #8793a5; font-size: 11px; }
.file-remove {
  display: inline-flex;
  width: 24px;
  height: 24px;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 50%;
  background: transparent;
}

.file-remove:hover { background: #f1f5f9; }

.segmented {
  display: inline-flex;
  padding: 3px;
  border: 1px solid #d8e0ea;
  border-radius: 8px;
  background: #edf2f7;
}

.segmented button {
  min-width: 72px;
  height: 32px;
  border: 1px solid transparent;
  border-radius: 6px;
  background: transparent;
  color: #64748b;
  font-size: 12px;
  font-weight: 700;
}

.segmented button.active { border-color: #c7d5e8; background: #fff; color: #2563dc; box-shadow: 0 1px 3px rgba(15,23,42,.08); }

/* Notices */
.notice {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
  padding: 14px 16px;
  border-radius: 8px;
  font-size: 12px;
  line-height: 1.55;
}

.notice strong { display: block; margin-bottom: 4px; font-size: 13px; }
.notice p { margin: 0; }
.notice ul { margin: 0; padding-left: 18px; }
.notice ul li { margin-bottom: 4px; }
.notice ul li strong { display: inline; margin: 0; font-size: inherit; }

.notice-info { border: 1px solid #dbe6f5; background: #f5f8fd; color: #3f4f66; }
.notice-info > .v-icon { color: #4a6fa5 !important; }
.notice-warning { border: 1px solid #f3e1bd; background: #fff8e8; color: #8a611d; }
.notice-warning > .v-icon { color: #c08a2e !important; }
.notice-error { margin-bottom: 14px; border: 1px solid #fecdca; background: #fef3f2; color: #b42318; }
.notice-error > .v-icon { color: #d92d20 !important; }

.declaration {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 14px 16px;
  border: 1px solid #e1e6ed;
  border-radius: 8px;
  color: #344054;
  font-size: 12px;
  line-height: 1.55;
  cursor: pointer;
}

.declaration input { margin-top: 2px; }
.declaration.disabled { cursor: not-allowed; opacity: .6; }

/* Submission progress */
.submit-progress {
  margin-top: 14px;
  padding: 14px 16px;
  border: 1px solid #dbe6f5;
  border-radius: 10px;
  background: #f8fafd;
}
.submit-progress ul { display: grid; gap: 10px; margin: 0; padding: 0; list-style: none; }
.submit-progress li { display: flex; align-items: center; gap: 10px; color: #94a3b8; font-size: 13px; }
.submit-progress li.is-active { color: #1d4ed8; font-weight: 600; }
.submit-progress li.is-done { color: #344054; }
.progress-marker {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border: 1.5px solid #cbd5e1;
  border-radius: 50%;
}
.is-active .progress-marker { border-color: transparent; color: #2563eb; }
.is-done .progress-marker { border-color: #2daf78; background: #2daf78; }
.is-done .progress-marker >>> .v-icon { color: #fff !important; }
.submit-progress small { display: block; margin-top: 12px; color: #718198; font-size: 12px; }

/* Footer & buttons (match ServiceConfig) */
.panel-footer {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid #e8edf3;
}

.spacer { flex: 1; }

.primary-button, .secondary-button, .ghost-button {
  min-height: 36px;
  padding: 0 14px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
}

.primary-button { border: 1px solid #6c757d; background: #6c757d; color: #fff; }
.primary-button:hover:not(:disabled) { border-color: #545b62; background: #5a6268; }
.primary-button:disabled { cursor: not-allowed; opacity: .55; }
.secondary-button { border: 1px solid #6c757d; background: #fff; color: #6c757d; }
.secondary-button:hover:not(:disabled) { background: #6c757d; color: #fff; }
.ghost-button { border: 1px solid transparent; background: transparent; color: #6c757d; }
.ghost-button:hover:not(:disabled) { background: #f1f5f9; }

@media (max-width: 760px) {
  .company-verification { grid-template-columns: 1fr; }
  .step-rail { flex-direction: row; overflow-x: auto; padding: 0 0 12px; border-right: 0; border-bottom: 1px solid #e8edf3; }
  .step-rail-text small { display: none; }
  .step-panel { padding: 16px 0 0; }
  .field-grid { grid-template-columns: 1fr; }
  .span-2 { grid-column: auto; }
}
</style>
