<template>
    <b-container fluid class="py-3">
        <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap">
            <div>
                <h4 class="mb-1 font-weight-bold mb-0">User Analytics</h4>
                <p class="text-muted small mb-0">View user engagement and behavior data</p>
            </div>
        </div>
        <b-row>
            <b-col cols="12">
                <Overview :env="env" />
            </b-col>
        </b-row>
        <b-row>
            <b-col cols="12">
                <DemographicStats :env="env" />
            </b-col>
        </b-row>
        <b-row>
            <b-col cols="12">
                <DeviceStats :env="env" />
            </b-col>
        </b-row>
    </b-container>
</template>

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

