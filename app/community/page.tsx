import { CommunityHeading } from '@/components/community/community-copy'
import { CommunityExplorer } from '@/components/community/community-explorer'
import { getCommunityTrips } from '@/lib/trips/queries'
import type { CommunitySort } from '@/lib/trips/community-search'

interface CommunityPageProps {
  searchParams: { q?: string; sort?: string }
}

function isSort(value: string | undefined): value is CommunitySort {
  return value === 'recent' || value === 'rating' || value === 'relevance'
}

export default async function CommunityPage({ searchParams }: CommunityPageProps) {
  const query = searchParams.q?.trim() ?? ''
  const sort: CommunitySort = isSort(searchParams.sort) ? searchParams.sort : query ? 'relevance' : 'recent'
  let trips: Awaited<ReturnType<typeof getCommunityTrips>> = []
  try {
    trips = await getCommunityTrips({ sort: 'recent' })
  } catch (error) {
    console.error('Failed to load community page:', error)
  }

  return (
    <main className="mx-auto min-h-[calc(100vh-4rem)] max-w-6xl px-4 py-10">
      <header className="mb-2">
        <CommunityHeading />
      </header>
      <CommunityExplorer trips={trips} initialQuery={query} initialSort={sort} />
    </main>
  )
}
