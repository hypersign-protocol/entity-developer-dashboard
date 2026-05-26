<template>
  <div class="team-members-root">
    <load-ing :active.sync="isLoading" :can-cancel="true" :is-full-page="true"></load-ing>

    <!-- ── Action bar ──────────────────────────────────────────── -->
    <div class="action-bar">
      <div class="action-bar-title">
        <v-icon small class="mr-1" color="#4b5563">mdi-account-multiple-outline</v-icon>
        <span>Team Members
          <v-chip x-small class="ml-2" color="blue lighten-5" text-color="blue darken-2">
            {{ getAdminMembersgetter.length }}
          </v-chip>
        </span>
      </div>
      <div class="action-bar-btns">
        <hf-buttons name="" title="Reload" iconClass="mdi-refresh" @executeAction="getPeopleMembers" />
        <hf-buttons name="Invite Member" iconClass="mdi-account-plus" @executeAction="inviteMemberPopup" />
      </div>
    </div>

    <v-divider class="mb-3"></v-divider>
    <!-- ── Member list ────────────────────────────────────────── -->
    <div v-if="getAdminMembersgetter.length > 0" class="member-list">
      <div v-for="person in getAdminMembersgetter" :key="person.userId" class="member-row">
        <TeamUser
          :email="person.userEmailId"
          :twoFactor="person.authenticatorEnabled"
          :invitationStatus="person.accepted"
          :createdAt="toDateTime(person.createdAt)"
          :deleteMemberMenu="true"
          :inviteCode="person.inviteCode"
          :numberOfTeams="0"
          :userId="person.userId"
          :assignedRoleId="person.roleId"
          :mode="'Member'"
        />
        <v-divider></v-divider>
      </div>
    </div>
    <div v-else>
      <empty-container title="No members yet. Invite someone to get started." icon="fa fa-users" />
    </div>

    <!-- ── Invite Member Popup ────────────────────────────────── -->
    <hf-pop-up id="invite-member" Header="Invite New Member">
      <div>
        <template v-if="invitionData.inviteCode === ''">
          <div class="form-group">
            <label for="inviteeEmail"><strong>Email Address <span style="color:red">*</span>:</strong></label>
            <input
              type="email"
              class="form-control"
              id="inviteeEmail"
              v-model="inviteeEmailId"
              placeholder="user@company.com"
            />
            <small v-if="inviteeEmailId && !checkIfValidEmail" class="text-danger">Enter a valid email address</small>
          </div>
          <div class="form-group">
            <label for="assignRole"><strong>Assign Role <span style="color:red">*</span>:</strong></label>
            <select class="custom-select" id="assignRole" v-model="selectedRoleId" :disabled="!getAllRoles || getAllRoles.length === 0">
              <option value="" disabled>Select a role</option>
              <option v-for="role in getAllRoles" :value="role._id" :key="role._id">{{ role.roleName }}</option>
            </select>
            <small v-if="getAllRoles && getAllRoles.length === 0" class="text-muted">No role found, please create a role to proceed</small>
          </div>
          <div class="text-center mt-3">
            <hf-buttons
              name="Send Invitation"
              iconClass="mdi-send"
              customClass="btn btn-primary"
              @executeAction="sendInvite"
            />
          </div>
        </template>
        <template v-else>
          <v-alert type="success" outlined dense class="mb-3">
            Invitation sent to <strong>{{ inviteeEmailId }}</strong>.
            Valid until <strong>{{ toDateTime(invitionData.invitationValidTill) }}</strong>.
          </v-alert>
          <HfFlashNotification
            :text="invitionData.inviteCode"
            type="Invitation Code"
            description="Invitation Code"
            @click="resetInvition()"
          />
          <div class="text-center mt-3">
            <hf-buttons name="Invite Another" customClass="btn btn-outline-secondary" @executeAction="resetInvition" />
          </div>
        </template>
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

<style scoped>
.team-members-root {
  padding: 4px 0;
}

.action-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 4px;
  flex-wrap: wrap;
  gap: 8px;
}

.action-bar-title {
  display: flex;
  align-items: center;
  font-size: 0.85rem;
  font-weight: 700;
  color: #111827;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.action-bar-btns {
  display: flex;
  align-items: center;
  gap: 6px;
}

.member-list {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  background: #ffffff;
}

.member-row:last-child .v-divider {
  display: none;
}


</style>
