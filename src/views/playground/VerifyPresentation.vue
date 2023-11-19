<style scoped>
h5 {
  width: 80%;
  text-align: center;
  border-bottom: 1px solid #80808045;
  line-height: 0.1em;
  margin: 10px 0 20px;
  display: inline-block;
}

h5 span {
  background: #fff;
  padding: 0 10px;
}

.button-theme {
background-color: #905ab0;
    border-collapse: #905ab0;
  color: #fff;
  border: 0;
}

.leafygreen-ui-196mwvg {
  border: 1px solid rgb(232, 237, 235);
  border-radius: 12px;
  overflow: hidden;
}

.leafygreen-ui-mlc9qv {
  position: relative;
  display: grid;
  grid-template-areas:
  "code panel";
  grid-template-columns: auto 38px;
  border-radius: inherit;
  z-index: 0;
}

.css-1sdjnkx {
  word-break: break-word;
}

.leafygreen-ui-vbfbru {
  grid-area: code;
  overflow-x: auto;
  border-top-left-radius: inherit;
  border-bottom-left-radius: inherit;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border: 0px none rgb(232, 237, 235);
  /* padding-top: 8px;
  padding-bottom: 8px; */
  margin: 0px;
  position: relative;
  transition: box-shadow 100ms ease-in-out 0s;
  white-space: pre;
  background-color: rgb(249, 251, 250);
  color: rgb(0, 30, 43);
}

.leafygreen-ui-y7nvfm {
  color: inherit;
  font-family: "Source Code Pro", Menlo, monospace;
  line-height: 12px;
  font-size: 13px;
}


.leafygreen-ui-16sacod {
  display: flex;
  -moz-box-align: center;
  align-items: center;
  flex-direction: column;
  flex-shrink: 0;
  gap: 4px;
  padding: 6px;
  border-left: 1px solid rgb(232, 237, 235);
    border-left-color: rgb(232, 237, 235);
  background-color: rgb(255, 255, 255);
  border-color: rgb(232, 237, 235);
  z-index: 2;
  grid-area: panel;
}
</style>

<template>
    <div :class="isContainerShift ?'homeShift':'home'">
    <loading :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></loading>

    <div class="row">
        <div class="col-md-12" style="text-align: left">
            <div class="form-group" style="display:flex">
                <h3 class="mt-4" style="text-align: left;">
                Credential Verification</h3>
            </div>
        </div>
    </div>
    
    <div class="row">
        <div class="col-md-4">
            <div class="form-group">
                <label>Select a presentation template: </label> 
                <hf-select-drop-down
                    :options="selectOptions"
                    @selected="e =>{OnTemplateSelectDropDownChange(e)}"
                ></hf-select-drop-down>
                
            </div>  
            <div class="form-group">
                <label>Or Enter a presentation template Id : </label> 
                <input  class="form-control" type="text" name="" v-model="presentantionTemplateId" placeholder="63c518ec4eca295bd017bf57" />
            </div>
            <div class="">
                <hf-buttons 
                    name="Request"
                    class="ml-auto mt-4"
                    @executeAction="requestPresentation()"
                ></hf-buttons>
            </div>
                     
        </div>

        <div class="col-md-4" v-if="presentantionTemplateId != '' && showQR">
            <div class="justify-content-center" style="text-align: center;">
                This QR code will expire in <span class="badge badge-danger">{{ this.countDown }}</span> seconds
                <canvas id="studio-qr"></canvas>
                <label style="font-size:small; color:grey;">Scan the QR code using Hypersign Identity Wallet</label>
                <div class="justify-content-center" style="text-align: center;"><h5><span>OR</span></h5></div>
                <div id="studio-btn" class="justify-content-center" style="text-align: center;"></div>
            </div>           
        </div> 
    </div>

    <div id="load-script"></div>

    <div class="row">
        
    </div>

    <hf-pop-up  Header="Credentials Verification Report" >
        <div style="max-height: 600px; overflow-y: scroll;">
        <div class="card" v-for="eachcredential in verfiableCredentials" style="margin-bottom: 3%;">
            <div class="card-header">
                <div class="row">
                    <div class="col-md-12">
                        <span><i class="fa fa-id-card"></i> {{eachcredential.type[1]}}</span>
                        <span class="card-title" style="float:right">
                            <img :src="images.greentick" height="21" width="21"/>
                        </span>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-12" style="font-size: 11px; color: #808080b3;">
                        {{eachcredential.id}} 
                        <i class="far fa-copy ml-1"
                            style="cursor:pointer;"
                            title="Click to copy credential id"
                        @click="copyToClip(eachcredential.id,'Credential Id')"></i>
                    </div>
                </div>

                
            </div>
            <div class="card-body">
                <ul class="list-group" style="max-height: 250px;overflow: scroll;">
                    <li class="list-group-item" ><span style="font-weight: bold;">Issuer : </span> {{ shorten(eachcredential.issuer) }}  <i class="far fa-copy ml-1"
                            style="cursor:pointer;"
                            title="Click to copy issuer DID"
                        @click="copyToClip(eachcredential.issuer,'Issuer DID')"></i></li>
                    <li class="list-group-item" v-for="eachSubjectField in Object.keys(eachcredential.credentialSubject)">
                        <span style="font-weight: bold;">{{eachSubjectField}} :</span> 
                        <span v-if="eachSubjectField === 'id'"> {{ shorten(eachcredential.credentialSubject[eachSubjectField])}} 
                            <i class="far fa-copy ml-1"
                            style="cursor:pointer;"
                            title="Click to copy subject DID"
                            @click="copyToClip(eachcredential.issuer,'Subject DID')"></i>
                        </span>
                        <span v-else>
                            {{eachcredential.credentialSubject[eachSubjectField]}}
                        </span>
                    </li>
                </ul>
            </div>
            <!-- <div class="card-footer"></div> -->
        </div>
    </div>
    </hf-pop-up>


    
    </div>
</template>

<script>
import UtilsMixin from '../../mixins/utils';
import HfPopUp from "../../components/element/hfPopup.vue";
import Loading from "vue-loading-overlay";
import HfSelectDropDown from "../../components/element/HfSelectDropDown.vue"
import VueQr from "vue-qr";
import HfButtons from "../../components/element/HfButtons.vue"
import EventBus from "../../eventbus"
import { mapState, mapGetters } from "vuex"

export default {
    name: "VerifyPresentation",
    components: { HfPopUp, Loading, VueQr, HfButtons, HfSelectDropDown }, 
    computed:{
        ...mapState({
            containerShift: state => state.playgroundStore.containerShift,
        }),
        ...mapGetters('playgroundStore', ['listOfPresentationTemplateOptions']),
        isContainerShift() {
            return this.containerShift
        },
        selectOptions(){
            return this.listOfPresentationTemplateOptions;
        },
    },
  
    created() {
        this.$store.commit('playgroundStore/updateSideNavStatus',true)
        this.removeEventListener()
        
    },  
    data() {
        return {  
            attempts: 0,          
            expiredAfterSec: 60,
            countDown: 60,            
            challenge: "",
            showQR: false,
            presentantionTemplateId: "",
            fullPage: true,
            isLoading: false,
            authToken: localStorage.getItem("authToken"),
            qrData: "",
            verfiableCredentials: null,
            images: {
                greentick: require("../../assets/green-tick.png"),
            },
            successEvntHandler: null
        }
    },
    methods: {

        countDownTimer () {

            const interval = setInterval(() =>{
                if(this.countDown > 0 && this.challenge){
                    this.countDown -= 1    
                } else {
                    this.cleanQR()
                    clearInterval(interval)
                }
            }, 1000)

          
                
        },
        addEventListener(){
            document.addEventListener('studio-init', this.studioInitListenerCB);
            document.addEventListener('studio-success', this.studioSuccessListenerCB);
            document.addEventListener('studio-wait', this.studioWaitListenerCB);
            document.addEventListener('studio-error', this.studioErrorListenerCB);
        },
        removeEventListener(){
            console.log('Removing all event listeneres...')
            document.removeEventListener('studio-init', this.studioInitListenerCB);
            document.removeEventListener('studio-success', this.studioSuccessListenerCB);
            document.removeEventListener('studio-wait', this.studioWaitListenerCB);
            document.removeEventListener('studio-error', this.studioErrorListenerCB);
        },
        studioInitListenerCB: function (e){            
            if(!this.challenge){
                this.challenge = e.detail.id;
                this.countDownTimer()
                console.log('studio-init:: setting gbl challenge '+ this.challenge)
                return;
            }

        },
        studioErrorListenerCB: function (e){

            //console.log('inside studio-error')
            console.error(e.detail);

        },
        studioWaitListenerCB: function (e) {

            //console.log('inside studio-wait')
            const { id } = e.detail;
            if(this.challenge != id){
                return;
            }

        },

        studioSuccessListenerCB: async function (e) {
            
            console.log('inside studio-sucess')
            
            const { message, id } = e.detail;

            
            
            if(this.challenge != id){
                console.log('studio-success:: Not doing anything .. For some other challenge '+ id)
                return;
            }

            console.log('inside studio-success id = '+  id)
            
            if (message.accessToken && this.challenge) {
                const url = this.$config.studioServer.BASE_URL + 'api/v1/presentation/request/info';
                const accessToken = message.accessToken;
                
                
                this.isLoading = true;
                const delayTime = 3000; // 3s
                const delay = (delayInms) => {
                    return new Promise(resolve => setTimeout(resolve, delayInms));
                }
                console.log('waiting for ' + delayTime + ' ms...')
                await delay(delayTime)


                const resp =  await fetch(url, { 
                                    headers: { accessToken },
                                    method: 'GET'
                                });
                    if(resp.status === 200){
                    const json =  await resp.json();
                    const { message } = json;
                    if(message == 'success'){
                        const { data } = json;
                        if(data){
                            this.verfiableCredentials = data.verifiableCredential; 
                            this.$root.$emit('modal-show');
                            this.cleanQR()
                        } else {
                            console.log('data not present')
                        }
                    } else {
                        console.log('Else  message = ' +  message)
                    }

                    this.isLoading = false
                    return;
                } else if(resp.status === 400) {
                    const json =  await resp.json();
                    console.log({
                        json, 
                        status: 400
                    })
                } else {
                    this.isLoading = false
                    this.notifyErr('Some error occured')
                }                
                this.cleanQR()
            } else if(message === 'Challenge expired') {
                this.notifyErr('Challenge expired, reload the QR code')
                this.cleanQR();
            } else {
                this.cleanQR();
                console.error('Something went wrong or challenge is blank, try again')
            }
        },
        cleanQR() {
            EventBus.$emit("resetOption", this.presentantionTemplateId)
            this.presentantionTemplateId = ""
            this.showQR = false;
            this.qrData = ""
            const loadScript = document.getElementById('load-script')
            if(loadScript) loadScript.innerHTML = ""
            this.removeEventListener()
            this.isLoading = false
            this.challenge = ""
            this.countDown = 60
        },
        OnTemplateSelectDropDownChange(event) {
            if (event) {     
                this.cleanQR();
                console.log('inside event of OnTemplateSelectDropDownChange eventvalue = '+ event)
                this.presentantionTemplateId = event
            } else {
                this.cleanQR();
            }
        },
        requestPresentation(){

            
            if(this.showQR){
                return 
            }
            if(!this.presentantionTemplateId){
                return  this.notifyErr('Select a presentation or enter presentationId')
            }
            
            this.verfiableCredentials = null;
            //this.cleanQR()
            
            console.log('adding event listenere time' + new Date())
            //this.addEventListener();

            let divScripts = document.getElementById('load-script');
            if(divScripts){
                let newScript = document.createElement('script');
                newScript.setAttribute('src', '/hs-sdk.js')
                newScript.setAttribute('data-button-text', 'Present Credential')
                newScript.setAttribute('data-button-css-class', 'btn button-theme')
                newScript.setAttribute('data-hs-wallet-base-url', this.$config.webWalletAddress)
                newScript.setAttribute('data-presentation-request-endpoint', `${this.$config.studioServer.BASE_URL}api/v1/presentation/request/`)
                newScript.setAttribute('data-presentation-template-id', this.presentantionTemplateId)
                divScripts.innerHTML = ""
                divScripts.appendChild(newScript)
                this.showQR = true;
            } else {
                console.log('divScripts = ' + divScripts)
            }
            this.addEventListener()
        }

    },
    destroyed(){
        this.cleanQR()
        document.cloneNode(true)
        console.log('Isndie destoryed')
    },  
    mixins: [UtilsMixin],

}
</script>
