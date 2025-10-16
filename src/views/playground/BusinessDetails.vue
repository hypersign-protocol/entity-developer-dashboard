<template>
    <div class="business-details-container">
        <!-- Loading overlay -->
        <loadIng :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></loadIng>
        <!-- Breadcrumb Navigation -->
        <div class="breadcrumb-nav">
            <div class="breadcrumb-left">
                <h4 class="breadcrumb-text">
                    <a @click="goBack" href="#" class="breadcrumb-link">Business Verification</a>
                    <i class="fa fa-angle-double-right breadcrumb-separator" aria-hidden="true"></i>
                    <span @click="copyToClip(companyName, 'Company Name')" class="breadcrumb-id">{{ companyName
                    }}</span>
                </h4>
            </div>
            <div v-if="company?.status === 'Completed'" class="breadcrumb-actions">
                <button @click="approveCompany" class="action-btn approve-btn">
                    <i class="fas fa-check"></i>
                    Approve
                </button>
                <button @click="rejectCompany" class="action-btn reject-btn">
                    <i class="fas fa-times"></i>
                    Reject
                </button>
            </div>
        </div>

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

        <div class="details-layout">
            <!-- Sidebar Navigation -->
            <div class="sidebar">
                <nav class="sidebar-nav">
                    <ul class="nav-list">
                        <li class="nav-item">
                            <a href="#" class="nav-link" :class="{ active: activeTab === 'business-info' }"
                                @click="setActiveTab('business-info')">
                                <i class="fas fa-building"></i>
                                Business Information
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="#" class="nav-link" :class="{ active: activeTab === 'documents' }"
                                @click="setActiveTab('documents')">
                                <i class="fas fa-file-alt"></i>
                                Document Uploaded
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="#" class="nav-link" :class="{ active: activeTab === 'ubo-details' }"
                                @click="setActiveTab('ubo-details')">
                                <i class="fas fa-users"></i>
                                UBO Details
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="#" class="nav-link" :class="{ active: activeTab === 'checks-regulations' }"
                                @click="setActiveTab('checks-regulations')">
                                <i class="fas fa-shield-alt"></i>
                                Checks & Regulations
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>

            <!-- Main Content Area -->
            <div class="main-content">
                <!-- Business Information Tab -->
                <div v-if="activeTab === 'business-info'" class="content-section">
                    <BusinessInformation :company="company" />
                </div>

                <!-- Documents Tab -->
                <div v-if="activeTab === 'documents'" class="content-section">
                    <DocumentUploaded :company="company" />
                </div>

                <!-- UBO Details Tab -->
                <div v-if="activeTab === 'ubo-details'" class="content-section">
                    <UboDetails :company="company" />
                </div>

                <!-- Checks & Regulations Tab -->
                <div v-if="activeTab === 'checks-regulations'" class="content-section">
                    <ChecksRegulations :company="company" />
                </div>
            </div>
        </div>
    </div>
</template>

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
            try {
                this.showApproveConfirm = false;
                this.isLoading = true;

                // Call store action to approve company
                await this.approveOrRejectVerification({
                    companyId: this.companyId,
                    status: 'Approved'
                });

                await this.loadCompanyDetails();

            } catch (error) {
                console.error('Error approving company:', error);
            } finally {
                this.isLoading = false;
            }
        },

        async rejectCompany() {
            this.showRejectPrompt = true;
        },

        async handleRejectSubmit(reason) {
            try {
                this.showRejectPrompt = false;
                this.isLoading = true;

                // Call store action to reject company
                await this.approveOrRejectVerification({
                    companyId: this.companyId,
                    status: 'Rejected',
                    reason: reason
                });


                await this.loadCompanyDetails();

            } catch (error) {
                console.error('Error rejecting company:', error);
            } finally {
                this.isLoading = false;
            }
        },
    },
    mixins: [UtilsMixin],

}
</script>

<style scoped>
.business-details-container {
    min-height: 100vh;
    background-color: #fff;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
}

.details-layout {
    display: flex;
    min-height: 100vh;
}

/* Sidebar Styles */
.sidebar {
    width: 250px;
    background-color: #f8f9fa;
    border: 1px solid #e5e7eb;
    flex-shrink: 0;
    border-radius: 0.5rem 0 0 0.5rem;
}

.sidebar-nav {
    padding: 0rem;
}

.nav-list {
    list-style: none;
    margin: 0;
    padding: 0;
}

.nav-item {
    padding: 0;
}

.nav-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    color: #475569;
    text-decoration: none;
    font-size: 0.9rem;
    font-weight: 500;
    transition: all 0.2s ease;
    position: relative;
    border-radius: 0;

}

/* nav link icon */
.nav-link i {
    color: #66666a !important;
    font-size: 0.9rem;
    width: 1.25rem;
    text-align: center;
}

.nav-link:hover {
    background: linear-gradient(135deg, #f8fafc 0%, #475569 100%);
    color: #475569;
    text-decoration: none;
    transform: translateX(4px);
}

.nav-link.active {
    background-color: #000000;
    color: #ffffff;
    font-weight: 600;
    border-radius: 0.25rem 0 0 0.25rem;
}

.nav-link.active:hover {
    background-color: #1f2937;
    color: #ffffff;
    transform: translateX(0);

}

.nav-link i {
    color: #3b82f6;
    font-size: 0.9rem;
    width: 1.25rem;
    text-align: center;
}

.nav-link.active i {
    color: #ffffff;
}

/* Main Content Styles */
.main-content {
    flex: 1;
    /* padding: 2rem; */
    overflow-y: auto;
    background-color: #fff;
}

/* Breadcrumb Navigation */
.breadcrumb-nav {
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
}

.breadcrumb-left {
    flex: 1;
}

.breadcrumb-text {
    color: #8080808f;
    font-size: 1.5rem;
    font-weight: 500;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.breadcrumb-actions {
    display: flex;
    gap: 0.75rem;
    align-items: center;
}

.action-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    text-decoration: none;
    font-family: inherit;
}

.approve-btn {
    background-color: #10b981;
    color: white;
}

.approve-btn:hover {
    background-color: #059669;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(16, 185, 129, 0.3);
}

.reject-btn {
    background-color: #ef4444;
    color: white;
}

.reject-btn:hover {
    background-color: #dc2626;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(239, 68, 68, 0.3);
}

.action-btn i {
    font-size: 0.75rem;
}

.breadcrumb-link {
    color: #8080808f;
    text-decoration: none;
    cursor: pointer;
    transition: color 0.2s ease;
}

.breadcrumb-link:hover {
    color: #66666a;
    text-decoration: none;
}

.breadcrumb-separator {
    color: #8080808f;
    font-size: 0.875rem;
    margin: 0 0.25rem;
}

.breadcrumb-id {
    color: #374151;
    font-weight: 600;
    cursor: pointer;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    transition: all 0.2s ease;
}

.breadcrumb-id:hover {
    background-color: #f3f4f6;
    color: #1f2937;
}

.content-section {
    background-color: #fff;
    /* border-radius: 0.5rem; */
    padding: 2rem;
    /* box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); */
    min-height: 100vh;
    border: 1px solid #e5e7eb;
    border-radius: 0 0.5rem 0.5rem 0;
}

/* Responsive Design */
@media (max-width: 768px) {
    .details-layout {
        flex-direction: column;
    }

    .sidebar {
        width: 100%;
        order: 2;
    }

    .main-content {
        order: 1;
        /* padding: 1rem; */
    }

    .breadcrumb-nav {
        margin-bottom: 1rem;
        padding: 0.75rem 1rem;
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
    }

    .breadcrumb-left {
        width: 100%;
    }

    .breadcrumb-text {
        font-size: 0.875rem;
        flex-wrap: wrap;
    }

    .breadcrumb-id {
        padding: 0.125rem 0.375rem;
        font-size: 0.875rem;
    }

    .breadcrumb-actions {
        width: 100%;
        justify-content: flex-end;
    }

    .action-btn {
        font-size: 0.75rem;
        padding: 0.375rem 0.75rem;
    }

    .sidebar-nav {
        display: flex;
        overflow-x: auto;
        padding: 0.5rem;
    }

    .nav-list {
        display: flex;
        gap: 0.5rem;
        min-width: max-content;
    }

    .nav-link {
        white-space: nowrap;
        padding: 0.75rem 1.25rem;
        border-radius: 0.375rem;
    }
}
</style>