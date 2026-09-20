'use client'

import { CircleCheck, Globe2, Heart, MessageCircle } from 'lucide-react'
import { PawPrint } from '../paw-print'
import { useLocale } from '@/components/i18n/locale-provider'
import type { MessageKey } from '@/lib/i18n/dictionaries'
import type { LucideIcon } from 'lucide-react'

const values: Array<{ icon: LucideIcon; title: MessageKey; body: MessageKey }> = [
  { icon: MessageCircle, title: 'why1Title', body: 'why1Body' },
  { icon: CircleCheck, title: 'why2Title', body: 'why2Body' },
  { icon: Globe2, title: 'why3Title', body: 'why3Body' },
  { icon: Heart, title: 'why4Title', body: 'why4Body' },
]

export function WhyCatpawtrip() {
  const { t } = useLocale()

  return (
    <section className="bg-[#FAF6F0] py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-extrabold tracking-tight md:text-5xl">
            <span className="text-[#2B2D42]">{t('whyTitle1')}</span>{' '}
            <span className="text-[#E07A5F]">{t('whyTitle2')}</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-[#2B2D42]/70">{t('whySubtitle')}</p>
        </div>
        <div className="mb-12 grid items-stretch gap-6 md:grid-cols-2">
          {values.map((value) => {
            const Icon = value.icon
            return (
              <article
                key={value.title}
                className="flex h-full gap-4 rounded-3xl border border-orange-100/80 bg-white p-7 shadow-[0_8px_24px_rgba(43,45,66,0.04)]"
              >
                <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-orange-100/80 bg-[#FAF6F0] shadow-sm">
                  <Icon className="h-5 w-5 text-[#E07A5F]" strokeWidth={2.25} />
                </span>
                <div>
                  <h3 className="mb-2 text-xl font-extrabold tracking-tight text-[#2B2D42]">{t(value.title)}</h3>
                  <p className="leading-relaxed text-[#2B2D42]/70">{t(value.body)}</p>
                </div>
              </article>
            )
          })}
        </div>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#E07A5F] to-[#FFB86C] p-8 text-center text-white shadow-xl md:p-12">
          <div className="absolute left-4 top-4 opacity-20">
            <PawPrint size={40} color="#FFFFFF" opacity={0.3} />
          </div>
          <h3 className="mb-4 text-3xl font-extrabold tracking-tight md:text-4xl">{t('whyBannerTitle')}</h3>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-white/90">{t('whyBannerBody')}</p>
        </div>
      </div>
    </section>
  )
}
