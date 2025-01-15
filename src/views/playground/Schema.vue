<style scoped>
.flash {
  cursor: pointer;
  background-color: #1faa596b;
  border: 0;
  box-shadow: 2px 0 10px rgb(0 0 0 / 10%);
  animation: flash 0.4s cubic-bezier(1, 0, 0, 1);
}

.container {
  width: 80vw;
}

#json-data {
  white-space: pre-wrap;
  font-family: monospace;
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

.far {
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

.tile {
  max-height: 150px;
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
  font-size: small;
}

.theme-color {
  background-color: rgba(241, 179, 25, 0.24);
  color: #212529;
}

.bg-transparant {
  background-color: transparent !important;
  color: #212529;
}

.scrollit {
  overflow: hidden;
  height: 600px;
}

.scrollit:hover {
  overflow-y: auto;
}

.head {
  position: fixed;
  z-index: 400;
}
</style>
<template>
  <div :class="isContainerShift ? 'homeShift' : 'home'">
    <loading :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></loading>
    <div class="">
      <div class="" style="text-align: left">
        <!-- <Info :message="description" /> -->
        <div class="form-group" style="display:flex">
          <h3 v-if="schemaList.length > 0" style="text-align: left;">
            Schemas</h3>
          <h3 v-else style="text-align: left;">Create your first schema!</h3>
          <hf-buttons name="Create" iconClass="fa fa-plus" style="text-align: right;" class="ml-auto"
            @executeAction="openSlider()"></hf-buttons>
        </div>
        <StudioSideBar title="Create Schema">
          <div class="container" style="width: 100%;">
            <div class="form-group">
              <tool-tip infoMessage="Name of the schema"></tool-tip>
              <label for="schemaName"><strong>Name<span style="color: red">*</span>:</strong></label>
              <input type="text" class="form-control" id="schemaName" v-model="credentialName"
                aria-describedby="schemaNameHelp" placeholder="Enter Schema name">
            </div>
            <div class="form-group">
              <tool-tip infoMessage="Description for the schema"></tool-tip>
              <label for="schDescription"><strong>Description:</strong></label>

              <textarea type="text" class="form-control" id="schDescription" v-model="credentialDescription" rows="5"
                cols="20" aria-describedby="orgNameHelp" placeholder="Enter Description for this schema"></textarea>
            </div>
            <div class="form-group">
              <tool-tip infoMessage="Select issuer DID who will be author of this schema"></tool-tip>
              <label for="selectService"><strong>Select Issuer DID<span style="color: red">*</span>:
                </strong></label>
              <select class="custom-select" id="selectService" v-model="schemaData.schema.author" @change="resolveDid($event)">
                <option value="">Select a DID</option>
                <option v-for="did in associatedSSIServiceDIDs" :value="did.split('|')[1]" :key="did">
                  {{ did }}
                </option>
              </select>
            </div>
            <div class="form-group" v-if="schemaData.schema.author">
              <tool-tip infoMessage="Choose a signing key"></tool-tip>
              <label for="selectService"><strong>Signing Key Of Issuer<span style="color: red">*</span>:
              </strong></label>
              <select class="custom-select" id="selectService" v-model="schemaData.verificationMethodId">
                <option value="">Select a Signing Key</option>
                <option v-for="vm in issuerVerificationMethodIds" :value="vm.id" :key="vm.id">
                  {{ truncate(vm.id, 40) + ' (' +vm.type+')' }}
                </option>
              </select>
            </div>
            <div class="form-group card">
              <b-card-header header-tag="header" class="p-1 border-0 accordin-header theme-color" role="tab">
                <b-button block v-b-toggle.accordion-1 style="text-decoration:none; color:#212529;" variant="secondary"
                  :aria-expanded="visible ? 'true' : 'false'" @click="visible = !visible" aria-controls="collapse-1"
                  class="text-left border-0 theme-color bg-transparant" title="Create schema configuration">Fields
                  Configurations
                  <i :class="!visible ? 'fa fa-arrow-down' : 'fa fa-arrow-up'" style="float:right;"></i>
                </b-button>
              </b-card-header>
              <b-collapse id="collapse-1" class="mt-2" v-model="visible" style="padding:10px">
                <div class="selected-media-wrapper d-flex p-2 mb-4" style="overflow-y: auto"
                  v-if="attributes.length > 0">
                  <div v-for="(attr) in attributes" v-bind:key="attr.id">
                    <div :class="flash == attr.id
                      ? 'flash card rounded m-1 p-1 d-flex flex-row align-items-center'
                      : 'card rounded m-1 p-1 d-flex flex-row align-items-center pointer'"
                      @click="handleClick(attr.id)" :title="attr.name">
                      {{ truncate(attr.name, 15) }}
                      <span style="color: gray; padding-left: 5px">
                        <i v-if="flash == attr.id" title="click to delete" class="fa fa-trash" @click="deleteAttribute"
                          style="color:#d9534f	"></i>
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
                    <hf-select-drop-down :options="options"
                      @selected="e => (selected.attributeTypes = e)"></hf-select-drop-down>
                  </div>
                </div>



                <div class="row g-3 align-items-center w-100 mt-4">
                  <div class="col-lg-3 col-md-3 text-left">
                    <tool-tip infoMessage="Required field"></tool-tip>
                    <label for="required" class="col-form-label">Required: </label>
                  </div>
                  <div class="col-lg-9 col-md-9 px-0">
                    <input type="checkbox" v-model="selected.attributeRequired" id="required">
                  </div>
                </div>

                <div class="mt-2 center" v-if="isAdd">
                  <div>
                    <hf-buttons name="ADD" iconClass="fa fa-plus" customClass="btn btn-link"
                      @executeAction="addBlankAttrBox()"></hf-buttons>
                  </div>
                </div>
                <div class="mt-2 center" v-else>
                  <div>
                    <hf-buttons name="UPDATE" customClass="btn btn-link"
                      @executeAction="updateSchemaAttribute()"></hf-buttons>
                    <hf-buttons name="CANCEL" customClass="btn btn-link ml-2"
                      @executeAction="cancelUpdate()"></hf-buttons>
                  </div>
                </div>
              </b-collapse>
            </div>
            <div class="form-group row">
              <div class="col-md-12">
                <hf-buttons name="Save" @executeAction="createSchema()"></hf-buttons>
              </div>
            </div>
          </div>
        </StudioSideBar>
      </div>
    </div>
    <div class="scrollit" v-if="schemaList.length > 0">
      <div class="">
        <table class="table table-hover event-card">
          <thead class="thead-light">
            <tr>
              <th class="sticky-header">ID</th>
              <th class="sticky-header">Name</th>
              <!-- <th>Model Version</th> -->
              <!-- <th class="sticky-header">Description</th> -->
              <th class="sticky-header">Author</th>
              <th class="sticky-header">Properties</th>
              <th class="sticky-header">Created At (UTC)</th>
              <th class="sticky-header">Status</th>
              <th class="sticky-header"></th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="row in schemaList" :key="row._id">
              <td>
                <div v-if="row.id" @click="copyToClip(row.id, 'Schema Id')">
                  <a :href="`${$config.explorer.BASE_URL}/schemas/${row.id}`" target="_blank">{{ row.id ?
                    shorten(row.id) : "-" }}</a>
                </div>
                <span v-else>-</span>
              </td>

              <td>{{ row.schemaDocument ? row.schemaDocument.name : "-" }}</td>
              <!-- <td class="word-wrap">{{ row.schemaDocument && row.schemaDocument.schema ?
                row.schemaDocument.schema.description : "-" }}</td>-->
              <td> 
                <span v-if="row.schemaDocument" @click="copyToClip(row.schemaDocument.author, 'Schema Author')" style="cursor: grab;">
                  {{ shorten(row.schemaDocument.author)}}
                </span>
                <span v-else>
                  -
                </span>
                
              </td>
              <td>
                <div v-if="row.schemaDocument && row.schemaDocument.schema">
                  <div v-for="prop in Object.keys(row.schemaDocument.schema.properties)" v-bind:key="prop"
                    style="display:inline-block;">
                    <b-badge pill variant="info" class="mr-2">{{ prop }}</b-badge>
                  </div>
                </div>
                <span v-else>-</span>
              </td>

              <td>{{ row.schemaDocument.authored ? new Date(row.schemaDocument.authored).toLocaleString('en-us', {
                timeZone: 'UTC' }) : "-" }}</td>
              <td><span v-if="row.status == 'Registered'" class="badge badge-pill badge-success"><i class="fa fa-check"
                    aria-hidden="true"></i>
                  Registered</span>
                <span v-else-if="row.status == 'Created'" class="badge badge-pill badge-warning">
                  <i class="fa fa-cog" aria-hidden="true"></i>
                  Created</span>
                <span v-else-if="row.status == 'Error'" class="badge badge-pill badge-danger">
                  <i class="fa fa-exclamation-circle" aria-hidden="true"></i> Error
                </span>
                <span v-else>
                  <wait-spinner></wait-spinner>
                </span>
              </td>
              <td>
                <span @click="viewSchemaDocument(!(row.status == 'Error') ? row.schemaDocument : row.error)"
                  style="cursor: grab;"><i class="fa fa-eye" aria-hidden="true"></i></span>
              </td>
            </tr>
          </tbody>
        </table>
        <!-- <button  @click="fetchSchemasPrev()" class="btn btn-outline-warning btn-sm">Prev</button> 
        <button class="btn btn-outline-warning btn-sm"  @click="fetchSchemasNext()"  > Next </button> -->
      </div>
    </div>

    <hf-pop-up id="view-schema" Header="Schema Document" size="lg">
      <pre id="json-data" v-if="!Array.isArray(schemaDocumentToView)">
        <code class="prettyprint">
            {{ schemaDocumentToView }}
        </code> 
      </pre>
      <div v-else>
        <v-card v-for="eacherr in schemaDocumentToView" v-bind:key="eacherr" class="mb-1">
          <v-list subheader>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Status</v-list-item-title>
                <v-list-item-subtitle>{{ eacherr.status }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Transaction Hash</v-list-item-title>
                <v-list-item-subtitle>{{ eacherr.txnHash }}</v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-icon>
                <i class="far fa-copy ml-1" style="cursor:pointer;" title="Click to copy"
                  @click="copyToClip(eacherr.txnHash, 'Transaction Hash')"></i>
              </v-list-item-icon>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Message Type</v-list-item-title>
                <v-list-item-subtitle>{{ eacherr.type }}</v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-icon>
                <i class="far fa-copy ml-1" style="cursor:pointer;" title="Click to copy"
                  @click="copyToClip(eacherr.type, 'Message Type')"></i>
              </v-list-item-icon>
            </v-list-item>

            <v-list-item three-line flat>
              <v-list-item-content>
                <v-list-item-title>Message</v-list-item-title>
                <v-list-item-subtitle>
                  <p>{{ eacherr.message }}</p>
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-icon>
                <i class="far fa-copy ml-1" style="cursor:pointer;" title="Click to copy"
                  @click="copyToClip(eacherr.message, 'Message')"></i>
              </v-list-item-icon>
            </v-list-item>
          </v-list>
        </v-card>
      </div>
    </hf-pop-up>
  </div>
</template>

<script>
import UtilsMixin from '../../mixins/utils';
import Loading from "vue-loading-overlay";
import HfPopUp from "../../components/element/hfPopup.vue";
import StudioSideBar from "../../components/element/StudioSideBar.vue";
import HfButtons from "../../components/element/HfButtons.vue"
import HfSelectDropDown from "../../components/element/HfSelectDropDown.vue"
import EventBus from "../../eventbus"
import ToolTip from "../../components/element/ToolTip.vue"
import { isValidURL, isEmpty, ifSpaceExists, isValidSchemaAttrName } from '../../mixins/fieldValidation'
import message from '../../mixins/messages'
import { mapGetters, mapState, mapActions, mapMutations } from "vuex";
export default {
  name: "SchemaS",
  components: { Loading, HfPopUp, StudioSideBar, HfButtons, HfSelectDropDown, ToolTip },
  computed: {
    ...mapState({
      schemaList: state => state.mainStore.schemaList,
      didList: state => state.mainStore.didList,
      containerShift: state => state.playgroundStore.containerShift,
      selectedOrgDid: state => state.playgroundStore.selectedOrgDid
    }),
    ...mapGetters('playgroundStore', ['getSelectedOrg']),
    isContainerShift() {
      return this.containerShift
    }, 
    associatedSSIServiceDIDs(){
      return this.didList.filter(x => x.status == 'Registered').map(x =>  x.name ?  `${x.name} | ${x.did}` : x.did)
    }
  },
  data() {
    return {
      issuerVerificationMethodIds: [],
      schemaDocumentToView: "",
      reservedKeys: ['id', 'type'],
      counter: 0,
      flash: null,
      isAdd: true,
      // description: "Credential Schema defines what information will go inside a verifiable credential. For example: Directorate General of Civil Aviation (DGCA) can define a schema (or format) for flights tickets, being issued by all airline companies in India.",
      active: 0,
      host: location.hostname,
      user: {},
      schemaData : {
          "schema": {
            "name": "",
            "author": "",
            "description": "",
            "additionalProperties": false,
            "fields":""
          },
          "namespace": "testnet",
          "verificationMethodId": ""
      },
      options: [
        { text: "Select Type", value: null },
        { text: "string", value: "string" },
        { text: "integer", value: "integer" },
        { text: "number", value: "number" },
        { text: "boolean", value: "boolean" },
        { text: "date-time", value: "date" },
      ],
      page: 1,
      visible: false,
      prevRoute: null,
      selectedId: null,
      selected: {
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
  async created() {
    try {
      const usrStr = localStorage.getItem("user");
      this.user = JSON.parse(usrStr);
      this.updateSideNavStatus(true)

      this.isLoading = true
      await this.fetchSchemaList();
      this.isLoading = false
    } catch (e) {
      this.isLoading = false
      this.notifyErr(e.message)
      this.$router.push({ path: '/studio/dashboard' });
    }
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.prevRoute = from;
    });
  },
  methods: {
    ...mapActions('playgroundStore', ['upsertAschemaAction', 'fetchSchemasForOrg']),
    ...mapActions('mainStore', ['fetchSchemaList', 'createSchemaForAService', 'resolveSchema', 'checkBlockchainStatusOfSSI']),
    ...mapMutations('playgroundStore', ['updateSideNavStatus', 'increaseOrgDataCount']),
    ...mapMutations('mainStore', ['updateASchema']),
    viewSchemaDocument(data) {
      console.log(data)
      this.schemaDocumentToView = data; //JSON.stringify(data, null, 2)
      this.$root.$emit("bv::show::modal", "view-schema");
    },
    async checkRegistrationStatus(id_to_check_status) {
      try {
        const maxrtries = 6 // after 30 sec abort            
        const interval = 5
        let i = 0
        const statusCheckInterval = setInterval(async () => {
          //this.notifySuccess('Please wait, checking status of registration from blockchain...')
          i = i + 1;
          const response = await this.checkBlockchainStatusOfSSI(id_to_check_status)
          if (response && response.data && response.data.length > 0 && response.data[0]) {
            if (response.data[0].status == 0) {
              this.notifySuccess('Schema successfully registerd on the blockchain, txHash: ' + response.data[0].txnHash)
              this.updateASchema({
                id: id_to_check_status,
                status: 'Registered',
              })
              clearInterval(statusCheckInterval)
            } else {
              console.log(response)
              this.resolveSchema(id_to_check_status)
              this.notifyErr('Sorry we could not register your Schema, txHash: ' + response.data[0].txnHash)
            }
          }
          if (i == maxrtries) {
            this.notifyErr('All atempts failed to check the status on blockchain. Please check it manually')
            this.resolveSchema(id_to_check_status)
            clearInterval(statusCheckInterval)
          }
        }, interval * 1000)
      } catch (e) {
        console.error(e.message)
        this.notifyErr(e.message)
      }
    },
    handleClick(id) {
      this.flash = id
      const found = this.attributes.find((x) => x.id === id)
      let updateData = found
      this.selectedId = id
      this.selected.attributeName = updateData.name
      // this.selected.attributeFormat = updateData.format
      this.selected.attributeRequired = updateData.isRequired
      EventBus.$emit("setOption", updateData.type);
      this.isAdd = false
    },
    cancelUpdate() {
      this.flash = null;
      this.selected.attributeName = ""
      EventBus.$emit("resetOption", this.selected.attributeTypes);
      this.selected.attributeRequired = false
      this.isAdd = true
    },
    updateSchemaAttribute() {
      let isValid = this.handleValidation(true)
      if (isValid) {
        let obj = {
          name: this.selected.attributeName,
          type: this.selected.attributeTypes,
          // format: this.selected.attributeFormat,
          isRequired: this.selected.attributeRequired,
          id: this.selectedId
        }
        const indexToUpdate = this.attributes.findIndex((x) => x.id === this.selectedId)
        if (indexToUpdate > -1) {
          this.attributes[indexToUpdate] = obj
          EventBus.$emit("resetOption", this.selected.attributeTypes);
          this.clearSelected()
          this.isAdd = true
        }
      }
    },
    deleteAttribute() {
      let id = this.selectedId
      const actionIndex = this.attributes.findIndex((x) => x.id === id)
      if (actionIndex > -1) {
        this.attributes.splice(actionIndex, 1);
      }

      EventBus.$emit("resetOption", this.selected.attributeTypes);
      this.clearSelected()
      this.isAdd = true
    },
    clearSelected() {
      this.flash = null
      this.selectedId = null
      this.selected = {
        attributeName: "",
        attributeTypes: null,
        attributeRequired: false,
        // attributeFormat : ""
      }
    },
    openSlider() {
      this.counter = 0
      this.clearAll();
      this.$root.$emit("bv::toggle::collapse", "sidebar-right");
    },
    clearAll() {
      this.visible = false
      this.credentialName = ''
      this.credentialDescription = ''
      this.selected.attributeName = ''
      EventBus.$emit("resetOption", this.selected.attributeTypes)
      this.selected.attributeTypes = null
      // this.selected.attributeFormat = ''
      this.selected.attributeRequired = false
      // this.additionalProperties = false
      this.attributes = []
    },
    handleValidation(update = false) {
      let isValid = true
      if (isEmpty(this.selected.attributeName)) {
        isValid = false
        return this.notifyErr(message.SCHEMA.EMPTY_SCHEMA_ATTRIBUTE_NAME)
      } else if (this.reservedKeys.includes(this.selected.attributeName)) {
        isValid = false
        return this.notifyErr(this.selected.attributeName + ' ' + message.SCHEMA.PROTECTED_TERM)
      } else if (isValidURL(this.selected.attributeName)) {
        isValid = false
        return this.notifyErr(message.SCHEMA.INVALID_ATTRIBUTE_NAME)
      } else if (ifSpaceExists(this.selected.attributeName)) {
        isValid = false
        return this.notifyErr(message.SCHEMA.NO_SPACE)
      } else if (!isValidSchemaAttrName(this.selected.attributeName)) {
        isValid = false
        return this.notifyErr(message.SCHEMA.NAME_CAMELCASE)
      } else if (this.isPresent(this.selected, update)) {
        isValid = false
        if (update) {
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
    isPresent(attr, update = false) {
      const element = this.attributes.find((x) => {
        if (update) {
          return x.name === attr.attributeName && x.type === attr.attributeTypes && x.isRequired === attr.attributeRequired

        }
        return x.name === attr.attributeName

      });
      return typeof element === "undefined" ? false : true;

    },
    addBlankAttrBox() {
      let isValid = this.handleValidation()
      if (isValid) {
        let obj = {
          name: this.selected.attributeName,
          type: this.selected.attributeTypes,
          format: "",
          // format: this.selected.attributeFormat,
          isRequired: this.selected.attributeRequired,
        }
        this.counter += 1
        obj['id'] = this.counter
        this.attributes.push(obj)
        this.selected.attributeName = "";
        EventBus.$emit("resetOption", this.selected.attributeTypes)
        // this.selected.attributeFormat = "";
        this.selected.attributeRequired = false;
      }
    },
    ssePopulateSchema(id) {
      const sse = new EventSource(`${this.$config.studioServer.SCHEMA_SSE}${id}`);

      const that = this
      sse.onmessage = function (e) {
        const data = JSON.parse(e.data)
        if (data.status === "Registered" || data.status === "Failed") {
          sse.close();
          that.upsertAschemaAction(data);
        }
      }
      sse.onopen = function (e) {
        console.log("Connection to server opened.", e);
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

    async resolveDid(event) {
      const did = event.target.value.trim()
      const didDocument = this.didList.find(x => x.did == did)?.didDocument
      this.issuerVerificationMethodIds = didDocument ? didDocument.verificationMethod : [];
    },

    async createSchema() {
      try {
        this.isLoading = true
        if (isEmpty(this.credentialName)) {
          return this.notifyErr(message.SCHEMA.EMPTY_SCHEMA_NAME)
        } else if (isValidURL(this.credentialName)) {
          return this.notifyErr(message.SCHEMA.INVALID_SCHEMA_NAME)
        } else if (this.attributes.length == 0) {
          return this.notifyErr(message.SCHEMA.EMPTY_SCHEMA_ATTRIBUTE)
        }
        // const url = `${this.$config.studioServer.BASE_URL}${this.$config.studioServer.SAVE_SCHEMA_EP}`;
        // const { orgDid } = this.getSelectedOrg;

        this.attributes.map(x => delete x.id)
        // this.schemaData = {
        //   "schema": {
        //     "name": this.credentialName,
        //     "author": "did:hid:testnet:56d5e9bf-911d-4bfb-b2e6-0e16a2cc7d07",
        //     "description": this.credentialDescription,
        //     "additionalProperties": false,
        //     "fields": this.attributes
        //   },
        //   "namespace": "testnet",
        //   "verificationMethodId": "did:hid:testnet:56d5e9bf-911d-4bfb-b2e6-0e16a2cc7d07s#key-1"
        // }
        this.schemaData.schema.name = this.credentialName.trim()
        this.schemaData.schema.description = this.credentialDescription.trim()
        this.schemaData.schema.fields = this.attributes
        this.schemaData.schema.author = this.schemaData.schema.author.trim()
        this.schemaData.verificationMethodId = this.schemaData.verificationMethodId.trim()
        // this.schemaData.verificationMethodId = "did:hid:testnet:56d5e9bf-911d-4bfb-b2e6-0e16a2cc7d07s#key-1"

        console.log(this.schemaData)

        const response = await this.createSchemaForAService(this.schemaData)
        this.isLoading = false;
        this.openSlider();
        if (response) {
          console.log(response)
          this.updateASchema({
            id: response?.schemaId,
            status: 'Please wait..',
          })
          this.checkRegistrationStatus(response?.schemaId)
        }

        // // const schemaData = {
        // //   name: this.credentialName,
        // //   author: orgDid,
        // //   fields: this.attributes,
        // //   description: this.credentialDescription,
        // //   // additionalProperties: this.additionalProperties,
        // //   orgDid: this.selectedOrgDid
        // // };
        // this.QrData.data = schemaData

        // let headers = {
        //   "Content-Type": "application/json",
        //   "Authorization": `Bearer ${this.authToken}`
        // };
        // fetch(url, {
        //   method: "POST",
        //   body: JSON.stringify({ QR_DATA: this.QrData }),
        //   headers,
        // })
        //   .then((res) => res.json())
        //   .then((j) => {
        //     const { QR_DATA } = j.data
        //     if (j.message === 'success') {
        //       this.notifySuccess("Schema creation initiated. Please approve the transaction from your wallet");
        //       // Store the information in store.
        //       this.upsertAschemaAction(j.data.schema)
        //       // Open the wallet for trasanctional approval.
        //       const URL = `${this.$config.webWalletAddress}/deeplink?url=${JSON.stringify(QR_DATA)}`
        //       this.openWallet(URL)
        //       this.ssePopulateSchema(j.data.schema._id, this.$store)
        //       this.openSlider();
        //       this.increaseOrgDataCount('schemasCount')
        //     } else {
        //       throw new Error(`${j.error}`);
        //     }
        //   });
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
