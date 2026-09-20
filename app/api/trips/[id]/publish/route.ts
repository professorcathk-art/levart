import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAuthUser } from '@/lib/supabase/auth'
import { freezePublishedCopy } from '@/lib/trips/itinerary'
import { slugifyDestination } from '@/lib/trips/slug'
import { getOwnedTrip } from '@/lib/trips/queries'

export async function POST(_request: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthUser()
  if (!user) {
    return NextResponse.json({ error: 'Sign in required' }, { status: 401 })
  }

  const trip = await getOwnedTrip(params.id, user.id)
  if (!trip) {
    return NextResponse.json({ error: 'Trip not found' }, { status: 404 })
  }
  if (trip.status !== 'confirmed') {
    return NextResponse.json({ error: 'Confirm the plan before publishing' }, { status: 400 })
  }

  const slug = trip.slug || slugifyDestination(trip.destination)
  const supabase = await createClient()
  const { error } = await supabase
    .from('trips')
    .update({
      visibility: 'public',
      slug,
      itinerary: freezePublishedCopy(trip.itinerary),
    })
    .eq('id', params.id)
    .eq('owner_id', user.id)

  if (error) {
    console.error('Failed to publish trip:', error)
    return NextResponse.json({ error: 'Failed to publish trip' }, { status: 500 })
  }

  return NextResponse.json({ slug, url: `/p/${slug}` })
}
