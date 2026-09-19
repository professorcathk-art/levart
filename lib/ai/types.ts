import type { UIMessage } from 'ai'
import type { Itinerary } from '@/types'

export type PlannerMessage = UIMessage<
  never,
  {
    itinerary: Itinerary
    trip: {
      tripId: string
    }
  }
>
