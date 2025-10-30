<template>
  <div>
    <h5>Setup ID Service</h5>
    <p class="text-muted">
      Your ID service pod will now be initialized and access granted automatically.
    </p>

    <div class="mt-3">
      <div v-if="!isSimulatingID">
        <b-button variant="info" @click="$emit('simulate-id-service')">
          Setup ID Service
        </b-button>
      </div>

      <div v-if="isSimulatingID" class="simulation-box mt-3 p-3 bg-light rounded">
        <b-spinner small type="grow" v-if="!simulationCompleteID"></b-spinner>
        <ul class="list-unstyled mt-2 mb-0">
          <li
            v-for="(log, index) in idSimulationLogs"
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
          variant="success"
          :disabled="!simulationCompleteID"
          @click="$emit('finish')"
        >
          Finish
        </b-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "StepSetupIDService",
  props: [
    "isSimulatingID",
    "idSimulationLogs",
    "simulationCompleteID",
  ],
};
</script>