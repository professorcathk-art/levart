import type { Attraction, Itinerary, RouteData, TripFocus } from '@/types'

export const EMPTY_ROUTE: RouteData = {
  points: [],
  polyline: '[]',
  totalDistance: 0,
  totalDuration: 0,
}

export function emptyItinerary(partial?: Partial<Itinerary>): Itinerary {
  return {
    destination: partial?.destination ?? '',
    tripFocus: partial?.tripFocus ?? [],
    selectedAttractions: partial?.selectedAttractions ?? [],
    route: partial?.route ?? EMPTY_ROUTE,
    days: partial?.days ?? [],
    checkIn: partial?.checkIn,
    checkOut: partial?.checkOut,
  }
}

export function itineraryHasPlan(itinerary: Itinerary | null | undefined): boolean {
  return Boolean(itinerary && itinerary.destination && itinerary.days.length > 0)
}

export function isTripFocus(value: string): value is TripFocus {
  return ['shopping', 'food', 'climbing', 'culture', 'nightlife', 'beach', 'family'].includes(value)
}

export function parseItinerary(value: unknown): Itinerary {
  if (!value || typeof value !== 'object') {
    return emptyItinerary()
  }

  const raw = value as Partial<Itinerary>
  const focus = Array.isArray(raw.tripFocus)
    ? raw.tripFocus.filter(isTripFocus)
    : []

  return emptyItinerary({
    destination: typeof raw.destination === 'string' ? raw.destination : '',
    tripFocus: focus,
    selectedAttractions: Array.isArray(raw.selectedAttractions)
      ? (raw.selectedAttractions as Attraction[])
      : [],
    route:
      raw.route && typeof raw.route === 'object'
        ? {
            points: raw.route.points ?? [],
            polyline: raw.route.polyline ?? '[]',
            totalDistance: raw.route.totalDistance ?? 0,
            totalDuration: raw.route.totalDuration ?? 0,
          }
        : EMPTY_ROUTE,
    days: Array.isArray(raw.days) ? raw.days : [],
    checkIn: raw.checkIn,
    checkOut: raw.checkOut,
  })
}

export function addDays(date: string, days: number): string {
  const next = new Date(`${date}T00:00:00`)
  next.setDate(next.getDate() + days)
  return next.toISOString().split('T')[0]
}
