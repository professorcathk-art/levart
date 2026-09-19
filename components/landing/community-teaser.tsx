import { CommunityTeaserCopy, TeaserEmpty } from '@/components/community/community-copy'
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
        <CommunityTeaserCopy />
        {preview.length === 0 ? (
          <p className="rounded-3xl bg-[#FFF8F3] p-8 text-gray-600">
            <TeaserEmpty />
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
