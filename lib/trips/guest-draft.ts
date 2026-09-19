import { itineraryHasPlan, parseItinerary } from '@/lib/trips/itinerary'
import type { PlannerMessage } from '@/lib/ai/types'
import type { Itinerary } from '@/types'

export const GUEST_DRAFT_KEY = 'levart-guest-draft'

export interface GuestDraft {
  itinerary: Itinerary | null
  messages: PlannerMessage[]
  savedAt: number
}

function canUseStorage() {
  return typeof window !== 'undefined'
}

function parseDraft(raw: string | null): GuestDraft | null {
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as {
      itinerary?: unknown
      messages?: PlannerMessage[]
    }
    const itinerary = parsed.itinerary ? parseItinerary(parsed.itinerary) : null
    const messages = Array.isArray(parsed.messages) ? parsed.messages : []
    if (!itineraryHasPlan(itinerary) && messages.length === 0) {
      return null
    }
    return {
      itinerary: itineraryHasPlan(itinerary) ? itinerary : null,
      messages,
      savedAt: Date.now(),
    }
  } catch {
    return null
  }
}

export function readGuestDraft(): GuestDraft | null {
  if (!canUseStorage()) return null
  return parseDraft(localStorage.getItem(GUEST_DRAFT_KEY)) ?? parseDraft(sessionStorage.getItem(GUEST_DRAFT_KEY))
}

export function writeGuestDraft(draft: { itinerary?: Itinerary | null; messages?: PlannerMessage[] }) {
  if (!canUseStorage()) return
  const current = readGuestDraft()
  const next: GuestDraft = {
    itinerary: draft.itinerary ?? current?.itinerary ?? null,
    messages: draft.messages ?? current?.messages ?? [],
    savedAt: Date.now(),
  }
  const raw = JSON.stringify(next)
  localStorage.setItem(GUEST_DRAFT_KEY, raw)
  sessionStorage.setItem(GUEST_DRAFT_KEY, raw)
}

export function clearGuestDraft() {
  if (!canUseStorage()) return
  localStorage.removeItem(GUEST_DRAFT_KEY)
  sessionStorage.removeItem(GUEST_DRAFT_KEY)
}
