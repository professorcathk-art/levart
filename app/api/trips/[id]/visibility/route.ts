import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAuthUser } from '@/lib/supabase/auth'
import { getOwnedTrip } from '@/lib/trips/queries'
import { setTripVisibility } from '@/lib/trips/visibility'
import type { TripVisibility } from '@/types'

function isVisibility(value: unknown): value is TripVisibility {
  return value === 'private' || value === 'unlisted' || value === 'public'
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const user = await getAuthUser()
  if (!user) {
    return NextResponse.json({ error: 'Sign in required' }, { status: 401 })
  }

  const trip = await getOwnedTrip(params.id, user.id)
  if (!trip) {
    return NextResponse.json({ error: 'Trip not found' }, { status: 404 })
  }
  if (trip.status !== 'confirmed') {
    return NextResponse.json({ error: 'Confirm the plan before changing visibility' }, { status: 400 })
  }

  const body = (await request.json().catch(() => null)) as { visibility?: unknown } | null
  if (!isVisibility(body?.visibility)) {
    return NextResponse.json({ error: 'Choose private, unlisted, or public' }, { status: 400 })
  }

  if (body.visibility === 'public' && !trip.destination) {
    return NextResponse.json({ error: 'Add a destination before publishing' }, { status: 400 })
  }

  const supabase = await createClient()
  try {
    const result = await setTripVisibility(supabase, trip, user.id, body.visibility)
    return NextResponse.json({ ok: true, ...result })
  } catch (error) {
    console.error('Failed to update trip visibility:', error)
    return NextResponse.json({ error: 'Failed to update visibility' }, { status: 500 })
  }
}
