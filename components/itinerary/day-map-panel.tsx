'use client'

import { MapComponent } from '@/components/map-component'
import { BookingLinks } from '@/components/plan/booking-links'
import { useLocale } from '@/components/i18n/locale-provider'
import { mapsSearchUrl } from '@/lib/trips/transit'
import { pinsForDay } from '@/lib/trips/map-pins'
import type { Trip } from '@/types'

interface DayMapPanelProps {
  destination: string
  trip?: Trip
  dayNumber?: number
}

export function DayMapPanel({ destination, trip, dayNumber }: DayMapPanelProps) {
  const { t } = useLocale()
  const pins = trip ? pinsForDay(trip, dayNumber) : []

  return (
    <div className="flex h-full min-h-[22rem] flex-col gap-4">
      <div className="min-h-0 flex-1 overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
        {pins.length > 0 ? (
          <MapComponent
            attractions={pins}
            routePolyline={trip?.route?.polyline || '[]'}
            className="h-full min-h-[22rem] w-full"
          />
        ) : (
          <div className="flex h-full min-h-[22rem] flex-col items-start justify-center gap-4 p-6">
            <p className="text-sm text-slate-600">{t('mapEmptyHint')}</p>
            {destination && (
              <a
                href={mapsSearchUrl(destination)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center rounded-full bg-[#E07A5F] px-4 text-sm font-semibold text-white"
              >
                {t('openCityMaps', { destination })}
              </a>
            )}
          </div>
        )}
      </div>
      {trip && (
        <BookingLinks
          variant="compact"
          destination={trip.destination}
          checkIn={trip.checkIn}
          checkOut={trip.checkOut}
          tripId={trip.id}
        />
      )}
    </div>
  )
}
