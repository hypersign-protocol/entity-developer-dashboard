<style scoped>
.card-header {
  background: aliceblue;
  padding: 0px;
}

.card {
  border-radius: 10px;
}
.goschema{
  color: #339af0;
}
.goschema:hover {
    text-decoration: underline;
    cursor: pointer;
}
.far{
  color: gray;
  font-size: 1.5em;
  display: inline;
  cursor: pointer;
}
.datetime-picker{
   background-color: #fff;
    background-clip: content-box;
    border: 1px solid #ced4da;
    border-radius: 0.25rem;
    padding: 0.375rem 0.75rem;
}
.linkdiv{
  background-clip: content-box;
  background-color: rgba(173,232,255,.5607843137254902);
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
  overflow:hidden;  
  height:600px;
}
.scrollit:hover{
  overflow-y: auto;
}
</style>
<template>
  <div :class="isContainerShift ?'homeShift':'home'">
    <loading :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></loading>

    <div class="row">
      <div class="col-md-12" style="text-align: left">
        <!-- <Info :message="description" /> -->
          <div class="form-group" style="display:flex">
           <h3 v-if="vcList.length > 0" class="mt-4" style="text-align: left;">
            Credentials</h3>
            <h3 v-else class="mt-4" style="text-align: left;">Issue your first credential!</h3>
            <hf-buttons 
              name="+ Create"
              style="text-align: right;"
              class="ml-auto mt-4"
              @executeAction="openSlider()"
            ></hf-buttons>
          </div>    
            <StudioSideBar :title="isEdit? 'Edit Credential' : 'Issue Credential'">
              <div class="container">
                <div class="form-group row">
                  <div class="col-md-12">
                    <form style="padding: 5px">
                    <div class="form-group" v-if="isEdit===true">
                      <tool-tip infoMessage="Your VC Id"></tool-tip>
                      <label for="fordid"><strong>VC ID:</strong></label>
                      <input type="text" class="form-control"
                        v-model="vcId" disabled/>
                    </div>
                    <div class="form-group" v-if="isEdit===false">
                      <tool-tip infoMessage="Enter DID to whome you are issuing credential"></tool-tip>
                      <label for="fordid"><strong>Subject DID<span style="color: red">*</span>:</strong></label>                      
                      <input type="text" class="form-control" placeholder="Issued To (did:hs:...)"
                        v-model="holderDid" />
                    </div>
                    <div v-else>
                    <div class="form-group">
                      <tool-tip infoMessage="Credential issued to this DID"></tool-tip>
                      <label for="fordid"><strong>Subject DID:</strong></label>
                      <input type="text" class="form-control"
                        v-model="holderDid" disabled/>
                    </div>
                    <div class="form-group">
                      <tool-tip infoMessage="Enter Issuer DID for this Credential"></tool-tip>
                      <label for="fordid"><strong>Issuer DID:</strong></label>                      
                      <input type="text" class="form-control" placeholder="Issuer did (did:hs:...)"
                        v-model="issuerDid" disabled/>
                    </div>
                    </div>
                    <div class="form-group" v-if="isEdit===false">
                      <tool-tip infoMessage="Select Schema to issue credential"></tool-tip>
                      <label for="forselectschema"><strong>Select Schema<span style="color: red">*</span>:</strong></label>                      
                      <!-- <b-form-select v-model="selected" :options="selectOptions"
                        @change="OnSchemaSelectDropDownChange($event)" size="md" class="mt-3">
                      </b-form-select> -->
                      <hf-select-drop-down
                      :options="selectOptions"
                       @selected="e =>{OnSchemaSelectDropDownChange(e)}"
                      ></hf-select-drop-down>                
                      <span class="goschema" v-if="selectOptions.length === 1" @click="goToSchema()">Create Schema</span>                
                    </div>
                    <div class="form-group" v-for="attr in issueCredAttributes" :key="attr.name">
                      <label for="schDescription"><strong>{{ CapitaliseString(attr.name) }}<span v-if="attr.required===true" style="color: red">*</span>:</strong></label>                      
                      <Datepicker v-if="attr.type === 'date'"
                          class="datepicker"
                          name="toDate"
                          format="YYYY-MM-DD h:i:s" 
                          v-model="attr.value"
                          />
                          <!-- <input class="ml-2" v-if="attr.type === 'boolean'" type="radio" v-model="attr.value" id="required" >                      -->
                          <b-form-radio-group
                          class="pl-2"
                          style="display:inline-block;"
                          v-if="attr.type === 'boolean'"
                          id="radio-group-1"
                          v-model="attr.value"
                          :options="booleanOption"                        
                          name="radio-options-currency"                            
                        ></b-form-radio-group>
                          <input v-if="attr.type === 'integer' " type="text" class="form-control" id="schemaName" v-model="attr.value" aria-describedby="schemaNameHelp" placeholder="Enter attribute value">
                          <input v-if="attr.type == 'number'" type="text" class="form-control" id="schemaName" v-model="attr.value" aria-describedby="schemaNameHelp" placeholder="Enter attribute value">
                          <input v-if="attr.type == 'string'" type="text" class="form-control" id="schemaName" v-model="attr.value" aria-describedby="schemaNameHelp" placeholder="Enter attribute value">
                    </div>
                    <div class="form-group pt-2" v-if="isEdit===false">
                      <tool-tip infoMessage="Enter expiry time for the credential"></tool-tip>
                      <label for="fordid"><strong>Expiry Date<span style="color: red">*</span>:</strong></label>                      
                      <!-- <input type="date" class="form-control"
                         /> -->
                      <!-- <div class="form-control"> -->
                          <Datepicker 
                          class="datepicker"
                          name="expiryDateTime"
                          format="YYYY-MM-DD h:i:s" 
                          v-model="expiryDateTime"
                          />
                      <!-- </div>   -->
                    </div>
                    <div class="form-group pt-2" v-if="isEdit === true">
                      <tool-tip infoMessage="Credential Hash of the issued credential"></tool-tip>
                      <label for="fordid"><strong>Credential Hash:</strong></label>                      
                      <input type="text" class="form-control"
                      v-model="credHash" disabled
                         />
                    </div>
                    <div class="form-group pt-2" v-if="isEdit === true">
                      <tool-tip infoMessage="Issuance Date of the issued credential"></tool-tip>
                      <label for="fordid"><strong>Issuance Date:</strong></label>                      
                      <input type="text" class="form-control"                      
                      :v-model="new Date(issuanceDate).toLocaleString('en-us', { timeZone: 'UTC' })" disabled
                         />
                    </div>
                     <div class="form-group pt-2" v-if="isEdit === true">
                      <tool-tip infoMessage="Expiry Date for the issued credential"></tool-tip>
                      <label for="fordid"><strong>Expiry Date:</strong></label>                      
                      <input type="text" class="form-control"
                      :v-model="new Date(expiryDateTime).toLocaleString('en-us', { timeZone: 'UTC' })" disabled 
                         />
                    </div>
                    <!-- <div class="form-group" v-if="isEdit===true">
                      <tool-tip infoMessage="Current status of credential"></tool-tip>
                      <label for="fordid"><strong>Current Status</strong></label>                      
                      <input type="text" class="form-control" placeholder="Issued To (did:hs:...)"
                        v-model="currentStatus" disabled />
                    </div> -->
                    <div class="form-group" v-if="isEdit===true">
                      <tool-tip infoMessage="Select Status for the issued credential"></tool-tip>
                      <label for="forselectschema"><strong>Status<span style="color: red">*</span>:</strong></label>                  
                      <!-- <hf-select-drop-down
                      :options="credStatusOptions"
                       @selected="e =>{onStatusSelectDropDownChange(e)}"
                      ></hf-select-drop-down>                     -->
                      <b-form-select
                      v-model="selectedStatus"
                      :options="credStatusOptions"
                      @change="onStatusSelectDropDownChange"                    
                      >
                      </b-form-select>
                    </div>
                    <div class="form-group" v-if="isEdit === true">
                      <tool-tip infoMessage="Status Reason for the status change"></tool-tip>
                      <label for="fordid"><strong>Status Reason:</strong></label>
                      <input type="text" class="form-control"
                        v-model="statusReason"/>
                    </div>
                  </form>
                  </div>
                </div>
                <div class="form-group row">
                  <div class="col-md-12">
                    <hr />    
                    <hf-buttons 
                    v-if="isEdit === false"
                      name="Save"
                      style="text-align: right;"
                      class="ml-auto mt-4"
                      @executeAction="issueCredential()"
                    ></hf-buttons>
                    <hf-buttons
                      v-else
                      name="Update"
                      style="text-align: right;"
                      class="ml-auto mt-4"
                      @executeAction="updateCredStatus()"
                    ></hf-buttons>
                  </div>
                </div>
              </div>
              </StudioSideBar>
      </div>
    </div>
    <div class="row scrollit" style="margin-top: 2%;" v-if="vcList.length > 0">
      <div class="col-md-12">
        <table class="table table-bordered event-card" style="background:#FFFF">
          <thead class="thead-light">
            <tr>
              <th>Credential Id</th>
              <th>Type</th>
              <th>Subject DID</th>
              <th>Issuance Date </th>
              <th>Expiration Date </th>
              <!-- <th>Credential Hash</th> -->
              <th>Status</th>
              <th>Status Reason</th>

              <th></th>

            </tr>
          </thead>
          <tbody>
            <tr v-for="row in vcList" :key="row._id">
              <td>
                <div v-if="row.vc">
                <a :href="`${$config.explorer.BASE_URL}revocationRegistry/${removeUrl(row.vc.id)}`" target="_blank>">{{ row.vc.id ? shorten((row.vc.id)) : '-' }}</a>
                <i class="far fa-copy ml-1"
                style="cursor:pointer;"
                title="Click to copy VC Id"
                @click="copyToClip(removeUrl(row.vc.id),'VC Id')"
                ></i>
                </div>
                <span v-else>-</span>
              </td>
              <td>
                <div style="display:flex;" >
                <a :href="`${$config.explorer.BASE_URL}schemas/${row.schemaId}`" target="_blank">{{   row.vc?  row.vc.type[row.vc.type.length-1] : '-' }}
                </a>
                <i class="far fa-copy ml-1" v-if="row.vc"
                style="cursor:pointer;"
                title="Click to copy Schema Id"
                @click="copyToClip(row.schemaId,'Schema Id')"
                ></i>
                </div>
              </td>
              <td>
                <div style="display:flex;">
                <a :href="`${$config.explorer.BASE_URL}identity/${row.subjectDid}`" target="_blank">{{ shorten(row.subjectDid) }}
                </a>                
                <i class="far fa-copy ml-1"
                style="cursor:pointer;"
                title="Click to copy Subject DID"
                @click="copyToClip(row.subjectDid,'Subject DID')"
                ></i>
                </div>
              </td>
              <td>{{ row.credStatus ? new Date(row.credStatus.issuanceDate).toLocaleString('en-us'): "-"}}</td>
              <td>{{ row.credStatus ? new Date(row.credStatus.expirationDate).toLocaleString('en-us') : "-"}}</td>
              <!-- <td>{{ row.credStatus ?  row.credStatus.credentialHash : "-"}}</td>  -->
              <!-- <td> {{ row.credStatus ? row.credStatus.claim.currentStatus : row.status}}</td> -->

              <td v-if="row.credStatus && row.credStatus.claim">
                <span v-if="row.credStatus.claim.currentStatus=='Live'">
                  <b-badge pill variant="success" class="mr-2">{{ row.credStatus.claim.currentStatus }}</b-badge>
                </span>
                <span v-if="row.credStatus.claim.currentStatus=='Expired'">
                  <b-badge pill variant="secondary" class="mr-2">{{ row.credStatus.claim.currentStatus }}</b-badge>
                </span>
                <span v-if="row.credStatus.claim.currentStatus=='Suspended'">
                  <b-badge pill variant="warning" class="mr-2">{{ row.credStatus.claim.currentStatus }}</b-badge>
                </span>
                <span v-if="row.credStatus.claim.currentStatus=='Revoked'">
                  <b-badge pill variant="danger" class="mr-2">{{ row.credStatus.claim.currentStatus }}</b-badge>
                </span>
              </td>
              <td v-else>
                -
              </td>

              <td>{{ row.credStatus ? row.credStatus.claim.statusReason  : "-"}}</td>
              <td v-if="row.credStatus">
              <div style="display:flex;">
              <i class="fa fa-paper-plane mr-2"
                v-if="row.credStatus.claim.currentStatus==='Live'"
                @click="generateCred(`${row._id}`)" title="Click to send this vc"
                style="float:left;cursor: pointer"
                ></i>
                <i class="fas fa-pencil-alt"
                v-if="noEdit(row)"
                @click="editCred(row)" title="Click to edit this vc"
                style="cursor: pointer;"
                ></i>                      
                </div></td>
                <!-- <span v-else>-</span>              -->
              <td v-else>-</td>
            </tr>
          </tbody>
        </table>
        <hf-pop-up Header="Send Credential"> 
            <Info message="Scan QR code or Copy the link and send it to the credential owner so that they can accept in their wallet" />
            <div class="d-flex justify-content-center"><vue-qr margin="1" :text="credUrl" :size="200"
              logoBackgroundColor="white" logoCornerRadius="2"></vue-qr>
            </div>        
            <h5 class="pt-2"><span>OR</span></h5>
            <div class="linkdiv">
              <span style="max-width: 500px;overflow-wrap: break-word;padding-left: 10px;margin-top: 10px;position: absolute;">{{ truncate(credUrl,65) }}</span>
              <span style="padding: 6px;float: right;margin-top: 5px;">
                <i
                  class="far fa-copy pr-2"
                  title="copy url"
                  @click="copyToClip(credUrl,'URL')"
                ></i>
              </span>
            </div>
        </hf-pop-up>
      </div>
    </div>
  </div>
</template>

<script>
import fetch from "node-fetch";
// import Info from '@/components/Info.vue'
import UtilsMixin from '../../mixins/utils';
import HfPopUp from "../../components/element/hfPopup.vue";
import Loading from "vue-loading-overlay";
import StudioSideBar from "../../components/element/StudioSideBar.vue";
import HfButtons from "../../components/element/HfButtons.vue"
import HfSelectDropDown from "../../components/element/HfSelectDropDown.vue"
import EventBus from "../../eventbus"
import ToolTip from "../../components/element/ToolTip.vue"
import { isEmpty, isValidDid, isValidURL, isFloat } from '../../mixins/fieldValidation'
import message from '../../mixins/messages'
import Datepicker from 'vuejs-datetimepicker'
import VueQr from "vue-qr"
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";
export default {
  name: "Credential",
  components: { HfPopUp, Loading, StudioSideBar, HfButtons, HfSelectDropDown, ToolTip, Datepicker, VueQr },
  computed: {
    ...mapGetters('playgroundStore', ['vcList', 'listOfAllSchemaOptions', 'getSelectedOrg', 'findSchemaBySchemaID']),
    ...mapState({
      vcList: state => state.playgroundStore.vcList,
      containerShift: state => state.playgroundStore.containerShift,
      selectedOrgDid: state => state.playgroundStore.selectedOrgDid
    }),
    selectOptions(){
      return this.listOfAllSchemaOptions;
    },
    selectedOrg(){
      return this.getSelectedOrg;
    },
    isContainerShift() {
      return this.containerShift
    }
  },
  data() {
    return {
      booleanOption:[
        {text:true, value:true},
        {text:false, value:false},
      ],
      currentStatus:null,
      vcId:'',
      issuerDid:'',
      authToken: localStorage.getItem('authToken'),
      isEdit:false,
      // description: "An issuer can issue a credential to a subject (or holder) which can be verfied by the verifier independently, without having him to connect with the issuer. They are a part of our daily lives; driver's licenses are used to assert that we are capable of operating a motor vehicle, university degrees can be used to assert our level of education, and government-issued passports enable us to travel between countries.  For example: an airline company can issue a flight ticket (\"verfiable credential\") using schema (issued by DGCA) to the passenger.",
      active: 0,
      host: location.hostname,
      user: {},
      prevRoute: null,
      attributeName: "",
      attributes: [],
      issueCredAttributes: [],
      radioSelected: "create",
      credentialName: "",
      isCredentialIssued: false,
      signedVerifiableCredential: "",
      credentials: JSON.parse(localStorage.getItem("credentials")),
      subjectDid: "did:hs:AmitKumar",
      radioOptions: [
        { text: "Create new schema", value: "create" },
        { text: "Select existing schema", value: "existing" },
      ],
      credStatusOptions:[
        { text: "Live", value: "LIVE"},
        { text: "Suspend", value: "SUSPENDED"},
        { text: "Revoke", value: "REVOKED"}
      ],
      selected: null,
      selectedStatus:null,
      attributeValues: {},
      vcCredStatusMap: {}, 
      schemaList: [],
      fullPage: true,
      isLoading: false,
      holderDid: "",
      issuanceDate:null,
      expiryDateTime:null,
      preStatusSelect:'',
      statusReason:'',
      schema_page: 1,
      credUrl:"",
      QrData: {
        "QRType": "ISSUE_CREDENTIAL",
        "serviceEndpoint": "",
        "schemaId": "",
        "appDid": "",
        "appName": "Hypersign Studio",
        "challenge": "",
        "provider": "",
        "data": ""
      }
    };
  },
  created() {
    const usrStr = localStorage.getItem("user");
    this.user = JSON.parse(usrStr);
    this.updateSideNavStatus(true)
    this.fetchCredentialsForOrg()
    this.fetchSchemasForOrg()    
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.prevRoute = from;
    });
  },
  methods: {
    ...mapActions('playgroundStore', [ 'upsertAcredentialAction', 'fetchCredentialsForOrg','fetchSchemasForOrg']),
    ...mapMutations('playgroundStore', ['increaseOrgDataCount', 'updateSideNavStatus']),
    noEdit(row){
      if(row.credStatus.claim.currentStatus === 'Revoked' || row.credStatus.claim.currentStatus === 'Expired'){
        return false
      } else {
        return true
      }
    },
    editCred(cred) {
      this.clearEdit()
      this.isEdit = true      
      this.$root.$emit("bv::toggle::collapse", "sidebar-right");
      this.holderDid = cred.subjectDid
      this.issuerDid = cred.issuerDid
      this.credHash = cred.credStatus.credentialHash
      this.expiryDateTime = cred.credStatus.expirationDate     
      this.issuanceDate = cred.credStatus.issuanceDate
      this.preStatusSelect = cred.credStatus.claim.currentStatus
      this.statusReason = cred.credStatus.claim.statusReason
      switch(cred.credStatus.claim.currentStatus){
        case 'Live':
          this.selectedStatus = 'LIVE'
          this. credStatusOptions=[
        { text: "Live", value: "LIVE", disabled:true},
        { text: "Suspend", value: "SUSPENDED"},
        { text: "Revoke", value: "REVOKED"}
        ]
          break;
        case 'Suspended':
          this.selectedStatus = 'SUSPENDED'
          this. credStatusOptions=[
        { text: "Suspended", value: "SUSPENDED", disabled:true},
        { text: "Live", value: "LIVE"},
        { text: "Revoke", value: "REVOKED"}
        ]
          break;
        case 'Revoked':
          this.selectedStatus = 'REVOKED'
          break;
        case 'Expired':
          this.selectedStatus = 'EXPIRED'
          break;
        default :
          this.notifyError('Invalid credential status')
        }
      this.currentStatus = cred.credStatus.claim.currentStatus
      this.vcId =cred.vc.id
    },
    clearEdit() {
      this.selectedStatus = null
      this.issuerDid = ''
      this.holderDid = ''
      this.expiryDateTime = null
      this.currentStatus = ''
      this.vcId = ''
      this.preStatusSelect = ''
      this.statusReason = ''
    },
  async updateCredStatus() {
    try {
      this.isLoading = true
      //check for status check
      switch(this.preStatusSelect){
        case 'Live':
          if(this.selectedStatus === 'LIVE'){
            return this.notifyErr('Credential already Live')
          }
          break;
        case 'Suspended':
          if(this.selectedStatus === 'SUSPENDED'){
            return this.notifyErr('Credential already Suspended')
          }
          break;
        default :
          return this.notifyErr('Invalid status')
      }
      const url = `${this.$config.studioServer.BASE_URL}${this.$config.studioServer.CRED_ISSUE_EP}`;
      const creadData = {
          status: this.selectedStatus,
          vcId: this.vcId,
          statusReason:this.statusReason
          }

      const headers = {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.authToken}`
        };
        fetch(url,{
          method: "PUT",
          headers,
          body: JSON.stringify({QR_DATA: creadData})        
        }).then((res) => res.json())
        .then(json =>{
          const { QR_DATA } = json.data
          const id = QR_DATA.data._id
          if(json.message === 'success') {
            this.notifySuccess('cred status updated successfully')
            const URL = `${this.$config.webWalletAddress}/deeplink?url=${JSON.stringify(QR_DATA)}`      
            this.openWallet(URL)
            this.ssePopulateCredStatus(id, this.$store)
            this.openSlider();
          }
        })
    } catch (e) {
      console.log(e)
    } finally{
      this.isLoading = false
    }
      
    },
    showInputField(type) {
      console.log(type)
      if(type !=='date' || type !=='boolean'){
        return true
      } else {
        return false
      }
    },
    CapitaliseString(string) {
      const spaced = string.replace(/([a-z])([A-Z])/g, '$1 $2');
      return spaced.charAt(0).toUpperCase() + spaced.slice(1);
    },
    removeUrl(url) {
      const chars = url.split('credential/');
      return chars[0]
    },
    goToSchema() {
      this.$router.push({name : 'playgroundSchema'})
    },
    openSlider() {
      this.isEdit = false
      
      this.clearAll();
      this.issuerDid=this.orgDid      
      this.$root.$emit("bv::toggle::collapse", "sidebar-right");
    },
    ssePopulateCredStatus(id, store){
      const sse = new EventSource(`${this.$config.studioServer.CRED_SSE}${id}`);
      const that = this;
      sse.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.status === "Registered" || data.status === "Failed" || data.status === "Live" || data.status === "Suspended" || data.status === "Revoked") {
          sse.close();
          that.upsertAcredentialAction(data)  
        }
      };

      sse.onopen = function (e) {
        console.log("Connection to server opened.",e);
      };

      sse.onerror = function (e) {
        console.log(e)
        sse.close();
      }
      return


    },
      
    
    async  generateCred(id) {
      this.credUrl = ''
      const body = {
        id,
      }
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
      }
      const URL = this.$config.studioServer.BASE_URL + this.$config.studioServer.ACCPCT_CRED_EP
      const res = await fetch(URL, options)
      const resp =await res.json()
      this.credUrl = resp.data.url;
      this.$root.$emit('modal-show')
      this.notifySuccess("Credential URL Generated Successfully")
    },
    openWallet(url) {
      if (url != "") {
        this.walletWindow = window.open(
          `${url}`,
          "popUpWindow",
          `height=800,width=400,left=100,top=100,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no, status=yes`
        );
      }
    },
    onStatusSelectDropDownChange(event) {
      this.selectedStatus = event
      this.statusReason = ''
      // if(event) {
        
      // }
    },
    OnSchemaSelectDropDownChange(event) {  
      this.selected = null
      this.selected = event;
      if (event) {
        this.issueCredAttributes = [];        
        const selectedSchema = this.findSchemaBySchemaID(event);
        const schemaMap =  selectedSchema.schemaDetails.schema.properties;
        const requiredFields = selectedSchema.schemaDetails.schema.required  
        for (const e of Object.entries(schemaMap)) {
          let dataToPush = {
            id: event,
            type: e[1].type,
            name: e[0],
          }
          switch(e[1].type){
            case 'boolean':
               dataToPush['value'] = null
               break;
            case 'string':
              dataToPush['value'] = ""
              break;
            case 'number':
              dataToPush['value'] = ""
              break;
            case 'integer':
              dataToPush['value'] = ""
              break;
            case 'date':
              dataToPush['value'] = ""
              break;
            default:
              this.notifyErr('invalid type')
          }
          // if(e[1].type === 'boolean') {
          //   dataToPush['value'] = false
          // } else {
          //   dataToPush['value'] = ""
          // }
          this.issueCredAttributes.push(dataToPush);
        }
        // this.issueCredAttributes.map((x)=>{
        //   requiredFields.filter((y)=>{
        //    if(x.name === y){
        //     x['required'] = true
        //    }
        //    else {
        //     x['required'] = false
        //    }
        //   })
        // })
        this.issueCredAttributes.map((x)=>{
          if(requiredFields.includes(x.name)){
            x['required'] = true
          } else {
            x['required'] = false
          }
        })
      } else {
        this.issueCredAttributes = [];
      }
    },
    forceFileDownload(data, fileName) {
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
    },
    downloadCredentials() {
      this.forceFileDownload(
        JSON.stringify(this.signedVerifiableCredential),
        "vc.json"
      );
    },
    generateAttributeMap() {
      let attributesMap = [];
      let dataToSend;
      if (this.issueCredAttributes.length > 0) {
        this.issueCredAttributes.forEach((e) => {
          // if(e.type !== 'boolean'){
          // if (isEmpty(e.value)) {
          //   throw new Error(`Please enter value in ${this.CapitaliseString(e.name)} field`)
          // } else if(e.type === 'number') {
          //   if(isNaN(parseInt(e.value))){
          //     throw new Error('Enter a number')
          //   }
          // }
          // }   
            switch(e.type) {
            case 'string': {
              if(e.required === true) {
                if(e.value === ''){
                throw new Error(`Please enter input in ${this.CapitaliseString(e.name)} field`)
              }
              }              
              break;
            }
            case 'number': {
              if(e.required === true){
                if(e.value === '' || !(Number(e.value))) {
                throw new Error(`Please enter valid input in ${this.CapitaliseString(e.name)} field`)
              }
              } else {
                if(e.value !=='' && !(Number(e.value))) {
                throw new Error(`Please enter valid input in ${this.CapitaliseString(e.name)} field`)
              }
              }              
              break;
            }
            case 'integer': {
              if(e.required === true){
                if(e.value === '' || isFloat(e.value) || isNaN(e.value)) {
                throw new Error(`Please enter valid input in ${this.CapitaliseString(e.name)} field`)
              }
              } else {
                if(e.value !=='' && ((isFloat(e.value) || isNaN(e.value)))) {
                throw new Error(`Please enter valid input in ${this.CapitaliseString(e.name)} field`)
              }
              }
              break;
            }            
            case 'date': {
              if(e.required === true) {
                if(e.value === '' || isValidURL(e.value)){
                throw new Error(`Please enter valid input in ${this.CapitaliseString(e.name)} field`)
              }
              } else {
                 if(isValidURL(e.value)){
                throw new Error(`Please enter valid input in ${this.CapitaliseString(e.name)} field`)
              }
              }     
              break;
            }
            case 'boolean': {
              if(e.required === true) {
                if(e.value === null){
                throw new Error(`Please enter valid input in ${this.CapitaliseString(e.name)} field`)
              }
              }
              break;
            }
            default :
            throw new Error('invalid type')    
          }
          if(e.value !=='' && e.value !== null){
            dataToSend = {
            name:e.name,
            type:e.type,
            value: e.value,            
          }  
          attributesMap.push(dataToSend)
          }
        });
      }
      return attributesMap;
    },
    async issueCredential() {
      try {
        const ToDate = new Date();
        if (isEmpty(this.holderDid)) {
          return this.notifyErr(message.CREDENTIAL.EMPTY_HOLDER_DID)
        } 
        // else if(isEmpty(this.issuerDid)) {
        //   return this.notifyErr(message.CREDENTIAL.EMPTY_ISSUER_DID)
        // } 
        // else if(!isValidDid(this.issuerDid)) {
        //   return this.notifyErr(message.CREDENTIAL.INVALID_DID)
        // } 
        else if (!isValidDid(this.holderDid)) {
          return this.notifyErr(message.CREDENTIAL.INVALID_DID)
        } else if (isEmpty(this.selected)) {
          return this.notifyErr(message.CREDENTIAL.SELECT_SCHEMA)
        }
        // generateAttributeMap
        const attributeMap = await this.generateAttributeMap();
        
          if(!this.expiryDateTime){
            return this.notifyErr('Enter Expiry Date for credential')
          }
          if (new Date(this.expiryDateTime).getTime() <= ToDate.getTime()) {          
          return this.notifyErr("Expiry time should be gretter than current date & time");
        }
        this.isLoading = true
        const fields = attributeMap
        const schemaId = this.selected
        const issuerDid = this.getSelectedOrg.orgDid   
        const subjectDid = this.holderDid
        const expirationDate = this.expiryDateTime
        const url = `${this.$config.studioServer.BASE_URL}${this.$config.studioServer.CRED_ISSUE_EP}`;
        const headers = {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.authToken}`
        };
        const creadData = {
          fields,
          schemaId,
          issuerDid,
          subjectDid,
          expirationDate,
          orgDid: this.selectedOrgDid
        };
        this.QrData.data = creadData
        fetch(url, {
          method: "POST",
          headers,
          body: JSON.stringify({ QR_DATA: this.QrData }),
        }).then((res) => res.json())
          .then(json => {
            const { QR_DATA, creadRecord } = json.data
            if (json.message === 'success') {
              this.notifySuccess("Credential creation initiated. Please approve the trancation from your wallet")
              this.upsertAcredentialAction(creadRecord)
              const URL = `${this.$config.webWalletAddress}/deeplink?url=${JSON.stringify(QR_DATA)}`
              this.openWallet(URL)
              this.ssePopulateCredStatus(creadRecord._id, this.$store)
              this.openSlider();
              this.increaseOrgDataCount('credentialsCount')
           } else {
             console.log(json)
             throw new Error(`${json.message}`)
            }       
          })
      } catch (e) {
        console.log(e)
        this.isLoading = false
        this.notifyErr(`Error: ${e.message}`)
      } finally {
        this.isLoading = false;
      }
    },
    clearAll() {    
      this.issuerDid = ""
      this.holderDid = "";
      this.expiryDateTime = null
      this.issueCredAttributes = []
      EventBus.$emit("resetOption",this.selected)
    }
  },
  mixins: [UtilsMixin],

};
</script>


