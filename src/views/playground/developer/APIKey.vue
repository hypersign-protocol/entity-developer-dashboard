<template>
  <b-container fluid class="py-3">
    <load-ing
      :active.sync="isLoading"
      :can-cancel="true"
      :is-full-page="fullPage"
    ></load-ing>

    <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap">
      <div>
        <h4 class="font-weight-bold mb-0">API Key Management</h4>
        <p class="text-muted small mb-0">Configure authentication for your backend integration</p>
      </div>
    </div>

    <b-card class="serviceCard">
      <b-row>
        <!-- Generate Secret Key -->
        <b-col cols="12" lg="6" class="mb-4">
          <p class="section-label mb-3">GENERATE SECRET KEY</p>

          <div class="important-note mb-3">
            <span class="font-weight-bold d-block text-orange">
              <i class="mdi mdi-alert mr-1"></i>Important Note
            </span>
            <span class="small">
              Generating a new Secret Key will
              <strong>immediately deactivate</strong> your current key. Ensure you update your server configuration promptly.
            </span>
          </div>

          <div class="p-3 service-block">
            <div v-if="getSelectedService" class="mb-3">
              <div class="service-name">{{ getSelectedService.name || getSelectedService.appName || 'Selected Application' }}</div>
              <div class="service-id mono">{{ getSelectedService.appId }}</div>
            </div>
            <div v-else class="small text-muted mb-3">
              No application selected. Select an application from the sidebar to enable generating a Secret Key.
            </div>
            <hf-buttons
              v-if="getSelectedService"
              name="Generate New Secret"
              customClass="btn btn-outline-secondary btn-sm"
              @executeAction="reGenerateSecretKey"
            ></hf-buttons>
            <b-button v-else variant="outline-secondary" disabled>Generate New Secret</b-button>
          </div>
        </b-col>

        <!-- Right column -->
        <b-col cols="12" lg="6">
          <!-- Integration Steps -->
          <p class="section-label mb-3">INTEGRATION STEPS</p>
          <div class="step-item d-flex mb-4">
            <div class="step-number">1</div>
            <div>
              <p class="font-weight-bold mb-0">Generate Access Token</p>
              <p class="small text-muted mb-1">Use your Secret Key to authenticate with the Dashboard API.</p>
              <a target="_blank" class="doc-link" href="https://docs.hypersign.id/hypersign-kyc/kyc-widget/integrations/backend-integration/generate-accesstokens">
                Documentation <i class="mdi mdi-open-in-new"></i>
              </a>
            </div>
          </div>
          <div class="step-item d-flex mb-4">
            <div class="step-number">2</div>
            <div>
              <p class="font-weight-bold mb-0">Initialize Session</p>
              <p class="small text-muted mb-1">Generate a Session ID for every new user verification request.</p>
              <a target="_blank" class="doc-link" href="https://docs.hypersign.id/hypersign-kyc/kyc-widget/integrations/backend-integration/generate-kyc-session-id">
                Documentation <i class="mdi mdi-open-in-new"></i>
              </a>
            </div>
          </div>

          <hr class="my-3" />

          <!-- Connection Endpoints -->
          <p class="section-label mb-3">CONNECTION ENDPOINTS</p>
          <b-form-group label="DASHBOARD API URL">
            <b-input-group>
              <b-form-input :value="dashboardUrl" readonly class="custom-input" />
              <b-input-group-append>
                <b-button variant="outline-secondary" size="sm" @click="copyToClipboard(dashboardUrl)">
                  <i class="mdi mdi-content-copy"></i>
                </b-button>
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
          <b-form-group label="TENANT URL">
            <b-input-group>
              <b-form-input :value="tenantUrl" readonly class="custom-input" />
              <b-input-group-append>
                <b-button variant="outline-secondary" size="sm" @click="copyToClipboard(tenantUrl)">
                  <i class="mdi mdi-content-copy"></i>
                </b-button>
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
        </b-col>
      </b-row>
    </b-card>

    <hf-pop-up id="entity-secretKey-popup" Header="API Secret Key Generated">
      <div class="text-center py-2" v-if="apiKeySecret">
        <i class="mdi mdi-key" style="font-size: 48px; color: green;"></i>
        <p class="font-weight-bold mt-2">Copy your Secret Key now</p>
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
  </b-container>
</template>

<style scoped>
.custom-input {
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 0.6rem 0.8rem;
  font-size: 0.9rem;
}

.section-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0;
}

.important-note {
  background-color: #fff7ed;
  border: 1px solid #ffedd5;
  border-left: 4px solid #f97316;
  border-radius: 8px;
  padding: 12px 14px;
}

.text-orange { color: #c2410c; }

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
  flex-shrink: 0;
}

.doc-link {
  font-size: 0.8rem;
  font-weight: 600;
  color: #3b82f6;
  text-decoration: none;
}

.doc-link:hover { text-decoration: underline; }

.service-block {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #f9fafb;
}

.service-name {
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 4px;
}

.service-id.mono {
  font-family: monospace;
  color: #475569;
  font-size: 0.85rem;
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
