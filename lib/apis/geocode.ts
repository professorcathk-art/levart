export async function geocodePlace(
  query: string,
  options?: { types?: string; proximity?: { lon: number; lat: number }; language?: string }
): Promise<{ lat: number; lon: number; name?: string } | null> {
  const text = query.trim()
  if (!text) return null

  const mapbox = await geocodeWithMapbox(text, options)
  if (mapbox) return mapbox
  return geocodeWithPlaces(text, options?.language)
}

async function geocodeWithMapbox(
  text: string,
  options?: { types?: string; proximity?: { lon: number; lat: number }; language?: string }
) {
  const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || process.env.MAPBOX_ACCESS_TOKEN
  if (!token) return null

  try {
    const language = options?.language || (/[\u4e00-\u9fff]/.test(text) ? 'zh' : 'en')
    const params = new URLSearchParams({
      access_token: token,
      limit: '1',
      types: options?.types || 'place,region,country,poi,address,neighborhood,locality,district',
      autocomplete: 'false',
      language,
    })
    if (options?.proximity) {
      params.set('proximity', `${options.proximity.lon},${options.proximity.lat}`)
    }
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(text)}.json?${params}`,
      { signal: AbortSignal.timeout(5000) }
    )
    if (!response.ok) return null

    const data = (await response.json()) as {
      features?: Array<{ center?: [number, number]; text?: string; place_name?: string }>
    }
    const feature = data.features?.[0]
    const center = feature?.center
    if (!center || center.length < 2) return null
    const [lon, lat] = center
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null
    return { lat, lon, name: feature.text || feature.place_name }
  } catch (error) {
    console.warn('Mapbox geocode failed:', error)
    return null
  }
}

async function geocodeWithPlaces(text: string, language?: string) {
  const key = process.env.GOOGLE_PLACES_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY
  if (!key) return null

  try {
    const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': key,
        'X-Goog-FieldMask': 'places.displayName,places.location',
      },
      body: JSON.stringify({
        textQuery: text,
        languageCode: language || (/[\u4e00-\u9fff]/.test(text) ? 'zh-TW' : 'en'),
        maxResultCount: 1,
      }),
      signal: AbortSignal.timeout(6000),
    })
    if (!response.ok) return null
    const data = (await response.json()) as {
      places?: Array<{ displayName?: { text?: string }; location?: { latitude?: number; longitude?: number } }>
    }
    const place = data.places?.[0]
    const lat = place?.location?.latitude
    const lon = place?.location?.longitude
    if (typeof lat !== 'number' || typeof lon !== 'number') return null
    return { lat, lon, name: place?.displayName?.text }
  } catch (error) {
    console.warn('Places geocode failed:', error)
    return null
  }
}

export function hasGooglePlacesKey() {
  return Boolean(process.env.GOOGLE_PLACES_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY)
}

export function hasGeoapifyKey() {
  return Boolean(process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY)
}

export function isValidCoord(lat?: number, lon?: number) {
  return (
    typeof lat === 'number' &&
    typeof lon === 'number' &&
    Number.isFinite(lat) &&
    Number.isFinite(lon) &&
    Math.abs(lat) <= 90 &&
    Math.abs(lon) <= 180 &&
    !(Math.abs(lat) < 0.01 && Math.abs(lon) < 0.01)
  )
}
