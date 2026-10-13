<template>
  <hf-pop-up
    :id="popupId"
    Header="Credit Calculator"
    size="xl"
    @hidden="isOpen = false"
  >
    <section class="calculator-modal">
      <p class="calculator-subtitle">{{ copy.subtitle }}</p>

      <div class="calculator-layout">
        <VerificationFlowConfigurator
          class="configuration-panel"
          :value="selection"
          :flows="flows"
          :service-cost="serviceCost"
          :service-cost-multiplier="serviceQuantityMultiplier"
          :can-increase-service-quantity="canIncreaseServiceQuantity"
          @input="updateSelection"
        />

        <aside class="estimate-panel" aria-live="polite">
          <div class="summary-card credits-card">
            <span class="summary-icon"><v-icon>mdi-database-outline</v-icon></span>
            <div>
              <span>{{ copy.creditsLabel }}</span>
              <template v-if="isAllocateMode">
                <input
                  v-model="creditsInput"
                  class="credits-input"
                  type="number"
                  min="0"
                  step="1"
                  aria-label="Credits to allocate"
                  @input="updateCredits"
                />
                <small>credits</small>
              </template>
              <template v-else>
                <strong>{{ numberFormat(remainingCredits) }}</strong>
                <small>/ {{ numberFormat(totalCredits) }} credits</small>
              </template>
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

          <div v-if="!isAllocateMode" class="estimate-actions">
            <!--
            <div class="configuration-summary" :class="{ empty: !creditsPerVerification }">
              <span class="configuration-summary-icon">
                <v-icon small>mdi-format-list-checks</v-icon>
              </span>
              <div>
                <span>Configuration summary</span>
                <strong>{{ configurationSummary.title }}</strong>
                <small>{{ configurationSummary.detail }}</small>
              </div>
            </div>
            -->

            <button class="got-it-button" type="button" @click="saveConfiguration">
              <v-icon small>mdi-content-save-outline</v-icon>
              Save config locally
            </button>
          </div>
        </aside>
      </div>

    </section>
  </hf-pop-up>
</template>

<script>
import creditCatalog from '../../catalogs/catalog.kyc.json';
import VerificationFlowConfigurator from './VerificationFlowConfigurator.vue';
import HfPopUp from '../element/hfPopup.vue';

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
        defaultSelected: true
      }
    ]
  },
  {
    id: 'global',
    title: 'Global Identity Verification',
    description: 'Verify individuals internationally using identity documents and biometrics.',
    icon: 'mdi-earth',
    lockedMessage: 'Required by UBO Verification',
    services: [
      {
        id: 'verification-session',
        title: 'Verification Session',
        description: 'Start and manage a secure verification session.',
        icon: 'mdi-cellphone-check',
        routes: ['/api/v2/session', '/api/v1/e-kyc/verification/auth'],
        defaultSelected: true
      },
      {
        id: 'passive-liveness',
        title: 'Passive Liveness',
        description: 'Detect whether the user is a real, live person.',
        icon: 'mdi-face-recognition',
        routes: ['/api/v1/e-kyc/verification/passive-liveliness'],
        defaultSelected: true
      },
      {
        id: 'document-verification',
        title: 'Document Verification',
        description: 'Extract and verify information from passports and government-issued IDs.',
        icon: 'mdi-file-document-check-outline',
        routes: ['/api/v2/documents/extract', '/api/v2/biometrics/verify'],
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
        defaultSelected: true
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
        defaultSelected: true
      },
      {
        id: 'ubo-verification',
        title: 'UBO Verification',
        description: 'Identify and verify ultimate beneficial owners.',
        note: 'Requires Global Identity Verification for the UBO.',
        icon: 'mdi-account-group-outline',
        routes: ['/api/v1/e-kyb/verification/company/:companyId/company-executives'],
        defaultSelected: true,
        quantitySelectable: true,
        defaultQuantity: 1,
        minQuantity: 1,
        requiresFlowIds: ['global']
      },
      {
        id: 'aml-screening',
        title: 'AML Screening',
        description: 'Screen against sanctions, watchlists, registries and adverse media.',
        icon: 'mdi-shield-search',
        routes: ['/api/v1/compliance'],
        defaultSelected: true
      }
    ]
  }
];

export default {
  name: 'KycCreditCalculator',
  components: { VerificationFlowConfigurator, HfPopUp },
  props: {
    value: { type: Boolean, default: false },
    remainingCredits: { type: Number, default: 0 },
    totalCredits: { type: Number, default: 0 },
    // 'customer': estimate against the user's own remaining credits, with a saved config.
    // 'allocate': super admin previewing what a credit amount they are about to give covers.
    mode: { type: String, default: 'customer', validator: (v) => ['customer', 'allocate'].includes(v) }
  },
  data() {
    return {
      flows,
      popupId: 'kyc-credit-calculator-popup',
      creditsInput: String(this.remainingCredits),
      selectedFlowIds: [],
      selectedServiceIds: [],
      serviceQuantities: {}
    };
  },
  computed: {
    isAllocateMode() {
      return this.mode === 'allocate';
    },
    copy() {
      return this.isAllocateMode
        ? {
          subtitle: 'See how many verifications this credit amount will cover.',
          creditsLabel: 'Credits to allocate'
        }
        : {
          subtitle: 'See how many verifications your remaining credits can cover.',
          creditsLabel: 'Available Credits'
        };
    },
    isOpen: {
      get() { return this.value; },
      set(value) { this.$emit('input', value); }
    },
    selection() {
      return {
        selectedFlowIds: this.selectedFlowIds,
        selectedServiceIds: this.selectedServiceIds,
        serviceQuantities: this.serviceQuantities
      };
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
      return this.selectedServices.reduce((total, service) => {
        return total + (this.serviceCost(service) * this.serviceQuantityMultiplier(service));
      }, 0);
    },
    estimatedVerifications() {
      if (!this.creditsPerVerification) return 0;
      return Math.floor(Math.max(this.remainingCredits, 0) / this.creditsPerVerification);
    },
    uboQuantity() {
      if (!this.selectedServiceIds.includes('ubo-verification')) return 0;
      return Math.max(
        Math.floor(Number(this.serviceQuantities['ubo-verification']) || 1),
        1
      );
    },
    configurationSummary() {
      if (!this.creditsPerVerification) {
        return {
          title: 'No configuration selected',
          detail: 'Select a flow and at least one service to see its coverage.'
        };
      }

      const summarizedFlows = this.selectedFlows.filter(flow => {
        const isUboDependency = flow.id === 'global'
          && this.selectedFlowIds.includes('business')
          && this.uboQuantity > 0;
        return !isUboDependency;
      });
      const flowLabels = {
        india: 'India Identity',
        global: 'Global Identity',
        business: 'Business'
      };
      const isSingleFlow = summarizedFlows.length === 1;
      const verificationLabel = isSingleFlow
        ? `${flowLabels[summarizedFlows[0].id] || summarizedFlows[0].title} verification`
        : 'combined verification';
      const title = `Up to ${this.numberFormat(this.estimatedVerifications)} ${verificationLabel}${this.estimatedVerifications === 1 ? '' : 's'}`;

      if (this.uboQuantity) {
        return {
          title,
          detail: `Each business verification includes ${this.numberFormat(this.uboQuantity)} UBO verification${this.uboQuantity === 1 ? '' : 's'}.`
        };
      }

      return {
        title,
        detail: `${this.selectedServices.length} selected service${this.selectedServices.length === 1 ? '' : 's'} per verification.`
      };
    }
  },
  watch: {
    remainingCredits(credits) {
      if (Number(this.creditsInput) !== credits) this.creditsInput = String(credits);
    },
    value: {
      immediate: true,
      handler(isOpen) {
        if (isOpen && !this.isAllocateMode) this.loadSavedConfiguration();
        this.$nextTick(() => {
          this.$root.$emit(isOpen ? 'bv::show::modal' : 'bv::hide::modal', this.popupId);
        });
      }
    }
  },
  methods: {
    // Allocate mode only: the parent owns the amount and passes it back via the prop.
    updateCredits() {
      const credits = Math.max(Math.floor(Number(this.creditsInput) || 0), 0);
      this.$emit('update:remainingCredits', credits);
    },
    updateSelection(selection) {
      this.selectedFlowIds = [...selection.selectedFlowIds];
      this.selectedServiceIds = [...selection.selectedServiceIds];
      this.serviceQuantities = { ...(selection.serviceQuantities || {}) };
    },
    serviceCost(service) {
      return service.routes.reduce((total, route) => total + Number(this.routeCosts[route] || 0), 0);
    },
    serviceQuantityMultiplier(service) {
      if (!this.selectedServiceIds.includes('ubo-verification')) return 1;

      const quantity = Math.max(
        Math.floor(Number(this.serviceQuantities['ubo-verification']) || 1),
        1
      );
      const globalFlow = this.flows.find(flow => flow.id === 'global');
      const globalServiceIds = globalFlow ? globalFlow.services.map(item => item.id) : [];

      return service.id === 'ubo-verification' || globalServiceIds.includes(service.id)
        ? quantity
        : 1;
    },
    canIncreaseServiceQuantity(service, nextQuantity) {
      if (service.id !== 'ubo-verification') return true;

      const currentQuantity = Math.max(
        Math.floor(Number(this.serviceQuantities['ubo-verification']) || 1),
        1
      );
      const globalFlow = this.flows.find(flow => flow.id === 'global');
      const selectedGlobalCost = globalFlow
        ? globalFlow.services
          .filter(item => this.selectedServiceIds.includes(item.id))
          .reduce((total, item) => total + this.serviceCost(item), 0)
        : 0;
      const costPerAdditionalUbo = this.serviceCost(service) + selectedGlobalCost;
      const additionalUbos = Math.max(Math.floor(Number(nextQuantity) || 1) - currentQuantity, 0);
      const projectedCost = this.creditsPerVerification + (costPerAdditionalUbo * additionalUbos);

      return projectedCost <= Math.max(Number(this.remainingCredits) || 0, 0);
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
      const savedQuantities = saved && saved.serviceQuantities && typeof saved.serviceQuantities === 'object'
        ? saved.serviceQuantities
        : {};
      const validFlowIds = this.flows.map(flow => flow.id);
      const restoredFlowIds = savedFlowIds.filter(id => validFlowIds.includes(id));

      if (savedServiceIds.includes('ubo-verification') && !restoredFlowIds.includes('global')) {
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
      this.serviceQuantities = restoredServiceIds.reduce((quantities, serviceId) => {
        const quantity = Math.max(Math.floor(Number(savedQuantities[serviceId]) || 1), 1);
        if (serviceId === 'ubo-verification') quantities[serviceId] = quantity;
        return quantities;
      }, {});
    },
    saveConfiguration() {
      if (this.$store) {
        this.$store.commit('creditCalculatorStore/saveConfiguration', {
          selectedFlowIds: [...this.selectedFlowIds],
          selectedServiceIds: [...this.selectedServiceIds],
          serviceQuantities: { ...this.serviceQuantities },
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
  height: min(640px, calc(100vh - 180px));
  flex-direction: column;
  overflow: hidden;
  color: #12213d;
}

.calculator-subtitle { flex: 0 0 auto; margin: 0 0 16px; color: #64748b; }

.calculator-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.7fr) minmax(300px, 1fr);
  min-height: 0;
  flex: 1 1 auto;
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

.summary-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
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

.credits-card { background: #f8fafc; }
.credits-input {
  width: 100%;
  max-width: 200px;
  margin-top: 6px;
  padding: 4px 10px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background: #fff;
  color: #495057;
  font-size: clamp(1.5rem, 3vw, 2.25rem);
  font-weight: 700;
  line-height: 1.2;
}
.credits-input:focus { outline: none; border-color: #405b78; }
.credits-input + small { display: block; margin: 6px 0 0; }
.credits-card .summary-icon { background: #f1f5f9; }
.credits-card .summary-icon .v-icon,
.credits-card strong { color: #495057; }

.estimate-card { background: #eff6ff; }
.estimate-card .summary-icon { background: #dbeafe; }
.estimate-card .summary-icon .v-icon,
.estimate-card strong { color: #405b78; }
.estimate-card.empty { background: #eff6ff; }
.estimate-card.empty strong { color: #94a3b8; }
.estimate-card small { display: block; margin: 8px 0 0; }

.estimate-arrow { align-self: center; margin: 14px 0; color: #52627b; }

.estimate-actions {
  display: grid;
  gap: 12px;
  margin-top: auto;
}

.configuration-summary {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 14px;
  border: 1px solid #dbe6f0;
  border-radius: 10px;
  background: #f8fafc;
}

.configuration-summary-icon {
  display: inline-flex;
  width: 32px;
  height: 32px;
  flex: 0 0 32px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #eaf2f9;
}

.configuration-summary-icon .v-icon { color: #5b7896; }
.configuration-summary > div { display: flex; min-width: 0; flex-direction: column; }
.configuration-summary span { color: #64748b; font-size: 0.72rem; font-weight: 700; }
.configuration-summary strong { margin-top: 3px; color: #344563; font-size: 0.88rem; line-height: 1.3; }
.configuration-summary small { margin-top: 4px; color: #64748b; font-size: 0.73rem; line-height: 1.35; }
.configuration-summary.empty { border-style: dashed; }

.got-it-button {
  display: inline-flex;
  width: 100%;
  min-height: 48px;
  flex: 0 0 48px;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 8px;
  background: #6c757d;
  color: #fff;
  font-weight: 700;
}

.got-it-button .v-icon { margin-right: 6px; color: #fff; }
.got-it-button:hover { background: #5a6268; }

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
  .estimate-actions { margin-top: 20px; }
}

@media (max-width: 640px) {
  .summary-card { min-height: 120px; }
}
</style>
