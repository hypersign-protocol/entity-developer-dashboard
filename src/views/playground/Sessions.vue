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
  background-color: #e1e1e3;
}

.step-failed {
  background-color: rgba(252, 94, 94, 0.736);
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
  height: 800px;
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

.overview-card {
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.overview-value {
  font-size: 38px;
  font-weight: 700;
  color: #212121;
}

.overview-title {
  font-size: 14px;
  color: #757575;
  margin-top: 6px;
}

.v-tooltip__content {
  font-size: 12px;
  max-width: 200px;
  text-align: center;
}

.steps-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 1px;
}


.user-avatar {
  background-color: #888;
  /* or your theme color */
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
<template>
  <div :class="isContainerShift ? 'homeShift' : 'home'">
    <loadIng :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></loadIng>

    <!-- <v-row class="mb-0" dense>
      <v-col v-for="(value, key) in overviewData" :key="key" cols="12" sm="6" md="3">
        <v-card class="overview-card" outlined>
          <v-card-text class="text-center pa-4">
            <div class="overview-value mb-3">
              {{ formatNumber(value) }}<span v-if="isPercentageKey(key)">%</span>
            </div>
            <div class="overview-title-wrapper">
              <span class="overview-title">
                {{ formatKey(key) }}
              </span>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon v-bind="attrs" v-on="on" small color="grey darken-1" class="ml-1">
                    mdi-information
                  </v-icon>
                </template>
<span>{{ getTooltipText(key) }}</span>
</v-tooltip>
</div>
</v-card-text>
</v-card>
</v-col>
</v-row> -->

    <v-row class="mb-0">
      <v-col cols="12">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h3 class="mb-0">Users Verifications</h3>

          <div class="d-flex align-items-center">
            <div class="d-flex align-items-center mr-3">
              <b-form-checkbox v-model="isProd" switch size="sm"
                @change="handleEnvironmentChange">Prod</b-form-checkbox>
            </div>

            <div class="input-group" style="width: 350px;" v-if="userList.length > 0">
              <input type="text" class="form-control" placeholder="Search by user Id or email"
                aria-label="Search by user Id" aria-describedby="basic-addon2" v-model="sessionIdTemp"
                @keyup.enter="viewSessionDetails(sessionIdTemp)">
              <div class="input-group-append" style="cursor: pointer;">
                <span class="input-group-text" id="basic-addon2" @click="viewSessionDetails(sessionIdTemp)">
                  <i class="fa fa-search" aria-hidden="true"></i>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="userList.length > 0">
          <div class="scrollit">
            <div class="card">
              <table class="table table-hover">
                <thead class="thead-light">
                  <tr>
                    <th class="sticky-header" v-for="header in headers" v-bind:key="header.value">
                      {{ header.text }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="row in userList" v-bind:key="row.userId" style="cursor: pointer"
                    @click="viewSessionDetails(row.userId)">
                    <td>
                      <div class="d-flex align-center">
                        <v-avatar :style="getAvatarStyle()" size="37" class="font-weight-bold">
                          {{ (row.name || row.email || row.userId || 'U').charAt(0).toUpperCase() }}
                        </v-avatar>
                        <div class="ml-3 d-flex flex-column justify-center" style="line-height: 1.2;">
                          <span class="font-weight-bold" v-if="row.email || row.name">
                            {{ row.name || row.email || 'Unnamed User' }}
                          </span>
                          <span style="color: grey; font-size: 12px;" class="mt-1">
                            {{ row.userId ? stringShortner(row.userId, 28) : '-' }}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      {{ row.createdAt ? new Date(row.createdAt).toLocaleString('en-us') : "-" }}
                    </td>
                    <td>
                      {{ row.completedAt ? new Date(row.completedAt).toLocaleString('en-us') : "-" }}
                    </td>
                    <td>
                      {{ row.retries ? row.retries : 0 }}
                    </td>
                    <td>
                      <div class="steps-wrapper">
                        <span class="stepSpan" v-for="step in filteredSteps(row)" :key="step.field" :title="step.title">
                          <div
                            class="step step UI--c-dhzjXW UI--c-dhzjXW-iexswVt-css UI--c-kbgiPT UI--c-kbgiPT-ihMjrWH-css"
                            :class="{
                              'step-finished': row[step.field] == 1,
                              'step-notStarted': row[step.field] == 0,
                              'step-failed': row.status === 'Failed' && step.field === row.failureInfo?.failureStep
                            }">
                            <span class="fa-stack fa-sm">
                              <i class="fa fa-circle fa-stack-2x fa-inverse" style="color: #f4f3f39c;"></i>
                              <i :class="'fa ' + step.icon + ' fa-stack-1x'"></i>
                            </span>
                          </div>
                        </span>
                      </div>
                    </td>
                    <td>
                      <span v-html="getUserStatus(row.status)"></span>
                      <span v-if="row.status == 'Failed'">
                        <span></span>
                        <span>
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                              <v-icon v-bind="attrs" v-on="on" small color="red darken-1" class="ml-1"
                                style="color:red">
                                mdi-alert-circle-outline
                              </v-icon>
                            </template>
                            <span>{{ getFailureReason(row.failureInfo?.failureReason, row.failureInfo?.failureStep)
                              }}</span>

                          </v-tooltip>
                        </span>
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="row mt-2">
            <div class="col-md-12 d-flex justify-content-center align-items-center">
              <PagiNation :pagesCount="pages" @event-page-number="handleGetPageNumberEvent" />
            </div>
          </div>
        </div>
        <div v-else-if="!hasPermission" style="text-align: left;">
          <hf-upgrade-plan></hf-upgrade-plan>
        </div>
        <div v-else>
          <empty-container title="No User Found" icon="fa fa-users" />
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import UtilsMixin from '../../mixins/utils';
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";
import PagiNation from '../../components/Pagination.vue';
import Config from "../../config"
export default {
  name: "SessionsPage",
  components: { PagiNation },
  computed: {
    ...mapGetters('mainStore', ['userList', 'getUserAccessList', 'getSelectedService']),
    ...mapState({
      totalUserCount: state => state.mainStore.totalUserCount,
      userList: state => state.mainStore.userList,
      containerShift: state => state.playgroundStore.containerShift,
    }),
    isContainerShift() {
      return this.containerShift
    },
    pages() {
      return Math.ceil(parseInt(this.totalUserCount) / this.pageLimit);
    },
  },
  data() {
    return {
      allSteps: [
        { field: 'step_start', icon: 'fa-flag', title: 'Started' },
        { field: 'step_liveliness', icon: 'fa-user', title: 'Liveliness Check' },
        { field: 'step_ocrIdVerification', icon: 'fa-address-card', title: 'Document Verification' },
        { field: 'step_mintSbt', icon: 'fa-address-book', title: 'Mint SBT' },
        { field: 'step_userConsent', icon: 'fa-thumbs-up', title: 'User Consent' },
        { field: 'step_finish', icon: 'fa-check', title: 'Finished' },
      ],
      overviewData: {
        totalVerifications: 1000,
        completionRate: 80,
        successRate: 40,
        dropOfRate: 0.5,
        // avgSessionPerUser: 2,
      },

      // Table column headers
      headers: [
        { text: 'User ID', value: 'userId' },
        { text: 'Start Date', value: 'start_date' },
        { text: 'End Date', value: 'end_date' },
        { text: 'Attempts', value: 'attempts' },
        { text: 'Steps', value: 'steps' },
        { text: 'Status', value: 'status' },
      ],

      authToken: localStorage.getItem('authToken'),
      user: {},
      fullPage: true,
      isLoading: false,
      sessionIdTemp: null,
      hasPermission: false,
      selectedSessionStatus: 'All',
      currentPage: 1,
      pageLimit: 50,
      isProd: true,
    }
  },
  async created() {
    try {
      this.prod = this.getSelectedService & this.getSelectedService.env === 'prod' ? true :false;
      const usrStr = localStorage.getItem("user");
      this.user = JSON.parse(usrStr);
      this.updateSideNavStatus(true)

      // appId
      this.isLoading = true
      this.checkIfHasPermission()
      if (this.hasPermission) {
        await this.fetchsession({ appId: "", env: this.getSelectedService.env })
      }
      this.isLoading = false


      const storedStatus = localStorage.getItem('selectedSessionStatus');
      this.selectedSessionStatus = storedStatus ? storedStatus : '';
      this.currentPage = localStorage.getItem('selectedPage') || 1;
      this.handleSessionFilter(this.selectedSessionStatus);

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
    ...mapActions('mainStore', ['fetchAppsUsers']),
    ...mapMutations('playgroundStore', ['updateSideNavStatus', 'shiftContainer']),
    filteredSteps(row) {
      return this.allSteps.filter(step => row[step.field] !== null && row[step.field] !== undefined);
    },
    getFailureReason(errorCode, errorType = 'step_liveliness') {
      if (errorType == 'step_liveliness') {
        return Config['LivelinessError'][errorCode] || 'Unknown error';
      }

      if (errorType == 'step_ocrIdVerification') {
        return Config['FaicalAuthenticationError'][errorCode] || 'Unknown error';
      }
    },
    getAvatarStyle() {
      // const colors = ['#607d8b', '#3f51b5', '#009688', '#ff5722', '#795548', '#673ab7', '#e91e63'];
      const colors = ['#b0bec5', '#9fa8da', '#80cbc4', '#ffab91', '#bcaaa4', '#b39ddb', '#f48fb1'];
      const seed = Math.floor(Math.random() * colors.length);
      const color = colors[seed % colors.length];
      return {
        backgroundColor: color,
        color: 'white'
      };
    },
    getTooltipText(key) {
      const descriptions = {
        totalVerifications: 'Total number of user verification attempts (UVAs).',
        completionRate: 'Percentage of verifications that reached the final step.',
        successRate: 'Percentage of verifications that were successful (verified).',
        dropOfRate: 'Percentage of sessions that expired or were abandoned.',
        avgSessionPerUser: 'Average number of verification attempts per user.',
      };
      return descriptions[key] || 'Metric description not available.';
    },
    formatNumber(val) {
      return typeof val === 'number' ? val.toLocaleString() : val;
    },
    formatKey(key) {
      const map = {
        totalVerifications: 'Total User Verifications Attempts',
        completionRate: 'Completion Rate',
        successRate: 'Success Rate',
        dropOfRate: 'Drop-off Rate',
        // avgSessionPerUser: 'Avg Session per User',
      };
      return map[key] || key;
    },
    isPercentageKey(key) {
      return ['completionRate', 'successRate', 'dropOfRate'].includes(key);
    },
    checkIfHasPermission() {
      this.hasPermission = true;
    },

    async fetchsession(filter) {
      const t = await this.fetchAppsUsers(filter)
      if (t && t.length == 0) {
        localStorage.setItem('selectedSessionStatus', 'All');
        localStorage.setItem('selectedPage', 1);
        // this.fetchAppsUsers({ appId: "" })
      }
    },


    async viewSessionDetails(sessionId) {
      const env = this.isProd ? 'prod' : 'dev'

      if (!sessionId) {
        return this.notifyErr('User Id or Email  is required')
      }

      if (this.isValidEmail(sessionId.trim())) {
        sessionId = await this.generateSHA256Hash(sessionId)
      }

      this.$router.push({ name: "sessionDetails", params: { appId: this.$route.params.appId, sessionId: sessionId.trim(), env } });
      this.shiftContainer(false);
      this.sessionIdTemp = null
    },

    handleGetPageNumberEvent(pageNumber) {
      this.currentPage = pageNumber;
      localStorage.setItem('selectedPage', pageNumber);
      this.fetchsession({ appId: "", env: this.isProd ? 'prod' : 'dev' });
    },
    async handleSessionFilter(status) {
      try {
        console.log({ status })
        this.isLoading = true
        this.isLoading = false
      } catch (e) {
        this.isLoading = false
        this.notifyErr(e)
      }
    },
    handleEnvironmentChange() {
      this.fetchsession({ appId: "", page: this.currentPage, limit: this.pageLimit, env: this.isProd ? 'prod' : 'dev' });
    },
  },
  mixins: [UtilsMixin],

};
</script>
