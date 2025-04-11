<template>
    <div>
        <load-ing :active.sync="isLoading" :can-cancel="true" :is-full-page="true"></load-ing>

        <div class="row">
            <div class="col-md-4">
            </div>
            <div class="col-md-8">
                <!-- <v-btn type="button" class="btn btn-outline-secondary mx-1" style="float: inline-end" title="Reload"
                    @click="getMyRolesAction()" plain>
                    <b-icon icon="arrow-clockwise"></b-icon>
                </v-btn> -->
                <hf-buttons name="" title="Reload" class="mx-1" :bIcon="true"  style="float: inline-end"  iconClass="arrow-clockwise" @executeAction="getMyRolesAction">
                </hf-buttons>
                <hf-buttons name="Create Custom Role" title="Reload" style="float: inline-end"  iconClass="fa fa-gamepad" @executeAction="openSlider('add')">
                </hf-buttons>
                <!-- <v-btn type="button" class="btn btn-secondary" plain style="float: inline-end;" @click="openSlider('add')"><i
                        class="fa fa-gamepad" aria-hidden="true"></i> Create Custom Role</v-btn> -->
            </div>
        </div>
        <div class="row" v-if="getAllRoles.length > 0">
            <table class="table">
                <tbody>
                    <!-- eslint-disable-next-line -->
                    <tr v-for="role in getAllRoles" v-bind:key="getAllRoles.roleName">
                        <!-- <a href="#" -->
                        <td>
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
                                <b-dropdown size="sm" variant="link" toggle-class="text-decoration-none" no-caret
                                    dropleft>
                                    <template #button-content>
                                        <b-icon style="color:grey" icon="list" aria-hidden="true"></b-icon>
                                    </template>
                                    <b-dropdown-item-button style="text-align: left;" @click="openSliderForEdit(role)">
                                        <b-icon icon="pencil-square" aria-hidden="true"></b-icon>
                                        Edit</b-dropdown-item-button>
                                    <b-dropdown-item-button style="text-align: left;"
                                        @click="deleteThisRole(role._id)"><i class="fa fa-trash"></i>
                                        Delete</b-dropdown-item-button>
                                </b-dropdown>
                            </div>
                            </div> 
                        </td>
                        <!-- </a> -->
                    </tr> 
                </tbody>
            </table>
        </div>
        <div v-else>
            <h4>No Role(s) Found!</h4>
        </div>

        <StudioSideBar :title="edit ? 'Edit Role' : 'Add Role'">
            <div class="container">
                <b-form-group id="input-group-2" style="font-weight: bold;" label="Role Name:" label-for="input-1">
                    <b-form-input v-model="roleModel.roleName" id="input-2" placeholder="Admin" required></b-form-input>
                    <small style="color: grey; font-size: x-small;">Upto 10 chars</small>
                </b-form-group>

                <b-form-group id="input-group-2" style="font-weight: bold;" label="Role Description:"
                    label-for="textarea">
                    <b-form-textarea v-model="roleModel.roleDescription" id="textarea"
                        placeholder="To allow access to all users" rows="3" max-rows="6"></b-form-textarea>
                    <small style="color: grey; font-size: x-small;">Upto 100 chars</small>
                </b-form-group>
                <b-form-group label="Role Permissions:" style="font-weight: bold;" label-for="input-3">
                    <div id="input-3" class="card" style="padding:10px; max-height: 350px; overflow-y: auto;">
                        <ul class="list-unstyled">
                            <li v-for="eachService in localAllServices" v-bind:key="eachService.id"
                                style="border-bottom: 1px solid lightgray; padding: 10px;">
                                <label><strong>{{ eachService.name }}</strong></label>

                                <div class="form-check" v-for="eachAccess in Object.keys(eachService.accessList)"
                                    v-bind:key="eachAccess">
                                    <input class="form-check-input" type="checkbox"
                                        :value="{ serviceType: eachService.id, access: eachAccess }"
                                        v-on:change="onCheck($event)"
                                        :checked="checkIfAccessIsThereInThatService(eachAccess, eachService.id)">
                                    <label class="form-check-label" for="flexCheckDefault">
                                        <code> {{ eachAccess }}</code>
                                    </label>
                                </div>
                            </li>
                        </ul>
                    </div>
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
            localAllServices: [],
            checked: true
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
        ...mapActions("mainStore", ["getMyRolesAction", "createARole", "deleteARole", "fetchServicesList", "updateARole",]),
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

                if (this.roleModel.roleName.length > 10) {
                    throw new Error('Role name can not be greater than 20 characters')
                }

                if (this.roleModel.roleDescription.length > 100) {
                    throw new Error('Role description can not be greater than 100 characters')
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
                this.notifyErr(e.message)
                this.isLoading = false
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