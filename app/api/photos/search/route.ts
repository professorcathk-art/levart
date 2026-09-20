import { NextRequest, NextResponse } from 'next/server'
import { resolvePlacePhoto } from '@/lib/photos/search'
import { getPlacePhoto } from '@/lib/apis/google-places'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')
    const photoReference = searchParams.get('photo_reference')

    if (photoReference) {
      const photoUrl = await getPlacePhoto(photoReference)
      if (photoUrl) {
        return NextResponse.json({ photo: photoUrl, source: 'google' })
      }
    }

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter "q" or "photo_reference" is required' },
        { status: 400 }
      )
    }

    const resolved = await resolvePlacePhoto(query)
    return NextResponse.json({
      photo: resolved.photo,
      source: resolved.source,
      credit: resolved.credit,
    })
  } catch (error) {
    console.error('Error in photo search:', error)
    return NextResponse.json(
      { error: 'Failed to search photos', photo: null },
      { status: 500 }
    )
  }
}
