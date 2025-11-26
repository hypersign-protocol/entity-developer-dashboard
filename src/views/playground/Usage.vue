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
<template>
  <div :class="isContainerShift ? 'homeShift' : 'home'">
    <loadIng :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></loadIng>


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
          <b-button :pressed="isGroupByMonthly" variant="outline-secondary" @click="groupByTheChart('monthly')"
            disabled>Monthly</b-button>
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
        <b-card class="serviceCard"  style="padding:15px; ">
          <canvas class="didChart"></canvas>
        </b-card>
      </div>
      <div class="col-md-4">
        <b-card class="serviceCard" style="padding:0px; height: 100%;">
          <canvas class="polarChart"></canvas>
        </b-card>
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
              <td>{{ row.apiPath }}</td>
              <td>{{ row.unit_cost }}</td>
              <td>{{ row.quantity }}</td>
              <td>{{ row.amount }}</td>
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
import UtilsMixin from '../../mixins/utils';
import { mapState, mapActions, mapMutations } from "vuex";
import { mapGetters } from 'vuex/dist/vuex.common.js';

export default {
  name: "UsageS",
  computed: {
    ...mapState({
      containerShift: state => state.playgroundStore.containerShift,
    }),
    ...mapGetters('mainStore', ['getUsageDetails', 'getUserDetails']),
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
          totalCredits: accumulator.totalCredits + currentValue.amount
        }
      }, { totalQuantity: 0, totalCredits: 0 })
      return total
    }
  },
  data() {
    return {
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
      // const usrStr = localStorage.getItem("user");
      this.user = this.getUserDetails
      this.updateSideNavStatus(true)

      // appId
      this.isLoading = true
      this.setDate()
      this.fetchUsageForAService({ startDate: this.startDate, endDate: this.endDate }).then((data) => {
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
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.prevRoute = from;
    });
  },
  methods: {
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
      // this.polarChart.destroy()
      this.renderUsageDetailsChart()
    },
    renderUsageDetailsChart() {
      const didCtx = document.getElementsByClassName('didChart');
      const serviceDetailsOfSessions = this.getUsageDetails.serviceDetails // ChartData.serviceDetails;
      const allData = serviceDetailsOfSessions.filter(x => x.apiPath == '/api/v1/e-kyc/verification/session')
      const successData = serviceDetailsOfSessions.filter(x => x.apiPath.indexOf('success') >= 0)
      const failedData = serviceDetailsOfSessions.filter(x => x.apiPath.indexOf('failed') >= 0)
      const expiredData = serviceDetailsOfSessions.filter(x => x.apiPath.indexOf('expired') >= 0)

      const allLabels = [
        ...Object.keys(allData && allData[0] ? allData[0].data : {}),
        // ...Object.keys(successData && successData[0] ? successData[0].data : {}),
        // ...Object.keys(failedData && failedData[0] ? failedData[0].data : {}),
        // ...Object.keys(expiredData && expiredData[0] ? expiredData[0].data : {}),
      ]

      const successDataSets = successData[0] ? allLabels.map(x => {
        if (successData[0].data[x]) {
          return successData[0].data[x]
        } else {
          return 0
        }
      }) : []

      const failDataSets = failedData[0] ? allLabels.map(x => {
        if (failedData[0].data[x]) {
          return failedData[0].data[x]
        } else {
          return 0
        }
      }) : []

      const expiredDataSets = expiredData[0] ? allLabels.map(x => {
        if (expiredData[0].data[x]) {
          return expiredData[0].data[x]
        } else {
          return 0
        }
      }) : []

      console.log(successDataSets)
      console.log(allLabels)
      var set = new Set(allLabels);
      console.log(Array.from(set))
      this.didChart = new Chart(didCtx, {
        type: 'bar',
        data: {
          labels: Array.from(set),
          datasets: [
            {
              type: this.chartType,
              label: 'Successful Verifications',
              data: successDataSets,
              fill: true,
              backgroundColor: this.chartType == 'line' ? '#00800066' : 'forestgreen',
              // borderColor: 'green',
              tension: 0.2,
              pointRadius: 1,
              stack: 'Stack 0',
            },

            {
              type: this.chartType,
              label: 'Failed Verifications',
              data: failDataSets,
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
              label: 'Expired Verifications',
              data: expiredDataSets,
              // borderColor: 'grey',
              pointRadius: 1,
              pointHitRadius: 1,
              fill: true,
              backgroundColor: this.chartType == 'line' ? 'rgba(220, 220, 220, 0.2)' : 'lightgrey',
              tension: 0.2,
              stack: 'Stack 0',
              borderDash: [5, 5]
            },
          ]
        },
      });

      const pieData = [
        allData && allData[0] ? allData[0].quantity : 0,
        successData && successData[0] ? successData[0].quantity : 0,
        failedData && failedData[0] ? failedData[0].quantity : 0,
        expiredData && expiredData[0] ? expiredData[0].quantity : 0,
      ]

      const polarChartCtx = document.getElementsByClassName('polarChart');
      this.polarChart = new Chart(polarChartCtx, {
        type: 'polarArea',
        options: {
          plugins: {
            title: {
              display: true,
              text: 'User Verifications',
            }
          }
        },
        data: {
          labels: [
            'All',
            'Successful',
            'Failed',
            'Expired',
          ],
          datasets: [{
            label: 'Verifications',
            data: pieData,
            backgroundColor: [
              '#ffa500b3',
              '#228b22b0',
              '#cd5c5cc4',
              '#d3d3d3b8',
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
    }

  },
  mixins: [UtilsMixin],

};
</script>
