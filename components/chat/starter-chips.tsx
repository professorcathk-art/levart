'use client'

import { TRIP_FOCUS_OPTIONS } from '@/types'

interface StarterChipsProps {
  onSelect: (text: string) => void
  disabled?: boolean
}

const STARTERS = [
  'Plan 5 days in Tokyo focused on food and culture',
  'A relaxing 4-day beach trip in Phuket',
  'Weekend food crawl in Taipei',
  'Family-friendly 3 days in Kyoto',
]

export function StarterChips({ onSelect, disabled }: StarterChipsProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {STARTERS.map((starter) => (
          <button
            key={starter}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(starter)}
            className="rounded-full border border-[#FF9A76]/30 bg-white px-4 py-2 text-left text-sm text-[#1A1A1A] transition hover:border-[#FF9A76] hover:bg-[#FFF8F3] disabled:opacity-50"
          >
            {starter}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {TRIP_FOCUS_OPTIONS.map((focus) => (
          <button
            key={focus.id}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(`I'd love a ${focus.label.toLowerCase()} focused trip. Help me pick a destination.`)}
            className="rounded-full bg-[#7ECCC4]/15 px-3 py-1.5 text-xs font-semibold text-[#1A1A1A] hover:bg-[#7ECCC4]/30 disabled:opacity-50"
          >
            {focus.emoji} {focus.label}
          </button>
        ))}
      </div>
    </div>
  )
}
