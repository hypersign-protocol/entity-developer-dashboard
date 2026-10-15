<template>
  <div class="tx-page">
    <nav class="tx-breadcrumb" aria-label="Breadcrumb">
      <router-link :to="`/studio/usage/${appId}`"><i class="mdi mdi-arrow-left" aria-hidden="true"></i>API Usage Analytics</router-link>
      <i class="mdi mdi-chevron-right" aria-hidden="true"></i>
      <span aria-current="page">Transactions</span>
    </nav>

    <header class="tx-header">
      <div>
        <h1>
          API Transactions
          <span v-if="usingSampleData" class="sample-badge" title="The transactions API isn't connected yet">Sample data</span>
        </h1>
        <p>Every API call your app made, with its status, latency and what happened. Kept for {{ retentionDays }} days.</p>
      </div>
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

    <!-- Status tiles; clicking one filters the list -->
    <div class="tx-tiles">
      <button
        v-for="tile in tiles"
        :key="tile.key"
        type="button"
        class="tx-tile"
        :class="[`tone-${tile.key}`, { active: filters.status === tile.filter }]"
        :aria-pressed="filters.status === tile.filter ? 'true' : 'false'"
        @click="setStatusFilter(tile.filter)"
      >
        <span class="tile-label"><span v-if="tile.key !== 'all'" class="tile-swatch" aria-hidden="true"></span>{{ tile.label }}</span>
        <span class="tile-value">
          <v-progress-circular v-if="loadingSummary" indeterminate color="primary" size="16" width="2"></v-progress-circular>
          <template v-else>{{ formatCount(tile.count) }}</template>
          <small v-if="!loadingSummary && tile.key !== 'all'">{{ percent(tile.count) }}</small>
        </span>
        <span v-if="tile.key === 'all'" class="tile-sub">across all endpoints</span>
      </button>
    </div>

    <!-- Filters -->
    <form class="tx-toolbar" @submit.prevent="applySearch">
      <div class="tx-search">
        <i class="mdi mdi-magnify" aria-hidden="true"></i>
        <input
          v-model.trim="searchInput"
          type="search"
          placeholder="Search by transaction ID, session ID or provider transaction ID"
          aria-label="Search by transaction ID, session ID or provider transaction ID"
        />
      </div>
      <div class="tx-select">
        <select v-model="filters.route" aria-label="Endpoint" @change="reloadList">
          <option value="">All endpoints</option>
          <option v-for="endpoint in endpointOptions" :key="endpoint.key" :value="endpoint.route">{{ endpoint.method }} {{ endpoint.route }}</option>
        </select>
        <i class="mdi mdi-chevron-down" aria-hidden="true"></i>
      </div>
      <div class="tx-select">
        <select v-model="filters.product" aria-label="Product" @change="reloadList">
          <option value="">All products</option>
          <option v-for="product in productOptions" :key="product" :value="product">{{ product }}</option>
        </select>
        <i class="mdi mdi-chevron-down" aria-hidden="true"></i>
      </div>
      <button v-if="hasFilters" type="button" class="tx-clear" @click="clearFilters">Clear filters</button>
    </form>

    <div class="tx-layout" :class="{ 'has-detail': selectedId }">
      <!-- Transaction list -->
      <section class="tx-list-card">
        <SectionLoader v-if="loadingList && !items.length" label="Loading transactions" />
        <empty-container
          v-else-if="!items.length"
          :title="hasFilters ? 'No Matching Transactions' : 'No API Calls'"
          icon="mdi mdi-swap-horizontal"
          :description="hasFilters ? 'Nothing matches these filters in the selected period. Try clearing a filter or a wider date range.' : 'No API calls were made between the selected dates.'"
        />
        <template v-else>
          <div class="tx-table-wrap">
            <table class="tx-table">
              <thead>
                <tr>
                  <th scope="col">Time</th>
                  <th scope="col">Status</th>
                  <th scope="col">Product</th>
                  <th scope="col">Endpoint</th>
                  <th scope="col" class="text-right">Latency</th>
                  <th scope="col"><span class="sr-only">Open</span></th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in items"
                  :key="item.id"
                  :class="{ selected: item.id === selectedId }"
                  tabindex="0"
                  @click="openDetail(item)"
                  @keydown.enter="openDetail(item)"
                >
                  <td class="tx-time" :title="item.createdAt">{{ formatTime(item.createdAt) }}</td>
                  <td><span class="status-pill" :class="`tone-${statusClass(item.statusCode)}`">{{ item.statusCode }}</span></td>
                  <td><span class="product-tag">{{ item.product }}</span></td>
                  <td class="tx-endpoint">
                    <span class="method" :class="`method-${item.method.toLowerCase()}`">{{ item.method }}</span>
                    <code :title="item.route">{{ item.route }}</code>
                  </td>
                  <td class="text-right tx-latency" :class="{ slow: item.durationMs >= 3000 }">{{ formatDuration(item.durationMs) }}</td>
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
      </section>

      <!-- Transaction detail -->
      <aside v-if="selectedId" class="tx-detail" aria-label="Transaction details">
        <header class="detail-head">
          <h2>API request</h2>
          <button type="button" class="icon-btn" aria-label="Close details" @click="closeDetail"><i class="mdi mdi-close" aria-hidden="true"></i></button>
        </header>

        <SectionLoader v-if="loadingDetail" label="Loading transaction" min-height="200px" />
        <p v-else-if="detailError" class="detail-error">{{ detailError }}</p>
        <template v-else-if="detail">
          <div class="detail-title">
            <div>
              <span class="method" :class="`method-${detail.method.toLowerCase()}`">{{ detail.method }}</span>
              <code class="detail-route">{{ detail.route }}</code>
              <p class="detail-time">{{ formatFullTime(detail.createdAt) }}</p>
            </div>
            <span class="status-pill large" :class="`tone-${statusClass(detail.statusCode)}`">{{ detail.statusCode }}</span>
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
                <span :title="detail.requestId">{{ detail.requestId }}</span>
                <button type="button" title="Copy transaction ID" @click="copyToClip(detail.requestId, 'Transaction ID')"><i class="mdi mdi-content-copy" aria-hidden="true"></i></button>
              </dd>
            </div>
            <div><dt>Product</dt><dd>{{ detail.product }}</dd></div>
            <div><dt>Environment</dt><dd>{{ detail.env === 'prod' ? 'Production' : 'Development' }}</dd></div>
            <div><dt>Latency</dt><dd :class="{ slow: detail.durationMs >= 3000 }">{{ formatDuration(detail.durationMs) }}</dd></div>
            <div><dt>Credits charged</dt><dd>{{ detail.credits ? detail.credits : 'None' }}</dd></div>
            <div><dt>IP address</dt><dd class="mono">{{ detail.ip || '—' }}</dd></div>
            <div><dt>User agent</dt><dd class="wrap">{{ detail.userAgent || '—' }}</dd></div>
            <div v-if="detail.path !== detail.route"><dt>Path</dt><dd class="mono wrap">{{ detail.path }}</dd></div>
          </dl>

          <!-- Third-party provider -->
          <section v-if="detail.upstream" class="detail-section">
            <h3>Provider response</h3>
            <dl class="detail-list">
              <div v-if="detail.upstream.provider"><dt>Provider</dt><dd>{{ detail.upstream.provider }}</dd></div>
              <div><dt>Status</dt><dd><span class="status-pill" :class="`tone-${statusClass(detail.upstream.status)}`">{{ detail.upstream.status }}</span></dd></div>
              <div v-if="detail.upstream.txnId">
                <dt>Provider transaction ID</dt>
                <dd class="mono copyable">
                  <span>{{ detail.upstream.txnId }}</span>
                  <button type="button" title="Copy provider transaction ID" @click="copyToClip(detail.upstream.txnId, 'Provider transaction ID')"><i class="mdi mdi-content-copy" aria-hidden="true"></i></button>
                </dd>
              </div>
              <div v-if="detail.upstream.message"><dt>Message</dt><dd class="wrap">{{ detail.upstream.message }}</dd></div>
            </dl>
          </section>

          <!-- Linked verification -->
          <section v-if="detail.refId" class="detail-section">
            <h3>Linked verification</h3>
            <router-link v-if="detail.product === 'KYC'" class="session-link" :to="`/studio/sessions/${appId}/${detail.refId}`">
              <i class="mdi mdi-account-check-outline" aria-hidden="true"></i>
              <span>Open session <code>{{ detail.refId }}</code></span>
              <i class="mdi mdi-arrow-right" aria-hidden="true"></i>
            </router-link>
            <p v-else class="mono">{{ detail.refId }}</p>
          </section>

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
import UtilsMixin from '../../mixins/utils';
import SectionLoader from '../../components/element/SectionLoader.vue';
import {
  RETENTION_DAYS,
  USE_MOCK,
  fetchTransaction,
  fetchTransactionSummary,
  fetchTransactions,
  statusClass,
} from '../../utils/apiTransactions';

const PAGE_SIZE = 25;

export default {
  name: 'ApiTransactions',
  components: { SectionLoader },
  mixins: [UtilsMixin],
  data() {
    return {
      retentionDays: RETENTION_DAYS,
      usingSampleData: USE_MOCK,
      rangePresets: [
        { key: '24h', label: 'Last 24 hours', hours: 24 },
        { key: '7d', label: 'Last 7 days', hours: 24 * 7 },
        { key: '30d', label: 'Last 30 days', hours: 24 * 30 },
        { key: '90d', label: 'Last 90 days', hours: 24 * 90 },
      ],
      activePreset: '7d',
      range: { from: '', to: '' },
      filters: { status: '', route: '', product: '', search: '' },
      searchInput: '',
      summary: null,
      loadingSummary: false,
      items: [],
      nextCursor: null,
      loadingList: false,
      detail: null,
      loadingDetail: false,
      detailError: '',
      requestToken: 0,
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
    selectedId() {
      return this.$route.query.txn || '';
    },
    totals() {
      return (this.summary && this.summary.totals) || { total: 0, '2xx': 0, '4xx': 0, '5xx': 0 };
    },
    tiles() {
      return [
        { key: 'all', label: 'Total API calls', count: this.totals.total, filter: '' },
        { key: '2xx', label: '2xx Success', count: this.totals['2xx'], filter: '2xx' },
        { key: '4xx', label: '4xx Client errors', count: this.totals['4xx'], filter: '4xx' },
        { key: '5xx', label: '5xx Server errors', count: this.totals['5xx'], filter: '5xx' },
      ];
    },
    endpointOptions() {
      return ((this.summary && this.summary.endpoints) || [])
        .map(endpoint => ({ ...endpoint, key: `${endpoint.method} ${endpoint.route}` }));
    },
    productOptions() {
      return [...new Set(this.endpointOptions.map(endpoint => endpoint.product))].sort();
    },
    hasFilters() {
      return Boolean(this.filters.status || this.filters.route || this.filters.product || this.filters.search);
    },
    rangeLabel() {
      if (!this.range.from) return '';
      const options = { day: 'numeric', month: 'short', year: 'numeric' };
      return `${new Date(this.range.from).toLocaleDateString('en-GB', options)} – ${new Date(this.range.to).toLocaleDateString('en-GB', options)}`;
    },
    queryParams() {
      return { from: this.range.from, to: this.range.to, env: this.env };
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
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.onKeydown);
  },
  methods: {
    statusClass,

    selectPreset(key) {
      const preset = this.rangePresets.find(item => item.key === key);
      const now = new Date();
      this.activePreset = key;
      this.range = { from: new Date(now.getTime() - preset.hours * 3600000).toISOString(), to: now.toISOString() };
      this.loadSummary();
      this.reloadList();
    },

    async loadSummary() {
      this.loadingSummary = true;
      try {
        this.summary = await fetchTransactionSummary(this.$store, {
          ...this.queryParams,
          interval: this.activePreset === '24h' ? 'hour' : 'day',
        });
      } catch (error) {
        this.notifyErr(error.message || 'Could not load the API call summary.');
      } finally {
        this.loadingSummary = false;
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
      // Ignore responses that arrive after the filters changed again
      const token = ++this.requestToken;
      this.loadingList = true;
      try {
        const page = await fetchTransactions(this.$store, { ...this.queryParams, ...this.filters, cursor, limit: PAGE_SIZE });
        if (token !== this.requestToken) return;
        this.items = cursor ? [...this.items, ...page.items] : page.items;
        this.nextCursor = page.nextCursor;
      } catch (error) {
        if (token === this.requestToken) this.notifyErr(error.message || 'Could not load API transactions.');
      } finally {
        if (token === this.requestToken) this.loadingList = false;
      }
    },

    setStatusFilter(status) {
      this.filters.status = this.filters.status === status ? '' : status;
      this.reloadList();
    },

    applySearch() {
      this.filters.search = this.searchInput;
      this.reloadList();
    },

    clearFilters() {
      this.filters = { status: '', route: '', product: '', search: '' };
      this.searchInput = '';
      this.reloadList();
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
      if (group === '2xx') return 'Completed successfully';
      if (group === '4xx') return 'Rejected: problem with the request';
      return 'Failed: server or provider error';
    },

    outcomeIcon(code) {
      return { '2xx': 'mdi-check-circle', '4xx': 'mdi-alert-circle-outline', '5xx': 'mdi-close-circle' }[statusClass(code)];
    },

    percent(count) {
      if (!this.totals.total) return '0%';
      return `${((count / this.totals.total) * 100).toFixed(1)}%`;
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

.tx-breadcrumb { align-items: center; color: #7180a5; display: flex; font-size: 12px; gap: 10px; margin-bottom: 18px; }
.tx-breadcrumb a { color: #52658f; text-decoration: none; }
.tx-breadcrumb a:hover { color: #1d4ed8; }
.tx-breadcrumb a .mdi { margin-right: 6px; }

.tx-header { margin-bottom: 16px; }
.tx-header h1 { align-items: center; color: #111827; display: flex; font-size: 24px; font-weight: 700; gap: 10px; margin: 0 0 4px; }
.tx-header p { color: #718198; font-size: 13px; margin: 0; }

.sample-badge {
  background: rgba(255, 193, 7, 0.16);
  border-radius: 999px;
  color: #856404;
  font-size: 11px;
  font-weight: 700;
  padding: 2px 9px;
}

/* Date range (same as the API Usage page) */
.range-bar { align-items: center; display: flex; flex-wrap: wrap; gap: 10px 16px; margin-bottom: 18px; }
.range-presets { background: #f1f5f9; border-radius: 8px; display: inline-flex; gap: 2px; padding: 3px; }
.range-preset { background: transparent; border: 0; border-radius: 6px; color: #64748b; font-size: 12px; font-weight: 600; padding: 6px 12px; white-space: nowrap; }
.range-preset:hover:not(.active) { color: #111827; }
.range-preset.active { background: #fff; box-shadow: 0 1px 2px rgba(15, 23, 42, 0.12); color: #111827; }
.range-summary { color: #64748b; font-size: 13px; }

/* Tiles */
.tx-tiles { display: grid; gap: 12px; grid-template-columns: repeat(4, minmax(0, 1fr)); margin-bottom: 18px; }
.tx-tile {
  align-items: flex-start;
  background: #fff;
  border: 1px solid #dbe3ef;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 14px 16px;
  text-align: left;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.tx-tile:hover { border-color: #b8c6dc; }
.tx-tile.active { border-color: #2563eb; box-shadow: 0 0 0 1px #2563eb; }
.tx-tile:focus { outline: none; }
.tx-tile:focus-visible { box-shadow: 0 0 0 2px #bfdbfe; }
.tile-label { align-items: center; color: #7180a5; display: inline-flex; font-size: 12px; gap: 6px; }
.tile-swatch { border-radius: 2px; height: 9px; width: 9px; }
.tone-2xx .tile-swatch { background: #4ec96b; }
.tone-4xx .tile-swatch { background: #f59e0b; }
.tone-5xx .tile-swatch { background: #dc2626; }
.tile-value { align-items: baseline; color: #111827; display: flex; font-size: 24px; font-weight: 700; gap: 6px; min-height: 30px; }
.tile-value small { color: #64748b; font-size: 12px; font-weight: 600; }
.tile-sub { color: #94a3b8; font-size: 11px; }

/* Toolbar */
.tx-toolbar { align-items: center; display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 14px; }
.tx-search { align-items: center; display: flex; flex: 1 1 340px; position: relative; }
.tx-search .mdi { color: #94a3b8; font-size: 18px; left: 12px; position: absolute; }
.tx-search input {
  background: #fff;
  border: 1px solid #d0d9e6;
  border-radius: 8px;
  color: #111827;
  font-size: 13px;
  height: 38px;
  padding: 0 12px 0 38px;
  width: 100%;
}
.tx-search input:focus, .tx-select select:focus { border-color: #2563eb; box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.12); outline: none; }
.tx-select { position: relative; }
.tx-select select {
  appearance: none;
  -webkit-appearance: none;
  background: #fff;
  border: 1px solid #d0d9e6;
  border-radius: 8px;
  color: #344054;
  cursor: pointer;
  font-size: 13px;
  height: 38px;
  max-width: 320px;
  padding: 0 34px 0 12px;
}
.tx-select .mdi { color: #64748b; pointer-events: none; position: absolute; right: 10px; top: 9px; }
.tx-clear { background: none; border: 0; color: #2563eb; font-size: 12px; font-weight: 700; padding: 6px 4px; }
.tx-clear:hover { text-decoration: underline; }

/* List + detail side by side */
.tx-layout { align-items: start; display: grid; gap: 16px; grid-template-columns: minmax(0, 1fr); }
.tx-layout.has-detail { grid-template-columns: minmax(0, 1fr) 420px; }

.tx-list-card { background: #fff; border: 1px solid #dbe3ef; border-radius: 10px; min-width: 0; overflow: hidden; }
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
.tx-table tbody tr { cursor: pointer; transition: background-color 0.1s ease; }
.tx-table tbody tr:hover { background: #f8fafc; }
.tx-table tbody tr.selected { background: #eff6ff; }
.tx-table tbody tr:focus { outline: none; }
.tx-table tbody tr:focus-visible { box-shadow: inset 0 0 0 2px #bfdbfe; }
.tx-time { color: #475569 !important; font-variant-numeric: tabular-nums; white-space: nowrap; }
.tx-endpoint { align-items: center; display: flex; gap: 8px; max-width: 520px; min-width: 0; }
.tx-endpoint code { background: none; color: #344054; font-size: 12px; overflow: hidden; padding: 0; text-overflow: ellipsis; white-space: nowrap; }
.tx-latency { color: #475569 !important; font-variant-numeric: tabular-nums; white-space: nowrap; }
.slow { color: #b45309 !important; font-weight: 600; }
.tx-chevron { color: #94a3b8 !important; width: 28px; }
.text-right { text-align: right; }

.status-pill { border-radius: 5px; display: inline-block; font-size: 12px; font-variant-numeric: tabular-nums; font-weight: 700; min-width: 42px; padding: 2px 7px; text-align: center; }
.status-pill.large { font-size: 14px; padding: 4px 10px; }
.status-pill.tone-2xx { background: rgba(78, 201, 107, 0.14); color: #2f9e4f; }
.status-pill.tone-4xx { background: rgba(245, 158, 11, 0.16); color: #92400e; }
.status-pill.tone-5xx { background: rgba(220, 38, 38, 0.1); color: #b91c1c; }

.product-tag { background: #f1f5f9; border-radius: 5px; color: #475569; font-size: 11px; font-weight: 700; padding: 2px 7px; }

.method { border-radius: 4px; display: inline-block; flex: 0 0 auto; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 11px; font-weight: 700; padding: 1px 6px; }
.method-get { background: rgba(34, 197, 94, 0.1); color: #15803d; }
.method-post { background: rgba(59, 130, 246, 0.1); color: #1d4ed8; }
.method-put, .method-patch { background: rgba(245, 158, 66, 0.12); color: #b45309; }
.method-delete { background: rgba(239, 68, 68, 0.1); color: #b91c1c; }

.tx-list-footer { align-items: center; color: #64748b; display: flex; font-size: 12px; justify-content: space-between; padding: 10px 14px; }
.load-more { background: #fff; border: 1px solid #d0d9e6; border-radius: 6px; color: #344054; font-size: 12px; font-weight: 700; padding: 6px 14px; }
.load-more:hover:not(:disabled) { background: #f8fafc; }
.load-more:disabled { cursor: wait; opacity: 0.6; }

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
.detail-outcome.tone-2xx { background: #f3fbf6; border-color: #c9ecd6; color: #1f7a43; }
.detail-outcome.tone-4xx { background: #fffbeb; border-color: #fde68a; color: #92400e; }
.detail-outcome.tone-5xx { background: #fef6f6; border-color: #f6cfcf; color: #b42318; }

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

.detail-section { margin-top: 18px; }
.detail-section h3 { color: #64748b; font-size: 11px; font-weight: 700; letter-spacing: 0.05em; margin: 0 0 6px; text-transform: uppercase; }

.session-link { align-items: center; border: 1px solid #dbe3ef; border-radius: 8px; color: #1d4ed8; display: flex; font-size: 13px; font-weight: 600; gap: 8px; padding: 10px 12px; text-decoration: none; }
.session-link:hover { background: #eff6ff; border-color: #bfdbfe; }
.session-link span { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.session-link code { background: none; color: #475569; font-size: 11px; font-weight: 500; padding: 0; }

.detail-privacy { align-items: center; color: #94a3b8; display: flex; font-size: 11px; gap: 6px; margin: 18px 0 0; }
.detail-error { color: #b42318; font-size: 13px; }

.sr-only { border: 0; clip: rect(0, 0, 0, 0); height: 1px; margin: -1px; overflow: hidden; padding: 0; position: absolute; white-space: nowrap; width: 1px; }

@media (max-width: 1200px) {
  .tx-layout.has-detail { grid-template-columns: minmax(0, 1fr); }
  .tx-detail { max-height: none; position: static; }
}

@media (max-width: 760px) {
  .tx-tiles { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
</style>
