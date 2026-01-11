import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      userId,
      destination,
      tripFocus,
      selectedAttractions,
      routeData,
      finalItinerary,
      checkIn,
      checkOut,
    } = body

    if (!destination || !tripFocus || !selectedAttractions || !finalItinerary) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('itineraries')
      .insert({
        user_id: userId || null,
        destination,
        trip_focus: tripFocus,
        selected_attractions: selectedAttractions,
        route_data: routeData,
        final_itinerary: finalItinerary,
        check_in: checkIn || null,
        check_out: checkOut || null,
      })
      .select()
      .single()

    if (error) {
      console.error('Error saving itinerary:', error)
      return NextResponse.json(
        { error: 'Failed to save itinerary' },
        { status: 500 }
      )
    }

    return NextResponse.json({ itinerary: data })
  } catch (error) {
    console.error('Error in save itinerary handler:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
