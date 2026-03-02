<template>
  <div class="overview-container mt-6">
    <div class="header-row">
      <div class="title-group">
        <h2 class="title">Global User Distribution</h2>
        <p class="subtitle">Geographic breakdown by countries and continents</p>
      </div>
    </div>

    <div v-if="loading" class="loading-overlay">
      <div class="skeleton-map"></div>
    </div>

    <div v-else class="demographic-content">
      <div class="map-container">
        <div ref="worldMap" class="chart-canvas"></div>
      </div>

      <div class="stats-sidebar">
        <h3 class="sidebar-title">Top Continents</h3>
        <div v-for="(count, name) in demographics.continents" :key="name" class="continent-item">
          <div class="continent-info">
            <span class="continent-name">{{ name }}</span>
            <span class="continent-count">{{ count }} users</span>
          </div>
          <div class="mini-progress-bg">
            <div class="mini-progress-fill" :style="{ width: calculatePercentage(count) + '%' }"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex/dist/vuex.common.js';
import * as echarts from 'echarts';
import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';
countries.registerLocale(enLocale);
// You will need the world.json file for ECharts
// Usually available via: import worldJson from './world.json' 
// For this example, I'll show how to register it via a CDN fetch for ease of use.

export default {
  name: 'DemographicStats',
  props: {
    env: {
      type: String,
      default: 'dev'
    }
  },
  data() {
    return {
      loading: true,
      demographics: {
        continents: {},
        countries: {}
      },
      chart: null
    };
  },
  async mounted() {
    await this.fetchData();
    await this.initChart();
    window.addEventListener('resize', this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
    if (this.chart) this.chart.dispose();
  },
  watch: {
    env() {
      this.refreshData();
    }
  },
  methods: {
    ...mapActions('mainStore', ['fetchAnalyticsDemographicStats']),

    async refreshData() {
      await this.fetchData();
      await this.initChart();
    },

    async fetchData() {
      this.loading = true;
      try {
        const response = await this.fetchAnalyticsDemographicStats({ env: this.env });
        if (response && response.data) {
          this.demographics = response.data;
        }
      } catch (err) {
        console.error("Error fetching demographics:", err);
      } finally {
        this.loading = false;
      }
    },

    async initChart() {
      // 1. Fetch World GeoJSON (ECharts needs this to draw the map)
      const worldData = await fetch('https://cdn.jsdelivr.net/npm/echarts@4.9.0/map/json/world.json').then(res => res.json());
      echarts.registerMap('world', worldData);

      const chartDom = this.$refs.worldMap;
      this.chart = echarts.init(chartDom);

      // 2. Format country data for ECharts (Mapping ISO codes to Map Names if necessary)
      // Note: Map data usually uses country names like "India", "United States"
      // If your API returns "IN", "US", you'd use a mapper. For now, we'll map common ones.
        //   const nameMap = { 'IN': 'India', 'US': 'United States', 'NL': 'Netherlands' };
        //   const mapData = Object.entries(this.demographics.countries).map(([code, value]) => ({
        //     name: nameMap[code] || code,
        //     value: value
        //   }));

      const mapData = Object.entries(this.demographics.countries).map(([code, value]) => ({
        name: countries.getName(code, "en") || code, // Dynamically gets "India" from "IN"
        value: value
      }));

      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} Users'
        },
        visualMap: {
          min: 0,
          max: Math.max(...mapData.map(d => d.value), 10),
          left: 'left',
          top: 'bottom',
          text: ['High', 'Low'],
          calculable: true,
          inRange: {
            color: ['#e0f2fe', '#3b82f6', '#1e40af'] // Light blue to Deep blue
          }
        },
        series: [
          {
            name: 'Users',
            type: 'map',
            mapType: 'world',
            roam: true, // Allows zooming/panning
            emphasis: {
              label: { show: false },
              itemStyle: { areaColor: '#facc15' } // Highlight yellow on hover
            },
            data: mapData
          }
        ]
      };

      this.chart.setOption(option);
    },

    calculatePercentage(count) {
      const total = Object.values(this.demographics.continents).reduce((a, b) => a + b, 0);
      return total ? (count / total) * 100 : 0;
    },

    handleResize() {
      if (this.chart) this.chart.resize();
    }
  }
};
</script>

<style scoped>
.overview-container {
  width: 100%;
  padding: 1.5rem;
  background-color: #f9fafb;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  box-sizing: border-box;
}

.header-row {
  margin-bottom: 1.5rem;
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
  margin-top: 2px;
}

.demographic-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

@media (min-width: 1024px) {
  .demographic-content {
    flex-direction: row;
    height: 400px;
  }
}

.map-container {
  flex: 2; /* Map gets more space */
  background: white;
  border-radius: 0.5rem;
  border: 1px solid #f3f4f6;
  min-height: 300px;
}

.chart-canvas {
  width: 100%;
  height: 100%;
}

.stats-sidebar {
  flex: 1;
  background: white;
  padding: 1.25rem;
  border-radius: 0.5rem;
  border: 1px solid #f3f4f6;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.sidebar-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.continent-item {
  margin-bottom: 0.5rem;
}

.continent-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}

.continent-name {
  font-size: 0.85rem;
  font-weight: 500;
  color: #4b5563;
}

.continent-count {
  font-size: 0.85rem;
  font-weight: 600;
  color: #111827;
}

.mini-progress-bg {
  width: 100%;
  height: 6px;
  background: #f3f4f6;
  border-radius: 10px;
}

.mini-progress-fill {
  height: 100%;
  background: #3b82f6;
  border-radius: 10px;
  transition: width 1s ease;
}

.skeleton-map {
  width: 100%;
  height: 350px;
  background: #e5e7eb;
  border-radius: 0.5rem;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  50% { opacity: 0.5; }
}
</style>