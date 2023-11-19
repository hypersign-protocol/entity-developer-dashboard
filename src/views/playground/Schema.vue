<style scoped>
.flash {
  cursor: pointer;
  background-color: #1faa596b;
  border: 0;
  box-shadow: 2px 0 10px rgb(0 0 0 / 10%);
  animation: flash 0.4s cubic-bezier(1, 0, 0, 1);
}
@keyframes flash {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
.addmargin {
  margin-top: 10px;
  margin-bottom: 10px;
}

.vue-logo-back {
  background-color: black;
}

.logo {
  width: 144px;
}

.fullbody {
  width: 100%;
}

.floatLeft {
  float: left;
}

.floatRight {
  float: right;
}

.card-header {
  background: aliceblue;
  padding: 0px;
}

.sm-tiles {
  float: left;
  padding: 5px;
  border: 1px solid #8080807d;
  margin: 1%;
  border-radius: 5px;
  background: #f5dda71c;
  color: #888b8f;
}
.far{
  color: gray;
  font-size: 1.5em;
  padding-top: 10px;
  cursor: pointer;
}
.sm-tiles:hover {
  float: left;
  padding: 5px;
  border: 1px solid #8080807d;
  margin: 1%;
  border-radius: 5px;
  background: #f5dda7a3;
  ;
  font-style: bold;
  color: #888b8f;
}

.word-wrap {
  word-wrap: anywhere;
}

.card {
  border-radius: 10px;
}

.container {
    padding: 20px;
    text-align: left;
  }

  .tile{
    max-height:150px;
    overflow: auto
  }
  .selected-media-wrapper {
  border: 1px dashed;
  max-height: 100px;
  background-color: #f5f5f5;
  border-radius: 10px;
}
.rounded {
  cursor: pointer;
}
.schemaProp {
  background-color: lightgoldenrodyellow;
  color: grey;
  border: 1ps solid lightcyan;
  font-size:small;  
}
.theme-color{
  background-color:rgba(241, 179, 25, 0.24);
  color: #212529;
}
.bg-transparant{
  background-color: transparent !important;
  color: #212529;
}
.scrollit {
  overflow:hidden;  
  height:600px;
}
.scrollit:hover{
  overflow-y: auto;
}
.head{
  position: fixed;
  z-index: 400;
}
</style>
<template>
  <div :class="isContainerShift ?'homeShift':'home'">
    <loading :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></loading>

    <div class="row">
      <div class="col-md-12" style="text-align: left">
        <!-- <Info :message="description" /> -->
          <div class="form-group" style="display:flex">
           <h3 v-if="schemaList.length > 0" class="mt-4" style="text-align: left;">
            Schemas</h3>
            <h3 v-else class="mt-4" style="text-align: left;">Create your first schema!</h3>      
            <hf-buttons 
              name="+ Create"
              style="text-align: right;"
              class="ml-auto mt-4"
              @executeAction="openSlider()"
            ></hf-buttons>
          </div> 
          <StudioSideBar title="Create Schema">
              <div class="container">
                <div class="form-group">
                  <tool-tip infoMessage="Name of the schema"></tool-tip>
                  <label for="schemaName"><strong>Name<span style="color: red">*</span>:</strong></label>                  
                  <input type="text" class="form-control" id="schemaName" v-model="credentialName" aria-describedby="schemaNameHelp"
                  placeholder="Enter Schema name">
                </div>
                <div class="form-group">
                  <tool-tip infoMessage="Description for the schema"></tool-tip>
                  <label for="schDescription"><strong>Description:</strong></label>                  

                  <textarea type="text" class="form-control" id="schDescription" v-model="credentialDescription"  rows="5" cols="20" aria-describedby="orgNameHelp"
                  placeholder="Enter Description for this schema"></textarea>
                </div>
                <div class="form-group card">
                  <b-card-header header-tag="header" class="p-1 border-0 accordin-header theme-color" role="tab">
                    <b-button block v-b-toggle.accordion-1 style="text-decoration:none; color:#212529;" variant="secondary"
                    :aria-expanded="visible ? 'true' : 'false'"
                    @click="visible = !visible"
                    aria-controls="collapse-1"
                    class="text-left border-0 theme-color bg-transparant"
                    title="Create schema configuration">Fields Configurations
                    <i :class="!visible ? 'fa fa-arrow-down' : 'fa fa-arrow-up'" style="float:right;"></i>
                    </b-button>
                  </b-card-header>
                  <b-collapse id="collapse-1" class="mt-2" v-model="visible" style="padding:10px">
                    <div class="selected-media-wrapper d-flex p-2 mb-4"  style="overflow-y: auto" v-if="attributes.length > 0">
                      <div v-for="(attr,id) in attributes" v-bind:key="attr.id">
                        <div :class="
                            flash == attr.id
                            ? 'flash card rounded m-1 p-1 d-flex flex-row align-items-center'
                            : 'card rounded m-1 p-1 d-flex flex-row align-items-center pointer'"
                            @click="handleClick(attr.id)"                            
                            :title="attr.name"
                          >
                          {{ truncate(attr.name,15) }}
                           <span style="color: gray; padding-left: 5px">
                            <i v-if="flash==attr.id" title="click to delete" class="fas fa-minus-circle" @click="deleteAttribute" style="color:#d9534f	"></i>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div class="row g-3 align-items-center w-100">
                        <div class="col-lg-3 col-md-3 text-left">
                          <tool-tip infoMessage="Attribute Name"></tool-tip>
                          <label for="attributeName" class="col-form-label">Name<span style="color: red">*</span>: </label>                          
                        </div>
                        <div class="col-lg-9 col-md-9 px-0">
                            <input v-model="selected.attributeName" type="text" id="attributeName" class="form-control w-100"
                            placeholder="firstName">
                        </div>
                    </div>

                    <div class="row g-3 align-items-center w-100 mt-4">
                        <div class="col-lg-3 col-md-3 text-left">
                        <tool-tip infoMessage="Type of the attribute"></tool-tip>
                        <label for="type" class="col-form-label">Type<span style="color: red">*</span>:</label>                        

                        </div>
                        <div class="col-lg-9 col-md-9 px-0">
                      <hf-select-drop-down
                        :options="options"
                        @selected="e =>(selected.attributeTypes=e)"
                      ></hf-select-drop-down>
                      </div>
                    </div>

                     <!-- <div class="row g-3 align-items-center w-100 mt-4">
                        <div class="col-lg-3 col-md-3 text-left">
                          <tool-tip infoMessage="Format of the attribute"></tool-tip>
                          <label for="format" class="col-form-label">Format: </label>                          
                        </div>
                        <div class="col-lg-9 col-md-9 px-0">
                            <input v-model="selected.attributeFormat" type="text"  placeholder="Enter attribute Format (eg email)" id="type" class="form-control w-100" >
                        </div>
                    </div> -->

                     <div class="row g-3 align-items-center w-100 mt-4">
                        <div class="col-lg-3 col-md-3 text-left">
                        <tool-tip infoMessage="Required field"></tool-tip>
                        <label for="required" class="col-form-label">Required: </label>                        
                        </div>
                        <div class="col-lg-9 col-md-9 px-0">
                             <input type="checkbox" v-model="selected.attributeRequired" id="required">
                        </div>
                    </div>

                    <div class="form-group row mt-4" v-if="isAdd">
                      <div class="col-sm-10">                        
                        <hf-buttons 
                          name="Add"                          
                          @executeAction="addBlankAttrBox()"
                        ></hf-buttons>
                      </div>
                    </div>
                    <div class="form-group row mt-4" v-else>
                      <div class="col-sm-10">                        
                        <hf-buttons 
                          name="Update"        
                          class="btn btn-primary"
                          @executeAction="updateSchemaAttribute()"
                        ></hf-buttons>
                        <hf-buttons 
                          name="Cancel"        
                          class="btn btn-danger ml-2"
                          @executeAction="cancelUpdate()"
                        ></hf-buttons>
                      </div>
                    </div>
                  </b-collapse>
                </div>
                <!-- <div class="form-group">
                  <tool-tip infoMessage="Additional Properties"></tool-tip>                             
                  <label for="schDescription"><strong>Additional Properties</strong></label>
                  <input v-model="additionalProperties" type="checkbox" style="margin-left:5px;" />

                </div> -->
                <div class="form-group row">
                  <div class="col-md-12">
                    <hr/>                    
                    <hf-buttons 
                      name="Save"                      
                      @executeAction="createSchema()"
                    ></hf-buttons>
                  </div>
                </div>
              </div>
          </StudioSideBar>
      </div>
    </div>
    <div class="row scrollit" style="margin-top: 2%;" v-if="schemaList.length > 0">
      <div class="col-md-12">
        <table class="table table-bordered event-card" style="background:#FFFF">
          <thead class="thead-light">
            <tr>
              <th>Schema Id</th>
              <th>Name</th>
              <th>Model Version</th>
              <th>Description</th>
              <th>Properties</th>
              <th>Created At (UTC)</th>
              <th>Transaction Hash</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="row in schemaList" :key="row._id">
              <td>
                <div v-if="row.schemaId">
                <a :href="`${$config.explorer.BASE_URL}schemas/${row.schemaId}`"
                  target="_blank">{{ row.schemaId ? shorten(row.schemaId) : "-" }}</a>
                <i class="far fa-copy ml-1"
                style="cursor:pointer;"
                title="Click to copy Schema Id"
                @click="copyToClip(row.schemaId,'Schema Id')"
                ></i>
                  </div>
                  <span v-else>-</span>
              </td>

              <td>{{ row.schemaDetails ? row.schemaDetails.name : "-" }}</td>
              <td>{{ row.schemaDetails ? row.schemaDetails.modelVersion : "-" }}</td>
              <td class="word-wrap">{{ row.schemaDetails ? row.schemaDetails.schema.description : "-" }}</td>
              <td>
                <div v-if="row.schemaDetails">
                  <div v-for="prop in Object.keys(row.schemaDetails.schema.properties)" style="display:inline-block;">
                    <b-badge pill variant="info" class="mr-2">{{prop}}</b-badge>
                  </div>
                </div>
                <span v-else>-</span>
              </td>

              <td>{{ row.createdAt ? new Date(row.createdAt).toLocaleString('en-us', { timeZone: 'UTC' }) : "-" }}</td>

              <td style="word-wrap: break-word;min-width: 200px;max-width: 200px;">
                <div v-if="row.transactionHash">
                <a target="_blank"
                  :href="`${$config.explorer.BASE_URL}tx/${row.transactionHash}`"
                  >{{ shorten(row.transactionHash) }}</a>
                <i class="far fa-copy ml-1"
                style="cursor:pointer;"
                title="Click to copy Transaction Hash"
                @click="copyToClip(row.transactionHash,'Transaction Hash')"
                ></i>
                </div>
                <span v-else>-</span>
              </td>
              <td>{{ row.status }}</td>
            </tr>
          </tbody>
        </table>
        <!-- <button  @click="fetchSchemasPrev()" class="btn btn-outline-warning btn-sm">Prev</button> 
        <button class="btn btn-outline-warning btn-sm"  @click="fetchSchemasNext()"  > Next </button> -->
      </div>
    </div>
  </div>
</template>

<script>
import fetch from "node-fetch";
import QrcodeVue from "qrcode.vue";
// import Info from '@/components/Info.vue';
import UtilsMixin from '../../mixins/utils';
import Loading from "vue-loading-overlay";
import StudioSideBar from "../../components/element/StudioSideBar.vue";
import HfButtons from "../../components/element/HfButtons.vue"
import HfSelectDropDown from "../../components/element/HfSelectDropDown.vue"
import EventBus from "../../eventbus"
import ToolTip from "../../components/element/ToolTip.vue"
import { isValidURL, isEmpty, ifSpaceExists, isValidSchemaAttrName } from '../../mixins/fieldValidation'
import message from '../../mixins/messages'
import { mapGetters, mapState, mapActions, mapMutations } from "vuex";
export default {
  name: "Schema",
  components: { QrcodeVue, Loading, StudioSideBar, HfButtons, HfSelectDropDown, ToolTip },
  computed: {
    ...mapState({
      schemaList: state => state.playgroundStore.schemaList,
      containerShift: state => state.playgroundStore.containerShift,
      selectedOrgDid: state => state.playgroundStore.selectedOrgDid
    }),
    ...mapGetters('playgroundStore', ['getSelectedOrg']),
    isContainerShift() {
      return this.containerShift
    }
  },
  data() {
    return {
      reservedKeys:['id', 'type'],
      counter:0,
      flash:null,
      isAdd:true,
      // description: "Credential Schema defines what information will go inside a verifiable credential. For example: Directorate General of Civil Aviation (DGCA) can define a schema (or format) for flights tickets, being issued by all airline companies in India.",
      active: 0,
      host: location.hostname,
      user: {},
      options: [
          { text: "Select Type", value: null },
          { text: "string", value: "string" },
          { text: "integer", value: "integer" },
          { text: "number", value: "number" },
          { text: "boolean", value: "boolean" },
          { text: "date-time", value: "date" },
        ],
      page: 1,
      visible:false,
      prevRoute: null,
      selectedId:null,
      selected:{
      attributeName: "",
      attributeTypes: null,
      // attributeFormat: "",
      attributeRequired: false,
      },
      attributes: [],
      issueCredAttributes: [],
      // additionalProperties: false,
      showSchema: true,
      radioSelected: "create",
      credentialName: "",
      isCredentialIssued: false,
      signedVerifiableCredential: "",
      authToken: localStorage.getItem("authToken"),
      credentialDescription: "",
      fullPage: true,
      isLoading: false,
      QrData: {
        "QRType": "ISSUE_SCHEMA",
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
    this.fetchSchemasForOrg();
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.prevRoute = from;
    });
  },
  methods: {
    ...mapActions('playgroundStore', ['upsertAschemaAction', 'fetchSchemasForOrg']),
    ...mapMutations('playgroundStore',['updateSideNavStatus', 'increaseOrgDataCount']),
    handleClick(id) {
      this.flash = id
      const found = this.attributes.find((x)=>x.id === id)
      let updateData = found
      this.selectedId = id
      this.selected.attributeName = updateData.name
      // this.selected.attributeFormat = updateData.format
      this.selected.attributeRequired = updateData.isRequired
      EventBus.$emit("setOption",updateData.type);
      this.isAdd = false
    },
    cancelUpdate(){
      this.flash = null;
      this.selected.attributeName = ""
      EventBus.$emit("resetOption",this.selected.attributeTypes);
      this.selected.attributeRequired = false
      this.isAdd = true
    },
    updateSchemaAttribute() {
      let isValid = this.handleValidation(true)
      if(isValid) {
        let obj = {
          name: this.selected.attributeName,
          type: this.selected.attributeTypes,
          // format: this.selected.attributeFormat,
          isRequired: this.selected.attributeRequired,
          id: this.selectedId
        }
        const indexToUpdate = this.attributes.findIndex((x)=>x.id === this.selectedId)
        if(indexToUpdate > -1){
          this.attributes[indexToUpdate] = obj
          EventBus.$emit("resetOption",this.selected.attributeTypes);
          this.clearSelected()
          this.isAdd = true
        }
      }
    },
    deleteAttribute() {
      let id = this.selectedId
      const actionIndex =  this.attributes.findIndex((x)=> x.id === id)
      if(actionIndex > -1 ) {
        this.attributes.splice(actionIndex, 1);
      }
      
      EventBus.$emit("resetOption",this.selected.attributeTypes);
      this.clearSelected()
      this.isAdd = true
    },
    clearSelected() {
      this.flash = null
      this.selectedId = null
      this.selected = {
        attributeName : "",
        attributeTypes : null,
        attributeRequired : false,
        // attributeFormat : ""
      }
    },
    openSlider() {
      this.counter = 0
      this.clearAll();
      this.$root.$emit("bv::toggle::collapse", "sidebar-right");
    },
    clearAll(){
      this.visible=false
      this.credentialName = ''
      this.credentialDescription = ''
      this.selected.attributeName = ''
      EventBus.$emit("resetOption",this.selected.attributeTypes)
      this.selected.attributeTypes = null
      // this.selected.attributeFormat = ''
      this.selected.attributeRequired = false
      // this.additionalProperties = false
      this.attributes = []      
    },
    handleValidation(update=false) {
      let isValid = true
      if (isEmpty(this.selected.attributeName)) {
        isValid = false
        return this.notifyErr(message.SCHEMA.EMPTY_SCHEMA_ATTRIBUTE_NAME)
      } else if(this.reservedKeys.includes(this.selected.attributeName)) {
        isValid = false
        return this.notifyErr(this.selected.attributeName + ' ' + message.SCHEMA.PROTECTED_TERM)
      } else if (isValidURL(this.selected.attributeName)) {
        isValid = false
        return this.notifyErr(message.SCHEMA.INVALID_ATTRIBUTE_NAME)
      } else if (ifSpaceExists(this.selected.attributeName)) {
        isValid = false
        return this.notifyErr(message.SCHEMA.NO_SPACE)
      } else if(!isValidSchemaAttrName(this.selected.attributeName)){
        isValid = false
        return this.notifyErr(message.SCHEMA.NAME_CAMELCASE)
      } else if(this.isPresent(this.selected,update)){
        isValid = false
        if(update){
          return this.notifyErr(message.SCHEMA.DUPLICATE_ATTRIBUTE_UPDATE)
        }
        return this.notifyErr(message.SCHEMA.DUPLICATE_ATTRIBUTE)
      } else if (this.selected.attributeTypes === ' ' || this.selected.attributeTypes === null) {
        isValid = false
        return this.notifyErr(message.SCHEMA.EMPTY_ATTRIBUTE_TYPE)
      } 
      // else if (isValidURL(this.selected.attributeFormat)) {
      //   isValid = false
      //   return this.notifyErr(message.SCHEMA.INVALID_FORMAT)
      // }
    return isValid
    },
    isPresent(attr, update=false) {
    const element = this.attributes.find((x) => {
           if(update){
            return x.name === attr.attributeName  && x.type === attr.attributeTypes && x.isRequired === attr.attributeRequired

           } 
           return x.name === attr.attributeName

        });
        return typeof element === "undefined" ? false : true;
    
    },
    addBlankAttrBox() {
      let isValid = this.handleValidation()
      if(isValid){
        let obj = {
          name: this.selected.attributeName,
          type: this.selected.attributeTypes,
          // format: this.selected.attributeFormat,
          isRequired: this.selected.attributeRequired,
        }
        this.counter +=1
        obj['id'] = this.counter
        this.attributes.push(obj)
        this.selected.attributeName = "";
        EventBus.$emit("resetOption",this.selected.attributeTypes)
        // this.selected.attributeFormat = "";
        this.selected.attributeRequired = false;     
      }
    },
    ssePopulateSchema(id, store) {
      const sse = new EventSource(`${this.$config.studioServer.SCHEMA_SSE}${id}`);
    
      const that =  this
      sse.onmessage = function (e) {
        const data = JSON.parse(e.data)
        if (data.status === "Registered" || data.status === "Failed") {
          sse.close();
          that.upsertAschemaAction(data);
        }
      }
      sse.onopen = function (e) {
        console.log("Connection to server opened.",e);
      };

      sse.onerror = function (e) {
        console.log(e)
        sse.close();
      }
      return
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

    createSchema() {
      try {
        this.isLoading = true
        if (isEmpty(this.credentialName)) {
          return this.notifyErr(message.SCHEMA.EMPTY_SCHEMA_NAME)
        } else if (isValidURL(this.credentialName)) {
          return this.notifyErr(message.SCHEMA.INVALID_SCHEMA_NAME)
        } else if (this.attributes.length == 0) {
          return this.notifyErr(message.SCHEMA.EMPTY_SCHEMA_ATTRIBUTE)
        }
        const url = `${this.$config.studioServer.BASE_URL}${this.$config.studioServer.SAVE_SCHEMA_EP}`;
        const {orgDid}=this.getSelectedOrg;
        const schemaData = {
          name: this.credentialName,
          author: orgDid,
          fields: this.attributes,
          description: this.credentialDescription,
          // additionalProperties: this.additionalProperties,
          orgDid: this.selectedOrgDid
        };
        this.QrData.data = schemaData
        let headers = {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.authToken}`
        };
        fetch(url, {
          method: "POST",
          body: JSON.stringify({ QR_DATA: this.QrData }),
          headers,
        })
          .then((res) => res.json())
          .then((j) => {
            const { QR_DATA } = j.data
            if (j.message === 'success') {
              this.notifySuccess("Schema creation initiated. Please approve the transaction from your wallet");
              // Store the information in store.
              this.upsertAschemaAction(j.data.schema)
              // Open the wallet for trasanctional approval.
              const URL = `${this.$config.webWalletAddress}/deeplink?url=${JSON.stringify(QR_DATA)}`
              this.openWallet(URL)
              this.ssePopulateSchema(j.data.schema._id, this.$store)
              this.openSlider();
              this.increaseOrgDataCount('schemasCount')
            } else {
              throw new Error(`${j.error}`);
            }
          });
      } catch (e) {
        console.error(e)
        this.notifyErr(`Error: ${e.message}`);
      } finally {
        this.isLoading = false;
      }
    },
  },
  mixins: [UtilsMixin],
};
</script>


