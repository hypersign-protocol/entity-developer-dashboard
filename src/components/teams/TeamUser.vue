<template>
  <b-list-group-item class="d-flex align-items-center" style="min-height: 70px">
    <b-avatar variant="primary" text="VB" class="mr-2"></b-avatar>
    <span class="mr-auto">{{ email }}</span>
    <span class="mx-1" style="color: grey" v-if="twoFactor"
      ><b-icon
        icon="check-circle"
        aria-hidden="true"
        variant="success"
      ></b-icon>
      2FA</span
    >
    <span class="mx-1" style="color: grey" v-else
      ><b-icon icon="x-circle" aria-hidden="true" variant="danger"></b-icon>
      2FA</span
    >
    <b-badge pill variant="info" class="mx-1"
      >{{ numberOfTeams }} teams</b-badge
    >
    <b-badge pill variant="success" class="mx-1" v-if="invitationStatus">
      <span class="mx-1" style="color: white">Accepted </span></b-badge
    >
    <b-badge pill variant="warning" class="mx-1" v-else>
      <span class="mx-1" style="color: white">Pending </span></b-badge
    >
    <b-dropdown
      size="sm"
      variant="link"
      toggle-class="text-decoration-none"
      no-caret
      dropleft
    >
      <template #button-content>
        <b-icon style="color: grey" icon="list" aria-hidden="true"></b-icon>
      </template>
      <b-dropdown-item-button style="text-align: left"
        >Delete</b-dropdown-item-button
      >
    </b-dropdown>
  </b-list-group-item>
</template>

<script>
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
  },
};
</script>
