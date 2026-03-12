<template>
  <v-container pa-0>
    <div class="overview-container">
      <div class="header-row">
        <h2 class="title">Service Credit Recharge</h2>
      </div>

      <div class="pa-2">
        <p class="text-subtitle-2 text-muted mb-6">
          Allocate credits and set validity periods for your registered backend services.
        </p>

        <v-row dense>
          <v-col cols="12" md="6" class="mb-2">
            <label class="input-label">Service ID</label>
            <v-text-field
              v-model="form.serviceId"
              placeholder="e.g. 69afa3d8a4976d9c9e4671a7"
              outlined
              dense
              hide-details
              color="primary"
              class="mono-text"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="3" class="mb-2">
            <label class="input-label">Amount ({{ form.amountDenom }})</label>
            <v-text-field
              v-model="form.amount"
              type="number"
              outlined
              dense
              hide-details
              color="primary"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="3" class="mb-2">
            <label class="input-label">Validity ({{ form.validityPeriodUnit }}S)</label>
            <v-text-field
              v-model="form.validityPeriod"
              type="number"
              outlined
              dense
              hide-details
              color="primary"
            ></v-text-field>
          </v-col>
        </v-row>

        <div class="d-flex justify-start mt-6">
          <v-btn
            :loading="loading"
            :disabled="loading"
            color="#111827"
            class="px-8 font-weight-bold"
            depressed
            height="42"
            @click="handleRecharge"
          >
          <span style="color: white;">Execute Recharge</span>
          </v-btn>
        </div>

        <v-fade-transition>
          <div v-if="statusMessage" :class="['mt-4 feedback-box', isError ? 'error-style' : 'success-style']">
            <div class="d-flex align-center">
              <v-icon small :color="isError ? 'red' : 'green'" class="mr-2">
                {{ isError ? 'mdi-alert-circle' : 'mdi-check-circle' }}
              </v-icon>
              <span class="small font-weight-bold">{{ statusMessage }}</span>
            </div>
          </div>
        </v-fade-transition>
      </div>
    </div>
  </v-container>
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

export default {
  name: 'CreditRecharge',
  data() {
    return {
      loading: false,
      statusMessage: '',
      isError: false,
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
      if ( !this.form.serviceId) {
        this.showFeedback("Please fill in all required fields.", true);
        return;
      }

      this.loading = true;
      this.statusMessage = '';

      try {
        await this.creditRecharge(this.form);
        this.showFeedback(`Success: Credits recharged for service ${this.form.serviceId}!`);

      } catch (err) {
        const errorMsg = err.response?.data?.message || err.message || "Recharge failed.";
        this.showFeedback(`Error: ${errorMsg}`, true);
      } finally {
        this.loading = false;
      }
    },
    showFeedback(msg, isErr = false) {
      this.statusMessage = msg;
      this.isError = isErr;
    }
  }
};
</script>
