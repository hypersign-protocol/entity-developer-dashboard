<style scoped>
    .card-header {
        background: aliceblue;
        padding: 0px;
    }

    .card {
        border-radius: 10px;
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

    /* 
.kqPHSp {
    position: relative;
    border-left: 2px solid var(--UI--colors-grey200);
    height: 100%;
    padding-left: 2.4rem;
    
}

.UI--c-cdWBIM-ijlIiKl-css {
    cursor: inherit;
    color: var(--UI--colors-grey700);
    font-size: 1.2rem;
    line-height: 1.6rem;
}

.UI--c-cdWBIM {
    font-weight: 400;
}

.kgLKAh {
    margin: 0.4rem 0px 1rem;
}

.UI--c-cdWBIM-ijgnCPX-css {
    cursor: inherit;
    color: var(--UI--colors-grey700);
    font-size: 1rem;
    line-height: 1.4rem;
}


.UI--c-cdWBIM-GgrlW-semibold-true {
    font-weight: 600;
} */

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
        margin-top: 1%; margin-right: 1%; float: left; padding: 5px;
    }
</style>
<template>
    <div :class="isContainerShift ? 'homeShift' : 'home'">
        <loading :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></loading>


        <div class="row">
            <div class="col-md-12" style="text-align: left">
                <div class="form-group" style="display:flex">
                    <h3 class="mt-4" style="text-align: left;">

                        <a @click="$router.go(-1)" href="#">Verifications</a> <i class="fa fa-angle-double-right"
                            aria-hidden="true"></i> {{sessionId }}
                    </h3>
                </div>
            </div>
        </div>


        <div class="row">
            <div class="col-md-12">
                <div class="card" style="margin-top: 1%;">
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-3">
                                <label><strong>Date:</strong> {{ session ? formatDate(session.createdAt) : "-"
                                    }}</label>
                            </div>
                            <div class="col-md-3">
                                <label><strong>UserId:</strong> {{ session ? session.appUserId : "-" }}</label>
                            </div>
                            <div class="col-md-3" style="text-align: right;">
                                <label><strong>Verified In:</strong> <span class="badge badge-info"> {{ startFinishDiffInSeconds }}m</span></label>
                            </div>
                            <div class="col-md-3" style="text-align: right;">
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


        <div class="row">
            <div class="col-md-12">
                <!-- Personal Information -->
                <div class="card dataCard" style="height: 439px">
                    <div class="card-header" style="padding: 10px">
                        <h4>Personal Information</h4>
                    </div>
                    <div class="card-body">
                        <table class="table">
                            <tbody>
                                <tr>
                                    <td>Name</td>
                                    <td style="text-align: right;">VISHWAS ANAND BHUSHAN</td>
                                </tr>
                                <tr>
                                    <td>Wallet Address</td>
                                    <td style="text-align: right;">0X12X12312312312312312</td>
                                </tr>
                                <tr>
                                    <td>Country</td>
                                    <td style="text-align: right;">IND</td>
                                </tr>
                                <tr>
                                    <td>Country</td>
                                    <td style="text-align: right;">IND</td>
                                </tr>
                                <tr>
                                    <td>Country</td>
                                    <td style="text-align: right;"> IND</td>
                                </tr>


                            </tbody>

                        </table>
                    </div>
                </div>

                <!-- Face Verification -->
                <div class="card dataCard"
                    style="border: 1px solid rgb(81, 137, 81);"
                    v-if="session.selfiDetails && Object.keys(session.selfiDetails).length > 0"
                    >
                    <div class="card-header" style="padding: 10px">
                        <h4>Face Verification</h4>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-5 centered-container" style="">
                                <span class=""><img style="height:100px;"
                                        :src="session.selfiDetails.tokenSelfiImage" /></span>
                            </div>
                            <div class="col-md-2 centered-container" style="" v-if="selfiDataFound && idDocDataFound">
                                <span class="" style="font-size: 50px; color: green;"><i class="fa fa-check-circle"
                                        aria-hidden="true"></i></span>
                            </div>
                            <div class="col-md-2 centered-container" style="" v-else>
                                <span class="" style="font-size: 50px; color: orange;"><i
                                        class="fa fa-exclamation-triangle" aria-hidden="true"></i></span>
                            </div>

                            <div class="col-md-5 centered-container" style="">
                                <span class=""><img style="height:100px;"
                                        :src="session.ocriddocsDetails.tokenFaceImage" /></span>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12">
                                <div class="alert alert-success" role="alert">
                                    <span><i class="fa fa-info-circle" aria-hidden="true"></i></span> Passive liveness
                                    Success
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Images / Documentation -->
                <div class="card dataCard"  v-if="selfiDataFound || idDocDataFound">
                    <div class="card-header" style="padding: 10px">
                        <h4>Images / Documents</h4>
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
                                    title="Zoom" @click="zoom('Selfie')">
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
                                    title="Zoom" @click="zoom('Document Front')">
                                    <i class="fa fa-search-plus" aria-hidden="true"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- <div class="card-body" v-else>
                        <h4>No record found</h4>
                    </div> -->
                </div>

                
                <!-- Device Information -->
                <div class="card dataCard"
                v-if="deviceDetails && Object.keys(deviceDetails).length > 0"
                >
                    <div class="card-header" style="padding: 10px">
                        <h4>Device Information</h4>
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
                                    <td style="text-align: right;">{{  this.deviceDetails.os }}</td>
                                </tr>
                                <tr>
                                    <td class="greyFont">OS Version</td>
                                    <td style="text-align: right;">{{  this.deviceDetails.osVer }}</td>
                                </tr>
                                <tr>
                                    <td class="greyFont">Browser</td>
                                    <td style="text-align: right;">{{  this.deviceDetails.browser }}</td>
                                </tr>

                                <tr>
                                    <td class="greyFont">Device</td>
                                    <td style="text-align: right;">{{  this.deviceDetails.device }}</td>
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


                <!-- Location Information -->
                <div class="card dataCard"
                v-if="locationDetails && Object.keys(locationDetails).length > 0"
                >
                    <div class="card-header" style="padding: 10px">
                        <h4>Location Information </h4>  
                    </div>
                    <div class="card-body">
                        <table class="table">
                            <tbody>
                                <tr>
                                    <td class="greyFont">Country</td>
                                    <td style="text-align: right;">{{  this.locationDetails.country_name }}  <span v-if="this.locationDetails.country_code"><country-flag :country="this.locationDetails.country_code" size='normal'/></span></td>
                                </tr>
                                <tr>
                                    <td class="greyFont">Time Zone</td>
                                    <td style="text-align: right;">{{  this.locationDetails.timezones[0] }}</td>
                                </tr>
                                <tr>
                                    <td class="greyFont">Region</td>
                                    <td style="text-align: right;">{{  this.locationDetails.region_name }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div> 
                </div>

                <!-- Timelines -->
                <div class="card dataCard">
                    <div class="card-header" style="padding: 10px">
                        <h4>Timelines</h4>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-12">
                                <ul class="timeline">
                                    <li>
                                        <a target="_blank"><strong>Start</strong></a>
                                        <a href="#" class="float-right">{{ session ? formatDate(session.createdAt) : "-"
                                            }}</a>
                                    </li>
                                    <li v-if="selfiDataFound">
                                        <a target="_blank"><strong>Selfie uploaded</strong></a>
                                        <a href="#" class="float-right">{{ session ?
                                            formatDate(session.selfiDetails.createdAt) : "-" }}</a>
                                    </li>
                                    <li v-if="idDocDataFound">
                                        <a target="_blank"><strong>ID Document uploaded</strong></a>
                                        <a href="#" class="float-right">{{ session ? formatDate(session.ocriddocsDetails.createdAt) : "-" }}</a>
                                    </li>
                                    <li v-if="userConsentDataFound">
                                        <a target="_blank"><strong>User Consent provided</strong></a>
                                        <a href="#" class="float-right">{{ session ?
                                            formatDate(session.userConsentDetails.createdAt) : "-"
                                            }}</a>
                                    </li>
                                    <li v-if="userConsentDataFound">
                                        <a target="_blank"><strong>Finished</strong></a>
                                        <a href="#" class="float-right">{{ session ?
                                            formatDate(session.userConsentDetails.createdAt) : "-"
                                            }}</a>
                                    </li>

                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- <hf-pop-up :Header="popupHeader" id="user-img">
            <div class="card" style="">
                <div class="card-body centered-container" style="height: 500px; width: 500px;">
                    <img style="height:350px; width:350px;" :src="popupImage" />
                </div>
            </div>
        </hf-pop-up> -->

    </div>
</template>

<script>

    import UtilsMixin from '../../mixins/utils';
    import Loading from "vue-loading-overlay";
    import { mapState, mapGetters, mapActions } from "vuex";
    import UAParser from 'ua-parser-js'
    import CountryFlag from 'vue-country-flag'
    // import { LMap, LTileLayer, LMarker } from 'vue2-leaflet';


    export default {
        name: "sessionDetails",
        components: { Loading, CountryFlag,  
    //         LMap,
    // LTileLayer,
    // LMarker 
},
        computed: {
            ...mapGetters('mainStore', ['getSessionDetailsBySessionId']),
            ...mapState({
                sessionList: state => state.mainStore.sessionList,
                containerShift: state => state.playgroundStore.containerShift,
            }),
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
                if(this.userConsentDataFound){
                    const startDate = new Date(this.session.createdAt)
                    const endDate = new Date(this.session.userConsentDetails.createdAt)

                    const startEpoch = startDate.getTime()
                    const endEpoch = endDate.getTime()

                    return parseFloat(((endEpoch - startEpoch) / 1000)/60).toFixed(2)
                } else {
                    return 0
                }
                
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

            try{

                this.isLoading = true

            this.session = await this.fetchSessionsDetailsById({ sessionId: this.sessionId })

            this.isLoading = false
            
            if(this.session.deviceDetails){
                const userAgentString = this.session.deviceDetails.userAgent
                console.log(userAgentString)
                if(userAgentString){
                    let ip =  this.session.deviceDetails.ip
                    if(this.session.deviceDetails.ip){
                        const ips = this.session.deviceDetails.ip.split(',')
                        if(ips.length > 0){
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
                  Object.assign(this.deviceDetails, {...details})
                }
            }

            }catch(e){
                this.notifyErr(e.message)
                this.isLoading = false
            }
        },
        beforeRouteEnter(to, from, next) {
            next((vm) => {
                vm.prevRoute = from;
            });
        },
        methods: {
            ...mapActions('mainStore', ['fetchSessionsDetailsById']),
            zoom(place) {
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
                }
                this.$root.$emit('modal-show');
            },
            async getLocationFromIp(ip){
                try{
                    if(!ip){
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
                }catch(e){
                    this.notifyErr(e.message)
                }
            }
        },
        mixins: [UtilsMixin],

    };
</script>