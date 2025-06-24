<style scoped>
.container {
  width: 80vw;
}

.card-header {
  background: aliceblue;
  padding: 0px;
}

.theme-color {
  background-color: #80808078;
  color: #212529;
}

.bg-transparant {
  background-color: transparent !important;
  color: #212529;
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

.datetime-picker {
  background-color: #fff;
  background-clip: content-box;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  padding: 0.375rem 0.75rem;
}

.linkdiv {
  background-clip: content-box;
  background-color: rgba(173, 232, 255, 0.5607843137254902);
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

.grabStyle {
  cursor: grab
}

.warning-box {
  display: flex;
  align-items: center;
  background-color: #fff3cd; /* Light yellow background */
  color: #856404; /* Dark brown text */
  padding: 10px;
  border: 1px solid #ffeeba;
  border-radius: 5px;
  margin-bottom: 10px;
}

/* Warning Icon */
.warning-icon {
  font-size: 20px;
  margin-right: 8px;
}

/* Warning Text */
.warning-text {
  font-weight: bold;
}
</style>
<template>
  <div :class="isContainerShift ? 'homeShift' : 'home'">
    <loading :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></loading>
    <div class="">
      <div class="" style="text-align: left">
        <!-- <Info :message="description" /> -->
        <div class="form-group" style="display: flex">
          <h3 v-if="credentialList.length > 0" style="text-align: left">
            Credentials
          </h3>
          <h3 v-else style="text-align: left">
            Issue your first verifiable credential!
          </h3>
          <hf-buttons iconClass="fa fa-plus" name="Create" class="ml-auto" @executeAction="openSlider()"></hf-buttons>
        </div>
        <StudioSideBar :title="isEdit ? 'Edit Credential Status' : 'Issue Credential'">
          <div class="container" style="width: 100%;">

            <div class="" v-if="isEdit === false">
              <tool-tip infoMessage="Enter DID to whome you are issuing credential"></tool-tip>
              <label for="fordid"><strong>Subject DID<span style="color: red">*</span>:</strong></label>
              <div class="input-group mb-3">
                <!-- <input type="text" class="form-control" placeholder="did:hid:123123123123" v-model="holderDid" /> -->
                <input
                    list="subjectDidList"
                    id="fordid"
                    class="custom-select custom-select-md form-control"
                    placeholder="Enter or select a DID"
                    v-model="holderDid"
                  />
                <datalist id="subjectDidList" v-if="associatedSSIServiceDIDs && associatedSSIServiceDIDs.length > 0">
                  <option
                    v-for="did in associatedSSIServiceDIDs"
                    :value="did.split('|')[1].trim()"
                    :key="did"
                  >
                    {{ did }}
                  </option>
                </datalist>
                <!-- <div
                        class="input-group-append"
                        @click="getSelfDIDAsSubject()"
                      >
                        <button class="btn btn-outline-secondary" type="button">
                          Self
                        </button>
                      </div> -->
              </div>
            </div>
            <div class="form-group card">
              <b-card-header header-tag="header" class="p-1 border-0 accordin-header theme-color" role="tab">
                <b-button block v-b-toggle.accordion-1 style="text-decoration:none; color:#212529;" variant="secondary"
                  :aria-expanded="schemaConfigVisible ? 'true' : 'false'"
                  @click="issuerConfigVisible = !issuerConfigVisible" aria-controls="collapse-1"
                  class="text-left border-0 theme-color bg-transparant" title="Create schema configuration">Issuer
                  Configurations
                  <i :class="!issuerConfigVisible ? 'fa fa-arrow-down' : 'fa fa-arrow-up'" style="float:right;"></i>
                </b-button>
              </b-card-header>
              <b-collapse id="collapse-1" class="mt-2" v-model="issuerConfigVisible" style="padding:10px">
                <div class="mb-1">
                  <tool-tip infoMessage="Select issuer DID who will be author of this schema"></tool-tip>
                  <label for="selectService"><strong>Select Issuer DID<span style="color: red">*</span>:
                    </strong></label>
                  <select class="custom-select" id="selectService" v-model="issuerDid" @change="resolveDid($event)">
                    <option value="">Select a DID</option>
                    <option v-for="did in associatedSSIServiceDIDs" :value="did.split('|')[1]" :key="did">
                      {{ did }}
                    </option>
                  </select>
                </div>

                <div class="" v-if="issuerDid">
                  <tool-tip infoMessage="Choose a signing key"></tool-tip>
                  <label for="selectService"><strong>Signing Key Of Issuer<span style="color: red">*</span>:
                    </strong></label>
                  <select class="custom-select" id="selectService" v-model="issuerVerificationMethodId">
                    <option value="">Select a Signing Key</option>
                    <option v-for="vm in issuerVerificationMethodIds" :value="vm.id" :key="vm.id">
                      {{ truncate(vm.id, 40) + ' (' + vm.type + ')' }}
                    </option>
                  </select>
                </div>
              </b-collapse>
            </div>

            <div class="form-group card">
              <b-card-header header-tag="header" class="p-1 border-0 accordin-header theme-color" role="tab">
                <b-button block v-b-toggle.accordion-1 style="text-decoration:none; color:#212529;" variant="secondary"
                  :aria-expanded="schemaConfigVisible ? 'true' : 'false'"
                  @click="schemaConfigVisible = !schemaConfigVisible" aria-controls="collapse-1"
                  class="text-left border-0 theme-color bg-transparant" title="Create schema configuration">Fields
                  Configurations
                  <i :class="!schemaConfigVisible ? 'fa fa-arrow-down' : 'fa fa-arrow-up'" style="float:right;"></i>
                </b-button>
              </b-card-header>
              <b-collapse id="collapse-1" class="mt-2" v-model="schemaConfigVisible" style="padding:10px">
                <div class="mb-1" v-if="isEdit === false">
                  <tool-tip infoMessage="Select Schema to issue credential"></tool-tip>
                  <label for="forselectschema"><strong>SchemaId<span style="color: red">*</span>:</strong></label>

                  <input list="schema" class="custom-select custom-select custom-select-md form-control"
                    placeholder="Enter a SchemaId" v-model="selectedSchema"
                    @input="debouncedSchemaChange(selectedSchema)"
                     />
                  <datalist id="schema">
                    <option v-for="schema in schemaIdsList" :key="schema.value"
                     :value="schema.value"
                      class="form-control">
                      {{ schema.text }}
                    </option>
                  </datalist>
                  <!-- <span
                      class="goschema"
                      v-if="selectOptions.length === 1"
                      @click="goToSchema()"
                      >Create Schema(s)
                    </span>
                    <span v-if="selectOptions.length === 1"> / </span>
                    <span>
                      <a
                        class="goschema"
                        :href="`${$config.nodeServer.EXPLORER}identity`"
                        target="_blank"
                      >
                        Explore Schema(s)</a
                      >
                    </span> -->
                </div>
                <div class="mb-1" v-if="
                  isEdit === false &&
                  issueCredentialType != '' &&
                  selectedSchema != ''
                ">
                  <tool-tip infoMessage="Schema Type"></tool-tip>
                  <label for="fordid"><strong>Type:</strong></label>
                  <input type="text" class="form-control" v-model="issueCredentialType" disabled />
                </div>
                <div class="mb-1" v-for="attr in issueCredAttributes" :key="attr.name">
                  <label for="schDescription"><strong>{{ CapitaliseString(attr.name)
                      }}<span v-if="attr.required === true" style="color: red">*</span>:</strong></label>
                  <!-- <Datepicker
                      v-if="attr.type === 'date'"
                      class="datepicker"
                      name="toDate"
                      format="YYYY-MM-DD h:i:s"
                      v-model="attr.value"
                    /> -->
                  <b-form-datepicker v-if="attr.type === 'date'" v-model="attr.value"></b-form-datepicker>

                  <!-- <input class="ml-2" v-if="attr.type === 'boolean'" type="radio" v-model="attr.value" id="required" >                      -->
                  <b-form-radio-group class="pl-2" style="display: inline-block" v-if="attr.type === 'boolean'"
                    id="radio-group-1" v-model="attr.value" :options="booleanOption"
                    name="radio-options-currency"></b-form-radio-group>
                  <input v-if="attr.type === 'integer'" type="number" class="form-control" id="schemaName"
                    v-model.number="attr.value" aria-describedby="schemaNameHelp" placeholder="Enter attribute value" />
                  <input v-if="attr.type == 'number'" type="number" step="0.01" class="form-control" id="schemaName"
                    v-model.number="attr.value" aria-describedby="schemaNameHelp" placeholder="Enter attribute value" />
                  <input v-if="attr.type == 'string'" type="text" class="form-control" id="schemaName"
                    v-model="attr.value" aria-describedby="schemaNameHelp" placeholder="Enter attribute value" />
                </div>
              </b-collapse>

            </div>
            <div class="mb-1" v-if="isEdit === false">
              <tool-tip infoMessage="Enter expiry time for the credential"></tool-tip>
              <label for="fordid"><strong>Expiry Date<span style="color: red">*</span>:</strong></label>
              <b-form-datepicker id="example-datepicker" v-model="expiryDateTime" :min="minDate"></b-form-datepicker>
              <!-- <Datepicker
                      class="datepicker"
                      name="expiryDateTime"
                      format="YYYY-MM-DD h:i:s"
                      v-model="expiryDateTime"
                    /> -->
            </div>
            <div class="">
              <v-checkbox v-model="creadData.persist" label="Store the credential in the data vault?"></v-checkbox>
            </div>
            <div class="">
              <v-checkbox v-model="creadData.registerCredentialStatus"
                label="Attest the credential status on the blockchain?"></v-checkbox>
            </div>
            <div class="form-group row">
              <div class="col-md-12">
                <hf-buttons v-if="isEdit === false" name="Issue" style="text-align: right" class="ml-auto"
                  @executeAction="issueCredential()"></hf-buttons>
                <hf-buttons v-else name="Update" style="text-align: right" class="ml-auto mt-4"
                  @executeAction="updateCredStatus()"></hf-buttons>
              </div>
            </div>
          </div>
        </StudioSideBar>
      </div>
    </div>
    <div class="scrollit" v-if="credentialList.length > 0">
      <div class="">
        <table class="table table-hover event-card" style="background: #ffff">
          <thead class="thead-light">
            <tr>
              <th class="sticky-header">Credential Id</th>
              <th class="sticky-header">Schema</th>
              <th class="sticky-header">Issuer DID</th>
              <!-- <th class="sticky-header">Date</th> -->
              <!-- <th>Expiration Date</th>
              <th>Credential Hash</th> -->
              <th class="sticky-header">Status</th>
              <th class="sticky-header"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in credentialList" :key="row.id">
              <!-- {{ row }} -->
              <td class="grabStyle">
                <span @click="copyToClip(removeUrl(row.credentialMetadata.credentialId), 'Credential Id')">
                   <a :href="`${$config.explorer.BASE_URL}/revocationRegistry/${row.id}`" target="_blank">{{
                  row.credentialMetadata.credentialId ? shorten(row.credentialMetadata.credentialId) : "-" }}</a>
                </span>
              </td>
              <td class="grabStyle" @click="copyToClip(removeUrl(row.credentialMetadata.type.schemaId), 'Schema')">
                {{ typeof (row.credentialMetadata.type) == 'object' ? shorten(row.credentialMetadata.type.schemaId) :
                  row.credentialMetadata.type }}
              </td>
              <td class="grabStyle" @click="copyToClip(removeUrl(row.credentialMetadata.issuerDid), 'Issuer')">
                {{ shorten(row.credentialMetadata.issuerDid) }}
              </td>
              <!-- <td></td> -->
              <td>
                <span v-if="row.status == 'Registered'" class="badge badge-pill badge-primary mr-1">
                <i class="fa fa-check" aria-hidden="true"></i>
                  Registered</span>
                <span v-else-if="row.status == 'Created'" class="badge badge-pill badge-warning mr-1">
                  <i class="fa fa-cog" aria-hidden="true"></i>
                  Created</span>
                <span v-else-if="row.status == 'Error'" class="badge badge-pill badge-danger mr-1">
                  <i class="fa fa-exclamation-circle" aria-hidden="true"></i> Error
                </span>
                <span v-else>
                  <wait-spinner></wait-spinner>
                </span>
                 <!-- Additional status based on row.credentialStatus -->
                <span v-if="row.credentialStatus">
                  <span v-if="row.credentialStatus.revoked" class="badge badge-pill badge-danger">
                    <i class="fa fa-ban" aria-hidden="true"></i> Revoked
                  </span>
                  <span v-else-if="row.credentialStatus.suspended" class="badge badge-pill badge-secondary">
                    <i class="fa fa-pause" aria-hidden="true"></i> Suspended
                  </span>
                  <span v-else-if="!row.credentialStatus.suspended && !row.credentialStatus.revoked" class="badge badge-pill badge-success">
                    <i class="fa fa-play" aria-hidden="true"></i> Live
                  </span>
                   <span v-else>
                  <wait-spinner></wait-spinner>
                </span>
                </span>
              </td>
              <td>
                <!-- <span class="mx-1 grabStyle greyFont" v-if="row.credentialMetadata.persist"
                  title="Unlock credential document" @click="unlockCredential(row.id)">
                  <i class="fa fa-unlock" aria-hidden="true"></i> UNLOCK
                </span> -->
                        <b-dropdown size="sm" variant="link" toggle-class="text-decoration-none" menu-class="dropDownPopup" no-caret dropright :disabled="(!row.credentialMetadata?.persist && row.status !== 'Registered') || (!row.credentialMetadata?.persist && row.credentialStatus?.revoked)">
                          <template #button-content >
                            <b-icon size="sm" style="color: grey" icon="list" aria-hidden="true"></b-icon>
                          </template>
                          <b-dropdown-item-button  style="text-align: left" v-if="row.status == 'Registered' && !row.credentialStatus?.revoked" @click.stop="handleCredentialAction(row.id,'REVOKE')"><i
                              class="fa fa-ban mt-1" aria-hidden="true"></i> Revoke
                          </b-dropdown-item-button>
                          <b-dropdown-item-button style="text-align: left" v-if="row.status == 'Registered' && !row.credentialStatus?.revoked && !row.credentialStatus?.suspended" @click.stop="handleCredentialAction(row.id,'SUSPEND')"><i
                              class="fas fa-pause mt-1" aria-hidden="true"></i> Suspend
                          </b-dropdown-item-button>
                          <b-dropdown-item-button style="text-align: left" v-if="row.status == 'Registered'  && row.credentialStatus?.suspended && !row.credentialStatus?.revoked" @click.stop="handleCredentialAction(row.id,'LIVE')"><i
                              class="fa fa-play mt-1"></i> Live</b-dropdown-item-button>
                          <b-dropdown-item-button style="text-align: left;"  v-if="row.credentialMetadata.persist" title="Unlock credential document" @click.stop="unlockCredential(row.id)"><i 
                              class="fa fa-unlock" aria-hidden="true"></i> Unlock
                          </b-dropdown-item-button>
                        </b-dropdown>

                <!-- </div> -->

                <!-- <span  class="mx-1 grabStyle" v-if="row.credentialMetadata.registerCredentialStatus">
                  <i class="fa-check-circle" aria-hidden="true"></i>
                </span> -->
              </td>
            </tr>
          </tbody>
        </table>

        <hf-pop-up id="view-credential-doc" Header="Credential Document" size="lg">
          <pre id="json-data">
            <code class="prettyprint">
                {{ credentialDocumentToView }}
            </code> 
          </pre>
        </hf-pop-up>
        <loading :active.sync="isLoading" :can-cancel="true" :is-full-page="false"></loading>
        <hf-pop-up Header="Send Credential">
          <Info
            message="Scan QR code or Copy the link and send it to the credential owner so that they can accept in their wallet" />
          <div class="d-flex justify-content-center">
            <vue-qr margin="1" :text="credUrl" :size="200" logoBackgroundColor="white" logoCornerRadius="2"></vue-qr>
          </div>
          <h5 class="pt-2"><span>OR</span></h5>
          <div class="linkdiv">
            <span style="
                max-width: 500px;
                overflow-wrap: break-word;
                padding-left: 10px;
                margin-top: 10px;
                position: absolute;
              ">{{ truncate(credUrl, 65) }}</span>
            <span style="padding: 6px; float: right; margin-top: 5px">
              <i class="far fa-copy pr-2" title="copy url" @click="copyToClip(credUrl, 'URL')"></i>
            </span>
          </div>
        </hf-pop-up>
        <hf-pop-up id="credentialActionPopup"  :Header="selectedAction + ' CREDENTIAL'" size="lg"  @hide="resetForm">
             <form @submit.prevent="submitCredentialAction">
            <div v-if="warningMessage" class="warning-box">
              <span class="warning-icon">⚠️</span> 
              <span class="warning-text">{{ warningMessage }}</span>
            </div>
          <div v-if="errorMessage" class="alert alert-danger">
             {{ errorMessage }}
          </div>
            <!-- Reason Input -->
            <div class="form-group mb-3">
              <label for="update-reason">Reason:</label>
              <input 
                type="text" 
                id="update-reason" 
                class="form-control" 
                placeholder="Enter Reason" 
                v-model="reasonForCredentialUpdate"
                 :class="{'is-invalid': errorMessage && !reasonForCredentialUpdate}"
              />
            </div>
            <!-- VerificationMethodId Input -->

            <div v-if="selectedCredential.credentialStatus">
              <tool-tip infoMessage="Choose a signing key"></tool-tip>
              <label for="selectService">
                <strong>Signing Key Of Issuer<span style="color: red">*</span>:</strong>
              </label>
              <select 
                class="custom-select" 
                id="selectService" 
                v-model="verificationMethodId"
                :class="{'is-invalid': errorMessage && !issuerVerificationMethodId}"
              >
                <option value="">Select a Signing Key</option>
                <option v-for="vm in issuerVerificationMethodIds" :value="vm.id" :key="vm.id">
                  {{ truncate(vm.id, 40) + ' (' + vm.type + ')' }}
                </option>
              </select>
            </div>
          <hf-buttons 
            name="Submit" 
            @executeAction="submitCredentialAction"
          >
         </hf-buttons>
          </form>
        </hf-pop-up>
      </div>
    </div>
  </div>
</template>

<script>
import fetch from "node-fetch";
import UtilsMixin from "../../mixins/utils";
import HfPopUp from "../../components/element/hfPopup.vue";
import Loading from "vue-loading-overlay";
import StudioSideBar from "../../components/element/StudioSideBar.vue";
import HfButtons from "../../components/element/HfButtons.vue";
import EventBus from "../../eventbus";
import ToolTip from "../../components/element/ToolTip.vue";
import {
  isEmpty,
  isValidDid,
  isValidURL,
  isFloat,
} from "../../mixins/fieldValidation";
import message from "../../mixins/messages";
// import Datepicker from "vuejs-datetimepicker";
import VueQr from "vue-qr";
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";
export default {
  name: "CredentialStatus",
  components: {
    HfPopUp,
    Loading,
    StudioSideBar,
    HfButtons,
    ToolTip,
    // Datepicker,
    VueQr,
  },
  computed: {
    minDate() {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      // 15th two months prior
      return new Date(today)
    },
    ...mapGetters("playgroundStore", [
      "vcList",
      "listOfAllSchemaOptions",
      "getSelectedOrg",
      "findSchemaBySchemaID",
    ]),
    ...mapState({
      schemaList: state => state.mainStore.schemaList,
      credentialList: state => state.mainStore.credentialList,
      didList: state => state.mainStore.didList,
      vcList: (state) => state.playgroundStore.vcList,
      containerShift: (state) => state.playgroundStore.containerShift,
      selectedOrgDid: (state) => state.playgroundStore.selectedOrgDid,
    }),
    associatedSSIServiceDIDs() {
      return this.didList.filter(x => x.status == 'Registered').map(x => x.name ? `${x.name} | ${x.did}` : x.did)
    },
    selectOptions() {
      return this.listOfAllSchemaOptions;
    },
    selectedOrg() {
      return this.getSelectedOrg;
    },
    isContainerShift() {
      return this.containerShift;
    },
    issuanceDateUTC() {
      return new Date(this.issuanceDate).toLocaleString("en-us", {
        timeZone: "UTC",
      });
    },
    expirationDateUTC() {
      return new Date(this.expiryDateTime).toLocaleString("en-us", {
        timeZone: "UTC",
      });
    },
  },
  data() {
    return {
      schemaConfigVisible: false,
      issuerConfigVisible: false,
      credentialDocumentToView: "",
      schemaIdsList:[],
      booleanOption: [
        { text: true, value: true },
        { text: false, value: false },
      ],
      selectedSchema: "",
      currentStatus: null,
      vcId: "",
      issuerDid: "",
      issuerVerificationMethodIds: [],
      issuerVerificationMethodId: "",
      authToken: localStorage.getItem("authToken"),
      isEdit: false,
      // description: "An issuer can issue a credential to a subject (or holder) which can be verfied by the verifier independently, without having him to connect with the issuer. They are a part of our daily lives; driver's licenses are used to assert that we are capable of operating a motor vehicle, university degrees can be used to assert our level of education, and government-issued passports enable us to travel between countries.  For example: an airline company can issue a flight ticket (\"verfiable credential\") using schema (issued by DGCA) to the passenger.",
      active: 0,
      host: location.hostname,
      user: {},
      prevRoute: null,
      attributeName: "",
      attributes: [],
      issueCredAttributes: [],
      issueCredentialType: "",
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
      credStatusOptions: [
        { text: "Live", value: "LIVE" },
        { text: "Suspend", value: "SUSPENDED" },
        { text: "Revoke", value: "REVOKED" },
      ],
      selected: null,
      selectedStatus: null,
      attributeValues: {},
      vcCredStatusMap: {},
      // schemaList: [],
      fullPage: true,
      isLoading: false,
      holderDid: "did:hid:testnet:20571bbd-2a8f-4a30-836a-c35630053e46",
      issuanceDate: null,
      expiryDateTime: null,
      preStatusSelect: "",
      statusReason: "",
      schema_page: 1,
      credUrl: "",
      QrData: {
        QRType: "ISSUE_CREDENTIAL",
        serviceEndpoint: "",
        schemaId: "",
        appDid: "",
        appName: "Hypersign Studio",
        challenge: "",
        provider: "",
        data: "",
      },
      creadData: {
        fields: {},
        schemaId: "",
        issuerDid: "",
        verificationMethodId: "",
        subjectDid: "",
        expirationDate: "",
        persist: false,
        registerCredentialStatus: true,
        namespace: "testnet"
      },
      reasonForCredentialUpdate: '',
      verificationMethodId: '',
      selectedAction:"",
      warningMessage: '',
      errorMessage:"",
      selectedCredential:""
    };
  },
    async mounted() {
    try {
     const schemaIds=this.schemaList.map(schema=>{
        if(schema.id&&schema.id!==undefined && schema.status === 'Registered'){
          return {
            text:schema.schemaDocument.name + " "+ `{${UtilsMixin.methods.truncate(schema.id, 60)}}`,
            value:schema.id
        }
        }
        else{
          return null
        }
      })
      this.schemaIdsList = schemaIds.filter(x => x)
      this.schemaIdsList.unshift({ value: null, text: "Please select a schema" })
      return this.schemaIdsList;
    } catch (error) {
      return this.notifyErr(error.message)
    }
  },
  async created() {
      this.debouncedSchemaChange = this.debounce(this.OnSchemaSelectDropDownChange, 400);
      const usrStr = localStorage.getItem("user");
      this.user = JSON.parse(usrStr);
      this.updateSideNavStatus(true);
      this.initComponent()
    // this.fetchCredentialsForOrg();
    // this.fetchSchemasForOrg();
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.prevRoute = from;
    });
  },
  methods: {
    ...mapActions('mainStore', [
      'fetchCredentialList',
      'fetchSchemaList',
      'resolveCredential',
      'checkBlockchainStatusOfSSI',
      'resolveSchema',
      'issueCredentialForAService',
      'updateCredentialForAService'
    ]),
    ...mapMutations("mainStore", ['updateACredential']),
    ...mapActions("playgroundStore", [
      "upsertAcredentialAction",
      "fetchCredentialsForOrg",
      "fetchSchemasForOrg",
      "findOrFetchSchemaBySchemaID",
    ]),
    ...mapMutations("playgroundStore", [
      "increaseOrgDataCount",
      "updateSideNavStatus",
    ]),
    async initComponent(){
      try {
      this.isLoading = true;
      // await this.fetchSchemaList();
      await this.fetchCredentialList();
      this.isLoading = false
    } catch (e) {
      this.isLoading = false
      this.notifyErr(e.message)
      this.$router.push({ path: '/studio/dashboard' });
    }
    },
    debounce(fn, delay) {
        let timeout;
        return function (...args) {
          const context = this;
          clearTimeout(timeout);
          timeout = setTimeout(() => fn.apply(context, args), delay);
        };
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
            if (response.data.findIndex(x => x.status == 0) >= 0) {
              this.notifySuccess('Credential successfully registerd on the blockchain, txHash: ' + response.data[0].txnHash)
              this.updateACredential({
                id: id_to_check_status,
                status: 'Registered',
              })
              this.resolveCredential({ credentialId: id_to_check_status, retrieveCredential: false })
              clearInterval(statusCheckInterval)
            } else {
              this.resolveCredential({ credentialId: id_to_check_status, retrieveCredential: false })
              this.notifyErr('Sorry we could not register your Credential, txHash: ' + response.data[0].txnHash)
            }
          }
          if (i == maxrtries) {
            this.notifyErr('All atempts failed to check the status on blockchain. Please check it manually')
            this.resolveCredential({ credentialId: id_to_check_status, retrieveCredential: false })
            clearInterval(statusCheckInterval)
          }
        }, interval * 1000)
      } catch (e) {
        console.error(e.message)
        this.notifyErr(e.message)
      }
    },
     async checkCredentialUpdateStatus(id_to_check_status, dateTime) {
      try {
        const maxrtries = 7         
        const interval = 5
        let i = 0
        const statusCheckInterval = setInterval(async () => {
          i = i + 1;
          const response = await this.checkBlockchainStatusOfSSI(id_to_check_status)
          if (response && response.data && response.data.length > 0 ) {
            const sortedData = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            const latestEntry = sortedData[0];
          if(new Date(latestEntry.createdAt)>= new Date(dateTime)){
             if (latestEntry.status === 0) {
            this.notifySuccess('Credential successfully updated on the blockchain, txHash: ' + latestEntry.txnHash);
          } else {
            this.notifyErr('Sorry we could not register your Credential, txHash: ' + latestEntry.txnHash);
          }
          this.resolveCredential({ credentialId: id_to_check_status, retrieveCredential: false });
             clearInterval(statusCheckInterval);
        }
        }  
     
          if (i == maxrtries) {
            this.notifyErr('All atempts failed to check the status on blockchain. Please check it manually')
            this.resolveCredential({ credentialId: id_to_check_status, retrieveCredential: false })
            clearInterval(statusCheckInterval)
          }
        }, interval * 1000)
      } catch (e) {
        console.error(e.message)
        this.notifyErr(e.message)
      }
    },
    async unlockCredential(credentialId) {
      this.isLoading = true;

      await this.resolveCredential({
        credentialId,
        retrieveCredential: true
      })
      const cred = this.credentialList.find(x => x.id == credentialId)
      console.log(cred)
      if (cred) {
        this.credentialDocumentToView = JSON.stringify(cred.credentialDocument, null, 2)
        this.$root.$emit("bv::show::modal", "view-credential-doc");
      }
      this.isLoading = false;
    },
    getSelfDIDAsSubject() {
      this.holderDid = this.user.id;
    },
    async resolveDid(event) {
      this.issuerVerificationMethodId = ""
      const didDocId=event?.target?.value || event
      const did = didDocId?.trim()
      const didDocument = this.didList.find(x => x.did == did)?.didDocument
      this.issuerVerificationMethodIds = didDocument ? didDocument.verificationMethod : [];
    },

    noEdit(row) {
      if (row.credentialStatus.credentialStatusDocument.revoked === true) {
        return false;
      } else {
        return true;
      }
    },
    resetForm() {
      this.reasonForCredentialUpdate = "";
      this.verificationMethodId = "";
      this.errorMessage = "";
      this.warningMessage="";
  },
   async handleCredentialAction(credentialId,action){
       this.resetForm()
       this.vcId = credentialId; 
       this.selectedAction =action ;
       this.selectedCredential= this.credentialList.find(x=>x.id===credentialId)
      if(this.selectedCredential){
        const credIssuerDid= this.selectedCredential.credentialStatus.issuer;
        await this.resolveDid(credIssuerDid)
      }
        this.$root.$emit("bv::show::modal", "credentialActionPopup"); 
        if(action=='SUSPEND'){
        this.warningMessage="You are suspending this credential. It can be reactivated and made live again later."
        }else if(action=='REVOKE'){
          this.warningMessage="You are revoking the credential.Once revoked, this credential cannot be made live again. This action is permanent."
        }
    },
     
    async submitCredentialAction() {
      try {
         this.isLoading = true;
         this.errorMessage = "";
          if (this.reasonForCredentialUpdate == "") {
            this.errorMessage = "Status Reason cannot be empty.";
            return;
          }
            if (this.verificationMethodId == "") {
               this.errorMessage = "Verification Method ID cannot be empty.";
               return;
          }
           let fetchedCredStatus;
           const { revoked, suspended, issuer } =this.selectedCredential.credentialStatus;
              if (revoked) {
                  fetchedCredStatus = "REVOKE";
                } else if (suspended) {
                  fetchedCredStatus = "SUSPEND";
                } else {
                  fetchedCredStatus = "LIVE";
                }
         //check for status
        switch (this.selectedAction) {
          case "LIVE":
            if (fetchedCredStatus === "LIVE") {
               this.errorMessage = "Credential is already Live.";
              return;
            }
            break;
          case "SUSPEND":
            if (fetchedCredStatus === "SUSPEND") {
               this.errorMessage = "Credential is already SUSPENDED.";
            }
            break;
          case "REVOKE":
            if (fetchedCredStatus === "REVOKE") {
              this.errorMessage = "Credential is already Revoked.";
              return;
            }
            break;
          default:
            this.errorMessage = "Invalid status.";
            return;
        }
        const credPayload=
                {
                  "namespace": "testnet",
                  "status":this.selectedAction,
                  "statusReason":this.reasonForCredentialUpdate,
                  "issuerDid": issuer,
                  "verificationMethodId": this.verificationMethodId,
                  "credentialId":this.vcId
                }
        const currentTime= new Date()
        const response= await this.updateCredentialForAService(credPayload)
        if(response.id){
          this.checkCredentialUpdateStatus(response?.id,currentTime)
        }
        this.isLoading = false;
        this.clearEdit();
        this.clearAll();
        this.$root.$emit("bv::hide::modal", "credentialActionPopup");
      } catch (e) {
        this.notifyErr(e);
      } finally {
        this.isLoading = false;
      }
    },
    editCred(cred) {
      this.clearEdit();
      this.isEdit = true;
      this.$root.$emit("bv::toggle::collapse", "sidebar-right");
      this.holderDid = cred.subjectDid;
      this.issuerDid = cred.issuerDid;
      this.credHash =
        cred.credentialStatus.credentialStatusDocument.credentialMerkleRootHash;
      const { expirationDate, issuanceDate } = cred.vc;
      console.log({ expirationDate, issuanceDate });
      this.expiryDateTime = expirationDate;
      this.issuanceDate = issuanceDate;
      const { revoked, suspended, remarks } =
        cred.credentialStatus.credentialStatusDocument;
      this.statusReason = remarks;
      if (!revoked && !suspended) {
        this.selectedStatus = "LIVE";
        this.currentStatus = "LIVE";
        this.credStatusOptions = [
          { text: "Live", value: "LIVE", disabled: true },
          { text: "Suspend", value: "SUSPENDED" },
          { text: "Revoke", value: "REVOKED" },
        ];
      } else if (!suspended) {
        this.selectedStatus = "SUSPENDED";
        this.currentStatus = "SUSPENDED";
        this.credStatusOptions = [
          { text: "Suspend", value: "SUSPENDED", disabled: true },
          { text: "Live", value: "LIVE" },
          { text: "Revoke", value: "REVOKED" },
        ];
      } else {
        this.selectedStatus = "REVOKED";
      }

      this.preStatusSelect = this.selectedStatus;
      // switch (cred.credStatus.claim.currentStatus) {
      //   case "Live":
      //     this.selectedStatus = "LIVE";
      //     this.credStatusOptions = [
      //       { text: "Live", value: "LIVE", disabled: true },
      //       { text: "Suspend", value: "SUSPENDED" },
      //       { text: "Revoke", value: "REVOKED" },
      //     ];
      //     break;
      //   case "Suspended":
      //     this.selectedStatus = "SUSPENDED";
      //     this.credStatusOptions = [
      //       { text: "Suspended", value: "SUSPENDED", disabled: true },
      //       { text: "Live", value: "LIVE" },
      //       { text: "Revoke", value: "REVOKED" },
      //     ];
      //     break;
      //   case "Revoked":
      //     this.selectedStatus = "REVOKED";
      //     break;
      //   case "Expired":
      //     this.selectedStatus = "EXPIRED";
      //     break;
      //   default:
      //     this.notifyError("Invalid credential status");
      // }
      // this.currentStatus = cred.credStatus.claim.currentStatus;

      this.vcId = cred.vc.id;
    },
    clearEdit() {
      this.selectedStatus = null;
      this.issuerDid = "";
      this.issuerVerificationMethodId = ""
      this.holderDid = "";
      this.expiryDateTime = null;
      this.currentStatus = "";
      this.vcId = "";
      this.preStatusSelect = "";
      this.statusReason = "";
      this.selectedSchema = "";
      this.issueCredentialType = "";
      this.reasonForCredentialUpdate = "";
      this.verificationMethodId = "";
      this.warningMessage = "";
      this.selectedAction='';
      this.errorMessage='';
      this.selectedCredential='';
    },
      async updateCredStatus() {
      try {
        this.isLoading = true;
        if (this.statusReason == "") {
          return this.notifyErr("Staus Reason cannot be empty");
        }
        //check for status check
        switch (this.preStatusSelect) {
          case "LIVE":
            if (this.selectedStatus === "LIVE") {
              return this.notifyErr("Credential already Live");
            }
            break;
          case "SUSPENDED":
            if (this.selectedStatus === "SUSPENDED") {
              return this.notifyErr("Credential already Suspended");
            }
            break;
          case "REVOKED":
            if (this.selectedStatus === "REVOKED") {
              return this.notifyErr("Credential already Revoked");
            }
            break;
          default:
            return this.notifyErr("Invalid status");
        }
        const url = `${this.$config.studioServer.BASE_URL}${this.$config.studioServer.CRED_ISSUE_EP}`;
        const creadData = {
          status: this.selectedStatus,
          vcId: this.vcId,
          statusReason: this.statusReason,
        };
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.authToken}`,
        };
        fetch(url, {
          method: "PUT",
          headers,
          body: JSON.stringify({ QR_DATA: creadData }),
        })
          .then((res) => res.json())
          .then((json) => {
            const { QR_DATA } = json.data;
            const id = QR_DATA.data._id;
            if (json.message === "success") {
              this.notifySuccess("cred status updated successfully");
              const URL = `${this.$config.webWalletAddress
                }/deeplink?url=${JSON.stringify(QR_DATA)}`;
              this.openWallet(URL);
              this.ssePopulateCredStatus(id, this.$store);
              this.openSlider();
            }
          });
      } catch (e) {
        console.log(e);
      } finally {
        this.isLoading = false;
        this.clearAll();
      }
    },
    showInputField(type) {
      console.log(type);
      if (type !== "date" || type !== "boolean") {
        return true;
      } else {
        return false;
      }
    },
    CapitaliseString(string) {
      const spaced = string.replace(/([a-z])([A-Z])/g, "$1 $2");
      return spaced.charAt(0).toUpperCase() + spaced.slice(1);
    },
    removeUrl(url) {
      if (url) {
        const chars = url.split("credential/");
        return chars[0];
      }
    },
    goToSchema() {
      this.$router.push(`/studio/dashboard/schema/${window.location.href.split('credential/')[1]}`);
    },
    openSlider() {
      this.isEdit = false;
      this.clearAll();
      this.$root.$emit("bv::toggle::collapse", "sidebar-right");
    },
    ssePopulateCredStatus(id) {
      const sse = new EventSource(`${this.$config.studioServer.CRED_SSE}${id}`);
      const that = this;
      sse.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (
          data.status === "Registered" ||
          data.status === "Failed" ||
          data.status === "Live" ||
          data.status === "Suspended" ||
          data.status === "Revoked"
        ) {
          sse.close();
          that.upsertAcredentialAction(data);
        }
      };

      sse.onopen = function (e) {
        console.log("Connection to server opened.", e);
      };

      sse.onerror = function (e) {
        console.log(e);
        sse.close();
      };
      return;
    },
    async generateCred(id) {
      this.credUrl = "";
      const body = {
        id,
      };
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      };
      const URL =
        this.$config.studioServer.BASE_URL +
        this.$config.studioServer.ACCPCT_CRED_EP;
      const res = await fetch(URL, options);
      const resp = await res.json();
      this.credUrl = resp.data.url;
      this.$root.$emit("modal-show");
      this.notifySuccess("Credential URL Generated Successfully");
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
      this.selectedStatus = event;
      this.statusReason = "";
      // if(event) {

      // }
    },
    onSchemaInputChange() {
      this.OnSchemaSelectDropDownChange(this.selectedSchema);
    },
    async OnSchemaSelectDropDownChange(event) {
      try {
        this.selected = null;
        this.selected = event;
        if (event) {
          this.issueCredAttributes = [];
          this.isLoading = true;
          let selectedSchemas = await this.resolveSchema(event);
          if(selectedSchemas && selectedSchemas?.schemaDocument && selectedSchemas?.schemaDocument?.schema){
            const schemaMap = selectedSchemas.schemaDocument.schema.properties;
            const requiredFields = selectedSchemas.schemaDocument.schema.required;
            this.issueCredentialType = selectedSchemas.schemaDocument.name;
            for (const e of Object.entries(schemaMap)) {
              let dataToPush = {
                id: event,
                type: e[1].type,
                name: e[0],
              };
              switch (e[1].type) {
                case "boolean":
                  dataToPush["value"] = null;
                  break;
                case "string":
                  dataToPush["value"] = null;
                  break;
                case "number":
                  dataToPush["value"] = null;
                  break;
                case "integer":
                  dataToPush["value"] = null;
                  break;
                case "date":
                  dataToPush["value"] = null;
                  break;
                default:
                  this.notifyErr("invalid type");
              }

              this.issueCredAttributes.push(dataToPush);
            }

          this.issueCredAttributes=  this.issueCredAttributes.map((x) => {
              if (requiredFields.includes(x.name)) {
                x["required"] = true;
              } else {
                x["required"] = false;
              }
              return x
            });
            this.isLoading = false;
            console.log(JSON.stringify(this.issueCredAttributes, null, 2));
            this.isLoading = false;
          } else {
            this.issueCredAttributes = [];
            this.isLoading= false
          }
        } else {
          this.issueCredAttributes = [];
            this.isLoading= false
        } 
      } catch (e) {
        console.log(e);
        this.isLoading = false;
        this.notifyErr(`Error: ${e.message}`);
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
      let attributesMap = {};
      if (this.issueCredAttributes.length > 0) {
        this.issueCredAttributes.forEach((e) => {
          switch (e.type) {
            case "string": {
              if (e.required === true) {
                if (e.value === "") {
                  throw new Error(
                    `Please enter input in ${this.CapitaliseString(
                      e.name
                    )} field`
                  );
                }
              }
              break;
            }
            case "number": {
              if (e.required === true) {
                if (e.value === "" || !Number(e.value)) {
                  throw new Error(
                    `Please enter valid input in ${this.CapitaliseString(
                      e.name
                    )} field`
                  );
                }
              } else {
                if (e.value !== "" && !Number(e.value)) {
                  throw new Error(
                    `Please enter valid input in ${this.CapitaliseString(
                      e.name
                    )} field`
                  );
                }
              }
              break;
            }
            case "integer": {
              if (e.required === true) {
                if (e.value === "" || isFloat(e.value) || isNaN(e.value)) {
                  throw new Error(
                    `Please enter valid input in ${this.CapitaliseString(
                      e.name
                    )} field`
                  );
                }
              } else {
                if (e.value !== "" && (isFloat(e.value) || isNaN(e.value))) {
                  throw new Error(
                    `Please enter valid input in ${this.CapitaliseString(
                      e.name
                    )} field`
                  );
                }
              }
              break;
            }
            case "date": {
              if (e.required === true) {
                if (e.value === "" || isValidURL(e.value)) {
                  throw new Error(
                    `Please enter valid input in ${this.CapitaliseString(
                      e.name
                    )} field`
                  );
                }
              } else {
                if (isValidURL(e.value)) {
                  throw new Error(
                    `Please enter valid input in ${this.CapitaliseString(
                      e.name
                    )} field`
                  );
                }
              }
              break;
            }
            case "boolean": {
              if (e.required === true) {
                if (e.value === null) {
                  throw new Error(
                    `Please enter valid input in ${this.CapitaliseString(
                      e.name
                    )} field`
                  );
                }
              }
              break;
            }
            default:
              throw new Error("invalid type");
          }
          if (e.value !== "" && e.value !== null) {
            // dataToSend = {
            //   name: e.name,
            //   type: e.type,
            //   value: e.value,
            // };
            // attributesMap.push(dataToSend);
            attributesMap[e.name] = e.value
          }
        });
      }
      return attributesMap;
    },
    async issueCredential() {
      try {
        const ToDate = new Date();
        if (isEmpty(this.holderDid)) {
          return this.notifyErr(message.CREDENTIAL.EMPTY_HOLDER_DID);
        }
        else if (isEmpty(this.issuerDid)) {
          return this.notifyErr(message.CREDENTIAL.EMPTY_ISSUER_DID)
        }
        // else if(!isValidDid(this.issuerDid)) {
        //   return this.notifyErr(message.CREDENTIAL.INVALID_DID)
        // }
        else if (!isValidDid(this.holderDid)) {
          return this.notifyErr(message.CREDENTIAL.INVALID_DID);
        }

        else if (isEmpty(this.selected)) {
          return this.notifyErr(message.CREDENTIAL.SELECT_SCHEMA);
        } else if (this.holderDid.trim() == this.issuerDid) {
          return this.notifyErr(message.CREDENTIAL.ISSUER_HOLDER_NOT_SAME);
        }
        // generateAttributeMap
        const attributeMap = await this.generateAttributeMap();

        if (!this.expiryDateTime) {
          return this.notifyErr("Enter Expiry Date for credential");
        }
        if (new Date(this.expiryDateTime).getTime() <= ToDate.getTime()) {
          return this.notifyErr(
            "Expiry time should be gretter than current date & time"
          );
        }
        this.isLoading = true;
        this.creadData.fields = attributeMap;
        this.creadData.schemaId = this.selected.trim(),
        this.creadData.issuerDid = this.issuerDid.trim(),
        this.creadData.verificationMethodId = this.issuerVerificationMethodId.trim(),
        this.creadData.subjectDid = this.holderDid.trim(),
        this.creadData.expirationDate = this.expiryDateTime,

          // this.QrData.data = creadData;
          console.log(this.creadData);
        const response = await this.issueCredentialForAService(this.creadData)
        if (this.creadData.registerCredentialStatus && response.id) {
          // this.updateASchema({
          //   id: response?.schemaId,
          //   status: 'Please wait..',
          // })
          this.checkRegistrationStatus(response?.id)
        }
        this.openSlider();
        this.schemaConfigVisible= false
        this.isLoading = false;
      } catch (e) {
        console.log(e);
        this.isLoading = false;
        this.notifyErr(`Error: ${e.message}`);
      } finally {
        this.isLoading = false;
        // this.clearAll();
      }
    },
    clearAll() {
      this.issuerDid = "";
      this.issuerVerificationMethodId = "";
      this.issuerVerificationMethodIds = []
      this.holderDid = "";
      this.expiryDateTime = null;
      this.issueCredAttributes = [];
      this.selectedSchema = "";
      this.issueCredentialType = "";
      this.reasonForCredentialUpdate = "";
      this.verificationMethodId = "";
      this.warningMessage = "";
      this.selectedAction='';
      this.errorMessage='';
      this.issuerConfigVisible = false;
      EventBus.$emit("resetOption", this.selected);
    },
  },
  mixins: [UtilsMixin],
};
</script>