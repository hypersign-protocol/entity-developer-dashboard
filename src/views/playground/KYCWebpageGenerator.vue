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

.preview-container {
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
  background: #f9f9f9;
  min-height: 500px;
  position: relative;
}

.preview-container::before {
  content: "Live Preview";
  position: absolute;
  top: -10px;
  left: 20px;
  background: #667eea;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

/* Realistic Webpage Preview */
.webpage-preview {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  min-height: 400px;
  position: relative;
}

.webpage-header {
  padding: 20px 30px;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.webpage-logo {
  width: 40px;
  height: 40px;
  object-fit: contain;
  border-radius: 6px;
}

 .webpage-content {
   padding: 30px 20px;
   text-align: center;
 }

.webpage-title {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 15px;
}

.webpage-description {
  font-size: 16px;
  color: #666;
  margin-bottom: 40px;
  line-height: 1.6;
}

 .kyc-button-container {
   display: flex;
   justify-content: center;
   align-items: center;
   margin: 25px 0;
 }

   .kyc-start-button {
    padding: 12px 24px;
    font-size: 14px;
    font-weight: 600;
    border-radius: 6px;
    border: none;
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 200px;
    max-width: 240px;
    justify-content: center;
    white-space: nowrap;
  }

.kyc-start-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

   .kyc-start-button i {
    font-size: 14px;
  }

.webpage-footer {
  padding: 20px 30px;
  background: #f8f9fa;
  border-top: 1px solid #eee;
  text-align: center;
  color: #666;
  font-size: 14px;
}

/* Theme Options */
.theme-options {
  display: flex;
  gap: 15px;
  margin: 10px 0;
  flex-wrap: wrap;
}

.theme-option {
  padding: 12px 16px;
  border: 2px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  background: white;
  text-align: center;
  min-width: 100px;
}

.theme-option:hover {
  border-color: #667eea;
  transform: translateY(-1px);
}

.theme-option.active {
  border-color: #667eea;
  background: rgba(102, 126, 234, 0.1);
}

.theme-preview {
  width: 40px;
  height: 30px;
  border-radius: 6px;
  margin: 0 auto 8px;
  position: relative;
  overflow: hidden;
}

.theme-option small {
  font-weight: 500;
  color: #2c3e50;
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

.preview-light-theme .kyc-start-button {
  background: #3498db !important;
  color: white !important;
}

.preview-light-theme .webpage-footer {
  background: #ecf0f1;
  color: #2c3e50;
}

.url-display {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 10px;
  font-family: monospace;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.copy-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
}

 .copy-btn:hover {
   background: #0056b3;
 }
 
   /* Info Badge Styles */
  .info-badge {
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 6px;
    padding: 12px 16px;
    margin: 20px 0;
    text-align: center;
    color: #6c757d;
    font-size: 13px;
    line-height: 1.4;
    max-width: 240px;
    margin-left: auto;
    margin-right: auto;
  }
 
 .info-badge i {
   color: #17a2b8;
   margin-right: 6px;
   font-size: 12px;
 }
 
   /* Device Toggle Styles */
  .device-toggle {
    display: flex;
    justify-content: center;
    margin-bottom: 15px;
    background: #f8f9fa;
    border-radius: 8px;
    padding: 4px;
    width: fit-content;
    margin-left: auto;
    margin-right: auto;
  }
  
  .device-btn {
    padding: 8px 12px;
    border: none;
    background: transparent;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #6c757d;
  }
  
  .device-btn:hover {
    background: rgba(102, 126, 234, 0.1);
    color: #667eea;
  }
  
  .device-btn.active {
    background: #667eea;
    color: white;
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  }
  
  .device-btn i {
    font-size: 16px;
  }
 
   /* Mobile Preview Styles */
  .mobile-preview .webpage-preview {
    max-width: 280px;
    margin: 0 auto;
    border-radius: 25px;
    box-shadow: 0 0 0 6px #1a1a1a, 0 0 0 10px #333, 0 15px 30px rgba(0, 0, 0, 0.3);
    position: relative;
    overflow: hidden;
    aspect-ratio: 9/16;
    min-height: 500px;
  }
  
  .mobile-preview .webpage-preview::before {
    content: '';
    position: absolute;
    top: 8px;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 3px;
    background: #333;
    border-radius: 2px;
    z-index: 10;
  }
 
   .mobile-preview .webpage-header {
    padding: 10px 12px;
    min-height: 50px;
  }
  
  .mobile-preview .webpage-logo {
    width: 24px;
    height: 24px;
  }
  
  .mobile-preview .webpage-content {
    padding: 12px 10px;
    min-height: 350px;
  }
 
   .mobile-preview .info-badge {
    max-width: 160px;
    padding: 6px 8px;
    font-size: 10px;
    margin: 10px auto;
    line-height: 1.2;
    text-align: center;
  }
  
  .mobile-preview .kyc-start-button {
    min-width: 120px;
    max-width: 160px;
    padding: 6px 12px;
    font-size: 11px;
    border-radius: 6px;
  }
  
  .mobile-preview .kyc-start-button i {
    font-size: 10px;
  }
  
  .mobile-preview .webpage-footer {
    padding: 8px 12px;
    font-size: 10px;
    min-height: 40px;
  }
 
   /* Desktop Preview Styles */
  .desktop-preview .webpage-preview {
    max-width: 100%;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }
  
  /* Mobile-specific text adjustments */
  .mobile-preview .webpage-header h4 {
    font-size: 14px !important;
    margin: 0 !important;
  }
  
  .mobile-preview .webpage-header p {
    font-size: 10px !important;
    margin: 2px 0 0 0 !important;
  }
</style>

<template>
  <div :class="isContainerShift ? 'homeShift' : 'home'">
    <load-ing :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></load-ing>

    <div class="row">
      <div class="col-6" style="text-align: left">
        <div class="form-group" style="display:flex">
          <h3 style="text-align: left;">
            KYC Webpage Generator
          </h3>
        </div>
      </div>
      <div class="col-6">
        <HfButtons name="Generate Webpage" @executeAction="generateWebpage()" v-if="!this.getKYCWebpageConfig._id"
          style="float:right"></HfButtons>
        <div v-else>
          <b-button variant="link" class="danger" @click="deleteWebpage()" style="float:right;"
            title="Delete Webpage"><i class="fa fa-trash"></i></b-button>
          <HfButtons name="Update Webpage" @executeAction="updateWebpage()" style="float:right"
            class="mx-1">
          </HfButtons>
        </div>
      </div>
    </div>

    <div class="row">
      <!-- Configuration Form -->
      <div class="col-md-6">
        <v-card class="serviceCard p-3">
          <form>
            <!-- Page Title -->
            <div class="form-group">
              <label for="pageTitle">Page Title<span class="mandatory">*</span></label>
              <input type="text" class="form-control" v-model="pageTitle" placeholder="KYC Verification" required>
            </div>

            <!-- Page Description -->
            <div class="form-group">
              <label for="pageDescription">Page Description</label>
              <textarea class="form-control" v-model="pageDescription" rows="3" placeholder="Complete your KYC verification to proceed"></textarea>
            </div>

            <!-- Expiry Selection -->
            <div class="form-group">
              <label>Page Expiry<span class="mandatory">*</span></label>
              <div class="form-check">
                <input class="form-check-input" type="radio" v-model="expiryType" value="1month" id="expiry1month">
                <label class="form-check-label" for="expiry1month">1 Month</label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="radio" v-model="expiryType" value="3months" id="expiry3months">
                <label class="form-check-label" for="expiry3months">3 Months</label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="radio" v-model="expiryType" value="6months" id="expiry6months">
                <label class="form-check-label" for="expiry6months">6 Months</label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="radio" v-model="expiryType" value="custom" id="expiryCustom">
                <label class="form-check-label" for="expiryCustom">Custom Date</label>
              </div>
              
              <input v-if="expiryType === 'custom'" type="date" class="form-control mt-2" v-model="customExpiryDate">
            </div>

            <!-- Predefined Themes -->
            <div class="form-group">
              <label>Choose Theme</label>
              <div class="theme-options">
                <div class="theme-option" :class="{ active: selectedTheme === 'vibrant' }" @click="selectTheme('vibrant')">
                  <div class="theme-preview vibrant-theme"></div>
                  <small>Vibrant</small>
                </div>
                <div class="theme-option" :class="{ active: selectedTheme === 'dark' }" @click="selectTheme('dark')">
                  <div class="theme-preview dark-theme"></div>
                  <small>Dark</small>
                </div>
                <div class="theme-option" :class="{ active: selectedTheme === 'grey' }" @click="selectTheme('grey')">
                  <div class="theme-preview grey-theme"></div>
                  <small>Grey</small>
                </div>
                <div class="theme-option" :class="{ active: selectedTheme === 'light' }" @click="selectTheme('light')">
                  <div class="theme-preview light-theme"></div>
                  <small>Light</small>
                </div>
              </div>
            </div>

            <!-- Contact Information -->
            <div class="form-group">
              <label for="contactEmail">Contact Email</label>
              <input type="email" class="form-control" v-model="contactEmail" placeholder="support@yourbusiness.com">
            </div>

            <!-- Generated URL Display -->
            <div v-if="generatedUrl" class="form-group">
              <label>Generated URL</label>
              <div class="url-display">
                <span>{{ generatedUrl }}</span>
                <button class="copy-btn" @click="copyToClipboard">Copy</button>
              </div>
            </div>

            <!-- Expiry Date Display -->
            <div v-if="expiryDate" class="form-group">
              <label>Expiry Date</label>
              <div class="alert alert-info">
                {{ expiryDate }} ({{ getDaysRemaining() }} days remaining)
              </div>
            </div>
          </form>
        </v-card>
      </div>

             <!-- Live Preview -->
       <div class="col-md-6">
         <v-card class="serviceCard p-3">
           <h5>Live Preview</h5>
           
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
           
           <div class="preview-container" :class="[`preview-${selectedTheme}-theme`, `${previewMode}-preview`]">
            <div class="webpage-preview">
              <!-- Webpage Header -->
              <div class="webpage-header">
                <div style="display: flex; align-items: center; gap: 15px;">
                  <img v-if="getSelectedService && getSelectedService.logoUrl" :src="getSelectedService.logoUrl" class="webpage-logo" alt="Logo">
                  <div v-else class="webpage-logo" style="background: #ddd; display: flex; align-items: center; justify-content: center;">
                    <i class="fa fa-building" style="font-size: 20px; color: #666;"></i>
                  </div>
                  <div>
                    <h4 style="margin: 0; font-size: 18px;">{{ getSelectedService ? getSelectedService.appName : 'Your Business Name' }}</h4>
                    <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.8;">{{ pageTitle || 'KYC Verification' }}</p>
                  </div>
                </div>
              </div>

                             <!-- Webpage Content -->
               <div class="webpage-content">
                 <!-- Info Badge for Description -->
                 <div v-if="pageDescription" class="info-badge">
                   <i class="fa fa-info-circle"></i>
                   {{ pageDescription }}
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
                <p v-if="contactEmail" style="margin: 0 0 5px 0;">Contact: {{ contactEmail }}</p>
                <p style="margin: 0;">Powered by Hypersign</p>
              </div>
            </div>
          </div>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script>
import UtilsMixin from '../../mixins/utils';
import { mapGetters, mapActions } from "vuex";
import HfButtons from '../../components/element/HfButtons.vue';

export default {
  name: "KYCWebpageGenerator",
  mixins: [UtilsMixin],
  components: {
    HfButtons,
  },
  computed: {
    ...mapGetters('mainStore', ['getKYCWebpageConfig', 'getSelectedService']),
    isContainerShift() {
      return this.containerShift
    },
    expiryDate() {
      if (!this.expiryType) return null;
      
      let expiry = new Date();
      
      switch(this.expiryType) {
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
          if (this.customExpiryDate) {
            expiry = new Date(this.customExpiryDate);
          }
          break;
      }
      
      return expiry.toLocaleDateString();
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
    this.formatConfig()
  },

     data() {
     return {
       fullPage: true,
       isLoading: false,
       pageTitle: "KYC Verification",
       pageDescription: "",
       expiryType: "3months",
       customExpiryDate: "",
       selectedTheme: "vibrant",
       contactEmail: "",
       generatedUrl: "",
       uniqueId: "",
       previewMode: "desktop"
     }
   },

     methods: {
     ...mapActions('mainStore', ['fetchKYCWebpageConfig', 'createKYCWebpageConfig', 'deleteKYCWebpageConfig', 'updateKYCWebpageConfig']),
     
     setPreviewMode(mode) {
       this.previewMode = mode;
     },
     
     selectTheme(theme) {
       this.selectedTheme = theme;
     },

    generateUniqueId() {
      return 'kyc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    },

    generateUrl() {
      if (!this.getSelectedService || !this.getSelectedService.appName) return "";
      const businessSlug = this.getSelectedService.appName.toLowerCase().replace(/[^a-z0-9]/g, '');
      this.uniqueId = this.generateUniqueId();
      return `https://kyc.${businessSlug}.hypersign.id/${this.uniqueId}`;
    },

    copyToClipboard() {
      navigator.clipboard.writeText(this.generatedUrl).then(() => {
        this.notifySuccess('URL copied to clipboard!');
      });
    },

    getDaysRemaining() {
      if (!this.expiryDate) return 0;
      const expiry = new Date(this.expiryDate);
      const now = new Date();
      const diffTime = expiry - now;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 0;
    },

    formatConfig() {
      if (this.getKYCWebpageConfig && Object.keys(this.getKYCWebpageConfig).length > 0) {
        this.pageTitle = this.getKYCWebpageConfig.pageTitle || "KYC Verification";
        this.pageDescription = this.getKYCWebpageConfig.pageDescription || "";
        this.expiryType = this.getKYCWebpageConfig.expiryType || "3months";
        this.customExpiryDate = this.getKYCWebpageConfig.customExpiryDate || "";
        this.selectedTheme = this.getKYCWebpageConfig.selectedTheme || "vibrant";
        this.contactEmail = this.getKYCWebpageConfig.contactEmail || "";
        this.generatedUrl = this.getKYCWebpageConfig.generatedUrl || "";
        this.uniqueId = this.getKYCWebpageConfig.uniqueId || "";
      }
    },

    validateField() {
      if (!this.pageTitle) {
        throw new Error('Page title is required')
      }
      if (!this.expiryType) {
        throw new Error('Please select an expiry period')
      }
      if (this.expiryType === 'custom' && !this.customExpiryDate) {
        throw new Error('Please select a custom expiry date')
      }
    },

    async generateWebpage() {
      try {
        this.isLoading = true;
        this.validateField();
        
        const config = {
          pageTitle: this.pageTitle,
          pageDescription: this.pageDescription,
          expiryType: this.expiryType,
          customExpiryDate: this.customExpiryDate,
          selectedTheme: this.selectedTheme,
          contactEmail: this.contactEmail,
          generatedUrl: this.generateUrl(),
          uniqueId: this.uniqueId
        };

        await this.createKYCWebpageConfig(config);
        this.formatConfig();
        this.isLoading = false;
        this.notifySuccess('KYC webpage generated successfully!');
      } catch (e) {
        this.isLoading = false;
        this.notifyErr(e);
      }
    },

    async updateWebpage() {
      try {
        this.isLoading = true;
        this.validateField();
        
        const config = {
          _id: this.getKYCWebpageConfig._id,
          pageTitle: this.pageTitle,
          pageDescription: this.pageDescription,
          expiryType: this.expiryType,
          customExpiryDate: this.customExpiryDate,
          selectedTheme: this.selectedTheme,
          contactEmail: this.contactEmail,
          generatedUrl: this.generatedUrl,
          uniqueId: this.uniqueId
        };

        await this.updateKYCWebpageConfig(config);
        this.formatConfig();
        this.isLoading = false;
        this.notifySuccess('KYC webpage updated successfully!');
      } catch (e) {
        this.isLoading = false;
        this.notifyErr(e);
      }
    },

    clearAll() {
      this.pageTitle = "KYC Verification";
      this.pageDescription = "";
      this.expiryType = "3months";
      this.customExpiryDate = "";
      this.selectedTheme = "vibrant";
      this.contactEmail = "";
      this.generatedUrl = "";
      this.uniqueId = "";
    },

    async deleteWebpage() {
      try {
        this.isLoading = true;
        await this.deleteKYCWebpageConfig({
          _id: this.getKYCWebpageConfig._id,
        });
        this.clearAll();
        this.isLoading = false;
        this.notifySuccess('KYC webpage deleted successfully!');
      } catch (e) {
        this.isLoading = false;
        this.notifyErr(e);
      }
    }
  }
};
</script>
