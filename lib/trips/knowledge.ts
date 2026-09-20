import { createPublicClient } from '@/lib/supabase/public'
import { getCommunityTrips } from '@/lib/trips/queries'

export interface GuideSnippet {
  kind: 'community' | 'guide'
  destination: string
  title: string
  summary: string
  rating?: number
}

function clip(text: string, max = 420) {
  const clean = text.replace(/\s+/g, ' ').trim()
  return clean.length > max ? `${clean.slice(0, max)}…` : clean
}

export async function searchTravelKnowledge(destination: string): Promise<GuideSnippet[]> {
  const query = destination.trim()
  if (!query) return []

  const snippets: GuideSnippet[] = []

  try {
    const trips = await getCommunityTrips({ destination: query, sort: 'rating' })
    for (const trip of trips.slice(0, 4)) {
      const highlights = trip.itinerary.days.slice(0, 4).map((day) => {
        const acts = day.activities
          .slice(0, 3)
          .map((activity) => activity.activity)
          .join(', ')
        const transport = day.transport.slice(0, 2).join('; ')
        return `Day ${day.day}: ${acts || 'open day'}${transport ? ` | ${transport}` : ''}`
      })
      snippets.push({
        kind: 'community',
        destination: trip.destination,
        title: `${trip.itinerary.days.length}-day ${trip.destination} plan`,
        summary: clip(highlights.join(' / ')),
        rating: trip.avgRating,
      })
    }
  } catch (error) {
    console.error('Community knowledge lookup failed:', error)
  }

  try {
    const supabase = createPublicClient()
    if (supabase) {
      const { data, error } = await supabase
        .from('travel_guides')
        .select('destination, title, body, source_name')
        .ilike('destination', `%${query}%`)
        .limit(5)

      if (!error && data) {
        for (const row of data) {
          snippets.push({
            kind: 'guide',
            destination: String(row.destination),
            title: String(row.title),
            summary: clip(
              `${String(row.body)}${row.source_name ? ` (source: ${row.source_name})` : ''}`
            ),
          })
        }
      }
    }
  } catch (error) {
    console.error('Travel guide lookup skipped:', error)
  }

  return snippets
}
