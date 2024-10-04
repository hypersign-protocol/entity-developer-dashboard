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

.datetime-picker {
  background-color: #fff;
  background-clip: content-box;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  padding: 0.375rem 0.75rem;
}

.linkdiv {
  background-clip: content-box;
  background-color: rgba(173, 232, 255, .5607843137254902);
  border-radius: 0.25rem;
  height: 50px;
  text-align: left;
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

.zkbadge {
  background-color: lightblue;
  margin-left: 3px;
  margin-top: 3px;
  color: black;
  min-height: 20px;
  align-content: center;
  /* display: flex; */
  padding: 5px;
  font-size: x-small;
  font-weight: bold;
  max-width: 200px;
  float: left;
}

.zkbadge:hover {
  background-color: lightcoral;
}
</style>
<template>
  <div :class="isContainerShift ? 'homeShift' : 'home'">
    <load-ing :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></load-ing>

    <div class="row">
      <div class="col-6" style="text-align: left">
        <div class="form-group" style="display:flex">
          <h3 style="text-align: left;">
            Widget Configuration </h3>
        </div>
      </div>
      <div class="col-6">
        <HfButtons name="Save Configuration" @executeAction="saveConfiguration()" v-if="!this.widgetConfigTemp._id"
          style="float:right"></HfButtons>
        <HfButtons name="Update Configuration" @executeAction="updateConfiguration()" style="float:right" v-else>
        </HfButtons>
      </div>
    </div>

    <div class="row">
      <div class="col">
        <div class="row card" style="padding-right:0px">
          <ul class="list-group list-group-flush" style="border-radius: 10px;">
            <li class="list-group-item">
              <b-form-checkbox switch size="lg" v-model="widgetConfigTemp.faceRecog" disabled>{{
                this.widgetConfigUI.faceRecog.label }}</b-form-checkbox>
              <small v-html="this.widgetConfigUI.faceRecog.description">
              </small>
            </li>
            <li class="list-group-item">
              <div class="row">
                <div class="col">
                  <b-form-checkbox switch size="lg" v-model="widgetConfigTemp.idOcr.enabled">
                    {{ this.widgetConfigUI.idOcr.label }}</b-form-checkbox>
                  <small v-html="this.widgetConfigUI.idOcr.description"></small>
                </div>
                <div class="col" v-if="widgetConfigTemp.idOcr.enabled && documentTypeOptions.length > 0">
                  <div class="">
                    <label for=""><strong>Select Document Type: </strong></label>
                    <b-form-select v-model="widgetConfigTemp.idOcr.documentType" :options="documentTypeOptions"
                      size=""></b-form-select>
                  </div>
                </div>
              </div>
            </li>
            <li class="list-group-item">
              <div class="row">
                <div class="col">
                  <div class="row">
                    <div class="col-md-12">
                      <b-form-checkbox switch size="lg" v-model="widgetConfigTemp.zkProof.enabled">{{
                        this.widgetConfigUI.zkProof.label }}<HFBeta></HFBeta>
                      </b-form-checkbox>
                      <small v-html="this.widgetConfigUI.zkProof.description"></small>
                    </div>
                  </div>
                  <div class="mt-2 mx-0 p-1"
                    style="border: 2px solid #8080802e; border-radius: 10px; min-height: 80px; padding:10px"
                    v-if="widgetConfigTemp.zkProof.proofs.length > 0">
                    <div class="">
                      <span class="zkbadge rounded " style="cursor: grab;" @click="deleteZkProof(proof.proofType)"
                        v-for="proof in widgetConfigTemp.zkProof.proofs" v-bind:key="proof.proofType"><b-icon
                          style="color:green;" icon="check-circle" aria-hidden="true"></b-icon> {{ proof.proofType }}
                        <b-icon class="trash" style="color:red" icon="trash" aria-hidden="true"></b-icon></span>
                    </div>
                  </div>
                </div>

                <div class="col" v-if="widgetConfigTemp.zkProof.enabled">
                  <div class="">
                    <label for=""><strong>Select Proof Type: </strong></label>
                    <b-form-select v-model="slectProof" :options="proofTypeOptions" size=""></b-form-select>
                    <div class="row" v-if="selectedProofData.criteria">
                      <div class="col">
                        <label for=""><strong>{{ selectedProofData.criteriaLabel }}: </strong></label>
                        <input :type="selectedProofData.criteriaType" class="form-control"
                          v-model="selectedProofData.criteriaValue" />
                      </div>
                    </div>
                    <small>{{ selectedProofData.description }}</small>
                    <div class="row col center mt-1">
                      <HfButtons name="Add" customClass="btn btn-outline-secondary" iconClass="fa fa-plus"
                        @executeAction="addZkProof(selectedProofData.value, selectedProofData.criteriaValue)">
                      </HfButtons>
                    </div>
                  </div>
                </div>
              </div>
            </li>
            <li class="list-group-item">
              <div class="row">
                <div class="col">
                  <b-form-checkbox switch size="lg" v-model="widgetConfigTemp.onChainId.enabled">{{
                    this.widgetConfigUI.onChainId.label }}</b-form-checkbox>
                  <small v-html="this.widgetConfigUI.onChainId.description"></small>
                </div>
                <div class="col" v-if="widgetConfigTemp.onChainId.enabled && onchainconfigsOptions.length > 0">
                  <div class="">
                    <label for=""><strong>Select OnChain KYC Config: </strong></label>
                    <b-form-select v-model="widgetConfigTemp.onChainId.selectedOnChainKYCconfiguration"
                      :options="onchainconfigsOptions" size=""></b-form-select>
                  </div>
                </div>
              </div>
            </li>

            <li class="list-group-item" v-if="widgetConfigTemp.userConsent.enabled">
              <div class="row">
                <div class="col">
                  <div class="row">
                    <div class="col-md-12">
                      <b-form-checkbox switch size="lg" v-model="widgetConfigTemp.userConsent.enabled" disabled>{{
                        this.widgetConfigUI.userConsent.label }}</b-form-checkbox>
                      <small v-html="widgetConfigUI.userConsent.description"></small>
                    </div>
                  </div>
                  <div class="row mt-2 mx-0 p-1"
                    style="border: 2px solid #8080802e;border-radius: 10px; min-height: 115px;">
                    <div class="col-md-3 center">
                      <div style="border: 1px solid #8080802e; border-radius: 50%;" class="p-1">
                        <img :src="widgetConfigTemp.userConsent.logoUrl" v-if="widgetConfigTemp.userConsent.logoUrl"
                          style="height: 50px; border-radius: 50%;">
                      </div>
                    </div>
                    <div class="col-md-8">
                      <div class="row">
                        <div class="col-md-12" style="font-size: 1.25rem;">
                          {{ widgetConfigTemp.userConsent.domain }}
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-md-12" style="color:grey">
                          {{ widgetConfigTemp.userConsent.reason }}
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
                <div class="col">
                  <div class="row">
                    <div class="col">
                      <div class="row">
                        <div class="col">
                          <label for=""><strong>Reason For KYC: </strong></label>
                          <textarea type="text" rows="7" class="form-control" id=""
                            v-model="widgetConfigTemp.userConsent.reason"
                            placeholder="The app is requesting the following information to verify your identity" />
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </li>
            <li class="list-group-item">
              <div class="row">

                <div class="col">
                  <b-form-checkbox switch size="lg" v-model="widgetConfigTemp.trustedIssuer" disabled>{{
                    widgetConfigUI.trustedIssuer.label }}</b-form-checkbox>
                  <small v-html="widgetConfigUI.trustedIssuer.description"></small>
                </div>
                <div class="col">
                  <label for=""><strong>Choose Trusted Issuer(s): </strong></label>
                  <div style="max-height: 300px; overflow-y: scroll;" class="p-1">
                    <MarketplaceList @selectedServiceEvent="selectedServiceEventHandler" />
                  </div>
                </div>
              </div>
              <!-- <TrustedIssuer @selectedServiceEventFromTrustedIssuer="selectedServiceEventHandler" /> -->
            </li>
          </ul>
        </div>
        <!-- <div class="row container mt-3">
          <div class="col center">
            <HfButtons name="Save Configuration" @executeAction="saveConfiguration()" v-if="!this.widgetConfigTemp._id">
            </HfButtons>
            <HfButtons name="Update Configuration" @executeAction="updateConfiguration()" v-else></HfButtons>
          </div>
        </div> -->
      </div>
    </div>

  </div>
</template>

<script>

import UtilsMixin from '../../../mixins/utils';
import { mapState, mapActions } from "vuex";
import HfButtons from '../../../components/element/HfButtons.vue';
import { mapGetters, mapMutations } from 'vuex/dist/vuex.common.js';
// import TrustedIssuer from './components/TrustedIssuer.vue';
import MarketplaceList from '../../../components/MarketplaceList.vue';
import HFBeta from '../../../components/element/HFBeta.vue';
const SupportedZkProofTypes = Object.freeze({
  PROOF_OF_KYC: 'zkProofKYC',
  PROOF_OF_PERSONHOOD: 'zkProofOfPersonHood',
  PROOF_OF_AGE: 'zkProofOfAge',
  PROOF_OF_MEMBERSHIP: 'zkProofOfMembership',
  PROOF_OF_DOB: 'zkProofOfDOB',
})

export default {
  name: "WidgetConfig",
  mixins: [UtilsMixin],
  components: {
    HfButtons,
    MarketplaceList,
    HFBeta
    // TrustedIssuer
  },
  // TODO : check why this is not working... we need to trigger warning that its an experimental feature once user enables zk
  watch: {
    // widgetConfigTemp: function (newValue,) {
    //   console.log(newValue)
    //   // if (newValue.zkProof.enabled) {
    //   this.warnUsers('b-toaster-top-full')
    //   console.log('warningn....')
    //   // }
    // }
  },
  computed: {
    ...mapState({
      containerShift: state => state.playgroundStore.containerShift,
      onchainconfigs: state => state.mainStore.onchainconfigs,
      widgetConfig: state => state.mainStore.widgetConfig
    }),
    ...mapGetters('mainStore', ['getAppByAppId', 'getMarketPlaceApps']),
    isContainerShift() {
      return this.containerShift
    },

    selectedProofData() {

      if (!this.slectProof) {
        return {}
      }
      return this.proofTypeOptions.find(x => x.value == this.slectProof)
    },

    onchainconfigsOptions() {
      const options = [];
      options.push({
        value: null,
        text: "Select OnChain KYC Configuration",
        selected: true
      })
      this.onchainconfigs.forEach(element => {
        options.push({
          value: element._id,
          text: element.blockchainLabel + "(" + element._id + ")"
        })
      });
      return options
    },
  },

  async mounted() {
    try {

      // appId
      this.isLoading = true
      // TODO: this we can stop until onchain feature is ready for production
      await this.fetchAppsOnChainConfigs()
      this.isLoading = false

      this.isLoading = true
      await this.fetchAppsWidgetConfig()
      this.isLoading = false

      await this.fetchMarketPlaceAppsFromServer()

    } catch (e) {
      this.isLoading = false
      console.log(e)
      if (e.message) {
        this.notifyErr(e.message)
      }
      // this.$router.push({ path: '/studio/dashboard' });
    }

    if (Object.keys(this.widgetConfig).length > 0) {
      this.widgetConfigTemp = { ...this.widgetConfig }
    }

    this.trustedIssuersList = this.getMarketPlaceApps;
    this.appId = this.$route.params.appId;
    if (this.appId) {
      this.app = { ...this.getAppByAppId(this.appId) }
      if (this.app) {
        this.widgetConfigTemp.userConsent.domain = this.app.domain ? this.app.domain : this.widgetConfigTemp.userConsent.domain;
        this.widgetConfigTemp.userConsent.logoUrl = this.app.logoUrl ? this.app.logoUrl : this.widgetConfigTemp.userConsent.logoUrl;
        if (!this.widgetConfigTemp.issuerDID) {
          this.widgetConfigTemp.issuerDID = this.app.issuerDid;
        }

        if (!this.getMarketPlaceApps.find(x => x.appId == this.app.appId)) {
          this.trustedIssuersList.push({ ...this.app })
        }
      }
    }

    if (this.widgetConfigTemp.issuerDID) {
      const trustedIssuers = this.widgetConfigTemp.issuerDID.split(',');
      this.selectedIssuerDids = new Set(trustedIssuers);
      trustedIssuers.forEach(eachtiss => {
        console.log({ eachtiss })
        const tt = this.trustedIssuersList.map(x => {
          if (x.issuerDid == eachtiss) {
            x['selected'] = true
          }
          return x
        })
        this.insertMarketplaceApps(tt)
      })
    }

    this.widgetConfigTemp.trustedIssuer = this.widgetConfigTemp.issuerDID ? true : false;



    if (!this.widgetConfigTemp.zkProof.proofs) {
      this.widgetConfigTemp.zkProof.proofs = []
    }
    // this.widgetConfigTemp.zkProof = {
    //   enabled: false,
    //   proofType: null,
    // }
  },
  data() {
    return {
      widgetConfigUI: {
        faceRecog: {
          label: "Enable Facial Recoginition",
          description: 'Enable users verify if they are human and generate Personhood Credential. Read more <b><a href="https://docs.hypersign.id/hypersign-kyc/integrations/widget-configuration#facial-recognition" target="_blank">here</a></b>.'
        },
        idOcr: {
          label: "Enable ID Document Verification",
          description: 'Enable users verify their ID Document and generate their ID Credential. Read more <b><a href="https://docs.hypersign.id/hypersign-kyc/integrations/widget-configuration#id-document-verification" target="_blank">here</a></b>.'
        },
        userConsent: {
          label: "Enable User Consent",
          description: 'Specify a reason for requesting user KYC data. This information will be displayed on the user consent screen in the KYC widget, helping users understand who is requesting their data and why. Read more <b><a href="https://docs.hypersign.id/hypersign-kyc/integrations/widget-configuration#user-consent" target="_blank">here</a></b>.'
        },
        onChainId: {
          label: "Enable Onchain KYC",
          description: "Enable users to mint SBT of their credentials in a privacy preserving manner and verify on configured blockchain"
        },
        zkProof: {
          label: "Enable ZK Proof",
          description: 'Enable users to share only proof of their data for enhanced data privacy and compliance. Read more <b><a href="https://docs.hypersign.id/hypersign-kyc/integrations/widget-configuration#id-document-verification" target="_blank">here</a></b>.'
        },
        trustedIssuer: {
          label: "Configure Trusted Issuer(s)",
          description: 'Select one or more trusted issuers, with the default being "self". This pertains toreusable KYC. If configured, users who already possess KYC credentials issued by these trusted issuers in their data vault will not need to repeat the KYC steps in the widget. They can simply authorize the sharing of their existing credentials with your app, streamlining user onboarding for your company and providing a smoother experience for your users. Read more <b><a href="https://docs.hypersign.id/hypersign-kyc/integrations/widget-configuration#trusted-issuer" target="_blank">here</a></b>.'
        },
      },
      fullPage: true,
      isLoading: false,
      appId: "",
      app: {},
      trustedIssuersList: [],
      widgetConfigTemp: {
        faceRecog: true,
        idOcr: {
          enabled: false,
          documentType: null
        },
        userConsent: {
          enabled: true,
          reason: "The app is requesting your KYC data to provide you service",
          logoUrl: "https://static.thenounproject.com/png/4974686-200.png",
          domain: "http://localhost:6006",
        },
        onChainId: {
          enabled: false,
          selectedOnChainKYCconfiguration: null,
        },
        zkProof: {
          enabled: false,
          proofs: []
        },
        trustedIssuer: true,
        issuerDID: "",
        issuerVerificationMethodId: "",
      },
      selectedIssuerDids: new Set(),
      documentTypeOptions: [
        {
          value: null,
          text: "Select a document type"
        },
        {
          value: 'passport',
          text: "Passport"
        },
      ],

      slectProof: null,
      proofTypeOptions: [
        {
          value: null,
          text: "Select a proof type"
        },
        {
          value: 'zkProofKYC',
          text: "Proof Of KYC",
          description: "Proves that user has finished his/her KYC",
          enabled: true,
          criteria: false,
        },
        {
          value: 'zkProofOfPersonHood',
          text: "Proof Of Personhood",
          description: "Proves that user is not a bot",
          enabled: true,
          criteria: false,
        },
        {
          value: 'zkProofOfAge',
          text: "Proof Of Age",
          description: "Proves user is above the specified age",
          enabled: true,
          criteria: true,
          criteriaValue: "",
          criteriaLabel: "Specify Age (> than)",
          criteriaType: 'number'
        },

        // {
        //   value: 'zkProofOfDOB',
        //   text: "Proof Of DOB",
        //   description: "Proves user's date of birth (discloses DOB, nothing else)",
        //   enabled: true,
        // },
        // {
        //   value: 'zkProofOfMembership',
        //   text: "Proof Of Membership Country",
        //   description: "Proves user is not citizen of specified countries",
        //   enabled: true,
        // },
      ],

    }
  },
  methods: {
    ...mapMutations('mainStore', ['setWidgetConfig', 'setPreparedMarketPlaceApps', 'insertMarketplaceApps']),
    ...mapActions('mainStore', ['fetchAppsOnChainConfigs', 'fetchMarketPlaceAppsFromServer', 'createAppsWidgetConfig', 'fetchAppsWidgetConfig', 'updateAppsWidgetConfig']),

    selectedServiceEventHandler(event) {
      console.log('inside selectedServiceEventHandler event ' + event.issuerDid)
      if (!this.selectedIssuerDids.has(event.issuerDid)) {
        this.selectedIssuerDids.add(event.issuerDid)
      } else {
        this.selectedIssuerDids.delete(event.issuerDid)
      }
      this.widgetConfigTemp.issuerDID = Array.from(this.selectedIssuerDids.values()).join(',')
    },
    validateField() {
      if (!this.widgetConfigTemp.issuerDID) {
        throw new Error('Issuer DID is required')
      }

      if (!this.widgetConfigTemp.idOcr?.enabled) {
        this.widgetConfigTemp.idOcr.documentType = null
      } else {
        if (!this.widgetConfigTemp.idOcr.documentType) {
          throw new Error('Kindly select a document type')
        }
      }

      if (!this.widgetConfigTemp.onChainId.enabled) {
        this.widgetConfigTemp.onChainId.selectedOnChainKYCconfiguration = null
      } else {
        if (!this.widgetConfigTemp.onChainId.selectedOnChainKYCconfiguration) {
          throw new Error('Kindly select a onchain configuration')
        }
      }
    },
    async saveConfiguration() {
      try {
        //TODO validate all fields
        this.isLoading = true;
        this.validateField()
        this.setWidgetConfig(this.widgetConfigTemp)
        await this.createAppsWidgetConfig()
        if (this.widgetConfig) {
          this.widgetConfigTemp = { ...this.widgetConfig }
        }

        this.isLoading = false

      } catch (e) {
        this.isLoading = false
        this.notifyErr(e)
      }
    },

    deleteZkProof(proof) {
      this.widgetConfigTemp.zkProof.proofs = this.widgetConfigTemp.zkProof.proofs.filter(x => x.proofType != proof)
      this.updateConfiguration()
    },
    addZkProof(proofType, criteria) {

      if (!proofType) {
        return this.notifyErr(`Proof Type must be slected`)
      }

      if (this.widgetConfigTemp.zkProof.enabled) {
        if (!this.widgetConfigTemp.zkProof.proofs) {
          this.widgetConfigTemp.zkProof.proofs = []
        }

        if (proofType == SupportedZkProofTypes.PROOF_OF_AGE) {
          if (!criteria) {
            return this.notifyErr('Kindly specify age criteria to generate proof')
          }
        } else {
          criteria = null
        }

        if (this.widgetConfigTemp.zkProof.proofs.find(x => x.proofType === proofType)) {
          this.slectProof = null
          return this.notifyErr(`Proof Type ${proofType} is already added`)
        }

        this.widgetConfigTemp.zkProof.proofs.push({
          proofType,
          criteria,
        })
      }
      this.slectProof = null

      this.updateConfiguration()
    },

    async updateConfiguration() {
      try {
        //TODO validate all field
        this.isLoading = true;
        this.validateField()
        this.setWidgetConfig(this.widgetConfigTemp)
        await this.updateAppsWidgetConfig()

        if (this.widgetConfig) {
          this.widgetConfigTemp = { ...this.widgetConfig }
          this.widgetConfigTemp.trustedIssuer = this.widgetConfigTemp.issuerDID ? true : false;
        }
        this.isLoading = false
      } catch (e) {
        this.isLoading = false
        this.notifyErr(e)
      }


    },
  }
};
</script>
