<style scoped>
.sticky-header {
  position: sticky;
  top: 0;
}

.container {
  width: 80vw;
}

.UI--c-kbgiPT-iehgGlf-css {
  background-color: #9cb5f9;
}

.step-notStarted {
  background-color: #afb8cc;
}

.step-finished {
  background-color: #9cb5f9;
}


.UI--c-dhzjXW-iexswVt-css {
  align-items: center;
  justify-content: center;
}

.UI--c-kbgiPT-bUORwj-isFirst-true {
  padding: 0px 0.4rem 0px 0px;
  clip-path: polygon(75% 0%, 100% 50%, 75% 100%, 0% 100%, 0% 100%, 0% 0%);
}

.UI--c-kbgiPT {
  height: 100%;
  width: 4.8rem;
  clip-path: polygon(75% 0%, 100% 50%, 75% 100%, 0% 100%, 25% 50%, 0% 0%);
  margin-left: -0.9rem;
  padding: 0px 0.4rem 0px 0.8rem;
}

.UI--c-dhzjXW {
  display: flex;
}

.stepSpan {
  cursor: pointer;
  margin: 3px;
  padding: 0px;
  border: 0px;
  font: inherit;
  vertical-align: baseline;
  float: left
}

.step {
  height: 32px;
  width: 50px;
}

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

.datetime-picker {
  background-color: #fff;
  background-clip: content-box;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  padding: 0.375rem 0.75rem;
}

.linkdiv {
  background-clip: content-box;
  background-color: rgba(173, 232, 255, .5607843137254902);
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
</style>
<template>
  <div :class="isContainerShift ? 'homeShift' : 'home'">
    <loading :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></loading>
    <div class="">
      <div class="" style="text-align: left">
        <!-- <Info :message="description" /> -->
        <div class="form-group" style="display:flex">
          <h3 v-if="didList.length > 0" style="text-align: left;">
            Decentralised Identifier</h3>
          <h3 v-else style="text-align: left;">Create your first decentralised identifier!</h3>
          <hf-buttons name="Create" iconClass="fa fa-plus" style="text-align: right;" class="ml-auto"
            @executeAction="openSlider()"></hf-buttons>
        </div>
        <StudioSideBar title="Create DID">
          <div class="container" style="width: 100%;">
            <div class="form-group">
              <tool-tip infoMessage="Enter name of DID"></tool-tip>
              <label for="schemaName"><strong>Name<span style="color: red">*</span>:</strong></label>
              <input type="text" class="form-control" id="schemaName" v-model="did.options.name"
                aria-describedby="schemaNameHelp" placeholder="Enter a name for this did">
            </div>

            <div class="form-group">
              <tool-tip infoMessage="Select a DID method namespace"></tool-tip>
              <label for="schemaName"><strong>Namespace<span style="color: red">*</span>:</strong></label>
              <hf-select-drop-down :options="namespaceOptions"
                @selected="e => (did.namespace = e)"></hf-select-drop-down>
            </div>

            <div class="form-group">
              <tool-tip infoMessage="Method specific id for a did"></tool-tip>
              <label for="schemaName"><strong>Method Specific Id<span style="color: red">*</span>:</strong></label>
              <div class="input-group">
                <input type="text" class="form-control" id="schemaName" v-model="did.methodSpecificId"
                  aria-describedby="schemaNameHelp" placeholder="Enter or create a method specific id">
                <div class="input-group-append">
                  <button class="input-group-text btn btn-secondary" id="basic-addon1"
                    @click="generateRandomMethodSepcificId">Generate</button>
                </div>
              </div>
            </div>
            <div class="">
              <tool-tip infoMessage="Select one or more key type"></tool-tip>
              <label for="schemaName"><strong>Key Type<span
                    style="color: red">*</span>:</strong></label>
                <v-select
                  v-model="selectedKeyTypes"
                  :items="keyTypeOptions"
                  multiple
                  chips
                  attach
                  dense
                  outlined
                ></v-select>
            </div>
            <div class="">
              <tool-tip infoMessage="Select one or more verification relationships"></tool-tip>
              <label for="schemaName"><strong>Verification Relationships<span
                    style="color: red">*</span>:</strong></label>
              
                <v-select
                  v-model="selectedVerificationRelationships"
                  :items="verificationRelationshipsOptions"
                  multiple
                  chips
                  attach
                  dense
                  outlined
                ></v-select>
            </div>
            <div class="">
              <v-checkbox
                v-model="shouldRegister"
                label="Register DID on the blockchain?"
              ></v-checkbox>
            </div>

            <div class="form-group row ">
              <div class="col-md-12">
                <hf-buttons name="Save" @executeAction="createDID()"></hf-buttons>
              </div>
            </div>
          </div>
        </StudioSideBar>
      </div>
    </div>
    <div class="scrollit" v-if="didList.length > 0">
      <div class="">
        <table class="table table-hover event-card">
          <thead class="thead-light">
            <tr>
              <!-- <th></th> -->
              <th class="sticky-header">DID Id</th>
              <th class="sticky-header">Name</th>
              <th class="sticky-header">Associated Key Type(s)</th>
              <th class="sticky-header">Status</th>
              <!-- <th class="sticky-header">Action</th> -->
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in didList" :key="row.did">

              <!-- <td>
                <span class="fa-stack fa-sm" v-if="checkIfDomainIsVerified(row.didDocument)" style="font-size:8px">
                  <i class="fa fa-certificate fa-stack-2x" aria-hidden="true" style="color:#651d65"></i>
                  <i class="fa fa-check fa-stack-1x fa-inverse" aria-hidden="true"></i>
                </span>
              </td> -->
              <td @click="copyToClip(row.did, 'DID')" style="cursor: pointer;">{{ row.did }}</td>
              <td>{{ row.name }}</td>
              <td>
                <div>
                  <span style="float:left" class="badge badge-info"
                    v-for="eachKey in row.didDocument.verificationMethod" v-bind:key="eachKey.id">
                    {{ eachKey.type }}

                  </span>
                </div>

              </td>
              <td >
                <span v-if="row.status == 'Registered'" class="badge badge-pill badge-success"><i class="fa fa-check" aria-hidden="true"></i>
                  Registered</span>
                <span v-else-if="row.status == 'Created'" class="badge badge-pill badge-warning"><i class="fa fa-cog" aria-hidden="true"></i>
                  Created</span>
                <span v-else>
                  <wait-spinner></wait-spinner>
                </span>
              </td>
              <!-- <td>
                <span><i class="fa fa-eye" aria-hidden="true"></i></span>

                <span v-if="!checkIfDomainIsVerified(row.didDocument)" @click="linkDomain(row)" class="ml-2"
                  style="cursor:grab"><i class="fa fa-link"></i></span>
              </td> -->
            </tr>
          </tbody>
        </table>
      </div>
    </div>


    <hf-pop-up id="link-domain" Header="Link a domain with DID">


      <div class="form-group">
        <label for="schemaName"><strong>Domain Name<span style="color: red">*</span></strong>:</label>
        <div class="input-group">
          <input type="text" class="form-control" id="schemaName" v-model="domain" aria-describedby="schemaNameHelp"
            placeholder="Enter Your Domain Name (e.g https://example.com)">
        </div>
      </div>

      <div class="form-group" v-if="domain != ''">
        <label for="schemaName"><strong>TXT Record</strong>:</label>
        <div class="input-group">
          <input type="text" class="form-control" :value="domainDidLinkTxtRecordText" disabled>
          <div class="input-group-append">
            <button class="input-group-text btn btn-secondary" id="basic-addon1"
              @click="copyToClip(domainDidLinkTxtRecordText, 'TXT Record')"><i class="fa fa-clone"
                aria-hidden="true"></i></button>
          </div>
        </div>
        <small style="color:grey">Please add the TXT record in your DNS for DNS-01 validation</small>
      </div>




      <div class="form-group">
        <label for="orgDid"><strong>Logo Url</strong> (optional): </label>
        <input type="text" class="form-control" id="appId" v-model="domainLogoUrl"
          placeholder="Enter logo url (e.g https://example.com/logo.png)" />
      </div>

      <div class="text-center mt-3">
        <!-- <hf-buttons :name="verifyButtonText" class="btn btn-primary text-center"
              @executeAction="verifyDNS01AndUpdateDID()">
            </hf-buttons> -->
        <button @click="verifyDNS01AndUpdateDID()" class="btn btn-primary">{{ verifyButtonText }}</button>
      </div>
    </hf-pop-up>
  </div>
</template>

<script>
import UtilsMixin from '../../mixins/utils';
import HfPopUp from "../../components/element/hfPopup.vue";
import Loading from "vue-loading-overlay";
import StudioSideBar from "../../components/element/StudioSideBar.vue";
import HfButtons from "../../components/element/HfButtons.vue"
import HfSelectDropDown from "../../components/element/HfSelectDropDown.vue"
import ToolTip from "../../components/element/ToolTip.vue"
import DomainLinkage from '@hypersign-protocol/domain-linkage-verifier'
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";
export default {
  name: "DIDs",
  components: { HfPopUp, Loading, StudioSideBar, HfButtons, HfSelectDropDown, ToolTip, },
  computed: {
    ...mapGetters('mainStore', ['sessionList']),
    ...mapState({
      didList: state => state.mainStore.didList,
      containerShift: state => state.playgroundStore.containerShift,
    }),
    isContainerShift() {
      return this.containerShift
    },
    domainDidLinkTxtRecordText() {
      return `hypersign-link-domain.did=${this.domainDID}`
    }
  },
  data() {
    return {
       selectedKeyTypes: ['Ed25519VerificationKey2020'],
       shouldRegister: false,
      verifyButtonText: 'Verify',
      authToken: localStorage.getItem('authToken'),
      user: {},
      fullPage: true,
      isLoading: false,
      viewDidDocument: "",
      namespaceOptions: [
        { text: "Select a DID method namespace", value: null },
        { text: "testnet", value: "testnet", selected: true },
      ],
      keyTypeOptions: ['Ed25519VerificationKey2020','BabyJubJubKey2021'],
      // keyTypeOptions: [
      //   { text: "Select KeyType", value: null },
      //   { text: "Ed25519VerificationKey2020", value: "Ed25519VerificationKey2020", selected: true },
      //   // { text: "EcdsaSecp256k1RecoveryMethod2020", value: "EcdsaSecp256k1RecoveryMethod2020" },
      //   { text: "BabyJubJubKey2021", value: "BabyJubJubKey2021" },
      // ],
      selectedVerificationRelationships: ['assertionMethod', 'authentication'],
      verificationRelationshipsOptions: ['assertionMethod', 'authentication'],
      // verificationRelationshipsOptions: [
      //   { text: "Select Verification Relationship", value: null },
      //   { text: "assertionMethod", value: "assertionMethod" },
      //   { text: "authentication", value: "authentication" },
      // ],
      domain: "",
      domainLogoUrl: "",
      domainDID: "",
      domainDIDDocument: {},
      did: {
        name: "",
        namespace: "testnet",
        methodSpecificId: "",
        options: {
          keyType: [],
          chainId: "",
          publicKey: "",
          walletAddress: "",
          verificationRelationships: [
            { text: "assertionMethod", value: "assertionMethod" },
            { text: "authentication", value: "authentication" },
          ],
          name: ""
        }
      },
    }
  },
  async created() {
    try {
      const usrStr = localStorage.getItem("user");
      this.user = JSON.parse(usrStr);
      this.updateSideNavStatus(true)

      // appId
      this.isLoading = true
      await this.fetchDIDsForAService()
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
    ...mapActions('mainStore', ['fetchDIDsForAService', 'createDIDsForAService','checkBlockchainStatusOfSSI', 'registerDIDsForAService', 'updateDIDsForAService']),
    ...mapMutations('playgroundStore', ['updateSideNavStatus', 'shiftContainer']),
    ...mapMutations('mainStore', ['updateADID']),

    linkDomain(row) {
      // remove this once this feature is complete
      this.notifyErr("Feature coming soon");

      this.domainDID = row.did;
      this.domainDIDDocument = row.didDocument
      // this.$root.$emit("bv::show::modal", "link-domain");
    },
    updateKeyTypeValues(selectedItems) {
    if (selectedItems && selectedItems.length > 0) {
       this.did.options.keyType = selectedItems.map(item => item.value);
    } else {
      this.did.options.keyType = [];
    }
  },

    // checkIfDomainIsVerified(didDocument) {
    //   if (didDocument && Object.keys(didDocument).length > 0) {
    //     if (didDocument.service && didDocument.service.length > 0) {
    //       const linkedDomainServices = didDocument.service.filter(service => service.type == "LinkedDomains")
    //       if (linkedDomainServices.length > 0) {
    //         return true
    //       }
    //     } else {
    //       return false;
    //     }
    //   } else {
    //     return false;
    //   }
    // },
    async verifyDNS01AndUpdateDID() {
      try {
        this.isLoading = true;
        // TODO
        // Step 1: DNS01 validation
        this.verifyButtonText = 'Verify DNS01...'
        const domainLinkage = new DomainLinkage(this.domain)
        const params = {
          domain: this.domain.includes('http') ? this.domain : new URL('https://' + this.domain),
          txtRecord: "google-site-verification=sDjFsne7lhpJSjnq86xe-SakwbtwdqhRjJ1fCHcTP2E"//this.domainDidLinkTxtRecordText
        }

        console.log(params)
        const dns01Result = await domainLinkage.verifyDnsTxtRecord(params.domain, params.txtRecord)
        console.log(dns01Result)
        if (dns01Result && dns01Result.verified) {
          // 
          this.verifyButtonText = 'DNS01 verified'

          this.verifyButtonText = 'Updating DID...'

          // Step 2: Update the DID
          if (Object.keys(this.domainDIDDocument).length > 0) {
            if (this.domainDIDDocument.service) {
              this.domainDIDDocument.service.push({
                id: this.domainDID + "#linkedDomain",
                type: "LinkedDomains",
                serviceEndpoint: this.domain
              })

              if (this.domainLogoUrl != "") {
                // TODO: validate if its a valid URL
                // this.domainDIDDocument.service.push({
                //   id: this.domainDID+"#logo",
                //   type: "Image",
                //   serviceEndpoint: this.domainLogoUrl
                // })
              }

              const payload = {
                didDocument: this.domainDIDDocument,
                verificationMethodId: this.domainDIDDocument.verificationMethod[0].id,
                deactivate: false
              }

              console.log('Callling before updateDIDsForAService')
              await this.updateDIDsForAService(payload)
              console.log('Callling after updateDIDsForAService')

              // TODO: update the UI  to looks like user have verifed his domain
            } else {
              console.log('this.domainDIDDocument.service is null or empty')
            }
          } else {
            console.log('domainDIDDocument is null or empty')
          }
        } else {
          throw new Error('Could not verify your DNS, if you have already added TXT record, try after sometime')
        }
        this.isLoading = false;



      } catch (e) {
        console.error(e.message)
        this.isLoading = false;
        this.verifyButtonText = "Verify"
      }



    },

    async viewSessionDetails(sessionId) {
      console.log(sessionId)
      this.$router.push({ name: "sessionDetails", params: { appId: this.$route.params.appId, sessionId } });
      this.shiftContainer(false);
    },


    onNameSpaceSelect(value) {
      console.log(value);
    },

    async registerDidDoc(didDocument, verificationMethodId) {
      try {
        this.isLoading = true;
        await this.registerDIDsForAService({
          didDocument, verificationMethodId
        })
        this.isLoading = false;
      } catch (e) {
        console.error(e)
        this.isLoading = false;
      }
    },

    onInputTag() {
      console.log('onInputTag ()  got called')
      // if(this.selectedSchemIdsInMultiSelect.length > 0){
      //   console.log('Inside if mapping');  
      //   this.presentationTemplate.schemaId = this.selectedSchemIdsInMultiSelect.map(x => x.value)
      // } else {
      //   this.presentationTemplate.schemaId = []; 
      // }
    },

    openSlider() {
      this.counter = 0
      this.clearAll();
      this.generateRandomMethodSepcificId()
      this.$root.$emit("bv::toggle::collapse", "sidebar-right");
    },
    clearAll() {
      this.visible = false
      this.selectedKeyTypes= ['Ed25519VerificationKey2020']
      this.did = {
        name: "",
        namespace: "testnet",
        methodSpecificId: "",
        options: {
          keyType: [],
          chainId: "",
          publicKey: "",
          walletAddress: "",
          verificationRelationships: [
            { text: "assertionMethod", value: "assertionMethod" },
            { text: "authentication", value: "authentication" },
          ]
        }
      },
      this.shouldRegister = false
      this.attributes = []
    },

    async createDID() {
      try {

        this.isLoading = true
        console.log('Inside createDID methot................................')
        delete this.did.name
        if (this.did.options.publicKey == "") {
          delete this.did.options.publicKey
        }

        if (this.did.options.walletAddress == "") {
          delete this.did.options.walletAddress
        }

        if (this.did.methodSpecificId == "") {
          delete this.did.methodSpecificId
        }

        if (this.did.options.chainId == "") {
          delete this.did.options.chainId
        }

        this.did.options.keyType = this.selectedKeyTypes
        this.did.options.verificationRelationships = this.selectedVerificationRelationships
         

        // this.did.options.verificationRelationships = this.did.options.verificationRelationships.map(x => x.value)
        // console.log(JSON.stringify(this.did))
        console.log('Before calling createDIDsForAService')
        const json = await this.createDIDsForAService(this.did)
        console.log('After calling createDIDsForAService')

        this.notifySuccess('DID created successfully')
        
        if(this.shouldRegister == true){
          this.notifySuccess('Proceeding to register the DID...')
          const verificationMethodIds = json.metaData.didDocument.verificationMethod || [];
          const signInfos = verificationMethodIds.map((vm) => ({
            verification_method_id: vm.id,
          }));
          const payload = {
              didDocument: json.metaData.didDocument,
              signInfos
          }
          this.registerDIDsForAService(payload).then((registerAsyncResponse) => {
            if(registerAsyncResponse){
              this.updateADID({
                did: registerAsyncResponse.did,
                status: 'Please wait..',
              })
              this.checkRegistrationStatus(registerAsyncResponse.did)
            }
          })  
        }
        this.isLoading = false;
        this.openSlider();
      } catch (e) {
        console.error(e.message)
        this.isLoading = false
        this.notifyErr(e.message)
      }
    },

    async checkRegistrationStatus(id_to_check_status){
      try{
        const maxrtries = 6 // after 30 sec abort            
        const interval = 5
        let i = 0
        const statusCheckInterval = setInterval(async () => {
          //this.notifySuccess('Please wait, checking status of registration from blockchain...')
          i = i + 1;
          const response = await this.checkBlockchainStatusOfSSI(id_to_check_status)
          if(response && response.data && response.data.length > 0 && response.data[0]){
            if(response.data[0].status == 0){
              this.notifySuccess('DID successfully registerd on the blockchain, txHash: '+ response.data[0].txnHash)
              this.updateADID({
                did: id_to_check_status,
                status: 'Registered',
              })
              clearInterval(statusCheckInterval)
            } else {
              this.notifyError('Sorry we could not register your DID, txHash: '+ response.data[0].txnHash)
            }
          }
          if(i == maxrtries){
            this.notifyErr('All atempts failed to check the status on blockchain. Please check it manually')
            clearInterval(statusCheckInterval)
          }
        }, interval * 1000)
      }catch(e){
        console.error(e.message)
        this.notifyErr(e.message)
      }
    },

    copyToClip(textToCopy, contentType) {
      if (textToCopy) {
        navigator.clipboard
          .writeText(textToCopy)
          .then(() => {
            this.notifySuccess(`${contentType} copied!`);
          })
          .catch((err) => {
            this.notifyErr("Error while copying", err);
          });
      }
    },

    generateRandomMethodSepcificId() {
      this.did.methodSpecificId = self.crypto.randomUUID()
    }
   },
  mixins: [UtilsMixin],

};
</script>
