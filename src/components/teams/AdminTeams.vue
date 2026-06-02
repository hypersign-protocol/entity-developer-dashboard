<template>
    <div>
        <load-ing :active.sync="isLoading" :can-cancel="true" :is-full-page="true"></load-ing>

        <div class="row">
            <div class="col-md-4">
            </div>
            <div class="col-md-8">
                <hf-buttons name="" title="Reload" class="mx-1" :bIcon="true"  style="float: inline-end"  iconClass="fas fa-sync-alt" @executeAction="getMyRolesAction">
                </hf-buttons>
                <hf-buttons name="Create Custom Role" title="Reload" style="float: inline-end"  iconClass="fa fa-gamepad" @executeAction="openSlider('add')">
                </hf-buttons>
            </div>
        </div>
        <div class="row" v-if="getAllRoles.length > 0">
            <table class="table">
                <tbody>
                    <tr v-for="role in getAllRoles" v-bind:key="role.roleName">                        
                        
                            <div class="list-group-item list-group-item-action align-items-start d-flex align-items-center ">
                            <b-avatar size="4em" rounded="lg" variant="info" :text="role.roleName.charAt(0)"></b-avatar>
                            <div class="w-100 mx-3 mt-3 align-items-center">
                                <h5 class="mb-1">{{ role.roleName }}</h5>
                                <p>
                                    {{ role.roleDescription }}
                                </p>
                            </div>
                            <div class="d-flex  align-items-center">
                                <b-badge pill variant="warning">{{ role.permissions.length }}
                                    permissions</b-badge>
                                <b-dropdown size="sm" variant="link" toggle-class="text-decoration-none" menu-class="dropDownPopup"
                                    dropleft>
                                    <template #button-content>
                                        <b-icon style="color:grey" icon="list" aria-hidden="true"></b-icon>
                                    </template>
                                    <b-dropdown-item-button style="text-align: left;" @click="openSliderForEdit(role)">
                                        <b-icon icon="pencil-square" aria-hidden="true"></b-icon>
                                        Edit</b-dropdown-item-button>
                                    <b-dropdown-item-button style="text-align: left;"
                                        @click="promptDeleteRole(role._id, role.roleName)"><i class="fa fa-trash"></i>
                                        Delete</b-dropdown-item-button>
                                </b-dropdown>
                            </div>
                            </div> 
                        
                    </tr> 
                </tbody>
            </table>
        </div>
        <div v-else>
            <empty-container title="No Role Found" icon="fa fa-shield-alt" />
        </div>

        <!-- Delete confirmation dialog -->
        <v-dialog v-model="confirmDialog" max-width="420" persistent>
          <v-card>
            <v-card-title class="text-h6">
              <v-icon color="red" class="mr-2">mdi-alert-circle-outline</v-icon>
              Delete Role
            </v-card-title>
            <v-card-text>
              Are you sure you want to delete <strong>"{{ roleToDeleteName }}"</strong>?
              All users linked with this role will lose access immediately.
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text @click="confirmDialog = false">Cancel</v-btn>
              <v-btn color="red darken-1" depressed dark :loading="isLoading" @click="confirmDeleteRole">
                Delete
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <StudioSideBar :title="edit ? 'Edit Role' : 'Add Role'">
            <div class="container">
                <b-form-group id="input-group-2" style="font-weight: bold;" label="Role Name:" label-for="input-1">
                    <b-form-input v-model="roleModel.roleName" id="input-2" placeholder="Admin" required></b-form-input>
                    <small style="color: grey; font-size: x-small;">Upto 50 chars</small>
                </b-form-group>

                <b-form-group id="input-group-2" style="font-weight: bold;" label="Role Description:"
                    label-for="textarea">
                    <b-form-textarea v-model="roleModel.roleDescription" id="textarea"
                        placeholder="To allow access to all users" rows="3" max-rows="6"></b-form-textarea>
                    <small style="color: grey; font-size: x-small;">Upto 200 chars</small>
                </b-form-group>
                <b-form-group label="Role Permissions:" style="font-weight: bold;" label-for="input-3">
                    <b-tabs content-class="pt-2">
                        <b-tab v-if="hasIDService" title="ID Service">
                            <div class="role-cards-grid">
                                <button
                                    v-for="role in PREDEFINED_ROLES"
                                    :key="role.key"
                                    type="button"
                                    class="role-card"
                                    :class="{ 'role-card-selected': selectedRoles.id === role.key }"
                                    @click="selectPredefinedRole(role, 'id')"
                                >
                                    <div class="role-card-header">
                                        <div class="role-card-title">
                                            <v-icon small class="role-card-icon">{{ role.icon }}</v-icon>
                                            {{ role.name }}
                                        </div>
                                        <b-badge variant="info">{{ role.badge }}</b-badge>
                                    </div>
                                    <div class="role-card-desc">{{ role.description }}</div>
                                    <div class="role-card-footer">
                                        <small>{{ role.recommendedFor }}</small>
                                        <small>{{ role.permissions.length }} permissions</small>
                                    </div>
                                </button>
                            </div>
                            <div v-if="selectedRoles.id === 'custom'" class="perm-scroll-box">
                                <div v-for="eachService in idServices" :key="eachService.id" class="perm-service-block">
                                    <div class="perm-service-header">{{ eachService.name }}</div>
                                    <div v-for="group in getPermSubGroups(eachService.id, eachService.accessList)" :key="group.label" class="perm-group-block">
                                        <div class="perm-group-label">{{ group.label }}</div>
                                        <div class="form-check perm-item" v-for="perm in group.permissions" :key="perm">
                                            <input
                                                class="form-check-input"
                                                type="checkbox"
                                                :value="{ serviceType: eachService.id, access: perm }"
                                                v-on:change="onCheck($event, eachService)"
                                                :checked="checkIfAccessIsThereInThatService(perm, eachService.id)"
                                                :disabled="isReadForcedByWrite(perm, eachService.id) || isWriteForcedByHigherPerm(perm, eachService.id) || isUpdateForcedByDelete(perm, eachService.id)"
                                            >
                                            <label class="form-check-label" :class="{ 'perm-forced': isReadForcedByWrite(perm, eachService.id) || isWriteForcedByHigherPerm(perm, eachService.id) || isUpdateForcedByDelete(perm, eachService.id) }">
                                                <code>{{ perm }}</code>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </b-tab>

                        <b-tab v-if="hasSSIService" title="SSI Service">
                            <div class="role-cards-grid">
                                <button
                                    v-for="role in SSI_PREDEFINED_ROLES"
                                    :key="role.key"
                                    type="button"
                                    class="role-card"
                                    :class="{ 'role-card-selected': selectedRoles.ssi === role.key }"
                                    @click="selectPredefinedRole(role, 'ssi')"
                                >
                                    <div class="role-card-header">
                                        <div class="role-card-title">
                                            <v-icon small class="role-card-icon">{{ role.icon }}</v-icon>
                                            {{ role.name }}
                                        </div>
                                        <b-badge variant="info">{{ role.badge }}</b-badge>
                                    </div>
                                    <div class="role-card-desc">{{ role.description }}</div>
                                    <div class="role-card-footer">
                                        <small>{{ role.recommendedFor }}</small>
                                        <small>{{ role.permissions.length }} permissions</small>
                                    </div>
                                </button>
                            </div>
                            <div v-if="selectedRoles.ssi === 'custom'" class="perm-scroll-box">
                                <div v-for="eachService in ssiServices" :key="eachService.id" class="perm-service-block">
                                    <div class="perm-service-header">{{ eachService.name }}</div>
                                    <div v-for="group in getPermSubGroups(eachService.id, eachService.accessList)" :key="group.label" class="perm-group-block">
                                        <div class="perm-group-label">{{ group.label }}</div>
                                        <div class="form-check perm-item" v-for="perm in group.permissions" :key="perm">
                                            <input
                                                class="form-check-input"
                                                type="checkbox"
                                                :value="{ serviceType: eachService.id, access: perm }"
                                                v-on:change="onCheck($event, eachService)"
                                                :checked="checkIfAccessIsThereInThatService(perm, eachService.id)"
                                                :disabled="isReadForcedByWrite(perm, eachService.id) || isWriteForcedByHigherPerm(perm, eachService.id) || isUpdateForcedByDelete(perm, eachService.id)"
                                            >
                                            <label class="form-check-label" :class="{ 'perm-forced': isReadForcedByWrite(perm, eachService.id) || isWriteForcedByHigherPerm(perm, eachService.id) || isUpdateForcedByDelete(perm, eachService.id) }">
                                                <code>{{ perm }}</code>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </b-tab>
                        <b-tab v-if="hasDashboardService" title="Dashboard Service">
                            <div class="role-cards-grid">
                                <button
                                    v-for="role in DASHBOARD_PREDEFINED_ROLES"
                                    :key="role.key"
                                    type="button"
                                    class="role-card"
                                    :class="{ 'role-card-selected': selectedRoles.dashboard === role.key }"
                                    @click="selectPredefinedRole(role, 'dashboard')"
                                >
                                    <div class="role-card-header">
                                        <div class="role-card-title">
                                            <v-icon small class="role-card-icon">{{ role.icon }}</v-icon>
                                            {{ role.name }}
                                        </div>
                                        <b-badge variant="info">{{ role.badge }}</b-badge>
                                    </div>
                                    <div class="role-card-desc">{{ role.description }}</div>
                                    <div class="role-card-footer">
                                        <small>{{ role.recommendedFor }}</small>
                                        <small>{{ role.permissions.length }} permissions</small>
                                    </div>
                                </button>
                            </div>
                            <div v-if="selectedRoles.dashboard === 'custom'" class="perm-scroll-box">
                                <div v-for="eachService in dashboardServices" :key="eachService.id" class="perm-service-block">
                                    <div class="perm-service-header">{{ eachService.name }}</div>
                                    <div v-for="group in getPermSubGroups(eachService.id, eachService.accessList)" :key="group.label" class="perm-group-block">
                                        <div class="perm-group-label">{{ group.label }}</div>
                                        <div class="form-check perm-item" v-for="perm in group.permissions" :key="perm">
                                            <input
                                                class="form-check-input"
                                                type="checkbox"
                                                :value="{ serviceType: eachService.id, access: perm }"
                                                v-on:change="onCheck($event, eachService)"
                                                :checked="checkIfAccessIsThereInThatService(perm, eachService.id)"
                                                :disabled="isReadForcedByWrite(perm, eachService.id) || isWriteForcedByHigherPerm(perm, eachService.id) || isUpdateForcedByDelete(perm, eachService.id)"
                                            >
                                            <label class="form-check-label" :class="{ 'perm-forced': isReadForcedByWrite(perm, eachService.id) || isWriteForcedByHigherPerm(perm, eachService.id) || isUpdateForcedByDelete(perm, eachService.id) }">
                                                <code>{{ perm }}</code>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </b-tab>
                    </b-tabs>
                </b-form-group>

                <hf-buttons name="Save" @executeAction="saveRole()">Save</hf-buttons>
            </div>
        </StudioSideBar>
    </div>

</template>

<script>
// import HfPopUp from "../element/hfPopup.vue";
import { mapGetters, mapActions } from "vuex/dist/vuex.common.js";
import StudioSideBar from "../element/StudioSideBar.vue";
import UtilsMixin from "../../mixins/utils";
import config from "../../config";

const PREDEFINED_ROLES = [
    {
        key: "viewer",
        name: "Viewer",
        icon: "mdi-eye-outline",
        description: "Minimal read-only access for business stakeholders.",
        badge: "Limited view",
        recommendedFor: "Founders, management, or external auditors",
        permissions: ["READ_ANALYTICS", "READ_USAGE", "READ_COMPANY", "READ_COMPLIANCE"]
    },
    {
        key: "analyst",
        name: "Analyst",
        icon: "mdi-chart-line",
        description: "Read-only access to verification, compliance, company, analytics, and usage data.",
        badge: "Read-only",
        recommendedFor: "Audit, support, or monitoring team",
        permissions: ["READ_VERIFIED_USER", "READ_ANALYTICS", "READ_USAGE", "READ_COMPANY", "READ_COMPANY_EXECUTIVES", "READ_DOCUMENT", "READ_COMPLIANCE"]
    },
    {
        key: "finance",
        name: "Finance",
        icon: "mdi-cash-multiple",
        description: "Can view usage, analytics, credits, and company billing-related information.",
        badge: "Billing access",
        recommendedFor: "Finance or accounts team",
        permissions: ["READ_ANALYTICS", "READ_USAGE", "READ_CREDIT", "READ_COMPANY"]
    },
    {
        key: "developer",
        name: "Developer",
        icon: "mdi-code-tags",
        description: "Can configure widgets and webhooks for technical integration.",
        badge: "Integration access",
        recommendedFor: "Engineering team",
        permissions: ["READ_WIDGET_CONFIG", "WRITE_WIDGET_CONFIG", "UPDATE_WIDGET_CONFIG", "READ_WEBHOOK_CONFIG", "WRITE_WEBHOOK_CONFIG", "UPDATE_WEBHOOK_CONFIG", "DELETE_WEBHOOK_CONFIG", "READ_USAGE"]
    },
    {
        key: "compliance_manager",
        name: "Compliance Manager",
        icon: "mdi-shield-check-outline",
        description: "Can review KYC/KYB cases, verify documents, and access compliance data.",
        badge: "KYC/KYB review",
        recommendedFor: "Compliance or operations team",
        permissions: ["READ_VERIFIED_USER", "READ_ANALYTICS", "READ_USAGE", "READ_COMPANY", "UPDATE_COMPANY_STATUS", "READ_COMPANY_EXECUTIVES", "READ_DOCUMENT", "VERIFY_DOCUMENT", "READ_COMPLIANCE"]
    },
    {
        key: "admin",
        name: "Admin",
        icon: "mdi-shield-crown-outline",
        description: "Full access to manage team, settings, verification, billing, and company account.",
        badge: "Full access",
        recommendedFor: "Organization owners / super admins",
        permissions: ["READ_VERIFIED_USER", "READ_WIDGET_CONFIG", "WRITE_WIDGET_CONFIG", "UPDATE_WIDGET_CONFIG", "READ_WEBHOOK_CONFIG", "WRITE_WEBHOOK_CONFIG", "UPDATE_WEBHOOK_CONFIG", "DELETE_WEBHOOK_CONFIG", "READ_ANALYTICS", "READ_USAGE", "READ_CREDIT", "READ_COMPANY", "DELETE_COMPANY", "UPDATE_COMPANY_STATUS", "READ_COMPANY_EXECUTIVES", "READ_DOCUMENT", "VERIFY_DOCUMENT", "READ_COMPLIANCE"]
    },
    {
        key: "custom",
        name: "Custom Role",
        icon: "mdi-tune-variant",
        description: "Start with no permissions and configure manually.",
        badge: "Advanced",
        recommendedFor: "Custom enterprise setups",
        permissions: []
    }
];

const SSI_PREDEFINED_ROLES = [
    {
        key: "auditor",
        name: "Auditor",
        icon: "mdi-clipboard-text-search-outline",
        description: "Read-only access to SSI operations and verification records.",
        badge: "Read-only",
        recommendedFor: "Audit and compliance teams",
        permissions: ["READ_DID", "READ_SCHEMA", "READ_CREDENTIAL", "READ_USAGE", "READ_TX"]
    },
    {
        key: "developer",
        name: "Developer",
        icon: "mdi-laptop",
        description: "Technical integration and transaction monitoring access.",
        badge: "Developer access",
        recommendedFor: "Engineering teams",
        permissions: ["READ_DID", "READ_SCHEMA", "READ_CREDENTIAL", "READ_USAGE", "READ_TX", "CHECK_LIVE_STATUS"]
    },
    {
        key: "verifier",
        name: "Verifier",
        icon: "mdi-check-decagram-outline",
        description: "Can verify credentials, presentations, and DID signatures.",
        badge: "Verification access",
        recommendedFor: "Verification services",
        permissions: ["READ_DID", "VERIFY_DID_SIGNATURE", "READ_SCHEMA", "READ_CREDENTIAL", "VERIFY_CREDENTIAL", "VERIFY_PRESENTATION", "READ_USAGE", "CHECK_LIVE_STATUS"]
    },
    {
        key: "credential_issuer",
        name: "Credential Issuer",
        icon: "mdi-card-account-details-outline",
        description: "Can issue and manage credentials and presentations.",
        badge: "Credential issuance",
        recommendedFor: "Issuing authorities",
        permissions: ["READ_DID", "VERIFY_DID_SIGNATURE", "READ_SCHEMA", "READ_CREDENTIAL", "WRITE_CREDENTIAL", "WRITE_PRESENTATION", "READ_USAGE", "CHECK_LIVE_STATUS"]
    },
    {
        key: "billing_manager",
        name: "Billing Manager",
        icon: "mdi-credit-card-settings-outline",
        description: "Manage SSI credits and monitor service usage.",
        badge: "Billing access",
        recommendedFor: "Finance teams",
        permissions: ["READ_CREDIT", "WRITE_CREDIT", "READ_USAGE", "CHECK_LIVE_STATUS"]
    },
    {
        key: "ssi_admin",
        name: "SSI Admin",
        icon: "mdi-shield-star-outline",
        description: "Full access to DIDs, schemas, credentials, presentations, usage, and credits.",
        badge: "Full access",
        recommendedFor: "Organization owners / SSI admins",
        permissions: ["ALL"]
    },
    {
        key: "identity_manager",
        name: "Identity Manager",
        icon: "mdi-identifier",
        description: "Manage decentralized identifiers, schemas, and credential lifecycle.",
        badge: "Identity management",
        recommendedFor: "SSI operations teams",
        permissions: ["READ_DID", "WRITE_DID", "VERIFY_DID_SIGNATURE", "ISSUE_DID_JWT", "READ_SCHEMA", "WRITE_SCHEMA", "READ_CREDENTIAL", "WRITE_CREDENTIAL", "VERIFY_CREDENTIAL", "WRITE_PRESENTATION", "VERIFY_PRESENTATION", "READ_USAGE", "READ_TX", "CHECK_LIVE_STATUS"]
    },
    {
        key: "custom",
        name: "Custom Role",
        icon: "mdi-tune-variant",
        description: "Start with no permissions and configure manually.",
        badge: "Advanced",
        recommendedFor: "Custom enterprise setups",
        permissions: []
    }
];

const DASHBOARD_PREDEFINED_ROLES = [
    {
        key: "dashboard_viewer",
        name: "Viewer",
        icon: "mdi-eye-outline",
        description: "Read-only access to Dashboard service operations.",
        badge: "Read-only",
        recommendedFor: "Stakeholders who need Dashboard visibility",
        permissions: ["READ_SERVICE"]
    },
    {
        key: "dashboard_editor",
        name: "Editor",
        icon: "mdi-pencil-outline",
        description: "Access to read and modify Dashboard service configuration.",
        badge: "Edit access",
        recommendedFor: "Operations or product teams",
        permissions: ["READ_SERVICE", "WRITE_SERVICE", "UPDATE_SERVICE", "DELETE_SERVICE"]
    },
    {
        key: "dashboard_admin",
        name: "Admin",
        icon: "mdi-shield-star-outline",
        description: "Full Dashboard service access.",
        badge: "Full access",
        recommendedFor: "Dashboard administrators",
        permissions: ["ALL"]
    },
    {
        key: "custom",
        name: "Custom Role",
        icon: "mdi-tune-variant",
        description: "Start with no permissions and configure manually.",
        badge: "Advanced",
        recommendedFor: "Custom enterprise setups",
        permissions: []
    }
];

export default {
    name: "AdminTeams",
    components: {
        // HfPopUp,
        StudioSideBar
    },
    computed: {
        ...mapGetters("mainStore", ["getAllServices", "getAllRoles"]),
        PREDEFINED_ROLES() {
            return PREDEFINED_ROLES;
        },
        SSI_PREDEFINED_ROLES() {
            return SSI_PREDEFINED_ROLES;
        },
        DASHBOARD_PREDEFINED_ROLES() {
            return DASHBOARD_PREDEFINED_ROLES;
        },
        categorizedServices() {
            const ssiServices = this.localAllServices.filter(s => s.id === config.SERVICE_TYPES.SSI_API);
            const idServices = this.localAllServices.filter(
                s => s.id === config.SERVICE_TYPES.CAVACH_API || s.id === 'CAVACH_KYB_API'
            );
            const otherServices = this.localAllServices.filter(
                s => s.id !== config.SERVICE_TYPES.SSI_API &&
                     s.id !== config.SERVICE_TYPES.CAVACH_API &&
                     s.id !== 'CAVACH_KYB_API'
            );
            const categories = [];
            if (ssiServices.length) categories.push({ label: 'SSI Service', icon: 'mdi-link-variant', iconColor: '#3b82f6', services: ssiServices });
            if (idServices.length) categories.push({ label: 'ID Service', icon: 'mdi-shield-account-outline', iconColor: '#10b981', services: idServices });
            if (otherServices.length) categories.push({ label: 'Other Services', icon: 'mdi-apps', iconColor: '#6b7280', services: otherServices });
            return categories;
        },
        hasSSIService() {
            return this.localAllServices.some(s => s.id === config.SERVICE_TYPES.SSI_API);
        },
        hasDashboardService() {
            return this.localAllServices.some(s => s.id === config.SERVICE_TYPES.DASHBOARD);
        },
        hasIDService() {
            return this.localAllServices.some(
                s => s.id !== config.SERVICE_TYPES.SSI_API && s.id !== config.SERVICE_TYPES.QUEST && s.id !== config.SERVICE_TYPES.DASHBOARD
            );
        },
        ssiServices() {
            return this.localAllServices.filter(s => s.id === config.SERVICE_TYPES.SSI_API);
        },
        dashboardServices() {
            return this.localAllServices.filter(s => s.id === config.SERVICE_TYPES.DASHBOARD);
        },
        idServices() {
            return this.localAllServices.filter(
                s => s.id !== config.SERVICE_TYPES.SSI_API &&
                     s.id !== config.SERVICE_TYPES.QUEST &&
                     s.id !== config.SERVICE_TYPES.DASHBOARD
            );
        }
    },
    watch: {
        getAllServices: {
            handler(services) {
                this.localAllServices = this.getRoleServices(services);
            },
            immediate: true
        }
    },
    data() {
        return {
            isLoading: false,
            edit: false,
            confirmDialog: false,
            roleToDelete: null,
            roleToDeleteName: '',
            roleModel: {
                "roleName": "",
                "roleDescription": "",
                "permissions": [
                ],
                "servicePermissions": []
            },
            localAllServices: [],
            checked: true,
            selectedRoles: {
                id: 'viewer',
                ssi: 'auditor',
                dashboard: 'custom'
            }
        }
    },
    mounted() {
        if (!this.getAllServices || this.getAllServices.length == 0) {
            this.fetchServicesList()

        }
        this.localAllServices = this.getRoleServices(this.getAllServices)
    },
    methods: {
        ...mapActions("mainStore", ["getMyRolesAction", "createARole", "deleteARole", "fetchServicesList", "updateARole",]),
        getRoleServices(services = []) {
            return services.filter(service => service.id !== config.SERVICE_TYPES.QUEST);
        },
        getPermSubGroups(serviceId, accessList) {
            const allKeys = Object.keys(accessList);
            const SSI_GROUPS = [
                { label: 'General',          icon: 'mdi-star-outline',                 iconColor: '#6366f1', keys: ['ALL'] },
                { label: 'DID',              icon: 'mdi-identifier',                   iconColor: '#3b82f6', keys: ['READ_DID', 'WRITE_DID', 'VERIFY_DID_SIGNATURE', 'ISSUE_DID_JWT'] },
                { label: 'Schema',           icon: 'mdi-file-tree-outline',            iconColor: '#8b5cf6', keys: ['READ_SCHEMA', 'WRITE_SCHEMA'] },
                { label: 'Credential',       icon: 'mdi-card-account-details-outline', iconColor: '#059669', keys: ['READ_CREDENTIAL', 'VERIFY_CREDENTIAL', 'WRITE_CREDENTIAL'] },
                { label: 'Presentation',     icon: 'mdi-presentation',                 iconColor: '#0891b2', keys: ['WRITE_PRESENTATION', 'VERIFY_PRESENTATION'] },
                { label: 'Credit',           icon: 'mdi-credit-card-outline',          iconColor: '#d97706', keys: ['WRITE_CREDIT', 'READ_CREDIT'] },
                { label: 'Usage & Tx',       icon: 'mdi-chart-line',                   iconColor: '#dc2626', keys: ['READ_USAGE', 'READ_TX', 'CHECK_LIVE_STATUS'] },
            ];
            const ID_GROUPS = [
                { label: 'General',               icon: 'mdi-star-outline',             iconColor: '#6366f1', keys: ['ALL'] },
                { label: 'Session & Users',        icon: 'mdi-account-multiple-outline', iconColor: '#3b82f6', keys: ['READ_VERIFIED_USER'] },
                { label: 'Widget Config',          icon: 'mdi-widgets-outline',          iconColor: '#059669', keys: ['READ_WIDGET_CONFIG', 'WRITE_WIDGET_CONFIG', 'UPDATE_WIDGET_CONFIG'] },
                { label: 'Webhook Config',         icon: 'mdi-webhook',                  iconColor: '#0891b2', keys: ['WRITE_WEBHOOK_CONFIG', 'READ_WEBHOOK_CONFIG', 'UPDATE_WEBHOOK_CONFIG', 'DELETE_WEBHOOK_CONFIG'] },
                { label: 'Analytics & Usage',      icon: 'mdi-chart-bar',                iconColor: '#d97706', keys: ['READ_ANALYTICS', 'READ_USAGE'] },
                { label: 'Credit',                 icon: 'mdi-credit-card-outline',      iconColor: '#dc2626', keys: ['READ_CREDIT'] },
                { label: 'Company',                icon: 'mdi-domain',                   iconColor: '#7c3aed', keys: ['READ_COMPANY', 'DELETE_COMPANY', 'UPDATE_COMPANY_STATUS'] },
                { label: 'Company Executives',     icon: 'mdi-account-tie-outline',      iconColor: '#065f46', keys: ['READ_COMPANY_EXECUTIVES'] },
                { label: 'Document',               icon: 'mdi-file-document-outline',    iconColor: '#92400e', keys: ['READ_DOCUMENT', 'VERIFY_DOCUMENT'] },
                { label: 'Compliance',             icon: 'mdi-shield-check-outline',     iconColor: '#1d4ed8', keys: ['READ_COMPLIANCE'] },
            ];
            const DASHBOARD_GROUPS = [
                { label: 'General', icon: 'mdi-star-outline', iconColor: '#6366f1', keys: ['ALL'] },
                { label: 'Dashboard Controls', icon: 'mdi-view-dashboard-outline', iconColor: '#0f766e', keys: ['READ_SERVICE', 'WRITE_SERVICE', 'UPDATE_SERVICE', 'DELETE_SERVICE'] }
            ];
            const groupDefs = serviceId === config.SERVICE_TYPES.SSI_API
            ? SSI_GROUPS
            : serviceId === config.SERVICE_TYPES.DASHBOARD
                ? DASHBOARD_GROUPS
                : ID_GROUPS;
            const assignedKeys = new Set();
            const result = []; 
            for (const group of groupDefs) {
                const perms = group.keys.filter(k => allKeys.includes(k));
                if (perms.length) {
                    result.push({ ...group, permissions: perms });
                    perms.forEach(k => assignedKeys.add(k));
                }
            }
            const remaining = allKeys.filter(k => !assignedKeys.has(k));
            if (remaining.length) {
                result.push({ label: 'Other', icon: 'mdi-dots-horizontal', iconColor: '#6b7280', permissions: remaining });
            }
            // }
            return result;
        },
        createTeamPopup() {
            this.$root.$emit("bv::show::modal", "create-team");
        },

        viewMembersPopup() {
            this.$root.$emit("bv::show::modal", "team-members")
        },

        openSlider(action = 'add') {
            if (action == 'add') {
                this.resetData()
                this.applyDefaultPredefinedRoles();
                this.edit = false;
                this.$root.$emit("bv::toggle::collapse", "sidebar-right");
            }
        },
        applyDefaultPredefinedRoles() {
            if (this.hasIDService) {
                const idDefault = PREDEFINED_ROLES.find(r => r.key === 'viewer');
                if (idDefault) this.selectPredefinedRole(idDefault, 'id');
            }
            if (this.hasSSIService) {
                const ssiDefault = SSI_PREDEFINED_ROLES.find(r => r.key === 'auditor');
                if (ssiDefault) this.selectPredefinedRole(ssiDefault, 'ssi');
            }
            if (this.hasDashboardService) {
                const dashboardDefault = DASHBOARD_PREDEFINED_ROLES.find(r => r.key === 'dashboard_viewer');
                if (dashboardDefault) this.selectPredefinedRole(dashboardDefault, 'dashboard');
            }
        },


        checkIfAccessIsThereInThatService(access, serviceId) {
            if (this.roleModel.permissions && this.roleModel.permissions.length > 0) {
                const index = this.roleModel.permissions.findIndex(x => x.serviceType == serviceId && x.access == access)
                if (index > -1) {
                    return true
                }
            }
            return false
        },
        openSliderForEdit(role) {
            this.resetData()
            this.edit = true;
            this.roleModel = { ...role };
            this.selectedRoles.id = this.detectSelectedPredefinedRole('id');
            this.selectedRoles.ssi = this.detectSelectedPredefinedRole('ssi');
            this.selectedRoles.dashboard = this.detectSelectedPredefinedRole('dashboard');
            this.$root.$emit("bv::toggle::collapse", "sidebar-right");
        },
        getServiceIdsByType(serviceType) {
            if (serviceType === 'ssi') return this.ssiServices.map(s => s.id);
            if (serviceType === 'dashboard') return this.dashboardServices.map(s => s.id);
            return this.idServices.map(s => s.id);
        },
        getAllPermissionKeysForServiceType(serviceType) {
            const targetServices = serviceType === 'ssi'
                ? this.ssiServices
                : serviceType === 'dashboard'
                    ? this.dashboardServices
                    : this.idServices;
            const keys = new Set();
            targetServices.forEach(service => {
                if (!service?.accessList) return;
                Object.keys(service.accessList).forEach(key => keys.add(key));
            });
            return Array.from(keys);
        },
        detectSelectedPredefinedRole(serviceType) {
            const serviceIds = new Set(this.getServiceIdsByType(serviceType));
            const currentPermissions = (this.roleModel.permissions || [])
                .filter(p => serviceIds.has(p.serviceType))
                .map(p => p.access);
            const currentSet = new Set(currentPermissions);
            const allServicePermissions = new Set(this.getAllPermissionKeysForServiceType(serviceType));
            const roles = serviceType === 'ssi'
                ? SSI_PREDEFINED_ROLES
                : serviceType === 'dashboard'
                    ? DASHBOARD_PREDEFINED_ROLES
                    : PREDEFINED_ROLES;
            const filteredRoles = roles.filter(r => r.key !== 'custom');
            if (!currentSet.size) return 'custom';
            const matched = filteredRoles.find(role => {
                if (role.permissions.includes('ALL')) {
                    if (currentSet.has('ALL')) return true;
                    return Array.from(allServicePermissions).every(access => currentSet.has(access));
                }
                if (role.permissions.length !== currentSet.size) return false;
                return role.permissions.every(p => currentSet.has(p));
            });
            return matched ? matched.key : 'custom';
        },
        selectPredefinedRole(role, serviceType) {
            this.selectedRoles[serviceType] = role.key;
            const serviceIds = new Set(this.getServiceIdsByType(serviceType));
            this.roleModel.permissions = (this.roleModel.permissions || []).filter(p => !serviceIds.has(p.serviceType));
            if (role.key === 'custom') {
                return;
            }
            this.roleModel.permissions = [
                ...this.roleModel.permissions,
                ...this.buildPermissionsForRole(role, serviceType)
            ];
        },
        buildPermissionsForRole(role, serviceType) {
            const permissions = [];
            const targetServices = serviceType === 'ssi'
                ? this.ssiServices
                : serviceType === 'dashboard'
                    ? this.dashboardServices
                    : this.idServices;

            targetServices.forEach(service => {
                if (!service?.accessList) return;
                if (role.permissions.includes('ALL')) {
                    Object.keys(service.accessList).forEach(access => {
                        if (service.accessList[access] !== undefined) {
                            permissions.push({ serviceType: service.id, access });
                        }
                    });
                    return;
                }
                role.permissions.forEach(access => {
                    if (service.accessList[access] !== undefined) {
                        permissions.push({ serviceType: service.id, access });
                    }
                });
            });
            return permissions;
        },

        closeSlider() {
            this.edit = false;
            // this.clearAll();
            this.$root.$emit("bv::toggle::collapse", "sidebar-right");
        },

        isUpdateForcedByDelete(accessKey, serviceId) {
            if (!accessKey.startsWith('UPDATE_')) return false;
            const deleteKey = 'DELETE_' + accessKey.substring(7); // 'UPDATE_'.length = 7
            return this.checkIfAccessIsThereInThatService(deleteKey, serviceId);
        },

        isReadForcedByWrite(accessKey, serviceId) {
            if (!accessKey.startsWith('READ_')) return false;
            const writeKey = 'WRITE_' + accessKey.substring(5);
            return this.checkIfAccessIsThereInThatService(writeKey, serviceId);
        },

        isWriteForcedByHigherPerm(accessKey, serviceId) {
            if (!accessKey.startsWith('WRITE_')) return false;
            const suffix = accessKey.substring(6); // 'WRITE_'.length = 6
            const deleteKey = 'DELETE_' + suffix;
            const updateKey = 'UPDATE_' + suffix;
            return this.checkIfAccessIsThereInThatService(deleteKey, serviceId) ||
                   this.checkIfAccessIsThereInThatService(updateKey, serviceId);
        },

        onCheck(event, service) {
            const ev = event.target._value;
            if (!ev) return;

            if (ev.access === 'ALL') {
                const allKeys = Object.keys(service.accessList);
                this.roleModel.permissions = this.roleModel.permissions.filter(x => x.serviceType !== ev.serviceType);
                if (event.target.checked) {
                    allKeys.forEach(key => {
                        this.roleModel.permissions.push({ serviceType: ev.serviceType, access: key });
                    });
                }
                return;
            }

            const index = this.roleModel.permissions.findIndex(x => x.serviceType == ev.serviceType && x.access == ev.access);
            if (index > -1) {
                this.roleModel.permissions.splice(index, 1);
            } else {
                this.roleModel.permissions.push(ev);
            }

            // Auto-manage READ when WRITE is toggled
            if (ev.access.startsWith('WRITE_')) {
                const readKey = 'READ_' + ev.access.substring(6);
                if (service.accessList[readKey] !== undefined && event.target.checked) {
                    const readIdx = this.roleModel.permissions.findIndex(
                        x => x.serviceType == ev.serviceType && x.access == readKey
                    );
                    if (readIdx === -1) {
                        this.roleModel.permissions.push({ serviceType: ev.serviceType, access: readKey });
                    }
                }
            }

            // Auto-manage WRITE (and READ) when DELETE or UPDATE is toggled
            if (ev.access.startsWith('DELETE_') || ev.access.startsWith('UPDATE_')) {
                const suffix = ev.access.substring(7); // both 'DELETE_' and 'UPDATE_' are 7 chars
                const writeKey = 'WRITE_' + suffix;
                if (service.accessList[writeKey] !== undefined && event.target.checked) {
                    // Auto-add WRITE
                    const writeIdx = this.roleModel.permissions.findIndex(
                        x => x.serviceType == ev.serviceType && x.access == writeKey
                    );
                    if (writeIdx === -1) {
                        this.roleModel.permissions.push({ serviceType: ev.serviceType, access: writeKey });
                    }
                    // Auto-add READ (cascade)
                    const readKey = 'READ_' + suffix;
                    if (service.accessList[readKey] !== undefined) {
                        const readIdx = this.roleModel.permissions.findIndex(
                            x => x.serviceType == ev.serviceType && x.access == readKey
                        );
                        if (readIdx === -1) {
                            this.roleModel.permissions.push({ serviceType: ev.serviceType, access: readKey });
                        }
                    }
                }
                // Auto-add UPDATE when DELETE is toggled
                if (ev.access.startsWith('DELETE_') && event.target.checked) {
                    const updateKey = 'UPDATE_' + suffix;
                    if (service.accessList[updateKey] !== undefined) {
                        const updateIdx = this.roleModel.permissions.findIndex(
                            x => x.serviceType == ev.serviceType && x.access == updateKey
                        );
                        if (updateIdx === -1) {
                            this.roleModel.permissions.push({ serviceType: ev.serviceType, access: updateKey });
                        }
                    }
                }
            }
        },

        async saveRole() {
            try {
                if (!this.roleModel.roleName) {
                    throw new Error('Please enter a role name')
                }

                if (this.roleModel.roleName.length > 50) {
                    throw new Error('Role name can not be greater than 50 characters')
                }

                if (this.roleModel.roleDescription.length > 200) {
                    throw new Error('Role description can not be greater than 200 characters')
                }

                if (this.roleModel.permissions.length <= 0) {
                    throw new Error('Please associate atleast one role')
                }

                // do all validations...
                this.isLoading = true
                if (!this.edit) {
                    await this.createARole(this.roleModel)
                } else {
                    await this.updateARole(this.roleModel)
                }
                this.isLoading = false
                this.notifySuccess('Role saved successfully')
                this.resetData()
                this.closeSlider()
            } catch (e) {
                this.notifyErr(e.message)
                this.isLoading = false
            }
        },

        promptDeleteRole(roleId, roleName) {
            this.roleToDelete = roleId;
            this.roleToDeleteName = roleName;
            this.confirmDialog = true;
        },

        async confirmDeleteRole() {
            try {
                this.isLoading = true;
                await this.deleteARole(this.roleToDelete);
                this.isLoading = false;
                this.confirmDialog = false;
                this.roleToDelete = null;
                this.roleToDeleteName = '';
                this.notifySuccess('Role deleted successfully');
            } catch (e) {
                this.notifyErr(e.message);
                this.isLoading = false;
            }
        },

        resetData() {
            this.roleModel = {
                "roleName": "",
                "roleDescription": "",
                "permissions": [
                ],
                "servicePermissions": []
            }
            this.selectedRoles = { id: 'viewer', ssi: 'auditor', dashboard: 'custom' };
            this.edit = false;
        },
    },
    mixins: [UtilsMixin]
}
</script>

<style scoped>
.perm-scroll-box {
    border: 1px solid #dee2e6;
    border-radius: 4px;
    padding: 8px 12px;
    max-height: 400px;
    overflow-y: auto;
}

.role-cards-grid {
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
    padding-bottom: 6px;
    gap: 10px;
    margin-bottom: 12px;
    scroll-snap-type: x proximity;
}

.role-card {
    text-align: left;
    background: #fff;
    border: 1px solid #dbe2ea;
    border-radius: 8px;
    padding: 10px 12px;
    min-width: 260px;
    max-width: 260px;
    flex: 0 0 auto;
    scroll-snap-align: start;
}

.role-card:hover {
    border-color: #7aa5d2;
}

.role-card-selected {
    border-color: #2563eb;
    box-shadow: 0 0 0 1px #2563eb;
    background: #f8fbff;
}

.role-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    margin-bottom: 6px;
}

.role-card-title {
    font-weight: 700;
    color: #1f2937;
    display: inline-flex;
    align-items: center;
    gap: 6px;
}

.role-card-icon {
    color: #2563eb;
}

.role-card-desc {
    font-size: 12px;
    color: #4b5563;
    margin-bottom: 6px;
}

.role-card-footer {
    font-size: 11px;
    color: #6b7280;
    display: flex;
    justify-content: space-between;
    gap: 8px;
}

.role-cards-grid::-webkit-scrollbar {
    height: 7px;
}

.role-cards-grid::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 999px;
}

.perm-service-block {
    margin-bottom: 12px;
}

.perm-service-block:not(:last-child) {
    border-bottom: 1px solid #e9ecef;
    padding-bottom: 10px;
}

.perm-service-header {
    font-size: 13px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #343a40;
    padding: 6px 0 4px;
}

.perm-group-block {
    margin: 6px 0 6px 8px;
}

.perm-group-label {
    font-size: 12px;
    font-weight: 600;
    color: #6c757d;
    margin-bottom: 4px;
    padding: 2px 0;
    border-left: 3px solid #dee2e6;
    padding-left: 6px;
}

.perm-item {
    margin-left: 12px;
    margin-bottom: 2px;
}

.perm-item code {
    font-size: 12px;
}

.perm-forced {
    color: #6c757d;
    font-style: italic;
}
</style>
