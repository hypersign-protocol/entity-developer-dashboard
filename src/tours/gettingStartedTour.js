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
            ? 'This is the Getting Started page you are viewing now. Use it as the launch roadmap for this service.'
            : isGroup
              ? `This section groups the ${title} tools and pages shown underneath it.`
              : `Open ${title} from this navigation item.`,
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
          title: "Current service",
          description: "This identifies the service you are currently configuring. The roadmap and links on this page apply to this service.",
          side: "right",
          align: "start",
        },
      },
      {
        element: '[data-tour="service-navigation"]',
        popover: {
          title: "Service navigation",
          description: "Use this menu to move between verification tools, solutions, developer settings, billing, and usage for the selected service.",
          side: "right",
          align: "center",
        },
      },
      ...sidebarItemSteps,
      {
        element: '[data-tour="getting-started-header"]',
        popover: {
          title: "Your launch roadmap",
          description: "This page brings together the main steps for testing, integrating, and launching your verification flow.",
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
          description: "Create a hosted, branded verification page and test the experience before writing integration code.",
          side: "right",
          align: "start",
        },
      },
      {
        element: '[data-tour="getting-started-integration"]',
        popover: {
          title: "2. Choose an integration",
          description: "Decide whether to embed the ID Widget or connect directly through the KYC APIs.",
          side: "right",
          align: "start",
        },
      },
      {
        element: '[data-tour="getting-started-team"]',
        popover: {
          title: "3. Bring in your team",
          description: "Invite developers, compliance members, and collaborators so each person can work with the appropriate access.",
          side: "right",
          align: "start",
        },
      },
      {
        element: '[data-tour="getting-started-production"]',
        popover: {
          title: "4. Prepare for Production",
          description: "When testing is complete, use the go-live checklist to verify your domain, enable MFA, and submit company details.",
          side: "right",
          align: "start",
        },
      },
      {
        element: '[data-tour="getting-started-help"]',
        popover: {
          title: "5. Get help when needed",
          description: "Contact support for setup, integration, or compliance guidance. You can also restart this walkthrough here.",
          side: "right",
          align: "start",
        },
      },
      {
        element: '[data-tour="getting-started-resources"]',
        popover: {
          title: "Integration resources",
          description: "Open the API integration guide, browse hands-on tutorials, or contact the support team.",
          side: "left",
          align: "start",
        },
      },
      {
        element: '[data-tour="getting-started-business"]',
        popover: {
          title: "Business verification",
          description: "Configure a Business Verifier Page when your workflow needs to onboard companies and stakeholders.",
          side: "left",
          align: "start",
        },
      },
      {
        element: '[data-tour="getting-started-case-studies"]',
        popover: {
          title: "Learn from real implementations",
          description: "Explore case studies to see how other teams structure identity and onboarding experiences.",
          side: "left",
          align: "start",
        },
      },
    ],
  });

  tour.drive();
  return tour;
}

