'use client'

import Link from 'next/link'
import { useLocale } from '@/components/i18n/locale-provider'

export function NotFoundCopy() {
  const { t } = useLocale()

  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-xl flex-col items-center justify-center px-4 text-center">
      <h1 className="text-3xl font-extrabold text-[#FF9A76]">{t('notFoundTitle')}</h1>
      <p className="mt-3 font-medium text-gray-600">{t('notFoundBody')}</p>
      <Link
        href="/plan"
        className="mt-6 rounded-full bg-gradient-to-r from-[#FF9A76] to-[#FFB86C] px-6 py-3 font-semibold text-white"
      >
        {t('notFoundCta')}
      </Link>
    </main>
  )
}
