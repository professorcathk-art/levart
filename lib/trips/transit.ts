import type { DayActivity } from '@/types'
import { textMentionsPlace } from '@/lib/trips/place-query'

export type TransitMode = 'walk' | 'train' | 'bus' | 'taxi' | 'other'

export interface TransitLeg {
  mode: TransitMode
  label: string
  duration?: string
  fare?: string
  from?: string
  to?: string
}

const TRAIN =
  /train|jr\b|metro|mrt|subway|tube|rail|tram|\bline\b|yamanote|sobu|keihin|bts|mtr|地下鐵|捷運|地鐵|電鐵|新幹線|輕軌|鐵道/i
const BUS = /bus|coach|shuttle|巴士|公車|客運|小巴/i
const TAXI = /taxi|uber|grab|cab|lyft|計程車|的士|Uber/i
const WALK = /walk|on foot|stroll|步行|走路|散步/i
const FARE = /([¥₩€£$]|NT\$|HK\$|S\$|RM|฿|₫)\s?\d[\d,]*/i
const DURATION = /(\d+\s?(?:min|mins|minutes|小時|小时|分鐘|分钟|h\b))/i

export function transitModeFromText(text: string): TransitMode {
  if (WALK.test(text)) return 'walk'
  if (TRAIN.test(text)) return 'train'
  if (BUS.test(text)) return 'bus'
  if (TAXI.test(text)) return 'taxi'
  return 'other'
}

export function parseTransitLeg(raw: string | undefined, fallback: TransitMode = 'walk'): TransitLeg {
  const text = raw?.trim() || ''
  const mode = text ? transitModeFromText(text) : fallback
  const fare = text.match(FARE)?.[0]
  const duration = text.match(DURATION)?.[0]
  return {
    mode,
    label: text || (mode === 'walk' ? 'Walk' : 'Local transit'),
    duration,
    fare,
  }
}

function mentionsAirportHop(text: string) {
  return /機場|airport|成田|羽田|narita|haneda/i.test(text)
}

function isHotelPlace(place: string) {
  return /飯店|酒店|旅館|hotel|ryokan|民宿/i.test(place)
}

function hintFitsHop(hint: string, fromEnd: string, toStart: string) {
  if (mentionsAirportHop(hint) && isHotelPlace(fromEnd) && !mentionsAirportHop(fromEnd)) {
    return false
  }
  const mentionsFrom = textMentionsPlace(hint, fromEnd)
  const mentionsTo = textMentionsPlace(hint, toStart)
  if (mentionsFrom && mentionsTo) return true
  if (mentionsFrom && mentionsAirportHop(fromEnd)) return true
  if (mentionsTo && !mentionsAirportHop(hint)) return true
  return false
}

export function inferTransitLeg(
  fromEnd: string,
  toStart: string,
  to: Pick<DayActivity, 'distance'>,
  transportHints: string[] = []
): TransitLeg | null {
  if (!fromEnd || !toStart || fromEnd === toStart) return null

  const aligned = [to.distance, ...transportHints]
    .filter((hint): hint is string => Boolean(hint?.trim()))
    .find((hint) => hintFitsHop(hint, fromEnd, toStart))

  if (aligned) {
    const parsed = parseTransitLeg(aligned)
    return {
      ...parsed,
      from: fromEnd,
      to: toStart,
    }
  }

  return {
    mode: 'walk',
    label: `${fromEnd} → ${toStart}`,
    from: fromEnd,
    to: toStart,
  }
}

export function mapsSearchUrl(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}

export function mapsDirectionsUrl(
  origin: string,
  destination: string,
  mode: TransitMode
) {
  const travelmode = mode === 'taxi' ? 'driving' : mode === 'walk' ? 'walking' : 'transit'
  return (
    `https://www.google.com/maps/dir/?api=1` +
    `&origin=${encodeURIComponent(origin)}` +
    `&destination=${encodeURIComponent(destination)}` +
    `&travelmode=${travelmode}`
  )
}

export function mapsRideUrl(destination: string) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}&travelmode=driving`
}

export const TRANSIT_ICONS: Record<TransitMode, string> = {
  walk: '🚶',
  train: '🚆',
  bus: '🚌',
  taxi: '🚕',
  other: '➡️',
}
