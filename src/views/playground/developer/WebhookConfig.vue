<template>
  <b-container fluid class="py-3">
    <load-ing :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></load-ing>

    <v-row align="center" class="mb-6">
      <v-col cols="12" md="6">
        <h4 class="font-weight-bold mb-0">Webhook Configuration</h4>
        <p class="text-subtitle-2 text-muted">Receive real-time notifications for verification events</p>
      </v-col>
      <v-col cols="12" md="6" class="d-flex justify-end align-center">
        <template v-if="getWebhookConfig._id">
          <v-btn icon color="error" class="mr-2" @click="deleteConfig" title="Delete Configuration">
            <v-icon>mdi-trash-can-outline</v-icon>
          </v-btn>
          <hf-buttons name="Update Configuration" @executeAction="updateConfiguration()"></hf-buttons>
        </template>
        <hf-buttons v-else name="Save Configuration" @executeAction="saveConfiguration()"></hf-buttons>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <div class="overview-container">
          <div class="header-row">
            <h2 class="title">Endpoint Settings</h2>
          </div>

          <div class="mb-6">
            <label class="input-label">Destination URL <span class="text-danger">*</span></label>
            <v-text-field v-model="webhookUrl" placeholder="https://your-api.com/webhooks/kyc" outlined dense
              hide-details background-color="white" class="custom-field"></v-text-field>
            <p class="small text-muted mt-2">
              We will send a POST request to this URL whenever a verification status changes.
            </p>
          </div>

          <v-divider class="mb-6"></v-divider>

          <!-- <div class="header-row d-flex justify-space-between align-center">
            <h2 class="title mb-0">Custom Headers</h2>
            <v-btn text small color="primary" @click="addHeader" class="font-weight-bold">
              <v-icon left small>mdi-plus-circle</v-icon> Add Header
            </v-btn>
          </div> -->

          <div class="d-flex justify-content-between align-items-center mb-2">
            <h2 class="title mb-0">Custom Headers</h2>
            <v-btn text small color="primary" @click="addHeader" class="font-weight-bold pr-0">
              <v-icon left small>mdi-plus-circle</v-icon>
              Add Header
            </v-btn>
          </div>

          <p class="small text-muted mb-2">
            Add custom authorization or identification headers to include in the webhook request.
          </p>


          <div v-if="headers.length > 0" class="headers-wrapper p-2 mb-2">
            <v-row v-for="(header, index) in headers" :key="index" class="mb-2" align="center" no-gutters>
              <v-col cols="5" class="pr-2">
                <v-text-field v-model="header.key" placeholder="Header Key (e.g. X-API-Token)" outlined dense
                  hide-details background-color="white"></v-text-field>
              </v-col>
              <v-col cols="6" class="pr-2">
                <v-text-field v-model="header.value" placeholder="Value" outlined dense hide-details
                  background-color="white"></v-text-field>
              </v-col>
              <v-col cols="1" class="text-center">
                <v-btn icon small color="error" @click="removeHeader(index)">
                  <v-icon small>mdi-minus-circle-outline</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </div>

          <div v-else class="text-center pa-8 border-dashed rounded-lg">
            <v-icon color="grey lighten-1" size="32">mdi-form-select</v-icon>
            <p class="text-muted small mb-0 mt-2">No custom headers configured.</p>
          </div>
        </div>
      </v-col>
    </v-row>
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

/* Custom Field Styling */
.input-label {
  display: block;
  font-size: 0.75rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  margin-bottom: 6px;
}

.custom-field :deep(.v-input__control) {
  background: white !important;
}

/* Headers Area */
.headers-wrapper {
  background: #f1f5f9;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.border-dashed {
  border: 2px dashed #e2e8f0;
}

.text-danger {
  color: #ef4444;
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
export default {
  name: "WEbhookConfig",
  mixins: [UtilsMixin],
  components: {
    HfButtons,
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
      console.error(e)
      if (e.message) {
        this.notifyErr(e.message)
      }
      // this.$router.push({ path: '/studio/dashboard' });
    }

    this.formatConfig()


  },
  data() {
    return {
      fullPage: true,
      isLoading: false,
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
