import { notFound } from 'next/navigation'
import { TripView } from '@/components/plan/trip-view'
import { getSharedTrip } from '@/lib/trips/queries'

export default async function SharedTripPage({ params }: { params: { token: string } }) {
  const trip = await getSharedTrip(params.token)
  if (!trip) {
    notFound()
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-6 md:py-10">
      <TripView trip={trip} />
    </main>
  )
}
