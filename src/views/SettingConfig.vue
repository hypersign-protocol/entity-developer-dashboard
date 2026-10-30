<template>
  <div class="settings-page">
    <template v-if="isFeatureImplemented">
      <header class="app-page-header">
        <button
          type="button"
          class="page-back-button"
          :aria-label="backButtonLabel"
          :title="backButtonLabel"
          @click="goBack"
        >
          <i class="mdi mdi-arrow-left" aria-hidden="true"></i>
        </button>
        <h1 class="app-page-title">Settings</h1>
        <p class="app-page-subtitle">Manage your profile, team members, invitations and workspace access.</p>
      </header>

      <nav class="config-tabs" aria-label="Settings sections">
        <button
          v-for="tab in visibleTabs"
          :key="tab.value"
          type="button"
          :class="{ active: activeMainTab === tab.value }"
          @click="selectTab(tab.value)"
        >
          {{ tab.label }}
        </button>
      </nav>

      <div class="settings-content">
        <!-- v-show keeps every section mounted, as the previous b-tabs did -->
        <section v-show="activeMainTab === 'profile'">
          <UserProfile />
        </section>

        <section v-show="activeMainTab === 'members'">
          <div class="sub-tabs" role="tablist" aria-label="Members and roles sections">
            <button
              v-for="sub in memberSubTabs"
              :key="sub.value"
              type="button"
              :class="{ active: activeMembersSubTab === sub.value }"
              @click="selectTab('members', sub.value)"
            >
              {{ sub.label }}
            </button>
          </div>
          <TeamMembers v-show="activeMembersSubTab === 'members'" />
          <AdminTeams v-show="activeMembersSubTab === 'roles'" />
          <LiveAccessStatus v-show="activeMembersSubTab === 'live-access'" />
        </section>

        <section v-show="activeMainTab === 'invitions'">
          <MyInvitions />
        </section>

        <section v-show="activeMainTab === 'ssi'">
          <OnlySSIApps />
        </section>

        <section v-if="isSuperAdminUser" v-show="activeMainTab === 'super-admin'">
          <div class="sub-tabs" role="tablist" aria-label="Super admin tools">
            <button
              v-for="sub in superAdminSubTabs"
              :key="sub.value"
              type="button"
              :class="{ active: activeSuperAdminSubTab === sub.value }"
              @click="selectTab('super-admin', sub.value)"
            >
              {{ sub.label }}
            </button>
          </div>
          <ApproveCustomerOnboarding v-show="activeSuperAdminSubTab === 'onboarding'" />
          <CreditRecharge v-show="activeSuperAdminSubTab === 'credit-recharge'" />
          <ComplianceCheck v-show="activeSuperAdminSubTab === 'kyb-compliance'" />
        </section>
      </div>
    </template>

    <div v-else>
      <hf-feature-soon></hf-feature-soon>
    </div>
  </div>
</template>

<style scoped>
/* Same page header and tab bar as the App configuration page */
.settings-page { padding: 16px 15px 64px; color: #273448; background: #fff; }
.page-back-button { position: absolute; top: -1px; left: -40px; display: inline-flex; width: 32px; height: 32px; align-items: center; justify-content: center; padding: 0; border: 0; border-radius: 6px; background: transparent; color: #53657d; }
.page-back-button:hover { background: #f1f5f9; color: #2563dc; }
.page-back-button:focus-visible { outline: 2px solid #2563dc; outline-offset: 2px; }
.page-back-button i { font-size: 18px; line-height: 1; }
.app-page-header { position: relative; margin-bottom: 24px; }
.app-page-title { margin: 0 0 4px; color: #263244; font-size: 24px; font-weight: 700; letter-spacing: -.02em; line-height: 1.25; }
.app-page-subtitle { margin: 0; color: #718198; font-size: 13px; line-height: 1.45; }

.config-tabs { display: flex; gap: 31px; border-bottom: 1px solid #dce4ed; }
.config-tabs button { padding: 12px 2px; border: 0; border-bottom: 2px solid transparent; background: transparent; color: #5e6d82; font-size: 13px; font-weight: 700; white-space: nowrap; }
.config-tabs button:hover { color: #263244; }
.config-tabs button.active { border-color: #2563dc; color: #2563dc; }

.settings-content { margin-top: 24px; }

/* Secondary tabs: same segmented style as the Environment toggle */
.sub-tabs { display: inline-flex; flex-wrap: wrap; gap: 2px; margin-bottom: 20px; padding: 4px; border: 1px solid #d8e0ea; border-radius: 9px; background: #edf2f7; }
.sub-tabs button { min-width: 126px; height: 34px; padding: 0 14px; border: 1px solid transparent; border-radius: 6px; background: transparent; color: #64748b; font-size: 12px; font-weight: 700; }
.sub-tabs button:hover:not(.active) { color: #344054; }
.sub-tabs button.active { border-color: #c7d5e8; background: #fff; color: #2563dc; box-shadow: 0 1px 3px rgba(15,23,42,.08); }

@media (max-width: 650px) {
  .page-back-button { right: 0; left: auto; }
  .config-tabs { gap: 16px; overflow-x: auto; }
  .sub-tabs { display: flex; }
  .sub-tabs button { min-width: 0; flex: 1 1 auto; }
}
</style>

<script>
import TeamMembers from '../components/teams/TeamMembers.vue';
import MyInvitions from '../components/teams/MyInvitions.vue';
import AdminTeams from '../components/teams/AdminTeams.vue';
import LiveAccessStatus from '../components/teams/LiveAccessStatus.vue';
import { mapMutations, mapGetters } from "vuex";
import OnlySSIApps from '../components/settings/OnlySSIApps.vue';
import UserProfile from '../components/settings/UserProfile.vue';
import { mapActions } from 'vuex/dist/vuex.common.js';
import ApproveCustomerOnboarding from './sa/components/ApproveCustomerOnboarding.vue'
import CreditRecharge from './sa/components/CreditRecharge.vue'
import ComplianceCheck from './sa/components/ComplianceCheck.vue';



export default {
  name: "SettingConfig",
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // Keep the return target stable while query-backed settings tabs change.
      if (from.name && from.name !== to.name) vm.returnRoute = from.fullPath;
    });
  },
  components: {
    TeamMembers,
    AdminTeams,
    LiveAccessStatus,
    MyInvitions,
    UserProfile,
    OnlySSIApps,    
    ApproveCustomerOnboarding,
    CreditRecharge,
    ComplianceCheck
  },
  computed: {
    ...mapGetters('mainStore', ['getAuthToken', 'getUserDetails']),
    isSuperAdminUser() {
      return this.getUserDetails?.role === "SUPER_ADMIN";
    },
    visibleTabs() {
      return this.tabs.filter(tab => !tab.superAdminOnly || this.isSuperAdminUser);
    },
    backButtonLabel() {
      return this.returnRoute ? 'Back' : 'Back to dashboard';
    },
  },
  data() {
    return {
      isFeatureImplemented: true,
      tabs: [
        { value: 'profile', label: 'Profile' },
        { value: 'members', label: 'Members & roles' },
        { value: 'invitions', label: 'My invitations' },
        { value: 'ssi', label: 'SSI' },
        { value: 'super-admin', label: 'Super admin tools', superAdminOnly: true },
      ],
      memberSubTabs: [
        { value: 'members', label: 'All members' },
        { value: 'roles', label: 'Roles & permissions' },
        { value: 'live-access', label: 'Live access' },
      ],
      superAdminSubTabs: [
        { value: 'onboarding', label: 'Approve onboarding' },
        { value: 'credit-recharge', label: 'Credit recharge' },
        { value: 'kyb-compliance', label: 'KYB compliance' },
      ],
      activeMainTab: 'profile', // Default to Profile tab
      activeMembersSubTab: 'members',
      activeSuperAdminSubTab: 'onboarding',
      returnRoute: null,
      sentInvitiationCode: ""
    };
  },
  watch: {
    '$route.query.ref'(ref) {
      this.applyRouteRef(ref);
    }
  },
  methods: {
    ...mapMutations("mainStore", ["setMainSideNavBar"]),
    ...mapActions('mainStore', ['getMyRolesAction', 'getPeopleMembers',]),
    // ?ref= deep links: a main tab, a sub-tab, or an alias.
    // Existing links use mfa, members, roles and invitions.
    applyRouteRef(ref) {
      const target = this.resolveRef(ref);
      this.activeMainTab = target.main;
      if (target.main === 'members' && target.sub) this.activeMembersSubTab = target.sub;
      if (target.main === 'super-admin' && target.sub) this.activeSuperAdminSubTab = target.sub;
    },
    resolveRef(ref) {
      if (ref === 'mfa') return { main: 'profile' };
      if (this.memberSubTabs.some(sub => sub.value === ref)) return { main: 'members', sub: ref };
      if (this.isSuperAdminUser && this.superAdminSubTabs.some(sub => sub.value === ref)) return { main: 'super-admin', sub: ref };
      if (this.visibleTabs.some(tab => tab.value === ref)) return { main: ref };
      // No or unknown ref: open the first tab
      return { main: 'profile' };
    },
    selectTab(main, sub) {
      const ref = sub || main;
      this.applyRouteRef(ref);
      if (this.$route.query.ref !== ref) {
        this.$router.replace({ query: { ...this.$route.query, ref } }).catch(() => {});
      }
    },
    goBack() {
      if (this.returnRoute) {
        this.$router.go(-1);
        return;
      }
      this.$router.push('/studio/dashboard').catch(() => {});
    }
  },
  async mounted() {
    
    this.setMainSideNavBar(false);
    this.applyRouteRef(this.$route.query.ref);

    try{
      await this.getMyRolesAction()
      await this.getPeopleMembers()
      
    }catch(e){
      console.error(e)
    }
  }
};
</script>
