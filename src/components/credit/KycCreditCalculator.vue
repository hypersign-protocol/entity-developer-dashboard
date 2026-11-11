<template>
  <b-modal
    :id="popupId"
    :visible="value"
    centered
    hide-footer
    modal-class="credit-calculator-modal"
    @change="isOpen = $event"
  >
    <template #modal-header="{ close }">
      <div class="calculator-header">
        <span class="calculator-header-icon"><v-icon small>mdi-calculator-variant-outline</v-icon></span>
        <div class="calculator-header-text">
          <h2>Credit Calculator</h2>
          <p>{{ copy.subtitle }}</p>
        </div>
        <button type="button" class="calculator-close" aria-label="Close" @click="close()">
          <v-icon small>mdi-close</v-icon>
        </button>
      </div>
    </template>

    <section class="calculator-modal">

      <div class="calculator-layout">
        <VerificationFlowConfigurator
          class="configuration-panel"
          :value="selection"
          :flows="availableFlows"
          :service-cost="serviceCost"
          :service-cost-multiplier="serviceQuantityMultiplier"
          :can-increase-service-quantity="canIncreaseServiceQuantity"
          @input="updateSelection"
        />

        <aside class="estimate-panel" aria-live="polite">
          <div class="summary-card credits-card">
            <span class="summary-icon"><v-icon small>mdi-database-outline</v-icon></span>
            <div>
              <span>{{ copy.creditsLabel }}</span>
              <template v-if="hasEditableCredits">
                <input
                  v-model="creditsInput"
                  class="credits-input"
                  type="number"
                  min="0"
                  step="1"
                  :aria-label="copy.creditsLabel"
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

          <v-icon small class="estimate-arrow">mdi-arrow-down</v-icon>

          <div class="summary-card estimate-card" :class="{ empty: creditsPerVerification === 0 }">
            <span class="summary-icon"><v-icon small>mdi-chart-bar</v-icon></span>
            <div>
              <span>Estimated verifications</span>
              <strong>{{ creditsPerVerification ? numberFormat(estimatedVerifications) : '—' }}</strong>
              <small v-if="creditsPerVerification">at {{ numberFormat(creditsPerVerification) }} credits per verification</small>
              <small v-else>Select at least one service</small>
            </div>
          </div>

          <div v-if="mode === 'customer' || backLabel" class="estimate-actions">
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

            <button v-if="mode === 'customer'" class="got-it-button" type="button" @click="saveConfiguration">
              <v-icon small>mdi-content-save-outline</v-icon>
              Save config locally
            </button>
            <button v-if="backLabel" class="back-button" type="button" @click="goBack">
              <v-icon small>mdi-arrow-left</v-icon>
              {{ backLabel }}
            </button>
          </div>
        </aside>
      </div>

    </section>
  </b-modal>
</template>

<script>
import creditCatalog from '../../catalogs/catalog.kyc.json';
import VerificationFlowConfigurator from './VerificationFlowConfigurator.vue';

const flows = [
  {
    id: 'india',
    title: 'Non-Doc ID Verification',
    description: 'Aadhaar and PAN checks, no ID document needed.',
    countries: ['India'],
    icon: 'mdi-account-outline',
    services: [
      {
        id: 'aadhaar-verification',
        title: 'Aadhaar Verification',
        description: 'Verify Aadhaar using OTP or QR.',
        icon: 'mdi-card-account-details-outline',
        routes: ['/api/v1/aadhaar/otp/generate', '/api/v1/aadhaar/otp/verify'],
        defaultSelected: true
      },
      {
        id: 'aadhaar-face-match',
        title: 'Aadhaar Face Match',
        description: "Match the user's selfie against their Aadhaar photo.",
        icon: 'mdi-face-recognition',
        routes: ['/api/v1/aadhaar/face/match'],
        defaultSelected: true
      },
      {
        id: 'pan-verification',
        title: 'PAN Verification',
        description: 'Verify a PAN and the name registered against it.',
        icon: 'mdi-card-text-outline',
        routes: ['/api/v1/pan/verify'],
        defaultSelected: false
      },
      {
        id: 'pan-aadhaar-link-status',
        title: 'PAN–Aadhaar Link Status',
        description: 'Check whether a PAN is linked to an Aadhaar number.',
        icon: 'mdi-link-variant',
        routes: ['/api/v1/pan/aadhaar/link-status'],
        defaultSelected: false
      }
    ]
  },
  {
    id: 'global',
    title: 'Global Identity Verification',
    description: 'Verify individuals internationally using identity documents and biometrics.',
    icon: 'mdi-earth',
    lockedMessage: 'Required for UBO Verification',
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
  components: { VerificationFlowConfigurator },
  props: {
    value: { type: Boolean, default: false },
    remainingCredits: { type: Number, default: 0 },
    totalCredits: { type: Number, default: 0 },
    // 'customer': estimate against the user's own remaining credits, with a saved config.
    // 'allocate': super admin previewing what a credit amount they are about to give covers.
    // 'topup': customer previewing what the credits in a top-up cover. The credits field is
    // editable for what-ifs and starts from the top-up's credits; nothing is saved.
    mode: { type: String, default: 'customer', validator: (v) => ['customer', 'allocate', 'topup'].includes(v) },
    // Limit the flows on offer (e.g. by billing region); null shows every flow
    visibleFlowIds: { type: Array, default: null },
    // Opened from another popup or page: shows a "Back to …" button that closes the calculator
    backLabel: { type: String, default: '' }
  },
  data() {
    return {
      flows,
      // One id per mode: the dashboard and the top-up popup each mount a calculator
      popupId: this.mode === 'customer' ? 'kyc-credit-calculator-popup' : `kyc-credit-calculator-popup-${this.mode}`,
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
    isTopUpMode() {
      return this.mode === 'topup';
    },
    hasEditableCredits() {
      return this.isAllocateMode || this.isTopUpMode;
    },
    // Top-up mode edits a local copy; the other modes estimate against the prop
    estimateCredits() {
      if (this.isTopUpMode) return Math.max(Math.floor(Number(this.creditsInput) || 0), 0);
      return Math.max(Number(this.remainingCredits) || 0, 0);
    },
    copy() {
      if (this.isTopUpMode) {
        return {
          subtitle: 'See how many verifications a credit amount will cover. Starts with the credits in this top-up.',
          creditsLabel: 'Credits'
        };
      }
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
    availableFlows() {
      if (!this.visibleFlowIds) return this.flows;
      return this.flows.filter(flow => this.visibleFlowIds.includes(flow.id));
    },
    selectedFlows() {
      return this.availableFlows.filter(flow => this.selectedFlowIds.includes(flow.id));
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
      return Math.floor(this.estimateCredits / this.creditsPerVerification);
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
        if (isOpen && this.isTopUpMode) this.creditsInput = String(this.remainingCredits);
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

      return projectedCost <= this.estimateCredits;
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
      const validFlowIds = this.availableFlows.map(flow => flow.id);
      const restoredFlowIds = savedFlowIds.filter(id => validFlowIds.includes(id));

      if (savedServiceIds.includes('ubo-verification') && validFlowIds.includes('global') && !restoredFlowIds.includes('global')) {
        restoredFlowIds.push('global');
      }

      this.selectedFlowIds = this.availableFlows
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
    },
    goBack() {
      this.$emit('back');
      this.close();
    }
  }
};
</script>

<style>
/* Modal chrome: same light header/body as the credit top-up popup */
.credit-calculator-modal .modal-dialog { max-width: 960px; }

.credit-calculator-modal .modal-content {
  overflow: hidden;
  border: 1px solid #dbe3ef;
  border-radius: 14px;
  box-shadow: 0 24px 60px -12px rgba(23, 37, 84, .22);
  font-size: 13px;
}

.credit-calculator-modal .modal-header { padding: 16px 20px; border-bottom: 1px solid #edf1f6; background: #fff; }
.credit-calculator-modal .modal-body { padding: 0; background: #f8fafc; }
</style>

<style scoped>
.calculator-header { display: flex; align-items: center; gap: 12px; width: 100%; }

.calculator-header-icon {
  display: inline-flex;
  flex: 0 0 36px;
  width: 36px;
  height: 36px;
  align-items: center;
  justify-content: center;
  border: 1px solid #dbe7fb;
  border-radius: 10px;
  background: linear-gradient(135deg, #f1f6ff, #e6efff);
}

.calculator-header-icon .v-icon { color: #2563dc; }
.calculator-header-text { flex: 1 1 auto; min-width: 0; }
.calculator-header-text h2 { margin: 0; color: #172554; font-size: 16px; font-weight: 700; letter-spacing: -0.01em; }
.calculator-header-text p { margin: 2px 0 0; color: #8793a5; font-size: 12px; }

.calculator-close {
  display: inline-flex;
  width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: #8793a5;
}

.calculator-close:hover { background: #f1f5f9; }
.calculator-close .v-icon { color: inherit; }

.calculator-modal { color: #273448; }

/* Grows with its content up to the viewport; past that only the left panel scrolls.
   The cap sits on the panel itself: a grid row grows to fit its content, so a max-height
   on the grid would let the popup outgrow the screen and scroll the page instead. */
.calculator-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 300px;
}

.configuration-panel {
  max-height: min(600px, calc(100vh - 160px));
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 20px;
  scrollbar-color: #cbd5e1 transparent;
  scrollbar-width: thin;
}

.configuration-panel::-webkit-scrollbar { width: 6px; }
.configuration-panel::-webkit-scrollbar-thumb { border-radius: 999px; background: #cbd5e1; }

.estimate-panel {
  display: flex;
  min-height: 0;
  flex-direction: column;
  padding: 20px;
  border-left: 1px solid #e8edf3;
  background: #fff;
}

.summary-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  border: 1px solid #e1e6ed;
  border-radius: 10px;
}

.summary-icon {
  display: inline-flex;
  flex: 0 0 32px;
  width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}

.summary-card > div { min-width: 0; }

.summary-card > div > span {
  display: block;
  color: #718198;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.summary-card strong {
  display: inline-block;
  margin-top: 4px;
  font-size: 24px;
  font-variant-numeric: tabular-nums;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.1;
}

.summary-card small { margin-left: 4px; color: #718198; font-size: 12px; font-weight: 600; }

.credits-card { background: #fff; }
.credits-card .summary-icon { background: #f1f5f9; }
.credits-card .summary-icon .v-icon,
.credits-card strong { color: #263244; }

.credits-input {
  width: 100%;
  max-width: 170px;
  height: 38px;
  margin-top: 6px;
  padding: 0 10px;
  border: 1px solid #d5dde7;
  border-radius: 6px;
  background: #fff;
  color: #172554;
  font-size: 18px;
  font-variant-numeric: tabular-nums;
  font-weight: 700;
}

.credits-input:focus { outline: none; border-color: #2f6fec; box-shadow: 0 0 0 2px rgba(47, 111, 236, .12); }
.credits-input + small { display: block; margin: 4px 0 0; }

.estimate-card { border-color: #dbe7fb; background: linear-gradient(135deg, #f5f9ff 0%, #eaf1ff 100%); }
.estimate-card .summary-icon { background: #fff; }
.estimate-card .summary-icon .v-icon,
.estimate-card strong { color: #2563dc; }
.estimate-card.empty strong { color: #a9b8cc; }
.estimate-card small { display: block; margin: 4px 0 0; font-size: 11px; font-weight: 500; }

.estimate-arrow { align-self: center; margin: 8px 0; color: #a9b8cc !important; }

.estimate-actions { display: grid; gap: 12px; margin-top: auto; padding-top: 16px; }

.configuration-summary {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px;
  border: 1px solid #e1e6ed;
  border-radius: 10px;
  background: #f8fafc;
}

.configuration-summary-icon {
  display: inline-flex;
  width: 28px;
  height: 28px;
  flex: 0 0 28px;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: #f1f6ff;
}

.configuration-summary-icon .v-icon { color: #2563dc; }
.configuration-summary > div { display: flex; min-width: 0; flex-direction: column; }
.configuration-summary span { color: #718198; font-size: 11px; font-weight: 700; }
.configuration-summary strong { margin-top: 2px; color: #344054; font-size: 13px; line-height: 1.3; }
.configuration-summary small { margin-top: 2px; color: #8793a5; font-size: 11px; line-height: 1.35; }
.configuration-summary.empty { border-style: dashed; }

/* Same filled action as the dashboard's other primary buttons */
.got-it-button {
  display: inline-flex;
  width: 100%;
  min-height: 40px;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: 1px solid #6c757d;
  border-radius: 8px;
  background: #6c757d;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
}

.got-it-button .v-icon { color: #fff; }
.got-it-button:hover { border-color: #545b62; background: #5a6268; }

.back-button {
  display: inline-flex;
  width: 100%;
  min-height: 40px;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background: #fff;
  color: #1f2937;
  font-size: 13px;
  font-weight: 600;
}

.back-button .v-icon { color: inherit; transition: transform .15s ease; }
.back-button:hover { border-color: #94a3b8; background: #f8fafc; }
.back-button:hover .v-icon { transform: translateX(-2px); }

@media (max-width: 900px) {
  .calculator-layout { display: block; max-height: calc(100vh - 160px); overflow-y: auto; overscroll-behavior: contain; }
  .configuration-panel { max-height: none; overflow: visible; }
  .estimate-panel { border-top: 1px solid #e8edf3; border-left: 0; }
}
</style>
