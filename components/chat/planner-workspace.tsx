'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { AuthPrompt } from '@/components/auth/auth-prompt'
import { ChatPane } from '@/components/chat/chat-pane'
import { ConfirmBar } from '@/components/chat/confirm-bar'
import { PlanPane } from '@/components/chat/plan-pane'
import { itineraryHasPlan, parseItinerary } from '@/lib/trips/itinerary'
import type { PlannerMessage } from '@/lib/ai/types'
import type { Itinerary, TripStatus } from '@/types'

const GUEST_DRAFT_KEY = 'levart-guest-draft'

interface PlannerWorkspaceProps {
  signedIn: boolean
  initialTripId?: string
  initialItinerary?: Itinerary | null
  initialMessages?: PlannerMessage[]
  initialStatus?: TripStatus
}

export function PlannerWorkspace({
  signedIn,
  initialTripId,
  initialItinerary,
  initialMessages = [],
  initialStatus = 'draft',
}: PlannerWorkspaceProps) {
  const router = useRouter()
  const tripIdRef = useRef(initialTripId)
  const [tripId, setTripId] = useState(initialTripId)
  const [itinerary, setItinerary] = useState<Itinerary | null>(initialItinerary ?? null)
  const [status, setStatus] = useState<TripStatus>(initialStatus)
  const [mobileTab, setMobileTab] = useState<'chat' | 'plan'>('chat')
  const [authOpen, setAuthOpen] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  useEffect(() => {
    tripIdRef.current = tripId
  }, [tripId])

  useEffect(() => {
    if (signedIn || initialItinerary) return
    const raw = sessionStorage.getItem(GUEST_DRAFT_KEY)
    if (!raw) return
    try {
      const parsed = JSON.parse(raw) as { itinerary?: unknown }
      const guestItinerary = parseItinerary(parsed.itinerary)
      if (itineraryHasPlan(guestItinerary)) {
        setItinerary(guestItinerary)
      }
    } catch {
      sessionStorage.removeItem(GUEST_DRAFT_KEY)
    }
  }, [signedIn, initialItinerary])

  useEffect(() => {
    if (signedIn || !itinerary) return
    sessionStorage.setItem(GUEST_DRAFT_KEY, JSON.stringify({ itinerary }))
  }, [itinerary, signedIn])

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: '/api/chat',
        body: () => ({ tripId: tripIdRef.current }),
      }),
    []
  )

  const { messages, sendMessage, status: chatStatus, error } = useChat<PlannerMessage>({
    id: initialTripId ?? 'new-plan',
    messages: initialMessages,
    transport,
    onData: (dataPart) => {
      if (dataPart.type === 'data-itinerary') {
        setItinerary(dataPart.data)
        setMobileTab('plan')
      }
      if (dataPart.type === 'data-trip') {
        const nextId = dataPart.data.tripId
        setTripId(nextId)
        tripIdRef.current = nextId
        if (window.location.pathname === '/plan') {
          router.replace(`/plan/${nextId}`)
        }
      }
    },
  })

  const ensureTrip = async (): Promise<string | null> => {
    if (tripId) return tripId
    const response = await fetch('/api/trips', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itinerary }),
    })
    if (!response.ok) {
      const payload = (await response.json().catch(() => ({}))) as { error?: string }
      throw new Error(payload.error || 'Could not save trip')
    }
    const payload = (await response.json()) as { trip: { id: string } }
    setTripId(payload.trip.id)
    tripIdRef.current = payload.trip.id
    return payload.trip.id
  }

  const handleConfirm = async () => {
    setActionError(null)
    if (!signedIn) {
      setAuthOpen(true)
      return
    }
    if (!itineraryHasPlan(itinerary)) return

    setConfirming(true)
    try {
      const id = await ensureTrip()
      if (!id) throw new Error('Could not save trip')
      const response = await fetch(`/api/trips/${id}/confirm`, { method: 'POST' })
      if (!response.ok) {
        const payload = (await response.json().catch(() => ({}))) as { error?: string }
        throw new Error(payload.error || 'Could not confirm trip')
      }
      sessionStorage.removeItem(GUEST_DRAFT_KEY)
      router.push(`/trips/${id}`)
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Could not confirm trip')
    } finally {
      setConfirming(false)
    }
  }

  const handleReopen = async () => {
    if (!tripId) return
    const response = await fetch(`/api/trips/${tripId}/reopen`, { method: 'POST' })
    if (response.ok) {
      setStatus('draft')
    }
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col bg-gradient-to-br from-[#FFF8F3] via-[#FFE8E0] to-[#FFD4C4]">
      <div className="flex items-center justify-between border-b border-[#FF9A76]/10 bg-white/70 px-4 py-2 md:hidden">
        <div className="flex rounded-full bg-[#FFF8F3] p-1">
          <button
            type="button"
            onClick={() => setMobileTab('chat')}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold ${mobileTab === 'chat' ? 'bg-[#FF9A76] text-white' : 'text-gray-600'}`}
          >
            Chat
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('plan')}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold ${mobileTab === 'plan' ? 'bg-[#FF9A76] text-white' : 'text-gray-600'}`}
          >
            Plan
          </button>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 md:grid-cols-2">
        <section className={`min-h-0 border-r border-[#FF9A76]/10 ${mobileTab === 'chat' ? 'block' : 'hidden'} md:block`}>
          <ChatPane
            messages={messages}
            status={chatStatus}
            error={error}
            disabled={status === 'confirmed'}
            onSend={(text) => sendMessage({ text })}
          />
        </section>
        <section className={`min-h-0 ${mobileTab === 'plan' ? 'block' : 'hidden'} md:block`}>
          <PlanPane itinerary={itinerary} />
        </section>
      </div>

      <div className="border-t border-[#FF9A76]/10 bg-white/80 p-3">
        {actionError && (
          <p className="mb-2 text-center text-sm text-red-600" role="alert">
            {actionError}
          </p>
        )}
        <ConfirmBar
          itinerary={itinerary}
          status={status}
          confirming={confirming}
          onConfirm={handleConfirm}
          onReopen={tripId ? handleReopen : undefined}
        />
      </div>

      <AuthPrompt
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        title="Sign in to confirm this trip"
        description="Your draft stays on this device until you sign in. Then you can confirm, share, or publish it."
        nextPath={tripId ? `/plan/${tripId}` : '/plan'}
      />
    </div>
  )
}
