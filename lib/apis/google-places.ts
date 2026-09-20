import type { Attraction } from '@/types'
import { geocodePlace } from '@/lib/apis/geocode'

const PLACES_SEARCH_URL = 'https://places.googleapis.com/v1/places:searchText'
const PLACES_NEARBY_URL = 'https://places.googleapis.com/v1/places:searchNearby'

const FOCUS_QUERIES: Record<string, string> = {
  shopping: 'shopping',
  food: 'restaurants and cafes',
  climbing: 'hiking and parks',
  culture: 'museums and cultural sites',
  nightlife: 'nightlife and bars',
  beach: 'beaches',
  family: 'family attractions',
}

const FOCUS_TYPES: Record<string, string> = {
  shopping: 'shopping_mall',
  food: 'restaurant',
  climbing: 'park',
  culture: 'museum',
  nightlife: 'night_club',
  beach: 'beach',
  family: 'amusement_park',
}

const FIELD_MASK = [
  'places.id',
  'places.displayName',
  'places.formattedAddress',
  'places.location',
  'places.types',
  'places.rating',
  'places.userRatingCount',
  'places.priceLevel',
  'places.photos',
  'places.nationalPhoneNumber',
  'places.websiteUri',
  'places.regularOpeningHours',
].join(',')

interface PlacesNewPlace {
  id?: string
  displayName?: { text?: string }
  formattedAddress?: string
  location?: { latitude?: number; longitude?: number }
  types?: string[]
  rating?: number
  userRatingCount?: number
  priceLevel?: string
  photos?: Array<{ name?: string }>
  nationalPhoneNumber?: string
  websiteUri?: string
  regularOpeningHours?: { weekdayDescriptions?: string[] }
}

function placesApiKey() {
  return process.env.GOOGLE_PLACES_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY || ''
}

function priceLevelToNumber(level?: string) {
  switch (level) {
    case 'PRICE_LEVEL_FREE':
      return 0
    case 'PRICE_LEVEL_INEXPENSIVE':
      return 1
    case 'PRICE_LEVEL_MODERATE':
      return 2
    case 'PRICE_LEVEL_EXPENSIVE':
      return 3
    case 'PRICE_LEVEL_VERY_EXPENSIVE':
      return 4
    default:
      return undefined
  }
}

function toAttraction(place: PlacesNewPlace): Attraction | null {
  const lat = place.location?.latitude
  const lon = place.location?.longitude
  const name = place.displayName?.text
  const id = place.id
  if (!id || !name || typeof lat !== 'number' || typeof lon !== 'number') return null
  return {
    id,
    placeId: id,
    name,
    category: place.types?.[0] || 'tourist_attraction',
    lat,
    lon,
    address: place.formattedAddress,
    photoReference: place.photos?.[0]?.name,
    rating: place.rating,
    userRatingsTotal: place.userRatingCount,
    priceLevel: priceLevelToNumber(place.priceLevel),
    openingHours: place.regularOpeningHours?.weekdayDescriptions,
    phoneNumber: place.nationalPhoneNumber,
    website: place.websiteUri,
  }
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function deduplicateAttractions(attractions: Attraction[]): Attraction[] {
  const seen = new Map<string, Attraction>()
  for (const attraction of attractions) {
    const key = attraction.placeId || attraction.id
    const existing = seen.get(key)
    if (!existing) {
      seen.set(key, attraction)
      continue
    }
    const better =
      (attraction.rating || 0) * (attraction.userRatingsTotal || 0) >
      (existing.rating || 0) * (existing.userRatingsTotal || 0)
    if (better) seen.set(key, attraction)
  }
  return Array.from(seen.values())
}

async function placesPost(url: string, body: Record<string, unknown>, apiKey: string) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': FIELD_MASK,
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(8000),
  })
  if (!response.ok) {
    const detail = await response.text()
    throw new Error(`Places API failed (${response.status}): ${detail.slice(0, 280)}`)
  }
  return (await response.json()) as { places?: PlacesNewPlace[] }
}

export async function searchAttractions(
  destination: string,
  focus: string[],
  radiusKm: number = 20
): Promise<Attraction[]> {
  const apiKey = placesApiKey()
  if (!apiKey) {
    throw new Error('Google Places API key is not configured')
  }

  const center = await geocodePlace(destination)
  if (!center) {
    throw new Error('Destination not found')
  }

  const circle = {
    circle: {
      center: { latitude: center.lat, longitude: center.lon },
      radius: Math.min(Math.max(radiusKm, 1), 50) * 1000,
    },
  }

  const queries = [
    `top attractions in ${destination}`,
    ...focus.slice(0, 3).map((item) => `${FOCUS_QUERIES[item] || item} in ${destination}`),
  ]

  const searchResults = await Promise.all(
    queries.map((textQuery) =>
      placesPost(
        PLACES_SEARCH_URL,
        {
          textQuery,
          languageCode: /[\u4e00-\u9fff]/.test(destination) ? 'zh' : 'en',
          maxResultCount: 20,
          locationBias: circle,
        },
        apiKey
      ).catch((error: unknown) => {
        console.warn('Places text search failed:', error)
        return { places: [] as PlacesNewPlace[] }
      })
    )
  )

  let attractions = searchResults
    .flatMap((result) => result.places ?? [])
    .map(toAttraction)
    .filter((item): item is Attraction => item !== null)
    .filter((item) => calculateDistance(center.lat, center.lon, item.lat, item.lon) <= radiusKm + 8)

  if (attractions.length < 8) {
    const includedType = FOCUS_TYPES[focus[0] || ''] || 'tourist_attraction'
    try {
      const nearby = await placesPost(
        PLACES_NEARBY_URL,
        {
          includedTypes: [includedType],
          maxResultCount: 20,
          locationRestriction: circle,
        },
        apiKey
      )
      attractions = [
        ...attractions,
        ...(nearby.places ?? []).map(toAttraction).filter((item): item is Attraction => item !== null),
      ]
    } catch (error) {
      console.warn('Places nearby search failed:', error)
    }
  }

  const sorted = deduplicateAttractions(attractions).sort((a, b) => {
    const aScore = (a.rating || 0) * (a.userRatingsTotal || 1)
    const bScore = (b.rating || 0) * (b.userRatingsTotal || 1)
    return bScore - aScore
  })

  return sorted.slice(0, 50)
}

export async function getPlacePhoto(photoReference: string, maxWidth = 800): Promise<string | null> {
  const apiKey = placesApiKey()
  if (!apiKey || !photoReference) return null
  const name = photoReference.startsWith('places/') ? photoReference : `places/${photoReference}`
  return `https://places.googleapis.com/v1/${name}/media?maxHeightPx=${maxWidth}&key=${encodeURIComponent(apiKey)}`
}

export async function searchPlacePhotos(query: string): Promise<string | null> {
  const apiKey = placesApiKey()
  if (!apiKey || !query.trim()) return null
  try {
    const data = await placesPost(PLACES_SEARCH_URL, { textQuery: query, maxResultCount: 1 }, apiKey)
    const photoName = data.places?.[0]?.photos?.[0]?.name
    if (!photoName) return null
    return getPlacePhoto(photoName)
  } catch (error) {
    console.error('Error searching place photos:', error)
    return null
  }
}
