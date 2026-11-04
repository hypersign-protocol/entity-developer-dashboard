<template>
  <div v-if="view" class="promo-banner" :class="`is-${view.kind}`" role="status">
    <span class="promo-icon" aria-hidden="true">
      <v-icon small :color="view.kind === 'granted' ? '#15803d' : '#2563dc'">{{ view.kind === 'granted' ? 'mdi-check-circle-outline' : 'mdi-gift-outline' }}</v-icon>
    </span>

    <div class="promo-copy">
      <strong>{{ view.title }}</strong>
      <span>{{ view.text }}</span>
    </div>

    <div class="promo-actions">
      <template v-if="view.kind === 'claim'">
        <span v-if="!canClaim" class="promo-note">Ask your account owner to claim them.</span>
        <button v-else type="button" class="promo-btn" :disabled="claiming" @click="claim">
          <v-progress-circular v-if="claiming" indeterminate size="12" width="2" class="mr-1"></v-progress-circular>
          {{ claiming ? 'Claiming…' : 'Claim free credits' }}
        </button>
      </template>
      <template v-else-if="view.kind === 'billing'">
        <span v-if="!canClaim" class="promo-note">Ask your account owner to add them.</span>
        <button v-else type="button" class="promo-btn" @click="billingOpen = true">Add billing details</button>
      </template>

      <button type="button" class="promo-close" aria-label="Hide" :disabled="claiming" @click="dismiss">
        <v-icon small>mdi-close</v-icon>
      </button>
    </div>

    <!-- The existing billing details form; saving it checks the offer again -->
    <b-modal v-model="billingOpen" size="lg" centered scrollable hide-footer title="Billing details">
      <BillingDetails v-if="billingOpen" embedded @saved="onBillingSaved" />
    </b-modal>
  </div>
</template>

<script>
import UtilsMixin from '../../../mixins/utils';
import BillingDetails from '../../settings/BillingDetails.vue';
import {
  promotionState,
  loadPromotion,
  claimFreeCredits,
  isDismissed,
  dismissPromotion,
} from './promotionState';

/**
 * Free-credit offer, shown only when GET /billing/promotion says the app's organisation can claim
 * it (or could, once its billing details are saved). One component on every page that shows
 * the offer; their state is shared, so a claim anywhere updates all of them.
 */
export default {
  name: 'PromotionBanner',
  components: { BillingDetails },
  mixins: [UtilsMixin],
  props: {
    // Defaults to the selected app
    appId: { type: String, default: '' },
  },
  data() {
    return {
      billingOpen: false,
      // Hidden by × for this browser session
      dismissed: false,
    };
  },
  computed: {
    resolvedAppId() {
      if (this.appId) return this.appId;
      const app = this.$store.getters['mainStore/getSelectedService'];
      return (app && app.appId) || (this.$route && this.$route.params.appId) || '';
    },
    entry() {
      return promotionState.apps[this.resolvedAppId] || null;
    },
    status() {
      return this.entry && this.entry.status;
    },
    result() {
      return (this.entry && this.entry.result) || {};
    },
    claiming() {
      return Boolean(this.entry && this.entry.claiming);
    },
    // Claiming needs the billing write permission; the owner's own account always has it
    canClaim() {
      return this.$store.getters['mainStore/hasAccess']('DASHBOARD', 'WRITE_BILLING');
    },
    view() {
      if (this.dismissed || !this.entry) return null;
      if (this.entry.result) {
        return {
          kind: 'granted',
          title: 'Free credits added',
          text: this.result.creditsActive === 'AFTER_CURRENT_PLAN'
            ? 'They start when your current plan ends.'
            : 'They\'re in your account and ready to use.',
        };
      }
      const status = this.status;
      if (!status || status.claimed) return null;
      // Claiming needs saved billing details (company verification isn't waited for)
      if (status.reason === 'BILLING_PROFILE_INCOMPLETE') {
        return {
          kind: 'billing',
          title: 'Free credits are waiting for you',
          text: 'Add your billing details to unlock them. It takes a minute and there\'s nothing to pay.',
        };
      }
      // eligible with claim.status CLAIMING is an interrupted claim: claiming again finishes it
      if (!status.eligible) return null;
      return {
        kind: 'claim',
        title: 'You\'re eligible for free credits',
        text: 'Use them to go live in Production. They\'re valid for a limited time from the day you claim, so claim them when you\'re ready.',
      };
    },
  },
  watch: {
    resolvedAppId: {
      immediate: true,
      handler(appId) {
        this.dismissed = appId ? isDismissed(appId) : false;
        if (appId) loadPromotion(appId);
      },
    },
  },
  methods: {
    async claim() {
      if (this.claiming) return;
      const outcome = await claimFreeCredits(this.resolvedAppId, { onNotice: text => this.notifyWarn(text) });
      if (outcome.ignored) return;
      if (outcome.ok) this.notifySuccess(outcome.message);
      else if (outcome.error) this.notifyErr(outcome.error);
    },
    dismiss() {
      // After a claim the confirmation just goes away; before it, it stays hidden for the session
      if (!this.entry || !this.entry.result) dismissPromotion(this.resolvedAppId);
      this.dismissed = true;
    },
    onBillingSaved() {
      this.billingOpen = false;
      loadPromotion(this.resolvedAppId, { force: true });
    },
  },
};
</script>

<style scoped>
.promo-banner {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  padding: 12px 14px;
  border: 1px solid #dbe7fb;
  border-radius: 10px;
  background: #f7faff;
}

.promo-banner.is-granted { border-color: #c7ead3; background: #f3fbf6; }

.promo-icon {
  display: inline-flex;
  flex: 0 0 32px;
  width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: #e6efff;
}

.is-granted .promo-icon { background: #dcf3e4; }

.promo-copy { display: flex; min-width: 0; flex: 1 1 auto; flex-direction: column; }
.promo-copy strong { color: #172554; font-size: 13px; font-weight: 700; }
.promo-copy span { color: #52627a; font-size: 12px; }

.promo-actions { display: flex; flex: 0 0 auto; align-items: center; gap: 8px; }
.promo-note { color: #52627a; font-size: 12px; font-weight: 600; }

.promo-btn {
  display: inline-flex;
  height: 32px;
  align-items: center;
  gap: 4px;
  padding: 0 14px;
  /* The dashboard's grey primary button (Continue, Recharge) */
  border: 1px solid #6c757d;
  border-radius: 6px;
  background: #6c757d;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
}

.promo-btn:hover:not(:disabled) { border-color: #545b62; background: #5a6268; }
.promo-btn:disabled { cursor: progress; opacity: .7; }
.promo-btn .v-icon { color: inherit; }

.promo-close {
  display: inline-flex;
  width: 28px;
  height: 28px;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  color: #8793a5;
}

.promo-close:hover:not(:disabled) { background: rgba(15, 23, 42, .06); color: #344054; }
.promo-close .v-icon { color: inherit; }

@media (max-width: 767.98px) {
  .promo-banner { flex-wrap: wrap; }
  .promo-actions { width: 100%; justify-content: flex-end; }
}
</style>
