<template>
  <div class="text-center">
    <h5>🎉 Setup Complete!</h5>
    <p>You can now create and manage your KYC/KYB services.</p>
    <b-button variant="primary" @click="goToDashboard">Go to Dashboard</b-button>
  </div>
</template>

<script>
export default {
  name: "StepCompletion",
  methods: {
    goToDashboard() {
      console.log('StepCompletion: goToDashboard clicked, emitting finish event');
      // Emit completion event to trigger parent refresh and navigation
      this.$emit('finish');
    },
  },
};
</script>