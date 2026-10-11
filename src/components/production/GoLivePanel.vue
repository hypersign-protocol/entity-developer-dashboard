<template>
  <div class="go-live-panel">
    <section class="panel-card">
      <header class="panel-card-header">
        <div>
          <h2>Go live</h2>
          <p v-if="isProduction">This app is live in Production.</p>
          <p v-else>Production apps verify real people and businesses, so a few things need to be in place first.</p>
        </div>
        <span class="environment-badge" :class="isProduction ? 'is-production' : 'is-development'">
          <span></span>{{ isProduction ? 'Production' : 'Development' }}
        </span>
      </header>

      <ul class="checklist">
        <li v-for="item in checklist" :key="item.key" class="check-item" :class="item.state">
          <span class="check-icon">
            <v-icon small>{{ item.icon }}</v-icon>
          </span>
          <div class="check-body">
            <strong>{{ item.title }}</strong>
            <p>{{ item.description }}</p>
          </div>
          <span v-if="item.pill" class="status-pill" :class="item.state">{{ item.pill }}</span>
          <button v-if="item.actionLabel" type="button" class="link-button" @click="item.action">
            {{ item.actionLabel }} <v-icon x-small>mdi-arrow-right</v-icon>
          </button>
        </li>
      </ul>

      <footer v-if="!isProduction" class="panel-card-footer">
        <p v-if="!allRequirementsMet" class="footer-note">Complete all three steps to switch this app to Production.</p>
        <p v-else class="footer-note ready">You're all set. Switching makes this app process real verifications.</p>
        <button type="button" class="primary-button" :disabled="!allRequirementsMet || switching" @click="switchToProduction">
          {{ switching ? 'Switching…' : 'Switch to production' }}
        </button>
      </footer>
    </section>

    <section v-if="!isProduction" class="panel-card review-card">
      <v-icon small>mdi-shield-check-outline</v-icon>
      <div>
        <h3>How the company review works</h3>
        <ul>
          <li>You get production access as soon as you submit your company details. You don't have to wait for the review.</li>
          <li>Our compliance team reviews your details and documents in parallel.</li>
          <li>If something is missing or doesn't match, we'll contact you for clarification.</li>
          <li>We reserve the right to revoke production access if the details or documents can't be verified.</li>
        </ul>
      </div>
    </section>

    <DomainVerificationPopup v-model="showDomainPopup" :app="app" @updated="onAppUpdated" />
    <CompanyVerificationPopup v-model="showCompanyPopup" :domain="app.domain || ''" @submitted="loadOnboarding" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import UtilsMixin from '../../mixins/utils';
import DomainVerificationPopup from './DomainVerificationPopup.vue';
import CompanyVerificationPopup from './CompanyVerificationPopup.vue';
import { COMPANY_REVIEW, companyReviewStatus } from './companyReview.js';

// Self-contained go-live checklist for one app. Needs only the app object, so it can
// live in the app configuration page or on a standalone page. Emits `updated` with the
// saved app whenever it changes the app (domain, verification, environment).
export default {
  name: 'GoLivePanel',
  components: { DomainVerificationPopup, CompanyVerificationPopup },
  mixins: [UtilsMixin],
  props: {
    app: { type: Object, required: true },
  },
  data() {
    return {
      showDomainPopup: false,
      showCompanyPopup: false,
      onboarding: {},
      loadingOnboarding: false,
      switching: false,
    };
  },
  computed: {
    ...mapGetters('mainStore', ['isMFAEnabled']),
    isProduction() {
      return this.app.env === 'prod';
    },
    domainVerified() {
      return Boolean(this.app.hasDomainVerified);
    },
    companyStatus() {
      return companyReviewStatus(this.onboarding);
    },
    // Submitting is enough for production access; compliance reviews in parallel
    companySubmitted() {
      return [COMPANY_REVIEW.UNDER_REVIEW, COMPANY_REVIEW.VERIFIED].includes(this.companyStatus);
    },
    checklist() {
      return [this.mfaItem(), this.domainItem(),  this.companyItem()];
    },
    allRequirementsMet() {
      return this.domainVerified && Boolean(this.isMFAEnabled) && this.companySubmitted;
    },
  },
  mounted() {
    this.loadOnboarding();
  },
  methods: {
    domainItem() {
      const openPopup = () => { this.showDomainPopup = true; };
      return this.domainVerified
        ? {
          key: 'domain', state: 'done', icon: 'mdi-check-circle', pill: 'Verified',
          title: 'Verify your domain', description: `${this.app.domain} is verified.`,
          actionLabel: 'Manage', action: openPopup,
        }
        : {
          key: 'domain', state: 'todo', icon: 'mdi-alert-circle-outline',
          title: 'Verify your domain', description: 'Prove you own your business domain by adding a DNS TXT record.',
          actionLabel: 'Verify domain', action: openPopup,
        };
    },
    mfaItem() {
      return this.isMFAEnabled
        ? {
          key: 'mfa', state: 'done', icon: 'mdi-check-circle', pill: 'Enabled',
          title: 'Turn on multi-factor authentication', description: 'MFA is enabled on your account.',
        }
        : {
          key: 'mfa', state: 'todo', icon: 'mdi-alert-circle-outline',
          title: 'Turn on multi-factor authentication', description: 'Protect your account with an authenticator app before handling production data.',
          actionLabel: 'Set up MFA', action: () => this.$router.push('/studio/settings?ref=mfa'),
        };
    },
    companyItem() {
      const base = { key: 'company', title: 'Verify your company' };
      const openPopup = () => { this.showCompanyPopup = true; };
      if (this.loadingOnboarding) {
        return { ...base, state: 'todo', icon: 'mdi-progress-clock', description: 'Checking your company verification status…' };
      }
      switch (this.companyStatus) {
        case COMPANY_REVIEW.VERIFIED:
          return { ...base, state: 'done', icon: 'mdi-check-circle', pill: 'Verified', description: 'Your company details and documents have been verified.' };
        case COMPANY_REVIEW.UNDER_REVIEW:
          return { ...base, state: 'done', icon: 'mdi-check-circle', pill: 'Under review', description: 'Submitted. Our compliance team is reviewing your details.' };
        case COMPANY_REVIEW.ACTION_NEEDED:
          return {
            ...base, state: 'attention', icon: 'mdi-alert-outline', pill: 'Action needed',
            description: "Some documents couldn't be verified. Please review and resubmit.",
            actionLabel: 'Resubmit', action: openPopup,
          };
        default:
          return {
            ...base, state: 'todo', icon: 'mdi-alert-circle-outline',
            description: 'Submit your company details, registered address, tax ID and supporting documents.',
            actionLabel: 'Verify company', action: openPopup,
          };
      }
    },
    async loadOnboarding() {
      this.loadingOnboarding = true;
      try {
        this.onboarding = (await this.$store.dispatch('mainStore/checkIfAlreadyExistOnBoarding')) || {};
      } catch (error) {
        this.notifyErr(error.message || 'Could not load your company verification status.');
      } finally {
        this.loadingOnboarding = false;
      }
    },
    onAppUpdated(app) {
      this.$emit('updated', app);
    },
    async switchToProduction() {
      if (!this.allRequirementsMet || this.switching) return;
      this.switching = true;
      try {
        const changes = { env: 'prod' };
        const updated = await this.$store.dispatch('mainStore/updateAnAppOnServer', { ...this.app, ...changes });
        this.$emit('updated', { ...this.app, ...changes, ...(updated || {}) });
        this.notifySuccess('Your app is now in Production.');
      } catch (error) {
        this.notifyErr(error.message || 'Could not switch to production. Please try again.');
      } finally {
        this.switching = false;
      }
    },
  },
};
</script>

<style scoped>
.go-live-panel { display: grid; gap: 18px; color: #273448; }

.panel-card {
  padding: 28px 30px;
  border: 1px solid #d7e0ea;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 1px 2px rgba(15,23,42,.015);
}

.panel-card-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 18px; margin-bottom: 22px; }
.panel-card-header h2 { margin: 0 0 5px; color: #263244; font-size: 17px; font-weight: 700; }
.panel-card-header p { margin: 0; color: #718198; font-size: 12px; line-height: 1.45; }

.environment-badge { display: inline-flex; flex: 0 0 auto; align-items: center; gap: 8px; padding: 6px 12px; border: 1px solid; border-radius: 18px; font-size: 12px; font-weight: 700; }
.environment-badge span { width: 8px; height: 8px; border-radius: 50%; }
.is-development { border-color: #efd4a5; background: #fff9ee; color: #956625; }
.is-development span { background: #d99833; }
.is-production { border-color: #b7e2cb; background: #effaf4; color: #237d52; }
.is-production span { background: #2daf78; }

/* Checklist */
.checklist { display: grid; gap: 10px; margin: 0; padding: 0; list-style: none; }

.check-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border: 1px solid #e1e6ed;
  border-radius: 10px;
  background: #fff;
}

.check-icon >>> .v-icon { color: #c08a2e !important; }
.check-item.done .check-icon >>> .v-icon { color: #2daf78 !important; }
.check-item.attention { border-color: #f3e1bd; background: #fffcf5; }

.check-body { flex: 1; min-width: 0; }
.check-body strong { display: block; color: #344054; font-size: 13px; }
.check-body p { margin: 2px 0 0; color: #718198; font-size: 12px; line-height: 1.45; overflow-wrap: anywhere; }

.status-pill { flex: 0 0 auto; padding: 4px 10px; border-radius: 14px; font-size: 11px; font-weight: 700; white-space: nowrap; }
.status-pill.done { background: #eaf8f0; color: #218459; }
.status-pill.attention { background: #fff4e5; color: #9a641c; }

.link-button {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: #2563dc;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
}

.link-button:hover { background: #edf3ff; }
.link-button >>> .v-icon { color: inherit !important; }

.panel-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 22px;
  padding-top: 18px;
  border-top: 1px solid #e8edf3;
}

.footer-note { margin: 0; color: #8793a5; font-size: 12px; }
.footer-note.ready { color: #218459; }

.primary-button {
  flex: 0 0 auto;
  min-height: 36px;
  padding: 0 14px;
  border: 1px solid #6c757d;
  border-radius: 6px;
  background: #6c757d;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
}

.primary-button:hover:not(:disabled) { border-color: #545b62; background: #5a6268; }
.primary-button:disabled { cursor: not-allowed; opacity: .55; }

/* Review explanation */
.review-card {
  display: flex;
  gap: 12px;
  padding: 20px 24px;
  border-color: #dbe6f5;
  background: #f5f8fd;
  color: #3f4f66;
}

.review-card > .v-icon { align-self: flex-start; margin-top: 2px; color: #4a6fa5 !important; }
.review-card h3 { margin: 0 0 6px; color: #263244; font-size: 14px; font-weight: 700; }
.review-card ul { margin: 0; padding-left: 18px; font-size: 12px; line-height: 1.6; }

@media (max-width: 650px) {
  .panel-card { padding: 20px; }
  .panel-card-header, .panel-card-footer { flex-direction: column; align-items: flex-start; }
  .check-item { flex-wrap: wrap; }
}
</style>
