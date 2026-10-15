<template>
  <div class="profile-page">
    <!-- Profile card: same layout as the summary cards on the detail pages -->
    <section class="profile-card">
      <span class="profile-avatar">
        <img v-if="showPhoto" :src="user.profileUrl" alt="" @error="onImageError" />
        <template v-else>{{ initials }}</template>
      </span>
      <div class="profile-main">
        <h2 :title="user.name">{{ user.name || 'Your profile' }}</h2>
        <button type="button" class="profile-email" title="Copy email" @click="copyToClip(user.email, 'Email Id')">
          {{ user.email }} <i class="mdi mdi-content-copy" aria-hidden="true"></i>
        </button>
      </div>

      <div class="profile-stat">
        <label>Role</label>
        <span class="profile-pill is-info">{{ roleLabel }}</span>
      </div>
      <div class="profile-stat">
        <label>Multi-factor auth</label>
        <span class="profile-pill" :class="isMFAEnabled ? 'is-good' : 'is-warn'">
          <i class="mdi" :class="isMFAEnabled ? 'mdi-shield-check' : 'mdi-shield-alert-outline'" aria-hidden="true"></i>
          {{ isMFAEnabled ? 'Enabled' : 'Off' }}
        </span>
      </div>
      <div class="profile-stat">
        <label>Member since</label>
        <strong>{{ formatDay(user.createdAt) }}</strong>
        <span class="profile-muted">Updated {{ formatDay(user.updatedAt) }}</span>
      </div>

      <div class="profile-actions">
        <hf-buttons v-if="!isMFAEnabled" name="Set up MFA" iconClass="mdi mdi-shield-key-outline" @executeAction="onSetupMFA"></hf-buttons>
        <hf-buttons name="Log out" iconClass="mdi mdi-logout" customClass="btn btn-outline-danger" @executeAction="onLogout"></hf-buttons>
      </div>
    </section>

    <div class="profile-grid">
      <!-- Security: the authenticator apps protecting this account -->
      <section class="profile-section">
        <SectionHeader title="Security" description="Authenticator apps that protect your sign-in." />
        <ul v-if="activeAuthenticators.length" class="settings-list">
          <li v-for="auth in activeAuthenticators" :key="auth.type" class="auth-row">
            <span class="auth-icon" aria-hidden="true"><i class="mdi" :class="auth.icon"></i></span>
            <div class="auth-main">
              <strong>{{ auth.name }}</strong>
              <span>Used for multi-factor authentication</span>
            </div>
            <button type="button" class="link-danger" @click="confirmRemoveAuth(auth.raw)">Remove</button>
          </li>
        </ul>
        <div v-else class="mfa-callout">
          <i class="mdi mdi-shield-alert-outline" aria-hidden="true"></i>
          <div>
            <strong>Multi-factor authentication is off</strong>
            <p>Add an authenticator app so a password alone isn't enough to sign in. It's required to take an app live.</p>
            <hf-buttons name="Set up MFA" iconClass="mdi mdi-shield-key-outline" @executeAction="onSetupMFA"></hf-buttons>
          </div>
        </div>
      </section>

      <!-- Permissions, grouped by service -->
      <section class="profile-section">
        <SectionHeader title="Permissions" :description="`${totalPermissionsCount} ${totalPermissionsCount === 1 ? 'permission' : 'permissions'} across your services.`" />
        <ul v-if="totalPermissionsCount" class="settings-list">
          <li v-for="(items, serviceType) in groupedAccess" :key="serviceType" class="perm-group">
            <div class="perm-head">
              <i class="mdi" :class="serviceIcon(serviceType)" aria-hidden="true"></i>
              <strong>{{ formatServiceType(serviceType) }}</strong>
              <span class="perm-count">{{ items.length }}</span>
            </div>
            <div class="perm-pills">
              <span v-for="access in items" :key="access.access" class="perm-pill" :class="{ 'is-all': access.access === 'ALL' }" :title="access.access">
                {{ formatAccess(access.access) }}
              </span>
            </div>
          </li>
        </ul>
        <p v-else class="profile-muted">No permissions assigned.</p>
      </section>
    </div>

    <!-- Popups -->
    <hf-pop-up id="setup-mfa-popup" Header="Set up MFA">
      <SetupMFA @closePopup="onPopupClose" />
    </hf-pop-up>

  <hf-pop-up id="confirm-remove-auth" Header="Remove authenticator">
    <div class="mfa-remove">
      <p class="mfa-remove-intro">
        To remove an authenticator, confirm with a current code from that app. You can set it up again at any time.
      </p>

      <div class="mfa-field">
        <label>Authenticator app <span class="required-marker">*</span></label>
        <div class="app-options">
          <button
            v-for="method in removableAuthenticators"
            :key="method.value"
            type="button"
            class="app-option"
            :class="{ active: removeAuthType === method.value }"
            @click="selectRemoveAuthType(method.value)"
          >
            <v-icon small>mdi-cellphone-key</v-icon>
            <span>{{ method.name }}</span>
          </button>
        </div>
      </div>

      <div class="mfa-field">
        <label>6-digit code from the app <span class="required-marker">*</span></label>
        <div class="pin-wrapper">
          <PIN :key="removeAuthPinKey" inputType="number" @pinTakenEvent="pinTakenEventHandler" />
        </div>
        <small v-if="removeAuthError" class="remove-auth-error">{{ removeAuthError }}</small>
      </div>

      <div class="mfa-remove-warning">
        <v-icon x-small>mdi-alert-outline</v-icon>
        <span>If this is your only authenticator, MFA will be turned off for your account.</span>
      </div>

      <div class="confirm-actions">
        <button type="button" class="ghost-button" @click="hideConfirmModal">Cancel</button>
        <button type="button" class="danger-button" @click="removeAuth">Remove authenticator</button>
      </div>
    </div>
  </hf-pop-up>
  </div>
</template>
 

<style scoped>
/* Profile page: summary card on top, then Security and Permissions side by side */
.profile-page { color: #172554; }

.profile-card {
  align-items: stretch;
  background: #fff;
  border: 1px solid #dbe3ef;
  border-radius: 9px;
  display: flex;
  gap: 0;
  margin-bottom: 24px;
  padding: 18px;
}

/* Same avatar as the Business Detail / User Detail cards */
.profile-avatar {
  align-items: center;
  align-self: center;
  background: #e8edf5;
  border-radius: 50%;
  color: #52658a;
  display: flex;
  flex: 0 0 58px;
  font-size: 20px;
  font-weight: 700;
  height: 58px;
  justify-content: center;
  overflow: hidden;
}

.profile-avatar img { height: 100%; object-fit: cover; width: 100%; }

.profile-main {
  align-self: center;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex: 1 1 240px;
  flex-direction: column;
  margin-left: 16px;
  min-width: 180px;
  padding-right: 20px;
}

.profile-main h2 {
  color: #14214a;
  font-size: 16px;
  font-weight: 700;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.profile-email {
  align-items: center;
  align-self: flex-start;
  background: none;
  border: 0;
  color: #7180a5;
  display: inline-flex;
  font-size: 12px;
  gap: 4px;
  margin-top: 4px;
  padding: 0;
}

.profile-email:hover { color: #1d4ed8; }

.profile-stat {
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex: 1 1 130px;
  flex-direction: column;
  padding: 4px 22px 0;
}

.profile-stat label { color: #7180a5; font-size: 11px; margin: 0 0 8px; }
.profile-stat strong { color: #172554; font-size: 14px; }
.profile-muted { color: #7180a5; font-size: 12px; margin-top: 4px; }

.profile-pill {
  align-items: center;
  align-self: flex-start;
  border-radius: 5px;
  display: inline-flex;
  font-size: 13px;
  font-weight: 700;
  gap: 4px;
  padding: 4px 9px;
}

.profile-pill.is-info { background: #eff6ff; color: #1d4ed8; }
.profile-pill.is-good { background: rgba(78, 201, 107, 0.12); color: #2f9e4f; }
.profile-pill.is-warn { background: rgba(255, 193, 7, 0.16); color: #856404; }

.profile-actions {
  align-items: center;
  align-self: center;
  display: flex;
  flex: 0 0 auto;
  gap: 8px;
  padding-left: 22px;
}

.profile-grid {
  display: grid;
  gap: 24px;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr);
}

/* Lists: same bordered list as the Members & roles tabs */
.settings-list {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.settings-list > li + li { border-top: 1px solid #f1f5f9; }

.auth-row {
  align-items: center;
  display: flex;
  gap: 12px;
  padding: 12px 16px;
}

.auth-icon {
  align-items: center;
  background: #eff6ff;
  border-radius: 8px;
  color: #2563eb;
  display: inline-flex;
  flex: 0 0 auto;
  font-size: 18px;
  height: 36px;
  justify-content: center;
  width: 36px;
}

.auth-main { display: flex; flex: 1; flex-direction: column; min-width: 0; }
.auth-main strong { color: #111827; font-size: 14px; font-weight: 600; }
.auth-main span { color: #64748b; font-size: 12px; }

.link-danger {
  background: none;
  border: 0;
  border-radius: 6px;
  color: #c81e1e;
  font-size: 12px;
  font-weight: 700;
  padding: 6px 10px;
}

.link-danger:hover { background: #fef2f2; }

.mfa-callout {
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 10px;
  color: #92400e;
  display: flex;
  gap: 10px;
  padding: 14px 16px;
}

.mfa-callout > .mdi { font-size: 20px; line-height: 1.1; }
.mfa-callout strong { display: block; font-size: 14px; }
.mfa-callout p { color: #78350f; font-size: 13px; margin: 2px 0 12px; }

.perm-group { padding: 12px 16px; }

.perm-head {
  align-items: center;
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.perm-head .mdi { color: #64748b; font-size: 16px; }
.perm-head strong { color: #111827; font-size: 13px; font-weight: 600; }

.perm-count {
  background: #f1f5f9;
  border-radius: 999px;
  color: #475569;
  font-size: 11px;
  font-weight: 700;
  padding: 0 7px;
}

.perm-pills { display: flex; flex-wrap: wrap; gap: 6px; }

.perm-pill {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 5px;
  color: #344054;
  font-size: 12px;
  padding: 2px 8px;
}

.perm-pill.is-all { background: #eff6ff; border-color: #bfdbfe; color: #1d4ed8; font-weight: 600; }

@media (max-width: 1100px) {
  .profile-card { flex-wrap: wrap; }
  .profile-stat { border-top: 1px solid #e2e8f0; margin-top: 16px; padding-top: 14px; }
  .profile-actions { padding: 16px 0 0; width: 100%; }
  .profile-grid { grid-template-columns: minmax(0, 1fr); }
}

@media (max-width: 700px) {
  .profile-main { border-right: 0; }
  .profile-stat { border-right: 0; flex-basis: 50%; padding: 12px 8px 0; }
}

.mfa-remove { color: #273448; }
.mfa-remove-intro { margin: 0 0 18px; color: #718198; font-size: 13px; line-height: 1.5; }

.mfa-field { margin-bottom: 16px; }
.mfa-field > label { display: block; margin-bottom: 6px; color: #475467; font-size: 12px; font-weight: 600; }
.required-marker { color: #dc3545; }

/* Same app cards as the Set up MFA popup */
.app-options { display: flex; flex-wrap: wrap; gap: 10px; }

.app-option {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-width: 200px;
  padding: 10px 14px;
  border: 1px solid #d5dde7;
  border-radius: 8px;
  background: #fff;
  color: #344054;
  font-size: 13px;
  font-weight: 600;
}

.app-option:hover { border-color: #94a3b8; }
.app-option >>> .v-icon { color: #718198 !important; }
.app-option.active { border-color: #2563dc; background: #f1f6ff; color: #2563dc; }
.app-option.active >>> .v-icon { color: #2563dc !important; }

.pin-wrapper { max-width: 320px; }
.pin-wrapper >>> form { margin: 0; }
.pin-wrapper >>> div { margin-top: 0; }

.remove-auth-error { display: block; margin-top: 6px; color: #b42318; font-size: 12px; }

.mfa-remove-warning {
  display: flex;
  gap: 8px;
  margin-bottom: 4px;
  padding: 10px 12px;
  border: 1px solid #f3e1bd;
  border-radius: 6px;
  background: #fff8e8;
  color: #8a611d;
  font-size: 12px;
  line-height: 1.5;
}

.mfa-remove-warning > .v-icon { margin-top: 2px; color: #c08a2e !important; }

.confirm-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  margin-top: 18px;
  padding-top: 14px;
  border-top: 1px solid #e8edf3;
}

.ghost-button, .danger-button {
  min-height: 36px;
  padding: 0 14px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
}

.ghost-button { border: 1px solid transparent; background: transparent; color: #6c757d; }
.ghost-button:hover { background: #f1f5f9; }
.danger-button { border: 1px solid #dc3545; background: #fff; color: #dc3545; }
.danger-button:hover { background: #dc3545; color: #fff; }

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
import PIN from '../../components/login/mfa/PIN.vue';
import HfPopUp from '../element/hfPopup.vue';
import SectionHeader from '../element/SectionHeader.vue';
import EventBus from '../../eventbus';
import { mapActions, mapGetters } from 'vuex/dist/vuex.common.js';
import config from '../../config';
import UtilsMixin from "../../mixins/utils";
import { AUTHENTICATION_METHODS_LIST } from "../../constants/authenticators";

export default {
  name: "UserProfileCard",
  components: {
    SectionHeader,
    SetupMFA,
    PIN,
    HfPopUp,
  },
  data() {
    return {
      user: {},
       hasImageError: false,
      pendingAuthToRemove: null,
      removeAuthType: '',
      authenticationMethodsList: AUTHENTICATION_METHODS_LIST,
      removeAuthCode: '',
      removeAuthError: '',
      removeAuthPinKey: 0,
    };
  },
  mounted() {
    this.user = this.getUserDetails;
    this.openSetupMfaFromRoute(this.$route.query.ref);
  },
  watch: {
    getUserDetails: {
      handler(user) {
        this.user = user || {};
      },
      immediate: true,
      deep: true
    },
    '$route.query.ref'(ref) {
      this.openSetupMfaFromRoute(ref);
    }
  },
  computed: {
    ...mapGetters('mainStore', ['getUserDetails', 'isMFAEnabled']),
    // Only the authenticators this user has actually set up can be removed
    removableAuthenticators() {
      const active = (this.user?.authenticators || []).filter(auth => auth.isTwoFactorAuthenticated);
      return active.map(auth => {
        const known = this.authenticationMethodsList.find(method => method.value === auth.type);
        return { value: auth.type, name: known ? known.name : auth.type };
      });
    },
    showPhoto() {
      return Boolean(this.user && this.user.profileUrl) && !this.hasImageError;
    },
    initials() {
      const source = (this.user && (this.user.name || this.user.email)) || '';
      const words = source.split('@')[0].split(/[\s._-]+/).filter(Boolean);
      return (words.slice(0, 2).map(word => word[0]).join('') || '?').toUpperCase();
    },
    roleLabel() {
      const role = (this.user && this.user.role) || 'ADMIN';
      return role.toLowerCase().split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    },
    // Authenticator apps that are set up, with their display name
    activeAuthenticators() {
      return ((this.user && this.user.authenticators) || [])
        .filter(auth => auth.isTwoFactorAuthenticated)
        .map(auth => {
          const known = this.authenticationMethodsList.find(method => method.value === auth.type);
          return {
            type: auth.type,
            name: known ? known.name : auth.type,
            icon: auth.type === 'google' ? 'mdi-google' : auth.type === 'okta' ? 'mdi-shield-key-outline' : 'mdi-cellphone-key',
            raw: auth,
          };
        });
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
    async openSetupMfaFromRoute(ref) {
      if (ref !== 'mfa') return;
      const user = await this.resolveUserDetails();
      if (this.hasVerifiedAuthenticator(user)) return;

      this.$nextTick(() => {
        this.$root.$emit('bv::show::modal', 'setup-mfa-popup');
      });
    },
    async resolveUserDetails() {
      const user = this.getUserDetails || {};
      try {
        return await this.getMyUserDetails() || user;
      } catch (e) {
        return user;
      }
    },
    hasVerifiedAuthenticator(user) {
      return user?.authenticators?.some(auth => auth.isTwoFactorAuthenticated);
    },
    formatDate(date) {
      return new Date(date).toLocaleString();
    },
    formatDay(date) {
      if (!date) return 'Not available';
      return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    },
    // "READ_SESSION" -> "Read session"; "ALL" -> "Full access"
    formatAccess(access) {
      if (access === 'ALL') return 'Full access';
      const text = String(access || '').toLowerCase().replace(/_/g, ' ');
      return text.charAt(0).toUpperCase() + text.slice(1);
    },
    serviceIcon(serviceType) {
      return {
        [config.SERVICE_TYPES.SSI_API]: 'mdi-badge-account-horizontal-outline',
        [config.SERVICE_TYPES.CAVACH_API]: 'mdi-account-check-outline',
        DASHBOARD: 'mdi-view-dashboard-outline',
      }[serviceType] || 'mdi-shield-check-outline';
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
        case 'DASHBOARD': {
          text = "App management";
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
    onPopupClose(updatedUser) {
      if (updatedUser) {
        this.user = updatedUser;
      }
      this.$root.$emit("bv::hide::modal", "setup-mfa-popup");
    },
   confirmRemoveAuth(auth) {
  this.pendingAuthToRemove = auth;
  this.removeAuthType = auth?.type || '';
  this.removeAuthCode = '';
  this.removeAuthError = '';
  this.removeAuthPinKey += 1;
  this.$nextTick(() => {
    this.$root.$emit('bv::show::modal', 'confirm-remove-auth');
  });
},
    hideConfirmModal() {
      this.pendingAuthToRemove = null;
      this.removeAuthStep = 'confirm';
      this.removeAuthType = '';
      this.removeAuthCode = '';
      this.removeAuthError = '';
      this.$root.$emit('bv::hide::modal', 'confirm-remove-auth');
    },
    ...mapActions('mainStore', ['removeMfaAuthenticator', 'getMyUserDetails']),
    selectRemoveAuthType(type) {
      if (type === this.removeAuthType) return;
      this.removeAuthType = type;
      this.onRemoveAuthTypeChange();
    },
    onRemoveAuthTypeChange() {
      this.removeAuthCode = '';
      this.removeAuthError = '';
      this.removeAuthPinKey += 1;
    },
    pinTakenEventHandler(pin) {
      this.removeAuthCode = pin;
      this.removeAuthError = '';
    },
    async removeAuth() {
      if (!this.pendingAuthToRemove) return;
      if (!this.removeAuthType) {
        this.removeAuthError = 'Authenticator type must be provided';
        return;
      }
      if (!this.removeAuthCode) {
        this.removeAuthError = 'MFA PIN must be provided';
        return;
      }
      try {
        await this.removeMfaAuthenticator({
          authenticatorType: this.removeAuthType,
          twoFactorAuthenticationCode: this.removeAuthCode,
        });
        this.user = this.getUserDetails;
        this.notifySuccess('Authentication method removed successfully');
        this.hideConfirmModal();
      } catch (e) {
        const message = e.message || 'Failed to remove authenticator';
        this.removeAuthError = message;
        this.notifyErr(message);
      }
    },
  },
  mixins: [UtilsMixin],
};
</script>
