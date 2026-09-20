'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { LanguageWelcome } from '@/components/i18n/language-welcome'
import { translate, type MessageKey } from '@/lib/i18n/dictionaries'
import {
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  htmlLang,
  isLocale,
  localeFromNavigator,
  persistLocale,
  type Locale,
} from '@/lib/i18n/locales'

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

interface LocaleProviderProps {
  children: ReactNode
  initialLocale?: Locale
  needsPicker?: boolean
}

export function LocaleProvider({
  children,
  initialLocale = DEFAULT_LOCALE,
  needsPicker = false,
}: LocaleProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale)
  const [pickerOpen, setPickerOpen] = useState(needsPicker)

  useEffect(() => {
    const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY)
    const cookieMatch = document.cookie.match(new RegExp(`(?:^|; )${LOCALE_STORAGE_KEY}=([^;]*)`))
    const cookieValue = cookieMatch ? decodeURIComponent(cookieMatch[1]) : null

    if (isLocale(stored)) {
      setLocaleState(stored)
      setPickerOpen(false)
      return
    }
    if (isLocale(cookieValue)) {
      setLocaleState(cookieValue)
      setPickerOpen(false)
      persistLocale(cookieValue)
      return
    }

    const detected = localeFromNavigator()
    if (detected) {
      setLocaleState(detected)
      setPickerOpen(false)
      persistLocale(detected)
      return
    }

    setPickerOpen(true)
  }, [])

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    setPickerOpen(false)
    persistLocale(next)
  }, [])

  useEffect(() => {
    document.documentElement.lang = htmlLang(locale)
    if (!pickerOpen) {
      persistLocale(locale)
    }
  }, [locale, pickerOpen])

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      setLocale,
      t: (key, vars) => translate(locale, key, vars),
    }),
    [locale, setLocale]
  )

  return (
    <LocaleContext.Provider value={value}>
      {children}
      {pickerOpen ? <LanguageWelcome onChoose={setLocale} /> : null}
    </LocaleContext.Provider>
  )
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
