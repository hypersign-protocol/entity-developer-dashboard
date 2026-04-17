<template>
  <div class="ubo-details">

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-5 text-muted" style="font-size: 13px;">
      <i class="fas fa-spinner fa-spin mr-2"></i>Loading UBO details...
    </div>

    <!-- Individual UBO Cards -->
    <div v-else-if="ubos && ubos.length > 0" class="ubo-grid">
      <div
        v-for="(ubo, index) in ubos"
        :key="index"
        class="detail-card clickable-card"
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
              <span class="meta-value">{{ ubo.email || 'N/A' }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Ownership</span>
              <span class="meta-value">{{ ubo.ownershipPercentage }}%</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Progress</span>
              <span class="meta-value">{{ getUboProgress(ubo) }}%</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Retries</span>
              <span class="meta-value">{{ ubo.kycSteps?.retries ?? 'N/A' }}</span>
            </div>
          </div>

          <!-- Bottom: KYC step track -->
          <div class="step-track">
            <div class="step-item" :class="{ done: isStepCompleted('start', ubo.kycSteps) }">
              <div class="step-dot" title="Session Started"><i class="fas fa-flag"></i></div>
              <span class="step-label">Start</span>
            </div>
            <div class="step-line" :class="{ done: isStepCompleted('start', ubo.kycSteps) }"></div>
            <div class="step-item" :class="{ done: isStepCompleted('liveliness', ubo.kycSteps) }">
              <div class="step-dot" title="Liveness Check"><i class="fas fa-user"></i></div>
              <span class="step-label">Liveness</span>
            </div>
            <div class="step-line" :class="{ done: isStepCompleted('liveliness', ubo.kycSteps) }"></div>
            <div class="step-item" :class="{ done: isStepCompleted('document', ubo.kycSteps) }">
              <div class="step-dot" title="Document Verification"><i class="fas fa-id-card"></i></div>
              <span class="step-label">Document</span>
            </div>
            <div class="step-line" :class="{ done: isStepCompleted('document', ubo.kycSteps) }"></div>
            <div class="step-item" :class="{ done: isStepCompleted('consent', ubo.kycSteps) }">
              <div class="step-dot" title="User Consent"><i class="fas fa-check-square"></i></div>
              <span class="step-label">Consent</span>
            </div>
            <div class="step-line" :class="{ done: isStepCompleted('consent', ubo.kycSteps) }"></div>
            <div class="step-item" :class="{ done: isStepCompleted('finish', ubo.kycSteps) }">
              <div class="step-dot" title="Completed"><i class="fas fa-check"></i></div>
              <span class="step-label">Done</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="detail-card p-5 text-center">
      <div style="font-size: 2rem; color: #9ca3af; margin-bottom: 12px;">
        <i class="fas fa-users"></i>
      </div>
      <h6 class="font-weight-bold text-dark mb-1">No UBO Information</h6>
      <p class="text-muted small mb-0">No Ultimate Beneficial Owner information has been provided for this business yet.</p>
    </div>

  </div>
</template>
<script>
export default {
  name: "UboDetails",
  props: {
    company: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      loading: false,
    };
  },
  watch: {
    'company.id': {
      async handler(newId, oldId) {
        if (newId !== oldId) {
          // Clear stale data from previous company immediately
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
      const companyId = this.company?.id;
      if (companyId && ubo?.emailHash) {
        this.$router.push(`/studio/sessions/${companyId}/${ubo.emailHash}`);
      }
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
.card-meta {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 1px;
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
  word-break: break-all;
}

/* ── KYC step track ─────────────────────────────────────── */
.step-track {
  display: flex;
  align-items: center;
  padding-top: 8px;
  border-top: 1px solid #f3f4f6;
}

.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  flex-shrink: 0;
}

.step-dot {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  background: #f3f4f6;
  border: 2px solid #e5e7eb;
  color: #d1d5db;
  transition: all 0.2s;
}

.step-item.done .step-dot {
  background: #6b7280;
  border-color: #6b7280;
  color: #fff;
}

.step-label {
  font-size: 9px;
  font-weight: 500;
  color: #d1d5db;
  letter-spacing: 0.02em;
}

.step-item.done .step-label {
  color: #646e7d;
}

.step-line {
  flex: 1;
  height: 2px;
  background: #e5e7eb;
  border-radius: 1px;
  margin: 0 2px;
  margin-bottom: 14px;
  transition: background 0.2s;
}

.step-line.done {
  background: #6b7280;
}

/* ── responsive ─────────────────────────────────────────── */
@media (max-width: 600px) {
  .card-meta {
    gap: 12px;
  }
}
</style>
