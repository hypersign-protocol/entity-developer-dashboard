<template>
  <b-container class="py-3">
    <load-ing :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></load-ing>

    <v-row align="center" class="mb-6">
  <v-col cols="12" md="6">
    <h4 class="font-weight-bold mb-0">Business Verifications</h4>
    <p class="text-subtitle-2 text-muted">Manage and monitor corporate identity verification sessions</p>
  </v-col>
  
  <v-col cols="12" md="6" class="d-flex justify-md-end justify-start">
    <div class="d-flex flex-sm-row flex-column gap-3 align-center">
      <div class="copy-input-group search-box">
        <input 
          type="text" 
          placeholder="Search company..." 
          v-model="searchQuery"
        >
        <button><v-icon small>mdi-magnify</v-icon></button>
      </div>

      <select v-model="statusFilter" v-if="filteredCompanies.length > 0" class="theme-select">
        <option value="all">All Status</option>
        <option value="Approved">Approved</option>
        <option value="Rejected">Rejected</option>
        <option value="Completed">Completed</option>
        <option value="InProgress">In Progress</option>
        <option value="Submitted">Submitted</option>
      </select>
    </div>
  </v-col>
</v-row>

    <div v-if="isLoading" class="d-flex justify-center py-12">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>

    <div v-else-if="error" class="warning-box mb-6">
      <div class="d-flex align-center">
        <v-icon color="orange darken-2" class="mr-2">mdi-alert</v-icon>
        <span class="text-orange font-weight-bold">{{ error }}</span>
      </div>
    </div>

    <v-row v-else-if="filteredCompanies.length > 0">
      <v-col 
        v-for="company in filteredCompanies" 
        :key="company.id" 
        cols="12" 
        md="6" 
        lg="4"
      >
        <div :class="['overview-container', 'company-card', 'h-100', statusClass(company.status, company.statusReasons)]" @click="viewBusinessDetails(company)">
          <div class="d-flex align-start mb-4" :title="company.statusReasons && company.statusReasons.length !== 0 ? getStatusTooltip(company) : ''"> 
            <div class="country-badge mr-3">
              {{ countryCodeToFlag(company.countryCode) }}
            </div>
            <div style="flex: 1">
              <h3 class="company-name mb-0">{{ company.companyName }}</h3>
              <p class="small text-muted mb-0 font-weight-medium">{{
               company.companyId
               }}</p>
            </div>
            <v-icon small color="grey lighten-1">mdi-chevron-right</v-icon>
          </div>

          <div class="mb-4">
            <div class="detail-row">
              <label class="input-label mb-0">Registration #</label>
              <span class="detail-value mono">{{ company.registrationNumber  }}</span>
            </div>
            <div class="detail-row">
              <label class="input-label mb-0">Representative</label>
              <span class="detail-value">{{ company.representative }}</span>
            </div>
            <div class="detail-row">
              <label class="input-label mb-0">Started</label>
              <span class="detail-value">{{ company.startDate }}</span>
            </div>
          </div>

          <div class="card-footer-action pt-2">
            <div class="verification-steps">
              <v-icon x-small :class="company.steps.flag ? 'active' : 'inactive'">mdi-flag</v-icon>
              <v-icon x-small :class="company.steps.building ? 'active' : 'inactive'">mdi-office-building</v-icon>
              <v-icon x-small :class="company.steps.document ? 'active' : 'inactive'">mdi-file-document</v-icon>
              <v-icon x-small :class="company.steps.user ? 'active' : 'inactive'">mdi-account-check</v-icon>
              <v-icon x-small :class="company.steps.verification ? 'active' : 'inactive'">mdi-check-decagram</v-icon>
            </div>

            <div class="status-area">
              <!-- Completed with reasons: amber warning badge -->
              <span
                v-if="company.status === 'Completed' && company.statusReasons && company.statusReasons.length"
                class="status-badge-new status-warning-badge status-with-tooltip"
                :data-tooltip="getStatusTooltip(company)"
                @click.stop
              >
                <v-icon x-small color="#92400e" class="mr-1">mdi-alert</v-icon>
                Completed
              </span>

              <!-- All other statuses: unified tooltip from getStatusTooltip -->
              <span
                v-else
                class="status-badge-new status-with-tooltip"
                :class="getStatusBadgeClass(company.status)"
                :data-tooltip="getStatusTooltip(company)"
                @click.stop
              >
                <i :class="getCompanyStatusIcon(company.status)" class="mr-1"></i>
                {{ company.status }}
              </span>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>

    <div v-else>
      <empty-container title="No Business Found" icon="mdi-office-building-marker-outline" />
    </div>
  </b-container>
</template>

<style scoped>
/* Inherited Theme Patterns */
.overview-container {
  padding: 1.25rem;
  background-color: #f9fafb;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  transition: all 0.2s ease;
  cursor: pointer;
  margin-top: -0.85rem;
}

.overview-container:hover {
  border-color: #3b82f6;
  background-color: #ffffff;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.08);
}

/* Per-status hover overrides */
.overview-container.status-submitted-card:hover {
  border-color: #64748b;
  background-color: #f8fafc;
  box-shadow: 0 4px 12px rgba(100, 116, 139, 0.08);
}
.overview-container.status-inprogress-card:hover {
  border-color: #2563eb;
  background-color: #eff6ff;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.08);
}
.overview-container.status-completed-card:hover {
  border-color: #0d9488;
  background-color: #f0fdfa;
  box-shadow: 0 4px 12px rgba(13, 148, 136, 0.08);
}
.overview-container.status-approved-card:hover {
  border-color: #16a34a;
  background-color: #f0fdf4;
  box-shadow: 0 4px 12px rgba(22, 163, 74, 0.08);
}
.overview-container.status-rejected-card:hover {
  border-color: #dc2626;
  background-color: #fef2f2;
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.08);
}
.overview-container.status-warning-card:hover {
  border-color: #d97706;
  background-color: #fffbeb;
  box-shadow: 0 4px 12px rgba(217, 119, 6, 0.08);
}

.input-label {
  font-size: 0.65rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.warning-box {
  background-color: #fff7ed;
  border: 1px solid #ffedd5;
  border-radius: 8px;
  padding: 1rem;
}

.text-orange { color: #c2410c; }

/* Custom Inputs to match theme */
.copy-input-group {
  display: flex;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  overflow: hidden;
  height: 40px;
}

.copy-input-group input {
  padding: 0 12px;
  font-size: 0.85rem;
  border: none;
  width: 100%;
}

.theme-select {
  height: 40px;
  padding: 0 12px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.85rem;
  color: #475569;
  outline: none;
}

/* Card Specifics */
.company-name {
  font-size: 0.95rem;
  font-weight: 700;
  color: #111827;
}

.country-badge {
  font-size: 1.5rem;
  background: white;
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.detail-value {
  font-size: 0.85rem;
  color: #1f2937;
  font-weight: 500;
}

.detail-value.mono {
  font-family: monospace;
  color: #64748b;
}

.card-footer-action {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px dashed #e5e7eb;
}

/* Step Icons */
.verification-steps {
  display: flex;
  gap: 6px;
}

.verification-steps .v-icon.active {
  color: #3b82f6 !important;
}

.verification-steps .v-icon.inactive {
  color: #d1d5db !important;
}

/* Status Badges - Thematic Colors */
.status-badge-new {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 100px;
  line-height: 1;
  vertical-align: middle;
  min-width: 96px;
  justify-content: center;
  box-sizing: border-box;
  white-space: nowrap;
}



/* Standard UI color scheme for status badges */
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

.gap-3 { gap: 12px; }

/* Status area — wraps badge + issues pill */
.status-area {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
  justify-content: flex-end;
  position: relative;
}

/* Completed-with-issues warning badge */
.status-warning-badge {
  background-color: #fef3c7;
  color: #92400e;
  border: 1px solid #fde68a;
  cursor: default;
  position: relative;
}

/* Hover tooltip on warning badge */
.status-warning-badge[data-tooltip]:hover::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: calc(100% + 8px);
  right: 0;
  min-width: 200px;
  max-width: 280px;
  background: #1f2937;
  color: #f9fafb;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 0.72rem;
  line-height: 1.6;
  white-space: pre-line;
  z-index: 100;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  pointer-events: none;
}
.status-warning-badge[data-tooltip]:hover::before {
  content: '';
  position: absolute;
  bottom: calc(100% + 2px);
  right: 10px;
  border: 5px solid transparent;
  border-top-color: #1f2937;
  z-index: 100;
}

/* Rejected with reasons: same tooltip behaviour, keep red style */
.status-with-tooltip {
  cursor: default;
  position: relative;
}

.status-with-tooltip[data-tooltip]:hover::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: calc(100% + 8px);
  right: 0;
  min-width: 200px;
  max-width: 320px;
  background: #1f2937;
  color: #f9fafb;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 0.72rem;
  line-height: 1.4;
  white-space: pre-line;
  z-index: 100;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  pointer-events: none;
}

.status-with-tooltip[data-tooltip]:hover::before {
  content: '';
  position: absolute;
  bottom: calc(100% + 2px);
  right: 10px;
  border: 5px solid transparent;
  border-top-color: #1f2937;
  z-index: 100;
}

/* Standard submitted/in-progress/completed/approved/rejected badge styles (single canonical definitions) */
.status-submitted {
  background-color: #f8fafc;
  color: #475569;
}

.status-inprogress {
  background-color: #eff6ff;
  color: #1e3a8a;
}

.status-completed {
  background-color: #f0fdfa;
  color: #0d9488;
}

.status-approved {
  background-color: #f0fdf4;
  color: #166534;
}

.status-rejected {
  background-color: #fef2f2;
  color: #dc2626;
}

.search-box {
  width: 100%;
  max-width: 280px; /* Adjust this value as needed */
}

.status-badge-new .v-icon,
.status-badge-new i {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  line-height: 1;
  color: inherit !important;
}

/* Helper for the gap between the search and select */
.gap-3 {
  gap: 12px;
}

/* Ensure the second column itself is a flex container at the MD breakpoint */
@media (min-width: 960px) {
  .justify-md-end {
    display: flex !important;
    justify-content: flex-end !important;
  }
}
</style>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
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
      error: null,
      currentAppId: null,
      openDropdownId: null
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
    // Set the current appId when component mounts
    this.currentAppId = this.$route.params.appId;
    this.fetchCompanies();
    
    // Add event listener to close dropdown when clicking outside
    document.addEventListener('click', this.handleOutsideClick);
  },
  beforeDestroy() {
    // Remove event listener to prevent memory leaks
    document.removeEventListener('click', this.handleOutsideClick);
  },
  methods: {
    ...mapActions('mainStore', ['fetchAppKybs']),
    ...mapMutations('mainStore', ['clearCompanies']),
    
    
    async fetchCompanies() {
      try {
        this.isLoading = true;
        // Clear existing companies data before fetching new data
        this.clearCompanies();
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

    statusClass(status, statusReasons) {
      if (status === 'Completed' && statusReasons && statusReasons.length) {
        return 'status-warning-card';
      }
      switch (status) {
        case 'Submitted':
          return 'status-submitted-card';
        case 'InProgress':
          return 'status-inprogress-card';
        case 'Approved':
          return 'status-approved-card';
        case 'Rejected':
          return 'status-rejected-card';
        case 'Completed':
          return 'status-completed-card';
        default:
          return '';
      }
    },

    toggleDropdown(companyId) {
      // Toggle dropdown - if it's already open, close it, otherwise open it
      this.openDropdownId = this.openDropdownId === companyId ? null : companyId;
    },

    closeDropdown() {
      this.openDropdownId = null;
    },

    handleOutsideClick(event) {
      // Close dropdown if clicking outside of any dropdown
      if (!event.target.closest('.dropdown')) {
        this.closeDropdown();
      }
    },

    viewBusinessDetails(company) {
      // Close the dropdown first
      this.closeDropdown();
      
      // Navigate to business details page
      this.$router.push({
        name: 'BusinessDetails',
        params: {
          appId: this.$route.params.appId,
          companyId: company.companyId
        }
      });
    },

    getMappedReason(reason) {
      return config.COMPLIANCE_CHECK_FAILURE_REASONS[reason] || reason;
    },

    getStatusTooltip(company) {
      // If there are specific reasons, show them as a numbered list
      if (company.statusReasons && company.statusReasons.length) {
        const mappedReasons = company.statusReasons.map(r =>
          config.COMPLIANCE_CHECK_FAILURE_REASONS[r] || r
        );
        return `The following issues were identified:\n${mappedReasons.map((r, i) => `${i + 1}. ${r}`).join('\n')}`;
      }

      // Default messages per status
      const defaults = {
        'Submitted':  'This business verification has been submitted and is awaiting review.',
        'InProgress': 'Verification is currently in progress. This may take a moment.',
        'Completed':  'All verification steps have been completed successfully.',
        'Approved':   'The business has been verified and approved.',
        'Rejected':   'This business verification was reviewed and could not be approved.',
      };
      return defaults[company.status] || '';
    }
  }
}
</script>