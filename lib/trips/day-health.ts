import type { DayActivity, DayItinerary } from '@/types'
import {
  addClockMinutes,
  bucketFromClock,
  clockToMinutes,
  parseClock,
  parseDurationMinutes,
} from '@/lib/trips/clock'

const STAY =
  /hotel|hostel|ryokan|airbnb|check[- ]?in|check[- ]?out|旅館|飯店|酒店|民宿|入住|退房/i

const FOOD_NAME =
  /lunch|dinner|breakfast|brunch|kaiseki|ramen|sushi|izakaya|yakitori|restaurant|食堂|午餐|晚餐|早餐|懷石|燒鳥|拉麵|壽司|割烹|燒肉|居酒屋|咖啡/i
const SIGHTSEE = /散策|逛|walk|museum|park|神社|寺|展望|打卡|街景|old town|stroll/i
const SLOT_START: Record<DayActivity['time'], number> = {
  morning: 9 * 60,
  afternoon: 13 * 60 + 30,
  evening: 18 * 60,
}

export function isFoodStop(activity: DayActivity): boolean {
  if (activity.type === 'restaurant') return true
  const blob = `${activity.activity} ${activity.location}`
  if (SIGHTSEE.test(blob) && FOOD_NAME.test(blob)) return false
  return FOOD_NAME.test(blob)
}

export function mealSlot(activity: DayActivity): 'lunch' | 'dinner' | 'cafe' | null {
  if (!isFoodStop(activity)) return null
  const blob = `${activity.activity} ${activity.location}`.toLowerCase()
  if (/lunch|午餐|brunch|早午餐/.test(blob) || activity.time === 'afternoon') {
    if (/cafe|咖啡|甜點|dessert/.test(blob)) return 'cafe'
    return 'lunch'
  }
  if (/dinner|晚餐|kaiseki|懷石/.test(blob) || activity.time === 'evening') return 'dinner'
  if (/cafe|咖啡|甜點/.test(blob)) return 'cafe'
  if (/breakfast|早餐/.test(blob) || activity.time === 'morning') return 'cafe'
  return activity.time === 'evening' ? 'dinner' : 'lunch'
}

function defaultStayMinutes(activity: DayActivity): number {
  const parsed = parseDurationMinutes(activity.duration)
  if (parsed) return Math.min(Math.max(parsed, 20), 240)
  if (STAY.test(`${activity.activity} ${activity.location}`)) return 30
  if (isFoodStop(activity)) return 90
  if (/機場|airport/.test(`${activity.activity} ${activity.location}`)) return 90
  return 75
}

function transitBuffer(activity: DayActivity): number {
  return parseDurationMinutes(activity.distance) ?? 20
}

export function scheduleActivities(activities: DayActivity[]): DayActivity[] {
  let cursor: number | null = null
  let lastBucket: DayActivity['time'] | null = null

  return activities.map((activity, index) => {
    const stay = defaultStayMinutes(activity)
    const buffer = index === 0 ? 0 : transitBuffer(activity)
    const explicitStart = clockToMinutes(activity.startTime)
    if (lastBucket && activity.time !== lastBucket) cursor = null
    lastBucket = activity.time

    const startMinutes =
      explicitStart ??
      (cursor === null ? SLOT_START[activity.time] : cursor + buffer)
    const endMinutes = clockToMinutes(activity.endTime) ?? startMinutes + stay
    cursor = endMinutes

    const startTime = parseClock(activity.startTime) ?? addClockMinutes('00:00', startMinutes)
    const endTime = parseClock(activity.endTime) ?? addClockMinutes('00:00', Math.max(endMinutes, startMinutes + 20))
    return {
      ...activity,
      startTime,
      endTime,
      time: bucketFromClock(startTime),
    }
  })
}

export function capMeals(activities: DayActivity[]): DayActivity[] {
  let lunch = 0
  let dinner = 0
  let prevFood = false
  const kept: DayActivity[] = []

  for (const activity of activities) {
    const food = isFoodStop(activity)
    if (!food) {
      prevFood = false
      kept.push(activity)
      continue
    }

    const slot = mealSlot(activity) === 'dinner' ? 'dinner' : 'lunch'
    const overCap = slot === 'dinner' ? dinner >= 1 : lunch >= 1
    const consecutive = prevFood && !activity.userLocked
    if ((overCap || consecutive) && !activity.userLocked) {
      continue
    }
    if (slot === 'dinner') dinner += 1
    else lunch += 1
    prevFood = true
    kept.push(activity)
  }

  return kept
}

export function sanitizeDay(day: DayItinerary): DayItinerary {
  const activities = scheduleActivities(capMeals(day.activities))
  const listed = new Set(activities.map((item) => item.activity.trim().toLowerCase()))
  const restaurants = day.restaurants.filter((item) => !listed.has(item.name.trim().toLowerCase())).slice(0, 2)
  return { ...day, activities, restaurants }
}

export function sanitizeDays(days: DayItinerary[]): DayItinerary[] {
  return days.map(sanitizeDay)
}
