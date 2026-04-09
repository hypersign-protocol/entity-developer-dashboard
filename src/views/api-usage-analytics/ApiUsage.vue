<template>
  <v-container class="py-6">
    <v-row align="center" class="mb-6">
      <v-col cols="12" md="6">
        <h4 class="font-weight-bold mb-0">API Usage Analytics</h4>
        <p class="text-subtitle-2 text-muted">Monitor consumption and service costs</p>
      </v-col>
      <v-col cols="12" md="6">
        <div class="date-picker-group d-flex align-center">
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
        </div>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" lg="7">
        <div class="overview-container h-100">
          <div class="header-row">
            <div class="title-group">
              <h5 class="title">DAILY TRENDS</h5>
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
              <h5 class="title">USAGE BY ENDPOINT</h5>
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

    <v-row v-if="this.env==='prod'">
      <v-col cols="12">
        <div class="overview-container">
          <div class="header-row">
            <h5 class="title">API COST BREAKDOWN</h5>
            <!-- <span class="badge">Billing Period</span> -->
          </div>
          <div v-if="loading" class="loading-list p-4 text-center">
            <v-progress-linear indeterminate color="blue"></v-progress-linear>
          </div>
          <div v-else class="usage-table-wrapper">
            <table class="usage-table">
              <thead>
                <tr>
                  <th>Method</th>
                  <th>API Endpoint</th>
                  <th class="text-right">Quantity</th>
                  <th class="text-right">Unit Cost</th>
                  <th class="text-right">Total Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, index) in usageSummary"
                  :key="(item.method || '') + '_' + item.apiPath + '_' + index"
                >
                  <td>
                    <code
                      :class="[
                        'api-method',
                        'api-method-' + (item.method || '').toLowerCase(),
                      ]"
                      >{{ item.method }}</code
                    >
                  </td>
                  <td>
                    <code
                      class="endpoint-code"
                      :title="item.apiPath"
                    >
                      {{ truncate(item.apiPath, 70) }}
                    </code>
                  </td>
                  <td class="text-right font-weight-bold">
                    {{ formatNumber(item.quantity) }}
                  </td>
                  <td class="text-right text-muted">{{ item.unit_cost }}</td>
                  <td class="text-right color-blue font-weight-bold">
                    {{ formatNumber(item.amount) }}
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr class="total-row">
                  <td>Total Consumption</td>
                  <td></td>
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
import { mapActions } from "vuex";
import * as echarts from "echarts";
import moment from "moment";

export default {
  name: "ApiUsageAnalytics",
  data() {
    return {
      loading: false,
      startDate: moment().subtract(30, "days").format("YYYY-MM-DD"),
      endDate: moment().format("YYYY-MM-DD"),
      menu1: false,
      usageSummary: [],
      usageSummaryByEndpoint: [],
      dailyData: [],
      lineChart: null,
      barChart: null,
    };
  },

  computed: {
    totalCalls() {
      return this.usageSummary.reduce((acc, curr) => acc + curr.quantity, 0);
    },
    totalAmount() {
      return this.usageSummary
        .reduce((acc, curr) => acc + curr.amount, 0)
        .toLocaleString();
    },
    env() {
      const service = this.$store.getters["mainStore/getSelectedService"];
      return service?.env === "prod" ? "prod" : "dev";
    },
  },
  async mounted() {
    await this.refreshData();
    window.addEventListener("resize", this.handleResize);
  },
  methods: {
    ...mapActions("mainStore", ["fetchUsageDetailsForAService", "fetchUsageForAService"]),

    truncate(str, maxLen = 50) {
      if (!str) return '';
      return str.length > maxLen ? str.slice(0, maxLen) + '…' : str;
    },

    formatNumber(val) {
      return Number(val || 0).toLocaleString();
    },

    async refreshData() {
      this.loading = true;
      try {
        const [dailyRes, summaryRes] = await Promise.all([
          this.fetchUsageDetailsForAService({
            startDate: this.startDate,
            endDate: this.endDate,
            env: this.env,
          }),
          this.fetchUsageForAService({
            startDate: this.startDate,
            endDate: this.endDate,
            env: this.env,
          }),
        ]);

        this.dailyData = dailyRes.serviceDetails || [];
        this.usageSummary = (summaryRes.serviceDetails || [])
        // for same endpoint with diffrent query params club them together
        this.usageSummaryByEndpoint = this.usageSummary.reduce((acc, curr) => {
          const basePath = curr.apiPath.split("?")[0]; // Get path without query params
          const existing = acc.find((item) => item.apiPath === basePath);
          if (existing) {
            existing.quantity += curr.quantity;
            existing.amount += curr.amount;
          } else {
            acc.push({ ...curr, apiPath: basePath });
          }
          return acc;
        }, []);
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
      this.dailyData.forEach((service) => {
        Object.entries(service.data || {}).forEach(([date, count]) => {
          aggregated[date] = (aggregated[date] || 0) + count;
        });
      });

      const sortedDates = Object.keys(aggregated).sort(
        (a, b) => new Date(a) - new Date(b)
      );
      const seriesData = sortedDates.map((date) => aggregated[date]);

      this.lineChart.setOption({
        tooltip: { trigger: "axis" },
        grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
        xAxis: {
          type: "category",
          data: sortedDates,
          axisLabel: { formatter: (val) => moment(val).format("DD MMM") },
        },
        yAxis: { type: "value" },
        series: [
          {
            name: "Total Calls",
            type: "line",
            smooth: true,
            data: seriesData,
            itemStyle: { color: "#3b82f6" },
            areaStyle: { color: "rgba(59, 130, 246, 0.1)" },
          },
        ],
      });
    },

    initBarChart() {
      const chartDom = this.$refs.barChart;
      if (!chartDom) return;
      if (this.barChart) this.barChart.dispose();
      this.barChart = echarts.init(chartDom);

      // Sort summary by quantity for the bar chart
      const sortedData = [...this.usageSummaryByEndpoint]
        .sort((a, b) => a.quantity - b.quantity)
        .slice(-8); // Show top 8

      this.barChart.setOption({
        tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
        grid: { left: "3%", right: "10%", bottom: "3%", top: "5%", containLabel: true },
        xAxis: { type: "value", splitLine: { show: false } },
        yAxis: {
          type: "category",
          data: sortedData.map((item) => {
            const parts = item.apiPath.split("/");
            const lastPart = parts.pop();
            const secondLastPart = parts.pop();
            const displayPart = /{.*}|:.*|\?.*=/.test(lastPart)              ? secondLastPart + "/" + lastPart
              : lastPart;
            return displayPart;

          }), // Just show the last part of path if last part is quey or params like {id} or ?id=i  do a regx to check and return last two part otherwise last part includint the regx part
          axisLabel: { fontSize: 10 },
        },
        series: [
          {
            name: "Volume",
            type: "bar",
            data: sortedData.map((item) => item.quantity),
            itemStyle: {
              color: "#6366f1",
              borderRadius: [0, 4, 4, 0],
            },
            label: { show: true, position: "right" },
          },
        ],
      });
    },

    handleDateChange() {
      this.refreshData();
    },
    handleResize() {
      this.lineChart?.resize();
      this.barChart?.resize();
    },
  },
};
</script>

<style scoped>
.overview-container {
  padding: 1.5rem;
  background-color: #f9fafb;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
}
.chart-wrapper {
  height: 320px;
  width: 100%;
  background: white;
  border-radius: 0.5rem;
  padding: 1rem;
}
.chart-canvas {
  width: 100%;
  height: 100%;
}
.usage-table-wrapper {
  background: white;
  border-radius: 0.5rem;
  overflow: hidden;
  border: 1px solid #f3f4f6;
}
.usage-table {
  width: 100%;
  border-collapse: collapse;
}
.usage-table th {
  background: #f8fafc;
  padding: 1rem;
  font-size: 0.75rem;
  text-transform: uppercase;
  color: #64748b;
  border-bottom: 1px solid #e2e8f0;
}
.usage-table td {
  padding: 1rem;
  font-size: 0.875rem;
  border-bottom: 1px solid #f1f5f9;
}
.endpoint-code {
  background: #f1f5f9;
  color: #475569;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.75rem;
}
.api-method {
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.75rem;
  font-weight: 600;
  color: #22c55e;
  background: rgba(34, 197, 94, 0.1);
  display: inline-block;
}
.api-method-get {
  color: #22c55e;
  background: rgba(34, 197, 94, 0.1);
}
.api-method-post {
  color: #3b82f6;
  background: rgba(59, 130, 246, 0.1);
}
.api-method-patch {
  color: #f59e42;
  background: rgba(245, 158, 66, 0.1);
}
.api-method-delete {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
}
.api-method-put {
  color: #a855f7;
  background: rgba(168, 85, 247, 0.1);
}
.api-method-options {
  color: #64748b;
  background: rgba(100, 116, 139, 0.1);
}
.api-method-head {
  color: #0ea5e9;
  background: rgba(14, 165, 233, 0.1);
}
.api-method-default {
  color: #6b7280;
  background: rgba(107, 114, 128, 0.1);
}
.total-row {
  background: #f8fafc;
  font-weight: 800;
}
.badge {
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  background: #e0f2fe;
  color: #0369a1;
  border-radius: 9999px;
}
.color-blue {
  color: #2563eb;
}
.skeleton-chart {
  height: 320px;
  background: #e5e7eb;
  border-radius: 0.5rem;
  animation: pulse 2s infinite;
}
@keyframes pulse {
  50% {
    opacity: 0.5;
  }
}
</style>
