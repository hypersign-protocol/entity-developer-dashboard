<template>
  <div :class="isContainerShift ? 'homeShift' : 'home'">
    <load-ing :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></load-ing>

    <div class="row">
      <div class="col-12">
        <h3>API Key Management</h3>
      </div>
    </div>

    <div class="row">
      <!-- Left Column: App ID Input -->
      <div class="col-md-6">
        <b-card class="serviceCard p-1">
          <div class="form-group">
            <label for="appId"><strong>Enter App ID</strong></label>
            <b-form-input
              id="appId"
              v-model="appIdToGenerateSecret"
              placeholder="13f70faf7f5c5d03520b71181136b595f7c6"
            ></b-form-input>
          </div>

          <p class="text-warning">
            ⚠️ Note: Generating a new API Secret Key will deactivate your existing one. You can find your App ID on the <a :href="'#/studio/service-config/'+getSelectedService.appId">App Configuration</a> page.
          </p>

          <div class="text-center">
            <hf-buttons
              name="Continue"
              class="btn btn-primary"
              @executeAction="reGenerateSecretKey"
            ></hf-buttons>
          </div>
        </b-card>
      </div>

      <!-- Right Column: Info Cards -->
      <div class="col-md-6">
        <!-- Step A: Generate Access Token -->
        <v-card class="serviceCard mb-3 p-4">
          <h6 class="font-weight-bold mb-2"><v-icon>mdi-key-outline</v-icon> 1. Generate Access Token</h6>
          <p class="mb-0 text-muted">
            Use the <b>API Secret Key</b> to generate an access token from the <b>Dashboard API</b>. <a target="_blank" class="text-primary" href="https://docs.hypersign.id/hypersign-kyc/kyc-widget/integrations/backend-integration/generate-accesstokens">View Documentation</a>
          </p>
        </v-card>


        <!-- Step B: Generate Session ID -->
         <v-card class="serviceCard mb-3 p-4">
          <h6 class="font-weight-bold mb-2"><v-icon>mdi-account-check-outline</v-icon> 2. Generate Session ID</h6>
          <p class="mb-0 text-muted">
            For every new user verification request, generate a session ID using your <b>Tenant URL</b>. <a target="_blank" class="text-primary" href="https://docs.hypersign.id/hypersign-kyc/kyc-widget/integrations/backend-integration/generate-kyc-session-id">View Documentation</a>
          </p>
        </v-card>

        <!-- URLs Card -->
        <v-card class="serviceCard mb-3 p-4">
          <h6 class="font-weight-bold mb-2"><v-icon>mdi-link-variant</v-icon> Important URLs</h6>
          <label>Dashboard API</label>
          <b-input-group>
            <b-form-input :value="dashboardUrl" disabled></b-form-input>
            <b-input-group-append>
              <b-button @click="copyToClipboard(dashboardUrl)" variant="outline-secondary">
                <i class="mdi mdi-content-copy"></i>
              </b-button>
            </b-input-group-append>
          </b-input-group>
        

          <label>Tenant URL</label>
          <b-input-group class="mb-2">
            <b-form-input :value="tenantUrl" disabled></b-form-input>
            <b-input-group-append>
              <b-button @click="copyToClipboard(tenantUrl)" variant="outline-secondary">
                <i class="mdi mdi-content-copy"></i>
              </b-button>
            </b-input-group-append>
          </b-input-group>
        </v-card>
          
          
      </div>
    </div>

    <!-- API Secret Key Popup -->
    <hf-pop-up id="entity-secretKey-popup" Header="API Secret Key">
      <div class="mt-2" v-if="apiKeySecret">
        <p>Copy and save your API Secret Key securely. It cannot be recovered once lost.</p>
        <p>
          Use this key to authenticate your server. See
          <a href="https://docs.hypersign.id/entity-studio/api-doc/authentication" target="_blank">
            API Reference
          </a>
          documentation.
        </p>

        <HfFlashNotification
          class="mt-2"
          :text="apiKeySecret"
          type="API Secret Key"
          description="Your API Secret Key"
          @click="onHfFlashClick()"
        ></HfFlashNotification>
      </div>
    </hf-pop-up>
  </div>
</template>

<script>
import UtilsMixin from '../../../mixins/utils.js';
import { mapGetters, mapActions } from 'vuex';
import HfButtons from '../../../components/element/HfButtons.vue';
import messages from '../../../mixins/messages';

export default {
  name: 'APIKey',
  mixins: [UtilsMixin],
  components: {
    HfButtons,
    HfFlashNotification: () =>
      import('../../../components/element/HfFlashNotification.vue'),
    HfPopUp: () => import('../../../components/element/hfPopup.vue'),
  },
  data() {
    return {
      fullPage: true,
      isLoading: false,
      apiKeySecret: '',
      appIdToGenerateSecret: '',
      tenantUrl: "", // Replace dynamically if needed
      dashboardUrl: 'https://api.entity.dashboard.hypersign.id',
    };
  },
  computed: {
    ...mapGetters('mainStore', ['getSelectedService']),
    isContainerShift() {
      return this.containerShift;
    },
  },
  methods: {
    ...mapActions('mainStore', ['generateAPISecretKey']),
    async reGenerateSecretKey() {
      if (!this.appIdToGenerateSecret)
        return this.notifyErr(messages.APPLICATION.ENTER_APP_ID);

      if (this.appIdToGenerateSecret !== this.getSelectedService.appId)
        return this.notifyErr(messages.APPLICATION.VALID_ID);

      try {
        this.isLoading = true;
        const resp = await this.generateAPISecretKey({
          appId: this.getSelectedService.appId,
        });

        if (resp) {
          this.apiKeySecret = resp.apiSecretKey;
          this.$root.$emit('bv::show::modal', 'entity-secretKey-popup');
          this.notifySuccess(messages.APPLICATION.APP_NEW_SECRET_KEY_SUCCESS);
          this.appIdToGenerateSecret = '';
        } else {
          throw new Error('Something went wrong');
        }
      } catch (e) {
        if (Array.isArray(e.message)) e.message.forEach((m) => this.notifyErr(m));
        else this.notifyErr(e.message);
      } finally {
        this.isLoading = false;
      }
    },
    copyToClipboard(value) {
      navigator.clipboard.writeText(value);
      this.notifySuccess('Copied to clipboard!');
    },
    onHfFlashClick() {
      this.apiKeySecret = '';
      this.appIdToGenerateSecret = '';
    },
  },
  created(){
    if(this.getSelectedService){
      this.tenantUrl =  this.getSelectedService.tenantUrl
    }
    
  },
};
</script>

<style scoped>
.sticky-header {
  position: sticky;
  top: 0;
}

.container {
  width: 80vw;
}
</style>
