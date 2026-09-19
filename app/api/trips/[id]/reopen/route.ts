import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAuthUser } from '@/lib/supabase/auth'
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

  const supabase = await createClient()
  const { error } = await supabase
    .from('trips')
    .update({
      status: 'draft',
      visibility: trip.visibility === 'public' ? 'unlisted' : trip.visibility,
    })
    .eq('id', params.id)
    .eq('owner_id', user.id)

  if (error) {
    console.error('Failed to reopen trip:', error)
    return NextResponse.json({ error: 'Failed to reopen trip' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
