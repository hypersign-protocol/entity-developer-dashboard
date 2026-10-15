<template>
  <div class="checks-regulations">
    <SectionLoader v-if="isLoading" label="Loading compliance data" min-height="calc(70vh - 4rem)" />

    <empty-container v-else-if="!complianceChecks.length" title="No Compliance Data Available" icon="mdi mdi-shield-check-outline"
      description="Compliance checks have not been performed for this company yet." />

    <div v-else>
      <!-- One tab per check (same tab style as the KYB widget configuration) -->
      <nav class="check-tabs" role="tablist" aria-label="Compliance checks">
        <button
          v-for="check in complianceChecks"
          :key="check.key"
          type="button"
          role="tab"
          class="check-tab"
          :class="{ active: activeCheck.key === check.key }"
          :aria-selected="activeCheck.key === check.key ? 'true' : 'false'"
          @click="selectedCheckKey = check.key"
        >
          <i class="mdi" :class="check.icon" aria-hidden="true"></i>
          {{ check.shortName }}
          <span class="tab-status-dot" :class="`is-${check.status}`" :title="statusLabel(check.status)"></span>
        </button>
      </nav>

      <section class="check-panel" role="tabpanel">
        <header class="check-header">
          <span class="check-icon" :class="`is-${activeCheck.status}`" aria-hidden="true">
            <i class="mdi" :class="activeCheck.icon"></i>
          </span>
          <div class="check-info">
            <h3>{{ activeCheck.name }}</h3>
            <p>{{ activeCheck.description }}</p>
          </div>
          <span class="check-status" :class="`is-${activeCheck.status}`">
            <i class="mdi" :class="statusIcon(activeCheck.status)" aria-hidden="true"></i>
            {{ statusLabel(activeCheck.status) }}
          </span>
        </header>

        <dl class="check-meta">
          <div>
            <dt>Last run</dt>
            <dd>{{ formatDate(activeCheck.lastRun) }}</dd>
          </div>
          <div v-if="activeCheck.reasonText">
            <dt>Reason</dt>
            <dd>{{ activeCheck.reasonText }}</dd>
          </div>
        </dl>

        <!-- Result: a finding when the check failed, otherwise the outcome -->
        <div class="check-result" :class="`is-${activeCheck.status}`">
          <i class="mdi" :class="statusIcon(activeCheck.status)" aria-hidden="true"></i>
          <div>
            <strong>{{ resultTitle(activeCheck) }}</strong>
            <div class="markdown" v-html="renderMarkdown(activeCheck.resultText)"></div>
            <div v-for="(issue, index) in activeCheck.issues" :key="index" class="markdown issue" v-html="renderMarkdown(issue)"></div>
          </div>
        </div>

        <div v-if="activeCheck.recommendations.length" class="check-next-steps">
          <h4>Recommended next steps</h4>
          <ul>
            <li v-for="(step, index) in activeCheck.recommendations" :key="index">
              <i class="mdi mdi-arrow-right-circle-outline" aria-hidden="true"></i>{{ step }}
            </li>
          </ul>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { marked } from 'marked';
import { mapGetters, mapActions } from 'vuex';
import config from '../../config.js';
import SectionLoader from '../element/SectionLoader.vue';

const CHECKS = [
  {
    key: 'registryCheck',
    name: 'Business Registry Verification',
    shortName: 'Business Registry',
    description: 'Checks the company against the official government business registry.',
    icon: 'mdi-bank-outline',
    recommendations: 'REGISTRY_CHECK',
    passedText: 'The business was found in the official registry and its details match.',
    failedText: 'Registry verification failed.',
  },
  {
    key: 'sanctionListCheck',
    name: 'Sanctions List Screening',
    shortName: 'Sanctions',
    description: 'Screens the company against international sanctions lists.',
    icon: 'mdi-shield-alert-outline',
    recommendations: 'SANCTIONS_CHECK',
    passedText: 'No matches were found in the sanctions databases.',
    failedText: 'Sanctions screening failed.',
  },
  {
    key: 'adverseMediaCheck',
    name: 'Adverse Media Screening',
    shortName: 'Adverse Media',
    description: 'Screens for negative media coverage and reputation risks.',
    icon: 'mdi-newspaper-variant-outline',
    recommendations: 'ADVERSE_MEDIA_CHECK',
    passedText: 'No adverse media coverage was found.',
    failedText: 'Adverse media coverage was detected.',
    // The provider's detail is the coverage found; show it as an item under the finding
    detailAsIssue: true,
  },
];

function escapeHtml(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

const safeRenderer = new marked.Renderer();
safeRenderer.html = () => '';
safeRenderer.image = (href, title, text) => text || '';
safeRenderer.link = (href, title, text) => {
  if (!/^(https?:|mailto:)/i.test(href || '')) return text;
  const safeHref = String(href).replace(/"/g, '%22');
  return `<a href="${safeHref}" target="_blank" rel="noopener noreferrer">${text}</a>`;
};

export default {
  name: "ChecksRegulations",
  components: { SectionLoader },
  props: {
    company: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      isLoading: false,
      selectedCheckKey: '',
    }
  },
  computed: {
    ...mapGetters('mainStore', ['getComplianceData']),
    
    // The three checks, in the same order and with the same icons as the KYB widget config
    complianceChecks() {
      const data = this.getComplianceData;
      if (!data) return [];
      return CHECKS
        .filter(definition => data[definition.key])
        .map(definition => {
          const result = data[definition.key];
          const status = this.formatStatus(result.status);
          const passed = status === 'passed';
          const recommendations = config.COMPLIANCE_RECOMMENDATIONS[definition.recommendations] || {};
          return {
            ...definition,
            status,
            lastRun: result.updatedAt,
            reasonText: !passed && result.reason ? (config.COMPLIANCE_CHECK_FAILURE_REASONS[result.reason] || result.reason) : '',
            resultText: passed ? definition.passedText : (definition.detailAsIssue ? definition.failedText : (result.reasonDetail || definition.failedText)),
            issues: status === 'failed' && definition.detailAsIssue && result.reasonDetail ? [result.reasonDetail] : [],
            recommendations: (passed ? recommendations.SUCCESS : recommendations.FAILED) || [],
          };
        });
    },
    // Opens on the first failed check, so problems are seen first
    activeCheck() {
      return this.complianceChecks.find(check => check.key === this.selectedCheckKey)
        || this.complianceChecks.find(check => check.status === 'failed')
        || this.complianceChecks[0];
    },
  },
  watch: {
    'company.companyId': {
      immediate: true,
      async handler(newCompanyId, oldCompanyId) {
        if (oldCompanyId && newCompanyId !== oldCompanyId) {
          // Clear stale data from previous company immediately (the header summary clears it on page load)
          this.$store.commit('mainStore/clearComplianceData');
        }
        if (newCompanyId) {
          await this.fetchComplianceData();
        }
      }
    }
  },
  
  methods: {
    ...mapActions('mainStore', ['checkComplianceStatus']),
    
    async fetchComplianceData() {
      if (!this.company || !this.company.companyId) return;
      
      try {
        this.isLoading = true;
        await this.checkComplianceStatus({ companyId: this.company.companyId });
      } catch (error) {
        console.error('Error fetching compliance data:', error);
        // Handle error appropriately - could show toast notification
      } finally {
        this.isLoading = false;
      }
    },

    formatStatus(apiStatus) {
      const statusMap = { Success: 'passed', Failed: 'failed', Pending: 'pending' };
      return statusMap[apiStatus] || 'pending';
    },

    statusLabel(status) {
      return { passed: 'Passed', failed: 'Failed', pending: 'Pending' }[status] || 'Pending';
    },

    statusIcon(status) {
      return { passed: 'mdi-check-circle', failed: 'mdi-close-circle', pending: 'mdi-progress-clock' }[status] || 'mdi-progress-clock';
    },

    resultTitle(check) {
      if (check.status === 'passed') return 'No issues found';
      if (check.status === 'failed') return 'Finding';
      return 'Check in progress';
    },

    formatDate(dateString) {
      if (!dateString) return 'N/A';
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    },

    // Results come from the backend / screening providers: escape raw HTML and only keep
    // http(s) and mailto links before rendering the markdown
    renderMarkdown(content) {
      if (!content) return '';
      return marked.parse(escapeHtml(String(content)), { renderer: safeRenderer, breaks: true, gfm: true });
    }
  }
}
</script>

<style scoped>
.checks-regulations {
  max-width: 1100px;
}

/* Tabs: same underline style as the KYB widget configuration tabs */
.check-tabs {
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  gap: 24px;
  margin-bottom: 20px;
  overflow-x: auto;
}

.check-tab {
  align-items: center;
  background: transparent;
  border: 0;
  border-bottom: 2px solid transparent;
  color: #64748b;
  display: inline-flex;
  font-size: 13px;
  font-weight: 500;
  gap: 6px;
  padding: 12px 2px 10px;
  white-space: nowrap;
}

.check-tab .mdi {
  font-size: 16px;
}

.check-tab:hover:not(.active) {
  color: #111827;
}

.check-tab.active {
  border-bottom-color: #2563eb;
  color: #2563eb;
  font-weight: 600;
}

.check-tab:focus {
  outline: none;
}

.check-tab:focus-visible {
  border-radius: 4px;
  box-shadow: 0 0 0 2px #bfdbfe;
}

.tab-status-dot {
  border-radius: 50%;
  height: 7px;
  width: 7px;
}

.tab-status-dot.is-passed { background: #4ec96b; }
.tab-status-dot.is-failed { background: #dc2626; }
.tab-status-dot.is-pending { background: #d97706; }

/* Panel */
.check-header {
  align-items: flex-start;
  display: flex;
  gap: 14px;
}

/* Icon tile, same as the widget configuration's compliance check cards */
.check-icon {
  align-items: center;
  background: #f1f5f9;
  border-radius: 10px;
  color: #475569;
  display: inline-flex;
  flex: 0 0 auto;
  font-size: 22px;
  height: 44px;
  justify-content: center;
  width: 44px;
}

.check-icon.is-passed { background: #eaf8f0; color: #2f9e4f; }
.check-icon.is-failed { background: #fef2f2; color: #c81e1e; }
.check-icon.is-pending { background: #fffbeb; color: #b45309; }

.check-info {
  flex: 1;
  min-width: 0;
}

.check-info h3 {
  color: #111827;
  font-size: 1rem;
  font-weight: 700;
  margin: 0 0 2px;
}

.check-info p {
  color: #64748b;
  font-size: 0.8125rem;
  margin: 0;
}

/* Status pill: same tones as the status pill in the summary card */
.check-status {
  align-items: center;
  border-radius: 5px;
  display: inline-flex;
  flex: 0 0 auto;
  font-size: 12px;
  font-weight: 700;
  gap: 4px;
  padding: 4px 9px;
}

.check-status.is-passed { background: rgba(78, 201, 107, 0.12); color: #2f9e4f; }
.check-status.is-failed { background: rgba(243, 6, 6, 0.08); color: #c81e1e; }
.check-status.is-pending { background: rgba(255, 193, 7, 0.16); color: #856404; }

.check-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 40px;
  margin: 20px 0;
  padding: 14px 0;
  border-top: 1px solid #f1f5f9;
  border-bottom: 1px solid #f1f5f9;
}

.check-meta dt {
  color: #64748b;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.check-meta dd {
  color: #111827;
  font-size: 0.875rem;
  font-weight: 500;
  margin: 4px 0 0;
}

/* Result callout */
.check-result {
  border: 1px solid;
  border-radius: 10px;
  display: flex;
  gap: 10px;
  padding: 14px 16px;
}

.check-result > .mdi {
  font-size: 18px;
  line-height: 1.2;
}

.check-result strong {
  display: block;
  font-size: 0.875rem;
  margin-bottom: 2px;
}

.check-result.is-passed { background: #f3fbf6; border-color: #c9ecd6; color: #1f7a43; }
.check-result.is-failed { background: #fef6f6; border-color: #f6cfcf; color: #b42318; }
.check-result.is-pending { background: #fffbeb; border-color: #fde68a; color: #92400e; }

.markdown {
  color: #1f2937;
  font-size: 0.875rem;
  line-height: 1.55;
  overflow-wrap: anywhere;
}

.markdown >>> p {
  margin: 0;
}

.markdown >>> p + p {
  margin-top: 6px;
}

.markdown >>> a {
  color: #2563eb;
}

.markdown.issue {
  border-top: 1px dashed rgba(180, 35, 24, 0.25);
  margin-top: 10px;
  padding-top: 10px;
}

/* Next steps */
.check-next-steps {
  margin-top: 20px;
}

.check-next-steps h4 {
  color: #64748b;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  margin: 0 0 10px;
  text-transform: uppercase;
}

.check-next-steps ul {
  display: grid;
  gap: 8px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.check-next-steps li {
  align-items: flex-start;
  color: #344054;
  display: flex;
  font-size: 0.875rem;
  gap: 8px;
  line-height: 1.45;
}

.check-next-steps li .mdi {
  color: #2563eb;
  font-size: 16px;
  line-height: 1.3;
}

@media (max-width: 600px) {
  .check-header {
    flex-wrap: wrap;
  }
}
</style>