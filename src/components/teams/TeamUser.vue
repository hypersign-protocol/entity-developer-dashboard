<template>

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
    <b-dropdown class="m-2" size="sm" variant="link" toggle-class="text-decoration-none" no-caret dropleft>
      <template #button-content>
        <b-icon style="color: grey" icon="list" aria-hidden="true"></b-icon>
      </template>
      <b-dropdown-group id="dropdown-group-1" header="Assign Role" style="text-align: left;">
        <b-dropdown-item-button style="text-align: left" v-for="eachRole in getAllRoles" v-bind:key="eachRole"
          @click="assignRole(eachRole._id, userId)">
          <!-- <button type="submit" class="btn btn-outline-secondary"> -->
          {{ eachRole.roleName }}
          <b-badge pill variant="warning">{{ eachRole.permissions.length }}
            permissions</b-badge>
          <!-- </button> -->
        </b-dropdown-item-button>
      </b-dropdown-group>

      <b-dropdown-divider></b-dropdown-divider>
      <b-dropdown-item-button style="text-align: left" @click="copyToClip(inviteCode, 'Invition Code')"><i
          class="far fa-copy mt-1" aria-hidden="true"></i> Invition Code
      </b-dropdown-item-button>
      <b-dropdown-item-button v-if="deleteMemberMenu" style="text-align: left" @click="deleteAMember()"><i
          class="fa fa-trash mt-1"></i>
        Delete</b-dropdown-item-button>
      <b-dropdown-item-button v-if="acceptInvitionMenu" style="text-align: left" @click="acceptedInvition()"><b-icon
          icon="hand-thumbs-up"></b-icon>
        Accept Invition</b-dropdown-item-button>





      <!-- <b-dropdown-group id="dropdown-group-2" header="Assign Roles">
        
      </b-dropdown-group> -->

    </b-dropdown>
  </b-list-group-item>
</template>

<script>
import UtilsMixin from "../../mixins/utils";
import { mapActions, mapGetters } from "vuex/dist/vuex.common.js";
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
    }
  },
  data() {
    return {
      isLoading: false
    }
  },
  computed: {
    ...mapGetters('mainStore', ['getAllRoles'])
  },
  methods: {
    ...mapActions("mainStore", ["deleteMember", "acceptInvition", "attachMemberToARole"]),
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
      try {

        const result = confirm("Are you sure you want to delete this member?")

        if (result) {
          this.isLoading = true;
          await this.deleteMember(this.email)
          this.isLoading = false;
          this.notifySuccess(`${this.email} successfully deleted`)
        }


      } catch (e) {
        this.notifyErr(e.message)
      }
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
      console.log(role)
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
    }
  },
  mixins: [UtilsMixin],
};
</script>
