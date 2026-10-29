import { driver } from "driver.js";

const TOUR_VERSION = "1";
const TOUR_STORAGE_PREFIX = "studio-product-tour";

function tourStorageKey(user) {
  const identity = user?.email || user?.accessAccount?.email || user?._id || "user";
  return `${TOUR_STORAGE_PREFIX}:${TOUR_VERSION}:${identity}`;
}

export function hasCompletedStudioTour(user) {
  return localStorage.getItem(tourStorageKey(user)) === "complete";
}

export function markStudioTourCompleted(user) {
  localStorage.setItem(tourStorageKey(user), "complete");
}

export function startStudioTour(user) {
  const tour = driver({
    animate: true,
    allowClose: true,
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
    onDestroyed: () => {
      markStudioTourCompleted(user);
    },
    steps: [
      {
        popover: {
          title: "Welcome to Entity Studio",
          description: "Take a quick tour of the tools you’ll use to configure and manage your service.",
          side: "bottom",
          align: "center",
        },
      },
      {
        element: '[data-tour="current-service"]',
        popover: {
          title: "Selected service",
          description: "Navigation and configuration changes apply to this service.",
          side: "right",
          align: "start",
        },
      },
      {
        element: '[data-tour="service-navigation"]',
        popover: {
          title: "Service navigation",
          description: "Access verification workflows, integration settings, usage, and billing.",
          side: "right",
          align: "center",
        },
      },
      {
        element: '[data-tour="environment-status"]',
        popover: {
          title: "Active environment",
          description: "Confirm whether you’re working in Development or Production before updating credentials or integrations.",
          side: "bottom",
          align: "end",
        },
      },
      {
        element: '[data-tour="workspace"]',
        popover: {
          title: "Workspace",
          description: "The page you select from the navigation opens here.",
          side: "top",
          align: "center",
        },
      },
      {
        element: '[data-tour="account-menu"]',
        popover: {
          title: "Account settings",
          description: "Manage your profile, security settings, and workspace access.",
          side: "bottom",
          align: "end",
        },
      },
    ],
  });

  tour.drive();
  return tour;
}

