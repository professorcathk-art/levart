import type { SupabaseClient } from '@supabase/supabase-js'
import { slugifyDestination } from '@/lib/trips/slug'
import type { Trip, TripVisibility } from '@/types'

export async function setTripVisibility(
  supabase: SupabaseClient,
  trip: Trip,
  userId: string,
  visibility: TripVisibility
) {
  const updates: Record<string, string> = { visibility }

  if (visibility === 'public') {
    updates.slug = trip.slug || slugifyDestination(trip.destination)
  }

  const { error } = await supabase
    .from('trips')
    .update(updates)
    .eq('id', trip.id)
    .eq('owner_id', userId)

  if (error) {
    throw error
  }

  if (visibility === 'private') {
    await supabase
      .from('share_links')
      .update({ revoked_at: new Date().toISOString() })
      .eq('trip_id', trip.id)
      .is('revoked_at', null)
  }

  return {
    visibility,
    slug: visibility === 'public' ? updates.slug : trip.slug,
    url: visibility === 'public' ? `/p/${updates.slug}` : null,
  }
}
