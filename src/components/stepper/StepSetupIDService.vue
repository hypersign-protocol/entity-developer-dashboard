<template>
  <div>
    <h5>Setup ID Service</h5>
    <p class="text-muted">
      Your ID service pod will now be initialized and access granted automatically.
    </p>

    <div class="mt-3">
      <div v-if="!isProcessingID">
        <b-button variant="info" @click="$emit('process-id-service')">
          Setup ID Service
        </b-button>
      </div>

      <div v-if="isProcessingID" class="processing-box mt-3 p-3 bg-light rounded">
        <b-spinner small type="grow" v-if="!idProcessComplete"></b-spinner>
        <div class="mt-2">
          <p class="mb-0">Setting up your ID service...</p>
        </div>
      </div>

      <div class="text-right mt-3">
        <b-button variant="secondary" @click="$emit('prev-step')">Back</b-button>
        <b-button
          variant="success"
          :disabled="!idProcessComplete"
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
    "isProcessingID",
    "idProcessComplete",
  ],
};
</script>