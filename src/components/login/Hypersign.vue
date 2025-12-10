<style scoped>
h5 {
  width: 100%;
  text-align: center;
  border-bottom: 1px solid #80808045;
  line-height: 0.1em;
  margin: 10px 0 20px;
}

h5 span {
  background: #fff;
  padding: 0 10px;
}

.btn-hypersign {
  background-color: #494949;
  border-color: #494949;
  padding: 7px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
  min-width: 300px;
}

.QRRefresh {
  width: 100%;
  align-content: center;
  height: 100%;
  cursor: pointer;
  margin-top: 14%;
}

.button-theme {
  background-color: #905ab0;
  border-collapse: #905ab0;
  color: #fff;
  border: 0;
}

</style>

<template>
    <div class="row" style="margin-top: 3%; ">
        <!-- <h4 >Admin Login</h4> -->
        <loadIng
        :active.sync="isLoading"
        :can-cancel="true"
        :is-full-page="fullPage"
      ></loadIng>
        <div v-if="QRRefresh" class="QRRefresh">
          <i
            @click="reloadQR"
            class="fas fa-redo"
            style="font-size: xx-large; color: gray"
          ></i>
          <p>
            <label style="font-size: small; color: grey; margin-top: 1%">
              Session expired. Click to reload.
            </label>
          </p>
        </div>
        <form class="col-md-12" v-else>
          <div class="form-group">
            <vue-qr
              v-if="qr_data != ''"
              margin="1"
              :text="qr_data"
              :size="200"
              :logoSrc="src2"
              logoBackgroundColor="white"
              logoCornerRadius="2"
            ></vue-qr>
            <label style="font-size: small; color: grey; margin-top: 1%"
              >Scan QR code using Hypersign Mobile App</label
            >
            <div>
              <!-- <p style="font-size:small;"> Don’t have the app yet? <a href="#">Get it now</a></p> -->
              <span style="font-size: small; color: grey; padding: 10px">
                Get the app on
                <a
                  href="https://play.google.com/store/apps/details?id=com.hypersign.cordova"
                  target="__blank"
                  >Android</a
                >
                or
                <a :href="$config.webWalletAddress" target="__blank">Web</a>
              </span>
            </div>
          </div>
          <h5><span>OR</span></h5>
          <div class="mb-2">
            <a
              v-if="this.value != ''"
              class="btn btn-hypersign button-theme"
              href="#"
              @click.prevent="openWallet()"
            >
              <div style="font-size: smaller; padding: 10px">
                Click to Login
              </div>
            </a>
          </div>
        </form>
    
    </div>
</template>

<script>
import VueQr from "vue-qr";
import config from "../../config";
import EventBus from "../../eventbus";
export default {
  name: "HypersignLogin",
  components: {
    VueQr,
  },
  data() {
    return {
      qr_data: "",
      src2: require("../../assets/icon.png"),
      QRRefresh: false,
      active: 0,
      username: "",
      password: "",
      host: location.hostname,
      challenge: "dddd",
      domain: location.host,
      QRCodeValue: this.$route.query,
      credentials: {},
      userData: {},
      user: {},
      verifiablePresentation: "",
      fullPage: true,
      isLoading: false,
      connection: null,
      privateKey:
        "3isrtEJ4gt1ZHkdUYYph1WFAtzfqAL5WM6Hh1NC2hmWnDfBypXjt5oUFdAqQdiess2vqqQ3iF6x4fDVuvLw454sn",
      did: "did:hs:892325a4-75c9-465c-882b-91e3ca5143c3",
    };
  },
  created() {
    EventBus.$emit("clearAppData");
    localStorage.clear();
    document.title = `${config.app.name} - Login`;
    // take it in the env
    this.connection = new WebSocket(this.$config.websocketUrl);
    this.connection.onopen = function () {
      console.log("Socket connection is open");
    };
    this.isLoading = true;
    var _this = this;
    this.connection.onmessage = function ({ data }) {
      let messageData = JSON.parse(data);
      if (messageData.op == "init") {
        _this.isLoading = false;
        /// Sending provider from here........
        messageData.data["provider"] = "google";
        _this.value = JSON.stringify(messageData.data);
        _this.qr_data = `${_this.$config.webWalletAddress}/deeplink?url=${_this.value}`;
      } else if (messageData.op == "end") {
        _this.connection.close();

        const authorizationToken = messageData.data.hypersign.data.accessToken;
        const refreshToken = messageData.data.hypersign.data.refreshToken;
        if(authorizationToken) localStorage.setItem("authToken", authorizationToken);
        if(refreshToken) localStorage.setItem("refreshToken", refreshToken);
        EventBus.$emit("initializeStore", "login");

        if (localStorage.getItem("authToken") != null) {
          if (this.walletWindow) {
            this.walletWindow.close();
          }
          if (_this.$route.params.nextUrl != null) {
            _this.$router.push(_this.$route.params.nextUrl);
          } else {
            // console.log(_this.$router);
            // window.location.href =
            //   window.location.origin + "/dashboard";
            _this.$router.push("dashboard");
          }
        }
      } else if (messageData.op == "reload") {
        // console.log("Timeout for clientId: " + messageData.data.clientId)
        _this.QRRefresh = true;
        _this.connection.close(4001, messageData.data.clientId);
      }
    };
    this.connection.onerror = function (error) {
      console.log("Websocket connection error ", error);
    };
  },
  mounted() {
    this.clean();
  },
  methods: {
    reloadQR() {
      window.location.reload();
    },
    push(path) {
      this.$router.push(path);
    },
    openWallet() {
      if (this.value != "") {
        const link = `${this.$config.webWalletAddress}/deeplink?url=${this.value}`;
        this.walletWindow = window.open(
          link,
          "popUpWindow",
          `height=800,width=400,left=100,top=100,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no, status=yes`
        );
      }
    },
    clean() {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      localStorage.removeItem("credentials");
      localStorage.removeItem("userData");
    },
    notifySuccess(msg) {
      this.$notify({
        group: "foo",
        title: "Information",
        type: "success",
        text: msg,
      });
    },
    notifyErr(msg) {
      this.$notify({
        group: "foo",
        title: "Error",
        type: "error",
        text: msg,
      });
    },
    gotosubpage(id) {
      this.$router.push(`${id}`);
    },
  },
};
</script>
