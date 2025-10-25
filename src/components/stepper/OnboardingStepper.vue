<template>
  <div v-if="!hasService" class="container onboarding-stepper">
    <b-card>
      <div class="text-center mb-4">
        <h4><i class="mdi mdi-account-plus-outline mr-2"></i>Customer Onboarding</h4>
        <p class="text-muted">Follow the steps below to set up your SSI and KYC/KYB services.</p>
      </div>

      <!-- Stepper Header -->
      <div class="d-flex justify-content-between align-items-center mb-4 stepper-header">
        <div
          v-for="(step, index) in steps"
          :key="index"
          class="step-item text-center"
          :class="{ active: currentStep === index + 1, completed: currentStep > index + 1 }"
        >
          <div class="step-circle">
            <span v-if="currentStep > index + 1"><i class="mdi mdi-check"></i></span>
            <span v-else>{{ index + 1 }}</span>
          </div>
          <div class="step-label mt-2">{{ step.label }}</div>
        </div>
      </div>

      <!-- Step Content -->
      <div class="step-content">
        <!-- Step 1: Company Details -->
        <div v-if="currentStep === 1">
          <h5>Enter Company Details</h5>
          <b-form @submit.prevent="submitCompanyDetails">
            <b-form-group label="Company Name">
              <b-form-input v-model="company.name" required></b-form-input>
            </b-form-group>
            <b-form-group label="Company Logo URL">
              <b-form-input v-model="company.logo"></b-form-input>
            </b-form-group>
            <b-form-group label="Domain">
              <b-form-input v-model="company.domain" required></b-form-input>
            </b-form-group>

            <div class="text-right">
              <b-button variant="primary" type="submit">Next</b-button>
            </div>
          </b-form>
        </div>

        <!-- Step 2: Create SSI Service -->
        <div v-else-if="currentStep === 2">
          <h5>Create SSI Service</h5>
          <p class="text-muted">
            Request credit and create your SSI Service. Issuer DID will be registered automatically.
          </p>

          <b-form-group label="Select Network Type">
            <b-form-radio-group
              v-model="networkType"
              :options="[
                { text: 'Testnet', value: 'testnet' },
                { text: 'Mainnet', value: 'mainnet' },
              ]"
              buttons
              button-variant="outline-primary"
              name="networkType"
            />
          </b-form-group>

          <div class="mt-3">
            <div v-if="!isSimulating">
              <b-button
                v-if="networkType === 'testnet'"
                variant="info"
                :disabled="isSimulating"
                @click="simulateCreditProcess"
              >
                Request Credit
              </b-button>

              <b-button
                v-if="networkType === 'mainnet'"
                variant="info"
                @click="goToBilling"
              >
                Go to Billing Page
              </b-button>
            </div>

            <!-- Stepwise loader -->
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

            <!-- Continue Button -->
            <div class="text-right mt-3">
              <b-button variant="secondary" @click="prevStep" :disabled="isSimulating">Back</b-button>
              <b-button
                variant="primary"
                :disabled="!simulationComplete"
                @click="nextStep"
              >
                Next
              </b-button>
            </div>
          </div>
        </div>

        <!-- Step 3: Setup ID Service -->
        <div v-else-if="currentStep === 3">
          <h5>Setup ID Service</h5>
          <p class="text-muted">
            Your ID service pod will now be initialized and access granted automatically.
          </p>

          <!-- Stepwise loader for ID Service -->
          <div class="mt-3">
            <div v-if="!isSimulatingID">
              <b-button
                variant="info"
                :disabled="isSimulatingID"
                @click="simulateIDServiceSetup"
              >
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
              <b-button variant="secondary" @click="prevStep" :disabled="isSimulatingID">Back</b-button>
              <b-button
                variant="success"
                :disabled="!simulationCompleteID"
                @click="finishOnboarding"
              >
                Finish
              </b-button>
            </div>
          </div>
        </div>

        <!-- Completion -->
        <div v-else>
          <div class="text-center">
            <h5>🎉 Setup Complete!</h5>
            <p>You can now create and manage your KYC/KYB services.</p>
            <b-button variant="primary" @click="goToDashboard">Go to Dashboard</b-button>
          </div>
        </div>
      </div>
    </b-card>
  </div>
</template>

<script>
export default {
  name: "OnboardingStepper",
  data() {
    return {
      hasService: false,
      currentStep: 1,
      company: { name: "", logo: "", domain: "" },
      networkType: "testnet",
      steps: [
        { label: "Company Details" },
        { label: "Create SSI Service" },
        { label: "Setup ID Service" },
      ],

      // Step 2 simulation
      isSimulating: false,
      simulationLogs: [],
      simulationComplete: false,

      // Step 3 simulation
      isSimulatingID: false,
      idSimulationLogs: [],
      simulationCompleteID: false,
    };
  },
  methods: {
    submitCompanyDetails() {
      this.currentStep++;
    },
    goToBilling() {
      console.log("Redirecting to billing page...");
    },
    prevStep() {
      if (this.currentStep > 1) this.currentStep--;
    },
    nextStep() {
      if (this.currentStep < this.steps.length + 1) this.currentStep++;
    },
    finishOnboarding() {
      this.currentStep++;
    },
    goToDashboard() {
      console.log("Redirecting to dashboard...");
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

      for (let step of steps) {
        await new Promise((resolve) => setTimeout(resolve, step.delay));
        this.simulationLogs.push({ message: step.message, done: true });
      }

      this.simulationComplete = true;
    },

    async simulateIDServiceSetup() {
      this.isSimulatingID = true;
      this.simulationCompleteID = false;
      this.idSimulationLogs = [];

      const steps = [
        { message: "ID service pod is being setup...", delay: 1200 },
        { message: "ID service pod started.", delay: 1200 },
        { message: "Admin user is given access to ID dashboard.", delay: 1500 },
        { message: "Finish", delay: 800 },
      ];

      for (let step of steps) {
        await new Promise((resolve) => setTimeout(resolve, step.delay));
        this.idSimulationLogs.push({ message: step.message, done: true });
      }

      this.simulationCompleteID = true;
    },
  },
};
</script>

<style scoped>
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
