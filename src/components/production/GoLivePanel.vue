<template>
  <div class="go-live-panel">
    <section class="panel-card">
      <header class="panel-card-header" data-tour="go-live-overview">
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
        <li
          v-for="item in checklist"
          :key="item.key"
          class="check-item"
          :class="item.state"
          :data-tour="`go-live-${item.key}`"
        >
          <span class="check-icon">
            <v-icon small>{{ item.icon }}</v-icon>
          </span>
          <div class="check-body">
            <strong>{{ item.title }}</strong>
            <p>{{ item.description }}</p>
            <div v-if="item.note" class="check-note" :class="item.note.tone">
              <v-icon x-small>{{ item.note.icon }}</v-icon>
              <div>
                <strong v-if="item.note.title">{{ item.note.title }}</strong>
                <span>{{ item.note.text }}</span>
              </div>
            </div>
            <!-- Rejection: the compliance team's note, with the fix-it action right under it -->
            <div v-if="item.rejection" class="rejection-note">
              <span class="rejection-label">
                Rejection reason
              </span>
              <p class="rejection-text">{{ item.rejection.text }}</p>
              <button type="button" class="rejection-action" @click="item.rejection.action">
                Update company details <v-icon x-small>mdi-arrow-right</v-icon>
              </button>
            </div>
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
        <div class="footer-actions">
          <button type="button" class="tour-help-button" :disabled="loadingOnboarding" @click="startHelpTour">
            <v-icon small>{{ loadingOnboarding ? 'mdi-progress-clock' : 'mdi-help-circle-outline' }}</v-icon>
            {{ loadingOnboarding ? 'Checking status…' : 'Need help?' }}
          </button>
          <button data-tour="switch-production" type="button" class="primary-button" :disabled="!allRequirementsMet || switching" @click="switchToProduction">
            {{ switching ? 'Switching…' : 'Switch to production' }}
          </button>
        </div>
      </footer>
    </section>

    <section v-if="!isProduction" class="panel-card review-card" data-tour="go-live-review">
      <v-icon small>mdi-shield-check-outline</v-icon>
      <div>
        <h3>How the company review works</h3>
        <ul>
          <li>Production access is available as soon as you submit your company details.</li>
          <li>Our compliance team reviews the submitted details and documents.</li>
          <li>We’ll contact you if additional information is required.</li>
          <li>Production access may be revoked if the submitted information cannot be verified.</li>
        </ul>
      </div>
    </section>

    <DomainVerificationPopup v-model="showDomainPopup" :app="app" @updated="onAppUpdated" />
    <CompanyVerificationPopup v-model="showCompanyPopup" :domain="app.domain || ''" :domain-verified="domainVerified" :onboarding-record="onboarding" :onboarding-loading="loadingOnboarding" @submitted="onCompanySubmitted" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import UtilsMixin from '../../mixins/utils';
import DomainVerificationPopup from './DomainVerificationPopup.vue';
import CompanyVerificationPopup from './CompanyVerificationPopup.vue';
import { COMPANY_REVIEW, companyReviewStatus, companyAllowsProduction } from './companyReview.js';
import { startGoingLiveTour } from '../../tours/goingLiveTour.js';

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
      activeHelpTour: null,
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
    // A submitted company record is enough for production access; review happens separately.
    companySubmitted() {
      return companyAllowsProduction(this.onboarding);
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
  beforeDestroy() {
    if (this.activeHelpTour && this.activeHelpTour.isActive()) this.activeHelpTour.destroy();
  },
  methods: {
    startHelpTour() {
      this.$nextTick(() => {
        if (this.activeHelpTour && this.activeHelpTour.isActive()) this.activeHelpTour.destroy();
        this.activeHelpTour = startGoingLiveTour({
          allRequirementsMet: this.allRequirementsMet,
          companySubmitted: this.companySubmitted,
          domainVerified: this.domainVerified,
          mfaEnabled: Boolean(this.isMFAEnabled),
        });
      });
    },
    domainItem() {
      const openPopup = () => { this.showDomainPopup = true; };
      return this.domainVerified
        ? {
          key: 'domain', state: 'done', icon: 'mdi-check-circle', pill: 'Verified',
          title: 'Verify your domain', description: `${this.app.domain} is verified.`,
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
          return {
            ...base, state: 'pending', icon: 'mdi-progress-check', pill: 'Under review',
            description: 'Your company details and documents have been submitted.',
            note: {
              tone: 'info', icon: 'mdi-information-outline',
              text: "Your submission is under review. Production access is available now.",
            },
          };
        case COMPANY_REVIEW.REJECTED:
          return {
            ...base, state: 'attention', icon: 'mdi-close-circle-outline', pill: 'Rejected',
            description: "We couldn't verify your company. Update your details based on the note below and resubmit.",
            rejection: {
              text: this.onboarding.companyStatusReason || 'No reason was given. Please contact support for details.',
              action: openPopup,
            },
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
    // Use the PATCH response right away; fall back to refetching if it lacks the status
    onCompanySubmitted(updated) {
      if (updated && updated.companyVerificationStatus) {
        this.onboarding = { ...this.onboarding, ...updated };
      } else {
        this.loadOnboarding();
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
.check-item.pending .check-icon >>> .v-icon { color: #d99833 !important; }
.check-item.attention { border-color: #f3c9c9; }
.check-item.attention .check-icon >>> .v-icon { color: #c94a4a !important; }

.check-body { flex: 1; min-width: 0; }
.check-body strong { display: block; color: #344054; font-size: 13px; }
.check-body p { margin: 2px 0 0; color: #718198; font-size: 12px; line-height: 1.45; overflow-wrap: anywhere; }

.status-pill { flex: 0 0 auto; padding: 4px 10px; border-radius: 14px; font-size: 11px; font-weight: 700; white-space: nowrap; }
.status-pill.done { background: #eaf8f0; color: #218459; }
.status-pill.pending { background: #fff4e5; color: #9a641c; }
.status-pill.attention { background: #fdecec; color: #b03a3a; }

.check-note {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-top: 8px;
  padding: 8px 10px;
  border: 1px solid;
  border-radius: 8px;
  font-size: 12px;
  line-height: 1.45;
}
.check-note > .v-icon { margin-top: 2px; color: inherit !important; }
.check-note strong { display: inline; margin-right: 4px; color: inherit; font-size: 12px; }
.check-note span { overflow-wrap: anywhere; white-space: pre-line; }
.check-note.info { border-color: #f1dcb4; background: #fffaf0; color: #85591d; }
.check-note.error { border-color: #f1c4c4; background: #fff1f1; color: #9f3434; }

/* Rejection note: quote-style block so the reason reads as a message, not another alert */
.rejection-note {
  margin-top: 10px;
  padding: 10px 14px 12px;
  border-left: 3px solid #d65252;
  border-radius: 0 8px 8px 0;
  background: #f8fafc;
}
.rejection-label {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #b03a3a;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .04em;
  text-transform: uppercase;
}
.rejection-label >>> .v-icon { color: inherit !important; }
.check-body .rejection-text {
  margin: 4px 0 0;
  color: #273448;
  font-size: 13px;
  line-height: 1.55;
  white-space: pre-line;
}
.rejection-action {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: 10px;
  padding: 6px 12px;
  border: 1px solid #cfd8e3;
  border-radius: 6px;
  background: #fff;
  color: #2563dc;
  font-size: 12px;
  font-weight: 700;
}
.rejection-action:hover { border-color: #2563dc; background: #edf3ff; }
.rejection-action >>> .v-icon { color: inherit !important; }

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

.footer-actions { display: flex; flex: 0 0 auto; align-items: center; gap: 8px; }
.tour-help-button {
  display: inline-flex;
  min-height: 36px;
  align-items: center;
  gap: 6px;
  padding: 0 12px;
  border: 1px solid #cfd8e3;
  border-radius: 6px;
  background: #fff;
  color: #2563dc;
  font-size: 12px;
  font-weight: 700;
}
.tour-help-button:hover, .tour-help-button:focus { border-color: #2563dc; background: #edf3ff; outline: none; }
.tour-help-button:disabled { cursor: wait; opacity: .6; }
.tour-help-button >>> .v-icon { color: inherit !important; }

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

@media (max-width: 650px) {
  .panel-card-footer { align-items: flex-start; flex-direction: column; }
  .footer-actions { width: 100%; flex-wrap: wrap; }
}

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
