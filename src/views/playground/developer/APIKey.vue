<template>
  <v-container>
    <load-ing :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></load-ing>

    <v-row align="center">
      <v-col cols="12">
        <h4 class="font-weight-bold mb-0">API Key Management</h4>
        <p class="text-subtitle-2 text-muted">Configure authentication for your backend integration</p>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" lg="6">
        <div class="overview-container h-100">
          <div class="header-row">
            <h2 class="title">Generate Secret Key</h2>
          </div>
          
          <div class="p-2">
            <p class="text-subtitle-2 mb-2">
              Enter your <strong>App ID</strong> to authorize the generation of a new API Secret.
            </p>

            <v-text-field
              v-model="appIdToGenerateSecret"
              label="App ID"
              placeholder="e.g. 13f70faf7f5c5d03520b..."
              outlined
              dense
              color="primary"
            ></v-text-field>

            <div class="warning-box mb-2">
              <div class="d-flex">
                <v-icon color="orange darken-2" class="mr-2">mdi-alert</v-icon>
                <div>
                  <span class="font-weight-bold d-block text-orange">Important Note</span>
                  <span class="small text-muted">
                    Generating a new Secret Key will <strong>immediately deactivate</strong> your current key. 
                    Ensure you update your server configuration promptly.
                  </span>
                </div>
              </div>
            </div>

            <div class="d-flex justify-center">
              <hf-buttons
                name="Generate New Secret"
                class="px-8"
                @executeAction="reGenerateSecretKey"
              ></hf-buttons>
            </div>
          </div>
        </div>
      </v-col>

      <v-col cols="12" lg="6">
        <div class="overview-container mb-4">
          <div class="header-row">
            <h2 class="title">Integration Steps</h2>
          </div>

          <div class="step-item d-flex mb-4">
            <div class="step-number">1</div>
            <div>
              <p class="font-weight-bold mb-0">Generate Access Token</p>
              <p class="small text-muted mb-1">Use your Secret Key to authenticate with the Dashboard API.</p>
              <a target="_blank" class="doc-link" href="https://docs.hypersign.id/hypersign-kyc/kyc-widget/integrations/backend-integration/generate-accesstokens">
                Documentation <v-icon x-small color="primary">mdi-open-in-new</v-icon>
              </a>
            </div>
          </div>

          <div class="step-item d-flex">
            <div class="step-number">2</div>
            <div>
              <p class="font-weight-bold mb-0">Initialize Session</p>
              <p class="small text-muted mb-1">Generate a Session ID for every new user verification request.</p>
              <a target="_blank" class="doc-link" href="https://docs.hypersign.id/hypersign-kyc/kyc-widget/integrations/backend-integration/generate-kyc-session-id">
                Documentation <v-icon x-small color="primary">mdi-open-in-new</v-icon>
              </a>
            </div>
          </div>
        </div>

        <div class="overview-container">
          <div class="header-row">
            <h2 class="title">Connection Endpoints</h2>
          </div>

          <div class="mb-4">
            <label class="input-label">Dashboard API URL</label>
            <div class="copy-input-group">
              <input type="text" :value="dashboardUrl" readonly>
              <button @click="copyToClipboard(dashboardUrl)"><v-icon small>mdi-content-copy</v-icon></button>
            </div>
          </div>

          <div>
            <label class="input-label">Tenant URL</label>
            <div class="copy-input-group">
              <input type="text" :value="tenantUrl" readonly>
              <button @click="copyToClipboard(tenantUrl)"><v-icon small>mdi-content-copy</v-icon></button>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>

    <hf-pop-up id="entity-secretKey-popup" Header="API Secret Key Generated">
      <div class="pa-4 text-center" v-if="apiKeySecret">
        <v-icon color="green" size="48" class="mb-2">mdi-shield-check-outline</v-icon>
        <p class="font-weight-bold">Copy your Secret Key now</p>
        <p class="small text-muted">For security, we cannot show this key again. Save it in a secure vault.</p>

        <HfFlashNotification
          class="mt-4"
          :text="apiKeySecret"
          type="API Secret Key"
          description="Click to copy Secret Key"
          @click="onHfFlashClick()"
        ></HfFlashNotification>
      </div>
    </hf-pop-up>
  </v-container>
</template>

<style scoped>
/* Dashboard Container Style */
.overview-container {
  padding: 1.5rem;
  background-color: #f9fafb;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
}

.header-row {
  margin-bottom: 1.25rem;
}

.title {
  font-size: 1rem;
  font-weight: 700;
  color: #111827;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

/* Warning Box */
.warning-box {
  background-color: #fff7ed;
  border: 1px solid #ffedd5;
  border-radius: 8px;
  padding: 1rem;
}

.text-orange { color: #c2410c; }

/* Step Styles */
.step-number {
  background: #3b82f6;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: bold;
  margin-right: 12px;
  margin-top: 2px;
}

.doc-link {
  font-size: 0.8rem;
  font-weight: 600;
  color: #3b82f6;
  text-decoration: none;
}

.doc-link:hover { text-decoration: underline; }

/* Custom Copy Inputs */
.input-label {
  display: block;
  font-size: 0.75rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  margin-bottom: 4px;
}

.copy-input-group {
  display: flex;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  overflow: hidden;
}

.copy-input-group input {
  flex: 1;
  padding: 8px 12px;
  font-size: 0.85rem;
  color: #475569;
  font-family: monospace;
  border: none;
  background: transparent;
}

.copy-input-group button {
  padding: 0 12px;
  background: #f8fafc;
  border-left: 1px solid #e2e8f0;
  transition: background 0.2s;
}

.copy-input-group button:hover {
  background: #f1f5f9;
}
</style>

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

<!-- <style scoped>
.sticky-header {
  position: sticky;
  top: 0;
}

.container {
  width: 80vw;
}
</style> -->
