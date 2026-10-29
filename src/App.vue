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

/* Profile menu: avatar button, identity header, items (dashboard theme) */
.profile-avatar {
  align-items: center;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 50%;
  color: #1d4ed8;
  display: inline-flex;
  flex: 0 0 auto;
  font-size: 12px;
  font-weight: 700;
  height: 32px;
  justify-content: center;
  letter-spacing: 0.02em;
  overflow: hidden;
  width: 32px;
}
.profile-avatar.large { font-size: 14px; height: 40px; width: 40px; }
.profile-avatar img { height: 100%; object-fit: cover; width: 100%; }

::v-deep .profile-toggle { padding-bottom: 4px !important; padding-top: 4px !important; }
::v-deep .profile-toggle:focus-visible .profile-avatar { box-shadow: 0 0 0 2px #bfdbfe; }

::v-deep .profile-dropdown-menu {
  border: 1px solid #dbe3ef !important;
  border-radius: 10px !important;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.12) !important;
  margin-top: 6px !important;
  min-width: 260px !important;
  padding: 6px !important;
  text-align: left !important;
}
::v-deep .profile-dropdown-menu .dropdown-divider { border-color: #eef2f6; margin: 6px 0; }

::v-deep .profile-header {
  align-items: center;
  display: flex;
  gap: 10px;
  margin: 0;
  padding: 6px 6px 4px;
}
.profile-identity { display: flex; flex-direction: column; min-width: 0; }
.profile-identity strong {
  color: #111827;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.profile-email { align-items: center; color: #64748b; display: flex; font-size: 12px; gap: 4px; min-width: 0; }
.profile-email > span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.profile-copy {
  align-items: center;
  background: none;
  border: 0;
  border-radius: 4px;
  color: #94a3b8;
  display: inline-flex;
  flex: 0 0 auto;
  height: 22px;
  justify-content: center;
  padding: 0;
  width: 22px;
}
.profile-copy:hover { background: #f1f5f9; color: #1d4ed8; }

::v-deep .profile-item {
  align-items: center;
  border-radius: 6px;
  color: #334155 !important;
  display: flex !important;
  font-size: 13px;
  gap: 10px;
  padding: 8px 10px !important;
  transition: background-color 0.1s ease, color 0.1s ease;
}
::v-deep .profile-item .mdi { color: #64748b; font-size: 17px; line-height: 1; }
::v-deep .profile-item:hover,
::v-deep .profile-item:focus { background: #f1f5f9 !important; color: #111827 !important; outline: none; }
/* Pressed: the theme's light-blue selected state instead of Bootstrap's dark blue */
::v-deep .profile-item:active,
::v-deep .profile-item.active { background: #eff6ff !important; color: #1d4ed8 !important; }
::v-deep .profile-item:active .mdi { color: #1d4ed8; }
/* Log out is plain until hovered, then red */
::v-deep .profile-logout:hover,
::v-deep .profile-logout:focus,
::v-deep .profile-logout:active { background: #fef2f2 !important; color: #dc2626 !important; }
::v-deep .profile-logout:hover .mdi,
::v-deep .profile-logout:focus .mdi,
::v-deep .profile-logout:active .mdi { color: #dc2626; }

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
  margin-left: 200px;
}

.container-collapsed-not {
  margin-left: 70px;
}

.container-collapsed,
.container-collapsed-not {
  min-width: 0;
  transition: margin-left 0.2s ease;
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

/* Collapsed-mode hover: the library draws the hovered item on this layer.
   Solid equivalent of the expanded hover (rgba(0,0,0,0.05) over white), since it
   overlaps page content where a translucent tint would show through. */
.v-sidebar-menu.vsm_white-theme .vsm--mobile-bg,
.vsm--mobile-bg {
  background: #f2f2f2 !important;
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

/* Tour-only accordion view. show-child renders the submenus without changing the
   sidebar items' own open state; these rules reveal only the current section. */
.sidebar-tour-mode > .vsm--scroll-wrapper > .vsm--list > .vsm--item:not(.tour-sidebar-item-active) > .vsm--dropdown {
  display: none !important;
}

.sidebar-tour-mode > .vsm--scroll-wrapper > .vsm--list > .vsm--item.tour-sidebar-item-active > .vsm--dropdown {
  display: block !important;
  height: auto !important;
}

.sidebar-tour-mode > .vsm--scroll-wrapper > .vsm--list > .vsm--item:not(.tour-sidebar-item-active) > .vsm--link .vsm--arrow {
  transform: rotate(0deg) !important;
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
          <b-nav-item v-if="getSelectedService && getSelectedService.env !== 'prod'" class="px-1" data-tour="environment-status">
            <div class="env-banner env-banner--dev" title="Development Mode">
              <span class="env-banner__dot"></span>
              <span class="env-banner__label">Development</span>
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
            toggle-class="profile-toggle"
            menu-class="profile-dropdown-menu"
          >
            <template #button-content>
              <span class="profile-avatar" :title="displayName" data-tour="account-menu">
                <img v-if="userDetails.profileIcon && !avatarFailed" :src="userDetails.profileIcon" alt="" @error="avatarFailed = true" />
                <span v-else aria-hidden="true">{{ userInitials }}</span>
                <span class="sr-only">Account menu for {{ displayName }}</span>
              </span>
            </template>

            <!-- Who is signed in; the email has its own copy button -->
            <b-dropdown-text text-class="profile-header">
              <span class="profile-avatar large" aria-hidden="true">
                <img v-if="userDetails.profileIcon && !avatarFailed" :src="userDetails.profileIcon" alt="" />
                <span v-else>{{ userInitials }}</span>
              </span>
              <span class="profile-identity">
                <strong :title="displayName">{{ displayName }}</strong>
                <span v-if="userDetails.email" class="profile-email">
                  <span :title="userDetails.email">{{ userDetails.email }}</span>
                  <button
                    type="button"
                    class="profile-copy"
                    title="Copy email"
                    aria-label="Copy email"
                    @click.stop="copyToClip(userDetails.email, 'Email')"
                  ><i class="mdi mdi-content-copy" aria-hidden="true"></i></button>
                </span>
              </span>
            </b-dropdown-text>

            <b-dropdown-divider />

            <b-dropdown-item link-class="profile-item" @click="goTo('/studio/dashboard')">
              <i class="mdi mdi-home-outline" aria-hidden="true"></i> Home
            </b-dropdown-item>
            <b-dropdown-item link-class="profile-item" @click="goTo('/studio/settings?ref=profile')">
              <i class="mdi mdi-cog-outline" aria-hidden="true"></i> Settings
            </b-dropdown-item>

            <b-dropdown-divider />

            <b-dropdown-item link-class="profile-item profile-logout" @click="logoutAll()">
              <i class="mdi mdi-logout" aria-hidden="true"></i> Log out
            </b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>



    <!-- Environment badge rendered inside navbar (Option B) -->

    <div
      :class="[isSidebarCollapsed ? 'container-collapsed-not' : 'container-collapsed']"
    >
      <router-view
        :key="$route.params.appId || $route.name"
        class="container containerData"
        data-tour="workspace"
      />
    </div>
    <notifications group="foo" />

    <sidebar-menu
      :key="sidebarKey"
      :relative="false"
      class="sidebar-wrapper"
      :class="{ 'sidebar-tour-mode': tourSidebarExpanded }"
      data-tour="service-navigation"
      v-if="
        userDetails &&
        Object.keys(userDetails).length > 0 &&
        showSideNavbar &&
        getSelectedService
      "
      @toggle-collapse="onToggleCollapse"
      :collapsed="isSidebarCollapsed"
      :show-child="tourSidebarExpanded"
      :theme="'white-theme'"
      width="200px"
      :menu="getSideMenu()"
    >
      <div slot="header" class="sidebar-app-header" data-tour="current-service">
        <AppLogo
          class="sidebar-app-avatar"
          :src="getSelectedService ? getSelectedService.logoUrl : ''"
          :name="getSelectedService ? getSelectedService.appName : ''"
          :seed="getSelectedService ? formattedAppName(getSelectedService.appName) : ''"
          :size="32"
          shape="rounded"
        />
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
import AppLogo from "./components/element/AppLogo.vue";
import { hasCompletedStudioTour, markStudioTourCompleted, startStudioTour } from "./tours/studioTour";
import { startGettingStartedTour } from "./tours/gettingStartedTour";
export default {
  components: { AppLogo },
  computed: {
    ...mapGetters("playgroundStore", ["getSelectedOrg"]),
    ...mapGetters("mainStore", [
      "getSwitchedTenantAccount",
      "canOpenPage",
      "getSelectedService",
      "getAllServices",
      "getIfAuthenticated",
      "getUserDetails",
      "isMFAEnabled",
    ]),
    displayName() {
      const details = this.userDetails || {};
      return details.name || (details.email ? details.email.split('@')[0] : '') || 'User';
    },
    // Up to two initials from the name, else the first letter of the email
    userInitials() {
      const details = this.userDetails || {};
      const words = String(details.name || '').trim().split(/\s+/).filter(Boolean);
      if (words.length) return words.slice(0, 2).map(word => word[0]).join('').toUpperCase();
      return (details.email || 'U')[0].toUpperCase();
    },
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
      // Profile photo failed to load: fall back to initials
      avatarFailed: false,
      activeTour: null,
      tourStartTimer: null,
      tourSidebarExpanded: false,
      sidebarWasCollapsedBeforeTour: null,
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

    this.$root.$on("startGettingStartedTour", this.startGettingStartedProductTour);

    this.scheduleProductTour();
  },
  beforeDestroy() {
    clearTimeout(this.tourStartTimer);
    if (this.activeTour && this.activeTour.isActive()) this.activeTour.destroy();
  },
  watch: {
    // A new photo gets a fresh chance to load
    'userDetails.profileIcon'() {
      this.avatarFailed = false;
    },
    // Re-mount the sidebar on every navigation so that only the active
    // category stays open and all others collapse.
    $route() {
      this.sidebarKey++;
      this.scheduleProductTour();
    },
    getSelectedService() {
      this.scheduleProductTour();
    },
    getIfAuthenticated() {
      this.scheduleProductTour();
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
    scheduleProductTour() {
      clearTimeout(this.tourStartTimer);
      if (!this.getIfAuthenticated || !this.getSelectedService || hasCompletedStudioTour(this.userDetails)) return;

      this.tourStartTimer = setTimeout(() => {
        this.$nextTick(() => {
          if (document.querySelector('[data-tour="service-navigation"]')) this.startProductTour();
        });
      }, 700);
    },
    startProductTour() {
      clearTimeout(this.tourStartTimer);
      if (this.$route.name === "GettingStarted") {
        this.startGettingStartedProductTour();
        return;
      }
      this.$nextTick(() => {
        if (this.activeTour && this.activeTour.isActive()) this.activeTour.destroy();
        this.activeTour = startStudioTour(this.userDetails);
      });
    },
    startGettingStartedProductTour() {
      clearTimeout(this.tourStartTimer);
      if (this.activeTour && this.activeTour.isActive()) this.activeTour.destroy();

      this.sidebarWasCollapsedBeforeTour = this.isSidebarCollapsed;
      this.tourSidebarExpanded = true;
      if (this.isSidebarCollapsed) this.onToggleCollapse(false);

      this.$nextTick(() => {
        this.tourStartTimer = setTimeout(() => {
          this.activeTour = startGettingStartedTour({
            onSidebarComplete: () => {
              this.tourSidebarExpanded = false;
              this.onToggleCollapse(true);
            },
            onSidebarStart: () => {
              this.onToggleCollapse(false);
              this.tourSidebarExpanded = true;
            },
            onDestroyed: () => {
              markStudioTourCompleted(this.userDetails);
              this.tourSidebarExpanded = false;
              this.onToggleCollapse(Boolean(this.sidebarWasCollapsedBeforeTour));
              this.sidebarWasCollapsedBeforeTour = null;
            },
          });
        }, 250);
      });
    },
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

    // Compare the full path so a query (e.g. a Settings tab) still navigates
    goTo(path) {
      if (this.$route.fullPath !== path) this.$router.push(path).catch(() => {});
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
          this.userDetails = userDetails;
          this.loggedInUserEmailId = userDetails?.accessAccount?.email;
          this.parseAuthToken = userDetails;
          this.setIsLoggedOut(true);
          const redirectPath =
            localStorage.getItem("postLoginRedirect") || "/studio/dashboard";
          localStorage.removeItem("postLoginRedirect");
          if (this.$route.path !== redirectPath) {
            await this.$router.replace(redirectPath);
          }
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
            { href: "/studio/sessions/" + appId, title: EN.NAV.IDENTITY_VERIFICATION.USERS, icon: "fa fa-users", alias: "/studio/sessions/:appId/:sessionId" },
            { href: "/studio/user-analytics/" + appId, title: EN.NAV.IDENTITY_VERIFICATION.USER_ANALYTICS, icon: "fa fa-chart-line" },
            { href: "/studio/widget-config/" + appId, title: EN.NAV.IDENTITY_VERIFICATION.KYC_WIDGET, icon: "fa fa-puzzle-piece", alias: ["/studio/widget-config/:appId/new", "/studio/widget-config/:appId/:widgetConfigId"] },
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
            // exactPath: stay highlighted while a transaction is open (?txn=...)
            { href: "/studio/developer/transactions/" + appId, title: EN.NAV.DEVELOPERS_HUB.TRANSACTIONS, icon: "mdi mdi-swap-horizontal", exactPath: true },
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

      // Hide pages the current team member's role doesn't allow, and groups left empty
      const allowed = item => !item.href || this.canOpenPage(item.href);
      const visibleMenu = menu
        .map(item => (item.child ? { ...item, child: item.child.filter(allowed) } : item))
        .filter(item => (item.child ? item.child.length > 0 : allowed(item)));

      const addTourAttributes = (items, prefix = 'sidebar', level = 1) => items.map((item, index) => {
        const tourId = `${prefix}-${index}`;
        const child = item.child ? addTourAttributes(item.child, tourId, level + 1) : item.child;
        return {
          ...item,
          ...(child ? { child } : {}),
          attributes: {
            ...(item.attributes || {}),
            'data-tour-sidebar-item': tourId,
            'data-tour-sidebar-group': child && child.length ? 'true' : 'false',
            'data-tour-sidebar-level': String(level),
            'data-tour-title': item.title,
          },
        };
      });

      return addTourAttributes(visibleMenu);
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
        this.isLoading = true;
        await this.switchToAdmin({
          adminId: this.userDetails.userId,
        });
        this.resetStoreForTeantSwitch();
        await this.$router.replace("/studio/home");
        this.isLoading = false;
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
