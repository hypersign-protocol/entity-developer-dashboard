<template>
  <div class="credit-recharge-form">
    <h3></h3>
    
    <div class="form-grid">
      <div class="field">
        <label>Service ID (App ID):</label>
        <input v-model="form.serviceId" type="text" placeholder="e.g. app-123" />
      </div>
      <div class="field">
        <label>Amount:</label>
        <input v-model="form.amount" type="text" />
      </div>

      <div class="field">
        <label>Validity Period ({{ form.validityPeriodUnit }}):</label>
        <input v-model="form.validityPeriod" type="text" />
      </div>

      <!-- <div class="field full-width">
        <label>Whitelisted CORS:</label>
        <input v-model="form.whitelistedCors" type="text" />
      </div> -->
    </div>

    <button @click="handleRecharge" :disabled="loading" class="recharge-btn">
      {{ loading ? 'Signing & Sending...' : 'Execute Recharge' }}
    </button>

    <div v-if="statusMessage" :class="['status-box', isError ? 'error' : 'success']">
      {{ statusMessage }}
    </div>
  </div>
</template>

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

<style scoped>
.credit-recharge-form { background: #fff; padding: 10px; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px; }
.full-width { grid-column: span 2; }
.field { display: flex; flex-direction: column; }
label { font-size: 12px; font-weight: bold; margin-bottom: 5px; color: #555; text-align: left; }
input, .service-select { padding: 10px; border: 1px solid #ccc; border-radius: 4px; font-size: 14px; }
.service-select { background-color: #f0f7ff; border-color: #3498db; font-weight: bold; }
.recharge-btn { background: #2ecc71; color: white; border: none; padding: 12px; border-radius: 4px; cursor: pointer; font-weight: bold; width: 100%; }
.status-box { margin-top: 15px; padding: 10px; border-radius: 4px; font-size: 14px; text-align: left; }
.error { background: #fdeaea; color: #c0392b; border: 1px solid #f5b7b1; }
.success { background: #eafaf1; color: #27ae60; border: 1px solid #abebc6; }
</style>