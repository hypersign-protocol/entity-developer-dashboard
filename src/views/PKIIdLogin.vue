<style scoped>
.addmargin {
  margin-top: 10px;
  margin-bottom: 10px;
}

.vue-logo-back {
  background-color: black;
}

.logo {
  width: 144px;
}

.fullbody {
  width: 100%;
}
.floatLeft {
  float: left;
}
.floatRight {
  text-align: end;
}
.title {
  color: grey;
}

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

.cmp-logo {
  position: absolute;
  z-index: 10;
  background-color: #fff;
  width: 20%;
  text-align: center;
  padding: 15px;
  border-bottom-right-radius: 20px;
}
.hypersign-logo-footer {
  position: absolute;
  z-index: 10;
  left: 30px;
  bottom: 20px;
}
.hypersign-logo-footer p {
  font-weight: 600;
}
.with-hypersign-btn {
  background-color: rgb(61, 66, 60);
  padding: 0;
}
.with-hypersign-btn .btn-text {
  padding: 14px 25px 14px 14px;

  text-transform: uppercase;
}

.btn-hypersign {
  background-color: #494949;
  border-color: #494949;
  padding: 7px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
  min-width: 300px;
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
</style>
<template>
  <div style="justify-content: center; padding-top: 3%">
    <img
      class="align-center"
      style="margin-bottom: 20px"
      height="60px"
      src="../assets/Entity_full.png"
    />
    <b-card no-body class="loginContent event-card">
      <loading
        :active.sync="isLoading"
        :can-cancel="true"
        :is-full-page="fullPage"
      ></loading>
      <h4>Admin Login</h4>
      <div class="row" style="margin-top: 3%">
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
                Click To Login
              </div>
            </a>
          </div>
        </form>
      </div>
    </b-card>
  </div>
</template>

<script>
import QrcodeVue from "qrcode.vue";
import VueQr from "vue-qr";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import config from "../config";
import EventBus from "../eventbus";
export default {
  name: "Login",
  components: {
    QrcodeVue,
    Loading,
    VueQr,
  },
  data() {
    return {
      qr_data: "",
      src2: require("../assets/icon.png"),
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
        localStorage.setItem("authToken", authorizationToken);
        localStorage.setItem("refreshToken", refreshToken);
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
    ///////////////////////////////////////////////////////////////////// Commenting below code since no use//////////////////////////////
    // async generatePresentation() {
    //   // try{
    //   const keys = JSON.parse(localStorage.getItem("keys"));
    //   //console.log(keys)
    //   this.user.privateKey = keys.privateKeyBase58
    //   this.user.id = keys.publicKey.id
    //   this.user.did = this.user.id.split('#')[0]
    //   const vc = JSON.parse(localStorage.getItem("credential"));
    //   this.user.name = vc['credentialSubject']['Name']
    //   this.user.email = vc['credentialSubject']['Email']
    //   // console.log(this.user)
    //   if (!vc) throw new Error('VC is null')
    //   //console.log(vc)
    //   //console.log("Before generating presentation ....")
    //   const vp_unsigned = await hypersignSDK.credential.generatePresentation(vc, this.user.id);
    //   //console.log("After generating presentation ....")
    //   //console.log(vp_unsigned)
    //   this.notifySuccess("Presentation generated")
    //   //console.log("Before signing presentation ....")
    //   const vp_signed = await hypersignSDK.credential.signPresentation(vp_unsigned, this.user.id, this.user.privateKey, this.challenge.challenge)
    //   //console.log(vp_signed)
    //   //console.log("After signing presentation ....")
    //   this.notifySuccess("Presentation signed")
    //   this.verifiablePresentation = JSON.stringify(vp_signed)

    //   localStorage.removeItem('credential')
    //   localStorage.removeItem('keys')
    //   // }catch(e){
    //   //   this.notifyErr(e.message)
    //   // }
    // },
    // async downloadPresentation() {
    //   await this.generatePresentation()
    //   this.forceFileDownload(
    //     this.verifiablePresentation,
    //     "vp.json"
    //   );
    // },
    // forceFileDownload(data, fileName) {
    //   const url = window.URL.createObjectURL(new Blob([data]));
    //   const link = document.createElement("a");
    //   link.href = url;
    //   link.setAttribute("download", fileName);
    //   document.body.appendChild(link);
    //   link.click();
    // },
    // readFile(file, cb) {
    //   //console.log('Inside reaffileDs')
    //   const reader = new FileReader();
    //   reader.onload = cb
    //   reader.readAsText(file);
    // },
    // onFileChange(event) {
    //   const file = event.target.files[0];
    //   this.readFile(file, this.onfileLoadSuccess)
    // },
    // onfileLoadSuccess(evt) {
    //   //console.log('Inside callback')
    //   const fileJSON = JSON.parse(evt.target.result);
    //   if (!fileJSON) this.notifyErr("Incorrect file");
    //   if (fileJSON["type"] && fileJSON["type"].find(x => x == 'VerifiableCredential')) {
    //     //console.log('Inside callback: vc')
    //     localStorage.removeItem('credential')
    //     localStorage.setItem("credential", JSON.stringify(fileJSON));
    //   } else if (fileJSON['privateKeyBase58']) {
    //     //console.log('Inside callback: keys')
    //     localStorage.removeItem('keys')
    //     localStorage.setItem("keys", JSON.stringify(fileJSON));
    //   } else {
    //     this.notifyErr("Invalid file")
    //   }
    // },
    // async login(type) {
    //   try {
    //     this.isLoading = true;
    //     let url = "";
    //     let headers = {
    //       "Content-Type": "application/json",
    //     };

    //     url = `${this.$config.studioServer.BASE_URL}api/auth/login_pki?type=PKI`;
    //     headers["x-auth-token"] = this.challenge.JWTChallenge;
    //     await this.generatePresentation();

    //     const userData = {
    //       fname: this.user.name,
    //       email: this.user.email,
    //       publicKey: this.user.did,
    //       proof: this.verifiablePresentation,
    //       challenge: this.challenge ? this.challenge.challenge : "",
    //       domain: this.domain,
    //     };

    //     // console.log(url)
    //     console.log('.............before fetch')
    //     fetch(url, {
    //       body: JSON.stringify(userData),
    //       method: "POST",
    //       headers: headers,
    //     })
    //       .then((res) => res.json())
    //       .then((j) => {
    //         this.isLoading = false;
    //         if (j && j.status == 500) {
    //           return this.notifyErr(`Error:  ${j.error}`);
    //         }
    //         localStorage.setItem("authToken", j.message.jwtToken);
    //         j.message.user["privateKey"] = this.user.privateKey;
    //         localStorage.setItem("user", JSON.stringify(j.message.user));
    //         if (localStorage.getItem("authToken") != null) {
    //           if (this.$route.params.nextUrl != null) {
    //             this.$router.push(this.$route.params.nextUrl);
    //           } else {
    //             this.$router.push("dashboard");
    //           }
    //         }
    //       });
    //   } catch (e) {
    //     console.log(e)
    //     this.clean();
    //     this.isLoading = false;
    //     this.notifyErr(`Error: ${e.message}`);
    //   }
    // },
  },
};
</script>
