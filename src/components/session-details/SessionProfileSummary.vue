<template>
  <section class="sd-profile-card">
    <div class="sd-avatar">{{ summary.initials }}</div>
    <div class="sd-profile-main">
      <strong v-if="summary.email">{{ summary.email }}</strong>
      <span v-if="summary.userId">User ID: {{ summary.userId }}</span>
      <span v-else-if="summary.sessionId"
        >User ID: {{ summary.sessionId }}</span
      >
      <span
        v-if="summary.isAttempt && summary.sessionId"
        class="sd-session-id"
        :title="summary.sessionId"
      >
        Session ID: {{ compactSessionId(summary.sessionId) }}
        <button
          type="button"
          title="Copy session ID"
          @click.stop="copySessionId(summary.sessionId)"
        >
          <i class="mdi mdi-content-copy"></i>
        </button>
      </span>
    </div>
    <div v-if="summary.status" class="sd-stat">
      <label>Current Status</label>
      <div class="sd-current-status-row">
        <span class="sd-status" :class="summary.statusTone">{{
          summary.statusLabel
        }}</span>
      </div>
    </div>
    <div v-if="summary.hasRiskScore" class="sd-stat">
      <label>Current Risk Score</label>
      <strong class="sd-risk-value" :style="{ color: summary.riskColor }">
        {{ summary.riskScore }} <small>/ 100</small>
      </strong>
      <span
        v-if="summary.riskBand"
        class="sd-risk-band"
        :style="{ color: summary.riskColor }"
      >
        {{ summary.riskBand }}
      </span>
    </div>
    <div v-if="summary.attemptCount" class="sd-stat">
      <label>Total Attempts</label><strong>{{ summary.attemptCount }}</strong>
    </div>
    <div v-if="summary.latestAttempt" class="sd-stat">
      <label>{{ summary.latestAttempt.label }}</label>
      <strong :title="summary.latestAttempt.title">{{
        summary.latestAttempt.primary
      }}</strong>
      <span v-if="summary.latestAttempt.timestamp">{{
        summary.latestAttempt.timestamp
      }}</span>
      <span v-if="summary.latestAttempt.secondary">{{
        summary.latestAttempt.secondary
      }}</span>
    </div>
  </section>
</template>

<script>
export default {
  name: "SessionProfileSummary",
  props: {
    summary: { type: Object, required: true },
  },
  methods: {
    compactSessionId(sessionId) {
      const value = String(sessionId || "");
      return value.length > 16
        ? `${value.slice(0, 8)}…${value.slice(-6)}`
        : value;
    },
    async copySessionId(sessionId) {
      const value = String(sessionId || "");
      if (!value) return;

      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(value);
          return;
        }
      } catch {
        // Fall back for browsers that deny Clipboard API access.
      }

      const input = document.createElement("textarea");
      input.value = value;
      input.setAttribute("readonly", "");
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
    },
  },
};
</script>

<style scoped>
.sd-profile-card {
  align-items: stretch;
  background: #fff;
  border: 1px solid #dbe3ef;
  border-radius: 9px;
  display: flex;
  margin-bottom: 16px;
  padding: 18px;
}
.sd-avatar {
  align-items: center;
  align-self: center;
  background: #e8edf5;
  border-radius: 50%;
  color: #52658a;
  display: flex;
  flex: 0 0 58px;
  font-size: 20px;
  font-weight: 700;
  height: 58px;
  justify-content: center;
}
.sd-profile-main {
  align-self: center;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex: 1 1 260px;
  flex-direction: column;
  margin-left: 16px;
  min-width: 180px;
  padding-right: 20px;
}
.sd-profile-main strong {
  color: #14214a;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.sd-profile-main span,
.sd-stat label {
  color: #7180a5;
  font-size: 12px;
  margin-top: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.sd-stat {
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex: 1 1 135px;
  flex-direction: column;
  justify-content: flex-start;
  padding: 4px 22px 0;
}
.sd-stat:last-child {
  border-right: 0;
}
.sd-stat label {
  font-size: 11px;
  margin-bottom: 8px;
  margin-top: 0;
}
.sd-stat strong {
  color: #172554;
  font-size: 14px;
}
.sd-status {
  align-self: flex-start;
  background: #f1f5f9;
  border-radius: 5px;
  color: #64748b;
  font-size: 13px;
  font-weight: 700;
  padding: 5px 9px;
}
.sd-status.passed {
  background: rgba(78, 201, 107, 0.12);
  color: var(--sd-success);
}
.sd-status.failed {
  background: rgba(243, 6, 6, 0.1);
  color: var(--sd-danger);
}
.sd-status.review {
  background: rgba(255, 193, 7, 0.14);
  color: #856404;
}
.sd-status.expired {
  background: rgba(108, 117, 125, 0.12);
  color: var(--sd-secondary);
}
.sd-current-status-row {
  align-items: center;
  display: flex;
}
.sd-session-id {
  align-items: center;
  display: flex;
  gap: 3px;
}
.sd-session-id button {
  background: transparent;
  border: 0;
  color: #52658a;
  cursor: pointer;
  line-height: 1;
  padding: 0;
}
.sd-session-id button:hover {
  color: #1d4ed8;
}
.sd-risk-value {
  display: inline-block;
  font-size: 19px !important;
}
.sd-risk-value small {
  color: #52658a;
  font-size: 0.55em;
}
.sd-risk-band {
  background: #edfdf3;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 800;
  margin-top: 4px;
  padding: 3px 7px;
  text-transform: uppercase;
  width: fit-content;
}
@media (max-width: 1100px) {
  .sd-profile-card {
    flex-wrap: wrap;
  }
  .sd-stat {
    border-top: 1px solid #e2e8f0;
    margin-top: 16px;
    padding-top: 14px;
  }
}
@media (max-width: 700px) {
  .sd-profile-main {
    border-right: 0;
  }
  .sd-stat {
    border-right: 0;
    flex-basis: 50%;
    padding: 12px 8px 0;
  }
}
</style>
