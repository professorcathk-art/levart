'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { useLocale } from '@/components/i18n/locale-provider'
import { LanguageSwitcher } from '@/components/layout/language-switcher'

export function HeaderNav({ children }: { children: ReactNode }) {
  const { t } = useLocale()

  return (
    <nav className="flex items-center gap-3 text-sm font-semibold text-[#1A1A1A] sm:gap-4">
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
      className="rounded-full bg-gradient-to-r from-[#FF9A76] to-[#FFB86C] px-4 py-2 text-white shadow"
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
