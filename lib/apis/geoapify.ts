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
    // First, try to get coordinates for the destination using autocomplete
    const autocompleteResponse = await fetch(
      `https://api.geoapify.com/v1/geocode/autocomplete?` +
        new URLSearchParams({
          text: destination,
          limit: '1',
          apiKey,
        })
    )

    let searchParams: URLSearchParams
    if (autocompleteResponse.ok) {
      const autocompleteData = (await autocompleteResponse.json()) as {
        features?: Array<{
          properties: {
            lat: number
            lon: number
          }
        }>
      }
      
      if (autocompleteData.features && autocompleteData.features.length > 0) {
        const coords = autocompleteData.features[0].properties
        // Use coordinates-based search for better results
        searchParams = new URLSearchParams({
          categories: categoriesParam,
          limit: '50',
          filter: `circle:${coords.lon},${coords.lat},50000`, // 50km radius
          apiKey,
        })
      } else {
        // Fallback to text search
        searchParams = new URLSearchParams({
          text: destination,
          categories: categoriesParam,
          limit: '50',
          apiKey,
        })
      }
    } else {
      // Fallback to text search
      searchParams = new URLSearchParams({
        text: destination,
        categories: categoriesParam,
        limit: '50',
        apiKey,
      })
    }

    const response = await fetch(
      `${GEOAPIFY_BASE_URL}/search?${searchParams.toString()}`
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Geoapify API error:', response.status, errorText)
      throw new Error(`Geoapify API error: ${response.statusText}`)
    }

    const data = (await response.json()) as {
      features?: Array<{
        properties: {
          name: string
          categories?: string
          lat: number
          lon: number
          formatted?: string
          address_line2?: string
        }
        geometry: {
          coordinates: [number, number]
        }
      }>
    }
    
    const features = data.features || []
    
    if (features.length === 0) {
      console.warn('No attractions found for:', destination, 'with categories:', categoriesParam)
      // Try a broader search without categories as fallback
      const fallbackParams = new URLSearchParams({
        text: destination,
        categories: 'tourism,entertainment,commercial,catering',
        limit: '50',
        apiKey,
      })
      
      const fallbackResponse = await fetch(
        `${GEOAPIFY_BASE_URL}/search?${fallbackParams.toString()}`
      )
      
      if (fallbackResponse.ok) {
        const fallbackData = (await fallbackResponse.json()) as {
          features?: Array<{
            properties: {
              name: string
              categories?: string
              lat: number
              lon: number
              formatted?: string
              address_line2?: string
            }
            geometry: {
              coordinates: [number, number]
            }
          }>
        }
        return (fallbackData.features || []).map((feature) => ({
          id: `${feature.properties.lat}-${feature.properties.lon}-${Math.random()}`,
          name: feature.properties.name,
          category: feature.properties.categories || 'unknown',
          lat: feature.properties.lat,
          lon: feature.properties.lon,
          address: feature.properties.formatted || feature.properties.address_line2,
        }))
      }
    }

    return features.map((feature) => {
      return {
        id: `${feature.properties.lat}-${feature.properties.lon}-${Math.random()}`,
        name: feature.properties.name,
        category: feature.properties.categories || 'unknown',
        lat: feature.properties.lat,
        lon: feature.properties.lon,
        address: feature.properties.formatted || feature.properties.address_line2,
      }
    })
  } catch (error) {
    console.error('Error fetching attractions:', error)
    throw error
  }
}
