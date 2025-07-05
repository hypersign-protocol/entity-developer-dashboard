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
</style>
<template>

    <div :class="isContainerShift ? 'homeShift' : 'home'">

        <loadIng :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></loadIng>


        <!-- -------- -->


        <div class="row mb-3">

            <div class="col">
                <b-form inline class="mx-1" style="float: inline-end;">
                    <!-- <label for="inline-form-input-name">Start: </label> -->
                    <b-form-datepicker id="startDate-datepicker" placeholder="Start Date" v-model="startDate"
                        class="mb-2 mr-sm-1 mb-sm-0"></b-form-datepicker>

                    <!-- <label for="inline-form-input-username">End:</label> -->
                    <b-form-datepicker id="endDate-datepicker" placeholder="End Date" v-model="endDate"
                        class="mb-2 mr-sm-1 mb-sm-0"></b-form-datepicker>
                    <b-button variant="outline-secondary" @click="search()"><i class="fa fa-search"></i></b-button>
                </b-form>
                <!-- </div>
<div class="col-4"> -->

                <b-button-group style="float: left;">
                    <b-button :pressed="isGroupByDaily" variant="outline-secondary">Daily</b-button>
                    <b-button :pressed="isGroupByWeekly" variant="outline-secondary" @click="groupByTheChart('weekly')"
                        disabled>Weekly</b-button>
                    <b-button :pressed="isGroupByMonthly" variant="outline-secondary"
                        @click="groupByTheChart('monthly')" disabled>Monthly</b-button>
                </b-button-group>

                <b-button-group style="float: left;" class="mx-1">
                    <b-button variant="secondary" @click="changeGraph('bar')" :pressed="isChartBar"><b-icon
                            icon="bar-chart"></b-icon></b-button>
                    <b-button variant="secondary" @click="changeGraph('line')" :pressed="isChartLine"><b-icon
                            icon="graph-up"></b-icon></b-button>
                </b-button-group>


            </div>
        </div>

        <div class="row">
            <div class="col-md-8">
                <v-card class="serviceCard" style="padding:15px; ">
                    <canvas class="didChart"></canvas>
                </v-card>
            </div>
            <div class="col-md-4">
                <v-card class="serviceCard" style="padding:0px; height: 100%;">
                    <canvas class="polarChart"></canvas>
                </v-card>
            </div>

        </div>


        <div class="mt-3">
            <div class="">
                <div class="form-group">
                    <h3 v-if="usageDetails.serviceDetails.length > 0" style="text-align: left;">
                        API Consumptions </h3>
                    <h3 v-else style="text-align: left;">No usage found!</h3>
                </div>
            </div>
        </div>

        <div class="row scrollit mt-1" v-if="usageDetails.serviceDetails.length > 0">
            <div class="col-md-12">
                <table class="table table-hover event-card" style="background:#FFFF">
                    <thead class="thead-light">
                        <tr>
                            <th class="sticky-header">Path</th>
                            <!-- <th class="sticky-header">From Date</th>
        <th class="sticky-header">To Date</th> -->
                            <th class="sticky-header">Unit Cost</th>
                            <th class="sticky-header">Total Units</th>
                            <th class="sticky-header">Credits Used</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="row in usageDetails.serviceDetails" :key="row.apiPath">
                            <td><span style="font-weight: bold;">{{ row.method }}</span>  {{ row.apiPath }}</td>
                            <td>{{ row.offchain_unit_cost }}</td>
                            <td>{{ row.quantity }}</td>
                            <td>{{ row.offchainAmount }}</td>
                        </tr>
                    </tbody>
                    <thead class="thead-light">
                        <tr style="background-color: lightgray;">
                            <td><strong>Grand Total</strong></td>
                            <td></td>
                            <td><strong>{{ grandTotal.totalQuantity }}</strong></td>
                            <td><strong>{{ grandTotal.totalCredits }}</strong></td>
                        </tr>
                    </thead>
                </table>
            </div>
        </div>

    </div>
</template>


<script>


import Chart from 'chart.js/auto';
import { mapState, mapActions, mapMutations } from "vuex";
import { mapGetters } from 'vuex/dist/vuex.common.js';

import UtilsMixin from '../../mixins/utils';
export default {
    name: "SSIDashboardCredit",
    components: {
    },
    computed: {

        ...mapState({
            containerShift: state => state.playgroundStore.containerShift,
        }),
        ...mapGetters('mainStore', ['getUsageDetails']),

        isContainerShift() {
            return this.containerShift
        },
        grandTotal() {
            if (!this.usageDetails.serviceDetails) {
                return {
                    totalCredits: 0,
                    totalQuantity: 0
                }
            }

            const total = this.usageDetails.serviceDetails.reduce((accumulator, currentValue) => {
                return {
                    totalQuantity: accumulator.totalQuantity + currentValue.quantity,
                    totalCredits: accumulator.totalCredits + currentValue.offchainAmount
                }
            }, { totalQuantity: 0, totalCredits: 0 })
            return total
        },


        parsedAllowanceLimit() {
            return parseInt(this.allowance.spend_limit[0].amount)
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
        }

    },
    data() {
        return {
            doughNutChart: null,
            schemaChart: null,
            credChart: null,
            doughNutChartLabel: [
                'Credits Left',
                'Credits Used',
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
                "total": 5000000
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

            didChart: null,
            polarChart: null,
            chartType: 'bar',
            isGroupByDaily: true,
            isGroupByWeekly: false,
            isGroupByMonthly: false,
            isChartLine: true,
            isChartBar: false,
            authToken: localStorage.getItem('authToken'),
            user: {},
            fullPage: true,
            isLoading: false,

            startDate: "",
            endDate: "",
            usageDetails: {
                "serviceId": "13f70faf7f5c5d03520b71181136b595f7c6",
                "startDate": "2024-01-01T18:30:00.000Z",
                "endDate": "2024-04-02T10:07:53.757Z",
                "serviceDetails": [
                    {
                        "apiPath": "/api/v1/e-kyc/verification/user-consent",
                        "quantity": 4
                    },
                    {
                        "apiPath": "/api/v1/e-kyc/verification/session",
                        "quantity": 19
                    },
                    {
                        "apiPath": "/api/v1/e-kyc/verification/passive-liveliness",
                        "quantity": 17
                    },
                    {
                        "apiPath": "/api/v1/e-kyc/verification/doc-ocr",
                        "quantity": 3
                    }
                ]
            }
        }
    },
    async created() {
        try {
            const usrStr = localStorage.getItem("user");
            this.user = JSON.parse(usrStr);
            this.updateSideNavStatus(true)

            // appId
            this.isLoading = true
            this.setDate()
            await this.fetchUsageForAService({ startDate: this.startDate, endDate: this.endDate }).then((data) => {
                this.usageDetails = data;
            })
            await this.fetchUsageDetailsForAService({ startDate: this.startDate, endDate: this.endDate });
            this.renderUsageDetailsChart()

            this.isLoading = false
        } catch (e) {
            this.isLoading = false
            this.notifyErr(e.message)
             this.$router.push({ path: '/studio/dashboard' });
        }
    },

    beforeDestroy() {
        console.log('Clearing clear interval before destroying...')
        clearInterval(this.interval)
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
    beforeRouteEnter(to, from, next) {
        next((vm) => {
            vm.prevRoute = from;
        });
    },
    methods: {
        ...mapActions('mainStore', ['ssiDashboardTxStats', 'ssiDashboardAllowanceStats', 'ssiDashboardGrantsStats']),
        ...mapActions('mainStore', ['fetchUsageForAService', 'fetchUsageDetailsForAService']),

        ...mapMutations('playgroundStore', ['updateSideNavStatus', 'shiftContainer']),


        changeGraph(chartType) {
            if (chartType == 'line') {
                this.isChartLine = true;
                this.isChartBar = false
            } else {
                this.isChartLine = false;
                this.isChartBar = true
            }
            this.chartType = chartType
            this.didChart.destroy()
            this.polarChart.destroy()
            this.renderUsageDetailsChart()
        },
        renderUsageDetailsChart() {
            const didCtx = document.getElementsByClassName('didChart');

            const serviceDetailsOfSessions = this.getUsageDetails.serviceDetails // ChartData.serviceDetails;

            const allData = serviceDetailsOfSessions.filter(x => x.apiPath.includes('/api/v1/')).map(x => {
                return {
                    apiPath: x.apiPath,
                    quantity: x.quantity,
                    data: x.data
                }
            })

            const allDidActivities = serviceDetailsOfSessions.filter(x => x.apiPath.includes('api/v1/did'))
            const allSchemaActivities = serviceDetailsOfSessions.filter(x => x.apiPath.includes('/api/v1/schema'))
            const allCredentialActivities = serviceDetailsOfSessions.filter(x => x.apiPath.includes('/api/v1/credential'))


            var set = new Set();

            allData.forEach(x => {
                Object.keys(x.data).forEach(y => {
                    set.add(y)
                })
            })
            const allLabels = Array.from(set)



            const allDidDataSets = allDidActivities.length > 0 ?
                allLabels.map(x => {

                    return allDidActivities.map(y => {

                        if (y.data[x]) {
                            return y.data[x]
                        } else {
                            return 0
                        }
                    })
                }).map(innerArray => innerArray.reduce((acc, curr) => acc + curr, 0))

                : []

            const allSchemaDataSets = 
            allSchemaActivities.length > 0 ? allLabels.map(x => {
                return allSchemaActivities.map(y => {
                    if (y.data[x]) {
                        return y.data[x]
                    } else {
                        return 0
                    }
                })
            }).map(innerArray => innerArray.reduce((acc, curr) => acc + curr, 0)) : []

            const allCredentialDataSets = 
            allCredentialActivities.length > 0 ? allLabels.map(x => {
                return allCredentialActivities.map(y => {
                    if (y.data[x]) {
                        return y.data[x]
                    } else {
                        return 0
                    }
                })
            }).map(innerArray => innerArray.reduce((acc, curr) => acc + curr, 0)) : []
            this.didChart = new Chart(didCtx, {
                type: 'bar',
                data: {
                    labels: Array.from(set),
                    datasets: [
                        {
                            type: this.chartType,
                            label: 'Did Operations',
                            data: allDidDataSets,
                            fill: true,
                            backgroundColor: this.chartType == 'line' ? '#00800066' : 'forestgreen',
                            // borderColor: 'green',
                            tension: 0.2,
                            pointRadius: 1,
                            stack: 'Stack 0',
                        },

                        {
                            type: this.chartType,
                            label: 'Schema Operations',
                            data: allSchemaDataSets,
                            // borderColor: 'red',
                            // pointStyle: 'circle',
                            pointRadius: 1,
                            fill: true,
                            backgroundColor: this.chartType == 'line' ? '#ff000070' : 'indianred',
                            tension: 0.2,
                            stack: 'Stack 0',
                        },

                        {
                            type: this.chartType,
                            label: 'Credential Operations',
                            data: allCredentialDataSets,
                            // borderColor: 'grey',
                            pointRadius: 1,
                            pointHitRadius: 1,
                            fill: true,
                            backgroundColor: this.chartType == 'line' ? 'rgba(220, 220, 220, 0.2)' : '#ffa500b3',
                            tension: 0.2,
                            stack: 'Stack 0',
                            borderDash: [5, 5]
                        },
                    ]
                },
            });

            const pieData = [
                // allData.length > 0? allData.map(x => x.quantity).reduce((acc, curr) => acc + curr, 0) : 0,
                allDidActivities.length > 0 ? allDidActivities.map(x => x.quantity).reduce((acc, curr) => acc + curr, 0) : 0,
                allSchemaActivities.length > 0 ? allSchemaActivities.map(x => x.quantity).reduce((acc, curr) => acc + curr, 0) : 0,
                allCredentialActivities.length > 0 ? allCredentialActivities.map(x => x.quantity).reduce((acc, curr) => acc + curr, 0) : 0,
            ]



            const polarChartCtx = document.getElementsByClassName('polarChart');
            this.polarChart = new Chart(polarChartCtx, {
                type: 'doughnut',
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: 'SSI Usage Details',
                        }
                    }
                },
                data: {
                    labels: [
                        // 'All API Calls',
                        'Did Operations',
                        'Schema Operations',
                        'Credential Operations',

                    ],
                    datasets: [{
                        label: 'Usage Count',
                        data: pieData,
                        backgroundColor: [
                            '#228b22b0',
                            '#cd5c5cc4',
                           '#ffa500b3'
                        ]
                    }]
                },
            });

        },

        copyToClip(textToCopy, contentType) {
            if (textToCopy) {
                navigator.clipboard
                    .writeText(textToCopy)
                    .then(() => {
                        this.notifySuccess(`${contentType} copied!`);
                    })
                    .catch((err) => {
                        this.notifyErr("Error while copying", err);
                    });
            }
        },

        setDate() {
            const today = new Date();
            const day = 1;
            const month = today.getMonth();
            const year = today.getFullYear();

            this.startDate = (new Date(year, month, day));
            this.endDate = today;
        },

        async search() {
            try {
                if (!this.startDate) {
                    throw new Error("Start date is not set")
                }

                if (!this.endDate) {
                    this.endDate = (new Date());
                }

                this.startDate = (new Date(this.startDate));
                this.endDate = (new Date(this.endDate));

                this.isLoading = true
                this.usageDetails = await this.fetchUsageForAService({ startDate: this.startDate, endDate: this.endDate })
                await this.fetchUsageDetailsForAService({ startDate: this.startDate, endDate: this.endDate });
                this.isLoading = false

                this.didChart.destroy()
                this.polarChart.destroy()
                this.renderUsageDetailsChart()
            } catch (e) {
                this.isLoading = false
                this.notifyErr(e.message)
            }
        },

        groupByWeek(data) {
            const weeklyData = {};
            const dates = Object.keys(data).map(date => new Date(date));

            dates.sort((a, b) => a - b); // Sort dates

            let weekNumber = 1;
            let startOfWeek = new Date(dates[0]);

            dates.forEach(date => {
                const endOfWeek = new Date(startOfWeek);
                endOfWeek.setDate(startOfWeek.getDate() + 6);

                if (date >= startOfWeek && date <= endOfWeek) {
                    const weekKey = `Week ${weekNumber}`;
                    weeklyData[weekKey] = (weeklyData[weekKey] || 0) + data[date.toISOString().split('T')[0]];
                } else {
                    weekNumber++;
                    startOfWeek = new Date(date);
                    const weekKey = `Week ${weekNumber}`;
                    weeklyData[weekKey] = data[date.toISOString().split('T')[0]];
                }
            });

            return weeklyData;
        },

        groupByMonth(data) {
            const monthlyData = {};

            for (const date in data) {
                const month = date.slice(0, 7); // Extract 'YYYY-MM'
                monthlyData[month] = (monthlyData[month] || 0) + data[date];
            }

            return monthlyData;
        },
        renderChart() {
            const ctx = document.getElementById('doughNutChat');
            this.doughNutChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: this.doughNutChartLabel,
                    datasets: [
                        {
                            label: 'Credit',
                            data: this.dougnNutData,
                            backgroundColor: [
                                'green',
                                'grey',
                            ],
                            hoverOffset: 4,
                            cutout: '50%',
                            circumference: 180,
                            rotation: 270,
                            hoverBorderJoinStyle: 'round',
                        }
                    ]
                },
            });
        },

        renderUsageChart() {
            const didCtx = document.getElementById('didChartX');
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

            const credCtx = document.getElementById('credChartX');
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


            const schemaCtx = document.getElementById('schemaChartX');
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

    },
    mixins: [UtilsMixin],

}

</script>