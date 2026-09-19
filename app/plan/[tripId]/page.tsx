import { notFound, redirect } from 'next/navigation'
import { PlannerWorkspace } from '@/components/chat/planner-workspace'
import { getAuthUser } from '@/lib/supabase/auth'
import { getOwnedTrip, getTripMessages } from '@/lib/trips/queries'
import type { PlannerMessage } from '@/lib/ai/types'

interface PlanTripPageProps {
  params: { tripId: string }
}

export default async function PlanTripPage({ params }: PlanTripPageProps) {
  const user = await getAuthUser()
  if (!user) {
    redirect(`/login?next=/plan/${params.tripId}`)
  }

  const trip = await getOwnedTrip(params.tripId, user.id)
  if (!trip) {
    notFound()
  }

  const rows = await getTripMessages(params.tripId, user.id)
  const initialMessages: PlannerMessage[] = rows.map((row) => ({
    id: row.id as string,
    role: row.role as 'user' | 'assistant',
    parts: (row.parts ?? []) as PlannerMessage['parts'],
  }))

  return (
    <PlannerWorkspace
      signedIn
      initialTripId={trip.id}
      initialItinerary={trip.itinerary}
      initialMessages={initialMessages}
      initialStatus={trip.status}
    />
  )
}
