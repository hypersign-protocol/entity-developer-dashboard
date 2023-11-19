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
</style>
<template>
  <div id="app">
    <b-navbar
      toggleable="lg"
      type="dark"
      variant="white"
      class="navStyle"
      v-if="showIcon"
      sticky
    >
      <b-navbar-brand
        href="#"
        style="display: flex; width: 80%; margin-left: 0.2em"
      >
        <a href="#" @click.prevent="route('dashboard')">
          <img
            src="./assets/Entity_full.png"
            alt=""
            style="height: 5vh; opacity: 80%"
          />
        </a>
      </b-navbar-brand>
      <b-collapse id="nav-collapse" is-nav style="width: 30%">
        <b-navbar-nav class="ml-auto">
          <!-- <a class="mr-4" href="#" @click.prevent="route('playgroundDashboard')"
          style="color:grey; margin-top:0.8em;" title="SSI Playground" v-if="selectedDashboard === $config.DashboardTypes.DeveloperDashboard">
          <i class="fa fa-gamepad" style="font-size:36px;"></i>
        </a> -->

          <a
            class="mr-4"
            href="#"
            @click.prevent="route('dashboard')"
            style="color: grey; margin-top: 0.8em"
            title="Developer Dashboard"
            v-if="selectedDashboard === $config.DashboardTypes.SSIPlayground"
          >
            <i class="fa fa-code" style="font-size: 36px"></i>
          </a>

          <a
            class="mr-3"
            href="https://docs.hypersign.id/entity-studio/developer-dashboard"
            target="blank"
            style="color: grey; margin-top: 0.8em"
            title="Documentation"
          >
            <i class="fas fa-book-open" style="font-size: 36px"></i>
          </a>

          <b-nav-item-dropdown right v-if="showIcon" title="Profile">
            <template #button-content>
              <i
                class="fas fa-user-circle"
                style="font-size: 40px; color: grey"
              ></i>
            </template>

            <div style="display: inline">
              <div class="hov" style="display: flex" :title="userDetails.email">
                {{ shorten(userDetails.email) }}
                <i
                  class="far fa-copy mt-1"
                  @click="copyToClip(userDetails.email, 'Email')"
                ></i>
              </div>
              <hr />

              <div class="hov" style="display: flex" :title="userDetails.did">
                {{ shorten(userDetails.did) }}
                <i
                  class="far fa-copy"
                  @click="copyToClip(userDetails.did, 'DID')"
                ></i>
              </div>
              <hr />
              <div class="hov" @click="logoutAll()" title="Logout">
                Logout
                <i
                  class="fas fa-sign-out-alt"
                  style="cursor: pointer; font-size: 1.3rem"
                ></i>
              </div>
            </div>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <div
      :class="[
        isSidebarCollapsed ? 'container-collapsed-not' : 'container-collapsed',
      ]"
    >
      <router-view class="container containerData" />
    </div>
    <notifications group="foo" />
    <sidebar-menu
      class="sidebar-wrapper"
      v-if="showSideNavbar"
      @toggle-collapse="onToggleCollapse"
      :collapsed="isSidebarCollapsed"
      :theme="'white-theme'"
      width="220px"
      :menu="getSideMenu()"
    >
      <div slot="header" style="background: #363740">
        <div class="mt-3">
          <div>
            <center>
              <img
                v-if="!isSidebarCollapsed"
                :src="`${getProfileIcon(selectedOrg ? selectedOrg.name : '')}`"
                alt="avatar"
                width="130px"
                style=""
              />
            </center>
            <center>
              <img
                v-if="isSidebarCollapsed"
                :src="`${getProfileIcon(selectedOrg ? selectedOrg.name : '')}`"
                class="mr-1"
                alt="center"
                width="35px"
              />
            </center>
          </div>
          <center>
            <p class="mt-3 orgNameCss">
              {{ selectedOrg ? selectedOrg.name : "" }}
            </p>
          </center>
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
  box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 2px 0px,
    rgba(0, 0, 0, 0.02) 0px 3px 1px -2px, rgba(0, 0, 0, 0.01) 0px 1px 5px 0px;
}
.orgNameCss {
  overflow-wrap: break-word;
  color: white;
  font-weight: bold;
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
  box-shadow: 0 0 15px 0 rgba(34, 41, 47, 0.05);
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
import HfButtons from "./components/element/HfButtons.vue";
import { mapActions, mapMutations, mapGetters, mapState } from "vuex";
export default {
  components: { HfButtons },
  computed: {
    ...mapGetters("playgroundStore", ["userDetails", "getSelectedOrg"]),
    ...mapState({
      showMainSideNavBar: (state) => state.mainStore.showMainSideNavBar,
      selectedDashboard: (state) => state.globalStore.selectedDashboard,
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
      collapsed: true,
      showIcon: false,
      isSidebarCollapsed: true,
      authToken: localStorage.getItem("authToken"),
      schema_page: 1,
      authRoutes: ["register", "PKIIdLogin"],
      user: {},
    };
  },

  mounted() {
    EventBus.$on("clearAppData", () => {
      this.authToken = null;
      this.showIcon = false;
    });
    EventBus.$on("closeSideNav", () => {
      this.isSidebarCollapsed = true;
    });
    if (localStorage.getItem("user")) {
      const usrStr = localStorage.getItem("user");
      this.user = JSON.parse(usrStr);
    }
    if (localStorage.getItem("selectedOrg")) {
      const selectedOrgId = localStorage.getItem("selectedOrg");
      this.selectAnOrg(selectedOrgId);
      this.getList(selectedOrgId);
      this.getCredList(selectedOrgId);
      this.fetchTemplates(selectedOrgId);
    }
    EventBus.$on("initializeStore", this.initializeStore);
    this.initializeStore();
  },
  methods: {
    ...mapActions("mainStore", ["fetchAppsListFromServer"]),
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
      this.$router.push({ name });
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
      return "https://avatars.dicebear.com/api/identicon/" + name + ".svg";
    },
    logoutAll() {
      this.showIcon = false;
      this.$router.push("/login");
      this.logout();
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
    initializeStore() {
      this.authToken = localStorage.getItem("authToken");
      if (this.authToken) {
        this.showIcon = true;
        // TODO: This should only execute when playground is selected, otherwise not...
        this.fetchAllOrgs();

        this.fetchAppsListFromServer();
      } else {
        console.log("else");
      }
    },

    getSideMenu() {
      const menu = [
        {
          href: "/studio/playground/dashboard",
          title: "Dashboard",
          icon: "fas fa-tachometer-alt",
        },
        {
          href: "/studio/playground/schema",
          title: "Schema",
          icon: "fa fa-table",
        },
        {
          href: "/studio/playground/credential",
          title: "Credentials",
          icon: "fa fa-id-card",
        },
        {
          href: "/studio/playground/presentation",
          title: "Presentation",
          icon: "fa fa-desktop",
        },
        {
          href: "/studio/playground/presentation/verify",
          title: "Verification",
          icon: "fa fa-check",
        },
      ];
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
      this.authToken = null;
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      localStorage.removeItem("credentials");
      localStorage.removeItem("userData");
      (this.isSidebarCollapsed = true), (this.collapsed = true);
      localStorage.removeItem("selectedOrg");
      this.resetStore();
      this.resetMainStore();
    },
  },
  mixins: [UtilsMixin],
};
</script>
