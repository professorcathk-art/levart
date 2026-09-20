'use client'

import { MapComponent } from '@/components/map-component'
import { BookingLinks } from '@/components/plan/booking-links'
import { MapPlaceholder } from '@/components/ui/map-placeholder'
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
      <div className="min-h-0 flex-1 overflow-hidden rounded-xl border border-orange-100/80 bg-white/90 shadow-sm">
        {pins.length > 0 ? (
          <MapComponent
            attractions={pins}
            routePolyline={trip?.route?.polyline || '[]'}
            className="h-full min-h-[22rem] w-full"
          />
        ) : (
          <MapPlaceholder
            title={t('mapEmptyHint')}
            action={
              destination
                ? { href: mapsSearchUrl(destination), label: t('openCityMaps', { destination }) }
                : undefined
            }
          />
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
