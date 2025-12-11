<template>
  <v-container fluid class="pa-6 profile-page">
    <!-- Banner (full-width area) -->
    <div class="banner" :style="bannerStyle"></div>

    <v-row class="mt-6" align="start">
      <!-- LEFT: Name, Email, Account Info -->
      <v-col cols="12" md="8" class="left-section">

        <!-- Name + Email + Chips -->
        <div class="user-header">
          <h1 class="user-name">{{ user.name }}</h1>
          <div class="user-email">{{ user.email }}</div>

          <div class="chips-row">
            <v-chip :color="user.isTwoFactorEnabled ? 'success' : 'grey lighten-2'"
                    :text-color="user.isTwoFactorEnabled ? 'white' : 'black'">
              MFA {{ user.isTwoFactorEnabled ? 'Enabled' : 'Disabled' }}
            </v-chip>

            <v-chip color="grey lighten-3" text-color="black">
              {{ user.role || 'ADMIN' }}
            </v-chip>
          </div>
        </div>

        <!-- Account Info rounded card -->
        <div class="section-card">
          <h5>Permissions ({{ totalPermissionsCount }})</h5>

          <v-row dense>
            <v-col v-for="(items, serviceType) in groupedAccess" :key="serviceType" cols="12" class="mb-3">
              <div class="permission-header">
                <v-icon color="green" small>mdi-shield-check</v-icon>
                <span class="ml-2">{{ formatServiceType(serviceType) }} ({{ items.length }})</span>
              </div>

              <div class="mt-2">
                <span v-for="access in items" :key="access.access" class="access-pill">
                  {{ access.access }}
                </span>
              </div>
            </v-col>
          </v-row>
        </div>
      </v-col>

      <!-- RIGHT: Profile avatar (over banner), Permissions, Actions -->
      <v-col cols="12" md="4" class="right-section">
        <!-- Avatar container is absolutely positioned relative to .profile-page -->
        <div class="avatar-wrapper">
          <v-avatar size="140" class="profile-avatar">
            <v-img src="data:image/png;base64,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" alt="Profile" />
          </v-avatar>
        </div>

        <!-- Permissions box -->
        <div class="section-card permissions-card">
          <h5>Account Information</h5>


          <v-list dense style="background-color: transparent;">
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

            <v-list-item v-if="user.authenticators?.length">
              <v-list-item-content>
                <v-list-item-title>Authentication Methods</v-list-item-title>
                <v-list-item-subtitle>
                  <v-chip v-for="auth in user.authenticators" :key="auth.type"
                          small class="ma-1"
                          :color="auth.isTwoFactorAuthenticated ? 'success' : 'grey lighten-1'"
                          text-color="white">
                    {{ auth.type }}
                  </v-chip>
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>

          
        </div>

        <!-- Action buttons pinned below permissions -->
        <div class="action-buttons">
          <v-btn v-if="!isMFAEnabled" color="success" outlined class="mr-3" @click="onSetupMFA">
            <v-icon left>mdi-shield-key</v-icon> Setup MFA
          </v-btn>

          <v-btn color="error" outlined @click="onLogout">
            <v-icon left>mdi-logout</v-icon> Logout
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- Popup -->
    <hf-pop-up id="setup-mfa-popup" Header="MFA">
      <SetupMFA @closePopup="onPopupClose" />
    </hf-pop-up>
  </v-container>
</template>
 

<style scoped>
/* Page container must be position: relative so avatar (absolute) can overlap the banner */
.profile-page {
  position: relative;
}

/* Top banner area */
.banner {
  width: 100%;
  height: 160px;            /* tweak height to match your wireframe */
  border-radius: 12px;
  box-shadow: none;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}

/* layout spacing */
.left-section { padding-right: 32px; }

/* Header area */
.user-header {
  margin-top: 8px;
  margin-bottom: 18px;
}

.user-name {
  font-size: 28px;
  font-weight: 700;
  margin: 0;
  letter-spacing: 0.6px;
}

.user-email {
  color: #6b6b6b;
  margin-top: 6px;
  margin-bottom: 12px;
}

/* chips */
.chips-row { display: flex; gap: 10px; margin-top: 8px; }

/* rounded section cards (grey background) */
.section-card {
  background: #eee;
  padding: 22px;
  border-radius: 18px;
  margin-top: 18px;
}

/* avatar overlap — placed near top-right, overlapping the banner */
.avatar-wrapper {
  position: absolute;
  right: 56px;
  top: 43px;      /* 20px below banner */
  /* transform: translateY(-50%); */
  z-index: 30;
  display: flex;
  align-items: center;
  justify-content: center;

  
  
  transform: translateY(-60%);
}
 

/* .avatar-wrapper {
  position: absolute;
  right: 56px;
  top: 160px;       
  transform: translateY(-50%);
  z-index: 30;
} */

/* visible avatar styling */
.profile-avatar {
  border: 6px solid #fff;     /* white ring */
  box-shadow: 0 8px 22px rgba(18, 20, 24, 0.12);
}

/* permissions card separate styling to match wireframe */
.permissions-card {
  margin-top: 128px;
}

/* permission header */
.permission-header {
  font-weight: 600;
  display: flex;
  align-items: center;
}

/* pill style for each permission */
.access-pill {
  display: inline-block;
  padding: 8px 14px;
  border-radius: 20px;
  margin: 6px 6px 6px 0;
  background: #6d6d6d;
  color: #fff;
  font-size: 12px;
  letter-spacing: 0.6px;
}

/* action buttons container: push to bottom area of right column */
.action-buttons {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

/* RESPONSIVE ADJUSTMENTS */
@media (max-width: 960px) {
  /* make avatar center & relative on small screens */
  .avatar-wrapper {
    position: relative;
    right: 0;
    top: 0;
    transform: none;
    margin: -90px auto 0;  /* overlap effect but centered */
    justify-content: center;
  }
  .profile-avatar { width: 120px; height: 120px; }
  .left-section { padding-right: 0; }
  .action-buttons { justify-content: center; }
}
</style>

<script>
import SetupMFA from '../../components/login/mfa/SetupMfa.vue';
import HfPopUp from '../element/hfPopup.vue';
import EventBus from '../../eventbus';
import { mapGetters } from 'vuex/dist/vuex.common.js';
import config from '../../config';
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
  mounted() {
    this.user = this.getUserDetails

    console.log(JSON.stringify(this.user.accessList, null, 2))
  },
  computed: {
    ...mapGetters('mainStore', ['getUserDetails', 'isMFAEnabled']),
    bannerStyle() {
      // Uses user.bannerImage if present, otherwise a soft gradient fallback
      if (this.user?.bannerImage) {
        return `background-image: url('${this.user.bannerImage}'); background-size: cover; background-position: center;`;
      }
      return 'background: linear-gradient(90deg,#f5f5f7,#e9e9eb);';
    },
    groupedAccess() {
      const groups = {};

      if (!this.user.accessList) return groups;

      this.user.accessList.filter(access => access.serviceType != config.SERVICE_TYPES.QUEST)
      .forEach(item => {
        if (!groups[item.serviceType]) {
          groups[item.serviceType] = [];
        }
        groups[item.serviceType].push(item);
      });

      return groups;
    }, 

    totalPermissionsCount() {
      const listwithoutQuest = this.user.accessList?.filter(access => access.serviceType != config.SERVICE_TYPES.QUEST)
      return listwithoutQuest ? listwithoutQuest.length : 0;
    }
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleString();
    },

    formatServiceType(serviceType) {
      let text = "ID Service";
      switch (serviceType) {
        case config.SERVICE_TYPES.SSI_API: {
          text = "SSI Service";
          break;
        }
        case config.SERVICE_TYPES.CAVACH_API: {
          text = "ID Service";
          break;
        }
        case config.SERVICE_TYPES.QUEST: {
          text = "Quest Service";
          break;
        }
        default: text = "ID Service";
      }

      return text
    },

    // getAccessColor(access) {
    //   if (access.includes("READ")) return "info";
    //   if (access.includes("WRITE")) return "warning";
    //   if (access === "ALL") return "success";
    //   return "grey";
    // },
    onLogout() {
      EventBus.$emit("logoutAll");
    },
    onSetupMFA() {
      this.$root.$emit("bv::show::modal", "setup-mfa-popup");
    },
    onPopupClose() {
      this.$root.$emit("bv::hide::modal", "setup-mfa-popup");
    },
  },
};
</script>

