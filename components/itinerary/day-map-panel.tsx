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
  const lookupDestination = destination || trip?.destination || trip?.itinerary.destination || ''
  const lookupKey = [
    trip?.id ?? '',
    lookupDestination,
    String(dayNumber ?? 'all'),
    trip ? pinsForDay(trip, dayNumber).map((pin) => pin.id).join(',') : '',
    trip ? dayStopQueries(trip, dayNumber).join('|') : '',
  ].join('::')
  const [pins, setPins] = useState<Attraction[]>(() => (trip ? pinsForDay(trip, dayNumber) : []))
  const [status, setStatus] = useState<'ready' | 'loading' | 'empty'>(() =>
    trip && pinsForDay(trip, dayNumber).length > 0 ? 'ready' : 'loading'
  )

  useEffect(() => {
    let cancelled = false
    const attached = trip ? pinsForDay(trip, dayNumber) : []
    if (attached.length > 0) {
      setPins(attached)
      setStatus('ready')
      return
    }

    if (!lookupDestination) {
      setPins([])
      setStatus('empty')
      return
    }

    const controller = new AbortController()
    const stops = trip ? dayStopQueries(trip, dayNumber) : []

    setStatus('loading')
    fetch('/api/places/geocode', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: lookupDestination, stops }),
      signal: controller.signal,
    })
      .then((response) => response.json())
      .then((data: { pins?: Attraction[] }) => {
        if (cancelled) return
        const next = Array.isArray(data.pins) ? data.pins : []
        setPins(next)
        setStatus(next.length > 0 ? 'ready' : 'empty')
      })
      .catch((error: unknown) => {
        if (cancelled) return
        const aborted =
          (error instanceof DOMException && error.name === 'AbortError') ||
          (error instanceof Error && error.name === 'AbortError')
        if (aborted) return
        console.error('Day map geocode failed:', error)
        setPins([])
        setStatus('empty')
      })

    return () => {
      cancelled = true
      controller.abort()
    }
    // lookupKey already encodes destination, day, stored pins, and stop names
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lookupKey])

  const cityMaps = lookupDestination
    ? { href: mapsSearchUrl(lookupDestination), label: t('openCityMaps', { destination: lookupDestination }) }
    : undefined

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 sm:gap-4">
      <div className="min-h-0 flex-1 overflow-hidden rounded-xl border border-orange-100/80 bg-white/90 shadow-sm">
        {status === 'ready' && pins.length > 0 ? (
          <MapComponent
            attractions={pins}
            routePolyline={trip?.route?.polyline || '[]'}
            className="h-full min-h-[16rem] w-full lg:min-h-[22rem]"
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
