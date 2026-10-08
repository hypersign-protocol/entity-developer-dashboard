<template>
  <div class="verification-flow-configurator">
    <section class="configurator-step">
      <h3>{{ flowHeading }}</h3>
      <p>{{ flowDescription }}</p>

      <div class="flow-grid" role="group" :aria-label="flowHeading">
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
          <em v-if="isFlowLocked(flow.id)">{{ flow.lockedMessage || lockedFlowMessage }}</em>
        </button>
      </div>
    </section>

    <section class="configurator-step service-step">
      <h3>{{ serviceHeading }}</h3>
      <p>{{ selectedFlows.length ? serviceDescription : emptyServiceDescription }}</p>

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
              :class="{ selected: isServiceSelected(service.id), required: service.required }"
              @click="toggleService(service)"
            >
              <span class="service-toggle">
                <input
                  type="checkbox"
                  :checked="isServiceSelected(service.id)"
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
              <span
                class="service-actions"
                :class="{ 'has-quantity': service.quantitySelectable && isServiceSelected(service.id) }"
              >
                <span v-if="service.quantitySelectable && isServiceSelected(service.id)" class="quantity-stepper" @click.stop>
                  <button
                    type="button"
                    :disabled="serviceQuantity(service) <= minimumQuantity(service)"
                    :aria-label="`Decrease ${service.title} quantity`"
                    @click="changeServiceQuantity(service, -1)"
                  >−</button>
                  <strong :aria-label="`${service.title} quantity`">{{ serviceQuantity(service) }}</strong>
                  <button
                    type="button"
                    :disabled="!canIncreaseServiceQuantity(service, serviceQuantity(service) + 1)"
                    :aria-label="`Increase ${service.title} quantity`"
                    @click="changeServiceQuantity(service, 1)"
                  >+</button>
                </span>
                <span v-if="showServiceCosts" class="credit-pill" :title="creditLabel(service)">{{ creditLabel(service) }}</span>
              </span>
            </div>
          </div>
        </section>
      </div>

      <div v-else class="service-placeholder">
        <v-icon>mdi-cursor-default-click-outline</v-icon>
        {{ emptyText }}
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'VerificationFlowConfigurator',
  props: {
    value: {
      type: Object,
      default: () => ({ selectedFlowIds: [], selectedServiceIds: [] })
    },
    flows: { type: Array, required: true },
    serviceCost: { type: Function, default: () => 0 },
    serviceCostMultiplier: { type: Function, default: () => 1 },
    canIncreaseServiceQuantity: { type: Function, default: () => true },
    showServiceCosts: { type: Boolean, default: true },
    flowHeading: { type: String, default: '1. What do you want to verify?' },
    flowDescription: { type: String, default: 'Choose one or more verification flows to see their services.' },
    serviceHeading: { type: String, default: '2. Select services' },
    serviceDescription: { type: String, default: 'Review the services included in each verification.' },
    emptyServiceDescription: { type: String, default: 'Select one or more verification flows first.' },
    emptyText: { type: String, default: 'Choose one or more flows above to configure their services.' },
    lockedFlowMessage: { type: String, default: 'Required by a selected service' }
  },
  computed: {
    selectedFlowIds() {
      return Array.isArray(this.value.selectedFlowIds) ? this.value.selectedFlowIds : [];
    },
    selectedServiceIds() {
      return Array.isArray(this.value.selectedServiceIds) ? this.value.selectedServiceIds : [];
    },
    serviceQuantities() {
      return this.value.serviceQuantities && typeof this.value.serviceQuantities === 'object'
        ? this.value.serviceQuantities
        : {};
    },
    selectedFlows() {
      return this.flows.filter(flow => this.selectedFlowIds.includes(flow.id));
    }
  },
  methods: {
    isFlowSelected(flowId) {
      return this.selectedFlowIds.includes(flowId);
    },
    isServiceSelected(serviceId) {
      return this.selectedServiceIds.includes(serviceId);
    },
    isFlowLocked(flowId) {
      return this.flows.some(flow => flow.services.some(service => {
        return this.isServiceSelected(service.id)
          && Array.isArray(service.requiresFlowIds)
          && service.requiresFlowIds.includes(flowId);
      }));
    },
    toggleFlow(flowId) {
      if (this.isFlowLocked(flowId)) return;
      if (this.isFlowSelected(flowId)) this.deselectFlow(flowId);
      else this.selectFlow(flowId);
    },
    selectFlow(flowId) {
      const selectedFlowIds = [...this.selectedFlowIds];
      const selectedServiceIds = [...this.selectedServiceIds];
      const serviceQuantities = { ...this.serviceQuantities };
      const addFlow = (id) => {
        const flow = this.flows.find(item => item.id === id);
        if (!flow) return;
        if (!selectedFlowIds.includes(id)) selectedFlowIds.push(id);

        flow.services.forEach(service => {
          if ((service.defaultSelected || service.required) && !selectedServiceIds.includes(service.id)) {
            selectedServiceIds.push(service.id);
          }
          if ((service.defaultSelected || service.required) && service.quantitySelectable && !serviceQuantities[service.id]) {
            serviceQuantities[service.id] = this.minimumQuantity(service);
          }
          if ((service.defaultSelected || service.required) && Array.isArray(service.requiresFlowIds)) {
            service.requiresFlowIds.forEach(addFlow);
          }
        });
      };

      addFlow(flowId);
      this.emitSelection(selectedFlowIds, selectedServiceIds, serviceQuantities);
    },
    deselectFlow(flowId) {
      const flow = this.flows.find(item => item.id === flowId);
      if (!flow) return;
      const serviceIds = flow.services.map(service => service.id);
      const serviceQuantities = { ...this.serviceQuantities };
      serviceIds.forEach(serviceId => delete serviceQuantities[serviceId]);
      this.emitSelection(
        this.selectedFlowIds.filter(id => id !== flowId),
        this.selectedServiceIds.filter(id => !serviceIds.includes(id)),
        serviceQuantities
      );
    },
    toggleService(service) {
      if (!service || service.required) return;
      if (this.isServiceSelected(service.id)) {
        this.emitSelection(
          this.selectedFlowIds,
          this.selectedServiceIds.filter(id => id !== service.id),
          Object.keys(this.serviceQuantities).reduce((quantities, serviceId) => {
            if (serviceId !== service.id) quantities[serviceId] = this.serviceQuantities[serviceId];
            return quantities;
          }, {})
        );
        return;
      }

      const selectedFlowIds = [...this.selectedFlowIds];
      const selectedServiceIds = [...this.selectedServiceIds, service.id];
      const serviceQuantities = { ...this.serviceQuantities };
      if (service.quantitySelectable) serviceQuantities[service.id] = this.minimumQuantity(service);
      const requiredFlows = Array.isArray(service.requiresFlowIds) ? service.requiresFlowIds : [];
      requiredFlows.forEach(flowId => {
        const flow = this.flows.find(item => item.id === flowId);
        if (!flow) return;
        if (!selectedFlowIds.includes(flowId)) selectedFlowIds.push(flowId);
        flow.services.forEach(item => {
          if ((item.defaultSelected || item.required) && !selectedServiceIds.includes(item.id)) {
            selectedServiceIds.push(item.id);
          }
          if ((item.defaultSelected || item.required) && item.quantitySelectable && !serviceQuantities[item.id]) {
            serviceQuantities[item.id] = this.minimumQuantity(item);
          }
        });
      });
      this.emitSelection(selectedFlowIds, selectedServiceIds, serviceQuantities);
    },
    minimumQuantity(service) {
      return Math.max(Number(service.minQuantity || service.defaultQuantity || 1), 1);
    },
    serviceQuantity(service) {
      const quantity = Number(this.serviceQuantities[service.id]);
      return Number.isFinite(quantity) && quantity >= this.minimumQuantity(service)
        ? Math.floor(quantity)
        : this.minimumQuantity(service);
    },
    changeServiceQuantity(service, change) {
      if (!this.isServiceSelected(service.id)) return;
      const quantity = Math.max(this.serviceQuantity(service) + change, this.minimumQuantity(service));
      if (change > 0 && !this.canIncreaseServiceQuantity(service, quantity)) return;
      this.emitSelection(this.selectedFlowIds, this.selectedServiceIds, {
        ...this.serviceQuantities,
        [service.id]: quantity
      });
    },
    emitSelection(selectedFlowIds, selectedServiceIds, serviceQuantities = this.serviceQuantities) {
      const uniqueServiceIds = [...new Set(selectedServiceIds)];
      const normalizedQuantities = Object.keys(serviceQuantities).reduce((quantities, serviceId) => {
        if (!uniqueServiceIds.includes(serviceId)) return quantities;
        const quantity = Math.max(Math.floor(Number(serviceQuantities[serviceId]) || 1), 1);
        quantities[serviceId] = quantity;
        return quantities;
      }, {});
      const selection = {
        selectedFlowIds: [...new Set(selectedFlowIds)],
        selectedServiceIds: uniqueServiceIds,
        serviceQuantities: normalizedQuantities
      };
      this.$emit('input', selection);
      this.$emit('change', selection);
    },
    creditLabel(service) {
      const baseCost = Number(this.serviceCost(service) || 0);
      const multiplier = Math.max(Number(this.serviceCostMultiplier(service) || 1), 1);
      const cost = baseCost * multiplier;
      if (multiplier > 1) return `${baseCost} × ${multiplier} = ${cost} credits`;
      return `${cost} ${cost === 1 ? 'credit' : 'credits'}`;
    }
  }
};
</script>

<style scoped>
.configurator-step { padding: 14px 0 20px; }
.configurator-step h3 { margin: 0; color: #12213d; font-size: 1rem; font-weight: 700; }
.configurator-step > p { margin: 3px 0 0; color: #64748b; font-size: 0.84rem; }

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

.flow-card:hover { border-color: #b7c9dc; }
.flow-card.selected { border-color: #9fb8d1; background: #f4f8fc; box-shadow: 0 0 0 1px rgba(159, 184, 209, .2); }
.flow-card:disabled { cursor: not-allowed; opacity: 1; }
.flow-card.locked { border-color: #b7c9dc; background: #f4f8fc; }

.flow-icon,
.service-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.flow-icon { width: 42px; height: 42px; margin-bottom: 14px; background: #eaf2f9; }
.flow-icon .v-icon { color: #6688ab; }
.flow-card strong { padding-right: 12px; font-size: 0.93rem; line-height: 1.25; }
.flow-card small { margin-top: 4px; color: #64748b; font-size: 0.77rem; line-height: 1.35; }
.flow-card em { margin-top: 7px; color: #6688ab; font-size: 0.67rem; font-style: normal; font-weight: 700; }

.flow-checkbox {
  position: absolute;
  top: 16px;
  right: 16px;
  display: inline-flex;
  width: 18px;
  height: 18px;
  align-items: center;
  justify-content: center;
  border: 2px solid #94a3b8;
  border-radius: 4px;
}

.flow-checkbox .v-icon { opacity: 0; color: #fff; }
.flow-card.selected .flow-checkbox { border-color: #7898b8; background: #7898b8; }
.flow-card.selected .flow-checkbox .v-icon { opacity: 1; }
.flow-card.locked .flow-checkbox { border-color: #c4d4e4; background: #e6eef6; }
.flow-card.locked .flow-checkbox .v-icon { color: #91a8be; }

.service-step { border-top: 1px solid #e2e8f0; }
.selected-flow-services { display: grid; gap: 18px; margin-top: 16px; }
.service-group { min-width: 0; }
.service-group-heading { display: flex; align-items: center; gap: 7px; margin-bottom: 8px; color: #344563; font-size: 0.78rem; }
.service-group-heading .v-icon { color: #6688ab; }
.service-list { display: grid; gap: 8px; }

.service-row {
  display: grid;
  width: 100%;
  min-height: 68px;
  grid-template-columns: 22px 38px minmax(0, 1fr) auto;
  gap: 12px;
  align-items: center;
  margin: 0;
  padding: 10px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: #fff;
  color: #12213d;
  cursor: pointer;
  text-align: left;
}

.service-row:not(.required):hover { border-color: #b7c9dc; }
.service-row.selected { border-color: #a9bfd5; background: #f4f8fc; }
.service-row.required { cursor: not-allowed; }
.service-toggle { position: relative; display: inline-flex; width: 21px; height: 21px; }
.service-toggle input { position: absolute; z-index: 1; inset: 0; width: 21px; height: 21px; margin: 0; cursor: pointer; opacity: 0; }
.service-toggle input:disabled { cursor: not-allowed; }
.service-toggle input:focus-visible + .service-check { outline: 3px solid rgba(120, 152, 184, .25); outline-offset: 1px; }

.service-check { display: inline-flex; width: 21px; height: 21px; align-items: center; justify-content: center; border: 1px solid #94a3b8; border-radius: 4px; background: #fff; }
.service-check .v-icon { opacity: 0; color: #fff; }
.service-row.selected .service-check { border-color: #7898b8; background: #7898b8; }
.service-row.selected .service-check .v-icon { opacity: 1; }
.service-row.required .service-check { border-color: #c4d4e4; background: #e6eef6; }
.service-row.required .service-check .v-icon { opacity: 1; color: #91a8be; }

.service-icon { width: 38px; height: 38px; background: #f1f5f9; }
.service-icon .v-icon { color: #344563; }
.service-copy { display: flex; min-width: 0; flex-direction: column; }
.service-copy strong { font-size: 0.86rem; }
.service-copy small { color: #64748b; font-size: 0.75rem; line-height: 1.3; }
.service-copy em { margin-top: 5px; color: #52627b; cursor: default; font-size: 0.69rem; font-style: normal; }
.service-copy em .v-icon { margin-right: 4px; color: inherit; }

.required-label { display: inline-block; margin-left: 5px; padding: 2px 6px; border-radius: 999px; background: #e2e8f0; color: #52627b; font-size: 0.58rem; font-weight: 700; letter-spacing: .03em; text-transform: uppercase; vertical-align: middle; }
.service-actions { display: inline-flex; align-items: center; justify-content: flex-end; gap: 8px; }
.service-actions.has-quantity { display: grid; width: 244px; grid-template-columns: 100px minmax(0, 136px); }
.quantity-stepper { display: inline-flex; width: 100px; height: 30px; align-items: center; overflow: hidden; border: 1px solid #b7c9dc; border-radius: 6px; background: #fff; box-sizing: border-box; }
.quantity-stepper button { width: 28px; height: 28px; flex: 0 0 28px; border: 0; background: #f4f8fc; color: #405b78; font-size: 16px; font-weight: 700; line-height: 1; }
.quantity-stepper button:hover:not(:disabled) { background: #e6eef6; }
.quantity-stepper button:disabled { cursor: not-allowed; color: #b5c2cf; }
.quantity-stepper strong { width: 42px; flex: 0 0 42px; color: #344563; font-size: 0.75rem; font-variant-numeric: tabular-nums; text-align: center; }
.credit-pill { padding: 5px 11px; border-radius: 999px; background: #eaf2f9; color: #5b7896; font-size: 0.74rem; font-weight: 700; white-space: nowrap; }
.service-actions.has-quantity .credit-pill { width: 100%; max-width: 136px; box-sizing: border-box; overflow: hidden; padding-right: 6px; padding-left: 6px; font-variant-numeric: tabular-nums; text-align: center; text-overflow: ellipsis; }
.service-placeholder { display: flex; min-height: 120px; align-items: center; justify-content: center; gap: 8px; margin-top: 14px; border: 1px dashed #cbd5e1; border-radius: 10px; color: #64748b; font-size: 0.84rem; }

@media (max-width: 640px) {
  .flow-grid { grid-template-columns: 1fr; }
  .flow-card { min-height: 128px; }
  .service-row { grid-template-columns: 22px 34px minmax(0, 1fr); }
  .service-actions { grid-column: 3; justify-self: start; flex-wrap: wrap; justify-content: flex-start; }
  .service-actions.has-quantity { max-width: 100%; }
}
</style>
