import type { Attraction } from '@/types'

const GOOGLE_PLACES_BASE_URL = 'https://maps.googleapis.com/maps/api/place'

// Map trip focus to Google Places types
const FOCUS_TO_TYPES: Record<string, string[]> = {
  shopping: ['shopping_mall', 'store', 'clothing_store', 'jewelry_store'],
  food: ['restaurant', 'cafe', 'food', 'meal_takeaway'],
  climbing: ['gym', 'park', 'natural_feature'],
  culture: ['museum', 'art_gallery', 'library', 'church', 'temple', 'tourist_attraction'],
  nightlife: ['night_club', 'bar', 'casino'],
  beach: ['beach'],
  family: ['amusement_park', 'zoo', 'aquarium', 'park', 'tourist_attraction'],
}

// Helper function to calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Deduplicate attractions by grouping similar names and locations
function deduplicateAttractions(attractions: Attraction[]): Attraction[] {
  const seen = new Map<string, Attraction>()
  
  for (const attraction of attractions) {
    const key = attraction.placeId || attraction.id
    const normalizedName = attraction.name.toLowerCase().trim()
    
    // Check if we've seen a similar attraction
    let found = false
    for (const [existingKey, existing] of seen.entries()) {
      const existingName = existing.name.toLowerCase().trim()
      const distance = calculateDistance(
        attraction.lat,
        attraction.lon,
        existing.lat,
        existing.lon
      )
      
      // If names are very similar and locations are close (< 500m), consider them duplicates
      if (
        (normalizedName === existingName ||
          normalizedName.includes(existingName) ||
          existingName.includes(normalizedName)) &&
        distance < 0.5
      ) {
        // Keep the one with better rating or more reviews
        if (
          (attraction.rating || 0) > (existing.rating || 0) ||
          (attraction.userRatingsTotal || 0) > (existing.userRatingsTotal || 0)
        ) {
          seen.set(existingKey, attraction)
        }
        found = true
        break
      }
    }
    
    if (!found) {
      seen.set(key, attraction)
    }
  }
  
  return Array.from(seen.values())
}

export async function searchAttractions(
  destination: string,
  focus: string[],
  radiusKm: number = 20
): Promise<Attraction[]> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY
  if (!apiKey) {
    throw new Error('Google Places API key is not configured')
  }

  // Collect all types from selected focus
  const types = new Set<string>()
  focus.forEach((f) => {
    const typeList = FOCUS_TO_TYPES[f] || []
    typeList.forEach((type) => types.add(type))
  })

  try {
    // Step 1: Geocode destination to get coordinates
    const geocodeResponse = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?` +
        new URLSearchParams({
          address: destination,
          key: apiKey,
        })
    )

    if (!geocodeResponse.ok) {
      throw new Error('Failed to geocode destination')
    }

    const geocodeData = (await geocodeResponse.json()) as {
      results?: Array<{
        geometry: {
          location: {
            lat: number
            lng: number
          }
        }
      }>
      status: string
    }

    if (geocodeData.status !== 'OK' || !geocodeData.results || geocodeData.results.length === 0) {
      throw new Error('Destination not found')
    }

    const location = geocodeData.results[0].geometry.location
    const lat = location.lat
    const lng = location.lng

    console.log(`Geocoded ${destination} to: ${lat}, ${lng}`)

    // Step 2: Search for places nearby using Text Search (more comprehensive)
    // Google Places Text Search is better for finding attractions by name/location
    const textSearchResponse = await fetch(
      `${GOOGLE_PLACES_BASE_URL}/textsearch/json?` +
        new URLSearchParams({
          query: `${types.size > 0 ? Array.from(types).slice(0, 3).join(' ') + ' ' : ''}in ${destination}`,
          location: `${lat},${lng}`,
          radius: (radiusKm * 1000).toString(), // Convert km to meters
          key: apiKey,
        })
    )

    if (!textSearchResponse.ok) {
      throw new Error('Failed to search places')
    }

    const textSearchData = (await textSearchResponse.json()) as {
      results?: Array<{
        place_id: string
        name: string
        types: string[]
        geometry: {
          location: {
            lat: number
            lng: number
          }
        }
        formatted_address?: string
        rating?: number
        user_ratings_total?: number
        price_level?: number
        opening_hours?: {
          weekday_text?: string[]
        }
        photos?: Array<{
          photo_reference: string
        }>
        international_phone_number?: string
        website?: string
      }>
      status: string
    }

    let attractions: Attraction[] = []

    if (textSearchData.status === 'OK' && textSearchData.results) {
      attractions = textSearchData.results
        .filter((place) => {
          // Filter by types if we have focus types
          if (types.size > 0) {
            return place.types.some((type) => {
              // Check if any of the place types match our focus types
              return Array.from(types).some((focusType) =>
                type.includes(focusType) || focusType.includes(type)
              )
            })
          }
          return true
        })
        .slice(0, 60) // Get more results before deduplication
        .map((place) => {
          // Calculate distance from center to filter by radius
          const distance = calculateDistance(
            lat,
            lng,
            place.geometry.location.lat,
            place.geometry.location.lng
          )
          
          // Filter by radius (don't cross city borders)
          if (distance > radiusKm) {
            return null
          }
          
          return {
            id: place.place_id,
            placeId: place.place_id,
            name: place.name,
            category: place.types[0] || 'unknown',
            lat: place.geometry.location.lat,
            lon: place.geometry.location.lng,
            address: place.formatted_address,
            photoReference: place.photos && place.photos.length > 0 ? place.photos[0].photo_reference : undefined,
            rating: place.rating,
            userRatingsTotal: place.user_ratings_total,
            priceLevel: place.price_level,
            openingHours: place.opening_hours?.weekday_text,
            phoneNumber: place.international_phone_number,
            website: place.website,
          } as Attraction
        })
        .filter((a): a is Attraction => a !== null)
    }

    // If we didn't get enough results, try Nearby Search as fallback
    if (attractions.length < 10 && types.size > 0) {
      const nearbyResponse = await fetch(
        `${GOOGLE_PLACES_BASE_URL}/nearbysearch/json?` +
          new URLSearchParams({
            location: `${lat},${lng}`,
            radius: (radiusKm * 1000).toString(),
            type: Array.from(types)[0], // Use first type
            key: apiKey,
          })
      )

      if (nearbyResponse.ok) {
        const nearbyData = (await nearbyResponse.json()) as {
          results?: Array<{
            place_id: string
            name: string
            types: string[]
            geometry: {
              location: {
                lat: number
                lng: number
              }
            }
            vicinity?: string
            rating?: number
          }>
          status: string
        }

        if (nearbyData.status === 'OK' && nearbyData.results) {
          const nearbyAttractions = nearbyData.results
            .slice(0, 60 - attractions.length)
            .map((place) => {
              const distance = calculateDistance(
                lat,
                lng,
                place.geometry.location.lat,
                place.geometry.location.lng
              )
              
              if (distance > radiusKm) {
                return null
              }
              
              return {
                id: place.place_id,
                placeId: place.place_id,
                name: place.name,
                category: place.types[0] || 'unknown',
                lat: place.geometry.location.lat,
                lon: place.geometry.location.lng,
                address: place.vicinity,
                rating: place.rating,
              } as Attraction
            })
            .filter((a): a is Attraction => a !== null)

          // Merge and deduplicate by place_id
          const existingIds = new Set(attractions.map((a) => a.id))
          const newAttractions = nearbyAttractions.filter((a) => !existingIds.has(a.id))
          attractions = [...attractions, ...newAttractions]
        }
      }
    }

    // Deduplicate attractions
    const deduplicated = deduplicateAttractions(attractions)
    
    // Sort by rating and review count (most popular first)
    const sorted = deduplicated.sort((a, b) => {
      const aScore = (a.rating || 0) * (a.userRatingsTotal || 0)
      const bScore = (b.rating || 0) * (b.userRatingsTotal || 0)
      return bScore - aScore
    })
    
    console.log(`Google Places returned ${sorted.length} unique attractions for ${destination} (from ${attractions.length} total)`)
    return sorted.slice(0, 50) // Return top 50 after deduplication
  } catch (error) {
    console.error('Error fetching attractions from Google Places:', error)
    throw error
  }
}

export async function getPlacePhoto(photoReference: string, maxWidth = 800): Promise<string | null> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY
  if (!apiKey) {
    return null
  }

  try {
    const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?` +
      new URLSearchParams({
        maxwidth: maxWidth.toString(),
        photo_reference: photoReference,
        key: apiKey,
      })
    return photoUrl
  } catch (error) {
    console.error('Error getting place photo:', error)
    return null
  }
}

export async function searchPlacePhotos(query: string): Promise<string | null> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY
  if (!apiKey) {
    return null
  }

  try {
    // Use Text Search to find place
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?` +
        new URLSearchParams({
          query: query,
          key: apiKey,
        })
    )

    if (!response.ok) {
      return null
    }

    const data = (await response.json()) as {
      results?: Array<{
        photos?: Array<{
          photo_reference: string
        }>
      }>
      status: string
    }

    if (data.status === 'OK' && data.results && data.results.length > 0) {
      const firstResult = data.results[0]
      if (firstResult.photos && firstResult.photos.length > 0) {
        return getPlacePhoto(firstResult.photos[0].photo_reference)
      }
    }

    return null
  } catch (error) {
    console.error('Error searching place photos:', error)
    return null
  }
}
