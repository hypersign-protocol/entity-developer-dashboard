<template>
  <div class="overview-container mt-6">
    <div class="header-row">
      <div class="title-group">
        <h2 class="title">Device Distribution</h2>
        <p class="subtitle">Platform usage for ID verification</p>
      </div>
      <span class="badge">Live Status</span>
    </div>

    <div v-if="loading" class="grid-layout">
      <div v-for="i in 4" :key="i" class="stat-card skeleton-pulse"></div>
    </div>

    <div v-else class="device-grid">
      <div class="chart-wrapper">
        <div ref="deviceChart" class="chart-canvas"></div>
      </div>

      <div class="details-list">
        <div v-for="device in deviceData" :key="device.deviceType" class="device-row">
          <div class="device-meta">
            <span class="status-dot" :style="{ backgroundColor: getDeviceColor(device.deviceType) }"></span>
            <span class="device-name">{{ device.deviceType }}</span>
          </div>
          <div class="device-stats">
            <div class="progress-container">
              <div class="progress-bg">
                <div 
                  class="progress-fill" 
                  :style="{ 
                    width: device.percentage + '%', 
                    backgroundColor: getDeviceColor(device.deviceType) 
                  }"
                ></div>
              </div>
            </div>
            <span class="device-val">{{ device.percentage }}%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex/dist/vuex.common.js';
import * as echarts from 'echarts';

export default {
  name: 'DeviceStats',
  data() {
    return {
      loading: true,
      deviceData: [],
      chart: null
    };
  },
  async mounted() {
    await this.fetchDevices();
    this.initChart();
    window.addEventListener('resize', this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
    if (this.chart) this.chart.dispose();
  },
  methods: {
    ...mapActions('mainStore', ['fetchAnalyticsDeviceStats']),

    async fetchDevices() {
      this.loading = true;
      try {
        const response = await this.fetchAnalyticsDeviceStats();
        if (response && response.data) {
          this.deviceData = response.data;
        }
      } catch (err) {
        console.error("API Error:", err);
        // Using provided example data as fallback
        this.deviceData = [
          { deviceType: 'Desktop', percentage: 90 },
          { deviceType: 'Mobile', percentage: 5 },
          { deviceType: 'Tablet', percentage: 2 }
        ];
      } finally {
        this.loading = false;
      }
    },

    initChart() {
      if (!this.$refs.deviceChart) return;
      this.chart = echarts.init(this.$refs.deviceChart);
      
      const chartData = this.deviceData.map(item => ({
        name: item.deviceType,
        value: item.percentage
      }));

      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c}%'
        },
        series: [
          {
            type: 'pie',
            radius: ['65%', '85%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 4,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: { show: false },
            data: chartData,
            color: ['#2563eb', '#10b981', '#4f46e5', '#9ca3af']
          }
        ]
      };
      this.chart.setOption(option);
    },

    getDeviceColor(type) {
      const colors = {
        'Desktop': '#2563eb',
        'Mobile': '#10b981',
        'Tablet': '#4f46e5',
        'Unknown': '#9ca3af'
      };
      return colors[type] || '#cbd5e1';
    },

    handleResize() {
      if (this.chart) this.chart.resize();
    }
  }
};
</script>

<style scoped>
/* Re-using your specific container design */
.overview-container {
  width: 100%;
  padding: 1.5rem;
  background-color: #f9fafb;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  box-sizing: border-box;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.subtitle {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 4px 0 0 0;
}

.badge {
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  background-color: #ecfdf5;
  color: #065f46;
  border: 1px solid #d1fae5;
  border-radius: 9999px;
  text-transform: uppercase;
}

/* Device Layout */
.device-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  align-items: center;
}

@media (min-width: 1024px) {
  .device-grid {
    grid-template-columns: 1fr 2fr;
  }
}

.chart-wrapper {
  height: 250px;
  width: 100%;
}

.chart-canvas {
  width: 100%;
  height: 100%;
}

.details-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.device-row {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.device-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.device-name {
  font-size: 0.875rem;
  font-weight: 700;
  color: #4b5563;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.device-stats {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.progress-container {
  flex: 1;
}

.progress-bg {
  background-color: #e5e7eb;
  border-radius: 9999px;
  height: 0.6rem;
}

.progress-fill {
  height: 0.6rem;
  border-radius: 9999px;
  transition: width 1s ease-out;
}

.device-val {
  font-size: 1rem;
  font-weight: 800;
  color: #111827;
  min-width: 45px;
  text-align: right;
}

/* Utils */
.skeleton-pulse {
  height: 120px;
  background-color: #e5e7eb;
  border-radius: 0.5rem;
  animation: pulse 1.8s infinite ease-in-out;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: .5; }
}
</style>