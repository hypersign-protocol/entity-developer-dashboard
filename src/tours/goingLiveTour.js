import { driver } from "driver.js";

function stepTitle(number, title, complete) {
  const label = `${number}. ${title}`;
  if (!complete) return label;
  return `${label}<span class="studio-tour-complete-badge" aria-label="Requirement met"><span aria-hidden="true">✓</span></span>`;
}

export function startGoingLiveTour({
  allRequirementsMet = false,
  companySubmitted = false,
  domain = "",
  domainVerified = false,
  mfaEnabled = false,
} = {}) {
  const tour = driver({
    animate: true,
    allowClose: true,
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
    steps: [
      {
        element: '[data-tour="go-live-overview"]',
        popover: {
          title: "Move your app to Production",
          description: "Production apps process real verifications. Complete the readiness checks below before switching environments.",
          side: "bottom",
          align: "start",
        },
      },
      {
        element: '[data-tour="go-live-mfa"]',
        popover: {
          title: stepTitle(1, "Secure your account", mfaEnabled),
          description: mfaEnabled
            ? "Multi-factor authentication is enabled on your account."
            : "Multi-factor authentication protects production access. Use Set up MFA here to complete this step.",
          side: "bottom",
          align: "start",
        },
      },
      {
        element: '[data-tour="go-live-domain"]',
        popover: {
          title: stepTitle(2, "Verify your domain", domainVerified),
          description: domainVerified
            ? `${domain || "Your application domain"} is verified.`
            : "Add the provided DNS TXT record to prove that your organization controls the application domain.",
          side: "bottom",
          align: "start",
        },
      },
      {
        element: '[data-tour="go-live-company"]',
        popover: {
          title: stepTitle(3, "Submit company details", companySubmitted),
          description: companySubmitted
            ? "Your company details were submitted and the compliance review can continue in parallel."
            : "Provide your registered company information and supporting documents. You can go live as soon as they are submitted.",
          side: "bottom",
          align: "start",
        },
      },
      {
        element: '[data-tour="go-live-review"]',
        popover: {
          title: "Review continues in parallel",
          description: "Our compliance team reviews the submitted information after access is enabled and will contact you if clarification is needed.",
          side: "top",
          align: "start",
        },
      },
      {
        element: '[data-tour="switch-production"]',
        popover: {
          title: allRequirementsMet ? "Ready to go live" : "Complete the remaining checks",
          description: allRequirementsMet
            ? "All requirements are complete. Select this button when you are ready to process real verifications."
            : "This button becomes available after all three readiness checks are complete.",
          side: "top",
          align: "end",
        },
      },
    ],
  });

  tour.drive();
  return tour;
}

