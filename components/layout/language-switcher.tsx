'use client'

import { useLocale } from '@/components/i18n/locale-provider'
import type { Locale } from '@/lib/i18n/locales'

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useLocale()

  return (
    <label className="flex items-center gap-2 text-xs font-semibold text-[#1A1A1A]">
      <span className="sr-only">{t('languageLabel')}</span>
      <select
        value={locale}
        onChange={(event) => setLocale(event.target.value as Locale)}
        className="rounded-full border border-[#FF9A76]/30 bg-white/80 px-2 py-1 text-xs font-semibold outline-none focus:border-[#FF9A76]"
        aria-label={t('languageLabel')}
      >
        <option value="en">{t('languageEn')}</option>
        <option value="zh-Hant">{t('languageZh')}</option>
      </select>
    </label>
  )
}
