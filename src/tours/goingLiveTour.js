import { driver } from "driver.js";

function stepTitle(number, title, complete) {
  const label = `${number}. ${title}`;
  if (!complete) return label;
  return `${label}<span class="studio-tour-complete-badge" aria-label="Requirement met"><span aria-hidden="true">✓</span></span>`;
}

export function startGoingLiveTour({
  allRequirementsMet = false,
  companySubmitted = false,
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
          title: "Prepare for Production",
          description: "Secure your account, verify your domain, and submit your company details before processing live verifications.",
          side: "bottom",
          align: "start",
        },
      },
      {
        element: '[data-tour="go-live-mfa"]',
        popover: {
          title: stepTitle(1, "Enable multi-factor authentication", mfaEnabled),
          description: mfaEnabled
            ? "Multi-factor authentication is enabled for your account."
            : "Enable multi-factor authentication to protect access to production data and settings.",
          side: "bottom",
          align: "start",
        },
      },
      {
        element: '[data-tour="go-live-domain"]',
        popover: {
          title: stepTitle(2, "Verify your domain", domainVerified),
          description: domainVerified
            ? "Your application domain is verified."
            : "Add the provided DNS TXT record to confirm ownership of your application domain.",
          side: "bottom",
          align: "start",
        },
      },
      {
        element: '[data-tour="go-live-company"]',
        popover: {
          title: stepTitle(3, "Submit company details", companySubmitted),
          description: companySubmitted
            ? "Your company details have been submitted. You can continue while they are reviewed."
            : "Provide your registered company information and supporting documents to request production access.",
          side: "bottom",
          align: "start",
        },
      },
      {
        element: '[data-tour="go-live-review"]',
        popover: {
          title: "Company review",
          description: "Production access is available after submission. We’ll contact you only if more information is required.",
          side: "top",
          align: "start",
        },
      },
      {
        element: '[data-tour="switch-production"]',
        popover: {
          title: allRequirementsMet ? "Ready for Production" : "Production requirements",
          description: allRequirementsMet
            ? "Your app is ready. Switch to Production when you’re prepared to process live verifications."
            : "Switch to Production becomes available after all three requirements are met.",
          side: "top",
          align: "end",
        },
      },
    ],
  });

  tour.drive();
  return tour;
}

