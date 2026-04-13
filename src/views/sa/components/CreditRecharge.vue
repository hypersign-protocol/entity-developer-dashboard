<template>
  <div>
    <load-ing :active.sync="isLoading" :can-cancel="false" :is-full-page="false"></load-ing>
    <div class="overview-container">
      <div class="header-row">
        <h2 class="title">Service Credit Recharge</h2>
      </div>

      <div class="pa-2">
        <p class="text-subtitle-2 text-muted mb-6">
          Allocate credits and set validity periods for your registered backend services.
        </p>

        <b-row>
          <b-col cols="12" md="6" class="mb-2">
            <label class="input-label">Service ID</label>
            <b-form-input
              v-model="form.serviceId"
              placeholder="e.g. 69afa3d8a4976d9c9e4671a7"
              class="mono-text"
            ></b-form-input>
          </b-col>

          <b-col cols="12" md="3" class="mb-2">
            <label class="input-label">Amount ({{ form.amountDenom }})</label>
            <b-form-input v-model="form.amount" type="number"></b-form-input>
          </b-col>

          <b-col cols="12" md="3" class="mb-2">
            <label class="input-label">Validity ({{ form.validityPeriodUnit }}S)</label>
            <b-form-input v-model="form.validityPeriod" type="number"></b-form-input>
          </b-col>
        </b-row>

        <div class="d-flex justify-content-start mt-4">
          <b-button
            :disabled="loading"
            variant="dark"
            class="font-weight-bold"
            @click="handleRecharge"
          >
            <span>Execute Recharge</span>
          </b-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
  font-size: 0.875rem;
  font-weight: 700;
  color: #111827;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.input-label {
  display: block;
  font-size: 0.7rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  margin-bottom: 4px;
}

.mono-text {
  font-family: 'JetBrains Mono', monospace !important;
}

/* Feedback Box Styles following your Warning Box pattern */
.feedback-box {
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid;
}

.error-style {
  background-color: #fef2f2;
  border-color: #fecaca;
  color: #991b1b;
}

.success-style {
  background-color: #f0fdf4;
  border-color: #bbf7d0;
  color: #166534;
}

.text-muted {
  color: #64748b !important;
}

.small {
  font-size: 0.85rem;
}
</style>
<script>
import { mapActions } from 'vuex/dist/vuex.common.js';
import loadIng from '../../../components/element/LoadIng.vue';
import UtilsMixin from '../../../mixins/utils.js';

export default {
  name: 'CreditRecharge',
  components: { loadIng },
  mixins: [UtilsMixin],
  data() {
    return {
      loading: false,
      isLoading: false,
      form: {
        serviceId: '',
        amount: '100',
        validityPeriod: '12',
        validityPeriodUnit: 'MONTH',
        amountDenom: 'uHID',
      }
    };
  },
  methods: {
    ...mapActions('mainStore', ['creditRecharge']),
    async handleRecharge() {
      if (!this.form.serviceId) {
        this.notifyErr("Please provide a Service ID.");
        return;
      }
      if (!this.form.amount || Number(this.form.amount) <= 0) {
        this.notifyErr("Amount must be greater than 0.");
        return;
      }
      if (!this.form.validityPeriod || Number(this.form.validityPeriod) <= 0) {
        this.notifyErr("Validity period must be greater than 0.");
        return;
      }

      this.loading = true;
      this.isLoading = true;

      try {
        await this.creditRecharge(this.form);
        this.notifySuccess(`Credits recharged successfully for service ${this.form.serviceId}.`);
      } catch (err) {
        const errorMsg = err.response?.data?.message || err.message || "Recharge failed.";
        this.notifyErr(errorMsg);
      } finally {
        this.loading = false;
        this.isLoading = false;
      }
    }
  }
};
</script>
