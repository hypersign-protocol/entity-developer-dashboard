<style scoped>
.sticky-header {
  position: sticky;
  top: 0;
}

.container {
  max-width: 1446px;
}

.UI--c-kbgiPT-iehgGlf-css {
  background-color: #9cb5f9;
}

.step-notStarted {
  background-color: #afb8cc;
}

.step-finished {
  background-color: #9cb5f9;
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
          <h3 v-if="sessionList.length > 0" class="mt-4" style="text-align: left;">
            Verifications</h3>
          <h3 v-else class="mt-4" style="text-align: left;">No verification found!</h3>
        </div>
      </div>
    </div>


    <div class="row scrollit" style="margin-top: 2%;" v-if="sessionList.length > 0">
      <div class="col-md-12">
        <table class="table table-hover event-card" style="background:#FFFF">
          <thead class="thead-light">
            <tr>
              <th class="sticky-header">Date</th>
              <th class="sticky-header">Session Id</th>
              <th class="sticky-header">User Id</th>
              <th class="sticky-header">Steps</th>
              <th class="sticky-header">Status</th>
              <th class="sticky-header">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in sessionList" v-bind:key="row._id"  @click="viewSessionDetails(row.sessionId)" style="cursor: pointer">
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
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor"
                      viewBox="0 0 256 256" style="min-width: 1.8rem;">
                      <rect width="256" height="256" fill="none"></rect>
                      <line x1="40" y1="216" x2="40" y2="48" fill="none" stroke="currentColor" stroke-linecap="round"
                        stroke-linejoin="round" stroke-width="16"></line>
                      <path d="M40,168c64-48,112,48,176,0V48C152,96,104,0,40,48" fill="none" stroke="currentColor"
                        stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></path>
                    </svg>
                  </div>
                </span>
                <span class="stepSpan" title="Selfi">
                  <div
                    :class="{ 'step-finished': row.step_liveliness == 1, 'step-notStarted': row.step_liveliness == 0 }"
                    class="step UI--c-dhzjXW UI--c-dhzjXW-iexswVt-css UI--c-kbgiPT UI--c-kbgiPT-ihMjrWH-css "><svg
                      xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor"
                      viewBox="0 0 256 256" style="min-width: 1.8rem;">
                      <rect width="256" height="256" fill="none"></rect>
                      <circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-linecap="round"
                        stroke-linejoin="round" stroke-width="16"></circle>
                      <circle cx="128" cy="120" r="40" fill="none" stroke="currentColor" stroke-linecap="round"
                        stroke-linejoin="round" stroke-width="16"></circle>
                      <path d="M63.8,199.4a72,72,0,0,1,128.4,0" fill="none" stroke="currentColor" stroke-linecap="round"
                        stroke-linejoin="round" stroke-width="16"></path>
                    </svg></div>
                </span>


                <span class="stepSpan" title="ID Document">
                  <div
                    :class="{ 'step-finished': row.step_ocrIdVerification == 1, 'step-notStarted': row.step_ocrIdVerification == 0 }"
                    class="step UI--c-dhzjXW UI--c-dhzjXW-iexswVt-css UI--c-kbgiPT UI--c-kbgiPT-ihMjrWH-css "><svg
                      xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor"
                      viewBox="0 0 256 256" style="min-width: 1.8rem;">
                      <rect width="256" height="256" fill="none"></rect>
                      <circle cx="104" cy="144" r="32" fill="none" stroke="currentColor" stroke-linecap="round"
                        stroke-linejoin="round" stroke-width="16"></circle>
                      <path
                        d="M53.4,208a56,56,0,0,1,101.2,0H216a8,8,0,0,0,8-8V56a8,8,0,0,0-8-8H40a8,8,0,0,0-8,8V200a8,8,0,0,0,8,8Z"
                        fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                        stroke-width="16"></path>
                      <polyline points="176 176 192 176 192 80 64 80 64 96" fill="none" stroke="currentColor"
                        stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></polyline>
                    </svg></div>
                </span>

                <span class="stepSpan" title="Finished">
                  <div :class="{ 'step-finished': row.step_finish == 1, 'step-notStarted': row.step_finish == 0 }"
                    class="step UI--c-dhzjXW UI--c-dhzjXW-iexswVt-css UI--c-kbgiPT UI--c-kbgiPT-ijmsATZ-css "><svg
                      xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor"
                      viewBox="0 0 256 256" style="min-width: 1.8rem;">
                      <rect width="256" height="256" fill="none"></rect>
                      <path
                        d="M40,114.7V56a8,8,0,0,1,8-8H208a8,8,0,0,1,8,8v58.7c0,84-71.3,111.8-85.5,116.5a7.2,7.2,0,0,1-5,0C111.3,226.5,40,198.7,40,114.7Z"
                        fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                        stroke-width="16"></path>
                      <polyline points="172 104 113.3 160 84 132" fill="none" stroke="currentColor"
                        stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></polyline>
                    </svg></div>
                </span>
              </td>
              <td>
                <span style="color:green" v-if="row.step_finish == 1"><i class="fa fa-thumbs-up" aria-hidden="true"></i>
                  Success</span>
                <span style="color:red" v-else><i class="fa fa-thumbs-down" aria-hidden="true"></i>Expired</span>
              </td>
              <td>
                <span style="cursor: pointer;" @click="viewSessionDetails(row.sessionId)" title="View"><i
                    class="fa fa-eye" aria-hidden="true"></i></span>
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
    try{
      const usrStr = localStorage.getItem("user");
      this.user = JSON.parse(usrStr);
      this.updateSideNavStatus(true)

      // appId
      this.isLoading = true
      await this.fetchAppsUsersSessions({ appId: "" })
      this.isLoading = false
    }catch(e){
      this.isLoading = false
      this.notifyErr(e)
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
