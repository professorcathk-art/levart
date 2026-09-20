export async function geocodePlace(
  query: string,
  options?: { types?: string; proximity?: { lon: number; lat: number }; language?: string }
): Promise<{ lat: number; lon: number; name?: string } | null> {
  const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || process.env.MAPBOX_ACCESS_TOKEN
  const text = query.trim()
  if (!token || !text) return null

  try {
    const params = new URLSearchParams({
      access_token: token,
      limit: '1',
      types: options?.types || 'place,region,country,poi,address,neighborhood,locality',
      autocomplete: 'false',
    })
    if (options?.language) {
      params.set('language', options.language)
    }
    if (options?.proximity) {
      params.set('proximity', `${options.proximity.lon},${options.proximity.lat}`)
    }
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(text)}.json?${params}`,
      { signal: AbortSignal.timeout(4000) }
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

export function hasGooglePlacesKey() {
  return Boolean(process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY)
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
