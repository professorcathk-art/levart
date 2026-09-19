import type { DestinationSuggestion } from '@/types'

const GEOAPIFY_AUTOCOMPLETE_URL = 'https://api.geoapify.com/v1/geocode/autocomplete'

export async function searchDestinations(query: string): Promise<DestinationSuggestion[]> {
  if (!query || query.length < 2) {
    return []
  }

  const apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY
  if (!apiKey) {
    return []
  }

  const response = await fetch(
    `${GEOAPIFY_AUTOCOMPLETE_URL}?` +
      new URLSearchParams({
        text: query,
        limit: '8',
        type: 'city',
        apiKey,
      })
  )

  if (!response.ok) {
    throw new Error(`Destination search failed: ${response.statusText}`)
  }

  const data = (await response.json()) as {
    features?: Array<{
      properties: {
        name: string
        country: string
        state?: string
        formatted: string
      }
    }>
  }

  return (data.features ?? []).map((feature) => ({
    name: feature.properties.name,
    country: feature.properties.country,
    state: feature.properties.state,
    formatted: feature.properties.formatted,
    display: feature.properties.formatted,
  }))
}
