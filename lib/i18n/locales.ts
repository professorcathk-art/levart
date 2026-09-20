export const LOCALES = ['en', 'zh-Hant'] as const

export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'en'
export const LOCALE_STORAGE_KEY = 'levart-locale'

export function isLocale(value: string | null | undefined): value is Locale {
  return value === 'en' || value === 'zh-Hant'
}

export function htmlLang(locale: Locale) {
  return locale === 'zh-Hant' ? 'zh-Hant' : 'en'
}

export function persistLocale(locale: Locale) {
  if (typeof document === 'undefined') return
  document.documentElement.lang = htmlLang(locale)
  window.localStorage.setItem(LOCALE_STORAGE_KEY, locale)
  document.cookie = `${LOCALE_STORAGE_KEY}=${locale}; path=/; max-age=31536000; samesite=lax`
}

function localeFromLanguageTags(tags: Array<string | null | undefined>): Locale | null {
  for (const raw of tags) {
    const tag = raw?.trim().toLowerCase()
    if (!tag) continue
    if (tag.startsWith('zh')) return 'zh-Hant'
    if (tag.startsWith('en')) return 'en'
  }
  return null
}

export function localeFromAcceptLanguage(header?: string | null): Locale | null {
  if (!header) return null
  const ranked = header
    .split(',')
    .map((part) => {
      const [tag, ...params] = part.trim().split(';')
      const qualityParam = params.find((item) => item.trim().startsWith('q='))
      const quality = qualityParam ? Number(qualityParam.trim().slice(2)) : 1
      return { tag: tag.trim(), quality: Number.isFinite(quality) ? quality : 1 }
    })
    .sort((left, right) => right.quality - left.quality)
  return localeFromLanguageTags(ranked.map((item) => item.tag))
}

export function localeFromNavigator(): Locale | null {
  if (typeof navigator === 'undefined') return null
  return localeFromLanguageTags([...(navigator.languages ?? []), navigator.language])
}

export function resolveRequestLocale(
  cookieValue?: string | null,
  acceptLanguage?: string | null
): { locale: Locale; needsPicker: boolean } {
  if (isLocale(cookieValue)) {
    return { locale: cookieValue, needsPicker: false }
  }
  const detected = localeFromAcceptLanguage(acceptLanguage)
  if (detected) {
    return { locale: detected, needsPicker: false }
  }
  return { locale: DEFAULT_LOCALE, needsPicker: true }
}
