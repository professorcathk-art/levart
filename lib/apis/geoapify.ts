import type { Attraction } from '@/types'

const GEOAPIFY_BASE_URL = 'https://api.geoapify.com/v2/places'

// Map trip focus to Geoapify categories
const FOCUS_TO_CATEGORIES: Record<string, string[]> = {
  shopping: ['commercial.shopping_mall', 'commercial.shopping'],
  food: ['catering.restaurant', 'catering.fast_food', 'catering.cafe'],
  climbing: ['entertainment.sport', 'entertainment.outdoor'],
  culture: ['entertainment.museum', 'entertainment.culture', 'entertainment.theatre'],
  nightlife: ['entertainment.nightclub', 'entertainment.bar'],
  beach: ['beach'],
  family: ['entertainment', 'entertainment.theme_park', 'entertainment.zoo'],
}

export async function searchAttractions(
  destination: string,
  focus: string[]
): Promise<Attraction[]> {
  const apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY
  if (!apiKey) {
    throw new Error('Geoapify API key is not configured')
  }

  // Collect all categories from selected focus
  const categories = new Set<string>()
  focus.forEach((f) => {
    const cats = FOCUS_TO_CATEGORIES[f] || []
    cats.forEach((cat) => categories.add(cat))
  })

  const categoriesParam = Array.from(categories).join(',')

  try {
    const response = await fetch(
      `${GEOAPIFY_BASE_URL}/search?` +
        new URLSearchParams({
          text: destination,
          categories: categoriesParam,
          limit: '50',
          apiKey,
        })
    )

    if (!response.ok) {
      throw new Error(`Geoapify API error: ${response.statusText}`)
    }

    const data = await response.json()
    const features = data.features || []

    return features.map((feature: unknown) => {
      const f = feature as {
        properties: {
          name: string
          categories: string
          lat: number
          lon: number
          formatted?: string
        }
        geometry: {
          coordinates: [number, number]
        }
      }
      return {
        id: `${f.properties.lat}-${f.properties.lon}`,
        name: f.properties.name,
        category: f.properties.categories || 'unknown',
        lat: f.properties.lat,
        lon: f.properties.lon,
        address: f.properties.formatted,
      }
    })
  } catch (error) {
    console.error('Error fetching attractions:', error)
    throw error
  }
}
