<template>
  <v-container>
    <v-row align="center">
      <v-col cols="12" md="6">
        <h4 class="font-weight-bold mb-0">API Usage Analytics</h4>
        <p class="text-subtitle-2 text-muted">Monitor consumption and service costs</p>
      </v-col>
      <v-col cols="12" md="6" >
        <v-menu v-model="menu1" :close-on-content-click="false" transition="scale-transition" offset-y min-width="auto">
          <template v-slot:activator="{ on, attrs }">
            <v-text-field v-model="dates" label="Date Range" prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on" dense outlined hide-details class="max-width-300"></v-text-field>
          </template>
          <v-date-picker v-model="dates" range @change="handleDateChange"></v-date-picker>
        </v-menu>

        <!-- <div class="date-picker-group d-flex align-center">
          <b-form-datepicker
            v-model="startDate"
            size="sm"
            local="en"
            placeholder="Start Date"
            class="mr-2 custom-date-input"
            @input="handleDateChange"
          ></b-form-datepicker>
          
          <span class="mx-2 text-muted">to</span>

          <b-form-datepicker
            v-model="endDate"
            size="sm"
            local="en"
            placeholder="End Date"
            class="custom-date-input"
            @input="handleDateChange"
          ></b-form-datepicker>
        </div> -->
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" lg="7">
        <div class="overview-container h-100">
          <div class="header-row">
            <div class="title-group">
              <h3 class="title">Daily Trend</h3>
              <p class="subtitle">API call volume over time</p>
            </div>
          </div>
          <div v-if="loading" class="skeleton-chart"></div>
          <div v-else class="chart-wrapper">
            <div ref="lineChart" class="chart-canvas"></div>
          </div>
        </div>
      </v-col>

      <v-col cols="12" lg="5">
        <div class="overview-container h-100">
          <div class="header-row">
            <div class="title-group">
              <h3 class="title">Usage by Endpoint</h3>
              <p class="subtitle">Top consumed services</p>
            </div>
          </div>
          <div v-if="loading" class="skeleton-chart"></div>
          <div v-else class="chart-wrapper">
            <div ref="barChart" class="chart-canvas"></div>
          </div>
        </div>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <div class="overview-container">
          <div class="header-row">
            <h3 class="title">API Cost Breakdown</h3>
            <!-- <span class="badge">Billing Period</span> -->
          </div>
          <div v-if="loading" class="loading-list p-4 text-center">
            <v-progress-linear indeterminate color="blue"></v-progress-linear>
          </div>
          <div v-else class="usage-table-wrapper">
            <table class="usage-table">
              <thead>
                <tr>
                  <th>API Endpoint</th>
                  <th class="text-right">Quantity</th>
                  <th class="text-right">Unit Cost</th>
                  <th class="text-right">Total Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in usageSummary" :key="item.apiPath">
                  <td><code class="endpoint-code">{{ item.apiPath }}</code></td>
                  <td class="text-right font-weight-bold">{{ formatNumber(item.quantity) }}</td>
                  <td class="text-right text-muted">{{ item.unit_cost }}</td>
                  <td class="text-right color-blue font-weight-bold">{{ formatNumber(item.amount) }}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr class="total-row">
                  <td>Total Consumption</td>
                  <td class="text-right">{{ formatNumber(totalCalls) }}</td>
                  <td></td>
                  <td class="text-right color-blue">{{ totalAmount }}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex';
import * as echarts from 'echarts';
import moment from 'moment';

export default {
  name: "ApiUsageAnalytics",
  data() {
    return {
      loading: false,
      dates: [moment().subtract(30, 'days').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
      menu1: false,
      usageSummary: [],
      dailyData: [],
      lineChart: null,
      barChart: null
    };
  },
  computed: {
    totalCalls() { return this.usageSummary.reduce((acc, curr) => acc + curr.quantity, 0); },
    totalAmount() { return this.usageSummary.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString(); }
  },
  async mounted() {
    await this.refreshData();
    window.addEventListener('resize', this.handleResize);
  },
  methods: {
    ...mapActions('mainStore', ['fetchUsageDetailsForAService', 'fetchUsageForAService']),

    formatNumber(val) { return Number(val || 0).toLocaleString(); },

    async refreshData() {
      this.loading = true;
      try {
        const [dailyRes, summaryRes] = await Promise.all([
          this.fetchUsageDetailsForAService({ startDate: this.dates[0], endDate: this.dates[1] }),
          this.fetchUsageForAService({ startDate: this.dates[0], endDate: this.dates[1] })
        ]);

        this.dailyData = dailyRes.serviceDetails || [];
        this.usageSummary = summaryRes.serviceDetails || [];

        await this.$nextTick();
        setTimeout(() => {
          this.initLineChart();
          this.initBarChart();
        }, 150);
      } catch (err) {
        console.error("Failed to load API usage", err);
      } finally {
        this.loading = false;
      }
    },

    initLineChart() {
      const chartDom = this.$refs.lineChart;
      if (!chartDom) return;
      if (this.lineChart) this.lineChart.dispose();
      this.lineChart = echarts.init(chartDom);

      const aggregated = {};
      this.dailyData.forEach(service => {
        Object.entries(service.data || {}).forEach(([date, count]) => {
          aggregated[date] = (aggregated[date] || 0) + count;
        });
      });

      const sortedDates = Object.keys(aggregated).sort((a, b) => new Date(a) - new Date(b));
      const seriesData = sortedDates.map(date => aggregated[date]);

      this.lineChart.setOption({
        tooltip: { trigger: 'axis' },
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: { 
          type: 'category', 
          data: sortedDates, 
          axisLabel: { formatter: val => moment(val).format('DD MMM') } 
        },
        yAxis: { type: 'value' },
        series: [{
          name: 'Total Calls',
          type: 'line',
          smooth: true,
          data: seriesData,
          itemStyle: { color: '#3b82f6' },
          areaStyle: { color: 'rgba(59, 130, 246, 0.1)' }
        }]
      });
    },

    initBarChart() {
      const chartDom = this.$refs.barChart;
      if (!chartDom) return;
      if (this.barChart) this.barChart.dispose();
      this.barChart = echarts.init(chartDom);

      // Sort summary by quantity for the bar chart
      const sortedData = [...this.usageSummary]
        .sort((a, b) => a.quantity - b.quantity)
        .slice(-8); // Show top 8

      this.barChart.setOption({
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        grid: { left: '3%', right: '10%', bottom: '3%', top: '5%', containLabel: true },
        xAxis: { type: 'value', splitLine: { show: false } },
        yAxis: { 
          type: 'category', 
          data: sortedData.map(item => item.apiPath.split('/').pop()), // Just show the last part of path
          axisLabel: { fontSize: 10 }
        },
        series: [{
          name: 'Volume',
          type: 'bar',
          data: sortedData.map(item => item.quantity),
          itemStyle: { 
            color: '#6366f1',
            borderRadius: [0, 4, 4, 0]
          },
          label: { show: true, position: 'right' }
        }]
      });
    },

    handleDateChange() { if (this.dates.length === 2) this.refreshData(); },
    handleResize() {
      this.lineChart?.resize();
      this.barChart?.resize();
    }
  }
};
</script>

<style scoped>
.overview-container {
  padding: 1.5rem;
  background-color: #f9fafb;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
}
.chart-wrapper { height: 320px; width: 100%; background: white; border-radius: 0.5rem; padding: 1rem; }
.chart-canvas { width: 100%; height: 100%; }
.usage-table-wrapper { background: white; border-radius: 0.5rem; overflow: hidden; border: 1px solid #f3f4f6; }
.usage-table { width: 100%; border-collapse: collapse; }
.usage-table th { background: #f8fafc; padding: 1rem; font-size: 0.75rem; text-transform: uppercase; color: #64748b; border-bottom: 1px solid #e2e8f0; }
.usage-table td { padding: 1rem; font-size: 0.875rem; border-bottom: 1px solid #f1f5f9; }
.endpoint-code { background: #f1f5f9; color: #475569; padding: 0.2rem 0.4rem; border-radius: 4px; font-family: monospace; font-size: 0.75rem; }
.total-row { background: #f8fafc; font-weight: 800; }
.badge { font-size: 0.7rem; font-weight: 600; padding: 0.25rem 0.75rem; background: #e0f2fe; color: #0369a1; border-radius: 9999px; }
.color-blue { color: #2563eb; }
.skeleton-chart { height: 320px; background: #e5e7eb; border-radius: 0.5rem; animation: pulse 2s infinite; }
@keyframes pulse { 50% { opacity: 0.5; } }
</style>