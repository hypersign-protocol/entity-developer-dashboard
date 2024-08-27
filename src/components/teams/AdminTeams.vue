<template>
    <div>
        <div class="row mb-3">
            <div class="col-md-4">
                <!-- <div class="input-group">
                    <div class="input-group-prepend" style="cursor: grab;">
                        <span class="input-group-text" id="basic-addon2"><i class="fa fa-search"
                                aria-hidden="true"></i></span>
                    </div>
                    <input type="text" class="form-control" placeholder="Find team" aria-label="Find a member"
                        aria-describedby="basic-addon2" v-model="sessionIdTemp">

                </div> -->
            </div>
            <div class="col-md-8">

                <button type="button" class="btn btn-primary" style="float: inline-end;"
                    @click="createTeamPopup()"><b-icon icon="people-fill"></b-icon> Create Team</button>


            </div>
        </div>
        <div class="row mb-3" style="padding: 10px;">
            <table class="table ">
                <!-- <thead class="thead-light">
                    <tr>
                        <th scope="col">Your Teams</th>
                    </tr>
                </thead> -->
                <tbody>
                    <tr>
                        <b-list-group-item class="d-flex align-items-center" style="min-height: 80px;">
                            <b-avatar size="4em" rounded="lg" text="MT"></b-avatar>
                            <span class="mr-auto mx-1"><a class="btn btn-link" @click="viewMembersPopup()">Team
                                    Marketing</a></span>


                            <a class="btn btn-link" @click="viewMembersPopup()">
                                <b-avatar-group size="30px" class="mx-2">
                                    <b-avatar></b-avatar>
                                    <b-avatar text="BV" variant="primary"></b-avatar>
                                    <b-avatar text="AV" variant="primary"></b-avatar>
                                    <b-avatar text="KJ" variant="primary"></b-avatar>
                                    <b-avatar text="RE" variant="primary"></b-avatar>

                                    <!-- <b-avatar src="https://placekitten.com/300/300" variant="info"></b-avatar>
                                <b-avatar text="OK" variant="danger"></b-avatar>
                                <b-avatar variant="warning"></b-avatar>
                                <b-avatar src="https://placekitten.com/320/320" variant="dark"></b-avatar>
                                <b-avatar icon="music-note" variant="success"></b-avatar> -->
                                </b-avatar-group>
                            </a>
                            <b-badge pill variant="info" class="mx-1">20 members</b-badge>
                            <b-dropdown size="sm" variant="link" toggle-class="text-decoration-none" no-caret dropleft>
                                <template #button-content>
                                    <b-icon style="color:grey" icon="list" aria-hidden="true"></b-icon>
                                </template>

                                <b-dropdown-item-button style="text-align: left;">Add Member</b-dropdown-item-button>
                                <b-dropdown-item-button style="text-align: left;">Associate
                                    Services</b-dropdown-item-button>
                                <hr />
                                <b-dropdown-item-button style="text-align: left;">Delete</b-dropdown-item-button>
                            </b-dropdown>
                        </b-list-group-item>
                    </tr>
                </tbody>
            </table>
        </div>




        <hf-pop-up id="create-team" Header="Create A New Team">
            <b-form @submit="onSubmit" @reset="onReset">
                <b-form-group id="input-group-2" label="Team Name:" label-for="input-2">
                    <b-form-input id="input-2" placeholder="Enter name" required></b-form-input>
                </b-form-group>

                <b-form-group id="input-group-2" label="Description:" label-for="input-2">
                    <b-form-input id="input-2" placeholder="Enter description" required></b-form-input>
                </b-form-group>

                <b-button type="submit" variant="primary">Submit</b-button>
            </b-form>
        </hf-pop-up>

        <hf-pop-up id="team-members" Header="Members">
            <table class="table">
                <tbody>
                    <tr>
                        <TeamUser />
                    </tr>
                    <tr>
                        <TeamUser />
                    </tr>
                    <tr>
                        <TeamUser />
                    </tr>
                </tbody>

            </table>
        </hf-pop-up>
    </div>

</template>

<script>
import HfPopUp from "../element/hfPopup.vue";
import TeamUser from "./TeamUser.vue";

export default {
    name: "AdminTeams",
    components: {
        HfPopUp,
        TeamUser
    },
    methods: {
        createTeamPopup() {
            this.$root.$emit("bv::show::modal", "create-team");
        },

        viewMembersPopup() {
            this.$root.$emit("bv::show::modal", "team-members")
        },

    }
}
</script>