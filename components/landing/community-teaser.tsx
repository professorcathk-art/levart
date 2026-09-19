import Link from 'next/link'
import { TripCard } from '@/components/community/trip-card'
import { getCommunityTrips } from '@/lib/trips/queries'

export async function CommunityTeaser() {
  let trips: Awaited<ReturnType<typeof getCommunityTrips>> = []
  try {
    trips = await getCommunityTrips({ sort: 'recent' })
  } catch (error) {
    console.error('Failed to load community teaser:', error)
  }

  const preview = trips.slice(0, 3)

  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-4xl font-bold">
              <span className="text-[#FF9A76]">From the</span>{' '}
              <span className="text-[#7ECCC4]">community</span>
            </h2>
            <p className="mt-2 text-gray-600">Confirmed plans travelers chose to publish.</p>
          </div>
          <Link href="/community" className="font-semibold text-[#FF9A76]">
            See all
          </Link>
        </div>
        {preview.length === 0 ? (
          <p className="rounded-3xl bg-[#FFF8F3] p-8 text-gray-600">
            No published trips yet. Confirm a plan and be the first to share one.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {preview.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
