<template>
  <div class="tx-page">
    <header class="tx-header">
      <h1>
        API Transactions
      </h1>
      <p>Every API call your app made, with its status, latency and what happened. Kept for {{ retentionDays }} days.</p>
    </header>

    <!-- Date range (same control as the API Usage page) -->
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
      <span class="range-summary">{{ rangeLabel }}</span>
    </div>

    <!-- Calls per day (or hour), split by status -->
    <section class="tx-card activity-card">
      <div class="tx-stats">
        <div v-for="stat in stats" :key="stat.key" class="tx-stat" :class="`tone-${stat.key}`">
          <span class="stat-label"><span v-if="stat.key !== 'all'" class="stat-swatch" aria-hidden="true"></span>{{ stat.label }}</span>
          <span class="stat-value">
            <v-progress-circular v-if="loadingSummary" indeterminate color="primary" size="16" width="2"></v-progress-circular>
            <template v-else>{{ formatCount(stat.count) }}</template>
            <small v-if="!loadingSummary && stat.key !== 'all'">{{ percent(stat.count) }}</small>
          </span>
          <span v-if="stat.key === 'all'" class="stat-scope" :class="{ picked: selectedBucket }">{{ scopeLabel }}</span>
        </div>
      </div>

      <div class="activity-body">
        <div class="activity-head">
          <h2>{{ hourly ? 'API calls per hour' : 'API calls per day' }}</h2>
          <span v-if="hasCalls" class="activity-hint">Click a bar to see that {{ hourly ? "hour's" : "day's" }} calls</span>
        </div>
        <SectionLoader v-if="loadingSummary && !summary" label="Loading API calls" min-height="260px" />
        <empty-container
          v-else-if="!hasCalls"
          title="No API Calls"
          icon="mdi mdi-chart-bar"
          description="No API calls were made between the selected dates."
        />
        <div v-show="hasCalls" ref="chart" class="activity-chart"></div>
      </div>
    </section>

    <div class="tx-layout" :class="{ 'has-detail': showDetail }">
      <section class="tx-card tx-tabs-card">
        <div class="tx-tabs-bar">
          <nav class="tx-tabs" role="tablist" aria-label="API transaction views">
            <button
              v-for="tab in tabs"
              :key="tab.key"
              type="button"
              role="tab"
              class="tx-tab"
              :class="{ active: activeTab === tab.key }"
              :aria-selected="activeTab === tab.key ? 'true' : 'false'"
              @click="activeTab = tab.key"
            >{{ tab.label }}</button>
          </nav>
          <span v-if="selectedBucket" class="bucket-chip">
            {{ bucketLabel(selectedBucket) }}
            <button type="button" aria-label="Show the whole period" title="Show the whole period" @click="selectBucket(null)">
              <i class="mdi mdi-close" aria-hidden="true"></i>
            </button>
          </span>
        </div>

        <!-- Every call, newest first -->
        <div v-show="activeTab === 'transactions'" role="tabpanel">
          <SectionLoader v-if="loadingList && !items.length" label="Loading transactions" />
          <empty-container
            class="tab-empty"
            v-else-if="!items.length"
            title="No API Calls"
            icon="mdi mdi-swap-horizontal"
            :description="selectedBucket ? 'No API calls were made in this period.' : 'No API calls were made between the selected dates.'"
          />
          <template v-else>
            <div class="tx-table-wrap">
              <table class="tx-table">
                <thead>
                  <tr>
                    <th scope="col">Time</th>
                    <th scope="col">Status</th>
                    <th scope="col">Endpoint</th>
                    <th scope="col" class="text-right">Latency</th>
                    <th scope="col"><span class="sr-only">Open</span></th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="item in items"
                    :key="item.id"
                    class="clickable"
                    :class="{ selected: item.id === selectedId }"
                    tabindex="0"
                    @click="openDetail(item)"
                    @keydown.enter="openDetail(item)"
                  >
                    <td class="tx-time" :title="item.createdAt">{{ formatTime(item.createdAt) }}</td>
                    <td><span class="status-pill" :class="`tone-${statusClass(item.statusCode)}`">{{ formatStatus(item.statusCode) }}</span></td>
                    <td class="tx-endpoint">
                      <span class="method" :class="methodClass(item.method)">{{ item.method || '—' }}</span>
                      <code :title="item.route">{{ item.route }}</code>
                    </td>
                    <td class="text-right num" :class="{ slow: item.durationMs >= 3000 }">{{ formatDuration(item.durationMs) }}</td>
                    <td class="tx-chevron"><i class="mdi mdi-chevron-right" aria-hidden="true"></i></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <footer class="tx-list-footer">
              <span>Showing {{ items.length }} {{ items.length === 1 ? 'call' : 'calls' }}</span>
              <button v-if="nextCursor" type="button" class="load-more" :disabled="loadingList" @click="loadMore">
                {{ loadingList ? 'Loading…' : 'Load more' }}
              </button>
            </footer>
          </template>
        </div>

        <!-- Per-endpoint breakdown for the whole period -->
        <div v-show="activeTab === 'endpoints'" role="tabpanel">
          <SectionLoader v-if="(loadingSummary || loadingBucketSummary) && !endpoints.length" label="Loading endpoints" />
          <empty-container
            class="tab-empty"
            v-else-if="!endpoints.length"
            title="No API Calls"
            icon="mdi mdi-api"
            :description="selectedBucket ? 'No API calls were made in this period.' : 'No API calls were made between the selected dates.'"
          />
          <div v-else class="tx-table-wrap" :class="{ refreshing: loadingBucketSummary }">
            <table class="tx-table endpoint-table">
              <thead>
                <tr>
                  <th scope="col">Endpoint</th>
                  <th scope="col" class="text-right">Calls</th>
                  <th scope="col" class="text-right">2xx</th>
                  <th scope="col" class="text-right">4xx</th>
                  <th scope="col" class="text-right">5xx</th>
                  <th scope="col" class="text-right">Avg latency</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="endpoint in endpoints" :key="`${endpoint.method} ${endpoint.route}`">
                  <td class="tx-endpoint">
                    <span class="method" :class="methodClass(endpoint.method)">{{ endpoint.method || '—' }}</span>
                    <code :title="endpoint.route">{{ endpoint.route }}</code>
                  </td>
                  <td class="text-right num strong">{{ formatCount(endpoint.total) }}</td>
                  <td class="text-right num">{{ formatCount(endpoint['2xx']) }}</td>
                  <td class="text-right num" :class="{ 'count-4xx': endpoint['4xx'] }">{{ formatCount(endpoint['4xx']) }}</td>
                  <td class="text-right num" :class="{ 'count-5xx': endpoint['5xx'] }">{{ formatCount(endpoint['5xx']) }}</td>
                  <td class="text-right num" :class="{ slow: endpoint.avgDurationMs >= 3000 }">{{ formatDuration(endpoint.avgDurationMs) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- Transaction detail -->
      <aside v-if="showDetail" class="tx-detail" aria-label="Transaction details">
        <header class="detail-head">
          <h2>API request</h2>
          <button type="button" class="icon-btn" aria-label="Close details" @click="closeDetail"><i class="mdi mdi-close" aria-hidden="true"></i></button>
        </header>

        <SectionLoader v-if="loadingDetail" label="Loading transaction" min-height="200px" />
        <p v-else-if="detailError" class="detail-error">{{ detailError }}</p>
        <template v-else-if="detail">
          <div class="detail-title">
            <div>
              <span class="method" :class="methodClass(detail.method)">{{ detail.method || '—' }}</span>
              <code class="detail-route">{{ detail.route }}</code>
              <p class="detail-time">{{ formatFullTime(detail.createdAt) }}</p>
            </div>
            <span class="status-pill large" :class="`tone-${statusClass(detail.statusCode)}`">{{ formatStatus(detail.statusCode) }}</span>
          </div>

          <!-- What happened -->
          <div class="detail-outcome" :class="`tone-${statusClass(detail.statusCode)}`">
            <i class="mdi" :class="outcomeIcon(detail.statusCode)" aria-hidden="true"></i>
            <div>
              <strong>{{ outcomeTitle(detail.statusCode) }}</strong>
              <p v-if="detail.errorMessage">{{ detail.errorMessage }}</p>
            </div>
          </div>

          <dl class="detail-list">
            <div>
              <dt>Transaction ID</dt>
              <dd class="mono copyable">
                <span :title="detail.id">{{ detail.id }}</span>
                <button type="button" title="Copy transaction ID" @click="copyToClip(detail.id, 'Transaction ID')"><i class="mdi mdi-content-copy" aria-hidden="true"></i></button>
              </dd>
            </div>
            <!-- x-request-id the caller sent (or one we generated); missing on very old logs -->
            <div v-if="detail.requestId">
              <dt>Request ID</dt>
              <dd class="mono copyable">
                <span :title="detail.requestId">{{ detail.requestId }}</span>
                <button type="button" title="Copy request ID" @click="copyToClip(detail.requestId, 'Request ID')"><i class="mdi mdi-content-copy" aria-hidden="true"></i></button>
              </dd>
            </div>
            <div><dt>Environment</dt><dd>{{ detail.env === 'prod' ? 'Production' : 'Development' }}</dd></div>
            <div><dt>Latency</dt><dd :class="{ slow: detail.durationMs >= 3000 }">{{ formatDuration(detail.durationMs) }}</dd></div>
            <div><dt>IP address</dt><dd class="mono">{{ detail.ip || '—' }}</dd></div>
            <div><dt>User agent</dt><dd class="wrap">{{ detail.userAgent || '—' }}</dd></div>
            <div v-if="detail.path && detail.path !== detail.route"><dt>Path</dt><dd class="mono wrap">{{ detail.path }}</dd></div>
          </dl>

          <p class="detail-privacy">
            <i class="mdi mdi-lock-outline" aria-hidden="true"></i>
            Request headers and bodies aren't stored, to protect your users' data.
          </p>
        </template>
      </aside>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import moment from 'moment';
import UtilsMixin from '../../mixins/utils';
import SectionLoader from '../../components/element/SectionLoader.vue';
import {
  RETENTION_DAYS,
  fetchTransaction,
  fetchTransactionSummary,
  fetchTransactions,
  statusClass,
} from '../../utils/apiTransactions';

const PAGE_SIZE = 25;
const STATUS_GROUPS = ['2xx', '4xx', '5xx'];

// One blue ramp, light to dark as the status gets more serious (checked with the dataviz
// palette validator: monotone lightness, single hue, light end clears the white surface).
// The middle step is the dashboard's primary blue.
const CHART = {
  '2xx': '#86b6ef',
  '4xx': '#2563eb',
  '5xx': '#1e3a8a',
  grid: '#eef2f6',
  axis: '#e2e8f0',
  textMuted: '#64748b',
  textStrong: '#111827',
};

export default {
  name: 'ApiTransactions',
  components: { SectionLoader },
  mixins: [UtilsMixin],
  data() {
    return {
      retentionDays: RETENTION_DAYS,
      rangePresets: [
        { key: '24h', label: 'Last 24 hours' },
        { key: '7d', label: 'Last 7 days', days: 7 },
        { key: '30d', label: 'Last 30 days', days: 30 },
        { key: '90d', label: 'Last 90 days', days: 90 },
      ],
      activePreset: '7d',
      range: { from: '', to: '' },
      // A bar picked on the chart ('YYYY-MM-DD' or 'YYYY-MM-DDTHH:00'); narrows the list to it
      selectedBucket: null,
      tabs: [
        { key: 'transactions', label: 'Transactions' },
        { key: 'endpoints', label: 'Endpoints' },
      ],
      activeTab: 'transactions',
      summary: null,
      // Summary of just the picked bar, for the Endpoints tab
      bucketSummary: null,
      loadingBucketSummary: false,
      bucketToken: 0,
      loadingSummary: false,
      items: [],
      nextCursor: null,
      loadingList: false,
      detail: null,
      loadingDetail: false,
      detailError: '',
      requestToken: 0,
      chart: null,
    };
  },
  computed: {
    appId() {
      return this.$route.params.appId;
    },
    env() {
      const service = this.$store.getters['mainStore/getSelectedService'];
      return service && service.env === 'prod' ? 'prod' : 'dev';
    },
    hourly() {
      return this.activePreset === '24h';
    },
    selectedId() {
      return this.$route.query.txn || '';
    },
    // The detail panel belongs to the Transactions tab
    showDetail() {
      return Boolean(this.selectedId) && this.activeTab === 'transactions';
    },
    totals() {
      return (this.summary && this.summary.totals) || { total: 0, '2xx': 0, '4xx': 0, '5xx': 0 };
    },
    hasCalls() {
      return this.totals.total > 0;
    },
    // Totals for the picked bar (straight from the chart data), else the whole period
    scopeTotals() {
      const bucket = this.selectedBucket && this.buckets.find(row => row.bucket === this.selectedBucket);
      if (!bucket) return this.totals;
      return { total: bucket['2xx'] + bucket['4xx'] + bucket['5xx'], '2xx': bucket['2xx'], '4xx': bucket['4xx'], '5xx': bucket['5xx'] };
    },
    scopeLabel() {
      if (this.selectedBucket) return this.bucketLabel(this.selectedBucket);
      const preset = this.rangePresets.find(item => item.key === this.activePreset);
      return preset ? `in the ${preset.label.toLowerCase()}` : '';
    },
    stats() {
      const totals = this.scopeTotals;
      return [
        { key: 'all', label: 'API calls', count: totals.total },
        { key: '2xx', label: '2xx Success', count: totals['2xx'] },
        { key: '4xx', label: '4xx Client errors', count: totals['4xx'] },
        { key: '5xx', label: '5xx Server errors', count: totals['5xx'] },
      ];
    },
    endpoints() {
      const summary = this.selectedBucket ? this.bucketSummary : this.summary;
      return (summary && summary.endpoints) || [];
    },
    // Time span of the picked bar
    bucketRange() {
      if (!this.selectedBucket) return null;
      const start = moment(this.selectedBucket);
      return { startDate: start.toISOString(), endDate: start.clone().endOf(this.hourly ? 'hour' : 'day').toISOString() };
    },
    // Every day (or hour) in the range, including ones without calls, so gaps show as gaps
    buckets() {
      if (!this.range.from) return [];
      const unit = this.hourly ? 'hour' : 'day';
      const format = this.hourly ? 'YYYY-MM-DDTHH:00' : 'YYYY-MM-DD';
      const byBucket = new Map(((this.summary && this.summary.series) || []).map(row => [row.bucket, row]));
      const buckets = [];
      for (let cursor = moment(this.range.from).startOf(unit); !cursor.isAfter(this.range.to); cursor.add(1, unit)) {
        const key = cursor.format(format);
        const row = byBucket.get(key) || {};
        buckets.push({ bucket: key, '2xx': row['2xx'] || 0, '4xx': row['4xx'] || 0, '5xx': row['5xx'] || 0 });
      }
      return buckets;
    },
    rangeLabel() {
      if (!this.range.from) return '';
      const format = this.hourly ? 'D MMM, HH:mm' : 'D MMM YYYY';
      return `${moment(this.range.from).format(format)} – ${moment(this.range.to).format(format)}`;
    },
    listParams() {
      // Same parameter names as the API Usage endpoints
      return { ...(this.bucketRange || { startDate: this.range.from, endDate: this.range.to }), env: this.env };
    },
  },
  watch: {
    selectedId: {
      immediate: true,
      handler(id) {
        if (id) this.loadDetail(id);
        else this.detail = null;
      },
    },
  },
  mounted() {
    this.selectPreset(this.activePreset);
    window.addEventListener('keydown', this.onKeydown);
    window.addEventListener('resize', this.resizeChart);
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.onKeydown);
    window.removeEventListener('resize', this.resizeChart);
    if (this.chart) this.chart.dispose();
  },
  methods: {
    statusClass,

    selectPreset(key) {
      const preset = this.rangePresets.find(item => item.key === key);
      const now = moment();
      this.activePreset = key;
      // Whole days for the daily views, so the first bar isn't a partial day
      const from = preset.days ? now.clone().subtract(preset.days - 1, 'days').startOf('day') : now.clone().subtract(24, 'hours');
      this.range = { from: from.toISOString(), to: now.toISOString() };
      this.selectedBucket = null;
      this.bucketSummary = null;
      this.bucketToken += 1;
      this.loadingBucketSummary = false;
      this.loadSummary();
      this.reloadList();
    },

    async loadSummary() {
      this.loadingSummary = true;
      try {
        this.summary = await fetchTransactionSummary(this.$store, {
          startDate: this.range.from,
          endDate: this.range.to,
          env: this.env,
          interval: this.hourly ? 'hour' : 'day',
          tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
        });
      } catch (error) {
        this.notifyErr(error.message || 'Could not load the API call summary.');
      } finally {
        this.loadingSummary = false;
        this.$nextTick(this.renderChart);
      }
    },

    // Stacked bars: 2xx at the bottom, errors on top where they catch the eye
    renderChart() {
      const element = this.$refs.chart;
      if (!element || !this.hasCalls) return;
      if (!this.chart) {
        this.chart = echarts.init(element);
        this.chart.on('click', params => this.selectBucket(this.buckets[params.dataIndex].bucket));
      }
      const fontFamily = getComputedStyle(document.body).fontFamily;
      // The chart was hidden while a range had no calls; pick up its current size
      this.chart.resize();
      const buckets = this.buckets;
      const dim = bucket => this.selectedBucket && bucket.bucket !== this.selectedBucket;
      this.chart.setOption({
        textStyle: { fontFamily },
        animationDuration: 300,
        grid: { left: 8, right: 8, top: 12, bottom: 4, containLabel: true },
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow', shadowStyle: { color: 'rgba(148, 163, 184, 0.12)' } },
          backgroundColor: '#ffffff',
          borderColor: CHART.axis,
          borderWidth: 1,
          padding: [8, 12],
          extraCssText: 'box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08); border-radius: 8px;',
          textStyle: { fontFamily, color: CHART.textStrong },
          formatter: points => this.tooltipHtml(buckets[points[0].dataIndex]),
        },
        xAxis: {
          type: 'category',
          data: buckets.map(bucket => bucket.bucket),
          axisLine: { lineStyle: { color: CHART.axis } },
          axisTick: { show: false },
          axisLabel: {
            color: CHART.textMuted,
            fontSize: 11,
            hideOverlap: true,
            formatter: value => moment(value).format(this.hourly ? 'HH:mm' : 'D MMM'),
          },
        },
        yAxis: {
          type: 'value',
          minInterval: 1,
          axisLabel: { color: CHART.textMuted, fontSize: 11 },
          splitLine: { lineStyle: { color: CHART.grid } },
        },
        series: STATUS_GROUPS.map(group => ({
          name: group,
          type: 'bar',
          stack: 'calls',
          barMaxWidth: 40,
          cursor: 'pointer',
          // White seam between stacked segments keeps neighbouring shades apart
          itemStyle: { color: CHART[group], borderColor: '#ffffff', borderWidth: 1 },
          emphasis: { disabled: true },
          data: buckets.map(bucket => ({ value: bucket[group], itemStyle: { opacity: dim(bucket) ? 0.3 : 1 } })),
        })),
      }, true);
    },

    resizeChart() {
      if (this.chart) this.chart.resize();
    },

    tooltipHtml(bucket) {
      const total = STATUS_GROUPS.reduce((sum, group) => sum + bucket[group], 0);
      const rows = STATUS_GROUPS.map(group =>
        `<div style="display:flex;align-items:center;gap:8px;justify-content:space-between;min-width:140px">`
        + `<span><span style="display:inline-block;width:8px;height:8px;border-radius:2px;background:${CHART[group]};margin-right:6px"></span>${group}</span>`
        + `<strong>${this.formatCount(bucket[group])}</strong></div>`
      ).join('');
      return `<div style="font-size:12px;color:${CHART.textMuted};margin-bottom:4px">${this.bucketLabel(bucket.bucket)}</div>`
        + `<div style="font-size:14px;font-weight:700;margin-bottom:4px">${this.formatCount(total)} ${total === 1 ? 'call' : 'calls'}</div>`
        + `<div style="font-size:12px">${rows}</div>`;
    },

    bucketLabel(bucket) {
      const start = moment(bucket);
      if (!this.hourly) return start.format('ddd, D MMM YYYY');
      return `${start.format('D MMM, HH:mm')}–${start.clone().add(1, 'hour').format('HH:mm')}`;
    },

    // Clicking the selected bar again (or the chip's ×) shows the whole period
    selectBucket(bucket) {
      this.selectedBucket = bucket && bucket !== this.selectedBucket ? bucket : null;
      this.bucketSummary = null;
      this.renderChart();
      this.reloadList();
      if (this.selectedBucket) this.loadBucketSummary();
    },

    async loadBucketSummary() {
      // Ignore a response for a bar that's no longer picked
      const token = ++this.bucketToken;
      this.loadingBucketSummary = true;
      try {
        const summary = await fetchTransactionSummary(this.$store, {
          ...this.listParams,
          interval: this.hourly ? 'hour' : 'day',
          tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
        });
        if (token === this.bucketToken) this.bucketSummary = summary;
      } catch (error) {
        if (token === this.bucketToken) this.notifyErr(error.message || 'Could not load the endpoint summary.');
      } finally {
        if (token === this.bucketToken) this.loadingBucketSummary = false;
      }
    },

    reloadList() {
      this.items = [];
      this.nextCursor = null;
      this.loadPage();
    },

    loadMore() {
      if (this.nextCursor) this.loadPage(this.nextCursor);
    },

    async loadPage(cursor) {
      // Ignore responses that arrive after the range changed again
      const token = ++this.requestToken;
      this.loadingList = true;
      try {
        const page = await fetchTransactions(this.$store, { ...this.listParams, cursor, limit: PAGE_SIZE });
        if (token !== this.requestToken) return;
        this.items = cursor ? [...this.items, ...page.items] : page.items;
        this.nextCursor = page.nextCursor;
      } catch (error) {
        if (token === this.requestToken) this.notifyErr(error.message || 'Could not load API transactions.');
      } finally {
        if (token === this.requestToken) this.loadingList = false;
      }
    },

    // Selected transaction lives in the URL (?txn=) so a call can be shared or bookmarked
    openDetail(item) {
      if (this.selectedId === item.id) return;
      this.$router.replace({ query: { ...this.$route.query, txn: item.id } }).catch(() => {});
    },

    closeDetail() {
      const query = { ...this.$route.query };
      delete query.txn;
      this.$router.replace({ query }).catch(() => {});
    },

    onKeydown(event) {
      if (event.key === 'Escape' && this.selectedId) this.closeDetail();
    },

    async loadDetail(id) {
      this.loadingDetail = true;
      this.detailError = '';
      try {
        // Use the row we already have; fetch only when opened from a link
        this.detail = this.items.find(item => item.id === id) || await fetchTransaction(this.$store, id);
      } catch (error) {
        this.detail = null;
        this.detailError = error.message || 'Could not load this transaction.';
      } finally {
        this.loadingDetail = false;
      }
    },

    outcomeTitle(code) {
      const group = statusClass(code);
      if (group === 'none') return 'Status not recorded';
      if (group === '2xx') return 'Completed successfully';
      if (group === '4xx') return 'Rejected: problem with the request';
      return 'Failed: server or provider error';
    },

    outcomeIcon(code) {
      return { '2xx': 'mdi-check-circle', '4xx': 'mdi-alert-circle-outline', '5xx': 'mdi-close-circle', none: 'mdi-help-circle-outline' }[statusClass(code)];
    },

    // Very old logs can be missing the method or status code
    methodClass(method) {
      return method ? `method-${method.toLowerCase()}` : '';
    },

    formatStatus(code) {
      return typeof code === 'number' ? code : '—';
    },

    percent(count) {
      const total = this.scopeTotals.total;
      if (!total) return '0%';
      return `${((count / total) * 100).toFixed(1)}%`;
    },

    formatCount(value) {
      return Number(value || 0).toLocaleString();
    },

    formatDuration(ms) {
      if (ms === null || ms === undefined) return '—';
      return ms >= 1000 ? `${(ms / 1000).toFixed(ms >= 10000 ? 0 : 1)} s` : `${ms} ms`;
    },

    formatTime(iso) {
      return new Date(iso).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', second: '2-digit' });
    },

    formatFullTime(iso) {
      const date = new Date(iso);
      return `${date.toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })}.${String(date.getMilliseconds()).padStart(3, '0')}`;
    },
  },
};
</script>

<style scoped>
.tx-page { color: #172554; padding: 16px 15px 64px; }

.tx-header { margin-bottom: 16px; }
.tx-header h1 { align-items: center; color: #111827; display: flex; font-size: 24px; font-weight: 700; gap: 10px; margin: 0 0 4px; }
.tx-header p { color: #718198; font-size: 13px; margin: 0; }

/* Date range (same as the API Usage page) */
.range-bar { align-items: center; display: flex; flex-wrap: wrap; gap: 10px 16px; margin-bottom: 18px; }
.range-presets { background: #f1f5f9; border-radius: 8px; display: inline-flex; gap: 2px; padding: 3px; }
.range-preset { background: transparent; border: 0; border-radius: 6px; color: #64748b; font-size: 12px; font-weight: 600; padding: 6px 12px; white-space: nowrap; }
.range-preset:hover:not(.active) { color: #111827; }
.range-preset.active { background: #fff; box-shadow: 0 1px 2px rgba(15, 23, 42, 0.12); color: #111827; }
.range-summary { color: #64748b; font-size: 13px; }

/* Cards */
.tx-card { background: #fff; border: 1px solid #dbe3ef; border-radius: 10px; margin-bottom: 16px; min-width: 0; overflow: hidden; }
.activity-head h2 { color: #111827; font-size: 14px; font-weight: 700; margin: 0; }

/* Stats along the top of the chart card; the swatches double as the chart legend */
.tx-stats { border-bottom: 1px solid #eef2f6; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); }
.tx-stat { display: flex; flex-direction: column; gap: 6px; padding: 14px 18px; }
.tx-stat + .tx-stat { border-left: 1px solid #eef2f6; }
.stat-label { align-items: center; color: #7180a5; display: inline-flex; font-size: 12px; gap: 6px; }
.stat-swatch { border-radius: 2px; height: 9px; width: 9px; }
.tone-2xx .stat-swatch { background: #86b6ef; }
.tone-4xx .stat-swatch { background: #2563eb; }
.tone-5xx .stat-swatch { background: #1e3a8a; }
.stat-value { align-items: baseline; color: #111827; display: flex; font-size: 24px; font-weight: 700; gap: 6px; min-height: 30px; }
.stat-value small { color: #64748b; font-size: 12px; font-weight: 600; }
.stat-scope { color: #94a3b8; font-size: 11px; }
.stat-scope.picked { color: #1d4ed8; font-weight: 600; }
.refreshing { opacity: 0.5; transition: opacity 0.15s ease; }

.activity-body { padding: 14px 16px 12px; }
.activity-head { align-items: baseline; display: flex; flex-wrap: wrap; gap: 4px 12px; justify-content: space-between; margin-bottom: 8px; }
.activity-hint { color: #94a3b8; font-size: 12px; }
.activity-chart { height: 280px; width: 100%; }

/* Tabs (same as the KYB widget configuration page) */
.tx-tabs-bar { align-items: center; border-bottom: 1px solid #e5e7eb; display: flex; gap: 12px; justify-content: space-between; padding: 0 18px; }
.tx-tabs { display: flex; gap: 28px; overflow-x: auto; }
.tx-tab { background: transparent; border: 0; border-bottom: 2px solid transparent; color: #64748b; cursor: pointer; font-size: 13px; padding: 14px 2px 12px; white-space: nowrap; }
.tx-tab.active { border-bottom-color: #2563eb; color: #2563eb; font-weight: 600; }
.tx-tab:focus { outline: none; }
.tx-tab:focus-visible { border-radius: 4px; box-shadow: 0 0 0 2px #bfdbfe; }

/* Tab panels have no padding of their own, so inset the empty state from the card edges */
.tx-tabs-card .tab-empty { margin: 16px; width: auto; }

/* Tables */
.tx-table-wrap { overflow-x: auto; }
.tx-table { border-collapse: collapse; width: 100%; }
.tx-table th {
  background: #f8fafc;
  border-bottom: 1px solid #e5e7eb;
  color: #64748b;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.05em;
  padding: 10px 14px;
  text-align: left;
  text-transform: uppercase;
  white-space: nowrap;
}
.tx-table td { border-bottom: 1px solid #f1f5f9; color: #1f2937; font-size: 13px; padding: 10px 14px; vertical-align: middle; }
.tx-table tbody tr:last-child td { border-bottom: 0; }
.tx-table tbody tr.clickable { cursor: pointer; transition: background-color 0.1s ease; }
.tx-table tbody tr.clickable:hover { background: #f8fafc; }
.tx-table tbody tr.selected { background: #eff6ff; }
.tx-table tbody tr:focus { outline: none; }
.tx-table tbody tr:focus-visible { box-shadow: inset 0 0 0 2px #bfdbfe; }
.tx-table th.text-right { text-align: right; }
.tx-time { color: #475569 !important; font-variant-numeric: tabular-nums; white-space: nowrap; }
.tx-endpoint { align-items: center; display: flex; gap: 8px; max-width: 560px; min-width: 0; }
.tx-endpoint code { background: none; color: #344054; font-size: 12px; overflow: hidden; padding: 0; text-overflow: ellipsis; white-space: nowrap; }
.num { color: #475569 !important; font-variant-numeric: tabular-nums; white-space: nowrap; }
.num.strong { color: #111827 !important; font-weight: 700; }
.count-4xx { color: #1d4ed8 !important; font-weight: 600; }
.count-5xx { color: #1e3a8a !important; font-weight: 700; }
.slow { color: #1e3a8a !important; font-weight: 600; }
.tx-chevron { color: #94a3b8 !important; width: 28px; }
.text-right { text-align: right; }

.status-pill { border-radius: 5px; display: inline-block; font-size: 12px; font-variant-numeric: tabular-nums; font-weight: 700; min-width: 42px; padding: 2px 7px; text-align: center; }
.status-pill.large { font-size: 14px; padding: 4px 10px; }
.status-pill.tone-2xx { background: #eef4fd; color: #2f5f9e; }
.status-pill.tone-4xx { background: #dbe8fd; color: #1d4ed8; }
.status-pill.tone-5xx { background: #1e3a8a; color: #ffffff; }
.status-pill.tone-none { background: #f1f5f9; color: #64748b; }

.method { border-radius: 4px; display: inline-block; flex: 0 0 auto; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 11px; font-weight: 700; padding: 1px 6px; }
.method-get { background: #eef4fd; color: #2f5f9e; }
.method-post { background: #dbe8fd; color: #1d4ed8; }
.method-put, .method-patch { background: #e2e8f0; color: #334155; }
.method-delete { background: #e0e7f5; color: #1e3a8a; }

/* Day/hour picked on the chart */
.bucket-chip { align-items: center; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 999px; color: #1d4ed8; display: inline-flex; font-size: 12px; font-weight: 600; gap: 4px; padding: 2px 4px 2px 10px; }
.bucket-chip button { align-items: center; background: none; border: 0; border-radius: 999px; color: #1d4ed8; display: inline-flex; height: 20px; justify-content: center; padding: 0; width: 20px; }
.bucket-chip button:hover { background: #dbeafe; }

.tx-list-footer { align-items: center; border-top: 1px solid #f1f5f9; color: #64748b; display: flex; font-size: 12px; justify-content: space-between; padding: 10px 14px; }
.load-more { background: #fff; border: 1px solid #d0d9e6; border-radius: 6px; color: #344054; font-size: 12px; font-weight: 700; padding: 6px 14px; }
.load-more:hover:not(:disabled) { background: #f8fafc; }
.load-more:disabled { cursor: wait; opacity: 0.6; }

/* List + detail side by side */
.tx-layout { align-items: start; display: grid; gap: 16px; grid-template-columns: minmax(0, 1fr); scroll-margin-top: 16px; }
.tx-layout.has-detail { grid-template-columns: minmax(0, 1fr) 420px; }
.tx-layout .tx-card { margin-bottom: 0; }

/* Detail panel */
.tx-detail {
  background: #fff;
  border: 1px solid #dbe3ef;
  border-radius: 10px;
  max-height: calc(100vh - 48px);
  overflow-y: auto;
  padding: 0 18px 18px;
  position: sticky;
  top: 24px;
}
.detail-head { align-items: center; background: #fff; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; margin: 0 -18px 14px; padding: 12px 18px; position: sticky; top: 0; z-index: 1; }
.detail-head h2 { color: #111827; font-size: 14px; font-weight: 700; margin: 0; }
.icon-btn { align-items: center; background: none; border: 0; border-radius: 6px; color: #64748b; display: inline-flex; font-size: 18px; height: 30px; justify-content: center; width: 30px; }
.icon-btn:hover { background: #f1f5f9; color: #111827; }

.detail-title { align-items: flex-start; display: flex; gap: 12px; justify-content: space-between; margin-bottom: 14px; }
.detail-route { background: none; color: #111827; font-size: 13px; font-weight: 600; margin-left: 6px; overflow-wrap: anywhere; padding: 0; }
.detail-time { color: #64748b; font-size: 12px; font-variant-numeric: tabular-nums; margin: 6px 0 0; }

.detail-outcome { border: 1px solid; border-radius: 8px; display: flex; gap: 10px; margin-bottom: 16px; padding: 10px 12px; }
.detail-outcome > .mdi { font-size: 18px; line-height: 1.2; }
.detail-outcome strong { display: block; font-size: 13px; }
.detail-outcome p { color: #1f2937; font-size: 13px; margin: 2px 0 0; overflow-wrap: anywhere; }
.detail-outcome.tone-2xx { background: #f5f9ff; border-color: #d6e4fb; color: #2f5f9e; }
.detail-outcome.tone-4xx { background: #eef4ff; border-color: #bfd4fb; color: #1d4ed8; }
.detail-outcome.tone-5xx { background: #eef1f9; border-color: #b9c6e6; color: #1e3a8a; }
.detail-outcome.tone-none { background: #f8fafc; border-color: #e2e8f0; color: #475569; }

.detail-list { margin: 0; }
.detail-list > div { border-bottom: 1px solid #f1f5f9; display: flex; gap: 12px; justify-content: space-between; padding: 8px 0; }
.detail-list dt { color: #64748b; flex: 0 0 auto; font-size: 12px; font-weight: 500; }
.detail-list dd { color: #111827; font-size: 13px; margin: 0; min-width: 0; text-align: right; }
.mono { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px !important; }
.wrap { overflow-wrap: anywhere; }
.copyable { align-items: center; display: flex; gap: 6px; justify-content: flex-end; }
.copyable span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.copyable button { background: none; border: 0; color: #64748b; flex: 0 0 auto; padding: 0; }
.copyable button:hover { color: #1d4ed8; }



.detail-privacy { align-items: center; color: #94a3b8; display: flex; font-size: 11px; gap: 6px; margin: 18px 0 0; }
.detail-error { color: #b42318; font-size: 13px; }

.sr-only { border: 0; clip: rect(0, 0, 0, 0); height: 1px; margin: -1px; overflow: hidden; padding: 0; position: absolute; white-space: nowrap; width: 1px; }

@media (max-width: 1200px) {
  .tx-layout.has-detail { grid-template-columns: minmax(0, 1fr); }
  .tx-detail { max-height: none; position: static; }
}

@media (max-width: 760px) {
  .tx-stats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .tx-stat:nth-child(3) { border-left: 0; }
  .tx-stat:nth-child(n + 3) { border-top: 1px solid #eef2f6; }
}
</style>
