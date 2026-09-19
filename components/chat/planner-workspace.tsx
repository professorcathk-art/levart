'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { AuthPrompt } from '@/components/auth/auth-prompt'
import { ChatPane } from '@/components/chat/chat-pane'
import { ConfirmBar } from '@/components/chat/confirm-bar'
import { PlanPane } from '@/components/chat/plan-pane'
import { ThinkingCat } from '@/components/companion/thinking-cat'
import { useLocale } from '@/components/i18n/locale-provider'
import { itineraryHasPlan, parseItinerary } from '@/lib/trips/itinerary'
import { clearGuestDraft, readGuestDraft, writeGuestDraft } from '@/lib/trips/guest-draft'
import type { PlannerMessage } from '@/lib/ai/types'
import type { Itinerary, TripStatus } from '@/types'

interface PlannerWorkspaceProps {
  signedIn: boolean
  initialTripId?: string
  initialItinerary?: Itinerary | null
  initialMessages?: PlannerMessage[]
  initialStatus?: TripStatus
  restoredFromGuest?: boolean
}

export function PlannerWorkspace(props: PlannerWorkspaceProps) {
  const { t } = useLocale()
  const [ready, setReady] = useState(false)
  const [seedItinerary, setSeedItinerary] = useState<Itinerary | null>(props.initialItinerary ?? null)
  const [seedMessages, setSeedMessages] = useState<PlannerMessage[]>(props.initialMessages ?? [])
  const [restoredFromGuest, setRestoredFromGuest] = useState(false)

  useEffect(() => {
    if (props.initialTripId && props.initialItinerary) {
      setReady(true)
      return
    }

    const draft = readGuestDraft()
    let restored = false
    if (!props.initialItinerary && draft?.itinerary && itineraryHasPlan(draft.itinerary)) {
      setSeedItinerary(parseItinerary(draft.itinerary))
      restored = true
    }
    if ((!props.initialMessages || props.initialMessages.length === 0) && draft?.messages?.length) {
      setSeedMessages(draft.messages)
      restored = true
    }
    setRestoredFromGuest(restored)
    setReady(true)
  }, [props.initialItinerary, props.initialMessages, props.initialTripId])

  if (!ready) {
    return (
      <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center bg-gradient-to-br from-[#FFF8F3] via-[#FFE8E0] to-[#FFD4C4]">
        <ThinkingCat />
        <p className="mt-2 text-sm text-gray-500">{t('openingPlanner')}</p>
      </div>
    )
  }

  return (
    <PlannerWorkspaceReady
      {...props}
      initialItinerary={seedItinerary}
      initialMessages={seedMessages}
      restoredFromGuest={restoredFromGuest}
    />
  )
}

function PlannerWorkspaceReady({
  signedIn,
  initialTripId,
  initialItinerary,
  initialMessages = [],
  initialStatus = 'draft',
  restoredFromGuest = false,
}: PlannerWorkspaceProps) {
  const router = useRouter()
  const { locale, t } = useLocale()
  const tripIdRef = useRef(initialTripId)
  const importedRef = useRef(false)
  const localeRef = useRef(locale)
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
    localeRef.current = locale
  }, [locale])

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: '/api/chat',
        body: () => ({
          tripId: tripIdRef.current,
          locale: localeRef.current,
        }),
      }),
    []
  )

  const { messages, sendMessage, status: chatStatus, error } = useChat<PlannerMessage>({
    id: initialTripId ?? 'restored-plan',
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

  useEffect(() => {
    if (signedIn || initialTripId) return
    writeGuestDraft({ itinerary, messages })
  }, [itinerary, messages, signedIn, initialTripId])

  useEffect(() => {
    if (!signedIn || !restoredFromGuest || initialTripId || importedRef.current) return
    if (!itineraryHasPlan(itinerary) && messages.length === 0) return

    importedRef.current = true
    void (async () => {
      try {
        const response = await fetch('/api/trips', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ itinerary, messages }),
        })
        if (!response.ok) return
        const payload = (await response.json()) as { trip: { id: string } }
        setTripId(payload.trip.id)
        tripIdRef.current = payload.trip.id
        clearGuestDraft()
        router.replace(`/plan/${payload.trip.id}`)
      } catch (err) {
        console.error('Failed to import guest draft:', err)
        importedRef.current = false
      }
    })()
  }, [signedIn, restoredFromGuest, initialTripId, itinerary, messages, router])

  const ensureTrip = async (): Promise<string | null> => {
    if (tripId) return tripId
    const response = await fetch('/api/trips', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itinerary, messages }),
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
      writeGuestDraft({ itinerary, messages })
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
      clearGuestDraft()
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
            {t('tabChat')}
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('plan')}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold ${mobileTab === 'plan' ? 'bg-[#FF9A76] text-white' : 'text-gray-600'}`}
          >
            {t('tabPlan')}
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
        title={t('authConfirmTitle')}
        description={t('authConfirmBody')}
        nextPath={tripId ? `/plan/${tripId}` : '/plan'}
      />
    </div>
  )
}
