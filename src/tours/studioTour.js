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
      localStorage.setItem(tourStorageKey(user), "complete");
    },
    steps: [
      {
        popover: {
          title: "Welcome to Entity Studio",
          description: "Here is a quick look at the controls you will use to manage your service.",
          side: "bottom",
          align: "center",
        },
      },
      {
        element: '[data-tour="current-service"]',
        popover: {
          title: "Current service",
          description: "This shows the service you are currently managing.",
          side: "right",
          align: "start",
        },
      },
      {
        element: '[data-tour="service-navigation"]',
        popover: {
          title: "Service navigation",
          description: "Access verification tools, solutions, developer settings, billing, and usage from here.",
          side: "right",
          align: "center",
        },
      },
      {
        element: '[data-tour="environment-status"]',
        popover: {
          title: "Environment status",
          description: "Always check the active environment before changing credentials or integrations.",
          side: "bottom",
          align: "end",
        },
      },
      {
        element: '[data-tour="workspace"]',
        popover: {
          title: "Your workspace",
          description: "The page selected from the navigation opens here.",
          side: "top",
          align: "center",
        },
      },
      {
        element: '[data-tour="account-menu"]',
        popover: {
          title: "Account and help",
          description: "Manage your profile and settings, or restart this tour whenever you need it.",
          side: "bottom",
          align: "end",
        },
      },
    ],
  });

  tour.drive();
  return tour;
}

