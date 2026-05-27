<template>
  <div>
    <load-ing :active.sync="isLoading" :can-cancel="true" :is-full-page="true"></load-ing>

    <!-- ── Row ──────────────────────────────────────────────────── -->
    <div class="team-user-row">

      <!-- Avatar + primary info -->
      <div class="user-identity">
        <v-avatar size="38" color="blue-grey lighten-4" class="user-avatar">
          <span class="avatar-initial">{{ email.charAt(0).toUpperCase() }}</span>
        </v-avatar>
        <div class="user-info">
          <div class="user-email">{{ email }}</div>
          <div class="user-meta" v-if="createdAt">
            <v-icon x-small color="grey lighten-1" class="mr-1">mdi-clock-outline</v-icon>
            <span>{{ createdAt }}</span>
          </div>
        </div>
      </div>

      <!-- Chips / badges -->
      <div class="user-chips">
        <!-- 2FA -->
        <v-chip v-if="twoFactor" x-small color="green lighten-5" text-color="green darken-2" class="chip">
          <v-icon x-small left>mdi-shield-check</v-icon>2FA
        </v-chip>

        <!-- Role -->
        <v-chip
          v-if="assignedRoleId && getAllRoles.length > 0"
          x-small color="orange lighten-5" text-color="orange darken-3" class="chip"
        >
          <v-icon x-small left>mdi-account-key-outline</v-icon>
          {{ getYourRole() ? getYourRole().roleName : '' }}
          &nbsp;·&nbsp;{{ getYourRole() ? getYourRole().permissions.length : 0 }} perms
        </v-chip>

        <!-- Invitation status -->
        <v-chip v-if="invitationStatus" x-small color="green lighten-5" text-color="green darken-2" class="chip">
          <v-icon x-small left>mdi-check-circle-outline</v-icon>Accepted
        </v-chip>
        <v-chip v-else x-small color="amber lighten-5" text-color="amber darken-3" class="chip">
          <v-icon x-small left>mdi-clock-outline</v-icon>Pending
        </v-chip>
      </div>

      <!-- Action buttons -->
      <div class="user-actions">

        <!-- Switch Account — visible outside menu whenever invitation is accepted -->
        <v-tooltip bottom v-if="invitationStatus">
          <template #activator="{ on }">
            <v-btn icon small v-on="on" @click="switchToAdminAccount" class="action-btn">
              <v-icon small color="primary">mdi-swap-horizontal-circle-outline</v-icon>
            </v-btn>
          </template>
          <span>Switch to this account</span>
        </v-tooltip>

        <!-- Hamburger menu -->
        <v-menu offset-y left :close-on-content-click="true">
          <template #activator="{ on }">
            <v-btn icon small v-on="on" class="action-btn">
              <v-icon small color="grey darken-1">mdi-dots-vertical</v-icon>
            </v-btn>
          </template>

          <v-list dense min-width="200">

            <!-- Assign Role sub-section (Members tab, accepted) -->
            <template v-if="invitationStatus && mode === 'Member' && getAllRoles.length > 0">
              <v-subheader class="menu-subheader">Assign Role</v-subheader>
              <v-list-item
                v-for="eachRole in getAllRoles"
                :key="eachRole._id"
                @click="assignRole(eachRole._id, userId)"
              >
                <v-list-item-icon><v-icon small>mdi-shield-account-outline</v-icon></v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ eachRole.roleName }}</v-list-item-title>
                  <v-list-item-subtitle>{{ eachRole.permissions.length }} permissions</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-divider></v-divider>
            </template>

            <!-- Copy invite URL (Member mode) -->
            <v-list-item v-if="mode !== 'Admin'" @click="copyToClip(`${$config.app.url}/#/studio/settings?ref=invitions`, 'Invitation URL')">
              <v-list-item-icon><v-icon small>mdi-link-variant</v-icon></v-list-item-icon>
              <v-list-item-title>Copy Invite URL</v-list-item-title>
            </v-list-item>

            <!-- Copy invite code (Admin mode) -->
            <v-list-item v-if="mode === 'Admin'" @click="copyToClip(inviteCode, 'Invitation Code')">
              <v-list-item-icon><v-icon small>mdi-content-copy</v-icon></v-list-item-icon>
              <v-list-item-title>Copy Invitation Code</v-list-item-title>
            </v-list-item>

            <!-- Accept invitation (Admin mode) -->
            <v-list-item v-if="mode === 'Admin'" @click="acceptedInvition">
              <v-list-item-icon><v-icon small color="green">mdi-check-circle-outline</v-icon></v-list-item-icon>
              <v-list-item-title>Accept Invitation</v-list-item-title>
            </v-list-item>

            <!-- Switch account (Admin mode, accepted) — also in menu for discoverability -->
            <v-list-item v-if="mode === 'Admin' && invitationStatus" @click="switchToAdminAccount">
              <v-list-item-icon><v-icon small color="primary">mdi-swap-horizontal-circle-outline</v-icon></v-list-item-icon>
              <v-list-item-title>Switch Account</v-list-item-title>
            </v-list-item>

            <!-- Delete member -->
            <v-divider v-if="deleteMemberMenu"></v-divider>
            <v-list-item v-if="deleteMemberMenu" @click="deleteAMember" class="delete-item">
              <v-list-item-icon><v-icon small color="red">mdi-trash-can-outline</v-icon></v-list-item-icon>
              <v-list-item-title class="red--text">Delete Member</v-list-item-title>
            </v-list-item>

          </v-list>
        </v-menu>
      </div>
    </div>

    <!-- ── Delete confirmation popup ────────────────────────────── -->
    <hf-pop-up
      v-show="showDeleteConfirm"
      :id="`delete-member-confirm-popup_${email}`"
      Header="Delete Member"
      @hide="resetDeleteMember"
      :hideHeaderClose="true"
    >
      <div>
        <v-alert type="warning" outlined dense class="mb-3">
          Are you sure you want to remove <strong>{{ email }}</strong>?
          They will immediately lose access to all resources in your organisation. This action is permanent.
        </v-alert>
        <div class="d-flex justify-end" style="gap: 8px">
          <v-btn text @click="resetDeleteMember">Cancel</v-btn>
          <v-btn color="red darken-1" depressed dark :loading="isLoading" @click="confirmDeleteMember">
            <v-icon left small>mdi-trash-can-outline</v-icon> Delete
          </v-btn>
        </div>
      </div>
    </hf-pop-up>
  </div>
</template>

<style scoped>
/* ─── Row layout ───────────────────────────────────────────────── */
.team-user-row {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  gap: 12px;
  flex-wrap: wrap;
  min-height: 56px;
  background: #ffffff;
  transition: background 0.1s;
}

.team-user-row:hover {
  background: #f9fafb;
}



/* ─── Left: avatar + email ─────────────────────────────────────── */
.user-identity {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1 1 180px;
  min-width: 0;
}

.user-avatar {
  flex-shrink: 0;
}

.avatar-initial {
  font-size: 15px;
  font-weight: 700;
  color: #4b5563;
}

.user-info {
  min-width: 0;
}

.user-email {
  font-size: 13px;
  font-weight: 600;
  color: #111827 !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 260px;
}

.user-meta {
  display: flex;
  align-items: center;
  font-size: 11px;
  color: #9ca3af;
  margin-top: 1px;
}

/* ─── Middle: chips ────────────────────────────────────────────── */
.user-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  flex: 1 1 120px;
}

.chip {
  font-size: 11px !important;
}

/* ─── Right: action buttons ────────────────────────────────────── */
.user-actions {
  display: flex;
  align-items: center;
  gap: 2px;
  flex-shrink: 0;
}

.action-btn {
  opacity: 0.75;
  transition: opacity 0.15s;
}

.action-btn:hover {
  opacity: 1;
}

/* ─── Menu ─────────────────────────────────────────────────────── */
.menu-subheader {
  font-size: 10px !important;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #9ca3af !important;
  height: 28px !important;
}

.delete-item:hover {
  background: #fef2f2;
}

/* ─── Responsive ───────────────────────────────────────────────── */
@media (max-width: 600px) {
  .user-email { max-width: 160px; }
  .user-chips  { flex: 1 1 100%; order: 3; }
  .user-actions { order: 2; }
}
</style>

<script>
import HfPopUp from "../../components/element/hfPopup.vue";
import UtilsMixin from "../../mixins/utils";
import { mapActions, mapGetters,mapMutations } from "vuex/dist/vuex.common.js";
export default {
  props: {
    assignedRoleId: {
      type: String,
      required: false
    },
    userId: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
    },
    twoFactor: {
      type: Boolean,
      required: false,
      default: false
    },
    numberOfTeams: {
      type: Number,
      required: true,
    },
    invitationStatus: {
      type: Boolean,
      required: true,
    },
    inviteCode: {
      type: String,
      required: true
    },
    acceptInvitionMenu: {
      type: Boolean,
      required: false,
      default: false,
    },
    deleteMemberMenu: {
      type: Boolean,
      required: false,
      default: false,
    },
    createdAt: {
      type: String,
      required: false,
    },
    mode: {
      type: String,
      required: false,
      default: 'Admin' // 'Member'
    }
  },
  data() {
    return {
      isLoading: false,
      showDeleteConfirm: false,
    }
  },
   components: {
    HfPopUp,
   },
  computed: {
    ...mapGetters('mainStore', ['getAllRoles'])
  },
  methods: {
    ...mapActions("mainStore", ["deleteMember", "acceptInvition", "attachMemberToARole", "switchToAdmin"]),
    ...mapMutations('mainStore', ['insertAllApps', 'setSwitchedTenantAccount']),
    copyToClip(textToCopy, contentType) {
      if (textToCopy) {
        navigator.clipboard
          .writeText(textToCopy)
          .then(() => {
            this.notifySuccess(`${contentType} copied to clipboard!`);
          })
          .catch((err) => {
            this.notifyErr("Error while copying", err);
          });
      }
    },
  async deleteAMember() {
    this.showDeleteConfirm = true;
    this.$root.$emit("bv::show::modal", `delete-member-confirm-popup_${this.email}`);
  },
  async confirmDeleteMember() {
    try {
      this.isLoading = true;
      await this.deleteMember(this.email);
      this.notifySuccess(`${this.email} successfully deleted`);
      this.$root.$emit("bv::hide::modal", `delete-member-confirm-popup_${this.email}`);
    } catch (e) {
      this.notifyErr(e.message);
    } finally {
      this.isLoading = false;
      this.showDeleteConfirm = false;
    }
  },
  resetDeleteMember(){
    this.showDeleteConfirm = false;
    this.isLoading = false;
    this.$root.$emit("bv::hide::modal",`delete-member-confirm-popup_${this.email}`);
  },
   async acceptedInvition() {
      try {
        this.isLoading = true;
        await this.acceptInvition(this.inviteCode.trim());
        this.notifySuccess(`The Invition successfully accepted, now you can access the team`)
        this.isLoading = false;
      } catch (e) {
        this.notifyErr(e.message)
        this.isLoading = false;
      }
    },
    getYourRole() {
      const role = this.getAllRoles.filter(x => x._id == this.assignedRoleId)
      if (role && role.length > 0) {
        return {
          ...role[0]
        }
      }
    },
    async assignRole(roleId, userId) {
      try {
        this.isLoading = true
        await this.attachMemberToARole({
          roleId, userId
        })
        this.isLoading = false
        this.notifySuccess('Memeber is successfully linked with the role')
      } catch (e) {
        this.notifyErr(e.message)
        this.isLoading = false
      }
    },

    async switchToAdminAccount() {
      try {
        this.isLoading = true
        await this.switchToAdmin({
          adminId: this.userId
        })
        this.setSwitchedTenantAccount(this.email)
        this.insertAllApps({ data: [], totalCount: 0 })
        this.isLoading = false
        this.notifySuccess('Succefully switch to tenant account')
        this.$router.push("dashboard").then(() => { this.$router.go(0) });
      } catch (e) {
        this.notifyErr(e.message)
        this.isLoading = false
      }
    },


  },
  mixins: [UtilsMixin],
};
</script>
