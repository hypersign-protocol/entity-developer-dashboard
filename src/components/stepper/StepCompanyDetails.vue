<template>
  <div>
    <!-- STEP 1: Select Business Type -->
    <div v-if="step === 1">
      <h5>Select Your Business Type</h5>
      <b-row>
        <b-col v-for="(label, key) in BUSINESS_TYPE" :key="key" cols="12" md="4" class="mb-3">
          <b-card class="text-center selectable-card" :class="{ selected: localCompany.type === key }"
            @click="selectBusinessType(key)">
            <div class="py-4">
              <i v-if="key === 'BUSINESS'" class="mdi mdi-domain text-secondary mb-3" style="font-size: 2rem;"></i>
              <i v-else-if="key === 'INDIVIDUAL'" class="mdi mdi-account-outline text-secondary mb-3"
                style="font-size: 2rem;"></i>
              <i v-else class="mdi mdi-account-group-outline text-secondary mb-3" style="font-size: 2rem;"></i>
              <h6 class="mt-2">{{ label }}</h6>
            </div>
          </b-card>
        </b-col>
      </b-row>
    </div>

    <!-- STEP 2: Business / Community Basic Info -->
    <div v-else-if="step === 2">
      <h5 class="mb-3">
        Enter {{ localCompany.type == BUSINESS_TYPE.BUSINESS.toUpperCase() ? "Company" : "Community" }} Details
      </h5>
      <b-form @submit.prevent="goToStep3">
        <b-row>
          <b-col md="6">
            <b-form-group
              :label="localCompany.type == BUSINESS_TYPE.BUSINESS.toUpperCase() ? 'Company Name' : 'Community Name'">
              <b-form-input v-model="localCompany.name" placeholder="ABC Pvt Ltd." required />
            </b-form-group>


          </b-col>

          <b-col md="6" v-if="localCompany.type == BUSINESS_TYPE.BUSINESS.toUpperCase()">
            <b-form-group label="Domain">
              <b-form-input v-model="localCompany.domain" placeholder="abc.com" required />
            </b-form-group>
          </b-col>
        </b-row>

        <b-row v-if="localCompany.type == BUSINESS_TYPE.BUSINESS.toUpperCase()">
          <b-col md="6">
            <b-form-group label="Country">
              <b-form-select v-model="localCompany.country" :options="countryOptions" required />
            </b-form-group>
          </b-col>

          <b-col md="6">
            <b-form-group label="Company Registration Number">
              <b-form-input v-model="localCompany.registration_number" />
            </b-form-group>
          </b-col>
        </b-row>

        <b-row>
          <b-col md="6">
            <b-form-group label="Business Email">
              <b-form-input type="email" v-model="localCompany.contact_email" placeholder="contact@gmail.com"
                required />
              <!-- <small>We will contact you on this email</small> -->
            </b-form-group>
          </b-col>

          <b-col md="6">
            <b-form-group label="Phone Number">
              <b-form-input v-model="localCompany.phone_no" placeholder="9989212929" required />
            </b-form-group>
          </b-col>
        </b-row>

        <b-form-group label="Upload Logo">
          <LogoUploader v-model="localCompany.logo" />
        </b-form-group>

        <b-row>
          <b-col md="4">
            <b-form-group label="Twitter Profile">
              <b-form-input v-model="localCompany.twitterUrl" placeholder="https://twitter.com/username" />
            </b-form-group>
          </b-col>

          <b-col md="4">
            <b-form-group label="Telegram Profile">
              <b-form-input v-model="localCompany.telegramUrl" placeholder="https://t.me/username" />
            </b-form-group>
          </b-col>

          <b-col md="4">
            <b-form-group label="LinkedIn Profile">
              <b-form-input v-model="localCompany.linkedinUrl" placeholder="https://linkedin.com/company/yourcompany" />
            </b-form-group>
          </b-col>
        </b-row>

        <div class="text-right mt-4">
          <b-button variant="link" @click="handleBack()">Back</b-button>
          <v-btn class="btn btn-outline-secondary" type="submit">Next</v-btn>
        </div>
      </b-form>
    </div>

    <!-- STEP 3: Progressive Questions -->
    <div v-else-if="step === 3">
      <div v-if="subStep === 1">
        <h6 class="mt-4">What services are you interested in?</h6>
        <b-form-checkbox-group v-model="localCompany.interests" :options="interestOptions" stacked />
        <div class="text-right mt-4">
          <!-- <b-button variant="secondary" @click="handleBack()">Back</b-button>
          <b-button variant="primary" @click="handleNext">Next</b-button> -->
          <b-button variant="link" @click="handleBack()">Back</b-button>
          <v-btn class="btn btn-outline-secondary" @click="handleNext()">Next</v-btn>
        </div>
      </div>

      <div v-else-if="subStep === 2">
        <h6 class="mt-4">Estimated Yearly Verification Volume</h6>
        <b-form-radio-group v-model="localCompany.yearly_volume" :options="volumeOptions" stacked />
        <div class="text-right mt-4">
          <!-- <b-button variant="secondary" @click="handleBack()">Back</b-button>
          <b-button variant="primary" @click="handleNext">Next</b-button> -->
          <b-button variant="link" @click="handleBack()">Back</b-button>
          <v-btn class="btn btn-outline-secondary" @click="handleNext()">Next</v-btn>
        </div>
      </div>

      <div v-else-if="subStep === 3">
        <h6 class="mt-4">Which industry does your business belong to?</h6>
        <b-form-checkbox-group v-model="localCompany.fields" :options="fieldOptions" stacked />
        <div class="text-right mt-4">
          <!-- <b-button variant="secondary" @click="handleBack()">Back</b-button>
          <b-button variant="primary" @click="handleNext">Next</b-button> -->
          <b-button variant="link" @click="handleBack()">Back</b-button>
          <v-btn class="btn btn-outline-secondary" @click="handleNext()">Next</v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export const PhoneRegexMap = {
  IN: /^[6-9]\d{9}$/,
  SG: /^[689]\d{7}$/,
  JP: /^\d{10,11}$/,
  CN: /^1[3-9]\d{9}$/,
  ID: /^(\+62|62|0)8[1-9][0-9]{6,9}$/,
  VN: /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/,
  TH: /^0[689]\d{8}$/,
  MY: /^01[0-46-9]-?[0-9]{7,8}$/,
  PH: /^(09|\+639)\d{9}$/,
  KR: /^01[016789]\d{7,8}$/,
  AU: /^(\+61|0)[2-478](\d{8})$/,
  NZ: /^(\+64|0)[2-9]\d{7,9}$/,
  BD: /^(?:\+?88)?01[3-9]\d{8}$/,
  PK: /^03[0-9]{9}$/,
  LK: /^(?:\+94|0)?7\d{8}$/,
  NP: /^(?:\+977|0)?9[78]\d{8}$/,
  KH: /^(?:\+855|0)?[1-9]\d{7,8}$/,
  MM: /^(?:\+95|0)?9\d{7,9}$/,
  BN: /^(\+673)?[2-8]\d{6}$/,
  LA: /^(?:\+856|0)?(20)\d{8}$/,
  MN: /^(\+976|0)?[89]\d{7}$/,
  UK: /^(\+44|0)7\d{9}$/,
  HK: /^(\+852)?[5,6,9]\d{7}$/,
  US: /^(\+1)?\d{10}$/,
};

import { mapGetters } from 'vuex/dist/vuex.common.js';
import LogoUploader from "../element/LogoUploader.vue";
export default {
  name: "StepCompanyDetails",
  props: ["company"],
  data() {
    return {
      step: 1,
      subStep: 1,
      BUSINESS_TYPE: {
        BUSINESS: "Business",
        COMMUNITY: "Community",
      },
      BUSINESS_INTERESTED_IN: {
        AML_SCREEN: "AML Screening",
        PROOF_OF_ADDRESS: "Proof Of Address",
        KYB: "Know Your Business (KYB)",
        KYC: "Know Your Customer (KYC)",
        COLLECT_WALLET: "Collect Wallet Address",
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
        NFT_WEB3: "NFT / Web3 Projects",
        OTHER: "Other"
      },
      COUNTRY_OPTIONS: {
        IN: "India", SG: "Singapore", CN: "China", JP: "Japan", HK: "Hong Kong",
        ID: "Indonesia", VN: "Vietnam", TH: "Thailand", MY: "Malaysia",
        PH: "Philippines", KR: "South Korea", AU: "Australia", NZ: "New Zealand",
        UK: "United Kingdom", US: "United States", BD: "Bangladesh",
        PK: "Pakistan", LK: "Sri Lanka", NP: "Nepal", KH: "Cambodia",
        MM: "Myanmar", BN: "Brunei", LA: "Laos", MN: "Mongolia",
        TL: "Timor-Leste", XX: "Other"
      },
      localCompany: {
        ...this.company,
        service_types: this.company.service_types || [],
      },
      selectedBusinessType: null,
    };
  },
  components: {
    LogoUploader,
  },
  computed: {
    ...mapGetters('mainStore', ['getUserDetails']),
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

  mounted() {
    if (this.getUserDetails) {
      this.localCompany.contact_email = this.getUserDetails.email;
    }
  },

  methods: {
  //    triggerLogoUpload() {
  //   this.$refs.logoInput.click();
  // },

  //   async onLogoUpload(event) {
  //     this.localCompany.logo = "";
  //     console.log("Logo upload event:", event.target.files);
  //     const file = event.target.files[0];
  //     if (!file) return;

  //     // Optional: Limit file size before processing (2MB max)
  //     if (file.size > 2 * 1024 * 1024) {
  //       this.$bvToast.toast("File too large. Please upload below 2MB.", {
  //         title: "Error",
  //         variant: "danger",
  //         solid: true,
  //       });
  //       return;
  //     }

  //     const base64 = await this.compressAndConvertToBase64(file);
  //     this.localCompany.logo = base64;
  //   },
  //   compressAndConvertToBase64(file) {
  //     return new Promise((resolve) => {
  //       const reader = new FileReader();

  //       reader.onload = (e) => {
  //         const img = new Image();
  //         img.onload = () => {
  //           // Resize image to max 300px (good for logos)
  //           const canvas = document.createElement("canvas");
  //           const MAX_SIZE = 300;

  //           let width = img.width;
  //           let height = img.height;

  //           if (width > height) {
  //             if (width > MAX_SIZE) {
  //               height *= MAX_SIZE / width;
  //               width = MAX_SIZE;
  //             }
  //           } else {
  //             if (height > MAX_SIZE) {
  //               width *= MAX_SIZE / height;
  //               height = MAX_SIZE;
  //             }
  //           }

  //           canvas.width = width;
  //           canvas.height = height;

  //           const ctx = canvas.getContext("2d");
  //           ctx.drawImage(img, 0, 0, width, height);

  //           // compress to PNG base64 with Quality ~0.85
  //           const dataUrl = canvas.toDataURL("image/png", 0.85);

  //           resolve(dataUrl);
  //         };
  //         img.src = e.target.result;
  //       };

  //       reader.readAsDataURL(file);
  //     });
  //   },
    
  
  
    handleBack() {
      if (this.step === 3) {
        if (this.subStep > 1) {
          this.subStep--;
        } else {
          this.goBackToStep2();
        }
      } else if (this.step === 2) {
        this.step = 1

      }
    },
    selectBusinessType(type) {
      this.localCompany.type = type;
      this.selectedBusinessType = type;
      this.step = 2;
    },

    goToStep3() {
      if (this.validateStep2()) {
        this.step = 3;
        this.subStep = 1;
      }
    },

    goBackToStep1() {
      this.step = 1;
    },

    finishStep3() {
      if (this.validateStep3()) {
        this.$emit("update:company", this.localCompany);
        this.$emit("next-step");
      }
    },

    handleNext() {
      if (this.step === 3) {
        // validate the current subStep before moving forward / finishing
        if (!this.validateStep3()) return;
        if (this.subStep < 3) {
          this.subStep++;
        } else {
          // last subStep -> finish
          this.finishStep3();
        }
      } else if (this.step === 2) {
        // when on step 2, validate step2 before opening step3
        if (this.validateStep2()) {
          this.step = 3;
          this.subStep = 1;
        }
      }
    },

    // ✅ Step 2 validation
    validateStep2() {
      const c = this.localCompany;

      if (!c.name?.trim()) return this.showToast("Please enter a company/community name");
      if (!c.logo?.trim()) return this.showToast("Please provide a logo URL");

      if (c.type == this.BUSINESS_TYPE.BUSINESS && !c.country) return this.showToast("Please select a country");
      if (c.type == this.BUSINESS_TYPE.BUSINESS && !c.registration_number) return this.showToast("Please enter your company registration number");

      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(c.contact_email)) return this.showToast("Invalid email address");

      if (c.type == this.BUSINESS_TYPE.BUSINESS && !this.validatePhoneNumber()) return false;

      // Optional link checks
      if (c.twitterUrl && !/^https?:\/\/(twitter\.com|x\.com)\/[A-Za-z0-9_]+\/?$/.test(c.twitterUrl.trim()))
        return this.showToast("Invalid Twitter/X profile URL");

      if (c.linkedinUrl && !/^https?:\/\/(www\.)?linkedin\.com\/(in|company)\/[A-Za-z0-9_-]+\/?$/.test(c.linkedinUrl.trim()))
        return this.showToast("Invalid LinkedIn profile URL");

      return true;
    },

    // ✅ Step 3 validation (based on substeps)
    validateStep3() {
      const c = this.localCompany;
      if (this.subStep === 1) {
        if (!Array.isArray(c.interests) || c.interests.length === 0) {
          return this.showToast("Please select at least one service of interest");
        }
      } else if (this.subStep === 2) {
        if (!c.yearly_volume) return this.showToast("Please select estimated yearly volume");
      } else if (this.subStep === 3) {
        if (!Array.isArray(c.fields) || c.fields.length === 0) {
          return this.showToast("Please select at least one industry field");
        }
      }
      return true;
    },

    validatePhoneNumber() {
      const c = this.localCompany;
      if (!c.phone_no) return this.showToast("Please enter a phone number");
      const phone = c.phone_no.trim();
      const rule = PhoneRegexMap[c.country];
      if (rule && !rule.test(phone))
        return this.showToast(`Invalid phone number format for ${c.country}`);
      const fallback = /^\+?\d{8,15}$/;
      if (!rule && !fallback.test(phone))
        return this.showToast("Please enter a valid international number (e.g., +919876543210)");
      return true;
    },

    goBackToStep2() {
      this.step = 2;
      this.subStep = 1;
    },


    showToast(msg) {
      this.$bvToast.toast(msg, {
        title: "Validation Error",
        variant: "danger",
        solid: true,
      });
      return false;
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
  border-color: rgb(168, 167, 167);
  transform: translateY(-2px);
}

.selectable-card.selected {
  border-color: rgb(168, 167, 167);
  background-color: #e9f5ff;
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
