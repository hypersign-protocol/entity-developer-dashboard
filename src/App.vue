<style scoped>
/* Fix Navbar Appearance */
/* Navigation Bar Container */
.navStyle {
  background: #ffffff !important;
  border-bottom: 1px solid #e5e7eb !important;
  height: 60px;
  padding: 0 24px !important;
  z-index: 1000;
}

/* Tenant Selector Chip */
.tenant-wrapper {
  cursor: pointer;
}

.tenant-badge {
  display: inline-flex;
  align-items: center;
  background-color: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 3px 8px;
  font-size: 0.75rem;
  font-weight: 500;
  color: #374151;
}

.tenant-email {
  max-width: 160px;
}

/* Soft Warning Badge for MFA */
.mfa-warning-badge {
  display: inline-flex;
  align-items: center;
  background-color: #fffbe2;  /* Soft light-yellow tint */
  border: 1px solid #fef08a;    /* Subtle yellow border */
  color: #a16207;               /* Dark amber/gold text for high contrast */
  font-size: 0.72rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.mfa-warning-badge:hover {
  background-color: #fef9c3;
  border-color: #fde047;
}

/* Avatar Container Fixes */
.avatar-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid #e5e7eb;
  overflow: hidden;
  background-color: #f9fafb;
}

.profile-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Dropdown Menu Cleanups */
.profile-dropdown-menu {
  border: 1px solid #e5e7eb !important;
  border-radius: 8px !important;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.03) !important;
  padding: 4px 0 !important;
  min-width: 220px !important;
}

/* Force the user header block and text to align left */
/* Ensure the dropdown container and all items align strictly left */
::v-deep .profile-dropdown-menu.dropdown-menu {
  text-align: left !important;
}

/* Align text and icons inside dropdown links to the left */
::v-deep .profile-dropdown-menu .dropdown-item {
  text-align: left !important;
  display: flex !important;
  align-items: center !important;
  justify-content: flex-start !important;
}

/* User header section alignment */
.dropdown-user-header {
  text-align: left !important;
}

/* Ensure dropdown menu items and icons align left */
.profile-dropdown-menu .b-dropdown-text,
.profile-dropdown-menu .dropdown-item {
  text-align: left !important;
  justify-content: flex-start !important;
}

.x-small {
  font-size: 0.68rem;
  letter-spacing: 0.05em;
}

.nav-logo-img {
  height: 28px;
  width: auto;
  opacity: 0.9;
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
}

.profile-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.logo {
  padding-top: 1.5%;
  padding-left: 25px;
}

.card-radius {
  border-radius: 10px;
}

.logo-style {
  width: 144px;
  margin-top: 9px;
  margin-left: 5px;
}

#app {
  padding: 0;
  margin: 0;
  width: 100%;
  min-height: 100vh;
}

.subtitle {
  padding-left: 10px;
  color: gray;
  margin-top: auto;
}

.container-collapsed {
  margin-left: 15em;
}

.container {
  max-width: 1300px;
}

.far {
  cursor: pointer;
  color: grey;
  display: inline;
  padding-left: 5px;
}

.dropDownPopup {
  border-radius: 8px;
  border: 0 solid grey;
}

/* Sidebar app header */
.sidebar-app-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  border-bottom: 1px solid #eef0f2;
  min-height: 56px;
  overflow: hidden;
}

.sidebar-app-avatar {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid #eef0f2;
  overflow: hidden;
  background: #f9f7fc;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sidebar-app-logo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.sidebar-app-name {
  font-size: 13px;
  font-weight: 600;
  color: #2d2d3a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: Roboto, sans-serif;
}
</style>

<style>
.v-sidebar-menu .vsm--link_level-1 .vsm--icon {
  font-size: 1rem;
  width: 40px !important;
}

.v-sidebar-menu .vsm--dropdown>.vsm--list {
  background: #ffffff !important;
}

.dropdown-menu.show {
  text-align: center;
}

.navbar {
  padding: 0px !important;
}

.navStyle {
  background: #ffffff;
  padding: 5px !important;
  padding-left: 1.5%;
  text-align: left;
}

/* Ensure navbar stays above other content */
/* .navStyle { */
  /* z-index: 1200; */
/* } */

.orgNameCss {
  overflow-wrap: break-word;
  color: grey;
  font-weight: bold;
  font-size: smaller;
  padding: 5px;
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

.leftAlign {
  text-align: left;
}

.rightAlign {
  text-align: right;
}

.sidebar-wrapper {
  min-width: 70px;
  /* Align sidebar below the top navbar (navbar height = 60px) */
  margin-top: 60px;
  border-right: 1px solid #eef0f2;
  background: #ffffff;
}

/* Sidebar base */
.v-sidebar-menu.vsm_white-theme {
  background-color: #ffffff !important;
  color: #4a4a5a !important;
}

.v-sidebar-menu.vsm_white-theme .vsm--mobile-bg {
  background: #ffffff !important;
}

.vsm--mobile-bg {
  background: #ffffff !important;
}



/* All links */
.v-sidebar-menu.vsm_white-theme .vsm--link {
  color: #4a4a5a !important;
  font-size: 13px !important;
  font-family: Roboto, sans-serif !important;
  border-radius: 0 !important;
  margin: 0 !important;
  padding: 9px 16px !important;
  background: transparent !important;
  transition: background 0.2s ease !important;
}


.v-sidebar-menu.vsm_white-theme.v-sidebar-menu.vsm_expanded  .vsm--link:hover {
 background: rgba(0, 0, 0, 0.05) !important;
  transition: background 0.2s ease !important;
}


.v-sidebar-menu.vsm_white-theme.vsm_collapsed .vsm--link_level-2:hover  {
 background: rgba(0, 0, 0, 0.05) !important;
  transition: background 0.2s ease !important;
}



/* Icons */
.v-sidebar-menu.vsm_white-theme .vsm--link_level-1 .vsm--icon {
  background-color: transparent !important;
  color: #313131b1 !important;
  font-size: 0.95rem !important;
  width: 36px !important;
}


.v-sidebar-menu.vsm_expanded{
  width: 200px !important;
  /* border:  1px solid #eef0f2 !important; */
}

/* Active level-1 link — just color, no background */
.v-sidebar-menu.vsm_white-theme .vsm--link_level-1.vsm--link_active {
  background: transparent !important;
  color: #1a1a2e !important;
  font-weight: 600 !important;
  box-shadow: none !important;
  -webkit-box-shadow: none !important;
}

.v-sidebar-menu.vsm_white-theme .vsm--link_level-1.vsm--link_active .vsm--icon {
  color: #1a1a1a !important;
}

/* Open parent item — no highlight on parent */
.v-sidebar-menu.vsm_white-theme .vsm--item_open > .vsm--link {
  background: transparent !important;
  color: #4a4a5a !important;
}

.v-sidebar-menu.vsm_white-theme .vsm--item_open > .vsm--link .vsm--icon {
  color: #636363 !important;
}

/* Child (level-2) links — text only, indented */
.v-sidebar-menu.vsm_white-theme .vsm--link_level-2 {
  color: #636363 !important;
  font-size: 13px !important;
  padding: 7px 16px 7px 52px !important;
  background: transparent !important;
}

.v-sidebar-menu.vsm_white-theme .vsm--link_level-2 .vsm--icon {
  display: none !important;
  color: #1a1a2e !important;
}

.v-sidebar-menu.vsm_white-theme .vsm--link_level-2.vsm--link_active {
  color: #1a1a2e !important;
  font-weight: 600 !important;
  background: transparent !important;

}

.v-sidebar-menu.vsm_white-theme .vsm--link_level-2.vsm--link_active .vsm--icon {
color: #1a1a2e !important;
}





/* No indent in collapsed mode */
.v-sidebar-menu.vsm_white-theme.vsm_collapsed .vsm--link_level-2 {
  padding-left: 24px !important;
}

.v-sidebar-menu.vsm_white-theme.vsm_collapsed .vsm--link_level-2 .vsm--icon {
  display: none !important;
  color: #9a9aaa !important;
}

/* Remove shadow on collapsed popup dropdown */
.v-sidebar-menu.vsm_white-theme .vsm--mobile-item .vsm--item,
.v-sidebar-menu.vsm_white-theme .vsm--dropdown {
  box-shadow: none !important;
  -webkit-box-shadow: none !important;
}

/* Collapsed: parent icon color when a child link is active */
.v-sidebar-menu.vsm_white-theme.vsm_collapsed .vsm--link_level-1.vsm--link_active .vsm--icon {
  color: #1a1a1a !important;;
}

/* Collapsed: active child item icon in the popup */
.v-sidebar-menu.vsm_white-theme.vsm_collapsed .vsm--link_level-2.vsm--link_active .vsm--icon {
  color: #1a1a2e !important;
}

/* Environment Banner */
.env-banner {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 2px 8px;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  border-radius: 14px;
}

.env-banner--dev {
  background-color: #fffbeb;
  color: #92400e;
  border: 1px solid #fcd34d33;
}

.env-banner__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
  background-color: #f59e0b;
}

.env-banner__app {
  font-weight: 400;
  opacity: 0.75;
  text-transform: none;
  letter-spacing: 0;
}

/* Top-right variant */
.env-banner--topright {
  position: fixed;
  top: 12px;
  right: 20px;
  z-index: 1200;
  padding: 6px 10px;
  border-radius: 14px;
}

@media (max-width: 767px) {
  .env-banner--topright { display: none !important; }
}


/* Sidebar Wrapper Cleanups */
.sidebar-wrapper {
  border-right: 1px solid #E5E7EB !important;
  box-shadow: none !important;
}

/* App Header Card Styling */
.sidebar-app-header {
  padding: 12px;
}

.sidebar-app-card {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  background-color: #F9FAFB;
  cursor: pointer;
}

.sidebar-app-logo {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  object-fit: cover;
}

.sidebar-app-name {
  font-weight: 600;
  font-size: 13px;
  color: #111827;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}

.app-selector-arrow {
  font-size: 16px;
  color: #6B7280;
}

/* Vue Sidebar Menu Overrides */
.v-sidebar-menu .vsm--icon {
  font-size: 18px !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 30px !important;
}

.v-sidebar-menu .vsm--link {
  font-size: 13px !important;
  font-weight: 500;
  color: #374151 !important;
}

.v-sidebar-menu .vsm--link_active {
  color: #2563EB !important;
  background-color: #EFF6FF !important;
  font-weight: 600;
}

.v-sidebar-menu .vsm--arrow {
  opacity: 0.5;
}

</style>
<template>
  <div id="app" data-app>
    <load-ing :active.sync="isLoading" :can-cancel="true" :is-full-page="true"></load-ing>

    <b-navbar toggleable="lg" class="navStyle" v-if="getIfAuthenticated" sticky>
      <b-navbar-brand
        href="javascript:void(0)"
        @click="route('dashboard')"
        class="d-flex align-items-center"
      >
        <img src="./assets/Entity_full.png" alt="Logo" class="nav-logo-img" />
      </b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav v-if="userDetails">
        <b-navbar-nav class="ml-auto align-items-center">
          
          <!-- Dev Environment Badge -->
          <b-nav-item v-if="getSelectedService && getSelectedService.env !== 'prod'" class="px-1">
            <div class="env-banner env-banner--dev" title="Development Mode">
              <span class="env-banner__dot"></span>
              <span class="env-banner__label">DEV</span>
            </div>
          </b-nav-item>

          <!-- Tenant Acting-As Badge -->
          <b-nav-item v-if="getSwitchedTenantAccount" class="px-1">
            <div
              class="d-flex align-items-center tenant-wrapper"
              @click="switchBackToAdminAccount"
              title="Click to access your own account"
            >
              <span class="mr-2 d-none d-md-inline text-muted small font-weight-medium">Acting as:</span>
              <div class="tenant-badge">
                <span class="text-truncate tenant-email">{{ getSwitchedTenantAccount }}</span>
                <b-icon icon="box-arrow-in-right" class="ml-1 text-muted"></b-icon>
              </div>
            </div>
          </b-nav-item>

          <!-- Setup MFA Warning Chip -->
          <b-nav-item v-if="!isMFAEnabled" to="/studio/settings?ref=mfa" class="px-1">
            <div class="mfa-warning-badge">
              <b-icon icon="exclamation-triangle-fill" class="mr-1"></b-icon>
              <span>Setup MFA</span>
            </div>
          </b-nav-item>

          <!-- User Profile Dropdown -->
          <b-nav-item-dropdown
            right
            no-caret
            menu-class="profile-dropdown-menu shadow-sm"
          >
            <template #button-content>
              <div class="avatar-container">
                <img
                  v-if="userDetails?.profileIcon"
                  :src="userDetails?.profileIcon"
                  class="profile-img"
                />
                <b-icon
                  v-else
                  icon="person-circle"
                  font-scale="1.3"
                  class="text-secondary"
                ></b-icon>
              </div>
            </template>

            <!-- Left-aligned Header -->
            <div class="px-3 py-2 bg-light border-bottom dropdown-user-header text-left">
              <p class="mb-0 x-small text-muted text-uppercase font-weight-bold">Signed in as</p>
              <p class="mb-0 font-weight-bold text-dark text-truncate" style="max-width: 200px">
                {{ userDetails.name || "User" }}
              </p>
            </div>

            <!-- Left-aligned Email -->
            <b-dropdown-item
              @click="copyToClip(userDetails.email, 'Email')"
              class="py-2"
            >
              <b-icon icon="envelope" class="mr-2 text-muted"></b-icon>
              {{ shorten(userDetails.email) }}
            </b-dropdown-item>

            <b-dropdown-divider class="my-1"></b-dropdown-divider>

            <!-- Left-aligned Nav Links -->
            <b-dropdown-item @click="goTo('/studio/dashboard')">
              <b-icon icon="house" class="mr-2 text-muted"></b-icon> Home
            </b-dropdown-item>

            <b-dropdown-item @click="goTo('/studio/settings')">
              <b-icon icon="gear" class="mr-2 text-muted"></b-icon> Settings
            </b-dropdown-item>

            <b-dropdown-divider class="my-1"></b-dropdown-divider>

            <!-- Left-aligned Logout -->
            <b-dropdown-item @click="logoutAll()" variant="danger">
              <b-icon icon="power" class="mr-2"></b-icon> Logout
            </b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>



    <!-- Environment badge rendered inside navbar (Option B) -->

    <div
      :class="[isSidebarCollapsed ? 'container-collapsed-not' : 'container-collapsed']"
    >
      <router-view class="container containerData" />
    </div>
    <notifications group="foo" />

    <sidebar-menu
      :key="sidebarKey"
      :relative="false"
      class="sidebar-wrapper"
      v-if="
        userDetails &&
        Object.keys(userDetails).length > 0 &&
        showSideNavbar &&
        getSelectedService
      "
      @toggle-collapse="onToggleCollapse"
      :collapsed="isSidebarCollapsed"
      :theme="'white-theme'"
      width="200px"
      :menu="getSideMenu()"
    >
      <div slot="header" class="sidebar-app-header">
        <div class="sidebar-app-avatar">
          <img
            :src="
              getSelectedService.logoUrl ||
              getProfileIcon(formattedAppName(getSelectedService.appName))
            "
            class="sidebar-app-logo"
            alt="App logo"
          />
        </div>
        <span class="sidebar-app-name">
          {{ getSelectedService ? getSelectedService.appName : "" }}
        </span>
      </div>
    </sidebar-menu>
  </div>
</template>

<script>
import UtilsMixin from "./mixins/utils";
import EventBus from "./eventbus";
import { mapActions, mapMutations, mapGetters, mapState } from "vuex";
import { RequestHandler } from "./utils/utils";
import config from "./config";
import * as EN from "./language/en";
export default {
  computed: {
    ...mapGetters("playgroundStore", ["getSelectedOrg"]),
    ...mapGetters("mainStore", [
      "getSwitchedTenantAccount",
      "getSelectedService",
      "getAllServices",
      "getIfAuthenticated",
      "getUserDetails",
      "isMFAEnabled",
    ]),
    ...mapState({
      showMainSideNavBar: (state) => state.mainStore.showMainSideNavBar,
      selectedDashboard: (state) => state.globalStore.selectedDashboard,
      appList: (state) => state.mainStore.appList,
    }),
    selectedOrg() {
      return this.getSelectedOrg;
    },
    showSideNavbar() {
      return this.$store.state.playgroundStore.showSideNavbar && this.showMainSideNavBar;
    },
  },
  data() {
    return {
      isLoading: false,
      collapsed: true,
      isSidebarCollapsed: true,
      sidebarKey: 0,
      schema_page: 1,
      authRoutes: ["register", "PKIIdLogin"],
      userDetails: {},
      loggedInUserEmailId: "",
      parseAuthToken: null,
      authToken: null,
    };
  },

  mounted() {
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
      // console.log('No userDetails found yet...')
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
      this.initializeStore();
    });

    EventBus.$on("logoutAll", () => {
      this.logoutAll();
    });

    EventBus.$on("permissionDenied", (message) => {
      this.notifyErr(message || "You don't have permission to perform this action.");
    });
  },
  watch: {
    // Re-mount the sidebar on every navigation so that only the active
    // category stays open and all others collapse.
    $route() {
      this.sidebarKey++;
    },
  },
  methods: {
    ...mapActions("mainStore", [
      "fetchAppsListFromServer",
      "fetchServicesList",
      "switchToAdmin",
    ]),
    ...mapMutations("mainStore", [
      "resetMainStore",
      "setIsLoggedOut",
      "resetStoreForTeantSwitch",
    ]),
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
        this.$router.push({ name });
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
      this.setIsLoggedOut(false);
      this.logout();
      if (this.$route.path !== "/login") this.$router.push("/login");
    },

    goTo(path) {
      if (this.$route.path !== path) this.$router.push(path);
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
      const authTokne = localStorage.getItem("authToken");
      if (!authTokne) {
        this.parseAuthToken = null;
        return;
      }
      const base64Url = authTokne.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        window
          .atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );
      const parsedjsonPayload = JSON.parse(jsonPayload);
      const { exp } = parsedjsonPayload;
      if (!this.checkIfDateExpired(exp)) {
        this.parseAuthToken = parsedjsonPayload;
      } else {
        this.parseAuthToken = null;
      }
    },
    checkIfDateExpired(datetimestamp) {
      const currentTime = Math.floor(Date.now() / 1000);
      if (datetimestamp < currentTime) {
        return true;
      } else {
        return false;
      }
    },
    async initializeStore() {
      try {
        const userDetails = this.getUserDetails; //localStorage.getItem("user");
        if (userDetails) {
          this.parseAuthToken = this.getUserDetails;
          this.setIsLoggedOut(true);
          const redirectPath =
            localStorage.getItem("postLoginRedirect") || "/studio/dashboard";
          localStorage.removeItem("postLoginRedirect");
          this.$router.push(redirectPath).then(() => {
            this.$router.go(0);
          });
        } else {
          throw new Error("No user details found in localStorage");
        }
      } catch (e) {
        this.setIsLoggedOut(false);
        this.notifyErr(`Error:  ${e.message}`);
      }
    },
    getSideMenu() {
      const menu = [];

      if (this.getSelectedService && this.getSelectedService.services.length > 0) {
        const id = this.getSelectedService.services[0].id;
        const appId = this.getSelectedService.appId;

        if (id == "CAVACH_API") {
          // Getting Started
          menu.push({
            href: "/studio/getting-started/" + appId,
            title: EN.NAV.GETTING_STARTED,
            icon: "mdi mdi-flag-checkered",
          });

          // Identity Verification
          const ivChildren = [
            { href: "/studio/sessions/" + appId, title: EN.NAV.IDENTITY_VERIFICATION.USERS, icon: "mdi mdi-account-group-outline", alias: "/studio/sessions/:appId/:sessionId" },
            { href: "/studio/user-analytics/" + appId, title: EN.NAV.IDENTITY_VERIFICATION.USER_ANALYTICS, icon: "mdi mdi-chart-line" },
            { href: "/studio/widget-config/" + appId, title: EN.NAV.IDENTITY_VERIFICATION.KYC_WIDGET, icon: "mdi mdi-widgets-outline" },
          ];
          menu.push({ href: "", title: EN.NAV.IDENTITY_VERIFICATION.TITLE, icon: "mdi mdi-account-check-outline", child: ivChildren });

          // Business Verification
          const bvChildren = [
            { href: "/studio/business/" + appId, title: EN.NAV.BUSINESS_VERIFICATION.BUSINESSES, icon: "mdi mdi-briefcase-outline", alias: ["/studio/business/:appId/details/:companyId", "/studio/business/:appId/details/:companyId/:tab"] },
            { href: "/studio/kyb-widget-config/" + appId, title: EN.NAV.BUSINESS_VERIFICATION.KYB_WIDGET, icon: "mdi mdi-widgets-outline" },
          ];
          menu.push({ href: "", title: EN.NAV.BUSINESS_VERIFICATION.TITLE, icon: "mdi mdi-domain", child: bvChildren });

          // Solutions
          const solChildren = [
            { href: "/studio/kyc-webpage-generator/" + appId, title: EN.NAV.SOLUTIONS.KYC_VERIFIER_CONFIGURATION, icon: "mdi mdi-web" },
            { href: "/studio/kyb-webpage-generator/" + appId, title: EN.NAV.SOLUTIONS.KYB_VERIFIER_CONFIGURATION, icon: "mdi mdi-web" },
            { href: "/studio/solutions/reusable-id/" + appId, title: EN.NAV.SOLUTIONS.RESUABLE_ID, icon: "mdi mdi-card-account-details-outline" },
          ];
          menu.push({ href: "", title: EN.NAV.SOLUTIONS.TITLE, icon: "mdi mdi-lightbulb-outline", child: solChildren });

          // Developer Hub
          const devChildren = [
            { href: "/studio/developer/api-key/" + appId, title: EN.NAV.DEVELOPERS_HUB.API_KEY, icon: "mdi mdi-key-outline" },
            { href: "/studio/developer/webhook/" + appId, title: EN.NAV.DEVELOPERS_HUB.WEBHOOK, icon: "mdi mdi-webhook" },
            { href: "/studio/service-config/" + appId, title: EN.NAV.DEVELOPERS_HUB.SERVICE_CONFIGURATION, icon: "mdi mdi-cog-outline" },
          ];
          menu.push({ href: "", title: EN.NAV.DEVELOPERS_HUB.TITLE, icon: "mdi mdi-code-tags", child: devChildren });

          // Billing & Usage
          const billingChildren = [
            { href: "/studio/onchainkyc/credit/" + appId, title: EN.NAV.BILLING_AND_USAGE.CREDIT, icon: "mdi mdi-cash-multiple" },
            { href: "/studio/usage/" + appId, title: EN.NAV.BILLING_AND_USAGE.USAGES, icon: "mdi mdi-chart-bar" },
          ];
          menu.push({ href: "", title: EN.NAV.BILLING_AND_USAGE.TITLE, icon: "mdi mdi-credit-card-outline", child: billingChildren });
        } else if (id === "SSI_API") {
          menu.push({ href: "/studio/ssi/did/" + appId, title: "DIDs", icon: "mdi mdi-badge-account-horizontal-outline" });
          menu.push({ href: "/studio/ssi/schema/" + appId, title: "Schemas", icon: "mdi mdi-file-tree" });
          menu.push({ href: "/studio/ssi/credential/" + appId, title: "Credential", icon: "mdi mdi-certificate-outline" });
          menu.push({ href: "/studio/ssi/usage/" + appId, title: EN.NAV.BILLING_AND_USAGE.USAGES, icon: "mdi mdi-chart-bar" });
          menu.push({ href: "/studio/ssi/credit/" + appId, title: EN.NAV.BILLING_AND_USAGE.CREDIT, icon: "mdi mdi-cash-multiple" });
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
      RequestHandler(`${config.studioServer.BASE_URL}api/v1/auth/logout`, "POST", {})
        .then(() => {
          this.isLoading = false;
        })
        .catch((err) => {
          this.isLoading = false;
          console.error("Logout error:", err);
        });

      // Clear all localStorage
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
        this.isLoding = true;
        await this.switchToAdmin({
          adminId: this.userDetails.userId,
        });
        this.resetStoreForTeantSwitch();
        this.isLoading = false;
        this.$router.push("/studio/dashboard").then(() => {
          this.$router.go(0);
        });
      } catch (e) {
        this.notifyErr(e.message);
        this.isLoading = false;
      }
    },
    async fetchLoggedInUser() {
      if (this.getUserDetails) {
        this.userDetails = this.getUserDetails;
        this.loggedInUserEmailId = this.userDetails?.accessAccount?.email;
        this.setIsLoggedOut(true);
      }
    },
  },
  mixins: [UtilsMixin],
};
</script>
