<template>
  <div data-tour="settings-live-access-overview">
    <load-ing :active.sync="isLoading" :can-cancel="false" :is-full-page="false"></load-ing>

    <SectionHeader title="Live Access" description="Teammates who are currently signed in to your admin dashboard.">
      <hf-buttons name="" title="Refresh" :bIcon="true" iconClass="fas fa-sync-alt" @executeAction="fetchAccessUsers" />
    </SectionHeader>

    <div v-if="accessUsers.length > 0" class="access-table-wrap">
      <table class="access-table">
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
            <td><span class="access-status"><i class="mdi mdi-circle" aria-hidden="true"></i> Active</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="text-center no-access-wrapper">
      <empty-container title="No Active Teammate Access" icon="fa fa-user-shield"
        description="No teammate is accessing your dashboard profile right now." />
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex/dist/vuex.common.js";
import UtilsMixin from "../../mixins/utils";
import SectionHeader from "../element/SectionHeader.vue";

export default {
  name: "LiveAccessStatus",
  components: { SectionHeader },
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
/* Same bordered, rounded look as the member and role lists */
.access-table-wrap {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  overflow-x: auto;
}

.access-table {
  border-collapse: collapse;
  width: 100%;
}

.access-table th {
  background: #f8fafc;
  border-bottom: 1px solid #e5e7eb;
  color: #64748b;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.05em;
  padding: 10px 16px;
  text-align: left;
  text-transform: uppercase;
  white-space: nowrap;
}

.access-table td {
  color: #1f2937;
  font-size: 13px;
  padding: 12px 16px;
}

.access-table tbody tr + tr td {
  border-top: 1px solid #f1f5f9;
}

.access-status {
  align-items: center;
  background: rgba(78, 201, 107, 0.12);
  border-radius: 5px;
  color: #2f9e4f;
  display: inline-flex;
  font-size: 12px;
  font-weight: 700;
  gap: 4px;
  padding: 3px 8px;
}

.access-status .mdi {
  font-size: 8px;
}

.no-access-wrapper {
  padding-top: 4px;
}

.no-access-wrapper :deep(.empty-container) {
  margin-top: 0;
  padding-top: 1.25rem;
  padding-bottom: 1.25rem;
}
</style>
