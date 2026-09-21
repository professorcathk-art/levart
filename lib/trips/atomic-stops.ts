import type { DayActivity } from '@/types'
import { endPlaceName, startPlaceName } from '@/lib/trips/place-query'

const ARROW = /\s*[→➜➡]\s*/
const TIME_STAMP = /\b\d{1,2}:\d{2}\b/g
const AIRPORT = /機場|airport|成田|羽田|關西|haneda|narita/i
const HOTEL = /check[- ]?in|入住|飯店|酒店|旅館|hotel|ryokan|民宿/i
const TRANSIT_ONLY =
  /^(?:\d{1,2}:\d{2}\s*)?(?:JR|地鐵|捷運|電車|巴士|公車|步行|走路|搭|轉乘|地下通道|metro|train|walk|take the)\b/i
const TRANSIT_HINT = /線|直達|地下通道|transfer|轉乘|JR\b|metro|train|walk|步行/i
const PLACE_EVENT = /抵達|入境|入住|退房|check[- ]?in|晚餐|午餐|早餐|散策|逛|hotel|飯店|機場/i

export function isCompoundActivity(activity: DayActivity) {
  if (activity.userLocked) return false
  const blob = `${activity.activity} ${activity.location}`
  if (!ARROW.test(blob)) return false
  const times = blob.match(TIME_STAMP) ?? []
  if (times.length >= 2) return true
  return AIRPORT.test(blob) && HOTEL.test(blob)
}

function stripTime(text: string) {
  return text.replace(/^\s*\d{1,2}:\d{2}\s*/, '').replace(/\s+/g, ' ').trim()
}

function isTransitSegment(part: string) {
  const text = stripTime(part)
  if (!text) return true
  if (PLACE_EVENT.test(text) && (AIRPORT.test(text) || HOTEL.test(text))) return false
  if (TRANSIT_ONLY.test(part)) return true
  return TRANSIT_HINT.test(text) && !PLACE_EVENT.test(text)
}

function locationForPart(part: string, locationParts: string[], index: number) {
  const fromTitle = startPlaceName(stripTime(part).replace(/^(抵達|入境|入住)/, ''))
  if (fromTitle.length >= 2 && !isTransitSegment(fromTitle)) return fromTitle
  const mapped = locationParts[index] || locationParts[locationParts.length - 1] || part
  return startPlaceName(mapped) || stripTime(mapped)
}

export function expandCompoundActivity(activity: DayActivity): DayActivity[] {
  if (!isCompoundActivity(activity)) return [activity]

  const titleParts = activity.activity.split(ARROW).map((part) => part.trim()).filter(Boolean)
  const locationParts = activity.location.split(ARROW).map((part) => part.trim()).filter(Boolean)
  if (titleParts.length < 2) return [activity]

  const spots: DayActivity[] = []
  let pendingTransit: string | undefined
  let placeIndex = 0

  for (const part of titleParts) {
    if (isTransitSegment(part)) {
      pendingTransit = [pendingTransit, stripTime(part)].filter(Boolean).join(' · ')
      continue
    }

    const location = locationForPart(part, locationParts, placeIndex)
    const inbound = pendingTransit || (placeIndex === 0 ? undefined : activity.distance)
    spots.push({
      ...activity,
      activity: stripTime(part),
      location,
      address: placeIndex === 0 ? activity.address : undefined,
      duration: placeIndex === 0 ? activity.duration : undefined,
      cost: placeIndex === 0 ? activity.cost : undefined,
      startTime: placeIndex === 0 ? activity.startTime : undefined,
      endTime: placeIndex === 0 ? activity.endTime : undefined,
      distance: inbound,
      type: HOTEL.test(part) ? 'attraction' : activity.type,
    })
    pendingTransit = undefined
    placeIndex += 1
  }

  if (spots.length >= 2 && activity.distance) {
    const inbound = spots[1]
    spots[1] = {
      ...inbound,
      distance: [inbound.distance, activity.distance].filter(Boolean).join(' · '),
    }
  }

  return spots.length > 0 ? spots : [activity]
}

export function expandDayActivities(activities: DayActivity[]) {
  return activities.flatMap(expandCompoundActivity)
}

export function cardStartLocation(activity: DayActivity) {
  return startPlaceName(activity.location || activity.activity)
}

export function cardEndLocation(activity: DayActivity) {
  return endPlaceName(activity.location || activity.activity)
}
