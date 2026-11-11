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
          <span class="flow-icon"><v-icon small>{{ flow.icon }}</v-icon></span>
          <span class="flow-copy">
            <strong>{{ flow.title }}</strong>
            <small>{{ flow.description }}</small>
            <span v-if="flow.countries && flow.countries.length" class="flow-countries">
              <v-icon x-small>mdi-map-marker-outline</v-icon>
              Supported countries: {{ flow.countries.join(', ') }}
            </span>
            <em v-if="isFlowLocked(flow.id)">{{ flow.lockedMessage || lockedFlowMessage }}</em>
          </span>
          <span class="flow-checkbox" aria-hidden="true"><v-icon x-small>mdi-check</v-icon></span>
        </button>
      </div>
    </section>

    <section class="configurator-step service-step">
      <h3>{{ serviceHeading }}</h3>
      <p>{{ selectedFlows.length ? serviceDescription : emptyServiceDescription }}</p>

      <div v-if="selectedFlows.length" class="selected-flow-services">
        <section v-for="flow in selectedFlows" :key="flow.id" class="service-group">
          <div class="service-group-heading">
            <v-icon x-small>{{ flow.icon }}</v-icon>
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
                <span class="service-check" aria-hidden="true"><v-icon x-small>mdi-check</v-icon></span>
              </span>
              <span class="service-icon"><v-icon small>{{ service.icon }}</v-icon></span>
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
                  <input
                    class="quantity-input"
                    type="number"
                    inputmode="numeric"
                    step="1"
                    :min="minimumQuantity(service)"
                    :value="serviceQuantity(service)"
                    :aria-label="`${service.title} quantity`"
                    @click.stop
                    @change="setServiceQuantity(service, $event.target.value)"
                    @keydown.enter="$event.target.blur()"
                  >
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
        <v-icon small>mdi-cursor-default-click-outline</v-icon>
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
    setServiceQuantity(service, value) {
      if (!this.isServiceSelected(service.id)) return;

      const minimum = this.minimumQuantity(service);
      const numericValue = Number(value);
      const requestedQuantity = Number.isFinite(numericValue)
        ? Math.max(Math.floor(numericValue), minimum)
        : minimum;
      const currentQuantity = this.serviceQuantity(service);
      let quantity = requestedQuantity;

      if (quantity > currentQuantity && !this.canIncreaseServiceQuantity(service, quantity)) {
        let allowedQuantity = currentQuantity;
        let blockedQuantity = quantity;
        while (allowedQuantity < blockedQuantity) {
          const candidate = Math.ceil((allowedQuantity + blockedQuantity) / 2);
          if (this.canIncreaseServiceQuantity(service, candidate)) allowedQuantity = candidate;
          else blockedQuantity = candidate - 1;
        }
        quantity = allowedQuantity;
      }

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
      const formattedCost = new Intl.NumberFormat().format(cost);
      return `${formattedCost} ${cost === 1 ? 'credit' : 'credits'}`;
    }
  }
};
</script>

<style scoped>
.configurator-step { padding: 0 0 18px; }
.configurator-step h3 { margin: 0; color: #263244; font-size: 14px; font-weight: 700; }
.configurator-step > p { margin: 2px 0 0; color: #8793a5; font-size: 11px; }

/* Flows: compact cards, as many per row as fit */
.flow-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 8px;
  margin-top: 12px;
}

.flow-card {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 36px 12px 12px;
  border: 1px solid #d5dde7;
  border-radius: 8px;
  background: #fff;
  text-align: left;
  transition: border-color .15s ease, background-color .15s ease, box-shadow .15s ease;
}

.flow-card:hover { border-color: #a9b8cc; }
.flow-card.selected { border-color: #2f6fec; background: #f7faff; box-shadow: 0 0 0 3px rgba(47, 111, 236, .12); }
.flow-card:disabled { cursor: not-allowed; opacity: 1; }
.flow-card.locked { border-color: #b9cdf5; background: #f7faff; }

.flow-icon,
.service-icon {
  display: inline-flex;
  flex: 0 0 32px;
  width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}

.flow-icon { background: #f1f6ff; }
.flow-icon .v-icon { color: #2563dc; }

.flow-copy { display: flex; min-width: 0; flex-direction: column; }
.flow-card strong { color: #172554; font-size: 13px; font-weight: 700; line-height: 1.3; }
.flow-card small { margin-top: 2px; color: #8793a5; font-size: 11px; line-height: 1.4; }
.flow-countries {
  display: flex;
  align-items: flex-start;
  gap: 3px;
  margin-top: 6px;
  color: #52627a;
  font-size: 10px;
  font-weight: 600;
  line-height: 1.35;
}

.flow-countries .v-icon { color: #2563dc; }
.flow-card em { margin-top: 4px; color: #2563dc; font-size: 10px; font-style: normal; font-weight: 700; }

.flow-checkbox {
  position: absolute;
  top: 12px;
  right: 12px;
  display: inline-flex;
  width: 16px;
  height: 16px;
  align-items: center;
  justify-content: center;
  border: 1.5px solid #a9b8cc;
  border-radius: 50%;
  background: #fff;
}

.flow-checkbox .v-icon { opacity: 0; color: #fff; font-size: 11px !important; }
.flow-card.selected .flow-checkbox { border-color: #2563dc; background: #2563dc; }
.flow-card.selected .flow-checkbox .v-icon { opacity: 1; }
.flow-card.locked .flow-checkbox { border-color: #b9cdf5; background: #dbe7fb; }
.flow-card.locked .flow-checkbox .v-icon { opacity: 1; color: #2563dc; }

/* Services */
.service-step { padding-top: 18px; border-top: 1px solid #e8edf3; }
.selected-flow-services { display: grid; gap: 14px; margin-top: 12px; }
.service-group { min-width: 0; }

.service-group-heading {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
  color: #718198;
  font-size: 10px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.service-group-heading .v-icon { color: #2563dc; }
.service-list { display: grid; gap: 6px; }

.service-row {
  display: grid;
  width: 100%;
  grid-template-columns: 18px 32px minmax(0, 1fr) auto;
  gap: 10px;
  align-items: center;
  margin: 0;
  padding: 9px 12px;
  border: 1px solid #e1e6ed;
  border-radius: 8px;
  background: #fff;
  color: #273448;
  cursor: pointer;
  text-align: left;
  transition: border-color .15s ease, background-color .15s ease;
}

@media (min-width: 641px) {
  .service-row { grid-template-columns: 18px 32px minmax(0, 1fr) 184px; }
  .service-actions { width: 184px; justify-self: end; }
}

.service-row:not(.required):hover { border-color: #a9b8cc; }
.service-row.selected { border-color: #b9cdf5; background: #f7faff; }
.service-row.required { cursor: not-allowed; }

.service-toggle { position: relative; display: inline-flex; width: 18px; height: 18px; }
.service-toggle input { position: absolute; z-index: 1; inset: 0; width: 18px; height: 18px; margin: 0; cursor: pointer; opacity: 0; }
.service-toggle input:disabled { cursor: not-allowed; }
.service-toggle input:focus-visible + .service-check { outline: 3px solid rgba(47, 111, 236, .2); outline-offset: 1px; }

.service-check {
  display: inline-flex;
  width: 18px;
  height: 18px;
  align-items: center;
  justify-content: center;
  border: 1.5px solid #a9b8cc;
  border-radius: 5px;
  background: #fff;
}

.service-check .v-icon { opacity: 0; color: #fff; font-size: 12px !important; }
.service-row.selected .service-check { border-color: #2563dc; background: #2563dc; }
.service-row.selected .service-check .v-icon { opacity: 1; }
.service-row.required .service-check { border-color: #b9cdf5; background: #dbe7fb; }
.service-row.required .service-check .v-icon { opacity: 1; color: #2563dc; }

.service-icon { background: #f1f5f9; }
.service-icon .v-icon { color: #52627a; }
.service-row.selected .service-icon { background: #f1f6ff; }
.service-row.selected .service-icon .v-icon { color: #2563dc; }

.service-copy { display: flex; min-width: 0; flex-direction: column; }
.service-copy strong { color: #263244; font-size: 13px; font-weight: 600; }
.service-copy small { color: #8793a5; font-size: 11px; line-height: 1.35; }
.service-copy em { margin-top: 3px; color: #718198; cursor: default; font-size: 10px; font-style: normal; }
.service-copy em .v-icon { margin-right: 3px; color: inherit; }

.required-label {
  display: inline-block;
  margin-left: 5px;
  padding: 1px 6px;
  border-radius: 10px;
  background: #f1f5f9;
  color: #64748b;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: .04em;
  text-transform: uppercase;
  vertical-align: middle;
}

.service-actions { display: inline-flex; align-items: center; justify-content: flex-end; gap: 8px; }
.service-actions.has-quantity { display: grid; width: 184px; grid-template-columns: 92px 84px; }

.quantity-stepper {
  display: inline-flex;
  width: 92px;
  height: 28px;
  align-items: center;
  overflow: hidden;
  border: 1px solid #d5dde7;
  border-radius: 6px;
  background: #fff;
  box-sizing: border-box;
}

.quantity-stepper button { width: 26px; height: 26px; flex: 0 0 26px; border: 0; background: #f8fafc; color: #52627a; font-size: 15px; font-weight: 700; line-height: 1; }
.quantity-stepper button:hover:not(:disabled) { background: #f1f6ff; color: #2563dc; }
.quantity-stepper button:disabled { cursor: not-allowed; color: #c3cedc; }

.quantity-input {
  width: 38px;
  height: 26px;
  flex: 0 0 38px;
  border: 0;
  outline: 0;
  background: #fff;
  color: #263244;
  font: inherit;
  font-size: 12px;
  font-variant-numeric: tabular-nums;
  font-weight: 700;
  text-align: center;
  appearance: textfield;
}

.quantity-input::-webkit-inner-spin-button,
.quantity-input::-webkit-outer-spin-button { margin: 0; appearance: none; }
.quantity-input:focus { box-shadow: inset 0 0 0 2px rgba(47, 111, 236, .25); }

.credit-pill {
  display: inline-flex;
  width: 84px;
  height: 24px;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 0 7px;
  border-radius: 10px;
  background: #f1f5f9;
  box-sizing: border-box;
  color: #52627a;
  font-size: 11px;
  font-variant-numeric: tabular-nums;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.service-row.selected .credit-pill { background: #e6efff; color: #2563dc; }
.service-actions.has-quantity .credit-pill { justify-self: end; }

.service-placeholder {
  display: flex;
  min-height: 64px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 12px;
  border: 1px dashed #c3cedc;
  border-radius: 8px;
  background: #fff;
  color: #8793a5;
  font-size: 12px;
}

.service-placeholder .v-icon { color: inherit; }

@media (max-width: 640px) {
  .service-row { grid-template-columns: 18px 32px minmax(0, 1fr); }
  .service-actions { width: auto; grid-column: 3; justify-self: start; flex-wrap: wrap; justify-content: flex-start; }
  .service-actions.has-quantity { max-width: 100%; }
}
</style>
