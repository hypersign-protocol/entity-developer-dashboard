<template>
    <b-container class="py-3" fluid>
        <v-row align="center" class="mb-6">
            <v-col cols="12" md="6">
                <h4 class="font-weight-bold mb-0">User Analytics</h4>
                <p class="text-subtitle-2 text-muted">View user engagement and behavior data</p>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <Overview :env="env" />
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <DemographicStats :env="env" />
            </v-col>

        </v-row>
        <v-row>
            <v-col cols="12">
                <DeviceStats :env="env" />
            </v-col>

        </v-row>
    </b-container>
</template>
<style scoped>
.py-3 {
    width: 80vw!important;
}
</style>

<script>
import Overview from './components/Overview.vue';
import DemographicStats from './components/DemographicStats.vue';
import DeviceStats from './components/DeviceStats.vue';
export default {
    name: "UserAnalytics",
    data() {
        return {
            isProd: false,
        };
    },
    computed: {
        env() {
            return this.isProd ? 'prod' : 'dev';
        }
    },
    components: {
        Overview,
        DemographicStats,
        DeviceStats
    },
    methods: {
        handleEnvironmentChange() {
        }
    },
    created() {
        // initialize toggle based on currently selected service env
        if (this.$store && this.$store.getters['mainStore/getSelectedService']) {
            this.isProd = this.$store.getters['mainStore/getSelectedService'].env === 'prod';
        }
    },
};
</script>

