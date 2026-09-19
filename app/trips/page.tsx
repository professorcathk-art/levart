import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getAuthUser } from '@/lib/supabase/auth'
import { getMyTrips } from '@/lib/trips/queries'
import { TripDays, TripStatusLabel, TripsEmpty, TripsHeader, UntitledTrip } from '@/components/trips/trips-copy'

export default async function TripsPage() {
  const user = await getAuthUser()
  if (!user) {
    redirect('/login?next=/trips')
  }

  const trips = await getMyTrips(user.id)

  return (
    <main className="mx-auto min-h-[calc(100vh-4rem)] max-w-5xl px-4 py-10">
      <TripsHeader />

      {trips.length === 0 ? (
        <TripsEmpty />
      ) : (
        <ul className="space-y-4">
          {trips.map((trip) => (
            <li key={trip.id}>
              <Link
                href={trip.status === 'confirmed' ? `/trips/${trip.id}` : `/plan/${trip.id}`}
                className="block rounded-3xl bg-white p-6 shadow transition hover:shadow-lg"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-[#1A1A1A]">
                      {trip.destination || <UntitledTrip />}
                    </h2>
                    <p className="text-sm text-gray-500">
                      <TripDays count={trip.itinerary.days.length} />
                      {trip.checkIn ? ` • ${trip.checkIn}` : ''}
                    </p>
                  </div>
                  <span className="rounded-full bg-[#FFF8F3] px-3 py-1 text-xs font-semibold text-[#FF9A76]">
                    <TripStatusLabel status={trip.status} />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
