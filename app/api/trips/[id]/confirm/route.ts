import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAuthUser } from '@/lib/supabase/auth'
import { itineraryHasPlan, freezePublishedCopy } from '@/lib/trips/itinerary'
import { getOwnedTrip } from '@/lib/trips/queries'
import { resolveCoverPhotos } from '@/lib/photos/search'

export async function POST(_request: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthUser()
  if (!user) {
    return NextResponse.json({ error: 'Sign in required' }, { status: 401 })
  }

  const trip = await getOwnedTrip(params.id, user.id)
  if (!trip) {
    return NextResponse.json({ error: 'Trip not found' }, { status: 404 })
  }

  if (!itineraryHasPlan(trip.itinerary)) {
    return NextResponse.json({ error: 'Add a destination and at least one day before confirming' }, { status: 400 })
  }

  const supabase = await createClient()
  let coverPhoto = trip.coverPhoto
  if (!coverPhoto && trip.destination) {
    try {
      const photos = await resolveCoverPhotos(trip.destination)
      coverPhoto = photos[0] ?? null
    } catch (error) {
      console.error('Cover photo lookup failed:', error)
    }
  }

  const nextItinerary =
    trip.visibility === 'public' || trip.itinerary.publishedCopy
      ? freezePublishedCopy(trip.itinerary)
      : trip.itinerary

  const { error } = await supabase
    .from('trips')
    .update({
      status: 'confirmed',
      confirmed_at: new Date().toISOString(),
      cover_photo: coverPhoto ?? null,
      itinerary: nextItinerary,
    })
    .eq('id', params.id)
    .eq('owner_id', user.id)

  if (error) {
    console.error('Failed to confirm trip:', error)
    return NextResponse.json({ error: 'Failed to confirm trip' }, { status: 500 })
  }

  return NextResponse.json({ ok: true, tripId: params.id })
}
