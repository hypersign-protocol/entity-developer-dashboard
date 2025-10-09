<template>
  <div class="ubo-details">
    <div class="section-header">
      <h2 class="section-title">UBO Details</h2>
      <p class="section-description">Ultimate Beneficial Owner information and ownership structure</p>
    </div>

    <!-- UBO Overview -->
    <div class="ubo-overview">
      <div class="overview-card">
        <div class="overview-icon">
          <i class="fas fa-users"></i>
        </div>
        <div class="overview-info">
          <h3 class="overview-title">Total UBOs</h3>
          <span class="overview-count">{{ ubos.length }}</span>
        </div>
      </div>
      <div class="overview-card">
        <div class="overview-icon verified">
          <i class="fas fa-check-circle"></i>
        </div>
        <div class="overview-info">
          <h3 class="overview-title">Verified</h3>
          <span class="overview-count">{{ verifiedUbos }}</span>
        </div>
      </div>
      <div class="overview-card">
        <div class="overview-icon pending">
          <i class="fas fa-clock"></i>
        </div>
        <div class="overview-info">
          <h3 class="overview-title">Pending</h3>
          <span class="overview-count">{{ pendingUbos }}</span>
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

    <!-- UBOs List -->
    <div v-if="!loading && ubos && ubos.length > 0" class="ubos-list">
      <div v-for="(ubo, index) in ubos" :key="index" class="ubo-card">
        <div class="ubo-header">
          <div class="ubo-avatar">
            <div class="avatar-placeholder">
              {{ getInitials(ubo.name) }}
            </div>
          </div>
          <div class="ubo-info">
            <h3 class="ubo-name">{{ ubo.name }}</h3>
            <p class="ubo-role">{{ ubo.role }}</p>
            <span class="ownership-percentage">{{ ubo.ownershipPercentage }}% ownership</span>
          </div>
          <div class="ubo-status">
            <span class="status-badge" :class="getUboStatusClass(ubo.status)">
              <i :class="getUboStatusIcon(ubo.status)"></i>
              {{ ubo.status }}
            </span>
          </div>
        </div>

        <div class="ubo-details-grid">
          <div class="detail-section">
            <h4 class="section-subtitle">Personal Information</h4>
            <div class="detail-rows">
              <div class="detail-row">
                <span class="detail-label">Full Name:</span>
                <span class="detail-value">{{ ubo.name }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Email:</span>
                <span class="detail-value">{{ ubo.email || 'N/A' }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Type:</span>
                <span class="detail-value">{{ ubo.type }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Designation:</span>
                <span class="detail-value">{{ ubo.designation }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Mail Sent:</span>
                <span class="detail-value">
                  <span :class="ubo.mailSent ? 'text-green-600' : 'text-red-600'">
                    {{ ubo.mailSent ? 'Yes' : 'No' }}
                  </span>
                </span>
              </div>
            </div>
          </div>

          <div class="detail-section">
            <h4 class="section-subtitle">Ownership Information</h4>
            <div class="detail-rows">
              <div class="detail-row">
                <span class="detail-label">Ownership %:</span>
                <span class="detail-value">
                  <span class="ownership-badge">{{ ubo.ownershipPercentage }}%</span>
                </span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Role:</span>
                <span class="detail-value">{{ ubo.role }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Created:</span>
                <span class="detail-value">{{ formatDate(ubo.createdAt) }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Last Updated:</span>
                <span class="detail-value">{{ formatDate(ubo.updatedAt) }}</span>
              </div>
            </div>
          </div>

          <div class="detail-section full-width">
            <h4 class="section-subtitle">KYC Information</h4>
            <div class="detail-rows">
              <div class="detail-row" v-if="ubo.kycSteps">
                <span class="detail-label">KYC Status:</span>
                <span class="detail-value">
                  <span class="status-badge" :class="getUboStatusClass(ubo.status)">
                    {{ ubo.kycSteps.status }}
                  </span>
                </span>
              </div>
              <div class="detail-row" v-if="ubo.kycSteps && ubo.kycSteps.completedAt">
                <span class="detail-label">Completed At:</span>
                <span class="detail-value">{{ formatDate(ubo.kycSteps.completedAt) }}</span>
              </div>
              <div class="detail-row" v-if="ubo.kycSteps">
                <span class="detail-label">Retries:</span>
                <span class="detail-value">{{ ubo.kycSteps.retries || 0 }}</span>
              </div>
              <div class="detail-row" v-if="!ubo.kycSteps">
                <span class="detail-label">KYC Status:</span>
                <span class="detail-value">
                  <span class="status-badge status-pending">Not Started</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- UBO Documents -->
        <div class="ubo-documents" v-if="ubo.documents && ubo.documents.length > 0">
          <h4 class="section-subtitle">Supporting Documents</h4>
          <div class="documents-list">
            <div v-for="(doc, docIndex) in ubo.documents" :key="docIndex" class="document-item">
              <div class="document-icon">
                <i class="fas fa-file-alt"></i>
              </div>
              <div class="document-info">
                <span class="document-name">{{ doc.name }}</span>
                <span class="document-type">{{ doc.type }}</span>
              </div>
              <span class="document-status" :class="getDocumentStatusClass(doc.status)">
                {{ doc.status }}
              </span>
              <div class="document-actions">
                <button 
                  class="download-btn" 
                  @click="downloadDocument(doc)" 
                  title="Download Document"
                >
                  <i class="fas fa-download"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <div class="empty-icon">
        <i class="fas fa-users"></i>
      </div>
      <h3 class="empty-title">No UBO Information</h3>
      <p class="empty-description">
        No Ultimate Beneficial Owner information has been provided for this business yet.
      </p>
    </div>

    <!-- Ownership Structure Chart -->
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
            <div class="ubo-node">
              <div class="node-avatar">{{ getInitials(ubo.name) }}</div>
              <span class="node-label">{{ ubo.name }}</span>
              <span class="node-percentage">{{ ubo.ownershipPercentage }}%</span>
            </div>
          </div>
        </div>
      </div>
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
        documents: this.transformDocuments(ubo.documents || []),
        kycSteps: ubo.kycSteps,
        mailSent: ubo.mailSent
      }));
    },
    verifiedUbos() {
      return this.ubos.filter(ubo => ubo.status === 'verified').length;
    },
    pendingUbos() {
      return this.ubos.filter(ubo => ubo.status === 'pending').length;
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

    async downloadDocument(docData) {
      try {
        if (!docData.id) {
          return;
        }

        const blob = await this.$store.dispatch('mainStore/downloadKybUploadedFile', {
          fileId: docData.id
        });

        let fileName = docData.name || `document_${docData.id}`;
        
        if (!fileName.includes('.')) {
          if (blob.type === 'application/pdf') {
            fileName += '.pdf';
          } else if (blob.type.startsWith('image/')) {
            const ext = blob.type.split('/')[1];
            fileName += `.${ext}`;
          } else {
            fileName += '.pdf';
          }
        }

        const url = URL.createObjectURL(blob);
        const a = window.document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.style.display = 'none';
        
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        URL.revokeObjectURL(url);
        
      } catch (error) {
        console.error('Error downloading document:', error);
      }
    },

    getUboStatus(kycSteps) {
      if (!kycSteps) return 'pending';
      
      const statusMap = {
        'Success': 'verified',
        'Pending': 'pending',
        'Failed': 'rejected',
        'Failure': 'rejected'
      };
      return statusMap[kycSteps.status] || 'pending';
    },

    transformDocuments(documents) {
      return documents.map(doc => ({
        name: doc.fileName,
        type: this.formatDocumentType(doc.documentType),
        status: 'pending',
        id: doc.id
      }));
    },

    formatDocumentType(documentType) {
      const typeMap = {
        'PowerOfAttorney': 'Power of Attorney',
        'CertificateOfIncorporation': 'Certificate of Incorporation',
        'ProofOfAddress': 'Proof of Address'
      };
      return typeMap[documentType] || documentType;
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

    getUboStatusIcon(status) {
      const iconMap = {
        'verified': 'fas fa-check-circle',
        'pending': 'fas fa-clock',
        'rejected': 'fas fa-times-circle'
      };
      return iconMap[status] || 'fas fa-clock';
    },

    getDocumentStatusClass(status) {
      const classMap = {
        'verified': 'doc-verified',
        'pending': 'doc-pending',
        'rejected': 'doc-rejected'
      };
      return classMap[status] || 'doc-pending';
    },

    formatDate(dateString) {
      if (!dateString) return 'N/A';
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    },


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

/* UBO Overview */
.ubo-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
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
  background-color: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3b82f6;
  font-size: 20px;
}

.overview-icon.verified {
  background-color: #f0fdf4;
  color: #16a34a;
  border-color: #bbf7d0;
}

.overview-icon.pending {
  background-color: #fffbeb;
  color: #d97706;
  border-color: #fed7aa;
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

/* UBO Cards */
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
  border-color: #3b82f6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
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

/* UBO Documents */
.ubo-documents {
  border-top: 1px solid #e5e7eb;
  padding-top: 1rem;
}

.documents-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.document-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background-color: #f9fafb;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}

.document-icon {
  color: #6b7280;
}

.document-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.document-name {
  font-weight: 500;
  color: #111827;
  font-size: 0.875rem;
}

.document-type {
  color: #6b7280;
  font-size: 0.75rem;
}

.document-status {
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: capitalize;
}

.doc-verified {
  background-color: #f0fdf4;
  color: #16a34a;
}

.doc-pending {
  background-color: #fffbeb;
  color: #d97706;
}

.doc-rejected {
  background-color: #fef2f2;
  color: #dc2626;
}

/* Document Actions */
.document-actions {
  display: flex;
  gap: 0.5rem;
}

.download-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #6b7280;
  font-size: 0.875rem;
}

.download-btn:hover:not(:disabled) {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
}

.download-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}



/* Loading State */
.loading-state {
  text-align: center;
  padding: 2rem;
}

.loading-spinner {
  font-size: 1.5rem;
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
  text-align: center;
  padding: 2rem;
}

.empty-icon {
  font-size: 2rem;
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
  margin: 0 0 1.5rem 0;
  line-height: 1.5;
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