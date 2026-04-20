<template>
  <v-container pa-0>
    <load-ing :active.sync="isLoading" :can-cancel="false" :is-full-page="false"></load-ing>

    <div class="overview-container">
      <div class="header-row">
        <h2 class="title">Record Identification</h2>
      </div>
      
      <v-row dense class="mb-6">
        <v-col cols="12" md="8">
          <label class="input-label">Onboarding Record ID</label>
          <v-text-field
            v-model="recordId"
            placeholder="e.g. 693d6fa1c15303a8e72a04b9"
            outlined
            dense
            hide-details
            color="primary"
            class="mono-text"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-divider class="mb-6"></v-divider>

      <v-row>
        <v-col cols="12" md="6">
          <div class="warning-box h-100">
            <div class="d-flex align-center mb-4">
              <v-icon small color="primary" class="mr-2">mdi-shield-key-outline</v-icon>
              <span class="font-weight-bold text-uppercase small">SSI Credit Detail</span>
            </div>

            <div class="mb-3">
              <label class="input-label">Amount (uHID)</label>
              <v-text-field v-model.number="form.ssiCreditDetail.amount" type="number" outlined dense hide-details bg-white></v-text-field>
            </div>

            <v-row dense>
              <v-col cols="7">
                <label class="input-label">Validity Period</label>
                <v-text-field v-model.number="form.ssiCreditDetail.validityPeriod" type="number" outlined dense hide-details bg-white></v-text-field>
              </v-col>
              <v-col cols="5">
                <label class="input-label">Unit</label>
                <v-select :items="units" v-model="form.ssiCreditDetail.validityPeriodUnit" outlined dense hide-details bg-white></v-select>
              </v-col>
            </v-row>
          </div>
        </v-col>

        <v-col cols="12" md="6">
          <div class="warning-box h-100">
            <div class="d-flex align-center mb-4">
              <v-icon small color="primary" class="mr-2">mdi-account-check-outline</v-icon>
              <span class="font-weight-bold text-uppercase small">KYC Credit Detail</span>
            </div>

            <div class="mb-3">
              <label class="input-label">Amount (uHID)</label>
              <v-text-field v-model.number="form.kycCreditDetail.amount" type="number" outlined dense hide-details bg-white></v-text-field>
            </div>

            <v-row dense>
              <v-col cols="7">
                <label class="input-label">Validity Period</label>
                <v-text-field v-model.number="form.kycCreditDetail.validityPeriod" type="number" outlined dense hide-details bg-white></v-text-field>
              </v-col>
              <v-col cols="5">
                <label class="input-label">Unit</label>
                <v-select :items="units" v-model="form.kycCreditDetail.validityPeriodUnit" outlined dense hide-details bg-white></v-select>
              </v-col>
            </v-row>
          </div>
        </v-col>
      </v-row>

      <div class="mt-8 d-flex flex-column align-center">
        <p class="x-small text-muted mb-4">Review all credit details carefully before clicking approve.</p>
        <v-btn
          :loading="loading"
          :disabled="loading"
          color="#111827"
          class="white--text px-12 font-weight-bold"
          depressed
          x-large
          @click="submitOnboarding"
        >
        <span style="color: white;">Approve & Onboard Service</span>

          
        </v-btn>
      </div>

      <v-fade-transition></v-fade-transition>
    </div>
  </v-container>
</template>

<style scoped>
/* Inherited Theme */
.overview-container {
  padding: 2rem;
  background-color: #f9fafb;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
}

.title {
  font-size: 0.85rem;
  font-weight: 700;
  color: #111827;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.input-label {
  display: block;
  font-size: 0.65rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  margin-bottom: 4px;
}

/* Internal Boxes */
.warning-box {
  background-color: #f1f5f9; /* Subtle gray for nested sections */
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.25rem;
}

.bg-white >>> .v-input__control {
  background: white !important;
}

.mono-text {
  font-family: 'JetBrains Mono', monospace !important;
  font-size: 0.9rem !important;
}

/* Status Messages */
.feedback-box {
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid;
}
.error-style { background-color: #fef2f2; border-color: #fecaca; color: #991b1b; }
.success-style { background-color: #f0fdf4; border-color: #bbf7d0; color: #166534; }

.small { font-size: 0.85rem; }
.x-small { font-size: 0.75rem; }
.text-muted { color: #64748b !important; }
</style>
<script>


import { mapActions } from "vuex/dist/vuex.common.js";
import loadIng from '../../../components/element/LoadIng.vue';
import UtilsMixin from '../../../mixins/utils.js';

export default {
  components: { loadIng },
  mixins: [UtilsMixin],
  data() {
    return {
      loading: false,
      isLoading: false,
      recordId: '', // This should be captured from the UI or route params
      units: ['DAYS', 'MONTH', 'YEAR'],
      form: {
        ssiCreditDetail: {
          amount: 500,
          validityPeriod: 60,
          validityPeriodUnit: 'DAYS',
          amountDenom: 'uHID'
        },
        kycCreditDetail: {
          amount: 500,
          validityPeriod: 60,
          validityPeriodUnit: 'DAYS',
          amountDenom: 'uHID'
        }
      }
    };
  },
  methods: {
    
    ...mapActions("mainStore", ["approveOnboardingRequest"]),
    async submitOnboarding() {
        if (!this.recordId) {
          this.notifyErr("Please provide a Record ID.");
          return;
        }
        this.loading = true;
        this.isLoading = true;
        try {
          await this.approveOnboardingRequest({
            recordId: this.recordId,
            ssiCreditDetail: this.form.ssiCreditDetail,
            kycCreditDetail: this.form.kycCreditDetail
          });
          this.notifySuccess("Customer onboarded successfully!");
        } catch (e) {
          this.notifyErr(e.message || 'An unexpected error occurred.');
        } finally {
          this.loading = false;
          this.isLoading = false;
        }
    },
    setError(msg) {
      this.notifyErr(msg);
    }
  }
};
</script>
