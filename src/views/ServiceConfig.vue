<template>
    <b-container fluid class="py-3">
        
        <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap">
            <div>
                <h4 class="mb-1 font-weight-bold mb-0">App Configuration</h4>
                <p class="text-muted small mb-0">Manage platform environment and identity settings</p>
            </div>

            <div class="d-flex align-items-center flex-wrap mt-2 mt-md-0">
                <div class="mr-3">
                    <b-form-radio-group v-if="isEditing" v-model="isProd" :options="[
                        { text: 'PRODUCTION', value: true },
                        { text: 'DEVELOPMENT', value: false }
                    ]" size="sm" name="env-toggle" class="custom-env-toggle"></b-form-radio-group>

                    <span v-else class="status-badge" :class="isProd ? 'status-active' : 'status-warning'">
                        {{ isProd ? 'Production' : 'Development' }}
                    </span>
                </div>

                <div class="d-flex align-items-center">
                    <template v-if="!isEditing">
                        <hf-buttons  name="Edit" @executeAction="startEdit()" 
                        iconClass="mdi mdi-pencil mr-1">
                        </hf-buttons>
                        <hf-buttons title="Delete the application" name="" @executeAction="openDeleteServicePopUp()" iconClass="fa fa-trash-alt"
                                style="margin-left: 8px; color: red">
                        </hf-buttons>
                    </template>
                    
                    <template v-else>
                        <hf-buttons name="Save" @executeAction="saveChanges()" iconClass="mdi mdi-content-save mr-1">
                        </hf-buttons>
                        
                        <button type="button" class="btn btn-link text-muted" @click="resetDeleteServicePopUp()" style="margin-left: 8px">
                            Cancel
                        </button>
                    </template>
                </div>
            </div>
        </div>
        
        <b-card class="serviceCard">
            <b-form>
                <b-row>
                
                    <b-col md="6">
                        <b-form-group label="APPLICATION ID">

                            <b-input-group>
                                <b-form-input v-model="formData.appId" :readonly="!isEditing" class="custom-input" />
                                <b-input-group-append>
                                    <b-button variant="outline-secondary" size="sm"
                                        @click="copyToClip(formData.appId, 'App ID')" title="Copy App ID">
                                        <i class="mdi mdi-content-copy"></i>
                                    </b-button>
                                </b-input-group-append>
                            </b-input-group>
                        </b-form-group>
                    </b-col>
                    <b-col md="6">
                        <b-form-group label="APPLICATION NAME">
                            <b-form-input v-model="formData.appName" :readonly="!isEditing" class="custom-input" />
                        </b-form-group>
                    </b-col>

                    
                    
                    <b-col cols="6">
                        <b-form-group label="UPLOAD LOGO">
                            <LogoUploader v-model="formData.logoUrl" />
                        </b-form-group>
                    </b-col>
                    <b-col cols="6">
                        <b-form-group label="DESCRIPTION">
                            <b-form-textarea v-model="formData.description" :readonly="!isEditing" rows="3" class="custom-input" />
                        </b-form-group>
                    </b-col>

                     
                    <b-col cols="6">
                        <b-form-group label="DOMAIN">
                            <b-input-group>
                                <b-form-input v-model="formData.domain" :readonly="!isEditing"
                                    placeholder="Enter your domain"  class="custom-input" />

                                <!-- Case 1: Domain verified -->
                                <b-input-group-append v-if="formData.hasDomainVerified">
                                    <b-input-group-text class="bg-success text-white">
                                        <i class="mdi mdi-shield-check mr-1"></i>Verified
                                    </b-input-group-text>
                                </b-input-group-append>

                                <!-- Case 2: Editing and not verified -->
                                <b-input-group-append v-else-if="isEditing">
                                    <b-button variant="outline-primary" size="sm" @click="verifyDomain">
                                        <i class="mdi mdi-shield-sync-outline mr-1"></i>Verify Domain
                                    </b-button>
                                </b-input-group-append>

                                <!-- Case 3: Not editing and not verified -->
                                <b-input-group-append v-else>
                                    <b-button variant="outline-warning" size="sm" @click="toggleVerificationInfo">
                                        <i class="mdi mdi-shield-alert mr-1"></i>Unverified - View Guide
                                    </b-button>
                                </b-input-group-append>
                            </b-input-group>
                        </b-form-group>

                        <!-- Inline Verification Instructions (when editing or info expanded) -->
                        <b-collapse v-model="showVerificationInfo" class="mt-2">
                            <b-card bg-variant="light" border-variant="none">
                                <div class="mb-3">
                                    <h6 class="mb-2"><i class="mdi mdi-information-outline mr-2"></i><strong>Domain Verification Guide (DNS01)</strong></h6>
                                    <ol style="font-size: 0.9rem; margin-bottom: 0;">
                                        <li>Log in to your domain registrar or DNS provider</li>
                                        <li>Locate the DNS settings or TXT records section</li>
                                        <li>Add the TXT record shown below</li>
                                        <li>Wait for DNS propagation (5-30 minutes)</li>
                                        <li v-if="isEditing">Click "Verify Domain" to complete verification</li>
                                        <li v-else>Click "Edit" then "Verify Domain" when DNS is ready</li>
                                    </ol>
                                </div>

                                <div v-if="formData.issuerDid" class="mt-3 pt-3 border-top">
                                    <label class="mb-2"><strong>TXT Record to Add:</strong></label>
                                    <b-input-group>
                                        <b-form-input v-model="txtRecord" readonly type="text" />
                                        <b-input-group-append>
                                            <b-button variant="outline-secondary" size="sm"
                                                @click="copyToClip(txtRecord, 'TXT Record')" title="Copy TXT Record">
                                                <i class="mdi mdi-content-copy"></i>
                                            </b-button>
                                        </b-input-group-append>
                                    </b-input-group>
                                    <small class="form-text text-muted d-block mt-2">Copy this entire value to your DNS TXT record.</small>
                                </div>

                                <div v-else class="alert alert-info mb-0 mt-3">
                                    <small><strong>Note:</strong> To complete domain verification, you must click "Edit" and set an Issuer DID first.</small>
                                </div>
                            </b-card>
                        </b-collapse>
                    </b-col>

                    <b-col md="6">
                        <b-form-group label="ENCRYPTED DATA VAULT (EDV) ID">
                            <b-form-input v-model="formData.edvId" :readonly="!isEditing" class="custom-input" />
                        </b-form-group>
                    </b-col>




                    <!-- DID Configuration -->

                    <b-col md="6">
                        <b-form-group label="ISSUER DID">
                            <b-form-select v-if="isEditing" v-model="formData.issuerDid" @change="resolveDid($event)">
                                <b-form-select-option value="">— Select a DID —</b-form-select-option>
                                <b-form-select-option
                                    v-for="did in associatedSSIServiceDIDs"
                                    :value="did"
                                    :key="did">
                                    {{ did }}
                                </b-form-select-option>
                            </b-form-select>
                            <b-input-group v-else>
                                <b-form-input v-model="formData.issuerDid" readonly class="custom-input" />
                                <b-input-group-append v-if="formData.issuerDid">
                                    <b-button variant="outline-secondary" size="sm"
                                        @click="copyToClip(formData.issuerDid, 'Issuer DID')" title="Copy Issuer DID">
                                        <i class="mdi mdi-content-copy"></i>
                                    </b-button>
                                </b-input-group-append>
                            </b-input-group>
                        </b-form-group>
                    </b-col>

                    <b-col md="6">
                        <b-form-group label="ISSUER VERIFICATION METHOD ID">
                            <!-- Edit mode: select showing vm.id (vm.type) -->
                            <b-form-select v-if="isEditing" v-model="formData.issuerVerificationMethodId" :disabled="!formData.issuerDid">
                                <b-form-select-option value="">
                                    {{ formData.issuerDid ? '— Select a Verification Method —' : '— Select a DID first —' }}
                                </b-form-select-option>
                                <b-form-select-option
                                    v-for="vm in issuerVerificationMethodIds"
                                    :value="vm.id"
                                    :key="vm.id">
                                    {{ vm.id }} ({{ vm.type }})
                                </b-form-select-option>
                            </b-form-select>
                            <!-- View mode: ID input + type chip below -->
                            <template v-else>
                                <b-input-group v-if="formData.issuerVerificationMethodId">
                                    <b-form-input v-model="formData.issuerVerificationMethodId" readonly  class="custom-input"/>
                                    <b-input-group-append>
                                        <b-button variant="outline-secondary" size="sm"
                                            @click="copyToClip(formData.issuerVerificationMethodId, 'Verification Method ID')"
                                            title="Copy Verification Method ID">
                                            <i class="mdi mdi-content-copy"></i>
                                        </b-button>
                                    </b-input-group-append>
                                </b-input-group>
                                <div class="mt-1" v-if="selectedVerificationMethodType">
                                    <span style="display:inline-flex; align-items:center; background:#f0f4ff; border:1px solid #c9d8ff; border-radius:4px; padding:2px 8px; font-size:0.78rem; color:#3b5bdb;">
                                        <i class="mdi mdi-key-variant mr-1"></i>{{ selectedVerificationMethodType }}
                                    </span>
                                </div>
                                <b-form-input v-if="!formData.issuerVerificationMethodId" readonly placeholder="No verification method set" class="custom-input" />
                            </template>
                        </b-form-group>
                    </b-col>



                    <b-col cols="12">
                        <b-form-group label="WHITELISTED CORS">
                            <b-form-textarea v-model="corsDisplay" :readonly="!isEditing" rows="3" class="custom-input" />
                        </b-form-group>
                    </b-col>
                </b-row>
            </b-form>
        </b-card>

        <hf-pop-up id="entity-linked-service-detail-popup" Header="Linked Service Detail">
            <div>
                <p style="color: #ff5400de;" v-html="formattedErrorMessage"></p>
                <div class="text-center mt-3">
                    <hf-buttons name="Ok" class="btn btn-primary text-center" customClass="btn btn-danger"
                        @executeAction="closeLinkedServiceDetailPopup"></hf-buttons>
                </div>
            </div>
        </hf-pop-up>

        <hf-pop-up id="entity-delete-service-confirmation-popup" Header="Delete Confirmation">
            <div>
                <p style="color: #ff5400de">
                    Warning: This is a destructive feature. It will clean all your metadata and delete your data vault.
                    If you
                    sure you want to delete this app, please enter the app Id:
                </p>
                <input type="text" class="form-control" id="appId" v-model="appIdToGenerateSecret"
                    aria-describedby="selected App Id" placeholder="d7ca0fbaa178bafe94410a470f506fc387a3" />
                <div class="text-center mt-3">
                    <hf-buttons name="Delete" class="btn btn-primary text-center" customClass="btn btn-danger"
                        iconClass="fa fa-trash-alt" @executeAction="deleteOrg"></hf-buttons>
                </div>
            </div>
        </hf-pop-up>
    </b-container>
</template>

<style scoped>
/* Field Styling */
.custom-input {
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    padding: 0.6rem 0.8rem;
    font-size: 0.9rem;
}

.custom-input-sm {
    border: 1px solid #e2e8f0;
    border-radius: 0.4rem;
    font-size: 0.85rem;
    height: 34px;
}

/* .status-badge {
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.72rem;
    font-weight: 700;
    color: #fff;
}

.status-active { background-color: #3b82f6; }
.status-warning { background-color: #f59e0b; } */

</style>

<script>
import HfPopUp from "../components/element/hfPopup.vue";
import UtilsMixin from '../mixins/utils'
import messages from "../mixins/messages";
import { mapGetters, mapActions, mapMutations, mapState } from 'vuex/dist/vuex.common.js';
import LogoUploader from "../components/element/LogoUploader.vue";
export default {
    name: "ServiceConfig",
    data() {
        return {
            isEditing: false,
            isProd: false,
            appIdToGenerateSecret: "",
            linkedAppErrorMessage: "",
            showVerificationInfo: false,
            associatedSSIServiceDIDs: [],
            issuerVerificationMethodIds: [],
            formData: {

            },
            backupData: null,
            serviceFields: [
                { key: "name", label: "Name" },
                { key: "domain", label: "Domain" },
                { key: "description", label: "Description" },
                { key: "swaggerAPIDocPath", label: "Swagger API Path" },
            ],
        };
    },
    computed: {
        ...mapGetters("mainStore", ["getSelectedService", "getAppsWithSSIServices"]),
        ...mapState({ widgetConfig: state => state.mainStore.widgetConfig }),
        formattedErrorMessage() {
            return this.linkedAppErrorMessage.replace(/\n/g, "<br>");
        },
        corsDisplay: {
            get() {

                return typeof this.formData.whitelistedCors === 'string' ? this.formData.whitelistedCors : this.formData.whitelistedCors?.join("\n");
            },
            set(value) {
                this.formData.whitelistedCors = value
                    .split("\n")
                    .map((v) => v.trim())
                    .filter(Boolean);
            },
        },
        txtRecord() {
            return this.formData.issuerDid
                ? "hypersign-domain-verification.did=" + this.formData.issuerDid
                : null;
        },
        selectedVerificationMethodType() {
            if (!this.formData.issuerVerificationMethodId || !this.issuerVerificationMethodIds.length) {
                return null;
            }
            const vm = this.issuerVerificationMethodIds.find(
                v => v.id === this.formData.issuerVerificationMethodId
            );
            return vm ? vm.type : null;
        },
    },
    components: {
        HfPopUp,
        LogoUploader
    },
    async created() {
        this.formData = { ...this.getSelectedService };
        this.isProd = this.formData.env === "prod";
        
        // Fetch DIDs for display/selection
        await this.fetchDIDsForDisplay();
        
        // If DID is already set, fetch verification methods for display
        if (this.formData.issuerDid) {
            await this.fetchVerificationMethodsForDisplay();
        }
    },
    watch: {
        isProd(newVal) {
            this.setEnv(newVal);
        }
    },
    methods: {
        ...mapActions("mainStore", ["updateAnAppOnServer", "deleteAnAppOnServer", "fetchDIDsForAService", "resolveDIDForAKycService", "updateAppsWidgetConfig"]),
        ...mapMutations("mainStore", ["setWidgetConfig"]),
        async fetchDIDsForDisplay() {
            try {
                const ssiServiceId = this.formData.dependentServices && this.formData.dependentServices[0];
                if (!ssiServiceId) return;
                
                const associatedSSIService = this.getAppsWithSSIServices.find(
                    (x) => x.appId === ssiServiceId
                );
                
                if (!associatedSSIService) return;
                
                const payload = {
                    tenantUrl: associatedSSIService.tenantUrl,
                    accessToken: associatedSSIService.access_token,
                    serviceId: associatedSSIService.appId
                };
                const allDIDs = await this.fetchDIDsForAService(payload);
                
                if (allDIDs && Array.isArray(allDIDs) && allDIDs.length > 0) {
                    this.associatedSSIServiceDIDs = allDIDs;
                } else {
                    this.associatedSSIServiceDIDs = [];
                }
            } catch (e) {
                console.error('Error fetching DIDs for display:', e);
            }
        },
        async fetchVerificationMethodsForDisplay() {
            try {
                const ssiServiceId = this.formData.dependentServices && this.formData.dependentServices[0];
                if (!ssiServiceId) return;
                
                const associatedSSIService = this.getAppsWithSSIServices.find(
                    (x) => x.appId === ssiServiceId
                );
                
                if (!associatedSSIService) return;
                
                const payload = {
                    tenantUrl: associatedSSIService.tenantUrl,
                    accessToken: associatedSSIService.access_token,
                    did: this.formData.issuerDid,
                    serviceId: associatedSSIService.appId,

                };
                const didDocument = await this.resolveDIDForAKycService(payload);
                this.issuerVerificationMethodIds = didDocument.verificationMethod.filter(vm => vm);
            } catch (e) {
                // Silently fail for display purposes
                console.error('Error fetching verification methods for display:', e);
            }
        },
        async fetchDIDs() {
            try {
                // Find the associated SSI service
                const ssiServiceId = this.formData.dependentServices && this.formData.dependentServices[0];
                if (!ssiServiceId) {
                    throw new Error('No associated SSI service found');
                }
                
                const associatedSSIService = this.getAppsWithSSIServices.find(
                    (x) => x.appId === ssiServiceId
                );
                
                if (!associatedSSIService) {
                    throw new Error('Associated SSI service not found');
                }
                
                this.isLoading = true;
                const payload = {
                    tenantUrl: associatedSSIService.tenantUrl,
                    accessToken: associatedSSIService.access_token,
                    serviceId: associatedSSIService.appId
                };
                const allDIDs = await this.fetchDIDsForAService(payload);
                
                if (allDIDs && Array.isArray(allDIDs) && allDIDs.length > 0) {
                    // DIDs are returned as strings, not objects
                    this.associatedSSIServiceDIDs = allDIDs;
                } else {
                    this.associatedSSIServiceDIDs = [];
                    this.notifyErr('No DIDs found for the associated SSI service');
                }
                this.isLoading = false;
            } catch (e) {
                this.isLoading = false;
                console.error('Error fetching DIDs:', e);
                this.notifyErr(e.message);
            }
        },
        async resolveDid(event) {
            try {
                let did;
                if (typeof event === 'string') {
                    did = event;
                } else {
                    did = event.target.value;
                }
                
                if (!did) {
                    this.issuerVerificationMethodIds = [];
                    return;
                }
                
                // Find the associated SSI service
                const ssiServiceId = this.formData.dependentServices && this.formData.dependentServices[0];
                if (!ssiServiceId) {
                    throw new Error('No associated SSI service found');
                }
                
                const associatedSSIService = this.getAppsWithSSIServices.find(
                    (x) => x.appId === ssiServiceId
                );
                
                if (!associatedSSIService) {
                    throw new Error('Associated SSI service not found');
                }
                
                this.isLoading = true;
                const payload = {
                    tenantUrl: associatedSSIService.tenantUrl,
                    accessToken: associatedSSIService.access_token,
                    did,
                    serviceId: associatedSSIService.appId,

                };
                const didDocument = await this.resolveDIDForAKycService(payload);
                this.issuerVerificationMethodIds = didDocument.verificationMethod.filter(vm => vm);
                this.isLoading = false;
            } catch (e) {
                this.isLoading = false;
                this.notifyErr(e.message);
            }
        },
        async startEdit() {
            this.backupData = JSON.parse(JSON.stringify(this.formData));
            this.isEditing = true;
            
            // Fetch DIDs if not already loaded
            if (!this.associatedSSIServiceDIDs.length) {
                await this.fetchDIDs();
            }
            
            // If DID is already set, resolve it to get verification methods
            if (this.formData.issuerDid) {
                await this.resolveDid(this.formData.issuerDid);
            }
        },
        cancelEdit() {
            this.formData = JSON.parse(JSON.stringify(this.backupData));
            this.isEditing = false;
        },
        setEnv(flag) {
            // toggle environment and update formData.env
            this.isProd = !!flag;
            this.formData.env = this.isProd ? 'prod' : 'dev';
        },
        async saveChanges() {
            try{
                this.isEditing = false;
                this.isLoading = true;
                
                await this.updateAnAppOnServer({ ...this.formData })

                // Sync issuerDid and issuerVerificationMethodId into widget config
                if (this.formData.issuerDid && Object.keys(this.widgetConfig).length > 0) {
                    const updatedWidgetConfig = {
                        ...this.widgetConfig,
                        issuerDID: this.formData.issuerDid,
                        issuerVerificationMethodId: this.formData.issuerVerificationMethodId || this.widgetConfig.issuerVerificationMethodId,
                    }
                    this.setWidgetConfig(updatedWidgetConfig)
                    await this.updateAppsWidgetConfig()
                }

                this.notifySuccess("Service configuration updated successfully!");
            }catch(err){
                this.formData = JSON.parse(JSON.stringify(this.backupData));
                this.isProd = this.formData.env === 'prod';
                this.notifyErr(err.message);
            } finally {
                this.isLoading = false;
            }
        },
        async verifyDomain() {
            try {
                if (!this.formData.domain) {
                    throw new Error("Please enter a domain");
                }

                if (!this.txtRecord) {
                    throw new Error("Please set an Issuer DID first");
                }

                if (
                    this.formData.domain.includes("localhost") ||
                    this.formData.domain.includes("127.0.0.1")
                ) {
                    throw new Error("Domain cannot be localhost or 127.0.0.1");
                }

                this.isLoading = true;
                
                // Sanitize domain: remove www., normalize protocol
                let domainUrl = this.formData.domain.trim();
                
                // Add https:// if no protocol specified
                if (!domainUrl.includes("http://") && !domainUrl.includes("https://")) {
                    domainUrl = "https://" + domainUrl;
                }
                
                // Parse URL
                const urlObj = new URL(domainUrl);
                let hostname = urlObj.hostname;
                
                // Remove www. prefix if present
                if (hostname.startsWith("www.")) {
                    hostname = hostname.substring(4);
                }
                
                // Reconstruct clean domain URL
                const cleanDomainUrl = urlObj.protocol + "//" + hostname;
                
                // Import DomainLinkage for verification
                const DomainLinkage = (await import("@hypersign-protocol/domain-linkage-verifier")).default;
                const domainLinkage = new DomainLinkage(cleanDomainUrl);
                
                const result = await domainLinkage.verifyDnsTxtRecord(
                    new URL(cleanDomainUrl),
                    this.txtRecord
                );

                if (result && result.error) {
                    throw new Error(
                        result.error?.message +
                        ". If you have already added the record, it may take some time to propagate. Please try again later."
                    );
                }

                if (result && result.verified) {
                    this.formData.hasDomainVerified = true;
                    await this.updateAnAppOnServer({ ...this.formData });
                    this.notifySuccess("Domain verified successfully!");
                    this.showVerificationInfo = false;
                } else {
                    throw new Error("Domain verification failed. Please check your DNS records and try again.");
                }
            } catch (e) {
                this.notifyErr(e.message);
            } finally {
                this.isLoading = false;
            }
        },
        openVerificationGuide() {
            this.$root.$emit("bv::show::modal", "domain-verification-guide-popup");
        },
        closeVerificationGuide() {
            this.$root.$emit("bv::hide::modal", "domain-verification-guide-popup");
        },
        toggleVerificationInfo() {
            this.showVerificationInfo = !this.showVerificationInfo;
        },

        closeLinkedServiceDetailPopup() {
            this.linkedAppErrorMessage = '';
            this.$root.$emit("bv::hide::modal", "entity-linked-service-detail-popup");
        },
        openDeleteServicePopUp() {
            this.appIdToGenerateSecret = "";
            this.$root.$emit("bv::show::modal", "entity-delete-service-confirmation-popup");
        },
        resetDeleteServicePopUp(){
            this.isEditing = false
            this.$root.$emit("bv::hide::modal",`entity-delete-service-confirmation-popup`);
        },
        async deleteOrg() {
            try {
                if (this.appIdToGenerateSecret === "") {
                    return this.notifyErr(messages.APPLICATION.ENTER_APP_ID);
                }

                if (this.appIdToGenerateSecret !== this.formData.appId) {
                    return this.notifyErr(messages.APPLICATION.VALID_ID);
                }
                this.$root.$emit("bv::hide::modal", "entity-delete-service-confirmation-popup");

                this.isLoading = true;
                const appId = this.formData.appId;
                await this.deleteAnAppOnServer({ appId })
                this.isLoading = false
                this.$router.push("/studio/onboarding");
            } catch (e) {
                const error = e?.message || e
                if (error && error.includes('This service is linked with')) {
                    this.linkedAppErrorMessage = error;
                    this.$root.$emit("bv::show::modal", "entity-linked-service-detail-popup");
                    this.isLoading = false
                } else {
                    this.notifyErr(error);
                    this.isLoading = false
                }
            }
        },
    },
    mixins: [UtilsMixin]
};
</script>
