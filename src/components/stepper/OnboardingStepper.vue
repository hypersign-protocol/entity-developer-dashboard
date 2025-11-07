<template>
  <div v-if="!hasService" class="container onboarding-stepper">
    <div class="text-center mb-4">
      <h4><i class="mdi mdi-account-plus-outline mr-2"></i>Customer Onboarding</h4>
      <p class="text-muted">Follow the steps below to set up your SSI and KYC/KYB services.</p>
    </div>

    <!-- Stepper Header -->
    <div class="progress-stepper d-flex justify-content-center align-items-center mb-4">
      <div
        v-for="(step, index) in steps"
        :key="index"
        class="step-bar mx-1"
        :class="{ active: currentStep > index }"
      ></div>
    </div>

    <!-- Onboarding Logs Section - Only show on credit request step -->
    <div v-if="company.logs && company.logs.length > 0 && currentStep === 3" class="mb-4">
      <div class="card">
        <div class="card-header">
          <h6 class="mb-0"><i class="mdi mdi-history mr-2"></i>Onboarding Process Logs</h6>
        </div>
        <div class="card-body">
          <div class="logs-container" style="max-height: 200px; overflow-y: auto;">
            <div v-for="(log, index) in company.logs" :key="index" class="log-entry mb-2 p-2 rounded" :class="{
              'bg-success text-white': log.status === 'SUCCESS',
              'bg-danger text-white': log.status === 'FAILED',
              'bg-warning text-dark': log.status !== 'SUCCESS' && log.status !== 'FAILED'
            }">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <strong>{{ formatStepName(log.step) }}</strong>
                  <div class="small mt-1">
                    <i class="mdi mdi-clock-outline mr-1"></i>{{ formatDate(log.time) }}
                  </div>
                  <div v-if="log.failureReason" class="small mt-1 text-danger">
                    <i class="mdi mdi-alert-circle-outline mr-1"></i>{{ log.failureReason }}
                  </div>
                </div>
                <div>
                  <span class="badge" :class="{
                    'badge-success': log.status === 'SUCCESS',
                    'badge-danger': log.status === 'FAILED',
                    'badge-warning': log.status !== 'SUCCESS' && log.status !== 'FAILED'
                  }">
                    {{ log.status }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Step Content -->
    <div class="step-content">
      <component :is="currentComponent" :company="company" :network-type="networkType"
        :is-processing-credit="isProcessingCredit" :is-processing-id="isProcessingID"
        :credit-process-complete="creditProcessComplete" :id-process-complete="idProcessComplete"
        :error-message="creditErrorMessage"
        @update:company="company = $event" @update:network-type="networkType = $event" @next-step="nextStep"
        @prev-step="prevStep" @process-credit="processCreditRequest" @process-id-service="processIDServiceSetup"
        @finish="finishOnboarding" @clear-error="clearCreditError" />
    </div>
  </div>
</template>

<script>
import StepCompanyDetails from "./StepCompanyDetails.vue";
import StepCreateSSIService from "./StepCreateSSIService.vue";
import StepSetupIDService from "./StepSetupIDService.vue";
import StepCompletion from "./StepCompletion.vue";
import StepCompanyPreview from "./StepCompanyPreview.vue";
import StepAddTeam from './StepAddTeam.vue'
import config from '../../config'
export default {
  name: "OnboardingStepper",
  components: {
    StepCompanyDetails,
    StepCreateSSIService,
    StepSetupIDService,
    StepCompletion,
    StepCompanyPreview,
    StepAddTeam
  },
  data() {
    return {
      hasService: false,
      currentStep: 1,
      company: {
        name: "",
        logo: "",
        domain: "",
        type: config.BUSINESS_TYPE.BUSINESS,
        service_types: [], // Changed from service_type string to service_types array
        contact_email: "",
        billing_address: "",
        twitter_profile: "",
        linkedIn_profile: "",
        phone_no: "",
        country: "",
        interests: [],
        yearly_volume: "",
        fields: [],
      },
      networkType: "testnet",
      steps: [
        { label: "Company Details" },
        { label: "Preview Company Details" },
        { label: "Create SSI Service" },
        { label: "Create Team" },
        { label: "Complete Setup" },
      ],
      // onboarding states
      isProcessingCredit: false,
      creditProcessComplete: false,
      isProcessingID: false,
      idProcessComplete: false,
      creditErrorMessage: null,
    };
  },
  computed: {
    currentComponent() {
      const components = [
        StepCompanyDetails,
        StepCompanyPreview,
        StepCreateSSIService,
        StepAddTeam,
        StepCompletion
      ];
      return components[this.currentStep - 1] || StepCompletion;
    },

    areAllLogsSuccessful() {
      
      // Check if logs exist and all have SUCCESS status
      if (!this.company || !Array.isArray(this.company.logs) || this.company.logs.length === 0) {
        return false;
      }
      if(this.company.logs.length === 0) {
        return false;
      }
      return this.company.logs.every(log => log.status === 'SUCCESS');
    },
  },
  mounted() {
    this.checkExistingOnboarding();
  },
  watch: {
    // Watch for changes in logs and update UI reactivity
    'company.logs': {
      handler(newLogs) {
        console.log('Logs changed:', newLogs);
      },
      deep: true
    }
  },
  methods: {
    checkExistingOnboarding() {
      this.$store.dispatch('mainStore/checkIfAlreadyExistOnBoarding')
        .then((existingOnboarding) => {
          if (existingOnboarding && existingOnboarding._id) {
            this.populateCompanyFromOnboarding(existingOnboarding);
            this.setCompletionStatus(existingOnboarding);
          }
        })
        .catch(() => {
          
        });
    },

    setCompletionStatus(onboardingData) {
      const status = (onboardingData.onboardingStatus || onboardingData.status || '').toUpperCase();
      this.creditProcessComplete = ['APPROVED', 'INITIATED'].includes(status);
        
      // Stay on step 3 (Create SSI Service) even if credit is complete
      // Only allow progression to step 4 when user clicks next and all logs are successful
      this.currentStep = this.creditProcessComplete ? 3 : 1;
      console.log('Current step set to:', this.currentStep);
    },

    populateCompanyFromOnboarding(onboardingData) {
      // Create a completely new object to ensure Vue reactivity
      const newCompany = {
        name: onboardingData.companyName || '',
        logo: onboardingData.companyLogo || '',
        contact_email: onboardingData.customerEmail || '',
        domain: onboardingData.domain || '',
        type: onboardingData.type || config.BUSINESS_TYPE.BUSINESS,
        country: onboardingData.country || '',
        registration_number: onboardingData.registrationNumber || '',
        billing_address: onboardingData.billingAddress || '',
        twitter_profile: onboardingData.twitterUrl || '',
        linkedIn_profile: onboardingData.linkedinUrl || '',
        phone_no: onboardingData.phoneNumber || '',
        interests: onboardingData.interestedService || [],
        logs: onboardingData.logs || [],
        yearly_volume: onboardingData.yearlyVolume || '',
        fields: onboardingData.businessField || [],
        onboardingStatus: onboardingData.onboardingStatus || onboardingData.status || null,
        service_types: this.determineServiceTypes(onboardingData)
      };
      
      // Replace the entire company object to trigger reactivity
      this.company = newCompany;
      
      console.log('Company data updated, logs count:', this.company.logs.length);
    },

    determineServiceTypes(onboardingData) {
      if (onboardingData.isKycAndKyb) return ['KYC', 'KYB'];
      const services = [];
      if (onboardingData.isKyc) services.push('KYC');
      if (onboardingData.isKyb) services.push('KYB');
      return services;
    },

    nextStep() {
      // Check if we're trying to move from step 3 (Create SSI Service) to step 4 (Add Team)
      if (this.currentStep === 3) {
        // Only allow progression if credit is approved
        const status = (this.company.onboardingStatus || '').toUpperCase();
        if (status !== 'APPROVED') {
          console.log('OnboardingStepper: Cannot proceed to Add Team step - credit not approved yet');
          return;
        }
      }
      
      if (this.currentStep < this.steps.length) this.currentStep++;
    },

    prevStep() {
      if (this.currentStep > 1) this.currentStep--;
    },

    finishOnboarding() {
      console.log('OnboardingStepper: finishOnboarding called, emitting onboarding-complete');
      // Don't change currentStep, just emit the completion event
      this.$emit('onboarding-complete');
    },

    async processCreditRequest() {
      try {
        this.isProcessingCredit = true;
        this.creditProcessComplete = false;

        const payload = this.buildCreditRequestPayload();

        // Check for existing onboarding data
        try {
          const existingOnboarding = await this.$store.dispatch('mainStore/checkIfAlreadyExistOnBoarding');
          if (existingOnboarding && existingOnboarding._id) {
            this.mergeExistingData(payload, existingOnboarding);
          }
        } catch (error) {
          // Continue without existing data
        }

        const result = await this.$store.dispatch('mainStore/onboardCustomer', payload);
        
        // Process successful response
        this.creditProcessComplete = true;
        
        // Immediately update the onboarding status to INITIATED using Vue.set for reactivity
        this.$set(this.company, 'onboardingStatus', 'INITIATED');
        
        // Update company data with response if available
        if (result) {
          // Refresh the onboarding status once to get the complete data
          await this.checkExistingOnboarding();
        }
        
        // Force component re-render to ensure UI updates
        this.$forceUpdate();
        
      } catch (error) {
        console.log('Error processing credit request:', error);
        
        // Handle different error types
        let errorMessage = 'Failed to process credit request';
        
          // Set error message for display
        this.creditErrorMessage = errorMessage;
        
      } finally {
        this.isProcessingCredit = false;
      }
    },

    buildCreditRequestPayload() {
      const hasKyc = this.company.service_types.includes('KYC');
      const hasKyb = this.company.service_types.includes('KYB');
      const hasBoth = hasKyc && hasKyb;

      return {
        companyName: this.company.name,
        companyLogo: this.company.logo || 'https://via.placeholder.com/150',
        customerEmail: this.company.contact_email,
        domain: this.company.domain,
        type: this.company.type,
        country: this.company.country || '',
        registrationNumber: this.company.registration_number || '',
        billingAddress: this.company.billing_address || '',
        twitterUrl: this.company.twitter_profile || '',
        linkedinUrl: this.company.linkedIn_profile || '',
        phoneNumber: this.company.phone_no || '',
        interestedService: this.company.interests || [],
        yearlyVolume: this.company.yearly_volume || '',
        businessField: this.company.fields || [],
        isKyc: hasBoth ? false : hasKyc,
        isKyb: hasBoth ? false : hasKyb,
        isKycAndKyb: hasBoth
      };
    },

    mergeExistingData(payload, existingOnboarding) {
      payload.companyName = payload.companyName || existingOnboarding.companyName;
      payload.customerEmail = payload.customerEmail || existingOnboarding.customerEmail;
      payload.domain = payload.domain || existingOnboarding.domain;
    },

    async processIDServiceSetup() {
      try {
        this.isProcessingID = true;
        this.idProcessComplete = false;
        await new Promise(resolve => setTimeout(resolve, 2000));
        this.idProcessComplete = true;
      } catch (error) {
        console.error('Error processing ID service setup:', error);
        throw error;
      } finally {
        this.isProcessingID = false;
      }
    },

    formatStepName(step) {
      const stepNames = {
        'CREATE_TEAM_ROLE': 'Create Team & Roles',
        'CREATE_SSI_SERVICE': 'Create SSI Service',
        'CREDIT_SSI_SERVICE': 'Credit SSI Service',
        'CREATE_DID': 'Create DID',
        'REGISTER_DID': 'Register DID',
        'CREATE_KYC_SERVICE': 'Create KYC Service',
        'GIVE_KYC_DASHBOARD_ACCESS': 'Grant KYC Dashboard Access',
        'CREDIT_KYC_SERVICE': 'Credit KYC Service',
        'SETUP_KYC_WIDGET': 'Setup KYC Widget',
        'CONFIGURE_KYC_VERIFIER_PAGE': 'Configure KYC Verifier Page',
        'COMPLETED': 'Onboarding Completed'
      };
      return stepNames[step] || step;
    },

    formatDate(dateString) {
      if (!dateString) return '';
      return new Date(dateString).toLocaleString();
    },

    clearCreditError() {
      this.creditErrorMessage = null;
    }
  },
};
</script>

<style scoped>
/* Minimal Progress Bar Stepper */
.progress-stepper {
  height: 8px;
}

.step-bar {
  width: 70px;
  height: 8px;
  border-radius: 4px;
  background-color: #e0e0e0;
  transition: all 0.3s ease;
}

.step-bar.active {
  background-color: #007bff;
}

.onboarding-stepper {
  max-width: 700px;
}

.processing-box {
  min-height: 100px;
}

.logs-container .log-entry {
  border-left: 4px solid;
}

.logs-container .log-entry.bg-success {
  border-left-color: #28a745;
}

.logs-container .log-entry.bg-danger {
  border-left-color: #dc3545;
}

.logs-container .log-entry.bg-warning {
  border-left-color: #ffc107;
}
</style>
