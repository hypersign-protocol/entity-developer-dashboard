<template>
  <div class="business-information">
    <!-- <div class="section-header">
      <h2 class="section-title">Business Information</h2>
      <p class="section-description">Complete business details and registration information</p>
    </div> -->

    <div class="info-grid">
      <!-- Basic Information Card -->
      <div class="info-card">
        <h3 class="card-title">
          <i class="fas fa-building"></i>
          Basic Information
        </h3>
        <div class="info-rows">
          <div class="info-row">
            <span class="label">Company Name:</span>
            <span class="value">{{ company?.companyName || 'N/A' }}</span>
          </div>
          <div class="info-row">
            <span class="label">ID:</span>
            <span class="value mono id-with-copy">
              <span class="id-text">{{ company?.companyId || 'N/A' }}</span>

              <button
                v-if="company?.companyId"
                class="copy-btn btn btn-link p-0"
                @click="copyToClipboard(company.companyId)"
                title="Copy Company ID"
              >
                <i class="mdi mdi-content-copy" style="font-size:14px"></i>
              </button>

            </span>
            
          </div>
          <div class="info-row">
            <span class="label">Registration Number:</span>
            <span class="value mono">{{ company?.registrationNumber || 'N/A' }}</span>
          </div>

          <div class="info-row">
            <span class="label">Registration Type:</span>
            <span class="value">{{ company?.registrationNumberType || 'N/A' }}</span>
          </div>
          <div class="info-row">
            <span class="label">Representative:</span>
            <span class="value">{{ company?.representative || 'N/A' }}</span>
          </div>
          <div class="info-row">
            <span class="label">Domain:</span>
            <span class="value">{{ company?.domain || 'N/A' }}</span>
          </div>
          <div class="info-row">
            <span class="label">Country:</span>
            <span class="value">
             {{ countryCodeToName(company?.countryCode) || 'N/A' }}  {{ countryCodeToFlag(company?.countryCode) }} 
            </span>
          </div>
          <div class="info-row">
            <span class="label">Region:</span>
            <span class="value">{{ company?.region || 'N/A' }}</span>
          </div>
        </div>
      </div>



      <!-- Status Information -->
      <div class="info-card">
        <h3 class="card-title">
          <i class="fas fa-info-circle"></i>
          Timeline & Status
        </h3>
        <div class="info-rows">
          <div class="info-row">
            <span class="label">Current Status:</span>
            <span class="value">
              <span class="status-badge" :class="getStatusBadgeClass(company?.status)">
                <i :class="getCompanyStatusIcon(company?.status)"></i>
                {{ company?.status || 'N/A' }}
              </span>
            </span>
          </div>
          <div class="info-row">
            <span class="label">Created Date:</span>
            <span class="value">{{ formatDate(company?.createdAt) }}</span>
          </div>
          <div class="info-row">
            <span class="label">Last Updated:</span>
            <span class="value">{{ formatDate(company?.updatedAt) }}</span>
          </div>

        </div>
      </div>

      <!-- Address Information -->
      <div class="info-card" v-if="company?.address">
        <h3 class="card-title">
          <i class="fas fa-map-marker-alt"></i>
          Address Information
        </h3>
        <div class="info-rows">
          <div class="info-row">
            <span class="label">Street:</span>
            <span class="value">{{ company.address.street || 'N/A' }}</span>
          </div>
          <div class="info-row">
            <span class="label">City:</span>
            <span class="value">{{ company.address.city || 'N/A' }}</span>
          </div>
          <div class="info-row">
            <span class="label">State/Province:</span>
            <span class="value">{{ company.address.province || 'N/A' }}</span>
          </div>
          <div class="info-row">
            <span class="label">Postal Code:</span>
            <span class="value">{{ company.address.postalCode || 'N/A' }}</span>
          </div>
          <div class="info-row">
            <span class="label">Country:</span>
            <span class="value">  {{ countryCodeToName(company?.address?.country) || 'N/A' }} {{ countryCodeToFlag(company?.address?.country) }}</span>
          </div>
        </div>
      </div>

      <!-- Verification Steps -->
      <div class="info-card full-width" style="display: none;">
        <h3 class="card-title">
          <i class="fas fa-tasks"></i>
          Verification Progress
        </h3>
        <div class="verification-progress">
          <div class="step-item" :class="{ completed: company?.steps?.flag }">
            <div class="step-icon">
              <i class="fas fa-flag"></i>
            </div>
            <div class="step-info">
              <span class="step-name">Country/Region</span>
              <span class="step-status">{{ company?.steps?.flag ? 'Completed' : 'Pending' }}</span>
            </div>
          </div>
          <div class="step-item" :class="{ completed: company?.steps?.building }">
            <div class="step-icon">
              <i class="fas fa-building"></i>
            </div>
            <div class="step-info">
              <span class="step-name">Company Information</span>
              <span class="step-status">{{ company?.steps?.building ? 'Completed' : 'Pending' }}</span>
            </div>
          </div>
          <div class="step-item" :class="{ completed: company?.steps?.document }">
            <div class="step-icon">
              <i class="fas fa-file"></i>
            </div>
            <div class="step-info">
              <span class="step-name">Document Upload</span>
              <span class="step-status">{{ company?.steps?.document ? 'Completed' : 'Pending' }}</span>
            </div>
          </div>
          <div class="step-item" :class="{ completed: company?.steps?.user }">
            <div class="step-icon">
              <i class="fas fa-user"></i>
            </div>
            <div class="step-info">
              <span class="step-name">Representative</span>
              <span class="step-status">{{ company?.steps?.user ? 'Completed' : 'Pending' }}</span>
            </div>
          </div>
          <div class="step-item" :class="{ completed: company?.steps?.verification }">
            <div class="step-icon">
              <i class="fas fa-check-circle"></i>
            </div>
            <div class="step-info">
              <span class="step-name">Final Verification</span>
              <span class="step-status">{{ company?.steps?.verification ? 'Completed' : 'Pending' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UtilsMixin from "../../mixins/utils.js";
export default {
  name: "BusinessInformation",
  props: {
    company: {
      type: Object,
      default: () => ({})
    }
  },
  mixins: [UtilsMixin],
  methods: {
    countryCodeToFlag(countryCode) {
      if (!countryCode) return '';
      return countryCode
        .toUpperCase()
        .replace(/./g, char =>
          String.fromCodePoint(127397 + char.charCodeAt(0))
        );
    },

    getStatusBadgeClass(status) {
      const statusMap = {
        "Submitted": 'status-submitted',
        "InProgress": 'status-inprogress',
        "Approved": 'status-approved',
        "Rejected": 'status-rejected',
        "Completed": 'status-completed'
      };
      return statusMap[status] || 'status-submitted';
    },

    getCompanyStatusIcon(status) {
      const iconMap = {
        "Approved": 'fas fa-check-circle',
        "Rejected": 'fas fa-times-circle',
        "Completed": 'fas fa-check-double',
        "InProgress": 'fas fa-spinner fa-spin',
        "Submitted": 'fas fa-clock'
      };
      return iconMap[status] || 'fas fa-info-circle';
    },

    formatDate(dateString) {
      if (!dateString) return 'N/A';
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    ,
    copyToClipboard(value) {
      if (!value) return;
      try {
        navigator.clipboard.writeText(value);
        if (this.notifySuccess) this.notifySuccess('Copied to clipboard!');
      } catch (e) {
        console.error('Clipboard copy failed', e);
      }
    }
    ,
    countryCodeToName(countryCode) {
      if (!countryCode) return '';
      try {
        if (typeof Intl !== 'undefined' && Intl.DisplayNames) {
          const dn = new Intl.DisplayNames(['en'], { type: 'region' });
          return dn.of(countryCode.toUpperCase());
        }
      } catch (e) {
        // fall through to fallback
      }
      return countryCode.toUpperCase();
    }
  }
}
</script>

<style scoped>
.business-information {
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

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1rem;
}

.info-card {
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.info-card.full-width {
  grid-column: 1 / -1;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1rem 0;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #f3f4f6;
}

.card-title i {
  color: #66666a  !important;
  font-size: 0.9rem;
}

.info-rows {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.375rem;
  gap: 1rem;
}

.info-row:last-child {
  margin-bottom: 0;
}

.label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
  flex-shrink: 0;
  min-width: 120px;
}

.value {
  font-size: 0.875rem;
  color: #111827;
  font-weight: 500;
  text-align: right;
  word-wrap: break-word;
}

.value.mono {
  font-family: 'Courier New', monospace;
  font-size: 0.8rem;
  color: #4b5563;
}

.id-with-copy {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.copy-btn {
  padding: 0;
  border: none;
  color: #475569;
  opacity: 10;
  transition: opacity 0.12s ease, color 0.12s ease;
  min-width: 0;
}
.id-with-copy:hover .copy-btn {
  opacity: 1;
}
.copy-btn:hover {
  color: #111827;
}

.id-text {
  max-width: 220px;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: middle;
}

/* Status badges */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
}

.status-submitted {
  background-color: #f3f4f6;
  color: #374151;
}

.status-inprogress {
  background-color: #fef3c7;
  color: #92400e;
}

.status-completed {
  background-color: #dbeafe;
  color: #1e40af;
}

.status-approved {
  background-color: #f0fdf4;
  color: #166534;
}

.status-rejected {
  background-color: #fef2f2;
  color: #991b1b;
}

/* Verification Progress */
.verification-progress {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
}

.step-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background-color: white;
}

.step-item.completed {
  background-color: #f0fdf4;
  border-color: #bbf7d0;
}

.step-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  background-color: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  color: #6b7280;
  flex-shrink: 0;
}

.step-item.completed .step-icon {
  background-color: #f0fdf4;
  border-color: #bbf7d0;
  color: #16a34a;
}

.step-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.step-name {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
}

.step-status {
  font-size: 0.875rem;
  color: #6b7280;
}

.step-item.completed .step-status {
  color: #16a34a;
  font-weight: 500;
}

/* Responsive Design */
@media (max-width: 768px) {
  .info-grid {
    grid-template-columns: 1fr;
  }

  .info-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }

  .value {
    text-align: left;
  }
}
</style>