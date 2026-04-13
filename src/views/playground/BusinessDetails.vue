<template>
  <v-container fluid class="py-6 px-8">
    <load-ing :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></load-ing>

    <v-row align="center" class="mb-6">
  <v-col cols="12" md="8">
    <div class="d-flex align-center">
      <a 
        @click.prevent="goBack" 
        class="breadcrumb-link font-weight-bold mb-0"
      >
        Business Verifications
      </a>
      
      <v-icon class="mx-2" color="grey lighten-1">mdi-chevron-right</v-icon>
      <span class="company-title text-h6 font-weight-bold">{{ companyName }}</span>
    </div>
    <p class="text-subtitle-2 text-muted mb-0 mt-1">
      Review business documentation and regulatory status
    </p>
  </v-col>

  <v-col 
    cols="12" 
    md="4" 
    v-if="company?.status === 'Completed'"
    class="d-flex align-center"
>
    <div class="d-flex justify-md-end justify-start align-center gap-3 w-100">

        <hf-buttons name="Approve" iconClass=""
                                    @executeAction="approveCompany"></hf-buttons>

        <v-btn color="error" text @click="rejectCompany"><v-icon small left color="white">mdi-close-circle-outline</v-icon>Reject</v-btn>
        
        <!-- <button @click="approveCompany" class="theme-btn btn-approve">
            <v-icon small left color="white">mdi-check-decagram</v-icon>
            Approve
        </button>

        <button @click="rejectCompany" class="theme-btn btn-reject">
            <v-icon small left color="white">mdi-close-circle-outline</v-icon>
            Reject
        </button> -->
    </div>
</v-col>
</v-row>
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

      <v-col cols="12" md="9" lg="10">
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
    </v-row>

     <!-- Custom Modals -->
        <CustomConfirmModal :isVisible="showApproveConfirm" title="Approve Company"
            :message="`Are you sure you want to approve ${companyName}? This action will mark the company as approved and allow them to proceed.`"
            type="success" confirmText="Approve" cancelText="Cancel" iconClass="fas fa-check-circle"
            confirmIconClass="fas fa-check" @confirm="handleApproveConfirm" @cancel="showApproveConfirm = false" />

        <CustomPromptModal :isVisible="showRejectPrompt" title="Reject Company"
            :message="`Please provide a reason for rejecting ${companyName}:`" type="danger" inputType="textarea"
            inputLabel=""
            placeholder="Enter the reason for rejection (e.g., incomplete documentation, compliance issues, etc.)"
            submitText="Reject" cancelText="Cancel" iconClass="fas fa-times-circle" submitIconClass="fas fa-times"
            @submit="handleRejectSubmit" @cancel="showRejectPrompt = false" />
  </v-container>
</template>

<style scoped>

.w-100 {
    width: 100%;
}

.gap-3 {
    gap: 12px;
}

/* Optional: In case of older Vuetify/CSS versions, 
   this ensures the flex container respects the right alignment */
.justify-md-end {
    @media (min-width: 960px) {
        justify-content: flex-end !important;
    }
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

/* Breadcrumb Styling */
.breadcrumb-link {
  font-size: 0.75rem;
  color: #3b82f6;
  text-decoration: none;
  cursor: pointer;
}

.company-title {
  font-size: 1.25rem;
  color: #111827;
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


/* Ensure the breadcrumb link doesn't look like a standard tiny link */
.breadcrumb-link {
  color: #64748b; /* Muted slate to distinguish from the active name */
  text-decoration: none;
  transition: color 0.2s;
  line-height: 1.2;
}

.breadcrumb-link:hover {
  color: #905ab0;
}

.company-title {
  color: #111827;
  line-height: 1.2;
}

/* Flex gap for buttons */
.gap-3 {
  gap: 12px;
}

/* Ensure the theme-btn has a fixed height for vertical alignment */
.theme-btn {
  height: 40px;
  white-space: nowrap;
}

/* Adjustments for smaller screens */
@media (max-width: 960px) {
  .gap-3 {
    margin-top: 1rem;
    width: 100%;
    justify-content: flex-start;
  }
}


</style>

<script>
import { mapState, mapActions } from "vuex";
import loadIng from '../../components/element/LoadIng.vue';
import BusinessInformation from '../../components/business-details/BusinessInformation.vue';
import DocumentUploaded from '../../components/business-details/DocumentUploaded.vue';
import UboDetails from '../../components/business-details/UboDetails.vue';
import ChecksRegulations from '../../components/business-details/ChecksRegulations.vue';
import CustomConfirmModal from '../../components/element/CustomConfirmModal.vue';
import CustomPromptModal from '../../components/element/CustomPromptModal.vue';
import UtilsMixin from '../../mixins/utils';


export default {
    name: "BusinessDetails",
    components: {
        loadIng,
        BusinessInformation,
        DocumentUploaded,
        UboDetails,
        ChecksRegulations,
        CustomConfirmModal,
        CustomPromptModal
    },
    data() {
        return {
            isLoading: false,
            fullPage: true,
            company: null,
            showApproveConfirm: false,
            showRejectPrompt: false
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
            return this.$route.params.tab || 'business-info';
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
            const validTabs = ['business-info', 'documents', 'ubo-details', 'checks-regulations'];
            if (newTab && !validTabs.includes(newTab)) {
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
            this.showApproveConfirm = true;
        },

        async handleApproveConfirm() {
            this.showApproveConfirm = false;
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
            this.showRejectPrompt = true;
        },

        async handleRejectSubmit(reason) {
            this.showRejectPrompt = false;
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
