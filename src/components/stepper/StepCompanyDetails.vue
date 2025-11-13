<template>
  <div>
    <h5 v-if="!selectedBusinessType">Select Your Business Type</h5>

    <!-- Step 1: Choose Business Type -->
    <div v-if="!selectedBusinessType" class="business-type-select">
      <b-row>
        <b-col v-for="(label, key) in BUSINESS_TYPE" :key="key" cols="12" md="4" class="mb-3">
          <b-card class="text-center selectable-card" :class="{ selected: localCompany.type === key }"
            @click="selectBusinessType(key)">
            <div class="py-4">
              <i v-if="key === 'BUSINESS'" class="mdi mdi-domain text-primary mb-3" style="font-size: 2rem;"></i>
              <i v-else-if="key === 'INDIVIDUAL'" class="mdi mdi-account-outline text-primary mb-3"
                style="font-size: 2rem;"></i>
              <i v-else class="mdi mdi-account-group-outline text-primary mb-3" style="font-size: 2rem;"></i>
              <h6 class="mt-2">{{ label }}</h6>
            </div>
          </b-card>
        </b-col>
      </b-row>
    </div>
    <!-- Step 2: Company Details Form -->
    <div v-else-if="selectedBusinessType">
      <h5 class="mb-3">Enter {{ localCompany.type }} Details</h5>
      <b-form @submit.prevent="nextStep">
        <b-row>
          <b-col md="6">
            <b-form-group :label="localCompany.type == BUSINESS_TYPE.BUSINESS? 'Company Name': 'Community Name'">
              <b-form-input v-model="localCompany.name" required />
            </b-form-group>
          </b-col>

          <b-col md="6" v-if="localCompany.type == BUSINESS_TYPE.BUSINESS">
            <b-form-group label="Domain">
              <b-form-input v-model="localCompany.domain" required />
            </b-form-group>
          </b-col>
        </b-row>

        <b-row>
          <b-col md="6">
            <b-form-group label="Country">
              <b-form-select v-model="localCompany.country" :options="countryOptions" required />
            </b-form-group>
          </b-col>

          <b-col md="6" v-if="localCompany.type == BUSINESS_TYPE.BUSINESS">
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
              <b-form-input v-model="localCompany.phone_no" required />
              <small class="text-muted">Enter phone number with country code (e.g., +91 for India, +1 for US)</small>
            </b-form-group>
          </b-col>
        </b-row>

        <b-row>
          <b-col md="6">
            <b-form-group label="Logo URL">
              <b-form-input v-model="localCompany.logo"
                placeholder="https://example.com/logo.png or data:image/png;base64,..." required />
              <small class="text-muted">Please enter a hosted image URL</small>
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
            <b-form-group label="Twitter Profile">
              <b-form-input v-model="localCompany.twitter_profile"
                placeholder="https://twitter.com/username or https://x.com/username" />
            </b-form-group>
          </b-col>

          <b-col md="6">
            <b-form-group label="LinkedIn Profile">
              <b-form-input v-model="localCompany.linkedIn_profile"
                placeholder="https://linkedin.com/company/yourcompany" />
            </b-form-group>
          </b-col>
        </b-row>

        <!-- Interests -->
        <hr />
        <h6 class="mt-4">What services are you interested in?</h6>
        <b-form-checkbox-group v-model="localCompany.interests" :options="interestOptions" stacked />

        <!-- Yearly Volume -->
        <hr />
        <h6 class="mt-4">Estimated Yearly Verification Volume</h6>
        <b-form-radio-group v-model="localCompany.yearly_volume" :options="volumeOptions" stacked />

        <!-- Business Fields -->
        <hr />
        <h6 class="mt-4">Which industry does your business belong to?</h6>
        <b-form-checkbox-group v-model="localCompany.fields" :options="fieldOptions" stacked />


        <!-- Actions -->
        <div class="text-right mt-4">
          <b-button variant="secondary" @click="resetStep">Back</b-button>
          <!-- <b-button variant="primary" type="submit">Next</b-button> -->
          <b-button variant="primary" type="submit" @click="$emit('update:company', localCompany)"> Next
          </b-button>
        </div>
      </b-form>
    </div>
  </div>
</template>

<script>

// Phone number validation patterns per-country. These are tested against the
// raw phone string the user provides (no blanket requirement to start with +).
// Patterns allow national formats where appropriate.
export const PhoneRegexMap = {
  IN: /^[6-9]\d{9}$/, // India: 10 digits, starts with 6-9
  SG: /^[689]\d{7}$/, // Singapore: 8 digits, starts with 6, 8, or 9
  JP: /^\d{10,11}$/, // Japan: 10 or 11 digits
  CN: /^1[3-9]\d{9}$/, // China: 11 digits, starts with 13–19
  ID: /^(\+62|62|0)8[1-9][0-9]{6,9}$/, // Indonesia
  VN: /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/, // Vietnam
  TH: /^0[689]\d{8}$/, // Thailand: 10 digits, starts with 06/08/09
  MY: /^01[0-46-9]-?[0-9]{7,8}$/, // Malaysia: 9–10 digits
  PH: /^(09|\+639)\d{9}$/, // Philippines: 11 digits
  KR: /^01[016789]\d{7,8}$/, // South Korea: 10–11 digits
  AU: /^(\+61|0)[2-478](\d{8})$/, // Australia: 9–10 digits
  NZ: /^(\+64|0)[2-9]\d{7,9}$/, // New Zealand: 8–10 digits
  BD: /^(?:\+?88)?01[3-9]\d{8}$/, // Bangladesh: 11 digits
  PK: /^03[0-9]{9}$/, // Pakistan: 11 digits, starts with 03
  LK: /^(?:\+94|0)?7\d{8}$/, // Sri Lanka: 10 digits
  NP: /^(?:\+977|0)?9[78]\d{8}$/, // Nepal: 10 digits
  KH: /^(?:\+855|0)?[1-9]\d{7,8}$/, // Cambodia: 8–9 digits
  MM: /^(?:\+95|0)?9\d{7,9}$/, // Myanmar: 8–10 digits
  BN: /^(\+673)?[2-8]\d{6}$/, // Brunei: 7 digits
  LA: /^(?:\+856|0)?(20)\d{8}$/, // Laos: 10 digits
  MN: /^(\+976|0)?[89]\d{7}$/, // Mongolia: 8 digits
  UK: /^(\+44|0)7\d{9}$/, // UK mobile: starts with 07, total 11 digits
  HK: /^(\+852)?[5,6,9]\d{7}$/, // Hong Kong: 8 digits, starts with 5,6,9
  US: /^(\+1)?\d{10}$/, // USA: 10 digits, optional +1
};

export default {
  name: "StepCompanyDetails",
  props: ["company"],
  data() {
    return {
      showPreview: false,
      BUSINESS_TYPE: {
        BUSINESS: "Business",
        COMMUNITY: "Community",
      },
      BUSINESS_INTERESTED_IN: {
        AML_SCREEN: "AML Screening",
        PROOF_OF_ADDRESS: "Proof Of Address",
        KYB: "Know Your Business (KYB)",
        KYC: "Know Your Customer (KYC)",
        AGE_VERIFICATION: "Age Verification",
        FRAUD_PREVENTION: "Fraud Prevention",
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
        BANKING: "Banking",
        INSURANCE: "Insurance",
        HEALTHCARE: "Healthcare",
        GOVERNMENT: "Government / Public Sector",
        EDUCATION: "Education / EdTech",
        REAL_ESTATE: "Real Estate",
        TRANSPORT: "Transport / Mobility",
        SOCIAL_MEDIA: "Social Media / Community Platforms",
        ENTERTAINMENT: "Entertainment / Streaming",
        GAMING: "Gaming / Esports",
        LEGAL: "Legal / Compliance Services",
        SUPPLY_CHAIN: "Supply Chain / Logistics",
        NFT_WEB3: "NFT / Web3 Projects"
      },
      COUNTRY_OPTIONS: {
        IN: "India",
        SG: "Singapore",
        CN: "China",
        JP: "Japan",
        HK: "Hong Kong",
        ID: "Indonesia",
        VN: "Vietnam",
        TH: "Thailand",
        MY: "Malaysia",
        PH: "Philippines",
        KR: "South Korea",
        AU: "Australia",
        NZ: "New Zealand",
        UK: "United Kingdom",
        US: "United States",
        BD: "Bangladesh",
        PK: "Pakistan",
        LK: "Sri Lanka",
        NP: "Nepal",
        KH: "Cambodia",
        MM: "Myanmar",
        BN: "Brunei",
        LA: "Laos",
        MN: "Mongolia",
        TL: "Timor-Leste",
        XX: "Other"
      },
      SERVICE_KYC_KYB_TYPE_SELECTOR: {
        IS_KYC: "KYC",
        IS_KYB: "KYB",
      },
      localCompany: {
        ...this.company,
        service_types: this.company.service_types || [], // Change from service_type to service_types array
      },
      selectedBusinessType: null,
    };
  },
  computed: {
    serviceTypeOptions() {
      return Object.values(this.SERVICE_KYC_KYB_TYPE_SELECTOR);
    },
    interestOptions() {
      return Object.values(this.BUSINESS_INTERESTED_IN);
    },
    volumeOptions() {
      return Object.values(this.BUSINESS_EST_YEARLY_VOLUME);
    },
    fieldOptions() {
      return Object.values(this.BUSINESS_FIELDS);
    },
    countryOptions() {
      return Object.entries(this.COUNTRY_OPTIONS).map(([value, text]) => ({ value, text }));
    },
  },
  methods: {
    selectBusinessType(type) {
      this.localCompany.type = type;
      this.selectedBusinessType = type;
    },
    resetStep() { this.selectedBusinessType = null; },
    goToPreview() {
      this.$emit("update:company", this.localCompany);
      // this.showPreview = true;
    },
    nextStep() {
      if (this.validateForm()) {
        this.$emit("update:company", this.localCompany);
        this.$emit("next-step");
      }
    },
    validateForm() {
      // Check if logo is provided
      if (!this.localCompany.logo || this.localCompany.logo.trim() === '') {
        this.$bvToast.toast('Please enter a company logo URL or base64', {
          title: 'Validation Error',
          variant: 'danger',
          solid: true
        });
        return false;
      }

      // Check email format - more strict validation
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(this.localCompany.contact_email)) {
        this.$bvToast.toast('Please enter a valid email address', {
          title: 'Validation Error',
          variant: 'danger',
          solid: true
        });
        return false;
      }

      // Check if country is selected
      if (!this.localCompany.country) {
        this.$bvToast.toast('Please select a country', {
          title: 'Validation Error',
          variant: 'danger',
          solid: true
        });
        return false;
      }

      // Check Twitter URL
      // if (!this.localCompany.twitter_profile || this.localCompany.twitter_profile.trim() === '') {
      //   this.$bvToast.toast('Please enter a Twitter/X profile URL', {
      //     title: 'Validation Error',
      //     variant: 'danger',
      //     solid: true
      //   });
      //   return false;
      // }

      const twitterRegex = /^https?:\/\/(twitter\.com|x\.com)\/[a-zA-Z0-9_]+\/?$/;
      if (this.localCompany.twitter_profile  && !twitterRegex.test(this.localCompany.twitter_profile.trim())) {
        this.$bvToast.toast('Please enter a valid Twitter/X profile URL (e.g., https://twitter.com/username or https://x.com/username)', {
          title: 'Validation Error',
          variant: 'danger',
          solid: true
        });
        return false;
      }

      // Check LinkedIn URL
      // if (!this.localCompany.linkedIn_profile || this.localCompany.linkedIn_profile.trim() === '') {
      //   this.$bvToast.toast('Please enter a LinkedIn profile URL', {
      //     title: 'Validation Error',
      //     variant: 'danger',
      //     solid: true
      //   });
      //   return false;
      // }
      const linkedinRegex = /^https?:\/\/(www\.)?linkedin\.com\/(in|company)\/[a-zA-Z0-9_-]+\/?$/;
      if (this.localCompany.linkedIn_profile  && !linkedinRegex.test(this.localCompany.linkedIn_profile.trim())) {
        this.$bvToast.toast('Please enter a valid LinkedIn profile URL (e.g., https://linkedin.com/in/username or https://linkedin.com/company/companyname)', {
          title: 'Validation Error',
          variant: 'danger',
          solid: true
        });
        return false;
      }

      // Country-specific phone number validation
      if (!this.validatePhoneNumber()) {
        return false;
      }

      // Check if at least one interest is selected
      if (!this.localCompany.interests || this.localCompany.interests.length === 0) {
        this.$bvToast.toast('Please select at least one service you are interested in', {
          title: 'Validation Error',
          variant: 'danger',
          solid: true
        });
        return false;
      }

      // Check if at least one industry field is selected
      if (!this.localCompany.fields || this.localCompany.fields.length === 0) {
        this.$bvToast.toast('Please select at least one industry your business belongs to', {
          title: 'Validation Error',
          variant: 'danger',
          solid: true
        });
        return false;
      }

      // Check if yearly volume is selected
      if (!this.localCompany.yearly_volume) {
        this.$bvToast.toast('Please select your estimated yearly verification volume', {
          title: 'Validation Error',
          variant: 'danger',
          solid: true
        });
        return false;
      }

      // Check if at least one service type is selected
      // if (!this.localCompany.service_types || this.localCompany.service_types.length === 0) {
      //   this.$bvToast.toast('Please select at least one service type (KYC or KYB)', {
      //     title: 'Validation Error',
      //     variant: 'danger',
      //     solid: true
      //   });
      //   return false;
      // }

      return true;
    },
    validatePhoneNumber() {
      const rawPhone = this.localCompany.phone_no;
      const country = this.localCompany.country;




      const phone = rawPhone ? rawPhone.trim() : '';
      const rule = PhoneRegexMap[country];

      if (rule) {
        if (!rule.test(phone)) {
          this.$bvToast.toast(`Invalid phone number format for country ${country}`, {
            title: 'Validation Error',
            variant: 'danger',
            solid: true
          });
          return false;
        }
        return true;
      }

      // Fallback: accept international numbers that start with + and have 8-15 digits
      const fallback = /^\+?\d{8,15}$/;
      if (!fallback.test(phone.replace(/\s/g, ''))) {
        this.$bvToast.toast('Please enter a valid international phone number (e.g., +919876543210)', {
          title: 'Validation Error',
          variant: 'danger',
          solid: true
        });
        return false;
      }

      return true;
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
