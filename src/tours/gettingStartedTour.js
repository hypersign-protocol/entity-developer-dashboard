import { driver } from "driver.js";

function setSidebarGroupActive(element, active) {
  const item = element.closest('.vsm--item');
  if (item) item.classList.toggle('tour-sidebar-item-active', active);
}

export function startGettingStartedTour({
  onDestroyed,
  onSidebarComplete,
  onSidebarStart,
} = {}) {
  const sidebarItemSteps = Array.from(document.querySelectorAll('[data-tour-sidebar-level="1"]'))
    .filter(element => element.getClientRects().length > 0)
    .map((element, index, elements) => {
      const title = element.getAttribute('data-tour-title') || 'Navigation item';
      const isGroup = element.getAttribute('data-tour-sidebar-group') === 'true';
      const isCurrentPage = element.classList.contains('vsm--link_active');
      const isLastSidebarItem = index === elements.length - 1;
      const itemArea = element.closest('.vsm--item') || element;
      const step = {
        // Target the whole menu item so the spotlight grows around its submenu
        // after the heading opens, rather than remaining on the heading row.
        element: itemArea,
        onHighlighted: (_, __, { driver: activeDriver }) => {
          if (!isGroup) return;
          setSidebarGroupActive(element, true);
          setTimeout(() => activeDriver.refresh(), 200);
        },
        onDeselected: () => {
          if (isGroup) setSidebarGroupActive(element, false);
        },
        popover: {
          title,
          description: isCurrentPage
            ? 'You’re viewing Getting Started, the launch roadmap for this service.'
            : isGroup
              ? `Explore the ${title} tools and pages in this section.`
              : `Open ${title} from here.`,
          side: "right",
          align: "center",
        },
      };

      if (isLastSidebarItem) {
        step.popover.onNextClick = (_, __, { driver: activeDriver }) => {
          if (isGroup) setSidebarGroupActive(element, false);
          onSidebarComplete?.();
          setTimeout(() => activeDriver.moveNext(), 250);
        };
      }

      return step;
    });

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
    onDestroyed: (...args) => {
      document.querySelectorAll('.tour-sidebar-item-active')
        .forEach(item => item.classList.remove('tour-sidebar-item-active'));
      onDestroyed?.(...args);
    },
    steps: [
      {
        element: '[data-tour="current-service"]',
        popover: {
          title: "Selected service",
          description: "Every step in this guide applies to the service shown here.",
          side: "right",
          align: "start",
        },
      },
      {
        element: '[data-tour="service-navigation"]',
        popover: {
          title: "Service navigation",
          description: "Navigate verification workflows, integrations, developer settings, usage, and billing.",
          side: "right",
          align: "center",
        },
      },
      ...sidebarItemSteps,
      {
        element: '[data-tour="getting-started-header"]',
        popover: {
          title: "Launch roadmap",
          description: "Follow these steps to test, integrate, and launch your verification flow.",
          side: "bottom",
          align: "start",
          onPrevClick: (_, __, { driver: activeDriver }) => {
            onSidebarStart?.();
            setTimeout(() => activeDriver.movePrevious(), 250);
          },
        },
      },
      {
        element: '[data-tour="getting-started-magic-link"]',
        popover: {
          title: "1. Test with a Magic Link",
          description: "Create a hosted, branded verification page and validate the experience before you integrate.",
          side: "right",
          align: "start",
        },
      },
      {
        element: '[data-tour="getting-started-integration"]',
        popover: {
          title: "2. Choose your integration",
          description: "Embed the ID Widget for a ready-made experience, or use the KYC APIs for greater control.",
          side: "right",
          align: "start",
        },
      },
      {
        element: '[data-tour="getting-started-team"]',
        popover: {
          title: "3. Invite your team",
          description: "Give developers, compliance teams, and collaborators the access they need.",
          side: "right",
          align: "start",
        },
      },
      {
        element: '[data-tour="getting-started-production"]',
        popover: {
          title: "4. Prepare for Production",
          description: "Use the go-live checklist to secure your account, verify your domain, and submit company details.",
          side: "right",
          align: "start",
        },
      },
      {
        element: '[data-tour="getting-started-help"]',
        popover: {
          title: "5. Get support",
          description: "Contact our team for guidance on setup, integration, or compliance.",
          side: "right",
          align: "start",
        },
      },
      {
        element: '[data-tour="getting-started-resources"]',
        popover: {
          title: "Developer resources",
          description: "Use the integration guide and tutorials to plan and build your implementation.",
          side: "left",
          align: "start",
        },
      },
      {
        element: '[data-tour="getting-started-business"]',
        popover: {
          title: "Business verification",
          description: "Create a Business Verifier Page to onboard companies and their stakeholders.",
          side: "left",
          align: "start",
        },
      },
      {
        element: '[data-tour="getting-started-case-studies"]',
        popover: {
          title: "Customer stories",
          description: "See how other organizations use Hypersign to build verification and onboarding experiences.",
          side: "left",
          align: "start",
        },
      },
    ],
  });

  tour.drive();
  return tour;
}

