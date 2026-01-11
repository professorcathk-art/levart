const UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY || ''
const UNSPLASH_BASE_URL = 'https://api.unsplash.com'

export interface UnsplashPhoto {
  id: string
  urls: {
    regular: string
    small: string
    thumb: string
  }
  alt_description?: string
  user: {
    name: string
  }
}

export async function searchPhoto(query: string): Promise<UnsplashPhoto | null> {
  if (!UNSPLASH_ACCESS_KEY) {
    // Return placeholder if no API key
    return null
  }

  try {
    const response = await fetch(
      `${UNSPLASH_BASE_URL}/search/photos?` +
        new URLSearchParams({
          query: query,
          per_page: '1',
          orientation: 'landscape',
        }),
      {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      }
    )

    if (!response.ok) {
      return null
    }

    const data = (await response.json()) as {
      results?: Array<UnsplashPhoto>
    }

    return data.results && data.results.length > 0 ? data.results[0] : null
  } catch (error) {
    console.error('Error fetching Unsplash photo:', error)
    return null
  }
}

export function getPlaceholderImage(query: string): string {
  // Use placeholder service as fallback
  return `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&q=80`
}
