<template>
  <v-container fluid class="py-5 getting-started">
    <v-row>
      <!-- Left Column -->
      <v-col cols="12" md="8">
        <h4 class="mb-4 font-weight-bold">Getting Started</h4>

        <b-card no-body class="mb-3" v-for="(item, i) in guideItems" :key="i">
          <b-card-header class="p-0">
            <b-button v-b-toggle="'accordion-' + i" block
              class="text-left d-flex align-items-center justify-content-between py-3 px-3" variant="light">
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
              <a :href="item.link" :target="!item.openInNewTab ? '' : '_blank'" class="text-primary font-weight-medium">
                {{ item.anchorText || "Read Documentation" }}
              </a>
            </b-card-body>
          </b-collapse>
        </b-card>
      </v-col>

      <!-- Right Column -->
      <v-col cols="12" md="4">
        <!-- Helpful Links -->
        <v-card class="serviceCard mb-3 p-3">
          <h6 class="font-weight-bold mb-3"><v-icon>mdi-lifebuoy</v-icon> Helpful Links</h6>
          <ul class="list-unstyled mb-0">
            <li class="mb-2"><a href="#" class="text-primary">Core Concepts</a></li>
            <li class="mb-2">
              <a href="https://docs.hypersign.id" target="_blank" class="text-primary">Docs</a>
            </li>
            <li><a href="#" class="text-primary">Support</a></li>
          </ul>
        </v-card>

        <!-- Explore Flows -->
        <v-card class="serviceCard mb-3 p-3">
          <h6 class="font-weight-bold mb-2"><v-icon>mdi-school-outline</v-icon> Tutorials</h6>
          <p class="mb-0 text-muted">
            Learn by doing — follow quick, step-by-step guides to get started with Hypersign KYC. From integrating the KYC widget in minutes to creating your custom verifier URL, these tutorials walk you through real examples. <a target="_blank" class="text-primary" href="https://docs.hypersign.id/hypersign-kyc/tutorials">Let's go!</a>
          </p>
        </v-card>

        <!-- Invite Team -->
        <v-card class="serviceCard mb-3 p-3">
          <h6 class="font-weight-bold mb-2"><v-icon>mdi-file-chart-outline</v-icon> Read Case Studies</h6>
          <p class="text-muted mb-3">
            Discover how leading companies are using Hypersign to streamline KYC and KYB verification. Learn from real-world implementations, challenges solved, and measurable business impact. <a target="_blank" class="text-primary" href="https://www.hypersign.id/blogs">Ready to dive in?</a>
          </p>
          <!-- <b-button disabled variant="light" class="text-muted font-weight-medium">
            Coming Soon
          </b-button> -->
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapMutations, mapGetters } from "vuex";
export default {
  name: "GettingStarted",
  data() {
    return {
      guideItems: [
        {
          title: "Understand Hypersign Basics",
          icon: "mdi-book-open-page-variant-outline",
          description:
            "Start by learning how Hypersign KYC works — from identity capture to verification and issuance. This guide explains each component and how it ensures secure, compliant onboarding.",
          link: "https://docs.hypersign.id/hypersign-kyc/introduction",
          openInNewTab: true,
        },
        {
          title: "Configure Your KYC Widget",
          icon: "mdi-cog-outline",
          description:
            "Set up your KYC widget according to your needs — choose between liveliness checks, ID document verification, and consent capture. You’ll also learn how to customize branding and themes.",
          link: "https://docs.hypersign.id/hypersign-kyc/integrations/widget-configuration",
          openInNewTab: true,
        },
        {
          title: "Create Your Custom KYC Verifier URL",
          icon: "mdi-web-check",
          description:
            "Quickly test your KYC flow by creating a Verifier page. Just add a title, description, and theme — and you’ll get a sharable KYC URL to test the end-to-end verification process with sample users.",
          link: `#/studio/kyc-webpage-generator/${this.appId()}`, 
          anchorText: "Go to KYC Verifier Setup",
          openInNewTab: false,
        },
        {
          title: "Integrate into Your App",
          icon: "mdi-code-tags",
          description:
            "Developers can embed the KYC widget directly into their web or mobile apps. Learn how to authenticate via backend APIs, generate session IDs, prepare the widget URL, and handle verification events.",
          link: "https://docs.hypersign.id/hypersign-kyc/kyc-widget/integrations",
          openInNewTab: true,
        },
        {
          title: "Go Live",
          icon: "mdi-rocket-launch-outline",
          description:
            "Once you’re satisfied with testing, verify your domain and switch from the Dev to Production environment. This step ensures real user verification in a secure, compliant setting.",
          link: "https://docs.hypersign.id/hypersign-kyc/integrations/environments",
          openInNewTab: true,
        },
      ]
    };
  },
  created() {
    this.updateSideNavStatus(true)
  },
  computed: {
    ...mapGetters('mainStore', ['getSelectedService'])
  },
  methods: {
    // eslint-disable-next-line no-undef
    ...mapMutations('playgroundStore', ['updateSideNavStatus', 'shiftContainer']),
    appId() {
      return this.getSelectedService ? this.getSelectedService.appId : this.$route.params.appId
    }
  }
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
