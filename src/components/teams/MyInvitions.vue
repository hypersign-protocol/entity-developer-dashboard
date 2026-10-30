<template>
  <div data-tour="settings-invitations-overview">
    <load-ing :active.sync="isLoading" :can-cancel="true" :is-full-page="true"></load-ing>
    <SectionHeader data-tour="settings-invitations-actions" title="My Invitations" description="Invitations you've received to join other teams. Accept one to switch into that team's dashboard.">
      <hf-buttons name="Accept Invitation" variant="primary" iconClass="fa fa-envelope-open" @executeAction="acceptInvitePopup"></hf-buttons>
      <hf-buttons name="" title="Reload" :bIcon="true" iconClass="fas fa-sync-alt" @executeAction="getInvitions"></hf-buttons>
    </SectionHeader>

    <ul v-if="getMyInvitions.length > 0" class="settings-list" data-tour="settings-invitations-list">
      <li v-for="person in getMyInvitions" :key="person.adminId">
        <TeamUser :email="person.adminEmailId" :twoFactor="person.authenticatorEnabled"
          :invitationStatus="person.accepted" :createdAt="toDateTime(person.createdAt)" :acceptInvitionMenu="true"
          :inviteCode="person.inviteCode" :userId="person.adminId" :numberOfTeams="0" :mode="'Admin'" />
      </li>
    </ul>
    <div v-else data-tour="settings-invitations-list">
      <empty-container title="No Invitation Found" icon="fa fa-envelope"
        description="Invitations to join other teams will appear here." />
    </div>

    <!-- <div class="row mb-3" style="padding: 20px">No member found, please invite a member to your account!</div> -->
    <hf-pop-up id="accept-invition" Header="Accept Invitation">
      <form>
        <div class="form-group mb-3">
          <label for="exampleInputEmail1">Invitation code</label>
          <div class="input-group">
            <input type="email" class="form-control" placeholder="Enter invitation code" v-model="invitionCodeToAccept" />
            <div class="input-group-append">
              <button type="submit" class="hf-btn hf-btn--primary" style="height: 38px" @click="acceptedInvition">
                 Accept
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
import SectionHeader from "../element/SectionHeader.vue";
import UtilsMixin from "../../mixins/utils";
export default {
  name: "TeamsMembers",
  components: {
    SectionHeader,
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
      if(this.$route.query.code){
        this.isLoading = true;
        this.invitionCodeToAccept = this.$route.query.code;
        await this.acceptedInvition();
        this.isLoading = false; 
      }
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

<style scoped>
/* Bordered list with dividers, aligned with the tabs and header above */
.settings-list {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.settings-list > li + li {
  border-top: 1px solid #f1f5f9;
}
</style>
