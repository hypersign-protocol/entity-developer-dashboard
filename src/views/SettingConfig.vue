<template>

    <div>
        <b-card no-body>
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
    </div>
</template>

<script>


import TeamMembers from '../components/teams/TeamMembers.vue';
import AdminTeams from '../components/teams/AdminTeams.vue';
export default {
    name: "SettingConfig",
    components: {
        TeamMembers,
        AdminTeams,
    }
}
</script>