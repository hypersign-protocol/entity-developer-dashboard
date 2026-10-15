<template>
  <b-container fluid class="py-3">
    <load-ing :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></load-ing>

    <!-- Header follows the User Detail page: breadcrumb, title + actions, then the summary card -->
    <nav class="bd-breadcrumb" aria-label="Breadcrumb">
      <button type="button" @click="goBack">
        <i class="mdi mdi-arrow-left" aria-hidden="true"></i>Business Verifications
      </button>
      <i class="mdi mdi-chevron-right" aria-hidden="true"></i>
      <span :title="companyName" aria-current="page">{{ companyName }}</span>
    </nav>

    <header class="bd-header">
      <div>
        <h1>Business Detail</h1>
        <p>Review company information, documents, ownership and compliance record</p>
      </div>
      <div class="bd-actions">
        <hf-buttons name="Reject" iconClass="mdi mdi-close-circle-outline" customClass="btn btn-outline-danger"
          @executeAction="rejectCompany"></hf-buttons>
        <hf-buttons name="Approve" iconClass="mdi mdi-check-circle-outline"
          @executeAction="approveCompany"></hf-buttons>
      </div>
    </header>

    <BusinessSummary v-if="company" :company="company" class="bd-summary" @navigate="setActiveTab" />
    <v-row>
      <v-col cols="12" md="3" lg="2">
        <div class="overview-container pa-0 sticky-sidebar">
          <!-- <div class="sidebar-header border-bottom pa-4">
            <span class="input-label">Verification Sections</span>
          </div> -->
          <nav class="nav-list">
            <a href="#" class="nav-tab" :class="{ active: activeTab === 'business-info' }" @click.prevent="setActiveTab('business-info')">
              <v-icon small class="mr-3">mdi-office-building</v-icon>
              Business Info
            </a>
            <a href="#" class="nav-tab" :class="{ active: activeTab === 'documents' }" @click.prevent="setActiveTab('documents')">
              <v-icon small class="mr-3">mdi-file-document-outline</v-icon>
              Documents
            </a>
            <a href="#" class="nav-tab" :class="{ active: activeTab === 'ubo-details' }" @click.prevent="setActiveTab('ubo-details')">
              <v-icon small class="mr-3">mdi-account-group-outline</v-icon>
              UBO Details
            </a>
            <a href="#" class="nav-tab" :class="{ active: activeTab === 'checks-regulations' }" @click.prevent="setActiveTab('checks-regulations')">
              <v-icon small class="mr-3">mdi-shield-check-outline</v-icon>
              Compliance 
            </a>
          </nav>
        </div>
      </v-col>

      <v-col cols="12" md="9" lg="7">
        <div class="content-view-panel">
          <div v-if="activeTab === 'business-info'" class="tab-fade-in">
            <BusinessInformation :company="company" />
          </div>
          <div v-if="activeTab === 'documents'" class="tab-fade-in">
            <DocumentUploaded :company="company" />
          </div>
          <div v-if="activeTab === 'ubo-details'" class="tab-fade-in">
            <UboDetails :company="company" />
          </div>
          <div v-if="activeTab === 'checks-regulations'" class="tab-fade-in">
            <ChecksRegulations :company="company" />
          </div>
        </div>
      </v-col>

      <!-- Status history: always visible on the right, like the tabs on the left.
           Below lg it drops under the content, aligned with it. -->
      <v-col cols="12" md="9" offset-md="3" lg="3" offset-lg="0">
        <StatusHistory v-if="company" :company="company" class="history-panel" />
      </v-col>
    </v-row>

     <!-- Custom Modals -->
        <hf-pop-up id="approve-company-popup" Header="Approve Company">
          <p class="popup-message">
            Approve <strong>{{ companyName }}</strong>? The business will be marked as approved and allowed to proceed.
          </p>
          <div class="popup-actions">
            <hf-buttons name="Approve" @executeAction="handleApproveConfirm"></hf-buttons>
          </div>
        </hf-pop-up>

        <hf-pop-up id="reject-company-popup" Header="Reject Company">
          <div class="reject-form">
            <label for="reject-reason" class="reject-label">Reason for rejecting {{ companyName }}</label>
            <b-form-textarea
              id="reject-reason"
              v-model.trim="rejectReason"
              rows="4"
              max-rows="8"
              placeholder="e.g. incomplete documentation, details don't match the registry, compliance concerns"
            ></b-form-textarea>
            <div class="popup-actions">
              <hf-buttons name="Submit" :disabled="!rejectReason"
                @executeAction="handleRejectSubmit"></hf-buttons>
            </div>
          </div>
        </hf-pop-up>
  </b-container>
</template>

<style scoped>
.py-3 {
  width: 80vw !important;
}

/* Theme Consistency */
.overview-container {
  background-color: #f9fafb;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  overflow: hidden;
}

.input-label {
  font-size: 0.7rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Breadcrumb and header match the User Detail page (SessionsDetails .sd-breadcrumb / .sd-header) */
.bd-breadcrumb {
  align-items: center;
  color: #7180a5;
  display: flex;
  font-size: 12px;
  gap: 10px;
  margin-bottom: 22px;
  min-width: 0;
}

.bd-breadcrumb button {
  background: none;
  border: 0;
  color: #52658f;
  flex: 0 0 auto;
  padding: 0;
}

.bd-breadcrumb button:hover {
  color: #1d4ed8;
}

.bd-breadcrumb button i {
  margin-right: 8px;
}

.bd-breadcrumb span {
  max-width: 70vw;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.bd-header {
  align-items: center;
  display: flex;
  gap: 16px;
  justify-content: space-between;
  margin-bottom: 16px;
}

.bd-header h1 {
  color: #111827;
  font-size: 25px;
  font-weight: 750;
  line-height: 1.2;
  margin: 0;
}

.bd-header p {
  color: #7180a5;
  font-size: 13px;
  margin: 4px 0 0;
}

.bd-summary {
  margin-bottom: 20px;
}

.bd-actions {
  align-items: center;
  display: flex;
  flex: 0 0 auto;
  gap: 12px;
}

/* Sidebar Tabs */
.nav-tab {
  display: flex;
  align-items: center;
  padding: 0.85rem 1.25rem;
  text-decoration: none;
  color: #475569;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
}

.nav-tab:hover {
  background-color: #f1f5f9;
  color: #111827;
}

.nav-tab.active {
  background-color: #f1f5f9;
  color: #374151;
  font-weight: 700;
  border-left-color: #94a3b8;
}

.nav-tab.active .v-icon {
  color: #64748b !important;
}

/* Content Panel */
.content-view-panel {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 2rem;
  min-height: 70vh;
}


.sticky-sidebar {
  position: sticky;
  top: 24px;
}

/* In the right column it also stays in view while the tab content scrolls
   (the panel itself scrolls its timeline; see StatusHistory) */
@media (min-width: 1264px) {
  .history-panel {
    position: sticky;
    top: 24px;
  }
}

/* Animations */
.tab-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}

.border-bottom {
  border-bottom: 1px solid #e5e7eb;
}


/* Approve / Reject popups */
.reject-label {
  color: #344054;
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 6px;
}

.popup-message {
  color: #344054;
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 0;
}

.popup-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

/* Adjustments for smaller screens */
@media (max-width: 700px) {
  .bd-header {
    align-items: flex-start;
    flex-direction: column;
  }
}


</style>

<script>
import { mapState, mapActions } from "vuex";
import loadIng from '../../components/element/LoadIng.vue';
import BusinessSummary from '../../components/business-details/BusinessSummary.vue';
import StatusHistory from '../../components/business-details/StatusHistory.vue';
import BusinessInformation from '../../components/business-details/BusinessInformation.vue';
import DocumentUploaded from '../../components/business-details/DocumentUploaded.vue';
import UboDetails from '../../components/business-details/UboDetails.vue';
import ChecksRegulations from '../../components/business-details/ChecksRegulations.vue';
import HfPopUp from '../../components/element/hfPopup.vue';
import UtilsMixin from '../../mixins/utils';

const VALID_TABS = ['business-info', 'documents', 'ubo-details', 'checks-regulations'];


export default {
    name: "BusinessDetails",
    components: {
        loadIng,
        BusinessSummary,
        StatusHistory,
        BusinessInformation,
        DocumentUploaded,
        UboDetails,
        ChecksRegulations,
        HfPopUp
    },
    data() {
        return {
            isLoading: false,
            fullPage: true,
            company: null,
            rejectReason: ''
        }
    },
    computed: {
        ...mapState('mainStore', {
            companies: 'companies'
        }),
        companyName() {
            return this.company?.companyName ?? this.$route.params.companyId;
        },
        companyId() {
            return this.$route.params.companyId;
        },
        activeTab() {
            // Unknown tabs (e.g. the removed Overview) fall back to Business Info
            const tab = this.$route.params.tab;
            return VALID_TABS.includes(tab) ? tab : 'business-info';
        }
    },
    async mounted() {
        await this.loadCompanyDetails();

        // If no tab is specified in URL, redirect to default tab
        if (!this.$route.params.tab) {
            this.$router.replace({
                name: 'BusinessDetails',
                params: {
                    appId: this.$route.params.appId,
                    companyId: this.$route.params.companyId,
                    tab: 'business-info'
                }
            });
        }
    },
    watch: {
        '$route.params.tab'(newTab) {
            // Validate tab exists
            if (newTab && !VALID_TABS.includes(newTab)) {
                this.$router.replace({
                    name: 'BusinessDetails',
                    params: {
                        appId: this.$route.params.appId,
                        companyId: this.$route.params.companyId,
                        tab: 'business-info'
                    }
                });
            }
        }
    },
    methods: {
        ...mapActions('mainStore', ['fetchAppKybs', 'approveOrRejectVerification']),

        async loadCompanyDetails() {
            try {
                this.isLoading = true;

                // If companies are not loaded, fetch them first
                if (!this.companies || this.companies.length === 0) {
                    await this.fetchAppKybs();
                }

                // Find the specific company
                this.company = this.companies.find(c => c.companyId === this.companyId);

                if (!this.company) {
                    // If company not found, redirect back to list
                    this.$router.push({ name: 'Business' });
                    return;
                }

                this.isLoading = false;
            } catch (error) {
                this.isLoading = false;
                console.error('Error loading company details:', error);
                this.$router.push({ name: 'Business' });
            }
        },

        setActiveTab(tab) {
            // Prevent redundant navigation to the same tab
            if (this.activeTab === tab) {
                return;
            }
            this.$router.push({
                name: 'BusinessDetails',
                params: {
                    appId: this.$route.params.appId,
                    companyId: this.$route.params.companyId,
                    tab: tab
                }
            });
        },

        goBack() {
            this.$router.push({ name: 'Business' });
        },

        async approveCompany() {
            this.$root.$emit('bv::show::modal', 'approve-company-popup');
        },

        async handleApproveConfirm() {
            this.$root.$emit('bv::hide::modal', 'approve-company-popup');
            this.isLoading = true;
            try {
                await this.approveOrRejectVerification({ companyId: this.companyId, status: 'Approved' });
                this.company = this.companies.find(c => c.companyId === this.companyId) || this.company;
                this.notifySuccess(`${this.companyName} has been approved successfully.`);
            } catch (error) {
                this.notifyErr(error?.message || `Failed to approve ${this.companyName}.`);
                // Refresh to reflect any partial state change
                await this.fetchAppKybs().catch(() => {});
                this.company = this.companies.find(c => c.companyId === this.companyId) || this.company;
            } finally {
                this.isLoading = false;
            }
        },

        async rejectCompany() {
            this.rejectReason = '';
            this.$root.$emit('bv::show::modal', 'reject-company-popup');
        },

        async handleRejectSubmit() {
            const reason = this.rejectReason;
            if (!reason) {
                this.notifyErr('Please enter a reason for rejecting this company.');
                return;
            }
            this.$root.$emit('bv::hide::modal', 'reject-company-popup');
            this.isLoading = true;
            try {
                await this.approveOrRejectVerification({ companyId: this.companyId, status: 'Rejected', reason });
                this.company = this.companies.find(c => c.companyId === this.companyId) || this.company;
                this.notifySuccess(`${this.companyName} has been rejected.`);
            } catch (error) {
                this.notifyErr(error?.message || `Failed to reject ${this.companyName}.`);
                // Refresh to reflect any partial state change
                await this.fetchAppKybs().catch(() => {});
                this.company = this.companies.find(c => c.companyId === this.companyId) || this.company;
            } finally {
                this.isLoading = false;
            }
        },
    },
    mixins: [UtilsMixin],

}
</script>
