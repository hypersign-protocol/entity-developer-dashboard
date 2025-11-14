<template>
  <div>
    <h5>Credits Request</h5>
    <p class="text-muted">
      Requesting credits to setup your business identity on blockchain and setup your ID services.
    </p>

    <!-- Error Message Display -->
    <div v-if="errorMessage" class="alert alert-danger mt-3" role="alert">
      <i class="mdi mdi-alert-circle-outline mr-2"></i>
      {{ errorMessage }}
      <button type="button" class="close" @click="$emit('clear-error')" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="mt-3">
      <div v-if="isProcessingCredit" class="processing-box mt-3 p-3 bg-light rounded">
        <div class="mt-2">
          <b-spinner small type="grow" v-if="!creditProcessComplete"></b-spinner>
          <p class="mb-0">Processing your credit request...</p>
        </div>
      </div>

      <!-- Completion Message -->
      <div v-if="!isProcessingCredit && isCreditAlreadyRequested && company.logs.length == 0"
        class="mt-3 p-3 bg-info text-white rounded">
        <h6 class="mb-2">
          <i class="mdi mdi-check-circle-outline mr-2"></i>
          {{ getCreditStatusMessage() }}
        </h6>
      </div>

      <!-- Onboarding Logs Section - Only show on credit request step -->



      <div v-if="company.logs && company.logs.length > 0" class="mb-4">
        <div class="card shadow-sm">
          <div class="card-header d-flex align-items-center">
            <h6 class="mb-0">
              <i class="mdi mdi-history mr-2"></i>
              Process Logs
            </h6>
          </div>

          <div class="card-body p-0">
            <div class="logs-container" style="max-height: 260px; overflow-y: auto;">

              <div v-for="(log, index) in formattedLogs" :key="index"
                class="log-entry border-bottom px-3 py-2 d-flex justify-content-between align-items-start">

                <!-- LEFT SECTION -->
                <div>
                  <div class="font-weight-bold">
                    {{ formatStepName(log.step) }}
                  </div>

                  <div class="small text-muted mt-1">
                    <i class="mdi mdi-clock-outline mr-1"></i>
                    {{ formatDate(log.time) }}
                  </div>

                  <!-- Error Reason -->
                  <div v-if="log.status === 'FAILED' && log.failureReason"
                    class="small mt-2 text-danger d-flex align-items-start">
                    <!-- <i class="mdi mdi-alert-circle-outline mr-1 mt-1"></i> -->
                    <span>{{ log.failureReason }}</span>
                  </div>
                </div>

                <!-- RIGHT SECTION -->
                <div>
                  <span class="badge px-3 py-1" :class="{
                    'badge-success': log.status === 'SUCCESS',
                    'badge-danger': log.status === 'FAILED',
                    'badge-warning text-dark': log.status !== 'SUCCESS' && log.status !== 'FAILED'
                  }">
                    {{ log.status }}
                  </span>
                </div>

              </div>

            </div>
          </div>
        </div>
      </div>

      <div class="text-right mt-3">
        <b-button v-if="isCreditAlreadyRequested || isCreditApproved" variant="link" @click="$emit('prev-step')"
          disabled>Back</b-button>
        <b-button v-else variant="link" @click="$emit('prev-step')">Back</b-button>
        <v-btn v-if="!isCreditApproved" class="btn btn-outline-secondary" disabled>
          Finish
        </v-btn>
        <v-btn v-else class="btn btn-outline-secondary" @click="$emit('finish')">
          <i class="mdi mdi-check-circle-outline mr-1"></i>
          Finish
        </v-btn>
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
  mounted() {
    if (!this.isCreditAlreadyRequested) {
      this.$emit('process-credit');
    }
  },
  computed: {
    formattedLogs() {
      if (!this.company.logs) return [];
      return this.company.logs
        .map(l => ({
          ...l,
          time: l.time?.$date || l.time || null
        }))
        .sort((a, b) => new Date(a.time) - new Date(b.time));
    },
    isCreditAlreadyRequested() {
      if (!this.company) return false;

      // Check onboarding status first
      if (this.company.onboardingStatus) {
        const status = this.getNormalizedStatus();
        if (status === '') {
          return false;
        }

        return ['INITIATED', 'APPROVED', 'FAILED'].includes(status);
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

    formatStepName(step) {
      const stepNames = {
        'CREATE_TEAM_ROLE': 'Setting up Team & Roles',
        'CREATE_SSI_SERVICE': 'Creating SSI Service',
        'CREDIT_SSI_SERVICE': 'Crediting SSI Service',
        'CREATE_DID': 'Creating Business Identity',
        'REGISTER_DID': 'Registering Business Identity on Blockchain',
        'CREATE_KYC_SERVICE': 'Creating ID Service',
        'GIVE_KYC_DASHBOARD_ACCESS': 'Granting ID Dashboard Access',
        'CREDIT_KYC_SERVICE': 'Crediting ID Service',
        'SETUP_KYC_WIDGET': 'Setting up KYC Widget',
        'CONFIGURE_KYC_VERIFIER_PAGE': 'Configuring KYC Verifier Page',
        'COMPLETED': 'Onboarding Complete'
      };
      return stepNames[step] || step;
    },

    formatDate(dateString) {
      if (!dateString) return '';
      return new Date(dateString).toLocaleString();
    },
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