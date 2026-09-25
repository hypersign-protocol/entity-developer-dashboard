<template>
  <section class="receipt-card">
    <div class="success-mark" :class="{ 'is-failed': normalizedStatus === 'FAILED' }">
      <span aria-hidden="true">{{ normalizedStatus === 'FAILED' ? '!' : '✓' }}</span>
    </div>

    <div class="receipt-heading">
      <h2>{{ normalizedStatus === 'FAILED' ? 'Setup request needs attention' : 'Request submitted' }}</h2>
      <p v-if="normalizedStatus === 'FAILED'">We couldn’t complete one or more setup tasks. The details below can help identify what needs attention.</p>
      <p v-else>We received the request for <strong>{{ company.name }}</strong>. We’ll email updates to <strong>{{ company.contact_email }}</strong>.</p>
    </div>

    <div class="status-timeline">
      <div v-for="(item, index) in timeline" :key="`${item.key}-${item.time || index}-${index}`" class="timeline-item" :class="item.state">
        <div class="timeline-marker">
          <span v-if="item.state === 'complete'" aria-hidden="true">✓</span>
          <span v-else-if="item.state === 'failed'" aria-hidden="true">!</span>
        </div>
        <div class="timeline-content">
          <div class="timeline-title-row">
            <h3>{{ item.title }}</h3>
            <span class="status-label">{{ item.statusLabel }}</span>
          </div>
          <p>{{ item.description }}</p>
          <time v-if="item.time" :datetime="item.time">{{ formatDate(item.time) }}</time>
          <div v-if="item.failureReason" class="step-failure">{{ item.failureReason }}</div>
        </div>
      </div>
    </div>

    <div class="dashboard-note">
      You can return to the dashboard while your request is being reviewed. Check the status here when you sign in again.
    </div>

    <footer class="receipt-footer">
      <button type="button" class="secondary-button" @click="$emit('preview-flow')">Preview flow again</button>
    </footer>
  </section>
</template>

<script>
export default {
  name: 'StepCreateSSIService',
  props: {
    company: { type: Object, required: true },
  },
  computed: {
    normalizedStatus() {
      return (this.company.onboardingStatus || 'INITIATED').toUpperCase();
    },
    timeline() {
      const stepMap = new Map(this.onboardingSteps.map(step => [step.key, step]));
      return (this.company.logs || [])
        .map((log, responseIndex) => ({
          ...log,
          responseIndex,
          normalizedTime: log.time?.$date || log.time || '',
        }))
        .sort((left, right) => {
          const leftTime = new Date(left.normalizedTime).getTime();
          const rightTime = new Date(right.normalizedTime).getTime();
          const leftHasTime = Number.isFinite(leftTime);
          const rightHasTime = Number.isFinite(rightTime);
          if (leftHasTime && rightHasTime && leftTime !== rightTime) return leftTime - rightTime;
          if (leftHasTime !== rightHasTime) return leftHasTime ? -1 : 1;
          return left.responseIndex - right.responseIndex;
        })
        .map(log => {
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
    },
  },
  data() {
    return {
      onboardingSteps: [
        { key: 'CREATE_TEAM_ROLE', title: 'Team and roles setup', description: 'Create the default workspace team and access roles.' },
        { key: 'CREATE_SSI_SERVICE', title: 'SSI service creation', description: 'Create the organization’s SSI service.' },
        { key: 'CREDIT_SSI_SERVICE', title: 'SSI credit allocation', description: 'Allocate the approved SSI service credits.' },
        { key: 'CREATE_DID', title: 'Business identity creation', description: 'Create the organization’s decentralized identity.' },
        { key: 'REGISTER_DID', title: 'Blockchain registration', description: 'Register the business identity on the blockchain.' },
        { key: 'CREATE_KYC_SERVICE', title: 'ID service creation', description: 'Create the requested identity-verification service.' },
        { key: 'GIVE_KYC_DASHBOARD_ACCESS', title: 'Dashboard access', description: 'Grant access to the identity-verification dashboard.' },
        { key: 'CREDIT_KYC_SERVICE', title: 'ID service credit allocation', description: 'Allocate the approved identity-service credits.' },
        { key: 'SETUP_KYC_WIDGET', title: 'KYC widget setup', description: 'Prepare the default verification widget.' },
        { key: 'CONFIGURE_KYC_VERIFIER_PAGE', title: 'Verifier page configuration', description: 'Configure the default verifier experience.' },
        { key: 'COMPLETED', title: 'Onboarding complete', description: 'Finish workspace activation and make the services available.' },
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
      if (state === 'failed') return 'Failed';
      if (status === 'PENDING' || state === 'active') return 'In progress';
      return 'Not started';
    },
    formatDate(value) {
      const date = new Date(value);
      return Number.isNaN(date.getTime()) ? '' : date.toLocaleString();
    },
  },
};
</script>

<style scoped>
.receipt-card { padding: 24px; border: 1px solid #dfe5ee; border-radius: 8px; background: #fff; }
.success-mark { display: flex; width: 34px; height: 34px; align-items: center; justify-content: center; margin-bottom: 16px; border-radius: 50%; background: #dcf8ea; }
.success-mark.is-failed { background: #fee4e2; }
.success-mark span { color: #159a68; font-family: Arial, sans-serif; font-size: 18px; font-weight: 700; line-height: 1; }
.success-mark.is-failed span { color: #d64545; }
.receipt-heading h2 { margin: 0 0 6px; color: #1d2939; font-size: 18px; font-weight: 700; }
.receipt-heading p { margin: 0; color: #657287; font-size: 13px; line-height: 1.55; }
.status-timeline { margin-top: 22px; padding: 18px; border: 1px solid #e3e8ef; border-radius: 6px; }
.timeline-item { position: relative; display: flex; gap: 12px; padding-bottom: 19px; }
.timeline-item:last-child { padding-bottom: 0; }
.timeline-item:not(:last-child)::after { position: absolute; top: 17px; bottom: 1px; left: 7px; width: 1px; background: #dfe5ed; content: ''; }
.timeline-marker { z-index: 1; display: flex; flex: 0 0 auto; width: 16px; height: 16px; align-items: center; justify-content: center; border: 2px solid #cdd5df; border-radius: 50%; background: #fff; }
.complete .timeline-marker { border-color: #2daf78; background: #2daf78; }
.active .timeline-marker { border: 4px solid #2f6fec; }
.failed .timeline-marker { border-color: #d64545; background: #d64545; }
.timeline-marker span { color: #fff; font-family: Arial, sans-serif; font-size: 10px; font-weight: 700; line-height: 1; }
.timeline-item h3 { margin: 0 0 2px; color: #344054; font-size: 13px; font-weight: 700; }
.timeline-item p { margin: 0; color: #7a8799; font-size: 12px; }
.timeline-content { min-width: 0; flex: 1; }
.timeline-title-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.status-label { flex: 0 0 auto; color: #8993a4; font-size: 10px; font-weight: 700; text-transform: uppercase; }
.complete .status-label { color: #159a68; }
.active .status-label { color: #2f6fec; }
.failed .status-label { color: #d64545; }
.timeline-item time { display: block; margin-top: 4px; color: #98a2b3; font-size: 10px; }
.step-failure { margin-top: 7px; padding: 7px 9px; border-radius: 4px; background: #fff1f0; color: #b42318; font-size: 11px; }
.dashboard-note { margin-top: 18px; padding: 11px 12px; border-radius: 5px; background: #f1f6ff; color: #52627a; font-size: 12px; line-height: 1.5; }
.receipt-footer { display: flex; justify-content: flex-end; margin-top: 20px; }
.secondary-button { height: 38px; padding: 0 14px; border: 1px solid #6c757d; border-radius: 5px; background: #fff; color: #6c757d; font-size: 12px; font-weight: 700; }
.secondary-button:hover { background: #6c757d; color: #fff; }
</style>
