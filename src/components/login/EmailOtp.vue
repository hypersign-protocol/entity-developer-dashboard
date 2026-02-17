<template>
  <div class="email-otp-container">
    <div v-if="step === 1" class="request-step">
      <div class="input-group">
        <label>Email Address</label>
        <input 
          v-model="email" 
          type="email" 
          placeholder="e.g. admin@company.com"
          :disabled="loading"
          class="email-input"
        />
      </div>
      
      <button 
        @click="requestOtp" 
        :disabled="loading || !isValidEmail" 
        class="action-btn"
      >
        {{ loading ? 'Sending...' : 'Send OTP' }}
      </button>
    </div>

    <div v-if="step === 2" class="verify-step">
      <div class="step-header">
        <p>An OTP has been sent to <strong>{{ email }}</strong></p>
        <button @click="step = 1" class="link-btn">Change Email</button>
      </div>
      
      <PIN @pinTakenEvent="verifyOtp" />
      
      <p v-if="loading" class="loading-text">Verifying code...</p>
    </div>

    <div v-if="message" :class="['message-box', isError ? 'error' : 'success']">
      {{ message }}
    </div>
  </div>
</template>

<script>
import PIN from './mfa/PIN.vue'; // Adjust path as needed
import axios from 'axios';

export default {
  name: 'EmailOtp',
  components: { PIN },
  data() {
    return {
      step: 1, // 1: Request, 2: Verify
      email: '',
      loading: false,
      message: '',
      isError: false
    };
  },
  computed: {
    isValidEmail() {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(this.email).toLowerCase());
    }
  },
  methods: {
    async requestOtp() {
      this.loading = true;
      this.message = '';
      
      try {
        const response = await axios.post('http://localhost:3002/api/v1/auth/email/otp/request', {
          email: this.email
        });
        
        this.message = response.data.message || 'OTP sent successfully';
        this.isError = false;
        this.step = 2; // Move to PIN input
      } catch (err) {
        this.message = err.response?.data?.message || 'Failed to send OTP';
        this.isError = true;
      } finally {
        this.loading = false;
      }
    },
    
    async verifyOtp(otpValue) {
      this.loading = true;
      this.message = '';

      try {
        const response = await axios.post('http://localhost:3002/api/v1/auth/email/otp/verify', {
          email: this.email,
          otp: otpValue
        });

        this.message = 'Verification successful!';
        this.isError = false;
        
        // Emit success to parent (so it can redirect to dashboard)
        this.$emit('loginSuccess', response.data);
      } catch (err) {
        this.message = err.response?.data?.message || 'Invalid OTP. Please try again.';
        this.isError = true;
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.button-theme:hover {
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
    background: aliceblue !important;
    border: 1px solid #905ab0 !important;
    color: #905ab0 !important;
}
.email-otp-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

.input-group {
  text-align: left;
  margin-bottom: 20px;
}

label {
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
  color: #34495e;
}

.email-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.action-btn {
  width: 100%;
  background-color: rgb(66, 66, 66);
  color: white;
  padding: 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.action-btn:disabled {
  background-color: #bdc3c7;
}

.step-header {
  margin-bottom: 20px;
}

.link-btn {
  background: none;
  border: none;
  color: #3498db;
  text-decoration: underline;
  cursor: pointer;
  font-size: 0.9em;
}

.message-box {
  margin-top: 20px;
  padding: 10px;
  border-radius: 4px;
  font-size: 0.9em;
}

.error { background: #fdeaea; color: #c0392b; }
.success { background: #eafaf1; color: #27ae60; }
.loading-text { color: #7f8c8d; font-size: 0.8em; margin-top: 10px; }
</style>