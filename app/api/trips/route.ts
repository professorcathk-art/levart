import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAuthUser } from '@/lib/supabase/auth'
import { emptyItinerary, parseItinerary } from '@/lib/trips/itinerary'
import { mapTrip } from '@/lib/trips/mappers'
import { getMyTrips } from '@/lib/trips/queries'

export async function GET() {
  const user = await getAuthUser()
  if (!user) {
    return NextResponse.json({ error: 'Sign in required' }, { status: 401 })
  }

  const trips = await getMyTrips(user.id)
  return NextResponse.json({ trips })
}

export async function POST(request: NextRequest) {
  const user = await getAuthUser()
  if (!user) {
    return NextResponse.json({ error: 'Sign in required' }, { status: 401 })
  }

  try {
    const body = (await request.json()) as {
      itinerary?: unknown
      messages?: Array<{ role?: string; parts?: unknown }>
    }
    const itinerary = parseItinerary(body.itinerary ?? emptyItinerary())
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('trips')
      .insert({
        owner_id: user.id,
        destination: itinerary.destination,
        trip_focus: itinerary.tripFocus,
        check_in: itinerary.checkIn ?? null,
        check_out: itinerary.checkOut ?? null,
        status: 'draft',
        visibility: 'private',
        itinerary,
        selected_attractions: itinerary.selectedAttractions,
        route_data: itinerary.route,
      })
      .select('*')
      .single()

    if (error || !data) {
      console.error('Failed to create trip:', error)
      return NextResponse.json({ error: 'Failed to create trip' }, { status: 500 })
    }

    const { data: conversation } = await supabase
      .from('conversations')
      .insert({ trip_id: data.id })
      .select('id')
      .single()

    const rows = (body.messages ?? [])
      .filter((message) => message.role === 'user' || message.role === 'assistant')
      .map((message) => ({
        conversation_id: conversation?.id,
        role: message.role,
        parts: message.parts ?? [],
      }))
      .filter((row) => row.conversation_id)

    if (rows.length > 0) {
      const { error: messageError } = await supabase.from('messages').insert(rows)
      if (messageError) {
        console.error('Failed to import guest messages:', messageError)
      }
    }

    return NextResponse.json({ trip: mapTrip(data) }, { status: 201 })
  } catch (error) {
    console.error('Create trip failed:', error)
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
