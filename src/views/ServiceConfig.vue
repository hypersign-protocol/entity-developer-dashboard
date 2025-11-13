<template>
    <b-container fluid class="py-3">
        <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap">
            <h3 class="mb-0 d-flex align-items-center">
                <i class="mdi mdi-cog-outline text-primary mr-2"></i>
                App Configuration
            </h3>

            <div class="d-flex align-items-center flex-wrap mt-2 mt-md-0">
                <!-- Environment toggle buttons -->


                <div class="d-flex align-items-center mr-3">
                    <!-- Show radio buttons only when not editing -->
                    <b-form-radio-group v-if="isEditing" v-model="isProd" :options="[
                        { text: 'Prod', value: true },
                        { text: 'Dev', value: false }
                    ]" size="sm" name="env-toggle" class="mb-0 d-flex align-items-center"></b-form-radio-group>

                    <!-- Show chip when editing -->
                    <b-badge v-else :variant="isProd ? 'success' : 'info'" pill class="px-3 py-2">
                        {{ isProd ? 'Prod' : 'Dev' }}
                    </b-badge>
                </div>


                <!-- Edit / Save / Cancel buttons -->
                <div>
                    <b-button v-if="!isEditing" variant="outline-primary" size="sm" @click="startEdit">
                        <i class="mdi mdi-pencil mr-1"></i>Edit
                    </b-button>
                    <template v-else>
                        <b-button variant="outline-success" size="sm" class="mr-2" @click="saveChanges">
                            <i class="mdi mdi-content-save mr-1"></i>Save
                        </b-button>
                        <b-button variant="outline-danger" size="sm" @click="cancelEdit">
                            <i class="mdi mdi-close mr-1"></i>Cancel
                        </b-button>
                    </template>
                </div>
            </div>
        </div>
        <b-card>
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
                                    <b-input-group-text class="bg-warning text-dark">
                                        <i class="mdi mdi-shield-alert mr-1"></i>Unverified
                                    </b-input-group-text>
                                </b-input-group-append>
                            </b-input-group>
                        </b-form-group>
                    </b-col>

                    <b-col md="6">
                        <b-form-group label="EDV ID">
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
                            <b-form-input v-model="formData.logoUrl" :readonly="!isEditing" />
                        </b-form-group>
                    </b-col>

                    <b-col md="6" class="d-flex align-items-center justify-content-center">
                        <b-avatar v-if="formData.logoUrl" :src="formData.logoUrl" size="6rem" rounded></b-avatar>
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
                    <b-col cols="12" class="mt-3">
                        <h5><i class="mdi mdi-link-variant mr-1"></i>Dependent Services</h5>
                        <b-badge v-for="dep in formData.dependentServices" :key="dep" variant="info" class="mr-2 mb-2">
                            {{ dep }}
                        </b-badge>
                    </b-col>

                    <b-col md="6">
                        <b-form-group label="Issuer DID">
                            <b-form-input v-model="formData.issuerDid" :readonly="!isEditing" />
                        </b-form-group>
                    </b-col>

                    <b-col md="6">
                        <b-form-group label="Verification Method ID">
                            <b-form-input v-model="formData.issuerVerificationMethodId" :readonly="!isEditing" />
                        </b-form-group>
                    </b-col>



                    <b-col cols="12">
                        <b-form-group label="Whitelisted CORS">
                            <b-form-textarea v-model="corsDisplay" :readonly="!isEditing" rows="3" />
                        </b-form-group>
                    </b-col>
                </b-row>
            </b-form>
        </b-card>
    </b-container>
</template>

<script>
import UtilsMixin from '../mixins/utils'
import { mapGetters, mapActions } from 'vuex/dist/vuex.common.js';
export default {
    name: "ServiceConfig",
    data() {
        return {
            isEditing: false,
            isProd: false,
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
        corsDisplay: {
            get() {
                return this.formData.whitelistedCors.join("\n");
            },
            set(value) {
                this.formData.whitelistedCors = value
                    .split("\n")
                    .map((v) => v.trim())
                    .filter(Boolean);
            },
        },
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
        ...mapActions("mainStore", ["updateAnAppOnServer"]),
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
            console.log("Updated Config:", this.formData);
            this.isEditing = false;
            await this.updateAnAppOnServer({ ...this.formData })
            this.$bvToast.toast("Service configuration updated successfully!", {
                title: "Success",
                variant: "success",
                solid: true,
            });
        },
        verifyDomain() {
            // Simulate verification API call
            this.$bvToast.toast('Verifying domain...', {
                title: 'Verification Started',
                variant: 'info',
                solid: true,
            });

            // Simulate async result
            setTimeout(() => {
                this.formData.hasDomainVerified = true;
                this.$bvToast.toast('Domain verified successfully!', {
                    title: 'Success',
                    variant: 'success',
                    solid: true,
                });
            }, 1500);
        },
    },
    mixins: [UtilsMixin]
};
</script>
