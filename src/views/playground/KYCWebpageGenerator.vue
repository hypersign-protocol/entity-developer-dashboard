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




/* Modal styles */
.hf-modal .modal-content.hf-modal-content {
  border-radius: 12px;
  border: 1px solid #e9ecef;
}
.hf-modal-header {
  border-bottom: 1px solid #f1f3f4;
}
.hf-modal-title {
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 16px;
}
.confirm-body {
  padding: 8px 6px 0 6px;
}
.confirm-url {
  display: grid;
  grid-template-columns: 60px 1fr;
  align-items: center;
  gap: 8px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 8px 10px;
}
.confirm-url code {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 12px;
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 16px;
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

/* Inline expiry layout */
.expiry-inline {
  display: flex;
  align-items: center;
  gap: 10px;
}

.expiry-date-input {
  width: 180px;
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

.preview-vibrant-theme .kyc-start-button { color: #ffffff !important; }

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

.preview-dark-theme .kyc-start-button { background: #334155 !important; color: #ffffff !important; box-shadow: 0 10px 18px rgba(0,0,0,0.35); }

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

.preview-grey-theme .kyc-start-button { background: #7f8c8d !important; color: #ffffff !important; }

.preview-grey-theme .webpage-footer {
  background: #95a5a6;
  color: white;
}

.preview-light-theme .webpage-header {
  background: linear-gradient(135deg, #ecf0f1 0%, #bdc3c7 100%);
  color: #2c3e50;
}

.preview-light-theme .webpage-content {
  background: white;
  color: #2c3e50;
}

.preview-light-theme .webpage-title {
  color: #2c3e50;
}

.preview-light-theme .webpage-description {
  color: #7f8c8d !important;
}

.preview-light-theme .kyc-start-button { background: #e7ebff !important; color: #2c3e50 !important; border: 1px solid #c9d1ff; box-shadow: 0 10px 18px rgba(102, 126, 234, 0.18); }

.preview-light-theme .webpage-footer {
  background: rgba(236, 240, 241, 0.5);
  color: #2c3e50;
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

/* New consolidated preview layout */
.kyc-preview {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 24px 12px 16px;
}

.kyc-preview-card {
  width: 100%;
  max-width: 300px;
  background: #ffffff;
  border: 1px solid #eef1f4;
  border-radius: 12px;
  box-shadow: 0 16px 40px rgba(0,0,0,0.12);
  padding: 22px 24px;
  margin: 16px auto 0;
}

.preview-brand {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 8px;
}

.preview-logo {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
}

.brand-name {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: #1f2937;
}

.brand-subtitle {
  margin: 2px 0 0 0;
  font-size: 12px;
  color: #4b5563;
}

.preview-desc {
  margin: 12px 0 8px 0;
  color: #475569;
  font-size: 11px;
  line-height: 1.45;
}

.steps-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin: 12px 0 8px 0;
}

.step-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.step-icon {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(102, 126, 234, 0.12);
  color: #667eea;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
}

.step-title {
  font-weight: 700;
  font-size: 10px;
  color: #1f2937;
}

.step-sub {
  margin-top: 4px;
  font-size: 10px;
  color: #6b7280;
}

.contact-line {
  margin-top: 18px;
  font-size: 10px;
  color: #374151;
}

.powered-by {
  margin-top: 16px;
  font-size: 12px;
  color: #6c757d;
  text-align: center;
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
  background: linear-gradient(180deg, #6f66f2 0%, #5a47d8 100%);
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 10px;
  font-size: 10px;
  cursor: pointer;
  transition: all 0.3s;
  min-height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  box-shadow: 0 10px 18px rgba(102, 126, 234, 0.35);
}

.kyc-start-button:hover {
  filter: brightness(1.03);
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

/* Constrain desktop preview frame width and center it */
.desktop-preview .browser-frame,
.browser-frame.desktop-preview {
  max-width: 1040px;
  margin: 0 auto;
}

.mobile-preview {
  width: 100%;
  max-width: 320px;
  margin: 0 auto;
}

.mobile-preview .browser-frame,
.browser-frame.mobile-preview {
  border-radius: 25px;
  overflow: hidden;
  border: 3px solid #333;
  background: #333;
  height: 620px;
  max-width: 360px;
  margin: 0 auto;
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

/* Theme variants for new preview layout */
.preview-vibrant-theme .brand-name { color: #1f2937; }
.preview-vibrant-theme .brand-subtitle { color: #4b5563; }
.preview-vibrant-theme .step-icon { background: rgba(102,126,234,0.12); color: #667eea; }
.preview-vibrant-theme .kyc-preview {
  background: linear-gradient(180deg, rgba(102,126,234,0.08) 0%, rgba(118,75,162,0.05) 100%);
}
.preview-vibrant-theme .powered-by { color: #667eea; opacity: 0.9; }

.preview-dark-theme .kyc-preview { background: #0f172a; }
.preview-dark-theme .kyc-preview-card { background: #1f2937; border-color: rgba(255,255,255,0.06); }
.preview-dark-theme .brand-name { color: #e5e7eb; }
.preview-dark-theme .brand-subtitle { color: #cbd5e1; }
.preview-dark-theme .preview-desc { color: #cbd5e1; }
.preview-dark-theme .step-title { color: #e5e7eb; }
.preview-dark-theme .step-sub { color: #cbd5e1; }
.preview-dark-theme .step-icon { background: rgba(255,255,255,0.08); color: #cbd5e1; }
.preview-dark-theme .powered-by { color: #cbd5e1; opacity: 0.75; }

.preview-grey-theme .kyc-preview { background: linear-gradient(180deg, rgba(127,140,141,0.08) 0%, rgba(189,195,199,0.06) 100%); }
.preview-grey-theme .step-icon { background: rgba(127,140,141,0.15); color: #7f8c8d; }
.preview-grey-theme .powered-by { color: #7f8c8d; }

.preview-light-theme .kyc-preview { background: #f5f7fb; }
.preview-light-theme .step-icon { background: rgba(189,195,199,0.25); color: #2c3e50; }
.preview-light-theme .brand-name { color: #2c3e50; }
.preview-light-theme .brand-subtitle { color: #7f8c8d; }
.preview-light-theme .powered-by { color: #2c3e50; opacity: 0.8; }

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
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-end;
  gap: 6px;
}

.url-section h6 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #2c3e50;
}

.url-section .status-badge {
  align-self: flex-end;
  margin-top: 4px;
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
  height: 70vh;
  position: sticky;
  top: 20px;
  overflow: auto;
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
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  overflow: hidden;
  background: #ffffff;
  box-shadow: 0 14px 40px rgba(0,0,0,0.12);
}

.browser-header {
  background: #f8f9fb;
  border-bottom: 1px solid #eef1f4;
  padding: 10px 14px;
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
  background: #ffffff;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 6px 10px;
  font-size: 12px;
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
  border-bottom: none;
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

/* Tablet-friendly stacking and preview visibility */
@media (max-width: 1024px) {
  .form-layout {
    flex-direction: column;
  }
  .preview-column {
    width: 100%;
  }
  .preview-section {
    position: static;
    top: auto;
    height: auto;
    max-height: 70vh;
    overflow: auto;
  }
  .desktop-preview .browser-frame {
    max-width: 100%;
  }
}

/* Small mobile tweaks for card scale and spacing */
@media (max-width: 600px) {
  .browser-content {
    padding: 10px;
  }
  .kyc-preview {
    padding: 16px 8px 12px;
  }
  .kyc-preview-card {
    max-width: 300px;
    padding: 18px 20px;
  }
  .preview-logo {
    width: 30px;
    height: 30px;
  }
  .brand-name {
    font-size: 14px;
  }
  .brand-subtitle {
    font-size: 11px;
  }
  .preview-desc {
    font-size: 10px;
  }
  .step-icon {
    width: 26px;
    height: 26px;
    font-size: 10px;
  }
  .step-title {
    font-size: 10px;
  }
  .step-sub {
    font-size: 9.5px;
  }
  .kyc-start-button {
    padding: 9px 16px;
    font-size: 10.5px;
    min-height: 34px;
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
            KYC Verifier Configuration
          </h3>
        </div>
      </v-col>
      <v-col>
        <HfButtons name="Save Configuration" @executeAction="saveConfiguration()" v-if="!this.kycWebpageConfigTemp._id"
          style="float:right"></HfButtons>
        <div v-else>
          <b-button variant="link" class="danger" @click="openDeleteModal()" style="float:right;"
            title="Delete Configuration"><i class="fa fa-trash"></i></b-button>
          <HfButtons name="Update Configuration" @executeAction="updateConfiguration()" style="float:right" class="mx-1">
          </HfButtons>
        </div>
      </v-col>
    </v-row>

    <v-card class="serviceCard">
      <!-- Header Section with Logo, Status, Company Name, and URL -->
      <div class="form-header">
        <div class="header-left">
          <div class="logo-status">
            <div class="logo-container">
              <img v-if="getSelectedService && getSelectedService.logoUrl" :src="getSelectedService.logoUrl" class="company-logo" alt="Logo">
              <div v-else class="company-logo-placeholder">
                <i class="fa fa-building"></i>
              </div>
            </div>
            <div class="company-info">
              <h4>{{ getSelectedService ? getSelectedService.appName : 'Your Business Name' }}</h4>
              <p>{{ kycWebpageConfigTemp.pageTitle || 'KYC Verification' }}</p>
            </div>
          </div>
        </div>
        <div class="header-right">
          <div class="url-section">
            <div class="link-display" v-if="kycWebpageConfigTemp._id">
              <span class="link-text">{{ kycWebpageConfigTemp.generatedUrl || 'No URL generated' }}</span>
              <button class="copy-btn" @click="copyToClipboard" v-if="kycWebpageConfigTemp.generatedUrl" title="Copy URL">
                <i class="fa fa-copy"></i>
              </button>
            </div>
            <div class="link-display" v-else>
              <span class="link-text">URL will be generated after saving</span>
            </div>
            <span class="status-badge" :class="getStatusClass()">
              {{ getStatusText() }}
            </span>
          </div>
        </div>
      </div>

      <!-- Delete confirmation modal -->
      <b-modal
        v-model="showDeleteModal"
        hide-footer
        centered
        size="md"
        dialog-class="hf-modal"
        content-class="hf-modal-content"
        header-class="hf-modal-header"
      >
        <template #modal-title>
          <div class="hf-modal-title">
            <i class="fa fa-exclamation-triangle" style="color:#dc3545;margin-right:8px;"></i>
            Delete Verifier Page?
          </div>
        </template>
        <div class="confirm-body">
          <p class="mb-2">You're about to remove this verifier page configuration.</p>
          <div class="confirm-url" v-if="kycWebpageConfigTemp.generatedUrl">
            <span>URL</span>
            <code>{{ kycWebpageConfigTemp.generatedUrl }}</code>
          </div>
          <div class="confirm-url" v-else>
            <span>URL</span>
            <code>Not generated yet</code>
          </div>
          <p class="mt-2" style="color:#6b7280;">This action cannot be undone.</p>
        </div>
        <div class="modal-actions">
          <b-button variant="outline-secondary" @click="showDeleteModal=false">Cancel</b-button>
          <b-button variant="danger" @click="confirmDelete"><i class="fa fa-trash mr-1"></i>Delete</b-button>
        </div>
      </b-modal>

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
                <label for="pageTitle">Page Sub-Heading<span class="mandatory">*</span></label>
                <input type="text" class="form-control" v-model="kycWebpageConfigTemp.pageTitle" placeholder="KYC Verification" required>
              </div>
            </li>
            <!-- Page Description -->
            <li class="list-group-item">
              <div class="form-group">
                <label for="pageDescription">Page Description</label>
                <textarea class="form-control" v-model="kycWebpageConfigTemp.pageDescription" rows="2" placeholder="Complete your KYC verification to proceed"></textarea>
              </div>
            </li>


            <!-- Contact Email -->
            <li class="list-group-item">
              <div class="form-group">
                <label for="contactEmail">Admin Contact Email</label>
                <input type="email" class="form-control" v-model="kycWebpageConfigTemp.contactEmail" placeholder="support@yourbusiness.com">
              </div>
            </li>


            <!-- Page Expiry and Theme Selection (Theme below, custom date inline) -->
            <li class="list-group-item">
              <!-- Page Expiry -->
              <div class="form-group">
                <label>Page Expiry<span class="mandatory">*</span></label>
                <div class="expiry-inline">
                  <div class="expiry-select">
                    <select v-model="kycWebpageConfigTemp.expiryType">
                      <option value="1month">1 Month</option>
                      <option value="3months">3 Months</option>
                      <option value="6months">6 Months</option>
                      <option value="custom">Custom Date</option>
                    </select>
                  </div>
                  <input v-if="kycWebpageConfigTemp.expiryType === 'custom'" type="date" class="form-control expiry-date-input" v-model="kycWebpageConfigTemp.customExpiryDate">
                </div>
              </div>

              <!-- Choose Theme (below expiry) -->
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
                  <div class="kyc-preview">
                    <div class="kyc-preview-card">
                      <div class="preview-brand">
                        <img v-if="getSelectedService && getSelectedService.logoUrl" :src="getSelectedService.logoUrl" class="preview-logo" alt="Logo">
                        <div v-else class="preview-logo" style="background: #ddd; display: flex; align-items: center; justify-content: center;">
                          <i class="fa fa-building" style="font-size: 18px; color: #666;"></i>
                        </div>
                        <div>
                          <h3 class="brand-name">{{ getSelectedService ? getSelectedService.appName : 'Your Business Name' }}</h3>
                          <div class="brand-subtitle">{{ kycWebpageConfigTemp.pageTitle || 'Identity Verification Platform' }}</div>
                        </div>
                      </div>

                      <div class="preview-desc">
                        <span v-if="kycWebpageConfigTemp.pageDescription">{{ kycWebpageConfigTemp.pageDescription }}</span>
                        <span v-else>Complete your KYC verification to proceed with our services.</span>
                      </div>

                      <div class="steps-list">
                        <div class="step-item">
                          <div class="step-icon"><i class="fa fa-camera"></i></div>
                          <div>
                            <div class="step-title">Take Selfie</div>
                            <div class="step-sub">Capture a clear photo of yourself.</div>
                          </div>
                        </div>
                        <div class="step-item">
                          <div class="step-icon"><i class="fa fa-id-card"></i></div>
                          <div>
                            <div class="step-title">Verify ID Document</div>
                            <div class="step-sub">Upload your ID for verification.</div>
                          </div>
                        </div>
                        <div class="step-item">
                          <div class="step-icon"><i class="fa fa-check-square"></i></div>
                          <div>
                            <div class="step-title">Provide Consent</div>
                            <div class="step-sub">Agree to securely share your information.</div>
                          </div>
                        </div>
                      </div>

                      <div class="kyc-button-container">
                        <button class="kyc-start-button">
                          <i class="fa fa-shield-alt"></i>
                          Start KYC Verification
                        </button>
                      </div>

                      <div class="contact-line" v-if="kycWebpageConfigTemp.contactEmail">
                        Contact: {{ kycWebpageConfigTemp.contactEmail }}
                      </div>
                    </div>

                    <div class="powered-by">Powered by Hypersign</div>
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
      if (e.message) {
        if (e.message?.includes('No webpage configuration found for serviceId')){
          this.notifyWarn(e.message)
        } else {
          this.notifyErr(e.message)
        }
        
      }
    }
  },

  data() {
    return {
      fullPage: true,
      isLoading: false,
      previewMode: "desktop",
      showDeleteModal: false,
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

    openDeleteModal() {
      this.showDeleteModal = true;
    },

    async confirmDelete() {
      await this.deleteConfiguration();
    },

    generateUniqueId() {
      return 'kyc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    },

    generateUrl() {
      if (!this.getSelectedService || !this.getSelectedService.appId) return "";
      this.kycWebpageConfigTemp.uniqueId = this.generateUniqueId();
      // Use account-level domain for KYC webpage URLs
      return `https://kyc.hypersign.id/${this.getSelectedService.appId}/${this.kycWebpageConfigTemp.uniqueId}`;
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
          themeColor: this.kycWebpageConfigTemp.selectedTheme,
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
        this.notifyErr(e.message);
      }
    },

    async updateConfiguration() {
      try {
        this.isLoading = true;
        this.validateField();
        
        const config = {
          ...this.kycWebpageConfigTemp,
          themeColor: this.kycWebpageConfigTemp.selectedTheme, // Map selectedTheme to themeColor
          updatedAt: new Date().toISOString()
        };

        await this.updateKYCWebpageConfig(config);
        this.notifySuccess('KYC webpage configuration updated successfully!');
        await this.fetchKYCWebpageConfig();
        this.isLoading = false;
      } catch (e) {
        this.isLoading = false;
        this.notifyErr(e.message);
      }
    },

    async deleteConfiguration() {
      try {
        if (!this.kycWebpageConfigTemp || !this.kycWebpageConfigTemp._id) {
          return this.notifyErr('No configuration to delete');
        }
        this.isLoading = true;
        await this.deleteKYCWebpageConfig({ _id: this.kycWebpageConfigTemp._id });
        this.showDeleteModal = false;
        this.notifySuccess('KYC webpage configuration deleted successfully!');
        await this.fetchKYCWebpageConfig();
        this.isLoading = false;
      } catch (e) {
        this.isLoading = false;
        this.notifyErr(e.message);
      }
    }
  },

  watch: {
    getKYCWebpageConfig: {
      handler(newValue) {
        if (newValue && Object.keys(newValue).length > 0) {
          // Map backend fields to frontend fields
          this.kycWebpageConfigTemp = {
            ...newValue,
            selectedTheme: newValue.themeColor || "vibrant" // Map themeColor to selectedTheme
          };
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
