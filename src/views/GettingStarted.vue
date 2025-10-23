<template>
  <v-container fluid class="py-5 getting-started">
    <v-row>
      <!-- Left Column -->
      <v-col cols="12" md="8">
        <h4 class="mb-4 font-weight-bold">Getting Started Guide</h4>

        <b-card no-body class="mb-3" v-for="(item, i) in guideItems" :key="i">
          <b-card-header class="p-0">
            <b-button
              v-b-toggle="'accordion-' + i"
              block
              class="text-left d-flex align-items-center justify-content-between py-3 px-3"
              variant="light"
            >
              <div class="d-flex align-items-center">
                <v-icon left class="mr-2">{{ item.icon }}</v-icon>
                <span class="font-weight-500">{{ item.title }}</span>
              </div>
              <v-icon small>mdi-chevron-down</v-icon>
            </b-button>
          </b-card-header>

          <b-collapse :id="'accordion-' + i" accordion="guide-accordion" role="tabpanel">
            <b-card-body>
              <p class="mb-2">{{ item.description }}</p>
              <a :href="item.link" target="_blank" class="text-primary font-weight-medium">
                Read Documentation
              </a>
            </b-card-body>
          </b-collapse>
        </b-card>
      </v-col>

      <!-- Right Column -->
      <v-col cols="12" md="4">
        <!-- Helpful Links -->
        <b-card class="mb-3">
          <h6 class="font-weight-bold mb-3">Helpful Links</h6>
          <ul class="list-unstyled mb-0">
            <li class="mb-2"><a href="#" class="text-primary">Concepts</a></li>
            <li class="mb-2">
              <a href="https://docs.hypersign.id" target="_blank" class="text-primary">Docs</a>
            </li>
            <li><a href="#" class="text-primary">Support</a></li>
          </ul>
        </b-card>

        <!-- Explore Flows -->
        <b-card class="mb-3">
          <h6 class="font-weight-bold mb-2">Explore Flows</h6>
          <p class="mb-0 text-muted">
            See other verification flows and templates available in Hypersign.
          </p>
        </b-card>

        <!-- Invite Team -->
        <b-card>
          <h6 class="font-weight-bold mb-2">Invite Team</h6>
          <p class="text-muted mb-3">
            Invite your colleagues to collaborate and manage your Hypersign workspace together.
          </p>
          <b-button disabled variant="light" class="text-muted font-weight-medium">
            Coming Soon
          </b-button>
        </b-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "GettingStarted",
  data() {
    return {
      guideItems: [
        {
          title: "Understand Hypersign Basics",
          icon: "mdi-book-open-page-variant-outline",
          description:
            "Learn the fundamental concepts of Hypersign and how it helps you build secure and compliant identity verification flows.",
          link: "https://docs.hypersign.id",
        },
        {
          title: "Test Crypto KYC Flow",
          icon: "mdi-account-check-outline",
          description:
            "Simulate the KYC process and understand the verification flow for crypto users using Hypersign APIs.",
          link: "https://docs.hypersign.id",
        },
        {
          title: "Configure Capture Flow",
          icon: "mdi-cog-outline",
          description:
            "Customize your capture flow to include liveliness, document, or consent checks before integrating with your app.",
          link: "https://docs.hypersign.id",
        },
        {
          title: "Integrate into your App",
          icon: "mdi-link-variant",
          description:
            "Embed the Hypersign KYC widget into your web or mobile app for a seamless verification experience.",
          link: "https://docs.hypersign.id",
        },
        {
          title: "Go Live",
          icon: "mdi-chart-line",
          description:
            "After successful testing, move to production and start verifying real users securely.",
          link: "https://docs.hypersign.id",
        },
      ],
    };
  },
};
</script>

<style scoped>
.getting-started {
  background-color: #fff;
  font-family: "Inter", sans-serif;
}

.font-weight-500 {
  font-weight: 500;
}
</style>
