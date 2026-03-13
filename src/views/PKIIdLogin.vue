<template>
  <div class="login-page-container">
    <img 
      class="align-center" 
      style="margin-bottom: 24px" 
      height="60px" 
      src="../assets/Entity_full.png" 
    />

    <div class="loginContent auth-portal-card">
      <div class="auth-header">
        <h2 class="portal-title">Welcome Back</h2>
        <p class="portal-subtitle">Please enter your details to sign in</p>
      </div>

      <GoogleLogin class="align-center"></GoogleLogin>

      <div class="divider">
        <span class="divider-text">OR</span>
      </div>

      <EmailOtp @loginSuccess="handleLoginSuccess" />
    </div>

    <div class="login-footer text-center mt-6">
      <p class="terms-text">
        By signing in, you agree to our Terms and Privacy Policy.
      </p>
    </div>
  </div>
</template>

<style scoped>
/* Main Background & Alignment */
.login-page-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f8fafc; /* Matches dashboard background */
  padding: 20px;
}

/* Redesigned Card */
.auth-portal-card {
  width: 100%;
  max-width: 400px; /* Slight increase for better spacing */
  background: #ffffff;
  padding: 40px 30px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.04), 0 8px 10px -6px rgba(0, 0, 0, 0.04);
}

.auth-header {
  text-align: center;
  margin-bottom: 32px;
}

.portal-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #111827;
  margin-bottom: 4px;
}

.portal-subtitle {
  font-size: 0.875rem;
  color: #64748b;
}

/* Alignment Helpers */
.align-center {
  margin-left: auto;
  margin-right: auto;
  display: flex;
  justify-content: center;
}

/* Refined Divider */
.divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 30px 0;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #f1f5f9;
}

.divider-text {
  padding: 0 12px;
  font-size: 0.7rem;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Footer Styling */
.terms-text {
  font-size: 0.75rem;
  color: #94a3b8;
  max-width: 300px;
  line-height: 1.4;
  text-align: center;
}

.mt-6 {
  margin-top: 24px;
}
</style>
<script type="text/javascript">
import GoogleLogin from "../components/login/Google.vue";
import EmailOtp from "../components/login/EmailOtp.vue";

export default {
  name: "LoginPage",
  components: {
    GoogleLogin,
    EmailOtp
  },
  methods: {
    handleLoginSuccess(data) {
      // Logic after successful OTP verification
      console.log("Login Successful", data);
      // Example: this.$router.push('/home')
    }
  }
}
</script>

