<template>
  <div>
    <load-ing :active.sync="isLoading" :can-cancel="true" :is-full-page="true"></load-ing>
    <div class="row">
      <div class="col-md-4">
      </div>
      <div class="col-md-8">
        <hf-buttons name="" title="Reload" class="mx-1" :bIcon="true"  style="float: inline-end"  iconClass="arrow-clockwise" @executeAction="getInvitions">
                </hf-buttons>
                <hf-buttons name="Accept Invition" title="Reload" style="float: inline-end"  iconClass="fa fa-gamepad" @executeAction="acceptInvitePopup">
                </hf-buttons>

      </div>
    </div>
    <div class="row mb-1" v-if="getMyInvitions.length > 0">
      <table class="table">
        <tbody>
          <tr v-for="person in getMyInvitions" :key="person.adminId">
            
            <TeamUser :email="person.adminEmailId" :twoFactor="person.authenticatorEnabled"
              :invitationStatus="person.accepted" :createdAt="toDateTime(person.createdAt)" :acceptInvitionMenu="true"
              :inviteCode="person.inviteCode" :userId="person.adminId" :numberOfTeams="0" :mode="'Admin'" />
              

          </tr>
        </tbody>
      </table>
    </div>
    <div v-else>
      <h4>No Invition(s) Found!</h4>
    </div>

    <!-- <div class="row mb-3" style="padding: 20px">No member found, please invite a member to your account!</div> -->
    <hf-pop-up id="accept-invition" Header="Accept Invition">
      <form>
        <div class="form-group mb-3">
          <label for="exampleInputEmail1">Invition Code:</label>
          <div class="input-group">
            <input type="email" class="form-control" placeholder="Enter invition code" v-model="invitionCodeToAccept" />
            <div class="input-group-append">
              <button type="submit" class="btn btn-secondary" @click="acceptedInvition">
                <b-icon icon="hand-thumbs-up-fill"></b-icon> Accept
              </button>
            </div>
          </div>
        </div>
      </form>
    </hf-pop-up>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex/dist/vuex.common.js";
import HfPopUp from "../element/hfPopup.vue";
import TeamUser from "./TeamUser.vue";
import UtilsMixin from "../../mixins/utils";
export default {
  name: "TeamsMembers",
  components: {
    HfPopUp,
    TeamUser
  },
  computed: {
    ...mapGetters('mainStore', ['getMyInvitions'])
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
      await this.getInvitions();
      this.isLoading = false
    } catch (e) {
      console.error(e.message)
      this.notifyErr(`${e.message}`);
      this.isLoading = false
    }

  },
  methods: {
    ...mapActions("mainStore", ["getInvitions", "acceptInvition"]),

    acceptInvitePopup(action = 'show') {
      if (action === 'show') {
        this.$root.$emit("bv::show::modal", "accept-invition");
      } else {
        this.$root.$emit("bv::hide::modal", "accept-invition");
      }

    },

    async acceptedInvition() {
      try {
        if (!this.invitionCodeToAccept) {
          throw new Error('Enter invition code to accept');
        }
        this.isLoading = true;
        await this.acceptInvition(this.invitionCodeToAccept.trim());
        this.notifySuccess('Invition successfully accepted')
        this.isLoading = false;
      } catch (e) {
        this.isLoading = false;
        this.notifyErr(`${e.message}`);
        this.error = e.message
      } finally {
        this.invitionCodeToAccept = ""
        this.acceptInvitePopup('hide')
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
