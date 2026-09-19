import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAuthUser } from '@/lib/supabase/auth'
import { getOwnedTrip } from '@/lib/trips/queries'

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

  const body = (await request.json()) as { destination?: string }
  const supabase = await createClient()
  const { error } = await supabase
    .from('trips')
    .update({
      destination: body.destination ?? trip.destination,
    })
    .eq('id', params.id)
    .eq('owner_id', user.id)

  if (error) {
    console.error('Failed to update trip:', error)
    return NextResponse.json({ error: 'Failed to update trip' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
