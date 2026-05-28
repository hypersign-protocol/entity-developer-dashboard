<template>
    <b-container class="py-3" fluid>
        <v-row align="center" class="mb-6">
            <v-col cols="12" md="6">
                <h4 class="font-weight-bold mb-0">User Analytics</h4>
                <p class="text-subtitle-2 text-muted">View user engagement and behavior data</p>
            </v-col>
        </v-row>

        <AccessDenied v-if="accessDenied" />
        <template v-else>
            <v-row>
                <v-col cols="12">
                    <Overview :env="env" @access-denied="handleAccessDeniedError" />
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12">
                    <DemographicStats :env="env" @access-denied="handleAccessDeniedError" />
                </v-col>

            </v-row>
            <v-row>
                <v-col cols="12">
                    <DeviceStats :env="env" @access-denied="handleAccessDeniedError" />
                </v-col>

            </v-row>
        </template>
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
import AccessDenied from '../AccessDenied.vue';
export default {
    name: "UserAnalytics",
    data() {
        return {
            isProd: false,
            accessDenied: false,
            accessDeniedMsg: '',
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
        DeviceStats,
        AccessDenied
    },
    methods: {
        handleEnvironmentChange() {
        },
        handleAccessDeniedError(error) {
            const errorMessage = typeof error === 'string' ? error : (error?.message || '');
            const msg = errorMessage.toLowerCase();
            if (
                msg.includes('permission denied') || msg.includes('forbidden') ||
                msg.includes('access denied') || msg.includes('not authorized') ||
                msg.includes('unauthorized') || msg.includes('an unknown error occurred') ||
                error instanceof TypeError
            ) {
                this.accessDenied = true;
                this.accessDeniedMsg = errorMessage;
                return true;
            }

            return false;
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
