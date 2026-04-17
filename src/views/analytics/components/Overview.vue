<template>
  <div class="overview-container">
    <div class="header-row">
      <h2 class="title">Overview</h2>
      <span class="badge">Real-time</span>
    </div>

    <div v-if="loading" class="grid-layout">
      <div v-for="i in 4" :key="i" class="stat-card skeleton-pulse"></div>
    </div>

    <div v-else-if="error" class="error-box">
      <p>{{ error }}</p>
      <button @click="fetchOverviewData" class="retry-btn">Try again</button>
    </div>

    <div v-else class="grid-layout">
      
      <div class="stat-card border-blue">
        <div class="card-content">
          <p class="label">Total Verifications</p>
          <h3 class="value">{{ formatNumber(metrics.totalVerifications) }}</h3>
        </div>
        <p class="subtext text-muted italic">Across all channels</p>
      </div>

      <div class="stat-card border-indigo">
        <div class="card-content">
          <p class="label">Completion Rate</p>
          <h3 class="value">{{ metrics.completionRate }}%</h3>
        </div>
        <div class="progress-container">
          <div class="progress-bg">
            <div class="progress-fill fill-indigo" :style="{ width: metrics.completionRate + '%' }"></div>
          </div>
        </div>
      </div>

      <div class="stat-card border-green">
        <div class="card-content">
          <p class="label label-green">Success Rate</p>
          <h3 class="value color-green">{{ metrics.successRate }}%</h3>
        </div>
        <p class="subtext color-green">● Verified</p>
      </div>

      <div class="stat-card border-red">
        <div class="card-content">
          <p class="label label-red">Drop-Off Rate</p>
          <h3 class="value color-red">{{ metrics.dropOffRate }}%</h3>
        </div>
        <p class="subtext color-red">Incomplete/Expired</p>
      </div>

    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex/dist/vuex.common.js';

const getDefaultMetrics = () => ({
  totalVerifications: 0,
  completionRate: 0,
  successRate: 0,
  dropOffRate: 0
});

export default {
  name: 'AnalyticsOverview',
  props: {
    env: {
      type: String,
      default: 'dev'
    }
  },
  data() {
    return {
      loading: true,
      error: null,
      metrics: getDefaultMetrics()
    };
  },
  mounted() {
    this.fetchOverviewData();
  },
  watch: {
    env() {
      this.fetchOverviewData();
    }
  },
  methods: {
    ...mapActions('mainStore', ['fetchAnalyticsOverview']),
    formatNumber(value) {
      return Number(value || 0).toLocaleString();
    },
    async fetchOverviewData() {
      this.loading = true;
      this.error = null;
      try {
        const response = await this.fetchAnalyticsOverview({ env: this.env });
        if (response && response.data) {
          this.metrics = {
            ...getDefaultMetrics(),
            totalVerifications: Number(response.data.totalVerifications) || 0,
            completionRate: Number(response.data.completionRate) || 0,
            successRate: Number(response.data.successRate) || 0,
            dropOffRate: Number(response.data.dropOffRate) || 0
          };
        } else {
          this.metrics = getDefaultMetrics();
          this.error = "Data format mismatch from server.";
        }
      } catch (err) {
        this.metrics = getDefaultMetrics();
        this.error = "Unable to load dashboard data.";
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
/* Container & Layout */
.overview-container {
  width: 100%;
  padding: 1.5rem;
  background-color: #f9fafb;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  margin-top: -0.85rem;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.badge {
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.125rem 0.625rem;
  background-color: #dbeafe;
  color: #1e40af;
  border-radius: 9999px;
}

.grid-layout {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .grid-layout { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (min-width: 1024px) {
  .grid-layout { grid-template-columns: repeat(4, minmax(0, 1fr)); }
}

/* Card Styling */
.stat-card {
  background-color: #ffffff;
  padding: 1.25rem;
  border-radius: 0.5rem;
  border: 1px solid #f3f4f6;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 120px;
  transition: all 0.2s ease;
}

.stat-card:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

/* Borders */
.border-blue { border-left: 4px solid #3b82f6; }
.border-indigo { border-left: 4px solid #6366f1; }
.border-green { border-left: 4px solid #10b981; }
.border-red { border-left: 4px solid #ef4444; }

.label {
  font-size: 10px;
  font-weight: 700;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.25rem;
}

.value {
  font-size: 1.5rem;
  font-weight: 900;
  color: #111827;
  margin: 0;
}

.subtext {
  font-size: 11px;
  font-weight: 600;
  margin-top: 0.5rem;
}

/* Progress Bar */
.progress-container { width: 100%; margin-top: 0.5rem; }
.progress-bg { background-color: #f3f4f6; border-radius: 9999px; height: 0.5rem; }
.progress-fill { height: 0.5rem; border-radius: 9999px; transition: width 0.7s ease-out; }
.fill-indigo { background-color: #6366f1; }

/* Colors */
.color-green { color: #059669; }
.color-red { color: #dc2626; }
.label-green { color: #065f46; }
.label-red { color: #991b1b; }
.text-muted { color: #9ca3af; }

/* Utils */
.skeleton-pulse {
  background-color: #e5e7eb;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: .5; }
}

.error-box {
  padding: 2rem;
  text-align: center;
  background-color: #fef2f2;
  border-radius: 0.5rem;
  color: #b91c1c;
}
</style>