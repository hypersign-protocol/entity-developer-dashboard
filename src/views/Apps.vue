<template>
  <div>
    <loading :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></loading>
    <div style="display: flex" class="">
      <div v-if="appList.length > 0" class="row" style="width: 100%">
        <div class="col-md-6">
          <h3 class="">
            <i class="fa fa-cogs mr-2" aria-hidden="true"></i>Your Services
          </h3>
        </div>
        <div class="col-md-6">
          <hf-buttons name="+ Create" class="ml-auto " @executeAction="openSlider('SSI_API')" style="float: right;">
          </hf-buttons>
        </div>

      </div>

      <div v-else>
        <h3 class="" style="text-align: left">
          Spin up your first service!
        </h3>
        <div>
          <div class="card" style="width:19rem; float: left;border-radius:20px; margin:10px">
            <img class="card-img-top card-image" src="../assets/ssi.png" alt="Card image cap">
            <div class="card-body">
              <h5 class="card-title">SSI Service</h5>
              <p class="card-text">Spin up your self-sovereign identity and establish your issuer node. Take charge of
                your digital presence, ensuring privacy and security while managing and sharing your identity
                credentials. </p>
              <hf-buttons name="+ Create" style="text-align: right" class="ml-auto "
                @executeAction="openSlider('SSI_API')">
              </hf-buttons>
            </div>
          </div>

          <div class="card" style="width:20rem; float: left; border-radius:20px;margin:10px">
            <img class="card-img-top card-image" src="../assets/kyc2.png" alt="Card image cap">
            <div class="card-body">
              <h5 class="card-title">KYC Service</h5>
              <p class="card-text">Take the hassle out of onboarding
                while prioritizing data integrity and user control. Welcome to the next level of KYC with self-sovereign
                identity.</p>
              <hf-buttons name="+ Create" style="text-align: right" class="ml-auto mt-4"
                @executeAction="openSlider('CAVACH_API')">
              </hf-buttons>
            </div>
          </div>

          <div class="card" style="width:20rem; float: left;border-radius:20px;margin:10px">
            <div class="overlay"></div>
            <img class="card-img-top card-image" src="../assets/edv.png" alt="Card image cap"
              style="height: 125px; width: 125px; opacity: 0.4;">
            <div class="card-body" style="color: #8080808a">
              <h5 class="card-title">EDV Service</h5>
              <p class="card-text">Easily spin up your encrypted data vault, leveraging the strength of decentralized
                identity to safeguard your sensitive information. </p>
              <hf-buttons name="+ Create" style="text-align: right" class="ml-auto mt-4"
                @executeAction="openSlider('EDV_API')" disabled>
              </hf-buttons>
            </div>
          </div>
        </div>
      </div>

    </div>

    <hf-pop-up id="entity-secret-confirmation-popup" Header="API Secret Key Confirmation">
      <div>
        <p style="color: #ff5400de">
          Warning: You are regenerating a new API Secret Key. The old key will
          no longer be valid.
        </p>
        <input type="text" class="form-control" id="appId" v-model="appIdToGenerateSecret"
          aria-describedby="selected App Id" placeholder="Enter Service Id" />
        <div class="text-center mt-3">
          <hf-buttons name="Continue" class="btn btn-primary text-center"
            @executeAction="reGenerateSecretKey"></hf-buttons>
        </div>
      </div>
    </hf-pop-up>
    <hf-pop-up id="entity-secretKey-popup" Header="API Secret Key">
      <div class="mt-2" v-if="apiKeySecret != ''">
        <p>
          Make sure to copy and save it securely. If lost, this key can not be
          recovered. However, you can regenerate a new one.
        </p>
        <p>
          Use this key to authenticate your server. See '<a
            href="https://docs.hypersign.id/entity-studio/api-doc/authentication" target="_blank">API reference</a>'
          documentation for more.
        </p>
        <HfFlashNotification class="mt-2" v-if="apiKeySecret != ''" :text="`${apiKeySecret}`" type="API Secret Key"
          description="Your API Secret Key" @click="onHfFlashClick()"></HfFlashNotification>
      </div>
    </hf-pop-up>
    <StudioSideBar :title="edit ? 'Edit Service' : 'Add Service'">
      <div class="container">
        <div class="form-group" v-if="edit === true">
          <tool-tip infoMessage="Your Service Id"></tool-tip>
          <label for="orgDid"><strong>Service Id<span style="color: red">*</span>:
            </strong></label>

          <div class="input-group mb-3">
            <input type="text" class="form-control" id="orgDid" v-model="appModel.appId" aria-describedby="orgNameHelp"
              disabled />
            <div class="input-group-append">
              <span class="input-group-text" id="basic-addon2">
                <i class="far fa-copy mt-1" @click="copyToClip(appModel.appId, 'Service Id')">
                </i>
              </span>
            </div>
          </div>
        </div>

        <div class="form-group">
          <tool-tip infoMessage="Name of the service, upto 20 chars"></tool-tip>
          <label for="orgName"><strong>Name<span style="color: red">*</span>:</strong></label>
          <input type="text" class="form-control" id="orgName" v-model="appModel.appName"
            placeholder="Enter name of your app" />
        </div>

        <div class="form-group">
          <tool-tip infoMessage="Give a description for application, upto 100 chars"></tool-tip>
          <label for="orgName"><strong>Description:</strong></label>
          <textarea class="form-control" v-model="appModel.description" rows="3"
            placeholder="Enter meaningful description for your app, max 100 chars"></textarea>
        </div>



        <div class="form-group" v-if="edit === true">
          <tool-tip infoMessage="Your Encrypted Data Vault id"></tool-tip>
          <label for="orgDid"><strong>Encrypted Data Vault Id: </strong></label>
          <input type="text" class="form-control" id="orgDid" v-model="appModel.edvId" aria-describedby="orgNameHelp"
            disabled />
        </div>

        <div class="form-group" v-if="edit === true">
          <tool-tip infoMessage="Your tenant URL"></tool-tip>
          <label for="tenant"><strong>Tenant URL: </strong></label>
          <div class="input-group mb-1">
            <input type="text" class="form-control" id="tenant" v-model="appModel.tenantUrl"
              aria-describedby="orgNameHelp" disabled />
            <div class="input-group-append">
              <span class="input-group-text" id="basic-addon2">
                <i class="far fa-copy mt-1" @click="copyToClip(appModel.tenantUrl, 'Tenant URL')">
                </i>
              </span>
            </div>
          </div>
          <small><a :href="`${swaggerAPIdoc}`" target="_blank">Open API Doc (Swagger)</a></small>
        </div>

        <div class="form-group" v-if="edit === true && appModel.services[0].id == 'SSI_API'">
          <tool-tip infoMessage=" Your wallet address"></tool-tip>
          <label for="orgDid"><strong>Wallet Address: </strong></label>
          <div class="input-group mb-1">
            <input type="text" class="form-control" id="orgDid" v-model="appModel.walletAddress"
              aria-describedby="orgNameHelp" disabled />
            <div class="input-group-append">
              <span class="input-group-text" id="basic-addon2">
                <i class="far fa-copy mt-1" @click="copyToClip(appModel.walletAddress, 'Wallet address')">
                </i>
              </span>
            </div>
          </div>
          <small><a :href="`https://explorer.hypersign.id/hypersign-testnet/account/${appModel.walletAddress}`"
              target="_blank">Click here to view wallet balance</a></small>
        </div>

        <div class="form-group" v-if="edit === false">
          <tool-tip infoMessage="Select a service you want to associate with this app"></tool-tip>
          <label for="selectService"><strong>Select Service<span style="color: red">*</span>: </strong></label>
          <select class="custom-select" id="selectService" v-model="selectedServiceId">
            <option :value="eachService.id" v-for="eachService in selectServicesOptions" v-bind:key="eachService.id">{{ eachService.name }}</option>
          </select>
          <small>{{ serviceDescrition }}</small>
        </div>

        <div class="form-group" v-if="edit === false && selectedServiceId == 'CAVACH_API'">
          <tool-tip infoMessage="Associate your service"></tool-tip>
          <label for="selectService"><strong>Associate SSI Service:<span style="color: red">*</span>: </strong></label>
          <select class="custom-select" id="selectSSIService" v-model="selectedAssociatedSSIAppId">
            <option value="" disabled>
              Select a service
            </option>
            <option :value="eachSSIApp.appId" v-for="eachSSIApp in getAppsWithSSIServices"  v-bind:key="eachSSIApp.appId">
              <div>{{ eachSSIApp.appName }} ( {{ eachSSIApp.appId }} ) </div>
            </option>
          </select>
          <!-- <small>{{ serviceDescrition }}</small> -->
        </div>

        <div class="form-group" v-if="edit === true && appModel.services[0].id == 'CAVACH_API'">
          <tool-tip infoMessage="SSI Service Id"></tool-tip>
          <label for="orgDid"><strong>SSI Service Id: </strong></label>
          <input type="text" class="form-control" id="orgDid" v-model="appModel.dependentServices[0]"
            aria-describedby="orgNameHelp" disabled />
        </div>

        <div class="form-group">
          <tool-tip
            infoMessage="Listed origins allowed to make CORS requests. Enter comman seperated URLs to whitelist"></tool-tip>
          <label for="orgName"><strong>Allowed Origins (CORS):</strong></label>
          <textarea class="form-control" v-model="appModel.whitelistedCors" rows="3"
            placeholder="*, http://your-domain.com, http://test.com"></textarea>
        </div>




        <div class="form-group" v-if="edit">
          <hf-buttons name="Update" class="btn btn-primary" @executeAction="updateAnAppAPIServer()"></hf-buttons>
        </div>
        <div class="form-group" v-else>
          <hf-buttons name="Save" @executeAction="createAnApp()"></hf-buttons>
        </div>
      </div>

    </StudioSideBar>

    <div v-if="appList.length > 0" class="mt-2">
      <b-tabs content-class="mt-3">
        <b-tab :title="'SSI (' + getAppsWithSSIServices.length + ')'" active v-if="getAppsWithSSIServices.length > 0">
          <div class="scroll row">
            <div class="col-md-4 mb-4" v-for="eachOrg in getAppsWithSSIServices" :key="eachOrg.appId">
              <div class="card bg-gradient-primary" @click="switchOrg(eachOrg.appId, 'SSI_API')" style="cursor: grab">
                <div class="card-body">
                  <div class="row">
                    <div class="col">
                      <h5 class="card-title text-uppercase text-muted mb-0">
                        {{ formattedAppName(eachOrg.appName) }}
                      </h5>
                    </div>
                  </div>
                  <div class="row mt-2">
                    <div class="col-md-8">
                      <span class="card-text">{{
      truncate(
        eachOrg.description || "No description for this app..",
        41
      )
    }}
                      </span>
                    </div>
                    <div class="col-md-4">
                      <b-card-img :src="eachOrg.logoUrl ||
      getProfileIcon(formattedAppName(eachOrg.appId))
      " alt="logoImg" class="rounded-0" style="max-height: 60px; min-height: 60px"></b-card-img>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col">
                      <b-card-text>
                        <small class="card-field-label">Service Id:</small>
                        <div class="apiKeySecret" @click.stop="copyToClip(eachOrg.appId, 'Service Id')"
                          title="Copy Service Id">
                          {{ truncate(eachOrg.appId, 35) }}
                          <i class="far fa-copy" style="float: right"></i>
                        </div>
                      </b-card-text>
                    </div>
                  </div>
                  <div class="row" v-if="eachOrg.tenantUrl">
                    <div class="col">
                      <b-card-text>
                        <small class="card-field-label">Tenant Url:</small>
                        <div class="apiKeySecret" @click.stop="copyToClip(eachOrg.tenantUrl, 'Tenant Url')"
                          title="Copy Tenant Url">
                          {{ truncate(eachOrg.tenantUrl, 42) }}
                          <i class="far fa-copy" style="float: right"></i>
                        </div>
                      </b-card-text>
                    </div>
                  </div>
                  <div class="row mt-2">
                    <div class="col">
                      <!-- <span class=" " style="cursor: pointer" @click="switchOrg(eachOrg.appId, 'SSI_API')"><i
                          class="fas fa-tachometer-alt" aria-hidden="true"></i></span> -->
                      <span class=" " style="float: right">
                        <b-badge pill variant="danger" @click.stop="openSecretkeyPopUp(eachOrg.appId)"
                          title="Click to generate a new API Secret Key" class="mr-2" style="cursor: pointer">
                          <i class="fa fa-key"></i>
                          Secret</b-badge>
                        <b-badge pill variant="info" @click.stop="editOrg(eachOrg.appId)" title="Click to edit the app"
                          style="cursor: pointer">
                          <i class="fas fa-pencil-alt"></i>
                          Edit</b-badge>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </b-tab>
        <b-tab :title="'KYC (' + getAppsWithKYCServices.length + ')'" v-if="getAppsWithKYCServices.length > 0">
          <div class="scroll row">
            <div class="col-md-4 mb-4" v-for="eachOrg in getAppsWithKYCServices" :key="eachOrg.appId">
              <div class="card bg-gradient-primary" 
                @click="switchOrg(eachOrg.appId, 'CAVACH_API')"
                style="cursor: grab">
                

              <div class="card bg-gradient-primary" style="cursor: grab">

                <div class="card-body">
                  <div class="row">
                    <div class="col">
                      <h5 class="card-title text-uppercase text-muted mb-0">
                        {{ formattedAppName(eachOrg.appName) }}
                      </h5>
                    </div>
                  </div>
                  <div class="row mt-2">
                    <div class="col-md-8">
                      <span class="card-text">{{
                    truncate(
                      eachOrg.description || "No description for this app..",
                      41
                    )
                  }}
                      </span>
                    </div>
                    <div class="col-md-4">
                      <b-card-img :src="eachOrg.logoUrl ||
      getProfileIcon(formattedAppName(eachOrg.appId))
      " alt="logoImg" class="rounded-0" style="max-height: 60px; min-height: 60px"></b-card-img>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col">
                      <b-card-text>
                        <small class="card-field-label">Service Id:</small>
                        <div class="apiKeySecret" @click.stop="copyToClip(eachOrg.appId, 'Service Id')"
                          title="Copy Service Id">
                          {{ truncate(eachOrg.appId, 35) }}
                          <i class="far fa-copy" style="float: right"></i>
                        </div>
                      </b-card-text>
                    </div>
                  </div>
                  <div class="row" v-if="eachOrg.tenantUrl">
                    <div class="col">
                      <b-card-text>
                        <small class="card-field-label">Tenant Url:</small>
                        <div class="apiKeySecret" @click.stop="copyToClip(eachOrg.tenantUrl, 'Tenant Url')"
                          title="Copy Tenant Url">
                          {{ truncate(eachOrg.tenantUrl, 42) }}
                          <i class="far fa-copy" style="float: right"></i>
                        </div>
                      </b-card-text>
                    </div>
                  </div>
                  <div class="row mt-2">
                    <div class="col">
                      <!-- <span class=" " style="cursor: pointer" @click.stop="switchOrg(eachOrg.appId,  'CAVACH_API')"><i
                          class="fas fa-tachometer-alt" aria-hidden="true"></i></span> -->
                      <span class=" " style="float: right">
                        <b-badge pill variant="danger" @click.stop="openSecretkeyPopUp(eachOrg.appId)"
                          title="Click to generate a new API Secret Key" class="mr-2" style="cursor: pointer">
                          <i class="fa fa-key"></i>
                          Secret</b-badge>
                        <b-badge pill variant="info" @click.stop="editOrg(eachOrg.appId)" title="Click to edit the app"
                          style="cursor: pointer">
                          <i class="fas fa-pencil-alt"></i>
                          Edit</b-badge>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              </div>
            </div>
          </div>
        </b-tab>
      </b-tabs>



      <!-- <div style="padding: 5px">
        <nav aria-label="Page navigation example" style="margin: 0 auto; width: 50px">
          <ul class="pagination">
            <li class="page-item">
              <a class="page-link" href="#" aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
                <span class="sr-only">Previous</span>
              </a>
            </li>

            <li class="page-item" v-if="pages > 1">
              <a class="page-link" href="#">1</a>
            </li>
            <li class="page-item" v-if="pages > 2">
              <a class="page-link" href="#">2</a>
            </li>

            <li class="page-item">
              <a class="page-link" href="#" aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
                <span class="sr-only">Next</span>
              </a>
            </li>
          </ul>
        </nav>
      </div> -->


    </div>
  </div>
</template>

<style scoped>
.nav-tabs {
  width: 150px;
}

.nav-tabs .nav-link.active {
  border-radius: 0px 20px 0px 0px;
}

.overlay {
  background: rgba(0, 0, 0, 0.323);
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 20px;
}

.card-image {
  border-radius: 20px 20px 0px 0px;
  height: 120px;
  width: 120px;
  margin-left: 27%;
  opacity: 0.7;
  margin: 20px;
  cursor: grab;

}

.card {
  box-shadow: 0 0 2rem 0 rgb(136 152 170 / 15%);
  border-radius: 20px;
}

.icons {
  cursor: pointer;
  padding: 4px;
}

.icons.danger {
  color: rgba(255, 0, 0, 0.589);
}

.icons:hover {
  border-radius: 10px;
  font-weight: bold;
  background-color: rgb(155, 153, 153);
  color: white;
}

.card-field-label {
  color: grey;
  font-weight: bold;
}

.bcard {
  min-height: 210px;
  max-height: 200px;
  min-width: 400px;
  max-width: 450px;
  float: left;
  margin: 10px;
}

.bcard:hover {
  box-shadow: 0 0 2px 5px rgba(251, 161, 82, 0.268);
  cursor: pointer;
}

.logoImg {
  width: 60px;
  height: 60px;
}

.center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.appCard {
  max-width: 30rem;
  margin-top: 10px;
  height: 13rem;
  min-height: 100px;
}

.apiKeySecret {
  cursor: pointer;
  padding: 5px;
  font-size: larger;
  margin-top: 5px;
  border-radius: 5px;
  border: 1px solid #99caff;
  padding-right: 10px;
}

.apiKeySecret:hover {
  font-weight: bolder;
  background: #f1f1f1;
  border: 1px solid #007bff;
}

.far {
  cursor: pointer;
  color: grey;
  display: inline;
  padding-left: 5px;
}

.container {
  padding: 20px;
  text-align: left;
}

.eventCard {
  border-left: 10px solid var(--ds-background-accent-red-subtler, #905ab029);
}

.eventCard:hover {
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 10px;
  cursor: pointer;
}

.scroll {
  padding-top: 1em;
  overflow: auto;
  height: 490px;
}
</style>

<script>
import HfPopUp from "../components/element/hfPopup.vue";
import StudioSideBar from "../components/element/StudioSideBar.vue";
import UtilsMixin from "../mixins/utils";
import { isEmpty, isValidOrigin } from "../mixins/fieldValidation";
import "vue-loading-overlay/dist/vue-loading.css";
import Loading from "vue-loading-overlay";
import HfButtons from "../components/element/HfButtons.vue";
import ToolTip from "../components/element/ToolTip.vue";
import messages from "../mixins/messages";
import { mapGetters, mapState, mapActions, mapMutations } from "vuex";
import HfFlashNotification from "../components/element/HfFlashNotification.vue";
import { sanitizeUrl } from '../utils/common'
export default {
  name: "AppList",
  computed: {
    ...mapState({
      appList: (state) => state.mainStore.appList,
      totalAppCount: (state) => state.mainStore.totalAppCount,
    }),
    ...mapGetters("mainStore", ["getAppByAppId", "getAllServices", "getServiceById", 'getAppsWithSSIServices', 'getAppsWithKYCServices']),

    pages() {
      return Math.ceil(parseInt(this.totalAppCount) / 10);
    },
    selectServicesOptions() {
      return this.getAllServices
    },
    serviceDescrition() {
      if (this.getServiceById(this.selectedServiceId)) {
        return this.getServiceById(this.selectedServiceId).description
      } else {
        return ""
      }
    },
    swaggerAPIdoc() {
      if (this.appModel.tenantUrl) {
        if (this.appModel.services) {
          const service = this.appModel.services.length > 0 ? this.appModel.services[0] : null
          if (service) {
            if (service.swaggerAPIDocPath) {
              return sanitizeUrl(this.appModel.tenantUrl) + service.swaggerAPIDocPath
            }
          }
        }
        return sanitizeUrl(this.appModel.tenantUrl)
      } else {
        return ""
      }
    },
  },
  mounted() {
    this.setMainSideNavBar(false);
  },
  data() {
    return {
      selectedServiceId: "SSI_API",
      selectedAssociatedSSIAppId: "",
      edit: false,
      flash: null,
      isAdd: true,
      controllerValue: "",
      appIdToGenerateSecret: "",
      authToken: localStorage.getItem("authToken"),
      fullPage: true,
      isLoading: false,
      isProcessFinished: true,
      apiKeySecret: "",
      selectedAppId: "",
      appModel: {
        appId: "",
        apiKeySecret: "",
        appName: "",
        walletAddress: "",
        edvId: "",
        description: "",
        whitelistedCors: "",
        logoUrl: "",
        tenantUrl: "",
        services: [],
        dependentServices: []
      },
    };
  },
  components: {
    HfPopUp,
    Loading,
    StudioSideBar,
    HfButtons,
    ToolTip,
    HfFlashNotification,
  },
  methods: {
    ...mapMutations("mainStore", ["updateAnApp", "setMainSideNavBar"]),
    ...mapMutations("mainStore", ["setSelectedAppId"]),
    ...mapActions("mainStore", [
      "saveAnAppOnServer",
      "updateAnAppOnServer",
      "generateAPISecretKey",
    ]),

    ...mapMutations("playgroundStore", [
      "shiftContainer",
    ]),

    async switchOrg(appId, serviceType = 'SSI_API') {
      // 
      this.setSelectedAppId(appId)
      switch (serviceType) {
        case 'SSI_API': {
          this.$router.push({ name: "DIDs", params: { appId } });
          break;
        }
        case 'CAVACH_API': {
          this.$router.push({ name: "playgroundCredential", params: { appId } });
          break;
        }
        default: {
          this.$router.push({ name: "playgroundCredential", params: { appId } });
        }
      }

      this.shiftContainer(false);

    },

    onServicesSelected() {
      console.log('ononServicesSelected() got calledsuccessfully')

      if (this.selectedServicesInMultiSelect.length > 0) {
        console.log('Added')
      }
    },
    formattedAppName(appName) {
      if (appName == "" || appName == undefined) appName = "No app name";
      return this.truncate(appName, 25);
    },
    getProfileIcon(name) {
      return "https://api.dicebear.com/7.x/identicon/svg?seed=" + name;
    },
    onHfFlashClick() {
      this.apiKeySecret = "";
    },
    copyToClip(textToCopy, contentType) {
      if (textToCopy) {
        navigator.clipboard
          .writeText(textToCopy)
          .then(() => {
            this.notifySuccess(`${contentType} copied!`);
          })
          .catch((err) => {
            this.notifyErr("Error while copying", err);
          });
      }
    },
    openSlider(selectedServiceType = 'SSI_API') {
      this.edit = false;
      this.clearAll();
      this.$root.$emit("bv::toggle::collapse", "sidebar-right");
      this.selectedServiceId = selectedServiceType;
    },
    closeSlider() {
      this.$root.$emit("bv::toggle::collapse", "sidebar-right");
      this.clearAll();
    },
    editOrg(appId) {
      this.edit = true;
      this.$root.$emit("bv::toggle::collapse", "sidebar-right");
      const appModel = this.getAppByAppId(appId);
      appModel.whitelistedCors = appModel.whitelistedCors.toString();
      Object.assign(this.appModel, { ...appModel });
    },
    validateFields() {
      const m = [];
      const isAppNameEmpty = isEmpty(this.appModel.appName);
      if (isAppNameEmpty) {
        m.push(messages.APPLICATION.INVALID_APP_NAME);
      }

      if (!isAppNameEmpty && this.appModel.appName.length < 5) {
        m.push(messages.APPLICATION.CHAR_LESS_APP_NAME);
      }

      if (!isAppNameEmpty && this.appModel.appName.length > 50) {
        m.push(messages.APPLICATION.CHAR_EXCEED_APP_NAME);
      }

      const isAppDescriptionEmpty = isEmpty(this.appModel.description);
      if (!isAppDescriptionEmpty && this.appModel.description.length < 20) {
        m.push(messages.APPLICATION.CHAR_LESS_APP_DES);
      }

      if (!isAppDescriptionEmpty && this.appModel.description.length > 100) {
        m.push(messages.APPLICATION.CHAR_EXCEED_APP_DES);
      }

      console.log(this.selectedServiceId)
      if (this.selectedServiceId === 'CAVACH_API') {
        console.log(this.selectedAssociatedSSIAppId)
        if (this.selectedAssociatedSSIAppId === "") {
          console.log('this.selectedAssociatedSSIAppId is empty')
          m.push(messages.APPLICATION.SSI_SERVICE_NOT_SELECTED)
        }
      }


      if (!isEmpty(this.appModel.whitelistedCors)) {
        const newArray = this.appModel.whitelistedCors
          .split(",")
          .filter((x) => x != " ")
          .map((x) => x.trim());
        for (let i = 0; i < newArray.length; i++) {
          if (!isValidOrigin(newArray[i])) {
            m.push(messages.APPLICATION.INVALID_CORS);
            break;
          }
        }
      }
      return {
        message: m,
      };
    },
    async createAnApp() {
      try {


        const errorMessages = this.validateFields();
        if (errorMessages && errorMessages.message.length > 0) {
          throw errorMessages;
        }

        this.isLoading = true;
        let whitelistCors = [];
        if (!isEmpty(this.appModel.whitelistedCors)) {
          whitelistCors = this.appModel.whitelistedCors
            .split(",")
            .filter((x) => x != " ")
            .map((x) => x.trim());
          const s = new Set(whitelistCors);
          if (whitelistCors.length !== s.size) {
            throw new Error(messages.APPLICATION.DUPLICATE_ORIGIN_VALUES);
          }
        }

        const t = await this.saveAnAppOnServer({
          appName: this.appModel.appName,
          whitelistedCors: whitelistCors,
          description: this.appModel.description,
          logoUrl: this.appModel.logoUrl,
          serviceIds: [this.selectedServiceId],
          dependentServices: [this.selectedAssociatedSSIAppId]
        });
        if (t && t.apiSecretKey && t.tenantUrl) {
          this.apiKeySecret = t.apiSecretKey;
          this.appModel.tenantUrl = t.tenantUrl;
          // Object.assign(this.appModel, { ...t })
          // this.edit = true;
          this.closeSlider();
          this.$root.$emit("bv::show::modal", "entity-secretKey-popup");
          this.notifySuccess(messages.APPLICATION.APP_CREATE_SUCCESS);
        } else {
          throw new Error("App creation error: something went wrong");
        }
      } catch (e) {
        if (Array.isArray(e.message)) {
          e.message.forEach((m) => {
            this.notifyErr(m);
          });
        } else {
          this.notifyErr(e.message);
        }
      } finally {
        this.isLoading = false;
      }
    },
    async updateAnAppAPIServer() {
      try {
        const errorMessages = this.validateFields();
        if (errorMessages && errorMessages.message.length > 0) {
          throw errorMessages;
        }

        this.isLoading = true;
        let whitelistCors = [];
        if (!isEmpty(this.appModel.whitelistedCors)) {
          whitelistCors = this.appModel.whitelistedCors
            .split(",")
            .filter((x) => x != " ")
            .map((x) => x.trim());
          const s = new Set(whitelistCors);
          if (whitelistCors.length !== s.size) {
            throw new Error(messages.APPLICATION.DUPLICATE_ORIGIN_VALUES);
          }
        }
        const t = await this.updateAnAppOnServer({
          appId: this.appModel.appId,
          appName: this.appModel.appName,
          whitelistedCors: whitelistCors,
          description: this.appModel.description,
          logoUrl: this.appModel.logoUrl,
        });
        if (t) {
          this.closeSlider();
          this.notifySuccess(messages.APPLICATION.APP_UPDATE_SUCCESS);
        } else {
          throw new Error("Something went wrong");
        }
      } catch (e) {
        if (Array.isArray(e.message)) {
          e.message.forEach((m) => {
            this.notifyErr(m);
          });
          return;
        }
        this.notifyErr(e.message);
      } finally {
        this.isLoading = false;
      }
    },
    openSecretkeyPopUp(appId) {
      this.appIdToGenerateSecret = "";
      this.apiKeySecret = "";
      this.selectedAppId = appId;
      this.$root.$emit("bv::show::modal", "entity-secret-confirmation-popup");
    },
    async reGenerateSecretKey() {
      if (this.appIdToGenerateSecret === "") {
        return this.notifyErr(messages.APPLICATION.ENTER_APP_ID);
      }

      if (this.appIdToGenerateSecret !== this.selectedAppId) {
        return this.notifyErr(messages.APPLICATION.VALID_ID);
      }
      this.$root.$emit("bv::hide::modal", "entity-secret-confirmation-popup");
      try {
        const appId = this.selectedAppId;
        this.isLoading = true;
        const resp = await this.generateAPISecretKey({ appId });
        if (resp) {
          this.apiKeySecret = resp.apiSecretKey;
          this.$root.$emit("bv::show::modal", "entity-secretKey-popup");
          this.notifySuccess(messages.APPLICATION.APP_NEW_SECRET_KEY_SUCCESS);
        } else {
          throw new Error("Something went wrong");
        }
      } catch (e) {
        if (Array.isArray(e.message)) {
          e.message.forEach((m) => {
            this.notifyErr(m);
          });
          return;
        }
        this.notifyErr(e.message);
      } finally {
        this.isLoading = false;
      }
    },
    clearAll() {
      this.appModel = {
        appId: "",
        appName: "",
        apiKeySecret: "",
        tenantUrl: "",
        walletAddress: "",
        edvId: "",
        whitelistedCors: "",
        logoUrl: "",
      };
      // this.apiKeySecret = ''
    },
  },
  beforeDestroy() {
    this.setMainSideNavBar(true);
  },
  mixins: [UtilsMixin],
};
</script>
