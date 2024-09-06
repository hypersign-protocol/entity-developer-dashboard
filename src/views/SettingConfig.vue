<template>

    <div>
        <b-card no-body v-if="isFeatureImplemented">
            <b-tabs card>
                <b-tab active>
                    <template #title>
                        <b-icon icon="person-square" aria-hidden="true" small></b-icon><strong> Profile</strong>
                    </template>
                    <b-card no-body>
                        <b-tabs card vertical justified small>
                            <!-- <b-tab active>
                                <template #title>
                                    <i class="fa fa-user-circle" aria-hidden="true"></i>
                                    General
                                </template>
                                <MyProfile />
                            </b-tab> -->
                            <b-tab>
                                <template #title>
                                    <b-icon icon="shield-shaded"></b-icon> Multi Factor
                                    Authentication (MFA)
                                </template>
                                <SetupMFA v-if="!isTwoFactorEnabled.isTwoFactorEnabled" />
                                <div v-else>
                                    <h3>MFA Enabled <b-icon icon="shield-shaded"></b-icon> </h3>
                                    <ul class="list-group">
                                        <li class="list-group-item">
                                            <span>
                                                Type: {{ isTwoFactorEnabled.authenticators[0].type }}
                                            </span>
                                            <span style="float:right">
                                                <!-- <button class="btn btn-danger btn-sm" @click="deleteMFA()"
                                                    title="Delete MFA"><i class="fa fa-trash"></i></button> -->
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </b-tab>
                        </b-tabs>
                    </b-card>
                </b-tab>
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


<script>
import TeamMembers from '../components/teams/TeamMembers.vue';
import MyInvitions from '../components/teams/MyInvitions.vue'
import AdminTeams from '../components/teams/AdminTeams.vue';
import { mapMutations, mapGetters } from "vuex";
// import MfaPage from '../components/login/mfa/MFA.vue'

import SetupMFA from '../components/login/mfa/SetupMfa.vue';
// import MyProfile from '../components/teams/MyProfile.vue'

export default {
    name: "SettingConfig",
    components: {
        TeamMembers,
        AdminTeams,
        MyInvitions,
        SetupMFA
        // MyProfile,
    },
    computed: {
        ...mapGetters('mainStore', ['getAuthToken']),
        isTwoFactorEnabled() {
            const payload = localStorage.getItem('user')
            if (payload) {
                return JSON.parse(payload)
            }
            return {};
        }
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