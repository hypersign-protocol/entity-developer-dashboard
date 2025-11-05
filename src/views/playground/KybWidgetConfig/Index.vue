<style scoped>
.sticky-header {
  position: sticky;
  top: 0;
}

.container {
  width: 80vw;
}

.UI--c-kbgiPT-iehgGlf-css {
  background-color: #9cb5f9;
}

.step-notStarted {
  background-color: #afb8cc;
}

.step-finished {
  background-color: #9cb5f9;
}

.UI--c-dhzjXW-iexswVt-css {
  align-items: center;
  justify-content: center;
}

.UI--c-kbgiPT-bUORwj-isFirst-true {
  padding: 0px 0.4rem 0px 0px;
  clip-path: polygon(75% 0%, 100% 50%, 75% 100%, 0% 100%, 0% 100%, 0% 0%);
}

.UI--c-kbgiPT {
  height: 100%;
  width: 4.8rem;
  clip-path: polygon(75% 0%, 100% 50%, 75% 100%, 0% 100%, 25% 50%, 0% 0%);
  margin-left: -0.9rem;
  padding: 0px 0.4rem 0px 0.8rem;
}

.UI--c-dhzjXW {
  display: flex;
}

.stepSpan {
  cursor: pointer;
  margin: 3px;
  padding: 0px;
  border: 0px;
  font: inherit;
  vertical-align: baseline;
  float: left
}

.step {
  height: 32px;
  width: 50px;
}

.goschema {
  color: #339af0;
}

.goschema:hover {
  text-decoration: underline;
  cursor: pointer;
}

.far {
  color: gray;
  font-size: 1.5em;
  display: inline;
  cursor: pointer;
}

.section-header {
  background-color: rgba(128, 128, 128, 0.074) !important;
  border-left: 4px solid gray !important;
  font-weight: 600;
}

.section-header h5 {
  color: #333;
  font-weight: 600;
  margin: 0;
}

.section-header .fas {
  font-size: 1.2em;
}

.color-input {
  height: 38px;
  border-radius: 4px;
  border: 1px solid #ced4da;
  cursor: pointer;
}

.color-input::-webkit-color-swatch-wrapper {
  padding: 0;
}

.color-input::-webkit-color-swatch {
  border: none;
  border-radius: 3px;
}

.scrollit {
  overflow: hidden;
  height: 600px;
}

.scrollit:hover {
  overflow-y: auto;
}

ul {
  list-style-type: none;
}
</style>

<template>
  <div :class="isContainerShift ? 'homeShift' : 'home'">
    <load-ing :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></load-ing>
    <v-row>
      <v-col>
        <div class="form-group" style="display:flex">
          <h3 style="text-align: left;">
            KYB Widget Configuration 
          </h3>
        </div>
      </v-col>
      <v-col>
        <HfButtons 
          name="Save Configuration" 
          @executeAction="saveConfiguration()" 
          v-if="!this.kybWidgetConfigTemp._id"
          style="float:right">
        </HfButtons>
        <HfButtons 
          name="Update Configuration" 
          @executeAction="updateConfiguration()" 
          style="float:right" 
          v-else>
        </HfButtons>
      </v-col>
    </v-row>

    <v-card class="serviceCard">
      <ul class="list-group list-group-flush">
        <!-- Branding Configuration Section -->
        <li class="list-group-item section-header">
          <div class="d-flex align-items-center">
            <i class="fas fa-cog text-muted mr-3"></i>
            <div>
              <h5 class="mb-0">Branding Configuration</h5>
              <small class="text-muted">Customize widget appearance and branding</small>
            </div>
          </div>
        </li>
        
        <li class="list-group-item">
          <div class="row">
            <div class="col-md-6">
              <label><strong>Business Name:</strong></label>
              <b-form-input v-model="kybWidgetConfigTemp.branding.businessName" placeholder="Enter business name"></b-form-input>
              <small class="text-muted">{{ kybWidgetConfigUI.branding.businessName.description }}</small>
            </div>
            <div class="col-md-6">
              <label><strong>Widget Title:</strong></label>
              <b-form-input v-model="kybWidgetConfigTemp.branding.title" placeholder="Enter widget title"></b-form-input>
              <small class="text-muted">{{ kybWidgetConfigUI.branding.title.description }}</small>
            </div>
          </div>
        </li>
        
        <li class="list-group-item">
          <div class="row">
            <div class="col-md-6">
              <label><strong>Logo URL:</strong></label>
              <b-form-input v-model="kybWidgetConfigTemp.branding.logoUrl" placeholder="https://example.com/logo.png"></b-form-input>
              <small class="text-muted">{{ kybWidgetConfigUI.branding.logoUrl.description }}</small>
            </div>
            <div class="col-md-6">
              <label><strong>Contact Email:</strong></label>
              <b-form-input v-model="kybWidgetConfigTemp.branding.businessContactEmail" placeholder="support@company.com"></b-form-input>
              <small class="text-muted">{{ kybWidgetConfigUI.branding.businessContactEmail.description }}</small>
            </div>
          </div>
        </li>
        
        <li class="list-group-item">
          <div class="row">
            <div class="col-md-6">
              <label><strong>Theme Color:</strong></label>
              <div class="d-flex align-items-center">
                <input type="color" v-model="kybWidgetConfigTemp.branding.themeColor" class="form-control color-input mr-2" style="width: 60px;">
                <b-form-input v-model="kybWidgetConfigTemp.branding.themeColor" placeholder="#1A73E8"></b-form-input>
              </div>
              <small class="text-muted">{{ kybWidgetConfigUI.branding.themeColor.description }}</small>
            </div>
          </div>
        </li>

        <!-- Document Collection Section -->
        <li class="list-group-item section-header">
          <div class="d-flex align-items-center">
            <i class="fas fa-file text-muted mr-3"></i>
            <div>
              <h5 class="mb-0">Document Collection</h5>
              <small class="text-muted">Configure required business documents</small>
            </div>
          </div>
        </li>
        
        <li class="list-group-item">
          <b-form-checkbox switch size="lg" v-model="kybWidgetConfigTemp.collectCertOfIncorporationDoc">
            {{ kybWidgetConfigUI.collectCertOfIncorporationDoc.label }}
          </b-form-checkbox>
          <small v-html="kybWidgetConfigUI.collectCertOfIncorporationDoc.description"></small>
        </li>
        
        <li class="list-group-item">
          <b-form-checkbox switch size="lg" v-model="kybWidgetConfigTemp.collectPowerOfAttorneyDoc">
            {{ kybWidgetConfigUI.collectPowerOfAttorneyDoc.label }}
          </b-form-checkbox>
          <small v-html="kybWidgetConfigUI.collectPowerOfAttorneyDoc.description"></small>
        </li>
        
        <li class="list-group-item">
          <b-form-checkbox switch size="lg" v-model="kybWidgetConfigTemp.collectAddressProofDoc">
            {{ kybWidgetConfigUI.collectAddressProofDoc.label }}
          </b-form-checkbox>
          <small v-html="kybWidgetConfigUI.collectAddressProofDoc.description"></small>
        </li>

        <!-- Zero Knowledge Proof Section -->
        <li class="list-group-item section-header">
          <div class="d-flex align-items-center">
            <i class="fas fa-shield-alt text-muted mr-3"></i>
            <div>
              <h5 class="mb-0">Zero Knowledge Proof</h5>
              <small class="text-muted">Privacy-preserving verification options</small>
            </div>
          </div>
        </li>
        
        <li class="list-group-item">
          <div class="row">
            <div class="col-md-6">
              <b-form-checkbox switch size="lg" v-model="kybWidgetConfigTemp.collectZkProof.enable" v-if="kybWidgetConfigTemp.collectZkProof">
                {{ kybWidgetConfigUI.collectZkProof.label }}
              </b-form-checkbox>
              <small v-html="kybWidgetConfigUI.collectZkProof.description"></small>
            </div>
            <div class="col" v-if="kybWidgetConfigTemp.collectZkProof && kybWidgetConfigTemp.collectZkProof.enable">
              <div class="row">
                <div class="col">
                  <label><strong>Proof Type:</strong></label>
                  <b-form-select v-model="kybWidgetConfigTemp.collectZkProof.proofType" :options="zkProofTypeOptions"></b-form-select>
                </div>
              </div>
              <div class="row mt-2" v-if="kybWidgetConfigTemp.collectZkProof.proofType === 'COMPANY_DENY_LIST'">
                <div class="col">
                  <label><strong>Criteria (Country Code):</strong></label>
                  <b-form-input v-model="kybWidgetConfigTemp.collectZkProof.criteria" placeholder="e.g., UK, US"></b-form-input>
                </div>
              </div>
            </div>
          </div>
        </li>

        <!-- Compliance Checks Section -->
        <li class="list-group-item section-header">
          <div class="d-flex align-items-center">
            <i class="fas fa-check-circle text-muted mr-3"></i>
            <div>
              <h5 class="mb-0">Compliance Checks</h5>
              <small class="text-muted">AML, PEP and regulatory screening</small>
            </div>
          </div>
        </li>
        
        <li class="list-group-item">
          <b-form-checkbox switch size="lg" v-model="kybWidgetConfigTemp.checkAmlPep">
            {{ kybWidgetConfigUI.checkAmlPep.label }}
          </b-form-checkbox>
          <small v-html="kybWidgetConfigUI.checkAmlPep.description"></small>
        </li>
        
        <li class="list-group-item">
          <b-form-checkbox switch size="lg" v-model="kybWidgetConfigTemp.checkAmlAdversemedia">
            {{ kybWidgetConfigUI.checkAmlAdversemedia.label }}
          </b-form-checkbox>
          <small v-html="kybWidgetConfigUI.checkAmlAdversemedia.description"></small>
        </li>
        
        <li class="list-group-item">
          <b-form-checkbox switch size="lg" v-model="kybWidgetConfigTemp.checkBusinessRegistry">
            {{ kybWidgetConfigUI.checkBusinessRegistry.label }}
          </b-form-checkbox>
          <small v-html="kybWidgetConfigUI.checkBusinessRegistry.description"></small>
        </li>


      </ul>
    </v-card>
  </div>
</template>

<script>
import UtilsMixin from '../../../mixins/utils';
import { mapState, mapActions } from "vuex";
import HfButtons from '../../../components/element/HfButtons.vue';
import { mapGetters, mapMutations } from 'vuex/dist/vuex.common.js';

export default {
  name: "KybWidgetConfig",
  mixins: [UtilsMixin],
  components: {
    HfButtons
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
      console.log(e)
      if (e.message) {
        this.notifyErr(e.message)
      }
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
        collectZkProof: {
          label: "Enable Zero Knowledge Proof",
          description: 'Enable businesses to share only proof of their data for enhanced privacy and compliance.'
        },
        checkAmlPep: {
          label: "AML/PEP Check",
          description: 'Enable Anti-Money Laundering and Politically Exposed Person screening for business entities.'
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
            description: "Title displayed on the KYB verification portal"
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
      appId: "",
      app: {},
      kybWidgetConfigTemp: {
        issuerDID: "",
        issuerVerificationMethodId: "",
        collectCertOfIncorporationDoc: true,
        collectPowerOfAttorneyDoc: true,
        collectAddressProofDoc: true,
        collectZkProof: {
          enable: false,
          proofType: "",
          criteria: ""
        },
        checkAmlPep: false,
        checkAmlAdversemedia: false,
        checkBusinessRegistry: false,
        branding: {
          businessName: "",
          title: "",
          logoUrl: "",
          businessContactEmail: "",
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

    validateField() {
      if (!this.kybWidgetConfigTemp.issuerDID) {
        throw new Error('Issuer DID is required')
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
        this.notifyErr(e)
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
        this.notifyErr(e)
      }
    }
  }
};
</script>
