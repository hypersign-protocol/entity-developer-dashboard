<template>
  <div class="login-page-container">
    <img 
      class="align-center" 
      style="margin-bottom: 20px" 
      height="60px" 
      src="../assets/Entity_full.png" 
    />

    <div class="loginContent event-card">
      <GoogleLogin class="align-center"></GoogleLogin>

      <div class="divider">
        <span class="divider-text">OR</span>
      </div>

      <EmailOtp @loginSuccess="handleLoginSuccess" />
    </div>
  </div>
</template>

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

<style scoped>
.login-page-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-top: 8%; /* Adjusted slightly for more vertical space */
}

.event-card {
  border: 0;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  background: #ffffff;
}

.align-center {
  margin-left: auto;
  margin-right: auto;
  display: block;
}

.loginContent {
  min-height: 400px; /* Increased slightly to accommodate both methods */
  width: 380px;
  padding: 30px 20px;
  margin: 0 auto;
  border-top: 4px solid rgb(113 113 121);
  text-align: center;
}

/* Divider Styling */
.divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 25px 0;
  color: #888;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #eee;
}

.divider-text {
  padding: 0 10px;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
}

.vl {
  border-left: 6px solid green;
  height: 500px;
  position: absolute;
  left: 50%;
  margin-left: -3px;
  top: 0;
}
</style>