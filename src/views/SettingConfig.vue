<template>

    <div>
        <b-card no-body v-if="isFeatureImplemented">
            <b-tabs card>
                <!-- <b-tab active>
                    <template #title>
                        <b-icon icon="person-square" aria-hidden="true" small></b-icon><strong> Profile</strong>
                    </template>
<b-card no-body>
    <b-tabs card vertical justified small>
        <b-tab active>
            <template #title>
                                    <i class="fa fa-user-circle" aria-hidden="true"></i>
                                    General
                                </template>
            <MyProfile />
        </b-tab>
        <b-tab>
            <template #title>
                                    <i class="fa fa-lock" aria-hidden="true"></i> Multi Factor
                                    Authentication (MFA)
                                </template>
            <p></p>
        </b-tab>
    </b-tabs>
</b-card>
</b-tab> -->
                <b-tab active>
                    <template #title>
                        <b-icon icon="sliders" aria-hidden="true" small></b-icon><strong> Members &
                            Roles</strong>
                    </template>
                    <b-card no-body>
                        <b-tabs card vertical justified small>
                            <b-tab active>
                                <template #title>
                                    <b-icon icon="people-fill" aria-hidden="true" small></b-icon>
                                    All Members
                                </template>
                                <TeamMembers />
                            </b-tab>
                            <b-tab>
                                <template #title>
                                    <i class="fa fa-gamepad" aria-hidden="true"></i> Roles & Permissions
                                </template>
                                <AdminTeams />
                            </b-tab>
                            <b-tab>
                                <template #title>
                                    <i class="fa fa-envelope" aria-hidden="true"></i>
                                    Invitions
                                </template>
                                <MyInvitions />
                            </b-tab>
                        </b-tabs>
                    </b-card>
                </b-tab>
            </b-tabs>
        </b-card>
        <div v-else>
            <hf-feature-soon></hf-feature-soon>
        </div>
    </div>
</template>
<style>
.card {
    box-shadow: 0 0 2rem 0 rgb(136 152 170 / 15%);
}
</style>

<script>
import TeamMembers from '../components/teams/TeamMembers.vue';
import MyInvitions from '../components/teams/MyInvitions.vue'
import AdminTeams from '../components/teams/AdminTeams.vue';
import { mapMutations } from "vuex";
// import MyProfile from '../components/teams/MyProfile.vue'

export default {
    name: "SettingConfig",
    components: {
        TeamMembers,
        AdminTeams,
        MyInvitions,
        // MyProfile
    },
    data() {
        return {
            isFeatureImplemented: true
        }
    },
    methods: {
        ...mapMutations("mainStore", ["setMainSideNavBar"]),
    },
    mounted() {
        this.setMainSideNavBar(false);
    }
}
</script>