<template>

    <div>

        <load-ing :active.sync="isLoading" :can-cancel="true" :is-full-page="true"></load-ing>


         <b-row  class="d-flex justify-start align-center" >
            <b-col cols="12" >
                <div class="overview-container">
                    <div class="header-row">
                        <h2 class="title">Retrieve Case File</h2>
                    </div>
                    <div>
                        <p class="text-subtitle-2 text-muted mb-2">
                            Enter <strong>Service ID</strong> and Authenticate.
                        </p>
                        <b-row align="start" no-gutters class="mb-4">
                             <b-col cols="12" sm="8" md="8">
                                <b-form-input v-model="serviceId"
                                    placeholder="e.g. 68afa3d8a4975d9c9e4671a7..."
                                    class="mono-text mr-sm-4" @keyup.enter="authenticateService"></b-form-input>
                            </b-col>

                            <b-col cols="12" sm="2" md="2" class="d-flex mt-2 mt-sm-0">
                                <hf-buttons name="Authenticate" style="width: 100%"
                                    @executeAction="authenticateService"></hf-buttons>
                            </b-col>

                            <b-col cols="12" sm="2" md="2">
                                <!-- this should be link button -->
                                 <b-button variant="outline-danger" style="width: 100%" @click="logout">Logout</b-button>
                            </b-col>
                        </b-row>
                        
                        <b-row align="start" no-gutters v-if="accessToken != ''">
                            <p class="text-subtitle-2 text-muted mb-2">
                                Enter a valid <strong>Company ID</strong> to initiate the KYB verification workflow.
                            </p>
                            <b-col cols="12" sm="8" md="8">
                                <b-form-input v-model="companyId"
                                    placeholder="e.g. 69afa3d8a4976d9c9e4671a7..."
                                    class="mono-text mr-sm-4" @keyup.enter="fetchCompany"></b-form-input>
                            </b-col>

                            <b-col cols="12" sm="2" md="2" class="d-flex mt-2 mt-sm-0">
                                <hf-buttons name="Fetch Details" style="width: 100%"
                                    @executeAction="fetchCompany"></hf-buttons>
                            </b-col>

                            <b-col cols="12" sm="2" md="2">
                                <!-- this should be link button -->
                                 <b-button variant="outline-danger" style="width: 100%" @click="clearCompany">Clear</b-button>
                            </b-col>
                        </b-row>
                    </div>
                </div>
            </b-col>
        </b-row>

        <!-- Global status alert - always visible for all operations -->

        <b-row v-if="company">
            <b-col cols="12" lg="4">
                <div class="overview-container mb-4">
                    <div class="header-row d-flex justify-space-between align-center">
                        <h2 class="title mb-0">Company Profile</h2>
                        <span class="badge badge-primary font-weight-bold">{{ company.status }}</span>
                    </div>

                    <div class="pa-2">
                        <div class="mb-4">
                            <label class="input-label">Legal Name</label>
                            <p class="font-weight-bold mb-0 text-truncate" :title="company.name">{{ company.name }}</p>
                        </div>
                        <b-row dense>
                            <b-col cols="5">
                                <label class="input-label">Jurisdiction</label>
                                <p class="small mb-0">{{ company.countryOfRegistration }}</p>
                            </b-col>
                            <b-col cols="7">
                                <label class="input-label">{{ company.registrationNumberType }}</label>
                                <p class="small mb-0 mono-text cin-number">{{ company.registrationNumber }}</p>
                            </b-col>
                        </b-row>

                        <div class="mt-4">
                            <label class="input-label">Registered Address</label>
                            <div class="warning-box pa-2">
                                <span class="small text-muted address-text">
                                    {{ company.address.street }}, {{ company.address.city }},
                                    {{ company.address.province }} - {{ company.address.postalCode }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="overview-container">
                    <div class="header-row">
                        <h2 class="title">Verification Documents</h2>
                    </div>

                    <div v-for="doc in company.documents" :key="doc.id" class="step-item d-flex mb-3 align-center">
        <div class="step-number"><i class="mdi mdi-file-document" style="color: white !important;"></i></div>
                        <div class="flex-grow-1 overflow-hidden">
                            <p class="small font-weight-bold mb-0 text-truncate">{{ formatDocType(doc.documentType) }}
                            </p>
                            <p class="x-small text-muted mb-0 text-truncate">{{ doc.fileName }}</p>
                        </div>

                        <b-button variant="link" size="sm" @click="downloadDoc(doc)"><i class="mdi mdi-download"></i></b-button>

                    </div>

                </div>

            </b-col>
            <b-col cols="12" lg="8">
                <div class="overview-container h-100">
                    <b-tabs v-model="activeTab" class="mb-4">

                        <b-tab title="1. Registry Check">

                            <div class="p-2">

                                <!-- <p class="text-subtitle-2">Step 1: Verify Business Registration</p> -->

                                <p class="small text-muted mb-2">Manual lookup required for <strong>{{
                                    company.countryOfRegistration }}</strong> in official registry.</p>

                                <b-form-select v-model="form.registry.status" :options="[{text: 'success', value: 'Success'}, {text: 'Fail', value: 'Failed'}]"
                                    class="mb-4"></b-form-select>

                                <div v-if="form.registry.status === 'Failed'">
                                    <b-form-select v-model="form.registry.reason" :options="registryReasons"
                                        class="mb-4"></b-form-select>

                                    <b-form-textarea v-model="form.registry.reasonDetail"
                                        placeholder="Enter detailed findings from the official registry lookup..."
                                        class="mono-text"></b-form-textarea>
                                </div>


                                <div class="d-flex justify-content-between mt-4">
                                    <hf-buttons name="Submit Registry Check"
                                        @executeAction="submitCompliance('registry',  form.registry.status)"></hf-buttons>
                                </div>

                            </div>

                        </b-tab>



                        <b-tab title="2. Adverse Media">

                            <div class="p-2">

                                <div class="warning-box mb-2">

                                    <div class="d-flex justify-content-between align-items-center mb-2">
                                        <span class="font-weight-bold text-orange small uppercase">AI Compliance
                                            Prompt</span>
                                        <b-button variant="link" size="sm" @click="copyToClipboard(adversePrompt)">
                                            <i class="mdi mdi-content-copy mr-1"></i> Copy Prompt
                                        </b-button>
                                    </div>
                                    <pre class="prompt-preview">{{ adversePrompt }}</pre>
                                </div>
                                <b-form-select v-model="form.adverse.status" :options="[{text: 'success', value: 'Success'}, {text: 'Fail', value: 'Failed'}]"
                                    class="mb-4" @change="handleStatusChange('adverse', $event)"></b-form-select>

                                <div v-if="form.adverse.status === 'Failed'">
                                    <!-- <b-form-select removed --> 

                                    <b-form-textarea v-model="form.adverse.reasonDetail"
                                        placeholder="Paste the Markdown output from the AI here..."
                                        class="mono-text"></b-form-textarea>
                                </div>
                                <div class="d-flex justify-content-end">
                                    <hf-buttons name="Submit Adverse Check"
                                        @executeAction="submitCompliance('adverse-media', form.adverse.status)"></hf-buttons>
                                </div>

                            </div>

                        </b-tab>



                        <b-tab title="3. Sanction List">

                            <div class="p-2">

                                <div class="warning-box mb-2">

                                    <div class="d-flex justify-content-between align-items-center mb-2">

                                        <span class="font-weight-bold text-orange small uppercase">AI Sanction
                                            Prompt</span>

                                        <b-button variant="link" size="sm" @click="copyToClipboard(sanctionPrompt)">

                                            <i class="mdi mdi-content-copy mr-1"></i> Copy Prompt

                                        </b-button>

                                    </div>

                                    <pre class="prompt-preview">{{ sanctionPrompt }}</pre>

                                </div>


                            <b-form-select v-model="form.sanction.status" :options="[{text: 'success', value: 'Success'}, {text: 'Fail', value: 'Failed'}]"
                                class="mb-4"
                                @change="handleStatusChange('sanction', $event)"></b-form-select>

                                <div v-if="form.sanction.status === 'Failed'">
                                    <!-- sanction reason removed -->

                                    <b-form-textarea v-model="form.sanction.reasonDetail"
                                        placeholder="Paste the JSON 'detail' field from the AI here..."
                                        class="mono-text"></b-form-textarea>
                                </div>      



                                <div class="d-flex justify-content-end">

                                    <hf-buttons name="Submit Sanction Check"
                                        @executeAction="submitCompliance('sanctionlist', form.sanction.status)"></hf-buttons>

                                </div>

                            </div>

                        </b-tab>

                    </b-tabs>
                    <hr>
                    <div class="text-center p-2">
                        <p class="small text-muted mb-2">Complete all steps above before finalizing the company status.
                        </p>
                        <b-button block variant="dark" class="finalize-btn font-weight-bold"
                            @click="finalizeCompany">
                            <span>Finalize KYB Review</span>
                        </b-button>
                    </div>
                </div>

            </b-col>
        </b-row>
    </div>
</template>

<style scoped>
/* Inherited Theme Styles */

.overview-container {

    padding: 1.5rem;

    background-color: #f9fafb;

    border-radius: 0.75rem;

    border: 1px solid #e5e7eb;

}



.header-row {
    margin-bottom: 1.25rem;
}



.title {

    font-size: 0.875rem;

    font-weight: 700;

    color: #111827;

    text-transform: uppercase;

    letter-spacing: 0.05em;

}



.input-label {

    display: block;

    font-size: 0.7rem;

    font-weight: 700;

    color: #64748b;

    text-transform: uppercase;

    margin-bottom: 2px;

}



.warning-box {

    background-color: #fff7ed;

    border: 1px solid #ffedd5;

    border-radius: 8px;

    padding: 1rem;

}



.text-orange {
    color: #c2410c;
}

.uppercase {
    text-transform: uppercase;
}



.step-number {

    background: #111827;

    color: white;

    width: 20px;

    height: 20px;

    min-width: 20px;

    min-height: 20px;

    flex-shrink: 0;

    border-radius: 50%;

    display: flex;

    align-items: center;

    justify-content: center;

    font-size: 0.65rem;

    margin-right: 12px;

}



/* Custom Prompt Area */

.prompt-preview {

    font-family: 'JetBrains Mono', monospace;

    font-size: 0.75rem;

    max-height: 120px;

    overflow-y: auto;

    color: #475569;

    white-space: pre-wrap;

}



.mono-text {

    font-family: 'JetBrains Mono', monospace !important;

    font-size: 0.85rem !important;

}



.x-small {
    font-size: 0.7rem;
}
</style>
<script>
import UtilsMixin from '../../../mixins/utils.js';
import HfButtons from '../../../components/element/HfButtons.vue';
import { mapActions } from 'vuex/dist/vuex.common.js';
import {mapGetters} from 'vuex';
import config from "../../../config.js";
import EventBus from '../../../eventbus';

export default {
    name: 'KYBVerification',
    mixins: [UtilsMixin],
    components: { HfButtons },
    data() {
        return {
            isLoading: false,
            downloadingDocId: null,
            activeTab: 0,
            companyId: '',
            serviceId: '', 
            accessToken:'',
            company: null, // Populate this from the fetch method
            isSubmitting: false,
            form: {
                registry: { reasonDetail: '', reason: '', status: 'Success' },
                adverse: { reasonDetail: '', reason: '',status: 'Success' },
                sanction: { reasonDetail: '', reason: '',status: 'Success' }
            },
        }
    },
    computed: {
        ...mapGetters('mainStore', ['getAppsWithKYCServices']),
        adversePrompt() {
            if (!this.company) return '';

            // Extract names from shareholders and add the representative
            const shareholderNames = this.company.shareholders.map(s => s.name);
            if (this.company.representative && this.company.representative.name) {
                shareholderNames.push(this.company.representative.name);
            }
            const keyIndividuals = shareholderNames.join(', ');

            return `You are an AI compliance analyst.
        Task: Perform an adverse media check for the following entity (fields may be missing):
        - Company Name: ${this.company.name}
        - Registration Number: ${this.company.registrationNumber || 'Not Available'}
        - Key Individuals (Directors, Shareholders, UBOs): ${keyIndividuals || 'Not Available'}

        Search scope:
        - Internet, global & local news sites, regulatory announcements, trusted blogs, and public records.
        - Prioritize authoritative sources (major news outlets, regulator sites, court records, well-known compliance providers).
        - Use registration number, jurisdiction, job/role, and other identifiers when available to reduce false positives.

        Output rules (MANDATORY):
        1. **Output ONLY raw Markdown text.** Do NOT include any explanation, commentary, metadata, or code fences. The entire response must be a single Markdown-formatted string.
        2. List up to **10** most relevant adverse media findings as Markdown bullets (- ). Sort newest/most relevant first.
        3. **Each bullet must follow this exact format** (use ISO date YYYY-MM-DD):
        - **Title** – Source, YYYY-MM-DD. One-line summary (max 25 words). [Read more](https://full.absolute.url)
        Example:
        - **XYZ Corp fined for tax evasion** – Financial Times, 2023-07-10. Fined $5M for misreporting taxes. [Read more](https://ft.com/example)
        4. After the bullet list, add one blank line, then a single line for overall risk:
        **Overall Risk Level:** Low / Medium / High
        5. If no adverse media is found, output exactly (as raw markdown):
        **No adverse media found.**
        6. Links must be full absolute URLs (https://...). Dates must be YYYY-MM-DD. Summaries must be concise (≤ 25 words).
        7. Do not include internal source IDs, JSON, or any other non-markdown content.

        Risk guidance (use to decide Low/Medium/High):
        - **High**: criminal charges, sanctions, regulatory enforcement, major fines, or ongoing legal prosecution.
        - **Medium**: lawsuits, credible allegations, sizable negative investigations or repeated regulatory notices.
        - **Low**: minor disputes, historical/old negative press with no legal/regulatory consequence, or low-credibility mentions.

        Produce the output now in raw Markdown only.`;
        },
        sanctionPrompt() {
            if (!this.company) return '';

            const entityName = this.company.name;
            const registrationNumber = this.company.registrationNumber;

            return `You are an AI compliance analyst. Check whether the provided entity or individual appears on these official sanction lists:

* OFAC SDN List (USA) – https://sanctionssearch.ofac.treas.gov/
* EU Sanctions List – https://www.sanctionsmap.eu/
* UN Security Council (UNSC) Sanctions List – https://main.un.org/securitycouncil/en/content/un-sc-consolidated-list
* UK HM Treasury Sanctions List – https://www.gov.uk/government/publications/the-uk-sanctions-list
* Australia DFAT Sanctions List – https://www.dfat.gov.au/international-relations/security/sanctions/consolidated-list

### Input
* Name: ${entityName}
* Registration Number (if available): ${registrationNumber || "N/A"}

### Mandatory matching rules
1. Normalize names for both query and list entries: Unicode NFKC, trim whitespace, collapse runs of internal whitespace to single spaces, convert to lowercase, remove punctuation except spaces and & or -.
2. A match is valid only if:
   * The normalized list-entry equals the normalized query exactly, ignoring only standard legal-form differences (Co, Ltd, LLC, SA, GmbH, etc.), OR
   * The normalized query exactly matches one of the official aliases / AKA names listed for that entry.
3. Do NOT accept partial substring matches that only match some tokens.
4. If a registration number is provided, it must exactly equal the registration number on the same sanction-list entry.
5. Do NOT return fuzzy, inferred, or near-miss matches.

### Output requirements
Return ONLY the result content.

- If matches are found, generate up to 10 Markdown bullets.  
  Format for each bullet (strictly):  
  - **Entity Name** – Source List, YYYY-MM-DD. One-line summary (max 25 words). [Read more](https://full.absolute.url)  
- Sort bullets newest → oldest.  
- Use full absolute URLs.
- Dates must be YYYY-MM-DD.

If no matches, return exactly:
 "Entity ${entityName} not found in the sanction list."
`;
        },
        registryReasons() {
            return [
                { text: 'Company Details Mismatch', value: 'COMPANY_FIELDS_MISMATCH' },
                { text: 'Company is Inactive', value: 'COMPANY_INACTIVE' },
                { text: 'Company Not Found in Registry', value: 'COMPANY_NOT_FOUND_REGISTRY' }
            ];
        },
       adverseReason() {
          return 'COMPANY_ADVERSE_MEDIA_FOUND'
        },
        sanctionReason() {
           return 'COMPANY_SANCTION_LIST_FOUND'
        }
    },
    methods: {
     ...mapActions('mainStore', ['fetchAppKybById','keepAccessTokenReadyForApp','submitComplianceDetail','finalizeCompanyReview','downloadKybUploadedFile']),
        async downloadDoc(doc) {
            this.downloadingDocId = doc.id;
            try {
                const blob = await this.downloadKybUploadedFile({ fileId: doc.id });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = doc.fileName || `${doc.documentType || 'document'}`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                URL.revokeObjectURL(url);
            } catch (e) {
                this.notifyErr(e.message || 'Failed to download document.');
            } finally {
                this.downloadingDocId = null;
            }
        },
        formatDocType(t) { return t.replace(/([A-Z])/g, ' $1'); },
        async fetchCompany() {
            if (!this.accessToken) {
                this.showFeedback("Please authenticate first", true);
                return;
            }
            if (!this.companyId) {
                this.showFeedback("Please fill in all required fields.", true);
                return;
            }
            this.$store.commit('mainStore/setSelectedAppId', this.serviceId);
            this.isLoading = true;
            this.statusMessage = '';
            try {
                this.company = await this.fetchAppKybById({ companyId: this.companyId, accessToken: this.accessToken, serviceId: this.serviceId });
            } catch(e) {
                const errorMsg = e.response?.data?.message || e.message || "Fetch failed.";
                this.notifyErr(errorMsg);
            } finally {
                this.isLoading = false;
            }
        },
      
        async submitCompliance(type, status) {
            if (this.isSubmitting) return;
            this.isSubmitting = true;
            if (!this.serviceId) {
                this.notifyErr("Please select a KYC service first.");
                this.isSubmitting = false;
                return;
            }
            if (!this.companyId) {
                this.notifyErr("Please fetch a company first.");
                this.isSubmitting = false;
                return;
            }
            const formKey = type === 'adverse-media' ? 'adverse' : type === 'sanctionlist' ? 'sanction' : type;
            const formData = this.form[formKey];
            if (status === 'Failed') {
                if (!formData.reasonDetail.trim()) {
                    this.notifyErr("Please provide details.");
                    this.isSubmitting = false;
                    return;
                }
            }
            try {
                const payload = {
                    companyId: this.companyId,
                    type,
                    status,
                    accessToken: this.accessToken,
                    serviceId: this.serviceId,
                };
                if (status === 'Failed') {
                    payload.reasonDetail = formData.reasonDetail;
                    if (formData.reason) payload.reason = formData.reason;
                }
                this.isLoading = true;
                await this.submitComplianceDetail(payload);
                this.notifySuccess(`${type} compliance submitted successfully.`);
            } catch (error) {
                this.notifyErr(`Error submitting ${type} compliance: ${error.message}`);
            } finally {
                this.isSubmitting = false;
                this.isLoading = false;
            }
        },
        async finalizeCompany() {
            if (!this.accessToken) {
                this.notifyErr("Please authenticate first");
                return;
            }
            if (!this.companyId) {
                this.notifyErr("Please fill in all required fields.");
                return;
            }
            this.isLoading = true;
            try {
                const data = await this.finalizeCompanyReview({ companyId: this.companyId, accessToken: this.accessToken, status: "Completed", serviceId: this.serviceId });
                if (data && data.success) {
                    this.notifySuccess(`Company verified and finalized successfully!`);
                } else {
                    throw new Error(
                        data?.error?.details?.[0] ||
                        data?.message ||
                        "Failed to finalize company review"
                    );
                }
            } catch(e) {
                const errorMsg =
                    e.response?.data?.error?.details?.[0] ||
                    e.response?.data?.message ||
                    e.message ||
                    "Request failed.";
                this.notifyErr(errorMsg);
            } finally {
                this.isLoading = false;
            }
        },
        copyToClipboard(value) {
            navigator.clipboard.writeText(value);
            this.notifySuccess('Prompt copied to clipboard!');
        },
        clearCompany(){
            this.companyId = ''
            this.serviceId = '' // Clear selected app
            this.company = null,
              this.form = {
                registry: { reasonDetail: '', reason: '', status: '' },
                adverse: { reasonDetail: '', reason: '',status: '' },
                sanction: { reasonDetail: '', reason: '',status: '' }
            }
        },
        logout(){
            EventBus.$emit("logoutAll");
            },
        
        showFeedback(msg, isErr = false) {
            if (isErr) {
                this.notifyErr(msg);
            } else {
                this.notifySuccess(msg);
            }
        },
        async authenticateService() {
            if (!this.serviceId) {
                this.notifyErr("Please select a KYC service.");
                return;
            }
            this.isLoading = true;
            try {
                const data = await this.keepAccessTokenReadyForApp({
                    serviceId: this.serviceId,
                    grant_type: config.GRANT_TYPES_ENUM['CAVACH_KYB_API'],
                });
                if (data && data.access_token) {
                    this.accessToken = data.access_token;
                    this.notifySuccess("Authentication successful! You can now fetch company details.");
                } else {
                    this.notifyErr("Authentication failed. Please try again.");
                }
            } catch(e) {
                this.notifyErr(e.message || "Authentication failed.");
            } finally {
                this.isLoading = false;
            }
        },
          handleStatusChange(type, value) {
            const reasons = {
            adverse: this.adverseReason,
            sanction: this.sanctionReason
            };
            this.form[type].reason = value === 'Failed' ? reasons[type] : null;
        }
    }
}
</script>