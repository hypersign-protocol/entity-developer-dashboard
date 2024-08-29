<template>

  <b-list-group-item class="d-flex align-items-center" style="min-height: 70px">
    <load-ing :active.sync="isLoading" :can-cancel="true" :is-full-page="true"></load-ing>

    <b-avatar variant="primary" text="VB" class="mr-2"></b-avatar>
    <span class="mr-auto">{{ email }}</span>
    <span class="mx-1" style="color: grey" v-if="twoFactor"><b-icon icon="check-circle" aria-hidden="true"
        variant="success"></b-icon>
      2FA</span>
    <span class="mx-1" style="color: grey" v-else><b-icon icon="x-circle" aria-hidden="true" variant="danger"></b-icon>
      2FA</span>
    <b-badge pill variant="info" class="mx-1">{{ numberOfTeams }} teams</b-badge>
    <b-badge pill variant="success" class="mx-1" v-if="invitationStatus">
      <span class="mx-1" style="color: white">Accepted </span></b-badge>
    <b-badge pill variant="warning" class="mx-1" v-else>
      <span class="mx-1" style="color: white">Pending </span></b-badge>
    <b-dropdown size="sm" variant="link" toggle-class="text-decoration-none" no-caret dropleft>
      <template #button-content>
        <b-icon style="color: grey" icon="list" aria-hidden="true"></b-icon>
      </template>
      <b-dropdown-item-button style="text-align: left" @click="copyToClip(inviteCode, 'Invition Code')"><i
          class="far fa-copy mt-1" aria-hidden="true"></i> Invition
        Code</b-dropdown-item-button>
      <b-dropdown-item-button style="text-align: left" @click="deleteAMember()"><i class="fa fa-trash mt-1"></i>
        Delete Member</b-dropdown-item-button>
    </b-dropdown>
  </b-list-group-item>
</template>

<script>
import UtilsMixin from "../../mixins/utils";
import { mapActions } from "vuex/dist/vuex.common.js";
export default {
  props: {
    email: {
      type: String,
      required: true,
    },
    twoFactor: {
      type: Boolean,
      required: true,
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
    }
  },
  data() {
    return {
      isLoading: false
    }
  },
  methods: {
    ...mapActions("mainStore", ["deleteMember"]),
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
    }
  },
  mixins: [UtilsMixin],
};
</script>
