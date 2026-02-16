<template>
<div>
    <b-list-group-item class="d-flex align-items-center" style="min-height: 70px">
      <load-ing :active.sync="isLoading" :can-cancel="true" :is-full-page="true"></load-ing>

      <b-avatar variant="secondary" :text="email.charAt(0).toUpperCase()" class="mr-2"></b-avatar>
      <span class="mr-auto">{{ email }}</span>


      <span class="mx-1" style="color: grey" v-if="createdAt">
        <b-icon icon="clock" aria-hidden="true" variant="secondary"></b-icon>
        {{ createdAt }}
      </span>

      <span class="mx-1" style="color: grey" v-if="twoFactor"><b-icon icon="check-circle" aria-hidden="true"
          variant="success"></b-icon>
        2FA</span>
      <!-- <b-badge pill variant="info" class="mx-1">{{ numberOfTeams }} teams</b-badge> -->
      <b-badge pill variant="warning" class="mx-1" v-if="assignedRoleId && getAllRoles.length > 0">
        <span class="mx-1"><b-icon icon="person-fill" variant=" light"></b-icon> Role:{{
          getYourRole().roleName
          }}
        </span>
      </b-badge>
      <b-badge pill variant="warning" class="mx-1" v-if="assignedRoleId && getAllRoles.length > 0">
        {{
          getYourRole().permissions.length
        }} permissions
      </b-badge>

      <b-badge pill variant="success" class="mx-1" v-if="invitationStatus">
        <span class="mx-1" style="color: white"><b-icon icon="check" variant=" light"></b-icon>Accepted
        </span></b-badge>
      <b-badge pill variant="warning" class="mx-1" v-else>
        <span class="mx-1" style="color: white">Pending </span></b-badge>
      
      <b-dropdown class="m-2" size="sm" variant="link" toggle-class="text-decoration-none" menu-class="dropDownPopup" no-caret dropleft>
        <template #button-content>
          <b-icon style="color: grey" icon="list" aria-hidden="true"></b-icon>
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
         <b-dropdown-item-button v-if="mode == 'Admin'" style="text-align: left" @click="copyToClip(inviteCode, 'Invition Code')"><i
          class="far fa-copy mt-1" aria-hidden="true"></i> Invition Code
      </b-dropdown-item-button>
        <b-dropdown-item-button v-if="deleteMemberMenu" style="text-align: left" @click="deleteAMember()"><i
            class="fa fa-trash mt-1"></i> Delete Member</b-dropdown-item-button>
        <b-dropdown-item-button v-if="mode == 'Admin'" style="text-align: left" @click="acceptedInvition()"><b-icon
            icon="hand-thumbs-up"></b-icon> Accept Invition</b-dropdown-item-button>

        <b-dropdown-item-button v-if="mode == 'Admin' && invitationStatus" style="text-align:left"
          @click="switchToAdminAccount()"><b-icon icon="box-arrow-in-right"></b-icon> Switch
          Account</b-dropdown-item-button>

      </b-dropdown>
    </b-list-group-item>
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
      console.log('Deleting member:', this.email);
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
