<template>
  <div>
    <loading
      :active.sync="isLoading"
      :can-cancel="true"
      :is-full-page="fullPage"
    ></loading>
    <div style="display: flex" class="">
      <h3 v-if="appList.length > 0" class="mt-4" style="text-align: left">
        <i class="fa fa-rocket mr-2" aria-hidden="true"></i>Your Applications
      </h3>
      <h4 v-else class="mt-4" style="text-align: left">
        Create your first application!
      </h4>

      <hf-buttons
        name="+ Create"
        style="text-align: right"
        class="ml-auto mt-4"
        @executeAction="openSlider()"
      >
      </hf-buttons>
    </div>

    <hf-pop-up
      id="entity-secret-confirmation-popup"
      Header="API Secret Key Confirmation"
    >
      <div>
        <p style="color: #ff5400de">
          Warning: You are regenerating a new API Secret Key. The old key will
          no longer be valid.
        </p>
        <input
          type="text"
          class="form-control"
          id="appId"
          v-model="appIdToGenerateSecret"
          aria-describedby="selected App Id"
          placeholder="Enter Application Id"
        />
        <div class="text-center mt-3">
          <hf-buttons
            name="Continue"
            class="btn btn-primary text-center"
            @executeAction="reGenerateSecretKey"
          ></hf-buttons>
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
            href="https://docs.hypersign.id/entity-studio/api-doc/authentication"
            target="_blank"
            >API reference</a
          >' documentation for more.
        </p>
        <HfFlashNotification
          class="mt-2"
          v-if="apiKeySecret != ''"
          :text="`${apiKeySecret}`"
          type="API Secret Key"
          description="Your API Secret Key"
          @click="onHfFlashClick()"
        ></HfFlashNotification>
      </div>
    </hf-pop-up>
    <StudioSideBar :title="edit ? 'Edit Application' : 'Add Application'">
      <div class="container">
        <div class="form-group" v-if="edit === true">
          <tool-tip infoMessage="Your Application Id"></tool-tip>
          <label for="orgDid"
            ><strong
              >Application Id<span style="color: red">*</span>:
            </strong></label
          >

          <div class="input-group mb-3">
            <input
              type="text"
              class="form-control"
              id="orgDid"
              v-model="appModel.appId"
              aria-describedby="orgNameHelp"
              disabled
            />
            <div class="input-group-append">
              <span class="input-group-text" id="basic-addon2">
                <i
                  class="far fa-copy mt-1"
                  @click="copyToClip(appModel.appId, 'Application Id')"
                >
                </i>
              </span>
            </div>
          </div>
        </div>

        <div class="form-group">
          <tool-tip
            infoMessage="Name of the application, upto 20 chars"
          ></tool-tip>
          <label for="orgName"
            ><strong>Name<span style="color: red">*</span>:</strong></label
          >
          <input
            type="text"
            class="form-control"
            id="orgName"
            v-model="appModel.appName"
            placeholder="Enter name of your app"
          />
        </div>

        <div class="form-group">
          <tool-tip
            infoMessage="Give a description for application, upto 100 chars"
          ></tool-tip>
          <label for="orgName"><strong>Description:</strong></label>
          <textarea
            class="form-control"
            v-model="appModel.description"
            rows="3"
            placeholder="Enter meaningful description for your app, max 100 chars"
          ></textarea>
        </div>

        <!-- <div class="form-group">
          <tool-tip infoMessage="Logo URL, recomended size 160*160"></tool-tip>
          <label for="orgName"><strong>Logo URL:</strong></label>
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text" id="basic-addon1"><i class="fa fa-link"></i></span>
            </div>
            <input type="text" class="form-control" v-model="appModel.logoUrl"  placeholder="https://path-to-my-logo.png" aria-label="Username" aria-describedby="basic-addon1"> 
          </div>
        </div> -->

        <div class="form-group" v-if="edit === true">
          <tool-tip infoMessage="Your Encrypted Data Vault id"></tool-tip>
          <label for="orgDid"><strong>Encrypted Data Vault Id: </strong></label>
          <input
            type="text"
            class="form-control"
            id="orgDid"
            v-model="appModel.edvId"
            aria-describedby="orgNameHelp"
            disabled
          />
        </div>

        <div class="form-group" v-if="edit === true">
          <tool-tip infoMessage="Your tenant URL"></tool-tip>
          <label for="tenant"><strong>Tenant URL: </strong></label>
          <div class="input-group mb-3">
            <input
              type="text"
              class="form-control"
              id="tenant"
              v-model="appModel.tenantUrl"
              aria-describedby="orgNameHelp"
              disabled
            />
            <div class="input-group-append">
              <span class="input-group-text" id="basic-addon2">
                <i
                  class="far fa-copy mt-1"
                  @click="copyToClip(appModel.tenantUrl, 'Tenant URL')"
                >
                </i>
              </span>
            </div>
          </div>

          <!-- <small
            ><a
              :href="`https://explorer.hypersign.id/hypersign-testnet/account/${appModel.walletAddress}`"
              target="_blank"
              >Click here to see wallet balance</a
            ></small
          > -->
        </div>

        <div class="form-group" v-if="edit === true">
          <tool-tip infoMessage="Your wallet address"></tool-tip>
          <label for="orgDid"><strong>Wallet Address: </strong></label>
          <div class="input-group mb-1">
            <input
              type="text"
              class="form-control"
              id="orgDid"
              v-model="appModel.walletAddress"
              aria-describedby="orgNameHelp"
              disabled
            />
            <div class="input-group-append">
              <span class="input-group-text" id="basic-addon2">
                <i
                  class="far fa-copy mt-1"
                  @click="copyToClip(appModel.walletAddress, 'Wallet address')"
                >
                </i>
              </span>
            </div>
          </div>
          <small
            ><a
              :href="`https://explorer.hypersign.id/hypersign-testnet/account/${appModel.walletAddress}`"
              target="_blank"
              >Click here to view wallet balance</a
            ></small
          >
        </div>

        <div class="form-group">
          <tool-tip
            infoMessage="Listed origins allowed to make CORS requests. Enter comman seperated URLs to whitelist"
          ></tool-tip>
          <label for="orgName"><strong>Allowed Origins (CORS):</strong></label>
          <textarea
            class="form-control"
            v-model="appModel.whitelistedCors"
            rows="3"
            placeholder="*, http://your-domain.com, http://test.com"
          ></textarea>
        </div>

        <!-- <div class="form-group" v-if="(edit === true) && appModel.apiKeySecret !=''">
          <tool-tip infoMessage="Your Application Secret. Make sure to copy it."></tool-tip>
          <label for="orgName"><strong>App Secret<span style="color: red">*</span>:</strong></label>
          <div class="input-group mb-3">
            <input type="text" class="form-control" v-model="appModel.apiKeySecret" aria-label="Recipient's username" aria-describedby="basic-addon2" disabled style="background-color: #e6ffec;">
            <div class="input-group-append">
              <span class="input-group-text" id="basic-addon2" @click="copyToClip(appModel.apiKeySecret,'Appliction Secret', true)"><i class="far fa-copy"></i></span>
            </div>
          </div>
        </div> -->

        <div class="form-group" v-if="edit">
          <hf-buttons
            name="Update"
            class="btn btn-primary"
            @executeAction="updateAnAppAPIServer()"
          ></hf-buttons>
        </div>
        <div class="form-group" v-else>
          <hf-buttons name="Save" @executeAction="createAnApp()"></hf-buttons>
        </div>
      </div>
    </StudioSideBar>

    <div v-if="appList.length > 0">
      <div class="scroll row">
        <div
          class="col-md-4 mb-4"
          v-for="eachOrg in appList"
          :key="eachOrg.appId"
        >
          <div class="card bg-gradient-primary">
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
                  <span class="card-text"
                    >{{
                      truncate(
                        eachOrg.description || "No description for this app..",
                        41
                      )
                    }}
                  </span>
                </div>
                <div class="col-md-4">
                  <b-card-img
                    :src="
                      eachOrg.logoUrl ||
                      getProfileIcon(formattedAppName(eachOrg.appId))
                    "
                    alt="logoImg"
                    class="rounded-0"
                    style="max-height: 60px; min-height: 60px"
                  ></b-card-img>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <b-card-text>
                    <small class="card-field-label">Application Id:</small>
                    <div
                      class="apiKeySecret"
                      @click="copyToClip(eachOrg.appId, 'Application Id')"
                      title="Copy Application Id"
                    >
                      {{ truncate(eachOrg.appId, 35) }}
                      <i class="far fa-copy" style="float: right"></i>
                    </div>
                  </b-card-text>
                </div>
              </div>
              <div class="row mt-2">
                <div class="col">
                  <span class=" " style="float: right">
                    <b-badge
                      pill
                      variant="danger"
                      @click="openSecretkeyPopUp(eachOrg.appId)"
                      title="Click to generate a new API Secret Key"
                      class="mr-2"
                      style="cursor: pointer"
                    >
                      <i class="fa fa-key"></i>
                      Api</b-badge
                    >
                    <b-badge
                      pill
                      variant="info"
                      @click="editOrg(eachOrg.appId)"
                      title="Click to edit the app"
                      style="cursor: pointer"
                    >
                      <i class="fas fa-pencil-alt"></i>
                      Edit</b-badge
                    >
                  </span>
                </div>
              </div>
            </div>
          </div>
          <!-- <b-card no-body class="overflow-hidden " border-variant="warning" >
          <b-row no-gutters>
            <b-col md="8">
              <b-card-body :title="formattedAppName(eachOrg.appName)">
                <b-card-text>
                  {{truncate(eachOrg.description || "No description for this app..", 41)}}
                </b-card-text>
                <b-card-text>
                  <small class="card-field-label">Application Id:</small>
                  <div class="apiKeySecret" @click="copyToClip(eachOrg.appId,'Application Id')" title="Copy Application Id">
                    {{truncate(eachOrg.appId, 25)}}
                    <i class="far fa-copy" style="float:right"></i>
                  </div>
                </b-card-text>
              </b-card-body>
            </b-col>
            <b-col md="4" class="center">
              <b-card-img :src="eachOrg.logoUrl || getProfileIcon(formattedAppName(eachOrg.appId))" alt="logoImg" class="rounded-0 logoImg"></b-card-img>
            </b-col>
          </b-row>
          <b-row no-gutters>
            <b-col md="2"></b-col>
            <b-col md="10" style="text-align: right;">
              <span class="icons  danger">
                <i class="fa fa-key" @click="generateSecretKey(eachOrg.appId)"
                  title="Click to generate a new API Secret Key"></i>
              </span>
              <span class="ml-3"></span>
              <span class="icons">
                <i class="fas fa-pencil-alt" @click="editOrg(eachOrg.appId)" title="Click to edit the app"></i>
              </span>
              <span class="ml-3"></span>
            </b-col>
          </b-row>
        </b-card> -->
        </div>
      </div>

      <div style="padding: 5px">
        <nav
          aria-label="Page navigation example"
          style="margin: 0 auto; width: 50px"
        >
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
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  box-shadow: 0 0 2rem 0 rgb(136 152 170 / 15%);
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
export default {
  computed: {
    ...mapState({
      appList: (state) => state.mainStore.appList,
      totalAppCount: (state) => state.mainStore.totalAppCount,
    }),
    ...mapGetters("mainStore", ["getAppByAppId"]),
    pages() {
      return Math.ceil(parseInt(this.totalAppCount) / 10);
    },
  },
  mounted() {
    this.setMainSideNavBar(false);
  },
  data() {
    return {
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
    ...mapActions("mainStore", [
      "saveAnAppOnServer",
      "updateAnAppOnServer",
      "generateAPISecretKey",
    ]),
    formattedAppName(appName) {
      if (appName == "" || appName == undefined) appName = "No app name";
      return this.truncate(appName, 25);
    },
    getProfileIcon(name) {
      return "https://avatars.dicebear.com/api/identicon/" + name + ".svg";
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
    openSlider() {
      this.edit = false;
      this.clearAll();
      this.$root.$emit("bv::toggle::collapse", "sidebar-right");
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
        });
        if (t) {
          this.apiKeySecret = t.apiSecretKey;
          this.appModel.tenantUrl = t.tenantUrl;
          // Object.assign(this.appModel, { ...t })
          // this.edit = true;
          this.closeSlider();
          this.$root.$emit("bv::show::modal", "entity-secretKey-popup");
          this.notifySuccess(messages.APPLICATION.APP_CREATE_SUCCESS);
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
      this.selectedAppId = "";
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
