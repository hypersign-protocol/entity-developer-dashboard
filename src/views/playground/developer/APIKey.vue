<template>
  <b-container fluid class="py-3">
    <load-ing
      :active.sync="isLoading"
      :can-cancel="true"
      :is-full-page="fullPage"
    ></load-ing>

    <!-- Page Header -->
    <v-row align="center" class="mb-6">
      <v-col cols="12">
        <h4 class="font-weight-bold mb-1">API Key Management</h4>
        <p class="text-subtitle-2 text-muted mb-0">
          Configure authentication for your backend integration
        </p>
      </v-col>
    </v-row>

    <v-row>
      <!-- Left Column: Secret Key Generator -->
      <v-col cols="12" lg="6">
        <div class="overview-container h-100">
          <div class="header-row">
            <h2 class="title">Generate Secret Key</h2>
          </div>

          <div class="important-note mb-4 d-flex align-start">
            <v-icon color="#f97316" class="mr-3">mdi-alert-circle-outline</v-icon>
            <div>
              <span class="font-weight-bold d-block text-orange">Important Note</span>
              <span class="small text-muted">
                Generating a new Secret Key will <strong>immediately deactivate</strong> your current key. Ensure you update your server configuration promptly.
              </span>
            </div>
          </div>

          <div class="service-block">
            <div class="w-100 mb-3" v-if="getSelectedService">
              <label class="input-label">Application ID</label>
              <div class="copy-input-group">
                <input type="text" :value="getSelectedService.appId" readonly />
                <button @click="copyToClipboard(getSelectedService.appId)" title="Copy App ID">
                  <v-icon small color="grey darken-1">mdi-content-copy</v-icon>
                </button>
              </div>
            </div>

            <div v-else class="no-service small text-muted mb-3">
              No application selected. Select an application from the sidebar to enable generating a Secret Key.
            </div>

            <div class="generate-section w-100">
              <hf-buttons
                v-if="getSelectedService"
                name="Generate New Secret"
                @executeAction="reGenerateSecretKey"
              ></hf-buttons>

              <v-btn v-else disabled block depressed height="44">
                Generate New Secret
              </v-btn>
            </div>
          </div>
        </div>
      </v-col>

      <!-- Right Column: Instructions & Endpoints -->
      <v-col cols="12" lg="6">
        <!-- Integration Steps -->
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

        <!-- Connection Endpoints -->
        <div class="overview-container">
          <div class="header-row">
            <h2 class="title">Connection Endpoints</h2>
          </div>

          <div class="mb-4">
            <label class="input-label">Dashboard API URL</label>
            <div class="copy-input-group">
              <input type="text" :value="dashboardUrl" readonly />
              <button @click="copyToClipboard(dashboardUrl)" title="Copy Dashboard URL">
                <v-icon small color="grey darken-1">mdi-content-copy</v-icon>
              </button>
            </div>
          </div>

          <div>
            <label class="input-label">Tenant URL</label>
            <div class="copy-input-group">
              <input type="text" :value="tenantUrl" readonly />
              <button @click="copyToClipboard(tenantUrl)" title="Copy Tenant URL">
                <v-icon small color="grey darken-1">mdi-content-copy</v-icon>
              </button>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- Modal Popup -->
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
      dashboardUrl: "https://api.entity.dashboard.hypersign.id",
    };
  },
  computed: {
    ...mapGetters("mainStore", ["getSelectedService"]),
    tenantUrl() {
      return this.getSelectedService?.tenantUrl || "N/A";
    },
  },
  methods: {
    ...mapActions("mainStore", ["generateAPISecretKey"]),
    async reGenerateSecretKey() {
      const appId = this.getSelectedService?.appId;
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
      if (!value) return;
      navigator.clipboard.writeText(value);
      this.notifySuccess("Copied to clipboard!");
    },
    onHfFlashClick() {
      this.apiKeySecret = "";
    },
  },
};
</script>

<style scoped>
.api-key-container {
  max-width: 1200px;
  margin: 0 auto;
}

/* Container Cards */
.overview-container {
  padding: 1.5rem;
  background-color: #f9fafb;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
}

.header-row {
  margin-bottom: 1rem;
}

.title {
  font-size: 0.875rem;
  font-weight: 700;
  color: #111827;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Warning Box */
.important-note {
  background-color: #fff7ed;
  border: 1px solid #ffedd5;
  border-left: 4px solid #f97316;
  border-radius: 8px;
  padding: 12px 14px;
}

.text-orange {
  color: #c2410c;
}

/* Step Styles */
.step-number {
  background: #2563eb;
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
  flex-shrink: 0;
}

.doc-link {
  font-size: 0.8rem;
  font-weight: 600;
  color: #2563eb;
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
  color: #4b5563;
  text-transform: uppercase;
  margin-bottom: 6px;
}

.copy-input-group {
  display: flex;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  overflow: hidden;
  width: 100%;
}

.copy-input-group input {
  flex: 1;
  padding: 10px 14px;
  font-size: 0.875rem;
  color: #374151;
  font-family: monospace;
  border: none;
  background: transparent;
  height: 42px;
  width: 100%;
  outline: none;
}

.copy-input-group button {
  padding: 0 14px;
  background: #f9fafb;
  border-left: 1px solid #d1d5db;
  transition: background 0.2s;
  height: 42px;
  display: inline-flex;
  align-items: center;
}

.copy-input-group button:hover {
  background: #f3f4f6;
}
</style>