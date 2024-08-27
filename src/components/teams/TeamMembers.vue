<template>
    <div>
        <div class="row mb-3">
            <div class="col-md-4">
                <div class="input-group">
                    <div class="input-group-prepend" style="cursor: grab;">
                        <span class="input-group-text" id="basic-addon2"><i class="fa fa-search"
                                aria-hidden="true"></i></span>
                    </div>
                    <input type="text" class="form-control" placeholder="Find a member" aria-label="Find a member"
                        aria-describedby="basic-addon2" v-model="sessionIdTemp">

                </div>
            </div>
            <div class="col-md-8">

                <button type="button" class="btn btn-primary" style="float: inline-end;"
                    @click="inviteMemberPopup()"><b-icon icon="person-plus-fill"></b-icon> Invite Member</button>


            </div>
        </div>
        <div class="row mb-3" style="padding: 10px;">
            <table class="table ">
                <thead class="thead-light">
                    <tr>
                        <th scope="col">Members</th>
                    </tr>
                </thead>
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

                    <tr>
                        <TeamUser />
                    </tr>
                    <tr>
                        <TeamUser />
                    </tr>
                </tbody>
            </table>
        </div>




        <hf-pop-up id="invite-member" Header="Invite New Member">
            <form>


                <div class="form-group mb-3">
                    <label for="exampleInputEmail1">Email address</label>
                    <div class="input-group">
                        <input type="email" class="form-control" placeholder="Enter email">
                        <div class="input-group-append">
                            <button type="submit" class="btn btn-primary"><b-icon icon="telegram"></b-icon>
                                Invite</button>
                        </div>
                    </div>
                </div>

            </form>

        </hf-pop-up>
    </div>

</template>

<script>
import HfPopUp from "../element/hfPopup.vue";
import TeamUser from "./TeamUser.vue";

export default {
    name: "TeamsMembers",
    components: {
        HfPopUp, TeamUser
    },
    methods: {
        inviteMemberPopup() {
            this.$root.$emit("bv::show::modal", "invite-member");
        },

    }
}
</script>