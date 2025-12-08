<template>
  <div v-if="!hasService" class="container onboarding-stepper">
    <load-ing :active.sync="isLoading" :can-cancel="true" :is-full-page="true"></load-ing>
    <div class="text-center mb-4">
  <h4>
    <i class="mdi mdi-shield-account-outline mr-1"></i>
    Configure Your Identity Service
  </h4>
  <p class="text-muted">
    Complete the guided steps to set up your identity verification services.
  </p>
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

   

    <!-- Step Content -->
    <div class="step-content">
      <component v-if="!isLoading" :is="currentComponent" :company="company" :network-type="networkType"
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
  },
  data() {
    return {
      isLoading:false,
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
        twitterUrl: "",
        linkedinUrl: "",
        telegramUrl: "",
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
      this.isLoading = true
      this.$store.dispatch('mainStore/checkIfAlreadyExistOnBoarding')
        .then((existingOnboarding) => {
          this.isLoading = false
          if (existingOnboarding && existingOnboarding._id) {
            this.populateCompanyFromOnboarding(existingOnboarding);
            this.setCompletionStatus(existingOnboarding);
          }
        })
        .catch((e) => {
          this.isLoading = false
          console.error(e.message)
        });
    },

    setCompletionStatus(onboardingData) {
      const status = (onboardingData.onboardingStatus || onboardingData.status || '').toUpperCase();
      this.creditProcessComplete = ['APPROVED', 'INITIATED','FAILED'].includes(status);
        
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
        twitterUrl: onboardingData.twitterUrl || '',
        linkedinUrl: onboardingData.linkedinUrl || '',
        telegramUrl: onboardingData.telegramUrl || '',
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
      this.$router.push('/studio/dashboard');
    },

    async processCreditRequest() {
      this.isProcessingCredit = true;
      this.creditProcessComplete = false;
      setTimeout(async () => {

          try {
        
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

      }, 2000)
      
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
        twitterUrl: this.company.twitterUrl || '',
        linkedinUrl: this.company.linkedinUrl || '',
        telegramUrl: this.company.telegramUrl || '',
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

<style>
/* Custom button styles for onboarding stepper */
.onboarding-stepper .btn-primary {
  background: #667eea;
  border: none;
  color: white;
  font-weight: 600;
  padding: 8px 20px;
  border-radius: 6px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.onboarding-stepper .btn-primary:not(:disabled):hover {
  background: #5a6fd8;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  color: white;
}

.onboarding-stepper .btn-primary:disabled {
  background: #cccccc;
  box-shadow: none;
  transform: none;
  opacity: 0.6;
  color: #666666;
}

.onboarding-stepper .btn-info:disabled {
  background: #cccccc;
  box-shadow: none;
  transform: none;
  opacity: 0.6;
  color: #666666;
}

.onboarding-stepper .btn-secondary {
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  color: #6c757d;
  font-weight: 600;
  padding: 8px 20px;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.onboarding-stepper .btn-secondary:not(:disabled):hover {
  background: #e9ecef;
  border-color: #dee2e6;
  color: #495057;
  transform: translateY(-1px);
}

.onboarding-stepper .btn-info {
  background: #17a2b8;
  border: none;
  color: white;
  font-weight: 600;
  padding: 8px 20px;
  border-radius: 6px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(23, 162, 184, 0.3);
}

.onboarding-stepper .btn-info:not(:disabled):hover {
  background: #138496;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(23, 162, 184, 0.4);
  color: white;
}

.onboarding-stepper .btn-info:disabled {
  background: #cccccc;
  box-shadow: none;
  transform: none;
  opacity: 0.6;
  color: #666666;
}

.onboarding-stepper .btn-light {
  background: #ffffff;
  border: 2px solid #e9ecef;
  color: #6c757d;
  font-weight: 600;
  padding: 8px 20px;
  border-radius: 6px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.onboarding-stepper .btn-secondary:disabled {
  background: #cccccc;
  border-color: #cccccc;
  box-shadow: none;
  transform: none;
  opacity: 0.6;
  color: #666666;
}

.onboarding-stepper .btn-light:disabled {
  background: #cccccc;
  border-color: #cccccc;
  box-shadow: none;
  transform: none;
  opacity: 0.6;
  color: #666666;
}
</style>
