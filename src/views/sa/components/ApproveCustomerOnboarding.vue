<template>
  <v-container fluid pa-0>
    <load-ing :active.sync="isLoading" :can-cancel="false" :is-full-page="false"></load-ing>

    <div class="overview-container">
      <!-- Two-step approval: review the request first, then grant credits and approve -->
      <ol class="approval-steps">
        <li :class="{ 'is-active': step === 1, 'is-complete': step > 1 }">
          <span class="step-number">1</span> Review request
        </li>
        <li class="step-divider" aria-hidden="true"></li>
        <li :class="{ 'is-active': step === 2 }">
          <span class="step-number">2</span> Credits &amp; approve
        </li>
      </ol>

      <!-- Step 1: fetch and review the onboarding record -->
      <div v-if="step === 1">
        <div class="header-row">
          <h2 class="title">Record Identification</h2>
        </div>

        <form class="record-search" @submit.prevent="fetchRecord">
          <div class="record-search-input">
            <label class="input-label" for="onboarding-record-id">Onboarding Record ID</label>
            <v-text-field
              id="onboarding-record-id"
              v-model.trim="recordId"
              placeholder="e.g. 693d6fa1c15303a8e72a04b9"
              outlined
              dense
              hide-details
              color="primary"
              class="mono-text bg-white"
            ></v-text-field>
          </div>
          <button type="submit" class="primary-button" :disabled="isLoading || !recordId">
            <i class="mdi mdi-magnify mr-1" aria-hidden="true"></i>Fetch Details
          </button>
        </form>

        <div v-if="record" class="record-review">
          <section class="record-card">
            <header class="record-card-header">
              <div class="record-identity">
                <span class="record-avatar" aria-hidden="true">
                  <img v-if="record.companyLogo" :src="record.companyLogo" alt="" />
                  <i v-else class="mdi mdi-domain"></i>
                </span>
                <div>
                  <h3>{{ record.companyName || 'Unnamed organization' }}</h3>
                  <p>{{ record.customerEmail || '—' }}<span v-if="record.domain"> · {{ record.domain }}</span></p>
                </div>
              </div>
              <span class="status-badge" :class="statusClass(record.onboardingStatus)">
                {{ record.onboardingStatus || 'UNKNOWN' }}
              </span>
            </header>

            <dl class="detail-grid">
              <div v-for="item in detailItems" :key="item.label">
                <dt>{{ item.label }}</dt>
                <dd :class="{ 'mono-text': item.mono }">{{ item.value }}</dd>
              </div>
            </dl>

            <div v-if="(record.interestedService || []).length" class="chip-row">
              <span class="chip-label">Interested services</span>
              <span v-for="service in record.interestedService" :key="service" class="chip">{{ service }}</span>
            </div>
            <div v-if="(record.businessField || []).length" class="chip-row">
              <span class="chip-label">Industries</span>
              <span v-for="field in record.businessField" :key="field" class="chip">{{ field }}</span>
            </div>
            <div v-if="socialLinks.length" class="chip-row">
              <span class="chip-label">Links</span>
              <a v-for="link in socialLinks" :key="link.label" :href="link.url" target="_blank" rel="noopener noreferrer" class="chip chip-link">
                <i :class="link.icon" aria-hidden="true"></i> {{ link.label }}
              </a>
            </div>
          </section>

          <section class="record-card">
            <header class="section-heading">
              <i class="mdi mdi-timeline-text-outline" aria-hidden="true"></i>
              <h4>Onboarding logs</h4>
            </header>
            <ol v-if="(record.logs || []).length" class="log-timeline">
              <li v-for="(log, index) in record.logs" :key="`${log.step}-${index}`" :class="statusClass(log.status)">
                <span class="log-dot" aria-hidden="true"></span>
                <div class="log-body">
                  <strong>{{ humanizeStep(log.step) }}</strong>
                  <small>{{ formatDate(log.time) }}</small>
                  <div v-if="log.failureReason" class="failure-reason" role="alert">
                    <i class="mdi mdi-alert-circle-outline" aria-hidden="true"></i>
                    <span>{{ log.failureReason }}</span>
                  </div>
                </div>
                <span class="status-badge" :class="statusClass(log.status)">{{ log.status }}</span>
              </li>
            </ol>
            <p v-else class="empty-logs">No logs yet. The request has not been processed.</p>
          </section>

          <div v-if="isApproved" class="note-box">
            <i class="mdi mdi-check-decagram-outline" aria-hidden="true"></i>
            This onboarding request is already approved.
          </div>

          <footer class="step-footer">
            <span></span>
            <button type="button" class="primary-button" :disabled="isApproved" @click="goToCredits">
              Continue to credits <span aria-hidden="true">→</span>
            </button>
          </footer>
        </div>
      </div>

      <!-- Step 2: credit details and approval -->
      <div v-else>
        <div class="approval-summary">
          <span class="record-avatar small-avatar" aria-hidden="true"><i class="mdi mdi-domain"></i></span>
          <div>
            <strong>{{ record.companyName || 'Unnamed organization' }}</strong>
            <small class="mono-text">{{ record._id }}</small>
          </div>
          <span class="status-badge ml-auto" :class="statusClass(record.onboardingStatus)">{{ record.onboardingStatus }}</span>
        </div>

        <v-row>
          <v-col cols="12" md="6">
            <div class="warning-box h-100">
              <div class="d-flex align-center mb-4">
                <v-icon small color="primary" class="mr-2">mdi-shield-key-outline</v-icon>
                <span class="font-weight-bold text-uppercase small">SSI Credit Detail</span>
              </div>

              <div class="mb-3">
                <label class="input-label">Amount (uHID)</label>
                <v-text-field v-model.number="form.ssiCreditDetail.amount" type="number" outlined dense hide-details class="bg-white"></v-text-field>
              </div>

              <v-row dense>
                <v-col cols="7">
                  <label class="input-label">Validity Period</label>
                  <v-text-field v-model.number="form.ssiCreditDetail.validityPeriod" type="number" outlined dense hide-details class="bg-white"></v-text-field>
                </v-col>
                <v-col cols="5">
                  <label class="input-label">Unit</label>
                  <v-select :items="units" v-model="form.ssiCreditDetail.validityPeriodUnit" outlined dense hide-details class="bg-white"></v-select>
                </v-col>
              </v-row>
            </div>
          </v-col>

          <v-col cols="12" md="6">
            <div class="warning-box h-100">
              <div class="d-flex align-center mb-4">
                <v-icon small color="primary" class="mr-2">mdi-account-check-outline</v-icon>
                <span class="font-weight-bold text-uppercase small">KYC Credit Detail</span>
              </div>

              <div class="mb-3">
                <label class="input-label">Amount (uHID)</label>
                <v-text-field v-model.number="form.kycCreditDetail.amount" type="number" outlined dense hide-details class="bg-white"></v-text-field>
              </div>

              <v-row dense>
                <v-col cols="7">
                  <label class="input-label">Validity Period</label>
                  <v-text-field v-model.number="form.kycCreditDetail.validityPeriod" type="number" outlined dense hide-details class="bg-white"></v-text-field>
                </v-col>
                <v-col cols="5">
                  <label class="input-label">Unit</label>
                  <v-select :items="units" v-model="form.kycCreditDetail.validityPeriodUnit" outlined dense hide-details class="bg-white"></v-select>
                </v-col>
              </v-row>
            </div>
          </v-col>
        </v-row>

        <p class="x-small text-muted mt-6 mb-0 text-center">Review all credit details carefully before clicking approve.</p>
        <footer class="step-footer">
          <button type="button" class="secondary-button" :disabled="loading" @click="step = 1">← Back</button>
          <button type="button" class="primary-button" :disabled="loading" @click="submitOnboarding">
            {{ loading ? 'Approving…' : 'Approve & Onboard Service' }}
          </button>
        </footer>
      </div>
    </div>
  </v-container>
</template>

<style scoped>
/* Inherited Theme */
.overview-container {
  padding: 2rem;
  background-color: #f9fafb;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  color: #1e293b;
}

.title {
  font-size: 0.85rem;
  font-weight: 700;
  color: #111827;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.input-label {
  display: block;
  font-size: 0.65rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  margin-bottom: 4px;
}

/* Step indicator */
.approval-steps { display: flex; align-items: center; gap: 12px; margin: 0 0 1.5rem; padding: 0; list-style: none; color: #64748b; font-size: 0.8rem; font-weight: 600; }
.approval-steps li { display: inline-flex; align-items: center; gap: 8px; }
.approval-steps .is-active, .approval-steps .is-complete { color: #1e293b; }
.step-number { display: inline-flex; width: 24px; height: 24px; align-items: center; justify-content: center; border-radius: 50%; background: #eceeef; color: #6c757d; font-size: 0.7rem; }
.is-active .step-number, .is-complete .step-number { background: #6c757d; color: #fff; }
.step-divider { flex: 0 0 48px; height: 1px; background: #d5dde7; }

/* Record search */
.record-search { display: flex; align-items: flex-end; gap: 12px; margin-top: 0.75rem; }
.record-search-input { flex: 1 1 auto; max-width: 560px; }

/* Review cards */
.record-review { margin-top: 1.5rem; }
.record-card { margin-bottom: 1rem; padding: 1.25rem; border: 1px solid #e5e7eb; border-radius: 10px; background: #fff; }
.record-card-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding-bottom: 1rem; border-bottom: 1px solid #eef2f6; }
.record-identity { display: flex; align-items: center; gap: 12px; min-width: 0; }
.record-identity h3 { margin: 0; color: #17213d; font-size: 1rem; font-weight: 700; }
.record-identity p { margin: 2px 0 0; color: #64748b; font-size: 0.8rem; word-break: break-all; }
.record-avatar { display: inline-flex; flex: 0 0 auto; width: 44px; height: 44px; align-items: center; justify-content: center; overflow: hidden; border-radius: 50%; background: #eceeef; color: #6c757d; font-size: 22px; }
.record-avatar img { width: 100%; height: 100%; object-fit: cover; }
.small-avatar { width: 36px; height: 36px; font-size: 18px; }

.detail-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px 20px; margin: 1rem 0 0; }
.detail-grid dt { color: #64748b; font-size: 0.65rem; font-weight: 700; text-transform: uppercase; }
.detail-grid dd { margin: 2px 0 0; color: #1e293b; font-size: 0.82rem; word-break: break-word; }

.chip-row { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; margin-top: 1rem; }
.chip-label { margin-right: 4px; color: #64748b; font-size: 0.65rem; font-weight: 700; text-transform: uppercase; }
.chip { display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px; border: 1px solid #cbd5e1; border-radius: 14px; background: #f3f4f5; color: #343a40; font-size: 0.72rem; font-weight: 600; }
.chip-link { text-decoration: none; }
.chip-link:hover { border-color: #94a3b8; background: #e4e7e9; color: #343a40; text-decoration: none; }

.section-heading { display: flex; align-items: center; gap: 8px; margin-bottom: 0.75rem; color: #6c757d; }
.section-heading h4 { margin: 0; color: #1e293b; font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; }

/* Logs timeline */
.log-timeline { position: relative; margin: 0; padding: 0; list-style: none; }
.log-timeline li { position: relative; display: flex; align-items: flex-start; gap: 12px; padding: 8px 0 8px 22px; border-bottom: 1px dashed #eef2f6; }
.log-timeline li:last-child { border-bottom: 0; }
.log-timeline li::before { content: ''; position: absolute; top: 0; bottom: 0; left: 5px; width: 2px; background: #e2e8f0; }
.log-timeline li:first-child::before { top: 50%; }
.log-timeline li:last-child::before { bottom: 50%; }
.log-dot { position: absolute; top: 12px; left: 0; width: 12px; height: 12px; border: 2px solid #fff; border-radius: 50%; background: #94a3b8; box-shadow: 0 0 0 1px #cbd5e1; }
.log-timeline li.is-success .log-dot { background: #1d9b63; box-shadow: 0 0 0 1px #a7e3c6; }
.log-timeline li.is-failed .log-dot { background: #dc2626; box-shadow: 0 0 0 1px #fecaca; }
.log-body { display: flex; flex: 1 1 auto; flex-direction: column; min-width: 0; }
.log-body strong { color: #1e293b; font-size: 0.8rem; font-weight: 600; }
.log-body small { color: #64748b; font-size: 0.7rem; }
.failure-reason { display: flex; align-items: flex-start; gap: 6px; margin-top: 6px; padding: 8px 10px; border: 1px solid #fecaca; border-left: 3px solid #dc2626; border-radius: 6px; background: #fef2f2; color: #991b1b; font-size: 0.75rem; line-height: 1.45; white-space: pre-wrap; word-break: break-word; }
.failure-reason i { flex: 0 0 auto; margin-top: 1px; font-size: 14px; }
.empty-logs { margin: 0; color: #64748b; font-size: 0.8rem; }

/* Status badges */
.status-badge { display: inline-flex; flex: 0 0 auto; align-items: center; padding: 3px 10px; border-radius: 12px; background: #eceeef; color: #495057; font-size: 0.65rem; font-weight: 700; letter-spacing: 0.03em; text-transform: uppercase; }
.status-badge.is-success { background: #e7f8ef; color: #1d9b63; }
.status-badge.is-failed { background: #fef2f2; color: #b42318; }
.status-badge.is-pending { background: #fff7e6; color: #b45309; }

.note-box { display: flex; align-items: center; gap: 8px; padding: 10px 14px; border: 1px solid #bbf7d0; border-radius: 8px; background: #f0fdf4; color: #166534; font-size: 0.8rem; }

/* Step 2 summary */
.approval-summary { display: flex; align-items: center; gap: 12px; margin-bottom: 1rem; padding: 12px 16px; border: 1px solid #e5e7eb; border-radius: 10px; background: #fff; }
.approval-summary strong { display: block; color: #17213d; font-size: 0.9rem; }
.approval-summary small { color: #64748b; font-size: 0.72rem; }

/* Internal Boxes */
.warning-box {
  background-color: #f1f5f9; /* Subtle gray for nested sections */
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.25rem;
}

.bg-white >>> .v-input__control {
  background: white !important;
}

.mono-text {
  font-family: 'JetBrains Mono', monospace !important;
  font-size: 0.9rem !important;
}
.detail-grid .mono-text, .approval-summary .mono-text { font-size: 0.75rem !important; }

/* Buttons */
.step-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 1.25rem; }
.primary-button, .secondary-button { display: inline-flex; align-items: center; justify-content: center; min-height: 40px; padding: 0 18px; border-radius: 5px; font-size: 0.8rem; font-weight: 700; }
.primary-button { border: 1px solid #6c757d; background: #6c757d; color: #fff; }
.primary-button:hover:not(:disabled) { border-color: #545b62; background: #5a6268; }
.secondary-button { border: 1px solid #6c757d; background: #fff; color: #6c757d; }
.secondary-button:hover:not(:disabled) { background: #6c757d; color: #fff; }
.primary-button:disabled, .secondary-button:disabled { cursor: not-allowed; opacity: .55; }

.small { font-size: 0.85rem; }
.x-small { font-size: 0.75rem; }
.text-muted { color: #64748b !important; }

@media (max-width: 900px) {
  .detail-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 600px) {
  .overview-container { padding: 1.25rem; }
  .record-search { flex-direction: column; align-items: stretch; }
  .detail-grid { grid-template-columns: 1fr; }
}
</style>
<script>


import { mapActions } from "vuex/dist/vuex.common.js";
import loadIng from '../../../components/element/LoadIng.vue';
import UtilsMixin from '../../../mixins/utils.js';

export default {
  components: { loadIng },
  mixins: [UtilsMixin],
  data() {
    return {
      step: 1,
      loading: false,
      isLoading: false,
      recordId: '',
      record: null,
      units: [
        { text: 'DAYS', value: 'Days' },
        { text: 'MONTH', value: 'Month' },
        { text: 'YEAR', value: 'Year' }
      ],
      form: {
        ssiCreditDetail: {
          amount: 500,
          validityPeriod: 60,
          validityPeriodUnit: 'Days',
          amountDenom: 'uHID'
        },
        kycCreditDetail: {
          amount: 500,
          validityPeriod: 60,
          validityPeriodUnit: 'Days',
          amountDenom: 'uHID'
        }
      }
    };
  },
  computed: {
    isApproved() {
      return (this.record?.onboardingStatus || '').toUpperCase() === 'APPROVED';
    },
    detailItems() {
      const r = this.record || {};
      return [
        { label: 'Record ID', value: r._id, mono: true },
        { label: 'User ID', value: r.userId, mono: true },
        { label: 'Type', value: r.type },
        { label: 'Phone', value: r.phoneNumber },
        { label: 'Country', value: r.country },
        { label: 'Registration No.', value: r.registrationNumber },
        { label: 'Billing Address', value: r.billingAddress },
        { label: 'Monthly Volume', value: r.yearlyVolume },
        { label: 'Referral Source', value: r.referralSource },
        { label: 'Business DID', value: r.businessId, mono: true },
        { label: 'Company Verification', value: r.companyVerificationStatus },
        { label: 'Submitted', value: this.formatDate(r.createdAt) },
        { label: 'Last Updated', value: this.formatDate(r.updatedAt) },
      ].map(item => ({ ...item, value: item.value || '—' }));
    },
    socialLinks() {
      const r = this.record || {};
      return [
        { label: 'LinkedIn', url: r.linkedinUrl, icon: 'mdi mdi-linkedin' },
        { label: 'Twitter', url: r.twitterUrl, icon: 'mdi mdi-twitter' },
        { label: 'Telegram', url: r.telegramUrl, icon: 'mdi mdi-send' },
      ].filter(link => link.url);
    },
  },
  watch: {
    // A different ID means the fetched record no longer matches what is typed
    recordId(value) {
      if (this.record && value !== this.record._id) this.record = null;
    },
  },
  methods: {
    ...mapActions("mainStore", ["approveOnboardingRequest", "fetchOnboardingRecordById"]),
    async fetchRecord() {
      if (!this.recordId) {
        this.notifyErr("Please provide a Record ID.");
        return;
      }
      this.isLoading = true;
      try {
        this.record = await this.fetchOnboardingRecordById(this.recordId);
      } catch (e) {
        this.record = null;
        this.notifyErr(e.message || 'Unable to fetch the onboarding record.');
      } finally {
        this.isLoading = false;
      }
    },
    goToCredits() {
      if (!this.record || this.isApproved) return;
      this.step = 2;
    },
    async submitOnboarding() {
        if (!this.record) {
          this.step = 1;
          return;
        }
        this.loading = true;
        this.isLoading = true;
        try {
          await this.approveOnboardingRequest({
            recordId: this.record._id,
            ssiCreditDetail: this.form.ssiCreditDetail,
            kycCreditDetail: this.form.kycCreditDetail
          });
          this.notifySuccess("Customer onboarded successfully!");
          // Show the updated status and logs of the approved request
          this.step = 1;
          await this.fetchRecord();
        } catch (e) {
          this.notifyErr(e.message || 'An unexpected error occurred.');
        } finally {
          this.loading = false;
          this.isLoading = false;
        }
    },
    statusClass(status) {
      const value = (status || '').toUpperCase();
      if (['SUCCESS', 'APPROVED', 'COMPLETED'].includes(value)) return 'is-success';
      if (['FAILED', 'REJECTED', 'ERROR'].includes(value)) return 'is-failed';
      if (['INITIATED', 'PENDING', 'IN_PROGRESS', 'PROCESSING'].includes(value)) return 'is-pending';
      return '';
    },
    humanizeStep(step) {
      return (step || '').toLowerCase().split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
        .replace(/\b(Ssi|Kyc|Did)\b/g, match => match.toUpperCase());
    },
    formatDate(value) {
      if (!value) return '';
      const date = new Date(value);
      return isNaN(date.getTime()) ? value : date.toLocaleString();
    },
  }
};
</script>
