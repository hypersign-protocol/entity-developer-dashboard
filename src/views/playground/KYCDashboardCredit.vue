<template>
    <v-container>
        <loadIng :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></loadIng>
        <v-row align="center">
            <v-col cols="12" md="6">
                <h4 class="font-weight-bold mb-0">Credits Management</h4>
                <p class="text-subtitle-2 text-muted mb-0">Manage your API balance and subscription history</p>
            </v-col>
            <v-col cols="12" md="6" class="d-flex justify-end">
                <div class="ml-auto">
                    <hf-buttons name="Refresh" iconClass="arrow-clockwise" :bIcon="true" outlined
                        @executeAction="reloadData()"></hf-buttons>
                </div>
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="12" lg="5">
                <div class="overview-container h-100">
                    <div class="header-row">
                        <h2 class="title">Credit Allocation</h2>
                    </div>
                    <div class="chart-wrapper mt-2">
                        <canvas id="doughNutChat"></canvas>
                    </div>
                    <div class="text-center mt-n4">
                        <span class="badge" :class="timeRemaining === 'Expired' ? 'badge-expired' : 'badge-active'">
                            {{ timeRemaining === 'Expired' ? 'Expired' : 'Subscription Active' }}
                        </span>
                    </div>
                </div>
            </v-col>

            <v-col cols="12" lg="7">
                <div class="overview-container h-100">
                    <div class="header-row">
                        <h2 class="title">Balance Overview</h2>
                    </div>

                    <div class="d-flex flex-column justify-center">
                        <div class="mb-4">
                            <p class="text-muted mb-0 font-weight-medium">Remaining Balance</p>
                            <div class="d-flex align-baseline">
                                <h1 class="display-1 font-weight-bold color-blue mb-0">
                                    {{ numberFormat(myKYCCredits.allRemainingCredits) }}
                                </h1>
                                <span class="ml-2 text-h6 text-muted">
                                    / {{ numberFormat(myKYCCredits.allAvailableCredits) }} Credits
                                </span>
                            </div>
                            <p class="approx-inline mt-1 mb-0">upto ~<strong>{{ numberFormat(approxKYCLeftBestCase) }}</strong> ID Verifications</p>
                        </div>

                        <div>
                            <v-divider class="mb-4"></v-divider>

                            <v-row no-gutters>
                                <v-col cols="6">
                                    <p class="text-muted mb-1 small uppercase font-weight-bold">Status</p>
                                    <p class="mb-0 font-weight-bold" :class="statusColorClass">
                                        {{ timeRemaining === 'Expired' || timeRemaining === 'InActive' ? timeRemaining :
                                        'Active' }}
                                    </p>
                                </v-col>
                                <v-col cols="6" class="text-right">
                                    <p class="text-muted mb-1 small uppercase font-weight-bold">Validity</p>
                                    <p class="mb-0 font-weight-bold">
                                        {{ timeRemaining === 'Expired' ? 'None' : timeRemaining }}
                                    </p>
                                </v-col>
                            </v-row>
                        </div>


                    </div>
                </div>
            </v-col>
        </v-row>

        <v-row v-if="getKYCCredits.length > 0">
            <v-col cols="12">
                <div class="overview-container">
                    <div class="header-row">
                        <h2 class="title">Credit Purchase History</h2>
                        <span class="badge">{{ getKYCCredits.length }} Packages</span>
                    </div>

                    <div class="usage-table-wrapper">
                        <table class="usage-table">
                            <thead>
                                <tr>
                                    <th>Purchase Date</th>
                                    <th class="text-right">Total Credits</th>
                                    <th>Expiration / Status</th>
                                    <th width="25%">Usage</th>
                                    <th class="text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="eachRow in getSortedKYCCredits" :key="eachRow._id">
                                    <td>
                                        <div class="font-weight-bold">{{ formatDate(eachRow.createdAt) }}</div>
                                        <code class="small text-muted">{{ eachRow._id.substring(0, 8) }}...</code>
                                    </td>
                                    <td class="text-right font-weight-bold">
                                        {{ numberFormat(eachRow.totalCredits) }}
                                    </td>
                                    <td>
                                        <div v-if="eachRow.used >= eachRow.totalCredits" class="text-muted small">
                                            <v-icon small color="grey">mdi-check-circle</v-icon> Fully Used
                                        </div>
                                        <div v-else-if="Date.now() > new Date(eachRow.expiresAt)"
                                            class="color-danger small">
                                            <v-icon small color="red">mdi-clock-alert</v-icon> Expired
                                        </div>
                                        <div v-else class="small font-weight-medium">
                                            {{ isValidDate(eachRow.expiresAt) ? formatTimeRemaining(eachRow.expiresAt) :
                                            'Pending Activation' }}
                                        </div>
                                    </td>
                                   <td :title="`Credit left: ${eachRow.totalCredits - eachRow.used}`">
                                        <div class="d-flex flex-column">
                                            <b-progress :max="eachRow.totalCredits" class="mt-1" height="12px">
                                                <b-progress-bar 
                                                    :value="eachRow.used >= eachRow.totalCredits ? eachRow.totalCredits : eachRow.used" 
                                                    :variant="getProgressVariant(eachRow)"
                                                    :class="{'progress-full': eachRow.used >= eachRow.totalCredits}"
                                                ></b-progress-bar>
                                            </b-progress>
                                            
                                            <span class="small text-muted mt-1">
                                                {{ eachRow.used >= eachRow.totalCredits ? '100% Used' : Math.round((eachRow.used / eachRow.totalCredits) * 100) + '% Used' }}
                                            </span>
                                        </div>
                                    </td>

                                    <td class="text-center">
                                        <div
                                            v-if="eachRow.status === 'Active' && !(Date.now() > new Date(eachRow.expiresAt))">
                                            <v-chip small color="green lighten-5" text-color="green"
                                                class="font-weight-bold">ACTIVE</v-chip>
                                        </div>
                                        <hf-buttons
                                            v-else-if="eachRow.used < eachRow.totalCredits && !(Date.now() > new Date(eachRow.expiresAt))"
                                            name="Activate" size="sm"
                                            @executeAction="activateThisCredit(eachRow)"></hf-buttons>
                                        <span v-else class="text-muted small">—</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import Chart from 'chart.js/auto';
import { mapActions, mapGetters } from "vuex";
import UtilsMixin from '../../mixins/utils';
import HfButtons from "../../components/element/HfButtons.vue";

export default {
    name: "SSIDashboardCredit",
    components: { HfButtons },
    mixins: [UtilsMixin],
    data() {
        return {
            timeRemaining: '',
            timer: null,
            doughNutChart: null,
            isLoading: false,
            fullPage: true,
            doughNutChartLabel: ['Used', 'Remaining'],
            analyticsOverview: null,
        }
    },
    computed: {
        ...mapGetters('mainStore', ['getKYCCredits']),

        getSortedKYCCredits() {
            return [...this.getKYCCredits].sort((a, b) => new Date(b.expiresAt) - new Date(a.expiresAt));
        },

        statusColorClass() {
            if (this.timeRemaining === 'Expired') return 'text-danger';
            if (this.timeRemaining === 'InActive') return 'text-muted';
            return 'color-green';
        },

        // Formula: (1/completionRate) accounts for sessions that don't complete
        //          + dropOffRate adds waste from abandoned sessions
        // Example: 70% completion, 24% drop-off → (1/0.7) + 0.24 = 1.67 → ~125 credits/ID
        costPerKYC() {
            if (!this.analyticsOverview) return 75; // no data yet: assume best case
            const completionRate = Math.max((this.analyticsOverview.completionRate || 100), 1) / 100;
            const dropOff = (this.analyticsOverview.dropOffRate || 0) / 100;
            const multiplier = Math.min(Math.max((1 / completionRate) + dropOff, 1.0), 2.5);
            return Math.ceil(75 * multiplier);
        },

        approxKYCLeft() {
            return Math.floor((this.myKYCCredits.allRemainingCredits || 0) / this.costPerKYC);
        },

        approxKYCLeftBestCase() {
            return Math.floor((this.myKYCCredits.allRemainingCredits || 0) / 75);
        },

        myKYCCredits() {
            let expiryAt = (new Date()).toISOString();
            if (this.getKYCCredits.length === 0) {
                return { allAvailableCredits: 0, allUsedCredits: 0, allRemainingCredits: 0, expiresAt: expiryAt };
            }

            const now = new Date();
            let active_credits = this.getKYCCredits.filter(x => {
                if (x.expiresAt) {
                    const expirydate = new Date(x.expiresAt);
                    return (expirydate >= now) && (x.used < x.totalCredits);
                }
                return x.status === 'Active' || !x.expiresAt;
            });

            if (active_credits.length === 0) {
                return { allAvailableCredits: 0, allUsedCredits: 0, allRemainingCredits: 0, expiresAt: expiryAt };
            }

            const total = active_credits.reduce((acc, curr) => ({
                allAvailableCredits: acc.allAvailableCredits + curr.totalCredits,
                allUsedCredits: acc.allUsedCredits + curr.used
            }), { allAvailableCredits: 0, allUsedCredits: 0 });

            active_credits.sort((a, b) => new Date(b.expiresAt) - new Date(a.expiresAt));
            return {
                ...total,
                allRemainingCredits: total.allAvailableCredits - total.allUsedCredits,
                expiresAt: active_credits[0].expiresAt
            };
        }
    },
    async mounted() {
        await this.reloadData();
    },
    beforeDestroy() {
        this.stopTimer();
    },
    methods: {
        ...mapActions('mainStore', ['fetchKYCCredits', 'activateCredit', 'fetchAnalyticsOverview']),

        async reloadData() {
            try {
                this.isLoading = true;
                await this.fetchKYCCredits();

                // Non-blocking: fetch analytics to refine estimate
                this.fetchAnalyticsOverview({ env: this.$store.getters['mainStore/getSelectedService']?.env || 'prod' })
                    .then(res => { if (res?.data) this.analyticsOverview = res.data; })
                    .catch(() => {});

                this.startTimer();
                this.renderChart();
            } catch (e) {
                this.notifyErr(e.message);
            } finally {
                this.isLoading = false;
            }
        },
        getProgressVariant(row) {
                const isExpired = Date.now() > new Date(row.expiresAt);
                const isFull = row.used >= row.totalCredits;

                if (isExpired) return 'secondary'; // Grey for expired
                if (isFull) return 'success';      // Green for completely used/completed
                
                // Dynamic colors for active usage
                const ratio = row.used / row.totalCredits;
                if (ratio > 0.9) return 'warning'; // Orange if almost empty
                return 'primary';                  // Blue for normal active usage
            },

        updateTimer() {
            this.timeRemaining = this.formatTimeRemaining(this.myKYCCredits.expiresAt);
        },

        startTimer() {
            this.updateTimer();
            this.timer = setInterval(this.updateTimer, 1000);
        },

        stopTimer() {
            clearInterval(this.timer);
        },

        renderChart() {
            const expired = this.getKYCCredits.every(el => Date.now() > new Date(el.expiresAt));
            const used = this.myKYCCredits.allUsedCredits || 0;
            const remaining = this.myKYCCredits.allRemainingCredits || 0;

            const dataToRender = (this.getKYCCredits.length === 0 || (used + remaining === 0))
                ? [0, 1] : [used, remaining];

            const colors = expired ? ['#cbd5e1', '#f1f5f9'] : ['#94a3b8', '#3b82f6'];

            this.doughNutChart?.destroy();
            const ctx = document.getElementById('doughNutChat');
            this.doughNutChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: this.doughNutChartLabel,
                    datasets: [{
                        data: dataToRender,
                        backgroundColor: colors,
                        borderWidth: 0,
                        hoverOffset: 4,
                        cutout: '70%',
                        circumference: 180,
                        rotation: 270,
                    }]
                },
                options: {
                    plugins: { legend: { display: false } },
                    maintainAspectRatio: false
                }
            });
        },

        numberFormat(val) { return new Intl.NumberFormat().format(val) },

        async activateThisCredit(eachRow) {
            try {
                if (eachRow.used === eachRow.totalCredits) return this.notifyErr("Credit exhausted");
                this.isLoading = true;
                await this.activateCredit({ creditId: eachRow._id });
                await this.reloadData();
            } catch (e) {
                this.notifyErr(e.message);
            } finally {
                this.isLoading = false;
            }
        },

        isValidDate(date) { return !isNaN(new Date(date).getTime()); }
    }
};
</script>

<style scoped>
/* Unified Dashboard Styles */
.overview-container {
    padding: 1.5rem;
    background-color: #f9fafb;
    border-radius: 0.75rem;
    border: 1px solid #e5e7eb;
    margin-top: 1rem;
}

.header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.title {
    font-size: 1.125rem;
    font-weight: 700;
    color: #111827;
    margin: 0;
}

.chart-wrapper {
    height: 180px;
    position: relative;
}

.usage-table-wrapper {
    background: white;
    border-radius: 0.5rem;
    overflow: hidden;
    border: 1px solid #f3f4f6;
    margin-top: 1rem;
}

.usage-table {
    width: 100%;
    border-collapse: collapse;
}

.usage-table th {
    background-color: #f8fafc;
    padding: 1rem;
    font-size: 0.75rem;
    text-transform: uppercase;
    color: #64748b;
    border-bottom: 1px solid #e2e8f0;
    text-align: left;
}

.usage-table td {
    padding: 1rem;
    font-size: 0.875rem;
    border-bottom: 1px solid #f1f5f9;
}

.badge {
    font-size: 0.7rem;
    font-weight: 600;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
}

.badge-active {
    background-color: #e0f2fe;
    color: #0369a1;
}

.badge-expired {
    background-color: #fee2e2;
    color: #991b1b;
}

.color-blue {
    color: #3b82f6;
}

.color-green {
    color: #10b981;
}

.text-danger {
    color: #ef4444;
}

.uppercase {
    text-transform: uppercase;
    letter-spacing: 0.05em;
    line-height: 1;
    /* Keeps label close to the value below it */
}

.approx-inline {
    font-size: 0.75rem;
    color: #9ca3af;
}

/* Ensure the button doesn't have extra margin pushing it away from the edge */
.v-col.d-flex.justify-end {
    padding-right: 12px;
}

/* Custom Overrides */
.v-divider {
    border-color: #e5e7eb !important;
}
/* Styling for the progress container */
.progress {
    background-color: #e9ecef !important;
    border-radius: 10px;
    overflow: hidden;
}

/* Custom color for fully used credits if you prefer a specific shade */
.progress-full {
    box-shadow: inset 0 -1px 0 rgba(0,0,0,.15);
    transition: width .6s ease;
}

/* Ensure the table cell doesn't squash the progress bar */
.usage-table td {
    vertical-align: middle;
}

</style>