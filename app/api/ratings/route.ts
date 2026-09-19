import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAuthUser } from '@/lib/supabase/auth'

export async function POST(request: NextRequest) {
  const user = await getAuthUser()
  if (!user) {
    return NextResponse.json({ error: 'Sign in required' }, { status: 401 })
  }

  const body = (await request.json()) as { tripId?: string; stars?: number }
  if (!body.tripId || !body.stars || body.stars < 1 || body.stars > 5) {
    return NextResponse.json({ error: 'Invalid rating' }, { status: 400 })
  }

  const supabase = await createClient()
  const { error } = await supabase.from('ratings').upsert(
    {
      trip_id: body.tripId,
      user_id: user.id,
      stars: body.stars,
    },
    { onConflict: 'trip_id,user_id' }
  )

  if (error) {
    console.error('Failed to save rating:', error)
    return NextResponse.json({ error: 'Failed to save rating' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}

export async function DELETE(request: NextRequest) {
  const user = await getAuthUser()
  if (!user) {
    return NextResponse.json({ error: 'Sign in required' }, { status: 401 })
  }

  const tripId = request.nextUrl.searchParams.get('tripId')
  if (!tripId) {
    return NextResponse.json({ error: 'Missing tripId' }, { status: 400 })
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from('ratings')
    .delete()
    .eq('trip_id', tripId)
    .eq('user_id', user.id)

  if (error) {
    console.error('Failed to delete rating:', error)
    return NextResponse.json({ error: 'Failed to delete rating' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
