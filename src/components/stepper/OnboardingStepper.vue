<template>
  <section v-if="!hasService" class="onboarding-page">
    <load-ing :active.sync="isLoading" :can-cancel="false" :is-full-page="true" />

    <div class="onboarding-shell">
      <header class="onboarding-header">
        <div class="eyebrow">Workspace setup</div>
        <h1>{{ pageTitle }}</h1>
        <p>{{ pageDescription }}</p>
      </header>

      <div v-if="currentStep <= 2" class="step-navigation" aria-label="Onboarding progress">
        <div v-for="(step, index) in steps" :key="step.label" class="step-navigation__item" :class="{ 'is-active': currentStep === index + 1, 'is-complete': currentStep > index + 1 }">
          <span class="step-number">{{ index + 1 }}</span>
          <span>{{ step.label }}</span>
        </div>
      </div>

      <div class="onboarding-layout" :class="{ 'is-preview-layout': currentStep === 3, 'is-status-layout': currentStep === 4 }">
        <main class="onboarding-main">
          <StepCompanyDetails v-if="!isLoading && currentStep === 1" :company="company" @update:company="company = $event" @next-step="nextStep" />
          <StepIntendedUse v-else-if="!isLoading && currentStep === 2" :company="company" @update:company="company = $event" @prev-step="prevStep" @request-submit="openConfirmation" />
          <StepCompanyPreview v-else-if="!isLoading && currentStep === 3" :company="company" :read-only-review="true" @back-to-status="backToStatus" />
          <StepCreateSSIService
            v-else-if="!isLoading && currentStep === 4"
            :company="company"
            :is-refreshing="isRefreshingStatus"
            @refresh-status="refreshOnboardingStatus"
          />
        </main>

        <aside v-if="currentStep <= 2" class="setup-sidebar">
          <section class="setup-summary">
            <h2>What you’ll set up</h2>
            <p>One short request to prepare your identity verification workspace.</p>
            <ul>
              <li>Organization details</li>
              <li>Services you’re exploring</li>
              <li>Review and submit</li>
            </ul>
          </section>
          <a class="contact-card" href="mailto:support@hypersign.id">
            <i class="mdi mdi-email-outline" aria-hidden="true"></i>
            <span>Need help? Contact us</span>
          </a>
        </aside>
      </div>
    </div>

    <div v-if="showConfirmation" class="workspace-confirmation-backdrop" role="presentation" @click.self="closeConfirmation">
      <section class="workspace-confirmation-dialog" role="dialog" aria-modal="true" aria-labelledby="confirmation-title">
        <header class="workspace-confirmation-header">
          <h2 id="confirmation-title">Create your workspace</h2>
          <button type="button" aria-label="Close" :disabled="isProcessingCredit" @click="closeConfirmation">×</button>
        </header>
        <div class="workspace-confirmation-body">
          <h3>Your Hypersign workspace is almost ready!</h3>
          <p>We’ll automatically set up your selected verification services and allocate the required credits.</p>

          <div class="setup-preview">
            <div><i class="mdi mdi-cog-outline blue" aria-hidden="true"></i><span><strong>Workspace setup</strong><small>Your workspace will be created automatically.</small></span></div>
            <div><i class="mdi mdi-database-outline green" aria-hidden="true"></i><span><strong>Service configuration</strong><small>Selected services and credits will be provisioned.</small></span></div>
            <div><i class="mdi mdi-clock-outline purple" aria-hidden="true"></i><span><strong>Estimated setup time</strong><small>Under 30 minutes.</small></span></div>
          </div>

          <div class="production-note">
            <i class="mdi mdi-information-outline" aria-hidden="true"></i>
            <div>
              <strong>Moving to production</strong>
              <p>To activate production services, additional information may be required, including:</p>
              <ul><li>Company registration details</li><li>Tax information (India, where applicable)</li><li>Domain verification</li></ul>
            </div>
          </div>
          <p class="notification-note">We’ll notify you by email once your workspace is ready. You can track progress from your dashboard.</p>
          <div v-if="creditErrorMessage" class="submission-error" role="alert">{{ creditErrorMessage }}</div>
        </div>
        <footer class="workspace-confirmation-footer">
          <button type="button" class="secondary-button" :disabled="isProcessingCredit" @click="closeConfirmation">Cancel</button>
          <button type="button" class="primary-button" :disabled="isProcessingCredit" @click="processCreditRequest">
            {{ isProcessingCredit ? 'Creating…' : 'Create My Workspace' }} <span v-if="!isProcessingCredit" aria-hidden="true">→</span>
          </button>
        </footer>
      </section>
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
      showConfirmation: false,
      currentStep: 1,
      company: {
        name: '', logo: '', domain: '', type: 'BUSINESS', service_types: [],
        contact_email: '', billing_address: '', twitterUrl: '', linkedinUrl: '',
        telegramUrl: '', phone_no: '', country: '', registration_number: '',
        interests: [], yearly_volume: '', fields: [], referral_source: '', referral_source_other: '', logs: [], onboardingStatus: '',
      },
      steps: [{ label: 'Organization' }, { label: 'Intended use' }],
      isProcessingCredit: false,
      isRefreshingStatus: false,
      creditErrorMessage: null,
    };
  },
  computed: {
    ...mapGetters('mainStore', ['getUserDetails']),
    isSuperAdminUser() { return this.getUserDetails?.role === 'SUPER_ADMIN'; },
    pageTitle() {
      if (this.currentStep === 4) return 'Your workspace is being set up';
      if (this.currentStep === 3) return 'Review your submitted request';
      return 'Set up your workspace';
    },
    pageDescription() {
      if (this.currentStep === 4) return 'Track the progress of your verification environment.';
      if (this.currentStep === 3) return 'This is a read-only copy of the information you submitted.';
      return 'Tell us about your organization so we can prepare the right verification workspace.';
    },
  },
  mounted() { this.checkExistingOnboarding(); },
  methods: {
    async checkExistingOnboarding() {
      this.isLoading = true;
      try {
        if (this.isSuperAdminUser) return;
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
        referral_source: (data.referralSource || '').startsWith('Other: ') ? 'Other' : data.referralSource || '',
        referral_source_other: (data.referralSource || '').startsWith('Other: ') ? data.referralSource.slice(7) : '',
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
    nextStep() { this.currentStep = 2; this.creditErrorMessage = null; this.scrollToTop(); },
    prevStep() { this.currentStep = 1; this.creditErrorMessage = null; this.scrollToTop(); },
    openConfirmation() { this.creditErrorMessage = null; this.showConfirmation = true; },
    closeConfirmation() { if (!this.isProcessingCredit) this.showConfirmation = false; },
    previewSubmittedFlow() {
      if (!this.hasSubmitted) return;
      this.showConfirmation = false;
      this.currentStep = 3;
      this.scrollToTop();
    },
    backToStatus() {
      this.currentStep = 4;
      this.scrollToTop();
    },
    async refreshOnboardingStatus() {
      if (this.isRefreshingStatus) return;
      this.isRefreshingStatus = true;
      try {
        const existing = await this.$store.dispatch('mainStore/checkIfAlreadyExistOnBoarding');
        if (existing && existing._id) this.populateCompanyFromOnboarding(existing);
      } catch (error) {
        console.error(error?.message || error);
      } finally {
        this.isRefreshingStatus = false;
      }
    },
    async processCreditRequest() {
      if (this.isProcessingCredit || this.hasSubmitted) return;
      this.isProcessingCredit = true;
      this.creditErrorMessage = null;
      try {
        const result = await this.$store.dispatch('mainStore/onboardCustomer', this.buildCreditRequestPayload());
        this.company = { ...this.company, onboardingStatus: result?.onboardingStatus || result?.status || 'INITIATED', logs: result?.logs || this.company.logs || [] };
        this.showConfirmation = false;
        if (this.isSuperAdminUser) {
          this.hasSubmitted = false;
          this.currentStep = 1;
          this.scrollToTop();
          return;
        }
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
        this.creditErrorMessage = typeof error === 'string' ? error : error?.message || 'Unable to create your workspace. Please try again.';
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
        registrationNumber: this.company.registration_number || '', billingAddress: this.company.billing_address || '',
        twitterUrl: this.company.twitterUrl || '', linkedinUrl: this.company.linkedinUrl || '',
        telegramUrl: this.company.telegramUrl || '', phoneNumber: this.company.phone_no || '',
        interestedService: this.company.interests || [], yearlyVolume: this.company.yearly_volume || '',
        businessField: this.company.fields || [],
        referralSource: this.company.referral_source === 'Other'
          ? `Other: ${this.company.referral_source_other}`
          : this.company.referral_source || '',
        isKyc: hasBoth ? false : hasKyc, isKyb: hasBoth ? false : hasKyb, isKycAndKyb: hasBoth,
      };
    },
    scrollToTop() { this.$nextTick(() => window.scrollTo({ top: 0, behavior: 'smooth' })); },
  },
};
</script>

<style scoped>
.onboarding-page { min-height: calc(100vh - 64px); padding: 38px 32px 72px; background: #fff; color: #17213d; }
.onboarding-shell { width: 100%; max-width: 1080px; margin: 0 auto; }
.onboarding-header { margin-bottom: 24px; }
.eyebrow { margin-bottom: 4px; color: #6c757d; font-size: 10px; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; }
.onboarding-header h1 { margin: 0 0 5px; color: #111b39; font-size: 28px; font-weight: 750; line-height: 1.2; }
.onboarding-header p { margin: 0; color: #6b7280; font-size: 13px; }
.step-navigation { display: grid; grid-template-columns: repeat(2, 1fr); max-width: 760px; margin-bottom: 18px; }
.step-navigation__item { display: flex; gap: 9px; align-items: center; padding: 0 8px 12px; border-bottom: 2px solid #e1e4e7; color: #7a8288; font-size: 12px; font-weight: 650; }
.step-navigation__item:first-child { padding-left: 0; }
.step-navigation__item.is-active, .step-navigation__item.is-complete { border-color: #4178c0; color: #356daf; }
.step-number { display: inline-flex; width: 25px; height: 25px; align-items: center; justify-content: center; border-radius: 50%; background: #f0f1f2; font-size: 11px; }
.is-active .step-number, .is-complete .step-number { background: #4178c0; color: #fff; }
.onboarding-layout { display: grid; grid-template-columns: minmax(0, 760px) 220px; gap: 20px; align-items: start; }
.onboarding-layout.is-preview-layout, .onboarding-layout.is-status-layout { display: block; }
.onboarding-layout.is-preview-layout { max-width: 760px; }
.onboarding-main { min-width: 0; }
.setup-sidebar { display: grid; gap: 14px; }
.setup-summary, .contact-card { border: 1px solid #d5d9dd; border-radius: 7px; background: #fff; }
.setup-summary { padding: 18px; }
.setup-summary h2 { margin: 0 0 7px; color: #17213d; font-size: 16px; font-weight: 700; }
.setup-summary p, .setup-summary li { color: #6f7881; font-size: 11px; line-height: 1.55; }
.setup-summary ul { margin: 14px 0 0; padding-left: 18px; }
.setup-summary li { padding: 4px 0 4px 7px; }
.contact-card { display: flex; align-items: center; justify-content: center; gap: 9px; min-height: 58px; color: #6c757d; font-size: 11px; font-weight: 700; text-decoration: none; }
.contact-card:hover { border-color: #6c757d; background: #f5f6f7; color: #5a6268; }
.contact-card i { font-size: 17px; }
.workspace-confirmation-backdrop { position: fixed; z-index: 3000; inset: 0; display: flex; align-items: center; justify-content: center; padding: 20px; background: rgba(15, 23, 42, .5); opacity: 1; }
.workspace-confirmation-dialog { width: min(100%, 620px); max-height: calc(100vh - 40px); overflow: auto; border-radius: 7px; background: #fff; box-shadow: 0 24px 70px rgba(15,23,42,.28); }
.workspace-confirmation-header { display: flex; min-height: 54px; align-items: center; justify-content: space-between; padding: 0 22px; background: #263649; color: #fff; }
.workspace-confirmation-header h2 { margin: 0; color: #fff; font-size: 16px; font-weight: 700; }
.workspace-confirmation-header button { border: 0; background: transparent; color: #fff; font-size: 24px; line-height: 1; }
.workspace-confirmation-header button:disabled { opacity: .5; }
.workspace-confirmation-body { display: block; padding: 22px; background: #fff; }
.workspace-confirmation-body > h3 { margin: 0 0 4px; color: #17213d; font-size: 16px; }
.workspace-confirmation-body > p { margin: 0; color: #64748b; font-size: 12px; line-height: 1.5; }
.setup-preview { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 18px; padding: 14px; border-radius: 6px; background: #f7f9fc; }
.setup-preview > div { display: flex; align-items: flex-start; gap: 9px; }
.setup-preview i { display: inline-flex; flex: 0 0 auto; width: 28px; height: 28px; align-items: center; justify-content: center; border-radius: 50%; font-size: 16px; }
.setup-preview .blue { background: #eceeef; color: #6c757d; }
.setup-preview .green { background: #e7f8ef; color: #1d9b63; }
.setup-preview .purple { background: #eceeef; color: #6c757d; }
.setup-preview strong, .setup-preview small { display: block; }
.setup-preview strong { color: #263550; font-size: 10px; }
.setup-preview small { margin-top: 2px; color: #718096; font-size: 8px; line-height: 1.35; }
.production-note { display: flex; gap: 10px; margin-top: 18px; padding: 14px; border: 1px solid #d8dcdf; border-radius: 6px; background: #f5f6f7; color: #626b73; }
.production-note > i { flex: 0 0 auto; color: #6c757d; font-size: 17px; }
.production-note strong { color: #253454; font-size: 11px; }
.production-note p, .production-note li { font-size: 9px; line-height: 1.5; }
.production-note p { margin: 3px 0 5px; }
.production-note ul { margin: 0; padding-left: 17px; }
.notification-note { margin-top: 14px !important; font-size: 10px !important; }
.submission-error { margin-top: 12px; padding: 9px 11px; border-radius: 5px; background: #fff1f0; color: #b42318; font-size: 11px; }
.workspace-confirmation-footer { display: flex; align-items: center; justify-content: space-between; padding: 15px 22px; border-top: 1px solid #e3e9f2; background: #fff; }
.primary-button, .secondary-button { min-height: 36px; padding: 0 16px; border-radius: 5px; font-size: 11px; font-weight: 700; }
.primary-button { border: 1px solid #6c757d; background: #6c757d; color: #fff; }
.primary-button:hover:not(:disabled) { border-color: #5a6268; background: #5a6268; }
.secondary-button { border: 1px solid #6c757d; background: #fff; color: #6c757d; }
.secondary-button:hover:not(:disabled) { background: #6c757d; color: #fff; }
.primary-button:disabled, .secondary-button:disabled { cursor: wait; opacity: .6; }
@media (max-width: 900px) { .onboarding-layout { grid-template-columns: 1fr; } .setup-sidebar { grid-template-columns: 1fr 1fr; } }
@media (max-width: 600px) {
  .onboarding-page { padding: 28px 16px 48px; }
  .onboarding-header h1 { font-size: 23px; }
  .step-navigation__item { font-size: 11px; }
  .setup-sidebar, .setup-preview { grid-template-columns: 1fr; }
  .workspace-confirmation-body { padding: 18px; }
}
</style>
