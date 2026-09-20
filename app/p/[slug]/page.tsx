import { notFound } from 'next/navigation'
import { CommentThread } from '@/components/community/comment-thread'
import { RatingControl } from '@/components/community/rating-control'
import { TripView } from '@/components/plan/trip-view'
import { getAuthUser } from '@/lib/supabase/auth'
import { createClient } from '@/lib/supabase/server'
import { getPublicTripBySlug, getTripComments, recordTripView } from '@/lib/trips/queries'

export default async function PublicTripPage({ params }: { params: { slug: string } }) {
  const user = await getAuthUser()
  const trip = await getPublicTripBySlug(params.slug)
  if (!trip) {
    notFound()
  }

  const preview = !user
  if (user && trip.ownerId && trip.ownerId !== user.id) {
    await recordTripView(trip.id, user.id)
  }

  const comments = await getTripComments(trip.id)
  let myStars: number | null = null

  if (user) {
    try {
      const supabase = await createClient()
      const { data } = await supabase
        .from('ratings')
        .select('stars')
        .eq('trip_id', trip.id)
        .eq('user_id', user.id)
        .maybeSingle()
      myStars = data?.stars ?? null
    } catch (error) {
      console.error('Failed to load rating:', error)
    }
  }

  return (
    <main className="mx-auto max-w-7xl space-y-8 px-3 py-4 sm:px-4 md:py-10">
      <TripView trip={trip} isOwner={Boolean(user && trip.ownerId === user.id)} preview={preview} />
      <RatingControl
        tripId={trip.id}
        slug={params.slug}
        signedIn={Boolean(user)}
        initialStars={myStars}
        avgRating={trip.avgRating ?? 0}
        ratingCount={trip.ratingCount ?? 0}
      />
      <CommentThread
        tripId={trip.id}
        slug={params.slug}
        signedIn={Boolean(user)}
        currentUserId={user?.id}
        initialComments={comments}
      />
    </main>
  )
}
