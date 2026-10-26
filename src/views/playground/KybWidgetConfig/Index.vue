<template>
  <b-container fluid class="py-3" :class="isContainerShift ? 'homeShift' : 'home'">
    <load-ing :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></load-ing>
    
    <AccessDenied v-if="accessDenied" />
    <template v-if="!accessDenied">
    <div class="editor-header">
      <div>
        <h4 class="mb-1 font-weight-bold">Business Widget Configuration</h4>
        <p class="text-muted small mb-0">Configure the business widget for your application</p>
      </div>
      <HfButtons
        variant="primary"
        iconClass="mdi mdi-content-save-outline"
        :name="kybWidgetConfigTemp._id ? 'Update Configuration' : 'Save Configuration'"
        @executeAction="kybWidgetConfigTemp._id ? updateConfiguration() : saveConfiguration()"
      />
    </div>

    <div class="serviceCard">
      <nav class="configuration-tabs" role="tablist" aria-label="Business widget configuration sections">
        <button
          v-for="tab in tabs"
          :key="tab"
          type="button"
          role="tab"
          class="configuration-tab"
          :class="{ active: activeTab === tab }"
          :aria-selected="activeTab === tab ? 'true' : 'false'"
          @click="activeTab = tab"
        >
          {{ tab }}
          <span v-if="tab === 'Company Details' && companyFieldIssues.length" class="tab-issue-dot" aria-label="Needs attention"></span>
        </button>
      </nav>
      <ul class="list-group list-group-flush">

        <li v-show="activeTab === 'Branding'" class="list-group-item p-4">
          <div class="row mx-0">
            <div class="col-md-4 d-flex flex-column align-items-center justify-content-center border-right">
              <label class="text-muted small font-weight-bold mb-3">LOGO PREVIEW</label>
              <div class="logo-display-container">
                <img v-if="kybWidgetConfigTemp.branding.logoUrl" :src="kybWidgetConfigTemp.branding.logoUrl"
                  class="img-fluid rounded" style="max-height: 80px; object-fit: contain;">
                <div v-else class="text-muted small font-italic">No logo uploaded</div>
              </div>
            </div>

            <div class="col-md-8 pl-md-4">
              <div class="form-group mb-4">
                <label><strong>Business Name</strong></label>
                <b-form-input v-model="kybWidgetConfigTemp.branding.businessName" placeholder="e.g. Acme Corp" class="mb-1"></b-form-input>
                <small class="text-muted">{{ kybWidgetConfigUI.branding.businessName.description }}</small>
              </div>

              <div class="form-group mb-0">
                <label><strong>Widget Description</strong></label>
                <b-form-textarea v-model="kybWidgetConfigTemp.branding.title" placeholder="Enter widget title" rows="3" class="mb-1"></b-form-textarea>
                <small class="text-muted">{{ kybWidgetConfigUI.branding.title.description }}</small>
              </div>
            </div>
          </div>
        </li>

        <li v-show="activeTab === 'Document Collection'" class="list-group-item p-3">
          <div class="row mx-0">
            <div class="col-md-6 p-2">
              <div class="config-card toggle-card" :class="{ 'is-enabled': kybWidgetConfigTemp.collectCertOfIncorporationDoc }">
                <span class="toggle-icon" aria-hidden="true"><v-icon small>mdi-domain</v-icon></span>
                <div class="toggle-body">
                  <label class="font-weight-bold mb-1">{{ kybWidgetConfigUI.collectCertOfIncorporationDoc.label }}</label>
                  <small class="text-muted d-block" v-html="kybWidgetConfigUI.collectCertOfIncorporationDoc.description"></small>
                </div>
                <b-form-checkbox switch v-model="kybWidgetConfigTemp.collectCertOfIncorporationDoc" @change="onIdentifierDocumentToggle('collectCertOfIncorporationDoc', $event)"></b-form-checkbox>
              </div>
            </div>
            <div class="col-md-6 p-2">
              <div class="config-card toggle-card" :class="{ 'is-enabled': kybWidgetConfigTemp.collectTaxRegistrationDoc }">
                <span class="toggle-icon" aria-hidden="true"><v-icon small>mdi-receipt-text-outline</v-icon></span>
                <div class="toggle-body">
                  <label class="font-weight-bold mb-1">{{ kybWidgetConfigUI.collectTaxRegistrationDoc.label }}</label>
                  <small class="text-muted d-block">{{ kybWidgetConfigUI.collectTaxRegistrationDoc.description }}</small>
                </div>
                <b-form-checkbox switch v-model="kybWidgetConfigTemp.collectTaxRegistrationDoc" @change="onIdentifierDocumentToggle('collectTaxRegistrationDoc', $event)"></b-form-checkbox>
              </div>
            </div>
            <div class="col-md-6 p-2">
              <div class="config-card toggle-card" :class="{ 'is-enabled': kybWidgetConfigTemp.collectAddressProofDoc }">
                <span class="toggle-icon" aria-hidden="true"><v-icon small>mdi-map-marker-outline</v-icon></span>
                <div class="toggle-body">
                  <label class="font-weight-bold mb-1">{{ kybWidgetConfigUI.collectAddressProofDoc.label }}</label>
                  <small class="text-muted d-block" v-html="kybWidgetConfigUI.collectAddressProofDoc.description"></small>
                </div>
                <b-form-checkbox switch v-model="kybWidgetConfigTemp.collectAddressProofDoc"></b-form-checkbox>
              </div>
            </div>
            <div class="col-md-6 p-2">
              <div class="config-card toggle-card" :class="{ 'is-enabled': kybWidgetConfigTemp.collectPowerOfAttorneyDoc }">
                <span class="toggle-icon" aria-hidden="true"><v-icon small>mdi-file-sign</v-icon></span>
                <div class="toggle-body">
                  <label class="font-weight-bold mb-1">{{ kybWidgetConfigUI.collectPowerOfAttorneyDoc.label }}</label>
                  <small class="text-muted d-block" v-html="kybWidgetConfigUI.collectPowerOfAttorneyDoc.description"></small>
                </div>
                <b-form-checkbox switch v-model="kybWidgetConfigTemp.collectPowerOfAttorneyDoc"></b-form-checkbox>
              </div>
            </div>
          </div>
        </li>

        <li v-show="activeTab === 'Compliance Checks'" class="list-group-item p-3">
          <div class="row mx-0">
            <div class="col-md-6 p-2">
              <div class="config-card toggle-card" :class="{ 'is-enabled': kybWidgetConfigTemp.checkBusinessRegistry }">
                <span class="toggle-icon" aria-hidden="true"><v-icon small>mdi-bank-outline</v-icon></span>
                <div class="toggle-body">
                  <label class="font-weight-bold mb-1">{{ kybWidgetConfigUI.checkBusinessRegistry.label }}</label>
                  <small class="text-muted d-block" v-html="kybWidgetConfigUI.checkBusinessRegistry.description"></small>
                </div>
                <b-form-checkbox switch v-model="kybWidgetConfigTemp.checkBusinessRegistry"></b-form-checkbox>
              </div>
            </div>

            <div class="col-md-6 p-2">
              <div class="config-card toggle-card" :class="{ 'is-enabled': kybWidgetConfigTemp.checkAmlSanction }">
                <span class="toggle-icon" aria-hidden="true"><v-icon small>mdi-shield-alert-outline</v-icon></span>
                <div class="toggle-body">
                  <label class="font-weight-bold mb-1">{{ kybWidgetConfigUI.checkAmlSanction.label }}</label>
                  <small class="text-muted d-block" v-html="kybWidgetConfigUI.checkAmlSanction.description"></small>
                  <div class="sanction-badge-row mt-2">
                    <span v-for="list in kybWidgetConfigUI.checkAmlSanction.supportedLists" :key="list" class="sanction-badge">
                      {{ list }}
                    </span>
                  </div>
                </div>
                <b-form-checkbox switch v-model="kybWidgetConfigTemp.checkAmlSanction"></b-form-checkbox>
              </div>
            </div>

            <div class="col-md-6 p-2">
              <div class="config-card toggle-card" :class="{ 'is-enabled': kybWidgetConfigTemp.checkAmlPep }">
                <span class="toggle-icon" aria-hidden="true"><v-icon small>mdi-account-tie-outline</v-icon></span>
                <div class="toggle-body">
                  <label class="font-weight-bold mb-1">{{ kybWidgetConfigUI.checkAmlPep.label }}</label>
                  <small class="text-muted d-block" v-html="kybWidgetConfigUI.checkAmlPep.description"></small>
                </div>
                <b-form-checkbox switch v-model="kybWidgetConfigTemp.checkAmlPep"></b-form-checkbox>
              </div>
            </div>

            <div class="col-md-6 p-2">
              <div class="config-card toggle-card" :class="{ 'is-enabled': kybWidgetConfigTemp.checkAmlAdversemedia }">
                <span class="toggle-icon" aria-hidden="true"><v-icon small>mdi-newspaper-variant-outline</v-icon></span>
                <div class="toggle-body">
                  <label class="font-weight-bold mb-1">{{ kybWidgetConfigUI.checkAmlAdversemedia.label }}</label>
                  <small class="text-muted d-block" v-html="kybWidgetConfigUI.checkAmlAdversemedia.description"></small>
                </div>
                <b-form-checkbox switch v-model="kybWidgetConfigTemp.checkAmlAdversemedia"></b-form-checkbox>
              </div>
            </div>
          </div>
        </li>

        <li v-show="activeTab === 'Company Details'" class="list-group-item p-4">
          <div class="fields-header">
            <div>
              <h6 class="fields-title">Company information to collect</h6>
              <p class="fields-subtitle">
                Choose what businesses enter in the widget. Required fields are also enforced by the KYB verification API, so requests without them are rejected.
              </p>
            </div>
            <span class="fields-summary">{{ companyFieldSummary.collected }} collected · {{ companyFieldSummary.required }} required</span>
          </div>

          <div v-if="companyFieldIssues.length" class="fields-alert" role="alert">
            <v-icon small>mdi-alert-circle-outline</v-icon>
            <div>
              <strong>Fix before saving</strong>
              <ul>
                <li v-for="issue in companyFieldIssues" :key="issue">{{ issue }}</li>
              </ul>
            </div>
          </div>

          <section class="field-group">
            <header class="field-group-header">
              <h6>Always collected</h6>
              <p>Every business must provide these.</p>
            </header>
            <ul class="field-list">
              <li v-for="field in alwaysCollectedFields" :key="field.fieldName" class="field-row">
                <div class="field-info">
                  <span class="field-label">{{ field.label }}</span>
                  <span class="field-description">{{ field.description }}</span>
                </div>
                <span class="locked-pill"><v-icon x-small>mdi-lock-outline</v-icon> Required</span>
              </li>
            </ul>
          </section>

          <section v-for="group in companyFieldGroups" :key="group.key" class="field-group">
            <header class="field-group-header">
              <h6>{{ group.title }}</h6>
              <p v-if="group.hint">{{ group.hint }}</p>
            </header>
            <ul class="field-list" :class="{ 'has-issue': group.key === 'identifiers' && !hasRequiredIdentifier }">
              <li v-for="row in group.rows" :key="row.key" class="field-row">
                <div class="field-info">
                  <span class="field-label">{{ row.label }}</span>
                  <span class="field-description">{{ row.description }}</span>
                  <span v-if="row.subFields" class="sub-field-list">
                    <span v-for="subField in row.subFields" :key="subField" class="sub-field-chip">{{ subField }}</span>
                  </span>
                </div>
                <div class="segmented-control" role="radiogroup" :aria-label="`${row.label}: collection setting`">
                  <button
                    v-for="option in companyFieldStateOptions"
                    :key="option.value"
                    type="button"
                    role="radio"
                    class="segment"
                    :class="[`segment-${option.value}`, { active: companyRowState(row) === option.value }]"
                    :aria-checked="companyRowState(row) === option.value ? 'true' : 'false'"
                    @click="setCompanyRowState(row, option.value)"
                  >{{ option.label }}</button>
                </div>
              </li>
            </ul>
          </section>
        </li>

      </ul>
    </div>
    </template>
  </b-container>
</template> 



<style scoped>
.editor-header {
  align-items: center;
  display: flex;
  gap: 24px;
  justify-content: space-between;
  margin-bottom: 18px;
}

.configuration-tabs {
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  gap: 28px;
  margin: 0;
  overflow-x: auto;
  padding: 0 18px;
}

.configuration-tab {
  background: transparent;
  border: 0;
  border-bottom: 2px solid transparent;
  color: #64748b;
  cursor: pointer;
  font-size: 13px;
  padding: 14px 2px 12px;
  white-space: nowrap;
}

.configuration-tab.active {
  border-bottom-color: #2563eb;
  color: #2563eb;
  font-weight: 600;
}

.configuration-tab:focus {
  outline: none;
}

.configuration-tab:focus-visible {
  border-radius: 4px;
  box-shadow: 0 0 0 2px #bfdbfe;
}

.tab-issue-dot {
  background: #dc2626;
  border-radius: 50%;
  display: inline-block;
  height: 6px;
  margin-left: 4px;
  vertical-align: middle;
  width: 6px;
}

.config-card {
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  height: 100%;
  padding: 15px;
}

/* Toggle cards (documents and compliance checks) */
.toggle-card {
  align-items: flex-start;
  display: flex;
  gap: 12px;
}

.toggle-icon {
  align-items: center;
  background: #f1f5f9;
  border-radius: 8px;
  display: inline-flex;
  flex: 0 0 auto;
  height: 36px;
  justify-content: center;
  transition: background-color 0.15s ease;
  width: 36px;
}

.toggle-icon >>> .v-icon {
  color: #94a3b8 !important;
  transition: color 0.15s ease;
}

.toggle-card.is-enabled .toggle-icon {
  background: #eff6ff;
}

.toggle-card.is-enabled .toggle-icon >>> .v-icon {
  color: #2563eb !important;
}

.toggle-body {
  flex: 1;
  min-width: 0;
}

/* Company fields */
.fields-header {
  align-items: flex-start;
  display: flex;
  gap: 16px;
  justify-content: space-between;
  margin-bottom: 20px;
}

.fields-title {
  color: #111827;
  font-size: 15px;
  font-weight: 700;
  margin: 0 0 4px;
}

.fields-subtitle {
  color: #64748b;
  font-size: 13px;
  line-height: 1.5;
  margin: 0;
  max-width: 640px;
}

.fields-summary {
  background: #f1f5f9;
  border-radius: 999px;
  color: #475569;
  flex: 0 0 auto;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  white-space: nowrap;
}

.fields-alert {
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #991b1b;
  display: flex;
  font-size: 13px;
  gap: 10px;
  margin-bottom: 20px;
  padding: 12px 14px;
}

.fields-alert >>> .v-icon {
  align-self: flex-start;
  color: inherit !important;
  margin-top: 1px;
}

.fields-alert ul {
  margin: 4px 0 0;
  padding-left: 18px;
}

.field-group + .field-group {
  margin-top: 24px;
}

.field-group-header {
  margin-bottom: 8px;
}

.field-group-header h6 {
  color: #64748b;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.05em;
  margin: 0;
  text-transform: uppercase;
}

.field-group-header p {
  color: #94a3b8;
  font-size: 12px;
  margin: 2px 0 0;
}

.field-list {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.field-list.has-issue {
  border-color: #fca5a5;
}

.field-row {
  align-items: center;
  display: flex;
  gap: 16px;
  justify-content: space-between;
  padding: 12px 16px;
}

.field-row + .field-row {
  border-top: 1px solid #f1f5f9;
}

.field-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.field-label {
  color: #111827;
  font-size: 13px;
  font-weight: 600;
}

.field-description {
  color: #64748b;
  font-size: 12px;
  line-height: 1.45;
}

.sub-field-list {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 6px;
}

.sub-field-chip {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  color: #475569;
  font-size: 11px;
  font-weight: 600;
  padding: 1px 6px;
}

.locked-pill {
  align-items: center;
  color: #64748b;
  display: inline-flex;
  flex: 0 0 auto;
  font-size: 12px;
  font-weight: 600;
  gap: 4px;
}

.locked-pill >>> .v-icon {
  color: inherit !important;
}

.segmented-control {
  background: #f1f5f9;
  border-radius: 8px;
  display: inline-flex;
  flex: 0 0 auto;
  gap: 2px;
  padding: 3px;
}

.segment {
  background: transparent;
  border: 0;
  border-radius: 6px;
  color: #64748b;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  min-width: 72px;
  padding: 5px 10px;
}

.segment:hover:not(:disabled):not(.active) {
  color: #111827;
}

.segment:focus {
  outline: none;
}

.segment:focus-visible {
  box-shadow: 0 0 0 2px #bfdbfe;
}

.segment.active {
  background: #ffffff;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.12);
  color: #111827;
}

.segment-required.active {
  color: #1d4ed8;
}


.sanction-badge-row {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.sanction-badge {
  background-color: #ebf5ff;
  color: #007bff;
  font-size: 9px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
  text-transform: uppercase;
  border: 1px solid #cce3ff;
}

.logo-display-container {
  min-height: 100px;
  width: 100%;
  max-width: 200px;
  background-color: #f1f5f9;
  border: 2px dashed #cbd5e1;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
}

@media (max-width: 575.98px) {
  .editor-header,
  .fields-header {
    align-items: stretch;
    flex-direction: column;
  }

  .field-row {
    align-items: flex-start;
    flex-direction: column;
    gap: 10px;
  }
}
</style>

<script>
import UtilsMixin from '../../../mixins/utils';
import { mapState, mapActions } from "vuex";
import HfButtons from '../../../components/element/HfButtons.vue';
import { mapGetters, mapMutations } from 'vuex/dist/vuex.common.js';
import AccessDenied from '../../AccessDenied.vue';
import { isAccessDeniedError } from '../../../utils/accessDenied';

export default {
  name: "KybWidgetConfig",
  mixins: [UtilsMixin],
  components: {
    HfButtons,
    AccessDenied
  },
  computed: {
    ...mapState({
      containerShift: state => state.playgroundStore.containerShift,
      kybWidgetConfig: state => state.mainStore.kybWidgetConfig
    }),
    ...mapGetters('mainStore', ['getAppByAppId']),
    isContainerShift() {
      return this.containerShift
    },
    alwaysCollectedFields() {
      return this.companyFieldDefinitions.filter(field => field.required)
    },
    companyFieldRows() {
      return this.companyFieldGroups.reduce((rows, group) => rows.concat(group.rows), [])
    },
    hasRequiredIdentifier() {
      return this.companyFieldGroups
        .find(group => group.key === 'identifiers').rows
        .some(row => this.companyRowState(row) === 'required')
    },
    // Rule violations shown on the Company Details tab and blocking save
    companyFieldIssues() {
      const issues = this.companyFieldRows
        .filter(row => this.isCompanyRowRequiredByDocument(row) && this.companyRowState(row) !== 'required')
        .map(row => `${row.label} must be set to Required while you collect the ${row.documentLabel}. Change it here or turn off the document in Document Collection.`)
      if (!this.hasRequiredIdentifier) {
        issues.push('Require at least one identifier: registration number or tax ID.')
      }
      return issues
    },
    companyFieldSummary() {
      const states = this.companyFieldRows.map(row => this.companyRowState(row))
      const always = this.alwaysCollectedFields.length
      return {
        collected: always + states.filter(state => state !== 'off').length,
        required: always + states.filter(state => state === 'required').length
      }
    }
  },
  async mounted() {
    try {
      this.isLoading = true
      await this.fetchAppsKybWidgetConfig()
      this.isLoading = false

      if (Object.keys(this.kybWidgetConfig).length > 0) {
        this.kybWidgetConfigTemp = {
          ...this.kybWidgetConfigTemp,
          ...this.kybWidgetConfig
        }
        this.normalizeCompanyFields()
      }
      
      this.appId = this.$route.params.appId;
      if (this.appId) {
        this.app = { ...this.getAppByAppId(this.appId) }
        if (this.app) {
          this.kybWidgetConfigTemp.branding.logoUrl = this.app.logoUrl ? this.app.logoUrl : this.kybWidgetConfigTemp.branding.logoUrl;
          this.kybWidgetConfigTemp.branding.businessName = this.kybWidgetConfigTemp.branding.businessName ? this.kybWidgetConfigTemp.branding.businessName : this.app.appName;
          if (!this.kybWidgetConfigTemp.issuerDID) {
            this.kybWidgetConfigTemp.issuerDID = this.app.issuerDid;
          }
        } else {
          console.error("No app found");
        }
      } else {
        console.error("No appId found");
      }

    } catch (e) {
      this.isLoading = false
      this.handleApiError(e, 'GET')
    }
  },
  data() {
    return {
      kybWidgetConfigUI: {
        collectCertOfIncorporationDoc: {
          label: "Collect Certificate of Incorporation",
          description: 'Enable collection of company incorporation certificate for business verification.'
        },
        collectTaxRegistrationDoc: {
          label: "Collect Tax Registration Document",
          description: 'Enable collection of the company’s tax registration certificate or equivalent tax document.'
        },
        collectPowerOfAttorneyDoc: {
          label: "Collect Power of Attorney Document",
          description: 'Enable collection of power of attorney documentation for business representative verification.'
        },
        collectAddressProofDoc: {
          label: "Collect Address Proof Document",
          description: 'Enable collection of business address verification documents.'
        },
        
        collectZkProof: {
          label: "Enable Zero Knowledge Proof",
          description: 'Enable businesses to share only proof of their data for enhanced privacy and compliance.'
        },
        checkAmlPep: {
          label: "AML/PEP Check",
          description: 'Enable Anti-Money Laundering and Politically Exposed Person screening for business entities.'
        },
        checkAmlSanction: {
          label: "AML Sanction Check",
          description: 'Enable sanction screening to identify businesses on restricted lists.',
          supportedLists: [
            "OFAC SDN", "EU Sanctions", "UNSC", "UK HMT", "AU DFAT"
          ],
        },
        checkAmlAdversemedia: {
          label: "AML Adverse Media Check",
          description: 'Enable adverse media screening to identify negative news coverage about the business entity.'
        },

        checkBusinessRegistry: {
          label: "Business Registry Check",
          description: 'Enable verification against official business registries to confirm business legitimacy.'
        },
        branding: {
          businessName: {
            label: "Business Name",
            description: "Display name for your business in the KYB widget"
          },
          title: {
            label: "Widget Title",
            description: "Title displayed on the KYB widget"
          },
          logoUrl: {
            label: "Logo URL",
            description: "URL of your business logo to display in the widget"
          },
          businessContactEmail: {
            label: "Contact Email",
            description: "Business contact email for support inquiries"
          },
          themeColor: {
            label: "Theme Color",
            description: "Primary color theme for the widget interface"
          }
        }
      },
      fullPage: true,
      isLoading: false,
      accessDenied: false,
      accessDeniedMsg: '',
      activeTab: 'Branding',
      tabs: ['Branding', 'Document Collection', 'Company Details', 'Compliance Checks'],
      companyFieldDefinitions: [
        { fieldName: 'name', label: 'Company Name', description: 'Registered or legal name of the company.', type: 'text', required: true },
        { fieldName: 'domain', label: 'Company Domain', description: 'Website domain associated with the company.', type: 'text', required: true },
        { fieldName: 'countryOfRegistration', label: 'Country of Registration', description: 'Country where the company is registered.', type: 'country', required: true },
        { fieldName: 'region', label: 'Region', description: 'Region where the company operates. This can differ from its country of registration.', type: 'text', required: true },
        { fieldName: 'registrationNumberType', label: 'Registration Number Type', description: 'Type of company registration number.', type: 'registration-type' },
        { fieldName: 'registrationNumber', label: 'Registration Number', description: 'Company registration or incorporation number.', type: 'text' },
        { fieldName: 'taxIdType', label: 'Tax ID Type', description: 'Type of company tax identifier.', type: 'tax-id-type' },
        { fieldName: 'taxIdNumber', label: 'Tax ID Number', description: 'Company tax identification number.', type: 'text' },
        { fieldName: 'address', label: 'Company Address', description: 'Registered or operating business address.', type: 'address' }
      ],
      // Optional fields as the editor shows them. Paired fields (number + type) share one setting.
      // The backend requires a row tied to a document to be required while that document is collected.
      companyFieldGroups: [
        {
          key: 'identifiers',
          title: 'Identifiers',
          hint: 'Require at least one so each business can be matched against official records.',
          rows: [
            {
              key: 'registration',
              label: 'Registration Number',
              description: 'Company registration or incorporation number, along with its type.',
              fieldNames: ['registrationNumber', 'registrationNumberType'],
              documentKey: 'collectCertOfIncorporationDoc',
              documentLabel: 'Certificate of Incorporation'
            },
            {
              key: 'tax',
              label: 'Tax ID',
              description: 'Company tax identification number, along with its type (for example GSTIN or VAT).',
              fieldNames: ['taxIdNumber', 'taxIdType'],
              documentKey: 'collectTaxRegistrationDoc',
              documentLabel: 'Tax Registration Document'
            }
          ]
        },
        {
          key: 'address',
          title: 'Registered Address',
          hint: '',
          rows: [
            {
              key: 'address',
              label: 'Registered address',
              description: 'The company\'s registered business address. Businesses fill in these fields:',
              fieldNames: ['address'],
              subFields: ['Street', 'City', 'Province / State', 'Postal code', 'Country']
            }
          ]
        }
      ],
      companyFieldStateOptions: [
        { value: 'off', label: 'Off' },
        { value: 'optional', label: 'Optional' },
        { value: 'required', label: 'Required' }
      ],
      appId: "",
      app: {},
      kybWidgetConfigTemp: {
        issuerDID: "",
        issuerVerificationMethodId: "",
        collectCertOfIncorporationDoc: true,
        collectPowerOfAttorneyDoc: true,
        collectAddressProofDoc: true,
        collectTaxRegistrationDoc: false,
        companyFields: [
          { fieldName: 'name', type: 'text', isMandatory: true },
          { fieldName: 'domain', type: 'text', isMandatory: true },
          { fieldName: 'region', type: 'text', isMandatory: true },
          { fieldName: 'countryOfRegistration', type: 'country', isMandatory: true },
          { fieldName: 'registrationNumber', type: 'text', isMandatory: true },
          { fieldName: 'registrationNumberType', type: 'registration-type', isMandatory: true }
        ],
        collectZkProof: {
          enable: false,
          proofType: "",
          criteria: ""
        },
        checkAmlPep: false,
        checkAmlSanction: true,
        checkAmlAdversemedia: true,
        checkBusinessRegistry: true,
        branding: {
          businessName: "",
          title: "",
          logoUrl: "",
          themeColor: "#1A73E8"
        }
      },
      zkProofTypeOptions: [
        {
          value: "",
          text: "Select proof type"
        },
        {
          value: "COMPANY_DENY_LIST",
          text: "Company Deny List"
        }
      ]
    }
  },
  methods: {
    ...mapMutations('mainStore', ['setKybWidgetConfig']),
    ...mapActions('mainStore', ['createAppsKybWidgetConfig', 'fetchAppsKybWidgetConfig', 'updateAppsKybWidgetConfig']),

    normalizeCompanyFields() {
      // Older KYB widget configs predate companyFields. An empty array is also
      // treated as legacy data because the editor requires the core company
      // fields and otherwise presents an unusable all-off configuration.
      if (!Array.isArray(this.kybWidgetConfigTemp.companyFields) || this.kybWidgetConfigTemp.companyFields.length === 0) {
        this.kybWidgetConfigTemp.companyFields = [
          { fieldName: 'name', type: 'text', isMandatory: true },
          { fieldName: 'domain', type: 'text', isMandatory: true },
          { fieldName: 'region', type: 'text', isMandatory: true },
          { fieldName: 'countryOfRegistration', type: 'country', isMandatory: true },
          { fieldName: 'registrationNumber', type: 'text', isMandatory: true },
          { fieldName: 'registrationNumberType', type: 'registration-type', isMandatory: true }
        ]
        return
      }

      // Always-collected fields must be present and required
      let fields = this.kybWidgetConfigTemp.companyFields.filter(field => !this.alwaysCollectedFields.some(def => def.fieldName === field.fieldName))
      const always = this.alwaysCollectedFields.map(def => ({ fieldName: def.fieldName, type: def.type, isMandatory: true }))

      // Paired fields share one setting; take it from whichever half was saved
      this.companyFieldRows.filter(row => row.fieldNames.length > 1).forEach(row => {
        const saved = row.fieldNames.map(name => fields.find(field => field.fieldName === name)).find(Boolean)
        fields = fields.filter(field => !row.fieldNames.includes(field.fieldName))
        if (saved) fields.push(...this.buildRowFields(row, saved.isMandatory))
      })

      this.kybWidgetConfigTemp.companyFields = always.concat(fields)
    },

    buildRowFields(row, isMandatory) {
      return row.fieldNames.map(name => {
        const definition = this.companyFieldDefinitions.find(field => field.fieldName === name)
        return { fieldName: name, type: definition.type, isMandatory: Boolean(isMandatory) }
      })
    },

    // 'off' | 'optional' | 'required'
    companyRowState(row) {
      const field = (this.kybWidgetConfigTemp.companyFields || []).find(item => item.fieldName === row.fieldNames[0])
      if (!field) return 'off'
      return field.isMandatory ? 'required' : 'optional'
    },

    isCompanyRowRequiredByDocument(row) {
      return Boolean(row.documentKey && this.kybWidgetConfigTemp[row.documentKey])
    },

    setCompanyRowState(row, state) {
      const fields = (this.kybWidgetConfigTemp.companyFields || []).filter(field => !row.fieldNames.includes(field.fieldName))
      if (state !== 'off') fields.push(...this.buildRowFields(row, state === 'required'))
      this.kybWidgetConfigTemp.companyFields = fields
    },

    // Collecting a document needs its identifier, so turning one on makes that row required
    onIdentifierDocumentToggle(documentKey, enabled) {
      if (!enabled) return
      const row = this.companyFieldRows.find(item => item.documentKey === documentKey)
      if (row) this.setCompanyRowState(row, 'required')
    },

    handleApiError(error, method = 'GET') {
      const message = typeof error === 'string' ? error : error?.message || 'Something went wrong';
      if (method.toUpperCase() === 'GET' && isAccessDeniedError(error)) {
        this.accessDenied = true;
        this.accessDeniedMsg = message;
        return;
      }

      this.notifyErr(message)
    },

    validateField() {
      if (!this.kybWidgetConfigTemp.issuerDID) {
        throw new Error('Issuer DID is required')
      }

      if (this.companyFieldIssues.length) {
        this.activeTab = 'Company Details'
        throw new Error(this.companyFieldIssues[0])
      }

      if (!this.kybWidgetConfigTemp.collectCertOfIncorporationDoc &&
          !this.kybWidgetConfigTemp.collectAddressProofDoc &&
          !this.kybWidgetConfigTemp.collectTaxRegistrationDoc) {
        throw new Error('Enable at least one company document: Certificate of Incorporation, Address Proof, or Tax Registration Document')
      }

      if (this.kybWidgetConfigTemp.collectZkProof.enable) {
        if (!this.kybWidgetConfigTemp.collectZkProof.proofType) {
          throw new Error('ZK Proof type is required when ZK Proof is enabled')
        }
        if (this.kybWidgetConfigTemp.collectZkProof.proofType === 'COMPANY_DENY_LIST' && !this.kybWidgetConfigTemp.collectZkProof.criteria) {
          throw new Error('Criteria is required for Company Deny List proof type')
        }
      }


    },

    async saveConfiguration() {
      try {
        this.isLoading = true;
        this.normalizeCompanyFields()
        this.validateField()
        this.setKybWidgetConfig(this.kybWidgetConfigTemp)
        await this.createAppsKybWidgetConfig()
        if (this.kybWidgetConfig) {
          this.kybWidgetConfigTemp = { ...this.kybWidgetConfig }
        }
        this.isLoading = false
      } catch (e) {
        this.isLoading = false
        this.notifyErr(e.message)
      }
    },

    async updateConfiguration() {
      try {
        this.isLoading = true;
        this.normalizeCompanyFields()
        this.validateField()
        this.setKybWidgetConfig(this.kybWidgetConfigTemp)
        await this.updateAppsKybWidgetConfig()
        if (this.kybWidgetConfig) {
          this.kybWidgetConfigTemp = { ...this.kybWidgetConfig }
        }
        this.isLoading = false
      } catch (e) {
        this.isLoading = false
        this.notifyErr(e.message)
      }
    }
  }
};
</script>
