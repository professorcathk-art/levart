import { NextRequest, NextResponse } from 'next/server'
// Try Google Places first, fallback to Geoapify
import { searchAttractions as searchGooglePlaces } from '@/lib/apis/google-places'
import { searchAttractions as searchGeoapify } from '@/lib/apis/geoapify'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { destination, focus } = body

    if (!destination || !focus || !Array.isArray(focus)) {
      return NextResponse.json(
        { error: 'Missing destination or focus' },
        { status: 400 }
      )
    }

    // Try Google Places API first (better coverage)
    let attractions: Awaited<ReturnType<typeof searchGooglePlaces>> = []
    let error: string | null = null

    try {
      attractions = await searchGooglePlaces(destination, focus)
      console.log(`Google Places found ${attractions.length} attractions for ${destination}`)
    } catch (googleError) {
      console.warn('Google Places API failed, trying Geoapify fallback:', googleError)
      error = googleError instanceof Error ? googleError.message : 'Google Places API error'
      
      // Fallback to Geoapify
      try {
        attractions = await searchGeoapify(destination, focus)
        console.log(`Geoapify found ${attractions.length} attractions for ${destination}`)
        error = null // Clear error if fallback succeeds
      } catch (geoapifyError) {
        console.error('Both APIs failed:', geoapifyError)
        throw geoapifyError
      }
    }

    console.log(`Found ${attractions.length} attractions for ${destination}`)
    return NextResponse.json({ attractions, error: error || undefined })
  } catch (error) {
    console.error('Error fetching attractions:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: `Failed to fetch attractions: ${errorMessage}`, attractions: [] },
      { status: 500 }
    )
  }
}
