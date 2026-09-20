export function getConfiguredSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, '') || null
}

export function getBrowserSiteUrl() {
  const configured = getConfiguredSiteUrl()
  if (configured) return configured
  if (typeof window !== 'undefined') return window.location.origin
  return ''
}

export function getAuthCallbackUrl(nextPath: string) {
  const origin =
    typeof window !== 'undefined' ? window.location.origin : getConfiguredSiteUrl() || ''
  const next = nextPath.startsWith('/') ? nextPath : `/${nextPath}`
  return `${origin}/auth/callback?next=${encodeURIComponent(next)}`
}
