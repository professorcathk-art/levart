'use client'

import { useMemo } from 'react'
import { useLocale } from '@/components/i18n/locale-provider'
import { DaySection } from '@/components/itinerary/day-section'
import { OfflineBadge } from '@/components/itinerary/offline-badge'
import { TripViewProvider, useTripView } from '@/components/itinerary/trip-view-provider'
import { ViewStyleToggle } from '@/components/itinerary/view-style-toggle'
import type { DayFilter } from '@/lib/trips/view-style'
import type { MessageKey } from '@/lib/i18n/dictionaries'
import type { Itinerary, Trip } from '@/types'

const FILTERS: Array<{ id: DayFilter; label: MessageKey }> = [
  { id: 'all', label: 'filterAll' },
  { id: 'attractions', label: 'filterAttractions' },
  { id: 'food', label: 'filterFood' },
  { id: 'stay', label: 'filterStay' },
]

interface ItineraryBoardProps {
  itinerary: Itinerary
  destination: string
  trip?: Trip
}

function BoardChrome({ itinerary, destination, trip }: ItineraryBoardProps) {
  const { t } = useLocale()
  const { viewStyle, filter, setFilter } = useTripView()

  return (
    <div
      className={`transition-colors duration-300 ${
        viewStyle === 'handbook' ? 'rounded-[28px] bg-[#FAF7F2] p-3 md:p-4' : ''
      }`}
    >
      <div
        className={`sticky top-[7.75rem] z-20 -mx-1 mb-4 space-y-3 px-1 py-3 backdrop-blur md:top-[8.25rem] ${
          viewStyle === 'handbook' ? 'bg-[#FAF7F2]/95' : 'bg-[#FFF8F3]/95'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <ViewStyleToggle />
          {trip && <OfflineBadge trip={trip} />}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {itinerary.days.map((day) => (
            <a
              key={day.day}
              href={`#day-${day.day}`}
              className="inline-flex min-h-11 shrink-0 items-center rounded-full bg-white px-4 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-black/5"
            >
              {t('planDay', { day: day.day })}
            </a>
          ))}
        </div>
        <div className="flex gap-2 overflow-x-auto" role="tablist" aria-label={t('filterLabel')}>
          {FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={filter === item.id}
              onClick={() => setFilter(item.id)}
              className={`min-h-11 shrink-0 rounded-full px-4 text-sm font-semibold ${
                filter === item.id ? 'bg-[#1A1A1A] text-white' : 'bg-white text-gray-600 ring-1 ring-black/5'
              }`}
            >
              {t(item.label)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {itinerary.days.map((day) => (
          <DaySection
            key={day.day}
            day={day}
            destination={destination}
            currency={itinerary.currency}
          />
        ))}
      </div>
    </div>
  )
}

export function ItineraryBoard({ itinerary, destination, trip }: ItineraryBoardProps) {
  const dayNumbers = useMemo(() => itinerary.days.map((day) => day.day), [itinerary.days])

  return (
    <TripViewProvider dayNumbers={dayNumbers}>
      <BoardChrome itinerary={itinerary} destination={destination} trip={trip} />
    </TripViewProvider>
  )
}
