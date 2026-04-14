<style scoped>
.detail-card {
  background-color: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  height: 100%;
}

.info-bar {
  background-color: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.info-label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #9ca3af;
  font-weight: 600;
  margin-bottom: 2px;
}

.info-value {
  font-weight: 600;
  color: #374151;
  font-size: 13px;
}

.card-section-title {
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #374151;
  border-bottom: 1px solid #f3f4f6;
  padding-bottom: 10px;
  margin-bottom: 14px;
}

.data-table {
  border-collapse: collapse;
}

.data-table td {
  padding: 6px 4px;
  border: none;
  font-size: 13px;
  font-weight: 400;
  vertical-align: middle;
  color: #4b5563;
}

.data-table td:first-child {
  color: #6b7280;
  width: 48%;
}

.data-table td:last-child {
  font-weight: 500;
  text-align: right;
  word-break: break-word;
  color: #374151;
}

/* scrollable table inside cards */
.card-table-scroll {
  max-height: 240px;
  overflow-y: auto;
  overflow-x: hidden;
  border-radius: 6px;
  padding-right: 8px;
  margin-right: -4px;
}

.card-table-scroll::-webkit-scrollbar {
  width: 3px;
}

.card-table-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.card-table-scroll::-webkit-scrollbar-thumb {
  background: #e5e7eb;
  border-radius: 4px;
}

.card-table-scroll::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

.face-img {
  border-radius: 50%;
  border: 3px solid #e5e7eb;
  width: 120px;
  height: 120px;
  object-fit: cover;
}

.centered-img {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.doc-thumb {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 10px 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: background 0.15s;
}

.doc-thumb:hover {
  background: #f3f4f6;
}

/* ── document zoom modal ──────────────────────────────── */
::v-deep(#zoom-doc .modal-content) {
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

::v-deep(#zoom-doc .modal-header) {
  background: #fff !important;
  border-bottom: 1px solid #f3f4f6;
  padding: 16px 20px;
}

::v-deep(#zoom-doc .modal-title) {
  font-size: 13px;
  font-weight: 700;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  gap: 8px;
}

::v-deep(#zoom-doc .modal-header .close) {
  color: #6b7280;
  font-size: 1.2rem;
  opacity: 0.6;
}

::v-deep(#zoom-doc .modal-header .close:hover) {
  opacity: 1;
}

::v-deep(#zoom-doc .modal-body) {
  background: #f9fafb;
  padding: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}

::v-deep(#zoom-doc .modal-body img) {
  max-width: 100%;
  max-height: 72vh;
  object-fit: contain;
  border-radius: 10px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  background: #fff;
}

.timeline-item {
  position: relative;
  padding: 8px 12px 8px 28px;
  border-left: 2px solid #e5e7eb;
  margin-left: 6px;
  margin-bottom: 4px;
}

.timeline-dot {
  position: absolute;
  left: -7px;
  top: 12px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #6b7280;
  border: 2px solid #fff;
  box-shadow: 0 0 0 2px #e5e7eb;
}

.timeline-step-name {
  font-weight: 600;
  font-size: 13px;
  color: #374151;
}

.timeline-date {
  font-size: 12px;
  color: #9ca3af;
}

.back-link {
  color: #374151;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  text-decoration: none;
}

.back-link:hover {
  text-decoration: underline;
  color: #374151;
}

.breadcrumb-sep {
  color: #d1d5db;
  margin: 0 8px;
  font-size: 12px;
}

.scrollit {
  overflow: hidden;
  max-height: 320px;
}

.scrollit:hover {
  overflow-y: auto;
}

.greyFont {
  color: grey;
}

.info-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
}
</style>

<template>
  <b-container fluid py-3 :class="isContainerShift ? 'homeShift' : 'home'">
    <loadIng
      :active.sync="isLoading"
      :can-cancel="true"
      :is-full-page="fullPage"
    ></loadIng>

    <!-- Breadcrumb + Page Header -->
    <v-row class="">
      <v-col cols="12">
        <div class="d-flex align-items-center mb-2">
          <span class="back-link" @click="goBack">
            <i class="fa fa-arrow-left mr-1"></i>Users
          </span>
          <span class="breadcrumb-sep"><i class="fa fa-angle-right"></i></span>
          <span
            class="text-muted small"
            style="font-family: monospace; cursor: pointer"
            @click="copyToClip(sessionId, 'UserId')"
            title="Click to copy"
            >{{ sessionId }}</span
          >
        </div>

        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h4 class="mb-0 font-weight-bold">User Detail</h4>
            <p class="text-muted small mb-0">KYC verification session details</p>
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- Info Bar -->
    <v-row
      class="d-flex align-items-center justify-content-between"
      v-if="session && session.createdAt"
    >
      <v-col cols="12">
        <div class="info-bar px-4 py-3">
          <div class="row">
            <div class="col-12 col-md-3 mb-2 mb-md-0">
              <div class="info-label">Date</div>
              <div class="info-value">{{ formatDate(session.createdAt) }}</div>
            </div>
            <div class="col-12 col-md-3 mb-2 mb-md-0">
              <div class="info-label">Email</div>
              <div
                class="info-value"
                style="cursor: pointer"
                @click="copyToClip(session.email, 'Email')"
                title="Click to copy"
              >
                {{ session ? stringShortner(session.email, 32) : "-" }}
              </div>
            </div>
            <div class="col-12 col-md-3 mb-2 mb-md-0">
              <div class="info-label">Attempts</div>
              <div class="info-value">{{ session ? session.retryAttempts : "-" }}</div>
            </div>
            <div
              v-if="session && session.status"
              class="col-12 col-md-2 mb-2 mb-md-0 d-flex align-items-center"
            >
              <span v-html="getUserStatus(session.status)" class="ml-2"></span>
            </div>
            <div
              v-if="session && session.status"
              class="col-12 col-md-1 mb-2 mb-md-0 d-flex justify-content-end"
            >
              <button
                @click="downloadKYCReport()"
                title="Download KYC Report"
                class="btn btn-sm btn-outline-secondary info-actions"
                style="border-radius: 0.375rem; font-size: 12px; padding: 4px 8px"
              >
                <i class="fa fa-download mr-1"></i>Report
              </button>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- Detail Cards Grid -->
    <v-row>
      <!-- Personal Information (Passport) -->
      <v-col
        cols="12"
        md="6"
        lg="4"
        id="personal-info"
        v-if="
          userPersonalDataFromUserConsent &&
          Object.keys(userPersonalDataFromUserConsent).length > 0
        "
      >
        <div class="detail-card p-4">
          <div class="card-section-title">
            <i class="fa fa-id-badge mr-2"></i>Personal Information
          </div>
          <div class="card-table-scroll">
            <table class="data-table w-100">
              <tbody>
                <template v-for="eachkey in Object.keys(userPersonalDataFromUserConsent)">
                  <tr v-if="userPersonalDataFromUserConsent[eachkey]" :key="eachkey">
                    <td>{{ eachkey.charAt(0).toUpperCase() + eachkey.substring(1) }}</td>
                    <td>
                      <span v-if="eachkey === 'issuingStateCode'">
                        {{ userPersonalDataFromUserConsent[eachkey] }}
                        <country-flag
                          :country="userPersonalDataFromUserConsent[eachkey]"
                          size="small"
                        />
                      </span>
                      <span v-else>{{
                        formatFieldValue(
                          eachkey,
                          userPersonalDataFromUserConsent[eachkey]
                        )
                      }}</span>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </div>
      </v-col>

      <!-- Personal Information (Gov ID) -->
      <v-col
        cols="12"
        md="6"
        lg="4"
        id="personal-info-gov"
        v-if="
          Object.keys(userPersonalDataFromUserConsent).length === 0 &&
          Object.keys(userPersonalDataGovIdFromUserConsent).length > 0
        "
      >
        <div class="detail-card p-4">
          <div class="card-section-title">
            <i class="fa fa-id-badge mr-2"></i>Personal Information
          </div>
          <div class="card-table-scroll">
            <table class="data-table w-100">
              <tbody>
                <tr
                  v-for="eachkey in Object.keys(userPersonalDataGovIdFromUserConsent)"
                  :key="eachkey"
                >
                  <td>{{ eachkey.charAt(0).toUpperCase() + eachkey.substring(1) }}</td>
                  <td>
                    <span v-if="eachkey === 'issuingStateCode'">
                      {{ userPersonalDataGovIdFromUserConsent[eachkey] }}
                      <country-flag
                        :country="userPersonalDataGovIdFromUserConsent[eachkey]"
                        size="small"
                      />
                    </span>
                    <span v-else>{{
                      formatFieldValue(
                        eachkey,
                        userPersonalDataGovIdFromUserConsent[eachkey]
                      )
                    }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </v-col>

      <!-- Device Information -->
      <v-col
        cols="12"
        md="6"
        lg="4"
        id="device-info"
        v-if="deviceDetails && Object.keys(deviceDetails).length > 0"
      >
        <div class="detail-card p-4">
          <div class="card-section-title">
            <i class="fa fa-laptop mr-2"></i>Device Information
          </div>
          <table class="data-table w-100">
            <tbody>
              <tr>
                <td>Operating System</td>
                <td>{{ deviceDetails.os || "N/A" }}</td>
              </tr>
              <tr>
                <td>OS Version</td>
                <td>{{ deviceDetails.osVer || "N/A" }}</td>
              </tr>
              <tr>
                <td>Browser</td>
                <td>{{ deviceDetails.browser || "N/A" }}</td>
              </tr>
              <tr>
                <td>Device</td>
                <td>{{ deviceDetails.device || "N/A" }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </v-col>

      <!-- Location Information -->
      <v-col
        cols="12"
        md="6"
        lg="4"
        id="location-info"
        v-if="locationDetails && Object.keys(locationDetails).length > 0"
      >
        <div class="detail-card p-4">
          <div class="card-section-title">
            <i class="fa fa-map-marker mr-2"></i>Location Information
          </div>
          <table class="data-table w-100">
            <tbody>
              <tr>
                <td>IP</td>
                <td>{{ locationDetails.ip }}</td>
              </tr>
              <tr>
                <td>Continent</td>
                <td>{{ locationDetails.continentName }}</td>
              </tr>
              <tr>
                <td>Country</td>
                <td>
                  {{ locationDetails.countryName }}
                  <country-flag
                    v-if="locationDetails.countryCode"
                    :country="locationDetails.countryCode"
                    size="small"
                  />
                </td>
              </tr>
              <tr>
                <td>Region</td>
                <td>{{ locationDetails.region }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </v-col>

      <!-- Liveliness Check -->
      <v-col
        cols="12"
        md="6"
        lg="4"
        id="liveliness-info"
        v-if="
          session.selfiDetails &&
          session.selfiDetails.createdAt &&
          Object.keys(session.selfiDetails).length > 0
        "
      >
        <div class="detail-card p-4">
          <div class="card-section-title">
            <i class="fa fa-heartbeat mr-2"></i>Liveliness Check
          </div>
          <div class="centered-img mb-3">
            <img :src="session.selfiDetails.tokenSelfiImage" class="face-img" />
            <span
              v-if="passiveLivelinessData.success"
              style="color: #28a745; font-weight: 600; font-size: 13px"
            >
              <i class="fa fa-check-circle mr-1"></i>Passed
            </span>
            <span v-else style="color: #dc3545; font-weight: 600; font-size: 13px">
              <i class="fa fa-times-circle mr-1"></i>{{ passiveLivelinessData.result }}
            </span>
          </div>
        </div>
      </v-col>

      <!-- Face Authentication -->
      <v-col
        cols="12"
        md="6"
        lg="4"
        id="face-auth-info"
        v-if="
          session.selfiDetails &&
          Object.keys(session.selfiDetails).length > 0 &&
          session.ocriddocsDetails.tokenFaceImage
        "
      >
        <div class="detail-card p-4">
          <div class="card-section-title">
            <i class="fa fa-smile mr-2"></i>Face Authentication
          </div>
          <div
            class="d-flex justify-content-center align-items-center mb-3"
            style="gap: 16px"
          >
            <div class="centered-img">
              <img :src="session.selfiDetails.tokenSelfiImage" class="face-img" />
              <small class="text-muted">Selfie</small>
            </div>
            <div>
              <i
                v-if="isFacialAuthenticationSuccess.success"
                class="fa fa-check-circle fa-2x"
                style="color: #28a745"
              ></i>
              <i v-else class="fa fa-times-circle fa-2x" style="color: #dc3545"></i>
            </div>
            <div class="centered-img">
              <img :src="session.ocriddocsDetails.tokenFaceImage" class="face-img" />
              <small class="text-muted">ID Photo</small>
            </div>
          </div>
          <div
            :class="
              isFacialAuthenticationSuccess.success
                ? 'alert alert-success'
                : 'alert alert-danger'
            "
            role="alert"
            style="
              font-size: 12px;
              padding: 8px 12px;
              border-radius: 6px;
              margin-bottom: 0;
            "
          >
            <i class="fa fa-info-circle mr-1"></i
            >{{ isFacialAuthenticationSuccess.result }}
          </div>
        </div>
      </v-col>

      <!-- Documents -->
      <v-col cols="12" md="6" lg="4" v-if="idDocDataFound">
        <div class="detail-card p-4">
          <div class="card-section-title"><i class="fa fa-file mr-2"></i>Documents</div>
          <div class="d-flex flex-column" style="gap: 10px">
            <div class="doc-thumb" @click="zoomDocument('Document Front')">
              <img
                :src="session.ocriddocsDetails.tokenFrontDocumentImage"
                style="
                  height: 40px;
                  width: 60px;
                  object-fit: cover;
                  border-radius: 4px;
                  border: 1px solid #e5e7eb;
                "
              />
              <div class="flex-grow-1">
                <div style="font-weight: 600; font-size: 13px">Document Front</div>
                <div class="text-muted" style="font-size: 11px">Click to zoom</div>
              </div>
              <i class="fa fa-search-plus text-muted"></i>
            </div>
            <div
              class="doc-thumb"
              v-if="session.ocriddocsDetails.tokenBackDocumentImage"
              @click="zoomDocument('Document Back')"
            >
              <img
                :src="session.ocriddocsDetails.tokenBackDocumentImage"
                style="
                  height: 40px;
                  width: 60px;
                  object-fit: cover;
                  border-radius: 4px;
                  border: 1px solid #e5e7eb;
                "
              />
              <div class="flex-grow-1">
                <div style="font-weight: 600; font-size: 13px">Document Back</div>
                <div class="text-muted" style="font-size: 11px">Click to zoom</div>
              </div>
              <i class="fa fa-search-plus text-muted"></i>
            </div>
          </div>
        </div>
      </v-col>

      <!-- Soul Bound Token -->
      <v-col
        cols="12"
        md="6"
        lg="4"
        v-for="(eachSbtMintData, sbtIndex) in allSbtMintData || []"
        :key="'sbt-' + sbtIndex"
      >
        <div class="detail-card p-4">
          <div class="card-section-title">
            <i class="fa fa-address-book mr-2"></i>Soul Bound Token
          </div>
          <table class="data-table w-100">
            <tbody>
              <tr>
                <td>Credential Type</td>
                <td>{{ `${eachSbtMintData.proofType}SbtCredential` }}</td>
              </tr>
              <tr>
                <td>Blockchain</td>
                <td>
                  <b-avatar
                    :style="{ 'background-color': 'white' }"
                    :src="getChainDetail(eachSbtMintData.blockchainLabel).logoUrl"
                    size="18"
                  ></b-avatar>
                  {{ getChainDetail(eachSbtMintData.blockchainLabel).chainName }}
                </td>
              </tr>
              <tr>
                <td>Wallet Address</td>
                <td
                  style="cursor: pointer"
                  @click="
                    copyToClip(eachSbtMintData.ownerWalletAddress, 'Wallet Address')
                  "
                >
                  {{ stringShortner(eachSbtMintData.ownerWalletAddress, 15) }}
                </td>
              </tr>
              <tr>
                <td>User's DID</td>
                <td
                  style="cursor: pointer"
                  @click="copyToClip(eachSbtMintData.did, 'User Id')"
                >
                  {{ stringShortner(eachSbtMintData.did, 15) }}
                </td>
              </tr>
              <tr v-if="eachSbtMintData.tokenId">
                <td>Token ID</td>
                <td>{{ eachSbtMintData.tokenId }}</td>
              </tr>
              <tr v-if="eachSbtMintData.sbtContractAddress">
                <td>Contract Address</td>
                <td
                  style="cursor: pointer"
                  @click="
                    copyToClip(eachSbtMintData.sbtContractAddress, 'SBT Contract Address')
                  "
                >
                  {{ stringShortner(eachSbtMintData.sbtContractAddress, 15) }}
                </td>
              </tr>
              <tr>
                <td>Transaction Hash</td>
                <td
                  style="cursor: pointer"
                  @click="copyToClip(eachSbtMintData.transactionHash, 'Transaction hash')"
                >
                  {{ stringShortner(eachSbtMintData.transactionHash, 15) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </v-col>
    </v-row>

    <!-- Verification Timeline -->
    <v-row class="mt-2 mb-4">
      <v-col cols="12">
        <div class="detail-card p-4" id="timelines-info">
          <div class="card-section-title">
            <i class="fa fa-hourglass-end mr-2"></i>Verification Timeline
          </div>
          <div class="scrollit">
            <div
              v-for="(step, index) in sortedTimelineDetails"
              :key="index"
              class="timeline-item"
            >
              <div class="timeline-dot"></div>
              <div class="d-flex justify-content-between align-items-center">
                <span class="timeline-step-name">{{ step.stepName }}</span>
                <div class="d-flex align-items-center" style="gap: 8px">
                  <span
                    v-if="step.error"
                    style="
                      background: #fee2e2;
                      color: #dc3545;
                      font-size: 11px;
                      padding: 3px 8px;
                      border-radius: 12px;
                      font-weight: 600;
                    "
                  >
                    <i class="fa fa-times-circle mr-1"></i>{{ step.error }}
                  </span>
                  <span class="timeline-date">{{ formatDate(step.createdAt) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>

    <hf-pop-up id="zoom-doc" :Header="popupHeader" size="md">
      <img :src="popupImage" />
    </hf-pop-up>
  </b-container>
</template>

<script>
import UtilsMixin from "../../mixins/utils";
import { mapState, mapGetters, mapActions } from "vuex";
import UAParser from "ua-parser-js";
import CountryFlag from "vue-country-flag";
import { getCosmosChainConfig } from "@hypersign-protocol/hypersign-kyc-chains-metadata/cosmos/wallet/cosmos-wallet-utils";
import { getStellarChainConfig } from "@hypersign-protocol/hypersign-kyc-chains-metadata/stellar/wallet/stellar-wallet-utils";
import HfPopUp from "../../components/element/hfPopup.vue";
import { HYPERSIGN_PROOF_TYPES } from "@hypersign-protocol/hypersign-kyc-chains-metadata/cosmos/wallet/cosmos-wallet-utils";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts"
pdfMake.vfs = pdfFonts.vfs;

import logoSrc from "../../assets/hypersign_white_rect.png";

const ServiceLivenessResultEnum = {
  0: "None",
  1: "Spoof",
  2: "Uncertain",
  3: "Live",
  4: "Bad quality image",
  5: "Face very close",
  6: "Face not found",
  7: "Face too small",
  8: "Face too large",
  9: "Invalid image format",
  10: "Internal server error",
  11: "Image processing error",
  12: "Too many faces",
  13: "Face too close to edge",
  14: "Face was cropped",
  15: "License error",
  16: "Face is obstructed",
  17: "No life detected",
  18: "Eyes closed",
};

const FaicalAuthenticationError = {
  0: "Face check could not be performed",
  1: "Faces did not match",
  2: "Face not found in the image",
  4: "Failed to perform face check due to the pose of the face",
  5: "Failed due to problems in the extraction of the facial pattern",
  6: "Duplicate document was used",
};

export default {
  name: "sessionDetails",
  components: {
    CountryFlag,
    HfPopUp,
  },
  computed: {
    ...mapGetters("mainStore", ["getSessionDetailsBySessionId"]),
    ...mapState({
      sessionList: (state) => state.mainStore.sessionList,
      containerShift: (state) => state.playgroundStore.containerShift,
    }),
    isFacialAuthenticationSuccess() {
      const status =
        this.selfiDataFound &&
        this.idDocDataFound &&
        this.session.ocriddocsDetails.serviceFacialAuthenticationResult == 3;
      const matchPercentage =
        ", match " +
        Math.round(this.session.ocriddocsDetails.serviceFacialSimilarityResult * 100) +
        "%";
      return {
        success: status,
        result: !status
          ? FaicalAuthenticationError[
              this.session.ocriddocsDetails.serviceFacialAuthenticationResult
            ] + matchPercentage
          : "Facial Authentication Passed" + matchPercentage,
      };
    },
    passiveLivelinessData() {
      const status =
        this.selfiDataFound && this.session.selfiDetails.serviceLivenessResult == 3;
      return {
        success: status,
        result:
          ServiceLivenessResultEnum[this.session.selfiDetails.serviceLivenessResult],
        borderColor: status ? "5px solid rgb(81 137 81 / 20%)" : "5px solid #cd5c5c5e",
      };
    },
    getStatusColor() {
      if (this.isFacialAuthenticationSuccess.success) {
        return "5px solid rgb(81 137 81 / 20%)";
      } else {
        return "5px solid #cd5c5c5e";
      }
    },
    isContainerShift() {
      return this.containerShift;
    },
    selfiDataFound() {
      return (
        this.session.selfiDetails && Object.keys(this.session.selfiDetails).length > 0
      );
    },
    idDocDataFound() {
      return (
        this.session.ocriddocsDetails &&
        Object.keys(this.session.ocriddocsDetails).length > 0
      );
    },
    userConsentDataFound() {
      return (
        this.session.userConsentDetails &&
        Object.keys(this.session.userConsentDetails).length > 0
      );
    },
    sbtDataFound() {
      return this.session.mintsbtsDetails && this.session.mintsbtsDetails.length > 0;
    },
    startFinishDiffInSeconds() {
      if (this.userConsentDataFound) {
        const startDate = new Date(this.session.createdAt);
        const endDate = new Date(this.session.userConsentDetails.createdAt);

        const startEpoch = startDate.getTime();
        const endEpoch = endDate.getTime();

        return parseFloat((endEpoch - startEpoch) / 1000 / 60).toFixed(2);
      } else {
        return 0;
      }
    },
    userPersonalDataFromUserConsent() {
      const d = { ...this.getCredentialSubjectByType("PassportCredential") };
      delete d["face"];
      delete d["overallRating"];
      delete d["id"];
      return d;
    },
    userPersonalDataGovIdFromUserConsent() {
      const d = { ...this.getCredentialSubjectByType("GovernmentIdCredential") };
      delete d["face"];
      delete d["overallRating"];
      delete d["id"];
      return d;
    },
    userSbtMintDataFromUserConsent() {
      // const sbtType =
      // HYPERSIGN_PROOF_TYPES
      const t = this.getCredentialSubjectByType("zkProofOfPersonHoodSbtCredential");
      return t;
    },
    allProofTypeSBTCredentials() {
      const proofTypeSBTCredential = [];
      Object.keys(HYPERSIGN_PROOF_TYPES).forEach((eachProofType) => {
        proofTypeSBTCredential.push(
          this.getCredentialSubjectByType(`${eachProofType}SbtCredential`)
        );
      });
      return proofTypeSBTCredential;
    },
    allSbtMintData() {
      let sbtMintData;
      if (this.sbtDataFound) {
        sbtMintData = this.session.mintsbtsDetails;
      }
      return sbtMintData;
    },
    sortedTimelineDetails() {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      return this.timeLineDetails.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
    },
  },
  data() {
    return {
      breadCrumbsItems: [
        { text: "Session", disabled: false, href: "/session" },
        { text: this.sessionId, disabled: true },
      ],
      fullPage: true,
      isLoading: false,
      appId: "",
      sessionId: "",
      env: "prod",
      session: {},
      popupHeader: "",
      popupImage: "",
      deviceDetails: {
        ip: "",
        os: "",
        osVer: "",
        brower: "",
        device: "",
        cpu: "",
      },
      locationDetails: {},
      timeLineDetails: [],
      locationMap: {
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        attribution:
          '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        zoom: 15,
        center: [51.505, -0.159],
        markerLatLng: [51.504, -0.159],
      },
    };
  },

  async created() {
    this.appId = this.$route.params.appId;
    this.sessionId = this.$route.params.sessionId;
    const service = this.$store.getters["mainStore/getSelectedService"];

    this.env = service?.env || "prod";

    try {
      this.isLoading = true;
      this.session = await this.fetchSessionsDetailsById({
        sessionId: this.sessionId,
        env: this.env,
      });

      this.isLoading = false;
      this.getCredentialSubjectByType();

      if (this.session.deviceDetails) {
        const userAgentString = this.session.deviceDetails.userAgent;

        if (userAgentString) {
          const uaparser = new UAParser();
          uaparser.setUA(userAgentString);
          const details = {
            os: uaparser.getOS().name,
            osVer: uaparser.getOS().version,
            browser: uaparser.getBrowser().name,
            device: uaparser.getDevice().model,
            cpu: uaparser.getCPU().architecture,
          };
          Object.assign(this.deviceDetails, { ...details });

          if (this.session.deviceDetails.locationDetail) {
            Object.assign(this.locationDetails, {
              ...this.session.deviceDetails.locationDetail,
            });
          }
        }
      }

      if (this.session.timeLineDetails) {
        this.timeLineDetails = this.session.timeLineDetails.map((item) => {
          const newItem = { ...item };

          if (newItem.step_name === "liveliness" || newItem.stepName === "liveliness") {
            newItem.stepName = "Selfie uploaded";
            if ("result" in newItem) {
              if (newItem.result != 3)
                newItem.error = ServiceLivenessResultEnum[newItem.result] || null;
            }
          }

          if (newItem.step_name === "start" || newItem.stepName === "start") {
            newItem.stepName = "Start";
          }

          if (newItem.step_name === "userConsent" || newItem.stepName === "userConsent") {
            newItem.stepName = "User Consent";
          }

          if (newItem.step_name === "ocrIdDoc" || newItem.stepName === "ocrIdDoc") {
            newItem.stepName = "Document uploaded";
            if ("result" in newItem) {
              newItem.error = FaicalAuthenticationError[newItem.result] || null;
            }
          }

          return newItem;
        });
      }
    } catch (e) {
      this.notifyErr(e.message);
      this.isLoading = false;
      this.$router.go(-1);
    }
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.prevRoute = from;
    });
  },
  methods: {
    ...mapActions("mainStore", ["fetchSessionsDetailsById"]),
    formatDate(date) {
      if (!date) return "-";
      const d = new Date(date);
      return d.toLocaleString(); // Customize formatting if needed
    },
    formatFieldValue(key, value) {
      if (!value && value !== 0) return value;
      const dateKeys = /date|dob|birth|expir|issued|valid/i;
      if (dateKeys.test(key)) {
        // Unix seconds (10 digits) or milliseconds (13 digits)
        const num = Number(value);
        if (
          !isNaN(num) &&
          String(value)
            .trim()
            .match(/^\d{9,13}$/)
        ) {
          const ms = String(value).length === 10 ? num * 1000 : num;
          const d = new Date(ms);
          if (!isNaN(d.getTime())) {
            return d.toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            });
          }
        }
      }
      return value;
    },
    async downloadKYCReport() {
      try {
        this.isLoading = true;

        // ── colours ──────────────────────────────────────────────────
        const navy = "#1c2336";
        const purple = "#905ab0";
        const dark = "#1e1e1e";
        const mid = "#646e7d";
        const light = "#f5f6f8";
        const bord = "#e5e7eb";
        const grn = "#27ae60";
        const rd = "#dc3545";
        const white = "#ffffff";
        const amber = "#d97706";

        // ── register custom pdfmake table layouts ─────────────────────
        pdfMake.tableLayouts = {
          // zebra-striped data rows, no outer borders
          kycTable: {
            hLineWidth: (i, node) => (i === 0 || i === node.table.body.length ? 0 : 0.4),
            vLineWidth: () => 0,
            hLineColor: () => bord,
            paddingLeft: (i) => (i === 0 ? 12 : 8),
            paddingRight: (i, node) => (i === node.table.widths.length - 1 ? 12 : 8),
            paddingTop: () => 7,
            paddingBottom: () => 7,
            fillColor: (rowIndex) => (rowIndex % 2 === 0 ? light : white),
          },
          // stat cards in the metadata bar – vertical dividers only
          statBar: {
            hLineWidth: () => 0,
            vLineWidth: (i, node) =>
              i === 0 || i === node.table.widths.length ? 0 : 0.5,
            vLineColor: () => bord,
            paddingLeft: () => 16,
            paddingRight: () => 16,
            paddingTop: () => 14,
            paddingBottom: () => 14,
            fillColor: () => light,
          },
          // verification result strip – left accent only via canvas
          resultLayout: {
            hLineWidth: () => 0,
            vLineWidth: () => 0,
            paddingLeft: () => 12,
            paddingRight: () => 12,
            paddingTop: () => 8,
            paddingBottom: () => 8,
            fillColor: () => light,
          },
        };

        // ── helpers ──────────────────────────────────────────────────
        const toBase64 = (url) =>
          new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => {
              const c = document.createElement("canvas");
              c.width = img.naturalWidth;
              c.height = img.naturalHeight;
              c.getContext("2d").drawImage(img, 0, 0);
              resolve(c.toDataURL("image/jpeg", 0.85));
            };
            img.onerror = () => resolve(null);
            img.src = url;
          });
        const toBase64Png = (url) =>
          new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => {
              const c = document.createElement("canvas");
              c.width = img.naturalWidth;
              c.height = img.naturalHeight;
              c.getContext("2d").drawImage(img, 0, 0);
              resolve(c.toDataURL("image/png"));
            };
            img.onerror = () => resolve(null);
            img.src = url;
          });

        const statusColor = (s) =>
          s === "Completed" ? grn : s === "Failed" ? rd : amber;

        // section header with purple left-accent bar
        const sectionTitle = (text) => ({
          columns: [
            {
              canvas: [{ type: "rect", x: 0, y: 1, w: 3, h: 11, color: purple, r: 1 }],
              width: 8,
            },
            {
              text: text.toUpperCase(),
              bold: true,
              fontSize: 9,
              color: navy,
              letterSpacing: 0.5,
              margin: [4, 1, 0, 0],
            },
          ],
          columnGap: 0,
          margin: [0, 16, 0, 4],
        });

        // full-width hairline separator
        const divider = () => ({
          canvas: [
            {
              type: "line",
              x1: 0,
              y1: 0,
              x2: 515,
              y2: 0,
              lineWidth: 0.4,
              lineColor: bord,
            },
          ],
          margin: [0, 0, 0, 8],
        });

        // two-column key/value table using custom kycTable layout
        const dataTable = (rows) => ({
          table: {
            widths: ["42%", "58%"],
            body: rows.map(([label, value]) => [
              { text: String(label), color: mid, fontSize: 8 },
              { text: String(value ?? "—"), color: dark, fontSize: 8, bold: true },
            ]),
          },
          layout: "kycTable",
          margin: [0, 2, 0, 6],
        });

        // pill-shaped PASSED / FAILED badge
        const pill = (passed) => ({
          table: {
            widths: ["*"],
            body: [
              [
                {
                  text: passed ? " PASSED " : " FAILED ",
                  fontSize: 7,
                  bold: true,
                  color: white,
                  fillColor: passed ? grn : rd,
                  border: [false, false, false, false],
                  alignment: "center",
                },
              ],
            ],
          },
          layout: "noBorders",
          margin: [0, 0, 0, 0],
        });

        // verification result row (uses resultLayout)
        const verifyRow = (label, passed, detail) => [
          {
            table: {
              widths: ["*", 54],
              body: [
                [
                  {
                    text: label,
                    fontSize: 8.5,
                    color: dark,
                    border: [false, false, false, false],
                  },
                  {
                    text: passed ? "PASSED" : "FAILED",
                    fontSize: 7,
                    bold: true,
                    color: white,
                    fillColor: passed ? grn : rd,
                    border: [false, false, false, false],
                    alignment: "center",
                    margin: [0, 2, 0, 2],
                  },
                ],
              ],
            },
            layout: "resultLayout",
            margin: [0, 2, 0, 0],
          },
          ...(detail && !passed
            ? [
                {
                  text: detail,
                  fontSize: 7.5,
                  color: rd,
                  italics: true,
                  margin: [12, 2, 0, 6],
                },
              ]
            : [{ text: "", margin: [0, 0, 0, 4] }]),
        ];

        // small label above a bold value (for stat bar cells)
        const statCell = (label, value, valueColor) => ({
          stack: [
            { text: label.toUpperCase(), fontSize: 6.5, color: mid, bold: true },
            {
              text: String(value ?? "—"),
              fontSize: 10,
              bold: true,
              color: valueColor || dark,
              margin: [0, 3, 0, 0],
            },
          ],
        });

        // break a long string (no spaces) into lines so it fits in PDF columns
        const breakLong = (str, chunk = 30) => {
          if (!str) return "—";
          const s = String(str);
          if (s.length <= chunk) return s;
          const parts = [];
          for (let i = 0; i < s.length; i += chunk) parts.push(s.slice(i, i + chunk));
          return parts.join("\n");
        };

        const stepStatusColor = (status) => {
          if (status === "completed") return grn;
          if (status === "in-progress") return amber;
          return bord;
        };

        const stepStatusLabel = (status) => {
          if (status === "completed") return "Completed";
          if (status === "in-progress") return "In Progress";
          return "Not Started";
        };

        const isStepCompletedValue = (value) => value === 1 || value === "1";
        const isStepPendingValue = (value) => value === 0 || value === "0";

        const getPdfStepStatus = (stepProperty) => {
          const currentSessionStatus = this.session.status || "Unknown";
          const isPendingSession = ["Pending", "In Progress"].includes(
            currentSessionStatus
          );
          if (!(stepProperty in this.session)) return "not-started";
          if (isStepCompletedValue(this.session[stepProperty])) return "completed";
          if (isStepPendingValue(this.session[stepProperty]) && isPendingSession) {
            return "in-progress";
          }
          return "not-started";
        };

        const pdfStepDefinitions = [
          { key: "step_start", label: "Start", title: "Session Started" },
          { key: "step_liveliness", label: "Liveness", title: "Liveness Check" },
          { key: "step_ocrIdVerification", label: "Document", title: "Document Verification" },
          { key: "step_userConsent", label: "Consent", title: "User Consent" },
          { key: "step_finish", label: "Done", title: "Completed" },
        ].map((step) => ({
          ...step,
          status: getPdfStepStatus(step.key),
        }));

        const completedPdfSteps = pdfStepDefinitions.filter(
          (step) => step.status === "completed"
        ).length;
        const progressPct = Math.round(
          (completedPdfSteps / pdfStepDefinitions.length) * 100
        );

        const stepMetaCell = (label, value, color = dark) => ({
          stack: [
            { text: label.toUpperCase(), fontSize: 6.5, color: mid, bold: true },
            {
              text: String(value ?? "—"),
              fontSize: 10,
              bold: true,
              color,
              margin: [0, 3, 0, 0],
            },
          ],
        });

        const stepTrackNode = (step) => {
          // cx is the circle center in the 66pt column, r=8
          const cx = 33;
          const cy = 9;
          const r  = 8;
          const fill = stepStatusColor(step.status);

          const shapes = [
            { type: "ellipse", x: cx, y: cy, r1: r, r2: r, color: fill },
          ];

          if (step.status === "completed") {
            // white checkmark
            shapes.push(
              { type: "line", x1: cx - 4, y1: cy + 0.5, x2: cx - 1, y2: cy + 3.5, lineWidth: 1.8, lineColor: white },
              { type: "line", x1: cx - 1, y1: cy + 3.5, x2: cx + 5, y2: cy - 3,   lineWidth: 1.8, lineColor: white }
            );
          } else if (step.status === "in-progress") {
            // three white dots
            shapes.push(
              { type: "ellipse", x: cx - 4, y: cy, r1: 1.3, r2: 1.3, color: white },
              { type: "ellipse", x: cx,     y: cy, r1: 1.3, r2: 1.3, color: white },
              { type: "ellipse", x: cx + 4, y: cy, r1: 1.3, r2: 1.3, color: white }
            );
          } else {
            // grey dash
            shapes.push(
              { type: "line", x1: cx - 4, y1: cy, x2: cx + 4, y2: cy, lineWidth: 1.8, lineColor: "#9ca3af" }
            );
          }

          return {
            width: 66,
            stack: [
              { canvas: shapes, margin: [0, 0, 0, 3] },
              { text: step.label, fontSize: 7, bold: true, color: dark, alignment: "center" },
              {
                text: stepStatusLabel(step.status),
                fontSize: 6,
                color: step.status === "completed" ? grn : step.status === "in-progress" ? amber : mid,
                alignment: "center",
                margin: [0, 1, 0, 0],
              },
            ],
          };
        };

        const stepTrackLine = (done) => ({
          width: "*",
          canvas: [
            {
              type: "line",
              x1: 0,
              y1: 9,
              x2: 40,
              y2: 9,
              lineWidth: 1.5,
              lineColor: done ? grn : bord,
            },
          ],
          margin: [0, 0, 0, 0],
        });

        const stepTrackColumns = pdfStepDefinitions.flatMap((step, index) => {
          const columns = [stepTrackNode(step)];
          if (index < pdfStepDefinitions.length - 1) {
            columns.push(stepTrackLine(step.status === "completed"));
          }
          return columns;
        });

        // ── load images ───────────────────────────────────────────────
        const selfieUrl = this.session.selfiDetails?.tokenSelfiImage;
        const faceUrl = this.session.ocriddocsDetails?.tokenFaceImage;
        const frontUrl = this.session.ocriddocsDetails?.tokenFrontDocumentImage;
        const backUrl = this.session.ocriddocsDetails?.tokenBackDocumentImage;

        const [selfieB64, faceB64, frontB64, backB64] = await Promise.all([
          selfieUrl ? toBase64(selfieUrl) : Promise.resolve(null),
          faceUrl ? toBase64(faceUrl) : Promise.resolve(null),
          frontUrl ? toBase64(frontUrl) : Promise.resolve(null),
          backUrl ? toBase64(backUrl) : Promise.resolve(null),
        ]);

        // embed project logo in PDF header
        const logoPng = await toBase64Png(logoSrc);

        // ── data extraction ───────────────────────────────────────────
        const personalData =
          Object.keys(this.userPersonalDataFromUserConsent).length > 0
            ? this.userPersonalDataFromUserConsent
            : this.userPersonalDataGovIdFromUserConsent;

        const personalRows = Object.entries(personalData)
          .filter(([, v]) => v)
          .map(([k, v]) => {
            let value = v;

            // Convert Unix timestamp → readable date
            if (typeof value === "number") {
              const ts = value.toString().length === 10 ? value * 1000 : value;
              const date = new Date(ts);

              if (!isNaN(date.getTime())) {
                value = date.toLocaleString("en-IN"); // better for India
              }
            }

            // Decode ONLY if string contains unicode escape sequences
            if (typeof value === "string" && /\\u[0-9a-fA-F]{4}/.test(value)) {
              try {
                value = JSON.parse(`"${value}"`);
              } catch {
                // ignore if parsing fails
              }
            }

            return [
              k.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase()),
              String(value),
            ];
          });
          
        const livePass = this.passiveLivelinessData.success;
        const liveLabel = this.passiveLivelinessData.result || "—";
        const liveScore = this.session.selfiDetails?.serviceLivenessResult ?? "—";

        const facePass = this.isFacialAuthenticationSuccess.success;
        const faceDetail = this.isFacialAuthenticationSuccess.result;
        const matchPct = Math.round(
          (this.session.ocriddocsDetails?.serviceFacialSimilarityResult || 0) * 100
        );

        const sessionStatus = this.session.status || "Unknown";

        // actual session UUID lives in timeLineDetails entries; this.sessionId is the userId hash

        // duration: prefer userConsent diff, fall back to completedAt - createdAt

        // timeline rows
        const tlRows = (this.sortedTimelineDetails || []).map((step, i) => {
          const isLast = i === this.sortedTimelineDetails.length - 1;
          return {
            columns: [
              {
                stack: [
                  {
                    canvas: [
                      {
                        type: "ellipse",
                        x: 6,
                        y: 6,
                        r1: 5,
                        r2: 5,
                        color: step.error ? rd : "#905ab0",
                      },
                      ...(!isLast
                        ? [
                            {
                              type: "line",
                              x1: 6,
                              y1: 11,
                              x2: 6,
                              y2: 22,
                              lineWidth: 1,
                              lineColor: bord,
                            },
                          ]
                        : []),
                    ],
                  },
                ],
                width: 18,
              },
              {
                stack: [
                  { text: step.stepName || "", fontSize: 8.5, bold: true, color: dark },
                  ...(step.error
                    ? [
                        {
                          text: step.error,
                          fontSize: 7.5,
                          color: rd,
                          italics: true,
                          margin: [0, 2, 0, 0],
                        },
                      ]
                    : []),
                ],
                width: "*",
              },
              {
                text: this.formatDate(step.createdAt),
                fontSize: 7.5,
                color: mid,
                alignment: "right",
                width: 120,
              },
            ],
            columnGap: 6,
            margin: [0, 0, 0, step.error ? 10 : 6],
          };
        });

        // ── document definition ───────────────────────────────────────
        const dd = {
          pageSize: "A4",
          pageMargins: [36, 70, 36, 52],

          // purple accent stripe on every page; full navy block on page 1 only
          background: (currentPage, pageSize) => {
            if (currentPage === 1) {
              return {
                canvas: [
                  { type: "rect", x: 0, y: 0, w: pageSize.width, h: 67, color: navy },
                  { type: "rect", x: 0, y: 67, w: pageSize.width, h: 3, color: purple },
                ],
              };
            }
            return {
              canvas: [
                { type: "rect", x: 0, y: 0, w: pageSize.width, h: 3, color: purple },
              ],
            };
          },

          // persistent branded header — full on page 1, compact on pages 2+
          header: (currentPage) => {
            if (currentPage === 1) {
              return {
                margin: [36, 8, 36, 0],
                columns: [
                  {
                    stack: [{ image: logoPng, width: 180, margin: [0, 0, 0, 4] }],
                    width: "*",
                  },
                  {
                    stack: [
                      {
                        text: "ID Verification Report",
                        bold: true,
                        fontSize: 12,
                        color: white,
                        alignment: "right",
                      },
                      {
                        text: new Date().toLocaleString(),
                        fontSize: 7,
                        color: "#8892a4",
                        alignment: "right",
                        margin: [0, 3, 0, 0],
                      },
                    ],
                    width: "auto",
                  },
                ],
              };
            }
            return {
              margin: [36, 8, 36, 0],
              columns: [],
            };
          },

          footer: (currentPage, pageCount, pageSize) => ({
            margin: [36, 8, 36, 10],
            stack: [
              {
                canvas: [
                  {
                    type: "line",
                    x1: 0,
                    y1: 0,
                    x2: pageSize.width - 72,
                    y2: 0,
                    lineWidth: 0.4,
                    lineColor: bord,
                  },
                ],
                margin: [0, 0, 0, 5],
              },
              {
                columns: [
                  {
                    text:
                      "CONFIDENTIAL \u2014 Hypersign Identity \u00B7 ID Verification Report",
                    fontSize: 7,
                    color: mid,
                    width: "*",
                  },
                  {
                    text: `Page ${currentPage} of ${pageCount}`,
                    fontSize: 7,
                    color: mid,
                    bold: true,
                    alignment: "right",
                    width: "auto",
                  },
                ],
              },
            ],
          }),

          content: [
            // ════════════════ STAT BAR ════════════════
            // user ID first (full width)
            ...(this.session.userId
              ? [
                  {
                    table: {
                      widths: ["*"],
                      body: [
                        [
                          {
                            stack: [
                              { text: "USER ID", fontSize: 6.5, color: mid, bold: true },
                              {
                                text: this.session.userId || "—",
                                fontSize: 7.5,
                                bold: true,
                                color: dark,
                                margin: [0, 3, 0, 0],
                              },
                            ],
                          },
                        ],
                      ],
                    },
                    layout: "statBar",
                    margin: [0, 12, 0, 0],
                  },
                ]
              : []),
            // date + status
            {
              table: {
                widths: ["*", "*"],
                body: [
                  [
                    statCell("Date", this.formatDate(this.session.createdAt)),
                    statCell("Status", sessionStatus, statusColor(sessionStatus)),
                  ],
                ],
              },
              layout: "statBar",
              margin: [0, 0, 0, 0],
            },
            // email (full width)
            {
              table: {
                widths: ["*"],
                body: [
                  [
                    statCell("Email", this.session.email || "—"),
                  ],
                ],
              },
              layout: "statBar",
              margin: [0, 0, 0, 0],
            },
            // completedAt (full width)
            {
              table: {
                widths: ["*"],
                body: [
                  [
                    {
                      stack: [
                        { text: "COMPLETED AT", fontSize: 6.5, color: mid, bold: true },
                        {
                          text: this.formatDate(this.session.completedAt) || "—",
                          fontSize: 8,
                          bold: true,
                          color: dark,
                          margin: [0, 3, 0, 0],
                        },
                      ],
                    },
                  ],
                ],
              },
              layout: "statBar",
              margin: [0, 0, 0, 4],
            },

            // ════════════════ VERIFICATION STEPS PROGRESS ════════════════
            {
              stack: [
                sectionTitle("Verification Steps"),
                divider(),
                {
                  table: {
                    widths: ["*", "*", "*"],
                    body: [[
                      stepMetaCell("Progress", `${progressPct}%`),
                      stepMetaCell("Retries", this.session.retryAttempts ?? 0),
                      stepMetaCell("Status", sessionStatus, statusColor(sessionStatus)),
                    ]],
                  },
                  layout: "statBar",
                  margin: [0, 2, 0, 10],
                },
                {
                  columns: stepTrackColumns,
                  columnGap: 0,
                  margin: [0, 6, 0, 10],
                },
              ],
              unbreakable: true,
            },

            // ════════════════ PERSONAL INFORMATION ════════════════
            ...(personalRows.length > 0
              ? [sectionTitle("Personal Information"), divider(), dataTable(personalRows)]
              : []),

            // ════════════════ DEVICE & LOCATION ════════════════
            ...(this.deviceDetails?.os || Object.keys(this.locationDetails).length > 0
              ? [
                  {
                    stack: [
                      sectionTitle("Device & Location"),
                      divider(),
                      {
                        columns: [
                      // device column
                      ...(this.deviceDetails?.os
                        ? [
                            {
                              stack: [
                                {
                                  text: "Device Information",
                                  fontSize: 8,
                                  bold: true,
                                  color: mid,
                                  margin: [0, 0, 0, 4],
                                },
                                dataTable([
                                  [
                                    "Operating System",
                                    `${this.deviceDetails.os || "N/A"} ${
                                      this.deviceDetails.osVer || ""
                                    }`.trim(),
                                  ],
                                  ["Browser", this.deviceDetails.browser || "N/A"],
                                  ["Device", this.deviceDetails.device || "N/A"],
                                  ["CPU", this.deviceDetails.cpu || "N/A"],
                                ]),
                              ],
                              width: "50%",
                            },
                          ]
                        : []),
                      // location column
                      ...(Object.keys(this.locationDetails).length > 0
                        ? [
                            {
                              stack: [
                                {
                                  text: "Location Information",
                                  fontSize: 8,
                                  bold: true,
                                  color: mid,
                                  margin: [0, 0, 0, 4],
                                },
                                dataTable([
                                  ["IP Address", this.locationDetails.ip || "—"],
                                  ["Country", this.locationDetails.countryName || "—"],
                                  [
                                    "Continent",
                                    this.locationDetails.continentName || "—",
                                  ],
                                  ["Region", this.locationDetails.region || "—"],
                                ]),
                              ],
                              width: "50%",
                            },
                          ]
                        : []),
                    ],
                    columnGap: 12,
                      },
                    ],
                    unbreakable: true,
                  },
                ]
              : []),

            // ════════════════ LIVENESS CHECK ════════════════
            ...(this.selfiDataFound
              ? [
                  {
                    stack: [
                      sectionTitle("Liveness Check"),
                      divider(),
                      {
                    columns: [
                      // selfie image
                      ...(selfieB64
                        ? [
                            {
                              stack: [
                                {
                                  image: selfieB64,
                                  width: 96,
                                  height: 96,
                                  alignment: "center",
                                },
                                {
                                  text: "Captured Selfie",
                                  fontSize: 7,
                                  color: mid,
                                  alignment: "center",
                                  margin: [0, 4, 0, 0],
                                },
                              ],
                              width: 110,
                            },
                          ]
                        : []),
                      // results
                      {
                        stack: [
                          {
                            table: {
                              widths: ["*"],
                              body: [
                                [
                                  {
                                    stack: [
                                      {
                                        text: livePass
                                          ? "✓  Live Person Detected"
                                          : "✗  Liveness Check Failed",
                                        bold: true,
                                        fontSize: 11,
                                        color: livePass ? grn : rd,
                                      },
                                      {
                                        text: `Score: ${liveScore}  |  Result: ${liveLabel}`,
                                        fontSize: 8,
                                        color: mid,
                                        margin: [0, 4, 0, 0],
                                      },
                                    ],
                                    border: [false, false, false, false],
                                    fillColor: livePass ? "#f0faf4" : "#fff5f5",
                                    margin: [10, 10, 10, 10],
                                  },
                                ],
                              ],
                            },
                            layout: "noBorders",
                            margin: [0, 0, 0, 8],
                          },
                          pill(livePass),
                        ],
                        width: "*",
                        margin: [12, 0, 0, 0],
                      },
                    ],
                    columnGap: 0,
                        margin: [0, 4, 0, 16],
                      },
                    ],
                    unbreakable: true,
                  },
                ]
              : []),

            // ════════════════ FACE AUTHENTICATION ════════════════
            ...(this.selfiDataFound && this.idDocDataFound
              ? [
                  {
                    stack: [
                      sectionTitle("Face Authentication"),
                      divider(),
                      // three-column: selfie — match result — id photo
                      {
                    columns: [
                      {
                        stack: [
                          ...(selfieB64
                            ? [{ image: selfieB64, width: 90, height: 90 }]
                            : [
                                {
                                  canvas: [
                                    {
                                      type: "rect",
                                      x: 0,
                                      y: 0,
                                      w: 90,
                                      h: 90,
                                      color: light,
                                    },
                                  ],
                                },
                              ]),
                          {
                            text: "Live Selfie",
                            fontSize: 7.5,
                            color: mid,
                            alignment: "center",
                            margin: [0, 5, 0, 0],
                          },
                        ],
                        alignment: "center",
                        width: 100,
                      },
                      {
                        stack: [
                          {
                            text: `${matchPct}%`,
                            bold: true,
                            fontSize: 22,
                            color: matchPct >= 80 ? grn : rd,
                            alignment: "center",
                          },
                          {
                            text: "Similarity",
                            fontSize: 7.5,
                            color: mid,
                            alignment: "center",
                          },
                          {
                            canvas: [
                              {
                                type: "line",
                                x1: 10,
                                y1: 0,
                                x2: 70,
                                y2: 0,
                                lineWidth: 0.4,
                                lineColor: bord,
                              },
                            ],
                            margin: [0, 8, 0, 8],
                          },
                          {
                            text: facePass ? "✓ MATCH" : "✗ NO MATCH",
                            bold: true,
                            fontSize: 9,
                            color: facePass ? grn : rd,
                            alignment: "center",
                          },
                        ],
                        width: "*",
                        margin: [0, 16, 0, 0],
                      },
                      {
                        stack: [
                          ...(faceB64
                            ? [{ image: faceB64, width: 90, height: 90 }]
                            : [
                                {
                                  canvas: [
                                    {
                                      type: "rect",
                                      x: 0,
                                      y: 0,
                                      w: 90,
                                      h: 90,
                                      color: light,
                                    },
                                  ],
                                },
                              ]),
                          {
                            text: "ID Photo",
                            fontSize: 7.5,
                            color: mid,
                            alignment: "center",
                            margin: [0, 5, 0, 0],
                          },
                        ],
                        alignment: "center",
                        width: 100,
                      },
                    ],
                    columnGap: 8,
                        margin: [0, 4, 0, 10],
                      },
                      ...verifyRow(
                        "Face Authentication Overall Result",
                        facePass,
                        faceDetail
                      ),
                    ],
                    unbreakable: true,
                  },
                ]
              : []),

            // ════════════════ SOUL BOUND TOKENS ════════════════
            ...(this.allSbtMintData?.length > 0
              ? [
                  {
                    stack: [
                      sectionTitle("Soul Bound Tokens"),
                      divider(),
                      ...this.allSbtMintData.map((sbt, idx) => ({
                        stack: [
                          ...(this.allSbtMintData.length > 1
                            ? [
                                {
                                  text: `Token ${idx + 1}`,
                                  fontSize: 8,
                                  color: mid,
                                  bold: true,
                                  margin: [0, 0, 0, 4],
                                },
                              ]
                            : []),
                          dataTable([
                            ["Credential Type", `${sbt.proofType}SbtCredential`],
                            ["Blockchain", sbt.blockchainLabel || "—"],
                            ["Wallet Address", breakLong(sbt.ownerWalletAddress || "—", 26)],
                            ["User DID", breakLong(sbt.did || "—", 26)],
                            ...(sbt.tokenId ? [["Token ID", String(sbt.tokenId)]] : []),
                            ...(sbt.transactionHash
                              ? [["Transaction Hash", breakLong(sbt.transactionHash, 26)]]
                              : []),
                            ...(sbt.sbtContractAddress
                              ? [["Contract Address", breakLong(sbt.sbtContractAddress, 26)]]
                              : []),
                          ]),
                        ],
                      })),
                    ],
                    unbreakable: true,
                  },
                ]
              : []),
            // ════════════════ DOCUMENT IMAGES (new page) ═══════════
            ...(frontB64 || backB64
              ? [
                  { ...sectionTitle("Identity Document Images"), pageBreak: "before" },
                  divider(),
                  ...(frontB64
                    ? [
                        {
                          text: "Front Side",
                          fontSize: 8,
                          bold: true,
                          color: mid,
                          margin: [0, 4, 0, 8],
                        },
                        {
                          image: frontB64,
                          width: 300,
                          alignment: "center",
                          margin: [0, 0, 0, 20],
                        },
                      ]
                    : []),
                  ...(backB64
                    ? [
                        {
                          text: "Back Side",
                          fontSize: 8,
                          bold: true,
                          color: mid,
                          margin: [0, 4, 0, 8],
                        },
                        {
                          image: backB64,
                          width: 300,
                          alignment: "center",
                          margin: [0, 0, 0, 20],
                        },
                      ]
                    : []),
                ]
              : []),
            // ════════════════ VERIFICATION TIMELINE ════════════════
            ...(tlRows.length > 0
              ? [sectionTitle("Verification Timeline"), divider(), ...tlRows]
              : []),
          ],

          defaultStyle: { font: "Roboto", fontSize: 9, lineHeight: 1.35, color: dark },
        };

        pdfMake
          .createPdf(dd)
          .download(
            `KYC-Report-${
              this.session.userId || this.sessionId || "session"
            }-${Date.now()}.pdf`
          );
        this.isLoading = false;
      } catch (err) {
        this.isLoading = false;
        console.error("Error generating PDF:", err);
        this.notifyErr(err.message);
      }
    },
    goBack() {
      this.$router.push({
        name: "playgroundCredential",
      });
    },

    getChainDetail(blockchainlabel = "cosmos:comdex:test") {
      // console.log('Inside get chain details.... ' + JSON.stringify(blockchainlabel))
      // const config = getCosmosChainConfig(blockchainlabel)

      let config;
      if (blockchainlabel.indexOf("cosmos") >= 0) {
        config = getCosmosChainConfig(blockchainlabel);
      } else {
        config = getStellarChainConfig(blockchainlabel);
      }

      return {
        chainName: config.chainName,
        chainId: config.chainId,
        logoUrl: config.stakeCurrency.coinImageUrl,
        tx_explorer: config.txExplorer.txUrl,
      };
    },
    getCredentialSubjectByType(type) {
      if (this.userConsentDataFound) {
        const presentationStr = this.session.userConsentDetails.presentation;
        if (presentationStr) {
          const presentation = JSON.parse(presentationStr);
          if (presentation?.verifiableCredential?.length) {
            const credential = presentation.verifiableCredential.find((x) =>
              x.type?.includes(type)
            );
            return credential?.credentialSubject || {};
          }
        }
      }
      return {};
    },
    zoomDocument(place) {
      this.popupHeader = place;
      switch (place) {
        case "Document Front": {
          this.popupImage = this.session.ocriddocsDetails.tokenFrontDocumentImage;
          break;
        }
        case "Selfie": {
          this.popupImage = this.session.selfiDetails.tokenSelfiImage;
          break;
        }
        case "Document Back": {
          this.popupImage = this.session.ocriddocsDetails.tokenBackDocumentImage;
          break;
        }
      }
      this.$root.$emit("bv::show::modal", "zoom-doc");
    },
  },
  mixins: [UtilsMixin],
};
</script>
