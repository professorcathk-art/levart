import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getAuthUser } from '@/lib/supabase/auth'
import { getMyTrips } from '@/lib/trips/queries'

export default async function TripsPage() {
  const user = await getAuthUser()
  if (!user) {
    redirect('/login?next=/trips')
  }

  const trips = await getMyTrips(user.id)

  return (
    <main className="mx-auto min-h-[calc(100vh-4rem)] max-w-5xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-[#FF9A76]">My trips</h1>
          <p className="mt-2 text-gray-600">Drafts you are still chatting through, and confirmed plans.</p>
        </div>
        <Link
          href="/plan"
          className="rounded-full bg-gradient-to-r from-[#FF9A76] to-[#FFB86C] px-5 py-3 font-semibold text-white"
        >
          New plan
        </Link>
      </div>

      {trips.length === 0 ? (
        <div className="rounded-3xl bg-white p-10 text-center shadow">
          <p className="text-gray-600">No trips yet. Chat one into existence.</p>
          <Link href="/plan" className="mt-4 inline-block font-semibold text-[#FF9A76]">
            Start planning
          </Link>
        </div>
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
                      {trip.destination || 'Untitled trip'}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {trip.itinerary.days.length} days
                      {trip.checkIn ? ` • ${trip.checkIn}` : ''}
                    </p>
                  </div>
                  <span className="rounded-full bg-[#FFF8F3] px-3 py-1 text-xs font-semibold capitalize text-[#FF9A76]">
                    {trip.status}
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
