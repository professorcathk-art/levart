import type { Attraction, DayActivity, DayItinerary, Itinerary, RouteData, TripFocus } from '@/types'
import { parseVersionList } from '@/lib/trips/versions'

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
    notes: partial?.notes,
    currency: partial?.currency,
    versions: partial?.versions,
    lastChange: partial?.lastChange,
  }
}

export function itineraryHasPlan(itinerary: Itinerary | null | undefined): boolean {
  return Boolean(itinerary && itinerary.destination && itinerary.days.length > 0)
}

export function isTripFocus(value: string): value is TripFocus {
  return ['shopping', 'food', 'climbing', 'culture', 'nightlife', 'beach', 'family'].includes(value)
}

function parseActivity(value: unknown): DayActivity | null {
  if (!value || typeof value !== 'object') return null
  const raw = value as Partial<DayActivity>
  if (typeof raw.activity !== 'string' || typeof raw.location !== 'string') return null
  const time = raw.time === 'afternoon' || raw.time === 'evening' ? raw.time : 'morning'
  return {
    ...raw,
    time,
    activity: raw.activity,
    location: raw.location,
    notes: typeof raw.notes === 'string' ? raw.notes : undefined,
    userLocked: Boolean(raw.userLocked),
    tips: Array.isArray(raw.tips) ? raw.tips.filter((item): item is string => typeof item === 'string') : undefined,
  }
}

function parseDay(value: unknown): DayItinerary | null {
  if (!value || typeof value !== 'object') return null
  const raw = value as Partial<DayItinerary>
  const activities = Array.isArray(raw.activities)
    ? raw.activities.map(parseActivity).filter((item): item is DayActivity => Boolean(item))
    : []
  return {
    day: typeof raw.day === 'number' ? raw.day : 1,
    date: typeof raw.date === 'string' ? raw.date : '',
    weather: raw.weather,
    activities,
    restaurants: Array.isArray(raw.restaurants) ? raw.restaurants : [],
    transport: Array.isArray(raw.transport) ? raw.transport : [],
    estimatedCost: typeof raw.estimatedCost === 'string' ? raw.estimatedCost : '',
    totalDistance: raw.totalDistance,
    totalDuration: raw.totalDuration,
    difficulty: raw.difficulty,
    destinationPhoto: raw.destinationPhoto,
    notes: typeof raw.notes === 'string' ? raw.notes : undefined,
    userLocked: Boolean(raw.userLocked),
  }
}

export function parseItinerary(value: unknown): Itinerary {
  if (!value || typeof value !== 'object') {
    return emptyItinerary()
  }

  const raw = value as Partial<Itinerary> & { versions?: unknown }
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
    days: Array.isArray(raw.days)
      ? raw.days.map(parseDay).filter((item): item is DayItinerary => Boolean(item))
      : [],
    checkIn: raw.checkIn,
    checkOut: raw.checkOut,
    notes: typeof raw.notes === 'string' ? raw.notes : undefined,
    currency: typeof raw.currency === 'string' ? raw.currency : undefined,
    versions: parseVersionList(raw.versions).map((version) => ({
      ...version,
      itinerary: parseItinerary({ ...version.itinerary, versions: [] }),
    })),
    lastChange: typeof raw.lastChange === 'string' ? raw.lastChange : undefined,
  })
}

export function addDays(date: string, days: number): string {
  const next = new Date(`${date}T00:00:00`)
  next.setDate(next.getDate() + days)
  return next.toISOString().split('T')[0]
}
