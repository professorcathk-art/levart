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

export async function searchAttractions(
  destination: string,
  focus: string[]
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
          radius: '50000', // 50km radius
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
        .slice(0, 50) // Limit to 50 results
        .map((place) => ({
          id: place.place_id,
          name: place.name,
          category: place.types[0] || 'unknown',
          lat: place.geometry.location.lat,
          lon: place.geometry.location.lng,
          address: place.formatted_address,
        }))
    }

    // If we didn't get enough results, try Nearby Search as fallback
    if (attractions.length < 10 && types.size > 0) {
      const nearbyResponse = await fetch(
        `${GOOGLE_PLACES_BASE_URL}/nearbysearch/json?` +
          new URLSearchParams({
            location: `${lat},${lng}`,
            radius: '50000',
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
            .slice(0, 50 - attractions.length)
            .map((place) => ({
              id: place.place_id,
              name: place.name,
              category: place.types[0] || 'unknown',
              lat: place.geometry.location.lat,
              lon: place.geometry.location.lng,
              address: place.vicinity,
            }))

          // Merge and deduplicate by place_id
          const existingIds = new Set(attractions.map((a) => a.id))
          const newAttractions = nearbyAttractions.filter((a) => !existingIds.has(a.id))
          attractions = [...attractions, ...newAttractions]
        }
      }
    }

    console.log(`Google Places returned ${attractions.length} attractions for ${destination}`)
    return attractions
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
