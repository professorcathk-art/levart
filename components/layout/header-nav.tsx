'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { useLocale } from '@/components/i18n/locale-provider'
import { LanguageSwitcher } from '@/components/layout/language-switcher'

export function HeaderNav({ children }: { children: ReactNode }) {
  const { t } = useLocale()

  return (
    <nav className="flex max-w-[70vw] items-center gap-2 text-xs font-semibold text-[#1A1A1A] sm:max-w-none sm:gap-4 sm:text-sm">
      <Link href="/plan" className="hover:text-[#FF9A76]">
        {t('navPlan')}
      </Link>
      <Link href="/community" className="hover:text-[#FF9A76]">
        {t('navCommunity')}
      </Link>
      <LanguageSwitcher />
      {children}
    </nav>
  )
}

export function SignInLink() {
  const { t } = useLocale()

  return (
    <Link
      href="/login"
      className="rounded-full bg-gradient-to-r from-[#FF9A76] to-[#FFB86C] px-3 py-1.5 text-xs text-white shadow sm:px-4 sm:py-2 sm:text-sm"
    >
      {t('navSignIn')}
    </Link>
  )
}

export function MyTripsLink() {
  const { t } = useLocale()

  return (
    <Link href="/trips" className="hidden hover:text-[#FF9A76] sm:inline">
      {t('navMyTrips')}
    </Link>
  )
}
