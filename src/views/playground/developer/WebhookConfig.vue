<template>
  <b-container fluid class="py-3">
    <load-ing :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></load-ing>

    <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap">
      <div>
        <h4 class="font-weight-bold mb-0">Webhook Configuration</h4>
        <p class="text-muted small mb-0">Receive real-time notifications for verification events</p>
      </div>
      <div class="d-flex align-items-center" style="gap: 8px;">
        <template v-if="getWebhookConfig._id">
          <hf-buttons name="" iconClass="fa fa-trash-alt" @executeAction="deleteConfig" title="Delete Configuration" style="color: red;"></hf-buttons>
          <hf-buttons name="Update Configuration" @executeAction="updateConfiguration()"></hf-buttons>
        </template>
        <hf-buttons v-else name="Save Configuration" @executeAction="saveConfiguration()"></hf-buttons>
      </div>
    </div>

    <b-card class="serviceCard">
      <b-row>
        <b-col cols="12" md="8">
          <b-form-group label="DESTINATION URL">
            <b-input-group>
              <b-form-input v-model="webhookUrl" placeholder="https://your-api.com/webhooks/kyc" class="custom-input" />
            </b-input-group>
            <small class="form-text text-muted">We will send a POST request to this URL whenever a verification status changes.</small>
          </b-form-group>
        </b-col>
      </b-row>

      <hr class="my-3" />

      <div class="d-flex justify-content-between align-items-center mb-2">
        <label class="mb-0 section-label">CUSTOM HEADERS</label>
        <b-button variant="outline-primary" size="sm" @click="addHeader">
          <i class="mdi mdi-plus-circle mr-1"></i>Add Header
        </b-button>
      </div>
      <small class="form-text text-muted mb-3 d-block">Add custom authorization or identification headers to include in the webhook request.</small>

      <div v-if="headers.length > 0">
        <b-row v-for="(header, index) in headers" :key="index" class="mb-2 align-items-center">
          <b-col cols="5">
            <b-form-input v-model="header.key" placeholder="Header Key (e.g. X-API-Token)" class="custom-input" />
          </b-col>
          <b-col cols="6">
            <b-form-input v-model="header.value" placeholder="Value" class="custom-input" />
          </b-col>
          <b-col cols="1" class="text-center">
            <b-button variant="link" class="text-danger p-0" @click="removeHeader(index)">
              <i class="mdi mdi-minus-circle-outline"></i>
            </b-button>
          </b-col>
        </b-row>
      </div>

      <div v-else class="text-center py-4" style="border: 2px dashed #e2e8f0; border-radius: 6px;">
        <i class="mdi mdi-form-select" style="font-size: 32px; color: #ccc;"></i>
        <p class="text-muted small mb-0 mt-2">No custom headers configured.</p>
      </div>
    </b-card>
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
}
</style>

<style scoped>
.custom-input {
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 0.6rem 0.8rem;
  font-size: 0.9rem;
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
