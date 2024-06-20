<style scoped>
.event-card {
  border: 0;
  border-radius: 10px;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.align-center {
  margin-left: auto;
  margin-right: auto;
  display: block;
}

.loginContent {
  min-height: 350px;
  height: 100%;
  width: 350px;
  padding-right: 10px;
  padding-left: 10px;
  padding-top: 20px;
  padding-bottom: 10px;
  margin: 0 auto;
  border-top: 2px solid rgb(120, 120, 243);
  text-align: center;
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
<template>
  <div style="justify-content: center; padding-top: 10%">
    <img class="align-center" style="margin-bottom: 20px" height="60px" src="../assets/Entity_full.png" />
    <GoogleLogin class="align-center" style="margin-top: 4%"></GoogleLogin>

    <!-- <div class="row" style="justify-content: center">
      <div class="col-md-4" style="padding: 10px;     border-right: 2px solid #80808059;">
        <b-card no-body class="loginContent event-card">
          <HypersignLogin></HypersignLogin>
        </b-card>
      </div>

      <div class="col-md-12" style="justify-content: left; padding: 20px">
        <div style="margin-top: 45%;">
          <GoogleLogin></GoogleLogin>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script type="text/javascript">
import GoogleLogin from "../components/login/Google.vue"
export default {
  name: "LoginPage",
  components: {
    GoogleLogin
  }

}
</script>
