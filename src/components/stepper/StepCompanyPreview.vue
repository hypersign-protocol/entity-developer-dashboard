<template>
  <div>
    
    <HfPopUp id="credit-request-confirmation-popup" Header="Credit Request Confirmation">
      <div>
        <p style="color: #ff5400de">
          By proceeding, your request to activate ID Services will be formally submitted for administrative review. Our compliance team will assess the details you have provided, including company or community information and associated social profiles.
        </p>
        <p style="color: #ff5400de">
          Following approval, the system will automatically provision your ID Services and allocate the corresponding KYC credits. You will be able to monitor the status of this process on the subsequent screens. Please note that the end-to-end activation may require up to 24 hours for completion.
</p>
<p style="color: #ff5400de">
          An email notification will be sent once your request has been approved. You may also log in to the platform at any time to review the progress of your submission.
        </p>
        <div class="text-center mt-3">
          <hf-buttons name="Continue"
            @executeAction="$emit('next-step')"></hf-buttons>
        </div>
      </div>
    </HfPopUp>

    <h5 class="mb-3">Review {{ formatTypeLabel(company.type) }} Information</h5>
    
    <p class="text-muted">
      Please confirm the details below before proceeding. Click <b>Back</b> to make changes if needed.
    </p>

    <div class="rol mb-2">
      <!-- Company Info -->
      
        <b-card class="h-100 serviceCard">
          <div class="d-flex align-items-center mb-3">
            <i class="mdi mdi-domain text-primary mr-2"></i>
            <h6 class="mb-0">Business Details</h6>
            
              <div v-if="company.logo" class="ml-auto">
                <img :src="company.logo" alt="Logo" class="logo-preview" />
              </div>
            
          </div>

          <b-row>
            <b-col md="6" class="mb-2">
              <strong>Type:</strong>
              <p class="text-muted mb-0">{{ formatTypeLabel(company.type) }}</p>
            </b-col>
            <b-col md="6" class="mb-2">
              <strong>Name:</strong>
              <p class="text-muted mb-0">{{ company.name || '-' }}</p>
            </b-col>
            <b-col md="6" class="mb-2">
              <strong>Domain:</strong>
              <p class="text-muted mb-0">{{ company.domain || '-' }}</p>
            </b-col>
            <b-col md="6" class="mb-2">
              <strong>Country:</strong>
              <p class="text-muted mb-0">{{ company.country || '-' }}</p>
            </b-col>
            <b-col md="6" class="mb-2">
              <strong>Registration No:</strong>
              <p class="text-muted mb-0">{{ company.registration_number || '-' }}</p>
            </b-col>
            <b-col md="6" class="mb-2">
              <strong>Email:</strong>
              <p class="text-muted mb-0">{{ company.contact_email || '-' }}</p>
            </b-col>
            <b-col md="6" class="mb-2">
              <strong>Phone:</strong>
              <p class="text-muted mb-0">{{ company.phone_no || '-' }}</p>
            </b-col>

            <b-col md="6" class="mb-2">
              <strong>Twitter:</strong>
              <p class="text-muted mb-0">
                <a
                  v-if="company.twitterUrl"
                  :href="company.twitterUrl"
                  target="_blank"
                  class="text-info"
                >
                  {{ company.twitterUrl }}
                </a>
                <span v-else>-</span>
              </p>
            </b-col>
            <b-col md="6" class="mb-2">
              <strong>LinkedIn:</strong>
              <p class="text-muted mb-0">
                <a
                  v-if="company.linkedinUrl"
                  :href="company.linkedinUrl"
                  target="_blank"
                  class="text-info"
                >
                  {{ company.linkedinUrl }}
                </a>
                <span v-else>-</span>
              </p>
            </b-col>
            <b-col md="6" class="mb-2">
              <strong>Telegram:</strong>
              <p class="text-muted mb-0">
                <a
                  v-if="company.telegramUrl"
                  :href="company.telegramUrl"
                  target="_blank"
                  class="text-info"
                >
                  {{ company.telegramUrl }}
                </a>
                <span v-else>-</span>
              </p>
            </b-col>
          </b-row>
        </b-card>
      
    </div>


    <div class="rol mb-2">
      <!-- Business Details -->
      
        <b-card class="h-100 serviceCard">
          <div class="d-flex align-items-center mb-3">
            <i class="mdi mdi-briefcase-outline text-primary mr-2"></i>
            <h6 class="mb-0">Business Requirements</h6>
          </div>

          <b-row>
            <b-col md="6" class="mb-3">
              <strong>Interested Services:</strong>
              <ul class="text-muted mb-0 pl-3">
                <li
                  v-for="(interest, index) in company.interests"
                  :key="index"
                  class="small"
                >
                  {{ interest }}
                </li>
              </ul>
              <span v-if="!company.interests || company.interests.length === 0">-</span>
            </b-col>

            <b-col md="6" class="mb-3">
              <strong>Estimated Yearly Volume:</strong>
              <p class="text-muted mb-0">{{ company.yearly_volume || '-' }}</p>
            </b-col>

            <b-col md="12" class="mb-2">
              <strong>Industry Fields:</strong>
              <ul class="text-muted mb-0 pl-3">
                <li
                  v-for="(field, index) in company.fields"
                  :key="index"
                  class="small"
                >
                  {{ field }}
                </li>
              </ul>
              <span v-if="!company.fields || company.fields.length === 0">-</span>
            </b-col>
          </b-row>
        </b-card>
      
    </div>

    <div class="text-right mt-4">
      <!-- <b-button variant="secondary" @click="$emit('prev-step')">Back</b-button>
      <b-button variant="primary" @click="$emit('next-step')">Next</b-button> -->

      <b-button variant="link" @click="$emit('prev-step')">Back</b-button>
      <v-btn class="btn btn-outline-secondary" @click="invokeConfirmationPopup()">Request Credit</v-btn>
    </div>


    
  </div>
</template>

<script>
import HfPopUp from "../../components/element/hfPopup.vue";
export default {
  name: "StepCompanyPreview",
  props: ["company"],
  components: {
    HfPopUp,
  },
  mounted(){
    this.$root.$emit("bv::hide::modal", "credit-request-confirmation-popup");
  },
  methods: {
    invokeConfirmationPopup(){
      this.$root.$emit("bv::show::modal", "credit-request-confirmation-popup");
    },
    formatTypeLabel(type) {
      const labels = {
        BUSINESS: "Business",
        // INDIVIDUAL: "Individual",
        COMMUNITY: "Community",
      };
      return labels[type] || type || "-";
    },
    formatServiceTypeLabel(serviceTypes) {
      if (!serviceTypes || serviceTypes.length === 0) return "-";
      
      const labels = {
        KYC: "Know Your Customer (KYC)",
        KYB: "Know Your Business (KYB)",
      };
      
      // If it's an array, join the labels
      if (Array.isArray(serviceTypes)) {
        return serviceTypes.map(type => labels[type] || type).join(", ");
      }
      
      // Fallback for old string format
      return labels[serviceTypes] || serviceTypes;
    },
  },
};
</script>

<style scoped>
.logo-preview {
  max-height: 70px;
  border-radius: 8px;
  margin-top: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
b-card {
  border: 1px solid #e1e4e8;
  border-radius: 10px;
  background-color: #fff;
  transition: all 0.2s ease;
}
b-card:hover {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}
h6 {
  font-weight: 600;
}
</style>