import { CommunityEmpty, CommunityHeading, CommunitySearch } from '@/components/community/community-copy'
import { TripCard } from '@/components/community/trip-card'
import { getCommunityTrips } from '@/lib/trips/queries'

interface CommunityPageProps {
  searchParams: { q?: string; sort?: string }
}

export default async function CommunityPage({ searchParams }: CommunityPageProps) {
  const destination = searchParams.q?.trim()
  const sort = searchParams.sort === 'rating' ? 'rating' : 'recent'
  let trips: Awaited<ReturnType<typeof getCommunityTrips>> = []
  try {
    trips = await getCommunityTrips({ destination, sort })
  } catch (error) {
    console.error('Failed to load community page:', error)
  }

  return (
    <main className="mx-auto min-h-[calc(100vh-4rem)] max-w-6xl px-4 py-10">
      <header className="mb-8">
        <CommunityHeading />
        <CommunitySearch destination={destination} sort={sort} />
      </header>

      {trips.length === 0 ? (
        <div className="rounded-3xl bg-white p-10 text-center text-gray-600 shadow">
          <CommunityEmpty />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      )}
    </main>
  )
}
