<template>
    <div class="business-details-container">
        <!-- Loading overlay -->
        <loadIng :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></loadIng>

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

export default {
    name: "BusinessDetails",
    components: {
        loadIng,
        BusinessInformation,
        DocumentUploaded,
        UboDetails,
        ChecksRegulations
    },
    data() {
        return {
            isLoading: false,
            fullPage: true,
            company: null
        }
    },
    computed: {
        ...mapState('mainStore', {
            companies: 'companies'
        }),
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
        ...mapActions('mainStore', ['fetchAppKybs']),

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
        }
    }
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
    width: 300px;
    background-color: #f8f9fa;
    border-right: 1px solid #e5e7eb;
    flex-shrink: 0;
}

.sidebar-nav {
    padding: 0.75rem 0;
}

.nav-list {
    list-style: none;
    margin: 0;
    padding: 0;
}

.nav-item {
    margin: 0;
}

.nav-link {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1.25rem;
    color: #475569;
    text-decoration: none;
    font-size: 0.9rem;
    font-weight: 500;
    transition: all 0.2s ease;
    margin: 0.25rem 0;
    position: relative;
    border-radius: 0;
}

.nav-link:hover {
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    color: #475569;
    text-decoration: none;
    transform: translateX(4px);
}

.nav-link.active {
    background-color: #475569;
    color: #ffffff;
    font-weight: 600;
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
    padding: 2rem;
    overflow-y: auto;
    background-color: #fff;
}

.content-section {
    background-color: #fff;
    border-radius: 0.5rem;
    padding: 2rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    border: 1px solid #e5e7eb;
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
        padding: 1rem;
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