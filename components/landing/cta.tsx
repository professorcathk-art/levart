'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PawPrint } from '../paw-print'
import { PawMark } from '@/components/ui/paw-mark'
import { useLocale } from '@/components/i18n/locale-provider'

export function CTA() {
  const { t } = useLocale()
  const [stamped, setStamped] = useState(false)

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#E07A5F] via-[#FFB86C] to-[#7ECCC4] py-20">
      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 text-4xl font-extrabold text-white md:text-5xl">
            {t('ctaTitle1')}
            <br />
            <span className="text-[#FFF8F3]">{t('ctaTitle2')}</span>
          </h2>
          <p className="mb-8 text-xl text-white/90">{t('ctaBody')}</p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="#hero-prompt"
              onClick={() => setStamped(true)}
              className="relative overflow-hidden rounded-full bg-white px-10 py-5 text-xl font-extrabold text-[#E07A5F] shadow-2xl transition hover:scale-105"
            >
              {stamped && (
                <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <PawMark size={28} className="paw-stamp text-[#E07A5F]" />
                </span>
              )}
              {t('startPlanning')}
            </Link>
            <Link
              href="/community"
              className="rounded-full border-2 border-white px-10 py-5 text-xl font-bold text-white"
            >
              {t('browseCommunity')}
            </Link>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute bottom-6 right-6 opacity-30">
        <PawPrint size={48} color="#FFFFFF" opacity={0.5} />
      </div>
    </section>
  )
}
