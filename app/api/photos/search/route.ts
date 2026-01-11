import { NextRequest, NextResponse } from 'next/server'
import { searchPlacePhotos, getPlacePhoto } from '@/lib/apis/google-places'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')
    const photoReference = searchParams.get('photo_reference')

    // If photo_reference is provided, use it directly (faster)
    if (photoReference) {
      const photoUrl = await getPlacePhoto(photoReference)
      if (photoUrl) {
        return NextResponse.json({ photo: photoUrl })
      }
    }

    // Otherwise, search for the place and get its photo
    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter "q" or "photo_reference" is required' },
        { status: 400 }
      )
    }

    const photoUrl = await searchPlacePhotos(query)
    
    if (!photoUrl) {
      // Return placeholder if no photo found
      return NextResponse.json({ 
        photo: null,
        placeholder: `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&q=80`
      })
    }

    return NextResponse.json({ photo: photoUrl })
  } catch (error) {
    console.error('Error in photo search:', error)
    return NextResponse.json(
      { error: 'Failed to search photos', photo: null },
      { status: 500 }
    )
  }
}
