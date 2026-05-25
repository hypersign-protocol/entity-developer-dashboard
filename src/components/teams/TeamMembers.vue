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
          <div class="mb-3">
            <label class="field-label">Email Address <span class="required">*</span></label>
            <v-text-field
              v-model="inviteeEmailId"
              placeholder="user@company.com"
              outlined
              dense
              hide-details="auto"
              :error-messages="inviteeEmailId && !checkIfValidEmail ? ['Enter a valid email address'] : []"
              prepend-inner-icon="mdi-email-outline"
              type="email"
            ></v-text-field>
          </div>
          <div class="mb-3">
            <label class="field-label">Assign Role <span class="required">*</span></label>
            <v-select
              v-model="selectedRoleId"
              :items="getAllRoles"
              item-text="roleName"
              item-value="_id"
              outlined
              dense
              hide-details="auto"
              :disabled="!getAllRoles || getAllRoles.length === 0"
              placeholder="Select a role"
              prepend-inner-icon="mdi-shield-account-outline"
            >
              <template #no-data>
                <div class="px-4 py-2 text--secondary caption">No roles found. Create a role first.</div>
              </template>
            </v-select>
            <small v-if="getAllRoles && getAllRoles.length === 0" class="text--secondary">No role found, please create a role to proceed</small>
          </div>
          <v-btn color="primary" depressed :disabled="!checkIfValidEmail || !selectedRoleId" @click="sendInvite" class="mt-1">
            <v-icon left small>mdi-send</v-icon> Send Invitation
          </v-btn>
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
          <div class="text-right mt-3">
            <v-btn text small @click="resetInvition()">Invite Another</v-btn>
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

.field-label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.required {
  color: #ef4444;
}
</style>
