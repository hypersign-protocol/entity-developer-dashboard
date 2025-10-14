<style scoped>
.sticky-header {
  position: sticky;
  top: 0;
}

.container {
  width: 80vw;
}

.UI--c-kbgiPT-iehgGlf-css {
  background-color: #9cb5f9;
}

.step-notStarted {
  background-color: #e1e1e3;
}

.step-failed {
  background-color: rgba(252, 94, 94, 0.736);
}

.step-finished {
  background-color: #673ab76e;
}


.UI--c-dhzjXW-iexswVt-css {
  align-items: center;
  justify-content: center;
}

.UI--c-kbgiPT-bUORwj-isFirst-true {
  padding: 0px 0.4rem 0px 0px;
  clip-path: polygon(75% 0%, 100% 50%, 75% 100%, 0% 100%, 0% 100%, 0% 0%);
}

.UI--c-kbgiPT {
  height: 100%;
  width: 4.8rem;
  clip-path: polygon(75% 0%, 100% 50%, 75% 100%, 0% 100%, 25% 50%, 0% 0%);
  margin-left: -0.9rem;
  padding: 0px 0.4rem 0px 0.8rem;
}

.UI--c-dhzjXW {
  display: flex;
}

.stepSpan {
  cursor: pointer;
  margin: 3px;
  padding: 0px;
  border: 0px;
  font: inherit;
  vertical-align: baseline;
  float: left
}

.step {
  height: 32px;
  width: 50px;
}

.card-header {
  background: #fff;
  padding: 0px;
}

.card {
  border-radius: 10px;
}

.goschema {
  color: #339af0;
}

.goschema:hover {
  text-decoration: underline;
  cursor: pointer;
}

.far {
  color: gray;
  font-size: 1.5em;
  display: inline;
  cursor: pointer;
}

.datetime-picker {
  background-color: #fff;
  background-clip: content-box;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  padding: 0.375rem 0.75rem;
}

.linkdiv {
  background-clip: content-box;
  background-color: rgba(173, 232, 255, .5607843137254902);
  border-radius: 0.25rem;
  height: 50px;
  text-align: left;
}

h5 {
  width: 100%;
  text-align: center;
  border-bottom: 1px solid #80808045;
  line-height: 0.1em;
  margin: 10px 0 20px;
}

h5 span {
  background: #fff;
  padding: 0 10px;
}

.scrollit {
  overflow: hidden;
  height: 800px;
}

.scrollit:hover {
  overflow-y: auto;
}

.custom-active {
  background-color: #e0e0e0 !important;
  color: #000 !important;
}


::v-deep(.dropdown-item.custom-active:hover) {
  background-color: #cfcfcf !important;
  color: #000 !important;
}

::v-deep(.dropdown-item:hover) {
  background-color: #f0f0f0 !important;
  color: #000 !important;
}

.overview-card {
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Main layout */
.business-container {
  background-color: #fff;
}



.content-box {
  background-color: white;
  border-radius: 0.5rem;
  padding: 2rem;
}

/* Header section */
.header-section {
  margin-bottom: 2rem;
}

.header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.title-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.page-title {
  font-size: 1.5rem;
  line-height: 2rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.info-icon {
  color: #6b7280;
}

.create-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1.5rem;
  background-color: #000;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.create-btn:hover {
  background-color: #1f2937;
}

/* Search and filter section */
.filter-row {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (min-width: 640px) {
  .filter-row {
    flex-direction: row;
  }
}

.search-wrapper {
  flex: 1;
  position: relative;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
}

.search-input {
  width: 100%;
  padding: 0.5rem 1rem 0.5rem 2.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
}

.search-input:focus {
  outline: none;
  border-color: #9ca3af;
  box-shadow: 0 0 0 2px rgba(229, 231, 235, 0.5);
}

.filter-wrapper {
  width: 12rem;
}

.filter-select {
  width: 100%;
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
}

.filter-select:focus {
  outline: none;
  border-color: #9ca3af;
  box-shadow: 0 0 0 2px rgba(229, 231, 235, 0.5);
}

/* Loading and error states */
.loading-container,
.error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem;
}

.loading-spinner {
  width: 2rem;
  height: 2rem;
  border: 2px solid #f3f4f6;
  border-top: 2px solid #111827;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #ef4444;
}

/* Empty state */
.empty-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem 2rem;
}

.empty-message {
  text-align: center;
  max-width: 400px;
}

.empty-message i {
  font-size: 3rem;
  color: #9ca3af;
  margin-bottom: 1rem;
}

.empty-message h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.empty-message p {
  color: #6b7280;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

/* Company grid */
.company-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

/* Company card */
.company-card {
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.company-card:hover {
  border-color: #3b82f6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.company-info {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  background: #fff;
  flex: 1;
}

.country-flag {
  font-size: 1.5rem;
  line-height: 1;
  margin-top: 0.125rem;
}

.company-details h3 {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
  color: #111827;
  line-height: 1.2;
}

.company-details p {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.2;
}

.menu-btn {
  padding: 0.25rem;
  border: none;
  background: none;
  border-radius: 4px;
  cursor: pointer;
  color: #9ca3af;
  font-size: 0.875rem;
}

.menu-btn:hover {
  background-color: #f3f4f6;
  color: #374151;
}

/* Card details section */
.card-details {
  margin-bottom: 1rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.375rem;
}

.detail-row:last-child {
  margin-bottom: 0;
}

.detail-label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.detail-value {
  font-size: 0.875rem;
  color: #111827;
  font-weight: 500;
}

.detail-value.mono {
  font-family: 'Courier New', monospace;
  font-size: 0.8rem;
  color: #4b5563;
}

/* Status message */
.status-message {
  margin: 1rem 0;
  padding: 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
  line-height: 1.4;
  border-left: 4px solid;
}

.status-message.status-submitted {
  background: #f0f9ff;
  color: #0369a1;
  border-left-color: #0284c7;
}

.status-message.status-inprogress {
  background: #fffbeb;
  color: #92400e;
  border-left-color: #f59e0b;
}

.status-message.status-approved {
  background: #f0fdf4;
  color: #166534;
  border-left-color: #22c55e;
}

.status-message.status-rejected {
  background: #fef2f2;
  color: #991b1b;
  border-left-color: #ef4444;
}

.status-message.status-completed {
  background: #f0fdf4;
  color: #065f46;
  border-left-color: #10b981;
}

.status-message ul {
  margin: 0;
  padding-left: 1rem;
}

.status-message li {
  margin-bottom: 0.25rem;
}

.status-message li:last-child {
  margin-bottom: 0;
}

/* Verification steps and status */
.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 0.75rem;
  border-top: 1px solid #f3f4f6;
  background: #fff;

}

.verification-steps {
  display: flex;
  gap: 0.5rem;
}

.step-icon {
  font-size: 0.875rem;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.step-icon.active {
  color: #059669;
  background: #fff;
}

.step-icon.inactive {
  color: #9ca3af;
  background: #fff;
}

/* Status badges */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  background: transparent;
  font-weight: 600;
  text-transform: capitalize;
}

.status-submitted {
  background: #dbeafe;
  color: #1e40af;
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

.status-completed {
  background: #dcfce7;
  color: #166534;
}

/* Tooltip enhancement for status badge */
.status-badge[data-tooltip] {
  cursor: help !important;
  position: relative;
}

.status-badge[data-tooltip]:hover {
  opacity: 0.9;
  cursor: help !important;
}

/* Custom tooltip styling */
.status-badge[data-tooltip]:hover::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: #1f2937;
  color: #fffbeb;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  white-space: pre-line;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-width: px;
  min-width: 400px;
  text-align: left;
  line-height: 1.4;
  margin-bottom: 0.5rem;
  opacity: 0;
  animation: tooltipFadeIn 0.2s ease-in-out forwards;
}

.status-badge[data-tooltip]:hover::before {
  content: '';
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-top-color: #1f2937;
  z-index: 1001;
  margin-bottom: -6px;
  opacity: 0;
  animation: tooltipFadeIn 0.2s ease-in-out forwards;
}

@keyframes tooltipFadeIn {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-5px);
  }

  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.overview-value {
  font-size: 38px;
  font-weight: 700;
  color: #212121;
}

.overview-title {
  font-size: 14px;
  color: #757575;
  margin-top: 6px;
}

.v-tooltip__content {
  font-size: 12px;
  max-width: 200px;
  text-align: center;
}

.steps-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 1px;
}


.user-avatar {
  background-color: #888;
  /* or your theme color */
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
<template>
  <div class="business-container">
    <!-- Loading overlay -->
    <loadIng :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></loadIng>

    <!-- Main Content -->
    <!-- Content Container -->
    <div class="content-box">
      <!-- Header Section -->
      <div class="header-section">
        <div class="header-row">
          <div class="title-group">
            <h1 class="page-title">Business verification</h1>
          </div>
        </div>

        <!-- Search and Filter Controls -->
        <div class="filter-row">
          <div class="search-wrapper">
            <i class="fas fa-search search-icon"></i>
            <input type="text" placeholder="Search company....." class="search-input" v-model="searchQuery" />
          </div>
          <div class="filter-wrapper">
            <select v-model="statusFilter" class="filter-select">
              <option value="all">All Status</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Completed">Completed</option>
              <option value="InProgress">In Progress</option>
              <option value="Submitted">Submitted</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="loading-container">
        <div class="loading-spinner"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-container">
        <div class="error-message">
          <i class="fas fa-exclamation-circle"></i>
          {{ error }}
        </div>
      </div>

      <!-- Company Cards Grid -->
      <div v-else-if="filteredCompanies.length > 0" class="company-grid">
        <div v-for="company in filteredCompanies" :key="company.id" class="company-card">
          <!-- Company Header -->
          <div class="card-header">
            <div class="company-info">
              <div class="country-flag">
                {{ countryCodeToFlag(company.countryCode) }}
              </div>
              <div class="company-details">
                <h3>{{ company.companyName }}</h3>
                <p>{{ company.registrationNumber }}</p>
              </div>
            </div>
            <button class="menu-btn">
              <i class="fas fa-ellipsis-v"></i>
            </button>
          </div>

          <!-- Company Details -->
          <div class="card-details">
            <div class="detail-row">
              <span class="detail-label">ID:</span>
              <span class="detail-value mono">{{ company.companyId }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Representative:</span>
              <span class="detail-value">{{ company.representative }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Started:</span>
              <span class="detail-value">{{ company.startDate }}</span>
            </div>
          </div>



          <!-- Verification Steps + Status Badge -->
          <div class="card-footer">
            <!-- Verification Steps -->
            <div class="verification-steps">
              <i class="fas fa-flag step-icon" :class="company.steps.flag ? 'active' : 'inactive'"></i>
              <i class="fas fa-building step-icon" :class="company.steps.building ? 'active' : 'inactive'"></i>
              <i class="fas fa-file step-icon" :class="company.steps.document ? 'active' : 'inactive'"></i>
              <i class="fas fa-user step-icon" :class="company.steps.user ? 'active' : 'inactive'"></i>
              <i class="fas fa-check-circle step-icon" :class="company.steps.verification ? 'active' : 'inactive'"></i>
            </div>

            <!-- Status Badge -->
            <span class="status-badge" :class="getStatusBadgeClass(company.status)"
              :data-tooltip="getStatusTooltip(company)">
              <i :class="getCompanyStatusIcon(company.status)"></i>
              {{ company.status }}
            </span>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-container">
        <div class="empty-message">
          <i class="fas fa-building"></i>
          <h3>No companies found</h3>
          <p>{{ searchQuery || statusFilter !== 'all' ?
            "Try adjusting your search or filter criteria." :
            "Get started by creating your first company verification." }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import loadIng from '../../components/element/LoadIng.vue';
import config from '@/config.js';

export default {
  name: "BusinessVerification",
  components: { loadIng },
  data() {
    return {
      searchQuery: '',
      statusFilter: 'all',
      isLoading: false,
      fullPage: true,
      error: null
    }
  },
  computed: {
    ...mapState('mainStore', {
      companies: 'companies'
    }),
    filteredCompanies() {
      let filtered = this.companies || [];

      // Filter by search query
      if (this.searchQuery) {
        filtered = filtered.filter(company =>
          company.companyName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          company.companyId.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }

      // Filter by status
      if (this.statusFilter !== 'all') {
        filtered = filtered.filter(company => company.status === this.statusFilter);
      }

      return filtered;
    }
  },
  mounted() {
    this.fetchCompanies();
  },
  methods: {
    ...mapActions('mainStore', ['fetchAppKybs']),
    async fetchCompanies() {
      try {
        this.isLoading = true;
        await this.fetchAppKybs();
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
        console.error('Error fetching companies:', error);
      }
    },

    countryCodeToFlag(countryCode) {
      if (!countryCode) return '';
      return countryCode
        .toUpperCase()
        .replace(/./g, char =>
          String.fromCodePoint(127397 + char.charCodeAt(0))
        );
    },

    getStatusBadgeClass(status) {
      switch (status) {
        case "Submitted":
          return 'status-submitted';
        case "InProgress":
          return 'status-inprogress';
        case "Approved":
          return 'status-approved';
        case "Rejected":
          return 'status-rejected';
        case "Completed":
          return 'status-completed';
        default:
          return 'status-submitted';
      }
    },

    getStatusMessageClass(status) {
      return this.getStatusBadgeClass(status);
    },

    getCompanyStatusIcon(status) {
      switch (status) {
        case "Approved":
          return 'fas fa-check-circle';
        case "Rejected":
          return 'fas fa-times-circle';
        case "Completed":
          return 'fas fa-check-double';
        case "InProgress":
          return 'fas fa-spinner fa-spin';
        case "Submitted":
          return 'fas fa-clock';
        default:
          return 'fas fa-info-circle';
      }
    },

    getStatusTooltip(company) {
      if (company.statusReasons && company.statusReasons.length !== 0) {
        // Use enum from config for user-friendly descriptions
        const mappedReasons = company.statusReasons.map(reason => {
          return config.COMPLIANCE_CHECK_FAILURE_REASONS[reason] || reason;
        });

        const reasonsText = mappedReasons.join('\n• ');
        return `Reason: \n• ${reasonsText}`;
      }


    }
  }
}
</script>