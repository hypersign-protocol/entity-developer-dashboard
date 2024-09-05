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

.card {
    border-radius: 10px;
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
    <div>
        <loading :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></loading>

        <!-- Credits -->
        <div class="row">
            <div class="col-md-12" style="text-align: left">
                <div class="form-group" style="display:flex">
                    <h3 style="text-align: left;">Credits</h3>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-4">
                <div class="p-4">
                    <canvas id="doughNutChat"></canvas>
                </div>
            </div>
            <div class="col-2"></div>
            <div class="col-6">
                <div class="card p-4 mt-1" style="border-radius: 20px;">
                    <div class="row">
                        <div class="col-8">
                            <p><b>Total Credits</b></p>
                            <p>
                                <span style="font-size:xx-large;">
                                    {{ numberFormat(parsedAllowanceLimit) }}
                                </span> <span style="font-size:larger;">/</span>
                                <span style="font-size:larger; color: grey">
                                    {{ numberFormat(allowance.total) }}
                                </span>
                            </p>
                            <p>
                                <span style="font-size:small; color: grey">
                                    Expires In: {{ expiration }}
                                </span>
                            </p>
                        </div>
                        <div class="col-4 center">
                            <button class="btn btn-outline-secondary  " type="button" @click="openCreditCalcualtor()"
                                :disabled="parsedAllowanceLimit <= 0">
                                <i class="fas fa-calculator"></i> Credit Usage Estimation
                            </button>
                        </div>
                    </div>
                </div>
                <div class="card p-4 mt-1" style="border-radius: 20px;">
                    <div>
                        <p><b>Scope(s)</b></p>
                        <p v-if="grants.length > 0">
                            <span class="badge badge-info mx-1" v-for="eachRow in grants"
                                v-bind:key="eachRow.authorization.msg">{{
                                    eachRow.authorization.msg.replace('/hypersign.ssi.v1.Msg', '') }}</span>
                        </p>
                        <p v-else>
                            No scope granted!
                        </p>

                    </div>
                </div>
            </div>
        </div>

        <!--Usage -->
        <div class="row mt-2">
            <div class="col-md-12" style="text-align: left">
                <div class="form-group" style="display:flex">
                    <h3 style="text-align: left;">Usage</h3>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-4">
                <div class="card p-4">
                    <canvas id="didChart"></canvas>
                </div>
            </div>

            <div class="col-4">
                <div class="card p-4">
                    <canvas id="credChart"></canvas>
                </div>
            </div>

            <div class="col-4">
                <div class="card p-4">
                    <canvas id="schemaChart"></canvas>
                </div>
            </div>
        </div>

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
        --->


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
    </div>
</template>


<script>


// import { CChart, } from '@coreui/vue-chartjs'
import Chart from 'chart.js/auto';
import HfPopUp from "../../components/element/hfPopup.vue";
import { mapActions } from "vuex";
import Loading from "vue-loading-overlay";
import UtilsMixin from '../../mixins/utils';

export default {
    name: "SSIDashboardCredit",
    components: {
        // CChart,
        HfPopUp,
        Loading
    },
    computed: {
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
            console.log(balance)
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
    async mounted() {
        try {
            this.isLoading = true
            const payload = {
                // wallet: "hid1a4zqvlmp3w9ggctvc873f08k3evh3mmj2vx939",
                groupBy: 'daily'
            }

            // get allowance
            const t = await this.ssiDashboardAllowanceStats(payload)
            if (t.allowance) {
                this.allowance = t.allowance
                this.allowance.total = 5000000
                this.dougnNutData = [this.parsedAllowanceLimit, this.allowance.total - this.parsedAllowanceLimit]
                this.redrawChart = true
            }

            // get grants
            this.grants = await this.ssiDashboardGrantsStats(payload)

            // get tx stats
            this.ssiDashboardStats = await this.ssiDashboardTxStats(payload)

            this.isLoading = false
        } catch (e) {
            this.isLoading = false
            this.notifyErr(e.message)
            console.error(e)
        } finally {
            if (this.allowance.expiration) {
                this.expiration = this.getTimeUntilEvent(this.allowance.expiration)
                this.interval = setInterval(() => {
                    this.expiration = this.getTimeUntilEvent(this.allowance.expiration)
                }, 1000)
            }
            this.calculateCreditDollarValue()
            this.renderChart()
            this.renderUsageChart()
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
    data() {
        return {
            doughNutChart: null,
            didChart: null,
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

        }
    },
    methods: {
        ...mapActions('mainStore', ['ssiDashboardTxStats', 'ssiDashboardAllowanceStats', 'ssiDashboardGrantsStats']),

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

    },
    mixins: [UtilsMixin],

}

</script>