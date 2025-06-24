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
.custom-active {
  background-color: #e0e0e0 !important;
  color: #000 !important;
}


::v-deep(.dropdown-item.custom-active:hover) {
  background-color: #cfcfcf !important;
  color: #000 !important;
}

::v-deep(.dropdown-item:hover) {
  background-color: #f0f0f0 !important;
  color: #000 !important;
}
</style>
<template>
  <div :class="isContainerShift ? 'homeShift' : 'home'">
    <loading :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></loading>

    <div class="">
      <div class="" style="text-align: left">
        <div class="row" v-if="sessionList.length > 0" style="text-align: left;">
          <div class="col-md-8">
            <h3>Sessions</h3>
          </div>
          <div class="col-md-4">
            <div class="input-group mb-3">
              <input type="text" class="form-control" placeholder="Search by session Id or user Id"
                aria-label="Search by session Id or user Id" aria-describedby="basic-addon2" v-model="sessionIdTemp" @keyup.enter="filterSessions(sessionIdTemp)">
              <div class="input-group-append" style="cursor: grab;">
                <span class="input-group-text" id="basic-addon2" @click="filterSessions(sessionIdTemp)"><i
                    class="fa fa-search" aria-hidden="true"></i></span>
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="!hasPermission" style="text-align: left;">
          <hf-upgrade-plan></hf-upgrade-plan>
        </div>

        <!-- <div v-else style="text-align: left;">
          <h3>No session found!</h3>
        </div> -->
      </div>
    </div>

    <div class="scrollit" >
      <div class="">
        <table class="table table-hover event-card" style="background:#FFFF">
          <thead class="thead-light">
            <tr>
              <th class="sticky-header">Date</th>
              <th class="sticky-header">Session Id</th>
              <th class="sticky-header">User Id (Hash)</th>
              <th class="sticky-header">Steps</th>
              <th class="sticky-header">
                Status
              <b-dropdown
                size="sm"
                variant="light"
                toggle-class="p-1 ml-2"
                menu-class="dropDownPopup"
                no-caret
                right
              >
              <template #button-content>
                <i class="fa fa-filter text-muted"></i>
              </template>

              <b-dropdown-item   :class="{ 'custom-active':selectedSessionStatus === 'All'}" @click="handleSessionFilter('')">All</b-dropdown-item>
              <b-dropdown-item :class="{ 'custom-active': selectedSessionStatus === 'Pending' }"  @click="handleSessionFilter('Pending')">In Progress</b-dropdown-item>
              <b-dropdown-item :class="{ 'custom-active':selectedSessionStatus === 'Success'}" @click="handleSessionFilter('Success')">Completed</b-dropdown-item>
              <b-dropdown-item :class="{ 'custom-active':selectedSessionStatus === 'Expired'}" @click="handleSessionFilter('Expired')">Expired</b-dropdown-item>
              <b-dropdown-item :class="{ 'custom-active':selectedSessionStatus === 'Failed'}" @click="handleSessionFilter('Failed')">Failed</b-dropdown-item>
            </b-dropdown>
            </th>
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
                {{ row.appUserId ? stringShortner(row.appUserId, 32) : "-" }}
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

    <div class="row mt-2" v-if="sessionList.length > 0">
      <div class="col-md-12 d-flex justify-content-center align-items-center">
        <PagiNation pagesCount="5" @event-page-number="handleGetPageNumberEvent" />
      </div>
    </div>
  </div>
</template>

<script>
import UtilsMixin from '../../mixins/utils';
import Loading from "vue-loading-overlay";
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";
import PagiNation from '../../components/Pagination.vue';
export default {
  name: "SessionsPage",
  components: { Loading, PagiNation },
  computed: {
    ...mapGetters('mainStore', ['sessionList', 'getUserAccessList']),
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
      sessionIdTemp: null,
      hasPermission: false,
      selectedSessionStatus: 'All',
      currentPage: 1
    }
  },
  async created() {
    try {
      const usrStr = localStorage.getItem("user");
      this.user = JSON.parse(usrStr);
      this.updateSideNavStatus(true)



      // appId
      this.isLoading = true
      this.checkIfHasPermission()
      if (this.hasPermission) {
        await this.fetchAppsUsersSessions({ appId: "" })
      }
      this.isLoading = false


      const storedStatus = localStorage.getItem('selectedSessionStatus');
      this.selectedSessionStatus = storedStatus  ? storedStatus : '';
      this.currentPage = localStorage.getItem('selectedPage');
      this.handleSessionFilter(this.selectedSessionStatus);
      
      

    } catch (e) {
      this.isLoading = false
      this.notifyErr(e)
      this.$router.push({ path: '/studio/dashboard' });
    }
  },
  beforeRouteEnter(to, from, next) {
    //  localStorage.removeItem('selectedSessionStatus');
    next((vm) => {
      vm.prevRoute = from;
    });
  },
  methods: {
    ...mapActions('mainStore', ['fetchAppsUsersSessions']),
    ...mapMutations('playgroundStore', ['updateSideNavStatus', 'shiftContainer']),

    checkIfHasPermission() {
      const accessList = this.getUserAccessList("CAVACH_API");
      if (accessList && accessList.length > 0) {
        /// Either he should have ALL access
        const allAccess = accessList.find((x) => x.access == "ALL");
        if (!allAccess) {

          // Or he should have READ_SESSION access
          const readSessionAccess = accessList.find(
            (x) => x.access == "READ_SESSION"
          );
          if (!readSessionAccess) {
            this.hasPermission = false
            return this.notifyErr(
              "You do not have access to KYC dashboard, kindly contact the Hypersign Team"
            );
          } else {
            this.hasPermission = true
          }
        } else {
          this.hasPermission = true
        }
      } else {
        this.hasPermission = false
        return this.notifyErr(
          "You do not have access to KYC dashboard, kindly contact the admin"
        );
      }
      this.hasPermission = true;
    },

    async handleGetPageNumberEvent(pageNumber) {
      try {
        this.isLoading = true
        this.currentPage = pageNumber;
        const status = this.selectedSessionStatus ? (this.selectedSessionStatus == 'All' ? '' : this.selectedSessionStatus) : '';
        localStorage.setItem('selectedPage', this.currentPage);
        await this.fetchAppsUsersSessions({ appId: "", page: pageNumber, status })
        this.isLoading = false
      } catch (e) {
        this.isLoading = false
        this.notifyErr(e)
      }
    },
    async handleSessionFilter(status){
      try{
        this.isLoading = true
        this.selectedSessionStatus = status || 'All';
        localStorage.setItem('selectedSessionStatus', status);
        localStorage.setItem('selectedPage', this.currentPage);
        await this.fetchAppsUsersSessions({ appId: "", page: this.currentPage, status: status })
        this.isLoading = false
      } catch (e) {
        this.isLoading = false
        this.notifyErr(e)
      }
    },
    async filterSessions(filterText) {
      try {
        if (filterText) {
          const filter = {

          }
          if (filterText.split('-').length >= 5) {// UUID sessions
            filter.sessionIds = filterText
          } else {
            filter.userId = filterText
          }

          this.isLoading = true
          await this.fetchAppsUsersSessions({ appId: "", ...filter })
          this.isLoading = false
        }

      } catch (e) {
        this.isLoading = false
        this.notifyErr(e)
      }
    },

    async viewSessionDetails(sessionId) {
      if (!sessionId) {
        return this.notifyErr('Session Id is required')
      }
      this.$router.push({ name: "sessionDetails", params: { appId: this.$route.params.appId, sessionId: sessionId.trim() } });
      this.shiftContainer(false);
      this.sessionIdTemp = null
    },
  },
  mixins: [UtilsMixin],

};
</script>
