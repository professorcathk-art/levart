import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createPublicClient } from '@/lib/supabase/public'
import { mapComment, mapProfile, mapTrip } from '@/lib/trips/mappers'
import type { Profile, Trip, TripComment } from '@/types'

const TRIP_SELECT = `
  id,
  owner_id,
  destination,
  trip_focus,
  check_in,
  check_out,
  status,
  visibility,
  slug,
  itinerary,
  selected_attractions,
  route_data,
  cover_photo,
  created_at,
  updated_at,
  confirmed_at,
  profiles:owner_id (id, username, display_name, avatar_url)
`

async function attachStats(
  trips: Trip[],
  client?: ReturnType<typeof createPublicClient>
): Promise<Trip[]> {
  if (trips.length === 0) return trips

  const supabase = client ?? (await createClient())
  const ids = trips.map((trip) => trip.id)
  const [{ data: ratings }, { data: comments }] = await Promise.all([
    supabase.from('ratings').select('trip_id, stars').in('trip_id', ids),
    supabase.from('comments').select('trip_id').in('trip_id', ids),
  ])

  const ratingMap = new Map<string, { total: number; count: number }>()
  for (const row of ratings ?? []) {
    const current = ratingMap.get(row.trip_id) ?? { total: 0, count: 0 }
    current.total += Number(row.stars)
    current.count += 1
    ratingMap.set(row.trip_id, current)
  }

  const commentMap = new Map<string, number>()
  for (const row of comments ?? []) {
    commentMap.set(row.trip_id, (commentMap.get(row.trip_id) ?? 0) + 1)
  }

  return trips.map((trip) => {
    const rating = ratingMap.get(trip.id)
    return {
      ...trip,
      avgRating: rating && rating.count > 0 ? Number((rating.total / rating.count).toFixed(2)) : 0,
      ratingCount: rating?.count ?? 0,
      commentCount: commentMap.get(trip.id) ?? 0,
    }
  })
}

export async function getOwnedTrip(tripId: string, userId: string): Promise<Trip | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('trips')
    .select(TRIP_SELECT)
    .eq('id', tripId)
    .eq('owner_id', userId)
    .maybeSingle()

  if (error) {
    console.error('Failed to load owned trip:', error)
    return null
  }

  if (!data) return null
  const [trip] = await attachStats([mapTrip(data)])
  return trip
}

export async function getMyTrips(userId: string): Promise<Trip[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('trips')
    .select(TRIP_SELECT)
    .eq('owner_id', userId)
    .order('updated_at', { ascending: false })

  if (error) {
    console.error('Failed to load trips:', error)
    return []
  }

  return attachStats((data ?? []).map(mapTrip))
}

export async function getPublicTripBySlug(slug: string): Promise<Trip | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('trips')
    .select(TRIP_SELECT)
    .eq('slug', slug)
    .eq('visibility', 'public')
    .eq('status', 'confirmed')
    .maybeSingle()

  if (error) {
    console.error('Failed to load public trip:', error)
    return null
  }

  if (!data) return null
  const [trip] = await attachStats([mapTrip(data)])
  return trip
}

export async function getCommunityTrips(options?: {
  destination?: string
  sort?: 'recent' | 'rating'
}): Promise<Trip[]> {
  const supabase = createPublicClient()
  let query = supabase
    .from('trips')
    .select(TRIP_SELECT)
    .eq('visibility', 'public')
    .eq('status', 'confirmed')

  if (options?.destination) {
    query = query.ilike('destination', `%${options.destination}%`)
  }

  if (options?.sort === 'rating') {
    query = query.order('created_at', { ascending: false })
  } else {
    query = query.order('confirmed_at', { ascending: false, nullsFirst: false })
  }

  const { data, error } = await query.limit(48)

  if (error) {
    console.error('Failed to load community trips:', error)
    return []
  }

  const trips = await attachStats((data ?? []).map(mapTrip), supabase)
  if (options?.sort === 'rating') {
    return trips.sort((a, b) => (b.avgRating ?? 0) - (a.avgRating ?? 0))
  }
  return trips
}

export async function getSharedTrip(token: string): Promise<Trip | null> {
  try {
    const admin = createAdminClient()
    const { data: link, error: linkError } = await admin
      .from('share_links')
      .select('trip_id, revoked_at')
      .eq('token', token)
      .maybeSingle()

    if (linkError || !link || link.revoked_at) {
      return null
    }

    const { data, error } = await admin
      .from('trips')
      .select(TRIP_SELECT)
      .eq('id', link.trip_id)
      .eq('status', 'confirmed')
      .maybeSingle()

    if (error || !data) {
      console.error('Failed to load shared trip:', error)
      return null
    }

    return mapTrip(data)
  } catch (error) {
    console.error('Share lookup failed:', error)
    return null
  }
}

export async function getProfileByUsername(username: string): Promise<Profile | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, display_name, avatar_url')
    .eq('username', username)
    .maybeSingle()

  if (error) {
    console.error('Failed to load profile:', error)
    return null
  }

  return data ? mapProfile(data) : null
}

export async function getPublishedTripsForUser(userId: string): Promise<Trip[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('trips')
    .select(TRIP_SELECT)
    .eq('owner_id', userId)
    .eq('visibility', 'public')
    .eq('status', 'confirmed')
    .order('confirmed_at', { ascending: false })

  if (error) {
    console.error('Failed to load published trips:', error)
    return []
  }

  return attachStats((data ?? []).map(mapTrip))
}

export async function getTripComments(tripId: string): Promise<TripComment[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('comments')
    .select('id, trip_id, user_id, parent_id, body, created_at, profiles:user_id (id, username, display_name, avatar_url)')
    .eq('trip_id', tripId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Failed to load comments:', error)
    return []
  }

  return (data ?? []).map(mapComment)
}

export async function getTripMessages(tripId: string, userId: string) {
  const supabase = await createClient()
  const { data: conversation, error: conversationError } = await supabase
    .from('conversations')
    .select('id')
    .eq('trip_id', tripId)
    .maybeSingle()

  if (conversationError || !conversation) {
    return []
  }

  const { data, error } = await supabase
    .from('messages')
    .select('id, role, parts, created_at')
    .eq('conversation_id', conversation.id)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Failed to load messages:', error)
    return []
  }

  void userId
  return data ?? []
}
