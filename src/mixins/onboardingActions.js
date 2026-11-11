// Check status and Retry, shared by the onboarding status page and the app-wide banner.
// The host implements applyOnboardingRecord(record) to render a fresh GET response.
import EventBus from '../eventbus';
import { getOnboarding, retryOnboarding } from '../utils/onboardingApi';
import { checkStatusErrorMessage, retryErrorMessage } from '../utils/onboardingProgress';

// The onboarding routes share a limit of 10 requests a minute, and rapid checks could block Retry
const CHECK_STATUS_COOLDOWN_MS = 10000;

export default {
  data() {
    return {
      isCheckingStatus: false,
      isCheckCoolingDown: false,
      isRetrying: false,
      retryForbidden: false,
      onboardingNotice: '',
    };
  },
  computed: {
    isCheckStatusDisabled() {
      return this.isCheckingStatus || this.isCheckCoolingDown || this.isRetrying;
    },
    isRetryDisabled() {
      return this.isCheckingStatus || this.isRetrying;
    },
  },
  beforeDestroy() {
    clearTimeout(this.checkCooldownTimer);
  },
  methods: {
    async fetchOnboardingRecord() {
      try {
        const record = await getOnboarding();
        if (record && record._id && !this._isDestroyed) this.applyOnboardingRecord(record);
      } finally {
        this.isCheckCoolingDown = true;
        clearTimeout(this.checkCooldownTimer);
        this.checkCooldownTimer = setTimeout(() => { this.isCheckCoolingDown = false; }, CHECK_STATUS_COOLDOWN_MS);
      }
    },
    async checkOnboardingStatus() {
      if (this.isCheckStatusDisabled) return;
      this.isCheckingStatus = true;
      try {
        await this.fetchOnboardingRecord();
        this.onboardingNotice = '';
      } catch (error) {
        if (error?.status === 401) EventBus.$emit('logoutAll');
        else this.onboardingNotice = checkStatusErrorMessage(error);
      } finally {
        this.isCheckingStatus = false;
      }
    },
    async retryOnboardingSetup(recordId) {
      if (this.isRetryDisabled || !recordId) return;
      this.isRetrying = true;
      this.onboardingNotice = '';
      let notice = '';
      try {
        await retryOnboarding(recordId);
      } catch (error) {
        if (error?.status === 401) {
          EventBus.$emit('logoutAll');
          this.isRetrying = false;
          return;
        }
        this.retryForbidden = error?.status === 403;
        notice = retryErrorMessage(error);
      }
      // A 2xx can still hide a failed optional step, so the fresh record decides what to show
      try {
        await this.fetchOnboardingRecord();
      } catch (error) {
        if (!notice) notice = checkStatusErrorMessage(error);
      }
      this.onboardingNotice = notice;
      this.isRetrying = false;
    },
  },
};
