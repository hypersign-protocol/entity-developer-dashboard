<template>
  <b-container fluid class="">

    <b-row class="align-items-center">
      <b-col md="8">
        <div class="d-flex align-items-center">
          <h4 class="mb-1 font-weight-bold  mb-0">Reusable Identity</h4>
          <span class="beta-badge">BETA</span>
        </div>
        <p class="text-muted small mb-0">Streamline onboarding by allowing users to share verified credentials across the
          ecosystem.</p>
      </b-col>
    </b-row>

    <b-row class="mb-2" style="background-color: #f9fafb;">
      <b-col lg="8">
        <b-card class="border-0 shadow-sm h-100 p-3" style="border-radius: 0.75rem;">
          <div class="d-flex align-items-start mb-4">
            <div class="icon-box mr-3">
              <i class="mdi mdi-identifier text-primary h4 mb-0"></i>
            </div>
            <div>
              <h5 class="font-weight-bold mb-1">Verify Once, Use Everywhere</h5>
              <p class="text-muted small">Reusable Identity is linked with our <strong>Trusted Issuer</strong> network.
                If configured, users with existing KYC credentials in their data vault can skip verification steps
                entirely by authorizing a secure data share.</p>
            </div>
          </div>

          <b-row>
            <b-col md="6">
              <div class="benefit-card">
                <label class="input-label-caps text-primary">For Your Users</label>
                <ul class="list-unstyled small mt-2">
                  <li class="mb-2"><i class="mdi mdi-check-circle-outline text-success mr-2"></i>Zero-friction
                    onboarding</li>
                  <li class="mb-2"><i class="mdi mdi-shield-lock-outline text-success mr-2"></i>Full control over
                    personal data</li>
                  <li><i class="mdi mdi-timer-outline text-success mr-2"></i>Identity verified in seconds</li>
                </ul>
              </div>
            </b-col>
            <b-col md="6">
              <div class="benefit-card">
                <label class="input-label-caps text-primary">For Your Business</label>
                <ul class="list-unstyled small mt-2">
                  <li class="mb-2"><i class="mdi mdi-chart-line text-success mr-2"></i>Higher conversion rates</li>
                  <li class="mb-2"><i class="mdi mdi-cash-check text-success mr-2"></i>Reduced KYC/KYB processing costs
                  </li>
                  <li><i class="mdi mdi-bank-outline text-success mr-2"></i>Instant trust via verified issuers</li>
                </ul>
              </div>
            </b-col>
          </b-row>
        </b-card>
      </b-col>

      <b-col lg="4">
        <b-card class="border-0 shadow-sm"
          style="border-radius: 0.75rem; background: linear-gradient(180deg, #ffffff 0%, #f0f7ff 100%);">
          <label class="input-label-caps mb-4 d-block">Implementation Preview</label>

          <div class="workflow-visual p-3 mb-4 text-center">
            <div class="small font-weight-bold mb-3">User Flow with Reusable Identity</div>
            <div class="d-flex justify-content-between align-items-center">
              <div class="flow-step">Widget</div>
              <i class="mdi mdi-arrow-right text-muted"></i>
              <div class="flow-step active">Proof Share</div>
              <i class="mdi mdi-arrow-right text-muted"></i>
              <div class="flow-step">Verified</div>
            </div>
          </div>

          <div class="p-3 rounded mb-4" style="background: #f8fafc; border: 1px dashed #cbd5e1;">
            <p class="small text-muted mb-0">
              <i class="mdi mdi-lightbulb-on-outline text-warning mr-1"></i>
              <strong>Beta Pro-tip:</strong> Start by trusting your own sub-apps to see how identity travels between
              your different services seamlessly.
            </p>
          </div>


          <b-button block variant="outline-primary" class="py-3 font-weight-bold" style="border-radius: 0.75rem;"
            href="https://docs.hypersign.id/hypersign-kyc/integrations/widget-configuration#trusted-issuer"
            target="_blank">
            <i class="mdi mdi-book-open-page-variant mr-1"></i> Documentation
          </b-button>
        </b-card>

      </b-col>
    </b-row>

    <b-row style="background-color: #f9fafb;">
      <b-col cols="12">
        <div class="d-flex align-items-center mb-3">
          <div class="section-label mr-3">Verified Issuer Ecosystem</div>
          <div class="flex-grow-1 border-top" style="opacity: 0.1;"></div>
        </div>

        <div class="alert border-0 mb-4 p-4" style="border-radius: 0.75rem; background-color: #f0f7ff;">
          <div class="d-flex align-items-center">
            <i class="mdi mdi-hub h3 mr-4 text-primary mb-0"></i>
            <div class="small text-dark" style="line-height: 1.6;">
              The following platforms are part of our <strong>Verified Network</strong>. Users possessing identity
              credentials from these issuers can leverage <strong>Reusable Identity</strong> to bypass manual
              verification flows within your application, ensuring the highest level of trust and security.
            </div>
          </div>
        </div>

        <MarketplaceList :isSelection="false" />
      </b-col>
    </b-row>

  </b-container>
</template>
<script>
import MarketplaceList from '../../components/MarketplaceList.vue';

export default {
  name: 'ReusableIdentityParent',
  components: {
    MarketplaceList
  },
}
</script>

<style scoped>
/* Design Language Classes */
.input-label-caps {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #64748b;
}

.section-label {
  font-size: 0.9rem;
  font-weight: 800;
  color: #1f2937;
  padding-left: 4px;
}

.beta-badge {
  background: #fef3c7;
  color: #d97706;
  font-size: 0.65rem;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: 4px;
  letter-spacing: 1px;
}

.benefit-card {
  background: #ffffff;
  border: 1px solid #f1f5f9;
  padding: 1.25rem;
  border-radius: 0.75rem;
  height: 100%;
  transition: transform 0.2s ease;
}

.benefit-card:hover {
  transform: translateY(-4px);
  border-color: #3b82f6;
}

.icon-box {
  background: #eff6ff;
  padding: 12px;
  border-radius: 12px;
}

.flow-step {
  font-size: 10px;
  background: #f1f5f9;
  padding: 4px 8px;
  border-radius: 4px;
  color: #64748b;
}

.flow-step.active {
  background: #3b82f6;
  color: white;
  font-weight: bold;
}

.workflow-visual {
  background: #f8fafc;
  border-radius: 12px;
}
</style>