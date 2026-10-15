<template>
<div>
    <div class="member-row">
      <load-ing :active.sync="isLoading" :can-cancel="true" :is-full-page="true"></load-ing>

      <span class="member-avatar" aria-hidden="true">{{ email.charAt(0).toUpperCase() }}</span>
      <div class="member-main">
        <strong class="member-email" :title="email">{{ email }}</strong>
        <span class="member-sub">
          <template v-if="createdAt">
            <i class="mdi mdi-clock-outline" aria-hidden="true"></i>{{ mode === 'Admin' ? 'Invited you' : 'Invited' }} {{ createdAt }}
          </template>
          <template v-if="twoFactor">
            <span class="member-sep" aria-hidden="true">·</span>
            <i class="mdi mdi-shield-check-outline is-good" aria-hidden="true"></i>2FA on
          </template>
        </span>
      </div>

      <div class="member-tags">
        <template v-if="assignedRoleId && getAllRoles.length > 0 && getYourRole()">
          <span class="member-tag"><i class="mdi mdi-account-key-outline" aria-hidden="true"></i>{{ getYourRole().roleName }}</span>
          <span class="member-tag is-muted">{{ getYourRole().permissions.length }} permissions</span>
        </template>
        <span class="member-status" :class="invitationStatus ? 'is-accepted' : 'is-pending'">
          <i class="mdi" :class="invitationStatus ? 'mdi-check-circle' : 'mdi-clock-outline'" aria-hidden="true"></i>
          {{ invitationStatus ? 'Accepted' : 'Pending' }}
        </span>
      </div>

      <button
        v-if="mode == 'Admin' && invitationStatus"
        type="button"
        class="member-icon-btn"
        title="Switch to this account"
        aria-label="Switch to this account"
        @click="switchToAdminAccount()"
      >
        <i class="mdi mdi-login-variant" aria-hidden="true"></i>
      </button>

      <b-dropdown class="member-menu" size="sm" variant="link" toggle-class="text-decoration-none member-icon-btn" menu-class="dropDownPopup" no-caret dropleft>
        <template #button-content>
          <i class="mdi mdi-dots-vertical" aria-label="More actions"></i>
        </template>
        <b-dropdown-group id="dropdown-group-1" header="Assign Role" style="text-align: left;"
          v-if="invitationStatus && mode == 'Member'">
          <b-dropdown-item-button style="text-align: left" v-for="eachRole in getAllRoles" v-bind:key="eachRole._id"
            @click="assignRole(eachRole._id, userId)">
            <!-- <button type="submit" class="btn btn-outline-secondary"> -->
            {{ eachRole.roleName }}
            <b-badge pill variant="warning">{{ eachRole.permissions.length }}
              permissions</b-badge>
            <!-- </button> -->
          </b-dropdown-item-button>
          <b-dropdown-divider></b-dropdown-divider>
        </b-dropdown-group>


        <b-dropdown-item-button v-if="mode !== 'Admin'" style="text-align: left" @click="copyToClip(`${$config.app.url}/#/studio/settings?ref=invitions`, 'Invitation Url')"><i
            class="far fa-copy mt-1" aria-hidden="true"></i> Invite Url
        </b-dropdown-item-button>
         <b-dropdown-item-button v-if="mode == 'Admin'" style="text-align: left" @click="copyToClip(inviteCode, 'Invitation Code')"><i
          class="far fa-copy mt-1" aria-hidden="true"></i> Invitation Code
      </b-dropdown-item-button>
        <b-dropdown-item-button v-if="deleteMemberMenu" style="text-align: left" @click="deleteAMember()"><i
            class="fa fa-trash mt-1"></i> Delete Member</b-dropdown-item-button>
        <b-dropdown-item-button v-if="mode == 'Admin'" style="text-align: left" @click="acceptedInvition()"><b-icon
            icon="hand-thumbs-up"></b-icon> Accept Invitation</b-dropdown-item-button>

        <b-dropdown-item-button v-if="mode == 'Admin' && invitationStatus" style="text-align:left"
          @click="switchToAdminAccount()"><b-icon icon="box-arrow-in-right"></b-icon> Switch
          Account</b-dropdown-item-button>

      </b-dropdown>
    </div>
    <hf-pop-up
     v-show="showDeleteConfirm"
      :id="`delete-member-confirm-popup_${email}`"
      Header="Delete Member"
      @hide="resetDeleteMember"
      :hideHeaderClose="true">
    <div>
      <span class="warning-icon">⚠️</span> 
      <span class="warning-text"> Are you sure you want to remove this team member?
      Once removed, they will no longer be able to access your dashboard, resources, or any accounts linked to your organization. This action is permanent.</span>
      <div class="text-center mt-3">
         
        <button type="button" class="btn btn-link" @click="resetDeleteMember()">Cancel</button>
        <hf-buttons 
        name="Delete" 
        class="btn btn-primary text-center" 
        customClass="btn btn-danger"
        iconClass="fa fa-trash-alt" 
        @executeAction="confirmDeleteMember">
        </hf-buttons>

      </div>
    </div>
   </hf-pop-up>
  </div>
</template>

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
        this.notifySuccess(`Invitation accepted. You can now access the team.`)
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
        this.notifySuccess('Succefully switch to tenant account')
        await this.$router.replace({ name: "Home" })
        this.isLoading = false
      } catch (e) {
        this.notifyErr(e.message)
        this.isLoading = false
      }
    },


  },
  mixins: [UtilsMixin],
};
</script>

<style scoped>
/* One member / invitation row inside the bordered list (see TeamMembers, MyInvitions) */
.member-row {
  align-items: center;
  display: flex;
  gap: 12px;
  padding: 12px 16px;
}

/* Same avatar as the Business Detail summary card */
.member-avatar {
  align-items: center;
  background: #e8edf5;
  border-radius: 50%;
  color: #52658a;
  display: inline-flex;
  flex: 0 0 auto;
  font-size: 14px;
  font-weight: 700;
  height: 36px;
  justify-content: center;
  width: 36px;
}

.member-main {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.member-email {
  color: #111827;
  font-size: 14px;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.member-sub {
  align-items: center;
  color: #64748b;
  display: flex;
  flex-wrap: wrap;
  font-size: 12px;
  gap: 4px;
}

.member-sub .mdi {
  font-size: 13px;
}

.member-sub .is-good {
  color: #2f9e4f;
}

.member-sep {
  color: #cbd5e1;
  margin: 0 2px;
}

.member-tags {
  align-items: center;
  display: flex;
  flex: 0 0 auto;
  flex-wrap: wrap;
  gap: 6px;
  justify-content: flex-end;
}

.member-tag {
  align-items: center;
  background: #eff6ff;
  border-radius: 5px;
  color: #1d4ed8;
  display: inline-flex;
  font-size: 12px;
  font-weight: 600;
  gap: 4px;
  padding: 3px 8px;
}

.member-tag.is-muted {
  background: #f1f5f9;
  color: #475569;
}

/* Status pill: same tones as elsewhere in the dashboard */
.member-status {
  align-items: center;
  border-radius: 5px;
  display: inline-flex;
  font-size: 12px;
  font-weight: 700;
  gap: 4px;
  padding: 3px 8px;
}

.member-status.is-accepted { background: rgba(78, 201, 107, 0.12); color: #2f9e4f; }
.member-status.is-pending { background: rgba(255, 193, 7, 0.16); color: #856404; }

.member-icon-btn,
.member-menu >>> .member-icon-btn {
  align-items: center;
  background: transparent;
  border: 0;
  border-radius: 6px;
  color: #64748b;
  display: inline-flex;
  font-size: 18px;
  height: 32px;
  justify-content: center;
  padding: 0;
  width: 32px;
}

.member-icon-btn:hover,
.member-menu >>> .member-icon-btn:hover {
  background: #f1f5f9;
  color: #111827;
}

@media (max-width: 760px) {
  .member-row {
    flex-wrap: wrap;
  }

  .member-tags {
    justify-content: flex-start;
    order: 3;
    width: 100%;
  }
}
</style>
