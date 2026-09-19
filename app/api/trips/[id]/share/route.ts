import { randomBytes } from 'crypto'
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
  if (trip.status !== 'confirmed') {
    return NextResponse.json({ error: 'Confirm the plan before sharing' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: existing } = await supabase
    .from('share_links')
    .select('token')
    .eq('trip_id', params.id)
    .is('revoked_at', null)
    .maybeSingle()

  let token = existing?.token as string | undefined
  if (!token) {
    token = randomBytes(18).toString('base64url')
    const { error } = await supabase.from('share_links').insert({
      trip_id: params.id,
      token,
      created_by: user.id,
    })
    if (error) {
      console.error('Failed to create share link:', error)
      return NextResponse.json({ error: 'Failed to create share link' }, { status: 500 })
    }
  }

  if (trip.visibility === 'private') {
    await supabase
      .from('trips')
      .update({ visibility: 'unlisted' })
      .eq('id', params.id)
      .eq('owner_id', user.id)
  }

  return NextResponse.json({ token, url: `/s/${token}` })
}
