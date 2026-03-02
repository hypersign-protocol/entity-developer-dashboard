<template>
    <v-container >
        <v-row>
            <!-- Left Column -->
            <v-col cols="12">
                <div class="d-flex justify-content-between align-items-center">
                    <h4 class="font-weight-bold mb-0">User Analytics</h4>
                    <div class="d-flex align-items-center">
                        <b-form-checkbox v-model="isProd" switch size="sm" @change="handleEnvironmentChange">
                            Prod
                        </b-form-checkbox>
                    </div>
                </div>
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

<style scoped>
/* .getting-started {
  background-color: #fff;
  font-family: "Inter", sans-serif;
}

.font-weight-500 {
  font-weight: 500;
} */
</style>
