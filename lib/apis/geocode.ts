export async function geocodePlace(query: string): Promise<{ lat: number; lon: number } | null> {
  const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || process.env.MAPBOX_ACCESS_TOKEN
  const text = query.trim()
  if (!token || !text) return null

  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(text)}.json?` +
        new URLSearchParams({
          access_token: token,
          limit: '1',
          types: 'place,region,country',
        }),
      { signal: AbortSignal.timeout(4000) }
    )
    if (!response.ok) return null

    const data = (await response.json()) as {
      features?: Array<{ center?: [number, number] }>
    }
    const center = data.features?.[0]?.center
    if (!center || center.length < 2) return null
    const [lon, lat] = center
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null
    return { lat, lon }
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
