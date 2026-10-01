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
              <button
                v-if="item.state === 'failed'"
                type="button"
                class="status-label retry-button"
                :disabled="isRetrying"
                @click="$emit('retry-onboarding')"
              >{{ isRetrying ? 'Retrying…' : 'Retry' }}</button>
              <span v-else class="status-label">{{ item.statusLabel }}</span>
            </div>

            <div v-if="item.failureReason" class="failure-row">
              <span>{{ item.failureReason }}</span>
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

      <a class="support-card" :href="supportMailto">
        <i class="mdi mdi-email-outline" aria-hidden="true"></i>
        <span>Need help? Contact us</span>
      </a>
    </aside>
  </div>
</template>

<script>
import config from '../../config';

export default {
  name: 'StepCreateSSIService',
  props: {
    company: { type: Object, required: true },
    isRefreshing: { type: Boolean, default: false },
    isRetrying: { type: Boolean, default: false },
  },
  computed: {
    supportMailto() {
      return `mailto:${config.app.supportEmails}`;
    },
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
    progressLabel() {
      if (this.normalizedStatus === 'APPROVED' && !this.timeline.length) return 'Workspace setup completed';
      return `${this.completedItems.length} of ${this.timeline.length} tasks completed`;
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
      if (this.failedItems.length === 1) return 'One setup task needs attention. Refresh the status after it has been resolved.';
      if (this.failedItems.length > 1) return `${this.failedItems.length} setup tasks need attention. Refresh the status after they have been resolved.`;
      if (this.summaryState === 'is-complete') return 'Your verification workspace is ready.';
      return 'Your verification workspace is being prepared. Progress will update automatically.';
    },
    hasKybInterest() {
      const serviceTypes = (this.company.service_types || []).map(type => String(type).toUpperCase());
      const interests = [
        ...(this.company.interestedService || []),
        ...(this.company.interests || []),
      ].map(interest => String(interest).trim().toUpperCase());
      return serviceTypes.includes('KYB') || interests.includes('KNOW YOUR BUSINESS (KYB)');
    },
    visibleOnboardingSteps() {
      return this.onboardingSteps.filter(step => step.serviceType !== 'KYB' || this.hasKybInterest);
    },
    timeline() {
      const stepMap = new Map(this.visibleOnboardingSteps.map(step => [step.key, step]));
      const normalizedLogs = (this.company.logs || [])
        .map((log, responseIndex) => ({
          ...log,
          step: typeof log.step === 'string' ? log.step.trim().toUpperCase() : '',
          responseIndex,
          normalizedTime: log.time?.$date || log.time || '',
        }))
        .filter(log => stepMap.has(log.step));
      const latestLogByStep = normalizedLogs.reduce((map, log) => {
        const stepKey = log.step;
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
      const isApproved = this.normalizedStatus === 'APPROVED';
      return this.visibleOnboardingSteps.reduce((items, step) => {
        const log = latestLogByStep.get(step.key);
        if (!log) {
          if (!isApproved) {
            items.push({ ...step, state: 'pending', statusLabel: 'Not started', time: '', failureReason: '' });
          }
          return items;
        }
        const status = (log.status || 'NOT STARTED').replace(/_/g, ' ').toUpperCase();
        const state = isApproved ? 'complete' : this.getTimelineState(status);
        items.push({
          ...step,
          state,
          statusLabel: isApproved ? 'Completed' : this.getStatusLabel(status, state),
          time: log.normalizedTime,
          failureReason: isApproved ? '' : log.failureReason || '',
        });
        return items;
      }, []);
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
        { key: 'CREATE_KYC_SERVICE', title: 'ID service creation', description: 'Create the requested identity-verification service.', serviceType: 'KYC' },
        { key: 'CREDIT_KYC_SERVICE', title: 'ID service credit allocation', description: 'Allocate the approved identity-service credits.', serviceType: 'KYC' },
        { key: 'SETUP_KYC_WIDGET', title: 'KYC widget setup', description: 'Prepare the default verification widget.', serviceType: 'KYC' },
        { key: 'SETUP_KYB_WIDGET', title: 'KYB widget setup', description: 'Prepare the default business-verification widget.', serviceType: 'KYB' },
        { key: 'CONFIGURE_KYC_VERIFIER_PAGE', title: 'KYC verifier page configuration', description: 'Configure the default identity-verification experience.', serviceType: 'KYC' },
        { key: 'CONFIGURE_KYB_VERIFIER_PAGE', title: 'KYB verifier page configuration', description: 'Configure the default business-verification experience.', serviceType: 'KYB' },
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
.status-card, .included-card, .support-card { border: 1px solid #e5e7eb; border-radius: 7px; background: #fff; }
.support-card { border-color: #bfdbfe; }
.status-card { padding: 14px; }
.setup-summary-banner { display: flex; flex-wrap: wrap; gap: 15px; align-items: center; padding: 14px 16px; border-radius: 6px; background: #f3f4f5; }
.setup-summary-banner.is-failed { background: linear-gradient(90deg, #fff4f4, #fff8f8); }
.setup-summary-banner.is-complete { background: #f1fbf6; }
.summary-icon { display: inline-flex; flex: 0 0 30px; width: 30px; height: 30px; align-items: center; justify-content: center; border: 2px solid #6c757d; border-radius: 50%; color: #6c757d; font-size: 17px; }
.is-failed .summary-icon { border-color: #e64b4b; color: #e64b4b; }
.is-complete .summary-icon { border-color: #2eb67d; background: #2eb67d; color: #fff; }
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
.retry-button { border: 0; cursor: pointer; font: inherit; }
.retry-button:hover:not(:disabled) { background: #dc3c3c; color: #fff; }
.retry-button:disabled { cursor: wait; opacity: .65; }
.failure-row { display: flex; gap: 12px; align-items: center; margin-top: 6px; }
.failure-row > span { min-width: 0; flex: 1; padding: 7px 10px; border-radius: 4px; background: #fff0f0; color: #d74848; font-size: 11px; line-height: 1.35; }
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
