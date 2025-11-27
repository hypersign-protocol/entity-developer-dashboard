<template>
  
    <v-row justify="center">
      <v-col cols="12" md="6">
        <div  class="serviceCard my-2">
          <!-- Profile Avatar -->
          <v-card-title class="justify-center">
            <v-avatar size="96">
              <v-img :src="user.profileIcon" alt="Profile" />
            </v-avatar>
          </v-card-title>

          <!-- Name & Email -->
          <v-card-text class="">
            <h3 class="font-weight-medium mb-1">{{ user.name }}</h3>
            <div class="text-subtitle-2 grey--text mb-4">{{ user.email }}</div>

            <!-- Chips for role and 2FA -->
            <v-chip color="grey" text-color="white" class="ma-1" small>
              Role: {{ user.role ? user.role : 'ADMIN' }}
            </v-chip>

            <v-chip
              :color="user.isTwoFactorEnabled ? 'success' : 'grey'"
              text-color="white"
              class="ma-1"
              small
            >
              2FA: {{ user.isTwoFactorEnabled ? 'Enabled' : 'Disabled' }}
            </v-chip>
          </v-card-text>

          <v-divider></v-divider>

          <!-- Info List -->
          <v-card-text>
            <v-list dense>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Created At</v-list-item-title>
                  <v-list-item-subtitle>{{ formatDate(user.createdAt) }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Last Updated</v-list-item-title>
                  <v-list-item-subtitle>{{ formatDate(user.updatedAt) }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-list-item v-if="user.authenticators && user.authenticators.length > 0">
                <v-list-item-content>
                  <v-list-item-title>Authentication Methods</v-list-item-title>
                  <v-list-item-subtitle>
                    <v-chip
                      v-for="auth in user.authenticators"
                      :key="auth.type"
                      :color="auth.isTwoFactorAuthenticated ? 'success' : 'grey lighten-1'"
                      small
                      class="ma-1"
                      text-color="white"
                    >
                      {{ auth.type }}
                    </v-chip>
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>

          <v-divider></v-divider>

          <!-- Actions -->
          <v-card-actions class="justify-center flex-wrap">
            <v-btn
              v-if="!hasAny2FA"
              class="mx-1"
              color="success "
              outlined
              @click="onSetupMFA"
            >
              <v-icon left>mdi-shield-key</v-icon>Setup MFA
            </v-btn>

             <v-btn color="error" class="mx-1" outlined @click="onLogout">
              <v-icon left>mdi-logout</v-icon>Logout
            </v-btn>
            
          </v-card-actions>
        </div>
      </v-col>

      <hf-pop-up id="setup-mfa-popup" Header="MFA">
            <SetupMFA @closePopup="onPopupClose" /> 
      </hf-pop-up>
    </v-row>
  
</template>

<script>
import SetupMFA from '../../components/login/mfa/SetupMfa.vue';
import HfPopUp from '../element/hfPopup.vue';
import EventBus from '../../eventbus';
import { mapGetters } from 'vuex/dist/vuex.common.js';
export default {
  name: "UserProfileCard",
  components: {
    SetupMFA,
    HfPopUp
  },
  data() {
    return {
      user: {},
    };
  },
  mounted(){
    this.user = this.getUserDetails
  },
  computed: {
    ...mapGetters('mainStore', ['getUserDetails']),
    hasAny2FA() {
      return this.user?.authenticators?.some(auth => auth.isTwoFactorAuthenticated);
    },
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleString();
    },
     
    onLogout() {
      EventBus.$emit("logoutAll");
    },
    onSetupMFA() {
    //   this.$emit("setupMFA", this.user);
      this.$root.$emit("bv::show::modal", "setup-mfa-popup");
    },
    onPopupClose() {
      this.$root.$emit("bv::hide::modal", "setup-mfa-popup");
    }
  },
};
</script>

<style scoped>

.serviceCard{
  border-radius: 8px;
  box-shadow: 0 0 2rem 0 rgba(136, 152, 170, .15);
  position: relative;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-direction: column;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  flex-direction: column;
  min-width: 0;
  word-wrap: break-word;
  background-color: #fff;
  background-clip: border-box;
  border: 1px solid rgba(0, 0, 0, .125);
}
</style>