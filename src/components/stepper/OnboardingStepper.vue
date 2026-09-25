<template>
  <section v-if="!hasService" class="onboarding-page">
    <load-ing :active.sync="isLoading" :can-cancel="false" :is-full-page="true" />

    <div class="onboarding-shell">
      <header class="onboarding-header">
        <div class="eyebrow">Account setup</div>
        <h1>{{ currentStep === 4 ? 'Setup request received' : 'Set up your organization' }}</h1>
        <p>
          {{ currentStep === 4
            ? "We'll keep you updated as your request moves through review."
            : 'Tell us about your organization so we can prepare the right verification workspace.' }}
        </p>
      </header>

      <div v-if="currentStep !== 4" class="step-navigation" aria-label="Onboarding progress">
        <div
          v-for="(step, index) in steps"
          :key="step.label"
          class="step-navigation__item"
          :class="{
            'is-active': currentStep === index + 1,
            'is-complete': currentStep > index + 1
          }"
        >
          <span class="step-number">{{ index + 1 }}</span>
          <span>{{ step.label }}</span>
        </div>
      </div>

      <div class="onboarding-layout">
        <main class="onboarding-main">
          <component
            v-if="!isLoading"
            :is="currentComponent"
            :company="company"
            :is-processing-credit="isProcessingCredit"
            :error-message="creditErrorMessage"
            :read-only-review="hasSubmitted"
            @update:company="company = $event"
            @next-step="nextStep"
            @prev-step="prevStep"
            @go-to-step="goToStep"
            @process-credit="processCreditRequest"
            @clear-error="clearCreditError"
            @preview-flow="previewSubmittedFlow"
            @back-to-status="currentStep = 4"
          />
        </main>

        <aside class="setup-summary">
          <h2>What you’ll set up</h2>
          <p>One short request to prepare your identity verification workspace.</p>
          <ul>
            <li>Organization details</li>
            <li>Services you’re exploring</li>
            <li>Review and submit</li>
          </ul>
          <div class="security-note">
            <strong>Security setup, including MFA,</strong> can be shown as a separate requirement at the point where access requires it.
          </div>
          <div class="privacy-note">
            <strong>Designed for clarity</strong>
            <span>Only the information needed to review and prepare your workspace is requested.</span>
          </div>
        </aside>
      </div>
    </div>
  </section>
</template>

<script>
import StepCompanyDetails from './StepCompanyDetails.vue';
import StepIntendedUse from './StepIntendedUse.vue';
import StepCompanyPreview from './StepCompanyPreview.vue';
import StepCreateSSIService from './StepCreateSSIService.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'OnboardingStepper',
  components: { StepCompanyDetails, StepIntendedUse, StepCompanyPreview, StepCreateSSIService },
  data() {
    return {
      isLoading: true,
      hasService: false,
      hasSubmitted: false,
      currentStep: 1,
      company: {
        name: '', logo: '', domain: '', type: 'BUSINESS', service_types: [],
        contact_email: '', billing_address: '', twitterUrl: '', linkedinUrl: '',
        telegramUrl: '', phone_no: '', country: '', registration_number: '',
        interests: [], yearly_volume: '', fields: [], logs: [], onboardingStatus: '',
      },
      steps: [
        { label: 'Organization' },
        { label: 'Intended use' },
        { label: 'Review' },
      ],
      isProcessingCredit: false,
      creditErrorMessage: null,
    };
  },
  computed: {
    ...mapGetters('mainStore', ['getUserDetails']),
    currentComponent() {
      return [StepCompanyDetails, StepIntendedUse, StepCompanyPreview, StepCreateSSIService][this.currentStep - 1] || StepCompanyDetails;
    },
    isSuperAdminUser() {
      return this.getUserDetails?.role === 'SUPER_ADMIN';
    },
  },
  mounted() {
    this.checkExistingOnboarding();
  },
  methods: {
    async checkExistingOnboarding() {
      this.isLoading = true;
      try {
        if (this.isSuperAdminUser) {
          this.currentStep = 1;
          return;
        }
        const existing = await this.$store.dispatch('mainStore/checkIfAlreadyExistOnBoarding');
        if (existing && existing._id) {
          this.populateCompanyFromOnboarding(existing);
          const status = (existing.onboardingStatus || existing.status || '').toUpperCase();
          if (['APPROVED', 'INITIATED', 'FAILED'].includes(status)) {
            this.hasSubmitted = true;
            this.currentStep = 4;
          }
        }
      } catch (error) {
        console.error(error?.message || error);
      } finally {
        this.isLoading = false;
      }
    },
    populateCompanyFromOnboarding(data) {
      this.company = {
        name: data.companyName || '', logo: data.companyLogo || '',
        contact_email: data.customerEmail || '', domain: data.domain || '',
        type: data.type === 2 || data.type === 'COMMUNITY' ? 'COMMUNITY' : 'BUSINESS',
        country: data.country || '', registration_number: data.registrationNumber || '',
        billing_address: data.billingAddress || '', twitterUrl: data.twitterUrl || '',
        linkedinUrl: data.linkedinUrl || '', telegramUrl: data.telegramUrl || '',
        phone_no: data.phoneNumber || '', interests: data.interestedService || [],
        logs: data.logs || [], yearly_volume: data.yearlyVolume || '',
        fields: data.businessField || [],
        onboardingStatus: data.onboardingStatus || data.status || '',
        service_types: this.determineServiceTypes(data),
      };
    },
    determineServiceTypes(data) {
      if (data.isKycAndKyb) return ['KYC', 'KYB'];
      const services = [];
      if (data.isKyc) services.push('KYC');
      if (data.isKyb) services.push('KYB');
      return services;
    },
    nextStep() {
      if (this.currentStep < 3) this.currentStep += 1;
      this.creditErrorMessage = null;
      this.scrollToTop();
    },
    prevStep() {
      if (this.currentStep > 1 && this.currentStep <= 3) this.currentStep -= 1;
      this.creditErrorMessage = null;
      this.scrollToTop();
    },
    goToStep(step) {
      if ([1, 2].includes(step)) {
        this.currentStep = step;
        this.creditErrorMessage = null;
        this.scrollToTop();
      }
    },
    previewSubmittedFlow() {
      this.currentStep = 3;
      this.scrollToTop();
    },
    async processCreditRequest() {
      if (this.isProcessingCredit || this.hasSubmitted) return;
      this.isProcessingCredit = true;
      this.creditErrorMessage = null;
      try {
        const result = await this.$store.dispatch('mainStore/onboardCustomer', this.buildCreditRequestPayload());
        this.company = {
          ...this.company,
          onboardingStatus: result?.onboardingStatus || result?.status || 'INITIATED',
          logs: result?.logs || this.company.logs || [],
        };
        this.hasSubmitted = true;
        this.currentStep = 4;
        try {
          const existing = await this.$store.dispatch('mainStore/checkIfAlreadyExistOnBoarding');
          if (existing && existing._id) this.populateCompanyFromOnboarding(existing);
        } catch (refreshError) {
          console.error(refreshError?.message || refreshError);
        }
        this.scrollToTop();
      } catch (error) {
        this.creditErrorMessage = typeof error === 'string'
          ? error
          : error?.message || 'Unable to submit your setup request. Please try again.';
      } finally {
        this.isProcessingCredit = false;
      }
    },
    buildCreditRequestPayload() {
      const hasKyc = this.company.service_types.includes('KYC');
      const hasKyb = this.company.service_types.includes('KYB');
      const hasBoth = hasKyc && hasKyb;
      return {
        companyName: this.company.name, companyLogo: this.company.logo,
        customerEmail: this.company.contact_email, domain: this.company.domain,
        type: this.company.type, country: this.company.country || '',
        registrationNumber: this.company.registration_number || '',
        billingAddress: this.company.billing_address || '',
        twitterUrl: this.company.twitterUrl || '', linkedinUrl: this.company.linkedinUrl || '',
        telegramUrl: this.company.telegramUrl || '', phoneNumber: this.company.phone_no || '',
        interestedService: this.company.interests || [], yearlyVolume: this.company.yearly_volume || '',
        businessField: this.company.fields || [], isKyc: hasBoth ? false : hasKyc,
        isKyb: hasBoth ? false : hasKyb, isKycAndKyb: hasBoth,
      };
    },
    clearCreditError() {
      this.creditErrorMessage = null;
    },
    scrollToTop() {
      this.$nextTick(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
    },
  },
};
</script>

<style scoped>
.onboarding-page { min-height: calc(100vh - 64px); padding: 44px 32px 72px; background: #fff; color: #172033; }
.onboarding-shell { width: 100%; max-width: 1080px; margin: 0 auto; }
.onboarding-header { margin-bottom: 28px; }
.eyebrow { margin-bottom: 8px; color: #64748b; font-size: 12px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; }
.onboarding-header h1 { margin: 0 0 8px; color: #172033; font-size: 28px; font-weight: 700; line-height: 1.25; }
.onboarding-header p { margin: 0; color: #64748b; font-size: 15px; }
.step-navigation { display: grid; grid-template-columns: repeat(3, 1fr); max-width: 760px; margin-bottom: 28px; }
.step-navigation__item { display: flex; gap: 8px; align-items: center; padding: 0 8px 12px; border-bottom: 2px solid #e6ebf2; color: #8993a4; font-size: 13px; font-weight: 600; }
.step-navigation__item:first-child { padding-left: 0; }
.step-navigation__item.is-active, .step-navigation__item.is-complete { border-color: #2f6fec; color: #2f6fec; }
.step-number { display: inline-flex; width: 22px; height: 22px; align-items: center; justify-content: center; border-radius: 50%; background: #eef2f7; font-size: 11px; }
.is-active .step-number, .is-complete .step-number { background: #2f6fec; color: #fff; }
.onboarding-layout { display: grid; grid-template-columns: minmax(0, 760px) 220px; gap: 28px; align-items: start; }
.onboarding-main { min-width: 0; }
.setup-summary { padding: 18px; border: 1px solid #dde4ee; border-radius: 8px; background: #fff; }
.setup-summary h2 { margin: 0 0 8px; font-size: 16px; font-weight: 700; }
.setup-summary p, .setup-summary li, .privacy-note { color: #68758a; font-size: 13px; line-height: 1.55; }
.setup-summary ul { margin: 10px 0 16px; padding-left: 18px; }
.security-note { margin: 16px 0; padding: 12px; border-radius: 6px; background: #f2f6ff; color: #52627a; font-size: 12px; line-height: 1.5; }
.security-note strong, .privacy-note strong { display: block; color: #334155; }
.privacy-note span { display: block; margin-top: 4px; }
@media (max-width: 900px) { .onboarding-layout { grid-template-columns: 1fr; } }
@media (max-width: 600px) {
  .onboarding-page { padding: 28px 16px 48px; }
  .onboarding-header h1 { font-size: 23px; }
  .step-navigation__item { font-size: 11px; }
}
</style>
