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
  ]

  return (
    <section className="bg-[#FAF6F0] py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-extrabold tracking-tight text-[#2B2D42] md:text-5xl">{t('modesTitle')}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-[#2B2D42]/70">{t('modesBody')}</p>
        </div>
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 flex flex-wrap justify-center gap-2">
            {modes.map((mode) => (
              <button
                key={mode.id}
                type="button"
                onClick={() => setStyle(mode.id)}
                className={`min-h-11 rounded-full px-4 font-semibold shadow-sm ${
                  style === mode.id ? 'bg-[#E07A5F] text-white' : 'border border-orange-100/80 bg-white text-[#2B2D42]'
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>
          <div
            className={`space-y-3 rounded-[28px] border border-orange-100/80 bg-white p-5 shadow-[0_8px_24px_rgba(43,45,66,0.04)] transition-colors ${
              style === 'handbook' ? 'bg-[#FAF7F2]' : ''
            }`}
          >
            {SAMPLE.map((stop, index) => (
              <div key={stop.place}>
                <article
                  className={
                    style === 'handbook'
                      ? 'rounded-[24px] border border-[#E8DFD1] bg-[#FFFDF9] p-4 shadow-[2px_3px_0_rgba(90,70,40,0.06)]'
                      : 'rounded-2xl border border-orange-100/80 bg-[#FAF6F0] p-4'
                  }
                >
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#E07A5F]">
                    {t(stop.time)}
                  </p>
                  <p className={`mt-1 font-extrabold tracking-tight ${style === 'handbook' ? 'font-serif text-lg' : ''}`}>
                    {stop.place}
                  </p>
                </article>
                {index < SAMPLE.length - 1 && stop.extra && (
                  <p className="px-3 py-2 font-mono text-xs text-[#2B2D42]/55">—— {stop.extra} ——</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
