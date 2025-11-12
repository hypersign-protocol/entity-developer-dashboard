<template>
  <div>
    <h5 class="mb-3">Review Company Information</h5>
    <p class="text-muted">
      Please confirm the details below before proceeding. Click <b>Back</b> to make changes if needed.
    </p>

    <b-row>
        <!-- Account Type -->
        <b-col md="12" sm="12" class="mb-3">
        <b-card class="h-100 shadow-sm">
          <div class="d-flex align-items-center mb-2">
            <i class="mdi mdi-account-circle-outline text-primary mr-2"></i>
            <h6 class="mb-0">Account Type</h6>
          </div>
          <p class="text-muted mb-0">{{ formatTypeLabel(company.type) }}</p>
        </b-card>
        </b-col>
    </b-row>

    <b-row>
        <!-- Service Type -->
        <b-col md="12" sm="12" class="mb-3">
        <b-card class="h-100 shadow-sm">
          <div class="d-flex align-items-center mb-2">
            <i class="mdi mdi-cog-outline text-success mr-2"></i>
            <h6 class="mb-0">Service Type</h6>
          </div>
          <p class="text-muted mb-0">{{ formatServiceTypeLabel(company.service_types) }}</p>
        </b-card>
        </b-col>
    </b-row>

    <b-row>
      
     

      <!-- Company Info -->
      <b-col md="12" sm="12" class="mb-3">
        <b-card class="h-100 shadow-sm">
          <div class="d-flex align-items-center mb-3">
            <i class="mdi mdi-domain text-primary mr-2"></i>
            <h6 class="mb-0">Company Information</h6>
          </div>

          <b-row>
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
                  v-if="company.twitter_profile"
                  :href="company.twitter_profile"
                  target="_blank"
                  class="text-info"
                >
                  {{ company.twitter_profile }}
                </a>
                <span v-else>-</span>
              </p>
            </b-col>
            <b-col md="6" class="mb-2">
              <strong>LinkedIn:</strong>
              <p class="text-muted mb-0">
                <a
                  v-if="company.linkedIn_profile"
                  :href="company.linkedIn_profile"
                  target="_blank"
                  class="text-info"
                >
                  {{ company.linkedIn_profile }}
                </a>
                <span v-else>-</span>
              </p>
            </b-col>

            <b-col cols="12" class="text-center mt-3">
              <div v-if="company.logo">
                <img :src="company.logo" alt="Logo" class="logo-preview" />
              </div>
              <div v-else class="text-muted">No logo uploaded</div>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>

    <b-row>
      <!-- Business Details -->
      <b-col md="12">
        <b-card class="h-100 shadow-sm">
          <div class="d-flex align-items-center mb-3">
            <i class="mdi mdi-briefcase-outline text-primary mr-2"></i>
            <h6 class="mb-0">Business Details</h6>
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
      </b-col>
    </b-row>

    <div class="text-right mt-4">
      <b-button variant="secondary" @click="$emit('prev-step')">Back</b-button>
      <b-button variant="primary" @click="$emit('next-step')">Next</b-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "StepCompanyPreview",
  props: ["company"],
  mounted(){
    console.log(JSON.stringify(this.company, null, 2))
  },
  methods: {
    formatTypeLabel(type) {
      const labels = {
        BUSINESS: "Business",
        INDIVIDUAL: "Individual",
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