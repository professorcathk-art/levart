import type { DayActivity, DayItinerary } from '@/types'
import { cardEndLocation, cardStartLocation, expandDayActivities } from '@/lib/trips/atomic-stops'

export type TimelineKind = 'place' | 'food' | 'stay'

export interface TimelineItem {
  id: string
  kind: TimelineKind
  time: DayActivity['time']
  title: string
  location: string
  startLocation: string
  endLocation: string
  activity: DayActivity
}

const STAY =
  /hotel|hostel|ryokan|airbnb|check[- ]?in|check[- ]?out|旅館|飯店|酒店|民宿|入住|退房/i

export function classifyActivity(activity: DayActivity): TimelineKind {
  if (activity.type === 'restaurant') return 'food'
  if (activity.type === 'attraction' || activity.type === 'culture' || activity.type === 'nature') {
    return STAY.test(`${activity.activity} ${activity.location}`) ? 'stay' : 'place'
  }
  if (STAY.test(`${activity.activity} ${activity.location}`)) return 'stay'
  return 'place'
}

function toTimelineItem(activity: DayActivity, id: string): TimelineItem {
  const startLocation = cardStartLocation(activity)
  const endLocation = cardEndLocation(activity)
  const kind = classifyActivity(activity)
  return {
    id,
    kind,
    time: activity.time,
    title: activity.activity,
    location: kind === 'stay' ? endLocation || activity.location : startLocation || activity.location,
    startLocation,
    endLocation,
    activity,
  }
}

export function buildTimeline(day: DayItinerary): TimelineItem[] {
  const items: TimelineItem[] = expandDayActivities(day.activities).map((activity, index) =>
    toTimelineItem(activity, `a-${day.day}-${index}`)
  )

  day.restaurants.forEach((restaurant, index) => {
    const alreadyListed = items.some(
      (item) => item.title.toLowerCase() === restaurant.name.toLowerCase()
    )
    if (alreadyListed) return
    items.push(
      toTimelineItem(
        {
          time: 'afternoon',
          activity: restaurant.name,
          location: restaurant.address || restaurant.name,
          type: 'restaurant',
          cost: restaurant.cost,
          address: restaurant.address,
          photo: restaurant.photo || restaurant.photoUrl,
        },
        `r-${day.day}-${index}`
      )
    )
  })

  const order: Record<DayActivity['time'], number> = {
    morning: 0,
    afternoon: 1,
    evening: 2,
  }
  return items.sort((a, b) => order[a.time] - order[b.time])
}

export function filterTimeline(
  items: TimelineItem[],
  filter: 'all' | 'attractions' | 'food' | 'stay'
) {
  if (filter === 'all') return items
  if (filter === 'food') return items.filter((item) => item.kind === 'food')
  if (filter === 'stay') return items.filter((item) => item.kind === 'stay')
  return items.filter((item) => item.kind === 'place')
}
