<template>
  <div class="session-decision-list" :class="{ compact }">
    <div class="session-decision-timeline">
      <div
        v-for="decision in decisions"
        :key="decision.key"
        class="session-decision-item"
        :class="decisionTone(decision.action)"
      >
        <div class="session-decision-event">
          <div v-if="decision.action" class="session-decision-header">
            <span class="session-decision-label">Status</span>
            <span class="badge badge-pill px-2 py-1" :class="statusClass(decision.action)">
              {{ statusLabel(decision.action) }}
            </span>
          </div>

          <div class="session-decision-grid">
            <template v-if="showAttempts && decision.attemptLabel">
              <span class="session-decision-label">Attempt</span>
              <button
                type="button"
                class="session-decision-value session-attempt-link"
                @click="$emit('view-attempt', decision.sessionId)"
              >
                {{ decision.attemptLabel }}
              </button>
            </template>
            <template v-if="decision.decidedBy">
              <span class="session-decision-label">Decided By</span>
              <span class="session-decision-value" :title="decision.decidedBy">{{ decision.decidedBy }}</span>
            </template>
            <template v-if="decision.decidedAt">
              <span class="session-decision-label">Time</span>
              <span class="session-decision-value">{{ formatDate(decision.decidedAt) }}</span>
            </template>
            <template v-if="decision.reasonCode">
              <span class="session-decision-label">{{ isCleared(decision) ? "Review Result" : "Reason" }}</span>
              <span class="session-decision-value" :title="reasonLabel(decision.reasonCode)">
                <i
                  class="mdi mr-1"
                  :class="isCleared(decision) ? 'mdi-check-circle-outline text-success' : 'mdi-alert-circle-outline text-danger'"
                ></i>
                {{ reasonLabel(decision.reasonCode) }}
              </span>
            </template>
            <template v-if="decision.comments">
              <span class="session-decision-label">Comment</span>
              <span class="session-decision-value" :title="decision.comments">{{ decision.comments }}</span>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UtilsMixin from "../../mixins/utils";

export default {
  name: "SessionDecisionHistory",
  mixins: [UtilsMixin],
  props: {
    decisions: {
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
    reasonOptions: {
      type: Array,
      default: () => [],
    },
  },
  mounted() {
    this.resetScroll();
  },
  watch: {
    decisions() {
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
    decisionTone(action) {
      return String(action || "").toLowerCase();
    },
    statusLabel(action) {
      const labels = {
        MANUAL_REVIEW: "Manual Review",
        APPROVED: "Approved",
        REJECTED: "Rejected",
      };
      return labels[action] || this.formatCode(action || "Decision");
    },
    statusClass(action) {
      if (action === "REJECTED") return "badge-outline-danger";
      if (action === "APPROVED") return "badge-outline-success";
      return "badge-outline-warning";
    },
    reasonLabel(reasonCode) {
      const reason = this.reasonOptions.find(item => item.value === reasonCode);
      return reason ? reason.label : this.formatCode(reasonCode);
    },
    isCleared(decision) {
      return decision.reasonCode === "MANUAL_REVIEW_CLEARED";
    },
  },
};
</script>

<style scoped>
.session-decision-list {
  min-height: 0;
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 1px 6px 2px 0;
  scrollbar-color: #cbd5e1 transparent;
  scrollbar-gutter: stable;
  scrollbar-width: thin;
}

.session-decision-list::-webkit-scrollbar {
  width: 4px;
}

.session-decision-list::-webkit-scrollbar-track {
  background: transparent;
}

.session-decision-list::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.session-decision-timeline {
  margin-left: 4px;
  padding-left: 20px;
  position: relative;
}

.session-decision-timeline::before {
  background: #e5e7eb;
  bottom: 14px;
  content: "";
  left: 5px;
  position: absolute;
  top: 12px;
  width: 1px;
}

.session-decision-item {
  padding: 0 0 10px;
  position: relative;
}

.session-decision-item::before {
  background: #fff;
  border: 2px solid #9ca3af;
  border-radius: 50%;
  content: "";
  height: 10px;
  left: -20px;
  position: absolute;
  top: 12px;
  width: 10px;
  z-index: 1;
}

.session-decision-item.approved::before {
  background: #16a34a;
  border-color: #16a34a;
}

.session-decision-item.rejected::before {
  background: #dc2626;
  border-color: #dc2626;
}

.session-decision-item:last-child {
  padding-bottom: 0;
}

.session-decision-event {
  background: #f9fafb;
  border: 1px solid #eef0f3;
  border-left: 3px solid #d97706;
  border-radius: 6px;
  padding: 9px 11px;
}

.session-decision-item.approved .session-decision-event {
  border-left-color: #16a34a;
}

.session-decision-item.rejected .session-decision-event {
  border-left-color: #dc2626;
}

.session-decision-header {
  align-items: center;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  padding-bottom: 7px;
}

.session-decision-grid {
  display: grid;
  gap: 5px 10px;
  grid-template-columns: 96px minmax(0, 1fr);
  margin-top: 7px;
}

.session-decision-label {
  color: #6b7280;
  font-size: 11px;
  font-weight: 500;
}

.session-decision-value {
  color: #374151;
  font-size: 12px;
  font-weight: 500;
  min-width: 0;
  overflow-wrap: anywhere;
  text-align: right;
}

.session-attempt-link {
  background: transparent;
  border: 0;
  color: #2563eb;
  cursor: pointer;
  font-weight: 700;
  justify-self: end;
  padding: 0;
}

.session-attempt-link:hover,
.session-attempt-link:focus-visible {
  color: #1d4ed8;
  text-decoration: underline;
}

.compact .session-decision-timeline {
  margin-left: 1px;
  padding-left: 17px;
}

.compact .session-decision-timeline::before {
  left: 4px;
}

.compact .session-decision-item::before {
  height: 9px;
  left: -17px;
  top: 11px;
  width: 9px;
}

.compact .session-decision-event {
  padding: 8px 9px;
}

.compact .session-decision-grid {
  gap: 6px 8px;
  grid-template-columns: 76px minmax(0, 1fr);
}

.compact .session-decision-label,
.compact .session-decision-value {
  font-size: 10px;
  line-height: 1.35;
}
</style>
