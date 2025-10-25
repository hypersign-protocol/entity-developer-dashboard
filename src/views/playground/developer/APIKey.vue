<style scoped>
.sticky-header {
  position: sticky;
  top: 0;
}

.container {
  width: 80vw;
}

.card-header {
  background: aliceblue;
  padding: 0px;
}

.apiKeySecret {
  cursor: pointer;
  padding: 5px;
  font-size: larger;
  margin-top: 5px;
  border-radius: 5px;
  border: 1px solid #8080802b;
  padding-right: 10px;
}

.apiKeySecret:hover {
  font-weight: bolder;
  background: #f1f1f1;
  border: 1px solid grey
}
</style>
<template>
  <div :class="isContainerShift ? 'homeShift' : 'home'">

    <load-ing :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></load-ing>



    <div class="row">
      <div class="col-6" style="text-align: left">
        <div class="form-group" style="display:flex">
          <h3 style="text-align: left;"> API Key </h3>
        </div>
      </div>
    </div>

    <div class="">
      <v-card class=" serviceCard p-3">
        <div>
          Enter App Id: 
          <input type="text" class="form-control" id="appId" v-model="appIdToGenerateSecret"
            aria-describedby="selected App Id" placeholder="13f70faf7f5c5d03520b71181136b595f7c6" />
          
          <p style="color: #ff5400de">
            Warning: You are regenerating a new API Secret Key. The old key will
            no longer be valid.
          </p>
            <div class="text-center mt-3">
            <hf-buttons name="Continue" class="btn btn-primary text-center"
              @executeAction="reGenerateSecretKey"></hf-buttons>
          </div>
        </div>
      </v-card>
    </div>


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


  </div>
</template>

<script>

import UtilsMixin from '../../../mixins/utils.js';
import { mapGetters, mapActions } from "vuex";
import HfButtons from '../../../components/element/HfButtons.vue';
import messages from "../../../mixins/messages";
export default {
  name: "WEbhookConfig",
  mixins: [UtilsMixin],
  components: {
    HfButtons,
    HfFlashNotification: () => import('../../../components/element/HfFlashNotification.vue'),
    HfPopUp: () => import('../../../components/element/hfPopup.vue'),
  },
  computed: {
    ...mapGetters('mainStore', ['getKYCWebpageConfig', 'getSelectedService']),
    isContainerShift() {
      return this.containerShift
    },
  },

  async mounted() {
    try {
      this.isLoading = true
      // await this.fetchAppWebhookConfig()
      console.log(this.getSelectedService)
      this.isLoading = false
    } catch (e) {
      this.isLoading = false
      console.log(e)
      if (e.message) {
        this.notifyErr(e.message)
      }
      // this.$router.push({ path: '/studio/dashboard' });
    }

    // this.formatConfig()


  },
  data() {
    return {
      fullPage: true,
      isLoading: false,
      apiKeySecret: "",
      appIdToGenerateSecret: ""
    }
  },
  methods: {
    ...mapActions("mainStore", [
      "generateAPISecretKey",
    ]),

    async reGenerateSecretKey() {
      console.log(this.getSelectedService)

      if (this.appIdToGenerateSecret === "") {
        return this.notifyErr(messages.APPLICATION.ENTER_APP_ID);
      }

      if (this.appIdToGenerateSecret !== this.getSelectedService.appId) {
        return this.notifyErr(messages.APPLICATION.VALID_ID);
      }
      // this.$root.$emit("bv::hide::modal", "entity-secret-confirmation-popup");
      try {
        // const appId = this.selectedAppId;
        this.isLoading = true;
        const resp = await this.generateAPISecretKey({ appId: this.getSelectedService.appId });
        if (resp) {
          this.apiKeySecret = resp.apiSecretKey;
          this.$root.$emit("bv::show::modal", "entity-secretKey-popup");
          this.notifySuccess(messages.APPLICATION.APP_NEW_SECRET_KEY_SUCCESS);
          this.appIdToGenerateSecret = "";
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
    onHfFlashClick() {
      console.log("Clicked on hf flash notification");
      this.apiKeySecret = "";
      this.appIdToGenerateSecret = "";
    },
  }
};
</script>
