<template>
    <div class="admin-teams-root">
        <load-ing :active.sync="isLoading" :can-cancel="true" :is-full-page="true"></load-ing>

        <!-- ── Action bar ──────────────────────────────────────── -->
        <div class="action-bar">
          <div class="action-bar-title">
            <v-icon small class="mr-1" color="#4b5563">mdi-shield-account-outline</v-icon>
            <span>Roles &amp; Permissions
              <v-chip x-small class="ml-2" color="blue lighten-5" text-color="blue darken-2">
                {{ getAllRoles.length }}
              </v-chip>
            </span>
          </div>
          <div class="action-bar-btns">
            <v-btn icon small title="Reload" @click="getMyRolesAction" class="mr-1">
              <v-icon small>mdi-refresh</v-icon>
            </v-btn>
            <hf-buttons name="Create Role" iconClass="fa fa-gamepad" @executeAction="openSlider('add')" />
          </div>
        </div>

        <v-divider class="mb-3"></v-divider>

        <!-- ── Role cards ─────────────────────────────────────── -->
        <div v-if="getAllRoles.length > 0" class="role-list">
          <v-card
            v-for="role in getAllRoles"
            :key="role.roleName"
            flat
            outlined
            class="role-card"
          >
            <div class="role-card-inner">
              <!-- Avatar -->
              <v-avatar size="44" color="blue lighten-4" class="role-avatar mr-3">
                <span class="role-initial">{{ role.roleName.charAt(0).toUpperCase() }}</span>
              </v-avatar>

              <!-- Info -->
              <div class="role-info">
                <div class="role-name">{{ role.roleName }}</div>
                <div class="role-desc">{{ role.roleDescription || 'No description' }}</div>
                <v-chip x-small color="orange lighten-4" text-color="orange darken-3" class="mt-1">
                  {{ role.permissions.length }} permission{{ role.permissions.length !== 1 ? 's' : '' }}
                </v-chip>
              </div>

              <!-- Actions menu -->
              <v-menu offset-y left>
                <template #activator="{ on }">
                  <v-btn icon small v-on="on">
                    <v-icon small color="grey">mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <v-list dense>
                  <v-list-item @click="openSliderForEdit(role)">
                    <v-list-item-icon><v-icon small>mdi-pencil-outline</v-icon></v-list-item-icon>
                    <v-list-item-title>Edit</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="promptDeleteRole(role._id, role.roleName)" class="red--text">
                    <v-list-item-icon><v-icon small color="red">mdi-trash-can-outline</v-icon></v-list-item-icon>
                    <v-list-item-title class="red--text">Delete</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
          </v-card>
        </div>

        <div v-else>
            <empty-container title="No roles yet. Create a custom role to get started." icon="fa fa-shield-alt" />
        </div>

        <!-- ── Delete confirmation dialog ──────────────────── -->
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

        <!-- ── Sidebar: Create / Edit Role ───────────────────── -->
        <StudioSideBar :title="edit ? 'Edit Role' : 'Create Role'">
            <div class="container px-4 py-2">
                <div class="mb-4">
                  <label class="field-label">Role Name <span class="required">*</span></label>
                  <v-text-field
                    v-model="roleModel.roleName"
                    placeholder="e.g. Admin"
                    outlined
                    dense
                    hide-details="auto"
                    :counter="50"
                    :rules="[v => !!v || 'Role name is required', v => v.length <= 50 || 'Max 50 characters']"
                  ></v-text-field>
                </div>

                <div class="mb-4">
                  <label class="field-label">Description</label>
                  <v-textarea
                    v-model="roleModel.roleDescription"
                    placeholder="Describe what this role can do..."
                    outlined
                    dense
                    rows="3"
                    hide-details="auto"
                    :counter="200"
                    :rules="[v => !v || v.length <= 200 || 'Max 200 characters']"
                  ></v-textarea>
                </div>

                <div class="mb-4">
                  <label class="field-label">Permissions <span class="required">*</span></label>
                  <div class="permissions-box">
                    <div
                      v-for="category in categorizedServices"
                      :key="category.label"
                      class="category-section"
                    >
                        <div class="category-header">
                          <v-icon x-small :color="category.iconColor" class="mr-1">{{ category.icon }}</v-icon>
                          {{ category.label }}
                        </div>
                        <div
                          v-for="eachService in category.services"
                          :key="eachService.id"
                          class="service-section"
                        >
                          <div class="service-name">{{ eachService.name }}</div>
                          <div
                            v-for="subGroup in getPermSubGroups(eachService.id, eachService.accessList)"
                            :key="subGroup.label"
                            class="perm-subgroup"
                          >
                              <div class="perm-subgroup-header">
                                <v-icon x-small :color="subGroup.iconColor" class="mr-1">{{ subGroup.icon }}</v-icon>
                                {{ subGroup.label }}
                              </div>
                              <div class="permission-checks">
                                <label
                                  v-for="eachAccess in subGroup.permissions"
                                  :key="eachAccess"
                                  class="perm-check-label"
                                >
                                  <input
                                    type="checkbox"
                                    class="perm-checkbox"
                                    :value="{ serviceType: eachService.id, access: eachAccess }"
                                    v-on:change="onCheck($event, eachService)"
                                    :checked="checkIfAccessIsThereInThatService(eachAccess, eachService.id)"
                                  />
                                  <code class="perm-code">{{ eachAccess }}</code>
                                </label>
                              </div>
                          </div>
                        </div>
                    </div>
                    <div v-if="!localAllServices || localAllServices.length === 0" class="text-center py-4 text--secondary caption">
                      No services available
                    </div>
                  </div>
                </div>

                <hf-buttons name="Save Role" @executeAction="saveRole" />
            </div>
        </StudioSideBar>
    </div>
</template>

<style scoped>
.admin-teams-root {
  padding: 4px 0;
}

.action-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 4px 8px;
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

/* ─── Role card ─────────────────────────────────────── */
.role-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.role-card {
  border-radius: 8px !important;
  border: 1px solid rgba(0, 0, 0, 0.125) !important;
  box-shadow: 0 0 2rem 0 rgba(136, 152, 170, 0.12) !important;
  background: #ffffff;
  transition: box-shadow 0.15s;
}

.role-card:hover {
  box-shadow: 0 0 2rem 0 rgba(136, 152, 170, 0.3) !important;
}

.role-card-inner {
  display: flex;
  align-items: center;
  padding: 14px 16px;
  gap: 4px;
}

.role-avatar {
  flex-shrink: 0;
}

.role-initial {
  font-size: 18px;
  font-weight: 700;
  color: #1d4ed8;
}

.role-info {
  flex: 1;
  min-width: 0;
}

.role-name {
  font-weight: 600;
  font-size: 14px;
  color: #111827;
}

.role-desc {
  font-size: 12px;
  color: #6b7280;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 360px;
}

/* ─── Permissions box ───────────────────────────────── */
.permissions-box {
  border: 1px solid #d0d7de;
  border-radius: 6px;
  max-height: 380px;
  overflow-y: auto;
  font-size: 13px;
}

/* ─── Category headers ──────────────────────────────── */
.category-section {
  border-bottom: 1px solid #d0d7de;
}

.category-section:last-child {
  border-bottom: none;
}

.category-header {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 600;
  color: #57606a;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  background: #f6f8fa;
  padding: 6px 12px;
  border-bottom: 1px solid #d0d7de;
  position: sticky;
  top: 0;
  z-index: 1;
}

.service-section {
  padding: 0;
}

.service-section:last-child {
  border-bottom: none;
}

.service-name {
  font-weight: 600;
  font-size: 11px;
  color: #57606a;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  padding: 5px 12px 3px;
  background: #f6f8fa;
  border-bottom: 1px solid #eaeef2;
}

/* ─── Permission sub-groups ────────────────────────── */
.perm-subgroup {
  border-bottom: 1px solid #eaeef2;
}

.perm-subgroup:last-child {
  border-bottom: none;
}

.perm-subgroup-header {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  font-weight: 600;
  color: #57606a;
  padding: 5px 12px 4px 20px;
  background: #fafbfc;
  border-bottom: 1px solid #eaeef2;
}

.permission-checks {
  display: flex;
  flex-direction: column;
}

.perm-check-label {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 12px 5px 28px;
  cursor: pointer;
  border-bottom: 1px solid #f3f4f6;
  transition: background 0.1s;
}

.perm-check-label:last-child {
  border-bottom: none;
}

.perm-check-label:hover {
  background: #f0f6ff;
}

.perm-checkbox {
  cursor: pointer;
  accent-color: #0969da;
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

.perm-code {
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
  font-size: 12px;
  color: #24292f;
}

/* ─── Sidebar form ───────────────────────────────────── */
.field-label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.required {
  color: #ef4444;
}
</style>

<script>
// import HfPopUp from "../element/hfPopup.vue";
import { mapGetters, mapActions } from "vuex/dist/vuex.common.js";
import StudioSideBar from "../element/StudioSideBar.vue";
import UtilsMixin from "../../mixins/utils";
import config from "../../config";

export default {
    name: "AdminTeams",
    components: {
        // HfPopUp,
        StudioSideBar
    },
    computed: {
        ...mapGetters("mainStore", ["getAllServices", "getAllRoles"]),
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
            if (ssiServices.length) {
                categories.push({ label: 'SSI Service', icon: 'mdi-link-variant', iconColor: '#3b82f6', services: ssiServices });
            }
            if (idServices.length) {
                categories.push({ label: 'ID Service', icon: 'mdi-shield-account-outline', iconColor: '#10b981', services: idServices });
            }
            if (otherServices.length) {
                categories.push({ label: 'Other Services', icon: 'mdi-apps', iconColor: '#6b7280', services: otherServices });
            }
            return categories;
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
            checked: true
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
                { label: 'General',             icon: 'mdi-star-outline',                iconColor: '#6366f1', keys: ['ALL'] },
                { label: 'DID',                 icon: 'mdi-identifier',                  iconColor: '#3b82f6', keys: ['READ_DID', 'WRITE_DID', 'VERIFY_DID_SIGNATURE', 'ISSUE_DID_JWT'] },
                { label: 'Schema',              icon: 'mdi-file-tree-outline',           iconColor: '#8b5cf6', keys: ['READ_SCHEMA', 'WRITE_SCHEMA'] },
                { label: 'Credential',          icon: 'mdi-card-account-details-outline',iconColor: '#059669', keys: ['READ_CREDENTIAL', 'VERIFY_CREDENTIAL', 'WRITE_CREDENTIAL'] },
                { label: 'Presentation',        icon: 'mdi-presentation',                iconColor: '#0891b2', keys: ['WRITE_PRESENTATION', 'VERIFY_PRESENTATION'] },
                { label: 'Credit',              icon: 'mdi-credit-card-outline',         iconColor: '#d97706', keys: ['WRITE_CREDIT', 'READ_CREDIT'] },
                { label: 'Usage & Tx',          icon: 'mdi-chart-line',                  iconColor: '#dc2626', keys: ['READ_USAGE', 'READ_TX', 'CHECK_LIVE_STATUS'] },
            ];
            const ID_GROUPS = [
                { label: 'General',               icon: 'mdi-star-outline',              iconColor: '#6366f1', keys: ['ALL'] },
                { label: 'Session & Users',        icon: 'mdi-account-multiple-outline',  iconColor: '#3b82f6', keys: ['READ_USER_CONSENT', 'WRITE_USER_CONSENT', 'READ_SESSION', 'WRITE_SESSION', 'READ_VERIFIED_USER'] },
                { label: 'Biometrics',             icon: 'mdi-face-recognition',          iconColor: '#8b5cf6', keys: ['WRITE_PASSIVE_LIVELINESS', 'WRITE_DOC_OCR', 'CHECK_LIVE_STATUS'] },
                { label: 'Widget Config',          icon: 'mdi-widgets-outline',           iconColor: '#059669', keys: ['READ_WIDGET_CONFIG', 'WRITE_WIDGET_CONFIG', 'UPDATE_WIDGET_CONFIG'] },
                { label: 'Webhook Config',         icon: 'mdi-webhook',                   iconColor: '#0891b2', keys: ['WRITE_WEBHOOK_CONFIG', 'READ_WEBHOOK_CONFIG', 'UPDATE_WEBHOOK_CONFIG', 'DELETE_WEBHOOK_CONFIG'] },
                { label: 'Analytics & Usage',      icon: 'mdi-chart-bar',                 iconColor: '#d97706', keys: ['READ_ANALYTICS', 'READ_USAGE', 'WRITE_AUTH'] },
                { label: 'Credit',                 icon: 'mdi-credit-card-outline',       iconColor: '#dc2626', keys: ['WRITE_CREDIT', 'READ_CREDIT'] },
                { label: 'Company',                icon: 'mdi-domain',                    iconColor: '#7c3aed', keys: ['READ_COMPANY', 'WRITE_COMPANY', 'UPDATE_COMPANY', 'DELETE_COMPANY', 'UPDATE_COMPANY_STATUS'] },
                { label: 'Company Executives',     icon: 'mdi-account-tie-outline',       iconColor: '#065f46', keys: ['READ_COMPANY_EXECUTIVES', 'WRITE_COMPANY_EXECUTIVES', 'UPDATE_COMPANY_EXECUTIVES', 'DELETE_COMPANY_EXECUTIVES', 'RESEND_COMPANY_EXECUTIVES_MAIL'] },
                { label: 'Document',               icon: 'mdi-file-document-outline',     iconColor: '#92400e', keys: ['WRITE_DOCUMENT', 'READ_DOCUMENT', 'DELETE_DOCUMENT', 'VERIFY_DOCUMENT'] },
                { label: 'Compliance',             icon: 'mdi-shield-check-outline',      iconColor: '#1d4ed8', keys: ['WRITE_COMPLIANCE', 'READ_COMPLIANCE'] },
            ];
            const groupDefs = serviceId === config.SERVICE_TYPES.SSI_API ? SSI_GROUPS : ID_GROUPS;
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
                this.edit = false;
                this.$root.$emit("bv::toggle::collapse", "sidebar-right");
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
            this.$root.$emit("bv::toggle::collapse", "sidebar-right");
        },

        closeSlider() {
            this.edit = false;
            // this.clearAll();
            this.$root.$emit("bv::toggle::collapse", "sidebar-right");
        },

        onCheck(event, service) {
            const ev = event.target._value;
            if (!ev) return;

            if (ev.access === 'ALL') {
                const allKeys = Object.keys(service.accessList);
                // Remove all existing permissions for this service
                this.roleModel.permissions = this.roleModel.permissions.filter(x => x.serviceType !== ev.serviceType);
                if (event.target.checked) {
                    // Add every permission for this service
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
            this.edit = false;
        },
    },
    mixins: [UtilsMixin]
}
</script>
