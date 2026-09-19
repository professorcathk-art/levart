import type { Attraction, Profile, RouteData, Trip, TripComment, TripFocus, TripStatus, TripVisibility } from '@/types'
import { EMPTY_ROUTE, parseItinerary } from '@/lib/trips/itinerary'

interface TripRow {
  id: string
  owner_id: string | null
  destination: string
  trip_focus: string[] | null
  check_in: string | null
  check_out: string | null
  status: string
  visibility: string
  slug: string | null
  itinerary: unknown
  selected_attractions: unknown
  route_data: unknown
  cover_photo: string | null
  created_at: string
  updated_at: string
  confirmed_at: string | null
  profiles?: {
    id: string
    username: string
    display_name: string
    avatar_url: string | null
  } | Array<{
    id: string
    username: string
    display_name: string
    avatar_url: string | null
  }> | null
  trip_stats?: {
    avg_rating: number | string
    rating_count: number | string
    comment_count: number | string
  } | Array<{
    avg_rating: number | string
    rating_count: number | string
    comment_count: number | string
  }> | null
}

export function mapProfile(row: {
  id: string
  username: string
  display_name: string
  avatar_url?: string | null
}): Profile {
  return {
    id: row.id,
    username: row.username,
    displayName: row.display_name,
    avatarUrl: row.avatar_url ?? null,
  }
}

export function mapTrip(row: TripRow): Trip {
  const stats = Array.isArray(row.trip_stats) ? row.trip_stats[0] : row.trip_stats
  const itinerary = parseItinerary(row.itinerary)
  const attractions = Array.isArray(row.selected_attractions)
    ? (row.selected_attractions as Attraction[])
    : itinerary.selectedAttractions
  const routeSource =
    row.route_data && typeof row.route_data === 'object'
      ? (row.route_data as Partial<RouteData>)
      : itinerary.route
  const route: RouteData = {
    points: Array.isArray(routeSource?.points) ? routeSource.points : EMPTY_ROUTE.points,
    polyline: typeof routeSource?.polyline === 'string' ? routeSource.polyline : EMPTY_ROUTE.polyline,
    totalDistance:
      typeof routeSource?.totalDistance === 'number' ? routeSource.totalDistance : EMPTY_ROUTE.totalDistance,
    totalDuration:
      typeof routeSource?.totalDuration === 'number' ? routeSource.totalDuration : EMPTY_ROUTE.totalDuration,
  }

  return {
    id: row.id,
    ownerId: row.owner_id,
    destination: row.destination || itinerary.destination,
    tripFocus: (row.trip_focus ?? itinerary.tripFocus) as TripFocus[],
    checkIn: row.check_in,
    checkOut: row.check_out,
    status: row.status as TripStatus,
    visibility: row.visibility as TripVisibility,
    slug: row.slug,
    itinerary: {
      ...itinerary,
      destination: row.destination || itinerary.destination,
      tripFocus: (row.trip_focus ?? itinerary.tripFocus) as TripFocus[],
      selectedAttractions: attractions,
      route,
      checkIn: row.check_in ?? itinerary.checkIn,
      checkOut: row.check_out ?? itinerary.checkOut,
    },
    selectedAttractions: attractions,
    route,
    coverPhoto: row.cover_photo,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    confirmedAt: row.confirmed_at,
    owner: (() => {
      const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles
      return profile ? mapProfile(profile) : undefined
    })(),
    avgRating: stats ? Number(stats.avg_rating) : undefined,
    ratingCount: stats ? Number(stats.rating_count) : undefined,
    commentCount: stats ? Number(stats.comment_count) : undefined,
  }
}

export function mapComment(row: {
  id: string
  trip_id: string
  user_id: string
  parent_id: string | null
  body: string
  created_at: string
  profiles?: {
    id: string
    username: string
    display_name: string
    avatar_url: string | null
  } | Array<{
    id: string
    username: string
    display_name: string
    avatar_url: string | null
  }> | null
}): TripComment {
  return {
    id: row.id,
    tripId: row.trip_id,
    userId: row.user_id,
    parentId: row.parent_id,
    body: row.body,
    createdAt: row.created_at,
    author: (() => {
      const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles
      return profile ? mapProfile(profile) : undefined
    })(),
  }
}
