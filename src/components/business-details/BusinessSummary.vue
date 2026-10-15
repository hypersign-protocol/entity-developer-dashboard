<template>
  <div class="business-summary">
    <!-- Profile card, modelled on SessionProfileSummary (User Detail page) -->
    <section class="bs-profile-card">
      <div class="bs-avatar" aria-hidden="true">{{ initials }}</div>
      <div class="bs-profile-main">
        <strong :title="company?.companyName">{{ company?.companyName || 'Unnamed business' }}</strong>
        <span v-if="company?.companyId" class="bs-identifier" :title="company.companyId">
          <span class="bs-identifier-value">Company ID: {{ compactIdentifier(company.companyId) }}</span>
          <button type="button" title="Copy company ID" @click.stop="copyId">
            <i class="mdi mdi-content-copy"></i>
          </button>
        </span>
        <span v-if="hasValue(company?.domain)" class="bs-domain">{{ company.domain }}</span>
      </div>

      <div class="bs-stat">
        <label>Current Status</label>
        <span class="bs-status" :class="statusBadge.tone">{{ statusBadge.label }}</span>
      </div>

      <button
        v-for="stat in stats"
        :key="stat.tab"
        type="button"
        class="bs-stat is-link"
        :title="`Open ${stat.label}`"
        @click="$emit('navigate', stat.tab)"
      >
        <label>{{ stat.label }}</label>
        <v-progress-circular v-if="stat.loading" indeterminate color="primary" size="16" width="2"></v-progress-circular>
        <template v-else>
          <strong class="bs-stat-value">{{ stat.value }}<small v-if="stat.suffix"> {{ stat.suffix }}</small></strong>
          <span v-if="stat.note" class="bs-note" :class="stat.tone">{{ stat.note }}</span>
        </template>
      </button>

      <div class="bs-stat">
        <label>Submitted</label>
        <strong>{{ formatDate(company?.createdAt) }}</strong>
        <span class="bs-muted">Updated {{ formatDate(company?.updatedAt) }}</span>
      </div>
    </section>

  </div>
</template>

<script>
import { describeStatusReason } from '../../utils/statusReasons.js';
import UtilsMixin from '../../mixins/utils';

// Status pill tones reuse the User Detail page's colours
const STATUS_BADGES = {
  Submitted: { label: 'Submitted', tone: '' },
  InProgress: { label: 'In Progress', tone: 'info' },
  Completed: { label: 'Completed', tone: 'info' },
  Approved: { label: 'Approved', tone: 'passed' },
  Rejected: { label: 'Rejected', tone: 'failed' },
};

// Compliance checks returned by /compliance
const COMPLIANCE_CHECKS = ['registryCheck', 'sanctionListCheck', 'adverseMediaCheck'];
const FAILED_KYC = ['Failed', 'Failure', 'Expired'];
// Placeholders the store uses for missing values
const EMPTY_VALUES = ['', 'N/A', 'Unknown'];

// Always-visible summary for the business details header. It loads the UBO and compliance
// data the tabs also show, so the numbers are there whichever tab is open.
export default {
  name: 'BusinessSummary',
  mixins: [UtilsMixin],
  props: {
    company: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      loadingUbos: false,
      loadingCompliance: false,
      uboError: false,
      complianceError: false,
    };
  },
  computed: {
    initials() {
      const name = (this.company && this.company.companyName) || '';
      const words = name.trim().split(/\s+/).filter(Boolean);
      return (words.slice(0, 2).map(word => word[0]).join('') || '?').toUpperCase();
    },
    statusReasons() {
      const reasons = (this.company && this.company.statusReasons) || [];
      return reasons.map(describeStatusReason);
    },
    hasIssues() {
      return this.company?.status === 'Completed' && this.statusReasons.length > 0;
    },
    statusBadge() {
      if (this.hasIssues) return { label: 'Needs Review', tone: 'review' };
      const status = this.company?.status;
      return STATUS_BADGES[status] || { label: status || 'Unknown', tone: '' };
    },
    uboStat() {
      const ubos = this.$store.getters['mainStore/getCompanyExecutives'] || [];
      const total = ubos.length;
      const verified = ubos.filter(ubo => ubo.kycSteps && ubo.kycSteps.status === 'Success').length;
      const failed = ubos.filter(ubo => ubo.kycSteps && FAILED_KYC.includes(ubo.kycSteps.status)).length;
      const stat = { tab: 'ubo-details', label: 'UBOs Verified', loading: this.loadingUbos, value: '0', suffix: '', note: '', tone: '' };
      if (this.uboError) return { ...stat, value: '—', note: "Couldn't load" };
      if (!total) return { ...stat, note: 'None added yet' };
      stat.value = String(verified);
      stat.suffix = `/ ${total}`;
      if (failed) return { ...stat, note: `${failed} failed`, tone: 'failed' };
      if (verified === total) return { ...stat, note: 'All verified', tone: 'passed' };
      return { ...stat, note: `${total - verified} pending`, tone: 'review' };
    },
    complianceStat() {
      const data = this.$store.getters['mainStore/getComplianceData'];
      const checks = COMPLIANCE_CHECKS.map(key => data && data[key]).filter(Boolean);
      const passed = checks.filter(check => check.status === 'Success').length;
      const failed = checks.filter(check => check.status === 'Failed').length;
      const stat = { tab: 'checks-regulations', label: 'Compliance Checks', loading: this.loadingCompliance, value: '0', suffix: '', note: '', tone: '' };
      if (this.complianceError) return { ...stat, value: '—', note: "Couldn't load" };
      if (!checks.length) return { ...stat, note: 'Not run yet' };
      stat.value = String(passed);
      stat.suffix = `/ ${checks.length} passed`;
      if (failed) return { ...stat, note: `${failed} flagged`, tone: 'failed' };
      if (passed === checks.length) return { ...stat, note: 'All clear', tone: 'passed' };
      return { ...stat, note: `${checks.length - passed - failed} pending`, tone: 'review' };
    },
    documentStat() {
      const count = ((this.company && this.company.documents) || []).length;
      return {
        tab: 'documents', label: 'Documents', loading: false, value: String(count), suffix: '',
        note: count ? 'Uploaded' : 'None uploaded', tone: '',
      };
    },
    stats() {
      return [this.uboStat, this.complianceStat, this.documentStat];
    },
  },
  watch: {
    'company.companyId': {
      immediate: true,
      handler(companyId, previousId) {
        if (companyId !== previousId) {
          // Don't show the previous company's numbers while the new ones load
          this.$store.commit('mainStore/clearCompanyExecutives');
          this.$store.commit('mainStore/clearComplianceData');
        }
        if (companyId) {
          this.loadUbos(companyId);
          this.loadCompliance(companyId);
        }
      }
    }
  },
  methods: {
    async loadUbos(companyId) {
      this.loadingUbos = true;
      this.uboError = false;
      try {
        await this.$store.dispatch('mainStore/fetchCompanyExecutives', { companyId });
      } catch (error) {
        console.error('Error fetching company executives:', error);
        this.uboError = true;
      } finally {
        this.loadingUbos = false;
      }
    },

    async loadCompliance(companyId) {
      this.loadingCompliance = true;
      this.complianceError = false;
      try {
        await this.$store.dispatch('mainStore/checkComplianceStatus', { companyId });
      } catch (error) {
        console.error('Error fetching compliance data:', error);
        this.complianceError = true;
      } finally {
        this.loadingCompliance = false;
      }
    },

    hasValue(value) {
      return value !== undefined && value !== null && !EMPTY_VALUES.includes(String(value).trim());
    },

    compactIdentifier(identifier) {
      const value = String(identifier || '');
      return value.length > 16 ? `${value.slice(0, 8)}…${value.slice(-6)}` : value;
    },

    copyId() {
      navigator.clipboard.writeText(this.company.companyId)
        .then(() => this.notifySuccess('Company ID copied!'))
        .catch(() => this.notifyErr('Could not copy the company ID.'));
    },

    formatDate(dateString) {
      if (!dateString) return 'Not available';
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    },
  }
};
</script>

<style scoped>
/* Colours and spacing follow SessionProfileSummary so both detail pages read the same */
.business-summary {
  --bs-success: #4ec96b;
  --bs-danger: rgba(243, 6, 6, 0.736);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.bs-profile-card {
  align-items: stretch;
  background: #fff;
  border: 1px solid #dbe3ef;
  border-radius: 9px;
  display: flex;
  padding: 18px;
}

.bs-avatar {
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

.bs-profile-main {
  align-self: center;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex: 1 1 260px;
  flex-direction: column;
  margin-left: 16px;
  min-width: 180px;
  padding-right: 20px;
}

.bs-profile-main strong {
  color: #14214a;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.bs-profile-main > span {
  color: #7180a5;
  font-size: 12px;
  margin-top: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.bs-identifier {
  align-items: center;
  display: flex;
  gap: 3px;
}

.bs-identifier-value {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

.bs-identifier button {
  background: transparent;
  border: 0;
  color: #52658a;
  cursor: pointer;
  flex: 0 0 auto;
  line-height: 1;
  padding: 0;
}

.bs-identifier button:hover {
  color: #1d4ed8;
}

/* Stats */
.bs-stat {
  align-items: flex-start;
  background: transparent;
  border: 0;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex: 1 1 135px;
  flex-direction: column;
  justify-content: flex-start;
  padding: 4px 22px 0;
  text-align: left;
}

.bs-stat:last-child {
  border-right: 0;
}

.bs-stat label {
  color: #7180a5;
  cursor: inherit;
  font-size: 11px;
  margin: 0 0 8px;
  white-space: nowrap;
}

.bs-stat strong {
  color: #172554;
  font-size: 14px;
}

.bs-stat-value {
  font-size: 19px !important;
  line-height: 1.2;
}

.bs-stat-value small {
  color: #52658a;
  font-size: 0.6em;
  font-weight: 500;
}

.bs-stat.is-link {
  border-radius: 0;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.bs-stat.is-link:hover {
  background: #f8fafc;
}

.bs-stat.is-link:focus {
  outline: none;
}

.bs-stat.is-link:focus-visible {
  box-shadow: inset 0 0 0 2px #bfdbfe;
}

.bs-muted {
  color: #7180a5;
  font-size: 12px;
  margin-top: 4px;
}

.bs-note {
  background: #f1f5f9;
  border-radius: 4px;
  color: #52658a;
  font-size: 10px;
  font-weight: 800;
  margin-top: 6px;
  padding: 3px 7px;
  text-transform: uppercase;
}

.bs-note.passed { background: #edfdf3; color: var(--bs-success); }
.bs-note.failed { background: rgba(243, 6, 6, 0.08); color: var(--bs-danger); }
.bs-note.review { background: rgba(255, 193, 7, 0.14); color: #856404; }

/* Status pill (same as the User Detail page) */
.bs-status {
  background: #f1f5f9;
  border-radius: 5px;
  color: #64748b;
  font-size: 13px;
  font-weight: 700;
  padding: 5px 9px;
}

.bs-status.passed { background: rgba(78, 201, 107, 0.12); color: var(--bs-success); }
.bs-status.failed { background: rgba(243, 6, 6, 0.1); color: var(--bs-danger); }
.bs-status.review { background: rgba(255, 193, 7, 0.14); color: #856404; }
.bs-status.info { background: #eff6ff; color: #1d4ed8; }

@media (max-width: 1100px) {
  .bs-profile-card {
    flex-wrap: wrap;
  }

  .bs-stat {
    border-top: 1px solid #e2e8f0;
    margin-top: 16px;
    padding-top: 14px;
  }
}

@media (max-width: 700px) {
  .bs-profile-main {
    border-right: 0;
  }

  .bs-stat {
    border-right: 0;
    flex-basis: 50%;
    padding: 12px 8px 0;
  }
}
</style>
