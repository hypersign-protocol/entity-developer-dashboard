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
                      v-for="eachService in localAllServices"
                      :key="eachService.id"
                      class="service-section"
                    >
                      <div class="service-name">{{ eachService.name }}</div>
                      <div class="permission-checks">
                        <label
                          v-for="eachAccess in Object.keys(eachService.accessList)"
                          :key="eachAccess"
                          class="perm-check-label"
                        >
                          <input
                            type="checkbox"
                            class="perm-checkbox"
                            :value="{ serviceType: eachService.id, access: eachAccess }"
                            v-on:change="onCheck($event)"
                            :checked="checkIfAccessIsThereInThatService(eachAccess, eachService.id)"
                          />
                          <code class="perm-code">{{ eachAccess }}</code>
                        </label>
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
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  max-height: 340px;
  overflow-y: auto;
  padding: 10px;
}

.service-section {
  border-bottom: 1px solid #f3f4f6;
  padding: 8px 4px;
}

.service-section:last-child {
  border-bottom: none;
}

.service-name {
  font-weight: 600;
  font-size: 12px;
  color: #374151;
  margin-bottom: 6px;
}

.permission-checks {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.perm-check-label {
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
}

.perm-checkbox {
  cursor: pointer;
}

.perm-code {
  font-size: 11px;
  background: #f3f4f6;
  padding: 2px 6px;
  border-radius: 4px;
  color: #374151;
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

        onCheck(event) {
            const ev = event.target._value
            if (ev) {
                const index = this.roleModel.permissions.findIndex(x => ((x.serviceType == ev.serviceType) && (x.access == ev.access)))
                if (index > -1) {
                    this.roleModel.permissions.splice(index, 1)
                } else {
                    this.roleModel.permissions.push(ev)
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
            this.edit = false;
        },
    },
    mixins: [UtilsMixin]
}
</script>
