<template>
  <div>
    <div v-if="isFeatureImplemented">
      <v-container fluid class="settings-page">
        <!-- Page Heading -->
        <v-row align="center" class="mb-5">
          <v-col cols="12" md="6">
            <h4 class="font-weight-bold mb-1">Settings</h4>
            <p class="text-subtitle-2 settings-subtitle mb-0">Manage your account, team, roles and services</p>
          </v-col>
        </v-row>

        <v-card class="settings-card">
          <!-- Main Tab Bar -->
          <v-tabs
            v-model="activeMainTab"
            background-color="transparent"
            color="primary"
            show-arrows
            class="main-tabs"
          >
            <v-tab>
              <v-icon left small>mdi-account-circle-outline</v-icon>
              Profile
            </v-tab>
            <v-tab>
              <v-icon left small>mdi-account-group-outline</v-icon>
              Members &amp; Roles
            </v-tab>
            <v-tab>
              <v-icon left small>mdi-email-outline</v-icon>
              My Invitations
            </v-tab>
            <v-tab>
              <v-icon left small>mdi-shield-check-outline</v-icon>
              SSI Services
            </v-tab>
            <v-tab v-if="isSuperAdminUser">
              <v-icon left small>mdi-shield-crown-outline</v-icon>
              Super Admin
            </v-tab>
          </v-tabs>

          <v-tabs-items v-model="activeMainTab" class="tab-content">

            <!-- ── Tab 0: Profile ─────────────────────────────────── -->
            <v-tab-item>
              <UserProfile />
            </v-tab-item>

            <!-- ── Tab 1: Members & Roles ──────────────────────────── -->
            <v-tab-item>
              <v-row no-gutters class="sub-tab-row">
                <!-- Left vertical nav -->
                <v-col cols="12" md="2" class="sub-tab-nav">
                  <v-list dense nav class="py-2">
                    <v-list-item
                      v-for="(item, i) in memberSubTabs"
                      :key="i"
                      :class="{ 'sub-tab-active': activeMembersSubTab === i }"
                      @click="activeMembersSubTab = i"
                      link
                    >
                      <v-list-item-icon>
                        <v-icon small>{{ item.icon }}</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title>{{ item.label }}</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-col>

                <v-divider vertical></v-divider>

                <!-- Right content pane -->
                <v-col cols="12" md="10" class="sub-tab-content">
                  <TeamMembers v-if="activeMembersSubTab === 0" />
                  <AdminTeams  v-else-if="activeMembersSubTab === 1" />
                </v-col>
              </v-row>
            </v-tab-item>

            <!-- ── Tab 2: My Invitations ──────────────────────────── -->
            <v-tab-item>
              <div class="tab-inner">
                <MyInvitions />
              </div>
            </v-tab-item>

            <!-- ── Tab 3: SSI Services ────────────────────────────── -->
            <v-tab-item>
              <div class="tab-inner">
                <OnlySSIApps />
              </div>
            </v-tab-item>

            <!-- ── Tab 4: Super Admin (conditional) ──────────────── -->
            <v-tab-item v-if="isSuperAdminUser">
              <v-row no-gutters class="sub-tab-row">
                <!-- Left vertical nav -->
                <v-col cols="12" md="2" class="sub-tab-nav">
                  <v-list dense nav class="py-2">
                    <v-list-item
                      v-for="(item, i) in superAdminSubTabs"
                      :key="i"
                      :class="{ 'sub-tab-active': activeSuperAdminSubTab === i }"
                      @click="activeSuperAdminSubTab = i"
                      link
                    >
                      <v-list-item-icon>
                        <v-icon small>{{ item.icon }}</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title>{{ item.label }}</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-col>

                <v-divider vertical></v-divider>

                <!-- Right content pane -->
                <v-col cols="12" md="10" class="sub-tab-content">
                  <ApproveCustomerOnboarding v-if="activeSuperAdminSubTab === 0" />
                  <CreditRecharge            v-else-if="activeSuperAdminSubTab === 1" />
                  <ComplianceCheck           v-else />
                </v-col>
              </v-row>
            </v-tab-item>

          </v-tabs-items>
        </v-card>
      </v-container>
    </div>

    <div v-else>
      <hf-feature-soon></hf-feature-soon>
    </div>
  </div>
</template>

<script>
import TeamMembers from '../components/teams/TeamMembers.vue';
import MyInvitions from '../components/teams/MyInvitions.vue';
import AdminTeams from '../components/teams/AdminTeams.vue';
import { mapMutations, mapGetters } from "vuex";
import OnlySSIApps from '../components/settings/OnlySSIApps.vue';
import UserProfile from '../components/settings/UserProfile.vue';
import { mapActions } from 'vuex/dist/vuex.common.js';
import ApproveCustomerOnboarding from './sa/components/ApproveCustomerOnboarding.vue'
import CreditRecharge from './sa/components/CreditRecharge.vue'
import ComplianceCheck from './sa/components/ComplianceCheck.vue';



export default {
  name: "SettingConfig",
  components: {
    TeamMembers,
    AdminTeams,
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
    
  },
  data() {
    return {
      isFeatureImplemented: true,
      activeMainTab: 1,
      activeProfileSubTab: 0,
      activeMembersSubTab: 0,
      activeSuperAdminSubTab: 0,
      sentInvitiationCode: "",
      memberSubTabs: [
        { label: 'All Members',       icon: 'mdi-account-multiple-outline' },
        { label: 'Roles & Permissions', icon: 'mdi-shield-account-outline' },
      ],
      superAdminSubTabs: [
        { label: 'Approve Onboarding', icon: 'mdi-clipboard-check-outline' },
        { label: 'Issue Credits',      icon: 'mdi-bank-outline' },
        { label: 'KYB Compliance',     icon: 'mdi-shield-check-outline' },
      ],
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
    applyRouteRef(ref) {
      if (ref === 'invitions') {
        this.$nextTick(() => {
          this.activeMainTab = 2;
        })
      } else if (ref === 'roles') {
        this.activeMainTab = 1;
        this.$nextTick(() => {
          this.activeMembersSubTab = 1;
        });
      } else if (ref === 'mfa') {
        this.activeMainTab = 0;
      } else {
        this.activeMainTab = 1;
        this.activeMembersSubTab = 0;
      }
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

<style scoped>
/* ─── Page wrapper ─────────────────────────────────────────────── */
.settings-page {
  padding: 24px;
  min-height: calc(100vh - 64px);
}

/* ─── Page heading subtitle ────────────────────────────────────── */
.settings-subtitle {
  color: #64748b;
}

/* ─── Outer card ───────────────────────────────────────────────── */
.settings-card {
  border-radius: 10px !important;
  border: 1px solid #e5e7eb !important;
  box-shadow: 0 1px 3px rgba(0,0,0,0.07), 0 4px 16px rgba(0,0,0,0.05) !important;
  background-color: #fff !important;
  overflow: hidden;
}

/* ─── Main tab bar ─────────────────────────────────────────────── */
.main-tabs {
  background: #ffffff !important;
  border-bottom: 1px solid #e5e7eb;
  padding: 0 8px;
}

/* ─── Tab content area ─────────────────────────────────────────── */
.tab-content {
  background: #ffffff;
}

.tab-inner {
  padding: 28px;
  background: #ffffff;
  min-height: 460px;
}

/* ─── Sub-tab side-nav layout ──────────────────────────────────── */
.sub-tab-row {
  min-height: 460px;
}

.sub-tab-nav {
  background: #f9fafb;
  border-right: 1px solid #e5e7eb;
  padding: 12px 0;
}

.sub-tab-nav .v-list-item {
  border-radius: 0 8px 8px 0;
  margin: 2px 8px 2px 0;
  color: #374151;
  font-size: 13px;
  min-height: 40px;
}

.sub-tab-active {
  background: #eff6ff !important;
  border-left: 3px solid #3b82f6;
}

.sub-tab-active .v-icon,
.sub-tab-active .v-list-item__title {
  color: #2563eb !important;
  font-weight: 600 !important;
}

.sub-tab-content {
  padding: 28px;
  background: #ffffff;
}
@media (max-width: 960px) {
  .settings-page { padding: 12px; }
  .sub-tab-nav { border-bottom: 1px solid #e5e7eb; border-right: none; }
  .sub-tab-content { padding: 16px; }
}
</style>
