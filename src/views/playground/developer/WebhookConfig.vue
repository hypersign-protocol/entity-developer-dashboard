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
</style>
<template>
  <div :class="isContainerShift ? 'homeShift' : 'home'">
    <load-ing :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></load-ing>

    <div class="row">
      <div class="col-6" style="text-align: left">
        <div class="form-group" style="display:flex">
          <h3 style="text-align: left;">
            Webhook Configuration </h3>
        </div>
      </div>
      <div class="col-6">
        <HfButtons name="Save Configuration" @executeAction="saveConfiguration()" v-if="!this.getWebhookConfig._id"
          style="float:right"></HfButtons>
        <div v-else>
          <b-button variant="link" class="danger" @click="deleteConfig()" style="float:right;"
            title="Delete Configuration"><i class="fa fa-trash"></i></b-button>
          <HfButtons name="Update Configuration" @executeAction="updateConfiguration()" style="float:right"
            class="mx-1">
          </HfButtons>
        </div>
      </div>
    </div>

    <div class="">
      <b-card class=" serviceCard p-1">
        <form>
          <!-- <div class="form-group">
            <label for="exampleFormControlInput1">Name<span class="mandatory">*</span></label>
            <input type="text" class="form-control" v-model="webhookName" placeholder="name@example.com" required>
          </div> -->
          <div class="form-group">
            <label for="exampleFormControlInput1">Url<span class="mandatory">*</span></label>
            <input type="url" class="form-control" v-model="webhookUrl" placeholder="https://api.app.com/kyc/hook"
              required>
          </div>

          <b-form-group label="Header(s)">
            <div style="padding: 10px;background: #d3d3d32e;border-radius: 10px;" v-if="this.headers.length > 0">
              <div v-for="(header, index) in headers" :key="index" class="d-flex mb-2">
                <b-form-input v-model="header.key" placeholder="Key" class="mr-2"></b-form-input>
                <b-form-input v-model="header.value" placeholder="Value" class="mr-2"></b-form-input>
                <b-button variant="link" @click="removeHeader(index)"><b-icon icon="dash-circle"
                    style="color:red" /></b-button>
              </div>

            </div>

            <b-button variant="link" @click="addHeader" style="color:grey"><b-icon icon="plus-circle" /> Add
              Header</b-button>
          </b-form-group>
        </form>
      </b-card>
    </div>

  </div>
</template>

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
      console.log(e)
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
            console.log(eachKey)
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
          "webhookUrl": this.webhookUrl,
          "header": this.getHeadersForSave()
        })
        this.formatConfig()
        this.isLoading = false
      } catch (e) {
        this.isLoading = false
        this.notifyErr(e)
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
        this.notifyErr(e)
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
        this.notifyErr(e)
      }
    }
  }
};
</script>
