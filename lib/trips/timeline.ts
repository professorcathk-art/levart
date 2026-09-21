import type { DayActivity, DayItinerary } from '@/types'
import { cardEndLocation, cardStartLocation, expandDayActivities } from '@/lib/trips/atomic-stops'
import { clockToMinutes } from '@/lib/trips/clock'
import { isFoodStop, scheduleActivities } from '@/lib/trips/day-health'

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
  if (activity.type === 'restaurant' || isFoodStop(activity)) return 'food'
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
  const activities = scheduleActivities(expandDayActivities(day.activities))
  return activities
    .map((activity, index) => toTimelineItem(activity, `a-${day.day}-${index}`))
    .sort((a, b) => {
      const aMin = clockToMinutes(a.activity.startTime)
      const bMin = clockToMinutes(b.activity.startTime)
      if (aMin !== null && bMin !== null && aMin !== bMin) return aMin - bMin
      const order: Record<DayActivity['time'], number> = { morning: 0, afternoon: 1, evening: 2 }
      return order[a.time] - order[b.time]
    })
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
