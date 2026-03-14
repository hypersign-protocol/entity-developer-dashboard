<template>
  <div>
    <div v-if="step === 1">
      <h5 class="step-title mb-3">Select Your Business Type</h5>
      <v-row>
        <v-col v-for="(label, key) in BUSINESS_TYPE" :key="key" cols="12" md="4">
          <div 
            class="step-content-box text-center p-4 selectable-card" 
            :class="{ 'selected-card': localCompany.type === key }"
            @click="selectBusinessType(key)"
          >
            <v-icon 
              large 
              :color="localCompany.type === key ? 'primary' : 'secondary'" 
              class="mb-4"
            >
              {{ getBusinessIcon(key) }}
            </v-icon>
            <h6 class="font-weight-bold mb-0">{{ label }}</h6>
          </div>
        </v-col>
      </v-row>
    </div>

    <div v-else-if="step === 2">
      <h5 class="step-title mb-4">
        Enter Your {{ localCompany.type === 'BUSINESS' ? "Business" : "Community" }} Details
      </h5>
      
      <v-form @submit.prevent="goToStep3">
        <v-row>
          <v-col cols="12" md="6" class="py-0">
            <label class="input-label mb-2">
              {{ localCompany.type === 'BUSINESS' ? 'Company Name' : 'Community Name' }}
            </label>
            <v-text-field v-model="localCompany.name" placeholder="ABC Pvt Ltd." outlined dense required />
          </v-col>

          <v-col cols="12" md="6" class="py-0" v-if="localCompany.type === 'BUSINESS'">
            <label class="input-label mb-2">Domain</label>
            <v-text-field v-model="localCompany.domain" placeholder="abc.com" outlined dense required />
          </v-col>
        </v-row>

        <v-row v-if="localCompany.type === 'BUSINESS'">
          <v-col cols="12" md="6" class="py-0">
            <label class="input-label mb-2">Country</label>
            <v-select v-model="localCompany.country" :items="countryOptions" outlined dense required />
          </v-col>

          <v-col cols="12" md="6" class="py-0">
            <label class="input-label mb-2">Registration Number</label>
            <v-text-field v-model="localCompany.registration_number" outlined dense />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" md="6" class="py-0">
            <label class="input-label mb-2">Business Email</label>
            <v-text-field type="email" v-model="localCompany.contact_email" placeholder="contact@gmail.com" outlined dense required />
          </v-col>

          <!-- <v-col cols="12" md="6" class="py-0">
            <label class="input-label mb-2">Phone Number</label>
            <v-text-field v-model="localCompany.phone_no" placeholder="9989212929" outlined dense required />
          </v-col> -->

          <v-col cols="12" md="6" class="py-0">
  <label class="input-label mb-2">Phone Number</label>
  <v-text-field 
    v-model="localCompany.phone_no" 
    placeholder="9999999999" 
    outlined 
    dense 
    required
    :prefix="selectedCallingCode"
    :rules="phoneRules"
  >
    <template v-slot:prepend-inner>
      <v-icon small color="grey lighten-1">mdi-phone-outline</v-icon>
    </template>
  </v-text-field>
</v-col>
        </v-row>

        <div class="mb-4">
          <label class="input-label mb-2">Upload Logo</label>
          <LogoUploader v-model="localCompany.logo" />
        </div>

        <label class="input-label mb-3">Social Profiles</label>
        <v-row>
          <v-col cols="12" md="4" class="py-0">
            <v-text-field v-model="localCompany.twitterUrl" prepend-inner-icon="mdi-twitter" placeholder="Twitter" outlined dense />
          </v-col>
          <v-col cols="12" md="4" class="py-0">
            <v-text-field v-model="localCompany.telegramUrl" prepend-inner-icon="mdi-send" placeholder="Telegram" outlined dense />
          </v-col>
          <v-col cols="12" md="4" class="py-0">
            <v-text-field v-model="localCompany.linkedinUrl" prepend-inner-icon="mdi-linkedin" placeholder="LinkedIn" outlined dense />
          </v-col>
        </v-row>

        <div class="d-flex justify-end mt-4 align-center">
          <v-btn text color="secondary" class="text-none mr-2" @click="handleBack()">Back</v-btn>
          <hf-buttons name="Next Step"   @executeAction="handleNext()"></hf-buttons>

          
        </div>
      </v-form>
    </div>

    <div v-else-if="step === 3">
      <div v-if="subStep === 1">
        <h6 class="font-weight-bold mb-4">What services are you interested in?</h6>
        <div class="interest-list">
          <b-form-checkbox-group v-model="localCompany.interests" :options="interestOptions" stacked />
        </div>
      </div>

      <div v-else-if="subStep === 2">
        <h6 class="font-weight-bold mb-4">Estimated Yearly Verification Volume</h6>
        <b-form-radio-group v-model="localCompany.yearly_volume" :options="volumeOptions" stacked />
      </div>

      <div v-else-if="subStep === 3">
        <h6 class="font-weight-bold mb-4">Which industry does your business belong to?</h6>
        <v-row>
          <v-col cols="12" sm="6" class="py-0">
            <b-form-checkbox-group v-model="localCompany.fields" :options="fieldOptions" stacked />
          </v-col>
        </v-row>
      </div>

      <div class="d-flex justify-end mt-8 align-center">
        <v-btn text color="secondary" class="text-none mr-2" @click="handleBack()">Back</v-btn>
        <!-- <v-btn class="btn button" @click="handleNext()">
          {{ subStep === 3 ? 'Complete Setup' : 'Continue' }}
        </v-btn> -->

        <hf-buttons :name="subStep === 3 ? 'Complete Setup' : 'Continue'"   @executeAction="handleNext()"></hf-buttons>
      </div>
    </div>
  </div>
</template>


<style scoped>

.selectable-card {
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid #e2e8f0;
}

.selectable-card:hover {
  border-color: #3b82f6;
  transform: translateY(-2px);
}

.selected-card {
  border-color: #3b82f6 !important;
  background-color: #f0f7ff !important;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1) !important;
}

.step-title {
  color: #1e293b;
  font-weight: 700;
}

.input-label {
  display: block;
  font-size: 0.72rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Reusing the established card style */
.step-content-box {
  background: white;
  border-radius: 12px;
}
</style>

<script>

const CallingCodeMap = {
  // --- Asia & Oceania ---
  AFG: "+93",  AUS: "+61",  BGD: "+880", BRN: "+673", KHM: "+855", 
  CHN: "+86",  HKG: "+852", IND: "+91",  IDN: "+62",  JPN: "+81",  
  LAO: "+856", MYS: "+60",  MNG: "+976", MMR: "+95",  NPL: "+977", 
  NZL: "+64",  PAK: "+92",  PHL: "+63",  SGP: "+65",  KOR: "+82",  
  LKA: "+94",  TWN: "+886", THA: "+66",  TLS: "+670", VNM: "+84",

  // --- Americas ---
  ARG: "+54",  BRA: "+55",  CAN: "+1",   CHL: "+56",  COL: "+57",  
  CRI: "+506", CUB: "+53",  DOM: "+1",   ECU: "+593", GTM: "+502", 
  JAM: "+1",   MEX: "+52",  PAN: "+507", PER: "+51",  PRI: "+1",   
  URY: "+598", VEN: "+58",  USA: "+1",

  // --- Europe ---
  AUT: "+43",  BEL: "+32",  BGR: "+359", HRV: "+385", CYP: "+357", 
  CZE: "+420", DNK: "+45",  EST: "+372", FIN: "+358", FRA: "+33",  
  DEU: "+49",  GRC: "+30",  HUN: "+36",  ISL: "+354", IRL: "+353", 
  ITA: "+39",  LVA: "+371", LIE: "+423", LTU: "+370", LUX: "+352", 
  MLT: "+356", NLD: "+31",  NOR: "+47",  POL: "+48",  PRT: "+351", 
  ROU: "+40",  RUS: "+7",   SVK: "+421", SVN: "+386", ESP: "+34",  
  SWE: "+46",  CHE: "+41",  TUR: "+90",  UKR: "+380", GBR: "+44",

  // --- Middle East & Central Asia ---
  ARM: "+374", AZE: "+994", BHR: "+973", GEO: "+995", IRN: "+98",  
  IRQ: "+964", ISR: "+972", JOR: "+962", KWT: "+965", LBN: "+961", 
  OMN: "+968", QAT: "+966", SAU: "+966", SYR: "+963", ARE: "+971", 
  UZB: "+998", YEM: "+967",

  // --- Africa ---
  DZA: "+213", AGO: "+244", BWA: "+267", CMR: "+237", EGY: "+20",  
  ETH: "+251", GHA: "+233", KEN: "+254", MAR: "+212", MUS: "+230", 
  NAM: "+264", NGA: "+234", RWA: "+250", SEN: "+221", ZAF: "+27",  
  TZA: "+255", TUN: "+216", UGA: "+256", ZMB: "+260", ZWE: "+263",

  // --- Fallback ---
  XXX: ""
};
export const PhoneRegexMap = {
  // --- Asia & Oceania ---
  AFG: /^[2-7]\d{8}$/,                   // Afghanistan
  AUS: /^4\d{8}$/,                       // Australia (Mobile)
  BGD: /^1[3-9]\d{8}$/,                  // Bangladesh
  BRN: /^[278]\d{6}$/,                   // Brunei
  KHM: /^[1-9]\d{7,8}$/,                 // Cambodia
  CHN: /^1[3-9]\d{9}$/,                  // China
  HKG: /^[4-9]\d{7}$/,                   // Hong Kong
  IND: /^[6-9]\d{9}$/,                   // India
  IDN: /^8[1-9]\d{7,10}$/,               // Indonesia
  JPN: /^[789]0\d{8}$/,                  // Japan (Mobile)
  LAO: /^20\d{8}$/,                      // Laos
  MYS: /^1[0-9]\d{7,8}$/,                // Malaysia
  MNG: /^[89]\d{7}$/,                    // Mongolia
  MMR: /^9\d{7,9}$/,                     // Myanmar
  NPL: /^9[6-8]\d{8}$/,                  // Nepal
  NZL: /^2\d{7,9}$/,                     // New Zealand
  PAK: /^3\d{9}$/,                       // Pakistan
  PHL: /^9\d{9}$/,                       // Philippines
  SGP: /^[89]\d{7}$/,                    // Singapore
  KOR: /^10\d{7,8}$/,                    // South Korea
  LKA: /^7\d{8}$/,                       // Sri Lanka
  TWN: /^9\d{8}$/,                       // Taiwan
  THA: /^[689]\d{8}$/,                   // Thailand
  TLS: /^7[78]\d{6}$/,                   // Timor-Leste
  VNM: /^(3|5|7|8|9)[0-9]{8}$/,          // Vietnam

  // --- Americas ---
  ARG: /^(9\d{2})?\d{7}$/,               // Argentina
  BRA: /^[1-9]{2}9?\d{8}$/,              // Brazil
  CAN: /^\d{10}$/,                       // Canada
  CHL: /^9\d{8}$/,                       // Chile
  COL: /^3\d{9}$/,                       // Colombia
  CRI: /^[2-8]\d{7}$/,                   // Costa Rica
  CUB: /^5\d{7}$/,                       // Cuba
  DOM: /^\d{10}$/,                       // Dominican Republic
  ECU: /^9\d{8}$/,                       // Ecuador
  GTM: /^[1-9]\d{7}$/,                   // Guatemala
  JAM: /^\d{10}$/,                       // Jamaica
  MEX: /^[1-9]\d{9}$/,                   // Mexico
  PAN: /^[68]\d{7}$/,                    // Panama
  PER: /^9\d{8}$/,                       // Peru
  PRI: /^\d{10}$/,                       // Puerto Rico
  URY: /^9\d{7}$/,                       // Uruguay
  VEN: /^[42]\d{9}$/,                    // Venezuela
  USA: /^\d{10}$/,                       // United States

  // --- Europe ---
  AUT: /^6\d{4,12}$/,                    // Austria
  BEL: /^4\d{8}$/,                       // Belgium
  BGR: /^8[7-9]\d{7}$/,                  // Bulgaria
  HRV: /^9\d{7,8}$/,                     // Croatia
  CYP: /^9\d{7}$/,                       // Cyprus
  CZE: /^[1-9]\d{8}$/,                   // Czech Republic
  DNK: /^[1-9]\d{7}$/,                   // Denmark
  EST: /^[58]\d{6,7}$/,                  // Estonia
  FIN: /^4\d{5,10}$/,                    // Finland
  FRA: /^[67]\d{8}$/,                    // France
  DEU: /^1[5-7]\d{8,9}$/,                // Germany
  GRC: /^69\d{8}$/,                      // Greece
  HUN: /^(20|30|31|70)\d{7}$/,           // Hungary
  ISL: /^[1-9]\d{6}$/,                   // Iceland
  IRL: /^8[3-9]\d{7}$/,                  // Ireland
  ITA: /^3\d{8,9}$/,                     // Italy
  LVA: /^2\d{7}$/,                       // Latvia
  LIE: /^[1-9]\d{6}$/,                   // Liechtenstein
  LTU: /^6\d{7}$/,                       // Lithuania
  LUX: /^6[269]1\d{6}$/,                 // Luxembourg
  MLT: /^[79]\d{7}$/,                    // Malta
  NLD: /^6\d{8}$/,                       // Netherlands
  NOR: /^[49]\d{7}$/,                    // Norway
  POL: /^[1-9]\d{8}$/,                   // Poland
  PRT: /^9[1236]\d{7}$/,                 // Portugal
  ROU: /^7\d{8}$/,                       // Romania
  RUS: /^9\d{9}$/,                       // Russia
  SVK: /^9\d{8}$/,                       // Slovakia
  SVN: /^[3-7]\d{7}$/,                   // Slovenia
  ESP: /^[67]\d{8}$/,                    // Spain
  SWE: /^7\d{8}$/,                       // Sweden
  CHE: /^7[4-9]\d{7}$/,                  // Switzerland
  TUR: /^5\d{9}$/,                       // Turkey
  UKR: /^\d{9}$/,                        // Ukraine
  GBR: /^7\d{9}$/,                       // United Kingdom

  // --- Middle East & Africa ---
  ARE: /^5[02456]\d{7}$/,                // UAE
  EGY: /^1[0125]\d{8}$/,                 // Egypt
  KEN: /^[71]\d{8}$/,                    // Kenya
  NGA: /^[789][01]\d{8}$/,               // Nigeria
  SAU: /^5\d{8}$/,                       // Saudi Arabia
  ZAF: /^[1-9]\d{8}$/,                   // South Africa

  // Fallback for others
  XXX: /^\d{4,15}$/
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
      // --- Asia & Oceania ---
      AFG: "Afghanistan", AUS: "Australia", BGD: "Bangladesh", BRN: "Brunei", 
      KHM: "Cambodia", CHN: "China", HKG: "Hong Kong", IND: "India", 
      IDN: "Indonesia", JPN: "Japan", LAO: "Laos", MYS: "Malaysia", 
      MNG: "Mongolia", MMR: "Myanmar", NPL: "Nepal", NZL: "New Zealand", 
      PAK: "Pakistan", PHL: "Philippines", SGP: "Singapore", KOR: "South Korea", 
      LKA: "Sri Lanka", TWN: "Taiwan", THA: "Thailand", TLS: "Timor-Leste", 
      VNM: "Vietnam",

      // --- Americas ---
      ARG: "Argentina", BRA: "Brazil", CAN: "Canada", CHL: "Chile", 
      COL: "Colombia", CRI: "Costa Rica", CUB: "Cuba", DOM: "Dominican Republic", 
      ECU: "Ecuador", GTM: "Guatemala", JAM: "Jamaica", MEX: "Mexico", 
      PAN: "Panama", PER: "Peru", PRI: "Puerto Rico", URY: "Uruguay", 
      VEN: "Venezuela", USA: "United States",

      // --- Europe ---
      AUT: "Austria", BEL: "Belgium", BGR: "Bulgaria", HRV: "Croatia", 
      CYP: "Cyprus", CZE: "Czech Republic", DNK: "Denmark", EST: "Estonia", 
      FIN: "Finland", FRA: "France", DEU: "Germany", GRC: "Greece", 
      HUN: "Hungary", ISL: "Iceland", IRL: "Ireland", ITA: "Italy", 
      LVA: "Latvia", LIE: "Liechtenstein", LTU: "Lithuania", LUX: "Luxembourg", 
      MLT: "Malta", NLD: "Netherlands", NOR: "Norway", POL: "Poland", 
      PRT: "Portugal", ROU: "Romania", RUS: "Russia", SVK: "Slovakia", 
      SVN: "Slovenia", ESP: "Spain", SWE: "Sweden", CHE: "Switzerland", 
      TUR: "Turkey", UKR: "Ukraine", GBR: "United Kingdom",

      // --- Middle East & Central Asia ---
      ARM: "Armenia", AZE: "Azerbaijan", BHR: "Bahrain", GEO: "Georgia", 
      IRN: "Iran", IRQ: "Iraq", ISR: "Israel", JOR: "Jordan", 
      KWT: "Kuwait", LBN: "Lebanon", OMN: "Oman", QAT: "Qatar", 
      SAU: "Saudi Arabia", SYR: "Syria", ARE: "United Arab Emirates", 
      UZB: "Uzbekistan", YEM: "Yemen",

      // --- Africa ---
      DZA: "Algeria", AGO: "Angola", BWA: "Botswana", CMR: "Cameroon", 
      EGY: "Egypt", ETH: "Ethiopia", GHA: "Ghana", KEN: "Kenya", 
      MAR: "Morocco", MUS: "Mauritius", NAM: "Namibia", NGA: "Nigeria", 
      RWA: "Rwanda", SEN: "Senegal", ZAF: "South Africa", TZA: "Tanzania", 
      TUN: "Tunisia", UGA: "Uganda", ZMB: "Zambia", ZWE: "Zimbabwe",

      // --- Fallback ---
      XXX: "Other"
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
    phoneRules() {
      return [
        // Rule 1: Check if field is empty
        v => !!v || 'Phone number is required',
        
        // Rule 2: Validate against the selected country's regex
        v => {
          // If no country is selected yet, we don't show a regex error
          if (!this.localCompany.country) return true;

          const pattern = PhoneRegexMap[this.localCompany.country] || PhoneRegexMap.XXX;
          
          // Test the input against the pattern
          return pattern.test(v) || `Invalid format for ${this.COUNTRY_OPTIONS[this.localCompany.country]}`;
        }
      ];
    },
    selectedCallingCode() {
    return CallingCodeMap[this.localCompany.country] || "";
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

  mounted() {
    if (this.getUserDetails) {
      this.localCompany.contact_email = this.getUserDetails.email;
    }
  },

  methods: {
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

    getBusinessIcon(key) {
      const icons = {
        BUSINESS: 'mdi-domain',
        INDIVIDUAL: 'mdi-account-outline',
        COMMUNITY: 'mdi-account-group-outline'
      };
      return icons[key] || 'mdi-help-circle-outline';
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

