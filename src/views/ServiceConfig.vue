<template>
    <b-container fluid class="py-3">
        <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap">
            <!-- <h3 class="mb-0 d-flex align-items-center">
                <i class="mdi mdi-cog-outline text-primary mr-2"></i>
                App Configuration
            </h3> -->
            <div style="display:flex">
                <h3 style="text-align: left;">
                    App Configuration </h3>
            </div>

            <div class="d-flex align-items-center flex-wrap mt-2 mt-md-0">
                <!-- Environment toggle buttons -->


                <div class="d-flex align-items-center mr-3">
                    <!-- Show radio buttons only when not editing -->
                    <b-form-radio-group v-if="isEditing" v-model="isProd" :options="[
                        { text: 'Prod', value: true },
                        { text: 'Dev', value: false }
                    ]" size="sm" name="env-toggle" class="mb-0 d-flex align-items-center"></b-form-radio-group>

                    <span v-else class="status-badge" :class="isProd ? 'status-active' : 'status-warning'">
                        {{ isProd ? 'Prod' : 'Dev' }}
                    </span>
                </div>


                <!-- Edit / Save / Cancel buttons -->
                <div>
                    <hf-buttons v-if="!isEditing" name="Edit" @executeAction="startEdit()" style="float:right"
                        iconClass="mdi mdi-pencil mr-1">
                    </hf-buttons>
                    <template v-else>
                        <hf-buttons name="Save" @executeAction="saveChanges()" iconClass="mdi mdi-content-save mr-1">
                        </hf-buttons>
                        <!-- <hf-buttons name="Cancel" @executeAction="cancelEdit()" iconClass="mdi mdi-close"
                            style="margin-left: 5px">
                        </hf-buttons> -->
                        <hf-buttons name="Delete" @executeAction="openDeleteServicePopUp()" iconClass="fa fa-trash-alt"
                            style="margin-left: 5px">
                        </hf-buttons>
                        <button type="button" class="btn btn-link" @click="resetDeleteServicePopUp()" style="margin-left: 5px"><i class="mdi mdi-close" aria-hidden="true"></i> Cancel</button>
                        
                        <!-- <hf-buttons class="mx-1" @click.stop="openDeleteServicePopUp()"
                          title="Click to delete the app" style="cursor: pointer; color: red">
                          <i class="fa fa-trash-alt" aria-hidden="true"></i>
                        </hf-buttons> -->
                    </template>
                    
                </div>

            </div>
        </div>
        <b-card class="serviceCard">
            <b-form>
                <b-row>
                    <b-col md="6">
                        <b-form-group label="App Name">
                            <b-form-input v-model="formData.appName" :readonly="!isEditing" />
                        </b-form-group>
                    </b-col>

                    <b-col md="6">
                        <b-form-group label="App ID">
                            <b-input-group>
                                <b-form-input v-model="formData.appId" :readonly="!isEditing" />
                                <b-input-group-append>
                                    <b-button variant="outline-secondary" size="sm"
                                        @click="copyToClip(formData.appId, 'App ID')" title="Copy App ID">
                                        <i class="mdi mdi-content-copy"></i>
                                    </b-button>
                                </b-input-group-append>
                            </b-input-group>
                        </b-form-group>
                    </b-col>
                    <b-col cols="12">
                        <b-form-group label="Description">
                            <b-form-textarea v-model="formData.description" :readonly="!isEditing" rows="2" />
                        </b-form-group>
                    </b-col>

                    <b-col md="6">
                        <b-form-group label="Subdomain">
                            <b-form-input v-model="formData.subdomain" :readonly="!isEditing" />
                        </b-form-group>
                    </b-col>

                    <b-col md="6">
                        <b-form-group label="Tenant URL">
                            <b-input-group>
                                <b-form-input v-model="formData.tenantUrl" :readonly="!isEditing" />
                                <b-input-group-append>
                                    <b-button variant="outline-secondary" size="sm"
                                        @click="copyToClip(formData.tenantUrl, 'Tenant URL')" title="Copy Tenant URL">
                                        <i class="mdi mdi-content-copy"></i>
                                    </b-button>
                                </b-input-group-append>
                            </b-input-group>
                        </b-form-group>
                    </b-col>

                    <b-col cols="6">
                        <b-form-group label="Domain">
                            <b-input-group>
                                <b-form-input v-model="formData.domain" :readonly="!isEditing"
                                    placeholder="Enter domain" />

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
                        <b-form-group label="Encrypted Data Vault Id">
                            <b-form-input v-model="formData.edvId" :readonly="!isEditing" />
                        </b-form-group>
                    </b-col>



                    <!-- <b-col md="6">
                        <b-form-group label="Wallet Address">
                            <b-form-input v-model="formData.walletAddress" :readonly="!isEditing" />
                        </b-form-group>
                    </b-col> -->



                    <b-col md="6">
                        <b-form-group label="Logo URL">
                            <LogoUploader v-model="formData.logoUrl" />
                        </b-form-group>
                    </b-col>



                    <!-- <b-col md="6">
                        <b-form-group label="Environment">
                            <b-form-select v-model="formData.env" :disabled="!isEditing"
                                :options="['dev', 'staging', 'prod']" />
                        </b-form-group>
                    </b-col> -->



                    <!-- Services Section -->
                    <!--<b-col cols="12" class="mt-3">
                        <h5><i class="mdi mdi-api mr-1"></i>Services</h5>
                        <b-table small bordered hover :items="formData.services" :fields="serviceFields" />
                    </b-col>-->

                    <!-- Dependent Services -->
                    <!-- <b-col cols="12" class="mt-3">
                        <h5><i class="mdi mdi-link-variant mr-1"></i>Dependent Services</h5>
                        <b-badge v-for="dep in formData.dependentServices" :key="dep" variant="info" class="mr-2 mb-2">
                            {{ dep }}
                        </b-badge>
                    </b-col> -->

                    <!-- <b-col md="6">
                        <b-form-group label="Issuer DID">
                            <b-form-input v-model="formData.issuerDid" :readonly="!isEditing" />
                        </b-form-group>
                    </b-col>

                    <b-col md="6">
                        <b-form-group label="Verification Method ID">
                            <b-form-input v-model="formData.issuerVerificationMethodId" :readonly="!isEditing" />
                        </b-form-group>
                    </b-col> -->



                    <b-col cols="12">
                        <b-form-group label="Whitelisted CORS">
                            <b-form-textarea v-model="corsDisplay" :readonly="!isEditing" rows="3" />
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

<script>
import HfPopUp from "../components/element/hfPopup.vue";
import UtilsMixin from '../mixins/utils'
import messages from "../mixins/messages";
import { mapGetters, mapActions } from 'vuex/dist/vuex.common.js';
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
        ...mapGetters("mainStore", ["getSelectedService"]),
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
    },
    components: {
        HfPopUp,
        LogoUploader
    },
    created() {
        this.formData = { ...this.getSelectedService };
        this.isProd = this.formData.env === "prod";

        console.log(this.isProd)
    },
    watch: {
        isProd(newVal) {
            this.setEnv(newVal);
        }
    },
    methods: {
        ...mapActions("mainStore", ["updateAnAppOnServer", "deleteAnAppOnServer"]),
        startEdit() {
            this.backupData = JSON.parse(JSON.stringify(this.formData));
            this.isEditing = true;
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
                console.log("Updated Config:", this.formData);
                this.isEditing = false;
                this.isLoading = true;
                
                await this.updateAnAppOnServer({ ...this.formData })
                this.notifySuccess("Service configuration updated successfully!");
            }catch(err){
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
