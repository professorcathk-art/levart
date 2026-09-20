import { parseItinerary } from '@/lib/trips/itinerary'
import type { Trip } from '@/types'

const PREFIX = 'levart-offline-trip-'
export const OFFLINE_INDEX_KEY = 'levart-offline-index'
export const OFFLINE_CACHE = 'levart-offline-v1'

export interface OfflineTripRecord {
  savedAt: number
  trip: Trip
}

function canUseStorage() {
  return typeof window !== 'undefined'
}

function keyFor(tripId: string) {
  return `${PREFIX}${tripId}`
}

function slimTrip(trip: Trip): Trip {
  return {
    ...trip,
    itinerary: {
      ...trip.itinerary,
      versions: undefined,
    },
  }
}

function readIndex(): string[] {
  if (!canUseStorage()) return []
  try {
    const raw = window.localStorage.getItem(OFFLINE_INDEX_KEY)
    const parsed = raw ? (JSON.parse(raw) as unknown) : []
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : []
  } catch {
    return []
  }
}

function writeIndex(ids: string[]) {
  window.localStorage.setItem(OFFLINE_INDEX_KEY, JSON.stringify(Array.from(new Set(ids))))
}

export function readOfflineTrip(tripId: string): OfflineTripRecord | null {
  if (!canUseStorage()) return null
  try {
    const raw = window.localStorage.getItem(keyFor(tripId))
    if (!raw) return null
    const parsed = JSON.parse(raw) as { savedAt?: unknown; trip?: unknown }
    if (!parsed.trip || typeof parsed.trip !== 'object') return null
    const trip = parsed.trip as Trip
    return {
      savedAt: typeof parsed.savedAt === 'number' ? parsed.savedAt : Date.now(),
      trip: {
        ...trip,
        itinerary: parseItinerary(trip.itinerary),
      },
    }
  } catch (error) {
    console.error('Failed to read offline trip:', error)
    return null
  }
}

export function isTripSavedOffline(tripId: string) {
  return Boolean(readOfflineTrip(tripId))
}

export function saveTripOffline(trip: Trip) {
  if (!canUseStorage()) return
  const record: OfflineTripRecord = {
    savedAt: Date.now(),
    trip: slimTrip(trip),
  }
  window.localStorage.setItem(keyFor(trip.id), JSON.stringify(record))
  writeIndex([...readIndex(), trip.id])
}

export function removeTripOffline(tripId: string) {
  if (!canUseStorage()) return
  window.localStorage.removeItem(keyFor(tripId))
  writeIndex(readIndex().filter((id) => id !== tripId))
}

export async function cacheCurrentPage() {
  if (typeof window === 'undefined' || !('caches' in window)) return
  try {
    const cache = await caches.open(OFFLINE_CACHE)
    await cache.add(window.location.href)
  } catch (error) {
    console.error('Failed to cache itinerary page:', error)
  }
}
