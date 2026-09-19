export const LOCALES = ['en', 'zh-Hant'] as const

export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'en'
export const LOCALE_STORAGE_KEY = 'levart-locale'

export function isLocale(value: string | null | undefined): value is Locale {
  return value === 'en' || value === 'zh-Hant'
}
