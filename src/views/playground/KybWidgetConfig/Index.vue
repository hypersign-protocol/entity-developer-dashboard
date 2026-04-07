<template>
  <div :class="isContainerShift ? 'homeShift' : 'home'">
    <load-ing :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></load-ing>
    
    <v-row class="align-center mb-4">
      <v-col>
        <!-- <h3 class="mb-0 text-left">KYB Widget Configuration</h3> -->
        <div>
          <h4 class="mb-1 font-weight-bold mb-0">Business Widget Configuration</h4>
          <p class="text-muted small mb-0">Configure the business widget for your application</p>
        </div>
      </v-col>
      <v-col class="text-right">
        <HfButtons 
          v-if="!this.kybWidgetConfigTemp._id" 
          name="Save Configuration" 
          @executeAction="saveConfiguration()"
        />
        <HfButtons 
          v-else 
          name="Update Configuration" 
          @executeAction="updateConfiguration()"
        />
      </v-col>
    </v-row>

    <v-card class="serviceCard" style="overflow-y: auto;">
      <ul class="list-group list-group-flush">
        
        <li class="list-group-item section-header bg-light">
          <div class="d-flex align-items-center">
            <i class="fas fa-palette text-primary mr-3"></i>
            <div>
              <h5 class="mb-0">Branding Configuration</h5>
              <small class="text-muted">Customize how your business appears to users</small>
            </div>
          </div>
        </li>

        <li class="list-group-item p-4">
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

        <li class="list-group-item section-header bg-light">
          <div class="d-flex align-items-center">
            <i class="fas fa-file-alt text-primary mr-3"></i>
            <div>
              <h5 class="mb-0">Document Collection</h5>
              <small class="text-muted">Configure required business verification documents</small>
            </div>
          </div>
        </li>

        <li class="list-group-item p-3">
          <div class="row mx-0">
            <div class="col-md-6 p-2">
              <div class="config-card">
                <div class="d-flex justify-content-between align-items-start">
                  <label class="font-weight-bold mb-0">{{ kybWidgetConfigUI.collectCertOfIncorporationDoc.label }}</label>
                  <b-form-checkbox switch v-model="kybWidgetConfigTemp.collectCertOfIncorporationDoc" disabled></b-form-checkbox>
                </div>
                <small class="text-muted d-block mt-1" v-html="kybWidgetConfigUI.collectCertOfIncorporationDoc.description"></small>
              </div>
            </div>
            <div class="col-md-6 p-2">
              <div class="config-card">
                <div class="d-flex justify-content-between align-items-start">
                  <label class="font-weight-bold mb-0">{{ kybWidgetConfigUI.collectPowerOfAttorneyDoc.label }}</label>
                  <b-form-checkbox switch v-model="kybWidgetConfigTemp.collectPowerOfAttorneyDoc" disabled></b-form-checkbox>
                </div>
                <small class="text-muted d-block mt-1" v-html="kybWidgetConfigUI.collectPowerOfAttorneyDoc.description"></small>
              </div>
            </div>
            <div class="col-md-6 p-2">
              <div class="config-card">
                <div class="d-flex justify-content-between align-items-start">
                  <label class="font-weight-bold mb-0">{{ kybWidgetConfigUI.collectAddressProofDoc.label }}</label>
                  <b-form-checkbox switch v-model="kybWidgetConfigTemp.collectAddressProofDoc" disabled></b-form-checkbox>
                </div>
                <small class="text-muted d-block mt-1" v-html="kybWidgetConfigUI.collectAddressProofDoc.description"></small>
              </div>
            </div>
          </div>
        </li>

        <li class="list-group-item section-header bg-light">
          <div class="d-flex align-items-center">
            <i class="fas fa-shield-alt text-primary mr-3"></i>
            <div>
              <h5 class="mb-0">Compliance Checks</h5>
              <small class="text-muted">AML, PEP and regulatory screening</small>
            </div>
          </div>
        </li>

        <li class="list-group-item p-3">
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

      </ul>
    </v-card>
  </div>
</template> 



<style scoped>


/* Visual Consistency */
.serviceCard {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  overflow: hidden; /* Keeps the list items from breaking the rounded corners */
}

.section-header {
  background-color: #f8f9fa !important;
  border-left: 4px solid #007bff !important;
  position: sticky; /* Keeps headers visible while scrolling through a section */
  top: 0;
  z-index: 10;
}

.config-card {
  padding: 15px;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  height: 100%;
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


.serviceCard { border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }

.section-header {
  background-color: #f8f9fa !important;
  border-left: 4px solid #007bff !important;
  padding: 1rem 1.25rem;
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

.config-card {
  padding: 15px;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  height: 100%;
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
      console.error(e)
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
