<template>
  <div>
    <load-ing :active.sync="isLoading" :can-cancel="true" :is-full-page="true"></load-ing>
    <div class="row mb-3">
      <div class="col-md-4">
        <!-- <div class="input-group">
          <div class="input-group-prepend" style="cursor: grab">
            <span class="input-group-text" id="basic-addon2"><i class="fa fa-search" aria-hidden="true"></i></span>
          </div>
          <input type="text" class="form-control" placeholder="Find a member" aria-label="Find a member"
            aria-describedby="basic-addon2" v-model="sessionIdTemp" />
        </div> -->
      </div>
      <div class="col-md-8">

        <button type="button" class="btn btn-outline-secondary mx-1" style="float: inline-end"
          @click="getPeopleMembers()" title="Reload">
          <i class="fa fa-retweet" aria-hidden="true"></i>
        </button>

        <button type="button" class="btn btn-primary" style="float: inline-end" @click="inviteMemberPopup()">
          <b-icon icon="person-plus-fill"></b-icon> Invite Member
        </button>


      </div>
    </div>
    <div class="row mb-3" style="padding: 10px" v-if="getAdminMembersgetter.length > 0">
      <table class="table">
        <thead class="thead-light">
          <tr>
            <th scope="col">Members</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="person in getAdminMembersgetter" :key="person.userId">
            <TeamUser :email="person.userEmailId" :twoFactor="person.authenticatorEnabled"
              :invitationStatus="person.accepted" :createdAt="toDateTime(person.createdAt)" :deleteMemberMenu="true"
              :inviteCode="person.inviteCode" :numberOfTeams="0" :userId="person.userId"
              :assignedRoleId="person.roleId" />
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else>
      <h4>No Member(s) Found!</h4>
    </div>

    <!-- <div class="row mb-3" style="padding: 20px">No member found, please invite a member to your account!</div> -->

    <hf-pop-up id="invite-member" Header="Invite New Member">
      <div>
        <div class="form-group mb-3">
          <label for="exampleInputEmail1">Email:</label>
          <div class="input-group">
            <input type="email" class="form-control" placeholder="Enter email id of a valid platform user"
              v-model="inviteeEmailId" />
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
            <div class="input-group-append">
              <button type="submit" class="btn btn-primary" @click="sendInvite">
                <b-icon icon="share"></b-icon> Invite
              </button>
            </div>

            <small style="color:grey; font-size: x-small;">Please make sure the user has an account on this
              platform, if
              not, ask him/her to
              create one</small>

          </div>
          <div class="mt-2" v-if="invitionData.inviteCode != ''">
            <p>
              <small>
                Copy the invition code and send to {{ inviteeEmailId }}. Alternatively, invitee can also see and accept
                the invition from
                their dashboard. The code is only valid till {{
                  toDateTime(invitionData.invitationValidTill) }}.
              </small>
            </p>
            <HfFlashNotification class="mt-2" :text="`${invitionData.inviteCode}`" type="Invition Code"
              description="Invition Code" @click="resetInvition()"></HfFlashNotification>
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
      return isValidEmail(this.inviteeEmailId)
    }
  },
  data: function () {
    return {
      isLoading: false,
      invitionCodeToAccept: "",
      inviteeEmailId: "",
      sessionIdTemp: "",
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
  async mounted() {
    try {
      this.isLoading = true;
      await this.getPeopleMembers();
      this.getMyRolesAction()

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
        this.invitionData = await this.inviteMember(email.trim());
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
