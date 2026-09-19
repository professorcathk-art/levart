'use client'

import { useLocale } from '@/components/i18n/locale-provider'
import type { MessageKey } from '@/lib/i18n/dictionaries'
import { TRIP_FOCUS_OPTIONS } from '@/types'

interface StarterChipsProps {
  onSelect: (text: string) => void
  disabled?: boolean
}

const STARTER_KEYS = ['starter1', 'starter2', 'starter3', 'starter4'] as const
const FOCUS_KEYS: Record<(typeof TRIP_FOCUS_OPTIONS)[number]['id'], MessageKey> = {
  food: 'focusFood',
  culture: 'focusCulture',
  shopping: 'focusShopping',
  beach: 'focusBeach',
  nightlife: 'focusNightlife',
  family: 'focusFamily',
  climbing: 'focusClimbing',
}

export function StarterChips({ onSelect, disabled }: StarterChipsProps) {
  const { t } = useLocale()

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {STARTER_KEYS.map((key) => (
          <button
            key={key}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(t(key))}
            className="rounded-full border border-[#FF9A76]/30 bg-white px-4 py-2 text-left text-sm text-[#1A1A1A] transition hover:border-[#FF9A76] hover:bg-[#FFF8F3] disabled:opacity-50"
          >
            {t(key)}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {TRIP_FOCUS_OPTIONS.map((focus) => {
          const label = t(FOCUS_KEYS[focus.id])
          return (
            <button
              key={focus.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(t('focusPrompt', { focus: label }))}
              className="rounded-full bg-[#7ECCC4]/15 px-3 py-1.5 text-xs font-semibold text-[#1A1A1A] hover:bg-[#7ECCC4]/30 disabled:opacity-50"
            >
              {focus.emoji} {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
