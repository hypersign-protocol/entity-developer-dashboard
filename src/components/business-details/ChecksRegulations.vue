<template>
  <div class="checks-regulations">


    <!-- Loading State -->
    <div v-if="isLoading" class="loading-state">
      <div class="loading-spinner">
        <i class="fas fa-spinner fa-spin"></i>
      </div>
      <p class="loading-text">Loading compliance data...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="!getComplianceData" class="empty-state">
      <div class="empty-icon">
        <i class="fas fa-shield-alt"></i>
      </div>
      <h3 class="empty-title">No Compliance Data Available</h3>
      <p class="empty-description">Compliance checks have not been performed for this company yet.</p>
    </div>

    <!-- Content when data is available -->
    <div v-else>
      <!-- Compliance Overview -->
    <div class="compliance-overview">
      <div class="overview-card passed">
        <div class="overview-icon">
          <i class="fas fa-check-circle"></i>
        </div>
        <div class="overview-info">
          <h3 class="overview-title">Checks Passed</h3>
          <span class="overview-count">{{ passedChecks }}</span>
        </div>
      </div>
      <div class="overview-card failed">
        <div class="overview-icon">
          <i class="fas fa-times-circle"></i>
        </div>
        <div class="overview-info">
          <h3 class="overview-title">Checks Failed</h3>
          <span class="overview-count">{{ failedChecks }}</span>
        </div>
      </div>
      <div class="overview-card pending">
        <div class="overview-icon">
          <i class="fas fa-clock"></i>
        </div>
        <div class="overview-info">
          <h3 class="overview-title">Pending Checks</h3>
          <span class="overview-count">{{ pendingChecks }}</span>
        </div>
      </div>
      <div class="overview-card total">
        <div class="overview-icon">
          <i class="fas fa-shield-alt"></i>
        </div>
        <div class="overview-info">
          <h3 class="overview-title">Total Checks</h3>
          <span class="overview-count">{{ complianceChecks.length }}</span>
        </div>
      </div>
    </div>

    <!-- Compliance Checks List -->
    <div class="compliance-checks">
      <div class="checks-list">
        <div v-for="(check, index) in complianceChecks" :key="index" class="check-card">
          <div class="check-header">
            <div class="check-icon" :class="getCheckStatusClass(check.status)">
              <i :class="getCheckStatusIcon(check.status)"></i>
            </div>
            <div class="check-info">
              <h4 class="check-name">{{ check.name }}</h4>
              <p class="check-description">{{ check.description }}</p>
            </div>
            <div class="check-status">
              <span class="status-badge" :class="getCheckStatusBadgeClass(check.status)">
                {{ check.status }}
              </span>
            </div>
          </div>

          <div class="check-details">
            <div class="detail-grid">
              <div class="detail-item">
                <span class="detail-label">Check Type:</span>
                <span class="detail-value">{{ check.type }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Last Run:</span>
                <span class="detail-value">{{ formatDate(check.lastRun) }}</span>
              </div>
            </div>

            <!-- Check Results -->
            <div class="check-results" v-if="check.results">
              <h5 class="results-title">Check Results</h5>
              <div class="results-content">
                <div v-if="check.status === 'failed' && check.results.issues" class="issues-list">
                  <h6 class="issues-title">Issues Found:</h6>
                  <div v-for="(issue, issueIndex) in check.results.issues" :key="issueIndex" class="issue-item">
                    <i class="fas fa-exclamation-triangle"></i>
                    <div class="issue-content" v-html="renderMarkdown(issue)"></div>
                  </div>
                </div>
                <div v-if="check.results.notes" class="notes">
                  <h6 class="notes-title">Additional Notes:</h6>
                  <p class="notes-content">{{ check.results.notes }}</p>
                </div>
                <div v-if="check.results.recommendations" class="recommendations">
                  <h6 class="recommendations-title">Recommendations:</h6>
                  <ul class="recommendations-list">
                    <li v-for="(rec, recIndex) in check.results.recommendations" :key="recIndex" class="recommendation-item">
                      <i class="fas fa-lightbulb"></i>
                      {{ rec }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div> <!-- End of content wrapper -->
  </div>
</template>

<script>
import { marked } from 'marked';
import { mapGetters, mapActions } from 'vuex';
import config from '../../config.js';

export default {
  name: "ChecksRegulations",
  props: {
    company: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      isLoading: false
    }
  },
  computed: {
    ...mapGetters('mainStore', ['getComplianceData']),
    
    complianceChecks() {
      const complianceData = this.getComplianceData;
      if (!complianceData) return [];

      const checks = [];

      // Registry Check
      if (complianceData.registryCheck) {
        const isSuccess = complianceData.registryCheck.status === 'Success';
        checks.push({
          name: "Business Registry Verification",
          description: "Verify business registration in official government registry",
          type: "Registry Check",
          status: this.formatStatus(complianceData.registryCheck.status),
          lastRun: complianceData.registryCheck.updatedAt,
          results: {
            reason: complianceData.registryCheck.reason,
            reasonDetail: complianceData.registryCheck.reasonDetail,
            notes: isSuccess 
              ? "Business successfully verified in official registry" 
              : complianceData.registryCheck.reasonDetail || "Registry verification failed",
            recommendations: isSuccess 
              ? config.COMPLIANCE_RECOMMENDATIONS.REGISTRY_CHECK.SUCCESS
              : config.COMPLIANCE_RECOMMENDATIONS.REGISTRY_CHECK.FAILED
          }
        });
      }

      // Sanctions List Check
      if (complianceData.sanctionListCheck) {
        const isSuccess = complianceData.sanctionListCheck.status === 'Success';
        checks.push({
          name: "Sanctions List Screening",
          description: "Screen against international sanctions lists",
          type: "Sanctions Check",
          status: this.formatStatus(complianceData.sanctionListCheck.status),
          lastRun: complianceData.sanctionListCheck.updatedAt,
          results: {
            reason: complianceData.sanctionListCheck.reason,
            reasonDetail: complianceData.sanctionListCheck.reasonDetail,
            notes: isSuccess 
              ? "No matches found in sanctions databases" 
              : complianceData.sanctionListCheck.reasonDetail || "Sanctions screening failed",
            recommendations: isSuccess 
              ? config.COMPLIANCE_RECOMMENDATIONS.SANCTIONS_CHECK.SUCCESS
              : config.COMPLIANCE_RECOMMENDATIONS.SANCTIONS_CHECK.FAILED
          }
        });
      }

      // Adverse Media Check
      if (complianceData.adverseMediaCheck) {
        const isSuccess = complianceData.adverseMediaCheck.status === 'Success';
        checks.push({
          name: "Adverse Media Screening",
          description: "Screen for negative media coverage and reputation risks",
          type: "Media Check",
          status: this.formatStatus(complianceData.adverseMediaCheck.status),
          lastRun: complianceData.adverseMediaCheck.updatedAt,
          results: {
            reason: complianceData.adverseMediaCheck.reason,
            reasonDetail: complianceData.adverseMediaCheck.reasonDetail,
            notes: isSuccess 
              ? "No adverse media coverage found" 
              : "Adverse media coverage detected",
            recommendations: isSuccess 
              ? config.COMPLIANCE_RECOMMENDATIONS.ADVERSE_MEDIA_CHECK.SUCCESS
              : config.COMPLIANCE_RECOMMENDATIONS.ADVERSE_MEDIA_CHECK.FAILED,
            issues: !isSuccess && complianceData.adverseMediaCheck.reasonDetail 
              ? [complianceData.adverseMediaCheck.reasonDetail] 
              : null
          }
        });
      }

      return checks;
    },
    
    passedChecks() {
      return this.complianceChecks.filter(check => check.status === 'passed').length;
    },
    failedChecks() {
      return this.complianceChecks.filter(check => check.status === 'failed').length;
    },
    pendingChecks() {
      return this.complianceChecks.filter(check => check.status === 'pending').length;
    }
  },
  
  async mounted() {
    if (this.company && this.company.companyId) {
      await this.fetchComplianceData();
    }
  },
  
  watch: {
    'company.companyId': {
      immediate: true,
      async handler(newCompanyId) {
        if (newCompanyId) {
          await this.fetchComplianceData();
        }
      }
    }
  },
  
  methods: {
    ...mapActions('mainStore', ['checkComplianceStatus']),
    
    async fetchComplianceData() {
      if (!this.company || !this.company.companyId) return;
      
      try {
        this.isLoading = true;
        await this.checkComplianceStatus({ companyId: this.company.companyId });
      } catch (error) {
        console.error('Error fetching compliance data:', error);
        // Handle error appropriately - could show toast notification
      } finally {
        this.isLoading = false;
      }
    },

    formatStatus(apiStatus) {
      const statusMap = {
        'Success': 'passed',
        'Failed': 'failed', 
        'Pending': 'pending'
      };
      return statusMap[apiStatus] || 'pending';
    },

    getCheckStatusClass(status) {
      const classMap = {
        'passed': 'check-passed',
        'failed': 'check-failed',
        'pending': 'check-pending'
      };
      return classMap[status] || 'check-pending';
    },

    getCheckStatusIcon(status) {
      const iconMap = {
        'passed': 'fas fa-check-circle',
        'failed': 'fas fa-times-circle',
        'pending': 'fas fa-clock'
      };
      return iconMap[status] || 'fas fa-clock';
    },

    getCheckStatusBadgeClass(status) {
      const badgeMap = {
        'passed': 'status-passed',
        'failed': 'status-failed',
        'pending': 'status-pending'
      };
      return badgeMap[status] || 'status-pending';
    },

    formatDate(dateString) {
      if (!dateString) return 'N/A';
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    },

    renderMarkdown(content) {
      if (!content) return '';
      marked.setOptions({
        breaks: true,
        gfm: true,
        sanitize: false
      });
      return marked(content);
    }
  }
}
</script>

<style scoped>
.checks-regulations {
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

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
}

.loading-spinner {
  font-size: 2rem;
  color: #3b82f6;
  margin-bottom: 1rem;
}

.loading-text {
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
}

.empty-icon {
  font-size: 3rem;
  color: #d1d5db;
  margin-bottom: 1rem;
}

.empty-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 0.5rem 0;
}

.empty-description {
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0;
  line-height: 1.5;
}

/* Compliance Overview */
.compliance-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
  display: none;
  margin-bottom: 2rem;
}

.overview-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.overview-card:hover {
  border-color: #3b82f6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

.overview-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  border: 1px solid #e5e7eb;
}

.passed .overview-icon {
  background-color: #f0fdf4;
  color: #16a34a;
  border-color: #bbf7d0;
}

.failed .overview-icon {
  background-color: #fef2f2;
  color: #dc2626;
  border-color: #fecaca;
}

.pending .overview-icon {
  background-color: #fffbeb;
  color: #d97706;
  border-color: #fed7aa;
}

.total .overview-icon {
  background-color: #f3f4f6;
  color: #3b82f6;
  border-color: #e5e7eb;
}

.overview-info {
  flex: 1;
}

.overview-title {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0 0 0.25rem 0;
  font-weight: 500;
}

.overview-count {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  line-height: 1;
}

/* Compliance Checks */
.compliance-checks {
  margin-bottom: 2rem;
}

.checks-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1rem 0;
}

.checks-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.check-card {
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.check-card:hover {
  border-color: #3b82f6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

.check-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
}

.check-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.check-passed {
  background-color: #f0fdf4;
  color: #16a34a;
}

.check-failed {
  background-color: #fef2f2;
  color: #dc2626;
}

.check-pending {
  background-color: #fffbeb;
  color: #d97706;
}

.check-info {
  flex: 1;
}

.check-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.5rem 0;
}

.check-description {
  color: #6b7280;
  margin: 0;
  line-height: 1.5;
}

.check-status {
  flex-shrink: 0;
}

/* Status badges */
.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: capitalize;
}

.status-passed {
  background-color: #f0fdf4;
  color: #16a34a;
}

.status-failed {
  background-color: #fef2f2;
  color: #dc2626;
}

.status-pending {
  background-color: #fffbeb;
  color: #d97706;
}

/* Check Details */
.check-details {
  border-top: 1px solid #e5e7eb;
  padding-top: 1rem;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.detail-label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.detail-value {
  font-weight: 600;
  color: #111827;
}

/* Check Results */
.check-results {
  background-color: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  padding: 1rem;
  margin-bottom: 1rem;
}

.results-title {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1rem 0;
}

.issues-title, .notes-title, .recommendations-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 0.5rem 0;
}

.issues-list {
  margin-bottom: 1rem;
}

.issue-item {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  color: #374151;
  font-size: 0.875rem;
  line-height: 1.5;
}

.issue-item i {
  color: #dc2626;
  margin-top: 0.125rem;
  padding: 20px;
  flex-shrink: 0;
  font-size: 1rem;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.issue-content {
  flex: 1;
}

/* Markdown content styling for issue details */
.issue-content p {
  margin: 0 0 0.5rem 0;
  line-height: 1.5;
}

.issue-content ul {
  margin: 0.5rem 0;
  padding-left: 1rem;
}

.issue-content li {
  margin-bottom: 0.25rem;
}

.issue-content a {
  color: #3b82f6;
  text-decoration: none;
}

.issue-content a:hover {
  text-decoration: underline;
}

.issue-content strong {
  font-weight: 600;
  color: #111827;
}

.notes-content {
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 0;
}

.recommendations-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.recommendation-item {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  color: #374151;
  font-size: 0.875rem;
  line-height: 1.5;
}

.recommendation-item i {
  color: #3b82f6;
  margin-top: 0.125rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .check-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .detail-grid {
    grid-template-columns: 1fr;
  }
}
</style>