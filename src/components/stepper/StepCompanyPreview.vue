<template>
  <section class="review-card">
    <header class="card-heading">
      <h2>Review your request</h2>
      <p>Check the details below before sending your workspace activation request.</p>
    </header>

    <div v-if="errorMessage" class="submission-error" role="alert">
      <span>{{ errorMessage }}</span>
      <button type="button" aria-label="Dismiss error" @click="$emit('clear-error')">×</button>
    </div>

    <section class="review-section">
      <div class="section-header">
        <h3>Organization</h3>
        <button v-if="!readOnlyReview" type="button" @click="$emit('go-to-step', 1)">Edit</button>
      </div>
      <dl class="review-grid">
        <div><dt>Type</dt><dd>{{ typeLabel }}</dd></div>
        <div><dt>Name</dt><dd>{{ company.name || '—' }}</dd></div>
        <div><dt>Country</dt><dd>{{ company.country || '—' }}</dd></div>
        <div><dt>Work email</dt><dd>{{ company.contact_email || '—' }}</dd></div>
        <div><dt>Domain</dt><dd>{{ company.domain || '—' }}</dd></div>
        <div v-if="company.type === 'BUSINESS'"><dt>Registration number</dt><dd>{{ company.registration_number || '—' }}</dd></div>
        <div><dt>Contact phone</dt><dd>{{ company.phone_no || '—' }}</dd></div>
        <div class="logo-review">
          <dt>Organization logo</dt>
          <dd><img v-if="company.logo" :src="company.logo" alt="Organization logo" /></dd>
        </div>
      </dl>
    </section>

    <section class="review-section">
      <div class="section-header">
        <h3>Intended use</h3>
        <button v-if="!readOnlyReview" type="button" @click="$emit('go-to-step', 2)">Edit</button>
      </div>
      <dl class="review-list">
        <div><dt>Services</dt><dd>{{ joinedServices }}</dd></div>
        <div><dt>Yearly volume</dt><dd>{{ company.yearly_volume || '—' }}</dd></div>
        <div><dt>Industries</dt><dd>{{ joinedIndustries }}</dd></div>
      </dl>
    </section>

    <section v-if="hasSocialProfiles" class="review-section">
      <div class="section-header"><h3>Social profiles</h3></div>
      <dl class="review-list">
        <div v-if="company.twitterUrl"><dt>Twitter / X</dt><dd>{{ company.twitterUrl }}</dd></div>
        <div v-if="company.linkedinUrl"><dt>LinkedIn</dt><dd>{{ company.linkedinUrl }}</dd></div>
        <div v-if="company.telegramUrl"><dt>Telegram</dt><dd>{{ company.telegramUrl }}</dd></div>
      </dl>
    </section>

    <div class="review-notice">
      <v-icon small color="#2f6fec">mdi-information-outline</v-icon>
      <p><strong>What happens next:</strong> Your request goes to the Hypersign team for review. If approved, we’ll activate the selected services and assign credits. We’ll email you when the status changes.</p>
    </div>

    <footer class="review-footer">
      <button v-if="readOnlyReview" type="button" class="secondary-button" @click="$emit('back-to-status')">← Back to status</button>
      <button v-else type="button" class="secondary-button" @click="$emit('prev-step')">← Back</button>
      <button
        v-if="!readOnlyReview"
        type="button"
        class="primary-button"
        :disabled="isProcessingCredit"
        @click="$emit('process-credit')"
      >
        <span v-if="isProcessingCredit">Submitting…</span>
        <span v-else>Submit for review</span>
      </button>
    </footer>
  </section>
</template>

<script>
export default {
  name: 'StepCompanyPreview',
  props: {
    company: { type: Object, required: true },
    isProcessingCredit: { type: Boolean, default: false },
    errorMessage: { type: String, default: null },
    readOnlyReview: { type: Boolean, default: false },
  },
  computed: {
    typeLabel() {
      return this.company.type === 'COMMUNITY' ? 'Community' : 'Business';
    },
    joinedServices() {
      return this.company.interests?.length ? this.company.interests.join(', ') : '—';
    },
    joinedIndustries() {
      return this.company.fields?.length ? this.company.fields.join(', ') : '—';
    },
    hasSocialProfiles() {
      return Boolean(this.company.twitterUrl || this.company.linkedinUrl || this.company.telegramUrl);
    },
  },
};
</script>

<style scoped>
.review-card { padding: 24px; border: 1px solid #dfe5ee; border-radius: 8px; background: #fff; }
.card-heading h2 { margin: 0 0 5px; color: #1d2939; font-size: 18px; font-weight: 700; }
.card-heading p { margin: 0; color: #718096; font-size: 13px; }
.submission-error { display: flex; justify-content: space-between; gap: 12px; margin-top: 18px; padding: 11px 13px; border: 1px solid #f4c7c3; border-radius: 5px; background: #fff4f3; color: #b42318; font-size: 13px; }
.submission-error button { border: 0; background: transparent; color: inherit; font-size: 16px; }
.review-section { margin-top: 22px; padding-top: 18px; border-top: 1px solid #e8edf3; }
.section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
.section-header h3 { margin: 0; color: #344054; font-size: 12px; font-weight: 700; text-transform: uppercase; }
.section-header button { border: 0; background: transparent; color: #2563dc; font-size: 12px; font-weight: 700; }
.review-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px 24px; margin: 0; }
.review-grid div, .review-list div { min-width: 0; }
dt { margin-bottom: 3px; color: #8a95a5; font-size: 11px; font-weight: 600; }
dd { margin: 0; overflow-wrap: anywhere; color: #27364a; font-size: 13px; font-weight: 600; }
.logo-review img { width: 34px; height: 34px; border: 1px solid #e0e6ee; border-radius: 50%; object-fit: cover; }
.review-list { margin: 0; }
.review-list div { display: grid; grid-template-columns: 135px 1fr; gap: 12px; padding: 9px 0; border-bottom: 1px solid #f0f3f7; }
.review-list div:last-child { border-bottom: 0; }
.review-notice { display: flex; gap: 9px; margin-top: 22px; padding: 12px; border-radius: 5px; background: #f1f6ff; }
.review-notice p { margin: 0; color: #52627a; font-size: 12px; line-height: 1.5; }
.review-footer { display: flex; justify-content: space-between; margin-top: 24px; padding-top: 18px; border-top: 1px solid #e8edf3; }
.primary-button, .secondary-button { min-width: 92px; height: 38px; padding: 0 16px; border-radius: 5px; font-size: 12px; font-weight: 700; }
.primary-button { border: 0; background: #6c757d; color: #fff; }
.primary-button:hover:not(:disabled) { background: #5a6268; }
.primary-button:disabled { cursor: wait; opacity: .65; }
.secondary-button { border: 1px solid #6c757d; background: #fff; color: #6c757d; }
.secondary-button:hover { background: #6c757d; color: #fff; }
@media (max-width: 600px) {
  .review-card { padding: 18px; }
  .review-grid { grid-template-columns: 1fr; }
  .review-list div { grid-template-columns: 1fr; gap: 3px; }
}
</style>
