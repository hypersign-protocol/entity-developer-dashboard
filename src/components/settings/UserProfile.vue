<template>
  <div class="profile-page">
    <!-- ── Banner + Avatar anchor ──────────────────────────────── -->
    <div class="profile-banner-wrap">
      <div class="banner" :style="bannerStyle"></div>
      <div class="avatar-anchor">
        <v-avatar size="96" class="profile-avatar">
          <v-img :src="profileSrc" alt="Profile" @error="onImageError" />
        </v-avatar>
      </div>
    </div>

    <!-- ── Content ──────────────────────────────────────────────── -->
    <v-row class="profile-body ma-0" align="start">
      <!-- LEFT: Name / Email / Permissions -->
      <v-col cols="12" md="8" class="left-col">

        <!-- Name + Email -->
        <div class="user-header">
          <h1 class="user-name">{{ user.name || '—' }}</h1>
          <div class="user-email" @click="copyToClip(user.email, 'Email Id')">
            {{ user.email }}
            <v-icon x-small color="grey lighten-1" class="ml-1">mdi-content-copy</v-icon>
          </div>
        </div>

        <!-- Permissions card -->
        <div class="section-card">
          <div class="card-header-row">
            <v-icon small color="#64748b" class="mr-1">mdi-shield-check-outline</v-icon>
            <span class="card-heading">Permissions</span>
            <span class="heading-badge ml-2">{{ totalPermissionsCount }}</span>
          </div>

          <v-row dense class="mt-3">
            <v-col v-for="(items, serviceType) in groupedAccess" :key="serviceType" cols="12" class="mb-2">
              <div class="perm-service-label">
                <v-icon color="#94a3b8" x-small class="mr-1">mdi-chevron-right</v-icon>
                {{ formatServiceType(serviceType) }}
                <span class="perm-count ml-1">({{ items.length }})</span>
              </div>
              <div class="pill-row mt-1">
                <span v-for="access in items" :key="access.access" class="access-pill">
                  {{ access.access }}
                </span>
              </div>
            </v-col>
          </v-row>
        </div>
      </v-col>

      <!-- RIGHT: Account info + Actions -->
      <v-col cols="12" md="4" class="right-col">

        <!-- Account Information card -->
        <div class="section-card info-card">
          <div class="card-header-row mb-3">
            <v-icon small color="#64748b" class="mr-1">mdi-account-circle-outline</v-icon>
            <span class="card-heading">Account Information</span>
          </div>

          <div class="info-row">
            <span class="info-label">Created At</span>
            <span class="info-value">{{ formatDate(user.createdAt) }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Last Updated</span>
            <span class="info-value">{{ formatDate(user.updatedAt) }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Role</span>
            <span class="info-value">
              <v-chip small color="#eff6ff" text-color="#1d4ed8" label>{{ user.role || 'Admin' }}</v-chip>
            </span>
          </div>
          <div class="info-row" v-if="user.authenticators && user.authenticators.length">
            <span class="info-label">Auth Methods</span>
            <div class="chips-wrap mt-1">
              <v-chip
                v-for="auth in user.authenticators"
                :key="auth.type"
                small
                class="auth-chip mr-1 mb-1"
                color="#f0fdf4"
                text-color="#15803d"
                close
                close-icon="mdi-close-circle"
                @click:close="confirmRemoveAuth(auth)"
              >
                <v-icon left x-small color="#16a34a">mdi-shield-check</v-icon>
                {{ auth.type }}
              </v-chip>
            </div>
          </div>
        </div>

        <!-- Action buttons -->
        <div class="action-buttons">
          <hf-buttons v-if="!isMFAEnabled" name="Setup MFA" iconClass="mdi-shield-key" @executeAction="onSetupMFA" class="mr-2" />
          <hf-buttons name="Logout" iconClass="mdi-logout" @executeAction="onLogout" />
        </div>
      </v-col>
    </v-row>

    <!-- Popups -->
    <hf-pop-up id="setup-mfa-popup" Header="MFA">
      <SetupMFA @closePopup="onPopupClose" />
    </hf-pop-up>

    <hf-pop-up id="confirm-remove-auth" Header="Remove Authenticator">
      <div class="confirm-body">
        <p class="confirm-text">
          Are you sure you want to remove
          <strong>{{ pendingAuthToRemove && pendingAuthToRemove.type }}</strong>?
        </p>
        <div class="confirm-actions">
          <hf-buttons name="Cancel" customClass="btn btn-outline-secondary" @executeAction="hideConfirmModal" />
          <hf-buttons name="Remove" customClass="btn btn-danger ml-2" @executeAction="removeAuth" />
        </div>
      </div>
    </hf-pop-up>
  </div>
</template>
 

<style scoped>
/* ─── Page wrapper ────────────────────────────────────────────── */
.profile-page {
  position: relative;
  overflow: hidden; /* keeps banner flush inside the settings card */
}

/* ─── Banner ──────────────────────────────────────────────────── */
.profile-banner-wrap {
  position: relative;
}

.banner {
  width: 100%;
  height: 110px;
  background: linear-gradient(135deg, #dbeafe 0%, #ede9fe 100%);
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}

/* ─── Avatar anchored to bottom-right of banner ─────────────── */
.avatar-anchor {
  position: absolute;
  right: 40px;
  bottom: -48px; /* avatar is 96px → half = 48px overlap */
  z-index: 20;
}

.profile-avatar {
  border: 4px solid #ffffff;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.13);
}

/* ─── Body layout ─────────────────────────────────────────────── */
.profile-body {
  padding: 20px 24px 28px !important;
}

.left-col {
  padding-right: 24px !important;
  padding-top: 16px !important;
  padding-left: 0 !important;
}

.right-col {
  padding-left: 8px !important;
  padding-right: 0 !important;
  /* push content below avatar: 48px overlap + 16px breathing room */
  padding-top: 64px !important;
}

/* ─── User header ─────────────────────────────────────────────── */
.user-header {
  margin-bottom: 20px;
}

.user-name {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 4px;
  line-height: 1.25;
}

.user-email {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #6b7280;
  cursor: pointer;
  transition: color 0.15s;
}
.user-email:hover { color: #3b82f6; }

/* ─── Section cards ───────────────────────────────────────────── */
.section-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 18px 20px;
  margin-bottom: 14px;
}

/* ─── Card header row ─────────────────────────────────────────── */
.card-header-row {
  display: flex;
  align-items: center;
}

.card-heading {
  font-size: 0.72rem;
  font-weight: 700;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.07em;
}

.heading-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 999px;
  background: #eff6ff;
  color: #2563eb;
  font-size: 11px;
  font-weight: 700;
}

/* ─── Permissions list ────────────────────────────────────────── */
.perm-service-label {
  display: flex;
  align-items: center;
  font-size: 12.5px;
  font-weight: 600;
  color: #374151;
}

.perm-count {
  font-weight: 400;
  color: #9ca3af;
  font-size: 12px;
}

.pill-row {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.access-pill {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 9999px;
  background: #eff6ff;
  color: #1d4ed8;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.3px;
}

/* ─── Info card ───────────────────────────────────────────────── */
.info-card {
  /* inherits .section-card, no extra magic margins needed */
}

.info-row {
  display: flex;
  flex-direction: column;
  padding: 10px 0;
  border-bottom: 1px solid #f3f4f6;
}
.info-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.info-label {
  display: block;
  font-size: 0.63rem;
  font-weight: 700;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  margin-bottom: 4px;
}

.info-value {
  display: block;
  font-size: 0.83rem;
  font-weight: 500;
  color: #1f2937;
}

/* ─── Auth chips ──────────────────────────────────────────────── */
.chips-wrap {
  display: flex;
  flex-wrap: wrap;
}

.auth-chip {
  font-size: 12px !important;
  letter-spacing: 0.2px;
}

/* ─── Action buttons ──────────────────────────────────────────── */
.action-buttons {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
}

/* ─── Confirm modal ───────────────────────────────────────────── */
.confirm-body {
  padding: 4px 0 8px;
}

.confirm-text {
  font-size: 14px;
  color: #374151;
  line-height: 1.6;
  margin-bottom: 20px;
}

.confirm-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
}

/* ─── Responsive ──────────────────────────────────────────────── */
@media (max-width: 960px) {
  .avatar-anchor {
    left: 50%;
    right: auto;
    transform: translateX(-50%);
  }
  .left-col {
    padding-right: 0 !important;
    padding-top: 64px !important; /* clear centered avatar on mobile */
  }
  .right-col {
    padding-left: 0 !important;
    padding-top: 12px !important; /* right-col stacks below left, no avatar above */
  }
  .action-buttons {
    justify-content: center;
  }
}
</style>

<script>
import SetupMFA from '../../components/login/mfa/SetupMfa.vue';
import HfPopUp from '../element/hfPopup.vue';
import EventBus from '../../eventbus';
import { mapGetters } from 'vuex/dist/vuex.common.js';
import config from '../../config';
import UtilsMixin from "../../mixins/utils";

export default {
  name: "UserProfileCard",
  components: {
    SetupMFA,
    HfPopUp
  },
  data() {
    return {
      user: {},
       hasImageError: false,
      fallbackImage: "data:image/png;base64,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"
      ,
      pendingAuthToRemove: null,
    };
  },
  mounted() {
    this.user = this.getUserDetails;
    if (this.$route.query.ref === 'mfa') {
      this.$nextTick(() => {
        this.$root.$emit('bv::show::modal', 'setup-mfa-popup');
      });
    }
  },
  computed: {
    ...mapGetters('mainStore', ['getUserDetails', 'isMFAEnabled']),
    profileSrc() {
      if (this.hasImageError) {
        return this.fallbackImage
      }
      return this.user?.profileUrl || this.fallbackImage
    },
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
      const uniqueEntries = new Map();
      this.user.accessList
        .filter(access => access.serviceType != config.SERVICE_TYPES.QUEST)
        .forEach(item => {
          const key = `${item.serviceType}::${item.access}`;
          if (!uniqueEntries.has(key)) {
            uniqueEntries.set(key, item);
          }
        });

      Array.from(uniqueEntries.values()).forEach(item => {
        if (!groups[item.serviceType]) {
          groups[item.serviceType] = [];
        }
        groups[item.serviceType].push(item);
      });

      return groups;
    },

    totalPermissionsCount() {
      const listWithoutQuest = this.user.accessList?.filter(access => access.serviceType != config.SERVICE_TYPES.QUEST) || [];
      const uniqueKeys = new Set(
        listWithoutQuest.map(item => `${item.serviceType}::${item.access}`)
      );
      return uniqueKeys.size;
    }
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleString();
    },

    onImageError() {
      this.hasImageError = true
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
    confirmRemoveAuth(auth) {
      this.pendingAuthToRemove = auth;
      this.$nextTick(() => {
        this.$root.$emit('bv::show::modal', 'confirm-remove-auth');
      });
    },
    hideConfirmModal() {
      this.pendingAuthToRemove = null;
      this.$root.$emit('bv::hide::modal', 'confirm-remove-auth');
    },
    removeAuth() {
      try {
        if (!this.pendingAuthToRemove) return;
        const type = this.pendingAuthToRemove.type;
        // Update local user object
        this.user.authenticators = (this.user.authenticators || []).filter(a => a.type !== type);
        // Commit updated user to store
        this.$store.commit('mainStore/setUserDetails', this.user);
        this.notifySuccess('Authenticator removed');
      } catch (e) {
        this.notifyErr('Failed to remove authenticator');
      } finally {
        this.pendingAuthToRemove = null;
        this.$root.$emit('bv::hide::modal', 'confirm-remove-auth');
      }
    },
  },
  mixins: [UtilsMixin],
};
</script>

