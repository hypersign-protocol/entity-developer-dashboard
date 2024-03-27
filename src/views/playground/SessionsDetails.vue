<style scoped>
.card-header {
  background: aliceblue;
  padding: 0px;
}

.card {
  border-radius: 10px;
}

.goschema {
  color: #339af0;
}

.goschema:hover {
  text-decoration: underline;
  cursor: pointer;
}

.far {
  color: gray;
  font-size: 1.5em;
  display: inline;
  cursor: pointer;
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

.scrollit {
  overflow: hidden;
  height: 600px;
}

.scrollit:hover {
  overflow-y: auto;
}

/* 
.kqPHSp {
    position: relative;
    border-left: 2px solid var(--UI--colors-grey200);
    height: 100%;
    padding-left: 2.4rem;
    
}

.UI--c-cdWBIM-ijlIiKl-css {
    cursor: inherit;
    color: var(--UI--colors-grey700);
    font-size: 1.2rem;
    line-height: 1.6rem;
}

.UI--c-cdWBIM {
    font-weight: 400;
}

.kgLKAh {
    margin: 0.4rem 0px 1rem;
}

.UI--c-cdWBIM-ijgnCPX-css {
    cursor: inherit;
    color: var(--UI--colors-grey700);
    font-size: 1rem;
    line-height: 1.4rem;
}


.UI--c-cdWBIM-GgrlW-semibold-true {
    font-weight: 600;
} */


.centered-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
  /* Set a height to make it full height, adjust as needed */
}

ul.timeline {
  list-style-type: none;
  position: relative;
}

ul.timeline:before {
  content: ' ';
  background: #d4d9df;
  display: inline-block;
  position: absolute;
  left: 29px;
  width: 2px;
  height: 100%;
  z-index: 400;
}

ul.timeline>li {
  margin: 20px 0;
  padding-left: 20px;
}

ul.timeline>li:before {
  content: ' ';
  background: white;
  display: inline-block;
  position: absolute;
  border-radius: 50%;
  border: 3px solid #22c0e8;
  background-color: #339af0;
  left: 20px;
  width: 20px;
  height: 20px;
  z-index: 400;
}

.container {
  max-width: 1346px;
}

</style>
<template>
  <div :class="isContainerShift ? 'homeShift' : 'home'">
    <loading :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></loading>

  
    <div class="row">
      <div class="col-md-12" style="text-align: left">
        <div class="form-group" style="display:flex">
          <h3 class="mt-4" style="text-align: left;">
            
            <a @click="$router.go(-1)" href="#">Verifications</a> <i class="fa fa-angle-double-right" aria-hidden="true"></i> {{sessionId }} </h3>
        </div>
      </div>
    </div>


    <div class="row">
      <div class="col-md-12">
        <div class="card" style="margin-top: 1%;">
          <div class="card-body">
            <div class="row">
              <div class="col-md-4">
                <label><strong>Date:</strong> {{ session ? formatDate(session.createdAt) : "-" }}</label>
              </div>
              <div class="col-md-4">
                <label><strong>UserId:</strong> {{ session ? session.appUserId : "-" }}</label>
              </div>
              <div class="col-md-4" style="text-align: right;">
                <span v-html="getStatus(session)"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


    <div class="row"  v-if="session.selfiDetails && Object.keys(session.selfiDetails).length > 0">
      <div class="col-md-12">

        <!-- Face Verification -->
        <div class="card"
          style="margin-top: 1%; border: 1px solid rgb(81, 137, 81); margin-right:1%; float: left;padding: 10px">
          <div class="card-header" style="padding: 10px">
            <h4>Face Verification</h4>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-5 centered-container" style="">
                <span class=""><img style="height:100px;" :src="session.selfiDetails.tokenSelfiImage" /></span>
              </div>
              <div class="col-md-2 centered-container" style="" v-if="selfiDataFound && idDocDataFound">
                <span class="" style="font-size: 50px; color: green;"><i class="fa fa-check-circle"
                    aria-hidden="true"></i></span>
              </div>
              <div class="col-md-2 centered-container" style="" v-else>
                <span class="" style="font-size: 50px; color: orange;"><i class="fa fa-exclamation-triangle"
                    aria-hidden="true"></i></span>
              </div>

              <div class="col-md-5 centered-container" style="">
                <span class=""><img style="height:100px;" :src="session.ocriddocsDetails.tokenFaceImage" /></span>
              </div>
            </div>
            <div class="row">
              <div class="col-md-12">
                <div class="alert alert-success" role="alert">
                  <span><i class="fa fa-info-circle" aria-hidden="true"></i></span> Passive liveness Success
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Personal Information -->
        <div class="card" style="margin-top: 1%; margin-right: 1%; float: left; padding: 10px; height: 439px">
          <div class="card-header" style="padding: 10px">
            <h4>Personal Information</h4>
          </div>
          <div class="card-body">
            <table class="table">
              <tbody>
                <tr>
                  <td>Name</td>
                  <td style="text-align: right;">VISHWAS ANAND BHUSHAN</td>
                </tr>
                <tr>
                  <td>Wallet Address</td>
                  <td style="text-align: right;">0X12X12312312312312312</td>
                </tr>
                <tr>
                  <td>Country</td>
                  <td style="text-align: right;">IND</td>
                </tr>
                <tr>
                  <td>Country</td>
                  <td style="text-align: right;">IND</td>
                </tr>
                <tr>
                  <td>Country</td>
                  <td style="text-align: right;"> IND</td>
                </tr>


              </tbody>

            </table>
          </div>
        </div>

        <!-- Images / Documentation -->
        <div class="card" style="margin-top: 1%; margin-right:1%; float: left; padding: 10px">
          <div class="card-header" style="padding: 10px">
            <h4>Images / Documents</h4>
          </div>
          <div class="card-body" v-if="selfiDataFound || idDocDataFound">
            <div class="card-body" style="margin-top: 0%; border: 1px solid rgb(228, 228, 228); border-radius: 10px;"
              v-if="selfiDataFound">
              <div class="row">
                <div class="col-md-3">
                  <img style="height:35px;" :src="session.selfiDetails.tokenSelfiImage" />
                </div>
                <div class="col-md-7">
                  <span style="font-size: small;">Selfie</span>
                </div>
                <div class="col-md-2" style="text-align: right; font-size: medium; cursor: pointer;" title="Zoom"
                  @click="zoom('Selfie')">
                  <i class="fa fa-search-plus" aria-hidden="true"></i>
                </div>
              </div>
            </div>

            <div class="card-body" style="margin-top: 2%; border: 1px solid rgb(228, 228, 228); border-radius: 10px;"
              v-if="idDocDataFound">
              <div class="row">
                <div class="col-md-3">
                  <img style="height:35px;" :src="session.ocriddocsDetails.tokenFrontDocumentImage" />
                </div>
                <div class="col-md-7">
                  <span style="font-size: medium;">Document Front</span>
                </div>
                <div class="col-md-2" style="text-align: right; font-size: medium; cursor: pointer;" title="Zoom"
                  @click="zoom('Document Front')">
                  <i class="fa fa-search-plus" aria-hidden="true"></i>
                </div>
              </div>
            </div>
          </div>
          <div class="card-body" v-else>
            <h4>No record found</h4>
          </div>
        </div>

        <!-- Report -->
        <div class="card" style="margin-top: 1%; margin-right: 1%; float: left;padding: 10px">
          <div class="card-header" style="padding: 10px">
            <h4>Report</h4>
          </div>
          <div class="card-body">
            <button type="button" class="btn btn-secondary btn-sm"><i class="fa fa-download" aria-hidden="true"
                disabled></i>
              Download Pdf
            </button>

          </div>
        </div>

        <!-- Timelines -->
        <div class="card" style="margin-top: 1%; margin-right: 1%; float: left;padding: 10px">
          <div class="card-header" style="padding: 10px">
            <h4>Timelines</h4>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-12">
                <ul class="timeline">
                  <li>
                    <a target="_blank"><strong>Step Change: Start</strong></a>
                    <a href="#" class="float-right">{{ session ? formatDate(session.createdAt) : "-" }}</a>
                  </li>
                  <li v-if="selfiDataFound">
                    <a target="_blank"><strong>Step Change: Selfie uploaded</strong></a>
                    <a href="#" class="float-right">{{ session ? formatDate(session.selfiDetails.createdAt) : "-" }}</a>
                  </li>
                  <li v-if="idDocDataFound">
                    <a target="_blank"><strong>Step Change: ID Document uploaded</strong></a>
                    <a href="#" class="float-right">{{ session ? formatDate(session.ocriddocsDetails.createdAt) : "-"
                      }}</a>
                  </li>
                  <li v-if="selfiDataFound && idDocDataFound">
                    <a target="_blank"><strong>Step Change: Finished</strong></a>
                    <a href="#" class="float-right">{{ session ? formatDate(session.ocriddocsDetails.createdAt) : "-"
                      }}</a>
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </div>

        <!-- Device Information -->
        <div class="card" style="margin-top: 1%; margin-right: 1%; float: left;padding: 10px">
          <div class="card-header" style="padding: 10px">
            <h4>Device Information</h4>
          </div>
          <div class="card-body">
            <table class="table">
              <tbody>
                <tr>
                  <td>IP</td>
                  <td style="text-align: right;">121.0.6167.171</td>
                </tr>
                <tr>
                  <td>Operating system</td>
                  <td style="text-align: right;">iOS</td>
                </tr>
                <tr>
                  <td>OS Version</td>
                  <td style="text-align: right;">v1.0</td>
                </tr>
                <tr>
                  <td>Browser</td>
                  <td style="text-align: right;">Chrome</td>
                </tr>
              </tbody>

            </table>

          </div>
        </div>


      </div>
    </div>

    <hf-pop-up :Header="popupHeader">
      <div class="card" style="">
        <div class="card-body centered-container" style="height: 500px; width: 500px;">
          <img style="height:350px; width:350px;" :src="popupImage" />
        </div>
      </div>
    </hf-pop-up>

  </div>
</template>

<script>

import UtilsMixin from '../../mixins/utils';
import Loading from "vue-loading-overlay";
import { mapState, mapGetters, mapActions } from "vuex";
export default {
  name: "sessionDetails",
  components: { Loading},
  computed: {
    ...mapGetters('mainStore', ['getSessionDetailsBySessionId']),
    ...mapState({
      sessionList: state => state.mainStore.sessionList,
      containerShift: state => state.playgroundStore.containerShift,
    }),
    isContainerShift() {
      return this.containerShift
    },
    selfiDataFound() {
      return (this.session.selfiDetails && Object.keys(this.session.selfiDetails).length > 0)
    },
    idDocDataFound() {
      return (this.session.ocriddocsDetails && Object.keys(this.session.ocriddocsDetails).length > 0)
    }
    // session() {
    //   return this.sessionList.find(x => x.sessionId == this.sessionId)
    // }
  },
  data() {
    return {
      fullPage: true,
      isLoading: false,
      appId: "",
      sessionId: "",
      session: {},
      popupHeader: "",
      popupImage: "",
    };
  },

  async created() {
    this.appId = this.$route.params.appId
    this.sessionId = this.$route.params.sessionId
    // this.session = this.getSessionDetailsBySessionId(this.sessionId);
    this.session = await this.fetchSessionsDetailsById({ sessionId: this.sessionId })
  },
  // async mounted() {
  //   if (!this.session.selfiDetails || this.session.ocriddocsDetails) {
  //     this.session = await this.fetchSessionsDetailsById({ sessionId: this.sessionId })
  //   }
  // },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.prevRoute = from;
    });
  },
  methods: {
    ...mapActions('mainStore', ['fetchSessionsDetailsById']),
    zoom(place) {
      this.popupHeader = place
      switch (place) {
        case 'Document Front': {
          this.popupImage = this.session.ocriddocsDetails.tokenFrontDocumentImage
          break
        }
        case 'Selfie': {
          this.popupImage = this.session.selfiDetails.tokenSelfiImage
          break;
        }
      }
      this.$root.$emit('modal-show');
    },
  },
  mixins: [UtilsMixin],

};
</script>
