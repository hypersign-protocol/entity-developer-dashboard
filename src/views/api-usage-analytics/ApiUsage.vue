<template>
    <b-container fluid class="py-3">
    <template v-if="!accessDenied">
      <header class="page-header">
        <h4 class="font-weight-bold mb-0">API Usage Analytics</h4>
        <p class="text-subtitle-2 text-muted mb-0">Monitor consumption and service costs</p>
      </header>

      <!-- Date range: presets first, custom range behind "Custom"; scopes every chart below -->
      <div class="range-bar">
        <div class="range-presets" role="radiogroup" aria-label="Date range">
          <button
            v-for="preset in rangePresets"
            :key="preset.key"
            type="button"
            role="radio"
            class="range-preset"
            :class="{ active: activePreset === preset.key }"
            :aria-checked="activePreset === preset.key ? 'true' : 'false'"
            @click="selectPreset(preset.key)"
          >{{ preset.label }}</button>
        </div>

        <div v-if="activePreset === 'custom'" class="range-custom">
          <b-form-datepicker
            v-model="customStart"
            size="sm"
            locale="en"
            placeholder="Start date"
            :max="customEnd || today"
            :date-format-options="{ year: 'numeric', month: 'short', day: 'numeric' }"
            class="range-input"
            aria-label="Start date"
            @input="applyCustomRange"
          ></b-form-datepicker>
          <span class="range-separator">to</span>
          <b-form-datepicker
            v-model="customEnd"
            size="sm"
            locale="en"
            placeholder="End date"
            :min="customStart"
            :max="today"
            :date-format-options="{ year: 'numeric', month: 'short', day: 'numeric' }"
            class="range-input"
            aria-label="End date"
            @input="applyCustomRange"
          ></b-form-datepicker>
        </div>

        <span v-else class="range-summary">{{ rangeLabel }}</span>
      </div>
    </template>

    <AccessDenied v-if="accessDenied" />
    <div v-else-if="errorMessage" style="display:flex;flex-direction:column;align-items:center;text-align:center;padding:48px 32px;background:#fef2f2;border:1px solid #fecaca;border-radius:8px;margin:16px 0">
      <v-icon size="36" color="#dc2626">mdi-alert-circle-outline</v-icon>
      <div style="font-size:18px;font-weight:700;color:#991b1b;margin:12px 0 6px">Failed to Load</div>
      <div style="font-size:13px;color:#7f1d1d">{{ errorMessage }}</div>
    </div>
    <template v-else>

    <v-row>
      <v-col cols="12" lg="7">
        <div class="overview-container h-100">
          <header class="section-header">
            <h5 class="section-title">Daily Trends</h5>
            <p class="section-subtitle">API call volume over time</p>
          </header>
          <div v-if="loading" class="skeleton-chart"></div>
          <empty-container
            v-else-if="!hasDailyData"
            class="chart-empty"
            title="No API Calls"
            icon="mdi mdi-chart-line"
            description="No API calls were made between the selected dates."
          />
          <div v-else class="chart-wrapper">
            <div ref="lineChart" class="chart-canvas"></div>
          </div>
        </div>
      </v-col>

      <v-col cols="12" lg="5">
        <div class="overview-container h-100">
          <header class="section-header">
            <h5 class="section-title">Usage by Endpoint</h5>
            <p class="section-subtitle">Top consumed services</p>
          </header>
          <div v-if="loading" class="skeleton-chart"></div>
          <empty-container
            v-else-if="!usageSummaryByEndpoint.length"
            class="chart-empty"
            title="No Endpoint Usage"
            icon="mdi mdi-chart-bar"
            description="Endpoints appear here once they receive calls in the selected period."
          />
          <div v-else class="chart-wrapper">
            <div ref="barChart" class="chart-canvas"></div>
          </div>
        </div>
      </v-col>
    </v-row>

    <v-row v-if="this.env==='prod'">
      <v-col cols="12">
        <div class="overview-container">
          <header class="section-header">
            <h5 class="section-title">API Cost Breakdown</h5>
            <p class="section-subtitle">Charges per endpoint for the selected period</p>
          </header>
          <div v-if="loading" class="loading-list p-4 text-center">
            <v-progress-linear indeterminate color="blue"></v-progress-linear>
          </div>
          <!-- No billable calls in the period: an empty table with a 0 total says nothing -->
          <empty-container
            v-else-if="!usageSummary.length"
            title="No Billable Usage"
            icon="mdi mdi-receipt-text-outline"
            description="No API calls were charged between the selected dates. Try a wider date range."
          />
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
    </template>
  </b-container>
</template>

<script>
import { mapActions } from "vuex";
import * as echarts from "echarts";
import moment from "moment";
import AccessDenied from '../AccessDenied.vue';

// One hue for both charts (both measure API calls); text uses ink tokens, never the series colour
const CHART = {
  series: "#2563eb",
  seriesHover: "#1d4ed8",
  seriesWash: "rgba(37, 99, 235, 0.1)",
  surface: "#ffffff",
  grid: "#eef2f6",
  axis: "#e2e8f0",
  textStrong: "#111827",
  textMuted: "#64748b",
};

export default {
  name: "ApiUsageAnalytics",
  components: {
    AccessDenied
  },
  data() {
    return {
      loading: false,
      accessDenied: false,
      accessDeniedMsg: '',
      errorMessage: '',
      startDate: moment().subtract(30, "days").format("YYYY-MM-DD"),
      endDate: moment().format("YYYY-MM-DD"),
      today: moment().format("YYYY-MM-DD"),
      activePreset: "30d",
      rangePresets: [
        { key: "7d", label: "Last 7 days", days: 7 },
        { key: "30d", label: "Last 30 days", days: 30 },
        { key: "90d", label: "Last 90 days", days: 90 },
        { key: "custom", label: "Custom" },
      ],
      customStart: "",
      customEnd: "",
      usageSummary: [],
      usageSummaryByEndpoint: [],
      dailyData: [],
      lineChart: null,
      barChart: null,
    };
  },

  computed: {
    rangeLabel() {
      const start = moment(this.startDate);
      const end = moment(this.endDate);
      const sameYear = start.year() === end.year();
      return `${start.format(sameYear ? "DD MMM" : "DD MMM YYYY")} – ${end.format("DD MMM YYYY")}`;
    },
    totalCalls() {
      return this.usageSummary.reduce((acc, curr) => acc + curr.quantity, 0);
    },
    totalAmount() {
      return this.usageSummary
        .reduce((acc, curr) => acc + curr.amount, 0)
        .toLocaleString();
    },
    // Any calls on any day in the period (the API can return days with 0 calls)
    hasDailyData() {
      return this.dailyData.some((service) =>
        Object.values(service.data || {}).some((count) => Number(count) > 0)
      );
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
      this.accessDenied = false;
      this.errorMessage = '';
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
        const msg = (err?.message || '').toLowerCase();
        if (
          msg.includes('permission denied') ||
          msg.includes('forbidden') ||
          msg.includes('access denied') ||
          msg.includes('not authorized') ||
          msg.includes('unauthorized') ||
          msg.includes('an unknown error occurred') ||
          err instanceof TypeError
        ) {
          this.accessDenied = true;
          this.accessDeniedMsg = 'You don\'t have permission to view API usage data.';
        } else {
          this.errorMessage = err.message || 'Failed to load API usage data.';
        }
      } finally {
        this.loading = false;
      }
    },

    initLineChart() {
      const chartDom = this.$refs.lineChart;
      if (this.lineChart) this.lineChart.dispose();
      this.lineChart = null;
      if (!chartDom) return; // empty state is showing instead
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

      const base = this.chartBase();
      this.lineChart.setOption({
        textStyle: base.textStyle,
        tooltip: {
          ...base.tooltip,
          trigger: "axis",
          // Crosshair finds the date; the reader never has to hit the 2px line
          axisPointer: { type: "line", lineStyle: { color: CHART.axis, width: 1 } },
          formatter: (points) => {
            const point = points[0];
            return this.tooltipHtml(
              this.formatNumber(point.value),
              point.value === 1 ? "call" : "calls",
              moment(point.axisValue).format("ddd, DD MMM YYYY")
            );
          },
        },
        grid: { left: 8, right: 16, top: 12, bottom: 4, containLabel: true },
        xAxis: {
          type: "category",
          data: sortedDates,
          boundaryGap: false,
          axisLine: { lineStyle: { color: CHART.axis } },
          axisTick: { show: false },
          axisLabel: {
            ...base.axisLabel,
            hideOverlap: true,
            formatter: (val) => moment(val).format("DD MMM"),
          },
        },
        yAxis: {
          type: "value",
          minInterval: 1,
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: { ...base.axisLabel, formatter: (val) => this.compactNumber(val) },
          splitLine: base.splitLine,
        },
        series: [
          {
            name: "API calls",
            type: "line",
            // Straight segments: daily counts are discrete, smoothing invents values between days
            smooth: false,
            data: seriesData,
            showSymbol: false,
            symbol: "circle",
            symbolSize: 8,
            lineStyle: { width: 2, color: CHART.series, cap: "round", join: "round" },
            itemStyle: { color: CHART.series, borderColor: CHART.surface, borderWidth: 2 },
            areaStyle: { color: CHART.seriesWash },
            emphasis: { focus: "none", scale: false },
          },
        ],
      });
    },

    initBarChart() {
      const chartDom = this.$refs.barChart;
      if (this.barChart) this.barChart.dispose();
      this.barChart = null;
      if (!chartDom) return; // empty state is showing instead
      this.barChart = echarts.init(chartDom);

      // Sort summary by quantity for the bar chart
      const sortedData = [...this.usageSummaryByEndpoint]
        .sort((a, b) => a.quantity - b.quantity)
        .slice(-8); // Show top 8

      const base = this.chartBase();
      this.barChart.setOption({
        textStyle: base.textStyle,
        tooltip: {
          ...base.tooltip,
          trigger: "item",
          formatter: (params) => {
            const item = sortedData[params.dataIndex];
            return this.tooltipHtml(
              this.formatNumber(item.quantity),
              item.quantity === 1 ? "call" : "calls",
              item.apiPath
            );
          },
        },
        grid: { left: 8, right: 48, top: 4, bottom: 4, containLabel: true },
        xAxis: { type: "value", show: false },
        yAxis: {
          type: "category",
          data: sortedData.map((item) => this.endpointLabel(item.apiPath)),
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: { ...base.axisLabel, width: 140, overflow: "truncate" },
        },
        series: [
          {
            name: "API calls",
            type: "bar",
            data: sortedData.map((item) => item.quantity),
            barMaxWidth: 20,
            itemStyle: { color: CHART.series, borderRadius: [0, 4, 4, 0] },
            emphasis: { itemStyle: { color: CHART.seriesHover } },
            // Value at the bar tip, in text ink rather than the series colour
            label: {
              show: true,
              position: "right",
              color: CHART.textStrong,
              fontSize: 11,
              fontWeight: 600,
              formatter: (params) => this.compactNumber(params.value),
            },
          },
        ],
      });
    },

    // Shared look for both charts: dashboard font, muted axis text, hairline grid, light tooltip
    chartBase() {
      const fontFamily = getComputedStyle(document.body).fontFamily;
      return {
        textStyle: { fontFamily },
        axisLabel: { color: CHART.textMuted, fontSize: 11 },
        splitLine: { lineStyle: { color: CHART.grid, width: 1, type: "solid" } },
        tooltip: {
          backgroundColor: "#ffffff",
          borderColor: CHART.axis,
          borderWidth: 1,
          padding: [8, 12],
          extraCssText: "box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08); border-radius: 8px;",
          textStyle: { fontFamily, color: CHART.textStrong },
        },
      };
    },

    // Value first (strong), label after; endpoint paths come from the API, so escape them
    tooltipHtml(value, unit, label) {
      const key = `<span style="display:inline-block;width:10px;height:2px;background:${CHART.series};vertical-align:middle;margin-right:6px"></span>`;
      return `<div style="font-size:12px;color:${CHART.textMuted};margin-bottom:2px;max-width:320px;word-break:break-all">${this.escapeHtml(label)}</div>`
        + `<div>${key}<strong style="font-size:14px;color:${CHART.textStrong}">${value}</strong> <span style="color:${CHART.textMuted}">${unit}</span></div>`;
    },

    escapeHtml(text) {
      return String(text == null ? "" : text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
    },

    compactNumber(value) {
      return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(value || 0);
    },

    // Last path segment, or the last two when the last one is a param ({id}, :id, ?x=)
    endpointLabel(apiPath) {
      const parts = (apiPath || "").split("/").filter(Boolean);
      const last = parts.pop() || apiPath;
      const previous = parts.pop();
      return /{.*}|:.*|\?.*=/.test(last) && previous ? `${previous}/${last}` : last;
    },

    selectPreset(key) {
      this.activePreset = key;
      if (key === "custom") {
        // Start the custom pickers from the range currently shown
        this.customStart = this.startDate;
        this.customEnd = this.endDate;
        return;
      }
      const preset = this.rangePresets.find((item) => item.key === key);
      this.setRange(moment().subtract(preset.days, "days").format("YYYY-MM-DD"), this.today);
    },

    // Only reload once both ends are set and in order (the pickers' min/max also enforce this)
    applyCustomRange() {
      if (!this.customStart || !this.customEnd) return;
      if (moment(this.customStart).isAfter(this.customEnd)) return;
      this.setRange(this.customStart, this.customEnd);
    },

    setRange(start, end) {
      if (start === this.startDate && end === this.endDate) return;
      this.startDate = start;
      this.endDate = end;
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
.py-3 {
  width: 80vw !important;
}
.page-header {
  margin-bottom: 16px;
}

/* Date range bar */
.range-bar {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 10px 16px;
  margin-bottom: 28px;
}
.range-presets {
  background: #f1f5f9;
  border-radius: 8px;
  display: inline-flex;
  gap: 2px;
  padding: 3px;
}
.range-preset {
  background: transparent;
  border: 0;
  border-radius: 6px;
  color: #64748b;
  font-size: 12px;
  font-weight: 600;
  padding: 6px 12px;
  white-space: nowrap;
}
.range-preset:hover:not(.active) {
  color: #111827;
}
.range-preset.active {
  background: #ffffff;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.12);
  color: #111827;
}
.range-preset:focus {
  outline: none;
}
.range-preset:focus-visible {
  box-shadow: 0 0 0 2px #bfdbfe;
}
.range-custom {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.range-input {
  width: 170px;
}
.range-separator {
  color: #64748b;
  font-size: 12px;
}
.range-summary {
  color: #64748b;
  font-size: 13px;
}
.overview-container {
  padding: 1.5rem;
  background-color: #f9fafb;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  margin-top: -0.85rem;
}
/* Section headings follow the dashboard's card headings (not Vuetify's global .title) */
.section-header {
  margin-bottom: 14px;
}
.section-title {
  color: #111827;
  font-size: 0.95rem;
  font-weight: 700;
  line-height: 1.3;
  margin: 0;
}
.section-subtitle {
  color: #64748b;
  font-size: 0.8125rem;
  margin: 2px 0 0;
}
.chart-wrapper {
  height: 320px;
  width: 100%;
  background: white;
  border-radius: 0.5rem;
  padding: 1rem;
}
/* Same height as a chart so the two cards stay level */
.overview-container .chart-empty {
  height: 320px;
  margin-top: 0;
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
