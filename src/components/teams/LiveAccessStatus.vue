<template>
  <div>
    <load-ing :active.sync="isLoading" :can-cancel="false" :is-full-page="false"></load-ing>

    <div class="d-flex justify-content-between align-items-center mb-3">
      <div>
        <h5 class="mb-1">Live Access Status</h5>
        <small class="text-muted">Shows teammates currently accessing your admin dashboard profile.</small>
      </div>
      <hf-buttons
        name=""
        title="Refresh"
        :bIcon="true"
        iconClass="fas fa-sync-alt"
        @executeAction="fetchAccessUsers"
      />
    </div>

    <div v-if="accessUsers.length > 0">
      <table class="table table-hover">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Active Since</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in accessUsers" :key="user.userId">
            <td>{{ user.name || '-' }}</td>
            <td>{{ user.email || '-' }}</td>
            <td>{{ user.role || '-' }}</td>
            <td>{{ formatDate(user.accessActiveSince) }}</td>
            <td><b-badge pill variant="success">Active</b-badge></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="text-center no-access-wrapper">
      <empty-container title="No Active Teammate Access" icon="fa fa-user-shield" />
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex/dist/vuex.common.js";
import UtilsMixin from "../../mixins/utils";

export default {
  name: "LiveAccessStatus",
  mixins: [UtilsMixin],
  data() {
    return {
      isLoading: false,
      accessUsers: []
    };
  },
  methods: {
    ...mapActions("mainStore", ["getTenantAccessUsers"]),
    async fetchAccessUsers() {
      try {
        this.isLoading = true;
        const users = await this.getTenantAccessUsers();
        this.accessUsers = Array.isArray(users) ? users : [];
      } catch (e) {
        this.notifyErr(e.message || "Failed to fetch live access users");
      } finally {
        this.isLoading = false;
      }
    },
    formatDate(value) {
      if (!value) return "-";
      return new Date(value).toLocaleString();
    }
  },
  async mounted() {
    await this.fetchAccessUsers();
  }
};
</script>

<style scoped>
.no-access-wrapper {
  padding-top: 4px;
}

.no-access-wrapper :deep(.empty-container) {
  margin-top: 0;
  padding-top: 1.25rem;
  padding-bottom: 1.25rem;
}
</style>
