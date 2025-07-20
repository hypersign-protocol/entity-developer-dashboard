<style scoped>
.card-header {
    background: aliceblue;
    padding: 0px;
}

img {
    border-radius: 10px;
    border: 2px solid lightgrey
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


.greyFont {
    color: grey
}


.centered-container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    /* Set a height to make it full height, adjust as needed */
}

ul.timeline {
    list-style-type: none;
    /* position: relative; */
}

ul.timeline:before {
    content: ' ';
    background: #d4d9df;
    display: inline-block;
    position: absolute;
    left: 29px;
    width: 2px;
    height: 100%;
    z-index: 400;
}

ul.timeline>li {
    margin: 20px 0;
    padding-left: 20px;
}

ul.timeline>li:before {
    content: ' ';
    background: white;
    display: inline-block;
    position: absolute;
    border-radius: 50%;
    border: 2px solid rgb(164, 163, 163);
    background-color: rgba(36, 35, 35, 0.819);
    left: 20px;
    width: 20px;
    height: 20px;
    z-index: 400;
}

.container {
    width: 80vw;
}

.dataCard {
    float: left;
    margin-top: 1%;
    margin-right: 1%;
    padding: 5px;
    min-height: 360px;
    max-height: 360px;
    max-width: 350px;
}

/* .dataCard {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin: 1% auto;
  padding: 16px;
  width: 100%;
  max-width: 350px;
  box-sizing: border-box;
} */

.f-sm {
    font-size: smaller;
}

.text-align-right {
    text-align: right
}


h3 {
    font-size: 1rem;
}

/*1rem = 16px*/
@media (min-width: 544px) {
    h3 {
        font-size: 1rem;
    }

    /*1rem = 16px*/
}

@media (min-width: 768px) {
    h3 {
        font-size: 1rem;
    }

    /*1rem = 16px*/
}

@media (min-width: 992px) {
    h3 {
        font-size: 1rem;
    }

    /*1rem = 16px*/
}

@media (min-width: 950px) and (max-width:1100px) {
    h3 {
        font-size: 1.5rem;
    }
}

@media (min-width: 1200px) {
    h3 {
        font-size: 2rem;
    }

    /*1rem = 16px*/
}

.zoomin {
    text-align: right;
    font-size: medium;
    color: grey;
    cursor: pointer;
}
</style>
<template>
    <div :class="isContainerShift ? 'homeShift' : 'home'">
        <loadIng :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></loadIng>
        <div class="row">
            <!-- <v-breadcrumbs :items="[{text: 'Session', disabled: false, href: '/'}, {text: this.sessionId, disabled: true}]"></v-breadcrumbs> -->
            <h4 style="color: #8080808f;cursor: pointer;">
                <a @click="$router.go(-1)" href="#">Users</a> <i class="fa fa-angle-double-right"
                    aria-hidden="true"></i><span @click="copyToClip(sessionId, 'UserId')">{{ sessionId }}</span>
            </h4>
        </div>


    <!-- Info Bar Row -->
    <div class="row">
      <!-- <div class="col-md-12"> -->
        <v-card class="serviceCard py-2 px-4 w-100" id="header-info" flat>
          <div class="row align-items-center">
            <div class="col-md-3">
              <label><strong>Date:</strong> {{ session ? formatDate(session.createdAt) : "-" }}</label>
            </div>
            <div class="col-md-3">
              <label style="cursor: pointer;">
                <strong>Email Id:</strong>
                <span @click="copyToClip(session.email, 'Email')">
                  {{ session ? stringShortner(session.email, 32) : "-" }}
                </span>
              </label>
            </div>
            <div class="col-md-3">
              <label><strong>Attempts:</strong> <span>{{ session ? session.retryAttempts : "-" }}</span></label>
            </div>
            <div class="col-md-3">
              <div class="d-flex justify-content-between align-items-center">
                <label><strong>Verified In:</strong>
                  <span class="badge badge-info">{{ startFinishDiffInSeconds }}m</span>
                </label>
                <div>
                  <span v-html="getUserStatus(session.status)"></span>
                  <span class="fa-stack fa-sm ml-2" title="Download report" style="cursor: pointer"
                        @click="downloadKYCReport()">
                    <i class="fa fa-download"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </v-card>
      <!-- </div> -->
    </div>

    <!-- Next Row (Your content goes here) -->
    <div class="row">
                    <!-- <div class="col-md-12"> -->
                        <!-- Personal Information -->
                        <v-card id="personal-info" class="serviceCard dataCard float-"
                            v-if="userPersonalDataFromUserConsent && Object.keys(userPersonalDataFromUserConsent).length > 0">
                            <v-list-item three-line>
                                <v-list-item-content>
                                    <v-list-item-title class="text-h6 font-weight-bold mb-3">
                                        <i class="fa fa-id-badge mr-2" aria-hidden="true"></i>PERSONAL INFORMATION
                                    </v-list-item-title>
                                    <div class="p-2">
                                        <table class="table">
                                            <tbody>
                                                <tr v-for="eachkey in Object.keys(userPersonalDataFromUserConsent)"
                                                    v-bind:key="userPersonalDataFromUserConsent[eachkey]">
                                                    <td class="greyFont text-start"
                                                        v-if="userPersonalDataFromUserConsent[eachkey]">{{
                                                            eachkey
                                                                ? eachkey.charAt(0).toUpperCase() +
                                                                eachkey.substring(1, eachkey.length) : eachkey }}</td>
                                                    <td v-if="userPersonalDataFromUserConsent[eachkey]" class="text-end">
                                                        <span v-if="eachkey == 'issuingStateCode'">
                                                            {{ userPersonalDataFromUserConsent[eachkey] }} <country-flag
                                                                :country="userPersonalDataFromUserConsent[eachkey]"
                                                                size='normal' />
                                                        </span>
                                                        <span v-else>
                                                            {{ userPersonalDataFromUserConsent[eachkey] }}
                                                        </span>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </v-list-item-content>
                            </v-list-item>
                        </v-card>

                        <v-card class="serviceCard dataCard float-"
                            style="max-height: 439px; overflow-y: scroll; max-width: 400px;"
                            v-if="userPersonalDataGovIdFromUserConsent && Object.keys(userPersonalDataGovIdFromUserConsent).length > 0">
                            <v-list-item three-line>
                                <v-list-item-content>
                                    <!-- <v-list-item-title class="text-h5 mb-1">
                                        <i class="fa fa-id-badge" aria-hidden="true"></i>{{ "Personal Information".toUpperCase()
                                        }}
                                    </v-list-item-title> -->
                                    <v-list-item-title class="text-h6 font-weight-bold mb-3">
                                        <i class="fa fa-id-badge mr-2" aria-hidden="true"></i>PERSONAL INFORMATION
                                    </v-list-item-title>
                                    <div class="p-2">
                                        <table class="table">
                                            <tbody>
                                                <tr v-for="eachkey in Object.keys(userPersonalDataGovIdFromUserConsent)"
                                                    v-bind:key="userPersonalDataGovIdFromUserConsent[eachkey]">
                                                    <td class="greyFont">{{ eachkey ? eachkey.charAt(0).toUpperCase() +
                                                        eachkey.substring(1, eachkey.length) : eachkey }}</td>
                                                    <td v-if="eachkey == 'issuingStateCode'" class="text-end">
                                                        {{ userPersonalDataGovIdFromUserConsent[eachkey] }} <country-flag
                                                            :country="userPersonalDataGovIdFromUserConsent[eachkey]"
                                                            size='normal' />
                                                    </td>
                                                    <td v-else>{{ userPersonalDataGovIdFromUserConsent[eachkey] }}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </v-list-item-content>
                            </v-list-item>
                        </v-card>

                        <!-- Device Information -->
                        <v-card id="device-info" class="serviceCard dataCard float-"
                            v-if="deviceDetails && Object.keys(deviceDetails).length > 0">
                            <v-list-item three-line>
                                <v-list-item-content>
                                    <v-list-item-title class="text-h6 font-weight-bold mb-3">
                                        <i class="fa fa-laptop mr-2" aria-hidden="true"></i>DEVICE INFORMATION
                                    </v-list-item-title>
                                    <div class="p-2">
                                        <table class="table">
                                            <tbody>
                                                <!-- <tr>
                                                    <td class="greyFont">IP</td>
                                                    <td style="text-align: right;">{{ this.deviceDetails.ip }}</td>
                                                </tr> -->
                                                <tr>
                                                    <td class="greyFont">Operating system</td>
                                                    <td style="text-align: right;">{{ this.deviceDetails.os }}</td>
                                                </tr>
                                                <tr>
                                                    <td class="greyFont">OS Version</td>
                                                    <td style="text-align: right;">{{ this.deviceDetails.osVer }}</td>
                                                </tr>
                                                <tr>
                                                    <td class="greyFont">Browser</td>
                                                    <td style="text-align: right;">{{ this.deviceDetails.browser }}</td>
                                                </tr>

                                                <tr>
                                                    <td class="greyFont">Device</td>
                                                    <td style="text-align: right;">{{ this.deviceDetails.device }}</td>
                                                </tr>

                                                <!-- <tr>
                                            <td class="greyFont">CPU</td>
                                            <td style="text-align: right;">{{  this.deviceDetails.cpu }}</td>
                                        </tr>
                                        -->
                                            </tbody>

                                        </table>

                                    </div>
                                </v-list-item-content>
                            </v-list-item>
                        </v-card>

                        <!-- Face Verification -->
                        <v-card id="face-auth-info" class="serviceCard dataCard float-" :style="{ 'border': getStatusColor }"
                            v-if="session.selfiDetails && Object.keys(session.selfiDetails).length > 0 && session.ocriddocsDetails.tokenFaceImage">
                            <v-list-item three-line>
                                <v-list-item-content>
                                    <v-list-item-title class="text-h6 font-weight-bold mb-3">
                                        <i class="fa fa-smile mr-2" aria-hidden="true"></i>FACE AUTHENTICATION
                                    </v-list-item-title>
                                    <div class="">
                                        <div class="row">
                                            <div class="col-md-5 centered-container" style="">
                                                <span class=""><img style="height:100px;"
                                                        :src="session.selfiDetails.tokenSelfiImage" /></span>
                                            </div>
                                            <div class="col-md-2 centered-container" style=""
                                                v-if="isFacialAuthenticationSuccess.success">
                                                <span class="" style="font-size: 50px; color: green;"><i
                                                        class="fa fa-check-circle" aria-hidden="true"></i></span>
                                            </div>
                                            <div class="col-md-2 centered-container" style="" v-else>
                                                <span class="" style="font-size: 50px; color: indianred;"><i
                                                        class="fa fa-times-circle" aria-hidden="true"></i></span>
                                            </div>

                                            <div class="col-md-5 centered-container" style="">
                                                <span class=""><img style="height:100px;"
                                                        :src="session.ocriddocsDetails.tokenFaceImage" /></span>
                                            </div>
                                        </div>
                                        <div class="mt-5">
                                            <div class="alert alert-success" role="alert"
                                                v-if="isFacialAuthenticationSuccess.success">
                                                <span><i class="fa fa-info-circle" aria-hidden="true"></i></span>
                                                {{ isFacialAuthenticationSuccess.result }}
                                            </div>
                                            <div class="alert alert-danger" role="alert" v-else>
                                                <span><i class="fa fa-info-circle" aria-hidden="true"></i></span>
                                                {{ isFacialAuthenticationSuccess.result }}
                                            </div>
                                        </div>
                                    </div>
                                </v-list-item-content>
                            </v-list-item>
                        </v-card>


                        <!-- Liveliness Check -->
                        <v-card id="liveliness-info" class="serviceCard dataCard float-"
                            :style="{ 'border': passiveLivelinessData.borderColor }"
                            v-if="session.selfiDetails && session.selfiDetails.createdAt && Object.keys(session.selfiDetails).length > 0">
                            <v-list-item three-line>
                                <v-list-item-content>
                                    <v-list-item-title class="text-h6 font-weight-bold mb-3">
                                        <i class="fa fa-heartbeat mr-2" aria-hidden="true"></i>LIVELINESS CHECK
                                    </v-list-item-title>
                                    <div>
                                        <div class="row">
                                            <div class="col-md-12 centered-container" style="">
                                                <span class="">
                                                    <img style="height:200px; width: 200px;"
                                                        :src="session.selfiDetails.tokenSelfiImage" /></span>
                                            </div>
                                        </div>
                                        <div class="mt-3">
                                            <div class="alert alert-success" role="alert" v-if="passiveLivelinessData.success">
                                                <span><i class="fa fa-info-circle" aria-hidden="true"></i></span> Liveliness
                                                Check
                                                Passed
                                            </div>
                                            <div class="alert alert-danger" role="alert" v-else>
                                                <span><i class="fa fa-info-circle" aria-hidden="true"></i></span>
                                                {{ passiveLivelinessData.result }}
                                            </div>
                                        </div>
                                    </div>
                                </v-list-item-content>
                            </v-list-item>
                        </v-card>

                        <!-- Location Information -->
                        <v-card id="location-info" class="serviceCard dataCard float-"
                            v-if="locationDetails && Object.keys(locationDetails).length > 0">
                            <v-list-item three-line>
                                <v-list-item-content>
                                    <v-list-item-title class="text-h6 font-weight-bold mb-3">
                                        <i class="fa fa-map-marker mr-2" aria-hidden="true"></i>LOCATION INFORMATION
                                    </v-list-item-title>

                                    <div class="p-2">
                                        <table class="table">
                                            <tbody>
                                                <tr>
                                                    <td class="greyFont">IP</td>
                                                    <td style="text-align: right;">{{ this.locationDetails.ip }}</td>
                                                </tr>
                                                <tr>
                                                    <td class="greyFont">Continent</td>
                                                    <td style="text-align: right;">{{ this.locationDetails.continentName }}</td>
                                                </tr>
                                                <tr>
                                                    <td class="greyFont">Country</td>
                                                    <td style="text-align: right;">{{ this.locationDetails.countryName }} <span
                                                            v-if="this.locationDetails.countryCode"><country-flag
                                                                :country="this.locationDetails.countryCode"
                                                                size='normal' /></span>
                                                    </td>
                                                </tr>
                                                <!-- <tr>
                                                    <td class="greyFont">Time Zone</td>
                                                    <td style="text-align: right;">{{ this.locationDetails.timeZone }}</td>
                                                </tr> -->
                                                <tr>
                                                    <td class="greyFont">Region</td>
                                                    <td style="text-align: right;">{{ this.locationDetails.region }}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </v-list-item-content>
                            </v-list-item>
                        </v-card>

                        <!-- Images / Documentation -->
                        <v-card class="serviceCard dataCard float-" v-if="selfiDataFound || idDocDataFound">
                            <v-list-item three-line>
                                <v-list-item-content>
                                    <!-- <v-list-item-title class="text-h5 mb-1">
                                        <i class="fa fa-file" aria-hidden="true"></i>{{ " Images / Documents".toUpperCase() }}
                                    </v-list-item-title> -->
                                    <v-list-item-title class="text-h6 font-weight-bold mb-3">
                                        <i class="fa fa-file mr-2" aria-hidden="true"></i>DOCUMENTS
                                    </v-list-item-title>

                                    <div class="p-2" v-if="selfiDataFound || idDocDataFound">
                                        <div class="p-2"
                                            style="margin-top: 0%; border: 1px solid rgb(228, 228, 228); border-radius: 10px;"
                                            v-if="selfiDataFound">
                                            <div class="row">
                                                <div class="col-md-3">
                                                    <img style="height:35px;" :src="session.selfiDetails.tokenSelfiImage" />
                                                </div>
                                                <div class="col-md-7">
                                                    <span style="font-size: small;">Selfie</span>
                                                </div>
                                                <div class="col-md-2 zoomin" title="Zoom" @click="zoomDocument('Selfie')">
                                                    <i class="fa fa-search-plus" aria-hidden="true"></i>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="p-2"
                                            style="margin-top: 2%; border: 1px solid rgb(228, 228, 228); border-radius: 10px;"
                                            v-if="idDocDataFound">
                                            <div class="row">
                                                <div class="col-md-3">
                                                    <img style="height:35px;"
                                                        :src="session.ocriddocsDetails.tokenFrontDocumentImage" />
                                                </div>
                                                <div class="col-md-7">
                                                    <span style="font-size: medium;">Document Front</span>
                                                </div>
                                                <div class="col-md-2 zoomin" title="Zoom"
                                                    @click="zoomDocument('Document Front')">
                                                    <i class="fa fa-search-plus" aria-hidden="true"></i>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="p-2 mt-2" style="border: 1px solid rgb(228, 228, 228); border-radius: 10px;"
                                            v-if="session.ocriddocsDetails.tokenBackDocumentImage">
                                            <div class="row">
                                                <div class="col-md-3">
                                                    <img style="height:35px;"
                                                        :src="session.ocriddocsDetails.tokenBackDocumentImage" />
                                                </div>
                                                <div class="col-md-7">
                                                    <span style="font-size: medium;">Document Back</span>
                                                </div>
                                                <div class="col-md-2 zoomin" title="Zoom"
                                                    @click="zoomDocument('Document Back')">
                                                    <i class="fa fa-search-plus" aria-hidden="true"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- <div class="card-body" v-else>
                                <h4>No record found</h4>
                            </div> -->
                                </v-list-item-content>
                            </v-list-item>
                        </v-card>

                        <!-- SBT Minting -->
                        <div v-for="eachSbtMintData in allSbtMintData" v-bind:key="eachSbtMintData">
                            <v-card class="serviceCard dataCard float-" v-if="eachSbtMintData">
                                <v-list-item three-line>
                                    <v-list-item-content>
                                        <!-- <v-list-item-title class="text-h5 mb-1">
                                            <i class="fa fa-address-book" aria-hidden="true"></i>{{ " SBTInformation".toUpperCase()
                                            }}
                                        </v-list-item-title> -->

                                        <v-list-item-title class="text-h6 font-weight-bold mb-3">
                                            <i class="fa fa-address-book mr-2" aria-hidden="true"></i>SOUL BOUND TOKEN
                                        </v-list-item-title>


                                        <div>
                                            <table class="table">
                                                <tbody>
                                                    <tr>
                                                        <td class="greyFont">Credential Type</td>
                                                        <td style="text-align: right;word-break: break-word;">
                                                            {{ `${eachSbtMintData.proofType}SbtCredential` }}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td class="greyFont">Blockchain</td>
                                                        <td style="text-align: right;">
                                                            <span>
                                                                <b-avatar :style="{ 'background-color': 'white' }"
                                                                    :src="getChainDetail(eachSbtMintData.blockchainLabel).logoUrl"
                                                                    size="20"></b-avatar>
                                                            </span>
                                                            {{ getChainDetail(eachSbtMintData.blockchainLabel).chainName
                                                            }}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td class="greyFont">User's Wallet Address</td>
                                                        <td @click="copyToClip(eachSbtMintData.ownerWalletAddress, 'Wallet Address')"
                                                            style="text-align: right;cursor: pointer;">{{
                                                                stringShortner(eachSbtMintData.ownerWalletAddress, 15) }}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td class="greyFont">User's DID</td>
                                                        <td @click="copyToClip(eachSbtMintData.did, 'User Id')"
                                                            style="text-align: right;cursor: pointer;">{{
                                                                stringShortner(eachSbtMintData.did, 15) }} </td>
                                                    </tr>
                                                    <tr v-if="eachSbtMintData.tokenId">
                                                        <td class="greyFont">Token Id</td>
                                                        <td style="text-align: right;">{{
                                                            eachSbtMintData.tokenId }} </td>
                                                    </tr>
                                                    <tr v-if="eachSbtMintData.sbtContractAddress">
                                                        <td class="greyFont">Contract Address</td>
                                                        <td @click="copyToClip(eachSbtMintData.sbtContractAddress, 'SBT Contract Address')"
                                                            style="text-align: right;cursor: pointer;">{{
                                                                stringShortner(eachSbtMintData.sbtContractAddress, 15) }}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td class="greyFont">TransactionHash</td>
                                                        <td @click="copyToClip(eachSbtMintData.transactionHash, 'Transaction hash')"
                                                            style="text-align: right;cursor: pointer;">{{
                                                                stringShortner(eachSbtMintData.transactionHash, 15) }} </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-card>
                        </div>

                    <!-- </div> -->
                </div>

  


        <div class="row">
  
    <v-card id="timelines-info" class="serviceCard w-100 mt-3" style="max-height: 300px;">
      <v-list-item three-line>
        <v-list-item-content>
          <v-list-item-title class="text-h6 font-weight-bold mb-3">
            <i class="fa fa-hourglass-end mr-2" aria-hidden="true"></i>TIMELINES
          </v-list-item-title>
          <div>
            <ul class="timeline">
              <li v-for="(step, index) in sortedTimelineDetails" :key="index">
                <div class="d-flex justify-space-between align-center">
                  <a target="_blank" class="mx-2">
                    <strong>{{ step.stepName }}</strong>
                  </a>
                  <div class="ml-auto d-flex align-center">
                    <span v-if="step.error" class="badge badge-pill badge-outline-danger px-2 mr-2">
                      <i class="mdi mdi-close-circle-outline mr-1"></i>
                      Failed: {{ step.error }}
                    </span>
                    <a href="#" class="greyFont">
                      {{ formatDate(step.createdAt) }}
                    </a>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </v-list-item-content>
      </v-list-item>
    </v-card>
  
</div>

        


        <hf-pop-up id="zoom-doc" :Header="popupHeader">
            <div class="center">
                <img :src="popupImage" />
            </div>
        </hf-pop-up>
    </div>
</template>

<script>

import UtilsMixin from '../../mixins/utils';
import { mapState, mapGetters, mapActions } from "vuex";
import UAParser from 'ua-parser-js'
import CountryFlag from 'vue-country-flag'
import { getCosmosChainConfig } from '@hypersign-protocol/hypersign-kyc-chains-metadata/cosmos/wallet/cosmos-wallet-utils'
import { getStellarChainConfig } from '@hypersign-protocol/hypersign-kyc-chains-metadata/stellar/wallet/stellar-wallet-utils'
import HfPopUp from "../../components/element/hfPopup.vue";
import { HYPERSIGN_PROOF_TYPES } from '@hypersign-protocol/hypersign-kyc-chains-metadata/cosmos/wallet/cosmos-wallet-utils'
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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
}

const FaicalAuthenticationError = {
    0: 'Face check could not be performed',
    1: 'Faces did not match',
    2: 'Face not found in the image',
    4: 'Failed to perform face check due to the pose of the face',
    5: 'Failed due to problems in the extraction of the facial pattern',
    6: 'Duplicate document was used',
};

export default {
    name: "sessionDetails",
    components: {
        CountryFlag,
        HfPopUp,
    },
    computed: {
        ...mapGetters('mainStore', ['getSessionDetailsBySessionId']),
        ...mapState({
            sessionList: state => state.mainStore.sessionList,
            containerShift: state => state.playgroundStore.containerShift,
        }),
        isFacialAuthenticationSuccess() {
            const status = this.selfiDataFound && this.idDocDataFound && this.session.ocriddocsDetails.serviceFacialAuthenticationResult == 3
            const matchPercentage = ', match ' + (Math.round(this.session.ocriddocsDetails.serviceFacialSimilarityResult * 100)) + '%'
            return {
                success: status,
                result: !status ? FaicalAuthenticationError[this.session.ocriddocsDetails.serviceFacialAuthenticationResult] + matchPercentage : 'Facial Authentication Passed' + matchPercentage,
            }
        },
        passiveLivelinessData() {
            const status = this.selfiDataFound && this.session.selfiDetails.serviceLivenessResult == 3
            return {
                success: status,
                result: ServiceLivenessResultEnum[this.session.selfiDetails.serviceLivenessResult],
                borderColor: status ? '5px solid rgb(81 137 81 / 35%)' : '5px solid #cd5c5c5e'
            }
        },
        getStatusColor() {
            if (this.isFacialAuthenticationSuccess.success) {
                return '5px solid rgb(81 137 81 / 35%)'
            } else {
                return '5px solid #cd5c5c5e'
            }
        },
        isContainerShift() {
            return this.containerShift
        },
        selfiDataFound() {
            return (this.session.selfiDetails && Object.keys(this.session.selfiDetails).length > 0)
        },
        idDocDataFound() {
            return (this.session.ocriddocsDetails && Object.keys(this.session.ocriddocsDetails).length > 0)
        },
        userConsentDataFound() {
            return (this.session.userConsentDetails && Object.keys(this.session.userConsentDetails).length > 0)
        },
        sbtDataFound() {
            return (this.session.mintsbtsDetails && this.session.mintsbtsDetails.length > 0)
        },
        startFinishDiffInSeconds() {
            if (this.userConsentDataFound) {
                const startDate = new Date(this.session.createdAt)
                const endDate = new Date(this.session.userConsentDetails.createdAt)

                const startEpoch = startDate.getTime()
                const endEpoch = endDate.getTime()

                return parseFloat(((endEpoch - startEpoch) / 1000) / 60).toFixed(2)
            } else {
                return 0
            }
        },
        userPersonalDataFromUserConsent() {
            const d = { ...this.getCredentialSubjectByType("PassportCredential") }
            console.log({ d })
            delete d['face']
            delete d['overallRating']
            delete d['id']
            return d
        },
        userPersonalDataGovIdFromUserConsent() {
            const d = { ...this.getCredentialSubjectByType("GovernmentIdCredential") }
            delete d['face']
            delete d['overallRating']
            delete d['id']
            return d
        },
        userSbtMintDataFromUserConsent() {
            // const sbtType = 
            // HYPERSIGN_PROOF_TYPES
            const t = this.getCredentialSubjectByType("zkProofOfPersonHoodSbtCredential")
            return t
        },
        allProofTypeSBTCredentials() {
            const proofTypeSBTCredential = []
            Object.keys(HYPERSIGN_PROOF_TYPES).forEach(eachProofType => {
                proofTypeSBTCredential.push(this.getCredentialSubjectByType(`${eachProofType}SbtCredential`))
            })
            return proofTypeSBTCredential
        },
        allSbtMintData() {
            let sbtMintData
            if (this.sbtDataFound) {
                sbtMintData = this.session.mintsbtsDetails
            }
            return sbtMintData
        },
        sortedTimelineDetails() {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      return this.timeLineDetails.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
    }
    },
    data() {
        return {
            breadCrumbsItems: [{ text: 'Session', disabled: false, href: '/session' }, { text: this.sessionId, disabled: true }],
            fullPage: true,
            isLoading: false,
            appId: "",
            sessionId: "",
            session: {},
            popupHeader: "",
            popupImage: "",
            deviceDetails: {
                ip: '',
                os: '',
                osVer: '',
                brower: '',
                device: '',
                cpu: ''
            },
            locationDetails: {},
            timeLineDetails: [],
            locationMap: {
                url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                attribution:
                    '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
                zoom: 15,
                center: [51.505, -0.159],
                markerLatLng: [51.504, -0.159]
            }
        };
    },

    async created() {
        console.log("Session Details View Created")
        this.appId = this.$route.params.appId
        this.sessionId = this.$route.params.sessionId
        // this.session = this.getSessionDetailsBySessionId(this.sessionId);

        try {

            this.isLoading = true
            console.log("USer ID: ", this.sessionId)
            console.log("Before fetching session details...")
            this.session = await this.fetchSessionsDetailsById({ sessionId: this.sessionId })
            console.log("After fetching session details...")

            this.isLoading = false
            this.getCredentialSubjectByType()


            if (this.session.deviceDetails) {
                const userAgentString = this.session.deviceDetails.userAgent
                
                if (userAgentString) {
                    const uaparser = new UAParser()
                    uaparser.setUA(userAgentString)
                    const details = {
                        os: uaparser.getOS().name,
                        osVer: uaparser.getOS().version,
                        browser: uaparser.getBrowser().name,
                        device: uaparser.getDevice().model,
                        cpu: uaparser.getCPU().architecture
                    }
                    Object.assign(this.deviceDetails, { ...details })

                    if(this.session.deviceDetails.locationDetail){
                        Object.assign(this.locationDetails, { ...this.session.deviceDetails.locationDetail })
                    }
                }
            }

            if(this.session.timeLineDetails){
                this.timeLineDetails = this.session.timeLineDetails.map(item => {
                    const newItem = { ...item };

                    if (newItem.step_name === 'liveliness' || newItem.stepName === 'liveliness') {
                        newItem.stepName = 'Selfie uploaded';
                        if ('result' in newItem) {
                            if(newItem.result != 3) newItem.error = ServiceLivenessResultEnum[newItem.result] || null;
                        }
                    }

                    if (newItem.step_name === 'start' || newItem.stepName === 'start') {
                        newItem.stepName = 'Start';
                    }

                    if (newItem.step_name === 'userConsent' || newItem.stepName === 'userConsent') {
                        newItem.stepName = 'User Consent';
                    }

                    if (newItem.step_name === 'ocrIdDoc' || newItem.stepName === 'ocrIdDoc') {
                        newItem.stepName = 'Document uploaded';
                        if ('result' in newItem) {
                            newItem.error = FaicalAuthenticationError[newItem.result] || null;
                        }
                    }

                    return newItem;
                });

                console.log(JSON.stringify(this.timeLineDetails))
            }

        } catch (e) {
            this.notifyErr(e.message)
            this.isLoading = false
            this.$router.go(-1);
        }
    },
    beforeRouteEnter(to, from, next) {
        next((vm) => {
            vm.prevRoute = from;
        });
    },
    methods: {
        ...mapActions('mainStore', ['fetchSessionsDetailsById']),
formatDate(date) {
      if (!date) return '-';
      const d = new Date(date);
      return d.toLocaleString(); // Customize formatting if needed
    },
        async downloadKYCReport() {
            try {
                this.isLoading = true
                const pdf = new jsPDF('p', 'mm', 'a4');
                const pageWidth = pdf.internal.pageSize.getWidth();
                const pageHeight = pdf.internal.pageSize.getHeight();
                const margin = 10;
                const usableWidth = pageWidth - margin * 2;
                const spacing = 10;

                const metadata = {
                    date: this.formatDate(this.session.createdAt),
                    userId: this.session.userId,
                    verifiedIn: this.startFinishDiffInSeconds + ' m',
                    // status: this.getStatus(this.session)
                };

                const cardIds = [
                    // 'timelines-info',
                    'personal-info',
                    'device-info',
                    'location-info',
                    'liveliness-info',
                    'face-auth-info'
                ];

                // ✅ Add Header (only once)
                pdf.setFontSize(12);
                pdf.text('KYC Verification Report', margin, 15);

                pdf.setFontSize(10);
                pdf.text(`Date: ${metadata.date}`, margin, 25);
                pdf.text(`User ID: ${metadata.userId}`, margin, 31);
                pdf.text(`Verified In: ${metadata.verifiedIn}`, margin, 37);
                // pdf.html(metadata.status, margin, 43)
                // pdf.text(`Status: ${metadata.status}`, margin, 43);

                let verticalOffset = 50;

                for (const id of cardIds) {

                    const card = document.getElementById(id);
                    if (!card) {
                        console.warn(`Element with ID ${id} not found`);
                        continue;
                    }

                    console.log(`Capturing ${id}...`);
                    const canvas = await html2canvas(card, { scale: 2 });

                    const imgData = canvas.toDataURL('image/png');
                    if (!imgData) {
                        console.warn(`Failed to get image data for ${id}`);
                        continue;
                    }

                    console.log(`Adding ${id} to PDF...`);
                    const imgProps = pdf.getImageProperties(imgData);

                    const imgWidth = usableWidth;
                    const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

                    if (verticalOffset + imgHeight > pageHeight - margin) {
                        pdf.addPage();
                        verticalOffset = margin;
                    }

                    pdf.addImage(imgData, 'PNG', margin, verticalOffset, imgWidth, imgHeight);
                    verticalOffset += imgHeight + spacing;
                }



                // Optional: Label section
                pdf.addPage(); // New page for document images
                pdf.setFontSize(12);
                pdf.text('Document Images', margin, 15);

                // Add front image
                if (this.session.ocriddocsDetails?.tokenFrontDocumentImage) {
                    const frontImage = this.session.ocriddocsDetails.tokenFrontDocumentImage;
                    const frontImgProps = pdf.getImageProperties(frontImage);
                    const imgWidth = usableWidth;
                    const imgHeight = (frontImgProps.height * imgWidth) / frontImgProps.width;

                    pdf.setFontSize(10);
                    pdf.text('Front Side', margin, 25);
                    pdf.addImage(frontImage, 'JPEG', margin, 30, imgWidth, imgHeight);
                }

                // Add back image
                if (this.session.ocriddocsDetails?.tokenBackDocumentImage) {
                    const backImage = this.session.ocriddocsDetails.tokenBackDocumentImage;
                    const backImgProps = pdf.getImageProperties(backImage);
                    const imgWidth = usableWidth;
                    const imgHeight = (backImgProps.height * imgWidth) / backImgProps.width;

                    // Adjust vertical offset based on previous image
                    let yOffset = 30 + imgHeight + 10;
                    pdf.text('Back Side', margin, yOffset);
                    pdf.addImage(backImage, 'JPEG', margin, yOffset + 5, imgWidth, imgHeight);
                }
                pdf.save(`${this.session.userId}-${(new Date()).getTime()}.pdf`);
                this.isLoading = false
            } catch (err) {
                this.isLoading = false
                console.error('Error generating PDF:', err);
                this.notifyErr(err.message)
            }
        },

        getChainDetail(blockchainlabel = 'cosmos:comdex:test') {
            // console.log('Inside get chain details.... ' + JSON.stringify(blockchainlabel))
            // const config = getCosmosChainConfig(blockchainlabel)

            let config;
            if (blockchainlabel.indexOf('cosmos') >= 0) {
                config = getCosmosChainConfig(blockchainlabel)
            } else {
                config = getStellarChainConfig(blockchainlabel)
            }

            return {
                chainName: config.chainName,
                chainId: config.chainId,
                logoUrl: config.stakeCurrency.coinImageUrl,
                tx_explorer: config.txExplorer.txUrl
            }
        },
        getCredentialSubjectByType(type = "PassportCredential") {

            console.log('Inside getCredentialSubjectByType ' + type)
            if (this.userConsentDataFound) {
                const presentationStr = this.session.userConsentDetails.presentation
                console.log(this.session.userConsentDetails)
                // console.log('Before parsing. ' + presentationStr)
                if (presentationStr) {

                    const presentation = JSON.parse(presentationStr)
                    if (presentation && Object.keys(presentation).length > 0) {
                        const passportCredential = presentation.verifiableCredential.filter(x => x.type.includes(type))[0]
                        console.log(passportCredential)
                        if (passportCredential) {
                            return passportCredential.credentialSubject
                        } else {
                            console.log('No passportCredential found')
                            return {}
                        }
                    } else {
                        console.log('Could not parse presentationStr')
                        return {}
                    }
                } else {
                    console.log('No presentationStr found')
                    return {}
                }
            } else {
                console.log('SBT data not found')

                return {}
            }
        },
        zoomDocument(place) {
            this.popupHeader = place
            switch (place) {
                case 'Document Front': {
                    this.popupImage = this.session.ocriddocsDetails.tokenFrontDocumentImage
                    break
                }
                case 'Selfie': {
                    this.popupImage = this.session.selfiDetails.tokenSelfiImage
                    break;
                }
                case 'Document Back': {
                    this.popupImage = this.session.ocriddocsDetails.tokenBackDocumentImage
                    break;
                }
            }
            this.$root.$emit("bv::show::modal", "zoom-doc");
        }
    },
    mixins: [UtilsMixin],

};
</script>