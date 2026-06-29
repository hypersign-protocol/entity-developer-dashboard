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

.selective-field-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 8px 12px;
}

.selective-field-badge {
  border: 1px solid #d8dee8;
  color: #334155;
  margin-right: 6px;
  margin-bottom: 6px;
  padding: 6px 8px;
}

/* .zkbadge {
  background-color: lightblue;
  margin-left: 3px;
  margin-top: 3px;
  color: black;
  min-height: 20px;
  align-content: center;
  padding: 5px;
  font-size: x-small;
  font-weight: bold;
  max-width: 200px;
  float: left;
}

.zkbadge:hover {
  background-color: lightcoral;
} */
</style>
<template>
  <b-container fluid class="py-3" :class="isContainerShift ? 'homeShift' : 'home'">
    <load-ing :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></load-ing>
    <AccessDenied v-if="accessDenied" />
    <template v-if="!accessDenied">
    <v-row>
      <v-col>
        <div class="form-group" style="display:flex">
          <div class="mb-3">
              <h4 class="mb-1 font-weight-bold mb-0">ID Widget Configuration</h4>
              <p class="text-muted small mb-0">Configure the ID widget for your application</p>
          </div>
        </div>
      </v-col>
      <v-col >
        <HfButtons name="Save Configuration" @executeAction="saveConfiguration()" v-if="!widgetConfigTemp._id"
          style="float:right"></HfButtons>
        <HfButtons name="Update Configuration" @executeAction="updateConfiguration()" style="float:right" v-else>
        </HfButtons>
      </v-col>
    </v-row>

    <div class="serviceCard">
      <ul class="list-group list-group-flush">
        <li class="list-group-item">
          <b-form-checkbox switch size="lg" v-model="widgetConfigTemp.faceRecog" disabled title="Facial recognition is always enabled and cannot be disabled">{{
            this.widgetConfigUI.faceRecog.label }}</b-form-checkbox>
          <small v-html="widgetConfigUI.faceRecog.description"></small>
          <small class="text-muted d-block"><i class="mdi mdi-lock-outline mr-1"></i>This feature is always enabled and cannot be turned off.</small>
        </li>
        <li class="list-group-item">
          <div class="row">
            <div class="col">
              <b-form-checkbox switch size="lg" v-model="widgetConfigTemp.idOcr.enabled">
                {{ this.widgetConfigUI.idOcr.label }}</b-form-checkbox>
              <small v-html="this.widgetConfigUI.idOcr.description"></small>
            </div>
            <!-- <div class="col" v-if="widgetConfigTemp.idOcr.enabled && documentTypeOptions.length > 0">
                  <div class="">
                    <label for=""><strong>Select Document Type: </strong></label>
                    <b-form-select v-model="widgetConfigTemp.idOcr.documentType" :options="documentTypeOptions"
                      size=""></b-form-select>
                  </div>
                </div> -->
          </div>
        </li> 
       
        <li class="list-group-item">
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
                    <div class="col-md-12" style="font-size: 1.05rem;">
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
            <!-- <div class="col">
              <div class="row">
                <div class="col">
                  <div class="row">
                    <div class="col">
                      <label for=""><strong>Reason For KYC: </strong></label>
                      <textarea type="text" rows="7" class="serviceCard form-control" id=""
                        v-model="widgetConfigTemp.userConsent.reason"
                        placeholder="The app is requesting the following information to verify your identity" />
                    </div>
                  </div>

                </div>
              </div>
            </div> -->
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
                <MarketplaceList @selectedServiceEvent="selectedServiceEventHandler" :isSelection="true" />
              </div>
            </div>
          </div>
          <!-- <TrustedIssuer @selectedServiceEventFromTrustedIssuer="selectedServiceEventHandler" /> -->
        </li>


        <li class="list-group-item">
          <div class="row">
            <div class="col-md-6">
              <b-form-checkbox
                switch
                size="lg"
                v-model="widgetConfigTemp.selectiveDisclosure.enabled"
                :disabled="!widgetConfigTemp.idOcr.enabled"
              >
                {{ widgetConfigUI.selectiveDisclosure.label }} <HFBeta></HFBeta>
              </b-form-checkbox>
              <small v-html="widgetConfigUI.selectiveDisclosure.description"></small>
            </div>
            <div class="col" v-if="widgetConfigTemp.selectiveDisclosure.enabled">
              <label for="selective-disclosure-fields"><strong>Select Information: </strong></label>
              <b-form-checkbox-group
                id="selective-disclosure-fields"
                v-model="widgetConfigTemp.selectiveDisclosure.fields"
                :options="selectiveDisclosureFieldOptions"
                class="selective-field-grid"
              ></b-form-checkbox-group>
              <div class="mt-2">
                <b-badge
                  v-for="field in widgetConfigTemp.selectiveDisclosure.fields"
                  :key="field"
                  variant="light"
                  class="selective-field-badge"
                >
                  {{ getSelectiveDisclosureFieldLabel(field) }}
                </b-badge>
              </div>
            </div>
          </div>
        </li>

         <li class="list-group-item">
          <div class="row">
            <div class="col-md-6">
              <div class="row">
                <div class="col-md-12">
                  <b-form-checkbox switch size="lg" v-model="widgetConfigTemp.zkProof.enabled"
                  :disabled="!widgetConfigTemp.idOcr.enabled">{{
                    this.widgetConfigUI.zkProof.ageProof.label }}<HFBeta></HFBeta>
                  </b-form-checkbox>
                  <small v-html="this.widgetConfigUI.zkProof.ageProof.description"></small>
                </div>
              </div>
              <!-- <div class="mt-2 mx-0 p-1"
                style="border: 2px solid #8080802e; border-radius: 10px; min-height: 80px; padding:10px"
                v-if="widgetConfigTemp.zkProof.proofs.length > 0">
                <div class="">
                  <span class="zkbadge rounded " style="cursor: grab;" @click="deleteZkProof(proof.proofType)"
                    v-for="proof in widgetConfigTemp.zkProof.proofs" v-bind:key="proof.proofType"><b-icon
                      style="color:green;" icon="check-circle" aria-hidden="true"></b-icon>
                    <span v-if="proof.proofType == SupportedZkProofTypes.PROOF_OF_AGE">
                      {{ proof.proofType }} > {{ proof.criteria }}
                    </span>
                    <span v-else>
                      {{ proof.proofType }}
                    </span>

                    <b-icon class="trash" style="color:red" icon="trash" aria-hidden="true"></b-icon></span>
                </div>
              </div> -->
            </div>

            <div class="col" v-if="widgetConfigTemp.zkProof.enabled">
              <div class="row">
                <div class="col">
                  <label for="age-proof-criteria"><strong>Minimum Age: </strong></label>
                  <b-form-input id="age-proof-criteria" v-model="ageProofCriteria" placeholder="Enter age"
                    type="number" min="1"></b-form-input>
                </div>
              </div>
            </div>
          </div>
        </li>
        <!-- <li class="list-group-item">
          <div class="row">
            <div class="col-md-6">
              <b-form-checkbox switch size="lg" v-model="widgetConfigTemp.onChainId.enabled">{{
                this.widgetConfigUI.onChainId.label }} <HFBeta></HFBeta></b-form-checkbox>
              <small v-html="this.widgetConfigUI.onChainId.description"></small>
            </div>
            <div class="col" v-if="widgetConfigTemp.onChainId.enabled && onchainconfigsOptions.length > 0">
              <div class="">
                <label for=""><strong>Select OnChain KYC Config: </strong></label>
                <v-select v-model="widgetConfigTemp.onChainId.selectedOnChainKYCconfiguration"
                  :items="onchainconfigsOptions" item-text="text" item-value="value" multiple small-chips attach dense
                  outlined></v-select>
              </div>
            </div>
          </div>
        </li> -->
        <li class="list-group-item">
          <div class="row">
            <div class="col-md-6">
              <b-form-checkbox
                switch
                size="lg"
                v-model="widgetConfigTemp.isEmailNotificationEnabled"
              >
                {{ widgetConfigUI.emailNotification.label }}
              </b-form-checkbox>
              <small v-html="widgetConfigUI.emailNotification.description"></small>
            </div>
          </div>
        </li>
      </ul>
    </div>


    </template>
  </b-container>
</template>

<script>

import UtilsMixin from '../../../mixins/utils';
import { mapState, mapActions } from "vuex";
import HfButtons from '../../../components/element/HfButtons.vue';
import { mapGetters, mapMutations } from 'vuex/dist/vuex.common.js';
import AccessDenied from '../../AccessDenied.vue';
import { isAccessDeniedError } from '../../../utils/accessDenied';
// import TrustedIssuer from './components/TrustedIssuer.vue';
import MarketplaceList from '../../../components/MarketplaceList.vue';
import HFBeta from '../../../components/element/HFBeta.vue';

export default {
  name: "WidgetConfig",
  mixins: [UtilsMixin],
  components: {
    HfButtons,
    MarketplaceList,
    HFBeta,
    AccessDenied
    // TrustedIssuer
  },
  // TODO : check why this is not working... we need to trigger warning that its an experimental feature once user enables zk
 watch: {
  'widgetConfigTemp.zkProof.enabled': {
    handler(enabled) {
      // Don't allow enabling ZK Proof unless ID OCR is enabled
      if (enabled && !this.widgetConfigTemp.idOcr.enabled) {
        this.widgetConfigTemp.zkProof.enabled = false;
        return;
      }
      // Default age
      if (enabled && !this.ageProofCriteria) {
        this.ageProofCriteria = 18;
      }
      // Disable dependent feature
      if (!enabled) {
        this.widgetConfigTemp.onChainId.enabled = false;
        this.widgetConfigTemp.onChainId.selectedOnChainKYCconfiguration = null;
        this.widgetConfigTemp.zkProof.proofs = [];
      }
    }
  },

  'widgetConfigTemp.idOcr.enabled': {
    handler(enabled) {
      // If ID Document is disabled,
      // automatically disable all dependent features.
      if (!enabled) {
        this.widgetConfigTemp.zkProof.enabled = false;
        this.widgetConfigTemp.zkProof.proofs = [];

        this.widgetConfigTemp.onChainId.enabled = false;
        this.widgetConfigTemp.onChainId.selectedOnChainKYCconfiguration = null;

        this.widgetConfigTemp.selectiveDisclosure.enabled = false;
        this.widgetConfigTemp.selectiveDisclosure.fields = [];
        this.widgetConfigTemp.selectiveDisclosure.frame = null;
       
    }
    }
  },

  'widgetConfigTemp.selectiveDisclosure.enabled': {
    handler(enabled) {
      if (enabled && !this.widgetConfigTemp.idOcr.enabled) {
        this.widgetConfigTemp.selectiveDisclosure.enabled = false;
        return;
      }

      if (enabled && this.widgetConfigTemp.selectiveDisclosure.fields.length === 0) {
        this.widgetConfigTemp.selectiveDisclosure.fields = [...this.defaultSelectiveDisclosureFields]
      }

      if (!enabled) {
        this.widgetConfigTemp.selectiveDisclosure.fields = [];
        this.widgetConfigTemp.selectiveDisclosure.frame = null;
      }
    }
  }
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
      await this.fetchAppsWidgetConfig()
      await this.fetchMarketPlaceAppsFromServer()
      this.isLoading = false
    } catch (e) {
      this.isLoading = false
      return this.handleApiError(e, 'GET')
    }

    if (Object.keys(this.widgetConfig).length > 0) {
      this.widgetConfigTemp = JSON.parse(JSON.stringify(this.widgetConfig))
    }

    this.trustedIssuersList = [...this.getMarketPlaceApps];
    this.appId = this.$route.params.appId;
    //eslint-disable-next-line
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
         this.trustedIssuersList.sort((a, b) => {
          if (a.appId === this.appId) return -1;
          if (b.appId === this.appId) return 1;
          return 0;
        });
      } else {
        console.error("No app found");
      }
    } else {
      console.error("No appId found");
    }

    if (this.widgetConfigTemp.issuerDID) {
      const trustedIssuers = this.widgetConfigTemp.issuerDID.split(',');
      this.selectedIssuerDids = new Set(trustedIssuers);
      trustedIssuers.forEach(eachtiss => {
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

    this.ensureSelectiveDisclosure()


    if (!this.widgetConfigTemp.zkProof.proofs) {
      this.widgetConfigTemp.zkProof.proofs = []
    }
    const ageProof = this.widgetConfigTemp.zkProof.proofs.find(
      proof => proof.proofType === this.SupportedZkProofTypes.PROOF_OF_AGE
    )
    this.ageProofCriteria = ageProof?.criteria || ''
    // this.widgetConfigTemp.zkProof = {
    //   enabled: false,
    //   proofType: null,
    // }
  },
  data() {
    return {
      SupportedZkProofTypes: Object.freeze({
        PROOF_OF_AGE: 'zkProofOfAge',
      }),
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
        
        trustedIssuer: {
          label: "Configure Trusted Issuer(s)",
          description: 'Select one or more trusted issuers, with the default being "self". This pertains to Reusable ID. If configured, users who already possess KYC credentials issued by these trusted issuers in their data vault will not need to repeat the KYC steps in the widget. They can simply authorize the sharing of their existing credentials with your app, streamlining user onboarding for your company and providing a smoother experience for your users. Read more <b><a href="https://docs.hypersign.id/hypersign-kyc/integrations/widget-configuration#trusted-issuer" target="_blank">here</a></b>.'
        },
        onChainId: {
          label: "Enable Onchain KYC",
          description: "Enable users to mint SBT of their credentials in a privacy preserving manner and verify on configured blockchain"
        },
        zkProof: {
          ageProof:{
            label: "Configure Age Verification",
            description: "Enable users to prove they meet a minimum age requirement without sharing their exact date of birth. Read more <b><a href=\"https://docs.hypersign.id/hypersign-kyc/integrations/widget-configuration#id-document-verification\" target=\"_blank\">here</a></b>."
          }
        },
        selectiveDisclosure: {
          label: "Ask Specific Information (Selective Disclosure)",
          description: "Select ID credential fields to request through selective disclosure."
        },
        emailNotification: {
           label: "Enable Email Notifications",
           description: "Notify users via email regarding the status of their ID verification. When enabled, users will receive automated updates upon the successful completion or rejection of their verification attempt."
        },
      },
      fullPage: true,
      isLoading: false,
      accessDenied: false,
      accessDeniedMsg: '',
      appId: "",
      app: {},
      trustedIssuersList: [],
      widgetConfigTemp: {
        faceRecog: true,
        idOcr: {
          enabled: false,
          documentType: 'passport'
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
        selectiveDisclosure: {
          enabled: false,
          fields: [],
          frame: null,
        },
        trustedIssuer: true,
        isEmailNotificationEnabled: true,
        issuerDID: "",
        issuerVerificationMethodId: "",
      },
      selectedIssuerDids: new Set(),
      ageProofCriteria: '',
      defaultSelectiveDisclosureFields: ['docModel', 'givenNames', 'surname', 'sex', 'nationality', 'dateOfBirth'],
      selectiveDisclosureFieldOptions: [
        { value: 'docModel', text: 'Document Model' },
        { value: 'givenNames', text: 'Given Names' },
        { value: 'surname', text: 'Surname' },
        { value: 'sex', text: 'Sex' },
        { value: 'nationality', text: 'Nationality' },
        { value: 'dateOfBirth', text: 'Date of Birth' },
      ],
      documentTypeOptions: [
        {
          value: null,
          text: "Select a document type"
        },
        {
          value: 'passport',
          text: "Passport"
        },
         {
          value: 'govId',
          text: "Government ID"
        },
      ],

    }
  },
  methods: {
    ...mapMutations('mainStore', ['setWidgetConfig', 'setPreparedMarketPlaceApps', 'insertMarketplaceApps']),
    ...mapActions('mainStore', ['fetchAppsOnChainConfigs', 'fetchMarketPlaceAppsFromServer', 'createAppsWidgetConfig', 'fetchAppsWidgetConfig', 'updateAppsWidgetConfig']),
    handleApiError(error, method = 'GET') {
      const message = typeof error === 'string' ? error : error?.message || 'Something went wrong';
      if (method.toUpperCase() === 'GET' && isAccessDeniedError(error)) {
        this.accessDenied = true;
        this.accessDeniedMsg = message;
        return;
      }

      this.notifyErr(message)
    },

    selectedServiceEventHandler(event) {
      // Guard: ignore entries with no issuerDid
      if (!event.issuerDid || !event.issuerDid.trim()) return

      // Use explicit selected flag instead of toggle to stay in sync
      if (event.selected) {
        this.selectedIssuerDids.add(event.issuerDid)
      } else {
        this.selectedIssuerDids.delete(event.issuerDid)
      }
      this.widgetConfigTemp.issuerDID = Array.from(this.selectedIssuerDids.values())
        .filter(did => !!did && !!did.trim())
        .join(',')
    },
    ensureSelectiveDisclosure() {
      if (!this.widgetConfigTemp.selectiveDisclosure) {
        this.$set(this.widgetConfigTemp, 'selectiveDisclosure', {
          enabled: false,
          fields: [],
          frame: null,
        })
      }

      if (!Array.isArray(this.widgetConfigTemp.selectiveDisclosure.fields)) {
        this.$set(this.widgetConfigTemp.selectiveDisclosure, 'fields', [])
      }

      if (!Object.prototype.hasOwnProperty.call(this.widgetConfigTemp.selectiveDisclosure, 'frame')) {
        this.$set(this.widgetConfigTemp.selectiveDisclosure, 'frame', null)
      }

      if (
        this.widgetConfigTemp.selectiveDisclosure.enabled &&
        this.widgetConfigTemp.selectiveDisclosure.fields.length === 0
      ) {
        const framedFields = Object.keys(this.widgetConfigTemp.selectiveDisclosure.frame?.credentialSubject || {})
          .filter(field => field !== '@explicit' && this.defaultSelectiveDisclosureFields.includes(field))

        this.widgetConfigTemp.selectiveDisclosure.fields = framedFields.length > 0
          ? framedFields
          : [...this.defaultSelectiveDisclosureFields]
      }
    },
    getSelectiveDisclosureFieldLabel(field) {
      const option = this.selectiveDisclosureFieldOptions.find(item => item.value === field)
      return option ? option.text : field
    },
    generateSelectiveDisclosureFrame(fields) {
      const credentialSubject = fields.reduce((frame, field) => {
        frame[field] = {}
        return frame
      }, {
        '@explicit': true,
      })

      return {
        '@context': [
          'https://www.w3.org/2018/credentials/v1',
          'https://raw.githubusercontent.com/hypersign-protocol/hypersign-contexts/main/BJJSignature2021.jsonld',
          'https://schema.org'
        ],
        type: [
          'VerifiableCredential'
        ],
        credentialSubject,
      }
    },
    syncSelectiveDisclosure() {
      this.ensureSelectiveDisclosure()

      if (!this.widgetConfigTemp.selectiveDisclosure.enabled) {
        this.widgetConfigTemp.selectiveDisclosure.fields = []
        this.widgetConfigTemp.selectiveDisclosure.frame = null
        return
      }

      const selectedFields = this.widgetConfigTemp.selectiveDisclosure.fields
        .filter(field => this.defaultSelectiveDisclosureFields.includes(field))

      this.widgetConfigTemp.selectiveDisclosure.fields = selectedFields
      this.widgetConfigTemp.selectiveDisclosure.frame = this.generateSelectiveDisclosureFrame(selectedFields)
    },
    syncAgeProof() {
      if (!this.widgetConfigTemp.zkProof.proofs) {
        this.widgetConfigTemp.zkProof.proofs = []
      }

      if (!this.widgetConfigTemp.zkProof.enabled || !this.ageProofCriteria) {
        this.widgetConfigTemp.zkProof.proofs = []
        return
      }

      this.widgetConfigTemp.zkProof.proofs = [{
        proofType: this.SupportedZkProofTypes.PROOF_OF_AGE,
        criteria: this.ageProofCriteria,
      }]
    },
    validateField() {
      if (!this.widgetConfigTemp.issuerDID) {
        throw new Error('Issuer DID is required')
      }

      if (!this.widgetConfigTemp.idOcr?.enabled) {
        this.widgetConfigTemp.idOcr.documentType = null
      } else {
        if (!this.widgetConfigTemp.idOcr.documentType) {
          this.widgetConfigTemp.idOcr.documentType = 'passport'
        }
      }

      if (this.widgetConfigTemp.selectiveDisclosure.enabled) {
        if (!this.widgetConfigTemp.idOcr.enabled) {
          throw new Error('Selective disclosure requires ID document verification. Please enable ID document verification to proceed.')
        }

        if (this.widgetConfigTemp.selectiveDisclosure.fields.length === 0) {
          throw new Error('Kindly select information to request through selective disclosure')
        }
      }

      if (!this.widgetConfigTemp.onChainId.enabled) {
        this.widgetConfigTemp.onChainId.selectedOnChainKYCconfiguration = null
        this.widgetConfigTemp.onChainId.enabled = false
      } else {


        if (!this.widgetConfigTemp.onChainId.selectedOnChainKYCconfiguration) {
          throw new Error('Kindly select a onchain configuration')
        }
        this.widgetConfigTemp.onChainId.selectedOnChainKYCconfiguration = this.widgetConfigTemp.onChainId.selectedOnChainKYCconfiguration.filter(e => !!e)

        if (!this.widgetConfigTemp.zkProof.enabled) {
          throw new Error('Enable ZK Proof to enable onchainId')
        }

      }

      if (this.widgetConfigTemp.zkProof.enabled) {
        if (!this.ageProofCriteria) {
          throw new Error('Kindly specify age criteria to generate proof')
        }
        if (!this.widgetConfigTemp.idOcr.enabled) {
          throw new Error('Age verification requires ID document verification. Please enable ID document verification to proceed.')
        }
      }
    },
    async saveConfiguration() {
      try {
        //TODO validate all fields
        this.isLoading = true;
        this.syncAgeProof()
        this.syncSelectiveDisclosure()
        this.validateField()
        this.setWidgetConfig(this.widgetConfigTemp)
        await this.createAppsWidgetConfig()
        if (this.widgetConfig) {
          this.widgetConfigTemp = JSON.parse(JSON.stringify(this.widgetConfig))
        }

        this.isLoading = false

      } catch (e) {
        this.isLoading = false
        this.notifyErr(e.message)
      }
    },

    async updateConfiguration() {
      try {
        //TODO validate all field
        this.isLoading = true;
        this.syncAgeProof()
        this.syncSelectiveDisclosure()
        this.validateField()

        this.setWidgetConfig(this.widgetConfigTemp)
        await this.updateAppsWidgetConfig()
        if (this.widgetConfig) {
          // this.widgetConfigTemp = { ...this.widgetConfig }
          this.widgetConfigTemp.trustedIssuer = this.widgetConfigTemp.issuerDID ? true : false;
        }
        this.isLoading = false
      } catch (e) {
        this.isLoading = false
        this.notifyErr(e.message)
      }


    },
  }
};
</script>
