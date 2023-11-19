<template>
  <div>
    <div style="display:flex">
      <h3 v-if="orgList.length > 0" class="mt-4" style="text-align: left;">
        <i class="fa fa-university mr-2"></i>Organizations
      </h3>
      <h4 v-else class="mt-4" style="text-align: left;">Create your first organization!</h4>

      <hf-buttons name="+ Create" style="text-align: right;" class="ml-auto mt-4" @executeAction="openSlider()">
      </hf-buttons>
    </div>
    <StudioSideBar :title="edit ? 'Edit Organization' : 'Add Organization'">
      <div class="container">

        <div class="form-group" v-if="edit === true">
          <tool-tip infoMessage="Your Organization DID"></tool-tip>
          <label for="orgDid"><strong>Org DID<span style="color: red">*</span>: </strong></label>
          <input type="text" class="form-control" id="orgDid" v-model="orgStore.orgDid" aria-describedby="orgNameHelp"
            disabled>
          <small id="orgNameHelp" class="form-text text-muted">
            <a :href="`${$config.explorer.BASE_URL}identity/${orgStore.orgDid}`"
              target="_blank">Resolve DID</a>
          </small>
        </div>

        <div class="form-group">
          <tool-tip infoMessage="Your Organization Name"></tool-tip>
          <label for="orgName"><strong>Name<span style="color: red">*</span>:</strong></label>
          <input type="text" class="form-control" id="orgName" v-model="orgStore.name" aria-describedby="orgNameHelp"
            placeholder="Enter your org name">
          <!-- <small id="orgNameHelp" class="form-text text-muted">Some help text</small> -->
        </div>
        <div class="form-group">
          <tool-tip infoMessage="Your Organization Domain Name"></tool-tip>
          <label for="domain"><strong>Domain<span style="color: red">*</span>:</strong></label>
          <input type="text" class="form-control" id="domain" v-model="orgStore.domain" aria-describedby="domainHelp"
            placeholder="Enter your domain name">
        </div>
     
        <div class="form-group">
          
          
          <div>
            <tool-tip infoMessage="Organistaion Controller"></tool-tip>
            <label for="controller"><strong>Controllers<span style="color: red">*</span>:</strong></label>
          </div>
          
          <div class="selected-media-wrapper d-flex p-2 mb-4" style="overflow-y: auto" v-if="orgStore.controller.length > 0">
            <div v-for="ctl in orgStore.controller" v-bind:key="ctl">
              <div :class="
                flash == ctl
                ? 'flash card rounded m-1 p-1 d-flex flex-row align-items-center'
                : 'card rounded m-1 p-1 d-flex flex-row align-items-center pointer'"
                style="min-width:90px; background-color: lightyellow; box-shadow: #80808042 1px 1px 1px 1px; color: grey" :title="ctl">
                <div>
                  {{ truncate(ctl,25)  }}
                </div>
                <!-- <div style="padding: 5px; color: lightcoral;cursor: pointer;" @click="deleteController(ctl)" title="Remove this controller">
                  <i style="" class="fa fa-trash"></i>
                </div> -->
              </div>
            </div>
          </div>


          
<!-- 
          <div v-if="isAdd">
            <div class="input-group mb-3">
              <input type="text" class="form-control" id="controllers" v-model="controllerValue" aria-describedby="controllerHelp" placeholder="did:hid:...8HPRgfJAnph">
              <div class="input-group-append">
                <hf-buttons @executeAction="addController()" iconClass="fa fa-plus"></hf-buttons> 
              </div>
            </div>
          </div> -->
          <!-- <div v-else>
            <hf-buttons  @executeAction="deleteController()" iconClass="fa fa-trash" customClass="btn btn-danger"> </hf-buttons>
            <hf-buttons name="Cancel" @executeAction="cancelController()" customClass="btn btn-link"> </hf-buttons>
          </div> -->



        </div>
        <!-- <hr /> -->
        <div class="form-group" v-if="edit">
          <hf-buttons name="Update" class="btn btn-primary" @executeAction="createAnOrg()"></hf-buttons>
        </div>
        <div class="form-group" v-else>
          <hf-buttons name="Save" @executeAction="createAnOrg()"></hf-buttons>
        </div>
      </div>
    </StudioSideBar>
    <div class="row scroll" v-if="orgList.length > 0">
      <div class="col-lg-4" v-for="eachOrg in orgList" :key="eachOrg._id">

        <b-card :title="truncate(eachOrg.name,20)" tag="article" style="max-width: 30rem; margin-top: 10px; height:13rem"
          class="mb-2 eventCard" img-top>
          <ul style="list-style-type: none;padding-left: 0px;min-height: 80px;">            
            <img style="float:right;" :src="`${getProfileIcon(eachOrg.name)}`" class="mr-2" alt="center" width="70px"/>            
            <li class="" v-if="eachOrg.status ==='Registered'" style="">
              <i class="fa fa-user mr-2"></i>
              <span class=""><a target="_blank" :href="`${$config.explorer.BASE_URL}identity/${eachOrg.orgDid}`">{{ truncate(eachOrg.orgDid,25) }}</a></span>
              <span v-if="eachOrg.status === 'Registered'" @click="copyToClip(eachOrg.orgDid,'Org DID')"
              ><i class="far fa-copy"></i></span>
            </li>
            <div v-if="eachOrg.status ==='Registered'">
            <li class="">
              <span><i class="fa fa-id-card mr-2"></i>Credentials : <span class="badge badge-secondary badge-pill">{{eachOrg.credentialsCount}}</span></span>
            </li>
            <li class="">
              <span><i class="fa fa-table mr-2"></i>Schemas   : <span class="badge badge-secondary badge-pill">{{eachOrg.schemasCount}}</span></span>
            </li>
            <li class="">
              <span><i class="fa fa-desktop mr-2"></i>Templates : <span class="badge badge-secondary badge-pill">{{eachOrg.templatesCount}}</span></span>
            </li>
            </div>
          </ul>
          <footer>
            <div class="form-group row" style="margin-bottom: 0rem;">
              <div class="col-sm-10">
              <ul style="list-style-type: none;padding-left: 0px;">
              <li v-if="eachOrg.status === 'Failed'">
              <span class="card-title" >
                <img :src="images.redcross" height="25" width="25" /> Failed
              </span>
            </li>
            <li v-else-if="eachOrg.status === 'Registered'">
              <span class="card-title" >
                <img :src="images.greentick" height="21" width="21"/> Registered
              </span>
            </li>
            <li v-else>
              <span class="card-title" >
                <img :src="images.loader"  height="25" width="25"/> Processing ..... 
              </span>
            </li>
            </ul>
            </div>
                <div class="pl-2" v-if="eachOrg.status === 'Registered'">            
                <i class="fas fa-pencil-alt"
                @click="editOrg(eachOrg._id)" title="Click to edit this event" style="cursor: pointer"
                ></i>
                <span class="ml-3"></span>
                <i class="fas fa-sync" aria-hidden="true" @click="switchOrg(eachOrg._id)" title="Click to switch to org"
                  style="cursor: pointer"></i>
              </div>
            </div>
          </footer>
        </b-card>
      </div>
    </div>
  </div>
</template>
<style scoped>
.far {
  cursor: pointer;
  color: grey;
  display: inline;
  padding-left: 5px;
}

.container {
  padding: 20px;
  text-align: left;
}

.flash {
  cursor: pointer;
  background-color: #1faa596b;
  border: 0;
  box-shadow: 2px 0 10px rgb(0 0 0 / 10%);
  animation: flash 0.4s cubic-bezier(1, 0, 0, 1);
}

.eventCard {
  border-left: 10px solid var(--ds-background-accent-red-subtler, #905ab029);
}

.eventCard:hover {
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 10px;
  cursor: pointer;
}

.card {}

.card-body {
  -ms-flex: 1 1 auto;
  -webkit-box-flex: 1;
  flex: 1 1 auto;
  min-height: 1px;
  padding: 1.25rem;

}

.scroll {
  padding-top: 1em;
  overflow: auto;
  height: 490px;
}
</style>

<script>
import HfPopUp from "../../components/element/hfPopup.vue";
import StudioSideBar from "../../components/element/StudioSideBar.vue";
import UtilsMixin from '../../mixins/utils';
import { isEmpty, isValidURL } from '../../mixins/fieldValidation'
import 'vue-loading-overlay/dist/vue-loading.css';
import validator from 'validator';
import Loading from "vue-loading-overlay";
import HfButtons from '../../components/element/HfButtons.vue'
import ToolTip from '../../components/element/ToolTip.vue'
import messages from '../../mixins/messages';
import  { mapGetters, mapState, mapActions, mapMutations } from 'vuex'
export default {
  computed: {
    ...mapState({
      userProfile: state => state.playgroundStore.userProfile,
      orgList: state => state.playgroundStore.orgList,
    }),
    ...mapGetters("playgroundStore", ["findOrgByOrgID"])
  },
  data() {
    return {
      edit: false,
      flash: null,
      isAdd: true,
      controllerValue: "",
      orgStore: {
        name: "",
        domain: "https://entity.hypersign.id",
        // logo: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.5EZ51foyo3QBV2FHnKq1cwHaEc%26pid%3DApi&f=1",
        // region: "US EAST",
        network: "Jagrat",
        orgDid: "",
        userDid: "",
        status: "",
        controller: [],
      },
      authToken: localStorage.getItem("authToken"),
      isLoading: true,
      isProcessFinished: true,
      images: {
        greentick: require("../../assets/green-tick.png"),
        redcross: require("../../assets/red-cross.png"),
        loader: require("../../assets/small-loader.gif"),
      }
    }
  },
  components: { HfPopUp, Loading, StudioSideBar, HfButtons, ToolTip },
  methods: {
    ...mapActions('playgroundStore', ['fetchAllOrgDataOnOrgSelect']),
    ...mapMutations('playgroundStore', ['shiftContainer', 'updateSideNavStatus', 'increaseOrgCount', 'selectAnOrg', 'insertAnOrg','updateAnOrg']),
    selectController(id) {
      this.isAdd=false
      this.flash = id
    },
    deleteController(id){
      this.orgStore.controller.splice(id, 1)
      this.flash = null
      this.isAdd=true
    }
    ,
    cancelController(){
      this.flash = null
      this.isAdd=true
    
    },
    addController() {

      try{
        if(!this.controllerValue){
          throw new Error("Please enter contoller id")
        }

        if(!this.controllerValue.startsWith("did:hid")){
          throw new Error("DID method not supported")
        }

        if(this.orgStore.controller.indexOf(this.controllerValue) >= 0){
          throw new Error("The controller has already been added")
        }

        this.isAdd = true
        this.orgStore.controller.push(this.controllerValue)
        
      }catch(e){
        this.notifyErr(e.message)
      } finally {
        this.controllerValue = ""
      }
    },
    getProfileIcon(name) {
      return "https://avatars.dicebear.com/api/identicon/" + name + ".svg"
    },
    ssePopulateOrg(id, store) {
      const sse = new EventSource(`${this.$config.studioServer.ORG_SSE}${id}`);
      sse.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.status === "Registered" || data.status === "Failed") {
          sse.close();
          this.updateAnOrg(data)
          this.increaseOrgCount();
        }
      };

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
        this.isProcessFinished = false;


      }
    },
    copyToClip(textToCopy, contentType) {
      if (textToCopy) {
        navigator.clipboard
          .writeText(textToCopy)
          .then(() => {
            this.notifySuccess(
              `${contentType} copied!`
            );
          })
          .catch((err) => {
            this.notifyErr(
              'Error while copying',
              err
            );
          });
      }
    },
    async switchOrg(orgDid) {
      localStorage.setItem('selectedOrg', orgDid)
      this.updateSideNavStatus(true)

      this.selectAnOrg(orgDid)
      this.$router.push({ name: 'playgroundCredential' })
    
      await this.fetchAllOrgDataOnOrgSelect();

      this.shiftContainer(false)
    },
    openSlider() {
      this.edit = false
      this.clearAll();
      this.orgStore.controller = [this.userProfile.details.did]
      this.$root.$emit("bv::toggle::collapse", "sidebar-right");
    },
    editOrg(orgDid) {
      this.edit = true
      this.$root.$emit("bv::toggle::collapse", "sidebar-right");
      this.controllerValue = "";
      Object.assign(this.orgStore, { ...this.findOrgByOrgID(orgDid) })
    },
    createAnOrg() {
      if (isEmpty(this.orgStore.name)) {
        return this.notifyErr(messages.ORGANIZATION.ORGANIZATION_NAME_EMPTY)
      } else if (isValidURL(this.orgStore.name)) {
        return this.notifyErr(messages.ORGANIZATION.INVALID_ORG_NAME)
      } else if (isEmpty(this.orgStore.domain)) {
        return this.notifyErr(messages.ORGANIZATION.DOMAIN_NAME_EMPTY)
      } else if (!this.orgStore.domain.includes('http://localhost') && !validator.isURL(this.orgStore.domain)) {
        return this.notifyErr(messages.ORGANIZATION.INVALID_DOMAIN_NAME)
      }
      try {
        this.orgStore.controller = this.orgStore.controller.split(',')
      } catch (e) {
        this.orgStore.controller = this.orgStore.controller
      }
      let url
      let method
      if (this.edit) {
        method = "PUT"
        url = `${this.$config.studioServer.BASE_URL}api/v1/org`

      } else {
        url = `${this.$config.studioServer.BASE_URL}api/v1/org`
        method = "POST"

      }

      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.authToken}`
      }
      this.orgStore.userDid = JSON.parse(localStorage.getItem("user")).id

      const body = { orgData: this.orgStore }

      this.isLoading = true;
      fetch(url, {
        method,
        body: JSON.stringify(body),
        headers,
      }).then((res) => res.json())
        .then((j) => {

          const { org } = j.data

          let QR_DATA = j.data.QrData
          let URL = `${this.$config.webWalletAddress}/deeplink?url=${JSON.stringify(QR_DATA)}`

          if(this.edit===true){
            this.notifySuccess("Org Edited successfull");
            return this.$root.$emit("bv::toggle::collapse", "sidebar-right");
            
          }
          this.openWallet(URL)
          if (j.error === false) {
            if (!this.edit) {
              this.insertAnOrg(j.data.org)
              this.selectAnOrg(j.data.org._id)
              this.isProcessFinished = true;
              this.openSlider();

              this.notifySuccess("Org Created successfull");
              this.ssePopulateOrg(org._id, this.$store)
            }

            if (this.edit === true) {
              this.updateAnOrg(j.data.org)
              this.notifySuccess("Org Edited successfull");
              this.$root.$emit("bv::toggle::collapse", "sidebar-right");
            }

            
          }


        }).catch((e) => {
          console.log(e);
          this.notifyError("Something went wrong");
        }).finally(() => {
          this.isLoading = false;
        })
    },
    clearAll() {
      this.controllerValue = ""
      this.orgStore = {
      flash: null,
      isAdd: true,

        name: "",
        domain: "https://entity.hypersign.id",
        // logo: "",
        // region: "",
        network: "",
        orgDid: "",
        userDid: "",
        status: "",
        controller: [],
      }
    },
  },
  mixins: [UtilsMixin]
}
</script>