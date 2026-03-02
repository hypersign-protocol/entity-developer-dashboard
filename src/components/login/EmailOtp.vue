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
        <button @click="goBackToEmail" class="link-btn">Change Email</button>
      </div>
      
      <!-- Show PIN input only if OTP is still valid -->
      <div v-if="!isOtpExpired">
        <PIN @pinTakenEvent="verifyOtp" />
        <p v-if="loading" class="loading-text">Verifying code...</p>
      </div>

      <!-- Show regenerate button if OTP is expired -->
      <div v-if="isOtpExpired" class="expired-section">
        <p class="expired-message">Your OTP has expired. Please request a new one.</p>
        <button 
          @click="requestOtp" 
          :disabled="loading"
          class="action-btn"
        >
          {{ loading ? 'Sending...' : 'Request New OTP' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import PIN from './mfa/PIN.vue'; // Adjust path as needed
import { mapActions } from "vuex/dist/vuex.common.js";
import UtilsMixin from "../../mixins/utils.js";

export default {
  name: 'EmailOtp',
  components: { PIN },
  mixins: [UtilsMixin],
  data() {
    return {
      step: 1, // 1: Request, 2: Verify
      email: '',
      loading: false,
      sessionId: null,
      authenticators: [],
      isOtpExpired: false
    };
  },
  computed: {
    isValidEmail() {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(this.email).toLowerCase());
    }
  },
  methods: {
    ...mapActions('mainStore', ['emailOtpRequest', 'emailOtpVerify']),
    goBackToEmail() {
      this.step = 1;
      this.isOtpExpired = false;
    },
    async requestOtp() {
      this.loading = true;
      this.isOtpExpired = false; // Reset expired flag when requesting new OTP
      
      try {
        const response = await this.emailOtpRequest({
          email: this.email
        });
        
        this.notifySuccess(response.message || 'OTP sent successfully');
        this.step = 2; // Move to PIN input
      } catch (err) {
        this.notifyErr(err.message || 'Failed to send OTP');
      } finally {
        this.loading = false;
      }
    },
    
    async verifyOtp(otpValue) {
      this.loading = true;

      try {
        const response = await this.emailOtpVerify({
          email: this.email,
          otp: otpValue
        });

        // Check if MFA/authenticators are required
        
        if(response.authenticators && response.authenticators.length > 0){
          // Store authenticators and sessionId
          this.authenticators = response.authenticators;
          this.sessionId = response.sessionId;
          
          // Build query parameters
          const queryParams = new URLSearchParams({
            authenticators: JSON.stringify(response.authenticators),
            sessionId: response.sessionId
          }).toString();
          
          // Redirect to MFA page with parameters
          this.$router.push(`/studio/mfa?${queryParams}`);
        } else {
          // No MFA required, emit success and redirect to home
          this.notifySuccess('Verification successful!');
          this.$emit('loginSuccess', response.verified);
          this.$router.push("/studio/home");
        }

      } catch (err) {
        const errorMessage = err.message || 'Invalid OTP. Please try again.';
        
        // Check if OTP is expired
        if (errorMessage.toLowerCase().includes('expired')) {
          this.isOtpExpired = true;
          this.notifyErr('OTP has expired. Please request a new one.');
        } else {
          // Invalid OTP - allow retry
          this.notifyErr(errorMessage);
        }
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

.loading-text { 
  color: #7f8c8d; 
  font-size: 0.8em; 
  margin-top: 10px; 
}

.expired-section {
  text-align: center;
  margin-top: 20px;
}

.expired-message {
  color: #c0392b;
  font-size: 0.95em;
  margin-bottom: 15px;
}
</style>