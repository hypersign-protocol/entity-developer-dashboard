<template>
  <b-container fluid class="widget-configurations py-4" :class="isContainerShift ? 'homeShift' : 'home'">
    <load-ing :active.sync="isLoading" :can-cancel="false" :is-full-page="true" />
    <AccessDenied v-if="accessDenied" />
    <template v-else>
      <div class="page-header">
        <div>
          <h3>Widget Configurations</h3>
          <p>Create and manage widget configurations for your verification use cases.</p>
        </div>
        <div class="header-actions">
          <b-button-group class="view-toggle">
            <b-button :variant="viewMode === 'table' ? 'primary' : 'light'" @click="viewMode = 'table'">
              <v-icon small :color="viewMode === 'table' ? 'white' : '#64748b'">mdi-table</v-icon> Table
            </b-button>
            <b-button :variant="viewMode === 'cards' ? 'primary' : 'light'" @click="viewMode = 'cards'">
              <v-icon small :color="viewMode === 'cards' ? 'white' : '#64748b'">mdi-view-grid-outline</v-icon> Cards
            </b-button>
          </b-button-group>
          <b-button variant="primary" class="new-button" @click="createConfiguration">
            <v-icon small color="white">mdi-plus</v-icon> New Configuration
          </b-button>
        </div>
      </div>

      <div class="filters">
        <div class="search-wrap">
          <v-icon small>mdi-magnify</v-icon>
          <input v-model.trim="search" type="search" placeholder="Search configurations by name...">
        </div>
        <b-form-select v-model="statusFilter" :options="statusOptions" />
        <b-form-select v-model="sortBy" :options="sortOptions" />
      </div>

      <div v-if="!isLoading && filteredConfigurations.length === 0" class="empty-state">
        <v-icon size="48" color="#94a3b8">mdi-widgets-outline</v-icon>
        <h5>No widget configurations found</h5>
        <p>{{ widgetConfigs.length ? 'Try changing your search or filters.' : 'Create your first configuration to get started.' }}</p>
        <b-button v-if="!widgetConfigs.length" variant="primary" @click="createConfiguration">New Configuration</b-button>
      </div>

      <div v-else-if="viewMode === 'cards'" class="configuration-grid">
        <article v-for="configuration in paginatedConfigurations" :key="configuration._id" class="configuration-card">
          <div class="card-heading">
            <div class="configuration-avatar" :class="avatarClass(configuration)">
              <v-icon>{{ avatarIcon(configuration) }}</v-icon>
            </div>
            <div class="configuration-identity">
              <div class="title-row">
                <strong>{{ configuration.name }}</strong>
                <span v-if="configuration.isDefault" class="badge badge-default">Default</span>
              </div>
              <small>{{ configurationSlug(configuration) }}</small>
            </div>
          </div>
          <p v-if="configuration.description" class="description">{{ configuration.description }}</p>
          <div class="features-title">Key Features</div>
          <div class="feature-list">
            <span v-for="feature in features(configuration).slice(0, 4)" :key="feature.key" class="feature-icon" :title="feature.label">
              <v-icon small :color="feature.color">{{ feature.icon }}</v-icon>
            </span>
            <span v-if="features(configuration).length > 4" class="feature-more">+{{ features(configuration).length - 4 }}</span>
          </div>
          <div class="card-footer-row">
            <div class="updated-at">
              <v-icon x-small>mdi-calendar-blank-outline</v-icon>
              <span>{{ formatDate(configuration.updatedAt || configuration.createdAt) }}</span>
            </div>
            <div>
              <b-button variant="outline-secondary" size="sm" @click="viewConfiguration(configuration)">
                <v-icon x-small>mdi-eye-outline</v-icon> View
              </b-button>
              <b-dropdown right no-caret size="sm" variant="link" toggle-class="action-menu" class="ml-1">
                <template #button-content><v-icon small>mdi-dots-vertical</v-icon></template>
                <b-dropdown-item @click="viewConfiguration(configuration)">Edit</b-dropdown-item>
                <b-dropdown-item class="text-danger" @click="removeConfiguration(configuration)">Delete</b-dropdown-item>
              </b-dropdown>
            </div>
          </div>
        </article>
      </div>

      <div v-else class="table-shell">
        <b-table :items="paginatedConfigurations" :fields="tableFields" responsive show-empty class="configuration-table">
          <template #cell(configuration)="{ item }">
            <div class="table-identity">
              <div class="configuration-avatar small" :class="avatarClass(item)"><v-icon small>{{ avatarIcon(item) }}</v-icon></div>
              <div>
                <div class="title-row">
                  <strong>{{ item.name }}</strong>
                  <span v-if="item.isDefault" class="badge badge-default">Default</span>
                </div>
                <small>{{ configurationSlug(item) }}</small>
              </div>
            </div>
          </template>
          <template #cell(features)="{ item }">
            <div class="feature-list compact">
              <span v-for="feature in features(item).slice(0, 5)" :key="feature.key" class="feature-icon" :title="feature.label">
                <v-icon small :color="feature.color">{{ feature.icon }}</v-icon>
              </span>
              <span v-if="features(item).length > 5" class="feature-more">+{{ features(item).length - 5 }}</span>
            </div>
          </template>
          <template #cell(updatedAt)="{ item }"><span>{{ formatDate(item.updatedAt || item.createdAt) }}</span></template>
          <template #cell(actions)="{ item }">
            <b-button variant="outline-secondary" size="sm" @click="viewConfiguration(item)">
              <v-icon x-small>mdi-eye-outline</v-icon> View
            </b-button>
            <b-dropdown right no-caret size="sm" variant="link" toggle-class="action-menu" class="ml-1">
              <template #button-content><v-icon small>mdi-dots-vertical</v-icon></template>
              <b-dropdown-item @click="viewConfiguration(item)">Edit</b-dropdown-item>
              <b-dropdown-item @click="removeConfiguration(item)">Delete</b-dropdown-item>
            </b-dropdown>
          </template>
        </b-table>
      </div>

      <div v-if="totalWidgetConfigCount" class="list-footer">
        <span>Showing {{ pageStart }} to {{ pageEnd }} of {{ totalWidgetConfigCount }} configurations</span>
        <b-pagination v-model="currentPage" :total-rows="totalWidgetConfigCount" :per-page="perPage" size="sm" />
      </div>
    </template>
    <CustomConfirmModal
      :is-visible="showDeleteConfirm"
      title="Delete Widget Configuration"
      :message="deleteMessage"
      type="danger"
      confirm-text="Delete"
      confirm-icon-class="fas fa-trash"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />
  </b-container>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import UtilsMixin from '../../../mixins/utils'
import AccessDenied from '../../AccessDenied.vue'
import CustomConfirmModal from '../../../components/element/CustomConfirmModal.vue'
import { isAccessDeniedError } from '../../../utils/accessDenied'

export default {
  name: 'WidgetConfigurations',
  components: { AccessDenied, CustomConfirmModal },
  mixins: [UtilsMixin],
  data() {
    return {
      accessDenied: false,
      configurationToDelete: null,
      currentPage: 1,
      isLoading: false,
      perPage: 6,
      search: '',
      showDeleteConfirm: false,
      sortBy: 'updated-desc',
      statusFilter: 'all',
      viewMode: 'table',
      statusOptions: [
        { value: 'all', text: 'All Status' },
        { value: 'default', text: 'Default' },
        { value: 'standard', text: 'Standard' }
      ],
      sortOptions: [
        { value: 'updated-desc', text: 'Last Updated' },
        { value: 'updated-asc', text: 'Oldest Updated' },
        { value: 'name-asc', text: 'Name A–Z' },
        { value: 'name-desc', text: 'Name Z–A' }
      ],
      tableFields: [
        { key: 'configuration', label: 'Configuration' },
        { key: 'features', label: 'Features' },
        { key: 'updatedAt', label: 'Last Updated' },
        { key: 'actions', label: 'Actions', thClass: 'text-right', tdClass: 'text-right' }
      ]
    }
  },
  computed: {
    ...mapState({
      containerShift: state => state.playgroundStore.containerShift,
      widgetConfigs: state => state.mainStore.widgetConfigs,
      totalWidgetConfigCount: state => state.mainStore.totalWidgetConfigCount
    }),
    isContainerShift() {
      return this.containerShift
    },
    filteredConfigurations() {
      const search = this.search.toLowerCase()
      const list = this.widgetConfigs.filter(configuration => {
        const matchesSearch = !search || [configuration.name, configuration.description, ...(configuration.tags || [])]
          .filter(Boolean).some(value => String(value).toLowerCase().includes(search))
        const matchesStatus = this.statusFilter === 'all' || (this.statusFilter === 'default' ? configuration.isDefault : !configuration.isDefault)
        return matchesSearch && matchesStatus
      })
      return list.sort((a, b) => {
        if (this.sortBy === 'name-asc') return (a.name || '').localeCompare(b.name || '')
        if (this.sortBy === 'name-desc') return (b.name || '').localeCompare(a.name || '')
        const aTime = new Date(a.updatedAt || a.createdAt || 0).getTime()
        const bTime = new Date(b.updatedAt || b.createdAt || 0).getTime()
        return this.sortBy === 'updated-asc' ? aTime - bTime : bTime - aTime
      })
    },
    paginatedConfigurations() {
      return this.filteredConfigurations
    },
    pageStart() { return this.filteredConfigurations.length ? (this.currentPage - 1) * this.perPage + 1 : 0 },
    pageEnd() { return Math.min((this.currentPage - 1) * this.perPage + this.filteredConfigurations.length, this.totalWidgetConfigCount) },
    deleteMessage() {
      return this.configurationToDelete
        ? `Delete “${this.configurationToDelete.name}”? This action cannot be undone.`
        : ''
    }
  },
  watch: {
    search() { this.currentPage = 1 },
    statusFilter() { this.currentPage = 1 },
    currentPage() { this.loadConfigurations() },
  },
  async mounted() {
    await this.loadConfigurations()
  },
  methods: {
    ...mapActions('mainStore', ['fetchAppsWidgetConfigs', 'deleteAppsWidgetConfig']),
    async loadConfigurations() {
      this.isLoading = true
      try {
        await this.fetchAppsWidgetConfigs({ page: this.currentPage, limit: this.perPage })
      } catch (error) {
        if (isAccessDeniedError(error)) this.accessDenied = true
        else this.notifyErr(typeof error === 'string' ? error : error.message)
      } finally {
        this.isLoading = false
      }
    },
    createConfiguration() {
      this.$router.push({ name: 'WidgetConfigNew', params: { appId: this.$route.params.appId } })
    },
    viewConfiguration(configuration) {
      this.$router.push({ name: 'WidgetConfigDetails', params: { appId: this.$route.params.appId, widgetConfigId: configuration._id } })
    },
    removeConfiguration(configuration) {
      this.configurationToDelete = configuration
      this.showDeleteConfirm = true
    },
    cancelDelete() {
      this.showDeleteConfirm = false
      this.configurationToDelete = null
    },
    async confirmDelete() {
      if (!this.configurationToDelete) return
      try {
        this.isLoading = true
        await this.deleteAppsWidgetConfig(this.configurationToDelete._id)
        if (!this.widgetConfigs.length && this.currentPage > 1) this.currentPage -= 1
        else await this.fetchAppsWidgetConfigs({ page: this.currentPage, limit: this.perPage })
        this.notifySuccess('Widget configuration deleted successfully')
      } catch (error) {
        this.notifyErr(typeof error === 'string' ? error : error.message)
      } finally {
        this.isLoading = false
        this.cancelDelete()
      }
    },
    configurationSlug(configuration) {
      return (configuration.name || 'widget-configuration').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    },
    features(configuration) {
      const values = []
      if (configuration.faceRecog) values.push({ key: 'face', label: 'Facial Recognition', icon: 'mdi-face-recognition', color: '#16a34a' })
      if (configuration.idOcr && configuration.idOcr.enabled) values.push({ key: 'ocr', label: 'ID Document Verification', icon: 'mdi-card-account-details-outline', color: '#2563eb' })
      if (configuration.userConsent && configuration.userConsent.enabled !== false) values.push({ key: 'consent', label: 'User Consent', icon: 'mdi-shield-check-outline', color: '#2563eb' })
      if (configuration.trustedIssuer) values.push({ key: 'issuer', label: 'Trusted Issuer', icon: 'mdi-bank-outline', color: '#16a34a' })
      if (configuration.isEmailNotificationEnabled) values.push({ key: 'email', label: 'Email Notifications', icon: 'mdi-email-outline', color: '#f97316' })
      if (configuration.zkProof && configuration.zkProof.enabled) values.push({ key: 'age', label: 'Age Verification', icon: 'mdi-eye-outline', color: '#9333ea' })
      if (configuration.jurisdictionRules && configuration.jurisdictionRules.enabled) values.push({ key: 'jurisdiction', label: 'Jurisdiction Restrictions', icon: 'mdi-earth', color: '#e11d48' })
      return values
    },
    avatarIcon(configuration) {
      const name = (configuration.name || '').toLowerCase()
      if (name.includes('partner')) return 'mdi-handshake-outline'
      if (name.includes('international')) return 'mdi-earth'
      if (name.includes('age')) return 'mdi-bank-outline'
      return 'mdi-account-outline'
    },
    avatarClass(configuration) {
      const palette = ['green', 'purple', 'blue', 'orange', 'pink']
      const total = (configuration.name || '').split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)
      return `avatar-${palette[total % palette.length]}`
    },
    formatDate(value) {
      if (!value) return 'Not available'
      return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(value))
    }
  }
}
</script>

<style scoped>
.widget-configurations { max-width: 1440px; min-width: 0; width: 100%; }
.page-header, .header-actions, .filters, .card-heading, .title-row, .feature-list, .card-footer-row, .updated-at, .table-identity, .list-footer { display: flex; align-items: center; }
.page-header { justify-content: space-between; gap: 24px; margin-bottom: 28px; }
.page-header h3 { color: #0f172a; font-size: 24px; font-weight: 700; margin: 0 0 4px; }
.page-header p { color: #64748b; font-size: 13px; margin: 0; }
.header-actions { flex-wrap: wrap; gap: 18px; justify-content: flex-end; }
.view-toggle { border: 1px solid #dbe3ef; border-radius: 7px; overflow: hidden; }
.view-toggle .btn {
  border: 0;
  box-shadow: none !important;
  min-width: 92px;
}
.view-toggle .btn-primary,
.view-toggle .btn-primary:hover,
.view-toggle .btn-primary:focus,
.view-toggle .btn-primary:active,
.new-button,
.new-button:hover,
.new-button:focus,
.new-button:active {
  background-color: #0d6efd !important;
  border-color: #0d6efd !important;
  color: #fff !important;
}
.view-toggle .btn-primary .v-icon,
.new-button .v-icon {
  color: #fff !important;
}
.view-toggle .btn-light,
.view-toggle .btn-light:hover,
.view-toggle .btn-light:focus,
.view-toggle .btn-light:active {
  background-color: #fff !important;
  color: #334155 !important;
}
.view-toggle .btn-light .v-icon {
  color: #64748b !important;
}
.new-button {
  box-shadow: none !important;
  min-height: 42px;
  padding: 0 20px;
}
.filters { flex-wrap: wrap; gap: 20px; margin-bottom: 24px; }
.filters .custom-select { border-color: #dbe3ef; height: 44px; max-width: 240px; }
.search-wrap { align-items: center; border: 1px solid #dbe3ef; border-radius: 6px; display: flex; flex: 1; height: 44px; max-width: 470px; padding: 0 14px; }
.search-wrap input { border: 0; flex: 1; height: 100%; margin-left: 10px; outline: 0; }
.configuration-grid { display: grid; gap: 20px; grid-template-columns: repeat(3, minmax(0, 1fr)); }
.configuration-card { border: 1px solid #dfe6ef; border-radius: 8px; display: flex; flex-direction: column; min-height: 275px; padding: 24px; }
.configuration-card:hover { border-color: #b8c7dd; box-shadow: 0 8px 24px rgba(15, 23, 42, .06); }
.card-heading { align-items: flex-start; gap: 14px; }
.configuration-avatar { align-items: center; border-radius: 50%; display: flex; flex: 0 0 48px; height: 48px; justify-content: center; width: 48px; }
.configuration-avatar.small { flex-basis: 38px; height: 38px; width: 38px; }
.avatar-green { background: #dcfce7; } .avatar-green .v-icon { color: #16a34a; }
.avatar-purple { background: #f3e8ff; } .avatar-purple .v-icon { color: #9333ea; }
.avatar-blue { background: #e0f2fe; } .avatar-blue .v-icon { color: #2563eb; }
.avatar-orange { background: #ffedd5; } .avatar-orange .v-icon { color: #f97316; }
.avatar-pink { background: #fce7f3; } .avatar-pink .v-icon { color: #db2777; }
.configuration-identity { min-width: 0; }
.title-row { flex-wrap: wrap; gap: 7px; }
.title-row strong { color: #172033; font-size: 14px; }
.configuration-identity small, .table-identity small { color: #64748b; }
.badge { border-radius: 5px; font-size: 10px; font-weight: 500; padding: 4px 7px; }
.badge-default { background: #e8f1ff; color: #2563eb; }
.description { color: #64748b; font-size: 12px; margin: 15px 0 0; min-height: 18px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.features-title { color: #64748b; font-size: 11px; font-weight: 600; margin: 22px 0 10px; }
.feature-list { gap: 9px; }
.feature-icon, .feature-more { align-items: center; background: #f8fafc; border: 1px solid #e5eaf1; border-radius: 7px; display: inline-flex; height: 34px; justify-content: center; width: 34px; }
.feature-more { color: #475569; font-size: 11px; }
.card-footer-row { border-top: 1px solid #e8edf3; justify-content: space-between; margin-top: auto; padding-top: 14px; }
.updated-at { color: #64748b; font-size: 10px; gap: 6px; }
.table-shell { border: 1px solid #dfe6ef; border-radius: 8px; overflow: hidden; }
.configuration-table { margin: 0; }
.table-identity { gap: 12px; min-width: 260px; }
.compact { min-width: 230px; }
.list-footer { color: #64748b; font-size: 12px; justify-content: space-between; padding: 18px 2px 0; }
.list-footer .pagination { margin: 0; }
.empty-state { border: 1px dashed #cbd5e1; border-radius: 8px; padding: 70px 20px; text-align: center; }
.empty-state h5 { border: 0; color: #334155; line-height: normal; margin: 14px 0 6px; }
.empty-state p { color: #64748b; }
::v-deep(.configuration-table thead th) { background: #f8fafc; border-bottom: 1px solid #dfe6ef; color: #64748b; font-size: 11px; padding: 16px; text-transform: uppercase; }
::v-deep(.configuration-table td) { color: #475569; padding: 16px; vertical-align: middle; }
::v-deep(.action-menu) { color: #64748b !important; padding: 4px !important; }
@media (max-width: 1100px) {
  .configuration-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .page-header { align-items: flex-start; }
}
@media (max-width: 991.98px) {
  .page-header { align-items: stretch; flex-direction: column; }
  .header-actions { justify-content: flex-start; }
  .filters { display: grid; grid-template-columns: minmax(0, 1fr) repeat(2, minmax(180px, 220px)); }
  .filters .custom-select, .search-wrap { max-width: none; width: 100%; }
}
@media (max-width: 767px) {
  .filters { display: flex; flex-direction: column; }
  .configuration-grid { grid-template-columns: 1fr; }
  .list-footer { align-items: flex-start; flex-direction: column; gap: 12px; }
}
@media (max-width: 575.98px) {
  .widget-configurations { padding-left: 12px !important; padding-right: 12px !important; }
  .header-actions { align-items: stretch; flex-direction: column; }
  .view-toggle, .new-button { width: 100%; }
  .view-toggle .btn { flex: 1; }
  .new-button { justify-content: center; }
}
</style>
