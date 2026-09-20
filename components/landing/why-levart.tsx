'use client'

import { PawPrint } from '../paw-print'
import { useLocale } from '@/components/i18n/locale-provider'
import type { MessageKey } from '@/lib/i18n/dictionaries'

const values: Array<{ emoji: string; title: MessageKey; body: MessageKey }> = [
  { emoji: '💬', title: 'why1Title', body: 'why1Body' },
  { emoji: '✅', title: 'why2Title', body: 'why2Body' },
  { emoji: '🌍', title: 'why3Title', body: 'why3Body' },
  { emoji: '🧡', title: 'why4Title', body: 'why4Body' },
]

export function WhyLevart() {
  const { t } = useLocale()

  return (
    <section className="bg-[#FAF6F0] py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold md:text-5xl">
              <span className="text-[#FF9A76]">{t('whyTitle1')}</span>{' '}
              <span className="text-[#7ECCC4]">{t('whyTitle2')}</span>
            </h2>
            <p className="text-xl text-[#1A1A1A]">{t('whySubtitle')}</p>
          </div>
          <div className="mb-12 grid gap-6 md:grid-cols-2">
            {values.map((value) => (
              <div key={value.title} className="rounded-2xl border border-white/80 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{value.emoji}</div>
                  <div>
                    <h3 className="mb-2 text-xl font-bold">{t(value.title)}</h3>
                    <p className="text-[#2D2D2D]">{t(value.body)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#E07A5F] to-[#FFB86C] p-8 text-center text-white shadow-xl md:p-12">
            <div className="absolute left-4 top-4 opacity-20">
              <PawPrint size={40} color="#FFFFFF" opacity={0.3} />
            </div>
            <h3 className="mb-4 text-3xl font-bold md:text-4xl">{t('whyBannerTitle')}</h3>
            <p className="mx-auto max-w-2xl text-lg opacity-90">{t('whyBannerBody')}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
