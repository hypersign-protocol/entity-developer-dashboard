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
  background: #f6f6f687;
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
  max-width: 1446px
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
  <div id="app">
    <load-ing :active.sync="isLoading" :can-cancel="true" :is-full-page="true"></load-ing>

    <b-navbar toggleable="lg" type="dark" variant="white" class="navStyle" v-if="showIcon" sticky>
      <b-navbar-brand href="#">
        <a href="#" @click="route('dashboard')">
          <img src="./assets/Entity_full.png" alt="" style="height: 5vh; opacity: 80%" />
        </a>
      </b-navbar-brand>
      <b-collapse id="nav-collapse" is-nav v-if="parseAuthToken">
        <b-navbar-nav class="ml-auto">

          <b-nav-item v-if="user.accessAccount?.email" class="center">
            <a href="#">
              Accessing Account Of: <b-badge variant="dark"> {{ user.accessAccount.email }}</b-badge>
            </a>
          </b-nav-item>

          <b-nav-item v-if="parseAuthToken.isTwoFactorEnabled == false">
            <button class="btn btn-outline-secondary" type="button" @click="$router.push('mfa')">
              <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
              <span class="visually-hidden"> Setup MFA</span>
            </button>
          </b-nav-item>

          <b-nav-item :href="$config.studioServer.BASE_URL" target="_blank" title="Developer Dashboard API">
            <i class="fa fa-code f-36" style=" color: grey"></i></b-nav-item>
          <b-nav-item href="https://docs.hypersign.id/entity-studio/developer-dashboard" target="_blank"
            title="Documentation">
            <i class="fas fa-book-open f-36" style=" color: grey"></i>
          </b-nav-item>

          <b-nav-item-dropdown right v-if="showIcon" title="Profile">
            <template #button-content>
              <i class="fas fa-user-circle f-36" style="color: grey"></i>
            </template>

            <b-dropdown-group style="text-align: left;">
              <b-dropdown-item-button style="text-align: left" :title="userDetails.email"
                @click="copyToClip(userDetails.email, 'Email')">
                <i class="far fa-copy mt-1"></i>
                {{ shorten(userDetails.email) }}
              </b-dropdown-item-button>

              <!-- <b-dropdown-item-button style="text-align: left" :title="userDetails.did" v-if="userDetails.did" @click="copyToClip(userDetails.did, 'DID')">
                <i class="far fa-copy" ></i>
                {{ shorten(userDetails.did) }}
              </b-dropdown-item-button> -->

              <b-dropdown-item-button style="text-align: left" @click="goTo('/studio/settings')" title="Teams">
                <i class="fa fa-cog" style="cursor: pointer; font-size: 1.3rem"></i>
                Settings
              </b-dropdown-item-button>

              <b-dropdown-item-button style="text-align: left" @click="goTo('/studio/dashboard')" title="Teams">
                <i class="fa fa-home" style="cursor: pointer; font-size: 1.3rem"></i>
                Home
              </b-dropdown-item-button>
              <b-dropdown-divider></b-dropdown-divider>

              <b-dropdown-item-button style="text-align: left" @click="logoutAll()" title="Logout">
                <i class="fas fa-sign-out-alt" style="cursor: pointer; font-size: 1.3rem"></i>
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


    <sidebar-menu class="sidebar-wrapper" v-if="showSideNavbar" @toggle-collapse="onToggleCollapse"
      :collapsed="isSidebarCollapsed" :theme="'white-theme'" width="220px" :menu="getSideMenu()">
      <div slot="header" style="border-bottom: 1px solid #d3d3d354;">
        <div class="row center p-1">
          <div class="col">
            <div class="p-1 center">
              <b-avatar :src="getSelectedService.logoUrl ||
                getProfileIcon(formattedAppName(getSelectedService.appName))
                " variant="info"></b-avatar>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <center>
              <p class="mt-3 orgNameCss">
                {{ getSelectedService ? getSelectedService.appName : "" }}
              </p>
            </center>
          </div>
        </div>
      </div>
    </sidebar-menu>
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
  z-index: -1;
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
  margin-top: 65px;
  /* box-shadow: 0 0 15px 0 rgba(34, 41, 47, 0.05); */
  box-shadow: 0 2px 6px 0 rgba(32, 33, 37, .1);
}

.v-sidebar-menu.vsm_white-theme .vsm--mobile-bg {
  background: #905ab0;
}

.vsm--mobile-bg {
  background: #905ab098 !important;
}

.v-sidebar-menu.vsm_white-theme {
  background-color: white !important;
  color: #000 !important;
}

.v-sidebar-menu.vsm_white-theme .vsm--header {
  color: #000 !important;
}

.v-sidebar-menu.vsm_white-theme .vsm--link {
  color: #000 !important;
}

.v-sidebar-menu.vsm_white-theme .vsm--link_level-1 .vsm--link:hover {
  color: #000 !important;
  background: #905ab0 !important;
}

.v-sidebar-menu.vsm_white-theme .vsm--link_level-1 .vsm--icon {
  background-color: transparent !important;
  color: #000 !important;
}
</style>

<script>
import UtilsMixin from "./mixins/utils";
import EventBus from "./eventbus";
import { mapActions, mapMutations, mapGetters, mapState } from "vuex";
export default {
  computed: {
    ...mapGetters("playgroundStore", ["userDetails", "getSelectedOrg"]),
    ...mapGetters("mainStore", ["getSelectedService", "getAllServices"]),
    ...mapState({
      showMainSideNavBar: (state) => state.mainStore.showMainSideNavBar,
      selectedDashboard: (state) => state.globalStore.selectedDashboard,
      appList: (state) => state.mainStore.appList,
    }),

    authToken() {
      return localStorage.getItem("authToken")
    },
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
      showIcon: true,
      isSidebarCollapsed: true,
      schema_page: 1,
      authRoutes: ["register", "PKIIdLogin"],
      user: {},
      parseAuthToken: null
    };
  },

  mounted() {
    this.$root.$on("clearAppData", () => {
      this.authToken = null;
      this.showIcon = false;
    });

    this.$root.$on("recomputeParseAuthTokenEvent", () => {
      this.getParseAuthToken()
    });

    this.getParseAuthToken()

    this.$root.$on("closeSideNav", () => {
      this.isSidebarCollapsed = true;
    });
    if (localStorage.getItem("user")) {
      const usrStr = localStorage.getItem("user");
      this.user = JSON.parse(usrStr);
      this.showIcon = true;
    }
    if (localStorage.getItem("selectedOrg")) {
      const selectedOrgId = localStorage.getItem("selectedOrg");
      this.selectAnOrg(selectedOrgId);
      this.getList(selectedOrgId);
      this.getCredList(selectedOrgId);
      this.fetchTemplates(selectedOrgId);
    }
    this.$root.$on("initializeStore", () => {
      console.log('Inside initializeStore ... event');
      this.initializeStore()
    });
    // this.initializeStore();

    EventBus.$on("logoutAll", () => {
      this.logoutAll()
    })
  },
  methods: {
    ...mapActions("mainStore", ["fetchAppsListFromServer", "fetchServicesList"]),
    ...mapMutations("mainStore", ["resetMainStore"]),
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
      this.showIcon = false;
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
      var base64Url = authTokne.split('.')[1];
      var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      this.parseAuthToken = JSON.parse(jsonPayload);
    },
    async initializeStore() {
      try {
        this.authToken = localStorage.getItem("authToken");
        if (this.authToken) {
          this.showIcon = true;
          // this.isLoading = true;
          // await this.fetchAppsListFromServer();
          // await this.fetchServicesList()

          this.$router.push("dashboard").then(() => { this.$router.go(0) });

          // this.isLoading = false;
        } else {
          throw new Error("No auth token")
        }
      } catch (e) {
        this.showIcon = false
        // this.isLoading = false;
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
              title: "Sessions",
              icon: "fa fa-check",
            })

            // menu.push({
            //   href: "/studio/onchainkyc/" + this.getSelectedService.appId,
            //   title: "OnChain KYC",
            //   icon: "fas fa-network-wired",
            // })




            menu.push({
              href: "/studio/usage/" + this.getSelectedService.appId,
              title: "Usages",
              icon: "fa fa-chart-bar",
            })

            menu.push({
              href: '#',
              title: 'Settings',
              icon: 'fa fa-cogs',
              child: [
                {
                  href: "/studio/widget-config/" + this.getSelectedService.appId,
                  title: "KYC Widget",
                  icon: "fa fa-puzzle-piece",
                }, {
                  href: "/studio/webhook-config/" + this.getSelectedService.appId,
                  title: "Webhook",
                  icon: "fa fa-anchor",
                }
              ]
            })

          } else if (id == 'SSI_API') {
            menu.push({
              href: "/studio/ssi/did/" + this.getSelectedService.appId,
              title: "DIDs",
              icon: "fa fa-id-badge",
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
    logout() {
      // this.authToken = null;
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      localStorage.removeItem("credentials");
      localStorage.removeItem("userData");
      (this.isSidebarCollapsed = true), (this.collapsed = true);
      localStorage.removeItem("selectedOrg");
      this.resetStore();
      this.resetMainStore();
    },

    formattedAppName(appName) {
      if (appName == "" || appName == undefined) appName = "No app name";
      return this.truncate(appName, 25);
    },
  },
  mixins: [UtilsMixin],
};
</script>
