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
        <h1 className="text-4xl font-bold text-[#FF9A76]">Community trips</h1>
        <p className="mt-2 text-gray-600">Browse plans other travelers confirmed and published.</p>
        <form className="mt-6 flex flex-col gap-3 sm:flex-row" action="/community">
          <input
            type="search"
            name="q"
            defaultValue={destination}
            placeholder="Filter by destination"
            className="flex-1 rounded-full border border-gray-200 px-5 py-3 outline-none focus:border-[#FF9A76]"
          />
          <select
            name="sort"
            defaultValue={sort}
            className="rounded-full border border-gray-200 px-4 py-3"
          >
            <option value="recent">Most recent</option>
            <option value="rating">Highest rated</option>
          </select>
          <button
            type="submit"
            className="rounded-full bg-gradient-to-r from-[#FF9A76] to-[#FFB86C] px-6 py-3 font-semibold text-white"
          >
            Search
          </button>
        </form>
      </header>

      {trips.length === 0 ? (
        <div className="rounded-3xl bg-white p-10 text-center text-gray-600 shadow">
          No published trips yet. Confirm a plan and share it with the community.
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
