<style scoped>

.sticky-header {
  position: sticky;
  top: 0;
}

.container {
  width: 80vw;
}

.editor-header {
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: 18px;
}

.back-link {
  color: #64748b;
  cursor: pointer;
  display: inline-block;
  font-size: 12px;
  margin-bottom: 10px;
}

.configuration-tabs {
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  gap: 28px;
  margin: 0;
  overflow-x: auto;
  padding: 0 18px;
}

.configuration-tab {
  background: transparent;
  border: 0;
  border-bottom: 2px solid transparent;
  color: #64748b;
  cursor: pointer;
  font-size: 13px;
  padding: 14px 2px 12px;
  white-space: nowrap;
}

.configuration-tab.active {
  border-bottom-color: #2563eb;
  color: #2563eb;
  font-weight: 600;
}

.basic-section {
  padding: 20px;
}

.basic-form {
  max-width: 760px;
}

.basic-field + .basic-field {
  margin-top: 16px;
}

.basic-field label {
  display: block;
  margin-bottom: 6px;
}

.basic-field textarea {
  resize: vertical;
}

.UI--c-kbgiPT-iehgGlf-css {
  background-color: #9cb5f9;
}

.step-notStarted {
  background-color: #afb8cc;
}

.step-finished {
  background-color: #9cb5f9;
}


.UI--c-dhzjXW-iexswVt-css {
  align-items: center;
  justify-content: center;
}

.UI--c-kbgiPT-bUORwj-isFirst-true {
  padding: 0px 0.4rem 0px 0px;
  clip-path: polygon(75% 0%, 100% 50%, 75% 100%, 0% 100%, 0% 100%, 0% 0%);
}

.UI--c-kbgiPT {
  height: 100%;
  width: 4.8rem;
  clip-path: polygon(75% 0%, 100% 50%, 75% 100%, 0% 100%, 25% 50%, 0% 0%);
  margin-left: -0.9rem;
  padding: 0px 0.4rem 0px 0.8rem;
}

.UI--c-dhzjXW {
  display: flex;
}

.stepSpan {
  cursor: pointer;
  margin: 3px;
  padding: 0px;
  border: 0px;
  font: inherit;
  vertical-align: baseline;
  float: left
}

.step {
  height: 32px;
  width: 50px;
}

.goschema {
  color: #339af0;
}

.goschema:hover {
  text-decoration: underline;
  cursor: pointer;
}

.far {
  color: gray;
  font-size: 1.5em;
  display: inline;
  cursor: pointer;
}

.datetime-picker {
  background-color: #fff;
  background-clip: content-box;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  padding: 0.375rem 0.75rem;
}

.linkdiv {
  background-clip: content-box;
  background-color: rgba(173, 232, 255, .5607843137254902);
  border-radius: 0.25rem;
  height: 50px;
  text-align: left;
}

h5 {
  width: 100%;
  text-align: center;
  border-bottom: 1px solid #80808045;
  line-height: 0.1em;
  margin: 10px 0 20px;
}

h5 span {
  background: #fff;
  padding: 0 10px;
}

.scrollit {
  overflow: hidden;
  height: 600px;
}

.scrollit:hover {
  overflow-y: auto;
}

.trusted-issuer-list {
  max-width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  width: 100%;
}

.trusted-issuer-column {
  min-width: 0;
}

ul {
  list-style-type: none;
}

.selective-field-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 8px 12px;
}

.selective-field-badge {
  border: 1px solid #d8dee8;
  color: #334155;
  margin-right: 6px;
  margin-bottom: 6px;
  padding: 6px 8px;
}

.jurisdiction-panel {
  background: #fff;
  min-width: 0;
}

.jurisdiction-description {
  color: #6c757d;
  font-size: 80%;
  line-height: 1.45;
  margin: 4px 0 22px;
}

.jurisdiction-label {
  color: #374151;
  font-weight: 700;
  margin-bottom: 10px;
}

.jurisdiction-config-grid {
  display: grid;
  gap: 24px;
  grid-template-columns: minmax(300px, 5fr) minmax(0, 7fr);
}

.jurisdiction-column {
  min-width: 0;
}

.strategy-options {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.strategy-card {
  align-items: flex-start;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  margin: 0;
  min-height: 120px;
  padding: 16px;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  width: 100%;
}

.strategy-card.active {
  border-color: #8ab9ff;
  box-shadow: 0 0 0 1px #8ab9ff;
}

.strategy-radio {
  flex: 0 0 auto;
  margin-right: 14px;
  margin-top: 2px;
}

.strategy-title {
  color: #374151;
  font-weight: 700;
  margin-bottom: 18px;
}

.strategy-help {
  color: #6b7280;
  font-size: 0.92rem;
  line-height: 1.35;
}

.country-chip-row {
  display: flex;
  flex-wrap: nowrap;
  gap: 12px;
  margin-bottom: 12px;
  min-height: 58px;
  overflow-x: auto;
  padding: 1px 0 8px;
  scrollbar-width: thin;
  width: 100%;
}

.country-chip {
  align-items: center;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  color: #374151;
  display: inline-flex;
  flex: 0 0 auto;
  font-weight: 600;
  min-height: 44px;
  padding: 10px 12px;
}

.country-chip-flag {
  margin-right: 10px;
}

.country-dropdown-flag {
  margin-right: 8px;
  vertical-align: middle;
}

.country-chip-remove {
  color: #374151;
  cursor: pointer;
  font-size: 1.2rem;
  line-height: 1;
  margin-left: 18px;
}

.country-dropdown-item {
  align-items: center;
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.jurisdiction-country-search-wrap {
  position: relative;
}

.jurisdiction-country-search-hint {
  color: #7c8798;
  font-size: 10px;
  left: 44px;
  line-height: 1;
  pointer-events: none;
  position: absolute;
  top: 7px;
  z-index: 2;
}

::v-deep(.jurisdiction-country-select.v-text-field--outlined > .v-input__control > .v-input__slot) {
  background: #f8fafc;
  border-radius: 8px;
  min-height: 44px;
  transition: background-color 0.15s ease, box-shadow 0.15s ease;
}

::v-deep(.jurisdiction-country-select.v-text-field--outlined:not(.v-input--is-focused) fieldset) {
  border-color: #e2e8f0;
}

::v-deep(.jurisdiction-country-select.v-text-field--outlined.v-input--is-focused fieldset) {
  border-color: #94a3b8;
  border-width: 1px;
}

::v-deep(.jurisdiction-country-select.v-input--is-focused > .v-input__control > .v-input__slot) {
  background: #fff;
  box-shadow: 0 0 0 3px rgba(148, 163, 184, 0.14);
}

::v-deep(.jurisdiction-country-select:not(.v-input--is-focused):hover fieldset) {
  border-color: #cbd5e1;
}

::v-deep(.jurisdiction-country-select .v-input__prepend-inner),
::v-deep(.jurisdiction-country-select .v-input__append-inner) {
  align-self: center;
  margin-top: 0;
}

::v-deep(.jurisdiction-country-select .v-input__prepend-inner) {
  padding-left: 2px;
  padding-right: 10px;
}

::v-deep(.jurisdiction-country-select input) {
  color: #374151;
  font-size: 13px;
  line-height: 20px;
  margin-top: 11px;
  max-height: 32px;
}

::v-deep(.jurisdiction-country-select .v-icon) {
  color: #7c8798 !important;
}

.jurisdiction-action-column {
  grid-column: 1 / -1;
  max-width: 440px;
}

.jurisdiction-action-help {
  color: #6b7280;
  font-size: 0.86rem;
  line-height: 1.4;
  margin-top: 8px;
}

@media (max-width: 991.98px) {
  .jurisdiction-config-grid {
    grid-template-columns: 1fr;
  }

  .jurisdiction-action-column {
    grid-column: auto;
  }
}

@media (max-width: 575.98px) {
  .strategy-options {
    grid-template-columns: 1fr;
  }

  .strategy-card {
    min-height: auto;
  }
}

/* .zkbadge {
  background-color: lightblue;
  margin-left: 3px;
  margin-top: 3px;
  color: black;
  min-height: 20px;
  align-content: center;
  padding: 5px;
  font-size: x-small;
  font-weight: bold;
  max-width: 200px;
  float: left;
}

.zkbadge:hover {
  background-color: lightcoral;
} */
</style>
<template>
  <b-container fluid class="py-3" :class="isContainerShift ? 'homeShift' : 'home'">
    <load-ing :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></load-ing>
    <AccessDenied v-if="accessDenied" />
    <template v-if="!accessDenied">
    <span class="back-link" @click="goBack"><v-icon x-small>mdi-arrow-left</v-icon> Back to configurations</span>
    <div class="editor-header">
      <div>
        <h4 class="mb-1 font-weight-bold">{{ widgetConfigTemp.name || 'New Widget Configuration' }}</h4>
        <p class="text-muted small mb-0">Configure the ID widget for your application.</p>
      </div>
      <div>
        <b-button variant="outline-secondary" class="mr-2" @click="goBack">Cancel</b-button>
        <HfButtons :name="widgetConfigTemp._id ? 'Update Configuration' : 'Save Configuration'"
          @executeAction="widgetConfigTemp._id ? updateConfiguration() : saveConfiguration()" />
      </div>
    </div>

    <div class="serviceCard">
      <nav class="configuration-tabs" aria-label="Configuration sections">
        <button v-for="tab in tabs" :key="tab" type="button" class="configuration-tab"
          :class="{ active: activeTab === tab }" @click="activeTab = tab">{{ tab }}</button>
      </nav>
      <ul class="list-group list-group-flush">
        <li v-show="activeTab === 'Basic'" class="list-group-item basic-section">
          <div class="basic-form">
            <div class="basic-field">
              <label><strong>Configuration Name</strong></label>
              <b-form-input v-model.trim="widgetConfigTemp.name" placeholder="e.g. Configuration name" />
            </div>
            <div class="basic-field">
              <label><strong>Description</strong></label>
              <b-form-textarea v-model.trim="widgetConfigTemp.description" placeholder="Describe this verification flow" rows="3" />
            </div>
            <b-form-checkbox v-if="widgetConfigTemp._id" v-model="widgetConfigTemp.isDefault" switch class="mt-3">
              Use as default configuration
            </b-form-checkbox>
          </div>
        </li>
        <li v-show="activeTab === 'Verification'" class="list-group-item">
          <b-form-checkbox switch size="lg" v-model="widgetConfigTemp.faceRecog" disabled title="Facial recognition is always enabled and cannot be disabled">{{
            this.widgetConfigUI.faceRecog.label }}</b-form-checkbox>
          <small v-html="widgetConfigUI.faceRecog.description"></small>
          <small class="text-muted d-block"><i class="mdi mdi-lock-outline mr-1"></i>This feature is always enabled and cannot be turned off.</small>
        </li>
        <li v-show="activeTab === 'Verification'" class="list-group-item">
          <div class="row">
            <div class="col-md-6">
              <b-form-checkbox switch size="lg" v-model="widgetConfigTemp.idOcr.enabled">
                {{ this.widgetConfigUI.idOcr.label }}</b-form-checkbox>
              <small v-html="this.widgetConfigUI.idOcr.description"></small>
            </div>
            <div v-if="widgetConfigTemp.idOcr.enabled" class="col-md-6">
              <label class="d-block mb-1"><strong>Capture Method</strong></label>
              <b-form-radio-group
                v-model="widgetConfigTemp.idOcr.documentUploadMode"
                :options="[
                  { text: 'File Upload', value: DocumentUploadMode.MANUAL },
                  { text: 'Live Capture', value: DocumentUploadMode.SCAN }
                ]"
                name="document-upload-mode"
              ></b-form-radio-group>
            </div>
            <!-- <div class="col" v-if="widgetConfigTemp.idOcr.enabled && documentTypeOptions.length > 0">
                  <div class="">
                    <label for=""><strong>Select Document Type: </strong></label>
                    <b-form-select v-model="widgetConfigTemp.idOcr.documentType" :options="documentTypeOptions"
                      size=""></b-form-select>
                  </div>
                </div> -->
          </div>
        </li> 
        <li v-show="activeTab === 'Data & Consent'" class="list-group-item">
          <div class="row">
            <div class="col">
              <div class="row">
                <div class="col-md-12">
                  <b-form-checkbox switch size="lg" v-model="widgetConfigTemp.userConsent.enabled" disabled>{{
                    this.widgetConfigUI.userConsent.label }}</b-form-checkbox>
                  <small v-html="widgetConfigUI.userConsent.description"></small>
                </div>
              </div>
              <div class="row mt-2 mx-0 p-1"
                style="border: 2px solid #8080802e;border-radius: 10px; min-height: 115px;">
                <div class="col-md-3 center">
                  <div style="border: 1px solid #8080802e; border-radius: 50%;" class="p-1">
                    <img :src="widgetConfigTemp.userConsent.logoUrl" v-if="widgetConfigTemp.userConsent.logoUrl"
                      style="height: 50px; border-radius: 50%;">
                  </div>
                </div>
                <div class="col-md-8">
                  <div class="row">
                    <div class="col-md-12" style="font-size: 1.05rem;">
                      {{ widgetConfigTemp.userConsent.domain }}
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-12" style="color:grey">
                      {{ widgetConfigTemp.userConsent.reason }}
                    </div>
                  </div>
                </div>

              </div>
            </div>
             <div class="col">
              <div class="row">
                <div class="col">
                  <div class="row">
                    <div class="col">
                      <label for=""><strong>Reason For KYC: </strong></label>
                      <textarea type="text" rows="7" class="serviceCard form-control" id=""
                        v-model="widgetConfigTemp.userConsent.reason"
                        placeholder="The app is requesting the following information to verify your identity" />
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </li>
        <li v-show="activeTab === 'Trusted Issuer'" class="list-group-item">
          <div class="row">

            <div class="col">
              <b-form-checkbox switch size="lg" v-model="widgetConfigTemp.trustedIssuer" disabled>{{
                widgetConfigUI.trustedIssuer.label }}</b-form-checkbox>
              <small v-html="widgetConfigUI.trustedIssuer.description"></small>
            </div>
            <div class="col trusted-issuer-column">
              <label for=""><strong>Choose Trusted Issuer ({{ trustedIssuerCount }}): </strong></label>
              <div class="trusted-issuer-list p-1">
                <MarketplaceList
                  :fetch-on-mount="false"
                  horizontal
                  :is-selection="true"
                  :items="trustedIssuersList"
                  :selected-issuer-dids="Array.from(selectedIssuerDids)"
                  @selectedServiceEvent="selectedServiceEventHandler"
                />
              </div>
            </div>
          </div>
          <!-- <TrustedIssuer @selectedServiceEventFromTrustedIssuer="selectedServiceEventHandler" /> -->
        </li>


        <li v-show="activeTab === 'Data & Consent'" class="list-group-item">
          <div class="row">
            <div class="col-md-6">
              <b-form-checkbox
                switch
                size="lg"
                v-model="widgetConfigTemp.selectiveDisclosure.enabled"
                :disabled="!widgetConfigTemp.idOcr.enabled"
              >
                {{ widgetConfigUI.selectiveDisclosure.label }} <HFBeta></HFBeta>
              </b-form-checkbox>
              <small v-html="widgetConfigUI.selectiveDisclosure.description"></small>
            </div>
            <div class="col" v-if="widgetConfigTemp.selectiveDisclosure.enabled">
              <label for="selective-disclosure-fields"><strong>Selected Identity Attributes: </strong></label>
              <b-form-checkbox-group
                id="selective-disclosure-fields"
                v-model="widgetConfigTemp.selectiveDisclosure.fields"
                :options="selectiveDisclosureFieldOptions"
                class="selective-field-grid"
              ></b-form-checkbox-group>
            </div>
          </div>
        </li>

         <li v-show="activeTab === 'Data & Consent'" class="list-group-item">
          <div class="row">
            <div class="col-md-6">
              <div class="row">
                <div class="col-md-12">
                  <b-form-checkbox switch size="lg" v-model="widgetConfigTemp.zkProof.enabled"
                  :disabled="!widgetConfigTemp.idOcr.enabled">{{
                    this.widgetConfigUI.zkProof.ageProof.label }}<HFBeta></HFBeta>
                  </b-form-checkbox>
                  <small v-html="this.widgetConfigUI.zkProof.ageProof.description"></small>
                </div>
              </div>
              <!-- <div class="mt-2 mx-0 p-1"
                style="border: 2px solid #8080802e; border-radius: 10px; min-height: 80px; padding:10px"
                v-if="widgetConfigTemp.zkProof.proofs.length > 0">
                <div class="">
                  <span class="zkbadge rounded " style="cursor: grab;" @click="deleteZkProof(proof.proofType)"
                    v-for="proof in widgetConfigTemp.zkProof.proofs" v-bind:key="proof.proofType"><b-icon
                      style="color:green;" icon="check-circle" aria-hidden="true"></b-icon>
                    <span v-if="proof.proofType == SupportedZkProofTypes.PROOF_OF_AGE">
                      {{ proof.proofType }} > {{ proof.criteria }}
                    </span>
                    <span v-else>
                      {{ proof.proofType }}
                    </span>

                    <b-icon class="trash" style="color:red" icon="trash" aria-hidden="true"></b-icon></span>
                </div>
              </div> -->
            </div>

            <div class="col" v-if="widgetConfigTemp.zkProof.enabled">
              <div class="row">
                <div class="col">
                  <label for="age-proof-criteria"><strong>Minimum Age: </strong></label>
                  <b-form-input id="age-proof-criteria" v-model="ageProofCriteria" placeholder="Enter age"
                    type="number" min="1"></b-form-input>
                </div>
              </div>
            </div>
          </div>
        </li>
        <!-- <li class="list-group-item">
          <div class="row">
            <div class="col-md-6">
              <b-form-checkbox switch size="lg" v-model="widgetConfigTemp.onChainId.enabled">{{
                this.widgetConfigUI.onChainId.label }} <HFBeta></HFBeta></b-form-checkbox>
              <small v-html="this.widgetConfigUI.onChainId.description"></small>
            </div>
            <div class="col" v-if="widgetConfigTemp.onChainId.enabled && onchainconfigsOptions.length > 0">
              <div class="">
                <label for=""><strong>Select OnChain KYC Config: </strong></label>
                <v-select v-model="widgetConfigTemp.onChainId.selectedOnChainKYCconfiguration"
                  :items="onchainconfigsOptions" item-text="text" item-value="value" multiple small-chips attach dense
                  outlined></v-select>
              </div>
            </div>
          </div>
        </li> -->
        <li v-show="activeTab === 'Notifications'" class="list-group-item">
          <div class="row">
            <div class="col-md-6">
              <b-form-checkbox
                switch
                size="lg"
                v-model="widgetConfigTemp.isEmailNotificationEnabled"
              >
                {{ widgetConfigUI.emailNotification.label }}
              </b-form-checkbox>
              <small v-html="widgetConfigUI.emailNotification.description"></small>
            </div>
          </div>
        </li>
        <li v-show="activeTab === 'Restrictions'" class="list-group-item">
          <div class="jurisdiction-panel">
            <b-form-checkbox
              switch
              size="lg"
              v-model="widgetConfigTemp.jurisdictionRules.enabled"
            >
              {{ widgetConfigUI.jurisdictionRules.label }}
            </b-form-checkbox>
            <p class="jurisdiction-description">
              {{ widgetConfigUI.jurisdictionRules.description }}
              <br>
              {{ widgetConfigUI.jurisdictionRules.secondaryDescription }}
            </p>

            <div v-if="widgetConfigTemp.jurisdictionRules.enabled" class="jurisdiction-config-grid">
              <div class="jurisdiction-column">
                <div class="jurisdiction-label">Enforcement Strategy</div>
                <div class="strategy-options">
                  <label
                    v-for="option in jurisdictionStrategyOptions"
                    :key="option.value"
                    class="strategy-card"
                    :class="{ active: widgetConfigTemp.jurisdictionRules.strategy === option.value }"
                  >
                    <b-form-radio
                      class="strategy-radio"
                      v-model="widgetConfigTemp.jurisdictionRules.strategy"
                      :value="option.value"
                      name="jurisdiction-strategy"
                    >
                    </b-form-radio>
                    <div>
                      <div class="strategy-title">{{ option.text }}</div>
                      <div class="strategy-help">{{ option.description }}</div>
                    </div>
                  </label>
                </div>
              </div>

              <div class="jurisdiction-column">
                <div class="jurisdiction-label">
                  Target Countries<span v-if="selectedJurisdictionCountries.length > 0"> ({{ selectedJurisdictionCountries.length }})</span>
                </div>
                <div class="country-chip-row" v-if="selectedJurisdictionCountries.length > 0">
                  <span
                    v-for="country in selectedJurisdictionCountries"
                    :key="country.value"
                    class="country-chip"
                  >
                    <country-flag :country="country.alpha2" size="small" class="country-chip-flag" />
                    <span>{{ country.text }} ({{ country.value }})</span>
                    <span
                      class="country-chip-remove"
                      title="Remove country"
                      @click="removeJurisdictionCountry(country.value)"
                    >
                      ×
                    </span>
                  </span>
                </div>
                <div class="jurisdiction-country-search-wrap">
                  <span class="jurisdiction-country-search-hint">
                    Select or search country...
                  </span>
                  <v-autocomplete
                    class="jurisdiction-country-select"
                    v-model="widgetConfigTemp.jurisdictionRules.countries"
                    :items="countryOptions"
                    item-text="displayText"
                    item-value="value"
                    multiple
                    outlined
                    dense
                    hide-details
                    :menu-props="{ maxHeight: 320, offsetY: true, closeOnContentClick: false }"
                  >
                    <template v-slot:prepend-inner>
                      <v-icon small color="grey">mdi-magnify</v-icon>
                    </template>
                    <template v-slot:selection></template>
                    <template v-slot:item="{ item }">
                      <div class="country-dropdown-item">
                        <span>
                          <country-flag :country="item.alpha2" size="small" class="country-dropdown-flag" />
                          <span>{{ item.text }} ({{ item.value }})</span>
                        </span>
                        <v-icon
                          v-if="isJurisdictionCountrySelected(item.value)"
                          color="primary"
                          small
                        >
                          mdi-check
                        </v-icon>
                      </div>
                    </template>
                  </v-autocomplete>
                </div>
              </div>

              <div class="jurisdiction-column jurisdiction-action-column">
                <div class="jurisdiction-label">Action on Match</div>
                <b-form-select
                  v-model="widgetConfigTemp.jurisdictionRules.actionOnRestriction"
                  :options="jurisdictionActionOptions"
                ></b-form-select>
                <div class="jurisdiction-action-help">
                  {{ selectedJurisdictionActionDescription }}
                </div>
              </div>
            </div>
          </div>
        </li>
         <li v-show="activeTab === 'Experience'" class="list-group-item">
          <div class="row">
            <div class="col-md-6">
              <b-form-checkbox
                switch
                size="lg"
                v-model="widgetConfigTemp.isWidgetLogin"
              >
                {{ widgetConfigUI.widgetLogin.label }}
              </b-form-checkbox>
              <small v-html="widgetConfigUI.widgetLogin.description"></small>
            </div>
          </div>
        </li>
        <li v-show="activeTab === 'Experience'" class="list-group-item">
          <div class="row">
            <div class="col-md-6">
              <b-form-checkbox
                switch
                size="lg"
                v-model="widgetConfigTemp.isMobileAssistedVerification"
              >
                {{ widgetConfigUI.mobileAssistedVerification.label }}
              </b-form-checkbox>
              <small v-html="widgetConfigUI.mobileAssistedVerification.description"></small>
            </div>
          </div>
        </li>
      </ul>
    </div>


    </template>
  </b-container>
</template>

<script>

import UtilsMixin from '../../../mixins/utils';
import { mapState, mapActions } from "vuex";
import HfButtons from '../../../components/element/HfButtons.vue';
import { mapGetters, mapMutations } from 'vuex/dist/vuex.common.js';
import AccessDenied from '../../AccessDenied.vue';
import { isAccessDeniedError } from '../../../utils/accessDenied';
// import TrustedIssuer from './components/TrustedIssuer.vue';
import MarketplaceList from '../../../components/MarketplaceList.vue';
import HFBeta from '../../../components/element/HFBeta.vue';
import config from '../../../config';
import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';
import CountryFlag from 'vue-country-flag';

countries.registerLocale(enLocale);

export default {
  name: "WidgetConfig",
  mixins: [UtilsMixin],
  components: {
    HfButtons,
    MarketplaceList,
    CountryFlag,
    HFBeta,
    AccessDenied
    // TrustedIssuer
  },
  // TODO : check why this is not working... we need to trigger warning that its an experimental feature once user enables zk
 watch: {
  'widgetConfigTemp.zkProof.enabled': {
    handler(enabled) {
      // Don't allow enabling ZK Proof unless ID OCR is enabled
      if (enabled && !this.widgetConfigTemp.idOcr.enabled) {
        this.widgetConfigTemp.zkProof.enabled = false;
        return;
      }
      // Default age
      if (enabled && !this.ageProofCriteria) {
        this.ageProofCriteria = 18;
      }
      // Disable dependent feature
      if (!enabled) {
        this.widgetConfigTemp.onChainId.enabled = false;
        this.widgetConfigTemp.onChainId.selectedOnChainKYCconfiguration = null;
        this.widgetConfigTemp.zkProof.proofs = [];
      }
    }
  },

  'widgetConfigTemp.idOcr.enabled': {
    handler(enabled) {
      // If ID Document is disabled,
      // automatically disable all dependent features.
      if (!enabled) {
        this.widgetConfigTemp.zkProof.enabled = false;
        this.widgetConfigTemp.zkProof.proofs = [];

        this.widgetConfigTemp.onChainId.enabled = false;
        this.widgetConfigTemp.onChainId.selectedOnChainKYCconfiguration = null;

        this.widgetConfigTemp.selectiveDisclosure.enabled = false;
        this.widgetConfigTemp.selectiveDisclosure.fields = [];
        this.widgetConfigTemp.selectiveDisclosure.frame = null;
    }
    }
  },

  'widgetConfigTemp.selectiveDisclosure.enabled': {
    handler(enabled) {
      if (enabled && !this.widgetConfigTemp.idOcr.enabled) {
        this.widgetConfigTemp.selectiveDisclosure.enabled = false;
        return;
      }

      if (enabled && this.widgetConfigTemp.selectiveDisclosure.fields.length === 0) {
        this.widgetConfigTemp.selectiveDisclosure.fields = [...this.defaultSelectiveDisclosureFields]
      }

      if (!enabled) {
        this.widgetConfigTemp.selectiveDisclosure.fields = [];
        this.widgetConfigTemp.selectiveDisclosure.frame = null;
      }
    }
  },
  'widgetConfigTemp.isWidgetLogin': {
    handler(newValue) {
      this.widgetConfigTemp.isVaultEnabled = newValue !== false
    },
    immediate: true

  },
},
  computed: {
    ...mapState({
      containerShift: state => state.playgroundStore.containerShift,
      onchainconfigs: state => state.mainStore.onchainconfigs,
      widgetConfig: state => state.mainStore.widgetConfig,
      kycWebpageConfig: state => state.mainStore.kycWebpageConfig
    }),
    ...mapGetters('mainStore', ['getAppByAppId', 'getMarketPlaceApps', 'getSelectedService']),
    isContainerShift() {
      return this.containerShift
    },

    trustedIssuerCount() {
      return new Set(this.trustedIssuersList.filter(issuer => issuer.issuerDid).map(issuer => issuer.issuerDid)).size
    },

    onchainconfigsOptions() {
      const options = [];
      options.push({
        value: null,
        text: "Select OnChain KYC Configuration",
        selected: true
      })
      this.onchainconfigs.forEach(element => {
        options.push({
          value: element._id,
          text: element.blockchainLabel + "(" + element._id + ")"
        })
      });
      return options
    },
    countryOptions() {
      return Object.entries(countries.getNames('en', { select: 'alias' }))
        .map(([alpha2, name]) => {
          const alpha3 = countries.alpha2ToAlpha3(alpha2)
          const displayName = alpha2 === 'AE' ? 'United Arab Emirates' : name

          return {
            value: alpha3,
            text: displayName,
            displayText: `${displayName} (${alpha3})`,
            alpha2,
          }
        })
        .filter(country => !!country.value)
        .sort((a, b) => a.text.localeCompare(b.text))
    },
    selectedJurisdictionCountries() {
      const selected = this.widgetConfigTemp.jurisdictionRules?.countries || []
      return selected.map(code => {
        const option = this.countryOptions.find(country => country.value === code)
        return option || {
          value: code,
          text: code,
          displayText: code,
          alpha2: countries.alpha3ToAlpha2(code),
        }
      })
    },
    selectedJurisdictionActionDescription() {
      const action = this.widgetConfigTemp.jurisdictionRules?.actionOnRestriction
      const option = this.jurisdictionActionOptions.find(option => option.value === action)
      return option?.description || ''
    },
  },

  async mounted() {
    try {
      this.isLoading = true
      // await this.fetchAppsOnChainConfigs()
      if (this.$route.params.widgetConfigId) {
        await this.fetchAppsWidgetConfig(this.$route.params.widgetConfigId)
      } else {
        try {
          await this.fetchAppsWidgetConfig()
          this.widgetConfigTemp.issuerDID = this.widgetConfig.issuerDID || ''
          this.widgetConfigTemp.issuerVerificationMethodId = this.widgetConfig.issuerVerificationMethodId || ''
        } catch (e) {
          if (isAccessDeniedError(e)) throw e
        }
        this.setWidgetConfig({})
      }
      await this.fetchMarketPlaceAppsFromServer()
      this.isLoading = false
    } catch (e) {
      this.isLoading = false
      return this.handleApiError(e, 'GET')
    }

    if (Object.keys(this.widgetConfig).length > 0) {
      this.widgetConfigTemp = JSON.parse(JSON.stringify(this.widgetConfig))
    }
    this.migratedocumentUploadMode()
    if (typeof this.widgetConfigTemp.isWidgetLogin !== 'boolean') {
      this.$set(this.widgetConfigTemp, 'isWidgetLogin', true)
    }
    if (typeof this.widgetConfigTemp.isMobileAssistedVerification !== 'boolean') {
      this.$set(this.widgetConfigTemp, 'isMobileAssistedVerification', true)
    }
    this.ensureJurisdictionRules()

    this.trustedIssuersList = [...this.getMarketPlaceApps];
    this.appId = this.$route.params.appId;
    //eslint-disable-next-line
    if (this.appId) {
      this.app = this.getAppByAppId(this.appId) || this.getSelectedService || {}
      if (this.app.appId) {
        this.widgetConfigTemp.userConsent.domain = this.app.domain ? this.app.domain : this.widgetConfigTemp.userConsent.domain;
        this.widgetConfigTemp.userConsent.logoUrl = this.app.logoUrl ? this.app.logoUrl : this.widgetConfigTemp.userConsent.logoUrl;
        if (!this.widgetConfigTemp.issuerDID) {
          this.widgetConfigTemp.issuerDID = this.app.issuerDid;
        }
        if (!this.widgetConfigTemp.issuerVerificationMethodId && this.widgetConfigTemp.issuerDID) {
          this.widgetConfigTemp.issuerVerificationMethodId = this.app.issuerVerificationMethodId || `${this.widgetConfigTemp.issuerDID}#key-1`;
        }

        if (!this.getMarketPlaceApps.find(x => x.appId == this.app.appId)) {
          this.trustedIssuersList.push({ ...this.app })
        }
         this.trustedIssuersList.sort((a, b) => {
          if (a.appId === this.appId) return -1;
          if (b.appId === this.appId) return 1;
          return 0;
        });
      } else {
        console.error("No app found");
      }
    } else {
      console.error("No appId found");
    }

    if (this.widgetConfigTemp.issuerDID) {
      const trustedIssuers = this.widgetConfigTemp.issuerDID.split(',');
      this.selectedIssuerDids = new Set(trustedIssuers);
    }

    this.widgetConfigTemp.trustedIssuer = this.widgetConfigTemp.issuerDID ? true : false;

    this.ensureSelectiveDisclosure()


    if (!this.widgetConfigTemp.zkProof.proofs) {
      this.widgetConfigTemp.zkProof.proofs = []
    }
    const ageProof = this.widgetConfigTemp.zkProof.proofs.find(
      proof => proof.proofType === this.SupportedZkProofTypes.PROOF_OF_AGE
    )
    this.ageProofCriteria = ageProof?.criteria || ''
    // this.widgetConfigTemp.zkProof = {
    //   enabled: false,
    //   proofType: null,
    // }
  },
  data() {
    return {
      activeTab: 'Basic',
      tabs: ['Basic', 'Verification', 'Data & Consent', 'Trusted Issuer', 'Experience', 'Notifications', 'Restrictions'],
      SupportedZkProofTypes: Object.freeze({
        PROOF_OF_AGE: 'zkProofOfAge',
      }),
      DocumentUploadMode: config.DocumentUploadMode,
      widgetConfigUI: {
        faceRecog: {
          label: "Enable Facial Recoginition",
          description: 'Enable users verify if they are human and generate Personhood Credential. Read more <b><a href="https://docs.hypersign.id/hypersign-kyc/integrations/widget-configuration#facial-recognition" target="_blank">here</a></b>.'
        },
        idOcr: {
          label: "Enable ID Document Verification",
          description: 'Enable users verify their ID Document and generate their ID Credential. Read more <b><a href="https://docs.hypersign.id/hypersign-kyc/integrations/widget-configuration#id-document-verification" target="_blank">here</a></b>.'
        },
        userConsent: {
          label: "Enable User Consent",
          description: 'Specify a reason for requesting user KYC data. This information will be displayed on the user consent screen in the KYC widget, helping users understand who is requesting their data and why. Read more <b><a href="https://docs.hypersign.id/hypersign-kyc/integrations/widget-configuration#user-consent" target="_blank">here</a></b>.'
        },
        
        trustedIssuer: {
          label: "Configure Trusted Issuer(s)",
          description: 'Select one or more trusted issuers, with the default being "self". This pertains to Reusable ID. If configured, users who already possess KYC credentials issued by these trusted issuers in their data vault will not need to repeat the KYC steps in the widget. They can simply authorize the sharing of their existing credentials with your app, streamlining user onboarding for your company and providing a smoother experience for your users. Read more <b><a href="https://docs.hypersign.id/hypersign-kyc/integrations/widget-configuration#trusted-issuer" target="_blank">here</a></b>.'
        },
        onChainId: {
          label: "Enable Onchain KYC",
          description: "Enable users to mint SBT of their credentials in a privacy preserving manner and verify on configured blockchain"
        },
        zkProof: {
          ageProof:{
            label: "Configure Age Verification",
            description: "Enable users to prove they meet a minimum age requirement without sharing their exact date of birth. Read more <b><a href=\"https://docs.hypersign.id/hypersign-kyc/integrations/widget-configuration#id-document-verification\" target=\"_blank\">here</a></b>."
          }
        },
        selectiveDisclosure: {
          label: "Request only the information you need",
          description: "Choose which verified identity attributes users will share with your application after completing identity verification. Attributes that are not selected remain private and are not included in the verification response."
        },
        emailNotification: {
           label: "Enable Email Notifications",
           description: "Notify users via email regarding the status of their ID verification. When enabled, users will receive automated updates upon the successful completion or rejection of their verification attempt."
        },
        widgetLogin: {
          label: "Enable Built-in Login & Identity Vault",
          description: "Users sign in through the ID Widget and receive a personal identity vault for storing reusable credentials. Disable this if your application handles authentication."
        },
        mobileAssistedVerification: {
          label: "Mobile-Assisted Verification",
          description: "When enabled, users who start verification on a desktop will continue ID verification on their mobile device by scanning a QR code. This improves verification success rates, provides a better user experience, and strengthens proof of possession. Disable to allow the entire verification process to be completed on the desktop."
        },
        jurisdictionRules: {
          label: "Enable Jurisdictional Restrictions",
          description: "Enforce compliance policies by restricting access based on document issuing country and nationality.",
          secondaryDescription: "Choose to either block high-risk regions (Blocklist) or restrict onboarding to specific permitted territories (Allowlist)."
        },
      },
      fullPage: true,
      isLoading: false,
      accessDenied: false,
      accessDeniedMsg: '',
      appId: "",
      app: {},
      trustedIssuersList: [],
      widgetConfigTemp: {
        name: '',
        description: '',
        tags: [],
        isDefault: false,
        faceRecog: true,
        idOcr: {
          enabled: false,
          documentType: 'passport',
          documentUploadMode: config.DocumentUploadMode.SCAN,
        },
        userConsent: {
          enabled: true,
          reason: "The app is requesting your KYC data to provide you service",
          logoUrl: "https://static.thenounproject.com/png/4974686-200.png",
          domain: "http://localhost:6006",
        },
        onChainId: {
          enabled: false,
          selectedOnChainKYCconfiguration: null,
        },
        zkProof: {
          enabled: false,
          proofs: []
        },
        selectiveDisclosure: {
          enabled: false,
          fields: [],
          frame: null,
        },
        trustedIssuer: true,
        isWidgetLogin: true,
        isVaultEnabled: true,
        isEmailNotificationEnabled: true,
        isMobileAssistedVerification: true,
        jurisdictionRules: {
          enabled: false,
          strategy: 'BLOCKLIST',
          countries: [],
          actionOnRestriction: 'HARD_REJECT',
        },
        issuerDID: "",
        issuerVerificationMethodId: "",
      },
      selectedIssuerDids: new Set(),
      ageProofCriteria: '',
      defaultSelectiveDisclosureFields: ['givenNames', 'surname'],
      selectiveDisclosureFieldOptions: [
        { value: 'docModel', text: 'Document Type' },
        { value: 'givenNames', text: 'Given Name(s)' },
        { value: 'surname', text: 'Surname' },
        { value: 'sex', text: 'Gender' },
        { value: 'nationality', text: 'Nationality' },
        { value: 'dateOfBirth', text: 'Date of Birth' },
      ],
      documentTypeOptions: [
        {
          value: null,
          text: "Select a document type"
        },
        {
          value: 'passport',
          text: "Passport"
        },
         {
          value: 'govId',
          text: "Government ID"
        },
      ],
      jurisdictionStrategyOptions: [
        {
          value: 'BLOCKLIST',
          text: 'Blocklist',
          description: 'Block selected countries',
        },
        {
          value: 'ALLOWLIST',
          text: 'Allowlist',
          description: 'Only permit selected countries',
        },
      ],
      jurisdictionActionOptions: [
        {
          value: 'HARD_REJECT',
          text: 'Hard Reject (Stop Onboarding)',
          description: 'Rejects the session immediately if the user matches the configured jurisdiction rule.',
        },
        {
          value: 'MANUAL_REVIEW',
          text: 'Manual Review',
          description: 'Allows the user to complete verification, then sends the session to the manual review queue.',
        },
      ],

    }
  },
  methods: {
    ...mapMutations('mainStore', ['setWidgetConfig']),
    // ...mapActions('mainStore', ['fetchAppsOnChainConfigs']),
    ...mapActions('mainStore', ['fetchMarketPlaceAppsFromServer', 'createAppsWidgetConfig', 'fetchAppsWidgetConfig', 'updateAppsWidgetConfig', 'fetchKYCWebpageConfig', 'updateKYCWebpageConfig']),
    goBack() {
      this.$router.push({ name: 'WidgetConfigurations', params: { appId: this.$route.params.appId } })
    },
    configurationPayload(isUpdate = false) {
      const payload = JSON.parse(JSON.stringify(this.widgetConfigTemp))
      delete payload.trustedIssuer
      delete payload.serviceId
      delete payload.createdAt
      delete payload.updatedAt
      if (!isUpdate) {
        delete payload._id
        delete payload.isDefault
      }
      return payload
    },
    setIssuerDetails(forceUpdate = false) {
      const app = this.getAppByAppId(this.$route.params.appId) || this.getSelectedService
      if (!app) return
      const hasServiceIssuer = !!app.issuerDid

      if ((forceUpdate && hasServiceIssuer) || !this.widgetConfigTemp.issuerDID) {
        this.widgetConfigTemp.issuerDID = app.issuerDid
      }
      if (((forceUpdate && hasServiceIssuer) || !this.widgetConfigTemp.issuerVerificationMethodId) && this.widgetConfigTemp.issuerDID) {
        this.widgetConfigTemp.issuerVerificationMethodId = app.issuerVerificationMethodId || `${this.widgetConfigTemp.issuerDID}#key-1`
      }
    },
    async updateVerifierPageWidgetConfig() {
      try {
        await this.fetchKYCWebpageConfig()
      } catch (e) {
        const message = e?.message || String(e)
        if (message.includes('No webpage configuration found')) return
        throw e
      }

      if (!this.kycWebpageConfig?._id) return
      await this.updateKYCWebpageConfig({
        ...this.kycWebpageConfig,
        linkedWidgetConfigIds: [this.widgetConfigTemp._id]
      })
    },
    handleApiError(error, method = 'GET') {
      const message = typeof error === 'string' ? error : error?.message || 'Something went wrong';
      if (method.toUpperCase() === 'GET' && isAccessDeniedError(error)) {
        this.accessDenied = true;
        this.accessDeniedMsg = message;
        return;
      }

      this.notifyErr(message)
    },
    defaultJurisdictionRules() {
      return {
        enabled: false,
        strategy: 'BLOCKLIST',
        countries: [],
        actionOnRestriction: 'HARD_REJECT',
      }
    },
    ensureJurisdictionRules() {
      const defaults = this.defaultJurisdictionRules()

      if (!this.widgetConfigTemp.jurisdictionRules) {
        this.$set(this.widgetConfigTemp, 'jurisdictionRules', defaults)
        return
      }

      const existingRules = this.widgetConfigTemp.jurisdictionRules
      Object.keys(defaults).forEach(key => {
        if (!Object.prototype.hasOwnProperty.call(existingRules, key)) {
          this.$set(existingRules, key, defaults[key])
        }
      })

      existingRules.enabled = existingRules.enabled === true
      existingRules.strategy = ['BLOCKLIST', 'ALLOWLIST'].includes(existingRules.strategy)
        ? existingRules.strategy
        : defaults.strategy
      existingRules.countries = Array.isArray(existingRules.countries)
        ? existingRules.countries.map(country => String(country).toUpperCase()).filter(country => !!country)
        : []
      existingRules.actionOnRestriction = ['HARD_REJECT', 'MANUAL_REVIEW'].includes(existingRules.actionOnRestriction)
        ? existingRules.actionOnRestriction
        : defaults.actionOnRestriction
    },
    removeJurisdictionCountry(countryCode) {
      const selectedCountries = this.widgetConfigTemp.jurisdictionRules.countries || []
      this.widgetConfigTemp.jurisdictionRules.countries = selectedCountries.filter(country => country !== countryCode)
    },
    isJurisdictionCountrySelected(countryCode) {
      return (this.widgetConfigTemp.jurisdictionRules.countries || []).includes(countryCode)
    },
    validateJurisdictionRules() {
      this.ensureJurisdictionRules()
      const rules = this.widgetConfigTemp.jurisdictionRules

      if (!rules.enabled) {
        rules.countries = []
        rules.actionOnRestriction = rules.actionOnRestriction || 'HARD_REJECT'
        return
      }

      if (!['BLOCKLIST', 'ALLOWLIST'].includes(rules.strategy)) {
        throw new Error('Kindly select a jurisdiction enforcement strategy')
      }

      if (!Array.isArray(rules.countries) || rules.countries.length === 0) {
        throw new Error('Kindly select at least one target country for jurisdiction restrictions')
      }

      const invalidCountries = rules.countries.filter(country => !/^[A-Z]{3}$/.test(country) || !countries.alpha3ToAlpha2(country))
      if (invalidCountries.length > 0) {
        throw new Error(`Invalid country code(s): ${invalidCountries.join(', ')}`)
      }

      if (!['HARD_REJECT', 'MANUAL_REVIEW'].includes(rules.actionOnRestriction)) {
        throw new Error('Kindly select a jurisdiction action on match')
      }
    },

    selectedServiceEventHandler(event) {
      if (!event.issuerDid || !event.issuerDid.trim()) return

      const selectedIssuerDids = new Set(this.selectedIssuerDids)
      if (event.selected) {
        selectedIssuerDids.add(event.issuerDid)
      } else {
        selectedIssuerDids.delete(event.issuerDid)
      }
      this.selectedIssuerDids = selectedIssuerDids
      this.widgetConfigTemp.issuerDID = Array.from(this.selectedIssuerDids.values())
        .filter(did => !!did && !!did.trim())
        .join(',')
    },
    ensureSelectiveDisclosure() {
      if (!this.widgetConfigTemp.selectiveDisclosure) {
        this.$set(this.widgetConfigTemp, 'selectiveDisclosure', {
          enabled: false,
          fields: [],
          frame: null,
        })
      }

      if (!Array.isArray(this.widgetConfigTemp.selectiveDisclosure.fields)) {
        this.$set(this.widgetConfigTemp.selectiveDisclosure, 'fields', [])
      }

      if (!Object.prototype.hasOwnProperty.call(this.widgetConfigTemp.selectiveDisclosure, 'frame')) {
        this.$set(this.widgetConfigTemp.selectiveDisclosure, 'frame', null)
      }

      if (
        this.widgetConfigTemp.selectiveDisclosure.enabled &&
        this.widgetConfigTemp.selectiveDisclosure.fields.length === 0
      ) {
        const framedFields = Object.keys(this.widgetConfigTemp.selectiveDisclosure.frame?.credentialSubject || {})
          .filter(field => field !== '@explicit' && this.defaultSelectiveDisclosureFields.includes(field))

        this.widgetConfigTemp.selectiveDisclosure.fields = framedFields.length > 0
          ? framedFields
          : [...this.defaultSelectiveDisclosureFields]
      }
    },
    getSelectiveDisclosureFieldLabel(field) {
      const option = this.selectiveDisclosureFieldOptions.find(item => item.value === field)
      return option ? option.text : field
    },
    generateSelectiveDisclosureFrame(fields) {
      const credentialSubject = fields.reduce((frame, field) => {
        frame[field] = {}
        return frame
      }, {
        '@explicit': true,
      })

      return {
        '@context': [
          'https://www.w3.org/2018/credentials/v1',
          'https://raw.githubusercontent.com/hypersign-protocol/hypersign-contexts/main/BJJSignature2021.jsonld',
          'https://schema.org'
        ],
        type: [
          'VerifiableCredential'
        ],
        credentialSubject,
      }
    },
    syncSelectiveDisclosure() {
      this.ensureSelectiveDisclosure()

      if (!this.widgetConfigTemp.selectiveDisclosure.enabled) {
        this.widgetConfigTemp.selectiveDisclosure.fields = []
        this.widgetConfigTemp.selectiveDisclosure.frame = null
        return
      }

      const selectedFields = this.widgetConfigTemp.selectiveDisclosure.fields
        .filter(field => this.selectiveDisclosureFieldOptions.some(option => option.value === field))

      this.widgetConfigTemp.selectiveDisclosure.fields = selectedFields
      this.widgetConfigTemp.selectiveDisclosure.frame = this.generateSelectiveDisclosureFrame(selectedFields)
    },
    syncAgeProof() {
      if (!this.widgetConfigTemp.zkProof.proofs) {
        this.widgetConfigTemp.zkProof.proofs = []
      }

      if (!this.widgetConfigTemp.zkProof.enabled || !this.ageProofCriteria) {
        this.widgetConfigTemp.zkProof.proofs = []
        return
      }

      this.widgetConfigTemp.zkProof.proofs = [{
        proofType: this.SupportedZkProofTypes.PROOF_OF_AGE,
        criteria: this.ageProofCriteria,
      }]
    },
    migratedocumentUploadMode() {
      const legacyEnableDocumentUpload = this.widgetConfigTemp.enableDocumentUpload

      if (!this.widgetConfigTemp.idOcr) {
        this.$set(this.widgetConfigTemp, 'idOcr', {})
      }

      if (!Object.values(config.DocumentUploadMode).includes(this.widgetConfigTemp.idOcr.documentUploadMode)) {
        this.$set(
          this.widgetConfigTemp.idOcr,
          'documentUploadMode',
          legacyEnableDocumentUpload === true
            ? config.DocumentUploadMode.MANUAL
            : config.DocumentUploadMode.SCAN,
        )
      }

      if (Object.prototype.hasOwnProperty.call(this.widgetConfigTemp, 'enableDocumentUpload')) {
        this.$delete(this.widgetConfigTemp, 'enableDocumentUpload')
      }
    },
    validateField() {
      if (!this.widgetConfigTemp.name) {
        throw new Error('Configuration name is required')
      }
      if (!this.widgetConfigTemp.description) {
        throw new Error('Configuration description is required')
      }
      this.widgetConfigTemp.isWidgetLogin = this.widgetConfigTemp.isWidgetLogin !== false
      this.widgetConfigTemp.isMobileAssistedVerification = this.widgetConfigTemp.isMobileAssistedVerification !== false
      this.setIssuerDetails()
      this.migratedocumentUploadMode()
      this.validateJurisdictionRules()
      if (!this.widgetConfigTemp.issuerDID) {
        throw new Error('Configure an Issuer DID in Service Configuration before creating a widget configuration')
      }

      if (!this.widgetConfigTemp.idOcr?.enabled) {
        this.widgetConfigTemp.idOcr.documentType = null
      } else {
        if (!this.widgetConfigTemp.idOcr.documentType) {
          this.widgetConfigTemp.idOcr.documentType = 'passport'
        }
      }

      if (this.widgetConfigTemp.selectiveDisclosure.enabled) {
        if (!this.widgetConfigTemp.idOcr.enabled) {
          throw new Error('Selective disclosure requires ID document verification. Please enable ID document verification to proceed.')
        }

        if (this.widgetConfigTemp.selectiveDisclosure.fields.length === 0) {
          throw new Error('Kindly select information to request through selective disclosure')
        }
      }

      if (!this.widgetConfigTemp.onChainId.enabled) {
        this.widgetConfigTemp.onChainId.selectedOnChainKYCconfiguration = null
        this.widgetConfigTemp.onChainId.enabled = false
      } else {


        if (!this.widgetConfigTemp.onChainId.selectedOnChainKYCconfiguration) {
          throw new Error('Kindly select a onchain configuration')
        }
        this.widgetConfigTemp.onChainId.selectedOnChainKYCconfiguration = this.widgetConfigTemp.onChainId.selectedOnChainKYCconfiguration.filter(e => !!e)

        if (!this.widgetConfigTemp.zkProof.enabled) {
          throw new Error('Enable ZK Proof to enable onchainId')
        }

      }

      if (this.widgetConfigTemp.zkProof.enabled) {
        if (!this.ageProofCriteria) {
          throw new Error('Kindly specify age criteria to generate proof')
        }
        if (!this.widgetConfigTemp.idOcr.enabled) {
          throw new Error('Age verification requires ID document verification. Please enable ID document verification to proceed.')
        }
      }
    },
    async saveConfiguration() {
      try {
        this.isLoading = true;
        this.syncAgeProof()
        this.syncSelectiveDisclosure()
        this.validateField()
        this.setWidgetConfig(this.configurationPayload())
        await this.createAppsWidgetConfig()
        if (this.widgetConfig) {
          this.widgetConfigTemp = JSON.parse(JSON.stringify(this.widgetConfig))
          this.ensureJurisdictionRules()
        }
        if (this.widgetConfigTemp.isDefault) {
          await this.updateVerifierPageWidgetConfig()
        }
        this.notifySuccess('Widget configuration created successfully')
        this.$router.replace({
          name: 'WidgetConfigDetails',
          params: { appId: this.$route.params.appId, widgetConfigId: this.widgetConfigTemp._id }
        })

      } catch (e) {
        this.notifyErr(e.message)
      } finally {
        this.isLoading = false
      }
    },

    async updateConfiguration() {
      try {
        this.isLoading = true;
        this.setIssuerDetails(true)
        this.syncAgeProof()
        this.syncSelectiveDisclosure()
        this.validateField()

        this.setWidgetConfig(this.configurationPayload(true))
        await this.updateAppsWidgetConfig()
        if (this.widgetConfigTemp.isDefault) {
          await this.updateVerifierPageWidgetConfig()
        }
        if (this.widgetConfig) {
          // this.widgetConfigTemp = { ...this.widgetConfig }
          this.widgetConfigTemp.trustedIssuer = this.widgetConfigTemp.issuerDID ? true : false;
          this.ensureJurisdictionRules()
        }
        this.notifySuccess('Widget configuration updated successfully')
        this.isLoading = false
      } catch (e) {
        this.isLoading = false
        this.notifyErr(e.message)
      }


    },
  }
};
</script>
