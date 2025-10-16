<template>
  <div class="ubo-details">

    <!-- Ownership Structure Chart (moved to top) -->
    <div class="ownership-structure" v-if="ubos && ubos.length > 0">
      <h3 class="structure-title">Ownership Structure</h3>
      <div class="structure-chart">
        <div class="company-node">
          <div class="node-icon">
            <i class="fas fa-building"></i>
          </div>
          <span class="node-label">{{ company?.companyName || 'Company' }}</span>
        </div>
        <div class="ownership-lines">
          <div v-for="(ubo, index) in ubos" :key="index" class="ownership-line">
            <div class="line"></div>
            <div class="ubo-node" :class="getUboStatusClass(ubo.status)" @click="navigateToVerificationDetails(ubo)">
              <div class="node-avatar">{{ getInitials(ubo.name) }}</div>
              <span class="node-label">{{ ubo.name }}</span>
              <span class="node-percentage">{{ ubo.ownershipPercentage }}%</span>
              <span class="node-role">{{ ubo.role }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner">
        <i class="fas fa-spinner fa-spin"></i>
      </div>
      <p class="loading-text">Loading UBO details...</p>
    </div>

    <!-- Individual UBO Cards -->
    <div v-if="!loading && ubos && ubos.length > 0" class="info-grid">
      <div v-for="(ubo, index) in ubos" :key="index" class="info-card ubo-card clickable-card"
        @click="navigateToVerificationDetails(ubo)">
        <h3 class="card-title">
          <div class="ubo-avatar-title">
            {{ getInitials(ubo.name) }}
          </div>
          {{ ubo.name }}
          <div class="title-status">
            <span class="status-badge" :class="getStatusBadgeClass(ubo.status)">
              <i :class="getStatusIcon(ubo.status)"></i>
              {{ getKycStatusText(ubo.kycSteps) }}
            </span>
          </div>
        </h3>

        <div class="info-rows">
          <div class="info-row">
            <span class="label">Type:</span>
            <span class="value">{{ ubo.type }}</span>
          </div>
          <div class="info-row">
            <span class="label">Designation:</span>
            <span class="value">{{ ubo.designation }}</span>
          </div>
          <div class="info-row">
            <span class="label">Ownership:</span>
            <span class="value">{{ ubo.ownershipPercentage }}%</span>
          </div>
          <div class="info-row">
            <span class="label">Email:</span>
            <span class="value mono">{{ ubo.email }}</span>
          </div>
          <div class="info-row">
            <span class="label">Progress:</span>
            <span class="value">{{ getUboProgress(ubo) }}%</span>
          </div>
          <div  class="info-row">
            <span class="label">Retries:</span>
            <span class="value">{{ ubo.kycSteps?.retries ?? 'N/A' }}</span>
          </div>
        </div>

        <!-- KYC Verification Steps - Horizontal Icons -->
        <div class="verification-steps-horizontal">

          <div class="steps-icons-horizontal">
            <div class="step-icon-horizontal" :class="{ completed: isStepCompleted('start', ubo.kycSteps) }"
              :title="'Verification Started'">
              <i class="fas fa-flag"></i>
            </div>

            <div class="step-connector" :class="{ active: isStepCompleted('start', ubo.kycSteps) }"></div>

            <div class="step-icon-horizontal" :class="{ completed: isStepCompleted('liveliness', ubo.kycSteps) }"
              :title="'Liveliness Check'">
              <i class="fas fa-user"></i>
            </div>

            <div class="step-connector" :class="{ active: isStepCompleted('liveliness', ubo.kycSteps) }"></div>

            <div class="step-icon-horizontal" :class="{ completed: isStepCompleted('document', ubo.kycSteps) }"
              :title="'Document Verification'">
              <i class="fas fa-id-card"></i>
            </div>

            <div class="step-connector" :class="{ active: isStepCompleted('document', ubo.kycSteps) }"></div>

            <div class="step-icon-horizontal" :class="{ completed: isStepCompleted('consent', ubo.kycSteps) }"
              :title="'User Consent'">
              <i class="fas fa-check-square"></i>
            </div>

            <div class="step-connector" :class="{ active: isStepCompleted('consent', ubo.kycSteps) }"></div>

            <div class="step-icon-horizontal" :class="{ completed: isStepCompleted('finish', ubo.kycSteps) }"
              :title="'Verification Complete'">
              <i class="fas fa-check"></i>
            </div>
          </div>
        </div>
      </div>
    </div>


    <!-- Empty State -->
    <div v-else-if="!loading" class="empty-state">
      <div class="empty-icon">
        <i class="fas fa-users"></i>
      </div>
      <h3 class="empty-title">No UBO Information</h3>
      <p class="empty-description">
        No Ultimate Beneficial Owner information has been provided for this business yet.
      </p>
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
  async mounted() {
    if (this.company && this.company.id) {
      await this.fetchUbos();
    }
  },
  watch: {
    'company.id': {
      handler(newId) {
        if (newId) {
          this.fetchUbos();
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
.ubo-details {
  max-width: 1200px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
}

.section-header {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.5rem 0;
}

.section-description {
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0;
  line-height: 1.5;
}

/* Ownership Structure (moved to top) */
.ownership-structure {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: none;
}

.structure-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.structure-title::before {
  content: '';
  width: 4px;
  height: 1.125rem;
  background: #3b82f6;
  border-radius: 2px;
}

.structure-chart {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.company-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: #f8fafc;
  border: 2px solid #3b82f6;
  border-radius: 12px;
  min-width: 150px;
}

.node-icon {
  width: 2.5rem;
  height: 2.5rem;
  background: #3b82f6;
  color: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.125rem;
}

.node-label {
  font-weight: 600;
  color: #111827;
  text-align: center;
  font-size: 0.875rem;
}

.ownership-lines {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  width: 100%;
}

.ownership-line {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  min-width: 140px;
}

.line {
  width: 2px;
  height: 2rem;
  background: #d1d5db;
  position: relative;
}

.line::before {
  content: '';
  position: absolute;
  top: -4px;
  left: -3px;
  width: 8px;
  height: 8px;
  background: #d1d5db;
  border-radius: 50%;
}

.ubo-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.75rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  transition: all 0.2s ease;
  text-align: center;
  cursor: pointer;
}

.ubo-node:hover {
  border-color: #66666a;
  box-shadow: 0 4px 12px rgba(102, 102, 106, 0.15);
}

.ubo-node.status-verified {
  border-color: #10b981;
  background: #f0fdf4;
}

.ubo-node.status-pending {
  border-color: #f59e0b;
  background: #fffbeb;
}

.ubo-node.status-rejected {
  border-color: #ef4444;
  background: #fef2f2;
}

.node-avatar {
  width: 2rem;
  height: 2rem;
  background: #e5e7eb;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  color: #374151;
}

.node-percentage {
  font-size: 0.75rem;
  font-weight: 600;
  color: #3b82f6;
}

.node-role {
  font-size: 0.625rem;
  color: #6b7280;
}

/* Single UBO Overview Card */
.ubo-overview-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

/* Progress Section */
.card-footer {
  padding: 1rem;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
}

.progress-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.progress-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
}

.progress-percentage {
  font-size: 1rem;
  font-weight: 700;
  color: #3b82f6;
}

.progress-bar {
  width: 100%;
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #1d4ed8);
  border-radius: 2px;
  transition: width 0.3s ease;
}

.progress-details {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.progress-step {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #6b7280;
}

.progress-step.completed {
  color: #16a34a;
}

.progress-step.active {
  color: #d97706;
}

.progress-step.error {
  color: #dc2626;
}

.card-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

/* Loading State */
.loading-state {
  text-align: center;
  padding: 3rem 1rem;
}

.loading-spinner {
  font-size: 2rem;
  color: #66666a;
  margin-bottom: 1rem;
}

.loading-text {
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.empty-icon {
  font-size: 2.5rem;
  color: #9ca3af;
  margin-bottom: 1rem;
}

.empty-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.5rem 0;
}

.empty-description {
  color: #6b7280;
  margin: 0;
  line-height: 1.5;
}

/* Responsive Design */
@media (max-width: 768px) {
  .progress-details {
    flex-direction: column;
    gap: 0.5rem;
  }

  .ownership-lines {
    flex-direction: column;
    align-items: center;
  }

  .ownership-line {
    width: 100%;
    max-width: 200px;
  }
}

@media (max-width: 480px) {
  .view-details-btn {
    width: 100%;
    justify-content: center;
  }
}

/* Info Grid Layout - Smaller cards for many shareholders */
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 0.75rem;
}

.info-card {
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.info-card.ubo-card {
  transition: all 0.3s ease;
}

.info-card.ubo-card.clickable-card {
  cursor: pointer;
}

.info-card.ubo-card:hover {
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  transform: translateY(-1px);
}

.info-card.ubo-card.clickable-card:hover {
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
  /* border-color: #3b82f6; */
}

.card-title {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.75rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #f3f4f6;
}

.ubo-avatar-title {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #66666a;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.625rem;
  flex-shrink: 0;
}

.title-status {
  margin-left: auto;
}

.info-rows {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 0.75rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.25rem;
  gap: 0.75rem;
}

.info-row:last-child {
  margin-bottom: 0;
}

.label {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
  flex-shrink: 0;
  min-width: 80px;
}

.value {
  font-size: 0.75rem;
  color: #111827;
  font-weight: 500;
  text-align: right;
  word-wrap: break-word;
}

.value.mono {
  font-family: 'Courier New', monospace;
  font-size: 0.625rem;
  color: #4b5563;
}

/* Status badges - Smaller size */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.625rem;
  font-weight: 600;
  text-transform: capitalize;
}

.status-inprogress {
  background: #fef3c7;
  color: #92400e;
}

.status-approved {
  background: #d1fae5;
  color: #065f46;
}

.status-rejected {
  background: #fee2e2;
  color: #991b1b;
}

/* Horizontal Verification Steps - Smaller */
.verification-steps-horizontal {
  padding: 0.5rem;
  margin-bottom: -0.75rem;



}

.no-kyc-horizontal {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
}

.no-kyc-text {
  color: #6b7280;
  font-size: 0.75rem;
  font-weight: 500;
}

.steps-icons-horizontal {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.25rem;
  padding: 0.25rem 0;
}

.step-icon-horizontal {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  background-color: #f3f4f6;
  border: 2px solid #e5e7eb;
  color: #9ca3af;
  transition: all 0.3s ease;
  cursor: help;
  flex-shrink: 0;
}

.step-icon-horizontal.completed {
  background-color: #10b981;
  border-color: #059669;
  color: white;
  box-shadow: 0 1px 3px rgba(16, 185, 129, 0.3);
}

.step-icon-horizontal:hover {
  transform: scale(1.05);
}

.step-connector {
  flex: 1;
  height: 2px;
  background-color: #e5e7eb;
  border-radius: 1px;
  transition: all 0.3s ease;
  margin: 0 0.125rem;
}

.step-connector.active {
  background-color: #10b981;
  box-shadow: 0 1px 2px rgba(16, 185, 129, 0.3);
}

/* Responsive Design */
@media (max-width: 768px) {
  .info-grid {
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 0.5rem;
  }

  .info-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.125rem;
  }

  .value {
    text-align: left;
  }

  .card-title {
    flex-wrap: wrap;
    gap: 0.5rem;
    font-size: 0.8rem;
  }

  .title-status {
    margin-left: 0;
  }

  .steps-icons-horizontal {
    padding: 0.125rem 0;
  }

  .step-icon-horizontal {
    width: 24px;
    height: 24px;
    font-size: 0.625rem;
  }

  .step-connector {
    margin: 0 0.0625rem;
    height: 1px;
  }

  .info-card {
    padding: 0.5rem;
  }

  .verification-steps-horizontal {
    padding: 0.375rem;
    margin-bottom: 0.5rem;
  }
}

@media (max-width: 480px) {
  .info-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }

  .step-icon-horizontal {
    width: 20px;
    height: 20px;
    font-size: 0.5rem;
  }
}

/* Overall Progress Summary */
.overall-progress-summary {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.summary-header {
  margin-bottom: 1.5rem;
}

.summary-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.summary-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 8px;
}

.stat-item.verified {
  background-color: #f0fdf4;
  border: 1px solid #bbf7d0;
}

.stat-item.pending {
  background-color: #fffbeb;
  border: 1px solid #fde68a;
}

.stat-item.rejected {
  background-color: #fef2f2;
  border: 1px solid #fecaca;
}

.stat-icon {
  font-size: 1.25rem;
}

.stat-item.verified .stat-icon {
  color: #059669;
}

.stat-item.pending .stat-icon {
  color: #d97706;
}

.stat-item.rejected .stat-icon {
  color: #dc2626;
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  line-height: 1;
}

.stat-label {
  color: #6b7280;
  font-size: 0.75rem;
  font-weight: 500;
}

.summary-progress {
  margin-top: 1rem;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.progress-label {
  font-weight: 500;
  color: #111827;
  font-size: 0.875rem;
}

.progress-percentage {
  font-weight: 600;
  color: #3b82f6;
  font-size: 0.875rem;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background-color: #f3f4f6;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 4px;
  transition: width 0.3s ease;
}

/* Utility Classes */
.text-green-600 {
  color: #059669;
}

.text-yellow-600 {
  color: #d97706;
}

.text-gray-400 {
  color: #9ca3af;
}

/* Responsive Design */
@media (max-width: 768px) {
  .ubos-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .ubo-card {
    padding: 1rem;
  }

  .ubo-card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .summary-stats {
    grid-template-columns: 1fr;
  }
}

.ubos-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.ubo-card {
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.ubo-card:hover {
  border-color: #66666a;
  box-shadow: 0 4px 12px rgba(102, 102, 106, 0.15);
}

.ubo-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.ubo-avatar {
  flex-shrink: 0;
}

.avatar-placeholder {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background-color: #f3f4f6;
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3b82f6;
  font-weight: 600;
  font-size: 1rem;
}

.ubo-info {
  flex: 1;
}

.ubo-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.25rem 0;
}

.ubo-role {
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0 0 0.5rem 0;
}

.ownership-percentage {
  display: inline-block;
  background-color: #f3f4f6;
  color: #6b7280;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
}

.ubo-status {
  flex-shrink: 0;
}

/* Status badges */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: capitalize;
}

.status-verified {
  background-color: #f0fdf4;
  color: #16a34a;
}

.status-pending {
  background-color: #fffbeb;
  color: #d97706;
}

.status-rejected {
  background-color: #fef2f2;
  color: #dc2626;
}

.text-green-600 {
  color: #16a34a;
}

.text-red-600 {
  color: #dc2626;
}

/* UBO Details Grid */
.ubo-details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.detail-section {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem;
  background-color: white;
}

.detail-section.full-width {
  grid-column: 1 / -1;
}

.section-subtitle {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.75rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.detail-rows {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.detail-label {
  font-weight: 500;
  color: #6b7280;
  flex-shrink: 0;
  min-width: 100px;
}

.detail-value {
  color: #111827;
  font-weight: 500;
  text-align: right;
  word-break: break-word;
}



.ownership-badge {
  background-color: #f3f4f6;
  color: #6b7280;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
}

/* Ownership Structure */
.ownership-structure {
  background-color: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  padding: 1.5rem;
  margin-top: 1.5rem;
}

.structure-title {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1rem 0;
  text-align: center;
}

.structure-chart {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.company-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.node-icon {
  width: 4rem;
  height: 4rem;
  border-radius: 0.5rem;
  background-color: #3b82f6;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}

.node-label {
  font-weight: 600;
  color: #111827;
  text-align: center;
}

.ownership-lines {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
}

.ownership-line {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.line {
  width: 2px;
  height: 2rem;
  background-color: #d1d5db;
}

.ubo-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.node-avatar {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background-color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
}

.node-percentage {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
}

/* Responsive Design */
@media (max-width: 768px) {
  .ubo-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .ubo-details-grid {
    grid-template-columns: 1fr;
  }

  .detail-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }

  .detail-value {
    text-align: left;
  }

  .ownership-lines {
    flex-direction: column;
    align-items: center;
  }
}
</style>