<style scoped>
.card-header {
    background: aliceblue;
    padding: 0px;
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
    height: 300px;
    /* Set a height to make it full height, adjust as needed */
}

ul.timeline {
    list-style-type: none;
    position: relative;
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
    border: 3px solid #22c0e8;
    background-color: #339af0;
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
    min-height: 49vh;
}

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
</style>
<template>
    <div :class="isContainerShift ? 'homeShift' : 'home'">
        <loading :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></loading>

        <div class="row">
            <div class="col-md-12">
                <div class="form-group">
                    <h3>
                        <a @click="$router.go(-1)" href="#">Sessions</a> <i class="fa fa-angle-double-right"
                            aria-hidden="true" style="color: #8080808f;"></i> {{ sessionId }}
                    </h3>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-body f-sm">
                        <div class="row">
                            <div class="col-md-4 ">
                                <label><strong>Date:</strong> {{ session ? formatDate(session.createdAt) : "-"
                                    }}</label>
                            </div>
                            <div class="col-md-4 ">
                                <label><strong>UserId:</strong> {{ session ? stringShortner(session.appUserId, 32) : "-"
                                    }}</label>
                            </div>
                            <div class="col-md-4  ">
                                <div class="row">
                                    <div class="col">
                                        <label><strong>Verified In:</strong> <span class="badge badge-info"> {{
                                            startFinishDiffInSeconds }}m</span></label>
                                    </div>
                                    <div class="col text-align-right">
                                        <span v-html="getStatus(session)"></span>
                                        <span class="fa-stack fa-sm" title="Download report" style="cursor: grab">
                                            <i class="fa fa-download"></i>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-md-12">
                <!-- Timelines -->
                <div class="card dataCard float-md-end">
                    <div class="card-header" style="padding: 10px">
                        <h4><i class="fa fa-hourglass-end" aria-hidden="true"></i> Timelines</h4>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-12">
                                <ul class="timeline">
                                    <li>
                                        <a target="_blank"><strong>Start</strong></a>
                                        <a href="#" class="float-right greyFont">{{ session ?
                                            formatDate(session.createdAt) : "-"
                                            }}</a>
                                    </li>
                                    <li v-if="selfiDataFound">
                                        <a target="_blank"><strong>Selfie uploaded</strong></a>
                                        <a href="#" class="float-right greyFont">{{ session ?
                                            formatDate(session.selfiDetails.createdAt) : "-" }}</a>
                                    </li>
                                    <li v-if="idDocDataFound">
                                        <a target="_blank"><strong>ID Document uploaded</strong></a>
                                        <a href="#" class="float-right greyFont">{{ session ?
                                            formatDate(session.ocriddocsDetails.createdAt) : "-" }}</a>
                                    </li>
                                    <li v-if="userConsentDataFound">
                                        <a target="_blank"><strong>User Consent provided</strong></a>
                                        <a href="#" class="float-right greyFont">{{ session ?
                                            formatDate(session.userConsentDetails.createdAt) : "-"
                                            }}</a>
                                    </li>
                                    <li v-if="userConsentDataFound">
                                        <a target="_blank"><strong>Finished</strong></a>
                                        <a href="#" class="float-right greyFont">{{ session ?
                                            formatDate(session.userConsentDetails.createdAt) : "-"
                                            }}</a>
                                    </li>

                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Personal Information -->
                <div class="card dataCard float-" style="max-height: 439px; overflow-y: scroll"
                    v-if="userPersonalDataFromUserConsent && Object.keys(userPersonalDataFromUserConsent).length > 0">
                    <div class="card-header" style="padding: 10px">
                        <h4> <i class="fa fa-id-badge" aria-hidden="true"></i> Personal Information</h4>
                    </div>
                    <div class="card-body">
                        <table class="table">
                            <tbody>
                                <tr v-for="eachkey in Object.keys(userPersonalDataFromUserConsent)"
                                    v-bind:key="userPersonalDataFromUserConsent[eachkey]">
                                    <td class="greyFont">{{ eachkey ? eachkey.charAt(0).toUpperCase() +
                                        eachkey.substring(1, eachkey.length) : eachkey }}</td>
                                    <td v-if="eachkey == 'issuingStateCode'">
                                        {{ userPersonalDataFromUserConsent[eachkey] }} <country-flag
                                            :country="userPersonalDataFromUserConsent[eachkey]" size='normal' />
                                    </td>
                                    <td v-else>{{ userPersonalDataFromUserConsent[eachkey] }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="card dataCard float-" style="max-height: 439px; overflow-y: scroll"
                    v-if="userPersonalDataGovIdFromUserConsent && Object.keys(userPersonalDataGovIdFromUserConsent).length > 0">
                    <div class="card-header" style="padding: 10px">
                        <h4> <i class="fa fa-id-badge" aria-hidden="true"></i> Personal Information</h4>
                    </div>
                    <div class="card-body">
                        <table class="table">
                            <tbody>
                                <tr v-for="eachkey in Object.keys(userPersonalDataGovIdFromUserConsent)"
                                    v-bind:key="userPersonalDataGovIdFromUserConsent[eachkey]">
                                    <td class="greyFont">{{ eachkey ? eachkey.charAt(0).toUpperCase() +
                                        eachkey.substring(1, eachkey.length) : eachkey }}</td>
                                    <td v-if="eachkey == 'issuingStateCode'">
                                        {{ userPersonalDataGovIdFromUserConsent[eachkey] }} <country-flag
                                            :country="userPersonalDataGovIdFromUserConsent[eachkey]" size='normal' />
                                    </td>
                                    <td v-else>{{ userPersonalDataGovIdFromUserConsent[eachkey] }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Device Information -->
                <div class="card dataCard float-" v-if="deviceDetails && Object.keys(deviceDetails).length > 0">
                    <div class="card-header" style="padding: 10px">
                        <h4><i class="fa fa-laptop" aria-hidden="true"></i> Device Information</h4>
                    </div>
                    <div class="card-body">
                        <table class="table">
                            <tbody>
                                <tr>
                                    <td class="greyFont">IP</td>
                                    <td style="text-align: right;">{{ this.deviceDetails.ip }}</td>
                                </tr>
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
                </div>

                <!-- Face Verification -->
                <div class="card dataCard float-" :style="{ 'border': getStatusColor }"
                    v-if="session.selfiDetails && Object.keys(session.selfiDetails).length > 0 && session.ocriddocsDetails.tokenFaceImage">
                    <div class="card-header" style="padding: 10px">
                        <h4><i class="fa fa-smile" aria-hidden="true"></i> Face Verification</h4>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-5 centered-container" style="">
                                <span class=""><img style="height:100px;"
                                        :src="session.selfiDetails.tokenSelfiImage" /></span>
                            </div>
                            <div class="col-md-2 centered-container" style=""
                                v-if="isFacialAuthenticationSuccess.success">
                                <span class="" style="font-size: 50px; color: green;"><i class="fa fa-check-circle"
                                        aria-hidden="true"></i></span>
                            </div>
                            <div class="col-md-2 centered-container" style="" v-else>
                                <span class="" style="font-size: 50px; color: red;"><i class="fa fa-times-circle"
                                        aria-hidden="true"></i></span>
                            </div>
                            <!-- <div class="col-md-2 centered-container" style="" v-else>
                                <span class="" style="font-size: 50px; color: orange;"><i
                                        class="fa fa-exclamation-triangle" aria-hidden="true"></i></span>
                            </div> -->

                            <div class="col-md-5 centered-container" style="">
                                <span class=""><img style="height:100px;"
                                        :src="session.ocriddocsDetails.tokenFaceImage" /></span>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12">
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
                    </div>
                </div>

                <!-- Liveliness Check -->
                <div class="card dataCard float-" :style="{ 'border': passiveLivelinessData.borderColor }"
                    v-if="session.selfiDetails && Object.keys(session.selfiDetails).length > 0">
                    <div class="card-header" style="padding: 10px">
                        <h4><i class="fa fa-heartbeat" aria-hidden="true"></i> Liveliness Check</h4>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-12 centered-container" style="">
                                <span class=""><img style="height:200px; width: 200px;"
                                        :src="session.selfiDetails.tokenSelfiImage" /></span>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12">
                                <div class="alert alert-success" role="alert" v-if="passiveLivelinessData.success">
                                    <span><i class="fa fa-info-circle" aria-hidden="true"></i></span> Liveliness Check
                                    Passed
                                </div>
                                <div class="alert alert-danger" role="alert" v-else>
                                    <span><i class="fa fa-info-circle" aria-hidden="true"></i></span>
                                    {{ passiveLivelinessData.result }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Location Information -->
                <div class="card dataCard float-" v-if="locationDetails && Object.keys(locationDetails).length > 0">
                    <div class="card-header" style="padding: 10px">
                        <h4><i class="fa fa-map-marker" aria-hidden="true"></i> Location Information </h4>
                    </div>
                    <div class="card-body">
                        <table class="table">
                            <tbody>
                                <tr>
                                    <td class="greyFont">Country</td>
                                    <td style="text-align: right;">{{ this.locationDetails.country_name }} <span
                                            v-if="this.locationDetails.country_code"><country-flag
                                                :country="this.locationDetails.country_code" size='normal' /></span>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="greyFont">Time Zone</td>
                                    <td style="text-align: right;">{{ this.locationDetails.timezones[0] }}</td>
                                </tr>
                                <tr>
                                    <td class="greyFont">Region</td>
                                    <td style="text-align: right;">{{ this.locationDetails.region_name }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Images / Documentation -->
                <div class="card dataCard float-" v-if="selfiDataFound || idDocDataFound">
                    <div class="card-header" style="padding: 10px">
                        <h4><i class="fa fa-file" aria-hidden="true"></i> Images / Documents</h4>
                    </div>
                    <div class="card-body" v-if="selfiDataFound || idDocDataFound">
                        <div class="card-body"
                            style="margin-top: 0%; border: 1px solid rgb(228, 228, 228); border-radius: 10px;"
                            v-if="selfiDataFound">
                            <div class="row">
                                <div class="col-md-3">
                                    <img style="height:35px;" :src="session.selfiDetails.tokenSelfiImage" />
                                </div>
                                <div class="col-md-7">
                                    <span style="font-size: small;">Selfie</span>
                                </div>
                                <div class="col-md-2" style="text-align: right; font-size: medium; cursor: pointer;"
                                    title="Zoom" @click="zoomDocument('Selfie')">
                                    <i class="fa fa-search-plus" aria-hidden="true"></i>
                                </div>
                            </div>
                        </div>

                        <div class="card-body"
                            style="margin-top: 2%; border: 1px solid rgb(228, 228, 228); border-radius: 10px;"
                            v-if="idDocDataFound">
                            <div class="row">
                                <div class="col-md-3">
                                    <img style="height:35px;" :src="session.ocriddocsDetails.tokenFrontDocumentImage" />
                                </div>
                                <div class="col-md-7">
                                    <span style="font-size: medium;">Document Front</span>
                                </div>
                                <div class="col-md-2" style="text-align: right; font-size: medium; cursor: pointer;"
                                    title="Zoom" @click="zoomDocument('Document Front')">
                                    <i class="fa fa-search-plus" aria-hidden="true"></i>
                                </div>
                            </div>
                        </div>



                        <div class="card-body mt-2" style="border: 1px solid rgb(228, 228, 228); border-radius: 10px;"
                            v-if="session.ocriddocsDetails.tokenBackDocumentImage">
                            <div class="row">
                                <div class="col-md-3">
                                    <img style="height:35px;" :src="session.ocriddocsDetails.tokenBackDocumentImage" />
                                </div>
                                <div class="col-md-7">
                                    <span style="font-size: medium;">Document Back</span>
                                </div>
                                <div class="col-md-2" style="text-align: right; font-size: medium; cursor: pointer;"
                                    title="Zoom" @click="zoomDocument('Document Back')">
                                    <i class="fa fa-search-plus" aria-hidden="true"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- <div class="card-body" v-else>
                        <h4>No record found</h4>
                    </div> -->
                </div>

                <!-- SBT Minting -->
                <div class="card dataCard float-"
                    v-if="userSbtMintDataFromUserConsent && Object.keys(userSbtMintDataFromUserConsent).length > 0">
                    <div class="card-header" style="padding: 10px">
                        <h4><i class="fa fa-address-book" aria-hidden="true"></i> Soul Bound Token Information</h4>
                    </div>
                    <div class="card-body">
                        <table class="table">
                            <tbody>
                                <tr>
                                    <td class="greyFont">Blockchain</td>
                                    <td style="text-align: right;">
                                        <span><img
                                                :src="getChainDetail(this.userSbtMintDataFromUserConsent.blockchainLabel).logoUrl"
                                                width="20" height="20"></span>
                                        {{ getChainDetail(this.userSbtMintDataFromUserConsent.blockchainLabel).chainName
                                        }}
                                    </td>
                                </tr>
                                <tr>
                                    <td class="greyFont">User's Wallet Address</td>
                                    <td @click="copyToClip(userSbtMintDataFromUserConsent.ownerWalletAddress, 'Wallet Address')"
                                        style="text-align: right;cursor: pointer;">{{
                                            stringShortner(this.userSbtMintDataFromUserConsent.ownerWalletAddress, 15) }}
                                    </td>
                                </tr>
                                <tr>
                                    <td class="greyFont">User's DID</td>
                                    <td @click="copyToClip(userSbtMintDataFromUserConsent.id, 'User Id')"
                                        style="text-align: right;cursor: pointer;">{{
                                            stringShortner(this.userSbtMintDataFromUserConsent.id, 15) }} </td>
                                </tr>
                                <tr>
                                    <td class="greyFont">Token Id</td>
                                    <td style="text-align: right;">{{
                                        this.userSbtMintDataFromUserConsent.tokenId }} </td>
                                </tr>
                                <tr>
                                    <td class="greyFont">Contract Address</td>
                                    <td @click="copyToClip(userSbtMintDataFromUserConsent.sbtContractAddress, 'SBT Contract Address')"
                                        style="text-align: right;cursor: pointer;">{{
                                            stringShortner(this.userSbtMintDataFromUserConsent.sbtContractAddress, 15) }}
                                    </td>
                                </tr>
                                <tr>
                                    <td class="greyFont">TransactionHash</td>
                                    <td @click="copyToClip(userSbtMintDataFromUserConsent.transactionHash, 'Transaction hash')"
                                        style="text-align: right;cursor: pointer;">{{
                                            stringShortner(this.userSbtMintDataFromUserConsent.transactionHash, 15) }} </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
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
import Loading from "vue-loading-overlay";
import { mapState, mapGetters, mapActions } from "vuex";
import UAParser from 'ua-parser-js'
import CountryFlag from 'vue-country-flag'
import { getCosmosChainConfig } from '../../blockchains-metadata/cosmos/wallet/cosmos-wallet-utils'
import HfPopUp from "../../components/element/hfPopup.vue";

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
        Loading, CountryFlag,
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
                borderColor: status ? '1px solid rgb(81, 137, 81)' : '1px solid red'
            }
        },
        getStatusColor() {
            if (this.isFacialAuthenticationSuccess.success) {
                return '1px solid rgb(81, 137, 81)'
            } else {
                return '1px solid red'
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
            const t = this.getCredentialSubjectByType("SBTCredential")
            console.log(t)
            return t
        }
    },
    data() {
        return {
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
        this.appId = this.$route.params.appId
        this.sessionId = this.$route.params.sessionId
        // this.session = this.getSessionDetailsBySessionId(this.sessionId);

        try {

            this.isLoading = true

            this.session = await this.fetchSessionsDetailsById({ sessionId: this.sessionId })

            this.isLoading = false

            if (this.session.deviceDetails) {
                const userAgentString = this.session.deviceDetails.userAgent
                console.log(userAgentString)
                if (userAgentString) {
                    let ip = this.session.deviceDetails.ip
                    if (this.session.deviceDetails.ip) {
                        const ips = this.session.deviceDetails.ip.split(',')
                        if (ips.length > 0) {
                            ip = ips[0]
                        }
                    }
                    await this.getLocationFromIp(ip)
                    const uaparser = new UAParser()
                    uaparser.setUA(userAgentString)

                    const details = {
                        ip,
                        os: uaparser.getOS().name,
                        osVer: uaparser.getOS().version,
                        browser: uaparser.getBrowser().name,
                        device: uaparser.getDevice().model,
                        cpu: uaparser.getCPU().architecture
                    }
                    Object.assign(this.deviceDetails, { ...details })
                }
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
        getChainDetail(blockchainlabel = 'cosmos:comdex:test') {
            console.log('Inside get chain details.... ' + JSON.stringify(blockchainlabel))
            const config = getCosmosChainConfig(blockchainlabel)
            return {
                chainName: config.chainName,
                chainId: config.chainId,
                logoUrl: config.stakeCurrency.coinImageUrl,
                tx_explorer: config.txExplorer.txUrl
            }
        },
        getCredentialSubjectByType(type = "PassportCredential") {
            if (this.userConsentDataFound) {
                const presentationStr = this.session.userConsentDetails.presentation
                if (presentationStr) {
                    const presentation = JSON.parse(presentationStr)
                    if (presentation && Object.keys(presentation).length > 0) {
                        const passportCredential = presentation.verifiableCredential.filter(x => x.type.includes(type))[0]
                        if (passportCredential) {
                            return passportCredential.credentialSubject
                        } else {
                            return {}
                        }

                    } else {
                        return {}
                    }
                } else {
                    return {}
                }
            } else {
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
                    this.popupImage = this.session.ocriddocsDetails.tokenFrontDocumentImage
                    break;
                }
            }
            this.$root.$emit("bv::show::modal", "zoom-doc");
        },
        async getLocationFromIp(ip) {
            try {
                if (!ip) {
                    throw new Error('Ip is required')
                }

                console.log('Before getting location details for ip')
                const url = 'https://api.apilayer.com/ip_to_location/' + ip //
                const resp = await fetch(url, {
                    methods: 'GET',
                    headers: {
                        'apikey': 'BiLxYABdIfUL6qwMgBerrLzp9ptXNH8i'
                    }
                })
                const json = await resp.json()

                console.log(json)

                Object.assign(this.locationDetails, { ...json })
            } catch (e) {
                this.notifyErr(e.message)
            }
        }
    },
    mixins: [UtilsMixin],

};
</script>