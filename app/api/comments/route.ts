import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAuthUser } from '@/lib/supabase/auth'
import { mapComment } from '@/lib/trips/mappers'

export async function POST(request: NextRequest) {
  const user = await getAuthUser()
  if (!user) {
    return NextResponse.json({ error: 'Sign in required' }, { status: 401 })
  }

  const body = (await request.json()) as {
    tripId?: string
    body?: string
    parentId?: string | null
  }
  const text = body.body?.trim() ?? ''
  if (!body.tripId || text.length < 1 || text.length > 2000) {
    return NextResponse.json({ error: 'Invalid comment' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('comments')
    .insert({
      trip_id: body.tripId,
      user_id: user.id,
      parent_id: body.parentId ?? null,
      body: text,
    })
    .select('id, trip_id, user_id, parent_id, body, created_at')
    .single()

  if (error || !data) {
    console.error('Failed to create comment:', error)
    return NextResponse.json({ error: 'Failed to post comment' }, { status: 500 })
  }

  return NextResponse.json({ comment: mapComment(data) }, { status: 201 })
}

export async function DELETE(request: NextRequest) {
  const user = await getAuthUser()
  if (!user) {
    return NextResponse.json({ error: 'Sign in required' }, { status: 401 })
  }

  const commentId = request.nextUrl.searchParams.get('id')
  if (!commentId) {
    return NextResponse.json({ error: 'Missing comment id' }, { status: 400 })
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId)
    .eq('user_id', user.id)

  if (error) {
    console.error('Failed to delete comment:', error)
    return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
