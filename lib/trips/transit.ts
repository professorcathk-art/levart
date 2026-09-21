import type { DayActivity } from '@/types'
import { cleanPlaceName, textMentionsPlace } from '@/lib/trips/place-query'

export type TransitMode = 'walk' | 'train' | 'bus' | 'taxi' | 'other'

export interface TransitLeg {
  mode: TransitMode
  label: string
  lineName?: string
  duration?: string
  fare?: string
  from?: string
  to?: string
  detail?: string
}

const TRAIN =
  /train|jr\b|metro|mrt|subway|tube|rail|tram|\bline\b|yamanote|sobu|keihin|bts|mtr|地下鐵|捷運|地鐵|電鐵|新幹線|輕軌|鐵道/i
const BUS = /bus|coach|shuttle|巴士|公車|客運|小巴/i
const TAXI = /taxi|uber|grab|cab|lyft|計程車|的士|Uber/i
const WALK = /walk|on foot|stroll|步行|走路|散步/i
const FARE = /(?:JPY|NT\$|HK\$|TWD|USD|S\$|RM|฿|₫|[¥₩€£$])\s?\d[\d,]*/i
const DURATION = /(\d+\s*小時(?:\s*\d+\s*分(?:鐘)?)?|\d+\s*(?:分鐘|分钟|分)|約?\s*\d+\s*(?:min|mins|minutes|hours?|hrs?|h\b))/i
const LINE =
  /((?:JR|東京\s*Metro|Tokyo Metro|Osaka Metro|MRT|MTR|BTS|地鐵|捷運|都營)?\s*[\u4e00-\u9fffA-Za-z0-9]+(?:線|綫)(?:快速|急行|特急|各駅停車)?|(?:JR\s+)?[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\s+(?:Line|Rapid))/i

export function stripStreetAddress(text: string) {
  return text
    .replace(/[（(][^）)]*[）)]/g, ' ')
    .replace(/\s*\d{1,4}[-–]\d{1,4}(?:[-–]\d{1,4})?/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function transitModeFromText(text: string): TransitMode {
  if (WALK.test(text)) return 'walk'
  if (TRAIN.test(text)) return 'train'
  if (BUS.test(text)) return 'bus'
  if (TAXI.test(text)) return 'taxi'
  return 'other'
}

function compactLabel(text: string, duration?: string, fare?: string, lineName?: string) {
  let label = stripStreetAddress(text)
    .replace(/\s*[→➜➡]\s*/g, ' → ')
    .replace(/\s*[·•]\s*/g, ' · ')
    .trim()
  if (duration) label = label.replace(duration, '').trim()
  if (fare) label = label.replace(fare, '').trim()
  if (lineName) label = label.replace(lineName, '').trim()
  return label.replace(/^[-·•\s]+|[-·•\s]+$/g, '').replace(/\s{2,}/g, ' ')
}

export function parseTransitLeg(raw: string | undefined, fallback: TransitMode = 'walk'): TransitLeg {
  const text = raw?.trim() || ''
  const mode = text ? transitModeFromText(text) : fallback
  const fare = text.match(FARE)?.[0]
  const duration = text.match(DURATION)?.[0]?.replace(/\s+/g, ' ')
  const lineName = text.match(LINE)?.[1]?.replace(/\s+/g, ' ').trim()
  const label = compactLabel(text, duration, fare, lineName) || (mode === 'walk' ? 'Walk' : 'Local transit')
  return {
    mode,
    label,
    lineName,
    duration,
    fare,
    detail: text && text !== label ? stripStreetAddress(text) : undefined,
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
  const fromPlace = stripStreetAddress(cleanPlaceName(fromEnd) || fromEnd)
  const toPlace = stripStreetAddress(cleanPlaceName(toStart) || toStart)
  if (!fromPlace || !toPlace || fromPlace === toPlace) return null

  const aligned = [to.distance, ...transportHints]
    .filter((hint): hint is string => Boolean(hint?.trim()))
    .find((hint) => hintFitsHop(hint, fromEnd, toStart) || hintFitsHop(hint, fromPlace, toPlace))

  if (aligned) {
    const parsed = parseTransitLeg(aligned)
    return {
      ...parsed,
      from: fromPlace,
      to: toPlace,
    }
  }

  return {
    mode: 'walk',
    label: `${fromPlace} → ${toPlace}`,
    from: fromPlace,
    to: toPlace,
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
