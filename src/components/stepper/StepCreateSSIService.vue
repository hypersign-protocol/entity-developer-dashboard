<template>
  <div class="status-page-layout">
    <section class="status-card">
      <div class="setup-summary-banner" :class="summaryState" role="status">
        <span class="summary-icon" aria-hidden="true">
          <i :class="summaryIcon"></i>
        </span>
        <div class="summary-copy">
          <div class="summary-title-row">
            <h2>Workspace setup</h2>
            <span class="summary-badge">{{ summaryBadge }}</span>
          </div>
          <p>{{ summaryMessage }}</p>
        </div>
        <div class="setup-progress">
          <div class="progress-meta">
            <span>{{ progressLabel }}</span>
            <strong>{{ progressPercentage }}%</strong>
          </div>
          <div
            class="progress-track"
            role="progressbar"
            aria-label="Workspace setup progress"
            :aria-valuenow="progressPercentage"
            aria-valuemin="0"
            aria-valuemax="100"
          >
            <span class="progress-fill" :style="{ width: `${progressPercentage}%` }"></span>
          </div>
        </div>
      </div>

      <div class="status-timeline">
        <div
          v-for="(item, index) in timeline"
          :key="`${item.key}-${item.time || index}-${index}`"
          class="timeline-item"
          :class="item.state"
        >
          <div class="timeline-rail" aria-hidden="true">
            <span class="timeline-marker">
              <i v-if="item.state === 'complete'" class="mdi mdi-check"></i>
              <span v-else-if="item.failureMessage">!</span>
            </span>
          </div>

          <div class="timeline-content">
            <div class="timeline-title-row">
              <div>
                <h3>{{ item.title }}</h3>
                <p>{{ item.description }}</p>
                <time v-if="item.time" :datetime="item.time">{{ formatDate(item.time) }}</time>
              </div>
              <span class="status-label">{{ item.statusLabel }}</span>
            </div>

            <div v-if="item.failureMessage" class="failure-row">
              <span>{{ item.failureMessage }}</span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="notice" class="status-notice" role="alert">{{ notice }}</div>

      <footer class="status-footer">
        <div class="progress-note">
          <i class="mdi mdi-information-outline" aria-hidden="true"></i>
          <span>You can leave this page and return anytime. Progress is saved and available whenever you return.</span>
        </div>
        <button v-if="showCheckStatus" type="button" class="secondary-button refresh-button" :disabled="isCheckDisabled" @click="$emit('check-status')">
          <i class="mdi mdi-refresh" :class="{ 'is-spinning': isChecking }" aria-hidden="true"></i>
          {{ isChecking ? 'Checking…' : 'Check status' }}
        </button>
        <button v-if="showRetry" type="button" class="retry-button" :disabled="isRetryDisabled" @click="$emit('retry')">
          {{ isRetrying ? 'Retrying…' : 'Retry' }}
        </button>
      </footer>
    </section>

    <aside class="status-sidebar">
      <section class="included-card">
        <h2>What’s included</h2>
        <p>We’ll set up your verification workspace with the following:</p>
        <ul>
          <li>Organization details</li>
          <li>Selected verification services</li>
          <li>Workspace activation</li>
        </ul>
      </section>

      <a class="support-card" :href="supportMailto">
        <i class="mdi mdi-email-outline" aria-hidden="true"></i>
        <span>Need help? Contact us</span>
      </a>
    </aside>
  </div>
</template>

<script>
import config from '../../config';
import { buildTimeline, isApproved, shouldShowCheckStatus, shouldShowRetry } from '../../utils/onboardingProgress';

export default {
  name: 'StepCreateSSIService',
  props: {
    company: { type: Object, required: true },
    isChecking: { type: Boolean, default: false },
    isCheckDisabled: { type: Boolean, default: false },
    isRetrying: { type: Boolean, default: false },
    isRetryDisabled: { type: Boolean, default: false },
    retryForbidden: { type: Boolean, default: false },
    notice: { type: String, default: '' },
  },
  computed: {
    supportMailto() {
      return `mailto:${config.app.supportEmails}`;
    },
    // The form keeps interests until the first GET fills interestedService
    record() {
      return {
        onboardingStatus: this.company.onboardingStatus,
        logs: this.company.logs,
        processingActive: this.company.processingActive,
        interestedService: [...(this.company.interestedService || []), ...(this.company.interests || [])],
      };
    },
    timeline() {
      return buildTimeline(this.record);
    },
    failedItems() {
      return this.timeline.filter(item => item.state === 'failed');
    },
    warningItems() {
      return this.timeline.filter(item => item.state === 'warning');
    },
    completedItems() {
      return this.timeline.filter(item => item.state === 'complete');
    },
    showCheckStatus() {
      return shouldShowCheckStatus(this.record);
    },
    showRetry() {
      return !this.retryForbidden && shouldShowRetry(this.record);
    },
    progressPercentage() {
      return Math.round((this.completedItems.length / this.timeline.length) * 100);
    },
    progressLabel() {
      return `${this.completedItems.length} of ${this.timeline.length} tasks completed`;
    },
    summaryState() {
      if (this.record.processingActive === true) return 'is-progress';
      if (this.failedItems.length) return 'is-failed';
      if (this.warningItems.length) return 'is-warning';
      if (isApproved(this.record) || this.completedItems.length === this.timeline.length) return 'is-complete';
      // Nothing failed, but the run stopped before finishing
      if (shouldShowRetry(this.record)) return 'is-failed';
      return 'is-progress';
    },
    summaryIcon() {
      if (this.summaryState === 'is-failed' || this.summaryState === 'is-warning') return 'mdi mdi-alert-outline';
      if (this.summaryState === 'is-complete') return 'mdi mdi-check';
      return 'mdi mdi-clock-outline';
    },
    summaryBadge() {
      if (this.summaryState === 'is-failed') return 'Action required';
      if (this.summaryState === 'is-warning') return 'Needs attention';
      if (this.summaryState === 'is-complete') return 'Completed';
      return 'In progress';
    },
    summaryMessage() {
      if (this.summaryState === 'is-failed' || this.summaryState === 'is-warning') {
        const count = this.failedItems.length + this.warningItems.length;
        if (count === 1) return 'One setup task couldn’t be completed. Please retry.';
        if (count > 1) return `${count} setup tasks couldn’t be completed. Please retry.`;
        return 'Setup stopped before it finished. Please retry to continue.';
      }
      if (this.summaryState === 'is-complete') return 'Your verification workspace is ready.';
      return 'Your verification workspace is being prepared. Use Check status to see the latest progress.';
    },
  },
  methods: {
    formatDate(value) {
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return '';
      return date.toLocaleString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
      });
    },
  },
};
</script>

<style scoped>
.status-page-layout { display: grid; grid-template-columns: minmax(0, 760px) 220px; gap: 20px; align-items: start; }
.status-card, .included-card, .support-card { border: 1px solid #e5e7eb; border-radius: 7px; background: #fff; }
.support-card { border-color: #bfdbfe; }
.status-card { padding: 14px; }
.setup-summary-banner { display: flex; flex-wrap: wrap; gap: 15px; align-items: center; padding: 14px 16px; border-radius: 6px; background: #f3f4f5; }
.setup-summary-banner.is-failed { background: linear-gradient(90deg, #fff4f4, #fff8f8); }
.setup-summary-banner.is-complete { background: #f1fbf6; }
.summary-icon { display: inline-flex; flex: 0 0 30px; width: 30px; height: 30px; align-items: center; justify-content: center; border: 2px solid #6c757d; border-radius: 50%; color: #6c757d; font-size: 17px; }
.is-failed .summary-icon { border-color: #e64b4b; color: #e64b4b; }
.is-complete .summary-icon { border-color: #2eb67d; background: #2eb67d; color: #fff; }
.setup-summary-banner.is-warning { background: #fffbeb; }
.is-warning .summary-icon { border-color: #d97706; color: #d97706; }
.is-warning .summary-badge { background: #fef3c7; color: #b45309; }
.summary-copy { min-width: 0; flex: 1; }
.summary-title-row { display: flex; align-items: center; gap: 10px; }
.summary-title-row h2 { margin: 0; color: #17213d; font-size: 16px; font-weight: 750; }
.summary-badge, .status-label { display: inline-flex; align-items: center; border-radius: 4px; font-size: 10px; font-weight: 700; line-height: 1; }
.summary-badge { min-height: 20px; padding: 0 8px; background: #e2e4e6; color: #5a6268; }
.is-failed .summary-badge { background: #ffe1e1; color: #e04343; }
.is-complete .summary-badge { background: #dcf7e9; color: #19945f; }
.summary-copy p { margin: 4px 0 0; color: #64748b; font-size: 12px; line-height: 1.45; }
.setup-progress { box-sizing: border-box; flex: 0 0 100%; width: 100%; margin: 0; padding: 0 5%; }
.progress-meta { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 6px; color: #64748b; font-size: 10px; line-height: 1.3; }
.progress-meta strong { color: #344563; font-size: 10px; font-weight: 750; }
.progress-track { width: 100%; height: 6px; overflow: hidden; border-radius: 999px; background: #dce2e7; }
.progress-fill { display: block; height: 100%; border-radius: inherit; background: #6c757d; transition: width .3s ease; }
.is-failed .progress-fill { background: #6c757d; }
.is-complete .progress-fill { background: #2eb67d; }
.status-timeline { max-height: min(58vh, 560px); overflow-y: auto; padding: 12px 8px 4px 4px; scrollbar-color: #aeb4b9 #f0f1f2; scrollbar-width: thin; }
.status-timeline::-webkit-scrollbar { width: 7px; }
.status-timeline::-webkit-scrollbar-track { border-radius: 999px; background: #f0f1f2; }
.status-timeline::-webkit-scrollbar-thumb { border-radius: 999px; background: #aeb4b9; }
.status-timeline::-webkit-scrollbar-thumb:hover { background: #878e94; }
.timeline-item { position: relative; display: flex; min-height: 62px; gap: 12px; padding-top: 6px; }
.timeline-item:last-child { min-height: 50px; }
.timeline-item:not(:last-child)::after { position: absolute; right: 4px; bottom: 6px; left: 30px; height: 1px; background: #e2e8f0; content: ''; }
.timeline-rail { position: relative; flex: 0 0 18px; width: 18px; }
.timeline-item:not(:last-child) .timeline-rail::after { position: absolute; z-index: 0; top: 17px; bottom: -1px; left: 8px; width: 1px; background: #e2e8f0; content: ''; }
.timeline-marker { position: relative; z-index: 1; display: flex; width: 16px; height: 16px; align-items: center; justify-content: center; margin-top: 2px; border: 1.5px solid #cbd5e1; border-radius: 50%; background: #fff; color: #fff; font-size: 9px; font-weight: 800; }
.complete .timeline-marker { border-color: #bfdbfe; background: #bfdbfe; color: #fff; }
.failed .timeline-marker { border-color: #fecaca; background: #fecaca; color: #fff; }
.warning .timeline-marker { border-color: #fde68a; background: #fde68a; color: #92400e; }
.active .timeline-marker { border: 4px solid #cbd5e1; }
.timeline-marker i { font-size: 11px; }
.timeline-content { min-width: 0; flex: 1; padding: 0 0 16px; }
.timeline-title-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 14px; }
.timeline-item h3 { margin: 0 0 2px; color: #253455; font-size: 13px; font-weight: 750; line-height: 1.35; }
.timeline-item p { margin: 0; color: #747d85; font-size: 11px; line-height: 1.4; }
.timeline-item time { display: block; margin-top: 2px; color: #858d94; font-size: 10px; line-height: 1.35; }
.status-label { display: inline-flex; flex: 0 0 auto; min-width: 70px; min-height: 20px; align-items: center; justify-content: center; padding: 0 8px; background: #f1f5f9; color: #64748b; text-align: center; }
.complete .status-label { background: #e3f8ed; color: #159a68; }
.active .status-label { background: #e2e4e6; color: #5a6268; }
.failed .status-label { background: #ffe1e1; color: #dc3c3c; }
.warning .status-label { background: #fef3c7; color: #b45309; }
.failure-row { display: flex; gap: 12px; align-items: center; margin-top: 6px; }
.failure-row > span { min-width: 0; flex: 1; padding: 7px 10px; border-radius: 4px; background: #fff0f0; color: #d74848; font-size: 11px; line-height: 1.35; }
.warning .failure-row > span { background: #fffbeb; color: #b45309; }
.status-notice { margin-bottom: 10px; padding: 9px 11px; border-radius: 4px; background: #fffbeb; color: #b45309; font-size: 11px; font-weight: 700; line-height: 1.4; }
.retry-button { display: inline-flex; flex: 0 0 auto; height: 40px; align-items: center; justify-content: center; padding: 0 18px; border: 1px solid #6c757d; border-radius: 5px; background: #6c757d; color: #fff; font-size: 11px; font-weight: 700; white-space: nowrap; }
.retry-button:hover:not(:disabled) { border-color: #545b62; background: #5a6268; }
.retry-button:disabled { cursor: wait; opacity: .65; }
.status-footer { display: flex; gap: 12px; align-items: center; justify-content: space-between; margin-top: 2px; }
.progress-note { display: flex; min-width: 0; flex: 1; gap: 8px; align-items: center; min-height: 40px; padding: 9px 11px; border-radius: 4px; background: #f3f4f5; color: #626b73; font-size: 11px; line-height: 1.4; }
.progress-note i { flex: 0 0 auto; color: #6c757d; font-size: 14px; }
.secondary-button { display: inline-flex; height: 40px; align-items: center; justify-content: center; gap: 7px; padding: 0 15px; border: 1px solid #6c757d; border-radius: 5px; background: #fff; color: #6c757d; font-size: 11px; font-weight: 700; white-space: nowrap; }
.secondary-button:hover { background: #6c757d; color: #fff; }
.secondary-button:disabled { cursor: wait; opacity: .65; }
.refresh-button { flex: 0 0 auto; min-width: 112px; }
.refresh-button i { font-size: 15px; }
.refresh-button i.is-spinning { animation: spin .8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.status-sidebar { display: grid; gap: 14px; }
.included-card { padding: 18px; }
.included-card h2 { margin: 0 0 7px; color: #17213d; font-size: 16px; font-weight: 750; }
.included-card p, .included-card li { color: #64748b; font-size: 11px; line-height: 1.55; }
.included-card p { margin: 0; }
.included-card ul { margin: 13px 0 0; padding-left: 18px; }
.included-card li { padding: 4px 0 4px 6px; }
.support-card { display: flex; min-height: 58px; align-items: center; justify-content: center; gap: 9px; color: #2563eb; font-size: 11px; font-weight: 700; text-decoration: none; }
.support-card:hover { border-color: #bfdbfe; background: #f0f7ff; color: #2563eb; }
.support-card i { font-size: 17px; }
@media (max-width: 900px) {
  .status-page-layout { grid-template-columns: 1fr; }
  .status-sidebar { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 700px) {
  .status-card { padding: 12px; }
  .status-footer { align-items: stretch; flex-direction: column; }
  .refresh-button { align-self: flex-end; }
}
@media (max-width: 520px) {
  .status-sidebar { grid-template-columns: 1fr; }
  .setup-summary-banner { align-items: flex-start; }
  .summary-title-row, .timeline-title-row { align-items: flex-start; }
  .summary-title-row { flex-direction: column; gap: 5px; }
  .secondary-button { width: 100%; }
  .setup-progress { padding: 0; }
}
</style>
