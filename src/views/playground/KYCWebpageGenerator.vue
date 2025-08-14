<style scoped>
.sticky-header {
  position: sticky;
  top: 0;
}

.container {
  width: 80vw;
}

.card-header {
  background: aliceblue;
  padding: 0px;
}

/* Status Badge Styles */
.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.status-active {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.status-expired {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.status-warning {
  background-color: #fff3cd;
  color: #856404;
  border: 1px solid #ffeaa7;
}

/* Link Display Styles */
.link-display {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  margin-bottom: 0;
  min-width: 280px;
}

.link-text {
  flex: 1;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  color: #495057;
  word-break: break-all;
}

.copy-btn {
  background: transparent;
  color: #667eea;
  border: none;
  padding: 4px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
  white-space: nowrap;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.copy-btn:hover {
  background: rgba(102, 126, 234, 0.1);
  color: #5a6fd8;
}

/* Warning Alert Styles */
.warning-alert {
  background-color: #fff3cd;
  border: 1px solid #ffeaa7;
  color: #856404;
  padding: 10px 12px;
  border-radius: 6px;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
}

.warning-alert i {
  color: #f39c12;
  font-size: 14px;
}

/* Form Controls - More Compact */
.form-group {
  margin-bottom: 12px;
}

.form-control {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 13px;
  height: 32px;
}

.form-control:focus {
  border-color: #667eea;
  outline: none;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.25);
}

textarea.form-control {
  height: auto;
  min-height: 50px;
  resize: vertical;
}

.form-check {
  margin-bottom: 6px;
  display: inline-block;
  margin-right: 20px;
}

.form-check-input {
  margin-right: 6px;
}

.form-check-label {
  font-size: 13px;
}

.mandatory {
  color: #dc3545;
}

/* Simple Expiry Selection */
.expiry-select {
  margin-top: 8px;
}

.expiry-select select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 13px;
  background: white;
  cursor: pointer;
}

.expiry-select select:focus {
  border-color: #667eea;
  outline: none;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.25);
}

/* Round Theme Options */
.theme-options {
  display: flex;
  gap: 15px;
  margin: 6px 0;
  flex-wrap: wrap;
}

.theme-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.3s;
  text-align: center;
}

.theme-option:hover {
  transform: translateY(-1px);
}

.theme-option.active .theme-preview {
  border: 3px solid #667eea;
  box-shadow: 0 3px 8px rgba(102, 126, 234, 0.3);
}

.theme-preview {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  border: 2px solid #ddd;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}

.theme-preview::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #667eea;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: none;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: bold;
}

.theme-option.active .theme-preview::after {
  display: flex;
}

.theme-option small {
  font-weight: 500;
  color: #2c3e50;
  font-size: 11px;
}

/* Theme Preview Styles */
.vibrant-theme {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.dark-theme {
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
}

.grey-theme {
  background: linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%);
}

.light-theme {
  background: linear-gradient(135deg, #ecf0f1 0%, #bdc3c7 100%);
}

/* Preview Theme Styles */
.preview-vibrant-theme .webpage-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.preview-vibrant-theme .webpage-content {
  background: white;
  color: #2c3e50;
}

.preview-vibrant-theme .webpage-title {
  color: #2c3e50;
}

.preview-vibrant-theme .webpage-description {
  color: #7f8c8d !important;
}

.preview-vibrant-theme .kyc-start-button {
  background: #667eea !important;
  color: white !important;
}

.preview-vibrant-theme .webpage-footer {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
}

.preview-dark-theme .webpage-header {
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  color: white;
}

.preview-dark-theme .webpage-content {
  background: white;
  color: #2c3e50;
}

.preview-dark-theme .webpage-title {
  color: #2c3e50;
}

.preview-dark-theme .webpage-description {
  color: #7f8c8d !important;
}

.preview-dark-theme .kyc-start-button {
  background: #2c3e50 !important;
  color: white !important;
}

.preview-dark-theme .webpage-footer {
  background: #2c3e50;
  color: white;
}

.preview-grey-theme .webpage-header {
  background: linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%);
  color: white;
}

.preview-grey-theme .webpage-content {
  background: white;
  color: #2c3e50;
}

.preview-grey-theme .webpage-title {
  color: #2c3e50;
}

.preview-grey-theme .webpage-description {
  color: #7f8c8d !important;
}

.preview-grey-theme .kyc-start-button {
  background: #95a5a6 !important;
  color: white !important;
}

.preview-grey-theme .webpage-footer {
  background: #95a5a6;
  color: white;
}

/* Full Width Preview Container */
.preview-container {
  border: none;
  border-radius: 0;
  overflow: hidden;
  margin-top: 0;
  width: 100%;
  max-width: none;
}

.webpage-preview {
  min-height: 250px;
}

.webpage-header {
  padding: 15px 20px;
  display: flex;
  align-items: center;
  gap: 15px;
}

.webpage-logo {
  width: 35px;
  height: 35px;
  border-radius: 6px;
  object-fit: cover;
}

.webpage-content {
  padding: 15px 20px;
  text-align: center;
}

.info-badge {
  background: #e3f2fd;
  border: 1px solid #bbdefb;
  border-radius: 6px;
  padding: 15px 18px;
  margin-bottom: 20px;
  color: #1976d2;
  font-size: 13px;
  line-height: 1.4;
  min-height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 300px;
  margin-left: auto;
  margin-right: auto;
}

.kyc-button-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.kyc-start-button {
  background: #667eea;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.kyc-start-button:hover {
  background: #5a6fd8;
  transform: translateY(-1px);
}

.webpage-footer {
  padding: 12px 20px;
  text-align: center;
  font-size: 11px;
  color: #6c757d;
}

/* Device Toggle */
.device-toggle {
  display: flex;
  gap: 8px;
  margin-bottom: 0;
}

.device-btn {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  padding: 6px 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 12px;
}

.device-btn.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.desktop-preview {
  width: 100%;
}

.mobile-preview {
  width: 100%;
  max-width: 320px;
  margin: 0 auto;
}

.mobile-preview .browser-frame {
  border-radius: 25px;
  overflow: hidden;
  border: 3px solid #333;
  background: #333;
}

.mobile-preview .browser-header {
  padding: 8px;
  border-radius: 22px 22px 0 0;
  background: #333;
  border-bottom: 1px solid #555;
}

.mobile-preview .browser-dots {
  display: none;
}

.mobile-preview .browser-url {
  background: #444;
  border: 1px solid #555;
  color: #ccc;
  font-size: 10px;
  padding: 3px 6px;
}

.mobile-preview .webpage-content {
  padding: 10px 15px;
}

.mobile-preview .info-badge {
  max-width: 280px;
  padding: 12px 15px;
  font-size: 12px;
  min-height: 45px;
}

.mobile-preview .kyc-start-button {
  padding: 8px 16px;
  font-size: 13px;
  min-height: 35px;
}

/* Header Section Styles */
.form-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 10px 20px;
  border-bottom: 1px solid #e9ecef;
  background-color: #f8f9fa;
}

.header-left {
  flex: 1;
}

.header-right {
  flex: 1;
  text-align: right;
}

.logo-status {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  flex-wrap: wrap;
}

.logo-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.company-logo {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  object-fit: cover;
}

.company-logo-placeholder {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 18px;
}

/* Status Badge outside Logo Container */
.status-badge {
  min-width: 20px;
  height: 20px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  padding: 0 6px;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  align-self: flex-start;
  margin-top: 8px;
}

.company-info h4 {
  margin: 0 0 3px 0;
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
}

.company-info p {
  margin: 0;
  font-size: 13px;
  color: #6c757d;
}

.url-section {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
}

.url-section h6 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #2c3e50;
}

/* Two Column Layout */
.form-layout {
  display: flex;
  gap: 30px;
  padding: 15px;
}

.form-column {
  flex: 1.2;
  max-width: 500px;
}

.preview-column {
  flex: 0.8;
  min-width: 0;
}

.preview-section {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 15px;
  height: fit-content;
  position: sticky;
  top: 20px;
}

.preview-section h6 {
  margin-bottom: 12px;
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
}

/* Preview Header with Device Toggle */
.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.preview-header h6 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
}

/* Browser Design for Preview */
.browser-frame {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  background: white;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.browser-header {
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.browser-dots {
  display: flex;
  gap: 4px;
}

.browser-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ddd;
}

.browser-dot.red { background: #ff5f57; }
.browser-dot.yellow { background: #ffbd2e; }
.browser-dot.green { background: #28ca42; }

.browser-url {
  flex: 1;
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 11px;
  color: #666;
  text-align: center;
  margin: 0 8px;
}

.browser-content {
  padding: 0;
}

/* Combined Expiry and Theme Section */
.expiry-theme-section {
  display: flex;
  gap: 25px;
  align-items: flex-start;
}

.expiry-section {
  flex: 1;
}

.theme-section {
  flex: 1;
}

/* Form Group Improvements */
.form-group label {
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 4px;
  display: block;
  color: #2c3e50;
}

/* List Group Improvements */
.list-group-item {
  padding: 10px 15px;
  border-bottom: 1px solid #f1f3f4;
}

.list-group-item:last-child {
  border-bottom: none;
}

/* Service Card Improvements */
.serviceCard {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  overflow: hidden;
}

/* Responsive Design */
@media (max-width: 768px) {
  .form-layout {
    flex-direction: column;
    gap: 20px;
  }
  
  .form-column {
    max-width: none;
  }
  
  .form-header {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }
  
  .header-right {
    text-align: center;
  }
  
  .logo-status {
    justify-content: center;
  }
}
</style>

<template>
  <div :class="isContainerShift ? 'homeShift' : 'home'">
    <load-ing :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></load-ing>

    <v-row>
      <v-col>
        <div class="form-group" style="display:flex">
          <h3 style="text-align: left;">
            KYC Webpage Configuration
          </h3>
        </div>
      </v-col>
      <v-col>
        <HfButtons name="Save Configuration" @executeAction="saveConfiguration()" v-if="!this.kycWebpageConfigTemp._id"
          style="float:right"></HfButtons>
        <HfButtons name="Update Configuration" @executeAction="updateConfiguration()" style="float:right" v-else>
        </HfButtons>
      </v-col>
    </v-row>

    <v-card class="serviceCard">
      <!-- Header Section with Logo, Status, Company Name, and URL -->
      <div class="form-header" v-if="kycWebpageConfigTemp._id">
        <div class="header-left">
          <div class="logo-status">
            <div class="logo-container">
              <img v-if="getSelectedService && getSelectedService.logoUrl" :src="getSelectedService.logoUrl" class="company-logo" alt="Logo">
              <div v-else class="company-logo-placeholder">
                <i class="fa fa-building"></i>
              </div>
            </div>
            <span class="status-badge" :class="getStatusClass()">
              {{ getStatusText() }}
            </span>
            <div class="company-info">
              <h4>{{ getSelectedService ? getSelectedService.appName : 'Your Business Name' }}</h4>
              <p>{{ kycWebpageConfigTemp.pageTitle || 'KYC Verification' }}</p>
            </div>
          </div>
        </div>
        <div class="header-right">
          <div class="url-section">
            <div class="link-display">
              <span class="link-text">{{ kycWebpageConfigTemp.generatedUrl || 'No URL generated' }}</span>
              <button class="copy-btn" @click="copyToClipboard" v-if="kycWebpageConfigTemp.generatedUrl" title="Copy URL">
                <i class="fa fa-copy"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Expiry Warning -->
      <div v-if="showExpiryWarning" class="warning-alert">
        <i class="fa fa-exclamation-triangle"></i>
        <span>This link will expire in {{ getDaysRemaining() }} days. Consider updating the expiry settings.</span>
      </div>

      <!-- Two Column Layout -->
      <div class="form-layout">
        <!-- Left Column - Form Fields -->
        <div class="form-column">
          <ul class="list-group list-group-flush">
            <!-- Page Title -->
            <li class="list-group-item">
              <div class="form-group">
                <label for="pageTitle">Page Title<span class="mandatory">*</span></label>
                <input type="text" class="form-control" v-model="kycWebpageConfigTemp.pageTitle" placeholder="KYC Verification" required>
              </div>
            </li>

            <!-- Contact Email -->
            <li class="list-group-item">
              <div class="form-group">
                <label for="contactEmail">Contact Email</label>
                <input type="email" class="form-control" v-model="kycWebpageConfigTemp.contactEmail" placeholder="support@yourbusiness.com">
              </div>
            </li>

            <!-- Page Description -->
            <li class="list-group-item">
              <div class="form-group">
                <label for="pageDescription">Page Description</label>
                <textarea class="form-control" v-model="kycWebpageConfigTemp.pageDescription" rows="2" placeholder="Complete your KYC verification to proceed"></textarea>
              </div>
            </li>

            <!-- Page Expiry and Theme Selection Combined -->
            <li class="list-group-item">
              <div class="expiry-theme-section">
                <!-- Page Expiry -->
                <div class="expiry-section">
                  <div class="form-group">
                    <label>Page Expiry<span class="mandatory">*</span></label>
                    <div class="expiry-select">
                      <select v-model="kycWebpageConfigTemp.expiryType">
                        <option value="1month">1 Month</option>
                        <option value="3months">3 Months</option>
                        <option value="6months">6 Months</option>
                        <option value="custom">Custom Date</option>
                      </select>
                    </div>
                    
                    <input v-if="kycWebpageConfigTemp.expiryType === 'custom'" type="date" class="form-control mt-2" v-model="kycWebpageConfigTemp.customExpiryDate" style="width: 180px;">
                  </div>
                </div>

                <!-- Choose Theme -->
                <div class="theme-section">
                  <div class="form-group">
                    <label>Choose Theme</label>
                    <div class="theme-options">
                      <div class="theme-option" :class="{ active: kycWebpageConfigTemp.selectedTheme === 'vibrant' }" @click="selectTheme('vibrant')">
                        <div class="theme-preview vibrant-theme"></div>
                        <small>Vibrant</small>
                      </div>
                      <div class="theme-option" :class="{ active: kycWebpageConfigTemp.selectedTheme === 'dark' }" @click="selectTheme('dark')">
                        <div class="theme-preview dark-theme"></div>
                        <small>Dark</small>
                      </div>
                      <div class="theme-option" :class="{ active: kycWebpageConfigTemp.selectedTheme === 'grey' }" @click="selectTheme('grey')">
                        <div class="theme-preview grey-theme"></div>
                        <small>Grey</small>
                      </div>
                      <div class="theme-option" :class="{ active: kycWebpageConfigTemp.selectedTheme === 'light' }" @click="selectTheme('light')">
                        <div class="theme-preview light-theme"></div>
                        <small>Light</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>

        <!-- Right Column - Live Preview -->
        <div class="preview-column">
          <div class="preview-section">
            <div class="preview-header">
              <h6>Live Preview</h6>
              <!-- Device Toggle -->
              <div class="device-toggle">
                <button 
                  class="device-btn" 
                  :class="{ active: previewMode === 'desktop' }"
                  @click="setPreviewMode('desktop')"
                  title="Desktop View"
                >
                  <i class="fa fa-desktop"></i>
                </button>
                <button 
                  class="device-btn" 
                  :class="{ active: previewMode === 'mobile' }"
                  @click="setPreviewMode('mobile')"
                  title="Mobile View"
                >
                  <i class="fa fa-mobile"></i>
                </button>
              </div>
            </div>
            
            <div class="browser-frame" :class="`${previewMode}-preview`">
              <div class="browser-header">
                <div class="browser-dots">
                  <span class="browser-dot red"></span>
                  <span class="browser-dot yellow"></span>
                  <span class="browser-dot green"></span>
                </div>
                <span class="browser-url">{{ kycWebpageConfigTemp.generatedUrl || 'No URL generated' }}</span>
              </div>
              <div class="browser-content">
                <div class="preview-container" :class="`preview-${kycWebpageConfigTemp.selectedTheme}-theme`">
                  <div class="webpage-preview">
                    <!-- Webpage Header -->
                    <div class="webpage-header">
                      <div style="display: flex; align-items: center; gap: 15px;">
                        <img v-if="getSelectedService && getSelectedService.logoUrl" :src="getSelectedService.logoUrl" class="webpage-logo" alt="Logo">
                        <div v-else class="webpage-logo" style="background: #ddd; display: flex; align-items: center; justify-content: center;">
                          <i class="fa fa-building" style="font-size: 18px; color: #666;"></i>
                        </div>
                        <div>
                          <h4 style="margin: 0; font-size: 16px;">{{ getSelectedService ? getSelectedService.appName : 'Your Business Name' }}</h4>
                          <p style="margin: 5px 0 0 0; font-size: 13px; opacity: 0.8;">{{ kycWebpageConfigTemp.pageTitle || 'KYC Verification' }}</p>
                        </div>
                      </div>
                    </div>

                    <!-- Webpage Content -->
                    <div class="webpage-content">
                      <!-- Info Badge for Description -->
                      <div v-if="kycWebpageConfigTemp.pageDescription" class="info-badge">
                        <i class="fa fa-info-circle"></i>
                        {{ kycWebpageConfigTemp.pageDescription }}
                      </div>
                      <div v-else class="info-badge">
                        <i class="fa fa-info-circle"></i>
                        Complete your KYC verification to proceed with our services.
                      </div>

                      <div class="kyc-button-container">
                        <button class="kyc-start-button">
                          <i class="fa fa-shield-alt"></i>
                          Start KYC Verification
                        </button>
                      </div>
                    </div>

                    <!-- Webpage Footer -->
                    <div class="webpage-footer">
                      <p v-if="kycWebpageConfigTemp.contactEmail" style="margin: 0 0 5px 0;">Contact: {{ kycWebpageConfigTemp.contactEmail }}</p>
                      <p style="margin: 0;">Powered by Hypersign</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script>
import UtilsMixin from '../../mixins/utils';
import { mapGetters, mapActions, mapMutations } from "vuex";
import HfButtons from '../../components/element/HfButtons.vue';

export default {
  name: "KYCWebpageGenerator",
  mixins: [UtilsMixin],
  components: {
    HfButtons
  },
  computed: {
    ...mapGetters('mainStore', ['getKYCWebpageConfig', 'getSelectedService']),
    isContainerShift() {
      return this.containerShift
    },
    showExpiryWarning() {
      if (!this.kycWebpageConfigTemp._id || !this.kycWebpageConfigTemp.expiryType) return false;
      
      const daysRemaining = this.getDaysRemaining();
      return daysRemaining > 0 && daysRemaining <= 7; // Show warning if expiring within 7 days
    }
  },

  async mounted() {
    try {
      this.isLoading = true
      await this.fetchKYCWebpageConfig()
      this.isLoading = false
    } catch (e) {
      this.isLoading = false
      console.log(e)
      if (e.message) {
        this.notifyErr(e.message)
      }
    }
  },

  data() {
    return {
      fullPage: true,
      isLoading: false,
      previewMode: "desktop",
      kycWebpageConfigTemp: {
        pageTitle: "KYC Verification",
        pageDescription: "",
        expiryType: "3months",
        customExpiryDate: "",
        selectedTheme: "vibrant",
        contactEmail: "",
        generatedUrl: "",
        uniqueId: "",
        status: "active"
      }
    }
  },

  methods: {
    ...mapActions('mainStore', ['fetchKYCWebpageConfig', 'createKYCWebpageConfig', 'deleteKYCWebpageConfig', 'updateKYCWebpageConfig']),
    ...mapMutations('mainStore', ['setKYCWebpageConfig']),
    
    setPreviewMode(mode) {
      this.previewMode = mode;
    },
    
    selectTheme(theme) {
      this.kycWebpageConfigTemp.selectedTheme = theme;
    },

    generateUniqueId() {
      return 'kyc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    },

    generateUrl() {
      if (!this.getSelectedService || !this.getSelectedService.appName) return "";
      const businessSlug = this.getSelectedService.appName.toLowerCase().replace(/[^a-z0-9]/g, '');
      this.kycWebpageConfigTemp.uniqueId = this.generateUniqueId();
      return `https://kyc.${businessSlug}.hypersign.id/${this.kycWebpageConfigTemp.uniqueId}`;
    },

    copyToClipboard() {
      navigator.clipboard.writeText(this.kycWebpageConfigTemp.generatedUrl).then(() => {
        this.notifySuccess('URL copied to clipboard!');
      });
    },

    getDaysRemaining() {
      if (!this.kycWebpageConfigTemp.expiryType) return 0;
      
      let expiry = new Date();
      
      switch(this.kycWebpageConfigTemp.expiryType) {
        case '1month':
          expiry.setMonth(expiry.getMonth() + 1);
          break;
        case '3months':
          expiry.setMonth(expiry.getMonth() + 3);
          break;
        case '6months':
          expiry.setMonth(expiry.getMonth() + 6);
          break;
        case 'custom':
          if (this.kycWebpageConfigTemp.customExpiryDate) {
            expiry = new Date(this.kycWebpageConfigTemp.customExpiryDate);
          }
          break;
      }
      
      const now = new Date();
      const diffTime = expiry - now;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 0;
    },

    getStatusText() {
      if (!this.kycWebpageConfigTemp._id) return 'Not Created';
      
      const daysRemaining = this.getDaysRemaining();
      if (daysRemaining === 0) return 'Expired';
      if (daysRemaining <= 7) return 'Expiring Soon';
      return 'Active';
    },

    getStatusClass() {
      if (!this.kycWebpageConfigTemp._id) return 'status-warning';
      
      const daysRemaining = this.getDaysRemaining();
      if (daysRemaining === 0) return 'status-expired';
      if (daysRemaining <= 7) return 'status-warning';
      return 'status-active';
    },

    validateField() {
      if (!this.kycWebpageConfigTemp.pageTitle) {
        throw new Error('Page title is required')
      }
      if (!this.kycWebpageConfigTemp.expiryType) {
        throw new Error('Please select an expiry period')
      }
      if (this.kycWebpageConfigTemp.expiryType === 'custom' && !this.kycWebpageConfigTemp.customExpiryDate) {
        throw new Error('Please select a custom expiry date')
      }
    },

    async saveConfiguration() {
      try {
        this.isLoading = true;
        this.validateField();
        
        const config = {
          pageTitle: this.kycWebpageConfigTemp.pageTitle,
          pageDescription: this.kycWebpageConfigTemp.pageDescription,
          expiryType: this.kycWebpageConfigTemp.expiryType,
          customExpiryDate: this.kycWebpageConfigTemp.customExpiryDate,
          selectedTheme: this.kycWebpageConfigTemp.selectedTheme,
          contactEmail: this.kycWebpageConfigTemp.contactEmail,
          generatedUrl: this.generateUrl(),
          uniqueId: this.kycWebpageConfigTemp.uniqueId,
          status: 'active'
        };

        await this.createKYCWebpageConfig(config);
        this.notifySuccess('KYC webpage configuration saved successfully!');
        await this.fetchKYCWebpageConfig();
        this.isLoading = false;
      } catch (e) {
        this.isLoading = false;
        this.notifyErr(e);
      }
    },

    async updateConfiguration() {
      try {
        this.isLoading = true;
        this.validateField();
        
        const config = {
          ...this.kycWebpageConfigTemp,
          updatedAt: new Date().toISOString()
        };

        await this.updateKYCWebpageConfig(config);
        this.notifySuccess('KYC webpage configuration updated successfully!');
        await this.fetchKYCWebpageConfig();
        this.isLoading = false;
      } catch (e) {
        this.isLoading = false;
        this.notifyErr(e);
      }
    }
  },

  watch: {
    getKYCWebpageConfig: {
      handler(newValue) {
        if (newValue && Object.keys(newValue).length > 0) {
          this.kycWebpageConfigTemp = { ...newValue };
        } else {
          // Reset to default values if no config exists
          this.kycWebpageConfigTemp = {
            pageTitle: "KYC Verification",
            pageDescription: "",
            expiryType: "3months",
            customExpiryDate: "",
            selectedTheme: "vibrant",
            contactEmail: "",
            generatedUrl: "",
            uniqueId: "",
            status: "active"
          };
        }
      },
      immediate: true
    }
  }
};
</script>
