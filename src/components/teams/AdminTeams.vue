<template>
    <div>
        <load-ing :active.sync="isLoading" :can-cancel="true" :is-full-page="true"></load-ing>

        <div class="row mb-3">
            <div class="col-md-4">
            </div>
            <div class="col-md-8">
                <button type="button" class="btn btn-outline-secondary mx-1" style="float: inline-end" title="Reload">
                    <i class="fa fa-retweet" aria-hidden="true"></i>
                </button>
                <button type="button" class="btn btn-primary" style="float: inline-end;" @click="openSlider('add')"><i
                        class="fa fa-gamepad" aria-hidden="true"></i> Create Custom Role</button>
            </div>
        </div>
        <div class="row mb-3" style="padding: 10px;">
            <table class="table ">
                <tbody v-if="getAllRoles.length > 0">
                    <!-- eslint-disable-next-line -->
                    <tr v-for="role in getAllRoles" v-bind:key="getAllRoles.roleName">
                        <a href="#"
                            class="list-group-item list-group-item-action align-items-start d-flex align-items-center ">
                            <b-avatar size="4em" rounded="lg" text="MT"></b-avatar>
                            <div class="w-100 mx-3 mt-3 align-items-center">
                                <h5 class="mb-1">{{ role.roleName }}</h5>
                                <p>
                                    {{ role.roleDescription }}
                                </p>
                            </div>
                            <div class="d-flex  align-items-center">
                                <b-badge pill variant="warning">{{ role.permissions.length }}
                                    permissions</b-badge>
                                <b-dropdown size="sm" variant="link" toggle-class="text-decoration-none" no-caret
                                    dropleft>
                                    <template #button-content>
                                        <b-icon style="color:grey" icon="list" aria-hidden="true"></b-icon>
                                    </template>
                                    <b-dropdown-item-button style="text-align: left;"
                                        @click="openSliderForEdit(role)">Edit</b-dropdown-item-button>
                                    <b-dropdown-item-button style="text-align: left;"
                                        @click="deleteThisRole(role._id)">Delete</b-dropdown-item-button>
                                </b-dropdown>
                            </div>
                        </a>
                    </tr>
                </tbody>
            </table>
        </div>

        <StudioSideBar :title="edit ? 'Edit Role' : 'Add Role'">
            <b-form class="container" @submit="saveRole()">
                <b-form-group id="input-group-2" label="Role Name:" label-for="input-1">
                    <b-form-input v-model="roleModel.roleName" id="input-2" placeholder="Admin" required></b-form-input>
                </b-form-group>

                <b-form-group id="input-group-2" label="Role Description:" label-for="textarea">
                    <b-form-textarea v-model="roleModel.roleDescription" id="textarea"
                        placeholder="To allow access to all users" rows="3" max-rows="6"></b-form-textarea>
                </b-form-group>

                <b-form-group label="Role Permissions:" label-for="input-3" v-if="!edit">
                    <div id="input-3" class="card" style="padding:10px; max-height: 350px; overflow-y: auto;">
                        <ul class="list-unstyled">
                            <li v-for="eachService in getAllServices" v-bind:key="eachService.id"
                                style="border-bottom: 1px solid lightgray; padding: 10px;">
                                <label><strong>{{ eachService.name }}</strong></label>
                                <b-form-checkbox v-for="eachAccess in Object.keys(eachService.accessList)"
                                    v-bind:key="eachAccess" :name="eachAccess" @change="onCheck($event)"
                                    :value="{ serviceType: eachService.id, access: eachAccess, checked: true }"
                                    :unchecked-value="{ serviceType: eachService.id, access: eachAccess, checked: false }">
                                    {{ eachAccess }}
                                </b-form-checkbox>
                            </li>
                        </ul>
                    </div>
                </b-form-group>


                <b-form-group label="Role Permissions:" label-for="input-3" v-else>
                    <div id="input-3" class="card" style="padding:10px; max-height: 350px; overflow-y: auto;">
                        <ul class="list-unstyled">

                            <!-- <li v-for="eachService in roleModel.servicePermissions" v-bind:key="eachService.id"
                                style="border-bottom: 1px solid lightgray; padding: 10px;">
                                <label><strong>{{ eachService.name }}</strong></label>
                                <b-form-checkbox v-for="eachAccess in eachService.accessList"
                                    v-bind:key="eachAccess.access" :name="eachAccess.access" @change="onCheck($event)"
                                    :value="{ serviceType: eachService.id, access: eachAccess.access, checked: true }"
                                    :unchecked-value="{ serviceType: eachService.id, access: eachAccess.access, checked: false }">
                                    {{ eachAccess.access }}
                                </b-form-checkbox>
                            </li> -->
                            <li v-for="eachService in localAllServices" v-bind:key="eachService.id"
                                style="border-bottom: 1px solid lightgray; padding: 10px;">
                                <label><strong>{{ eachService.name }}</strong></label>
                                <b-form-checkbox v-for="eachAccess in Object.keys(eachService.accessList)"
                                    v-bind:key="eachAccess" :name="eachAccess" @change="onCheck($event)"
                                    :value="checkIfAccessIsThereInThatService(eachAccess, eachService.id)"
                                    :v-check="checkIfAccessIsThereInThatService(eachAccess, eachService.id)"
                                    :unchecked-value="{ serviceType: eachService.id, access: eachAccess, checked: false }">
                                    {{ eachAccess }}
                                </b-form-checkbox>
                            </li>

                        </ul>
                    </div>
                </b-form-group>

                <b-button type="submit" variant="primary">Save</b-button>
            </b-form>
        </StudioSideBar>
    </div>

</template>

<script>
// import HfPopUp from "../element/hfPopup.vue";
import { mapGetters, mapActions } from "vuex/dist/vuex.common.js";
import StudioSideBar from "../element/StudioSideBar.vue";
import UtilsMixin from "../../mixins/utils";

export default {
    name: "AdminTeams",
    components: {
        // HfPopUp,
        StudioSideBar
    },
    computed: {
        ...mapGetters("mainStore", ["getAllServices", "getAllRoles"]),

    },
    data() {
        return {
            isLoading: false,
            edit: false,
            roleModel: {
                "roleName": "",
                "roleDescription": "",
                "permissions": [
                ],
                "servicePermissions": []
            },
            localAllServices: []
        }
    },
    mounted() {

        if (!this.getAllServices || this.getAllServices.length == 0) {
            this.fetchServicesList()

        }

        this.localAllServices = this.getAllServices
        this.getMyRolesAction()


    },
    methods: {
        ...mapActions("mainStore", ["getMyRolesAction", "createARole", "deleteARole", "fetchServicesList"]),
        createTeamPopup() {
            this.$root.$emit("bv::show::modal", "create-team");
        },

        viewMembersPopup() {
            this.$root.$emit("bv::show::modal", "team-members")
        },

        openSlider(action = 'add') {
            if (action == 'add') {
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
            console.log(role)
            this.edit = true;
            this.roleModel = { ...role };
            this.roleModel.servicePermissions = []
            this.getAllServices.forEach(y => {
                const permissions = this.roleModel.permissions.filter(x => {
                    if (x.serviceType === y.id) return x
                })
                console.log(permissions)
                if (permissions && permissions.length > 0) {
                    this.roleModel.servicePermissions.push({
                        name: y.name,
                        accessList: permissions,
                        id: y.id
                    })
                }

            })
            this.$root.$emit("bv::toggle::collapse", "sidebar-right");
        },

        closeSlider() {
            this.edit = false;
            // this.clearAll();
            this.$root.$emit("bv::toggle::collapse", "sidebar-right");
        },

        onCheck(event) {
            if (event['checked']) {
                this.roleModel.permissions.push(event)
            } else {
                const index = this.roleModel.permissions.findIndex(x => ((x.serviceType == event.serviceType) && (x.access == event.access)))
                if (index > -1) {
                    this.roleModel.permissions.splice(index, 1)
                }
            }
        },

        async saveRole() {

            try {
                // do all validations...
                this.isLoading = true
                await this.createARole(this.roleModel)
                this.isLoading = false
                this.notifySuccess('Role saved successfully')

            } catch (e) {
                this.notifyError(e.message)
                this.isLoading = false
            }
        },

        async deleteThisRole(roleId) {

            try {
                const result = confirm('Are you sure you want to delete this role? Once deleted, all users linked with this role will loose access.')
                if (result) {
                    // do all validations...
                    this.isLoading = true
                    await this.deleteARole(roleId)
                    this.isLoading = false
                    this.notifySuccess('Role is deleted successfully')
                }


            } catch (e) {
                this.notifyError(e.message)
                this.isLoading = false
            }
        }

    },
    mixins: [UtilsMixin]
}
</script>