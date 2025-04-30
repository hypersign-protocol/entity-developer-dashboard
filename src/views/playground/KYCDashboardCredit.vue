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
</style>
<template>
    <div>
        <loading :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></loading>
        <!-- Credits -->
        <div class="row">
            <div class="col-md-6" style="text-align: left">
                <div class="form-group" style="display:flex">
                    <h3 style="text-align: left;">Credits</h3>
                </div>
            </div>
            <div class="col-6">
                <hf-buttons name=" Refresh" iconClass="arrow-clockwise" :bIcon="true" class="ml-auto "
                    style="float: right;" @executeAction="reloadData()"></hf-buttons>
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
                <div class="serviceCard p-4 mt-1">
                    <div class="">
                        <div class="">
                            <p><b>Total Credits</b></p>
                          <p v-if="myKYCCredits.allRemainingCredits === 0 && myKYCCredits.allAvailableCredits === 0">
                            <span style="font-size: xx-large;">
                                {{ numberFormat(myKYCCredits.allRemainingCredits) }}
                            </span>
                         </p>
                         <p v-else>
                            <span style="font-size: xx-large;">
                                {{ numberFormat(myKYCCredits.allRemainingCredits) }}
                            </span> 
                            <span style="font-size: larger;">/</span>
                            <span style="font-size: larger; color: grey">
                                {{ numberFormat(myKYCCredits.allAvailableCredits) }}
                            </span>
                         </p>
                            <p v-if="this.timeRemaining==='Expired'">
                                <span style="font-size:small; color: grey">
                                    Expired
                                </span>
                            </p>
                            <p v-else-if="this.timeRemaining==='InActive'">
                                <span style="font-size:small; color: grey">
                                    InActive
                                </span>
                            </p>
                             <p v-else>
                                <span style="font-size:small; color: grey">
                                    Expires In: {{ this.timeRemaining }}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
                <!-- <div class="card p-4 mt-1" style="border-radius: 20px;">
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
                </div> -->
            </div>
        </div>
        <!-- Credit History -->
        <div class="row" v-if="this.getKYCCredits.length > 0">
            <div class="col-md-12" style="text-align: left">
                <div class="form-group" style="display:flex">
                    <h3 style="text-align: left;">Credit History</h3>
                </div>
            </div>
        </div>
        <div class="row" v-if="this.getKYCCredits.length > 0">
            <div class="col p-1">
                <table class="table table-hover event-card">
                    <thead class="thead-light">
                        <tr>

                            <th scope="col">Date</th>
                            <th scope="col">Credit(s)</th>
                            <!-- <th scope="col">Used Credit(s)</th> -->
                            <th scope="col">Expires In</th>

                            <th scope="col">Available Credits</th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="eachRow in getSortedKYCCredits" v-bind:key="eachRow._id">
                            <td>

                                {{ formatDate(eachRow.createdAt) }} 

                            <td>
                                {{ numberFormat(eachRow.totalCredits) }}
                            </td>

                            <!-- <td>
                                {{ numberFormat(eachRow.used) }}
                            </td> -->
                            <td v-if="eachRow.used >= eachRow.totalCredits" class="greyFont">
                                Credit Limit Reached
                                
                            </td>
                            <td v-else-if="Date.now() > new Date(eachRow.expiresAt)" class="greyFont">
                                Expired
                            </td>
                            <td v-else>
                                  {{ isValidDate(eachRow.expiresAt) ? formatTimeRemaining(eachRow.expiresAt) : 'Not Activated' }}
                            </td>


                            <td :title="`Credit left: ${eachRow.totalCredits - eachRow.used}`" >
                                <b-progress :max="eachRow.totalCredits" class="mt-1" v-if="Date.now() > new Date(eachRow.expiresAt)" >
                                    <b-progress-bar :value="eachRow.used" variant="danger" ></b-progress-bar>
                                </b-progress>
                                <b-progress :max="eachRow.totalCredits" class="mt-1" v-else >
                                    <b-progress-bar :value="eachRow.used" variant="danger" ></b-progress-bar>
                                </b-progress>
                            </td>

                            <td v-if="(eachRow.status == 'Active'   && !(Date.now() > new Date(eachRow.expiresAt)) ) ">
                                <hf-buttons iconClass="circle-fill" :bIcon="true" class="ml-auto " style="color:gray; "
                                    disabled animate="throb" :name="eachRow.status">
                                </hf-buttons>
                            </td>
                            <td v-else>
                                <hf-buttons v-if="eachRow.used < eachRow.totalCredits && !(Date.now() > new Date(eachRow.expiresAt)) " name=" Activate"
                                    iconClass="play-circle" :bIcon="true" class="ml-auto "
                                    @executeAction="activateThisCredit(eachRow)"></hf-buttons>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

    </div>
</template>


<script>


// import { CChart, } from '@coreui/vue-chartjs'
import Chart from 'chart.js/auto';
// import HfPopUp from "../../components/element/hfPopup.vue";
import { mapActions, mapGetters } from "vuex";
import Loading from "vue-loading-overlay";
import UtilsMixin from '../../mixins/utils';
import HfButtons from "../../components/element/HfButtons.vue"

export default {
    name: "SSIDashboardCredit",
    components: {
        // CChart,
        // HfPopUp,
        HfButtons,
        Loading
    },
    computed: {
        ...mapGetters('mainStore', ['getKYCCredits']),

        getSortedKYCCredits() {
            const t = this.getKYCCredits
            
            return t.sort((a, b) => new Date(b.expiresAt) - new Date(a.expiresAt))
        },
        myKYCCredits() {

            let expiryAt = (new Date()).toISOString()

            if (this.getKYCCredits.length == 0) {
                return {
                    allAvailableCredits: 0,
                    allUsedCredits: 0,
                    allRemainingCredits: 0,
                    expiresAt: expiryAt
                }
            }

            const now = new Date()
            let not_expired_credits = this.getKYCCredits.filter(x => {

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
                return {
                    allAvailableCredits: 0,
                    allUsedCredits: 0,
                    allRemainingCredits: 0,
                    expiresAt: expiryAt
                }
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
            expiryAt = not_expired_credits[0]


            return {
                ...total,
                allRemainingCredits: total.allAvailableCredits - total.allUsedCredits,
                expiresAt: expiryAt.expiresAt
            }
        }
    },
    async mounted() {
        await this.reloadData()

    },
    beforeDestroy() {
        console.log('Clearing clear interval before destroying...')
        this.stopTimer();
    },

    data() {
        return {
            timeRemaining: '', // Placeholder for formatted time remaining
            timer: null, // Holds the interval timer reference

            doughNutChart: null,
            didChart: null,
            schemaChart: null,
            credChart: null,
            doughNutChartLabel: [
                'Credits Used',
                'Credits Left',
            ],

            interval: null,
            fullPage: true,
            isLoading: false,
            expiration: "",

            initialBalance: 1000,
            leftBalance: 1000,
            grants: [

            ],
            ////////////////////////////////
            hidPrice: 1,
            uhidFactor: 1000000,
            creditDollarValue: 0,
            added: 0,

        }
    },
    methods: {
        ...mapActions('mainStore', ['fetchKYCCredits', 'activateCredit']),

        async reloadData() {
            try {
                this.isLoading = true
                await this.fetchKYCCredits()
                this.startTimer();
                this.isLoading = false
            } catch (e) {
                this.isLoading = false
                this.notifyErr(e.message)
                console.error(e)
            } finally {

                this.renderChart()
                // this.renderUsageChart()
            }
        },
        updateTimer() {
            this.timeRemaining = this.formatTimeRemaining(this.myKYCCredits.expiresAt);
        },
        startTimer() {
            this.updateTimer(); // Update immediately
            this.timer = setInterval(() => {
                this.updateTimer(); // Update every second
            }, 1000);
        },
        stopTimer() {
            clearInterval(this.timer); // Stop the interval timer
        },
        renderChart() {
            const expired = this.getKYCCredits.every(element => Date.now() > new Date(element.expiresAt));
            const used = this.myKYCCredits.allUsedCredits || 0;
            const remaining = this.myKYCCredits.allRemainingCredits || 0;
            const total = used + remaining;
            const dataToRender = this.getKYCCredits.length === 0 || total === 0
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
            });
        },


        numberFormat(numberstr) {
            return new Intl.NumberFormat().format(numberstr)
        },

        async activateThisCredit(eachRow) {
            try {

                if (eachRow.used == eachRow.totalCredits) {
                    this.notifyErr("Credit already exhausted")
                    return;
                }
                this.isLoading = true

                await this.activateCredit({
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
    },
    mixins: [UtilsMixin],

}

</script>