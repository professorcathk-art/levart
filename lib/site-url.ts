export function getConfiguredSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, '') || null
}

export function getBrowserSiteUrl() {
  const configured = getConfiguredSiteUrl()
  if (configured) return configured
  if (typeof window !== 'undefined') return window.location.origin
  return ''
}

export function safeNextPath(value: string | null | undefined) {
  if (!value) return '/'
  if (!value.startsWith('/') || value.startsWith('//') || value.includes('\\')) return '/'
  return value
}

export function getAuthCallbackUrl(nextPath: string) {
  const origin =
    typeof window !== 'undefined' ? window.location.origin : getConfiguredSiteUrl() || ''
  const next = safeNextPath(nextPath)
  return `${origin}/auth/callback?next=${encodeURIComponent(next)}`
}
