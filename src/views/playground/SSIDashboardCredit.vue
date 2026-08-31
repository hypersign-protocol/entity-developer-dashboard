<style scoped>
.sticky-header {
    position: sticky;
    top: 0;
}

.container {
    width: 80vw;
}

.UI--c-kbgiPT-iehgGlf-css {
    background-color: #9cb5f9;
}

.step-notStarted {
    background-color: #afb8cc;
}

.step-finished {
    background-color: #9cb5f9;
}


.UI--c-dhzjXW-iexswVt-css {
    align-items: center;
    justify-content: center;
}

.UI--c-kbgiPT-bUORwj-isFirst-true {
    padding: 0px 0.4rem 0px 0px;
    clip-path: polygon(75% 0%, 100% 50%, 75% 100%, 0% 100%, 0% 100%, 0% 0%);
}

.UI--c-kbgiPT {
    height: 100%;
    width: 4.8rem;
    clip-path: polygon(75% 0%, 100% 50%, 75% 100%, 0% 100%, 25% 50%, 0% 0%);
    margin-left: -0.9rem;
    padding: 0px 0.4rem 0px 0.8rem;
}

.UI--c-dhzjXW {
    display: flex;
}

.stepSpan {
    cursor: pointer;
    margin: 3px;
    padding: 0px;
    border: 0px;
    font: inherit;
    vertical-align: baseline;
    float: left
}

.step {
    height: 32px;
    width: 50px;
}

.card-header {
    background: aliceblue;
    padding: 0px;
}

.goschema {
    color: #339af0;
}

.goschema:hover {
    text-decoration: underline;
    cursor: pointer;
}

.far {
    color: gray;
    font-size: 1.5em;
    display: inline;
    cursor: pointer;
}

.datetime-picker {
    background-color: #fff;
    background-clip: content-box;
    border: 1px solid #ced4da;
    border-radius: 0.25rem;
    padding: 0.375rem 0.75rem;
}

.linkdiv {
    background-clip: content-box;
    background-color: rgba(173, 232, 255, .5607843137254902);
    border-radius: 0.25rem;
    height: 50px;
    text-align: left;
}

h5 {
    width: 100%;
    text-align: center;
    border-bottom: 1px solid #80808045;
    line-height: 0.1em;
    margin: 10px 0 20px;
}

h5 span {
    background: #fff;
    padding: 0 10px;
}

.scrollit {
    overflow: hidden;
    height: 600px;
}

.scrollit:hover {
    overflow-y: auto;
}
</style>
<style scoped>
.switch {
    position: relative;
    top: -12px;
}

.bg-danger {
    background-color: lightgrey !important;
}

.progress {
    background-color: rgba(0, 128, 0, 0.645);
}

.pd-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 48px 32px;
    background: #fffbeb;
    border: 1px solid #fde68a;
    border-radius: 8px;
}
</style>
<template>
    <b-container fluid class="py-3 ssi-credit-page">
        <loadIng :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></loadIng>
        <AccessDenied v-if="accessDenied" />
        <template v-if="!accessDenied">
        <v-row align="center" class="mb-6">
            <v-col cols="12" md="6">
                <h4 class="font-weight-bold mb-0">Credits</h4>
            </v-col>
            <v-col cols="12" md="6" class="d-flex align-center justify-end">
                <div class="ml-auto refresh-button-wrapper">
                    <hf-buttons name="Refresh" iconClass="arrow-clockwise" :bIcon="true" outlined
                        @executeAction="reloadData()"></hf-buttons>
                </div>
            </v-col>
        </v-row>

        <v-row class="credit-overview-row">
            <v-col cols="12" md="6">
                <div class="overview-container h-100">
                    <div class="chart-wrapper">
                        <canvas id="doughNutChat"></canvas>
                    </div>
                </div>
            </v-col>
            <v-col cols="12" md="6">
                <div class="overview-container h-100">
                    <p class="summary-label"><b>Total Credits</b></p>
                    <p v-if="mySSICredits.allRemainingCredits === 0 && mySSICredits.allAvailableCredits === 0">
                            <span class="summary-value color-blue">
                                {{ numberFormat(mySSICredits.allRemainingCredits) }}
                            </span>
                    </p>
                    <p v-else>
                        <span class="summary-value color-blue">
                            {{ numberFormat(mySSICredits.allRemainingCredits) }}
                        </span>
                        <span class="summary-total">
                            / {{ numberFormat(mySSICredits.allAvailableCredits) }}
                        </span>
                    </p>
                    <p v-if="timeRemaining === 'Expired'" class="summary-label mb-0">Expired</p>
                    <p v-else-if="timeRemaining === 'InActive'" class="summary-label mb-0">InActive</p>
                    <p v-else class="summary-label mb-0">Expires In: {{ timeRemaining }}</p>
                </div>
            </v-col>
        </v-row>

        <v-row class="credit-overview-row">
            <v-col cols="12" md="6">
                <div class="overview-container h-100">
                    <div class="chart-wrapper">
                        <canvas id="allowanceDoughNutChart"></canvas>
                    </div>
                </div>
            </v-col>
            <v-col cols="12" md="6">
                <div class="overview-container h-100">
                    <p class="summary-label"><b>Total Allowance</b></p>
                    <p v-if="mySSIAllowance.allRemainingAllowance === 0 && mySSIAllowance.allAvailableAllowance === 0">
                        <span class="summary-value color-green">{{ numberFormat(mySSIAllowance.allRemainingAllowance) }}</span>
                    </p>
                    <p v-else>
                        <span class="summary-value color-green">{{ numberFormat(mySSIAllowance.allRemainingAllowance) }}</span>
                        <span class="summary-total">/ {{ numberFormat(mySSIAllowance.allAvailableAllowance) }}</span>
                    </p>
                    <v-divider class="my-3"></v-divider>
                    <p class="summary-label"><b>Scope(s)</b></p>
                    <p v-if="allowance.scope.length > 0" class="scope-list">
                        <span class="scope-badge" v-for="eachRow in allowance.scope"
                            v-bind:key="eachRow">{{ eachRow }}</span>
                    </p>
                    <p v-else class="text-muted scope-list">
                        No scope granted!
                    </p>
                    <p v-if="expiration === 'Expired'" class="summary-label mb-0">Expired</p>
                    <p v-else-if="expiration === 'InActive'" class="summary-label mb-0">InActive</p>
                    <p v-else class="summary-label mb-0">Expires In: {{ expiration }}</p>
                </div>
            </v-col>
        </v-row>

        <!-- Credit History -->
        <!-- 
        
        <div class="row mt-4" style="display: none;">
            <div class="col-md-12" style="text-align: left">
                <div class="form-group" style="display:flex">
                    <h3 style="text-align: left;">Credits History</h3>
                </div>
            </div>
        </div>
        <div class="row" style="display: none;">
            <div class="col">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            
        <th scope="col">Date</th>
        <th scope="col">Amount</th>
        <th scope="col">Scope</th>
        <th scope="col">Expiry At</th>
        <th scope="col">Status</th>
        </tr>
        </thead>
        <tbody>
            <tr>
                <td>{{ (new Date()).toUTCString() }}</td>
                <td>{{ numberFormat("10000") }}</td>
                <td style="word-wrap: break-word; max-width: 200px;"><span class="badge badge-info mx-1"
                        v-for="eachRow in grants" v-bind:key="eachRow.authorization.msg">{{
                            eachRow.authorization.msg.replace('/hypersign.ssi.v1.Msg', '') }}</span></td>
                <td>{{ (new Date()).toUTCString() }}</td>
                <td>Expired</td>
            </tr>
            <tr>
                <td>{{ (new Date()).toUTCString() }}</td>
                <td>{{ numberFormat("10000") }}</td>
                <td style="word-wrap: break-word; max-width: 200px;"><span class="badge badge-info mx-1"
                        v-for="eachRow in grants" v-bind:key="eachRow.authorization.msg">{{
                            eachRow.authorization.msg.replace('/hypersign.ssi.v1.Msg', '') }}</span></td>
                <td>{{ (new Date()).toUTCString() }}</td>
                <td>Expired</td>
            </tr>
            <tr>
                <td>{{ (new Date()).toUTCString() }}</td>
                <td>{{ numberFormat("10000") }}</td>
                <td style="word-wrap: break-word; max-width: 200px;"><span class="badge badge-info mx-1"
                        v-for="eachRow in grants" v-bind:key="eachRow.authorization.msg">{{
                            eachRow.authorization.msg.replace('/hypersign.ssi.v1.Msg', '') }}</span></td>
                <td>{{ (new Date()).toUTCString() }}</td>
                <td>Expired</td>
            </tr>

        </tbody>
        </table>
        </div>
        </div> 
         -->
        <v-row v-if="getSsiCredits.length > 0">
            <v-col cols="12">
                <div class="overview-container">
                    <div class="header-row">
                        <h2 class="title">Credit History</h2>
                    </div>
                    <div class="usage-table-wrapper">
                <table class="usage-table">
                    <colgroup>
                        <col class="plan-column">
                        <col class="date-column">
                        <col class="expiry-column">
                        <col class="progress-column">
                        <col class="progress-column">
                        <col class="action-column">
                    </colgroup>
                    <thead>
                        <tr>
                            <th>Plan Id</th>
                            <th>Date</th>
                            <th>Expires In</th>
                            <th>Available Credits</th>
                            <th>Available Allowance</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="eachRow in getSortedSSICredits" :key="eachRow._id">
                            <td>
                                <div class="plan-id-cell">
                                    <code class="small text-muted">{{ shorten(eachRow._id) }}</code>
                                    <i class="far fa-copy" title="Copy Plan Id"
                                        @click="copyToClip(eachRow._id, 'Plan Id')"></i>
                                </div>
                            </td>
                            <td class="font-weight-bold date-cell">{{ formatDate(eachRow.createdAt) }}</td>
                            <td class="expiry-cell">
                                <span v-if="eachRow.used >= eachRow.totalCredits" class="text-muted small">Credit Limit Reached</span>
                                <span v-else-if="Date.now() > new Date(eachRow.expiresAt)" class="text-danger small">Expired</span>
                                <span v-else class="small font-weight-medium">
                                    {{ isValidDate(eachRow.expiresAt) ? formatCompactTimeRemaining(eachRow.expiresAt) : 'Not Activated' }}
                                </span>
                            </td>
                            <td :title="`Credit left: ${eachRow.totalCredits - eachRow.used}`">
                                <b-progress :max="eachRow.totalCredits" height="12px">
                                    <b-progress-bar :value="eachRow.used"
                                        :variant="Date.now() > new Date(eachRow.expiresAt) ? 'secondary' : 'primary'"></b-progress-bar>
                                </b-progress>
                            </td>
                            <td v-if="eachRow.onChainAllowance && Number(eachRow.onChainAllowance.amount) > 0"
                                :title="`Allowance left: ${Math.max(Number(eachRow.onChainAllowance.amount) - Number(eachRow.onChainAllowance.usedAmount || 0), 0)}`">
                                <b-progress :max="Number(eachRow.onChainAllowance.amount)" height="12px">
                                    <b-progress-bar :value="Number(eachRow.onChainAllowance.usedAmount || 0)"
                                        :variant="Date.now() > new Date(eachRow.expiresAt) ? 'secondary' : 'success'"></b-progress-bar>
                                </b-progress>
                            </td>
                            <td v-else class="text-muted text-center">—</td>
                            <td>
                                <hf-buttons v-if="eachRow.status === 'Active' && !(Date.now() > new Date(eachRow.expiresAt))"
                                    iconClass="circle-fill" :bIcon="true" disabled animate="throb"
                                    customClass="btn btn-outline-secondary compact-active-button"
                                    :name="eachRow.status"></hf-buttons>
                                <hf-buttons v-else-if="eachRow.used < eachRow.totalCredits && !(Date.now() > new Date(eachRow.expiresAt))"
                                    name=" Activate" iconClass="play-circle" :bIcon="true"
                                    customClass="btn btn-outline-secondary compact-activate-button"
                                    @executeAction="activateParticularSSICredit(eachRow)"></hf-buttons>
                            </td>
                        </tr>
                    </tbody>
                </table>
                    </div>
                </div>
            </v-col>
        </v-row>

        <hf-pop-up id="credit-estimation" Header="Credit/Usage Estimation Calculator">

            <div class="card p-4 mt-1" style="border-radius: 20px;">
                <div>
                    <!-- <p><b>Credit Usage Calculator</b></p> -->
                    <!-- <hr /> -->
                    <div>
                        <label for="bananas">DID Operations:</label>
                        <span style="float: right;">{{
                            numberFormat(bananaQuantity)
                            }}</span>
                        <input class="form-control-range" type="range" id="bananas" v-model="bananaQuantity" min="0"
                            :max="maxBananas" step="50" />

                    </div>

                    <div>
                        <label for="apples">Credentials Operation:</label>
                        <span style="float: right;">{{ numberFormat(appleQuantity)
                            }}</span>
                        <input class="form-control-range" step="50" type="range" id="apples" v-model="appleQuantity"
                            min="0" :max="maxApples" />

                    </div>

                    <div>
                        <label for="oranges">Schema Operations:</label>
                        <span style="float: right;">{{
                            numberFormat(orangeQuantity)
                            }}</span>
                        <input class="form-control-range" step="50" type="range" id="oranges" v-model="orangeQuantity"
                            min="0" :max="maxOranges" />

                    </div>

                    <div>
                        <hr />
                        <!-- <p>Total Cost: ${{ numberFormat(totalCost) }}</p> -->
                        <div>
                            <span style="float: left;">Remaining Credits: {{ numberFormat(remainingBudget) }}</span>
                            <span style="float:right">
                                <form>
                                    <span class="form-group">
                                        <span class="input-group">
                                            <span class="input-group-prepend">
                                                <span class="input-group-text" id="basic-addon1">$</span>
                                            </span>
                                            <input type="number" class="form-control" aria-describedby="basic-addon1"
                                                id="inlineFormInputGroup" @change="updateCredit()"
                                                v-model="creditDollarValue" style="width: 120px;">
                                        </span>
                                        <!-- <small class="form-text text-muted">Added ${{ added }}</small> -->
                                    </span>
                                </form>
                            </span>
                        </div>
                    </div>

                </div>
            </div>

        </hf-pop-up>
        </template><!-- end v-if !accessDenied -->
    </b-container>
</template>


<script>


// import { CChart, } from '@coreui/vue-chartjs'
import Chart from 'chart.js/auto';
import HfPopUp from "../../components/element/hfPopup.vue";
import { mapActions, mapGetters } from "vuex";
import UtilsMixin from '../../mixins/utils';
import AccessDenied from '../AccessDenied.vue';
import { isAccessDeniedError } from '../../utils/accessDenied';

export default {
    name: "SSIDashboardCredit",
    components: {
        // CChart,
        HfPopUp,
        AccessDenied
    },
    computed: {
        ...mapGetters('mainStore', ['getSsiCredits']),

        parsedAllowanceLimit() {
            // if (this.allowance.spend_limit) {
            return parseInt(this.allowance.spend_limit[0].amount)
            // } else {
            //     return 0
            // }

        },
        expiryDate() {
            if (this.grants.length > 0 && this.grants[0]) {
                return this.getTimeUntilEvent(this.grants[0].expiration)
            } else {
                return new Date()
            }

        },
        computedService() {
            const balance = this.parsedAllowanceLimit;
            return balance
        },

        budget() {
            return parseInt(this.allowance.spend_limit[0].amount)
        },
        totalCost() {
            return (
                this.bananaQuantity * this.bananaPrice +
                this.appleQuantity * this.applePrice +
                this.orangeQuantity * this.orangePrice
            );
        },
        remainingBudget() {
            return (this.budget - this.totalCost);
        },
        maxBananas() {
            return Math.floor(this.budget / this.bananaPrice);
        },
        maxApples() {
            const budgetAfterBananas = this.budget - (this.bananaQuantity * this.bananaPrice);
            return Math.floor(budgetAfterBananas / this.applePrice);
        },
        maxOranges() {
            const budgetAfterBananas = this.budget - (this.bananaQuantity * this.bananaPrice);
            return Math.floor(budgetAfterBananas / this.orangePrice);
        },
          getSortedSSICredits() {
            if (!Array.isArray(this.getSsiCredits)) return [];
            const t = this.getSsiCredits.slice();
            return t.sort((a, b) => new Date(b.expiresAt) - new Date(a.expiresAt));
        },
        mySSICredits() {
            const empty = { allAvailableCredits: 0, allUsedCredits: 0, allRemainingCredits: 0, expiresAt: (new Date()).toISOString() };
            if (!Array.isArray(this.getSsiCredits) || this.getSsiCredits.length === 0) return empty;
            const now = new Date()
            let not_expired_credits = this.getSsiCredits.filter(x => {
                if (x.expiresAt) {
                    const expirydate = new Date(x.expiresAt)
                    if ((expirydate >= now) && (x.used < x.totalCredits)) {
                        return x
                    }
                } else if (x.status == 'Active') {
                    return x
                }else if(!x.expiresAt)
                return x
            })
            if (not_expired_credits.length == 0) {
                return empty;
            }
            const total = not_expired_credits.reduce((accumulator, currentValue) => {
                return {
                    allAvailableCredits: accumulator.allAvailableCredits + currentValue.totalCredits,
                    allUsedCredits: accumulator.allUsedCredits + currentValue.used
                }
            }, {
                allAvailableCredits: 0,
                allUsedCredits: 0
            })
            not_expired_credits = not_expired_credits.sort((a, b) => new Date(b.expiresAt) - new Date(a.expiresAt))
            const expiryAt = not_expired_credits[0]
           
            return {
                ...total,
                allRemainingCredits: total.allAvailableCredits - total.allUsedCredits,
                expiresAt: expiryAt.expiresAt
            }
        },
        mySSIAllowance() {
            const empty = { allAvailableAllowance: 0, allUsedAllowance: 0, allRemainingAllowance: 0 };
            if (!Array.isArray(this.getSsiCredits) || this.getSsiCredits.length === 0) return empty;

            const now = new Date();
            const activeAllowances = this.getSsiCredits.filter(credit => {
                const allowance = credit.onChainAllowance;
                return allowance && credit.expiresAt && new Date(credit.expiresAt) >= now &&
                    Number(allowance.usedAmount || 0) < Number(allowance.amount || 0);
            });
            const total = activeAllowances.reduce((accumulator, credit) => ({
                allAvailableAllowance: accumulator.allAvailableAllowance + Number(credit.onChainAllowance.amount || 0),
                allUsedAllowance: accumulator.allUsedAllowance + Number(credit.onChainAllowance.usedAmount || 0)
            }), { allAvailableAllowance: 0, allUsedAllowance: 0 });

            return {
                ...total,
                allRemainingAllowance: total.allAvailableAllowance - total.allUsedAllowance
            };
        }

    },
    async mounted() {
      await this.reloadData()
    },
    beforeDestroy() {
        this.stopTimer();
    },
    watch: {
        bananaQuantity() {
            this.adjustQuantities()
        },
        appleQuantity() {
            this.adjustQuantities()
        },
        orangeQuantity() {
            this.adjustQuantities()
        },
    },
    data() {
        return {
            timeRemaining: '',
            accessDenied: false,
            accessDeniedMsg: '',
            timer: null,
            doughNutChart: null,
            allowanceDoughNutChart: null,
            didChart: null,
            schemaChart: null,
            credChart: null,
            doughNutChartLabel: [
                'Credits Used',
                'Credits Left',
            ],
            dougnNutData: [0, 5000000],
            ssiDashboardStats: {
                did_data: {},
                schema_data: {},
                cred_data: {},
            },
            services: {
                service1: {
                    value: 20,
                    min: 0,
                    max: 20,
                    fee: 50,
                    name: "banana",
                },
                service2: {
                    value: 0,
                    min: 0,
                    max: (1000 / 100),
                    fee: 100,
                    name: "orange",
                },
                service3: {
                    value: 0,
                    min: 0,
                    max: (1000 / 200),
                    fee: 200,
                    name: "apple",
                },
            },
            interval: null,
            fullPage: true,
            isLoading: false,
            expiration: "",
            allowance: {
                "@type": "/cosmos.feegrant.v1beta1.BasicAllowance",
                "spend_limit": [
                    {
                        "denom": "uhid",
                        "amount": "0"
                    }
                ],
                "expiration": null,
                "total": 5000000,
                scope: []
            },
            initialBalance: 1000,
            leftBalance: 1000,
            grants: [

            ],
            ////////////////////////////////////////////////////////////////
            // budget: 4900000,
            bananaPrice: 150,
            applePrice: 100,
            orangePrice: 100,
            bananaQuantity: 0,
            appleQuantity: 0,
            orangeQuantity: 0,

            ////////////////////////////////
            hidPrice: 1,
            uhidFactor: 1000000,
            creditDollarValue: 0,
            added: 0,

        }
    },
    methods: {
        ...mapActions('mainStore', ['ssiDashboardTxStats', 'ssiDashboardAllowanceStats', 'fetchSSICredits', 'ssiDashboardGrantsStats','activateSSICredit']),

        handleApiError(error, method = 'GET') {
            const message = typeof error === 'string' ? error : error?.message || 'Something went wrong';
            if (method.toUpperCase() === 'GET' && isAccessDeniedError(error)) {
                this.accessDenied = true;
                this.accessDeniedMsg = message;
                return;
            }

            this.notifyErr(message);
        },

       renderChart() {
            if (!Array.isArray(this.getSsiCredits)) return;
            const expired = this.getSsiCredits.every(element => Date.now() > new Date(element.expiresAt));
            const used = this.mySSICredits.allUsedCredits || 0;
            const remaining = this.mySSICredits.allRemainingCredits || 0;
            const total = used + remaining;
            const dataToRender = this.getSsiCredits.length === 0 || total === 0
                ? [1, 0] : [used, remaining];
            const color=expired?['grey','#d0d0d0']:['grey','green']
            this.doughNutChart?.destroy()
            const ctx = document.getElementById('doughNutChat');
            this.doughNutChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: this.doughNutChartLabel,
                    datasets: [
                        {
                            label: 'Credit',
                            data:dataToRender,
                            backgroundColor: color,
                            hoverOffset: 4,
                            cutout: '50%',
                            circumference: 180,
                            rotation: 270,
                            hoverBorderJoinStyle: 'round',
                        }
                    ]
                },
                options: {
                    maintainAspectRatio: false
                }
            });

            const allowanceUsed = this.mySSIAllowance.allUsedAllowance || 0;
            const allowanceRemaining = this.mySSIAllowance.allRemainingAllowance || 0;
            const allowanceTotal = allowanceUsed + allowanceRemaining;
            const allowanceData = allowanceTotal === 0 ? [1, 0] : [allowanceUsed, allowanceRemaining];
            const allowanceCtx = document.getElementById('allowanceDoughNutChart');
            this.allowanceDoughNutChart?.destroy();
            this.allowanceDoughNutChart = new Chart(allowanceCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Allowance Used', 'Allowance Left'],
                    datasets: [{
                        label: 'Allowance',
                        data: allowanceData,
                        backgroundColor: ['grey', 'green'],
                        hoverOffset: 4,
                        cutout: '50%',
                        circumference: 180,
                        rotation: 270,
                        hoverBorderJoinStyle: 'round',
                    }]
                },
                options: {
                    maintainAspectRatio: false
                }
            });
        },
        renderUsageChart() {
            const didCtx = document.getElementById('didChart');
            this.didChart = new Chart(didCtx, {
                type: 'line',
                data: {
                    labels: Object.keys(this.ssiDashboardStats.did_data),
                    datasets: [
                        {
                            label: 'DIDs Activities',
                            backgroundColor: 'rgba(220, 220, 220, 0.2)',
                            borderColor: 'grey',
                            pointBackgroundColor: 'black',
                            pointBorderColor: '#fff',
                            data: Object.values(this.ssiDashboardStats.did_data),
                            pointStyle: 'circle',
                            tension: 0.4,
                            borderWidth: 3,
                            fill: true,
                        },
                    ]
                },
            });

            const credCtx = document.getElementById('credChart');
            this.credChart = new Chart(credCtx, {
                type: 'line',
                data: {
                    labels: Object.keys(this.ssiDashboardStats.cred_data),
                    datasets: [
                        {
                            label: 'Credentials Activities',
                            backgroundColor: '#00800066',
                            borderColor: 'grey',
                            pointBackgroundColor: 'black',
                            pointBorderColor: '#fff',
                            data: Object.values(this.ssiDashboardStats.cred_data),
                            pointStyle: 'circle',
                            tension: 0.4,
                            borderWidth: 3,
                            fill: true,
                        },
                    ]
                },
            });


            const schemaCtx = document.getElementById('schemaChart');
            this.schemaChart = new Chart(schemaCtx, {
                type: 'line',
                data: {
                    labels: Object.keys(this.ssiDashboardStats.schema_data),
                    datasets: [
                        {
                            label: 'Schemas Activities',
                            backgroundColor: '#ffff0042',
                            borderColor: 'grey',
                            pointBackgroundColor: 'black',
                            pointBorderColor: '#fff',
                            data: Object.values(this.ssiDashboardStats.schema_data),
                            pointStyle: 'circle',
                            tension: 0.4,
                            borderWidth: 3,
                            fill: true,
                        },
                    ]
                },
            });
        },

        openCreditCalcualtor() {
            this.$root.$emit("bv::show::modal", "credit-estimation");
        },
        numberFormat(numberstr) {
            return new Intl.NumberFormat().format(numberstr)
        },
        getTimeUntilEvent: (eventDate) => {
            // Current date and time
            const now = new Date();

            // Parse event date and time
            const event = new Date(eventDate);

            // Check if the parsed date is valid
            if (isNaN(event.getTime())) {
                return '-';
            }

            // Check if the time difference is negative (event is in the past)
            if (event - now < 0) {
                return '-';
            }

            // Calculate days, hours, minutes, and seconds
            const timeDifference = event - now;
            const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

            // Improved formatting function
            function formatTime(time, unit) {
                return time > 0 ? `${time}${unit}` : '0' + unit;
            }
            const formattedDuration = `${formatTime(days, 'd')} : ${formatTime(hours, 'h')} : ${formatTime(minutes, 'm')} : ${formatTime(seconds, 's')}`;

            return formattedDuration;
        },

        // updateMaxValues() {
        //     this.$forceUpdate();
        // },
        adjustQuantities() {
            // Prevent negative budget
            if (this.totalCost > this.budget) {
                // If the total cost exceeds the budget, clamp the quantities
                const excess = this.totalCost - this.budget;
                if (this.bananaQuantity * this.bananaPrice > excess) {
                    this.bananaQuantity = Math.floor((this.budget - (this.appleQuantity * this.applePrice + this.orangeQuantity * this.orangePrice)) / this.bananaPrice);
                } else if (this.appleQuantity * this.applePrice > excess) {
                    this.appleQuantity = Math.floor((this.budget - (this.bananaQuantity * this.bananaPrice + this.orangeQuantity * this.orangePrice)) / this.applePrice);
                } else if (this.orangeQuantity * this.orangePrice > excess) {
                    this.orangeQuantity = Math.floor((this.budget - (this.bananaQuantity * this.bananaPrice + this.appleQuantity * this.applePrice)) / this.orangePrice);
                }
            }
        },

        calculateCreditDollarValue() {
            this.creditDollarValue = (this.budget / this.uhidFactor) * this.hidPrice;
        },
        updateCredit() {
            const amt = (this.creditDollarValue / (this.hidPrice)) * this.uhidFactor
            this.allowance.spend_limit[0].amount = amt.toString()
        },
        async activateParticularSSICredit(eachRow) {
            try {
                if (eachRow.used == eachRow.totalCredits) {
                    this.notifyErr("Credit already exhausted")
                    return;
                }
                this.isLoading = true
                await this.activateSSICredit({
                    creditId: eachRow._id
                })

                this.isLoading = false
            } catch (e) {
                console.error(e)
                this.isLoading = false
                this.notifyErr(e.message)
            }


        },
          isValidDate(date) {
             const parsedDate = new Date(date);
             return !isNaN(parsedDate.getTime());
         },
        formatCompactTimeRemaining(date) {
            const remainingMs = new Date(date).getTime() - Date.now();
            if (remainingMs <= 0) return 'Expired';

            const totalSeconds = Math.floor(remainingMs / 1000);
            const days = Math.floor(totalSeconds / 86400);
            const hours = Math.floor((totalSeconds % 86400) / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;

            if (days > 0) return `${days}d ${hours}h ${minutes}m`;
            if (hours > 0) return `${hours}h ${minutes}m`;
            return `${minutes}m ${seconds}s`;
        },
        formatSummaryTimeRemaining(date) {
            const expiry = new Date(date).getTime();
            if (!date || Number.isNaN(expiry)) return 'InActive';

            const remainingSeconds = Math.floor((expiry - Date.now()) / 1000);
            if (remainingSeconds <= 0) return 'Expired';

            const days = Math.floor(remainingSeconds / 86400);
            const hours = Math.floor((remainingSeconds % 86400) / 3600);
            const minutes = Math.floor((remainingSeconds % 3600) / 60);
            const seconds = remainingSeconds % 60;

            if (days > 0) return `${days}d ${hours}h ${minutes}m ${seconds}s`;
            if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
            return `${minutes}m ${seconds}s`;
        },
        updateTimer() {
            this.timeRemaining = this.formatSummaryTimeRemaining(this.mySSICredits.expiresAt);
            this.expiration = this.formatSummaryTimeRemaining(this.allowance.expiration);
        },
        startTimer() {
            this.stopTimer();
            this.updateTimer();
            this.timer = setInterval(() => {
                this.updateTimer();
            }, 1000);
        },
        stopTimer() {
                    clearInterval(this.timer);
                },
        async reloadData() {
        try {
            this.isLoading = true
            const credits = await this.fetchSSICredits()
            const creditsArr = Array.isArray(credits) ? credits : [];
            this.ssiCredits = creditsArr;
            const activeCredit = creditsArr.find(each => each.status === 'Active');
            if (activeCredit?.onChainAllowance) {
                const { amount = 0, denom = 'uhid', usedAmount = 0 } = activeCredit.onChainAllowance;
                this.allowance.spend_limit = [{ denom, amount: String(Math.max(amount - usedAmount, 0)) }];
                this.allowance.scope = activeCredit.onChainAllowanceScopes || [];
                this.allowance.expiration = activeCredit.expiresAt || null;
            } else {
                this.allowance.spend_limit = [{ denom: 'uhid', amount: '0' }];
                this.allowance.scope = [];
                this.allowance.expiration = null;
            }
            this.startTimer();
            this.isLoading = false
        } catch (e) {
            this.isLoading = false;
            this.handleApiError(e, 'GET');
            console.error(e);
        } finally {
            if (!this.accessDenied) this.renderChart();
        }

    }

    },
    mixins: [UtilsMixin],

}

</script>

<style scoped>
.py-3 {
    width: 80vw !important;
}

.overview-container {
    height: 100%;
    padding: 1.5rem;
    background-color: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 0.75rem;
}

.credit-overview-row > [class*="col-"] {
    display: flex;
}

.credit-overview-row .overview-container {
    width: 100%;
}

.header-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
}

.title {
    margin: 0;
    color: #111827;
    font-size: 1.125rem;
    font-weight: 700;
}

.chart-wrapper {
    position: relative;
    height: 180px;
}

.summary-label {
    margin-bottom: 0.25rem;
    color: #6b7280;
    font-size: 0.875rem;
    font-weight: 500;
}

.summary-value {
    font-size: 2.125rem;
    font-weight: 700;
    line-height: 1.2;
}

.summary-total {
    margin-left: 0.5rem;
    color: #6b7280;
    font-size: 1rem;
}

.scope-badge,
.package-count {
    display: inline-block;
    margin: 0.125rem 0.25rem 0.125rem 0;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    background-color: #e0f2fe;
    color: #0369a1;
    font-size: 0.7rem;
    font-weight: 600;
}

.scope-list {
    min-height: 1.75rem;
    margin-bottom: 0.75rem;
}

.usage-table-wrapper {
    width: 100%;
    margin-top: 1rem;
    overflow-x: auto;
    border: 1px solid #f3f4f6;
    border-radius: 0.5rem;
    background-color: #fff;
}

.usage-table {
    width: 100%;
    min-width: 1000px;
    table-layout: fixed;
    border-collapse: collapse;
}

.plan-column {
    width: 17%;
}

.date-column {
    width: 16%;
}

.expiry-column {
    width: 13%;
}

.progress-column {
    width: 22%;
}

.action-column {
    width: 10%;
}

.usage-table th {
    padding: 0.75rem;
    border-bottom: 1px solid #e2e8f0;
    background-color: #f8fafc;
    color: #64748b;
    font-size: 0.75rem;
    text-align: left;
    text-transform: uppercase;
}

.usage-table td {
    padding: 0.75rem;
    border-bottom: 1px solid #f1f5f9;
    font-size: 0.875rem;
    vertical-align: middle;
}

.plan-id-cell {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    white-space: nowrap;
}

.plan-id-cell .far {
    flex: 0 0 auto;
    padding-left: 0;
    font-size: 1rem;
}

.date-cell,
.expiry-cell {
    white-space: nowrap;
}

::v-deep .compact-active-button {
    min-width: 72px !important;
    height: 28px !important;
    padding: 0 8px !important;
    font-size: 0.72rem !important;
}

::v-deep .compact-activate-button {
    min-width: 82px !important;
    height: 28px !important;
    padding: 0 8px !important;
    font-size: 0.72rem !important;
}

.color-blue {
    color: #3b82f6;
}

.color-green {
    color: #10b981;
}

.text-danger {
    color: #ef4444 !important;
}

.progress {
    overflow: hidden;
    border-radius: 10px;
    background-color: #e9ecef !important;
}

@media (max-width: 767.98px) {
    .py-3 {
        width: 100% !important;
    }

    .summary-value {
        font-size: 1.75rem;
    }
}
</style>
