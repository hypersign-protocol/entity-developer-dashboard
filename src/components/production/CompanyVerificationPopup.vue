<template>
  <hf-pop-up :id="popupId" Header="Company verification" size="xl" @hidden="isOpen = false">
    <div class="company-verification">
      <nav class="step-rail" aria-label="Company verification steps">
        <button
          v-for="(step, index) in steps"
          :key="step.value"
          type="button"
          class="step-rail-item"
          :class="{ active: activeStep === step.value, complete: step.complete }"
          @click="activeStep = step.value"
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
        <!-- Step 1: company details & documents -->
        <template v-if="activeStep === 'company'">
          <header class="panel-header">
            <h3>Company details &amp; documents</h3>
            <p>Our compliance team uses these details to verify your business.</p>
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
              <section class="form-section">
                <header class="form-section-header">
                  <h4>Basic details</h4>
                  <p>Prefilled from onboarding. Update anything that has changed.</p>
                </header>
                <div class="field-grid">
                  <div class="field span-2">
                    <label>Legal company name <span class="required-marker">*</span></label>
                    <input v-model.trim="form.basic.companyName" type="text" autocomplete="organization" />
                  </div>
                  <div class="field">
                    <label>Website domain <span class="required-marker">*</span></label>
                    <input v-model.trim="form.basic.domain" type="text" placeholder="example.com" />
                  </div>
                  <div class="field">
                    <label>Contact email <span class="required-marker">*</span></label>
                    <input v-model.trim="form.basic.customerEmail" type="email" autocomplete="email" />
                    <small v-if="form.basic.customerEmail && !isEmailValid" class="field-error">Enter a valid email address.</small>
                  </div>
                  <div class="field">
                    <label>Phone number</label>
                    <div class="phone-control">
                      <span v-if="callingCode">{{ callingCode }}</span>
                      <input v-model.trim="form.basic.phoneNumber" type="tel" placeholder="9876543210" autocomplete="tel-national" />
                    </div>
                    <small v-if="phoneError" class="field-error">{{ phoneError }}</small>
                  </div>
                  <div class="field">
                    <label>Country of registration <span class="required-marker">*</span></label>
                    <div class="select-control">
                      <select v-model="form.basic.country" autocomplete="country">
                        <option value="" disabled>{{ detectingCountry ? 'Detecting your country…' : 'Select a country' }}</option>
                        <option v-for="option in countryOptions" :key="option.value" :value="option.value">{{ option.text }}</option>
                      </select>
                      <i class="mdi mdi-chevron-down" aria-hidden="true"></i>
                    </div>
                  </div>
                </div>
              </section>

              <section class="form-section">
                <header class="form-section-header">
                  <h4>Registered address</h4>
                  <p>The official address on your incorporation documents.</p>
                </header>
                <div class="field-grid">
                  <div class="field span-2">
                    <label>Address line 1 <span class="required-marker">*</span></label>
                    <input v-model.trim="form.address.line1" type="text" autocomplete="address-line1" />
                  </div>
                  <div class="field span-2">
                    <label>Address line 2</label>
                    <input v-model.trim="form.address.line2" type="text" autocomplete="address-line2" />
                  </div>
                  <div class="field">
                    <label>City <span class="required-marker">*</span></label>
                    <input v-model.trim="form.address.city" type="text" autocomplete="address-level2" />
                  </div>
                  <div class="field">
                    <label>State / Province <span class="required-marker">*</span></label>
                    <input v-model.trim="form.address.state" type="text" autocomplete="address-level1" />
                  </div>
                  <div class="field">
                    <label>Postal code <span class="required-marker">*</span></label>
                    <input v-model.trim="form.address.postalCode" type="text" autocomplete="postal-code" />
                  </div>
                  <div class="field">
                    <label>Country</label>
                    <input :value="countryLabel" type="text" disabled />
                    <small>Same as the country of registration.</small>
                  </div>
                </div>
              </section>

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
                <div class="field">
                  <label>{{ taxRule.label }} <span class="required-marker">*</span></label>
                  <input v-model.trim="form.taxId" type="text" :placeholder="taxRule.example ? `e.g. ${taxRule.example}` : ''" />
                  <small v-if="taxIdError" class="field-error">{{ taxIdError }}</small>
                </div>
                <div class="field">
                  <label>{{ taxRule.document }} <span class="required-marker">*</span></label>
                  <div v-if="form.documents.tax" class="file-chip">
                    <v-icon small>mdi-file-document-outline</v-icon>
                    <span class="file-name">{{ form.documents.tax.fileName }}</span>
                    <small>{{ formatSize(form.documents.tax.size) }}</small>
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
                <div class="field">
                  <label>{{ registrationRule.label }}</label>
                  <input v-model.trim="form.registrationNumber" type="text" :placeholder="registrationRule.example ? `e.g. ${registrationRule.example}` : ''" />
                  <small v-if="registrationError" class="field-error">{{ registrationError }}</small>
                </div>
                <div class="field">
                  <label>Certificate of incorporation</label>
                  <div v-if="form.documents.incorporation" class="file-chip">
                    <v-icon small>mdi-file-document-outline</v-icon>
                    <span class="file-name">{{ form.documents.incorporation.fileName }}</span>
                    <small>{{ formatSize(form.documents.incorporation.size) }}</small>
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

        <!-- Step 2: review & submit -->
        <template v-else>
          <header class="panel-header">
            <h3>Review &amp; submit</h3>
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
              <p>Fill in all required company details and documents in the previous step first.</p>
            </div>
          </div>

          <label class="declaration" :class="{ disabled: !companyDetailsComplete }">
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
import { COUNTRY_OPTIONS, CALLING_CODES, countryName, detectCountryFromIp } from '../../utils/countries.js';
import { getIdentifierRule, validateIdentifier } from '../../utils/companyIdentifiers.js';
import { COMPANY_REVIEW, companyReviewStatus } from './companyReview.js';

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
    // Used to prefill the company domain when onboarding has none
    domain: { type: String, default: '' },
  },
  data() {
    return {
      popupId: 'company-verification-popup',
      activeStep: 'company',
      loadingOnboarding: false,
      detectingCountry: false,
      onboarding: {},
      form: emptyForm(),
      declarationAccepted: false,
      submitting: false,
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
    countryOptions() {
      return Object.entries(COUNTRY_OPTIONS)
        .map(([value, text]) => ({ value, text }))
        .sort((left, right) => left.text.localeCompare(right.text));
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
      return getIdentifierRule('registration', this.form.basic.country);
    },
    // Business registered for tax -> company tax ID; otherwise the owner's personal tax ID
    taxIdKind() {
      return this.form.taxApplicable === false ? 'personalTax' : 'tax';
    },
    taxRule() {
      return getIdentifierRule(this.taxIdKind, this.form.basic.country);
    },
    registrationError() {
      return validateIdentifier('registration', this.form.basic.country, this.form.registrationNumber);
    },
    taxIdError() {
      return validateIdentifier(this.taxIdKind, this.form.basic.country, this.form.taxId);
    },
    // Already with compliance (or approved); a rejected submission can be resent
    alreadySubmitted() {
      const status = companyReviewStatus(this.onboarding);
      return status === COMPANY_REVIEW.UNDER_REVIEW || status === COMPANY_REVIEW.VERIFIED;
    },
    companyDetailsComplete() {
      if (this.alreadySubmitted) return true;
      const { basic, address, documents } = this.form;
      const basicComplete = [basic.companyName, basic.domain, basic.country].every(Boolean)
        && this.isEmailValid && !this.phoneError;
      // Registration is optional, but a number that is filled in must still be valid
      const registrationComplete = !this.registrationError;
      const addressComplete = [address.line1, address.city, address.state, address.postalCode].every(Boolean);
      const taxComplete = Boolean(this.form.taxId) && !this.taxIdError && Boolean(documents.tax);
      return basicComplete && addressComplete && taxComplete && registrationComplete;
    },
    steps() {
      return [
        { value: 'company', label: 'Company & documents', hint: 'Details and uploads', complete: this.companyDetailsComplete },
        { value: 'review', label: 'Review & submit', hint: 'Confirm and send', complete: false },
      ];
    },
    activeStepIndex() {
      return this.steps.findIndex(step => step.value === this.activeStep);
    },
    canSubmit() {
      return this.companyDetailsComplete && !this.alreadySubmitted && this.declarationAccepted;
    },
  },
  watch: {
    value: {
      immediate: true,
      handler(open) {
        if (open) this.reset();
        this.$nextTick(() => {
          this.$root.$emit(open ? 'bv::show::modal' : 'bv::hide::modal', this.popupId);
        });
      },
    },
  },
  methods: {
    reset() {
      this.activeStep = 'company';
      this.form = emptyForm();
      this.declarationAccepted = false;
      this.loadOnboarding();
    },
    async loadOnboarding() {
      this.loadingOnboarding = true;
      try {
        const data = await this.$store.dispatch('mainStore/checkIfAlreadyExistOnBoarding');
        this.onboarding = data || {};
        const saved = this.onboarding.registeredAddress || {};
        this.form.basic = {
          companyName: this.onboarding.companyName || '',
          domain: this.onboarding.domain || this.domain || '',
          customerEmail: this.onboarding.customerEmail || '',
          phoneNumber: this.onboarding.phoneNumber || '',
          country: this.onboarding.country || '',
        };
        this.form.registrationNumber = this.onboarding.registrationNumber || '';
        this.form.address = { ...this.form.address, ...saved };
        if (typeof this.onboarding.isTaxApplicable === 'boolean') this.form.taxApplicable = this.onboarding.isTaxApplicable;
        this.form.taxId = this.onboarding.taxId || '';
      } catch (error) {
        this.notifyErr(error.message || 'Could not load your company details.');
      } finally {
        this.loadingOnboarding = false;
      }
      if (!this.form.basic.country) this.detectCountry();
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
    goToStep(index) {
      const step = this.steps[index];
      if (step) this.activeStep = step.value;
    },
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
    buildPayload() {
      const { documents } = this.form;
      if (!this.form.taxApplicable) {
        throw new Error('The dashboard service does not currently support personal tax ID document types.');
      }
      const countryCode = countries.alpha3ToAlpha2(this.form.basic.country);
      if (!countryCode) throw new Error('This country is not supported for company verification.');
      const normalizedTaxId = this.form.taxId.toUpperCase();
      const isIndia = countryCode === 'IN';
      const registrationNumber = this.form.registrationNumber.toUpperCase().replace(/[\s-]/g, '');
      const registrationNumberType = registrationNumber
        ? (isIndia ? (/^[LU]\d{5}[A-Z]{2}\d{4}[A-Z]{3}\d{6}$/.test(registrationNumber) ? 'CIN' : 'LLPIN') : 'OTHER')
        : undefined;
      const taxIdType = isIndia
        ? (/^[A-Z]{5}\d{4}[A-Z]$/.test(normalizedTaxId) ? 'PAN' : 'GSTIN')
        : 'OTHER';
      const company = {
        name: this.form.basic.companyName,
        domain: this.form.basic.domain,
        region: this.form.address.state,
        countryOfRegistration: countryCode,
        ...(registrationNumber ? { registrationNumber, registrationNumberType } : {}),
        taxIdType,
        taxIdNumber: normalizedTaxId,
        address: {
          street: [this.form.address.line1, this.form.address.line2].filter(Boolean).join(', '),
          province: this.form.address.state,
          postalCode: this.form.address.postalCode,
          city: this.form.address.city,
          country: countryCode,
        },
      };
      const documentEntries = [
        { type: 'TaxRegistration', doc: documents.tax },
        ...(documents.incorporation ? [{ type: 'CertificateOfIncorporation', doc: documents.incorporation }] : []),
      ];
      const formData = new FormData();
      formData.append('onboardingID', this.onboarding._id);
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
        await this.$store.dispatch('mainStore/submitProductionDetails', this.buildPayload());
        this.close();
        this.notifySuccess('Company details submitted for review.');
        this.$emit('submitted');
      } catch (error) {
        this.notifyErr(error.message || 'Could not submit your details. Please try again.');
      } finally {
        this.submitting = false;
      }
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
