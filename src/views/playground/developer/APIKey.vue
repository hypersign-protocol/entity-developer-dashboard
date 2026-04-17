<template>
  <b-container fluid class="py-3">
    <load-ing
      :active.sync="isLoading"
      :can-cancel="true"
      :is-full-page="fullPage"
    ></load-ing>

    <v-row align="center" class="mb-6">
      <v-col cols="12">
        <h4 class="font-weight-bold mb-0">API Key Management</h4>
        <p class="text-subtitle-2 text-muted">
          Configure authentication for your backend integration
        </p>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" lg="6">
        <div class="overview-container h-100">
          <div class="header-row">
            <h2 class="title">Generate Secret Key</h2>
          </div>

          <div class="p-2">
            <div class="important-note mb-3 d-flex align-center justify-space-between">
              <div class="d-flex align-center">
                <v-icon color="orange darken-2" class="mr-2">mdi-alert</v-icon>
                <div>
                  <span class="font-weight-bold d-block text-orange">Important Note</span>
                  <span class="small text-muted">
                    Generating a new Secret Key will
                    <strong>immediately deactivate</strong> your current key. Ensure you
                    update your server configuration promptly.
                  </span>
                </div>
              </div>
            </div>

            <div class="p-3 service-block">
              <div class="service-info mb-3">
                <div v-if="getSelectedService">
                  <label class="input-label">Application ID</label>
                  <div class="copy-input-group">
                    <input type="text" :value="getSelectedService.appId" readonly />
                    <button class="copy-id-btn" @click="copyToClipboard(getSelectedService.appId)" title="Copy App ID">
                      <v-icon small color="grey">mdi-content-copy</v-icon>
                    </button>
                  </div>
                </div>
                <div v-else class="no-service small text-muted">
                  No application selected. Select an application from the sidebar to enable generating a Secret Key.
                </div>
              </div>

              <div class="generate-section">
                <hf-buttons
                  v-if="getSelectedService"
                  name="Generate New Secret"
                  @executeAction="reGenerateSecretKey"
                ></hf-buttons>

                <v-btn v-else depressed disabled class="btn btn-outline-secondary px-8">
                  Generate New Secret
                </v-btn>
              </div>
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
              <p class="small text-muted mb-1">
                Use your Secret Key to authenticate with the Dashboard API.
              </p>
              <a
                target="_blank"
                class="doc-link"
                href="https://docs.hypersign.id/hypersign-kyc/kyc-widget/integrations/backend-integration/generate-accesstokens"
              >
                Documentation <v-icon x-small color="primary">mdi-open-in-new</v-icon>
              </a>
            </div>
          </div>

          <div class="step-item d-flex">
            <div class="step-number">2</div>
            <div>
              <p class="font-weight-bold mb-0">Initialize Session</p>
              <p class="small text-muted mb-1">
                Generate a Session ID for every new user verification request.
              </p>
              <a
                target="_blank"
                class="doc-link"
                href="https://docs.hypersign.id/hypersign-kyc/kyc-widget/integrations/backend-integration/generate-kyc-session-id"
              >
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
              <input type="text" :value="dashboardUrl" readonly />
              <button @click="copyToClipboard(dashboardUrl)">
                <v-icon small>mdi-content-copy</v-icon>
              </button>
            </div>
          </div>

          <div>
            <label class="input-label">Tenant URL</label>
            <div class="copy-input-group">
              <input type="text" :value="tenantUrl" readonly />
              <button @click="copyToClipboard(tenantUrl)">
                <v-icon small>mdi-content-copy</v-icon>
              </button>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>

    <hf-pop-up id="entity-secretKey-popup" Header="API Secret Key Generated">
      <div class="pa-4 text-center" v-if="apiKeySecret">
        <v-icon color="green" size="48" class="mb-2">mdi-key</v-icon>
        <p class="font-weight-bold">Copy your Secret Key now</p>
        <p class="small text-muted">
          For security, we cannot show this key again. Save it in a secure vault.
        </p>

        <HfFlashNotification
          class="mt-4"
          :text="apiKeySecret"
          type="API Secret Key"
          description="Click to copy Secret Key"
          @click="onHfFlashClick()"
        ></HfFlashNotification>
      </div>
    </hf-pop-up>
  </b-container>
</template>

<style scoped>
.py-3 {
  width: 80vw !important;
}
/* Dashboard Container Style */
.overview-container {
  padding: 1.5rem;
  background-color: #f9fafb;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  margin-top: -0.85rem;
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

.text-orange {
  color: #c2410c;
}

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

.doc-link:hover {
  text-decoration: underline;
}

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
  padding: 10px 14px;
  font-size: 0.95rem;
  color: #475569;
  font-family: monospace;
  border: none;
  background: transparent;
  height: 44px;
  width: 25vw;
}

.copy-input-group button {
  padding: 0 14px;
  background: #f8fafc;
  border-left: 1px solid #e2e8f0;
  transition: background 0.2s;
  height: 44px;
  display: inline-flex;
  align-items: center;
}

.copy-input-group button:hover {
  background: #f1f5f9;
}

.service-block .copy-input-group {
  margin-top: 6px;
}

.service-info .input-label {
  text-transform: none;
  font-weight: 600;
  color: #374151;
  font-size: 0.85rem;
  margin-bottom: 6px;
}

.service-block .service-name {
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 4px;
}

.service-block .service-id.mono {
  font-family: monospace;
  color: #475569;
  font-size: 0.85rem;
}

.service-block .no-service {
  color: #6b7280;
}

.important-note {
  background-color: #fff7ed;
  border: 1px solid #ffedd5;
  border-left: 4px solid #f97316;
  border-radius: 8px;
  padding: 12px 14px;
  width: 100%;
}

.important-note .text-muted {
  color: #7c2d12;
}

/* note-compact removed: Important Note is always visible */

/* Layout adjustments to improve placement and responsiveness */
.service-block {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  padding-top: 8px;
  padding-bottom: 8px;
}

.service-block .service-info {
  text-align: left;
}

.info-value {
  font-size: 0.95rem;
  font-weight: 700;
  color: #111827;
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
  word-break: break-all;
}

.copy-id-btn {
  background: transparent;
  border: none;
  padding: 4px;
  border-radius: 6px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #905ab0;
}

.copy-id-btn:hover {
  background: rgba(144,90,176,0.06);
}

.generate-btn .hf-button {
  background: #905ab0 !important;
  color: #fff !important;
  border-radius: 8px !important;
  padding: 10px 18px !important;
  box-shadow: 0 6px 18px rgba(144,90,176,0.12) !important;
  text-transform: none !important;
  letter-spacing: 0.01em !important;
}

.generate-full .hf-button {
  width: 100% !important;
  display: block !important;
  padding: 12px 20px !important;
  height: 44px !important;
  font-size: 1rem !important;
}

.generate-section {
  margin-top: 6px;
}
</style>

<script>
import UtilsMixin from "../../../mixins/utils.js";
import { mapGetters, mapActions } from "vuex";
import HfButtons from "../../../components/element/HfButtons.vue";
import messages from "../../../mixins/messages";

export default {
  name: "APIKey",
  mixins: [UtilsMixin],
  components: {
    HfButtons,
    HfFlashNotification: () =>
      import("../../../components/element/HfFlashNotification.vue"),
    HfPopUp: () => import("../../../components/element/hfPopup.vue"),
  },
  data() {
    return {
      fullPage: true,
      isLoading: false,
      apiKeySecret: "",
      tenantUrl: "", // Replace dynamically if needed
      dashboardUrl: "https://api.entity.dashboard.hypersign.id",
    };
  },
  computed: {
    ...mapGetters("mainStore", ["getSelectedService"]),
    isContainerShift() {
      return this.containerShift;
    },
  },
  methods: {
    ...mapActions("mainStore", ["generateAPISecretKey"]),
    async reGenerateSecretKey() {
      const appId = this.getSelectedService && this.getSelectedService.appId;
      if (!appId) return this.notifyErr(messages.APPLICATION.ENTER_APP_ID);

      try {
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
        if (Array.isArray(e.message)) e.message.forEach((m) => this.notifyErr(m));
        else this.notifyErr(e.message);
      } finally {
        this.isLoading = false;
      }
    },
    copyToClipboard(value) {
      navigator.clipboard.writeText(value);
      this.notifySuccess("Copied to clipboard!");
    },
    onHfFlashClick() {
      this.apiKeySecret = "";
    },
  },
  created() {
    if (this.getSelectedService) {
      this.tenantUrl = this.getSelectedService.tenantUrl;
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
