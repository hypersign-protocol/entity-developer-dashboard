<template>
  <div>
    <h5 v-if="!selectedBusinessType">Select Your Business Type</h5>

    <!-- Step 1: Choose Business Type -->
    <div v-if="!selectedBusinessType" class="business-type-select">
  <b-row>
    <b-col
      v-for="(label, key) in BUSINESS_TYPE"
      :key="key"
      cols="12"
      md="4"
      class="mb-3"
    >
      <b-card
        class="text-center selectable-card"
        :class="{ selected: localCompany.type === key }"
        @click="selectBusinessType(key)"
      >
        <div class="py-4">
          <i
            v-if="key === 'BUSINESS'"
            class="mdi mdi-domain text-primary mb-3"
            style="font-size: 2rem;"
          ></i>
          <i
            v-else-if="key === 'INDIVIDUAL'"
            class="mdi mdi-account-outline text-primary mb-3"
            style="font-size: 2rem;"
          ></i>
          <i
            v-else
            class="mdi mdi-account-group-outline text-primary mb-3"
            style="font-size: 2rem;"
          ></i>
          <h6 class="mt-2">{{ label }}</h6>
        </div>
      </b-card>
    </b-col>
  </b-row>
</div>
    <!-- Step 2: Company Details Form -->
    <div v-else-if="selectedBusinessType">
      <h5 class="mb-3">Enter Company Details</h5>
      <b-form @submit.prevent="nextStep">
        <b-row>
          <b-col md="6">
            <b-form-group label="Company Name">
              <b-form-input v-model="localCompany.name" required />
            </b-form-group>
          </b-col>

          <b-col md="6">
            <b-form-group label="Domain">
              <b-form-input v-model="localCompany.domain" required />
            </b-form-group>
          </b-col>
        </b-row>

        <b-row>
          <b-col md="6">
            <b-form-group label="Country">
              <b-form-input v-model="localCompany.country" required />
            </b-form-group>
          </b-col>

          <b-col md="6">
            <b-form-group label="Registration Number">
              <b-form-input v-model="localCompany.registration_number" />
            </b-form-group>
          </b-col>
        </b-row>

        <b-row>
          <b-col md="6">
            <b-form-group label="Contact Email">
              <b-form-input type="email" v-model="localCompany.contact_email" required />
            </b-form-group>
          </b-col>

          <b-col md="6">
            <b-form-group label="Phone Number">
              <b-form-input v-model="localCompany.phone_no" />
            </b-form-group>
          </b-col>
        </b-row>
        
        <b-row>
          <b-col md="6">
            <b-form-group label="Company Logo">
              <b-form-file v-model="logoFile" accept="image/*" @change="previewLogo" />
            </b-form-group>  
          </b-col>
          <b-col md="6">
            <div v-if="localCompany.logo" class="mt-2">
            <img :src="localCompany.logo" class="logo-preview" alt="Logo Preview" />
          </div>
          </b-col>

        </b-row>

        
        <b-row>
          <b-col md="6">
            <b-form-group label="Twitter Profile (optional)">
              <b-form-input
                v-model="localCompany.twitter_profile"
                placeholder="https://twitter.com/yourcompany"
              />
            </b-form-group>
          </b-col>

          <b-col md="6">
            <b-form-group label="LinkedIn Profile (optional)">
              <b-form-input
                v-model="localCompany.linkedIn_profile"
                placeholder="https://linkedin.com/company/yourcompany"
              />
            </b-form-group>
          </b-col>
        </b-row>

        <!-- Interests -->
        <hr />
        <h6 class="mt-4">What services are you interested in?</h6>
        <b-form-checkbox-group
          v-model="localCompany.interests"
          :options="interestOptions"
          stacked
        />

        <!-- Yearly Volume -->
        <hr />
        <h6 class="mt-4">Estimated Yearly Verification Volume</h6>
        <b-form-radio-group
          v-model="localCompany.yearly_volume"
          :options="volumeOptions"
          stacked
        />

        <!-- Business Fields -->
        <hr />
        <h6 class="mt-4">Which industry does your business belong to?</h6>
        <b-form-checkbox-group
          v-model="localCompany.fields"
          :options="fieldOptions"
          stacked
        />

        <!-- Actions -->
        <div class="text-right mt-4">
          <b-button variant="secondary" @click="resetStep">Back</b-button>
          <!-- <b-button variant="primary" type="submit">Next</b-button> -->
          <b-button variant="primary" type="submit" @click="$emit('update:company', localCompany)"> Next
                    </b-button>
        </div>
      </b-form>
    </div>

    <!-- Inline Preview Step (Child Component) -->
    <!-- <transition name="fade">
      <div v-if="showPreview">
        <StepCompanyPreview
          :company="localCompany"
          @prev-step="showPreview = false"
          @next-step="emitNextStep"
        />
      </div>
    </transition> -->
  </div>
</template>

<script>
export default {
  name: "StepCompanyDetails",
  props: ["company"],
  data() {
    return {
      showPreview: false,
      BUSINESS_TYPE: {
        BUSINESS: "Business",
        INDIVIDUAL: "Individual",
        COMMUNITY: "Community",
      },
      BUSINESS_INTERESTED_IN: {
        ID_VERIFICATION: "ID Verification",
        AML_SCREEN: "AML Screening",
        BIOMETRIC_VERIFCATION: "Biometric Verification",
        PROOF_OF_ADDRESS: "Proof Of Address",
      },
      BUSINESS_EST_YEARLY_VOLUME: {
        ZERO_ONEK: "0 - 1,000",
        ONEKONE_TWENTYK: "1,001 - 20,000",
        TWENTYKONE_FIFTYK: "20,000 - 50,000",
        PLUS_FIFTYK: "+50,000",
      },
      BUSINESS_FIELDS: {
        FINTECH: "Fintech",
        CRYPTO: "Crypto",
        GAMBLING: "Gambling",
        MARKETPLACES: "Marketplaces",
        ONLINE_TRAVEL: "Online Travel",
        TELCO: "Telco",
        E_COMM: "E-commerce",
      },
      localCompany: {
        ...this.company,
      },
      selectedBusinessType: null,
      logoFile: null,
    };
  },
  computed: {
    interestOptions() {
      return Object.values(this.BUSINESS_INTERESTED_IN);
    },
    volumeOptions() {
      return Object.values(this.BUSINESS_EST_YEARLY_VOLUME);
    },
    fieldOptions() {
      return Object.values(this.BUSINESS_FIELDS);
    },
  },
  methods: {
    selectBusinessType(type) {
      this.localCompany.type = type;
      this.selectedBusinessType = type;
    },
    resetStep() { this.selectedBusinessType = null; },
    previewLogo(event) {
      const file = event.target.files[0];
      if (file) {
        this.localCompany.logo = URL.createObjectURL(file);
      }
    },
    goToPreview() {
      this.$emit("update:company", this.localCompany);
      // this.showPreview = true;
    },
    nextStep() {
      this.$emit("update:company", this.localCompany);
      this.$emit("next-step");
    },
  },
};
</script>

<style scoped>
.selectable-card {
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.3s;
}
.selectable-card:hover {
  border-color: #007bff;
  transform: translateY(-2px);
}
.selectable-card.selected {
  border-color: #007bff;
  background-color: #e9f5ff;
}
.logo-preview {
  max-height: 60px;
  border-radius: 8px;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
