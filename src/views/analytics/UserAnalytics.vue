<template>
    <v-container >
        <v-row>
            <!-- Left Column -->
            <v-col cols="12">
                <h4 class="font-weight-bold">User Analytics</h4>
            </v-col>

            <!-- Right Column -->
        </v-row>
        <v-row>
            <v-col cols="12">
                <Overview />
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <DemographicStats />
            </v-col>

        </v-row>
         <v-row>
            <v-col cols="12">
                <DeviceStats />
            </v-col>

        </v-row>
    </v-container>
</template>

<script>
import Overview from './components/Overview.vue';
import DemographicStats from './components/DemographicStats.vue';
import DeviceStats from './components/DeviceStats.vue';
export default {
    name: "UserAnalytics",
    data() {
        return {

        };
    },
    components: {
        Overview,
        DemographicStats,
        DeviceStats
    },
    created() {

    },
};
</script>

<style scoped>
/* .getting-started {
  background-color: #fff;
  font-family: "Inter", sans-serif;
}

.font-weight-500 {
  font-weight: 500;
} */
</style>
