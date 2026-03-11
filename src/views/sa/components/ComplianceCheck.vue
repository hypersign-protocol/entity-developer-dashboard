<template>

    <v-container>

        <load-ing :active.sync="isLoading" :can-cancel="true" :is-full-page="true"></load-ing>


         <v-row  class="d-flex justify-start align-center" >
            <v-col cols="12" >
                <div class="overview-container">
                    <div class="header-row">
                        <h2 class="title">Retrieve Case File</h2>
                    </div>
                    <div>
                        <p class="text-subtitle-2 text-muted mb-2">
                            Enter <strong>Service ID</strong> and Authenticate.
                        </p>
                        <v-row align="start" no-gutters class="mb-4">
                             <v-col cols="12" sm="8" md="8">
                                <v-text-field v-model="serviceId" label="Service ID"
                                    placeholder="e.g. 68afa3d8a4975d9c9e4671a7..." outlined dense color="primary"
                                    class="mono-text mr-sm-4" @keyup.enter="authenticateService" hide-details></v-text-field>
                            </v-col>

                            <v-col cols="12" sm="2" md="2" class="d-flex mt-2 mt-sm-0">
                                <hf-buttons name="Authenticate" style="width: 100%"
                                    @executeAction="authenticateService"></hf-buttons>
                            </v-col>

                            <v-col cols="12" sm="2" md="2">
                                <!-- this should be link button -->
                                 <v-btn color="error" text style="width: 100%" @click="logout">Logout</v-btn>
                            </v-col>
                        </v-row>
                        <p class="text-subtitle-2 text-muted mb-2">
                            Enter a valid <strong>Company ID</strong> to initiate the KYB verification workflow.
                        </p>
                        <v-row align="start" no-gutters>
                            <v-col cols="12" sm="8" md="8">
                                <v-text-field v-model="companyId" label="Company ID"
                                    placeholder="e.g. 69afa3d8a4976d9c9e4671a7..." outlined dense color="primary"
                                    class="mono-text mr-sm-4" @keyup.enter="fetchCompany" hide-details></v-text-field>
                            </v-col>

                            <v-col cols="12" sm="2" md="2" class="d-flex mt-2 mt-sm-0">
                                <hf-buttons name="Fetch Details" style="width: 100%"
                                    @executeAction="fetchCompany"></hf-buttons>
                            </v-col>

                            <v-col cols="12" sm="2" md="2">
                                <!-- this should be link button -->
                                 <v-btn color="error" text style="width: 100%" @click="clearCompany">Clear</v-btn>
                            </v-col>
                        </v-row>
                    </div>
                </div>
            </v-col>
        </v-row>
        <v-row v-if="company">
            <v-col cols="12" lg="4">
                <div class="overview-container mb-4">
                    <div class="header-row d-flex justify-space-between align-center">
                        <h2 class="title mb-0">Company Profile</h2>
                        <v-chip x-small color="primary" outlined class="font-weight-bold">{{ company.status }}</v-chip>
                    </div>

                    <div class="pa-2">
                        <div class="mb-4">
                            <label class="input-label">Legal Name</label>
                            <p class="font-weight-bold mb-0 text-truncate" :title="company.name">{{ company.name }}</p>
                        </div>
                        <v-row dense>
                            <v-col cols="5">
                                <label class="input-label">Jurisdiction</label>
                                <p class="small mb-0">{{ company.countryOfRegistration }}</p>
                            </v-col>
                            <v-col cols="7">
                                <label class="input-label">{{ company.registrationNumberType }}</label>
                                <p class="small mb-0 mono-text cin-number">{{ company.registrationNumber }}</p>
                            </v-col>
                        </v-row>

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
                        <div class="step-number"><v-icon x-small color="white">mdi-file-document</v-icon></div>
                        <div class="flex-grow-1 overflow-hidden">
                            <p class="small font-weight-bold mb-0 text-truncate">{{ formatDocType(doc.documentType) }}
                            </p>
                            <p class="x-small text-muted mb-0 text-truncate">{{ doc.fileName }}</p>
                        </div>

                        <v-btn icon x-small color="primary" @click="viewDoc(doc)">
                            <v-icon>mdi-eye</v-icon>
                        </v-btn>

                    </div>

                </div>

            </v-col>
            <v-col cols="12" lg="8">
                <div class="overview-container h-100">
                    <v-tabs v-model="activeTab" color="primary" class="mb-4" dense>

                        <v-tab class="text-caption font-weight-bold">1. Registry Check</v-tab>

                        <v-tab class="text-caption font-weight-bold">2. Adverse Media</v-tab>

                        <v-tab class="text-caption font-weight-bold">3. Sanction List</v-tab>

                    </v-tabs>
                    <v-tabs-items v-model="activeTab">

                        <v-tab-item>

                            <div class="p-2">

                                <!-- <p class="text-subtitle-2">Step 1: Verify Business Registration</p> -->

                                <p class="small text-muted mb-2">Manual lookup required for <strong>{{
                                    company.countryOfRegistration }}</strong> in official registry.</p>


                                <v-textarea v-model="form.registry.reasonDetail" label="Registry Verification Remarks"
                                    placeholder="Enter detailed findings from the official registry lookup..." outlined
                                    dense></v-textarea>



                                <div class="d-flex justify-space-between mt-4">
                                    <hf-buttons name="Confirm & Pass"
                                        @executeAction="submitCompliance('registry', 'success')"></hf-buttons>
                                    <v-btn color="error" text @click="submitCompliance('registry', 'failed')">Reject
                                        Entity</v-btn>
                                </div>

                            </div>

                        </v-tab-item>



                        <v-tab-item>

                            <div class="p-2">

                                <div class="warning-box mb-2">

                                    <div class="d-flex justify-space-between align-center mb-2">
                                        <span class="font-weight-bold text-orange small uppercase">AI Compliance
                                            Prompt</span>
                                        <v-btn x-small color="primary" text @click="copyToClipboard(adversePrompt)">
                                            <v-icon x-small class="mr-1">mdi-content-copy</v-icon> Copy Prompt
                                        </v-btn>
                                    </div>
                                    <pre class="prompt-preview">{{ adversePrompt }}</pre>
                                </div>
                                <v-textarea v-model="form.adverse.reasonDetail" label="Adverse Media Results"
                                    placeholder="Paste the Markdown output from the AI here..." outlined dense
                                    class="mono-text"></v-textarea>
                                <div class="d-flex justify-end">
                                    <hf-buttons name="Submit Adverse Check"
                                        @executeAction="submitCompliance('adverse-media', 'success')"></hf-buttons>
                                </div>

                            </div>

                        </v-tab-item>



                        <v-tab-item>

                            <div class="p-2">

                                <div class="warning-box mb-2">

                                    <div class="d-flex justify-space-between align-center mb-2">

                                        <span class="font-weight-bold text-orange small uppercase">AI Sanction
                                            Prompt</span>

                                        <v-btn x-small color="primary" text @click="copyToClipboard(sanctionPrompt)">

                                            <v-icon x-small class="mr-1">mdi-content-copy</v-icon> Copy Prompt

                                        </v-btn>

                                    </div>

                                    <pre class="prompt-preview">{{ sanctionPrompt }}</pre>

                                </div>



                                <v-textarea v-model="form.sanction.reasonDetail" label="Sanction List JSON Detail"
                                    placeholder="Paste the JSON 'detail' field from the AI here..." outlined dense
                                    class="mono-text"></v-textarea>



                                <div class="d-flex justify-end">

                                    <hf-buttons name="Submit Sanction Check"
                                        @executeAction="submitCompliance('sanctionlist', 'success')"></hf-buttons>

                                </div>

                            </div>

                        </v-tab-item>

                    </v-tabs-items>
                    <v-divider class="my-2"></v-divider>
                    <div class="text-center p-2">
                        <p class="small text-muted mb-2">Complete all steps above before finalizing the company status.
                        </p>
                        <v-btn block x-large depressed color="#111827" class="finalize-btn font-weight-bold"
                            @click="finalizeCompany">

                            <span style="color: white;">Finalize KYB Review</span>

                        </v-btn>

                    </div>
                </div>

            </v-col>
        </v-row>

       
    </v-container>

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

    background: #3b82f6;

    color: white;

    width: 20px;

    height: 20px;

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
            statusMessage: '',
            activeTab: 0,
            companyId: '',
            serviceId: '', 
            accessToken:'',
            company: null, // Populate this from the fetch method
            form: {
                registry: { reasonDetail: '' },
                adverse: { reasonDetail: '' },
                sanction: { reasonDetail: '' }
            },
        }
    },
    computed: {
        ...mapGetters('mainStore', ['getAppsWithKYCServices']),
        kycApps() {
            const data = this.getAppsWithKYCServices;
            // Transform to v-select format
            return data.map(app => ({
                text: app.name || app.appId, 
                value: app.appId
            }));
        },
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
Return exactly one JSON object (no surrounding text) with detail fields:
{
  "detail": "/* a single string containing up to 10 Markdown bullets separated by \\n. Each bullet EXACTLY: - **Entity Name** – Source List, YYYY-MM-DD. One-line summary (max 25 words). [Read more](https://full.absolute.url) */"
}

Instructions for generating \`detail\`:
- If matches are found, generate up to 10 Markdown bullets.  
  Format for each bullet (strictly):  
  - **Entity Name** – Source List, YYYY-MM-DD. One-line summary (max 25 words). [Read more](https://full.absolute.url)  
- Sort bullets newest → oldest.  
- Escape line breaks (\\n) and quotes so the Markdown fits into the JSON string.  

If no matches, return exactly:
{
  "detail": "Entity ${entityName} not found in the sanction list."
}`;
        }
    },
    methods: {
    ...mapActions('mainStore', ['fetchAppKybById','keepAccessTokenReadyForApp']),
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
            // Set the selected app
            this.$store.commit('mainStore/setSelectedAppId', this.serviceId);
            
            try{
                this.company= await this.fetchAppKybById({companyId: this.companyId, accessToken:this.accessToken});
            }catch(e){
                const errorMsg = e.response?.data?.message || e.message || "Fetch failed.";
                this.showFeedback(`Error: ${errorMsg}`, true);
            }finally {
              this.loading = false;
         }
           
        },
      
        async submitCompliance(type, status) {
            console.log({ type, status })
            // Logic for POST api/v1/e-kyb/verification/compliance?type={type}
        },
        async finalizeCompany() {
            // Logic for PATCH api/v1/e-kyb/verification/company/{id}
        },
        copyToClipboard(value) {
            navigator.clipboard.writeText(value);
            this.notifySuccess('Prompt copied to clipboard!');
        },
        clearCompany(){
            this.companyId = ''
            this.serviceId = '' // Clear selected app
            this.company = null
        },
           logout(){
            EventBus.$emit("logoutAll");
            },
        },
        showFeedback(msg, isErr = false) {
            this.statusMessage = msg;
            this.isError = isErr;
        },
        async authenticateService(){
            if (!this.serviceId) {
                this.showFeedback("Please select a KYC service.", true);
                return;
            }
            const data= await this.keepAccessTokenReadyForApp({
              serviceId: this.serviceId,
              grant_type: config.GRANT_TYPES_ENUM['CAVACH_KYB_API'],
            });
             if(data && data.access_token){
                this.accessToken=data.access_token;
                this.showFeedback("Authentication successful! You can now fetch company details.");
             }else{
                this.showFeedback("Authentication failed. Please try again.", true);
             }
        }
    }
</script>