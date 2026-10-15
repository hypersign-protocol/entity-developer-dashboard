// Team-member permissions, checked the same way the dashboard service does:
//   - in their own account the user can do everything (the backend skips the check
//     when the session has no tenant)
//   - in a team account (after "switch to team") the role's permission list decides:
//     an entry { serviceType, access } allows `access`, and access 'ALL' allows everything
//     for that service
// The UI uses this to hide what a teammate can't use; the backend still enforces it.

export const SERVICE = Object.freeze({
  DASHBOARD: 'DASHBOARD',
  KYC: 'CAVACH_API',
  SSI: 'SSI_API',
});

export function hasAccess({ isTeamAccount, accessList }, serviceType, access) {
  if (!isTeamAccount) return true;
  return (accessList || []).some(permission =>
    permission.serviceType === serviceType && (permission.access === 'ALL' || permission.access === access)
  );
}

// Permission each app page needs, by path prefix (the part after it is the appId and
// sub-routes). Used for both the side menu and direct navigation; pages not listed are
// open to everyone in the account.
const PAGE_ACCESS = [
  // KYC / KYB app (CAVACH_API)
  { prefix: '/studio/sessions/', service: SERVICE.KYC, access: 'READ_SESSION' },
  { prefix: '/studio/user-analytics/', service: SERVICE.KYC, access: 'READ_ANALYTICS' },
  { prefix: '/studio/widget-config/', service: SERVICE.KYC, access: 'READ_WIDGET_CONFIG' },
  { prefix: '/studio/business/', service: SERVICE.KYC, access: 'READ_COMPANY' },
  { prefix: '/studio/kyb-widget-config/', service: SERVICE.KYC, access: 'READ_WIDGET_CONFIG' },
  { prefix: '/studio/developer/webhook/', service: SERVICE.KYC, access: 'READ_WEBHOOK_CONFIG' },
  { prefix: '/studio/onchainkyc/credit/', service: SERVICE.KYC, access: 'READ_CREDIT' },
  { prefix: '/studio/usage/', service: SERVICE.KYC, access: 'READ_USAGE' },
  // App settings (dashboard service)
  { prefix: '/studio/service-config/', service: SERVICE.DASHBOARD, access: 'READ_SERVICE' },
  // SSI app
  { prefix: '/studio/ssi/did/', service: SERVICE.SSI, access: 'READ_DID' },
  { prefix: '/studio/ssi/schema/', service: SERVICE.SSI, access: 'READ_SCHEMA' },
  { prefix: '/studio/ssi/credential/', service: SERVICE.SSI, access: 'READ_CREDENTIAL' },
  { prefix: '/studio/ssi/usage/', service: SERVICE.SSI, access: 'READ_USAGE' },
  { prefix: '/studio/ssi/credit/', service: SERVICE.SSI, access: 'READ_CREDIT' },
];

export function pageAccess(path) {
  return PAGE_ACCESS.find(rule => String(path || '').startsWith(rule.prefix)) || null;
}

export function canOpenPage(context, path) {
  const rule = pageAccess(path);
  return !rule || hasAccess(context, rule.service, rule.access);
}
