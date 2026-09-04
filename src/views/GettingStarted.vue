<template>
  <b-container fluid class="px-6 py-4">
    <!-- Header Title Section -->
    <v-row align="center" class="mb-4">
      <v-col cols="12">
        <h4 class="font-weight-bold mb-1 text-slate-800">Getting Started</h4>
        <p class="text-subtitle-2 text-muted mb-0">
          Follow these steps to integrate and launch your verification flow
        </p>
      </v-col>
    </v-row>

    <v-row>
      <!-- Main Content / Stepper Roadmap -->
      <v-col cols="12" lg="8">
        <div class="steps-container">
          <div 
            v-for="(item, i) in guideItems" 
            :key="i" 
            class="step-card mb-4"
          >
            <!-- Connecting line between steps -->
            <div class="step-line" v-if="i !== guideItems.length - 1"></div>
            
            <div class="d-flex align-items-start">
              <!-- Number Circle Badge -->
              <div class="step-number-wrapper mr-4">
                <div class="step-number-circle">
                  <v-icon small color="primary">{{ item.icon }}</v-icon>
                </div>
              </div>

              <!-- Content Card -->
              <div class="step-content-box p-4 flex-grow-1">
                <h5 class="step-title mb-2">{{ i + 1 }}. {{ item.title }}</h5>
                <p class="text-muted small mb-3 lh-lg">{{ item.description }}</p>
                
                <a 
                  :href="item.link" 
                  :target="item.openInNewTab ? '_blank' : '_self'" 
                  class="step-action-link d-inline-flex align-center"
                >
                  {{ item.anchorText || "Read Documentation" }}
                  <v-icon x-small color="primary" class="ml-1">mdi-arrow-right</v-icon>
                </a>
              </div>
            </div>
          </div>
        </div>
      </v-col>

      <!-- Right Sidebar Cards -->
      <v-col cols="12" lg="4">
        <!-- Helpful Links Card -->
        <div class="overview-container mb-4">
          <h6 class="input-label mb-3">
            <v-icon x-small class="mr-1" color="grey darken-1">mdi-lifebuoy</v-icon> Helpful Links
          </h6>
          <nav class="resource-nav">
            <a href="https://docs.hypersign.id" target="_blank" class="resource-link">
              <v-icon small color="grey darken-1" class="mr-2">mdi-book-open-variant</v-icon> Core Concepts
            </a>
            <a href="https://docs.hypersign.id" target="_blank" class="resource-link">
              <v-icon small color="grey darken-1" class="mr-2">mdi-file-document-outline</v-icon> Technical Docs
            </a>
            <a href="mailto:support@hypersign.id" class="resource-link">
              <v-icon small color="grey darken-1" class="mr-2">mdi-message-outline</v-icon> Contact Support
            </a>
          </nav>
        </div>

        <!-- Tutorials Card -->
        <div class="overview-container mb-4 secondary-bg">
          <h6 class="input-label mb-2">
            <v-icon x-small class="mr-1" color="primary">mdi-school-outline</v-icon> Tutorials
          </h6>
          <p class="x-small text-muted mb-4">
            Learn by doing with quick, step-by-step guides for KYC & KYB.
          </p>
          <v-btn 
            block 
            outlined 
            small 
            color="primary" 
            class="text-none font-weight-bold bg-white elevation-0"
            href="https://docs.hypersign.id/hypersign-kyc/tutorials"
            target="_blank"
          >
            Explore Tutorials
          </v-btn>
        </div>

        <!-- Business Verification Card -->
        <div class="overview-container mb-4">
          <h6 class="input-label mb-2">
            <v-icon x-small class="mr-1" color="grey darken-1">mdi-domain</v-icon> Business Verification
          </h6>
          <p class="x-small text-muted mb-4">
            Set up your Business Verifier page to verify and onboard your stakeholders and businesses.
          </p>
          <v-btn
            block
            outlined
            small
            color="grey darken-2"
            class="text-none font-weight-bold bg-white elevation-0"
            :href="`#/studio/kyb-webpage-generator/${appId()}`"
          >
            Set Up Business Verifier
          </v-btn>
        </div>

        <!-- Case Studies Card -->
        <div class="overview-container">
          <h6 class="input-label mb-2">
            <v-icon x-small class="mr-1" color="grey darken-1">mdi-file-chart-outline</v-icon> Case Studies
          </h6>
          <p class="x-small text-muted mb-3">
            Discover how companies streamline onboarding with Hypersign.
          </p>
          <a href="https://www.hypersign.id/blogs" target="_blank" class="step-action-link d-inline-flex align-center x-small">
            Read Success Stories <v-icon x-small color="primary" class="ml-1">mdi-open-in-new</v-icon>
          </a>
        </div>
      </v-col>
    </v-row>
  </b-container>
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
            "Start by learning how Hypersign ID works — from identity capture to verification and issuance. This guide explains each component and how it ensures secure, compliant onboarding.",
          link: "https://docs.hypersign.id/hypersign-kyc/introduction",
          openInNewTab: true,
        },
        {
          title: "Configure Your ID Widget",
          icon: "mdi-cog-outline",
          description:
            "Set up your ID widget according to your needs — choose between liveliness checks, ID document verification, and consent capture. You’ll also learn how to customize branding and themes.",
          link: "https://docs.hypersign.id/hypersign-kyc/integrations/widget-configuration",
          openInNewTab: true,
        },
        {
          title: "Create Your Custom ID Verifier Page",
          icon: "mdi-web-check",
          description:
            "Quickly test your ID verification flow by creating a Custom Verifier page. Just add a title, description, and theme — and you’ll get a sharable KYC URL to test the end-to-end verification process with sample users.",
          link: `#/studio/kyc-webpage-generator/${this.appId()}`, 
          anchorText: "Go to ID Verifier Setup",
          openInNewTab: false,
        },
        {
          title: "Integrate into Your App",
          icon: "mdi-code-tags",
          description:
            "Developers can embed the ID widget directly into their web or mobile apps. Learn how to authenticate via backend APIs, generate session IDs, prepare the widget URL, and handle verification events.",
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
    this.updateSideNavStatus(true);
  },
  computed: {
    ...mapGetters('mainStore', ['getSelectedService'])
  },
  methods: {
    // eslint-disable-next-line no-undef
    ...mapMutations('playgroundStore', ['updateSideNavStatus', 'shiftContainer']),
    appId() {
      return this.getSelectedService ? this.getSelectedService.appId : this.$route.params.appId;
    }
  }
};
</script>

<style scoped>
/* Sidebar Cards */
.overview-container {
  padding: 1.25rem;
  background-color: #ffffff;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03);
}

.secondary-bg {
  background-color: #f0f7ff;
  border-color: #bfdbfe;
}

.input-label {
  display: flex;
  align-items: center;
  font-size: 0.75rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Stepper Layout Fixes */
.steps-container {
  position: relative;
}

.step-card {
  position: relative;
}

.step-number-wrapper {
  position: relative;
  z-index: 2;
}

.step-number-circle {
  width: 40px;
  height: 40px;
  background-color: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.step-line {
  position: absolute;
  left: 19px;
  top: 40px;
  bottom: -24px;
  width: 2px;
  background-color: #e2e8f0;
  z-index: 1;
}

/* Step Card Styles */
.step-content-box {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.step-content-box:hover {
  border-color: #3b82f6;
  box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.08);
}

.step-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #1e293b;
}

.step-action-link {
  font-size: 0.85rem;
  font-weight: 600;
  color: #2563eb;
  text-decoration: none;
}

.step-action-link:hover {
  text-decoration: underline;
}

/* Links */
.resource-nav {
  display: flex;
  flex-direction: column;
}

.resource-link {
  display: flex;
  align-items: center;
  padding: 6px 0;
  color: #475569;
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.2s;
}

.resource-link:hover {
  color: #2563eb;
}

/* Typography Helpers */
.lh-lg { line-height: 1.6 !important; }
.x-small { font-size: 0.75rem; }
.text-slate-800 { color: #1e293b; }
.bg-white { background-color: #ffffff !important; }
</style>