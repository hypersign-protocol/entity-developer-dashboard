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
          <HfButtons name="New Configuration" iconClass="mdi mdi-plus" @executeAction="createConfiguration" />
        </div>
      </div>

      <div v-if="!isLoading && widgetConfigs.length === 0" class="empty-state">
        <v-icon size="48" color="#94a3b8">mdi-widgets-outline</v-icon>
        <h5>No widget configurations found</h5>
        <p>Create your first configuration to get started.</p>
        <HfButtons name="New Configuration" iconClass="mdi mdi-plus" @executeAction="createConfiguration" />
      </div>

      <div v-else class="table-shell">
        <b-table :items="widgetConfigs" :fields="tableFields" responsive show-empty class="configuration-table">
          <template #cell(configuration)="{ item }">
            <div class="table-identity">
              <div class="configuration-avatar small" :class="avatarClass(item)"><v-icon small>mdi-cog-outline</v-icon></div>
              <div>
                <div class="title-row">
                  <strong>{{ widgetConfigurationName(item) }}</strong>
                  <span v-if="item.isDefault" class="badge badge-default">Default</span>
                </div>
                <small
                  class="configuration-description"
                  :title="widgetConfigurationDescription(item)"
                >
                  {{ widgetConfigurationDescription(item) }}
                </small>
              </div>
            </div>
          </template>
          <template #cell(widgetConfigId)="{ item }">
            <button type="button" class="widget-config-id" title="Copy Widget Configuration ID" @click="copyToClip(item._id, 'Widget Configuration ID')">
              <span>{{ item._id }}</span>
              <v-icon x-small>mdi-content-copy</v-icon>
            </button>
          </template>
          <template #cell(features)="{ item }">
            <div class="feature-list compact">
              <span v-for="feature in features(item).slice(0, 5)" :key="feature.key" class="feature-icon" :title="feature.label">
                <v-icon small :color="feature.color">{{ feature.icon }}</v-icon>
              </span>
              <span v-if="features(item).length > 5" class="feature-more">+{{ features(item).length - 5 }}</span>
            </div>
          </template>
          <template #cell(actions)="{ item }">
            <b-button variant="outline-secondary" size="sm" @click="viewConfiguration(item)">
              <v-icon x-small>mdi-eye-outline</v-icon> View
            </b-button>
            <b-dropdown right no-caret size="sm" variant="link" boundary="viewport" toggle-class="action-menu" menu-class="configuration-actions-menu" class="configuration-actions ml-1">
              <template #button-content><v-icon small>mdi-dots-vertical</v-icon></template>
              <b-dropdown-item @click="viewConfiguration(item)"><v-icon small>mdi-pencil-outline</v-icon> Edit</b-dropdown-item>
              <b-dropdown-item v-if="!item.isDefault" @click="setDefaultConfiguration(item)"><v-icon small>mdi-star-outline</v-icon> Set as default</b-dropdown-item>
              <b-dropdown-divider v-if="!item.isDefault" />
              <b-dropdown-item v-if="!item.isDefault" class="delete-action" @click="removeConfiguration(item)"><v-icon small>mdi-trash-can-outline</v-icon> Delete</b-dropdown-item>
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
import { mapActions, mapMutations, mapState } from 'vuex'
import UtilsMixin from '../../../mixins/utils'
import AccessDenied from '../../AccessDenied.vue'
import CustomConfirmModal from '../../../components/element/CustomConfirmModal.vue'
import HfButtons from '../../../components/element/HfButtons.vue'
import { isAccessDeniedError } from '../../../utils/accessDenied'

export default {
  name: 'WidgetConfigurations',
  components: { AccessDenied, CustomConfirmModal, HfButtons },
  mixins: [UtilsMixin],
  data() {
    return {
      accessDenied: false,
      configurationToDelete: null,
      currentPage: 1,
      isLoading: false,
      perPage: 6,
      showDeleteConfirm: false,
      tableFields: [
        { key: 'configuration', label: 'Configuration', thClass: 'configuration-column', tdClass: 'configuration-column' },
        { key: 'widgetConfigId', label: 'Configuration ID', thClass: 'configuration-id-column', tdClass: 'configuration-id-column' },
        { key: 'features', label: 'Features', thClass: 'features-column', tdClass: 'features-column' },
        { key: 'actions', label: 'Actions', thClass: 'actions-column text-right', tdClass: 'actions-column text-right' }
      ]
    }
  },
  computed: {
    ...mapState({
      containerShift: state => state.playgroundStore.containerShift,
      widgetConfigs: state => state.mainStore.widgetConfigs,
      kycWebpageConfig: state => state.mainStore.kycWebpageConfig,
      totalWidgetConfigCount: state => state.mainStore.totalWidgetConfigCount
    }),
    isContainerShift() {
      return this.containerShift
    },
    pageStart() { return this.widgetConfigs.length ? (this.currentPage - 1) * this.perPage + 1 : 0 },
    pageEnd() { return Math.min((this.currentPage - 1) * this.perPage + this.widgetConfigs.length, this.totalWidgetConfigCount) },
    deleteMessage() {
      return this.configurationToDelete
        ? `Delete “${this.widgetConfigurationName(this.configurationToDelete)}”? This action cannot be undone.`
        : ''
    }
  },
  watch: {
    currentPage() { this.loadConfigurations() },
  },
  async mounted() {
    await this.loadConfigurations()
  },
  methods: {
    ...mapActions('mainStore', ['fetchAppsWidgetConfigs', 'deleteAppsWidgetConfig', 'updateAppsWidgetConfig', 'fetchKYCWebpageConfig', 'updateKYCWebpageConfig']),
    ...mapMutations('mainStore', ['setWidgetConfig']),
    widgetConfigurationName(configuration) {
      return configuration?.name?.trim() || 'Identity Verification Flow'
    },
    widgetConfigurationDescription(configuration) {
      return configuration?.description?.trim() || 'Identity verification configuration for this application.'
    },
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
    async setDefaultConfiguration(configuration) {
      try {
        this.isLoading = true
        const payload = { ...configuration, isDefault: true }
        delete payload.trustedIssuer
        delete payload.serviceId
        delete payload.createdAt
        delete payload.updatedAt
        this.setWidgetConfig(payload)
        await this.updateAppsWidgetConfig()
        await this.updateVerifierPageWidgetConfig(configuration._id)
        await this.fetchAppsWidgetConfigs({ page: this.currentPage, limit: this.perPage })
        this.notifySuccess('Default widget configuration updated successfully')
      } catch (error) {
        this.notifyErr(typeof error === 'string' ? error : error.message)
      } finally {
        this.isLoading = false
      }
    },
    async updateVerifierPageWidgetConfig(widgetConfigId) {
      try {
        await this.fetchKYCWebpageConfig()
      } catch (error) {
        const message = error?.message || String(error)
        if (message.includes('No webpage configuration found')) return
        throw error
      }
      if (!this.kycWebpageConfig?._id) return
      await this.updateKYCWebpageConfig({
        ...this.kycWebpageConfig,
        linkedWidgetConfigIds: [widgetConfigId]
      })
    },
    removeConfiguration(configuration) {
      if (configuration.isDefault) return
      this.configurationToDelete = configuration
      this.showDeleteConfirm = true
    },
    cancelDelete() {
      this.showDeleteConfirm = false
      this.configurationToDelete = null
    },
    async confirmDelete() {
      if (!this.configurationToDelete || this.configurationToDelete.isDefault) return
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
    avatarClass(configuration) {
      const palette = ['green', 'purple', 'blue', 'orange', 'pink']
      const total = this.widgetConfigurationName(configuration).split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)
      return `avatar-${palette[total % palette.length]}`
    }
  }
}
</script>

<style scoped>
.widget-configurations { max-width: 1440px; min-width: 0; width: 100%; }
.page-header, .header-actions, .title-row, .feature-list, .table-identity, .list-footer { display: flex; align-items: center; }
.page-header { justify-content: space-between; gap: 24px; margin-bottom: 28px; }
.page-header h3 { color: #0f172a; font-size: 24px; font-weight: 700; margin: 0 0 4px; }
.page-header p { color: #64748b; font-size: 13px; margin: 0; }
.header-actions { flex-wrap: wrap; gap: 18px; justify-content: flex-end; }
.configuration-avatar { align-items: center; border-radius: 50%; display: flex; flex: 0 0 48px; height: 48px; justify-content: center; width: 48px; }
.configuration-avatar.small { flex-basis: 38px; height: 38px; width: 38px; }
.avatar-green { background: #dcfce7; } .avatar-green .v-icon { color: #16a34a; }
.avatar-purple { background: #f3e8ff; } .avatar-purple .v-icon { color: #9333ea; }
.avatar-blue { background: #e0f2fe; } .avatar-blue .v-icon { color: #2563eb; }
.avatar-orange { background: #ffedd5; } .avatar-orange .v-icon { color: #f97316; }
.avatar-pink { background: #fce7f3; } .avatar-pink .v-icon { color: #db2777; }
.title-row { flex-wrap: wrap; gap: 7px; }
.title-row strong { color: #172033; font-size: 14px; }
.table-identity small { color: #64748b; }
.configuration-description {
  display: -webkit-box;
  overflow: hidden;
  overflow-wrap: anywhere;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.badge { border-radius: 5px; font-size: 10px; font-weight: 500; padding: 4px 7px; }
.badge-default { background: #e8f1ff; color: #2563eb; }
.feature-list { gap: 9px; }
.feature-icon, .feature-more { align-items: center; background: #f8fafc; border: 1px solid #e5eaf1; border-radius: 7px; display: inline-flex; height: 34px; justify-content: center; width: 34px; }
.feature-more { color: #475569; font-size: 11px; }
.table-shell { border: 1px solid #dfe6ef; border-radius: 8px; overflow: hidden; }
.configuration-table { margin: 0; min-width: 840px; table-layout: fixed; }
.table-identity { gap: 12px; min-width: 260px; }
.widget-config-id {
  align-items: center;
  background: transparent;
  border: 0;
  color: #475569;
  display: inline-flex;
  font-family: monospace;
  font-size: 12px;
  gap: 8px;
  max-width: 260px;
  padding: 4px 0;
  text-align: left;
}
.widget-config-id span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.widget-config-id:hover { color: #111827; }
.widget-config-id:focus { outline: 1px solid #94a3b8; outline-offset: 3px; }
.widget-config-id .v-icon { color: #64748b; flex-shrink: 0; }
.compact { min-width: 0; }
.list-footer { color: #64748b; font-size: 12px; justify-content: space-between; padding: 18px 2px 0; }
.list-footer .pagination { margin: 0; }
.empty-state { border: 1px dashed #cbd5e1; border-radius: 8px; padding: 70px 20px; text-align: center; }
.empty-state h5 { border: 0; color: #334155; line-height: normal; margin: 14px 0 6px; }
.empty-state p { color: #64748b; }
::v-deep(.configuration-table thead th) { background: #f8fafc; border-bottom: 1px solid #dfe6ef; color: #64748b; font-size: 11px; padding: 16px; text-transform: uppercase; }
::v-deep(.configuration-table td) { color: #475569; padding: 16px; vertical-align: middle; }
::v-deep(.configuration-column) { width: 32%; }
::v-deep(.configuration-id-column) { width: 28%; }
::v-deep(.features-column) { width: 25%; }
::v-deep(.actions-column) { width: 15%; }
::v-deep(.action-menu) {
  align-items: center;
  border: 1px solid transparent !important;
  border-radius: 6px;
  color: #64748b !important;
  display: inline-flex;
  height: 32px;
  justify-content: center;
  padding: 0 !important;
  text-decoration: none !important;
  width: 32px;
}
::v-deep(.action-menu:hover),
::v-deep(.action-menu:focus),
::v-deep(.action-menu:active),
::v-deep(.action-menu[aria-expanded="true"]) {
  background: #f1f5f9 !important;
  border-color: #dbe3ef !important;
  box-shadow: none !important;
  text-decoration: none !important;
}
::v-deep(.configuration-actions-menu) {
  border: 1px solid #dbe3ef;
  border-radius: 7px;
  box-shadow: 0 10px 24px rgba(15, 23, 42, .12);
  min-width: 175px;
  padding: 6px;
}
::v-deep(.configuration-actions-menu .dropdown-item) {
  align-items: center;
  border-radius: 5px;
  color: #334155;
  display: flex;
  font-size: 13px;
  gap: 8px;
  padding: 8px 10px;
}
::v-deep(.configuration-actions-menu .dropdown-item:hover),
::v-deep(.configuration-actions-menu .dropdown-item:focus) { background: #f1f5f9; }
::v-deep(.configuration-actions-menu .delete-action .dropdown-item),
::v-deep(.configuration-actions-menu .delete-action .v-icon) { color: #dc2626 !important; }
@media (max-width: 1100px) {
  .page-header { align-items: flex-start; }
}
@media (max-width: 991.98px) {
  .page-header { align-items: stretch; flex-direction: column; }
  .header-actions { justify-content: flex-start; }
}
@media (max-width: 767px) {
  .list-footer { align-items: flex-start; flex-direction: column; gap: 12px; }
}
@media (max-width: 575.98px) {
  .widget-configurations { padding-left: 12px !important; padding-right: 12px !important; }
  .header-actions { align-items: stretch; flex-direction: column; }
}
</style>
