<template>
  <b-container fluid class="py-5 bg-white text-dark">
    <b-row align-h="center">
      <b-col cols="12" md="12" lg="12">
        <div class="text-center mb-5">
          <h3 class="font-weight-bold mb-2">Add Team</h3>
          <p class="text-muted mb-0">
            Manage your organization’s access by adding team members and assigning roles.
          </p>
        </div>

        <div class="shadow-sm border-light p-3">
          <!-- Roles Section -->
          <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h5 class="mb-1">Roles</h5>
              <p class="text-muted small mb-0">No roles created yet.</p>
            </div>
            <b-button variant="light" class="border" @click="onAddRole">
              Add Role
            </b-button>
          </div>

          <!-- Invite Members Section -->
          <div>
            <h5 class="mb-3">Invite Members</h5>
            <b-form @submit.prevent="onInvite">
              <b-form-row>
                <b-col cols="12" md="5" class="mb-2 mb-md-0">
                  <b-form-input
                    v-model="invite.email"
                    type="email"
                    placeholder="Enter email address"
                    required
                  ></b-form-input>
                </b-col>

                <b-col cols="12" md="4" class="mb-2 mb-md-0">
                  <b-form-select v-model="invite.role" :options="roleOptions" required>
                    <template #first>
                      <option :value="null" disabled>Select Role</option>
                    </template>
                  </b-form-select>
                </b-col>

                <b-col cols="12" md="3">
                  <b-button type="submit" variant="primary" block>Invite</b-button>
                </b-col>
              </b-form-row>
            </b-form>
          </div>

          <!-- Footer Buttons -->
          <div class="d-flex justify-content-end mt-4">
            <b-button variant="light" class="mr-2 border" @click="onSkip">
              Skip for now
            </b-button>
            <b-button variant="primary" @click="onContinue">Continue</b-button>
          </div>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: "StepAddTeam",
  data() {
    return {
      invite: {
        email: "",
        role: null,
      },
      roleOptions: [
        { value: "admin", text: "Admin" },
        { value: "manager", text: "Manager" },
        { value: "viewer", text: "Viewer" },
      ],
    };
  },
  methods: {
    onAddRole() {
      // open modal or add role handler
      alert("Add Role clicked");
    },
    onInvite() {
      // handle invitation
      alert(`Invited ${this.invite.email} as ${this.invite.role}`);
      this.invite.email = "";
      this.invite.role = null;
    },
    onSkip() {
       this.$emit("next-step");
    },
    onContinue() {
       this.$emit("next-step");
    },
  },
};
</script>

<style scoped>
.bg-white {
  background-color: #fff !important;
}
.text-muted {
  color: #6c757d !important;
}
</style>
