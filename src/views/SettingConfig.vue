<template>

    <div>
        <b-card no-body v-if="isFeatureImplemented">
            <b-tabs card>
                <!-- <b-tab active>
                    <template #title>
                        <b-icon icon="person-square" aria-hidden="true" small></b-icon><strong> Profile</strong>
                    </template>
<p class="p-3">Profile</p>
</b-tab> -->

                <b-tab>
                    <template #title>
                        <b-icon icon="person-plus-fill" aria-hidden="true" small></b-icon><strong> Members</strong>
                    </template>
                    <!-- <p class="p-3"> -->
                    <TeamMembers />
                    <!-- </p> -->
                </b-tab>

                <b-tab>
                    <template #title>
                        <b-icon icon="people-fill" aria-hidden="true" small></b-icon><strong> Teams</strong>
                    </template>
                    <!-- <p class="p-3"> -->
                    <AdminTeams />
                    <!-- </p> -->
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
import AdminTeams from '../components/teams/AdminTeams.vue';
import { mapMutations } from "vuex";

export default {
    name: "SettingConfig",
    components: {
        TeamMembers,
        AdminTeams,
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