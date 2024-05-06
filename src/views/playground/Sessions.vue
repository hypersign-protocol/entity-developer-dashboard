<style scoped>
.sticky-header {
  position: sticky;
  top: 0;
}

.container {
  width: 80vw;
}

.UI--c-kbgiPT-iehgGlf-css {
  background-color: #9cb5f9;
}

.step-notStarted {
  background-color: #afb8cc;
}

.step-finished {
  background-color: #673ab76e;
}


.UI--c-dhzjXW-iexswVt-css {
  align-items: center;
  justify-content: center;
}

.UI--c-kbgiPT-bUORwj-isFirst-true {
  padding: 0px 0.4rem 0px 0px;
  clip-path: polygon(75% 0%, 100% 50%, 75% 100%, 0% 100%, 0% 100%, 0% 0%);
}

.UI--c-kbgiPT {
  height: 100%;
  width: 4.8rem;
  clip-path: polygon(75% 0%, 100% 50%, 75% 100%, 0% 100%, 25% 50%, 0% 0%);
  margin-left: -0.9rem;
  padding: 0px 0.4rem 0px 0.8rem;
}

.UI--c-dhzjXW {
  display: flex;
}

.stepSpan {
  cursor: pointer;
  margin: 3px;
  padding: 0px;
  border: 0px;
  font: inherit;
  vertical-align: baseline;
  float: left
}

.step {
  height: 32px;
  width: 50px;
}

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

.datetime-picker {
  background-color: #fff;
  background-clip: content-box;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  padding: 0.375rem 0.75rem;
}

.linkdiv {
  background-clip: content-box;
  background-color: rgba(173, 232, 255, .5607843137254902);
  border-radius: 0.25rem;
  height: 50px;
  text-align: left;
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
</style>
<template>
  <div :class="isContainerShift ? 'homeShift' : 'home'">
    <loading :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></loading>

    <div class="row">
      <div class="col-md-12" style="text-align: left">
        <div class="form-group" style="display:flex">
          <h3 v-if="sessionList.length > 0" style="text-align: left;">
            Sessions</h3>
          <h3 v-else style="text-align: left;">No verification found!</h3>
        </div>
      </div>
    </div>

    <div class="row scrollit" v-if="sessionList.length > 0">
      <div class="col-md-12">
        <table class="table table-hover event-card" style="background:#FFFF">
          <thead class="thead-light">
            <tr>
              <th class="sticky-header">Date</th>
              <th class="sticky-header">Session Id</th>
              <th class="sticky-header">User Id</th>
              <th class="sticky-header">Steps</th>
              <th class="sticky-header">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in sessionList" v-bind:key="row._id" @click="viewSessionDetails(row.sessionId)"
              style="cursor: pointer">
              <td>
                {{ row.createdAt ? new Date(row.createdAt).toLocaleString('en-us') : "-" }}
              </td>
              <td>
                {{ row.sessionId ? row.sessionId : "-" }}
              </td>
              <td>
                {{ row.appUserId ? row.appUserId : "-" }}
              </td>
              <td>
                <span class="stepSpan" title="Start">
                  <div :class="{ 'step-finished': row.step_start == 1, 'step-notStarted': row.step_start == 0 }"
                    class="step UI--c-dhzjXW UI--c-dhzjXW-iexswVt-css UI--c-kbgiPT UI--c-kbgiPT-bUORwj-isFirst-true UI--c-kbgiPT-iehgGlf-css step">
                    <span class="fa-stack fa-sm">
                      <i class="fa fa-circle fa-stack-2x fa-inverse" style="color: #f4f3f39c;"></i>
                      <i class="fa fa-flag fa-stack-1x"></i>
                    </span>
                  </div>
                </span>
                <span class="stepSpan" title="Selfi" v-if="row.step_liveliness != null">
                  <div
                    :class="{ 'step-finished': row.step_liveliness == 1, 'step-notStarted': row.step_liveliness == 0 }"
                    class="step UI--c-dhzjXW UI--c-dhzjXW-iexswVt-css UI--c-kbgiPT UI--c-kbgiPT-ihMjrWH-css ">

                    <span class="fa-stack fa-sm">
                      <i class="fa fa-circle fa-stack-2x fa-inverse" style="color: #f4f3f39c;"></i>
                      <i class="fa fa-user fa-stack-1x"></i>
                    </span>

                  </div>


                </span>
                <span class="stepSpan" title="ID Document" v-if="row.step_ocrIdVerification != null">
                  <div
                    :class="{ 'step-finished': row.step_ocrIdVerification == 1, 'step-notStarted': row.step_ocrIdVerification == 0 }"
                    class="step UI--c-dhzjXW UI--c-dhzjXW-iexswVt-css UI--c-kbgiPT UI--c-kbgiPT-ihMjrWH-css ">
                    <span class="fa-stack fa-sm">
                      <i class="fa fa-circle fa-stack-2x fa-inverse" style="color: #f4f3f39c;"></i>
                      <i class="fa fa-address-card fa-stack-1x"></i>
                    </span>
                  </div>
                </span>

                <span class="stepSpan" title="Mint SBT" v-if="row.step_mintSbt != null">
                  <div :class="{ 'step-finished': row.step_mintSbt == 1, 'step-notStarted': row.step_mintSbt == 0 }"
                    class="step UI--c-dhzjXW UI--c-dhzjXW-iexswVt-css UI--c-kbgiPT UI--c-kbgiPT-ihMjrWH-css ">
                    <span class="fa-stack fa-sm">
                      <i class="fa fa-circle fa-stack-2x fa-inverse" style="color: #f4f3f39c;"></i>
                      <i class="fa fa-address-book fa-stack-1x"></i>
                    </span>
                  </div>
                </span>

                <span class="stepSpan" title="User Consent">
                  <div
                    :class="{ 'step-finished': row.step_userConsent == 1, 'step-notStarted': (row.step_userConsent == 0 || row.step_userConsent == null) }"
                    class="step UI--c-dhzjXW UI--c-dhzjXW-iexswVt-css UI--c-kbgiPT UI--c-kbgiPT-ijmsATZ-css ">
                    <span class="fa-stack fa-sm">
                      <i class="fa fa-circle fa-stack-2x fa-inverse" style="color: #f4f3f39c;"></i>
                      <i class="fa fa-thumbs-up fa-stack-1x"></i>
                    </span>
                  </div>
                </span>

                <span class="stepSpan" title="Finished">
                  <div :class="{ 'step-finished': row.step_finish == 1, 'step-notStarted': row.step_finish == 0 }"
                    class="step UI--c-dhzjXW UI--c-dhzjXW-iexswVt-css UI--c-kbgiPT UI--c-kbgiPT-ijmsATZ-css ">

                    <span class="fa-stack fa-sm">
                      <i class="fa fa-circle fa-stack-2x fa-inverse" style="color: #f4f3f39c;"></i>
                      <i class="fa fa-check fa-stack-1x"></i>
                    </span>

                  </div>
                </span>
              </td>
              <td>
                <span v-html="getStatus(row)"></span>
              </td>

            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import UtilsMixin from '../../mixins/utils';
import Loading from "vue-loading-overlay";
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";
export default {
  name: "SessionsPage",
  components: { Loading },
  computed: {
    ...mapGetters('mainStore', ['sessionList']),
    ...mapState({
      sessionList: state => state.mainStore.sessionList,
      containerShift: state => state.playgroundStore.containerShift,
    }),
    isContainerShift() {
      return this.containerShift
    }
  },
  data() {
    return {
      authToken: localStorage.getItem('authToken'),
      user: {},
      fullPage: true,
      isLoading: false,
    }
  },
  async created() {
    try {
      const usrStr = localStorage.getItem("user");
      this.user = JSON.parse(usrStr);
      this.updateSideNavStatus(true)

      // appId
      this.isLoading = true
      await this.fetchAppsUsersSessions({ appId: "" })
      this.isLoading = false

    } catch (e) {
      this.isLoading = false
      this.notifyErr(e)
      this.$router.push({ path: '/studio/dashboard' });
    }
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.prevRoute = from;
    });
  },
  methods: {
    ...mapActions('mainStore', ['fetchAppsUsersSessions']),
    ...mapMutations('playgroundStore', ['updateSideNavStatus', 'shiftContainer']),

    async viewSessionDetails(sessionId) {
      console.log(sessionId)
      this.$router.push({ name: "sessionDetails", params: { appId: this.$route.params.appId, sessionId } });
      this.shiftContainer(false);
    },
  },
  mixins: [UtilsMixin],

};
</script>
