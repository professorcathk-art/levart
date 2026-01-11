import { NextRequest, NextResponse } from 'next/server'
import { searchPhoto } from '@/lib/apis/unsplash'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter "q" is required' },
        { status: 400 }
      )
    }

    const photo = await searchPhoto(query)
    
    if (!photo) {
      return NextResponse.json({ photo: null })
    }

    return NextResponse.json({ photo })
  } catch (error) {
    console.error('Error in Unsplash search:', error)
    return NextResponse.json(
      { error: 'Failed to search photos' },
      { status: 500 }
    )
  }
}
