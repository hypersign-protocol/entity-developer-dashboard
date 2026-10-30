<template>
  <div class="settings-page">
    <template v-if="isFeatureImplemented">
      <header class="app-page-header" data-tour="settings-header">
        <button
          type="button"
          class="page-back-button"
          :aria-label="backButtonLabel"
          :title="backButtonLabel"
          @click="goBack"
        >
          <i class="mdi mdi-arrow-left" aria-hidden="true"></i>
        </button>
        <div class="page-heading-copy">
          <h1 class="app-page-title">Settings</h1>
          <p class="app-page-subtitle">Manage your profile, team members, invitations and workspace access.</p>
        </div>
      </header>

      <nav class="config-tabs" aria-label="Settings sections" data-tour="settings-tabs">
        <button
          v-for="tab in visibleTabs"
          :key="tab.value"
          type="button"
          :data-tour="`settings-tab-${tab.value}`"
          :class="{ active: activeMainTab === tab.value }"
          @click="selectTab(tab.value)"
        >
          {{ tab.label }}
        </button>
      </nav>

      <div class="settings-content">
        <!-- v-show keeps every section mounted, as the previous b-tabs did -->
        <section v-show="activeMainTab === 'profile'" data-tour="settings-profile-section">
          <UserProfile />
        </section>

        <section v-show="activeMainTab === 'members'" data-tour="settings-members-section">
          <div class="sub-tabs" role="tablist" aria-label="Members and roles sections" data-tour="settings-member-subtabs">
            <button
              v-for="sub in memberSubTabs"
              :key="sub.value"
              type="button"
              :data-tour="`settings-members-subtab-${sub.value}`"
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

        <section v-show="activeMainTab === 'invitions'" data-tour="settings-invitations-section">
          <MyInvitions />
        </section>

        <section v-show="activeMainTab === 'ssi'" data-tour="settings-ssi-overview">
          <OnlySSIApps />
        </section>

        <section v-if="isSuperAdminUser" v-show="activeMainTab === 'super-admin'" data-tour="settings-super-admin-overview">
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

      <div
        v-if="settingsTourMenuOpen"
        ref="settingsTourDialog"
        class="tour-chooser-backdrop"
        tabindex="-1"
        @click.self="closeSettingsTourMenu"
        @keydown.esc="closeSettingsTourMenu"
      >
        <section class="tour-chooser" role="dialog" aria-modal="true" aria-labelledby="settings-tour-title">
          <header class="tour-chooser-header">
            <div>
              <h2 id="settings-tour-title">Settings tours</h2>
              <p>Choose the area you want to explore.</p>
            </div>
            <button type="button" aria-label="Close settings tours" @click="closeSettingsTourMenu">
              <i class="mdi mdi-close" aria-hidden="true"></i>
            </button>
          </header>

          <div class="tour-chooser-list">
            <button
              v-for="tour in availableSettingsTours"
              :key="tour.id"
              type="button"
              class="tour-choice"
              @click="launchSettingsTour(tour.id)"
            >
              <span class="tour-choice-icon" aria-hidden="true"><i :class="['mdi', tour.icon]"></i></span>
              <span class="tour-choice-copy">
                <strong>{{ tour.title }}</strong>
                <small>{{ tour.description }}</small>
              </span>
              <span class="tour-choice-meta">
                <span>{{ tour.steps }} steps</span>
                <i
                  v-if="finishedSettingsTours.includes(tour.id)"
                  class="mdi mdi-check-circle tour-choice-check"
                  aria-label="Viewed"
                  title="Viewed"
                ></i>
                <i v-else class="mdi mdi-chevron-right" aria-hidden="true"></i>
              </span>
            </button>
          </div>
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
.page-heading-copy { min-width: 0; }
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

.tour-chooser-backdrop { position: fixed; z-index: 12000; inset: 0; display: flex; align-items: center; justify-content: center; padding: 24px; background: rgba(15, 23, 42, .42); }
.tour-chooser { width: min(100%, 560px); overflow: hidden; border: 1px solid #dbe3ef; border-radius: 12px; background: #fff; box-shadow: 0 24px 60px rgba(15, 23, 42, .2); }
.tour-chooser-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; padding: 20px 20px 16px; border-bottom: 1px solid #eef2f6; }
.tour-chooser-header h2 { margin: 0 0 4px; color: #111827; font-size: 17px; font-weight: 700; }
.tour-chooser-header p { margin: 0; color: #64748b; font-size: 13px; }
.tour-chooser-header button { display: inline-flex; width: 30px; height: 30px; align-items: center; justify-content: center; border: 0; border-radius: 6px; background: transparent; color: #64748b; }
.tour-chooser-header button:hover, .tour-chooser-header button:focus { background: #f1f5f9; color: #111827; outline: none; }
.tour-chooser-list { padding: 8px; }
.tour-choice { display: flex; width: 100%; align-items: center; gap: 12px; padding: 12px; border: 0; border-radius: 8px; background: transparent; color: #273448; text-align: left; }
.tour-choice:hover, .tour-choice:focus { background: #f6f8fb; outline: none; }
.tour-choice:focus-visible { box-shadow: inset 0 0 0 2px rgba(37, 99, 220, .3); }
.tour-choice-icon { display: inline-flex; width: 34px; height: 34px; flex: 0 0 auto; align-items: center; justify-content: center; border-radius: 8px; background: #eff6ff; color: #2563dc; font-size: 17px; }
.tour-choice-copy { display: flex; min-width: 0; flex: 1; flex-direction: column; gap: 2px; }
.tour-choice-copy strong { color: #1f2937; font-size: 13px; font-weight: 700; }
.tour-choice-copy small { color: #64748b; font-size: 12px; line-height: 1.4; }
.tour-choice-meta { display: inline-flex; flex: 0 0 auto; align-items: center; gap: 10px; color: #94a3b8; font-size: 11px; }
.tour-choice-meta .mdi-chevron-right { font-size: 18px; }
.tour-choice-check { color: #218459; font-size: 18px; }

@media (max-width: 650px) {
  .page-back-button { right: 0; left: auto; }
  .app-page-header { padding-right: 38px; }
  .config-tabs { gap: 16px; overflow-x: auto; }
  .sub-tabs { display: flex; }
  .sub-tabs button { min-width: 0; flex: 1 1 auto; }
  .tour-chooser-backdrop { align-items: flex-end; padding: 12px; }
  .tour-choice-meta > span { display: none; }
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
import { hasFinishedSettingsTour, markSettingsTourFinished, startSettingsTour } from '../tours/settingsTour.js';



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
    ...mapGetters('mainStore', ['getAuthToken', 'getUserDetails', 'getAppsWithSSIServices']),
    isSuperAdminUser() {
      return this.getUserDetails?.role === "SUPER_ADMIN";
    },
    visibleTabs() {
      return this.tabs.filter(tab => {
        if (tab.ssiOnly && !this.hasSSISettings) return false;
        return !tab.superAdminOnly || this.isSuperAdminUser;
      });
    },
    hasSSISettings() {
      return Array.isArray(this.getAppsWithSSIServices) && this.getAppsWithSSIServices.length > 0;
    },
    backButtonLabel() {
      return this.returnRoute ? 'Back' : 'Back to dashboard';
    },
    availableSettingsTours() {
      return this.settingsTours.filter(tour => {
        if (tour.ssiOnly && !this.hasSSISettings) return false;
        return !tour.superAdminOnly || this.isSuperAdminUser;
      });
    },
  },
  data() {
    return {
      isFeatureImplemented: true,
      tabs: [
        { value: 'profile', label: 'Profile' },
        { value: 'members', label: 'Members & roles' },
        { value: 'invitions', label: 'My invitations' },
        { value: 'ssi', label: 'SSI', ssiOnly: true },
        { value: 'super-admin', label: 'Super admin tools', superAdminOnly: true },
      ],
      settingsTours: [
        { id: 'profile', title: 'Profile & security', description: 'Account details, MFA, and your permissions.', icon: 'mdi-account-lock-outline', steps: 4 },
        { id: 'team', title: 'Members & roles', description: 'Member access, roles, permissions, and live sessions.', icon: 'mdi-account-group-outline', steps: 6 },
        { id: 'invitations', title: 'My invitations', description: 'Invitation codes, workspace details, and joining.', icon: 'mdi-email-outline', steps: 3 },
        { id: 'ssi', title: 'SSI settings', description: 'Identity services available to your workspace.', icon: 'mdi-card-account-details-outline', steps: 2, ssiOnly: true },
        { id: 'super-admin', title: 'Super admin tools', description: 'Restricted operational and compliance controls.', icon: 'mdi-shield-account-outline', steps: 2, superAdminOnly: true },
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
      activeSettingsTour: null,
      settingsTourInitialSection: null,
      settingsTourMenuOpen: false,
      finishedSettingsTours: [],
      returnRoute: null,
      sentInvitiationCode: ""
    };
  },
  watch: {
    '$route.query.ref'(ref) {
      this.applyRouteRef(ref);
    }
  },
  beforeDestroy() {
    if (this.activeSettingsTour && this.activeSettingsTour.isActive()) this.activeSettingsTour.destroy();
    this.$root.$off('openSettingsTours', this.openSettingsTourMenu);
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
    showTourSection({ main, sub } = {}) {
      if (!main) return;
      this.activeMainTab = main;
      if (main === 'members' && sub) this.activeMembersSubTab = sub;
      if (main === 'super-admin' && sub) this.activeSuperAdminSubTab = sub;
    },
    refreshFinishedSettingsTours() {
      this.finishedSettingsTours = this.settingsTours
        .filter(tour => hasFinishedSettingsTour(this.getUserDetails, tour.id))
        .map(tour => tour.id);
    },
    openSettingsTourMenu() {
      this.refreshFinishedSettingsTours();
      this.settingsTourMenuOpen = true;
      this.$nextTick(() => this.$refs.settingsTourDialog?.focus());
    },
    closeSettingsTourMenu() {
      this.settingsTourMenuOpen = false;
    },
    launchSettingsTour(tourId) {
      if (this.activeSettingsTour && this.activeSettingsTour.isActive()) this.activeSettingsTour.destroy();

      this.closeSettingsTourMenu();

      this.settingsTourInitialSection = {
        main: this.activeMainTab,
        membersSub: this.activeMembersSubTab,
        superAdminSub: this.activeSuperAdminSubTab,
      };

      this.$nextTick(() => {
        this.activeSettingsTour = startSettingsTour({
          tourId,
          showSection: this.showTourSection,
          onDestroyed: (_, __, hook) => {
            if (hook?.reason === 'done') {
              markSettingsTourFinished(this.getUserDetails, tourId);
              this.refreshFinishedSettingsTours();
            }
            const initial = this.settingsTourInitialSection;
            if (initial) {
              this.activeMainTab = initial.main;
              this.activeMembersSubTab = initial.membersSub;
              this.activeSuperAdminSubTab = initial.superAdminSub;
            }
            this.activeSettingsTour = null;
            this.settingsTourInitialSection = null;
          },
        });
      });
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
    this.refreshFinishedSettingsTours();
    this.$root.$on('openSettingsTours', this.openSettingsTourMenu);

    try{
      await this.getMyRolesAction()
      await this.getPeopleMembers()
      
    }catch(e){
      console.error(e)
    }
  }
};
</script>
