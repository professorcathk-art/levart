'use client'

import { useEffect, useState } from 'react'
import { MapComponent } from '@/components/map-component'
import { BookingLinks } from '@/components/plan/booking-links'
import { MapPlaceholder } from '@/components/ui/map-placeholder'
import { useLocale } from '@/components/i18n/locale-provider'
import { mapsSearchUrl } from '@/lib/trips/transit'
import { dayStopQueries, pinsForDay } from '@/lib/trips/map-pins'
import type { Attraction, Trip } from '@/types'

interface DayMapPanelProps {
  destination: string
  trip?: Trip
  dayNumber?: number
}

export function DayMapPanel({ destination, trip, dayNumber }: DayMapPanelProps) {
  const { t } = useLocale()
  const lookupKey = [
    trip?.id ?? '',
    destination,
    String(dayNumber ?? 'all'),
    trip ? pinsForDay(trip, dayNumber).map((pin) => pin.id).join(',') : '',
    trip ? dayStopQueries(trip, dayNumber).join('|') : '',
  ].join('::')
  const [pins, setPins] = useState<Attraction[]>(() => (trip ? pinsForDay(trip, dayNumber) : []))
  const [status, setStatus] = useState<'ready' | 'loading' | 'empty'>(() =>
    trip && pinsForDay(trip, dayNumber).length > 0 ? 'ready' : 'loading'
  )

  useEffect(() => {
    const attached = trip ? pinsForDay(trip, dayNumber) : []
    if (attached.length > 0) {
      setPins(attached)
      setStatus('ready')
      return
    }

    if (!destination) {
      setPins([])
      setStatus('empty')
      return
    }

    const controller = new AbortController()
    const params = new URLSearchParams({ q: destination })
    if (trip) {
      const stops = dayStopQueries(trip, dayNumber)
      if (stops.length > 0) params.set('stops', stops.join('|'))
    }

    setStatus('loading')
    fetch(`/api/places/geocode?${params}`, { signal: controller.signal })
      .then((response) => response.json())
      .then((data: { pins?: Attraction[] }) => {
        const next = Array.isArray(data.pins) ? data.pins : []
        setPins(next)
        setStatus(next.length > 0 ? 'ready' : 'empty')
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return
        console.error('Day map geocode failed:', error)
        setPins([])
        setStatus('empty')
      })

    return () => controller.abort()
    // lookupKey already encodes destination, day, stored pins, and stop names
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lookupKey])

  const cityMaps = destination
    ? { href: mapsSearchUrl(destination), label: t('openCityMaps', { destination }) }
    : undefined

  return (
    <div className="flex h-full min-h-[22rem] flex-col gap-4">
      <div className="min-h-0 flex-1 overflow-hidden rounded-xl border border-orange-100/80 bg-white/90 shadow-sm">
        {status === 'ready' && pins.length > 0 ? (
          <MapComponent
            attractions={pins}
            routePolyline={trip?.route?.polyline || '[]'}
            className="h-full min-h-[22rem] w-full"
          />
        ) : (
          <MapPlaceholder
            title={status === 'loading' ? t('mapLocating') : t('mapEmptyHint')}
            action={status === 'empty' ? cityMaps : undefined}
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
