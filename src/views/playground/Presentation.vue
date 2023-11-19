<style scoped>
.floatLeft {
  float: left;
}
.card {
  border-radius: 10px;
}
.card-header {
  background: aliceblue;
  padding: 0px;
}
.goschema{
  color: #339af0;
}
.goschema:hover {
    text-decoration: underline;
    cursor: pointer;
}
.scrollit {
  overflow:hidden;  
  height:600px;
}
.scrollit:hover{
  overflow-y: auto;
}
.far{
  color: gray;
  font-size: 1.5em;
  /* padding-top: 10px; */
  cursor: pointer;
}
</style>

<style scoped>
.multiselect__tags {
  border-radius: 0.25rem;
  border: 1px solid #ced4da;
  background: #fff;
  font-weight: 400;
}

.multiselect__tag {
  background:var(--button-bg-color)
}
</style>
<template>
  <div :class="isContainerShift ?'homeShift':'home'">
    <loading :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></loading>

    <div class="row">
      <div class="col-md-12" style="text-align: left">
        <!-- <Info :message="description" /> -->
        
          <div class="form-group" style="display:flex">
           <h3 v-if="templateList.length > 0" class="mt-4" style="text-align: left;">
            Presentation Templates</h3>
            <h3 v-else class="mt-4" style="text-align: left;">Create your first presentation template!</h3>            
            <hf-buttons 
              name="+ Create"
              style="text-align: right;"
              class="ml-auto mt-4"
              @executeAction="openSlider()"
            ></hf-buttons>
          </div>
          <StudioSideBar :title="isEdit ? 'Edit Presentation Template' : 'Create Presentation Template'">

              <div class="form-group row container">
                <div class="col-md-12">
                  <form>
                    <!-- <div class="form-group">
                      <label class="floatLeft"><strong> Domain :</strong></label>
                      <input class="form-control" type="url" v-model="presentationTemplate.domain" disabled/>


                    </div> -->
                    <div class="form-group">
                      <tool-tip infoMessage="Name for the Presentation template"></tool-tip>
                      <label ><strong>Name (optional) :</strong></label>                      
                      <input class="form-control" type="text" v-model="presentationTemplate.name" 
                      placeholder="Enter name for this presentation"/>


                    </div>
                    <div class="form-group">
                      <tool-tip infoMessage="Did of the issuer"></tool-tip>
                      <label><strong> Issuer DID<span style="color: red">*</span>:</strong></label>                      

                      <input class="form-control" type="text" v-model="presentationTemplate.issuerDid"
                      placeholder="Issuer did (did:hs:...)" disabled/>


                    </div>
                    <!-- <div class="form-group">
                      <label class="floatLeft"><strong>Schema Id :<strong></label>
                      <input class="form-control" type="text" v-model="presentationTemplate.schemaId" />


                    </div> -->
                    <div class="form-group">
                      <tool-tip infoMessage="Select Schema to create template"></tool-tip>
                      <label for="forselectschema"><strong>Select Schema<span style="color: red">*</span>:</strong></label>                      
                      <!-- <hf-select-drop-down
                      :options="selectOptions"
                       @selected="e =>{OnSchemaSelectDropDownChange(e)}"
                      ></hf-select-drop-down> -->


                      <multiselect
                        v-model="selectedSchemIdsInMultiSelect"
                        placeholder="Search or select schema (s)"
                        label="text"
                        track-by="value"
                        :options="selectOptions"
                        :multiple="true"
                        :taggable="false"
                        :close-on-select="false"
                        :clear-on-select="false"
                        @input="onInputTag"
                      >
                      </multiselect>

                      <div v-if="selectOptions.length === 1">
                      <span class="goschema" @click="gotosubpage('playgroundSchema')">Create Schema</span>                      
                      </div>
                    </div>              
                    <div class="form-group">
                      <tool-tip infoMessage="Reason for the template"></tool-tip>
                      <label><strong>Reason<span style="color: red">*</span>:</strong></label>                      
                      <input class="form-control" type="text" @keyup='charCount()' v-model="presentationTemplate.reason" 
                      placeholder="Reason for the template"/>
                      <span>{{remainingCharText}}</span>

                    </div>
                    <div class="form-group">
                      <tool-tip infoMessage="Callback URI"></tool-tip>
                      <label><strong>Callback URI<span style="color: red">*</span>:</strong></label>                      

                      <input class="form-control" type="url" v-model="presentationTemplate.callbackUrl" 
                      placeholder="Callback URI"/>


                    </div>
                    <!-- <div class="form-group">
                      <tool-tip infoMessage="Required"></tool-tip>                      
                      <label><strong>Required </strong></label>
                      <input type="checkbox" class="ml-2" v-model="presentationTemplate.required" />
                    </div> -->

                  </form>
                  <hr />
                  <hf-buttons 
                  v-if="isEdit === true"
                    name="Update"                    
                    @executeAction="generatePresentation()"
                  ></hf-buttons>
                  <hf-buttons 
                    v-else
                    name="Save"                    
                    @executeAction="generatePresentation()"
                  ></hf-buttons>
                </div>
              </div>
            </StudioSideBar>
          
      </div>
    </div>
    <div class="row scrollit" style="margin-top: 2%;" v-if="templateList.length >0">
      <div class="col-md-12">
        <table class="table table-bordered event-card" style="background:#FFFF">
          <thead class="thead-light">
            <tr>
              <th>Template Id </th>        
              <th>Name</th>
              <!-- <th>Issuer DID</th> -->
              <th>Schema Id (s)</th>
              <!-- <th>Reason</th> -->
              <th>CallBack Url</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="row in templateList" :key="row._id">
              <td class="align-middle">
                <div class="align-middle" style="display:flex;">
                <span class="mr-1">{{row._id}}</span>
                <i class="far fa-copy"
                style="cursor:pointer;"
                title="Click to copy Template Id"
                @click="copyToClip(row._id,'Template Id')"
                ></i>
                </div>
              </td>              
              <td class="align-middle">{{row.name}}</td>
              <!-- <td>{{row.issuerDid.toString()}}</td> -->
              <td class="align-middle">
                <span v-for="eachschema in row.schemaId" v-if="Array.isArray(row.schemaId)">
                  <a :href="`${$config.explorer.BASE_URL}schemas/${eachschema}`" target="_blank">{{ shorten(eachschema)}}
                  </a>
                  <i class="far fa-copy"
                  style="cursor:pointer;"
                  title="Click to copy Schema Id"
                  @click="copyToClip(eachschema,'Schema Id')"
                  ></i> <br>
                </span>
                <span v-else>
                  <a :href="`${$config.explorer.BASE_URL}schemas/${row.schemaId}`" target="_blank">{{ shorten(row.schemaId)}}
                  </a>
                  <i class="far fa-copy"
                  style="cursor:pointer;"
                  title="Click to copy Schema Id"
                  @click="copyToClip(row.schemaId,'Schema Id')"
                  ></i>
                </span>
                  
              </td>
              <!-- <td class="align-middle">{{row.reason}}</td> -->
              <td class="align-middle" :title="row.callbackUrl">{{truncate(row.callbackUrl,40)}}</td>
              <td class="align-middle">
              <div style="display:flex">
              <i 
              class="fas fa-pencil-alt pr-1"
              style="cursor: pointer"
              title="Click to update"
              @click="editTemp(row)"
              ></i>
              <i 
              class="fas fa-trash-alt"
              style="cursor: pointer;"
              title="Click to delete"
              @click="clickRowToDelete(row)"
              ></i>
              </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- </div> -->
        <!-- </div> -->
      </div>
      <!-- </div> -->
    </div>
    <hf-pop-up
    Header="Delete Presentation Template"
    >
    <div class="row g-3 align-items-center  mt-4">
        <div class="col-lg-3 col-md-3 text-left">
          <label for="DeleteId" class="col-form-label">Template Id :</label>
        </div>
        <div class=" col-lg-9 col-md-9">
          <input v-model="deleteId" type="text" placeholder="6241c8057f5e...e2eaec05d" id="DeleteId" class="form-control w-100" >
        </div>   
    </div>
      <div class="mt-5 text-center">
      <hf-buttons
      name="Delete"
      @executeAction="deleteTemp()"
      title="Delete Presentation Template"
      customClass="btn btn-danger"
      ></hf-buttons>
      </div>
    </hf-pop-up>
  </div>
</template>

<script>
import HfPopUp from "../../components/element/hfPopup.vue"
import fetch from "node-fetch";
import UtilsMixin from '../../mixins/utils';
import StudioSideBar from "../../components/element/StudioSideBar.vue";
import HfButtons from "../../components/element/HfButtons.vue"
import conf from '../../config';
const { hypersignSDK } = conf;
import QrcodeVue from "qrcode.vue";
// import Info from '@/components/Info.vue'
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import HfSelectDropDown from "../../components/element/HfSelectDropDown.vue"
import EventBus from "../../eventbus"
import ToolTip from "../../components/element/ToolTip.vue"
import message from '../../mixins/messages'
import { isEmpty, isValidURL, isValidDid } from '../../mixins/fieldValidation'
import { mapGetters, mapState, mapActions  } from "vuex";
export default {
  name: "Presentation",
  components: { QrcodeVue , StudioSideBar, HfButtons, Loading, HfSelectDropDown, ToolTip, HfPopUp},
  computed:{
    ...mapGetters('playgroundStore', ['listOfAllSchemaOptions', 'getSelectedOrg']),
    ...mapState({
      templateList: state => state.playgroundStore.templateList,
      containerShift: state => state.playgroundStore.containerShift,
      selectedOrgDid: state => state.playgroundStore.selectedOrgDid
    }),
    selectedOrg(){
      return this.getSelectedOrg;
    },
    selectOptions(){
      return this.listOfAllSchemaOptions;
    },
    isContainerShift() {
      return this.containerShift
    }
  },
  data() {
    return {
      selectedSchemIdsInMultiSelect: [],
      isEdit:false,
      deleteId:'',
      maxChar:105,
      remainingCharText:'Remaining 105 characters',
      tempToDelete:'',    
      // description: "The subject (or holder) generates verifiable presentation from one or more verifiable \
      // credentials, issued by one or more issuers, that is shared with a specific verifier. \
      // A verifiable presentation is a tamper-evident presentation encoded in such a way that \
      // authorship of the data can be trusted after a process of cryptographic verification. \
      // Certain types of verifiable presentations might contain data that is synthesized from, \
      // but do not contain, the original verifiable credentials for example, in order to proof the \
      // subject that he/she is an adult, she/he does not have to tell his/her actual age \
      // (i.e. Zero knowledge proof). The airline passenger might not have to show the complete ticket\
      // to the secruity personal to pass the security check. The passenger will have ability to show \
      // just one document (the verifiable presentation) derived from his passport and air ticket to\
      // show at the security check.",
      presentationTemplate: {
        queryType: 'QueryByExample',
        domain: "",
        name: '',
        issuerDid:'',
        schemaId: '',
        reason: '',
        required: true,
        callbackUrl: 'https://entity.hypersign.id',
      },
      id:'',
      selected:null,
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
      attributeValues: {},
      authToken: localStorage.getItem("authToken"),
   
      schemaMap: {},
      vcList: [],
      schemaList: [],
      fullPage: true,
      isLoading: false,
      holderDid: "did:hs:8b915133-cb8b-4151-9a63-1b91f702297f",
      signedVerifiablePresentation: {},
      presentationDetails: {
        credentialType: {}
      },
      isClaims: false
    };
  },
  created() {
    const usrStr = localStorage.getItem("user");
    this.user = JSON.parse(usrStr);
    this.$store.commit('playgroundStore/updateSideNavStatus',true)
    // this.fetchTemplates()
    this.fetchSchemasForOrg()
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.prevRoute = from;
    });
  },
  methods: {
    ...mapActions('playgroundStore', ['fetchSchemasForOrg']),
    onInputTag(){
      console.log('onInputTag ()  got called')
      if(this.selectedSchemIdsInMultiSelect.length > 0){
        console.log('Inside if mapping');  
        this.presentationTemplate.schemaId = this.selectedSchemIdsInMultiSelect.map(x => x.value)
      } else {
        this.presentationTemplate.schemaId = []; 
      }
    },  
    charCount(){
      if(this.presentationTemplate.reason.length > this.maxChar) {
        this.remainingCharText = "Exceeded"+" "+this.maxChar+" "+"characters limit"
      } else {
        let remainingChar = this.maxChar - this.presentationTemplate.reason.length;
        this.remainingCharText = "Remaining"+" "+remainingChar+" "+"characters."      
        }
    },
    editTemp(temp) {
      this.selectedSchemIdsInMultiSelect = []
      this.isEdit = true
      this.$root.$emit("bv::toggle::collapse", "sidebar-right");
      this.id = temp._id
      this.presentationTemplate.name = temp.name
      this.presentationTemplate.issuerDid = temp.issuerDid[0]
      
      if(Array.isArray(temp.schemaId)){
        this.presentationTemplate.schemaId = temp.schemaId
        this.selectOptions.forEach(eachOpt => {
          if(temp.schemaId.find(x => x == eachOpt.value)){
            this.selectedSchemIdsInMultiSelect.push(eachOpt)
          }
        });
        
        
      } else {
        this.presentationTemplate.schemaId = [temp.schemaId]
        
        const t = this.selectOptions.find(x => x.value === temp.schemaId)
        this.selectedSchemIdsInMultiSelect.push(t)
      }
      
      this.presentationTemplate.reason = temp.reason
      this.charCount()
      this.presentationTemplate.callbackUrl = temp.callbackUrl
      // this.presentationTemplate.required = temp.required
    },
    clickRowToDelete(temp) {
     this.deleteId = ''
      this.tempToDelete = temp._id;
      this.$root.$emit('modal-show');
    },
   async deleteTemp() {
      try {
        if(this.deleteId === "") {
          this.notifyErr("Please enter template id")
        } 
        this.isLoading = true
        if(this.deleteId) {
          if(this.deleteId === this.tempToDelete) {
            const url = `${this.$config.studioServer.BASE_URL}${this.$config.studioServer.PRESENTATION_TEMPLATE_EP}/${this.tempToDelete}`;
                const headers = {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${this.authToken}`               
                };
                const resp = await fetch(url, {
                  headers,
                  method: "DELETE",
                });
                const json = await resp.json();
                console.log(json.data._id)
                if(json.data._id){
                  const id = json.data._id
                  this.$store.commit('playgroundStore/deleteTemplate',id)
                  this.notifySuccess(`Template with ${id} id deleted successfully`)
                  this.$root.$emit('modal-close')
                  this.$store.commit('playgroundStore/DecreaseOrgTemplateCount','templatesCount')
                }          
          } else {
            this.notifyErr('Please enter correct template id')
          }
        }
      }catch (e){
        console.log(e)
      } finally {
        this.isLoading = false
      }

    },
    clearAll() {
      EventBus.$emit("resetOption",this.selected)
      this.presentationTemplate.issuerDid = ''
      this.presentationTemplate.domain = ''
      this.presentationTemplate.name = ''
      // this.presentationTemplate.required = true
      this.presentationTemplate.callbackUrl = 'https://entity.hypersign.id'
      this.presentationTemplate.reason = ''
      this.isEdit = false
      this.maxChar=105,
      this.remainingCharText='Remaining 105 characters'
      this.selectedSchemIdsInMultiSelect = []
    },
    openSlider() {
      this.clearAll()
      this.presentationTemplate.issuerDid= this.getSelectedOrg.orgDid
      // this.presentationTemplate.issuerDid = JSON.parse(localStorage.getItem("user")).id
      this.presentationTemplate.domain = this.selectedOrg.domain;
      this.$root.$emit("bv::toggle::collapse", "sidebar-right");
    },
    showClaims() {
      if (this.isClaims) this.isClaims = false;
      else this.isClaims = true;
    },
    notifySuccess(msg) {
      this.$notify({
        group: 'foo',
        title: 'Information',
        type: 'success',
        text: msg
      });
    },
    notifyErr(msg) {
      this.$notify({
        group: 'foo',
        title: 'Error',
        type: 'error',
        text: msg
      });
    },
    fetchData(url) {
      fetch(url)
        .then((res) => res.json())
        .then((j) => {
          if (j.status != 200) throw new Error(j.error);
          return j.message;
        })
        .catch((e) => this.notifyErr(`Error: ${e.message}`));
    },
    gotosubpage (name){
      this.$router.push({ name });
    },
    addBlankAttrBox() {
      if (this.attributeName != " ") {
        this.attributes.push(this.attributeName);
        this.attributeName = " ";
      }
    },
    downloadCredentials() {
      this.forceFileDownload(
        JSON.stringify(this.signedVerifiablePresentation),
        "vp.json"
      );
    },
    onfileLoadSuccess(evt) {
      // console.log('Inside callbacl')
      const fileJSON = JSON.parse(evt.target.result);
      if (!fileJSON) this.notifyErr("Incorrect file");
      const typeArr = fileJSON["type"]
      if (typeArr.find(x => x == 'VerifiableCredential')) {
        // console.log('Inside callbacl: vc')
        localStorage.removeItem('credential')
        localStorage.setItem("credential", JSON.stringify(fileJSON));
      } else if (typeArr.find(x => x == 'VerifiablePresentation')) {
        // console.log('Inside callbacl: vp')
        localStorage.removeItem('presentation')
        localStorage.setItem("presentation", JSON.stringify(fileJSON));
      } else {
        this.notifyErr("Invalid file")
      }
    },
    readFile(file, cb) {
      // console.log('Inside reaffileDs')
      const reader = new FileReader();
      reader.onload = cb
      reader.readAsText(file);
    },
    onFileChange(event) {
      const file = event.target.files[0];
      this.readFile(file, this.onfileLoadSuccess)
    },
    async generatePresentation() {
      this.isLoading = true
      let issuerDid = []
      try {
          if(this.presentationTemplate.name!=='' && this.presentationTemplate.name.length >31){
            return this.notifyErr(message.PRESENTATION.NAME_LIMIT_EXCEED)
        } else if(this.presentationTemplate.name!=='' && isValidURL(this.presentationTemplate.name)){
          return this.notifyErr(message.PRESENTATION.VALID_NAME)
        } else if(isEmpty(this.presentationTemplate.issuerDid)){
          return this.notifyErr(message.PRESENTATION.ISSUER_DID_EMPTY)
        } else if(!isValidDid(this.presentationTemplate.issuerDid)){
          return this.notifyErr(message.CREDENTIAL.INVALID_DID)
        } else if (this.presentationTemplate.schemaId.length <= 0) {
          return this.notifyErr(message.CREDENTIAL.SELECT_SCHEMA)
        } else if (isEmpty(this.presentationTemplate.reason)) {
          return this.notifyErr(message.PRESENTATION.REASON)
        } else if (this.presentationTemplate.reason.length >this.maxChar) {
          return this.notifyErr(message.PRESENTATION.REASON_LIMIT_EXCEED)
        } else if (isEmpty(this.presentationTemplate.callbackUrl)) {
          return this.notifyErr(message.PRESENTATION.CALLBACK_URL)
        } else if (!isValidURL(this.presentationTemplate.callbackUrl)) {
          return this.notifyErr(message.PRESENTATION.INVALID_URL)
        } 
        issuerDid.push(this.presentationTemplate.issuerDid)
        const headers = {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.authToken}`
        }
        let method = "POST"
        let body = {
          issuerDid,
          queryType: this.presentationTemplate.queryType,
          domain: this.presentationTemplate.domain,
          name: this.presentationTemplate.name,
          schemaId: this.presentationTemplate.schemaId,
          reason: this.presentationTemplate.reason,
          // required: this.presentationTemplate.required,
          callbackUrl: this.presentationTemplate.callbackUrl,
          orgDid:this.selectedOrgDid
        }
        if(this.isEdit === true) {
          body = {
          _id:this.id,
          issuerDid,
          queryType: this.presentationTemplate.queryType,
          name: this.presentationTemplate.name,
          schemaId: this.presentationTemplate.schemaId,
          reason: this.presentationTemplate.reason,
          // required: this.presentationTemplate.required,
          callbackUrl: this.presentationTemplate.callbackUrl,
          orgDid:this.selectedOrgDid
        }
        method = "PUT"
        }
        let url = `${this.$config.studioServer.BASE_URL}${this.$config.studioServer.PRESENTATION_TEMPLATE_EP}`
        fetch(url, {
          body: JSON.stringify(body),
          method: method,
          headers: headers,
        }).then((res) => res.json()).then(json => {
          if(this.isEdit === true) {
            this.$store.commit('playgroundStore/updateTemplate',json.data)
            this.notifySuccess('Template Successfully updated')
          } else{
            this.$store.commit('playgroundStore/insertApresentationTemplate', json.data.presentationTemplateObj)
            this.notifySuccess('Template Successfully created')
            this.$store.commit('playgroundStore/increaseOrgDataCount','templatesCount')
          }
          // this.openSlider();
          this.clearAll()
          this.$root.$emit("bv::toggle::collapse", "sidebar-right");
        })
      } catch (e) {
        this.isLoading = false
        this.notifyErr(e.message)
      } finally {
        this.isLoading = false
      }
    },
    viewPresentation() {
      this.isLoading = true
      try {
        const vp = JSON.parse(localStorage.getItem("presentation"));
        if (!vp) throw new Error('Please select verifiable presentation file')
        // console.log(vp)
        const vc = vp.verifiableCredential[0]
        this.presentationDetails = {}
        this.presentationDetails.credentialType = {
          name: vc.type[1],
          url: vc['@context'][1]['hsscheme']
        }
        this.presentationDetails.issuerDid = vc.issuer
        this.presentationDetails.holderDid = vc.credentialSubject.id
        this.presentationDetails.issuanceDate = vc.issuanceDate
        this.presentationDetails.expirationDate = vc.expirationDate
        this.presentationDetails.claim = vc.credentialSubject
      } catch (e) {
        this.isLoading = false
        this.notifyErr(e.message)
      }
    },
    clear() {
      this.presentationDetails = "",
        localStorage.removeItem('presentation')
      localStorage.removeItem('credential')
      this.$refs.vpFile.value = null;
      this.$refs.vcFile.value = null;
      this.signedVerifiablePresentation = {}
      this.isCredentialIssued = false
    },
    async verifyPresentation() {
      this.isLoading = true
      try {
        const vp = JSON.parse(localStorage.getItem("presentation"));
        if (!vp) throw new Error('Please select verifiable presentation file')
        const vc = vp.verifiableCredential[0]
        const isVerified = await hypersignSDK.credential.verifyPresentation(
          {
            presentation: vp,
            challenge: "test_challenge",
            issuerDid: vc.issuer,
            holderDid: vc.credentialSubject.id
          });
        // console.log(isVerified)
        if (isVerified.verified) {
          this.notifySuccess("Presentation verified")
        } else {
          this.notifyErr("Presentation can not verified")
        }
        this.isLoading = false
        this.clear()
      } catch (e) {
        this.isLoading = false
        this.notifyErr(e.message)
      }
    },
  },
    mixins: [UtilsMixin],
};
</script>


