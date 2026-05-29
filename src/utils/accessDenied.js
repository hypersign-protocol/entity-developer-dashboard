export function isAccessDeniedError(error) {
  const msg = (typeof error === 'string' ? error : error?.message || '').toLowerCase();
  return (
    msg.includes('permission denied') ||
    msg.includes('forbidden') ||
    msg.includes('access denied') ||
    msg.includes('not authorized') ||
    msg.includes('unauthorized') ||
    msg.includes('you are not authorized to access service of') ||
    msg.includes("don't have permission") ||
    msg.includes('dont have permission') ||
    msg.includes("don't have access") ||
    msg.includes('dont have access') ||
    msg.includes('you do not have access') ||
    msg.includes('access to service of type') ||
    msg.includes('could not fetch accesstoken') ||
    msg.includes('tenant url is null or empty') ||
    msg.includes('service is not selected') ||
    msg.includes('an unknown error occurred') ||
    error instanceof TypeError
  )
}
