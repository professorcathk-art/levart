import { searchPlacePhotos } from '@/lib/apis/google-places'
import { searchPhoto } from '@/lib/apis/unsplash'
import { coverSearchQueries, curatedCoverPhotos } from '@/lib/photos/cover-query'

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

export async function resolveCoverPhotos(destination: string, hints: string[] = []): Promise<string[]> {
  const photos: string[] = []
  const seen = new Set<string>()
  const add = (url: string | null | undefined) => {
    if (!url || seen.has(url)) return
    seen.add(url)
    photos.push(url)
  }

  for (const query of coverSearchQueries(destination, hints)) {
    const resolved = await resolvePlacePhoto(query)
    add(resolved.photo)
    if (photos.length >= 3) break
  }
  if (photos.length < 3) {
    for (const fallback of curatedCoverPhotos(destination, hints)) add(fallback)
  }
  return photos.slice(0, 3)
}
