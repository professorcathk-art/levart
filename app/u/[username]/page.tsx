import { notFound } from 'next/navigation'
import { TripCard } from '@/components/community/trip-card'
import { getProfileByUsername, getPublishedTripsForUser } from '@/lib/trips/queries'

export default async function ProfilePage({ params }: { params: { username: string } }) {
  const profile = await getProfileByUsername(params.username)
  if (!profile) {
    notFound()
  }

  const trips = await getPublishedTripsForUser(profile.id)

  return (
    <main className="mx-auto min-h-[calc(100vh-4rem)] max-w-5xl px-4 py-10">
      <header className="mb-8 rounded-3xl bg-white p-8 shadow">
        <h1 className="text-4xl font-bold text-[#FF9A76]">{profile.displayName}</h1>
        <p className="mt-2 text-gray-500">@{profile.username}</p>
      </header>

      {trips.length === 0 ? (
        <p className="text-gray-600">No published trips yet.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      )}
    </main>
  )
}
