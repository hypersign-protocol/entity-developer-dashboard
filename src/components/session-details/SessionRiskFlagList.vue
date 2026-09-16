<template>
  <div class="session-risk-list" :class="{ compact }">
    <article
      v-for="flag in flags"
      :key="flag.key"
      class="session-risk-item"
      :class="severityTone(flag.severity)"
    >
      <header class="session-risk-header">
        <i :class="severityIcon(flag.severity)"></i>
        <strong>{{ flag.title }}</strong>
        <span
          v-if="flag.severity"
          class="badge badge-pill"
          :class="severityBadgeClass(flag.severity)"
        >
          {{ severityLabel(flag.severity) }}
        </span>
      </header>

      <button
        v-if="showAttempts && flag.attemptLabel"
        type="button"
        class="session-attempt-link"
        @click="$emit('view-attempt', flag.sessionId)"
      >
        {{ flag.attemptLabel }}
      </button>

      <p v-if="flag.description" class="session-risk-description">
        {{ flag.description }}
      </p>

      <dl v-if="flag.metadataEntries && flag.metadataEntries.length" class="session-risk-metadata">
        <template v-for="item in flag.metadataEntries">
          <dt :key="item.key + '-label'">{{ item.label }}</dt>
          <dd :key="item.key + '-value'">{{ item.value }}</dd>
        </template>
      </dl>

      <p v-if="flag.source" class="session-risk-source">
        <strong>Source:</strong> {{ formatCode(flag.source) }}
      </p>
    </article>
  </div>
</template>

<script>
export default {
  name: "SessionRiskFlagList",
  props: {
    flags: {
      type: Array,
      default: () => [],
    },
    showAttempts: {
      type: Boolean,
      default: false,
    },
    compact: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    this.resetScroll();
  },
  watch: {
    flags() {
      this.resetScroll();
    },
  },
  methods: {
    resetScroll() {
      this.$nextTick(() => {
        if (this.$el) this.$el.scrollTop = 0;
      });
    },
    formatCode(value) {
      return String(value || "")
        .toLowerCase()
        .split("_")
        .filter(Boolean)
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
    },
    severityTone(severity) {
      return String(severity || "").toLowerCase();
    },
    severityLabel(severity) {
      const value = this.severityTone(severity);
      return value ? value.charAt(0).toUpperCase() + value.slice(1) : "";
    },
    severityIcon(severity) {
      return /high|critical/.test(this.severityTone(severity))
        ? "mdi mdi-alert-circle-outline"
        : "mdi mdi-alert-outline";
    },
    severityBadgeClass(severity) {
      const value = this.severityTone(severity);
      return {
        "badge-outline-danger": value === "high" || value === "critical",
        "badge-outline-warning": value === "medium",
        "badge-outline-secondary": value === "low",
      };
    },
  },
};
</script>

<style scoped>
.session-risk-list {
  align-content: start;
  display: grid;
  gap: 9px;
  min-height: 0;
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 1px 6px 6px 1px;
  scrollbar-color: #cbd5e1 transparent;
  scrollbar-gutter: stable;
  scrollbar-width: thin;
}

.session-risk-list::-webkit-scrollbar {
  width: 4px;
}

.session-risk-list::-webkit-scrollbar-track {
  background: transparent;
}

.session-risk-list::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.session-risk-item {
  background: #fff;
  border: 1px solid #e5eaf2;
  border-left: 3px solid #f59e0b;
  border-radius: 6px;
  min-width: 0;
  padding: 10px;
}

.session-risk-item.high,
.session-risk-item.critical {
  border-left-color: #dc2626;
}

.session-risk-header {
  align-items: flex-start;
  display: flex;
  gap: 7px;
  min-width: 0;
}

.session-risk-header > i {
  color: #d97706;
  flex: 0 0 auto;
  font-size: 16px;
}

.session-risk-item.high .session-risk-header > i,
.session-risk-item.critical .session-risk-header > i {
  color: #dc2626;
}

.session-risk-header > strong {
  color: #172554;
  flex: 1 1 auto;
  font-size: 11px;
  min-width: 0;
  overflow-wrap: anywhere;
}

.session-risk-header > span {
  flex: 0 0 auto;
  margin-left: auto;
}

.session-attempt-link {
  background: transparent;
  border: 0;
  color: #2563eb;
  cursor: pointer;
  display: block;
  font-size: 10px;
  font-weight: 700;
  margin-top: 7px;
  padding: 0;
  text-align: left;
}

.session-attempt-link:hover,
.session-attempt-link:focus-visible {
  color: #1d4ed8;
  text-decoration: underline;
}

.session-risk-description,
.session-risk-source {
  color: #7180a5;
  font-size: 10px;
  margin: 6px 0 0;
  overflow-wrap: anywhere;
}

.session-risk-source {
  color: #52658a;
}

.session-risk-metadata {
  display: grid;
  font-size: 10px;
  gap: 6px 10px;
  grid-template-columns: minmax(110px, 0.8fr) minmax(0, 1.2fr);
  line-height: 1.35;
  margin: 8px 0 0;
}

.session-risk-metadata dt {
  color: #7180a5;
  font-weight: 500;
  min-width: 0;
  overflow-wrap: anywhere;
}

.session-risk-metadata dd {
  color: #26375f;
  margin: 0;
  min-width: 0;
  overflow-wrap: anywhere;
}

.compact {
  gap: 7px;
  padding-right: 7px;
}

.compact .session-risk-item {
  background: #fffbeb;
  padding: 8px;
}

.compact .session-risk-item.high,
.compact .session-risk-item.critical {
  background: #fef2f2;
}

.compact .session-risk-header > i {
  display: none;
}

.compact .session-risk-header > strong,
.compact .session-risk-description,
.compact .session-risk-source,
.compact .session-risk-metadata {
  font-size: 9px;
}

.compact .session-risk-metadata {
  grid-template-columns: minmax(82px, 0.8fr) minmax(0, 1.2fr);
}
</style>
