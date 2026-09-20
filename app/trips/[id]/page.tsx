import { notFound, redirect } from 'next/navigation'
import { TripView } from '@/components/plan/trip-view'
import { getAuthUser } from '@/lib/supabase/auth'
import { getOwnedTrip } from '@/lib/trips/queries'

export default async function TripDetailPage({ params }: { params: { id: string } }) {
  const user = await getAuthUser()
  if (!user) {
    redirect(`/login?next=/trips/${params.id}`)
  }

  const trip = await getOwnedTrip(params.id, user.id)
  if (!trip) {
    notFound()
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 md:py-10">
      <TripView trip={trip} isOwner showShare />
    </main>
  )
}
