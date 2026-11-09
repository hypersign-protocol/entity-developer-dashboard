<template>
  <div v-if="isVisible" class="attention-banner" role="status">
    <i class="mdi mdi-alert-outline" aria-hidden="true"></i>
    <div class="attention-copy">
      <strong>Some workspace setup steps need attention</strong>
      <p>{{ failedStepTitles }} couldn’t be completed. Your workspace is ready to use, and you can retry these steps.</p>
      <p v-if="onboardingNotice" class="attention-notice">{{ onboardingNotice }}</p>
    </div>
    <div class="attention-actions">
      <button type="button" class="attention-button" :disabled="isCheckStatusDisabled" @click="checkOnboardingStatus">
        {{ isCheckingStatus ? 'Checking…' : 'Check status' }}
      </button>
      <button v-if="!retryForbidden" type="button" class="attention-button is-primary" :disabled="isRetryDisabled" @click="retryOnboardingSetup(record._id)">
        {{ isRetrying ? 'Retrying…' : 'Retry' }}
      </button>
      <button type="button" class="attention-close" aria-label="Dismiss" @click="dismiss">
        <i class="mdi mdi-close" aria-hidden="true"></i>
      </button>
    </div>
  </div>
</template>

<script>
import onboardingActions from '../../mixins/onboardingActions';
import { buildTimeline, isApproved, shouldShowRetry } from '../../utils/onboardingProgress';

// APPROVED customers are redirected away from the status page, so an optional
// step that failed (SSI credits, blockchain registration) is offered here instead.
export default {
  name: 'OnboardingAttentionBanner',
  mixins: [onboardingActions],
  data() {
    return { record: null, isDismissed: false };
  },
  computed: {
    isVisible() {
      return !!this.record && !this.isDismissed && isApproved(this.record) && shouldShowRetry(this.record);
    },
    dismissedKey() {
      return `onboardingBannerDismissed:${this.record._id}`;
    },
    failedStepTitles() {
      return buildTimeline(this.record)
        .filter(item => item.state === 'failed' || item.state === 'warning')
        .map(item => item.title)
        .join(', ');
    },
  },
  async mounted() {
    try {
      await this.fetchOnboardingRecord();
    } catch (error) {
      // Accounts with no onboarding record end up here too, and neither case needs a banner
      this.record = null;
    }
  },
  methods: {
    applyOnboardingRecord(record) {
      this.record = record;
      this.isDismissed = localStorage.getItem(this.dismissedKey) === 'true';
    },
    // Stays closed until the next login: logging out and the login page both clear localStorage
    dismiss() {
      localStorage.setItem(this.dismissedKey, 'true');
      this.isDismissed = true;
    },
  },
};
</script>

<style scoped>
.attention-banner { display: flex; align-items: center; gap: 12px; margin: 12px auto 0; padding: 12px 16px; border: 1px solid #fde68a; border-radius: 7px; background: #fffbeb; color: #92400e; text-align: left; }
.attention-banner > i { flex: 0 0 auto; font-size: 20px; }
.attention-copy { min-width: 0; flex: 1; font-size: 13px; }
.attention-copy p { margin: 2px 0 0; font-size: 12px; line-height: 1.45; }
.attention-copy .attention-notice { font-weight: 700; }
.attention-actions { display: flex; flex: 0 0 auto; gap: 8px; }
.attention-button { min-height: 34px; padding: 0 14px; border: 1px solid #b45309; border-radius: 5px; background: #fff; color: #b45309; font-size: 12px; font-weight: 700; white-space: nowrap; }
.attention-button.is-primary { background: #b45309; color: #fff; }
.attention-button:disabled { cursor: wait; opacity: .65; }
.attention-close { display: inline-flex; width: 34px; height: 34px; align-items: center; justify-content: center; border: 0; border-radius: 5px; background: transparent; color: #92400e; font-size: 18px; }
.attention-close:hover { background: #fef3c7; }
@media (max-width: 700px) {
  .attention-banner { align-items: flex-start; flex-wrap: wrap; }
  .attention-actions { width: 100%; justify-content: flex-end; }
}
</style>
