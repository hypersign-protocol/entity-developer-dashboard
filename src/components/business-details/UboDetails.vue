<template>
  <div class="ubo-details">
    <SectionLoader v-if="loading" label="Loading UBO details" min-height="calc(70vh - 4rem)" />

    <!-- Individual UBO Cards -->
    <div v-else-if="ubos.length > 0" class="ubo-grid">
      <div
        v-for="(ubo, index) in ubos"
        :key="index"
        class="detail-card clickable-card"
        :class="{ disabled: isKycNotStarted(ubo.kycSteps) }"
        @click="navigateToVerificationDetails(ubo)"
      >
        <div class="card-body-inner">
          <!-- Top row: avatar + name + badge -->
          <div class="card-top">
            <div class="ubo-avatar">{{ getInitials(ubo.name) }}</div>
            <div class="card-name">
              <span class="ubo-name">{{ ubo.name }}</span>
              <span class="ubo-role">{{ ubo.designation }} · {{ ubo.type }}</span>
            </div>
            <span class="status-badge" :class="getStatusBadgeClass(ubo.status)">
              <i :class="getStatusIcon(ubo.status)" class="mr-1"></i>
              {{ getKycStatusText(ubo.kycSteps) }}
            </span>
          </div>

          <!-- Middle: info columns -->
          <div class="card-meta">
            <div class="meta-item">
              <span class="meta-label">Type</span>
              <span class="meta-value">{{ ubo.type || 'N/A' }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Designation</span>
              <span class="meta-value">{{ ubo.designation || 'N/A' }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Email</span>
              <span class="meta-value" :title="ubo.email">{{ ubo.email || 'N/A' }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Ownership</span>
              <span class="meta-value">{{ ubo.ownershipPercentage }}%</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Retries</span>
              <span class="meta-value">{{ ubo.kycSteps?.retries ?? 'N/A' }}</span>
            </div>
          </div>

          <!-- Bottom: KYC step track -->
          <div class="step-row">
            <ol class="step-track" :aria-label="`KYC progress for ${ubo.name}`">
              <li
                v-for="step in getStepStates(ubo.kycSteps)"
                :key="step.key"
                class="step-item"
                :class="`is-${step.state}`"
                :title="`${step.title}: ${stepStateText[step.state]}`"
              >
                <span class="step-bar" aria-hidden="true"></span>
                <span class="step-label">{{ step.label }}</span>
                <span class="sr-only">: {{ stepStateText[step.state] }}</span>
              </li>
            </ol>
            <div class="step-summary">
              <strong>{{ getStepSummary(ubo.kycSteps).count }}</strong>
              <span :class="`summary-${getStepSummary(ubo.kycSteps).tone}`">{{ getStepSummary(ubo.kycSteps).text }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <empty-container v-else title="No UBO Information" icon="mdi mdi-account-group-outline"
      description="No Ultimate Beneficial Owner information has been provided for this business yet." />

  </div>
</template>
<script>
import SectionLoader from '../element/SectionLoader.vue';

export default {
  name: "UboDetails",
  components: { SectionLoader },
  props: {
    company: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      loading: false,
      // KYC steps in order, keyed by their kycSteps property
      kycStepDefinitions: [
        { key: 'step_start', label: 'Start', title: 'Session started' },
        { key: 'step_liveliness', label: 'Liveness', title: 'Liveness check' },
        { key: 'step_ocrIdVerification', label: 'Document', title: 'Document verification' },
        { key: 'step_userConsent', label: 'Consent', title: 'User consent' },
        { key: 'step_finish', label: 'Done', title: 'Completed' },
      ],
      stepStateText: { done: 'completed', current: 'in progress', failed: 'stopped here', todo: 'not started' },
    };
  },
  watch: {
    'company.id': {
      async handler(newId, oldId) {
        if (oldId && newId !== oldId) {
          // Clear stale data from previous company immediately (the header summary clears it on page load)
          this.$store.commit('mainStore/clearCompanyExecutives');
        }
        if (newId) {
          await this.fetchUbos();
        }
      },
      immediate: true
    }
  },
  computed: {
    ubos() {
      const companyExecutives = this.$store.getters['mainStore/getCompanyExecutives'] || [];

      return companyExecutives.map(ubo => ({
        id: ubo._id,
        name: ubo.name,
        role: `${ubo.designation} (${ubo.type})`,
        ownershipPercentage: ubo.percentageShare || 0,
        status: this.getUboStatus(ubo.kycSteps),
        email: ubo.email,
        type: ubo.type,
        designation: ubo.designation,
        createdAt: ubo.createdAt,
        updatedAt: ubo.updatedAt,
        kycSteps: ubo.kycSteps,
        mailSent: ubo.mailSent,
        emailHash: ubo.emailHash
      }));
    },
    verifiedUbos() {
      return this.ubos.filter(ubo => ubo.status === 'verified').length;
    },
    pendingUbos() {
      return this.ubos.filter(ubo => ubo.status === 'pending').length;
    },
    rejectedUbos() {
      return this.ubos.filter(ubo => ubo.status === 'rejected').length;
    },
    overallProgress() {
      if (this.ubos.length === 0) return 0;
      return Math.round((this.verifiedUbos / this.ubos.length) * 100);
    }
  },
  methods: {
    async fetchUbos() {
      if (!this.company?.id) {
        console.warn('No company ID provided for fetching UBOs');
        return;
      }

      try {
        this.loading = true;
        await this.$store.dispatch('mainStore/fetchCompanyExecutives', {
          companyId: this.company.id
        });
      } catch (error) {
        console.error('Error fetching company executives:', error);
      } finally {
        this.loading = false;
      }
    },

    navigateToDetails() {
      // Navigate to detailed UBO verification page
      const companyId = this.company?.id;
      if (companyId) {
        this.$router.push(`/studio/sessions/${companyId}/`);
      }
    },
    navigateToVerificationDetails(ubo) {
      if (this.isKycNotStarted(ubo?.kycSteps)) return;

      const companyId = this.company?.id;
      if (companyId && ubo?.emailHash) {
        this.$router.push(`/studio/sessions/${companyId}/${ubo.emailHash}`);
      }
    },

    isKycNotStarted(kycSteps) {
      return this.getKycStatusText(kycSteps) === 'Not Started';
    },

    getUboStatus(kycSteps) {
      if (!kycSteps) return 'pending';

      const statusMap = {
        'Success': 'verified',
        'Pending': 'pending',
        'Failed': 'rejected',
        'Failure': 'rejected',
        'Expired': 'rejected'
      };
      return statusMap[kycSteps.status] || 'pending';
    },

    // done | current | failed | todo for each step. The first unfinished step is where the
    // person is: in progress while KYC is pending, failed once it failed or expired.
    getStepStates(kycSteps) {
      const status = kycSteps && kycSteps.status;
      const stopped = ['Failed', 'Failure', 'Expired'].includes(status);
      const firstOpen = kycSteps
        ? this.kycStepDefinitions.findIndex(step => kycSteps[step.key] !== 1)
        : 0;
      return this.kycStepDefinitions.map((step, index) => {
        let state = 'todo';
        if (kycSteps && (status === 'Success' || kycSteps[step.key] === 1)) state = 'done';
        else if (kycSteps && index === firstOpen) state = stopped ? 'failed' : (status === 'Pending' ? 'current' : 'todo');
        return { ...step, state };
      });
    },

    getStepSummary(kycSteps) {
      const states = this.getStepStates(kycSteps);
      const total = states.length;
      const done = states.filter(step => step.state === 'done').length;
      const failed = states.find(step => step.state === 'failed');
      const current = states.find(step => step.state === 'current');
      const count = `${done} of ${total} steps`;
      if (!kycSteps) return { count, text: 'Not started', tone: 'muted' };
      if (failed) return { count, text: `${this.getKycStatusText(kycSteps)} at ${failed.label}`, tone: 'danger' };
      if (['Failed', 'Failure', 'Expired'].includes(kycSteps.status)) return { count, text: this.getKycStatusText(kycSteps), tone: 'danger' };
      if (done === total) return { count, text: 'All steps complete', tone: 'success' };
      if (current) return { count, text: `At ${current.label}`, tone: 'info' };
      return { count, text: this.getKycStatusText(kycSteps), tone: 'muted' };
    },

    getInitials(name) {
      if (!name) return '??';
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    },

    getUboStatusClass(status) {
      const classMap = {
        'verified': 'status-verified',
        'pending': 'status-pending',
        'rejected': 'status-rejected'
      };
      return classMap[status] || 'status-pending';
    },

    getStatusBadgeClass(status) {
      const classMap = {
        'verified': 'status-approved',
        'pending': 'status-inprogress',
        'rejected': 'status-rejected'
      };
      return classMap[status] || 'status-inprogress';
    },

    getStatusIcon(status) {
      const iconMap = {
        'verified': 'fas fa-check-circle',
        'pending': 'fas fa-clock',
        'rejected': 'fas fa-times-circle'
      };
      return iconMap[status] || 'fas fa-clock';
    },

    getStatusText(status) {
      const textMap = {
        'verified': 'Verified',
        'pending': 'Pending',
        'rejected': 'Rejected'
      };
      return textMap[status] || 'Pending';
    },

    getUboProgress(ubo) {
      if (!ubo.kycSteps) return 0;

      const steps = ['step_start', 'step_liveliness', 'step_ocrIdVerification', 'step_userConsent', 'step_finish'];
      let completedSteps = 0;

      // Count completed steps (value = 1)
      steps.forEach(step => {
        if (ubo.kycSteps[step] === 1) {
          completedSteps++;
        }
      });

      return Math.round((completedSteps / steps.length) * 100);
    },

    getStepStatus(stepName, kycSteps) {
      if (!kycSteps) return 'not-started';

      // Map frontend step names to backend property names
      const stepMapping = {
        'start': 'step_start',
        'liveliness': 'step_liveliness',
        'document': 'step_ocrIdVerification',
        'consent': 'step_userConsent',
        'finish': 'step_finish'
      };

      const stepProperty = stepMapping[stepName];
      if (!stepProperty || !(stepProperty in kycSteps)) return 'not-started';

      // 1 = completed, 0 = not started/failed
      if (kycSteps[stepProperty] === 1) {
        return 'completed';
      } else if (kycSteps[stepProperty] === 0 && kycSteps.status === 'Pending') {
        // If status is pending and step is 0, it might be in progress
        return 'in-progress';
      }

      return 'not-started';
    },

    getStepStatusIcon(stepName, kycSteps) {
      const status = this.getStepStatus(stepName, kycSteps);
      const iconMap = {
        'completed': 'fas fa-check-circle text-green-600',
        'in-progress': 'fas fa-clock text-yellow-600',
        'not-started': 'fas fa-circle text-gray-400'
      };
      return iconMap[status] || 'fas fa-circle text-gray-400';
    },

    isStepCompleted(stepName, kycSteps) {
      if (!kycSteps) return false;

      const stepMapping = {
        'start': 'step_start',
        'liveliness': 'step_liveliness',
        'document': 'step_ocrIdVerification',
        'consent': 'step_userConsent',
        'finish': 'step_finish'
      };

      const stepProperty = stepMapping[stepName];
      if (!stepProperty) return false;

      return kycSteps[stepProperty] === 1;
    },

    isStepInProgress(stepName, kycSteps) {
      if (!kycSteps) return false;

      const stepMapping = {
        'start': 'step_start',
        'liveliness': 'step_liveliness',
        'document': 'step_ocrIdVerification',
        'consent': 'step_userConsent',
        'finish': 'step_finish'
      };

      const stepProperty = stepMapping[stepName];
      if (!stepProperty) return false;

      // Consider it in progress if step is 0 but overall status is Pending
      return kycSteps[stepProperty] === 0 && kycSteps.status === 'Pending';
    },

    getKycStatusText(kycSteps) {
      if (!kycSteps) return 'Not Started';

      const statusTextMap = {
        'Success': 'Completed',
        'Pending': 'In Progress',
        'Failed': 'Failed',
        'Failure': 'Failed',
        'Expired': 'Expired'
      };

      return statusTextMap[kycSteps.status] || 'Unknown';
    },

    getKycStatusDetails(kycSteps) {
      if (!kycSteps) return null;

      const details = {
        retries: kycSteps.retries || 0,
        createdAt: kycSteps.createdAt,
        completedAt: kycSteps.completedAt,
        failureInfo: kycSteps.failureInfo
      };

      return details;
    },

    formatDate(dateString) {
      if (!dateString) return 'N/A';

      try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      } catch (error) {
        return 'N/A';
      }
    }
  }
}
</script>

<style scoped>
/* ── grid — one column, full-width horizontal cards ──── */
.ubo-grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* ── card shell ─────────────────────────────────────────── */
.detail-card {
  background-color: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: row;
  overflow: hidden;
  min-height: 0;
}

.clickable-card {
  cursor: pointer;
  transition: box-shadow 0.15s, transform 0.15s;
}

.clickable-card:hover {
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.05);
  transform: translateY(-1px);
}

.clickable-card.disabled {
  cursor: not-allowed;
  opacity: 0.65;
}

.clickable-card.disabled:hover {
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
  transform: none;
}

/* ── inner body ─────────────────────────────────────────── */
.card-body-inner {
  flex: 1;
  padding: 14px 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
}

/* ── top row: avatar + name + badge ─────────────────────── */
.card-top {
  display: flex;
  align-items: center;
  gap: 10px;
}

.ubo-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #e5e7eb;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  flex-shrink: 0;
}

.card-name {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.ubo-name {
  color: #4b5563;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ubo-role {
  font-size: 11px;
  color: #9ca3af;
}

/* ── status badges ──────────────────────────────────────── */
.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
  flex-shrink: 0;
}

.status-approved { background-color: #f0fdf4; color: #166534; }
.status-inprogress { background-color: #fef3c7; color: #92400e; }
.status-rejected { background-color: #fef2f2; color: #991b1b; }

/* ── meta row: key stats ─────────────────────────────────── */
/* Fixed column template so every UBO card lines its fields up in the same columns */
.card-meta {
  display: grid;
  gap: 8px 24px;
  grid-template-columns:
    minmax(0, 1fr)    /* Type */
    minmax(0, 1.2fr)  /* Designation */
    minmax(0, 2.2fr)  /* Email */
    minmax(0, 0.8fr)  /* Ownership */
    minmax(0, 0.7fr); /* Retries */
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}

.meta-label {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #9ca3af;
}

.meta-value {
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ── KYC step track: one segment per step ───────────────── */
.step-row {
  align-items: center;
  border-top: 1px solid #f3f4f6;
  display: flex;
  gap: 24px;
  padding-top: 10px;
}

.step-track {
  display: flex;
  flex: 1;
  gap: 4px;
  list-style: none;
  margin: 0;
  max-width: 520px;
  padding: 0;
}

.step-item {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 5px;
  min-width: 0;
}

.step-bar {
  background: #e2e8f0;
  border-radius: 3px;
  display: block;
  height: 6px;
}

.step-label {
  color: #64748b;
  font-size: 11px;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.step-item.is-done .step-bar { background: #16a34a; }
.step-item.is-done .step-label { color: #166534; }

.step-item.is-current .step-bar { background: #2563eb; }
.step-item.is-current .step-label { color: #1d4ed8; font-weight: 600; }

.step-item.is-failed .step-bar { background: #dc2626; }
.step-item.is-failed .step-label { color: #b91c1c; font-weight: 600; }

.sr-only {
  border: 0;
  clip: rect(0, 0, 0, 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
}

.step-summary {
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  font-size: 12px;
  gap: 1px;
  margin-left: auto;
  text-align: right;
}

.step-summary strong {
  color: #111827;
  font-weight: 600;
}

.summary-success { color: #166534; }
.summary-danger { color: #b91c1c; }
.summary-info { color: #1d4ed8; }
.summary-muted { color: #64748b; }

/* ── responsive ─────────────────────────────────────────── */
@media (max-width: 960px) {
  .card-meta {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 600px) {
  .step-row {
    align-items: stretch;
    flex-direction: column;
    gap: 8px;
  }

  .step-summary {
    margin-left: 0;
    text-align: left;
  }

  .card-meta {
    gap: 8px 12px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
