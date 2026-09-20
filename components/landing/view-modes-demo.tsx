'use client'

import { useState } from 'react'
import { useLocale } from '@/components/i18n/locale-provider'
import type { ViewStyle } from '@/lib/trips/view-style'
import type { MessageKey } from '@/lib/i18n/dictionaries'

const SAMPLE: Array<{ time: MessageKey; place: string; extra: string }> = [
  { time: 'timeMorning', place: 'Senso-ji', extra: 'Walk 8 min' },
  { time: 'timeAfternoon', place: 'Nakamise snacks', extra: 'Skytree Line 15 min' },
  { time: 'timeEvening', place: 'Tokyo Skytree', extra: '' },
]

export function ViewModesDemo() {
  const { t } = useLocale()
  const [style, setStyle] = useState<ViewStyle>('clean')

  const modes: Array<{ id: ViewStyle; label: string }> = [
    { id: 'clean', label: t('styleClean') },
    { id: 'handbook', label: t('styleHandbook') },
    { id: 'concise', label: t('styleConcise') },
  ]

  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-extrabold text-[#2B2D42] md:text-5xl">{t('modesTitle')}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-[#2B2D42]/70">{t('modesBody')}</p>
        </div>
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 flex justify-center gap-2">
            {modes.map((mode) => (
              <button
                key={mode.id}
                type="button"
                onClick={() => setStyle(mode.id)}
                className={`min-h-11 rounded-full px-4 text-sm font-semibold ${
                  style === mode.id ? 'bg-[#E07A5F] text-white' : 'bg-[#FAF6F0] text-[#2B2D42]'
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>
          <div
            className={`space-y-3 rounded-[28px] p-5 transition-colors ${
              style === 'handbook' ? 'bg-[#FAF7F2]' : 'bg-[#FAF6F0]'
            }`}
          >
            {SAMPLE.map((stop, index) => (
              <div key={stop.place}>
                <article
                  className={
                    style === 'concise'
                      ? 'rounded-r-xl border-l-4 border-[#E07A5F] bg-white px-4 py-3'
                      : style === 'handbook'
                        ? 'rounded-[24px] border border-[#E8DFD1] bg-[#FFFDF9] p-4 shadow-[2px_3px_0_rgba(90,70,40,0.06)]'
                        : 'rounded-2xl border border-orange-100/80 bg-white p-4 shadow-sm'
                  }
                >
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#E07A5F]">{t(stop.time)}</p>
                  <p className={`mt-1 font-semibold ${style === 'handbook' ? 'font-serif text-lg' : ''}`}>
                    {stop.place}
                  </p>
                </article>
                {index < SAMPLE.length - 1 && stop.extra && (
                  <p className="px-3 py-2 text-sm text-[#2B2D42]/55">—— {stop.extra} ——</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
