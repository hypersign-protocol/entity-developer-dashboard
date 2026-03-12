<style scoped>
/* Fix Navbar Appearance */
.navStyle {
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #eef0f2;
  height: 60px;
  padding: 0 20px !important;
}

.nav-logo-img {
  height: 28px;
  width: auto;
  opacity: 0.9;
  transition: opacity 0.2s;
}

.nav-logo-img:hover {
  opacity: 1;
}

/* Chips & Wrappers */
.tenant-wrapper {
  cursor: pointer;
}

.tenant-chip,
.mfa-chip {
  font-weight: 600 !important;
  font-size: 11px !important;
  height: 28px !important;
}

/* Avatar Styling */
.avatar-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  transition: border-color 0.2s;
}

.avatar-container:hover {
  border-color: #667eea;
}

.profile-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

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

.dropDownPopup {
  box-shadow: 2px 0 10px rgba(0, 0, 0, .47);
  border-radius: 8px;
  border: 0 solid grey;
}


</style>

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
  color: rgba(0, 0, 0, .87) !important;
}

.v-sidebar-menu.vsm_white-theme .vsm--header {
  color: rgba(0, 0, 0, .87) !important;
}

.v-sidebar-menu.vsm_white-theme .vsm--link {
  color: rgba(0, 0, 0, .87) !important;
}

.v-sidebar-menu.vsm_white-theme .vsm--link_level-1 .vsm--link:hover {
  color: rgba(0, 0, 0, .87) !important;
  background: whitesmoke !important;
}

.v-sidebar-menu.vsm_white-theme .vsm--link_level-1 .vsm--icon {
  background-color: transparent !important;
  color: #66666a !important;
}
</style>
<template>
  <div id="app" data-app>
    <load-ing :active.sync="isLoading" :can-cancel="true" :is-full-page="true"></load-ing>


    <b-navbar toggleable="lg" class="navStyle shadow-sm" v-if="getIfAuthenticated" sticky>
      <b-navbar-brand href="javascript:void(0)" @click="route('dashboard')" class="d-flex align-items-center">
        <img src="./assets/Entity_full.png" alt="Logo" class="nav-logo-img" />
      </b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav v-if="userDetails">
        <b-navbar-nav class="ml-auto align-items-center">

          <b-nav-item v-if="getSwitchedTenantAccount" class="px-2">
            <div class="d-flex align-items-center tenant-wrapper" @click="switchBackToAdminAccount"
              title="Click to access your own account">
              <span class="mr-2 d-none d-md-inline text-muted small font-weight-bold">Acting as:</span>
              <v-chip small color="primary" outlined class="tenant-chip">
                <span class="text-truncate" style="max-width: 150px">{{ getSwitchedTenantAccount }}</span>
                <b-icon icon="box-arrow-in-right" class="ml-2"></b-icon>
              </v-chip>
            </div>
          </b-nav-item>

          <b-nav-item v-if="!isMFAEnabled" to="/studio/settings" class="px-2">
            <v-chip small color="orange" dark class="mfa-chip">
              <b-icon icon="exclamation-triangle-fill" class="mr-1"></b-icon>
              <span>Setup MFA</span>
            </v-chip>
          </b-nav-item>

          <b-nav-item-dropdown right no-caret menu-class="profile-dropdown-menu dropDownPopup" >
            <template #button-content>
              <div class="avatar-container">
                <img v-if="userDetails?.profileIcon" :src="userDetails?.profileIcon" class="profile-img" />
                <b-icon v-else icon="person-circle" font-scale="1.5" class="text-secondary"></b-icon>
              </div>
            </template>

            <div class="px-4 py-3 bg-light border-bottom dropdown-user-header">
              <p class="mb-0 small text-muted">Signed in as</p>
              <p class="mb-0 font-weight-bold text-dark">{{ userDetails.name || 'User' }}</p>
            </div>

            <b-dropdown-item @click="copyToClip(userDetails.email, 'Email')" class="small-dropdown-item">
              <b-icon icon="envelope" class="mr-2"></b-icon> {{ shorten(userDetails.email) }}
            </b-dropdown-item>

            <b-dropdown-divider></b-dropdown-divider>

            <b-dropdown-item @click="goTo('/studio/dashboard')">
              <b-icon icon="house" class="mr-2"></b-icon> Home
            </b-dropdown-item>

            <b-dropdown-item @click="goTo('/studio/settings')">
              <b-icon icon="gear" class="mr-2"></b-icon> Settings
            </b-dropdown-item>

            <b-dropdown-divider></b-dropdown-divider>

            <b-dropdown-item @click="logoutAll()" variant="danger">
              <b-icon icon="power" class="mr-2"></b-icon> Logout
            </b-dropdown-item>
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

    <sidebar-menu :relative="false" class="sidebar-wrapper"
      v-if="userDetails && Object.keys(userDetails).length > 0 && showSideNavbar && getSelectedService"
      @toggle-collapse="onToggleCollapse" :collapsed="isSidebarCollapsed" :theme="'white-theme'" width="220px"
      :menu="getSideMenu()">
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
  </div>
</template>


<script>
import UtilsMixin from "./mixins/utils";
import EventBus from "./eventbus";
import { mapActions, mapMutations, mapGetters, mapState } from "vuex";
import { RequestHandler } from './utils/utils'
import config from './config'
import * as EN from './language/en'
export default {
  computed: {
    ...mapGetters("playgroundStore", ["getSelectedOrg"]),
    ...mapGetters("mainStore", ['getSwitchedTenantAccount', "getSelectedService", "getAllServices", 'getIfAuthenticated', 'getUserDetails', 'isMFAEnabled']),
    ...mapState({
      showMainSideNavBar: (state) => state.mainStore.showMainSideNavBar,
      selectedDashboard: (state) => state.globalStore.selectedDashboard,
      appList: (state) => state.mainStore.appList,
    }),
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
      userDetails: {},
      loggedInUserEmailId: "",
      parseAuthToken: null,
      authToken: null
    };
  },

  mounted() {

    // console.log(this.getUserDetails)
    if (this.getUserDetails) {
      try {

        this.userDetails = this.getUserDetails;
        this.loggedInUserEmailId = this.userDetails?.accessAccount?.email;
        this.setIsLoggedOut(false);
      } catch (e) {
        console.error("Invalid user JSON:", e);
        this.userDetails = {};
      }
    } else {
      console.log('No userDetails found yet...')
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
    ...mapActions("mainStore", ["fetchAppsListFromServer", "fetchServicesList", 'switchToAdmin']),
    ...mapMutations("mainStore", ["resetMainStore", "setIsLoggedOut", 'resetStoreForTeantSwitch']),
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
      this.setIsLoggedOut(false)
      this.logout();
      if (this.$route.path !== '/login') this.$router.push('/login')
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
      if (!this.checkIfDateExpired(exp)) {
        this.parseAuthToken = parsedjsonPayload
      } else {
        this.parseAuthToken = null
      }
    },
    checkIfDateExpired(datetimestamp) {
      const currentTime = Math.floor(Date.now() / 1000);
      if (datetimestamp < currentTime) {
        return true
      } else {
        return false
      }
    },
    async initializeStore() {
      try {
        const userDetails = this.getUserDetails //localStorage.getItem("user");
        if (userDetails) {
          this.parseAuthToken = this.getUserDetails
          this.setIsLoggedOut(true)
          const redirectPath = localStorage.getItem("postLoginRedirect") || '/studio/dashboard';
          localStorage.removeItem("postLoginRedirect");
          this.$router.push(redirectPath).then(() => { this.$router.go(0) });
        } else {
          throw new Error("No user details found in localStorage")
        }
      } catch (e) {
        this.setIsLoggedOut(false)
        this.notifyErr(`Error:  ${e.message}`);
      }

    },

    getSideMenu() {

      const menu = [];

      if (this.getSelectedService && this.getSelectedService.services.length > 0) {

        const id = this.getSelectedService.services[0].id;
        const appId = this.getSelectedService.appId;

        if (id == 'CAVACH_API') {

          // Getting Started
          menu.push({
            href: "/studio/getting-started/" + appId,
            title: EN.NAV.GETTING_STARTED,
            icon: "fa fa-flag-checkered",
          });

          // Identity Verification
          menu.push({
            href: "",
            title: EN.NAV.IDENTITY_VERIFICATION.TITLE,
            icon: "fa fa-user-check",
            child: [
              {
                href: "/studio/sessions/" + appId,
                title: EN.NAV.IDENTITY_VERIFICATION.USERS,
                icon: "fa fa-users",
              },
              {
                href: "/studio/user-analytics/" + appId,
                title: EN.NAV.IDENTITY_VERIFICATION.USER_ANALYTICS,
                icon: "fa fa-chart-line",
              },
              {
                href: "/studio/widget-config/" + appId,
                title: EN.NAV.IDENTITY_VERIFICATION.KYC_WIDGET,
                icon: "fa fa-puzzle-piece",
              }
            ]
          });
          // Buniness Verification
          menu.push({
            href: "",
            title: EN.NAV.BUSINESS_VERIFICATION.TITLE,
            icon: "fa fa-building",
            child: [
              {
                href: "/studio/business/" + this.getSelectedService.appId,
                title: EN.NAV.BUSINESS_VERIFICATION.BUSINESSES,
                icon: "fa fa-briefcase"
              },
              // {
              //   href: "/studio/kyb-widget-config/" + this.getSelectedService.appId,
              //   title: EN.NAV.BUSINESS_VERIFICATION.KYB_WIDGET,
              //   icon: "fa fa-puzzle-piece",
              // }
            ]
          });
          // Solutions
          menu.push({
            href: "",
            title: EN.NAV.SOLUTIONS.TITLE,
            icon: "fa fa-lightbulb",
            child: [
              {
                href: "/studio/kyc-webpage-generator/" + appId,
                title: EN.NAV.SOLUTIONS.KYC_VERIFIER_CONFIGURATION,
                icon: "fa fa-globe",
              }
            ]
          });

          // Developer Hub
          menu.push({
            href: "",
            title: EN.NAV.DEVELOPERS_HUB.TITLE,
            icon: "fa fa-code",
            child: [
              {
                href: "/studio/developer/api-key/" + appId,
                title: EN.NAV.DEVELOPERS_HUB.API_KEY,
                icon: "fa fa-key",
              },
              {
                href: "/studio/developer/webhook/" + appId,
                title: EN.NAV.DEVELOPERS_HUB.WEBHOOK,
                icon: "fa fa-anchor",
              },
              {
                href: "/studio/service-config/" + appId,
                title: EN.NAV.DEVELOPERS_HUB.SERVICE_CONFIGURATION,
                icon: "fa fa-cog",
              }
            ]
          });
          // Billing & Usage
          menu.push({
            href: "",
            title: EN.NAV.BILLING_AND_USAGE.TITLE,
            icon: "fa fa-credit-card",
            child: [
              {
                href: "/studio/onchainkyc/credit/" + appId,
                title: EN.NAV.BILLING_AND_USAGE.CREDIT,
                icon: "fas fa-hand-holding-usd",
              },
              {
                href: "/studio/usage/" + appId,
                title: EN.NAV.BILLING_AND_USAGE.USAGES,
                icon: "fa fa-chart-bar",
              }
            ]
          });

        }

        else if (id === 'SSI_API') {

          menu.push({
            href: "/studio/ssi/did/" + appId,
            title: "DIDs",
            icon: "fa fa-id-badge",
          });

          menu.push({
            href: "/studio/ssi/schema/" + appId,
            title: "Schemas",
            icon: "fa fa-puzzle-piece",
          });

          menu.push({
            href: "/studio/ssi/credential/" + appId,
            title: "Credential",
            icon: "fa fa-certificate",
          });

          menu.push({
            href: "/studio/ssi/usage/" + appId,
            title: EN.NAV.BILLING_AND_USAGE.USAGES,
            icon: "fa fa-chart-bar",
          });

          menu.push({
            href: "/studio/ssi/credit/" + appId,
            title: EN.NAV.BILLING_AND_USAGE.CREDIT,
            icon: "fas fa-hand-holding-usd",
          });

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
      // Logout API
      RequestHandler(
        `${config.studioServer.BASE_URL}api/v1/auth/logout`,
        "POST",
        {}
      ).then(() => {
        this.isLoading = false
      }).catch((err) => {
        this.isLoading = false
        console.error("Logout error:", err);
      });

      // Clear all localStorage
      console.log('Clearing localStorage on logout...');
      localStorage.clear();

      // Reset UI state
      this.isSidebarCollapsed = true;
      this.collapsed = true;

      // Reset stores (Pinia / Vuex)
      this.resetStore();
      this.resetMainStore();
    },

    formattedAppName(appName) {
      if (appName == "" || appName == undefined) appName = "No app name";
      return this.truncate(appName, 25);
    },
    async switchBackToAdminAccount() {
      try {
        this.isLoding = true
        await this.switchToAdmin({
          adminId: this.userDetails.userId
        })
        this.resetStoreForTeantSwitch()
        this.isLoading = false
        this.$router.push("/studio/dashboard").then(() => { this.$router.go(0) });
      } catch (e) {
        this.notifyErr(e.message)
        this.isLoading = false
      }
    },
    async fetchLoggedInUser() {
      if (this.getUserDetails) {
        this.userDetails = this.getUserDetails
        this.loggedInUserEmailId = this.userDetails?.accessAccount?.email
        this.setIsLoggedOut(true)
      }

    },
  },
  mixins: [UtilsMixin],
};
</script>
