<template>
  <b-container fluid class="py-3">
    <load-ing :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></load-ing>

    <AccessDenied v-if="accessDenied" />
    <template v-if="!accessDenied">
    <v-row align="center" class="mb-6">
      <v-col cols="12" md="6">
        <h4 class="font-weight-bold mb-0">Webhook Configuration</h4>
        <p class="text-subtitle-2 text-muted">Receive real-time notifications for verification events</p>
      </v-col>
      <v-col cols="12" md="6" class="hf-btn-group">
        <template v-if="getWebhookConfig._id">
          <hf-buttons
            v-if="$can('CAVACH_API', 'DELETE_WEBHOOK_CONFIG')"
            title="Delete configuration"
            variant="danger-outline"
            iconClass="mdi mdi-trash-can-outline"
            @executeAction="deleteConfig"
          />
          <hf-buttons
            v-if="$can('CAVACH_API', 'UPDATE_WEBHOOK_CONFIG')"
            name="Update Configuration"
            variant="primary"
            iconClass="mdi mdi-content-save-outline"
            @executeAction="updateConfiguration()"
          />
        </template>
        <hf-buttons
          v-else-if="$can('CAVACH_API', 'WRITE_WEBHOOK_CONFIG')"
          name="Save Configuration"
          variant="primary"
          iconClass="mdi mdi-content-save-outline"
          @executeAction="saveConfiguration()"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <div class="overview-container">
          <div class="header-row">
            <h2 class="title">Endpoint Settings</h2>
          </div>

          <label class="hf-field mb-6">
            <span>Destination URL</span>
            <input
              v-model.trim="webhookUrl"
              class="hf-input"
              type="url"
              inputmode="url"
              autocomplete="url"
              placeholder="https://your-api.com/webhooks/verification"
            />
            <small class="hf-field-help">
              User and business verification events are sent to this URL. Use the payload type to identify the event.
            </small>
          </label>

          <v-divider class="mb-6"></v-divider>

          <!-- <div class="header-row d-flex justify-space-between align-center">
            <h2 class="title mb-0">Custom Headers</h2>
            <v-btn text small color="primary" @click="addHeader" class="font-weight-bold">
              <v-icon left small>mdi-plus-circle</v-icon> Add Header
            </v-btn>
          </div> -->

          <div class="d-flex justify-content-between align-items-center mb-2">
            <h2 class="title mb-0">Custom Headers</h2>
            <hf-buttons name="Add header" variant="link" size="sm" iconClass="mdi-plus" @executeAction="addHeader" />
          </div>

          <p class="small text-muted mb-2">
            Add custom authorization or identification headers to include in the webhook request.
          </p>


          <div v-if="headers.length > 0" class="headers-wrapper p-2 mb-2">
            <div v-for="(header, index) in headers" :key="index" class="header-fields">
              <input
                v-model.trim="header.key"
                class="hf-input"
                type="text"
                aria-label="Header name"
                autocomplete="off"
                placeholder="Header name (e.g. X-API-Token)"
              />
              <input
                v-model="header.value"
                class="hf-input"
                type="text"
                aria-label="Header value"
                autocomplete="off"
                placeholder="Value"
              />
              <hf-buttons title="Remove header" variant="ghost" size="sm" iconClass="mdi-close" @executeAction="removeHeader(index)" />
            </div>
          </div>

          <div v-else class="text-center pa-8 border-dashed rounded-lg">
            <v-icon color="grey lighten-1" size="32">mdi-form-select</v-icon>
            <p class="text-muted small mb-0 mt-2">No custom headers configured.</p>
          </div>
        </div>
      </v-col>
    </v-row>
    </template>
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
  font-size: 0.875rem;
  font-weight: 700;
  color: #111827;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Headers Area */
.headers-wrapper {
  background: #f1f5f9;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

/* One header per row: name, value, remove */
.header-fields {
  display: grid;
  grid-template-columns: minmax(0, 5fr) minmax(0, 6fr) auto;
  gap: 8px;
  align-items: center;
}

.header-fields + .header-fields { margin-top: 8px; }

.border-dashed {
  border: 2px dashed #e2e8f0;
}

/* Fix for Button Alignment */
.justify-end {
  justify-content: flex-end !important;
}
</style>
<script>

import UtilsMixin from '../../../mixins/utils.js';
import { mapGetters, mapActions } from "vuex";
import HfButtons from '../../../components/element/HfButtons.vue';
import { isValidURL } from '../../../mixins/fieldValidation.js'
import AccessDenied from '../../AccessDenied.vue';
import { isAccessDeniedError } from '../../../utils/accessDenied';
export default {
  name: "WEbhookConfig",
  mixins: [UtilsMixin],
  components: {
    HfButtons,
    AccessDenied,
  },
  computed: {
    ...mapGetters('mainStore', ['getWebhookConfig']),
    isContainerShift() {
      return this.containerShift
    },
  },

  async mounted() {
    try {
      this.isLoading = true
      await this.fetchAppWebhookConfig()
      this.isLoading = false
    } catch (e) {
      this.isLoading = false
      return this.handleApiError(e, 'GET')
    }

    this.formatConfig()


  },
  data() {
    return {
      fullPage: true,
      isLoading: false,
      accessDenied: false,
      accessDeniedMsg: '',
      headers: [
        { key: "", value: "" }, // Initial header
      ],
      webhookUrl: "",
      appId: "",
      app: {},
    }
  },
  methods: {
    ...mapActions('mainStore', ['fetchAppWebhookConfig', 'createAppWebhookConfig', 'deleteAppWebhookConfig', 'updateAppWebhookConfig']),
    handleApiError(error, method = 'GET') {
      const message = typeof error === 'string' ? error : error?.message || 'Something went wrong';
      if (method.toUpperCase() === 'GET' && isAccessDeniedError(error)) {
        this.accessDenied = true;
        this.accessDeniedMsg = message;
        return;
      }

      this.notifyErr(message)
    },
    addHeader() {
      this.headers.push({ key: "", value: "" });
    },

    formatConfig() {
      if (this.getWebhookConfig && Object.keys(this.getWebhookConfig).length > 0) {
        this.webhookUrl = this.getWebhookConfig.webhookUrl
        if (this.getWebhookConfig.header && Object.keys(this.getWebhookConfig.header).length > 0) {
          const heder = JSON.parse(this.getWebhookConfig.header)
          const headerKeys = Object.keys(heder)
          this.headers = []
          headerKeys.forEach(eachKey => {
            this.headers.push({
              key: eachKey,
              value: heder[eachKey]
            })
          })
        }
      }
    },

    removeHeader(index) {
      // if (this.headers.length <= 1) {
      //   return
      // }
      this.headers.splice(index, 1);
    },

    validateField() {
      if (!this.webhookUrl) {
        throw new Error('Webhook URL is not specified')
      }

      if (!isValidURL(this.webhookUrl)) {
        throw new Error('Webhook URL is not a valid URL')
      }
      // this.headers = this.headers.map(x => x.key != "")
    },

    async saveConfiguration() {
      try {
        this.isLoading = true;
        this.validateField()
        await this.createAppWebhookConfig({
          "webhookUrl": this.webhookUrl.trim(),
          "header": this.getHeadersForSave()
        })
        this.formatConfig()
        this.isLoading = false
      } catch (e) {
        this.isLoading = false
        this.notifyErr(e.message)
      }
    },

    getHeadersForSave() {
      const heaaders = this.headers.reduce((acc, header) => {
        if (header.key && header.value) {
          acc[header.key] = header.value;
        }
        return acc;
      }, {})

      if (heaaders && Object.keys(heaaders).length == 0) {
        return null
      } else { return heaaders }
    },

    async updateConfiguration() {
      try {
        //TODO validate all field
        this.isLoading = true;
        this.validateField()
        await this.updateAppWebhookConfig({
          _id: this.getWebhookConfig._id,
          "webhookUrl": this.webhookUrl,
          "header": this.getHeadersForSave()
        })
        this.formatConfig()
        this.isLoading = false
      } catch (e) {
        this.isLoading = false
        this.notifyErr(e.message)
      }
    },

    clearAll() {
      this.webhookUrl = "",
        this.headers = [
          { key: "", value: "" }, // Initial header
        ]
    },

    async deleteConfig() {
      try {
        //TODO validate all field
        this.isLoading = true;
        await this.deleteAppWebhookConfig({
          _id: this.getWebhookConfig._id,
        })
        this.clearAll()
        this.isLoading = false
      } catch (e) {
        this.isLoading = false
        this.notifyErr(e.message)
      }
    }
  }
};
</script>
