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
          <b-tabs card vertical justified small v-model="activeProfileSubTab">
            <b-tab>
              <template #title>
                <b-icon icon="shield-shaded"></b-icon> Multi Factor Authentication (MFA)
              </template>
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
            </b-tab>
          </b-tabs>
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
            <b-tab>
              <template #title>
                <i class="fa fa-envelope" aria-hidden="true"></i>
                Invitions
              </template>
              <MyInvitions />
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
import SetupMFA from '../components/login/mfa/SetupMfa.vue';

export default {
  name: "SettingConfig",
  components: {
    TeamMembers,
    AdminTeams,
    MyInvitions,
    SetupMFA
  },
  computed: {
    ...mapGetters('mainStore', ['getAuthToken']),
    isTwoFactorEnabled() {
      const payload = localStorage.getItem('user');
      if (payload) {
        return JSON.parse(payload);
      }
      return {};
    }
  },
  data() {
    return {
      isFeatureImplemented: true,
      activeMainTab: 1, // Default to Members tab
      activeProfileSubTab: 0,
      activeMembersSubTab: 0
    };
  },
  methods: {
    ...mapMutations("mainStore", ["setMainSideNavBar"]),
  },
  mounted() {
    this.setMainSideNavBar(false);
    const ref = this.$route.query.ref;
    if (ref === 'invitions') {
      this.activeMainTab = 1;
      this.$nextTick(() => {
        this.activeMembersSubTab = 2;
      });
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
  }
};
</script>