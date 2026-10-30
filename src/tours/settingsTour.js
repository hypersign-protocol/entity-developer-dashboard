import { driver } from "driver.js";

const SETTINGS_TOUR_VERSION = "1";
const SETTINGS_TOUR_STORAGE_PREFIX = "studio-settings-tour";

function settingsTourStorageKey(user, tourId) {
  const identity = user?.email || user?.accessAccount?.email || user?._id || "user";
  return `${SETTINGS_TOUR_STORAGE_PREFIX}:${SETTINGS_TOUR_VERSION}:${identity}:${tourId}`;
}

export function hasFinishedSettingsTour(user, tourId) {
  return localStorage.getItem(settingsTourStorageKey(user, tourId)) === "finished";
}

export function markSettingsTourFinished(user, tourId) {
  localStorage.setItem(settingsTourStorageKey(user, tourId), "finished");
}

function sectionTabStep({ element, title, description, section, previousSection, showSection }) {
  return {
    element,
    onHighlighted: (_, __, { driver: activeDriver }) => {
      showSection?.(section);
      setTimeout(() => activeDriver.refresh(), 200);
    },
    popover: {
      title,
      description,
      side: "bottom",
      align: "start",
      ...(previousSection ? {
        onPrevClick: (_, __, { driver: activeDriver }) => {
          showSection?.(previousSection);
          setTimeout(() => activeDriver.movePrevious(), 200);
        },
      } : {}),
    },
  };
}

function profileSteps(showSection) {
  return [
    sectionTabStep({
      element: '[data-tour="settings-tab-profile"]',
      title: "Profile & security",
      description: "Review your account details, sign-in security, and the permissions assigned to you.",
      section: { main: "profile" },
      showSection,
    }),
    {
      element: '[data-tour="settings-profile-summary"]',
      popover: {
        title: "Account overview",
        description: "Check your role, multi-factor authentication status, membership dates, and account actions.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: '[data-tour="settings-profile-security"]',
      popover: {
        title: "Sign-in security",
        description: "Set up or manage the authenticator apps that protect your account.",
        side: "right",
        align: "start",
      },
    },
    {
      element: '[data-tour="settings-profile-permissions"]',
      popover: {
        title: "Your permissions",
        description: "See which actions your assigned role allows across each service.",
        side: "left",
        align: "start",
      },
    },
  ];
}

function teamSteps(showSection) {
  return [
    sectionTabStep({
      element: '[data-tour="settings-tab-members"]',
      title: "Members & roles",
      description: "Manage teammates, reusable access levels, and current workspace access.",
      section: { main: "members", sub: "members" },
      showSection,
    }),
    {
      element: '[data-tour="settings-members-actions"]',
      popover: {
        title: "Invite and review members",
        description: "Invite a teammate or refresh the directory to retrieve the latest membership status.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: '[data-tour="settings-members-list"]',
      popover: {
        title: "Member directory",
        description: "Review each teammate’s role and invitation status, then update or remove access when needed.",
        side: "top",
        align: "start",
      },
    },
    sectionTabStep({
      element: '[data-tour="settings-members-subtab-roles"]',
      title: "Roles & permissions",
      description: "Create reusable access levels and control what teammates can see and do.",
      section: { main: "members", sub: "roles" },
      previousSection: { main: "members", sub: "members" },
      showSection,
    }),
    {
      element: '[data-tour="settings-roles-list"]',
      popover: {
        title: "Role directory",
        description: "Review permission counts and use the action menu to update a custom role.",
        side: "top",
        align: "start",
      },
    },
    sectionTabStep({
      element: '[data-tour="settings-members-subtab-live-access"]',
      title: "Live access",
      description: "See who is currently signed in, their role, and when their access began.",
      section: { main: "members", sub: "live-access" },
      previousSection: { main: "members", sub: "roles" },
      showSection,
    }),
  ];
}

function invitationSteps(showSection) {
  return [
    sectionTabStep({
      element: '[data-tour="settings-tab-invitions"]',
      title: "My invitations",
      description: "Review invitations you’ve received to join other workspaces.",
      section: { main: "invitions" },
      showSection,
    }),
    {
      element: '[data-tour="settings-invitations-actions"]',
      popover: {
        title: "Find an invitation",
        description: "Enter an invitation code or refresh the page to retrieve the latest invitations.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: '[data-tour="settings-invitations-list"]',
      popover: {
        title: "Invitation details",
        description: "Review the workspace owner and status, then accept an invitation when you’re ready to join.",
        side: "top",
        align: "start",
      },
    },
  ];
}

function ssiSteps(showSection) {
  return [
    sectionTabStep({
      element: '[data-tour="settings-tab-ssi"]',
      title: "SSI settings",
      description: "Open the identity services available to your workspace.",
      section: { main: "ssi" },
      showSection,
    }),
    {
      element: '[data-tour="settings-ssi-overview"]',
      popover: {
        title: "SSI service administration",
        description: "Review and manage the Self-Sovereign Identity services connected to your account.",
        side: "top",
        align: "start",
      },
    },
  ];
}

function superAdminSteps(showSection) {
  return [
    sectionTabStep({
      element: '[data-tour="settings-tab-super-admin"]',
      title: "Super admin tools",
      description: "Open restricted operational controls available to super administrators.",
      section: { main: "super-admin", sub: "onboarding" },
      showSection,
    }),
    {
      element: '[data-tour="settings-super-admin-overview"]',
      popover: {
        title: "Administrative operations",
        description: "Manage onboarding approvals, credit recharges, and KYB compliance reviews.",
        side: "top",
        align: "start",
      },
    },
  ];
}

const TOUR_STEP_BUILDERS = {
  profile: profileSteps,
  team: teamSteps,
  invitations: invitationSteps,
  ssi: ssiSteps,
  "super-admin": superAdminSteps,
};

export function startSettingsTour({ tourId = "profile", onDestroyed, showSection } = {}) {
  const buildSteps = TOUR_STEP_BUILDERS[tourId] || TOUR_STEP_BUILDERS.profile;
  const tour = driver({
    animate: true,
    allowClose: true,
    allowScroll: false,
    disableActiveInteraction: true,
    overlayClickBehavior: "close",
    overlayColor: "#0f172a",
    overlayOpacity: 0.48,
    popoverClass: "studio-tour-popover",
    progressText: "{{current}} of {{total}}",
    showButtons: ["next", "previous", "close"],
    showProgress: true,
    skipMissingElement: true,
    smoothScroll: true,
    stagePadding: 6,
    stageRadius: 10,
    waitForElement: 1200,
    nextBtnText: "Next",
    prevBtnText: "Back",
    doneBtnText: "Finish",
    onDestroyed,
    steps: buildSteps(showSection),
  });

  tour.drive();
  return tour;
}
