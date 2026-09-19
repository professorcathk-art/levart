'use client'

import { PawPrint } from '../paw-print'
import { useLocale } from '@/components/i18n/locale-provider'
import type { MessageKey } from '@/lib/i18n/dictionaries'

const features: Array<{ icon: string; title: MessageKey; body: MessageKey; color: string }> = [
  { icon: '💬', title: 'feature1Title', body: 'feature1Body', color: '#FF9A76' },
  { icon: '🧭', title: 'feature2Title', body: 'feature2Body', color: '#7ECCC4' },
  { icon: '🌤️', title: 'feature3Title', body: 'feature3Body', color: '#FFB86C' },
  { icon: '🔗', title: 'feature4Title', body: 'feature4Body', color: '#C9A9DD' },
  { icon: '⭐', title: 'feature5Title', body: 'feature5Body', color: '#87CEEB' },
  { icon: '📄', title: 'feature6Title', body: 'feature6Body', color: '#FF9A76' },
]

export function Features() {
  const { t } = useLocale()

  return (
    <section className="bg-gradient-to-b from-[#FFF8F3] to-white py-20">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">
            <span className="text-[#FF9A76]">{t('featuresTitle1')}</span>{' '}
            <span className="text-[#7ECCC4]">{t('featuresTitle2')}</span>
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-[#2D2D2D]">{t('featuresSubtitle')}</p>
        </div>
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative rounded-2xl border-2 border-transparent bg-white p-6 shadow-md transition hover:-translate-y-1 hover:border-[#FF9A76]/20 hover:shadow-xl"
            >
              <div className="absolute right-2 top-2 opacity-0 transition group-hover:opacity-100">
                <PawPrint size={25} color={feature.color} opacity={0.3} bounce />
              </div>
              <div className="mb-4 text-4xl">{feature.icon}</div>
              <h3 className="mb-2 text-xl font-bold">{t(feature.title)}</h3>
              <p className="text-sm leading-relaxed text-[#2D2D2D]">{t(feature.body)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
