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

h5 {
  width: 100%;
  text-align: center;
  border-bottom: 1px solid #80808045;
  line-height: 0.1em;
  margin: 10px 0 20px;
}

h5 span {
  background: #fff;
  padding: 0 10px;
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
        <!-- Document Collection Section -->
        <li class="list-group-item">
          <h5><span>Document Collection</span></h5>
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

        <!-- ZK Proof Section -->
        <li class="list-group-item">
          <h5><span>Zero Knowledge Proof</span></h5>
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
        <li class="list-group-item">
          <h5><span>Compliance Checks</span></h5>
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

        <!-- Document Validation Section -->
        <li class="list-group-item">
          <h5><span>Document Validation</span></h5>
        </li>
        
        <li class="list-group-item">
          <b-form-checkbox switch size="lg" v-model="kybWidgetConfigTemp.checkDuplicateDocument">
            {{ kybWidgetConfigUI.checkDuplicateDocument.label }}
          </b-form-checkbox>
          <small v-html="kybWidgetConfigUI.checkDuplicateDocument.description"></small>
        </li>
        
        <li class="list-group-item">
          <b-form-checkbox switch size="lg" v-model="kybWidgetConfigTemp.checkDocumentExpiry">
            {{ kybWidgetConfigUI.checkDocumentExpiry.label }}
          </b-form-checkbox>
          <small v-html="kybWidgetConfigUI.checkDocumentExpiry.description"></small>
        </li>
        
        <li class="list-group-item">
          <div class="row">
            <div class="col-md-6">
              <b-form-checkbox switch size="lg" v-model="kybWidgetConfigTemp.checkMinimumDocumentValidity.enable" v-if="kybWidgetConfigTemp.checkMinimumDocumentValidity">
                {{ kybWidgetConfigUI.checkMinimumDocumentValidity.label }}
              </b-form-checkbox>
              <small v-html="kybWidgetConfigUI.checkMinimumDocumentValidity.description"></small>
            </div>
            <div class="col" v-if="kybWidgetConfigTemp.checkMinimumDocumentValidity && kybWidgetConfigTemp.checkMinimumDocumentValidity.enable">
              <div class="row">
                <div class="col-md-6">
                  <label><strong>Value:</strong></label>
                  <b-form-input type="number" v-model="kybWidgetConfigTemp.checkMinimumDocumentValidity.value" placeholder="3"></b-form-input>
                </div>
                <div class="col-md-6">
                  <label><strong>Unit:</strong></label>
                  <b-form-select v-model="kybWidgetConfigTemp.checkMinimumDocumentValidity.unit" :options="validityUnitOptions"></b-form-select>
                </div>
              </div>
            </div>
          </div>
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
        checkDuplicateDocument: {
          label: "Check Duplicate Documents",
          description: 'Enable verification to prevent submission of duplicate business documents.'
        },
        checkDocumentExpiry: {
          label: "Check Document Expiry",
          description: 'Enable verification of business document expiration dates.'
        },
        checkMinimumDocumentValidity: {
          label: "Check Minimum Document Validity",
          description: 'Enable verification that business documents have minimum remaining validity period.'
        },
        checkBusinessRegistry: {
          label: "Business Registry Check",
          description: 'Enable verification against official business registries to confirm business legitimacy.'
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
        checkDuplicateDocument: false,
        checkDocumentExpiry: false,
        checkMinimumDocumentValidity: {
          enable: false,
          value: 3,
          unit: "Month"
        },
        checkBusinessRegistry: false
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
      ],
      validityUnitOptions: [
        {
          value: "Month",
          text: "Month"
        },
        {
          value: "Year", 
          text: "Year"
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

      if (this.kybWidgetConfigTemp.checkMinimumDocumentValidity.enable) {
        if (!this.kybWidgetConfigTemp.checkMinimumDocumentValidity.value || this.kybWidgetConfigTemp.checkMinimumDocumentValidity.value <= 0) {
          throw new Error('Valid minimum document validity value is required')
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
