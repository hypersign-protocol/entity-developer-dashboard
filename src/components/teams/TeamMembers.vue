<template>
  <div>
    <load-ing :active.sync="isLoading" :can-cancel="true" :is-full-page="true"></load-ing>
    <div class="row">
      <div class="col-md-4">        
      </div>
      <div class="col-md-8">
        <!-- <v-btn variant="link" class="btn btn-outline-secondary mx-1" style="float: inline-end"
          @click="getPeopleMembers()" title="Reload">
          <b-icon icon="arrow-clockwise"></b-icon>
        </v-btn> -->

        <hf-buttons name="" title="Reload" class="mx-1" :bIcon="true"  style="float: inline-end"  iconClass="arrow-clockwise" @executeAction="getPeopleMembers">
        </hf-buttons>

        <hf-buttons name="Invite Member" class="ml-auto"  style="float: inline-end"  iconClass="fa fa-user-plus" @executeAction="inviteMemberPopup">
        </hf-buttons>

        <!-- <v-btn type="button" class="btn btn-secondary" style="float: inline-end" @click="inviteMemberPopup()">
          <b-icon icon="person-plus-fill"></b-icon> Invite Member
        </v-btn> -->
      </div>
    </div>
    <div class="row" v-if="getAdminMembersgetter.length > 0">
      <table class="table">
        <!-- <thead class="thead-light">
          <tr>
            <th scope="col">Members</th>
          </tr>
        </thead> -->
        <tbody>
          <tr v-for="person in getAdminMembersgetter" :key="person.userId">
            <TeamUser :email="person.userEmailId" :twoFactor="person.authenticatorEnabled"
              :invitationStatus="person.accepted" :createdAt="toDateTime(person.createdAt)" :deleteMemberMenu="true"
              :inviteCode="person.inviteCode" :numberOfTeams="0" :userId="person.userId" :assignedRoleId="person.roleId"
              :mode="'Member'" />
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else>
      <empty-container title="No Member Found" icon="fa fa-user-friends" />
    </div>

    <!-- <div class="row mb-3" style="padding: 20px">No member found, please invite a member to your account!</div> -->

    <hf-pop-up id="invite-member" Header="Invite New Member">
    <div>
    <div class="form-group mb-3">

      <!-- EMAIL INPUT (only if invitation not generated yet) -->
      <label v-if="invitionData.inviteCode === ''">Email:</label>

      <div class="input-group" v-if="invitionData.inviteCode === ''">
        <input
          type="email"
          class="form-control"
          placeholder="user@companymail.com"
          v-model="inviteeEmailId"
        />

        <!-- VALID / INVALID ICON -->
        <div class="input-group-append" v-if="checkIfValidEmail">
          <button type="submit" class="btn btn-outline-success">
            <b-icon icon="check-circle"></b-icon>
          </button>
        </div>

        <div class="input-group-append" v-else>
          <button type="submit" class="btn btn-outline-danger">
            <b-icon icon="x-circle"></b-icon>
          </button>
        </div>
      </div>

      <!-- ROLE DROPDOWN -->
      <div class="form-group mt-3" v-if="invitionData.inviteCode === ''">
        
          <label>Select A Role:</label>
          <select class="form-control" v-model="selectedRoleId" :disabled="getAllRoles.length == 0">
            <option
              v-for="role in getAllRoles"
              :key="role._id"
              :value="role._id"
            >
              {{ role.roleName }}
            </option>
          </select>
          <small v-if="getAllRoles && getAllRoles.length == 0">No role found, please create a role to proceed</small>
      </div>

      <!-- INVITE BUTTON -->
      <div class="input-group-append mt-3" v-if="invitionData.inviteCode === ''">
        <v-btn
          type="submit"
          class="btn btn-secondary"
          :disabled="!checkIfValidEmail || !selectedRoleId"
          @click="sendInvite"
        >
          <b-icon icon="share"></b-icon> Invite
        </v-btn>
      </div>

      <!-- AFTER INVITATION SENT BLOCK -->
      <div class="mt-2" v-if="invitionData.inviteCode !== ''">
        <p>
          <small>
            An invitation has been sent to {{ inviteeEmailId }}.
            The recipient may accept it via the provided email link or through their platform dashboard.
            This invitation is valid until {{
              toDateTime(invitionData.invitationValidTill)
            }}.
          </small>
        </p>

        <HfFlashNotification
          class="mt-2"
          :text="`${invitionData.inviteCode}`"
          type="Invitation Code"
          description="Invitation Code"
          @click="resetInvition()"
        ></HfFlashNotification>
      </div>

    </div>
  </div>
</hf-pop-up>

  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex/dist/vuex.common.js";
import HfPopUp from "../element/hfPopup.vue";
import TeamUser from "./TeamUser.vue";
import HfFlashNotification from "../element/HfFlashNotification.vue";
import UtilsMixin from "../../mixins/utils";

import { isValidEmail } from '../../mixins/fieldValidation'

export default {
  name: "TeamsMembers",
  components: {
    HfPopUp,
    TeamUser,
    HfFlashNotification
  },
  computed: {
    ...mapGetters('mainStore', ['getAdminMembersgetter', "getAllRoles"]),
    checkIfValidEmail() {
      return isValidEmail(this.inviteeEmailId) && this.inviteeEmailId.toLowerCase();
    }
  },
  data: function () {
    return {
      isLoading: false,
      invitionCodeToAccept: "",
      inviteeEmailId: "",
      sessionIdTemp: "",
      selectedRoleId: null,
      error: "",
      invitionData: {
        "invitor": "",
        "invitee": "",
        "inviteCode": "",
        "accepted": false,
        "invitationValidTill": "",
        "acceptedAt": false
      },
    };
  },
  watch: {
    getAllRoles(newRoles) {
      if (
        newRoles &&
        newRoles.length > 0 &&
        !this.selectedRoleId
      ) {
        this.selectedRoleId = newRoles[0]._id
      }
    }
  },
  async mounted() {
    try {
      this.isLoading = true;
      // await this.getPeopleMembers();
      // await this.getMyRolesAction()

      if (this.getAllRoles && this.getAllRoles.length > 0) {
        this.selectedRoleId = this.getAllRoles[0]._id;
      }

      this.isLoading = false
    } catch (e) {
      console.error(e.message)
      this.notifyErr(`${e.message}`);
      this.isLoading = false
    }

  },
  methods: {
    ...mapActions("mainStore", ["inviteMember", "getPeopleMembers", "acceptInvition", "getMyRolesAction"]),
    inviteMemberPopup() {
      this.resetInvition()
      this.$root.$emit("bv::show::modal", "invite-member");
    },
    inviteMemberPopDown() {
      this.$root.$emit("bv::hide::modal", "invite-member");
    },


    async sendInvite() {
      try {

        const email = this.inviteeEmailId;
        //   validate if email id
        if (!email) {
          throw new Error('Email of a valid user must be provided');
        }
        this.isLoading = true;
        this.invitionData = await this.inviteMember({emailId: email.trim(), roleId: this.selectedRoleId});
        this.notifySuccess('Invition successfully generated')
        this.isLoading = false;
        // this.inviteMemberPopDown();
        // this.getPeopleMembers()
      } catch (e) {
        this.isLoading = false;
        this.notifyErr(`${e.message}`);
        this.error = e.message
        this.resetInvition()
      }

    },

    resetInvition() {
      this.invitionData = {
        "invitor": "",
        "invitee": "",
        "inviteCode": "",
        "accepted": false,
        "invitationValidTill": "",
        "acceptedAt": false
      };


      this.inviteeEmailId = ""
      this.error = ""
    },



  },
  mixins: [UtilsMixin],
};
</script>
