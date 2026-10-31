<template>
  <!-- Organization details from the onboarding record; they stay here even when every app is deleted.
       Uses the Go live > Company verification form itself (inline), so design and flow are identical.
       Editable until the details are with compliance or verified, then read-only. -->
  <div class="organization-details">
    <header class="organization-header">
      <div>
        <h2>Organization</h2>
        <p>Your organization details from onboarding and company verification.</p>
      </div>
      <span v-if="record" class="status-pill" :class="verification.tone">
        <v-icon x-small>{{ verification.icon }}</v-icon> {{ verification.label }}
      </span>
    </header>

    <p v-if="loading && !record" class="muted-note">Loading your organization details…</p>

    <empty-container
      v-else-if="!record"
      icon="mdi mdi-domain"
      :title="loadError ? 'Could not load organization details' : 'No organization details yet'"
      :description="loadError || 'Complete onboarding to set up your organization.'"
    >
      <button v-if="loadError" type="button" class="secondary-button" @click="loadRecord">Try again</button>
      <button v-else type="button" class="primary-button" @click="$router.push('/studio/onboarding')">Start onboarding</button>
    </empty-container>

    <template v-else>
      <div v-if="rejectionReason" class="notice notice-error" role="alert">
        <v-icon small>mdi-alert-circle-outline</v-icon>
        <div>
          <strong>Company verification was rejected</strong>
          <p>{{ rejectionReason }}</p>
        </div>
      </div>

      <CompanyVerificationPopup
        inline
        :onboarding-record="record"
        :onboarding-loading="loading"
        :domain="appDomain"
        :domain-verified="appDomainVerified"
        @submitted="onSubmitted"
      />
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import CompanyVerificationPopup from '../production/CompanyVerificationPopup.vue';
import { COMPANY_REVIEW, companyReviewStatus } from '../production/companyReview.js';

export default {
  name: 'OrganizationDetails',
  components: { CompanyVerificationPopup },
  data() {
    return {
      loading: false,
      loadError: '',
      record: null,
    };
  },
  computed: {
    ...mapGetters('mainStore', ['getAppsWithKYCServices']),
    // The KYC app's domain, when there is one: a verified domain locks the field, as on the Go live tab
    kycApp() {
      return (this.getAppsWithKYCServices || [])[0] || null;
    },
    appDomain() {
      return (this.kycApp && this.kycApp.domain) || '';
    },
    appDomainVerified() {
      return Boolean(this.kycApp && this.kycApp.hasDomainVerified);
    },
    verification() {
      switch (companyReviewStatus(this.record)) {
        case COMPANY_REVIEW.VERIFIED:
          return { label: 'Verified', tone: 'is-success', icon: 'mdi-check-decagram' };
        case COMPANY_REVIEW.UNDER_REVIEW:
          return { label: 'Under review', tone: 'is-info', icon: 'mdi-progress-check' };
        case COMPANY_REVIEW.PROCESSING:
          return { label: 'Under verification', tone: 'is-info', icon: 'mdi-progress-clock' };
        case COMPANY_REVIEW.REJECTED:
          return { label: 'Rejected', tone: 'is-error', icon: 'mdi-close-circle-outline' };
        default:
          return { label: 'Not verified', tone: 'is-muted', icon: 'mdi-alert-circle-outline' };
      }
    },
    rejectionReason() {
      if (companyReviewStatus(this.record) !== COMPANY_REVIEW.REJECTED) return '';
      const reason = this.record.companyStatusReason;
      // The backend sometimes stores an unreadable "[object Object]"; don't show that
      return reason && reason !== '[object Object]' ? reason : 'Update your company details below and resubmit.';
    },
  },
  mounted() {
    this.loadRecord();
  },
  methods: {
    async loadRecord() {
      this.loading = true;
      this.loadError = '';
      try {
        const data = await this.$store.dispatch('mainStore/checkIfAlreadyExistOnBoarding');
        this.record = data && data._id ? data : null;
      } catch (e) {
        this.record = null;
        const message = (e && e.message) || String(e);
        // "No onboarding detail found" just means there is nothing to show yet
        if (!/no onboarding detail found/i.test(message)) this.loadError = message;
      } finally {
        this.loading = false;
      }
    },
    // Same as the Go live tab: use the PATCH response right away, refetch if it lacks the status
    onSubmitted(updated) {
      if (updated && updated.companyVerificationStatus) {
        this.record = { ...this.record, ...updated };
      } else {
        this.loadRecord();
      }
    },
  },
};
</script>

<style scoped>
.organization-details { color: #273448; }
.organization-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 16px; }
.organization-header h2 { margin: 0 0 4px; color: #263244; font-size: 17px; font-weight: 700; }
.organization-header p { margin: 0; color: #718198; font-size: 12px; line-height: 1.5; }
.muted-note { margin: 6px 0 0; color: #8793a5; font-size: 11px; }

.status-pill { display: inline-flex; flex: 0 0 auto; align-items: center; gap: 4px; padding: 2px 10px; border-radius: 10px; font-size: 11px; font-weight: 700; }
.status-pill >>> .v-icon { color: inherit !important; }
.is-success { background: #eaf8f0; color: #218459; }
.is-info { background: #eef4fd; color: #3a64a8; }
.is-error { background: #fef3f2; color: #b42318; }
.is-muted { background: #f1f5f9; color: #64748b; }

/* Same notice as the Company verification popup */
.notice { display: flex; gap: 10px; margin-bottom: 16px; padding: 14px 16px; border-radius: 8px; font-size: 12px; line-height: 1.55; }
.notice strong { display: block; margin-bottom: 4px; font-size: 13px; }
.notice p { margin: 0; }
.notice-error { border: 1px solid #fecdca; background: #fef3f2; color: #b42318; }
.notice-error > .v-icon { color: #d92d20 !important; }

.primary-button, .secondary-button { min-height: 36px; padding: 0 16px; border-radius: 6px; font-size: 12px; font-weight: 700; }
.primary-button { border: 1px solid #6c757d; background: #6c757d; color: #fff; }
.primary-button:hover { border-color: #545b62; background: #5a6268; }
.secondary-button { border: 1px solid #6c757d; background: #fff; color: #6c757d; }
.secondary-button:hover { background: #6c757d; color: #fff; }

@media (max-width: 650px) {
  .organization-header { flex-direction: column; }
}
</style>
