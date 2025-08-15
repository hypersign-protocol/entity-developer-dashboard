<style scoped>
.logo {
  /* width: 144px; */
  padding-top: 1.5%;
  padding-left: 25px;
}

.selectedButton {
  border-bottom: 1px solid #8080809e;
  font-weight: bold;
}

.row .nav-style {
  position: absolute;
  z-index: 0;
}

.rightAlign {
  text-align: end;
}

.card-radius {
  border-radius: 10px;
}

.logo-style {
  width: 144px;
  /* height: 40px; */
  margin-top: 9px;
  margin-left: 5px;
}

#app {
  padding: 0;
  margin: 0;
  width: 100%;
  min-height: 100vh;
  /* background: #f6f6f687; */
}

.subtitle {
  padding-left: 10px;
  color: gray;
  /* font-size: larger; */
  margin-top: auto;
}

.container-collapsed {
  margin-left: 15em;

}

.container {
  max-width: 1300px
}

.far {
  cursor: pointer;
  color: grey;
  display: inline;
  padding-left: 5px;
}

.hov {
  padding: 0 1.5em 0 1.5em;
}

.hov:hover {
  background-color: #dee2e6;
  cursor: pointer;
}

.f-36 {
  font-size: 36px;
}
</style>
<template>
  <div id="app" data-app>
    <load-ing :active.sync="isLoading" :can-cancel="true" :is-full-page="true"></load-ing>

    <b-navbar toggleable="lg" type="dark" variant="white" class="navStyle" v-if="getIsLoggedOut" sticky>
      <b-navbar-brand href="#">
        <a href="#" @click="route('dashboard')">
          <img src="./assets/Entity_full.png" alt="" style="height: 3vh; opacity: 80%;" />
        </a>
      </b-navbar-brand>
      <b-collapse id="nav-collapse" is-nav v-if="userDetails">
        <b-navbar-nav class="ml-auto">

          <b-nav-item v-if="user.accessAccount?.email && user.accessAccount.userId !== user.userId" class="center">
            <a href="#">
              Accessing Account Of: <b-badge variant="dark"> {{ loggedInUserEmailId }}</b-badge>
            <b-icon icon="box-arrow-in-right" class="ml-2" @click="switchBackToAdminAccount"></b-icon>
            </a>
          </b-nav-item>

          <b-nav-item v-if="userDetails.isTwoFactorEnabled == false">
            
            <router-link to="/studio/mfa">
              <v-chip
              outlined
                class="ma-2"
                style="cursor: grab; font-size: 10px; height: 26px;"
              >
              <span class="spinner-grow spinner-grow-sm"></span>
              <span class="mx-1">Setup MFA</span>
            </v-chip>
              
            </router-link>
            
          
          </b-nav-item>

          <b-nav-item :href="$config.studioServer.BASE_URL" target="_blank" title="Developer Dashboard API">
            <i class="fa fa-code" style=" color: #707070;height: 18px; font-size: 18px; width: 18px;"></i></b-nav-item>
          <b-nav-item href="https://docs.hypersign.id/entity-studio/developer-dashboard" target="_blank"
            title="Documentation">
            <i class="fas fa-book-open nav-icon" style="height: 18px; font-size: 18px; width: 18px;"></i>
          </b-nav-item>

          <b-nav-item-dropdown right v-if="getIsLoggedOut" title="Profile" menu-class="dropDownPopup">
           <template #button-content>
             <img
              v-if="userDetails?.profileIcon"
              :src="userDetails?.profileIcon"
              style="width: 18px; height: 18px; border-radius: 50%;"
            />
            <i v-else class="fas fa-user-circle nav-icon" style="height: 18px; font-size: 18px; width: 18px;"></i> 
            </template>
            <b-dropdown-group style="text-align: left;">
              <b-dropdown-item-button style="text-align: center; font-size: 0.9rem;">
                <span>
                 <span style="font-size: 0.8rem;">Welcome, </span>
                   <strong style="font-size: 0.9rem;">{{ userDetails.name || 'User' }}</strong>
                 </span>
              </b-dropdown-item-button>
              <b-dropdown-item-button style="text-align: left" :title="userDetails.email"
                @click="copyToClip(userDetails.email, 'Email')">
                {{ shorten(userDetails.email) }}
              </b-dropdown-item-button>

              <b-dropdown-item-button style="text-align: left" @click="goTo('/studio/settings')" title="Teams">
                <i class="fa fa-cog nav-icon" style="cursor: pointer; font-size: 1.3rem"></i>
                Settings
              </b-dropdown-item-button>

              <b-dropdown-item-button style="text-align: left" @click="goTo('/studio/dashboard')" title="Teams">
                <i class="fa fa-home nav-icon" style="cursor: pointer; font-size: 1.3rem"></i>
                Home
              </b-dropdown-item-button>
              <b-dropdown-divider></b-dropdown-divider>

              <b-dropdown-item-button style="text-align: left" @click="logoutAll()" title="Logout">
                <i class="fas fa-sign-out-alt nav-icon" style="cursor: pointer; font-size: 1.3rem"></i>
                Logout
              </b-dropdown-item-button>
            </b-dropdown-group>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <div :class="[
      isSidebarCollapsed ? 'container-collapsed-not' : 'container-collapsed',
    ]">
      <router-view class="container containerData" />
    </div>
    <notifications group="foo" />

    <sidebar-menu :relative="false" class="sidebar-wrapper" v-if="userDetails && showSideNavbar && getSelectedService" @toggle-collapse="onToggleCollapse"
      :collapsed="isSidebarCollapsed" :theme="'white-theme'" width="220px" :menu="getSideMenu()">
      <div slot="header" style="border-bottom: 1px solid rgba(0,0,0,.12);">
        <v-list>
      <v-list-item>
        <v-list-item-avatar>
          <v-img :src="getSelectedService.logoUrl ||
                getProfileIcon(formattedAppName(getSelectedService.appName))
                "></v-img>
        </v-list-item-avatar>
        <v-list-item-content class="mx-1">
          <v-list-item-title class="text-h7">
            {{ getSelectedService ? getSelectedService.appName : "" }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      
    </v-list>
    

      </div>
    </sidebar-menu>

    <!-- <sidebar-menu-nav v-if="showSideNavbar && getSelectedService" 
      :collapsed="isSidebarCollapsed" 
      :menus="getSideMenu()"
      :avatar="getSelectedService.logoUrl || getProfileIcon(formattedAppName(getSelectedService.appName))"
      :service_name="getSelectedService ? getSelectedService.appName : ''"
      >
    </sidebar-menu-nav> -->
  </div>
</template>

<style>
.v-sidebar-menu .vsm--link_level-1 .vsm--icon {
  font-size: 16px;
  width: 40px !important;
}

.dropdown-menu.show {
  text-align: center;
  box-shadow: 2px 0 10px rgb(0 0 0 / 47%);
}

.navbar {
  padding: 0px !important;
}

.navStyle {
  background: #ffffff;
  margin-bottom: 1%;
  padding: 5px !important;
  padding-left: 1.5%;
  text-align: left;
  box-shadow: 0 2px 6px 0 rgba(32, 33, 37, .1);
}

.orgNameCss {
  overflow-wrap: break-word;
  color: grey;
  font-weight: bold;
  font-size: smaller;
  padding: 5px
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.centeralign {
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.leftAlign {
  text-align: left;
}

.rightAlign {
  text-align: right;
}

.marginLeft {
  margin-left: 13%;
}

.marginRight {
  margin-right: 12%;
}

#view.collapsed {
  padding-left: 50px;
}

#view {
  padding-left: 350px;
}

.sidebar-wrapper {
  min-width: 70px;
  margin-top: 5.8vh;
  /* box-shadow: 0 0 15px 0 rgba(34, 41, 47, 0.05); */
  box-shadow: 0 2px 6px 0 rgba(32, 33, 37, .1);
  border-right: 1px solid rgba(128, 128, 128, 0.21);
}

.v-sidebar-menu.vsm_white-theme .vsm--mobile-bg {
  background: grey;
}

.vsm--mobile-bg {
  background: whitesmoke !important;
}
.v-sidebar-menu.vsm_white-theme {
  background-color: white !important;
  color: rgba(0,0,0,.87) !important;
}

.v-sidebar-menu.vsm_white-theme .vsm--header {
  color: rgba(0,0,0,.87) !important;
}

.v-sidebar-menu.vsm_white-theme .vsm--link {
  color: rgba(0,0,0,.87) !important;
}

.v-sidebar-menu.vsm_white-theme .vsm--link_level-1 .vsm--link:hover {
  color: rgba(0,0,0,.87) !important;
  background: whitesmoke !important;
}

.v-sidebar-menu.vsm_white-theme .vsm--link_level-1 .vsm--icon {
  background-color: transparent !important;
  color: #66666a !important;
}
</style>

<script>
import UtilsMixin from "./mixins/utils";
import EventBus from "./eventbus";
import { mapActions, mapMutations, mapGetters, mapState } from "vuex";
import { RequestHandler } from './utils/utils'
import config from './config'
export default {
  computed: {
    ...mapGetters("playgroundStore", ["userDetails", "getSelectedOrg"]),
    ...mapGetters("mainStore", ["getSelectedService", "getAllServices", 'getIsLoggedOut']),
    ...mapState({
      showMainSideNavBar: (state) => state.mainStore.showMainSideNavBar,
      selectedDashboard: (state) => state.globalStore.selectedDashboard,
      appList: (state) => state.mainStore.appList,
    }),

    // authToken() {
    //   return localStorage.getItem("authToken")
    // },
    selectedOrg() {
      return this.getSelectedOrg;
    },
    showSideNavbar() {
      return (
        this.$store.state.playgroundStore.showSideNavbar &&
        this.showMainSideNavBar
      );
    },
  },
  data() {
    return {
      isLoading: false,
      collapsed: true,
      isSidebarCollapsed: true,
      schema_page: 1,
      authRoutes: ["register", "PKIIdLogin"],
      user: {},
      loggedInUserEmailId:"",
      parseAuthToken: null,
      authToken:null
    };
  },

 mounted() {
  const userDetails = localStorage.getItem("user");
  if (userDetails) {
    try {
       const parsed = JSON.parse(userDetails);
      Object.assign(this.userDetails, parsed);
      this.user = this.userDetails;
      this.loggedInUserEmailId = this.user?.accessAccount?.email;
      this.setIsLoggedOut(true);
    } catch (e) {
      console.error("Invalid user JSON:", e);
      this.userDetails = {};
    }
  }

  this.$root.$on("clearAppData", () => {
    this.userDetails = {};
    this.setIsLoggedOut(false);
  });

  this.$root.$on("closeSideNav", () => {
    this.isSidebarCollapsed = true;
  });

  if (localStorage.getItem("selectedOrg")) {
    const selectedOrgId = localStorage.getItem("selectedOrg");
    this.selectAnOrg(selectedOrgId);
    this.getList(selectedOrgId);
    this.getCredList(selectedOrgId);
    this.fetchTemplates(selectedOrgId);
  }
  this.$root.$on("initializeStore", () => {
    console.log("Inside initializeStore ... event");
    this.initializeStore();
  });

  EventBus.$on("logoutAll", () => {
    this.logoutAll();
  });
},
  methods: {
    ...mapActions("mainStore", ["fetchAppsListFromServer", "fetchServicesList",'switchToAdmin']),
    ...mapMutations("mainStore", ["resetMainStore", "setIsLoggedOut"]),
    ...mapActions("playgroundStore", [
      "insertAschema",
      "insertAcredential",
      "fetchAllOrgsAction",
    ]),
    ...mapMutations("playgroundStore", [
      "insertAnOrg",
      "insertApresentationTemplate",
      "selectAnOrg",
      "shiftContainer",
      "resetStore",
    ]),
    route(name) {
      if (this.$route.path !== name) {
        this.$router.push({ name })
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
    getProfileIcon(name) {
      return "https://api.dicebear.com/7.x/identicon/svg?seed=" + name;
    },
    logoutAll() {
      // this.showIcon = false;
      this.setIsLoggedOut(false)
      if (this.$route.path !== '/login') this.$router.push('/login')
      this.logout();
    },

    goTo(path) {
      if (this.$route.path !== path) this.$router.push(path)
    },

    onToggleCollapse(collapsed) {
      if (collapsed) {
        this.isSidebarCollapsed = true;
        this.shiftContainer(false);
      } else {
        this.isSidebarCollapsed = false;
        this.shiftContainer(true);
      }
    },
    getParseAuthToken() {
      const authTokne = localStorage.getItem('authToken');
      if (!authTokne) {
        this.parseAuthToken = null
        return
      }
      const base64Url = authTokne.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      const parsedjsonPayload = JSON.parse(jsonPayload);
      const { exp } = parsedjsonPayload
      if(!this.checkIfDateExpired(exp)){
        this.parseAuthToken = parsedjsonPayload
      } else {
        this.parseAuthToken = null
      }
    },
    checkIfDateExpired(datetimestamp){
      const currentTime = Math.floor(Date.now() / 1000);
      if (datetimestamp < currentTime) {
        return true
      } else {
        return false
      }
    },
    async initializeStore() {
      try {
            const userDetails = localStorage.getItem("user");
        if (userDetails) {
            const parsed = JSON.parse(userDetails);
            Object.assign(this.userDetails, parsed);
            this.parseAuthToken= this.userDetails
           this.setIsLoggedOut(true)
           const redirectPath=localStorage.getItem("postLoginRedirect")||'/studio/dashboard'
           localStorage.removeItem("postLoginRedirect");
           this.$router.push(redirectPath).then(() => {
          setTimeout(() => {
            this.$router.go(0);
          }, 500);
        });
        } else {
          throw new Error("No user details found in localStorage")
        }
      } catch (e) {
        this.setIsLoggedOut(false)
        this.notifyErr(`Error:  ${e.message}`);
      }

    },

    getSideMenu() {

      const menu = [
        {
          href: "/studio/dashboard",
          title: "Home",
          icon: "fa fa-home",
        },
      ];

      if (this.getSelectedService) {
        if (this.getSelectedService.services.length > 0) {
          const id = this.getSelectedService.services[0].id
          if (id == 'CAVACH_API') {
            menu.push({
              href: "/studio/sessions/" + this.getSelectedService.appId,
              title: "Verifications",
              icon: "fa fa-check",
            })

            menu.push({
              href: "/studio/usage/" + this.getSelectedService.appId,
              title: "Usages",
              icon: "fa fa-chart-bar",
            })

            menu.push({
              href: "/studio/onchainkyc/credit/" + this.getSelectedService.appId,
              title: "Credits",
              icon: "fas fa-hand-holding-usd",
            })

            menu.push({
              href: '#',
              title: 'Settings',
              icon: 'fa fa-cogs',
              child: [
                {
                  href: "/studio/onchainkyc/" + this.getSelectedService.appId,
                  title: "OnChain KYC",
                  icon: "fas fa-network-wired",
                },
                {
                  href: "/studio/widget-config/" + this.getSelectedService.appId,
                  title: "KYC Widget",
                  icon: "fa fa-puzzle-piece",
                },                 {
                  href: "/studio/webhook-config/" + this.getSelectedService.appId,
                  title: "Webhook",
                  icon: "fa fa-anchor",
                },
                {
                  href: "/studio/kyc-webpage-generator/" + this.getSelectedService.appId,
                  title: "KYC Webpage",
                  icon: "fa fa-globe",
                },
              ]
            })

          } else if (id == 'SSI_API') {
            menu.push({
              href: "/studio/ssi/did/" + this.getSelectedService.appId,
              title: "DIDs",
              icon: "fa fa-id-badge",
            })

            menu.push({
              href: "/studio/ssi/schema/" + this.getSelectedService.appId,
              title: "Schemas",
              icon: "fa fa-puzzle-piece",
            })

            menu.push({
              href: "/studio/ssi/credential/" + this.getSelectedService.appId,
              title: "Credential",
              icon: "fa fa-certificate",
            })
            menu.push({
              href: "/studio/ssi/usage/" + this.getSelectedService.appId,
              title: "Usages",
              icon: "fa fa-chart-bar",
                      })

            menu.push({
              href: "/studio/ssi/credit/" + this.getSelectedService.appId,
              title: "Credits",
              icon: "fas fa-hand-holding-usd",

            })
          }
        }
      }
      return menu;
    },

    fetchAllOrgs() {
      this.fetchAllOrgsAction();
    },

    fetchTemplates(selectedOrgDid) {
      const url = `${this.$config.studioServer.BASE_URL}${this.$config.studioServer.PRESENTATION_TEMPLATE_EP}/org/${selectedOrgDid}/`;
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.authToken}`,
      };
      fetch(url, {
        headers,
      })
        .then((response) => response.json())
        .then((json) => {
          json.data.forEach((template) => {
            this.insertApresentationTemplate(template);
          });
        });
    },

    async getList(selectedOrgDid) {
      let url = "";
      let options = {};
      url = `${this.$config.studioServer.BASE_URL}${this.$config.studioServer.SCHEMA_LIST_EP}/${selectedOrgDid}/?page=${this.schema_page}&limit=10`;

      options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.authToken}`,
        },
      };
      const resp = await fetch(url, options);
      const j = await resp.json();
      if (j && j.status == 500) {
        return this.notifyErr(`Error:  ${j.error}`);
      }
      const schemaList = j.data.schemaList;
      schemaList.forEach((schema) => {
        this.insertAschema(schema);
      });
    },

    async getCredList(selectedOrgDid) {
      let url = "";
      let options = {};
      url = `${this.$config.studioServer.BASE_URL}${this.$config.studioServer.CRED_LIST_EP}/${selectedOrgDid}`;

      options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.authToken}`,
        },
      };
      const resp = await fetch(url, options);
      const j = await resp.json();
      if (j && j.status == 500) {
        return this.notifyErr(`Error:  ${j.error}`);
      }
      const credList = j.data.credList;
      credList.forEach((credential) => {
        this.insertAcredential(credential);
      });
    },
  async logout() {
      try{
      await RequestHandler(`${config.studioServer.BASE_URL}api/v1/auth/logout`, 'POST', {})
      }catch(e){
        console.error('Logout error:', e); 
      }
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      localStorage.removeItem("credentials");
      localStorage.removeItem("userData");
      (this.isSidebarCollapsed = true), (this.collapsed = true);
      localStorage.removeItem("selectedOrg");
      this.resetStore();
      this.resetMainStore();
      this.$router.go();
      localStorage.removeItem('vuex')
    },

    formattedAppName(appName) {
      if (appName == "" || appName == undefined) appName = "No app name";
      return this.truncate(appName, 25);
    },
    async switchBackToAdminAccount(){
      try{
        this.isLoding= true
         await this.switchToAdmin({
          adminId: this.userDetails.userId
        })
        this.isLoading = false
        this.notifySuccess('Succefully switch to admin account')
        await this.fetchLoggedInUser()
        if (this.$route.path !== "/studio/dashboard") {
          this.$router.push("dashboard").then(() => { this.$router.go(0) })
        } else {
          await this.fetchLoggedInUser()
          this.$forceUpdate();
          this.$router.go(0); 
        }
      } catch (e) {
        this.notifyErr(e.message)
        this.isLoading = false
      }
      },
    async fetchLoggedInUser(){
      if (localStorage.getItem("user")) {
      const usrStr = localStorage.getItem("user");
      this.user = JSON.parse(usrStr);
      this.loggedInUserEmailId=this.user?.accessAccount?.email
      this.setIsLoggedOut(true)
    }
    
    },
  },
  mixins: [UtilsMixin],
};
</script>
