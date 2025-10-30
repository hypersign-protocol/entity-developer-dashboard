<template>
  <div>
    <h5>Create SSI Service</h5>
    <p class="text-muted">
      Request credit and create your SSI Service. Issuer DID will be registered automatically.
    </p>

    <!-- <b-form-group label="Select Network Type">
      <b-form-radio-group
        v-model="localNetworkType"
        :options="[
          { text: 'Testnet', value: 'testnet' },
          { text: 'Mainnet', value: 'mainnet' },
        ]"
        buttons
        button-variant="outline-primary"
        name="networkType"
      />
    </b-form-group> -->

    <div class="mt-3">
      <div v-if="!isSimulating">
        <b-button
          v-if="localNetworkType === 'testnet'"
          variant="info"
          @click="$emit('simulate-credit')"
        >
          Request Credit
        </b-button>

        <b-button
          v-if="localNetworkType === 'mainnet'"
          variant="info"
          @click="goToBilling"
        >
          Go to Billing Page
        </b-button>
      </div>

      <div v-if="isSimulating" class="simulation-box mt-3 p-3 bg-light rounded">
        <b-spinner small type="grow" v-if="!simulationComplete"></b-spinner>
        <ul class="list-unstyled mt-2 mb-0">
          <li
            v-for="(log, index) in simulationLogs"
            :key="index"
            :class="['simulation-log', { done: log.done }]"
          >
            <span v-if="log.done" class="text-success">
              <i class="mdi mdi-check-circle-outline mr-1"></i>
            </span>
            {{ log.message }}
          </li>
        </ul>
      </div>

      <div class="text-right mt-3">
        <b-button variant="secondary" @click="$emit('prev-step')">Back</b-button>
        <b-button
          variant="primary"
          :disabled="!simulationComplete"
          @click="$emit('update:network-type', localNetworkType), $emit('next-step')"
        >
          Next
        </b-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "StepCreateSSIService",
  props: [
    "networkType",
    "isSimulating",
    "simulationLogs",
    "simulationComplete",
  ],
  data() {
    return {
      localNetworkType: this.networkType,
    };
  },
  methods: {
    goToBilling() {
      console.log("Redirecting to billing...");
    },
  },
};
</script>