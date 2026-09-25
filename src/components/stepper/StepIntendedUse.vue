<template>
  <form class="form-card" novalidate @submit.prevent="submitStep">
    <div class="card-heading">
      <h2>How will you use Hypersign?</h2>
      <p>These answers help us prepare your workspace. You can change them later.</p>
    </div>

    <section class="form-section first-section">
      <div class="section-title">Verification services <em>*</em> <span>Select any</span></div>
      <div class="service-grid">
        <label
          v-for="service in serviceOptions"
          :key="service.value"
          class="service-option"
          :class="{ 'is-selected': localCompany.interests.includes(service.value) }"
        >
          <input
            type="checkbox"
            :checked="localCompany.interests.includes(service.value)"
            @change="toggleService(service)"
          />
          <span>{{ service.label }}</span>
        </label>
      </div>
      <span v-if="errors.interests" class="field-error">{{ errors.interests }}</span>
    </section>

    <section class="form-section">
      <div class="field-group compact-field">
        <label>Expected verifications per year <em>*</em></label>
        <select v-model="localCompany.yearly_volume">
          <option value="" disabled>Select expected volume</option>
          <option v-for="volume in volumeOptions" :key="volume" :value="volume">{{ volume }}</option>
        </select>
        <small>An estimate is fine.</small>
        <span v-if="errors.yearlyVolume" class="field-error">{{ errors.yearlyVolume }}</span>
      </div>
    </section>

    <section class="form-section">
      <div class="section-title">Industries <em>*</em></div>
      <div ref="industryPicker" class="industry-picker">
        <input
          v-model.trim="industrySearch"
          type="search"
          placeholder="Search or select industries"
          aria-label="Search industries"
          :aria-expanded="industryMenuOpen ? 'true' : 'false'"
          aria-controls="industry-options"
          @focus="industryMenuOpen = true"
          @keydown.esc="industryMenuOpen = false"
        />
        <div
          v-if="industryMenuOpen && filteredIndustries.length"
          id="industry-options"
          class="industry-results"
          role="listbox"
        >
          <button
            v-for="industry in filteredIndustries"
            :key="industry"
            type="button"
            role="option"
            @click="addIndustry(industry)"
          >
            {{ industry }}
          </button>
        </div>
        <div v-else-if="industryMenuOpen && industrySearch" class="industry-results industry-empty">
          No matching industries
        </div>
        <div v-if="localCompany.fields.length" class="selected-industries">
          <button
            v-for="industry in localCompany.fields"
            :key="industry"
            type="button"
            :aria-label="`Remove ${industry}`"
            @click="removeIndustry(industry)"
          >
            {{ industry }} <span aria-hidden="true">×</span>
          </button>
        </div>
      </div>
      <span v-if="errors.fields" class="field-error">{{ errors.fields }}</span>
    </section>

    <footer class="form-footer">
      <button type="button" class="secondary-button" @click="$emit('prev-step')">← Back</button>
      <button type="submit" class="primary-button">Continue <span aria-hidden="true">→</span></button>
    </footer>
  </form>
</template>

<script>
export default {
  name: 'StepIntendedUse',
  props: {
    company: { type: Object, required: true },
  },
  data() {
    return {
      localCompany: {
        ...this.company,
        interests: [...(this.company.interests || [])],
        service_types: [...(this.company.service_types || [])],
        fields: [...(this.company.fields || [])],
      },
      industrySearch: '',
      industryMenuOpen: false,
      errors: {},
      serviceOptions: [
        { value: 'Know Your Customer (KYC)', label: 'Know Your Customer (KYC)', apiType: 'KYC' },
        { value: 'Know Your Business (KYB)', label: 'Know Your Business (KYB)', apiType: 'KYB' },
        { value: 'Aadhaar Verification', label: 'Aadhaar verification' },
        { value: 'Age Verification', label: 'Age verification' },
        { value: 'Proof of Personhood', label: 'Proof of personhood' },
        { value: 'AML Screening', label: 'AML screening' },
        { value: 'Proof Of Address', label: 'Proof of address' },
        { value: 'Collect Wallet Address', label: 'Collect wallet address' },
        { value: 'Fraud Prevention', label: 'Fraud prevention' },
      ],
      volumeOptions: ['0 - 1,000', '1,001 - 20,000', '20,000 - 50,000', '+50,000'],
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
    filteredIndustries() {
      const query = this.industrySearch.toLowerCase();
      return this.industryOptions
        .filter(item => (!query || item.toLowerCase().includes(query)) && !this.localCompany.fields.includes(item));
    },
  },
  mounted() {
    document.addEventListener('mousedown', this.handleOutsideClick);
  },
  beforeDestroy() {
    document.removeEventListener('mousedown', this.handleOutsideClick);
  },
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
      if (!this.localCompany.fields.includes(industry)) {
        this.localCompany.fields = [...this.localCompany.fields, industry];
      }
      this.industrySearch = '';
      this.industryMenuOpen = false;
    },
    removeIndustry(industry) {
      this.localCompany.fields = this.localCompany.fields.filter(item => item !== industry);
    },
    handleOutsideClick(event) {
      if (this.$refs.industryPicker && !this.$refs.industryPicker.contains(event.target)) {
        this.industryMenuOpen = false;
      }
    },
    submitStep() {
      const errors = {};
      if (!this.localCompany.interests.length) errors.interests = 'Select at least one verification service.';
      if (!this.localCompany.yearly_volume) errors.yearlyVolume = 'Select the expected yearly volume.';
      if (!this.localCompany.fields.length) errors.fields = 'Select at least one industry.';
      this.errors = errors;
      if (Object.keys(errors).length === 0) {
        this.$emit('update:company', { ...this.localCompany });
        this.$emit('next-step');
      }
    },
  },
};
</script>

<style scoped>
.form-card { padding: 24px; border: 1px solid #dfe5ee; border-radius: 8px; background: #fff; }
.card-heading h2 { margin: 0 0 5px; color: #1d2939; font-size: 18px; font-weight: 700; }
.card-heading p { margin: 0; color: #718096; font-size: 13px; }
.form-section { margin-top: 22px; padding-top: 18px; border-top: 1px solid #e8edf3; }
.first-section { padding-top: 0; border-top: 0; }
.section-title, label { margin-bottom: 9px; color: #344054; font-size: 12px; font-weight: 700; }
.section-title span { margin-left: 4px; color: #8a95a5; font-size: 11px; font-weight: 400; }
em, .field-error { color: #d92d20; font-style: normal; }
.service-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.service-option { display: flex; min-height: 40px; align-items: center; gap: 8px; margin: 0; padding: 9px 11px; border: 1px solid #dce3ec; border-radius: 5px; background: #fff; cursor: pointer; font-size: 13px; font-weight: 500; }
.service-option.is-selected { border-color: #8aaff7; background: #f5f8ff; color: #245dc5; }
.service-option input { width: 13px; height: 13px; accent-color: #2f6fec; }
.field-group { display: flex; flex-direction: column; }
.compact-field { max-width: 280px; }
.field-group select, .industry-picker > input { width: 100%; height: 38px; padding: 0 11px; border: 1px solid #d7dfe9; border-radius: 5px; background: #fff; color: #243044; font-size: 13px; outline: none; }
.field-group select:focus, .industry-picker > input:focus { border-color: #2f6fec; box-shadow: 0 0 0 2px rgba(47,111,236,.12); }
.field-group small { margin-top: 5px; color: #8a95a5; font-size: 11px; }
.field-error { display: block; margin-top: 6px; font-size: 12px; }
.industry-picker { position: relative; }
.industry-results { position: absolute; z-index: 20; top: calc(100% + 4px); right: 0; left: 0; max-height: 220px; overflow-y: auto; padding: 5px; border: 1px solid #dce3ec; border-radius: 5px; background: #fff; box-shadow: 0 8px 20px rgba(15,23,42,.12); }
.industry-results button { display: block; width: 100%; padding: 8px; border: 0; border-radius: 4px; background: #fff; color: #344054; font-size: 13px; text-align: left; }
.industry-results button:hover { background: #f4f7fb; }
.industry-empty { padding: 12px; color: #7a8799; font-size: 12px; }
.selected-industries { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px; }
.selected-industries button { padding: 5px 9px; border: 1px solid #cbd9f4; border-radius: 14px; background: #f2f6ff; color: #315fba; font-size: 11px; }
.form-footer { display: flex; justify-content: space-between; margin-top: 26px; padding-top: 18px; border-top: 1px solid #e8edf3; }
.primary-button, .secondary-button { min-width: 92px; height: 38px; padding: 0 16px; border-radius: 5px; font-size: 12px; font-weight: 700; }
.primary-button { border: 0; background: #6c757d; color: #fff; }
.primary-button:hover { background: #5a6268; }
.secondary-button { border: 1px solid #6c757d; background: #fff; color: #6c757d; }
.secondary-button:hover { background: #6c757d; color: #fff; }
@media (max-width: 600px) { .form-card { padding: 18px; } .service-grid { grid-template-columns: 1fr; } }
</style>
