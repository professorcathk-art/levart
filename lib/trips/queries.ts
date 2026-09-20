import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createPublicClient } from '@/lib/supabase/public'
import { mapComment, mapProfile, mapTrip } from '@/lib/trips/mappers'
import { searchCommunityTrips } from '@/lib/trips/community-search'
import { itineraryHasPlan, publicFacingTrip } from '@/lib/trips/itinerary'
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
  confirmed_at
`

type QueryClient = NonNullable<
  ReturnType<typeof createPublicClient> | ReturnType<typeof createAdminClient>
>

async function getQueryClient(client?: QueryClient | null): Promise<QueryClient | null> {
  if (client) return client
  try {
    return await createClient()
  } catch (error) {
    console.error('Failed to create Supabase client:', error)
    return null
  }
}

async function attachOwners(trips: Trip[], client?: QueryClient | null): Promise<Trip[]> {
  const ownerIds = Array.from(
    new Set(trips.map((trip) => trip.ownerId).filter((id): id is string => Boolean(id)))
  )
  if (ownerIds.length === 0) return trips

  const supabase = await getQueryClient(client)
  if (!supabase) return trips

  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, display_name, avatar_url')
    .in('id', ownerIds)

  if (error || !data) {
    if (error) console.error('Failed to load trip owners:', error)
    return trips
  }

  const owners = new Map(data.map((row) => [row.id as string, mapProfile(row)]))
  return trips.map((trip) => ({
    ...trip,
    owner: trip.ownerId ? owners.get(trip.ownerId) ?? trip.owner : trip.owner,
  }))
}

async function attachStats(
  trips: Trip[],
  client?: QueryClient | null
): Promise<Trip[]> {
  if (trips.length === 0) return trips

  const supabase = await getQueryClient(client)
  if (!supabase) return trips

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
  const supabase = await getQueryClient()
  if (!supabase) return null
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
  const [trip] = await attachOwners(await attachStats([mapTrip(data)]))
  return trip
}

export async function getMyTrips(userId: string): Promise<Trip[]> {
  const supabase = await getQueryClient()
  if (!supabase) return []
  const { data, error } = await supabase
    .from('trips')
    .select(TRIP_SELECT)
    .eq('owner_id', userId)
    .order('updated_at', { ascending: false })

  if (error) {
    console.error('Failed to load trips:', error)
    return []
  }

  return attachOwners(await attachStats((data ?? []).map(mapTrip)))
}

export async function getPublicTripBySlug(slug: string): Promise<Trip | null> {
  const supabase = createPublicClient() ?? (await getQueryClient())
  if (!supabase) return null
  const { data, error } = await supabase
    .from('trips')
    .select(TRIP_SELECT)
    .eq('slug', slug)
    .eq('visibility', 'public')
    .maybeSingle()

  if (error) {
    console.error('Failed to load public trip:', error)
    return null
  }

  if (!data) return null
  const [trip] = await attachOwners(await attachStats([mapTrip(data)]))
  if (!itineraryHasPlan(trip.itinerary) && !trip.itinerary.publishedCopy) return null
  return publicFacingTrip(trip)
}

export async function getCommunityTrips(options?: {
  destination?: string
  sort?: 'recent' | 'rating'
}): Promise<Trip[]> {
  try {
    const supabase = createPublicClient()
    if (!supabase) return []

    const query = supabase
      .from('trips')
      .select(TRIP_SELECT)
      .eq('visibility', 'public')
      .order('confirmed_at', { ascending: false })

    const { data, error } = await query.limit(80)

    if (error) {
      console.error('Failed to load community trips:', error)
      return []
    }

    const trips = (
      await attachOwners(await attachStats((data ?? []).map(mapTrip), supabase), supabase)
    )
      .filter((trip) => itineraryHasPlan(publicFacingTrip(trip).itinerary))
      .map(publicFacingTrip)
    return searchCommunityTrips(trips, {
      query: options?.destination,
      sort: options?.sort === 'rating' ? 'rating' : options?.destination ? 'relevance' : 'recent',
    })
  } catch (error) {
    console.error('Failed to load community trips:', error)
    return []
  }
}

export async function getSharedTrip(token: string): Promise<Trip | null> {
  try {
    const admin = createAdminClient()
    if (!admin) return null
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
      .maybeSingle()

    if (error || !data) {
      console.error('Failed to load shared trip:', error)
      return null
    }

    const [trip] = await attachOwners([mapTrip(data)], admin)
    return trip
  } catch (error) {
    console.error('Share lookup failed:', error)
    return null
  }
}

export async function getProfileByUsername(username: string): Promise<Profile | null> {
  const supabase = await getQueryClient()
  if (!supabase) return null
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
  const supabase = await getQueryClient()
  if (!supabase) return []
  const { data, error } = await supabase
    .from('trips')
    .select(TRIP_SELECT)
    .eq('owner_id', userId)
    .eq('visibility', 'public')
    .order('confirmed_at', { ascending: false })

  if (error) {
    console.error('Failed to load published trips:', error)
    return []
  }

  return (await attachOwners(await attachStats((data ?? []).map(mapTrip))))
    .filter((trip) => itineraryHasPlan(publicFacingTrip(trip).itinerary))
    .map(publicFacingTrip)
}

export async function getTripComments(tripId: string): Promise<TripComment[]> {
  const supabase = createPublicClient() ?? (await getQueryClient())
  if (!supabase) return []
  const { data, error } = await supabase
    .from('comments')
    .select('id, trip_id, user_id, parent_id, body, created_at')
    .eq('trip_id', tripId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Failed to load comments:', error)
    return []
  }

  const comments = (data ?? []).map(mapComment)
  const userIds = Array.from(new Set(comments.map((comment) => comment.userId)))
  if (userIds.length === 0) return comments

  const { data: profiles, error: profileError } = await supabase
    .from('profiles')
    .select('id, username, display_name, avatar_url')
    .in('id', userIds)

  if (profileError || !profiles) {
    if (profileError) console.error('Failed to load comment authors:', profileError)
    return comments
  }

  const authors = new Map(profiles.map((row) => [row.id as string, mapProfile(row)]))
  return comments.map((comment) => ({
    ...comment,
    author: authors.get(comment.userId),
  }))
}

export async function getTripMessages(tripId: string, userId: string) {
  const supabase = await getQueryClient()
  if (!supabase) return []
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

export async function recordTripView(tripId: string, viewerId: string) {
  const payload = {
    trip_id: tripId,
    viewer_id: viewerId,
    viewed_at: new Date().toISOString(),
  }
  const supabase = await getQueryClient()
  if (supabase) {
    const { error } = await supabase.from('trip_views').upsert(payload, { onConflict: 'trip_id,viewer_id' })
    if (!error) return
    console.error('Failed to record trip view:', error)
  }

  const admin = createAdminClient()
  if (!admin) return
  const { error: adminError } = await admin.from('trip_views').upsert(payload, { onConflict: 'trip_id,viewer_id' })
  if (adminError) {
    console.error('Failed to record trip view with admin client:', adminError)
  }
}
