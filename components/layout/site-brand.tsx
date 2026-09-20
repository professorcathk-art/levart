'use client'

import Link from 'next/link'
import { useLocale } from '@/components/i18n/locale-provider'

export function SiteBrand() {
  const { t } = useLocale()

  return (
    <Link
      href="/"
      aria-label={`Levart ${t('brandNameZh')}`}
      className="flex min-w-0 shrink-0 items-center gap-2 text-[#E07A5F]"
    >
      <svg width={22} height={22} viewBox="0 0 100 100" aria-hidden className="shrink-0">
        <ellipse cx="50" cy="65" rx="20" ry="15" fill="#E07A5F" />
        <ellipse cx="30" cy="40" rx="12" ry="10" fill="#E07A5F" />
        <ellipse cx="50" cy="35" rx="12" ry="10" fill="#E07A5F" />
        <ellipse cx="70" cy="40" rx="12" ry="10" fill="#E07A5F" />
        <ellipse cx="40" cy="25" rx="10" ry="8" fill="#E07A5F" />
        <ellipse cx="60" cy="25" rx="10" ry="8" fill="#E07A5F" />
      </svg>
      <span className="flex min-w-0 flex-col leading-tight">
        <span className="text-lg font-bold sm:text-xl">Levart</span>
        <span className="text-[10px] font-semibold tracking-[0.16em] text-[#E07A5F]/75 sm:text-xs">
          {t('brandNameZh')}
        </span>
      </span>
    </Link>
  )
}
