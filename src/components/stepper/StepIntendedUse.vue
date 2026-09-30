<template>
  <form class="form-card" novalidate @submit.prevent="submitStep">
    <header class="card-heading">
      <h2>How will you use Hypersign?</h2>
      <p>These answers help us prepare your workspace. You can change them later.</p>
    </header>

    <section class="form-section first-section">
      <div class="section-title">Verification services <em>*</em> <span>Select any</span></div>
      <div class="service-grid">
        <label v-for="service in visibleServiceOptions" :key="service.value" class="service-option" :class="{ 'is-selected': localCompany.interests.includes(service.value) }">
          <input type="checkbox" :checked="localCompany.interests.includes(service.value)" @change="toggleService(service)" />
          <span>{{ service.label }}</span>
        </label>
      </div>
      <span v-if="errors.interests" class="field-error">{{ errors.interests }}</span>
    </section>

    <section class="form-section">
      <fieldset class="field-group volume-field">
        <legend>Expected verifications per month <em>*</em></legend>
        <div class="volume-options">
          <label v-for="volume in volumeOptions" :key="volume" class="volume-option">
            <input v-model="localCompany.yearly_volume" type="radio" name="verification-volume" :value="volume" />
            <span>{{ volume }}</span>
          </label>
        </div>
        <span v-if="errors.volume" class="field-error">{{ errors.volume }}</span>
      </fieldset>
    </section>

    <section class="form-section">
      <div class="field-group">
        <label for="industry-search">Industries <em>*</em></label>
        <div ref="industryPicker" class="industry-picker">
          <input id="industry-search" v-model.trim="industrySearch" type="search" placeholder="Search or select industries" :aria-expanded="industryMenuOpen ? 'true' : 'false'" aria-controls="industry-options" @focus="industryMenuOpen = true" @keydown.esc="industryMenuOpen = false" />
          <button type="button" class="dropdown-toggle-button" aria-label="Toggle industry options" :aria-expanded="industryMenuOpen ? 'true' : 'false'" @click="industryMenuOpen = !industryMenuOpen">
            <i class="mdi mdi-chevron-down" :class="{ 'is-open': industryMenuOpen }" aria-hidden="true"></i>
          </button>
          <div v-if="industryMenuOpen && filteredIndustries.length" id="industry-options" class="industry-results" role="listbox">
            <button v-for="industry in filteredIndustries" :key="industry" type="button" role="option" @click="addIndustry(industry)">{{ industry }}</button>
          </div>
          <div v-else-if="industryMenuOpen && industrySearch" class="industry-results industry-empty">No matching industries</div>
          <div v-if="localCompany.fields.length" class="selected-industries">
            <button v-for="industry in localCompany.fields" :key="industry" type="button" :aria-label="`Remove ${industry}`" @click="removeIndustry(industry)">
              {{ industry }} <span aria-hidden="true">×</span>
            </button>
          </div>
        </div>
        <span v-if="errors.fields" class="field-error">{{ errors.fields }}</span>
      </div>
    </section>

    <section class="form-section">
      <div class="field-group">
        <label for="referral-source">How did you hear about us? <em>*</em></label>
        <div class="select-control">
          <select id="referral-source" v-model="localCompany.referral_source">
            <option value="" disabled>Select an option</option>
            <option v-for="source in referralOptions" :key="source" :value="source">{{ source }}</option>
          </select>
          <i class="mdi mdi-chevron-down" aria-hidden="true"></i>
        </div>
        <span v-if="errors.referral" class="field-error">{{ errors.referral }}</span>
        <div v-if="localCompany.referral_source === 'Other'" class="other-source-field">
          <input
            id="other-referral-source"
            v-model.trim="localCompany.referral_source_other"
            type="text"
            :class="{ 'is-invalid': errors.referralOther }"
            aria-label="Specify how you heard about us"
            :aria-invalid="errors.referralOther ? 'true' : 'false'"
            :aria-describedby="errors.referralOther ? 'other-referral-error' : null"
            placeholder="Please specify how you heard about us"
          />
          <div v-if="errors.referralOther" id="other-referral-error" class="invalid-feedback d-block" role="alert">{{ errors.referralOther }}</div>
        </div>
      </div>
    </section>

    <footer class="form-footer">
      <button type="button" class="secondary-button" @click="$emit('prev-step')">← Back</button>
      <button type="submit" class="primary-button">Continue <span aria-hidden="true">→</span></button>
    </footer>
  </form>
</template>

<script>
const INDIA_ONLY_SERVICES = ['Aadhaar Verification', 'PAN Verification', 'Bank Verification'];

export default {
  name: 'StepIntendedUse',
  props: { company: { type: Object, required: true } },
  data() {
    return {
      localCompany: {
        ...this.company,
        interests: [...(this.company.interests || [])],
        service_types: [...(this.company.service_types || [])],
        fields: [...(this.company.fields || [])],
        referral_source: this.company.referral_source || '',
        referral_source_other: this.company.referral_source_other || '',
      },
      industrySearch: '',
      industryMenuOpen: false,
      errors: {},
      serviceOptions: [
        { value: 'Know Your Customer (KYC)', label: 'Know Your Customer (KYC)', apiType: 'KYC' },
        { value: 'Know Your Business (KYB)', label: 'Know Your Business (KYB)', apiType: 'KYB' },
        { value: 'Aadhaar Verification', label: 'Aadhaar verification', indiaOnly: true },
        { value: 'PAN Verification', label: 'PAN verification', indiaOnly: true },
        { value: 'Age Verification', label: 'Age verification' },
        { value: 'Bank Verification', label: 'Bank verification', indiaOnly: true },
        { value: 'Proof of Personhood', label: 'Proof of personhood' },
        { value: 'Biometric Verification & Liveness Detection', label: 'Biometric Verification & Liveness detection' },
        { value: 'Proof Of Address', label: 'Proof of address' },
        { value: 'Device & Risk Intelligence', label: 'Device & Risk Intelligence' },
        { value: 'AML Screening', label: 'AML screening' },
        { value: 'Deepfake Detection', label: 'Deepfake Detection' },
      ],
      volumeOptions: ['0 - 1,000', '1,000 - 5,000', '5,000 - 10,000', '+10,000'],
      referralOptions: ['LinkedIn', 'Google', 'ChatGPT', 'Claude', 'Gemini', 'Other'],
      industryOptions: [
        'Fintech', 'Crypto', 'Gambling', 'Marketplaces', 'Online Travel', 'Telco',
        'E-commerce', 'Banking', 'Insurance', 'Healthcare', 'Government / Public Sector',
        'Education / EdTech', 'Real Estate', 'Transport / Mobility',
        'Social Media / Community Platforms', 'Entertainment / Streaming', 'Gaming / Esports',
        'Legal / Compliance Services', 'Supply Chain / Logistics', 'NFT / Web3 Projects', 'Other',
      ],
    };
  },
  computed: {
    visibleServiceOptions() {
      return this.serviceOptions.filter(service => !service.indiaOnly || this.localCompany.country === 'IND');
    },
    filteredIndustries() {
      const query = this.industrySearch.toLowerCase();
      return this.industryOptions.filter(item => (!query || item.toLowerCase().includes(query)) && !this.localCompany.fields.includes(item));
    },
  },
  created() {
    if (this.localCompany.country !== 'IND') {
      this.localCompany.interests = this.localCompany.interests.filter(item => !INDIA_ONLY_SERVICES.includes(item));
    }
  },
  mounted() { document.addEventListener('mousedown', this.handleOutsideClick); },
  beforeDestroy() { document.removeEventListener('mousedown', this.handleOutsideClick); },
  methods: {
    toggleService(service) {
      const selected = this.localCompany.interests.includes(service.value);
      this.localCompany.interests = selected
        ? this.localCompany.interests.filter(item => item !== service.value)
        : [...this.localCompany.interests, service.value];
      if (service.apiType) {
        this.localCompany.service_types = selected
          ? this.localCompany.service_types.filter(item => item !== service.apiType)
          : [...new Set([...this.localCompany.service_types, service.apiType])];
      }
    },
    addIndustry(industry) {
      if (!this.localCompany.fields.includes(industry)) this.localCompany.fields = [...this.localCompany.fields, industry];
      this.industrySearch = '';
      this.industryMenuOpen = false;
    },
    removeIndustry(industry) { this.localCompany.fields = this.localCompany.fields.filter(item => item !== industry); },
    handleOutsideClick(event) {
      if (this.$refs.industryPicker && !this.$refs.industryPicker.contains(event.target)) this.industryMenuOpen = false;
    },
    submitStep() {
      const errors = {};
      if (!this.localCompany.interests.length) errors.interests = 'Select at least one verification service.';
      if (!this.localCompany.yearly_volume) errors.volume = 'Select the expected monthly volume.';
      if (!this.localCompany.fields.length) errors.fields = 'Select at least one industry.';
      if (!this.localCompany.referral_source) errors.referral = 'Tell us how you heard about Hypersign.';
      if (this.localCompany.referral_source === 'Other' && !this.localCompany.referral_source_other) {
        errors.referralOther = 'Enter how you heard about Hypersign.';
      }
      this.errors = errors;
      if (Object.keys(errors).length) return;
      this.$emit('update:company', { ...this.localCompany });
      this.$emit('request-submit');
    },
  },
};
</script>

<style scoped>
.form-card { padding: 24px; border: 1px solid #e5e7eb; border-radius: 7px; background: #fff; }
.card-heading h2 { margin: 0 0 4px; color: #17213d; font-size: 18px; font-weight: 700; }
.card-heading p { margin: 0; color: #64748b; font-size: 12px; }
.form-section { margin-top: 22px; padding-top: 18px; border-top: 1px solid #e2e8f0; }
.first-section { padding-top: 0; border-top: 0; }
.section-title, label { margin-bottom: 9px; color: #243453; font-size: 12px; font-weight: 700; }
.section-title span { margin-left: 6px; color: #7c8da8; font-size: 10px; font-weight: 400; }
em, .field-error { color: #e43d4f; font-style: normal; }
.service-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.service-option { display: flex; min-height: 40px; align-items: center; gap: 9px; margin: 0; padding: 9px 11px; border: 1px solid #d5dde7; border-radius: 5px; background: #fff; cursor: pointer; color: #1e293b; font-size: 12px; font-weight: 500; }
.service-option.is-selected { border-color: #94a3b8; background: #f3f4f5; color: #495057; box-shadow: 0 0 0 1px rgba(148,163,184,.18); }
.service-option input { width: 14px; height: 14px; accent-color: #6c757d; }
.field-group { display: flex; min-width: 0; flex-direction: column; }
.volume-field { min-width: 0; margin: 0; padding: 0; border: 0; }
.volume-field legend { width: auto; margin: 0 0 10px; padding: 0; color: #243453; font-size: 12px; font-weight: 700; }
.volume-options { display: flex; flex-wrap: wrap; gap: 16px 28px; align-items: center; min-height: 40px; }
.volume-option { display: inline-flex; align-items: center; gap: 8px; margin: 0; color: #344563; cursor: pointer; font-size: 12px; font-weight: 500; }
.volume-option input { width: 15px; height: 15px; margin: 0; accent-color: #6c757d; cursor: pointer; }
.field-group select, .field-group > input, .industry-picker > input, .other-source-field input { width: 100%; height: 40px; padding: 0 11px; border: 1px solid #d5dde7; border-radius: 5px; background: #fff; color: #1e293b; font-size: 12px; outline: none; }
.field-group select:focus, .field-group > input:focus, .industry-picker > input:focus, .other-source-field input:focus { border-color: #6c757d; box-shadow: 0 0 0 2px rgba(108,117,125,.14); }
.select-control { position: relative; }
.select-control select { padding-right: 40px; appearance: none; cursor: pointer; }
.select-control > i { position: absolute; top: 50%; right: 12px; color: #64748b; font-size: 18px; pointer-events: none; transform: translateY(-50%); }
.other-source-field { display: flex; width: 100%; flex-direction: column; margin-top: 8px; }
.other-source-field input.is-invalid { border-color: #dc3545; box-shadow: none; }
.field-error { display: block; margin-top: 6px; font-size: 11px; }
.industry-picker { position: relative; }
.industry-picker > input { padding-right: 42px; }
.industry-picker > input::-webkit-search-cancel-button { display: none; }
.dropdown-toggle-button { position: absolute; z-index: 2; top: 1px; right: 1px; display: flex; width: 39px; height: 38px; align-items: center; justify-content: center; border: 0; border-radius: 0 5px 5px 0; background: transparent; color: #64748b; }
.dropdown-toggle-button i { font-size: 18px; transition: transform .18s ease; }
.dropdown-toggle-button i.is-open { transform: rotate(180deg); }
.industry-results { position: absolute; z-index: 20; top: calc(100% + 4px); right: 0; left: 0; max-height: 220px; overflow-y: auto; padding: 5px; border: 1px solid #dce3ec; border-radius: 5px; background: #fff; box-shadow: 0 8px 20px rgba(15,23,42,.12); }
.industry-results button { display: block; width: 100%; padding: 8px; border: 0; border-radius: 4px; background: #fff; color: #344054; font-size: 12px; text-align: left; }
.industry-results button:hover { background: #f3f4f5; }
.industry-empty { padding: 12px; color: #7a8799; font-size: 11px; }
.selected-industries { display: flex; flex-wrap: wrap; gap: 7px; margin-top: 9px; }
.selected-industries button { display: inline-flex; align-items: center; gap: 5px; min-height: 28px; padding: 4px 10px; border: 1px solid #cbd5e1; border-radius: 14px; background: #e4e7e9; color: #343a40; font-size: 11px; font-weight: 650; }
.selected-industries button:hover { border-color: #94a3b8; background: #d8dcdf; }
.selected-industries button span { color: #5f676e; font-size: 13px; font-weight: 700; line-height: 1; }
.form-footer { display: flex; justify-content: space-between; margin-top: 24px; padding-top: 18px; border-top: 1px solid #e2e8f0; }
.primary-button, .secondary-button { min-width: 92px; height: 38px; padding: 0 16px; border-radius: 5px; font-size: 12px; font-weight: 700; }
.primary-button { border: 1px solid #6c757d; background: #6c757d; color: #fff; }
.primary-button:hover { border-color: #545b62; background: #5a6268; }
.secondary-button { border: 1px solid #6c757d; background: #fff; color: #6c757d; }
.secondary-button:hover { border-color: #6c757d; background: #6c757d; color: #fff; }
@media (max-width: 600px) {
  .form-card { padding: 18px; }
  .service-grid { grid-template-columns: 1fr; }
  .volume-options { align-items: flex-start; flex-direction: column; gap: 12px; }
}
</style>
