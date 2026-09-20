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
      className="inline-flex rounded-full bg-white/90 p-1 shadow-sm ring-1 ring-black/5"
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
            className={`min-h-11 rounded-full px-3.5 text-sm font-semibold transition ${
              selected ? 'bg-[#FF9A76] text-white shadow' : 'text-gray-600 hover:text-[#1A1A1A]'
            }`}
          >
            {t(style.label)}
          </button>
        )
      })}
    </div>
  )
}
