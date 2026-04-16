<template>
  <b-container fluid class="py-3">
    <v-row align="center" class="mb-6">
      <v-col cols="12" md="6">
        <h4 class="font-weight-bold mb-0">Getting Started</h4>
        <p class="text-subtitle-2 text-muted">Follow these steps to integrate and launch your verification flow</p>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" lg="8">

        <div class="steps-container">
          <div v-for="(item, i) in guideItems" :key="i" class="step-card mb-4">
            <div class="step-line" v-if="i !== guideItems.length - 1"></div>
            
            <div class="d-flex">
              <div class="step-number-wrapper mr-4">
                <div class="step-number-circle">
                  <v-icon small style="color:white">{{ item.icon }}</v-icon>
                </div>
              </div>

              <div class="step-content-box p-4 flex-grow-1">
                <h5 class="step-title mb-2">{{ i + 1 }}. {{ item.title }}</h5>
                <p class="text-muted small mb-3 lh-lg">{{ item.description }}</p>
                
                <a 
                  :href="item.link" 
                  :target="item.openInNewTab ? '_blank' : '_self'" 
                  class="step-action-link"
                >
                  {{ item.anchorText || "Read Documentation" }}
                  <v-icon x-small color="primary" class="ml-1">mdi-arrow-right</v-icon>
                </a>
              </div>
            </div>
          </div>
        </div>
      </v-col>

      <v-col cols="12" lg="4">
        <div class="overview-container mb-4">
          <h6 class="input-label mb-4"><v-icon x-small class="mr-1">mdi-lifebuoy</v-icon> Helpful Links</h6>
          <nav class="resource-nav">
            <a href="https://docs.hypersign.id" target="_blank" class="resource-link">
              <v-icon small class="mr-2">mdi-book-open-variant</v-icon> Core Concepts
            </a>
            <a href="https://docs.hypersign.id" target="_blank" class="resource-link">
              <v-icon small class="mr-2">mdi-file-document-outline</v-icon> Technical Docs
            </a>
            <a href="mailto:support@hypersign.id" class="resource-link">
              <v-icon small class="mr-2">mdi-message-outline</v-icon> Contact Support
            </a>
          </nav>
        </div>

        <div class="overview-container mb-4 secondary-bg">
          <h6 class="input-label mb-2"><v-icon x-small class="mr-1">mdi-school-outline</v-icon> Tutorials</h6>
          <p class="x-small text-muted mb-4">Learn by doing with quick, step-by-step guides for KYC & KYB.</p>
          <v-btn 
            block 
            depressed 
            small 
            color="white" 
            class="text-none font-weight-bold"
            href="https://docs.hypersign.id/hypersign-kyc/tutorials"
            target="_blank"
          >
            Explore Tutorials
          </v-btn>
        </div>

        <div class="overview-container">
          <h6 class="input-label mb-2"><v-icon x-small class="mr-1">mdi-file-chart-outline</v-icon> Case Studies</h6>
          <p class="x-small text-muted mb-4">Discover how companies streamline onboarding with Hypersign.</p>
          <a href="https://www.hypersign.id/blogs" target="_blank" class="text-primary x-small font-weight-bold">
            Read Success Stories <v-icon x-small color="primary">mdi-open-in-new</v-icon>
          </a>
        </div>
      </v-col>
    </v-row>
  </b-container>
</template>

<style scoped>
.overview-container {
  padding: 1.5rem;
  background-color: #f9fafb;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  margin-top: -0.85rem;
}

.secondary-bg {
  background-color: #f0f7ff; /* Light blue tint */
  border-color: #dbeafe;
}

.input-label {
  display: block;
  font-size: 0.72rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Steps Roadmap Styling */
.steps-container {
  position: relative;
  padding-left: 8px;
  margin-top: -0.85rem;
}

.step-card {
  position: relative;
}

.step-line {
  position: absolute;
  left: 20px;
  top: 40px;
  bottom: -20px;
  width: 2px;
  background-color: #e2e8f0;
  z-index: 1;
}

.step-number-circle {
  width: 42px;
  height: 42px;
  background-color: #3b82f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  position: relative;
  box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.2);
}

.step-content-box {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.step-content-box:hover {
  border-color: #3b82f6;
  transform: translateX(4px);
}

.step-title {
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
}

.step-action-link {
  font-size: 0.85rem;
  font-weight: 600;
  color: #3b82f6;
  text-decoration: none;
}

.step-action-link:hover {
  text-decoration: underline;
}

/* Resource Links */
.resource-nav {
  display: flex;
  flex-direction: column;
}

.resource-link {
  display: flex;
  align-items: center;
  padding: 8px 0;
  color: #475569;
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.2s;
}

.resource-link:hover {
  color: #3b82f6;
}

/* Typography Utilities */
.lh-lg { line-height: 1.6 !important; }
.x-small { font-size: 0.75rem; }
</style>
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
<!-- 
<style scoped>
.getting-started {
  background-color: #fff;
  font-family: "Inter", sans-serif;
}

.font-weight-500 {
  font-weight: 500;
}
</style> -->
