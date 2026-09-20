import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAuthUser } from '@/lib/supabase/auth'
import { getOwnedTrip } from '@/lib/trips/queries'
import { setTripVisibility } from '@/lib/trips/visibility'

export async function POST(_request: Request, { params }: { params: { id: string } }) {
  const user = await getAuthUser()
  if (!user) {
    return NextResponse.json({ error: 'Sign in required' }, { status: 401 })
  }

  const trip = await getOwnedTrip(params.id, user.id)
  if (!trip) {
    return NextResponse.json({ error: 'Trip not found' }, { status: 404 })
  }

  const supabase = await createClient()
  try {
    const result = await setTripVisibility(supabase, trip, user.id, 'private')
    return NextResponse.json({ ok: true, ...result })
  } catch (error) {
    console.error('Failed to unpublish trip:', error)
    return NextResponse.json({ error: 'Failed to unpublish trip' }, { status: 500 })
  }
}
