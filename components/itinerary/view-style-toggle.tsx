'use client'

import { useLocale } from '@/components/i18n/locale-provider'
import { useTripView } from '@/components/itinerary/trip-view-provider'
import type { ViewStyle } from '@/lib/trips/view-style'
import type { MessageKey } from '@/lib/i18n/dictionaries'

const STYLES: Array<{ id: ViewStyle; label: MessageKey }> = [
  { id: 'clean', label: 'styleClean' },
  { id: 'handbook', label: 'styleHandbook' },
  { id: 'concise', label: 'styleConcise' },
]

export function ViewStyleToggle() {
  const { t } = useLocale()
  const { viewStyle, setViewStyle } = useTripView()

  return (
    <div
      role="radiogroup"
      aria-label={t('styleSwitcher')}
      className="inline-flex rounded-lg bg-slate-100/90 p-0.5 ring-1 ring-slate-200/80"
    >
      {STYLES.map((style) => {
        const selected = viewStyle === style.id
        return (
          <button
            key={style.id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => setViewStyle(style.id)}
            className={`min-h-9 rounded-md px-3 text-xs font-semibold transition ${
              selected ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {t(style.label)}
          </button>
        )
      })}
    </div>
  )
}
