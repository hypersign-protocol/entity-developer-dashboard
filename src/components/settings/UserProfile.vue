<template>
  
    <v-row justify="center">
      <v-col cols="12" md="6">
        <v-card  class="serviceCard my-2">
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
            <v-chip color="primary" text-color="white" class="ma-1" small>
              Role: {{ user.role }}
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

              <v-list-item>
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
            <!-- <v-btn color="primary" class=" mx-1" outlined @click="onEditProfile">
              <v-icon left>mdi-pencil</v-icon>Edit Profile
            </v-btn> -->
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
        </v-card>
      </v-col>

      <hf-pop-up id="setup-mfa-popup" Header="MFA">
            <SetupMFA  /> 
      </hf-pop-up>
    </v-row>
  
</template>

<script>
import SetupMFA from '../../components/login/mfa/SetupMfa.vue';
import HfPopUp from '../element/hfPopup.vue';
import EventBus from '../../eventbus';
export default {
  name: "UserProfileCard",
  components: {
    SetupMFA,
    HfPopUp
  },
  data() {
    return {
      user: {
        _id: "6601dda602eca097d7a84b9b",
        userId: "ccebe9ce-c532-45f5-a79a-fdd4c301a9c8",
        email: "meet.hypersign@gmail.com",
        createdAt: "2024-03-12T07:35:56.059Z",
        updatedAt: "2025-04-23T05:18:38.880Z",
        authenticators: [
          { type: "google", isTwoFactorAuthenticated: false },
          { type: "okta", isTwoFactorAuthenticated: false },
        ],
        name: "Hypersign ID",
        profileIcon:
          "https://lh3.googleusercontent.com/a/ACg8ocJ618Y7_ImCSBSmATDnfAYpMgPhW7skW7I9r0c8vLJj9Vtfuak=s96-c",
        isTwoFactorEnabled: false,
        isTwoFactorAuthenticated: false,
        role: "ADMIN",
      },
    };
  },
  mounted(){
    const payload = localStorage.getItem('user');
      if (payload) {
        this.user = JSON.parse(payload);
      } else {
        this.user = {};
      }
  },
  computed: {
    hasAny2FA() {
      return this.user.authenticators.some((a) => a.isTwoFactorAuthenticated);
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