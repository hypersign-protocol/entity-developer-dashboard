<template>
  <div v-if="!hasService" class="container onboarding-stepper">
    <div class="text-center mb-4">
      <h4><i class="mdi mdi-account-plus-outline mr-2"></i>Customer Onboarding</h4>
      <p class="text-muted">Follow the steps below to set up your SSI and KYC/KYB services.</p>
    </div>

    <!-- Stepper Header -->
    <!-- <div class="d-flex justify-content-between align-items-center mb-4 stepper-header">
      <div v-for="(step, index) in steps" :key="index" class="step-item text-center"
        :class="{ active: currentStep === index + 1, completed: currentStep > index + 1 }">
        <div class="step-circle">
          <span v-if="currentStep > index + 1"><i class="mdi mdi-check"></i></span>
          <span v-else>{{ index + 1 }}</span>
        </div>
        <div class="step-label mt-2">{{ step.label }}</div>
      </div>
    </div> -->

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
      <component :is="currentComponent" :company="company" :network-type="networkType" 
        :is-simulating="isSimulating"
        :isSimulatingID="isSimulatingID"
        :simulation-logs="simulationLogs" 
        :idSimulationLogs="idSimulationLogs"
        :simulation-complete="simulationComplete" 
        :simulationCompleteID="simulationCompleteID"
        @update:company="company = $event" @update:network-type="networkType = $event" @next-step="nextStep"
        @prev-step="prevStep" @simulate-credit="simulateCreditProcess" @simulate-id-service="simulateIDServiceSetup"
        @finish="finishOnboarding" />
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
        contact_email: "", 
        billing_address:"", 
        twitter_profile: "", 
        linkedIn_profile: "", 
        phone_no: "" , 
        country: "",
        interests: [],
        yearly_volume: "",
        fields: [],
       },
      networkType: "testnet",
      steps: [
        { label: "Company Details" },
        { label: "Preview Company Details"},
        { label: "Create SSI Service" },
        { label: "Setup Business Identity" },
        { label: "Create Team" },
      ],
      // simulation states
      isSimulating: false,
      simulationLogs: [],
      simulationComplete: false,
      isSimulatingID: false,
      idSimulationLogs: [],
      simulationCompleteID: false,
    };
  },
  computed: {
    currentComponent() {
      switch (this.currentStep) {
        case 1:
          return StepCompanyDetails;
        case 2:
          return StepCompanyPreview;
        case 3:
          return StepCreateSSIService;
        case 4:
          return StepAddTeam;
        default:
          return StepCompletion;
      }
    },
  },
  methods: {
    nextStep() {
      if (this.currentStep < this.steps.length + 1) this.currentStep++;
    },
    prevStep() {
      if (this.currentStep > 1) this.currentStep--;
    },
    finishOnboarding() {
      this.currentStep++;
    },
    async simulateCreditProcess() {
      this.isSimulating = true;
      this.simulationComplete = false;
      this.simulationLogs = [];

      const steps = [
        { message: "Credit is being given...", delay: 1200 },
        { message: "Token credited - <100 $HID>", delay: 1200 },
        { message: "Issuer DID is being created...", delay: 1500 },
        {
          message:
            "Issuer DID is registered on blockchain - did:hid:testnet:abc123xyz",
          delay: 1800,
        },
      ];

      for (const step of steps) {
        await new Promise((r) => setTimeout(r, step.delay));
        this.simulationLogs.push({ message: step.message, done: true });
      }
      this.simulationComplete = true;
    },
    async simulateIDServiceSetup() {
      console.log('simulateIDServiceSetup button clicked...')
      this.isSimulatingID = true;
      this.simulationCompleteID = false;
      this.idSimulationLogs = [];

      const steps = [
        { message: "ID service pod is being setup...", delay: 1200 },
        { message: "ID service pod started.", delay: 1200 },
        { message: "Admin user is given access to ID dashboard.", delay: 1500 },
        { message: "Finish", delay: 800 },
      ];

      // Wait for DOM to update
      await this.$nextTick();

      for (let step of steps) {
        await new Promise((resolve) => setTimeout(resolve, step.delay));
        this.idSimulationLogs.push({ message: step.message, done: true });
      }

      this.simulationCompleteID = true;
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
  background-color: #007bff; /* or your brand color */
}


.onboarding-stepper {
  max-width: 700px;
}

/* Stepper Styles */
.stepper-header {
  position: relative;
}

.step-item {
  flex: 1;
  position: relative;
}

.step-item:not(:last-child)::after {
  content: "";
  position: absolute;
  top: 20px;
  right: -50%;
  height: 2px;
  width: 100%;
  background: #dee2e6;
  z-index: 0;
}

.step-item.completed:not(:last-child)::after {
  background: #28a745;
}

.step-circle {
  width: 40px;
  height: 40px;
  line-height: 38px;
  border-radius: 50%;
  background: #dee2e6;
  color: #6c757d;
  margin: 0 auto;
  font-weight: bold;
  position: relative;
  z-index: 1;
}

.step-item.active .step-circle {
  background: #007bff;
  color: #fff;
}

.step-item.completed .step-circle {
  background: #28a745;
  color: #fff;
}

.step-label {
  font-size: 0.9rem;
  font-weight: 500;
}

.simulation-box {
  min-height: 100px;
}

.simulation-log {
  font-size: 0.9rem;
  color: #6c757d;
  margin-bottom: 4px;
}

.simulation-log.done {
  color: #28a745;
  font-weight: 500;
}
</style>
