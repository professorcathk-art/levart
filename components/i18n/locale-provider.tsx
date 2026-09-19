'use client'

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { translate, type MessageKey } from '@/lib/i18n/dictionaries'
import { DEFAULT_LOCALE, LOCALE_STORAGE_KEY, isLocale, type Locale } from '@/lib/i18n/locales'

interface LocaleContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: MessageKey, vars?: Record<string, string | number>) => string
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: DEFAULT_LOCALE,
  setLocale: () => undefined,
  t: (key, vars) => translate(DEFAULT_LOCALE, key, vars),
})

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE)

  useEffect(() => {
    const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY)
    if (isLocale(stored)) {
      setLocaleState(stored)
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = locale === 'zh-Hant' ? 'zh-Hant' : 'en'
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale)
    document.cookie = `${LOCALE_STORAGE_KEY}=${locale}; path=/; max-age=31536000; samesite=lax`
  }, [locale])

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      setLocale: setLocaleState,
      t: (key, vars) => translate(locale, key, vars),
    }),
    [locale]
  )

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  return useContext(LocaleContext)
}

export function T({
  k,
  vars,
}: {
  k: MessageKey
  vars?: Record<string, string | number>
}) {
  const { t } = useLocale()
  return <>{t(k, vars)}</>
}
