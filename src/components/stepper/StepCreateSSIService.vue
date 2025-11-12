<template>
  <div>
    <h5>Create SSI Service</h5>
    <p class="text-muted">
      Request credit and create your SSI Service. Issuer DID will be registered automatically.
    </p>

    <!-- Error Message Display -->
    <div v-if="errorMessage" class="alert alert-danger mt-3" role="alert">
      <i class="mdi mdi-alert-circle-outline mr-2"></i>
      {{ errorMessage }}
      <button type="button" class="close" @click="$emit('clear-error')" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>

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
      <div v-if="!isProcessingCredit && !isCreditAlreadyRequested">
        <b-button v-if="localNetworkType === 'testnet'" variant="info" @click="$emit('process-credit')">
          Request Credit
        </b-button>

        <b-button v-if="localNetworkType === 'mainnet'" variant="info" @click="goToBilling">
          Go to Billing Page
        </b-button>
      </div>

      <div v-if="isProcessingCredit" class="processing-box mt-3 p-3 bg-light rounded">
        <b-spinner small type="grow" v-if="!creditProcessComplete"></b-spinner>
        <div class="mt-2">
          <p class="mb-0">Processing your credit request...</p>
        </div>
      </div>

      <!-- Completion Message -->
      <div v-if="!isProcessingCredit && isCreditAlreadyRequested" class="mt-3 p-3 bg-info text-white rounded">
        <h6 class="mb-2">
          <i class="mdi mdi-check-circle-outline mr-2"></i>
          {{ getCreditStatusTitle() }}
        </h6>
        <p class="mb-0">
          {{ getCreditStatusMessage() }}
        </p>
      </div>

      <div class="text-right mt-3">
        <b-button v-if="isCreditAlreadyRequested || isCreditApproved" variant="secondary" @click="$emit('prev-step')"
          disabled>Back</b-button>


        <b-button v-else variant="secondary" @click="$emit('prev-step')">Back</b-button>
        <b-button v-if="!isCreditApproved" variant="primary" disabled>
          Finish
        </b-button>
        <b-button v-else variant="primary" @click="$emit('finish')">
          <i class="mdi mdi-check-circle-outline mr-1"></i>
          Finish
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
    "isProcessingCredit",
    "creditProcessComplete",
    "company",
    "errorMessage",
  ],
  data() {
    return {
      localNetworkType: this.networkType,
    };
  },
  computed: {
    isCreditAlreadyRequested() {
      if (!this.company) return false;

      // Check onboarding status first
      if (this.company.onboardingStatus) {
        const status = this.getNormalizedStatus();
        if (status === '') {
          return false;
        }

        return ['INITIATED', 'APPROVED','FAILED'].includes(status);
      }

      // Fallback: Check logs for credit-related steps
      if (!Array.isArray(this.company.logs)) return false;

      const creditSteps = ['CREDIT_SSI_SERVICE', 'CREDIT_KYC_SERVICE'];
      return this.company.logs.some(log =>
        creditSteps.includes(log.step) &&
        ['SUCCESS', 'FAILED'].includes(log.status)
      );
    },

    isCreditApproved() {
      if (!this.company) return false;

      // Check onboarding status for APPROVED
      const status = this.getNormalizedStatus();
      return status === 'APPROVED';
    },
  },
  watch: {
    // Watch for changes in company onboarding status
    'company.onboardingStatus': {
      handler(newStatus, oldStatus) {
        console.log('StepCreateSSIService: Onboarding status changed from', oldStatus, 'to:', newStatus);

        // If status changed to APPROVED, log for user feedback
        if (newStatus && newStatus.toUpperCase() === 'APPROVED') {
          console.log('StepCreateSSIService: Credit approved!');
        }
      },
      immediate: true
    },

    // Watch for changes in the computed property
    isCreditApproved: {
      handler(isApproved) {
        console.log('StepCreateSSIService: isCreditApproved changed to:', isApproved);
        if (isApproved) {
          this.$emit('finish');
        }
      },
      immediate: true
    }
  },
  methods: {
    getNormalizedStatus() {
      return this.company?.onboardingStatus?.toUpperCase() || '';
    },

    getCreditStatusTitle() {
      const status = this.getNormalizedStatus();
      console.log('StepCreateSSIService: Current status for title:', status);

      if (status === '') {
        return 'Credit Request Not Initiated';
      }

      const statusTitles = {
        'APPROVED': 'Credit Request Approved',
        'INITIATED': 'Onboarding Submitted',
      };

      return statusTitles[status] || 'Credit Request Already Initiated';
    },

    getCreditStatusMessage() {
      const status = this.getNormalizedStatus();
      if (status === '') {
        return 'Request Credit to proceed with the onboarding.';
      }

      const statusMessages = {
        'APPROVED': 'Your credit request has been approved. You can now proceed to add team members.',
        'INITIATED': 'Your credit request has been submitted and is being processed.',
      };

      return statusMessages[status] || 'Your credit request has been submitted and is being processed';
    },

    goToBilling() {
      console.log("Redirecting to billing...");
    },
  },
};
</script>