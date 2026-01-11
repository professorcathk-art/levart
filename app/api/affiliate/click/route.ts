import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, itineraryId, clickType, destination } = body

    if (!clickType || !destination) {
      return NextResponse.json(
        { error: 'Missing clickType or destination' },
        { status: 400 }
      )
    }

    if (!['hotel', 'flight', 'activity'].includes(clickType)) {
      return NextResponse.json(
        { error: 'Invalid clickType' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const { error } = await supabase.from('affiliate_clicks').insert({
      user_id: userId || null,
      itinerary_id: itineraryId || null,
      click_type: clickType,
      destination,
    })

    if (error) {
      console.error('Error logging affiliate click:', error)
      return NextResponse.json(
        { error: 'Failed to log click' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in affiliate click handler:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
