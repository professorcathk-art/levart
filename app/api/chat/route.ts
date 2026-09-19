import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  isStepCount,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from 'ai'
import { createClient } from '@/lib/supabase/server'
import { getPlannerModel } from '@/lib/ai/provider'
import { PLANNER_SYSTEM_PROMPT } from '@/lib/ai/prompts'
import { createPlannerTools, type PlannerContext } from '@/lib/ai/tools'
import { emptyItinerary, parseItinerary } from '@/lib/trips/itinerary'
import type { PlannerMessage } from '@/lib/ai/types'

export const maxDuration = 60

interface ChatRequestBody {
  messages?: UIMessage[]
  tripId?: string
}

async function persistDraft(
  supabase: Awaited<ReturnType<typeof createClient>>,
  tripId: string,
  ctx: PlannerContext
) {
  const { error } = await supabase
    .from('trips')
    .update({
      destination: ctx.itinerary.destination,
      trip_focus: ctx.itinerary.tripFocus,
      check_in: ctx.itinerary.checkIn ?? null,
      check_out: ctx.itinerary.checkOut ?? null,
      itinerary: ctx.itinerary,
      selected_attractions: ctx.itinerary.selectedAttractions,
      route_data: ctx.itinerary.route,
    })
    .eq('id', tripId)

  if (error) {
    console.error('Failed to persist draft itinerary:', error)
  }
}

async function persistMessages(
  supabase: Awaited<ReturnType<typeof createClient>>,
  conversationId: string,
  messages: UIMessage[]
) {
  const { error: deleteError } = await supabase
    .from('messages')
    .delete()
    .eq('conversation_id', conversationId)

  if (deleteError) {
    console.error('Failed to clear messages:', deleteError)
    return
  }

  const rows = messages
    .filter((message) => message.role === 'user' || message.role === 'assistant')
    .map((message) => ({
      conversation_id: conversationId,
      role: message.role,
      parts: message.parts ?? [],
    }))

  if (rows.length === 0) return

  const { error } = await supabase.from('messages').insert(rows)
  if (error) {
    console.error('Failed to save messages:', error)
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ChatRequestBody
    const incoming = body.messages ?? []
    if (incoming.length === 0) {
      return Response.json({ error: 'Missing messages' }, { status: 400 })
    }

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    let tripId = body.tripId
    let conversationId: string | null = null
    const ctx: PlannerContext = {
      itinerary: emptyItinerary(),
      dirty: false,
    }

    if (user && !tripId) {
      const { data: trip, error: tripError } = await supabase
        .from('trips')
        .insert({
          owner_id: user.id,
          destination: '',
          status: 'draft',
          visibility: 'private',
          itinerary: emptyItinerary(),
        })
        .select('id')
        .single()

      if (tripError || !trip) {
        console.error('Failed to create trip:', tripError)
      } else {
        tripId = trip.id
        const { data: conversation, error: conversationError } = await supabase
          .from('conversations')
          .insert({ trip_id: trip.id })
          .select('id')
          .single()
        if (conversationError) {
          console.error('Failed to create conversation:', conversationError)
        } else {
          conversationId = conversation.id
        }
      }
    } else if (user && tripId) {
      const { data: trip, error } = await supabase
        .from('trips')
        .select('id, owner_id, status, itinerary, destination, trip_focus, check_in, check_out')
        .eq('id', tripId)
        .maybeSingle()

      if (error || !trip || trip.owner_id !== user.id) {
        return Response.json({ error: 'Trip not found' }, { status: 404 })
      }
      if (trip.status === 'confirmed') {
        return Response.json(
          { error: 'This plan is confirmed. Reopen it to keep editing.' },
          { status: 409 }
        )
      }

      ctx.itinerary = parseItinerary(trip.itinerary)
      if (trip.destination) ctx.itinerary.destination = trip.destination
      if (Array.isArray(trip.trip_focus)) {
        ctx.itinerary.tripFocus = trip.trip_focus
      }
      ctx.itinerary.checkIn = trip.check_in ?? ctx.itinerary.checkIn
      ctx.itinerary.checkOut = trip.check_out ?? ctx.itinerary.checkOut

      const { data: conversation } = await supabase
        .from('conversations')
        .select('id')
        .eq('trip_id', tripId)
        .maybeSingle()

      if (conversation) {
        conversationId = conversation.id
      } else {
        const { data: created } = await supabase
          .from('conversations')
          .insert({ trip_id: tripId })
          .select('id')
          .single()
        conversationId = created?.id ?? null
      }
    }

    const modelMessages = await convertToModelMessages(incoming)

    const stream = createUIMessageStream<PlannerMessage>({
      execute: ({ writer }) => {
        if (tripId) {
          writer.write({
            type: 'data-trip',
            data: { tripId },
            transient: true,
          })
        }

        const result = streamText({
          model: getPlannerModel(),
          instructions: PLANNER_SYSTEM_PROMPT,
          messages: modelMessages,
          tools: createPlannerTools(ctx),
          stopWhen: isStepCount(8),
          onStepFinish: async () => {
            if (!ctx.dirty) return
            ctx.dirty = false
            writer.write({
              type: 'data-itinerary',
              data: ctx.itinerary,
            })
            if (user && tripId) {
              await persistDraft(supabase, tripId, ctx)
            }
          },
        })

        writer.merge(toUIMessageStream({ stream: result.stream }))
      },
      onFinish: async ({ messages }) => {
        if (user && conversationId) {
          await persistMessages(supabase, conversationId, messages)
        }
      },
    })

    return createUIMessageStreamResponse({ stream })
  } catch (error) {
    console.error('Chat route failed:', error)
    const message = error instanceof Error ? error.message : 'Failed to chat'
    return Response.json({ error: message }, { status: 500 })
  }
}
