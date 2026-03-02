<template>
  <div class="admin-panel">
    <div class="form-container">
      <div class="input-group">
        <label>Onboarding Record ID:</label>
        <input v-model="recordId" type="text" placeholder="e.g. 693d6fa1c15303a8e72a04b9" />
      </div>

      <div class="sections-grid">
        <section class="credit-box">
          <h4>SSI Credit Detail</h4>
          <div class="field">
            <label>Amount (uHID):</label>
            <input v-model.number="form.ssiCreditDetail.amount" type="number" />
          </div>
          <div class="field">
            <label>Validity Period:</label>
            <input v-model.number="form.ssiCreditDetail.validityPeriod" type="number" />
          </div>
          <div class="field">
            <label>Unit:</label>
            <select v-model="form.ssiCreditDetail.validityPeriodUnit">
              <option v-for="unit in units" :key="unit" :value="unit">{{ unit }}</option>
            </select>
          </div>
        </section>

        <section class="credit-box">
          <h4>KYC Credit Detail</h4>
          <div class="field">
            <label>Amount (uHID):</label>
            <input v-model.number="form.kycCreditDetail.amount" type="number" />
          </div>
          <div class="field">
            <label>Validity Period:</label>
            <input v-model.number="form.kycCreditDetail.validityPeriod" type="number" />
          </div>
          <div class="field">
            <label>Unit:</label>
            <select v-model="form.kycCreditDetail.validityPeriodUnit">
              <option v-for="unit in units" :key="unit" :value="unit">{{ unit }}</option>
            </select>
          </div>
        </section>
      </div>

      <button @click="submitOnboarding" :disabled="loading" class="submit-btn">
        {{ loading ? 'Processing...' : 'Approve & Onboard' }}
      </button>

      <div v-if="message" :class="['message', isError ? 'error' : 'success']">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script>


import { mapActions } from "vuex/dist/vuex.common.js";
// import UtilsMixin from '../../../mixins/utils';

export default {
  // mixins: [UtilsMixin],
  data() {
    return {
      loading: false,
      message: '',
      isError: false,
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
      try{

        if (!this.recordId) {
        this.setError("Please provide a Record ID.");
          return;
        }

        this.loading = true;
        this.message = '';
        await this.approveOnboardingRequest({ recordId: this.recordId, ssiCreditDetail: this.form.ssiCreditDetail, kycCreditDetail: this.form.kycCreditDetail })
        this.isError = false;
        this.message = "Customer onboarded successfully!";

      }catch(e) {
        this.setError(e.message)
      }
    },
    setError(msg) {
      this.isError = true;
      this.message = msg;
      this.loading = false;
    }
  }
};
</script>

<style scoped>
.admin-panel { padding: 20px; font-family: sans-serif; }
.form-container { max-width: 800px;  border-radius: 8px; }
.sections-grid { display: flex; gap: 20px; margin-top: 20px; }
.credit-box { flex: 1; border: 1px solid #eee; padding: 15px; border-radius: 4px; background: #f9f9f9; }
.input-group, .field { margin-bottom: 15px; }
label { display: block; font-weight: bold; margin-bottom: 5px; font-size: 0.9em; }
input, select { width: 100%; padding: 8px; box-sizing: border-box; }
.submit-btn { background-color: #4CAF50; color: white; padding: 10px 20px; border: none; cursor: pointer; border-radius: 4px; font-size: 16px; margin-top: 10px; }
.submit-btn:disabled { background-color: #ccc; }
.message { margin-top: 20px; padding: 10px; border-radius: 4px; }
.error { background-color: #fee; color: #c00; }
.success { background-color: #efe; color: #080; }
</style>