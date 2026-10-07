<template>
  <v-dialog
    v-model="isOpen"
    max-width="1040"
    content-class="kyc-credit-dialog"
    :retain-focus="true"
  >
    <section class="calculator-modal" role="dialog" aria-modal="true" aria-labelledby="credit-calculator-title">
      <header class="calculator-header">
        <div>
          <h2 id="credit-calculator-title">Credit Calculator</h2>
          <p>See how many verifications your remaining credits can cover.</p>
        </div>
        <button class="close-button" type="button" aria-label="Close credit calculator" @click="close">
          <v-icon>mdi-close</v-icon>
        </button>
      </header>

      <div class="calculator-layout">
        <div class="configuration-panel">
          <section class="calculator-step">
            <h3>1. What do you want to verify?</h3>
            <p>Choose one or more verification flows to see their services.</p>

            <div class="flow-grid" role="group" aria-label="Verification flows">
              <button
                v-for="flow in flows"
                :key="flow.id"
                type="button"
                class="flow-card"
                :class="{ selected: isFlowSelected(flow.id), locked: isFlowLocked(flow.id) }"
                :aria-pressed="isFlowSelected(flow.id) ? 'true' : 'false'"
                :disabled="isFlowLocked(flow.id)"
                @click="toggleFlow(flow.id)"
              >
                <span class="flow-icon"><v-icon>{{ flow.icon }}</v-icon></span>
                <span class="flow-checkbox" aria-hidden="true"><v-icon small>mdi-check</v-icon></span>
                <strong>{{ flow.title }}</strong>
                <small>{{ flow.description }}</small>
                <em v-if="isFlowLocked(flow.id)">Required by UBO Verification</em>
              </button>
            </div>
          </section>

          <section class="calculator-step service-step">
            <h3>2. Select services</h3>
            <p>{{ selectedFlows.length ? 'Review the services included in each verification.' : 'Select one or more verification flows first.' }}</p>

            <div v-if="selectedFlows.length" class="selected-flow-services">
              <section v-for="flow in selectedFlows" :key="flow.id" class="service-group">
                <div class="service-group-heading">
                  <v-icon small>{{ flow.icon }}</v-icon>
                  <strong>{{ flow.title }}</strong>
                </div>
                <div class="service-list">
                  <div
                    v-for="service in flow.services"
                    :key="service.id"
                    class="service-row"
                    :class="{ selected: selectedServiceIds.includes(service.id), required: service.required }"
                    @click="toggleService(service)"
                  >
                    <span class="service-toggle">
                      <input
                        type="checkbox"
                        :checked="selectedServiceIds.includes(service.id)"
                        :disabled="service.required"
                        :aria-label="`${service.title}${service.required ? ', required' : ''}`"
                        @click.stop
                        @change="toggleService(service)"
                      >
                      <span class="service-check" aria-hidden="true"><v-icon small>mdi-check</v-icon></span>
                    </span>
                    <span class="service-icon"><v-icon>{{ service.icon }}</v-icon></span>
                    <span class="service-copy">
                      <strong>
                        {{ service.title }}
                        <span v-if="service.required" class="required-label">Required</span>
                      </strong>
                      <small>{{ service.description }}</small>
                      <em v-if="service.note" @click.stop>
                        <v-icon x-small>mdi-information-outline</v-icon>{{ service.note }}
                      </em>
                    </span>
                    <span class="credit-pill">{{ serviceCost(service) }} {{ serviceCost(service) === 1 ? 'credit' : 'credits' }}</span>
                  </div>
                </div>
              </section>
            </div>

            <div v-else class="service-placeholder">
              <v-icon>mdi-cursor-default-click-outline</v-icon>
              Choose one or more flows above to configure their services.
            </div>
          </section>
        </div>

        <aside class="estimate-panel" aria-live="polite">
          <div class="summary-card credits-card">
            <span class="summary-icon"><v-icon>mdi-database-outline</v-icon></span>
            <div>
              <span>Available Credits</span>
              <strong>{{ numberFormat(remainingCredits) }}</strong>
              <small>/ {{ numberFormat(totalCredits) }} credits</small>
            </div>
          </div>

          <v-icon class="estimate-arrow">mdi-arrow-down</v-icon>

          <div class="summary-card estimate-card" :class="{ empty: creditsPerVerification === 0 }">
            <span class="summary-icon"><v-icon>mdi-chart-bar</v-icon></span>
            <div>
              <span>Estimated verifications</span>
              <strong>{{ creditsPerVerification ? numberFormat(estimatedVerifications) : '—' }}</strong>
              <small v-if="creditsPerVerification">at {{ numberFormat(creditsPerVerification) }} credits per verification</small>
              <small v-else>Select at least one service</small>
            </div>
          </div>

          <button class="got-it-button" type="button" @click="saveConfiguration">
            <v-icon small>mdi-content-save-outline</v-icon>
            Save configuration
          </button>
        </aside>
      </div>

    </section>
  </v-dialog>
</template>

<script>
import creditCatalog from '../../catalogs/catalog.kyc.json';

const flows = [
  {
    id: 'india',
    title: 'India Identity Verification',
    description: 'Verify individuals in India using Aadhaar-based services.',
    icon: 'mdi-account-outline',
    services: [
      {
        id: 'aadhaar-face-match',
        title: 'Aadhaar Face Match',
        description: "Match the user's selfie against their Aadhaar photo.",
        icon: 'mdi-face-recognition',
        routes: ['/api/v1/aadhaar/face/match'],
        defaultSelected: true
      },
      {
        id: 'aadhaar-verification',
        title: 'Aadhaar Verification',
        description: 'Verify Aadhaar using OTP or QR.',
        icon: 'mdi-card-account-details-outline',
        routes: ['/api/v1/aadhaar/otp/generate', '/api/v1/aadhaar/otp/verify'],
        defaultSelected: true,
        required: true
      }
    ]
  },
  {
    id: 'global',
    title: 'Global Identity Verification',
    description: 'Verify individuals internationally using identity documents and biometrics.',
    icon: 'mdi-earth',
    services: [
      {
        id: 'verification-session',
        title: 'Verification Session',
        description: 'Start and manage a secure verification session.',
        icon: 'mdi-cellphone-check',
        routes: ['/api/v2/session'],
        defaultSelected: true,
        required: true
      },
      {
        id: 'passive-liveness',
        title: 'Passive Liveness',
        description: 'Detect whether the user is a real, live person.',
        icon: 'mdi-face-recognition',
        routes: ['/api/v1/e-kyc/verification/passive-liveliness'],
        defaultSelected: true,
        required: true
      },
      {
        id: 'document-verification',
        title: 'Document Verification',
        description: 'Extract and verify information from passports and government-issued IDs.',
        icon: 'mdi-file-document-check-outline',
        routes: ['/api/v2/documents/extract'],
        defaultSelected: true
      },
      {
        id: 'age-verification',
        title: 'Age Verification',
        description: 'Verify whether the user meets a required age threshold.',
        icon: 'mdi-calendar-account-outline',
        routes: ['/api/v1/e-kyc/verification/zk-proof'],
        defaultSelected: false
      },
      {
        id: 'consent-capture',
        title: 'Consent Capture',
        description: 'Capture user consent for identity verification.',
        icon: 'mdi-file-sign',
        routes: ['/api/v2/consents'],
        defaultSelected: true,
        required: true
      }
    ]
  },
  {
    id: 'business',
    title: 'Business Verification',
    description: 'Verify companies and their ownership and compliance information.',
    icon: 'mdi-domain',
    services: [
      {
        id: 'business-data-capture',
        title: 'Business Data Capture',
        description: 'Collect company information and business registration documents.',
        icon: 'mdi-domain-plus',
        routes: ['/api/v1/e-kyb/verification/company'],
        defaultSelected: true,
        required: true
      },
      {
        id: 'ubo-verification',
        title: 'UBO Verification',
        description: 'Identify and verify ultimate beneficial owners.',
        note: 'Requires Global Identity Verification for the UBO.',
        icon: 'mdi-account-group-outline',
        routes: ['/api/v1/e-kyb/verification/company/:companyId/company-executives'],
        defaultSelected: true,
        required: true
      },
      {
        id: 'aml-screening',
        title: 'AML Screening',
        description: 'Screen against sanctions, watchlists, registries and adverse media.',
        icon: 'mdi-shield-search',
        routes: ['/api/v1/compliance'],
        defaultSelected: true,
        required: true
      }
    ]
  }
];

export default {
  name: 'KycCreditCalculator',
  props: {
    value: { type: Boolean, default: false },
    remainingCredits: { type: Number, default: 0 },
    totalCredits: { type: Number, default: 0 }
  },
  data() {
    return {
      flows,
      selectedFlowIds: [],
      selectedServiceIds: []
    };
  },
  computed: {
    isOpen: {
      get() { return this.value; },
      set(value) { this.$emit('input', value); }
    },
    selectedFlows() {
      return this.flows.filter(flow => this.selectedFlowIds.includes(flow.id));
    },
    selectedServices() {
      return this.selectedFlows.reduce((services, flow) => {
        return services.concat(flow.services.filter(service => this.selectedServiceIds.includes(service.id)));
      }, []);
    },
    routeCosts() {
      return creditCatalog.routes.reduce((costs, route) => {
        if (route.method !== 'POST') return costs;
        costs[route.path] = (route.charges || [])
          .filter(charge => charge.creditType === 'API_CREDIT')
          .reduce((total, charge) => total + Number(charge.amount || 0), 0);
        return costs;
      }, {});
    },
    creditsPerVerification() {
      return this.selectedServices.reduce((total, service) => total + this.serviceCost(service), 0);
    },
    estimatedVerifications() {
      if (!this.creditsPerVerification) return 0;
      return Math.floor(Math.max(this.remainingCredits, 0) / this.creditsPerVerification);
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(isOpen) {
        if (isOpen) this.loadSavedConfiguration();
      }
    }
  },
  methods: {
    isFlowSelected(flowId) {
      return this.selectedFlowIds.includes(flowId);
    },
    isFlowLocked(flowId) {
      return flowId === 'global' && this.selectedServiceIds.includes('ubo-verification');
    },
    toggleFlow(flowId) {
      if (this.isFlowLocked(flowId)) return;

      if (this.isFlowSelected(flowId)) {
        this.deselectFlow(flowId);
      } else {
        this.selectFlow(flowId);
      }
    },
    selectFlow(flowId) {
      const flow = this.flows.find(item => item.id === flowId);
      if (!flow) return;

      if (!this.selectedFlowIds.includes(flowId)) {
        this.selectedFlowIds.push(flowId);
      }

      flow.services.forEach(service => {
        if ((service.defaultSelected || service.required) && !this.selectedServiceIds.includes(service.id)) {
          this.selectedServiceIds.push(service.id);
        }
      });

      if (flowId === 'business' && this.selectedServiceIds.includes('ubo-verification')) {
        this.selectFlow('global');
      }
    },
    deselectFlow(flowId) {
      const flow = this.flows.find(item => item.id === flowId);
      if (!flow) return;

      this.selectedFlowIds = this.selectedFlowIds.filter(id => id !== flowId);
      const serviceIds = flow.services.map(service => service.id);
      this.selectedServiceIds = this.selectedServiceIds.filter(id => !serviceIds.includes(id));
    },
    toggleService(service) {
      if (!service || service.required) return;

      const isSelected = this.selectedServiceIds.includes(service.id);
      if (isSelected) {
        this.selectedServiceIds = this.selectedServiceIds.filter(id => id !== service.id);
        return;
      }

      this.selectedServiceIds = [...this.selectedServiceIds, service.id];
      if (service.id === 'ubo-verification') this.selectFlow('global');
    },
    serviceCost(service) {
      return service.routes.reduce((total, route) => total + Number(this.routeCosts[route] || 0), 0);
    },
    numberFormat(value) {
      return new Intl.NumberFormat().format(Number(value || 0));
    },
    loadSavedConfiguration() {
      const saved = this.$store
        ? this.$store.getters['creditCalculatorStore/getConfiguration']
        : null;
      const savedFlowIds = Array.isArray(saved && saved.selectedFlowIds) ? saved.selectedFlowIds : [];
      const savedServiceIds = Array.isArray(saved && saved.selectedServiceIds) ? saved.selectedServiceIds : [];
      const validFlowIds = this.flows.map(flow => flow.id);
      const restoredFlowIds = savedFlowIds.filter(id => validFlowIds.includes(id));

      if (restoredFlowIds.includes('business') && !restoredFlowIds.includes('global')) {
        restoredFlowIds.push('global');
      }

      this.selectedFlowIds = this.flows
        .filter(flow => restoredFlowIds.includes(flow.id))
        .map(flow => flow.id);

      const availableServices = this.selectedFlows.reduce((services, flow) => services.concat(flow.services), []);
      const validServiceIds = availableServices.map(service => service.id);
      const restoredServiceIds = savedServiceIds.filter((id, index, ids) => {
        return validServiceIds.includes(id) && ids.indexOf(id) === index;
      });

      availableServices.forEach(service => {
        if (service.required && !restoredServiceIds.includes(service.id)) {
          restoredServiceIds.push(service.id);
        }
      });

      this.selectedServiceIds = restoredServiceIds;
    },
    saveConfiguration() {
      if (this.$store) {
        this.$store.commit('creditCalculatorStore/saveConfiguration', {
          selectedFlowIds: [...this.selectedFlowIds],
          selectedServiceIds: [...this.selectedServiceIds],
          creditsPerVerification: this.creditsPerVerification
        });
      }
      this.close();
    },
    close() {
      this.isOpen = false;
    }
  }
};
</script>

<style scoped>
.calculator-modal {
  position: relative;
  display: flex;
  width: 100%;
  height: min(760px, calc(100vh - 48px));
  max-height: 90vh;
  flex-direction: column;
  overflow: hidden;
  border-radius: 16px;
  background: #fff;
  color: #12213d;
}

.calculator-header {
  display: flex;
  flex: 0 0 auto;
  align-items: flex-start;
  justify-content: space-between;
  padding: 28px 32px 16px;
}

.calculator-header h2,
.calculator-step h3 {
  margin: 0;
  color: #12213d;
  font-weight: 700;
}

.calculator-header h2 { font-size: 1.75rem; }
.calculator-header p,
.calculator-step p { margin: 3px 0 0; color: #64748b; }

.close-button {
  display: inline-flex;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 50%;
  background: transparent;
}

.close-button:hover { background: #f1f5f9; }

.calculator-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.7fr) minmax(300px, 1fr);
  min-height: 0;
  flex: 1 1 auto;
  padding: 0 32px 28px;
}

.configuration-panel {
  min-height: 0;
  overflow-y: auto;
  padding-right: 24px;
  scrollbar-color: #cbd5e1 transparent;
  scrollbar-width: thin;
}

.configuration-panel::-webkit-scrollbar { width: 6px; }
.configuration-panel::-webkit-scrollbar-thumb { border-radius: 999px; background: #cbd5e1; }

.calculator-step { padding: 14px 0 20px; }
.calculator-step h3 { font-size: 1rem; }
.calculator-step > p { font-size: 0.84rem; }

.flow-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: 16px;
}

.flow-card {
  position: relative;
  display: flex;
  min-height: 176px;
  flex-direction: column;
  align-items: flex-start;
  padding: 18px;
  border: 1px solid #dbe3ef;
  border-radius: 10px;
  background: #fff;
  text-align: left;
  transition: border-color .15s ease, background-color .15s ease, box-shadow .15s ease;
}

.flow-card:hover { border-color: #8cb8ff; }
.flow-card.selected {
  border-color: #3b82f6;
  background: #f5f9ff;
  box-shadow: 0 0 0 1px #3b82f6;
}

.flow-card:disabled {
  cursor: not-allowed;
  opacity: 1;
}

.flow-card.locked {
  border-color: #93c5fd;
  background: #f5f9ff;
}

.flow-icon,
.service-icon,
.summary-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.flow-icon {
  width: 42px;
  height: 42px;
  margin-bottom: 14px;
  background: #edf4ff;
}

.flow-icon .v-icon { color: #1677ff; }
.flow-card strong { padding-right: 12px; font-size: 0.93rem; line-height: 1.25; }
.flow-card small { margin-top: 4px; color: #64748b; font-size: 0.77rem; line-height: 1.35; }
.flow-card em { margin-top: 7px; color: #2563eb; font-size: 0.67rem; font-style: normal; font-weight: 700; }

.flow-checkbox {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 18px;
  height: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #94a3b8;
  border-radius: 4px;
}

.flow-checkbox .v-icon { opacity: 0; color: #fff; }
.flow-card.selected .flow-checkbox { border-color: #2583ff; background: #2583ff; }
.flow-card.selected .flow-checkbox .v-icon { opacity: 1; }
.flow-card.locked .flow-checkbox { border-color: #cbd5e1; background: #e2e8f0; }
.flow-card.locked .flow-checkbox .v-icon { color: #94a3b8; }

.service-step { border-top: 1px solid #e2e8f0; }
.selected-flow-services { display: grid; gap: 18px; margin-top: 16px; }
.service-group { min-width: 0; }
.service-group-heading {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 8px;
  color: #344563;
  font-size: 0.78rem;
}
.service-group-heading .v-icon { color: #1677ff; }
.service-list { display: grid; gap: 8px; margin-top: 14px; }
.service-group .service-list { margin-top: 0; }

.service-row {
  display: grid;
  width: 100%;
  grid-template-columns: 22px 38px minmax(0, 1fr) auto;
  gap: 12px;
  align-items: center;
  min-height: 68px;
  margin: 0;
  padding: 10px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: #fff;
  color: #12213d;
  cursor: pointer;
  font: inherit;
  text-align: left;
}

.service-row:not(.required):hover { border-color: #93c5fd; }
.service-row.selected { border-color: #bfdbfe; background: #f7faff; }

.service-toggle {
  position: relative;
  display: inline-flex;
  width: 21px;
  height: 21px;
}

.service-toggle input {
  position: absolute;
  z-index: 1;
  inset: 0;
  width: 21px;
  height: 21px;
  margin: 0;
  cursor: pointer;
  opacity: 0;
}

.service-toggle input:disabled { cursor: not-allowed; }
.service-toggle input:focus-visible + .service-check { outline: 3px solid rgba(37, 131, 255, .25); outline-offset: 1px; }

.service-check {
  display: inline-flex;
  width: 21px;
  height: 21px;
  align-items: center;
  justify-content: center;
  border: 1px solid #94a3b8;
  border-radius: 4px;
  background: #fff;
}

.service-check .v-icon { opacity: 0; color: #fff; }
.service-row.selected .service-check { border-color: #2583ff; background: #2583ff; }
.service-row.selected .service-check .v-icon { opacity: 1; }
.service-row.required { cursor: not-allowed; opacity: 1; }
.service-row.required .service-check { border-color: #cbd5e1; background: #e2e8f0; }
.service-row.required .service-check .v-icon { opacity: 1; color: #94a3b8; }

.service-icon { width: 38px; height: 38px; background: #f1f5f9; }
.service-icon .v-icon { color: #344563; }
.service-copy { display: flex; min-width: 0; flex-direction: column; }
.service-copy strong { font-size: 0.86rem; }
.service-copy small { color: #64748b; font-size: 0.75rem; line-height: 1.3; }
.service-copy em { margin-top: 5px; color: #52627b; cursor: default; font-size: 0.69rem; font-style: normal; }
.service-copy em .v-icon { margin-right: 4px; color: inherit; }

.required-label {
  display: inline-block;
  margin-left: 5px;
  padding: 2px 6px;
  border-radius: 999px;
  background: #e2e8f0;
  color: #52627b;
  font-size: 0.58rem;
  font-weight: 700;
  letter-spacing: .03em;
  text-transform: uppercase;
  vertical-align: middle;
}

.credit-pill {
  padding: 5px 11px;
  border-radius: 999px;
  background: #eaf2ff;
  color: #1677ff;
  font-size: 0.74rem;
  font-weight: 700;
  white-space: nowrap;
}

.service-placeholder {
  display: flex;
  min-height: 120px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 14px;
  border: 1px dashed #cbd5e1;
  border-radius: 10px;
  color: #64748b;
  font-size: 0.84rem;
}

.estimate-panel {
  display: flex;
  min-height: 0;
  flex-direction: column;
  padding: 14px 0 0 24px;
  border-left: 1px solid #e2e8f0;
}

.summary-card {
  display: flex;
  min-height: 138px;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border-radius: 12px;
}

.summary-card .summary-icon { flex: 0 0 48px; width: 48px; height: 48px; }
.summary-card > div { min-width: 0; }
.summary-card > div > span { display: block; color: #52627b; font-size: 0.85rem; font-weight: 700; }
.summary-card strong { display: inline-block; margin-top: 6px; font-size: clamp(2rem, 4vw, 3rem); line-height: 1; }
.summary-card small { margin-left: 6px; color: #52627b; font-size: 0.76rem; font-weight: 600; }

.credits-card { background: #f1f6ff; }
.credits-card .summary-icon { background: #deebff; }
.credits-card .summary-icon .v-icon,
.credits-card strong { color: #0877f9; }

.estimate-card { background: #edfbf6; }
.estimate-card .summary-icon { background: #d9f7eb; }
.estimate-card .summary-icon .v-icon,
.estimate-card strong { color: #059b72; }
.estimate-card.empty { background: #f8fafc; }
.estimate-card.empty strong { color: #94a3b8; }
.estimate-card small { display: block; margin: 8px 0 0; }

.estimate-arrow { align-self: center; margin: 14px 0; color: #52627b; }

.got-it-button {
  display: inline-flex;
  width: 100%;
  min-height: 48px;
  flex: 0 0 48px;
  align-items: center;
  justify-content: center;
  margin-top: auto;
  border: 0;
  border-radius: 8px;
  background: #2583ff;
  color: #fff;
  font-weight: 700;
}

.got-it-button .v-icon { margin-right: 6px; color: #fff; }
.got-it-button:hover { background: #0f6fe8; }

@media (max-width: 900px) {
  .calculator-layout {
    display: block;
    overflow-y: auto;
    padding-bottom: 20px;
    scrollbar-color: #cbd5e1 transparent;
    scrollbar-width: thin;
  }
  .configuration-panel { min-height: auto; overflow: visible; padding-right: 0; }
  .estimate-panel { min-height: auto; padding: 22px 0 0; border-top: 1px solid #e2e8f0; border-left: 0; }
  .got-it-button { margin-top: 20px; }
}

@media (max-width: 640px) {
  .calculator-modal {
    height: calc(100vh - 24px);
    max-height: none;
    border-radius: 12px;
  }
  .calculator-header { padding: 20px 18px 10px; }
  .calculator-header h2 { font-size: 1.35rem; }
  .calculator-layout { padding: 0 18px 20px; }
  .flow-grid { grid-template-columns: 1fr; }
  .flow-card { min-height: 128px; }
  .service-row { grid-template-columns: 22px 34px minmax(0, 1fr); }
  .credit-pill { grid-column: 3; justify-self: start; }
  .summary-card { min-height: 120px; }
}
</style>

<style>
.v-dialog.kyc-credit-dialog { overflow: hidden; }

@media (max-width: 640px) {
  .v-dialog.kyc-credit-dialog {
    width: calc(100% - 24px);
    max-height: calc(100vh - 24px);
    margin: 12px;
  }
}
</style>
