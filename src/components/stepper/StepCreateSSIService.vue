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
          <div class="setup-progress">
            <div class="progress-meta">
              <span>{{ completedItems.length }} of {{ timeline.length }} tasks completed</span>
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
              <span v-else-if="item.state === 'failed'">!</span>
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

            <div v-if="item.failureReason" class="failure-row">
              <span>{{ item.failureReason }}</span>
              <button type="button" class="retry-button">Retry</button>
            </div>
          </div>
        </div>
      </div>

      <footer class="status-footer">
        <div class="progress-note">
          <i class="mdi mdi-information-outline" aria-hidden="true"></i>
          <span>You can leave this page and return anytime. Progress is saved and available whenever you return.</span>
        </div>
        <button type="button" class="secondary-button refresh-button" :disabled="isRefreshing" @click="$emit('refresh-status')">
          <i class="mdi mdi-refresh" :class="{ 'is-spinning': isRefreshing }" aria-hidden="true"></i>
          {{ isRefreshing ? 'Refreshing…' : 'Refresh status' }}
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

      <a class="support-card" href="mailto:support@hypersign.id">
        <i class="mdi mdi-email-outline" aria-hidden="true"></i>
        <span>Need help? Contact us</span>
      </a>
    </aside>
  </div>
</template>

<script>
export default {
  name: 'StepCreateSSIService',
  props: {
    company: { type: Object, required: true },
    isRefreshing: { type: Boolean, default: false },
  },
  computed: {
    normalizedStatus() {
      return (this.company.onboardingStatus || 'INITIATED').toUpperCase();
    },
    failedItems() {
      return this.timeline.filter(item => item.state === 'failed');
    },
    completedItems() {
      return this.timeline.filter(item => item.state === 'complete');
    },
    progressPercentage() {
      if (this.normalizedStatus === 'APPROVED') return 100;
      if (!this.timeline.length) return 0;
      return Math.round((this.completedItems.length / this.timeline.length) * 100);
    },
    summaryState() {
      if (this.failedItems.length) return 'is-failed';
      if (this.normalizedStatus === 'APPROVED' || this.completedItems.length === this.timeline.length) return 'is-complete';
      return 'is-progress';
    },
    summaryIcon() {
      if (this.summaryState === 'is-failed') return 'mdi mdi-alert-outline';
      if (this.summaryState === 'is-complete') return 'mdi mdi-check';
      return 'mdi mdi-clock-outline';
    },
    summaryBadge() {
      if (this.summaryState === 'is-failed') return 'Action required';
      if (this.summaryState === 'is-complete') return 'Completed';
      return 'In progress';
    },
    summaryMessage() {
      if (this.failedItems.length === 1) return 'One setup task needs attention. You can retry it below.';
      if (this.failedItems.length > 1) return `${this.failedItems.length} setup tasks need attention. You can retry them below.`;
      if (this.summaryState === 'is-complete') return 'Your verification workspace is ready.';
      return 'Your verification workspace is being prepared. Progress will update automatically.';
    },
    timeline() {
      const stepMap = new Map(this.onboardingSteps.map(step => [step.key, step]));
      const normalizedLogs = (this.company.logs || []).map((log, responseIndex) => ({
        ...log,
        step: typeof log.step === 'string' ? log.step.trim().toUpperCase() : '',
        responseIndex,
        normalizedTime: log.time?.$date || log.time || '',
      }));
      const latestLogByStep = normalizedLogs.reduce((map, log) => {
        const stepKey = log.step || `UNKNOWN_STEP_${log.responseIndex}`;
        const existing = map.get(stepKey);
        if (!existing) {
          map.set(stepKey, { ...log, step: stepKey });
          return map;
        }
        const existingTime = new Date(existing.normalizedTime).getTime();
        const candidateTime = new Date(log.normalizedTime).getTime();
        const existingHasTime = Number.isFinite(existingTime);
        const candidateHasTime = Number.isFinite(candidateTime);
        const isNewer = candidateHasTime && (!existingHasTime || candidateTime >= existingTime);
        const shouldUseLaterResponse = !candidateHasTime && !existingHasTime && log.responseIndex > existing.responseIndex;
        if (isNewer || shouldUseLaterResponse) map.set(stepKey, { ...log, step: stepKey });
        return map;
      }, new Map());
      const orderedLogs = [...latestLogByStep.values()].sort((left, right) => {
        const leftIndex = this.onboardingSteps.findIndex(step => step.key === left.step);
        const rightIndex = this.onboardingSteps.findIndex(step => step.key === right.step);
        if (leftIndex !== -1 && rightIndex !== -1) return leftIndex - rightIndex;
        if (leftIndex !== -1) return -1;
        if (rightIndex !== -1) return 1;
        return left.responseIndex - right.responseIndex;
      });
      const loggedStepKeys = new Set(orderedLogs.map(log => log.step).filter(Boolean));
      const loggedSteps = orderedLogs.map(log => {
        const step = stepMap.get(log.step) || { key: log.step || 'UNKNOWN_STEP', title: log.step || 'Unknown step', description: '' };
        const status = (log.status || 'NOT STARTED').replace(/_/g, ' ').toUpperCase();
        const state = this.getTimelineState(status);
        return {
          ...step,
          state,
          statusLabel: this.getStatusLabel(status, state),
          time: log.normalizedTime,
          failureReason: log.failureReason || '',
        };
      });
      const missingSteps = this.onboardingSteps
        .filter(step => !loggedStepKeys.has(step.key))
        .map(step => ({
          ...step,
          state: 'pending',
          statusLabel: 'Not started',
          time: '',
          failureReason: '',
        }));
      return [...loggedSteps, ...missingSteps];
    },
  },
  data() {
    return {
      onboardingSteps: [
        { key: 'GIVE_DASHBOARD_ACCESS', title: 'Dashboard access', description: 'Grant access to the identity-verification dashboard.' },
        { key: 'CREATE_TEAM_ROLE', title: 'Team and roles setup', description: 'Create the default workspace team and access roles.' },
        { key: 'CREATE_SSI_SERVICE', title: 'SSI service creation', description: 'Create the organization’s SSI service.' },
        { key: 'CREDIT_SSI_SERVICE', title: 'SSI credit allocation', description: 'Allocate the approved SSI service credits.' },
        { key: 'CREATE_DID', title: 'Business identity creation', description: 'Create the organization’s decentralized identity.' },
        { key: 'REGISTER_DID', title: 'Blockchain registration', description: 'Register the business identity on the blockchain.' },
        { key: 'CREATE_KYC_SERVICE', title: 'ID service creation', description: 'Create the requested identity-verification service.' },
        { key: 'CREDIT_KYC_SERVICE', title: 'ID service credit allocation', description: 'Allocate the approved identity-service credits.' },
        { key: 'SETUP_KYC_WIDGET', title: 'KYC widget setup', description: 'Prepare the default verification widget.' },
        { key: 'SETUP_KYB_WIDGET', title: 'KYB widget setup', description: 'Prepare the default business-verification widget.' },
        { key: 'CONFIGURE_KYC_VERIFIER_PAGE', title: 'KYC verifier page configuration', description: 'Configure the default identity-verification experience.' },
        { key: 'CONFIGURE_KYB_VERIFIER_PAGE', title: 'KYB verifier page configuration', description: 'Configure the default business-verification experience.' },
        { key: 'COMPLETED', title: 'Workspace activation', description: 'Finish workspace activation and make the services available.' },
      ],
    };
  },
  methods: {
    getTimelineState(status) {
      if (status === 'SUCCESS') return 'complete';
      if (status === 'FAILED') return 'failed';
      if (status === 'PENDING') return 'active';
      return 'pending';
    },
    getStatusLabel(status, state) {
      if (state === 'complete') return 'Completed';
      if (state === 'failed') return 'Action required';
      if (status === 'PENDING' || state === 'active') return 'In progress';
      return 'Not started';
    },
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
.status-card, .included-card, .support-card { border: 1px solid #cfe0fb; border-radius: 7px; background: #fff; }
.status-card { padding: 14px; }
.setup-summary-banner { display: flex; gap: 15px; align-items: center; padding: 14px 16px; border-radius: 6px; background: #f1f6ff; }
.setup-summary-banner.is-failed { background: linear-gradient(90deg, #fff4f4, #fff8f8); }
.setup-summary-banner.is-complete { background: #f1fbf6; }
.summary-icon { display: inline-flex; flex: 0 0 30px; width: 30px; height: 30px; align-items: center; justify-content: center; border: 2px solid #1769ff; border-radius: 50%; color: #1769ff; font-size: 17px; }
.is-failed .summary-icon { border-color: #e64b4b; color: #e64b4b; }
.is-complete .summary-icon { border-color: #2eb67d; background: #2eb67d; color: #fff; }
.summary-copy { min-width: 0; flex: 1; }
.summary-title-row { display: flex; align-items: center; gap: 10px; }
.summary-title-row h2 { margin: 0; color: #17213d; font-size: 16px; font-weight: 750; }
.summary-badge, .status-label { display: inline-flex; align-items: center; border-radius: 4px; font-size: 10px; font-weight: 700; line-height: 1; }
.summary-badge { min-height: 20px; padding: 0 8px; background: #e8f1ff; color: #1769ff; }
.is-failed .summary-badge { background: #ffe1e1; color: #e04343; }
.is-complete .summary-badge { background: #dcf7e9; color: #19945f; }
.summary-copy p { margin: 4px 0 0; color: #6980a7; font-size: 12px; line-height: 1.45; }
.setup-progress { width: 100%; max-width: 520px; margin-top: 11px; }
.progress-meta { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 6px; color: #60769c; font-size: 10px; line-height: 1.3; }
.progress-meta strong { color: #344563; font-size: 10px; font-weight: 750; }
.progress-track { width: 100%; height: 7px; overflow: hidden; border-radius: 999px; background: #dce5f1; }
.progress-fill { display: block; height: 100%; border-radius: inherit; background: #6c757d; transition: width .3s ease; }
.is-failed .progress-fill { background: #6c757d; }
.is-complete .progress-fill { background: #2eb67d; }
.status-timeline { padding: 12px 4px 4px; }
.timeline-item { position: relative; display: flex; min-height: 52px; gap: 12px; }
.timeline-item:last-child { min-height: 42px; }
.timeline-rail { position: relative; flex: 0 0 18px; width: 18px; }
.timeline-item:not(:last-child) .timeline-rail::after { position: absolute; z-index: 0; top: 17px; bottom: -1px; left: 8px; width: 1px; background: #d8e2f0; content: ''; }
.timeline-marker { position: relative; z-index: 1; display: flex; width: 16px; height: 16px; align-items: center; justify-content: center; margin-top: 2px; border: 1.5px solid #cad8eb; border-radius: 50%; background: #fff; color: #fff; font-size: 9px; font-weight: 800; }
.complete .timeline-marker { border-color: #2eb67d; background: #2eb67d; }
.failed .timeline-marker { border-color: #ed3f36; background: #ed3f36; }
.active .timeline-marker { border: 4px solid #1769ff; }
.timeline-marker i { font-size: 11px; }
.timeline-content { min-width: 0; flex: 1; padding: 0 0 10px; border-bottom: 1px solid #e7edf6; }
.timeline-item:last-child .timeline-content { border-bottom: 0; }
.timeline-title-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 14px; }
.timeline-item h3 { margin: 0 0 2px; color: #253455; font-size: 13px; font-weight: 750; line-height: 1.35; }
.timeline-item p { margin: 0; color: #7187ab; font-size: 11px; line-height: 1.4; }
.timeline-item time { display: block; margin-top: 2px; color: #7e91b1; font-size: 10px; line-height: 1.35; }
.status-label { flex: 0 0 auto; min-height: 18px; padding: 0 7px; background: #eef2f7; color: #7686a0; }
.complete .status-label { background: #e3f8ed; color: #159a68; }
.active .status-label { background: #e8f1ff; color: #1769ff; }
.failed .status-label { background: #ffe1e1; color: #dc3c3c; }
.failure-row { display: flex; gap: 12px; align-items: center; margin-top: 6px; }
.failure-row > span { min-width: 0; flex: 1; padding: 7px 10px; border-radius: 4px; background: #fff0f0; color: #d74848; font-size: 11px; line-height: 1.35; }
.retry-button { flex: 0 0 66px; height: 30px; border: 1px solid #6c757d; border-radius: 4px; background: #fff; color: #6c757d; font-size: 11px; font-weight: 700; }
.retry-button:hover { background: #6c757d; color: #fff; }
.status-footer { display: flex; gap: 12px; align-items: center; justify-content: space-between; margin-top: 2px; }
.progress-note { display: flex; min-width: 0; flex: 1; gap: 8px; align-items: center; min-height: 40px; padding: 9px 11px; border-radius: 4px; background: #f0f6ff; color: #5b76a5; font-size: 11px; line-height: 1.4; }
.progress-note i { flex: 0 0 auto; color: #1769ff; font-size: 14px; }
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
.included-card p, .included-card li { color: #6881aa; font-size: 11px; line-height: 1.55; }
.included-card p { margin: 0; }
.included-card ul { margin: 13px 0 0; padding-left: 18px; }
.included-card li { padding: 4px 0 4px 6px; }
.support-card { display: flex; min-height: 58px; align-items: center; justify-content: center; gap: 9px; color: #1769ff; font-size: 11px; font-weight: 700; text-decoration: none; }
.support-card:hover { border-color: #1769ff; background: #f8fbff; }
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
}
</style>
