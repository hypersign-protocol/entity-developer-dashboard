<style scoped>
/* ── Page Header ─────────────────────────────────────────── */
.page-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.page-subtitle {
  font-size: 0.8rem;
  color: #6b7280;
  margin: 2px 0 0 0;
}

/* ── Search bar ──────────────────────────────────────────── */
.search-wrap {
  display: flex;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  width: 300px;
}

.search-wrap input {
  flex: 1;
  border: none;
  padding: 8px 12px;
  font-size: 0.84rem;
  color: #374151;
  outline: none;
  background: transparent;
}

.search-wrap .search-btn {
  padding: 0 13px;
  background: #f8fafc;
  border-left: 1px solid #e2e8f0;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.search-wrap .search-btn:hover {
  background: #f1f5f9;
  color: #374151;
}

/* ── Table container ─────────────────────────────────────── */
.table-card {
  background-color: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.table-scroll {
  overflow-y: auto;
  max-height: 72vh;
}

/* ── Table ───────────────────────────────────────────────── */
.sessions-table {
  width: 100%;
  border-collapse: collapse;
}

.sessions-table thead th {
  position: sticky;
  top: 0;
  z-index: 1;
  background: #f9fafb;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #6b7280;
  padding: 10px 16px;
  border-bottom: 1px solid #e5e7eb;
  white-space: nowrap;
}

.sessions-table tbody tr {
  cursor: pointer;
  border-bottom: 1px solid #f3f4f6;
  transition: background 0.1s;
}

.sessions-table tbody tr:last-child {
  border-bottom: none;
}

.sessions-table tbody tr:hover {
  background: #f9fafb;
}

.sessions-table tbody td {
  padding: 12px 16px;
  vertical-align: middle;
  font-size: 0.83rem;
  color: #444;
}

/* ── User cell ───────────────────────────────────────────── */
.user-name {
  font-weight: 600;
  color: #111827;
  font-size: 0.85rem;
}

.user-id-text {
  font-size: 0.75rem;
  color: #9ca3af;
  margin-top: 2px;
  font-family: monospace;
}

/* ── Date cell ───────────────────────────────────────────── */
.date-primary {
  font-size: 0.82rem;
  color: #374151;
}

.date-secondary {
  font-size: 0.75rem;
  color: #9ca3af;
}

/* ── Steps ───────────────────────────────────────────────── */
.steps-row {
  display: flex;
  align-items: center;
}

.stepSpan {
  cursor: pointer;
  margin: 2px;
  padding: 0px;
  border: 0px;
  font: inherit;
  vertical-align: baseline;
}

.step {
  height: 28px;
  width: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.UI--c-kbgiPT-bUORwj-isFirst-true {
  
  padding: 0px 0.4rem 0px .7rem;
  clip-path: polygon(75% 0%, 100% 50%, 75% 100%, 0% 100%, 0% 100%, 0% 0%);
}

.UI--c-kbgiPT {
  height: 2rem;
  width: 3.6rem;
  clip-path: polygon(75% 0%, 100% 50%, 75% 100%, 0% 100%, 25% 50%, 0% 0%);
  margin-left: -0.8rem;
  padding: 0px .4rem 0px .7rem;
}

.UI--c-dhzjXW {
  display: flex;
}

.UI--c-dhzjXW-iexswVt-css {
  align-items: center;
  justify-content: center;
}

.step-notStarted { background-color: #e1e1e3; }
.step-failed     { background-color: rgba(252, 94, 94, 0.736); }
.step-finished   { background-color: #673ab76e; }

/* ── Attempts chip ───────────────────────────────────────── */
.attempts-chip {
  display: inline-block;
  min-width: 28px;
  text-align: center;
  background: #f3f4f6;
  border-radius: 20px;
  font-size: 0.78rem;
  font-weight: 600;
  color: #374151;
  padding: 2px 10px;
}
</style>

<template>
  <b-container fluid class="py-3" :class="isContainerShift ? 'homeShift' : 'home'">
    <loadIng :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></loadIng>

    <!-- Page Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h4 class="page-title">Users Verifications</h4>
        <p class="page-subtitle">Manage and track user verifications</p>
      </div>
      <div v-if="userList.length > 0" class="search-wrap">
        <input
          type="text"
          placeholder="Search by user ID or email"
          v-model="sessionIdTemp"
          @keyup.enter="viewSessionDetails(sessionIdTemp)"
        />
        <button class="search-btn" @click="viewSessionDetails(sessionIdTemp)">
          <i class="fa fa-search"></i>
        </button>
      </div>
    </div>

    <!-- Table -->
    <div v-if="userList.length > 0">
      <div class="table-card">
        <div class="table-scroll">
          <table class="sessions-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Started</th>
                <th>Completed</th>
                <th>Attempts</th>
                <th>Steps</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="row in userList"
                :key="row.userId"
                @click="viewSessionDetails(row.userId)"
              >
                <!-- User -->
                <td>
                  <div class="d-flex align-center">
                    <v-avatar :style="getAvatarStyle()" size="34" class="font-weight-bold mr-3">
                      {{ (row.name || row.email || row.userId || 'U').charAt(0).toUpperCase() }}
                    </v-avatar>
                    <div>
                      <div class="user-name">{{ row.name || row.email || 'Unnamed User' }}</div>
                      <div class="user-id-text">{{ row.userId ? stringShortner(row.userId, 30) : '-' }}</div>
                    </div>
                  </div>
                </td>

                <!-- Started -->
                <td>
                  <div class="date-primary">
                    {{ row.createdAt ? new Date(row.createdAt).toLocaleDateString('en-us', { day: 'numeric', month: 'short', year: 'numeric' }) : '-' }}
                  </div>
                  <div class="date-secondary">
                    {{ row.createdAt ? new Date(row.createdAt).toLocaleTimeString('en-us', { hour: '2-digit', minute: '2-digit' }) : '' }}
                  </div>
                </td>

                <!-- Completed -->
                <td>
                  <div class="date-primary">
                    {{ row.completedAt ? new Date(row.completedAt).toLocaleDateString('en-us', { day: 'numeric', month: 'short', year: 'numeric' }) : '-' }}
                  </div>
                  <div class="date-secondary">
                    {{ row.completedAt ? new Date(row.completedAt).toLocaleTimeString('en-us', { hour: '2-digit', minute: '2-digit' }) : '' }}
                  </div>
                </td>

                <!-- Attempts -->
                <td>
                  <span class="attempts-chip">{{ row.retries ? row.retries : 0 }}</span>
                </td>

                <!-- Steps -->
                <td>
                  <div class="steps-row">
                    <span class="stepSpan" v-for="(step, idx) in filteredSteps(row)" :key="step.field" :title="step.title">
                      <div
                        class="step UI--c-dhzjXW UI--c-dhzjXW-iexswVt-css UI--c-kbgiPT"
                        :class="[
                          idx === 0 ? 'UI--c-kbgiPT-bUORwj-isFirst-true' : '',
                          row[step.field] == 1 && !(row.status === 'Failed' && row.failureInfo && row.failureInfo.failureStep === step.field) ? 'step-finished' : '',
                          row.status === 'Failed' && row.failureInfo && row.failureInfo.failureStep === step.field ? 'step-failed' : '',
                          row[step.field] == 0 ? 'step-notStarted' : ''
                        ]"
                      >
                        <span class="fa-stack fa-sm">
                          <i class="fa fa-circle fa-stack-2x fa-inverse" style="color: #f4f3f39c;"></i>
                          <i :class="'fa ' + step.icon + ' fa-stack-1x'"></i>
                        </span>
                      </div>
                    </span>
                  </div>
                </td>

                <!-- Status -->
                <td>
                  <div class="d-flex align-center" style="gap: 4px;">
                    <span v-html="getUserStatus(row.status)"></span>
                    <v-tooltip bottom v-if="row.status === 'Failed'">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon v-bind="attrs" v-on="on" small color="red darken-1">mdi-alert-circle-outline</v-icon>
                      </template>
                      <span>{{ getFailureReason(row.failureInfo && row.failureInfo.failureReason, row.failureInfo && row.failureInfo.failureStep) }}</span>
                    </v-tooltip>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination -->
      <div class="d-flex justify-content-center mt-3">
        <PagiNation :pagesCount="pages" @event-page-number="handleGetPageNumberEvent" />
      </div>
    </div>

    <div v-else-if="!hasPermission" style="text-align: left;">
      <hf-upgrade-plan></hf-upgrade-plan>
    </div>
    <div v-else>
      <empty-container title="No User Found" icon="fa fa-users" />
    </div>
  </b-container>
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
    ...mapGetters('mainStore', ['getUserDetails']),
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
        { text: 'USER ID', value: 'userId' },
        { text: 'START DATE', value: 'start_date' },
        { text: 'END DATE', value: 'end_date' },
        { text: 'ATTEMPTS', value: 'attempts' },
        { text: 'STEPS', value: 'steps' },
        { text: 'STATUS', value: 'status' },
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
      isProd: false,
    }
  },
  async created() {
    try {
      this.isProd = this.getSelectedService && this.getSelectedService.env === 'prod' ? true: false;
      this.user = this.getUserDetails;
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

    } catch (e) {
      this.isLoading = false
      this.notifyErr(e.message || 'An error occurred while fetching users.')
      setTimeout(() => {
        this.$router.push({ path: '/studio/dashboard' });
      }, 1000)
      
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
    handleEnvironmentChange() {
      this.fetchsession({ appId: "", page: this.currentPage, limit: this.pageLimit, env: this.isProd ? 'prod' : 'dev' });
    },
  },
  mixins: [UtilsMixin],

};
</script>
