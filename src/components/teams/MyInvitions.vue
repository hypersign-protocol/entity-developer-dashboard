<template>
  <div class="my-invitations-root">
    <load-ing :active.sync="isLoading" :can-cancel="true" :is-full-page="true"></load-ing>

    <!-- ── Action bar ────────────────────────────────────────── -->
    <div class="action-bar">
      <div class="action-bar-title">
        <v-icon small class="mr-1" color="#4b5563">mdi-email-check-outline</v-icon>
        <span>My Invitations
          <v-chip x-small class="ml-2" color="blue lighten-5" text-color="blue darken-2">
            {{ getMyInvitions.length }}
          </v-chip>
        </span>
      </div>
      <div class="action-bar-btns">
        <hf-buttons name="" title="Reload" iconClass="mdi-refresh" @executeAction="getInvitions" />
        <hf-buttons name="Accept Invitation" iconClass="mdi-check-circle-outline" @executeAction="acceptInvitePopup" />
      </div>
    </div>

    <v-divider class="mb-3"></v-divider>

    <!-- ── Invitation list ────────────────────────────────────── -->
    <div v-if="getMyInvitions.length > 0" class="member-list">
      <div v-for="person in getMyInvitions" :key="person.adminId" class="member-row">
        <TeamUser
          :email="person.adminEmailId"
          :twoFactor="person.authenticatorEnabled"
          :invitationStatus="person.accepted"
          :createdAt="toDateTime(person.createdAt)"
          :acceptInvitionMenu="true"
          :inviteCode="person.inviteCode"
          :userId="person.adminId"
          :numberOfTeams="0"
          :mode="'Admin'"
        />
        <v-divider></v-divider>
      </div>
    </div>
    <div v-else>
      <empty-container title="No pending invitations" icon="fa fa-envelope-open-text" />
    </div>

    <!-- ── Accept Invitation Popup ──────────────────────────────── -->
    <hf-pop-up id="accept-invition" Header="Accept Invitation">
      <div>
        <div class="form-group">
          <label for="inviteCode"><strong>Invitation Code <span style="color:red">*</span>:</strong></label>
          <input
            type="text"
            class="form-control"
            id="inviteCode"
            v-model="invitionCodeToAccept"
            placeholder="Paste your invitation code here"
            @keyup.enter="acceptedInvition"
          />
          <small v-if="error" class="text-danger">{{ error }}</small>
        </div>
        <div class="text-center mt-3">
          <hf-buttons name="Cancel" customClass="btn btn-outline-secondary" @executeAction="acceptInvitePopup('hide')" />
          <hf-buttons name="Accept" customClass="btn btn-primary ml-2" iconClass="mdi-check" @executeAction="acceptedInvition" />
        </div>
      </div>
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
.my-invitations-root {
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
