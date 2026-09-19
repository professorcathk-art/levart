import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAuthUser } from '@/lib/supabase/auth'
import { getOwnedTrip } from '@/lib/trips/queries'
import { parseItinerary } from '@/lib/trips/itinerary'

interface RouteContext {
  params: { id: string }
}

export async function GET(_request: NextRequest, { params }: RouteContext) {
  const user = await getAuthUser()
  if (!user) {
    return NextResponse.json({ error: 'Sign in required' }, { status: 401 })
  }

  const trip = await getOwnedTrip(params.id, user.id)
  if (!trip) {
    return NextResponse.json({ error: 'Trip not found' }, { status: 404 })
  }

  return NextResponse.json({ trip })
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const user = await getAuthUser()
  if (!user) {
    return NextResponse.json({ error: 'Sign in required' }, { status: 401 })
  }

  const trip = await getOwnedTrip(params.id, user.id)
  if (!trip) {
    return NextResponse.json({ error: 'Trip not found' }, { status: 404 })
  }

  const body = (await request.json()) as { destination?: string; itinerary?: unknown }
  const itinerary = body.itinerary ? parseItinerary(body.itinerary) : trip.itinerary
  const supabase = await createClient()
  const { error } = await supabase
    .from('trips')
    .update({
      destination: itinerary.destination || body.destination || trip.destination,
      trip_focus: itinerary.tripFocus,
      check_in: itinerary.checkIn ?? null,
      check_out: itinerary.checkOut ?? null,
      itinerary,
      selected_attractions: itinerary.selectedAttractions,
      route_data: itinerary.route,
    })
    .eq('id', params.id)
    .eq('owner_id', user.id)

  if (error) {
    console.error('Failed to update trip:', error)
    return NextResponse.json({ error: 'Failed to update trip' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
