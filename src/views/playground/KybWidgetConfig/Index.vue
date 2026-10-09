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
        :name="kybWidgetConfigTemp._id ? 'Update Configuration' : 'Save Configuration'"
        @executeAction="kybWidgetConfigTemp._id ? updateConfiguration() : saveConfiguration()"
      />
    </div>

    <div class="serviceCard">
      <nav class="configuration-tabs" aria-label="Business widget configuration sections">
        <button
          v-for="tab in tabs"
          :key="tab"
          type="button"
          class="configuration-tab"
          :class="{ active: activeTab === tab }"
          @click="activeTab = tab"
        >
          {{ tab }}
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
              <div class="config-card">
                <div class="d-flex justify-content-between align-items-start">
                  <label class="font-weight-bold mb-0">{{ kybWidgetConfigUI.collectCertOfIncorporationDoc.label }}</label>
                  <b-form-checkbox switch v-model="kybWidgetConfigTemp.collectCertOfIncorporationDoc"></b-form-checkbox>
                </div>
                <small class="text-muted d-block mt-1" v-html="kybWidgetConfigUI.collectCertOfIncorporationDoc.description"></small>
              </div>
            </div>
            <div class="col-md-6 p-2">
              <div class="config-card">
                <div class="d-flex justify-content-between align-items-start">
                  <label class="font-weight-bold mb-0">{{ kybWidgetConfigUI.collectPowerOfAttorneyDoc.label }}</label>
                  <b-form-checkbox switch v-model="kybWidgetConfigTemp.collectPowerOfAttorneyDoc"></b-form-checkbox>
                </div>
                <small class="text-muted d-block mt-1" v-html="kybWidgetConfigUI.collectPowerOfAttorneyDoc.description"></small>
              </div>
            </div>
            <div class="col-md-6 p-2">
              <div class="config-card">
                <div class="d-flex justify-content-between align-items-start">
                  <label class="font-weight-bold mb-0">{{ kybWidgetConfigUI.collectAddressProofDoc.label }}</label>
                  <b-form-checkbox switch v-model="kybWidgetConfigTemp.collectAddressProofDoc"></b-form-checkbox>
                </div>
                <small class="text-muted d-block mt-1" v-html="kybWidgetConfigUI.collectAddressProofDoc.description"></small>
              </div>
            </div>
            <div class="col-md-6 p-2">
              <div class="config-card">
                <div class="d-flex justify-content-between align-items-start">
                  <label class="font-weight-bold mb-0">{{ kybWidgetConfigUI.collectTaxRegistrationDoc.label }}</label>
                  <b-form-checkbox switch v-model="kybWidgetConfigTemp.collectTaxRegistrationDoc"></b-form-checkbox>
                </div>
                <small class="text-muted d-block mt-1">{{ kybWidgetConfigUI.collectTaxRegistrationDoc.description }}</small>
              </div>
            </div>
          </div>
        </li>

        <li v-show="activeTab === 'Compliance Checks'" class="list-group-item p-3">
          <div class="row mx-0">
            <div class="col-md-6 p-2">
              <div class="config-card h-100">
                <div class="d-flex justify-content-between align-items-start">
                  <label class="font-weight-bold mb-0">{{ kybWidgetConfigUI.checkAmlSanction.label }}</label>
                  <b-form-checkbox switch v-model="kybWidgetConfigTemp.checkAmlSanction" disabled></b-form-checkbox>
                </div>
                <small class="text-muted d-block mt-1" v-html="kybWidgetConfigUI.checkAmlSanction.description"></small>
                <div class="sanction-badge-row mt-2">
                  <span v-for="list in kybWidgetConfigUI.checkAmlSanction.supportedLists" :key="list" class="sanction-badge">
                    {{ list }}
                  </span>
                </div>
              </div>
            </div>

            <div class="col-md-6 p-2">
              <div class="config-card h-100">
                <div class="d-flex justify-content-between align-items-start">
                  <label class="font-weight-bold mb-0">{{ kybWidgetConfigUI.checkAmlAdversemedia.label }}</label>
                  <b-form-checkbox switch v-model="kybWidgetConfigTemp.checkAmlAdversemedia" disabled></b-form-checkbox>
                </div>
                <small class="text-muted d-block mt-1" v-html="kybWidgetConfigUI.checkAmlAdversemedia.description"></small>
              </div>
            </div>

            <div class="col-md-6 p-2">
              <div class="config-card h-100">
                <div class="d-flex justify-content-between align-items-start">
                  <label class="font-weight-bold mb-0">{{ kybWidgetConfigUI.checkBusinessRegistry.label }}</label>
                  <b-form-checkbox switch v-model="kybWidgetConfigTemp.checkBusinessRegistry" disabled></b-form-checkbox>
                </div>
                <small class="text-muted d-block mt-1" v-html="kybWidgetConfigUI.checkBusinessRegistry.description"></small>
              </div>
            </div>
          </div>
        </li>

        <li v-show="activeTab === 'Company Fields'" class="list-group-item p-3">
          <div class="company-fields-intro mb-3">
            <strong>Choose the company information to collect</strong>
            <small class="text-muted d-block mt-1">Select each field you want businesses to provide, then choose whether it is required.</small>
          </div>
          <div class="row mx-0">
            <div v-for="field in companyFieldDefinitions" :key="field.fieldName" class="col-md-6 p-2">
              <div class="config-card company-field-card">
                <div class="d-flex justify-content-between align-items-start">
                  <div class="pr-3">
                    <label class="font-weight-bold mb-1">{{ field.label }}</label>
                    <small class="text-muted d-block">{{ field.description }}</small>
                  </div>
                  <b-form-checkbox
                    switch
                    :checked="isCompanyFieldSelected(field.fieldName)"
                    :disabled="field.required"
                    :aria-label="`Collect ${field.label}`"
                    @change="setCompanyFieldSelected(field, $event)"
                  ></b-form-checkbox>
                </div>
                <div class="field-required-control mt-3" :class="{ 'text-muted': !isCompanyFieldSelected(field.fieldName) }">
                  <b-form-checkbox
                    :checked="isCompanyFieldMandatory(field.fieldName)"
                    :disabled="!isCompanyFieldSelected(field.fieldName) || field.required"
                    @change="setCompanyFieldMandatory(field, $event)"
                  >Required</b-form-checkbox>
                </div>
              </div>
            </div>
          </div>
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

.config-card {
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  height: 100%;
  padding: 15px;
}

.company-fields-intro {
  padding: 4px 10px;
}

.company-field-card {
  min-height: 145px;
}

.field-required-control {
  align-items: center;
  display: flex;
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
  .editor-header {
    align-items: stretch;
    flex-direction: column;
  }
}

/* Fix for disabled switch opacity */
:deep(.custom-control-input:disabled ~ .custom-control-label) {
  opacity: 0.6;
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
        collectPowerOfAttorneyDoc: {
          label: "Collect Power of Attorney Document",
          description: 'Enable collection of power of attorney documentation for business representative verification.'
        },
        collectAddressProofDoc: {
          label: "Collect Address Proof Document",
          description: 'Enable collection of business address verification documents.'
        },
        collectTaxRegistrationDoc: {
          label: "Collect Tax Registration Document",
          description: 'Enable collection of the company’s tax registration certificate or equivalent tax document.'
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
      tabs: ['Branding', 'Document Collection', 'Company Fields', 'Compliance Checks'],
      companyFieldDefinitions: [
        { fieldName: 'name', label: 'Company Name', description: 'Registered or legal name of the company.', type: 'text', required: true },
        { fieldName: 'domain', label: 'Company Domain', description: 'Website domain associated with the company.', type: 'text', required: true },
        { fieldName: 'region', label: 'Region', description: 'Region where the company operates.', type: 'text', required: true },
        { fieldName: 'countryOfRegistration', label: 'Country of Registration', description: 'Country where the company is registered.', type: 'country', required: true },
        { fieldName: 'registrationNumberType', label: 'Registration Number Type', description: 'Type of company registration number.', type: 'registration-type' },
        { fieldName: 'registrationNumber', label: 'Registration Number', description: 'Company registration or incorporation number.', type: 'text' },
        { fieldName: 'taxIdType', label: 'Tax ID Type', description: 'Type of company tax identifier.', type: 'tax-id-type' },
        { fieldName: 'taxIdNumber', label: 'Tax ID Number', description: 'Company tax identification number.', type: 'text' },
        { fieldName: 'address', label: 'Company Address', description: 'Registered or operating business address.', type: 'address' }
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

    isCompanyFieldSelected(fieldName) {
      return this.kybWidgetConfigTemp.companyFields.some(field => field.fieldName === fieldName)
    },

    isCompanyFieldMandatory(fieldName) {
      const field = this.kybWidgetConfigTemp.companyFields.find(item => item.fieldName === fieldName)
      return Boolean(field && field.isMandatory)
    },

    isCompanyFieldRequiredByDocument(fieldName) {
      return (this.kybWidgetConfigTemp.collectCertOfIncorporationDoc && ['registrationNumber', 'registrationNumberType'].includes(fieldName)) ||
        (this.kybWidgetConfigTemp.collectTaxRegistrationDoc && ['taxIdNumber', 'taxIdType'].includes(fieldName))
    },

    setCompanyFieldSelected(definition, selected) {
      const fields = this.kybWidgetConfigTemp.companyFields.filter(field => field.fieldName !== definition.fieldName)
      if (selected) {
        const pair = definition.fieldName === 'registrationNumber' ? 'registrationNumberType' :
          definition.fieldName === 'registrationNumberType' ? 'registrationNumber' :
            definition.fieldName === 'taxIdNumber' ? 'taxIdType' :
              definition.fieldName === 'taxIdType' ? 'taxIdNumber' : null
        fields.push({ fieldName: definition.fieldName, type: definition.type, isMandatory: this.isCompanyFieldRequiredByDocument(definition.fieldName) })
        if (pair && !fields.some(field => field.fieldName === pair)) {
          const pairDefinition = this.companyFieldDefinitions.find(field => field.fieldName === pair)
          fields.push({ fieldName: pair, type: pairDefinition.type, isMandatory: this.isCompanyFieldRequiredByDocument(definition.fieldName) })
        }
      } else {
        const pair = definition.fieldName === 'registrationNumber' ? 'registrationNumberType' :
          definition.fieldName === 'registrationNumberType' ? 'registrationNumber' :
            definition.fieldName === 'taxIdNumber' ? 'taxIdType' :
              definition.fieldName === 'taxIdType' ? 'taxIdNumber' : null
        this.kybWidgetConfigTemp.companyFields = fields.filter(field => field.fieldName !== pair)
        return
      }
      this.kybWidgetConfigTemp.companyFields = fields
    },

    setCompanyFieldMandatory(definition, mandatory) {
      const fields = this.kybWidgetConfigTemp.companyFields
      const pair = definition.fieldName === 'registrationNumber' ? 'registrationNumberType' :
        definition.fieldName === 'registrationNumberType' ? 'registrationNumber' :
          definition.fieldName === 'taxIdNumber' ? 'taxIdType' :
            definition.fieldName === 'taxIdType' ? 'taxIdNumber' : null
      fields.forEach(field => {
        if (field.fieldName === definition.fieldName || (pair && field.fieldName === pair)) {
          field.isMandatory = mandatory
        }
      })
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

      const fields = this.kybWidgetConfigTemp.companyFields || []
      const fieldNames = new Set(fields.map(field => field.fieldName))
      const requiredNames = this.companyFieldDefinitions.filter(field => field.required).map(field => field.fieldName)
      if (requiredNames.some(name => !fieldNames.has(name) || !fields.find(field => field.fieldName === name).isMandatory)) {
        throw new Error('Company name, domain, region, and country of registration must be collected as required fields')
      }
      for (const [numberField, typeField] of [['registrationNumber', 'registrationNumberType'], ['taxIdNumber', 'taxIdType']]) {
        const number = fields.find(field => field.fieldName === numberField)
        const type = fields.find(field => field.fieldName === typeField)
        if (Boolean(number) !== Boolean(type) || (number && number.isMandatory !== type.isMandatory)) {
          throw new Error(`${numberField} and ${typeField} must be selected together with the same required setting`)
        }
      }
      if (this.kybWidgetConfigTemp.collectCertOfIncorporationDoc &&
          (!fieldNames.has('registrationNumber') || !fieldNames.has('registrationNumberType') ||
            !fields.find(field => field.fieldName === 'registrationNumber').isMandatory ||
            !fields.find(field => field.fieldName === 'registrationNumberType').isMandatory)) {
        throw new Error('Certificate of Incorporation collection requires Registration Number and Registration Number Type as required fields')
      }
      if (this.kybWidgetConfigTemp.collectTaxRegistrationDoc &&
          (!fieldNames.has('taxIdNumber') || !fieldNames.has('taxIdType') ||
            !fields.find(field => field.fieldName === 'taxIdNumber').isMandatory ||
            !fields.find(field => field.fieldName === 'taxIdType').isMandatory)) {
        throw new Error('Tax Registration collection requires Tax ID Number and Tax ID Type as required fields')
      }
      if (!fields.some(field => ['registrationNumber', 'taxIdNumber'].includes(field.fieldName) && field.isMandatory)) {
        throw new Error('At least one registration number or tax ID pair must be required')
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
