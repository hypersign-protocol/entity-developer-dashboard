<template>
<org-content/>
</template>
<style scoped>
.container {
    padding: 20px;
    text-align: left;
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
</style>

<script>
import HfPopUp from "../../components/element/hfPopup.vue";
import StudioSideBar from "../../components/element/StudioSideBar.vue";
import UtilsMixin from '../../mixins/utils';
import 'vue-loading-overlay/dist/vue-loading.css';
import Loading from "vue-loading-overlay";
import OrgContent from './OrgSidebar.vue';
import { mapActions, mapState, mapMutations } from "vuex";
export default {
  computed: {
    ...mapState({
      orgList: state =>state.playgroundStore.orgList  
    })
  },
  data() {
    return {
      edit: false,
      orgStore: {
        name: "Hypermine Pvt Ltd",
        domain: "hypermine.in",
        logo: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.5EZ51foyo3QBV2FHnKq1cwHaEc%26pid%3DApi&f=1",
        region: "US EAST",
        network: "Jagrat",
        orgDid: "",
        userDid: "",
        status: "",
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
  components: { HfPopUp, Loading, StudioSideBar, OrgContent },
  created() {
    this.updateSideNavStatus(true)
  },
  methods: {
    ...mapMutations('playgroundStore', ['updateSideNavStatus', 'selectAnOrg', 'insertAnOrg','updateAnOrg']),
    ssePopulateOrg(id, store) {
      const sse = new EventSource(`${this.$config.studioServer.ORG_SSE}${id}`);
      sse.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log(data);
        if (data.status === "Registered" || data.status === "Failed") {

          sse.close();
          store.commit("insertAnOrg", data)
        }
        // store.commit("updateCredStatus", data);
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
    switchOrg(orgDid) {
      this.selectAnOrg(orgDid)
      this.$store.dispatch('fetchAllOrgDataOnOrgSelect')
    },
    openSlider() {
      this.$root.$emit("bv::toggle::collapse", "sidebar-right");
    },
    editOrg(orgDid) {
      this.edit = true
      Object.assign(this.orgStore, { ...this.$store.getters.findOrgByOrgID(orgDid) })
      this.openSlider();
    },
    createAnOrg() {

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

          const { org } = j
          if (!this.edit) {
            let QR_DATA = j.QrData
            let URL = `${this.$config.webWalletAddress}/deeplink?url=${JSON.stringify(QR_DATA)}`

            this.openWallet(URL)
          }
          if (j.status === 200) {

            this.insertAnOrg(j.org);
            this.selectAnOrg(j.org._id)
            this.isProcessFinished = true;
            this.openSlider();

            this.notifySuccess("Org Created successfull");
            if (this.edit) {
              this.updateAnOrg(j.org)
              this.notifySuccess("Org Edited successfull");
            }

          }
          if (!this.edit) {
            console.log(org)
            this.ssePopulateOrg(org._id, this.$store)

          }


        }).catch((e) => {
          console.log(e);
          this.notifyError("Something went wrong");
        }).finally(() => {
          this.isLoading = false;
        })

      // TODO: Implement API to create an organization

      // TODO: Make a POST request to ORG API
      // Once the ORG is created just store the org in store
      //this.$store.commit('insertAnOrg', payload);
      // Close the sideba
    }
  },
  mixins: [UtilsMixin]
}
</script>