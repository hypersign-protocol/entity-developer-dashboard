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

.card-header {
  background: aliceblue;
  padding: 0px;
}

.card {
  border-radius: 10px;
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
          <ul class="list-group list-group-flush">
            <li class="list-group-item">
              <b-form-checkbox switch size="lg" v-model="widgetConfigTemp.faceRecog" disabled>Enable Facial
                Recoginition</b-form-checkbox>
              <small>Enable users verify if they are human and generate Personhood Credential</small>
            </li>
            <li class="list-group-item">
              <div class="row">
                <div class="col">
                  <b-form-checkbox switch size="lg" v-model="widgetConfigTemp.idOcr.enabled">Enable ID Document
                    Verification</b-form-checkbox>
                  <small>Enable users verify their ID Document and generate their ID Credential</small>
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
            <!-- <li class="list-group-item">
              <div class="row">
                <div class="col">
                  <b-form-checkbox switch size="lg" v-model="widgetConfigTemp.onChainId.enabled">Enable Onchain
                    KYC</b-form-checkbox>
                  <small>Lorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsum</small>
                </div>
                <div class="col" v-if="widgetConfigTemp.onChainId.enabled && onchainconfigsOptions.length > 0">
                  <div class="">
                    <label for=""><strong>Select OnChain KYC Config: </strong></label>
                    <b-form-select v-model="widgetConfigTemp.onChainId.selectedOnChainKYCconfiguration"
                      :options="onchainconfigsOptions" size=""></b-form-select>
                  </div>
                </div>
              </div>
            </li> -->
            <li class="list-group-item" v-if="widgetConfigTemp.userConsent.enabled">
              <div class="row">
                <div class="col">
                  <div class="row">
                    <div class="col">
                      <b-form-checkbox switch size="lg" v-model="widgetConfigTemp.userConsent.enabled" disabled>Enable
                        User
                        Consent</b-form-checkbox>
                      <small></small>
                    </div>
                    <div class="row mt-2">
                      <div class="col-md-3">
                        <img :src="widgetConfigTemp.userConsent.logoUrl" v-if="widgetConfigTemp.userConsent.logoUrl"
                          width="100" height="100">
                      </div>
                      <div class="col-md-8">
                        <div class="row">
                          <div class="col">
                            <h4>{{ widgetConfigTemp.userConsent.domain }}</h4>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col" style="color:grey">
                            {{ widgetConfigTemp.userConsent.reason }}
                          </div>

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
                          <input type="text" class="form-control" id="" v-model="widgetConfigTemp.userConsent.reason"
                            placeholder="The app is requesting the following information to verify your identity" />
                        </div>
                      </div>
                      <div class="row mt-2">
                        <div class="col">
                          <label for=""><strong>Enter Logo URL: </strong></label>
                          <input type="textarea" rows="10" class="form-control" id=""
                            v-model="widgetConfigTemp.userConsent.logoUrl" />
                        </div>
                      </div>
                      <div class="row mt-2">
                        <div class="col">
                          <label for=""><strong>Enter Domain: </strong></label>
                          <input type="textarea" rows="10" class="form-control" id=""
                            v-model="widgetConfigTemp.userConsent.domain" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
            <li class="list-group-item">
              <div class="row">
                <div class="col-6"></div>
                <div class="col-6">
                  <label for=""><strong>Enter Issuer DID: </strong></label>
                  <input type="textarea" rows="10" class="form-control" id="" v-model="widgetConfigTemp.issuerDID" />
                </div>
                <!-- <div class="col-6" v-if="issuerDID">
                  <label for=""><strong>Choose Verification Method Id: </strong></label>
                  <input type="textarea" rows="10" class="form-control" id="" v-model="issuerVerificationMethodId" />
                </div> -->
              </div>

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

import UtilsMixin from '../../mixins/utils';
import { mapState, mapActions } from "vuex";
import HfButtons from '../../components/element/HfButtons.vue';
import { mapMutations } from 'vuex/dist/vuex.common.js';

export default {
  name: "WidgetConfig",
  mixins: [UtilsMixin],
  components: {
    HfButtons
  },
  computed: {
    ...mapState({
      containerShift: state => state.playgroundStore.containerShift,
      onchainconfigs: state => state.mainStore.onchainconfigs,
      widgetConfig: state => state.mainStore.widgetConfig
    }),
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
    }
  },

  async created() {
    try {
      // const usrStr = localStorage.getItem("user");
      // this.user = JSON.parse(usrStr);
      // this.updateSideNavStatus(true)

      // appId
      this.isLoading = true
      await this.fetchAppsOnChainConfigs()
      this.isLoading = false

      this.isLoading = true
      await this.fetchAppsWidgetConfig()
      this.isLoading = false


      if (this.widgetConfig) {
        this.widgetConfigTemp = { ...this.widgetConfig }
      }

    } catch (e) {
      this.isLoading = false
      console.log(e)
      if (e.message) {
        this.notifyErr(e.message)
      }
      // this.$router.push({ path: '/studio/dashboard' });
    }
  },
  data() {
    return {
      fullPage: true,
      isLoading: false,


      widgetConfigTemp: {
        faceRecog: true,
        idOcr: {
          enabled: false,
          documentType: null
        },
        userConsent: {
          enabled: true,
          reason: "The app is requesting the following information to verify your identity",
          logoUrl: "https://static.thenounproject.com/png/4974686-200.png",
          domain: "http://localhost:6006",
        },
        onChainId: {
          enabled: false,
          selectedOnChainKYCconfiguration: null,
        },
        issuerDID: "",
        issuerVerificationMethodId: "",
      },


      documentTypeOptions: [
        {
          value: null,
          text: "Select a document type"
        },
        {
          value: 'passport',
          text: "Passport"
        },
      ]
    }
  },
  methods: {
    ...mapMutations('mainStore', ['setWidgetConfig']),
    ...mapActions('mainStore', ['fetchAppsOnChainConfigs', 'createAppsWidgetConfig', 'fetchAppsWidgetConfig', 'updateAppsWidgetConfig']),

    validateField() {
      if (!this.widgetConfigTemp.issuerDID) {
        throw new Error('Issuer DID is required')
      }



      if (!this.widgetConfigTemp.idOcr.enabled) {
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

    async updateConfiguration() {


      try {
        //TODO validate all field
        this.isLoading = true;
        this.validateField()
        this.setWidgetConfig(this.widgetConfigTemp)
        await this.updateAppsWidgetConfig()

        if (this.widgetConfig) {
          this.widgetConfigTemp = { ...this.widgetConfig }
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
