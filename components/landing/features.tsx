'use client'

import { CloudSun, FileText, LayoutPanelLeft, Link2, MessageCircle, Star } from 'lucide-react'
import { useLocale } from '@/components/i18n/locale-provider'
import type { MessageKey } from '@/lib/i18n/dictionaries'
import type { LucideIcon } from 'lucide-react'

const features: Array<{ icon: LucideIcon; title: MessageKey; body: MessageKey }> = [
  { icon: MessageCircle, title: 'feature1Title', body: 'feature1Body' },
  { icon: LayoutPanelLeft, title: 'feature2Title', body: 'feature2Body' },
  { icon: CloudSun, title: 'feature3Title', body: 'feature3Body' },
  { icon: Link2, title: 'feature4Title', body: 'feature4Body' },
  { icon: Star, title: 'feature5Title', body: 'feature5Body' },
  { icon: FileText, title: 'feature6Title', body: 'feature6Body' },
]

export function Features() {
  const { t } = useLocale()

  return (
    <section className="bg-[#FAF6F0] py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-extrabold tracking-tight md:text-5xl">
            <span className="text-[#2B2D42]">{t('featuresTitle1')}</span>{' '}
            <span className="text-[#E07A5F]">{t('featuresTitle2')}</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-[#2B2D42]/70">{t('featuresSubtitle')}</p>
        </div>
        <div className="grid items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <article
                key={feature.title}
                className="flex h-full flex-col rounded-3xl border border-orange-100/80 bg-white p-7 shadow-[0_8px_24px_rgba(43,45,66,0.04)] transition-all hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(224,122,95,0.12)]"
              >
                <span className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-orange-100/80 bg-[#FAF6F0] shadow-sm">
                  <Icon className="h-5 w-5 text-[#E07A5F]" strokeWidth={2.25} />
                </span>
                <h3 className="mb-2 text-xl font-extrabold tracking-tight text-[#2B2D42]">{t(feature.title)}</h3>
                <p className="text-sm leading-relaxed text-[#2B2D42]/70">{t(feature.body)}</p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
