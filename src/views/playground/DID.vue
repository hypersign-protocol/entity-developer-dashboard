<style scoped>
.sticky-header {
  position: sticky;
  top: 0;
}

.container {
  max-width: 1240px;
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


    <div class="row">
      <div class="col-md-12" style="text-align: left">
        <!-- <Info :message="description" /> -->
        <div class="form-group" style="display:flex">
          <h3 v-if="didList.length > 0" class="mt-4" style="text-align: left;">
            Decentralised Identifier</h3>
          <h3 v-else class="mt-4" style="text-align: left;">Create your first decentralised identifier!</h3>
          <hf-buttons name="+ Create" style="text-align: right;" class="ml-auto mt-4"
            @executeAction="openSlider()"></hf-buttons>
        </div>
        <StudioSideBar title="Create DID">
          <div class="container">
            <div class="form-group">
              <tool-tip infoMessage="Name of the schema"></tool-tip>
              <label for="schemaName"><strong>Name<span style="color: red">*</span>:</strong></label>
              <input type="text" class="form-control" id="schemaName" v-model="did.name"
                aria-describedby="schemaNameHelp" placeholder="Enter a name for this did">
            </div>

            <div class="form-group">
              <tool-tip infoMessage="Name of the schema"></tool-tip>
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

            <div class="form-group">
              <tool-tip infoMessage="Name of the schema"></tool-tip>
              <label for="schemaName"><strong>Key Type<span style="color: red">*</span>:</strong></label>
              <hf-select-drop-down :options="keyTypeOptions"
                @selected="e => (did.options.keyType = e)"></hf-select-drop-down>
            </div>


            <div class="form-group">
              <tool-tip infoMessage="Name of the schema"></tool-tip>
              <label for="schemaName"><strong>Verification Relationships<span
                    style="color: red">*</span>:</strong></label>
              <multiselect v-model="did.options.verificationRelationships"
                placeholder="Select on or more verification relationship" label="text" track-by="value"
                :options="verificationRelationshipsOptions" :multiple="true" :taggable="false" :close-on-select="false"
                :clear-on-select="false" @input="onInputTag">
              </multiselect>
            </div>


            <div class="form-group row">
              <div class="col-md-12">
                <hr />
                <hf-buttons name="Save" @executeAction="createDID()"></hf-buttons>
                <!-- <button @click="createDID" class="btn btn-primary">Save1</button> -->
              </div>
            </div>
          </div>
        </StudioSideBar>
      </div>
    </div>


    <!-- <hf-pop-up
    :Header="viewDID"
    >
      <div v-if="viewDidDocument">
        {{  viewDidDocument }}
      </div>
    </hf-pop-up> -->
    <div class="row scrollit" style="margin-top: 2%;" v-if="didList.length > 0">
      <div class="col-md-12">
        <table class="table table-hover event-card" style="background:#FFFF">
          <thead class="thead-light">
            <tr>
              <!-- <th class="sticky-header">Name</th> -->
              <th class="sticky-header">DID Id</th>
              <th class="sticky-header">Linked Keys</th>
              <th class="sticky-header">Status</th>
              <th class="sticky-header">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in didList" :key="row">
              <!-- <td>Comdex Issuer Id</td> -->
              <td>{{ row.did }}</td>
              <td>
                <div>
                  <span style="float:left" class="badge badge-info"
                    v-for="eachKey in row.didDocument.verificationMethod">
                    {{ eachKey.type }}
                  </span>
                </div>

              </td>
              <td v-if="row.status == 'Registered'">
                <span class="badge badge-pill badge-success"><i class="fa fa-check" aria-hidden="true"></i>
                  Registered</span>
              </td>
              <td v-else>
                <span class="badge badge-pill badge-warning"><i class="fa fa-cog" aria-hidden="true"></i>
                  Created</span>
              </td>
              <td>
                <span @click=""><i class="fa fa-eye" aria-hidden="true"></i></span>


                <!-- <button v-if="!(row.status == 'Registered')" class="badge badge-info"
                  @click="registerDidDoc(row.didDocument, row.didDocument.verificationMethod[0].id)"
                  style="margin-left: 5px; cursor: grab;">
                  <span><i class="fa fa-check" aria-hidden="true"></i></span>
                </button> -->

              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import fetch from "node-fetch";
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
import { did } from "lds-sdk";
export default {
  name: "DIDs",
  components: { HfPopUp, Loading, StudioSideBar, HfButtons, HfSelectDropDown, ToolTip, Datepicker, VueQr },
  computed: {
    ...mapGetters('mainStore', ['sessionList']),
    ...mapState({
      didList: state => state.mainStore.didList,
      containerShift: state => state.playgroundStore.containerShift,
    }),
    isContainerShift() {
      return this.containerShift
    }
  },
  data() {
    return {
      authToken: localStorage.getItem('authToken'),
      user: {},
      fullPage: true,
      isLoading: false,
      viewDidDocument: "",
      namespaceOptions: [
        { text: "Select Namespace", value: null },
        { text: "testnet", value: "testnet", selected: true },
      ],
      keyTypeOptions: [
        { text: "Select KeyType", value: null },
        { text: "Ed25519VerificationKey2020", value: "Ed25519VerificationKey2020", selected: true },
        { text: "EcdsaSecp256k1RecoveryMethod2020", value: "EcdsaSecp256k1RecoveryMethod2020" },
      ],
      verificationRelationshipsOptions: [
        { text: "Select Verification Relationship", value: null },
        { text: "assertionMethod", value: "assertionMethod" },
        { text: "authentication", value: "authentication" },
      ],
      did: {
        name: "",
        namespace: "testnet",
        methodSpecificId: "",
        options: {
          keyType: "",
          chainId: "",
          publicKey: "",
          walletAddress: "",
          verificationRelationships: [
            { text: "assertionMethod", value: "assertionMethod" },
            { text: "authentication", value: "authentication" },
          ]
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
      console.error(e)
      this.isLoading = false

    }
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.prevRoute = from;
    });
  },
  methods: {
    ...mapActions('mainStore', ['fetchDIDsForAService', 'createDIDsForAService', 'registerDIDsForAService']),
    ...mapMutations('playgroundStore', ['updateSideNavStatus', 'shiftContainer']),

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
      this.$root.$emit("bv::toggle::collapse", "sidebar-right");
    },
    clearAll() {
      this.visible = false
      this.did = {
        name: "",
        namespace: "testnet",
        methodSpecificId: "",
        options: {
          keyType: "",
          chainId: "",
          publicKey: "",
          walletAddress: "",
          verificationRelationships: [
            { text: "assertionMethod", value: "assertionMethod" },
            { text: "authentication", value: "authentication" },
          ]
        }
      },
        // EventBus.$emit("resetOption", this.selected.attributeTypes)
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


        this.did.options.verificationRelationships = this.did.options.verificationRelationships.map(x => x.value)
        // console.log(JSON.stringify(this.did))
        console.log('Before calling createDIDsForAService')

        await this.createDIDsForAService(this.did)
        console.log('After calling createDIDsForAService')
        this.isLoading = false;
        this.openSlider();
      } catch (e) {
        console.error(e.message)
        this.isLoading = false
      }
    },

    generateRandomMethodSepcificId() {
      this.did.methodSpecificId = self.crypto.randomUUID()
    }
  },
  mixins: [UtilsMixin],

};
</script>
