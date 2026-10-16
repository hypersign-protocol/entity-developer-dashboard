<template>
  <!-- Audit trail of the company's status: every status change, admin decision and
       compliance finding, newest first -->
  <aside class="status-history" aria-labelledby="status-history-title">
    <header class="sh-header">
      <h3 id="status-history-title">Decision history</h3>
      <span v-if="entries.length" class="sh-count">{{ entries.length }}</span>
    </header>

    <ol v-if="entries.length" class="sh-timeline">
      <li v-for="(entry, index) in entries" :key="index" class="sh-entry" :class="[`kind-${entry.kind}`, `tone-${entry.tone}`]">
        <span class="sh-dot" aria-hidden="true"></span>

        <div class="sh-head">
          <span v-if="entry.kind === 'finding'" class="sh-badge tone-review">
            <i class="mdi mdi-alert-outline" aria-hidden="true"></i> Compliance finding
          </span>
          <span v-else-if="entry.status" class="sh-badge" :class="`tone-${entry.tone}`">{{ entry.statusLabel }}</span>
          <span v-else class="sh-badge tone-neutral">Reason</span>
        </div>

        <p v-if="entry.reasonText" class="sh-reason">{{ entry.reasonText }}</p>

        <p class="sh-meta">
          <template v-if="entry.ownerLabel">
            <span>
              <i class="mdi" :class="entry.ownerIcon" aria-hidden="true"></i>
              {{ entry.ownerLabel }}
            </span>
            <span class="sh-dot-sep" aria-hidden="true">·</span>
          </template>
          <time v-if="entry.time" :datetime="entry.time" :title="entry.timeFull">{{ entry.timeLabel }}</time>
          <span v-else class="sh-muted">Earlier</span>
        </p>
      </li>
    </ol>

    <p v-else class="sh-empty">No status changes recorded yet.</p>
  </aside>
</template>

<script>
import {
  SYSTEM_OWNER,
  classifyStatusEntries,
  describeStatusReason,
  normalizeStatusReasons,
} from '../../utils/statusReasons.js';

const STATUS = {
  Submitted: { label: 'Submitted', tone: 'neutral' },
  InProgress: { label: 'In Progress', tone: 'info' },
  Completed: { label: 'Completed', tone: 'info' },
  Approved: { label: 'Approved', tone: 'passed' },
  Rejected: { label: 'Rejected', tone: 'failed' },
};

export default {
  name: 'StatusHistory',
  props: {
    company: { type: Object, default: () => ({}) },
  },
  computed: {
    currentUserId() {
      const user = this.$store.getters['mainStore/getUserDetails'] || {};
      return user.userId || user.id || user._id || '';
    },
    entries() {
      const company = this.company || {};
      const history = company.statusReasonHistory || normalizeStatusReasons(company.statusReason);
      // Classify oldest-first (each entry is read against the one before it), show newest first
      return classifyStatusEntries(history).reverse().map(entry => {
        const status = STATUS[entry.status] || { label: entry.status, tone: 'neutral' };
        return {
          ...entry,
          statusLabel: status.label,
          tone: entry.kind === 'finding' ? 'review' : status.tone,
          reasonText: entry.reason ? describeStatusReason(entry.reason) : '',
          ...this.owner(entry),
          timeLabel: entry.time ? this.formatTime(entry.time) : '',
          timeFull: entry.time ? new Date(entry.time).toString() : '',
        };
      });
    },
  },
  methods: {
    // Admin entries only carry a userId; there's no name lookup yet
    owner(entry) {
      if (!entry.owner) return { ownerLabel: '', ownerIcon: '' };
      if (entry.owner === SYSTEM_OWNER) return { ownerLabel: 'By System', ownerIcon: 'mdi-robot-outline' };
      if (this.currentUserId && entry.owner === this.currentUserId) return { ownerLabel: 'By You', ownerIcon: 'mdi-account-outline' };
      return { ownerLabel: 'By Admin', ownerIcon: 'mdi-account-tie-outline' };
    },
    formatTime(value) {
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return '';
      return date.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    },
  },
};
</script>

<style scoped>
.status-history {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  display: flex;
  flex-direction: column;
  /* Height cap (same as the tab content panel's 70vh): the header stays put and the
     timeline scrolls inside it. The only max-height on this panel; don't set another. */
  max-height: 70vh;
  padding: 18px 18px 8px;
}

.sh-header {
  align-items: center;
  flex: 0 0 auto;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  gap: 8px;
  margin-bottom: 14px;
  padding-bottom: 10px;
}

.sh-header h3 {
  color: #111827;
  font-size: 0.95rem;
  font-weight: 700;
  margin: 0;
}

.sh-count {
  background: #f1f5f9;
  border-radius: 999px;
  color: #475569;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 1px 8px;
}

/* Timeline */
.sh-timeline {
  flex: 1 1 auto;
  list-style: none;
  margin: 0;
  min-height: 0;
  overflow-y: auto;
  /* Room so the dots (which sit on the left edge) aren't clipped by the scroll area */
  padding: 2px 4px 0 2px;
}

.sh-entry {
  border-left: 2px solid #e2e8f0;
  margin-left: 5px;
  padding: 0 0 16px 16px;
  position: relative;
}

.sh-entry:last-child {
  border-left-color: transparent;
}

.sh-dot {
  background: #cbd5e1;
  border: 2px solid #ffffff;
  border-radius: 50%;
  height: 12px;
  left: -7px;
  position: absolute;
  top: 3px;
  width: 12px;
}

.sh-entry.tone-passed .sh-dot { background: #4ec96b; }
.sh-entry.tone-failed .sh-dot { background: #dc2626; }
.sh-entry.tone-info .sh-dot { background: #2563eb; }
.sh-entry.tone-review .sh-dot { background: #d97706; }

.sh-head {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

/* Same tones as the status pill in the summary card */
.sh-badge {
  align-items: center;
  border-radius: 5px;
  display: inline-flex;
  font-size: 11px;
  font-weight: 700;
  gap: 3px;
  padding: 2px 7px;
}

.sh-badge.tone-neutral { background: #f1f5f9; color: #64748b; }
.sh-badge.tone-info { background: #eff6ff; color: #1d4ed8; }
.sh-badge.tone-passed { background: rgba(78, 201, 107, 0.12); color: #2f9e4f; }
.sh-badge.tone-failed { background: rgba(243, 6, 6, 0.08); color: #c81e1e; }
.sh-badge.tone-review { background: rgba(255, 193, 7, 0.16); color: #856404; }

.sh-reason {
  color: #1f2937;
  font-size: 13px;
  line-height: 1.5;
  margin: 6px 0 0;
  overflow-wrap: anywhere;
  white-space: pre-line;
}

/* Admin decisions stand out: they're the entries people look for */
.kind-decision .sh-reason {
  background: #f8fafc;
  border-radius: 6px;
  padding: 6px 8px;
}

.sh-meta {
  align-items: center;
  color: #64748b;
  display: flex;
  flex-wrap: wrap;
  font-size: 11.5px;
  gap: 4px;
  margin: 6px 0 0;
}

.sh-meta .mdi {
  font-size: 13px;
}

.sh-dot-sep {
  color: #cbd5e1;
}

.sh-muted {
  font-style: italic;
}

.sh-empty {
  color: #64748b;
  font-size: 13px;
  margin: 0 0 10px;
}
</style>
