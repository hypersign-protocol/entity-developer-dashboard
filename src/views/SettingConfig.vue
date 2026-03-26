<template>
  <div>
    <div no-body v-if="isFeatureImplemented">
      <b-tabs  v-model="activeMainTab">
        <!-- Profile Tab -->
        <b-tab>
          <template #title>
            <b-icon icon="person-square" aria-hidden="true" small></b-icon>
            <strong> Profile</strong>
          </template>
          <UserProfile></UserProfile>
          <!-- <b-tabs card vertical justified small v-model="activeProfileSubTab">
             
              <SetupMFA v-if="!isTwoFactorEnabled.isTwoFactorEnabled" />
              <div v-else>
                <h3>
                  MFA Enabled <b-icon icon="shield-shaded"></b-icon>
                </h3>
                <ul class="list-group">
                  <li class="list-group-item">
                    <span>Type: {{ isTwoFactorEnabled.authenticators[0].type }}</span>
                    <span style="float: right"></span>
                  </li>
                </ul>
              </div>
            
              
          </b-tabs> -->
        </b-tab>



        <!-- Members & Roles Tab -->
        <b-tab>
          <template #title>
            <b-icon icon="sliders" aria-hidden="true" small></b-icon>
            <strong> Members & Roles</strong>
          </template>
          <b-tabs card vertical justified small v-model="activeMembersSubTab">
            <b-tab>
              <template #title>
                <b-icon icon="people-fill" aria-hidden="true" small></b-icon>
                All Members
              </template>
              <TeamMembers />
            </b-tab>
            <b-tab>
              <template #title>
                <i class="fa fa-gamepad" aria-hidden="true"></i> Roles & Permissions
              </template>
              <AdminTeams />
            </b-tab>
          </b-tabs>
        </b-tab>


        <b-tab>
          <template #title>
            <b-icon icon="envelope" aria-hidden="true" small></b-icon>
            <strong> My Invitions</strong>
          </template>
          <MyInvitions />
        </b-tab>

        <!-- SSI Services -->
        <b-tab>
          <template #title>
            <b-icon icon="shield-check" aria-hidden="true" small></b-icon>
            <strong> SSI</strong>
          </template>
          <OnlySSIApps />
        </b-tab>

        <b-tab v-if="isSuperAdminUser">
          <template #title>
            <b-icon icon="cpu" aria-hidden="true" small></b-icon>
            <strong>Super Admin Toolings</strong>
          </template>
          <b-tabs card vertical justified small v-model="activeSuperAdminSubTab">
            <b-tab>
              <template #title>
                <b-icon icon="clipboard-check" aria-hidden="true" small></b-icon>
                Approve Onboarding
              </template>
               <ApproveCustomerOnboarding />
            </b-tab>
            <b-tab>
              <template #title>
                <b-icon icon="piggy-bank" aria-hidden="true" small></b-icon> Issue Credits
              </template>
              <CreditRecharge />
            </b-tab>
            <b-tab>
              <template #title>
                <b-icon icon="shield-check" aria-hidden="true" small></b-icon> KYB Compliance
              </template>
              <ComplianceCheck />
            </b-tab>
          </b-tabs>
        </b-tab>

        

      </b-tabs>
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
      activeMainTab: 0, // Default to Members tab
      activeProfileSubTab: 0,
      activeMembersSubTab: 0,
      activeSuperAdminSubTab: 0,
      sentInvitiationCode: ""
    };
  },
  methods: {
    ...mapMutations("mainStore", ["setMainSideNavBar"]),
    ...mapActions('mainStore', ['getMyRolesAction', 'getPeopleMembers',])
  },
  async mounted() {
    
    this.setMainSideNavBar(false);
    const ref = this.$route.query.ref;
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
      this.$nextTick(() => {
        this.activeProfileSubTab = 0;
      });
    } else {
      this.activeMainTab = 1;
      this.activeMembersSubTab = 0;
    }

    try{
      await this.getMyRolesAction()
      await this.getPeopleMembers()
      
    }catch(e){
      console.error(e)
    }
  }
};
</script>