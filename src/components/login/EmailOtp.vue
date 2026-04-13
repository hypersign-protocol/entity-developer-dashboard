<template>
  <div class="email-otp-wrapper">
    <div v-if="step === 1" class="auth-step-fade">
      <div class="input-group">
        <label class="portal-label">Email Address</label>
        <div class="input-wrapper">
          <i class="mdi mdi-email-outline input-icon" style="font-size:16px"></i>
          <input 
            v-model="email" 
            type="email" 
            placeholder="e.g. admin@company.com"
            :disabled="loading"
            class="portal-input"
          />
        </div>
      </div>
      
      <button 
        @click="requestOtp" 
        :disabled="loading || !isValidEmailTest" 
        class="portal-action-btn"
        :class="{ 'btn-loading': loading }"
      >
        <span>{{ loading ? 'Sending...' : 'Continue' }}</span>
        <i v-if="!loading" class="mdi mdi-arrow-right text-white" style="font-size:14px"></i>
      </button>
    </div>

    <div v-if="step === 2" class="auth-step-fade">
      <div class="verify-header mb-6">
        <p class="verify-text">Verification code sent to</p>
        <div class="d-flex align-center justify-center gap-2">
          <span class="active-email">{{ email }}</span>
          <button @click="goBackToEmail" class="change-email-btn" title="Edit Email">
            <i class="mdi mdi-pencil-outline" style="font-size:12px;color:blue"></i>
          </button>
        </div>
      </div>
      
      <div v-if="!isOtpExpired">
        <div class="pin-container py-2">
          <PIN @pinTakenEvent="verifyOtp" />
        </div>
        <p v-if="loading" class="verifying-status mt-4">
          <b-spinner small variant="primary" class="mr-2"></b-spinner>
          Verifying identity...
        </p>
      </div>

      <div v-if="isOtpExpired" class="expired-alert">
        <i class="mdi mdi-alert-circle-outline mb-2" style="color:#ef5350;font-size:24px"></i>
        <p class="expired-text">Your security code has expired.</p>
        <button 
          @click="requestOtp" 
          :disabled="loading"
          class="portal-action-btn outline mt-2"
        >
          {{ loading ? 'Sending...' : 'Request New Code' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>


.email-otp-wrapper {
  width: 100%;
}

.input-group {
  display: flex;
  flex-direction: column; /* This forces the label to be on top of the input */
  align-items: flex-start;
  text-align: left;
  margin-bottom: 24px;
  width: 100%;
}

.portal-label {
  display: block; /* Ensure it takes full width */
  width: 100%;
  font-size: 0.7rem;
  font-weight: 800;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 8px; /* Added spacing between label and input */
}

/* Ensure the wrapper also takes full width */
.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%; 
}


.input-icon {
  position: absolute;
  left: 14px;
  color: #94a3b8;
}

.portal-input {
  width: 100%;
  padding: 12px 12px 12px 42px;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #1e293b;
  transition: all 0.2s ease;
}

.portal-input:focus {
  outline: none;
  border-color: #3b82f6;
  background-color: #ffffff;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

/* Button Styling */
.portal-action-btn {
  width: 100%;
  height: 48px;
  background-color: #1e293b;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 24px;
}

.portal-action-btn:hover:not(:disabled) {
  background-color: #0f172a;
  transform: translateY(-1px);
}

.portal-action-btn:disabled {
  background-color: #e2e8f0;
  color: #94a3b8;
  cursor: not-allowed;
}

.portal-action-btn.outline {
  background: transparent;
  border: 1px solid #e2e8f0;
  color: #64748b;
}

/* Step 2 Specifics */
.verify-text {
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 4px;
  text-align: center;
}

.active-email {
  font-weight: 700;
  color: #1e293b;
  font-size: 0.95rem;
}

.change-email-btn {
  background: #eff6ff;
  border: none;
  border-radius: 4px;
  padding: 2px 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.verifying-status {
  font-size: 0.8rem;
  color: #3b82f6;
  font-weight: 600;
  text-align: center;
}

/* Alert States */
.expired-alert {
  background-color: #fff1f2;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  border: 1px dashed #fecaca;
}

.expired-text {
  font-size: 0.85rem;
  color: #be123c;
  font-weight: 600;
}

/* Utilities */
.gap-2 { gap: 8px; }
.auth-step-fade {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>


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
    isValidEmailTest() {
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
