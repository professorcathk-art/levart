'use client'

import { useMemo } from 'react'
import { List, MapPinned } from 'lucide-react'
import { useLocale } from '@/components/i18n/locale-provider'
import { DayMapPanel } from '@/components/itinerary/day-map-panel'
import { DaySection } from '@/components/itinerary/day-section'
import { OfflineBadge } from '@/components/itinerary/offline-badge'
import {
  TripViewProvider,
  useOptionalTripView,
  useTripView,
} from '@/components/itinerary/trip-view-provider'
import { ViewStyleToggle } from '@/components/itinerary/view-style-toggle'
import type { Itinerary, Trip } from '@/types'

interface ItineraryBoardProps {
  itinerary: Itinerary
  destination: string
  trip?: Trip
}

function BoardChrome({ itinerary, destination, trip }: ItineraryBoardProps) {
  const { t } = useLocale()
  const { viewStyle, selectedDay, setSelectedDay, mobilePane, setMobilePane } = useTripView()
  const day = itinerary.days.find((item) => item.day === selectedDay) ?? itinerary.days[0]

  return (
    <div
      className={`transition-colors duration-300 ${
        viewStyle === 'handbook' ? 'rounded-[28px] bg-[#FAF7F2] p-3 md:p-4' : ''
      }`}
    >
      <div
        className={`sticky top-14 z-20 -mx-1 mb-4 flex flex-col gap-3 px-1 py-3 backdrop-blur md:top-16 lg:flex-row lg:items-center lg:justify-between ${
          viewStyle === 'handbook' ? 'bg-[#FAF7F2]/95' : 'bg-[#FFF8F3]/95'
        }`}
      >
        <div
          className="flex gap-2 overflow-x-auto pb-1"
          role="tablist"
          aria-label={t('planDays', { count: itinerary.days.length })}
        >
          {itinerary.days.map((item) => {
            const selected = day?.day === item.day
            return (
              <button
                key={item.day}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setSelectedDay(item.day)}
                className={`inline-flex min-h-11 shrink-0 items-center rounded-full border px-4 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] transition-all ${
                  selected
                    ? 'border-[#2B2D42] bg-[#2B2D42] text-white shadow-md'
                    : 'border-orange-100/80 bg-white/90 text-slate-600 shadow-sm backdrop-blur-sm hover:scale-[1.03] hover:shadow-md'
                }`}
              >
                {t('planDay', { day: item.day })}
              </button>
            )
          })}
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <ViewStyleToggle />
          {trip && <OfflineBadge trip={trip} />}
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-[minmax(0,3fr)_minmax(17rem,2fr)] lg:items-start lg:gap-6">
        <div className={mobilePane === 'map' ? 'hidden lg:block' : 'block'}>
          {day ? (
            <DaySection day={day} destination={destination} currency={itinerary.currency} trip={trip} />
          ) : (
            <p className="rounded-xl border border-orange-100/80 bg-white/90 p-6 text-sm font-medium text-slate-500 shadow-sm">{t('filterEmpty')}</p>
          )}
        </div>
        <aside className={mobilePane === 'list' ? 'hidden lg:block' : 'block'}>
          <div className="lg:sticky lg:top-36 lg:h-[calc(100vh-10rem)]">
            <DayMapPanel destination={destination} trip={trip} dayNumber={day?.day} />
          </div>
        </aside>
      </div>

      <button
        type="button"
        onClick={() => setMobilePane(mobilePane === 'list' ? 'map' : 'list')}
        className="fixed bottom-6 left-1/2 z-30 inline-flex min-h-11 -translate-x-1/2 items-center gap-2 rounded-full border border-white/20 bg-[#2B2D42] px-5 text-sm font-semibold text-white shadow-lg transition-all hover:scale-[1.03] lg:hidden"
      >
        {mobilePane === 'list' ? <MapPinned className="h-4 w-4" aria-hidden /> : <List className="h-4 w-4" aria-hidden />}
        {mobilePane === 'list' ? t('mapView') : t('listView')}
      </button>
    </div>
  )
}

export function ItineraryBoard({ itinerary, destination, trip }: ItineraryBoardProps) {
  const dayNumbers = useMemo(() => itinerary.days.map((day) => day.day), [itinerary.days])
  const existing = useOptionalTripView()
  const chrome = <BoardChrome itinerary={itinerary} destination={destination} trip={trip} />

  if (existing) return chrome

  return <TripViewProvider dayNumbers={dayNumbers}>{chrome}</TripViewProvider>
}
