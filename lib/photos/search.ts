import { searchPlacePhotos } from '@/lib/apis/google-places'
import { searchPhoto } from '@/lib/apis/unsplash'

export interface ResolvedPhoto {
  photo: string | null
  source: 'google' | 'unsplash' | null
  credit?: string
}

export async function resolvePlacePhoto(query: string): Promise<ResolvedPhoto> {
  const trimmed = query.trim()
  if (!trimmed) {
    return { photo: null, source: null }
  }

  try {
    const google = await searchPlacePhotos(trimmed)
    if (google) {
      return { photo: google, source: 'google' }
    }
  } catch (error) {
    console.error('Google photo lookup failed:', error)
  }

  try {
    const unsplash = await searchPhoto(trimmed)
    if (unsplash?.urls.regular) {
      return {
        photo: unsplash.urls.regular,
        source: 'unsplash',
        credit: unsplash.user?.name,
      }
    }
  } catch (error) {
    console.error('Unsplash photo lookup failed:', error)
  }

  return { photo: null, source: null }
}
