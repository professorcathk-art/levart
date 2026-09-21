import type { DayActivity } from '@/types'

const CLOCK = /^(\d{1,2}):(\d{2})$/

export function parseClock(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  const match = value.trim().match(CLOCK)
  if (!match) return undefined
  const hours = Number(match[1])
  const minutes = Number(match[2])
  if (!Number.isInteger(hours) || !Number.isInteger(minutes)) return undefined
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return undefined
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

export function clockToMinutes(value: string | undefined): number | null {
  const clock = parseClock(value)
  if (!clock) return null
  const [hours, minutes] = clock.split(':').map(Number)
  return hours * 60 + minutes
}

export function minutesToClock(total: number): string {
  const wrapped = ((total % (24 * 60)) + 24 * 60) % (24 * 60)
  const hours = Math.floor(wrapped / 60)
  const minutes = wrapped % 60
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

export function addClockMinutes(clock: string, minutes: number): string {
  const start = clockToMinutes(clock)
  if (start === null) return minutesToClock(minutes)
  return minutesToClock(start + minutes)
}

export function bucketFromClock(clock?: string): DayActivity['time'] {
  const minutes = clockToMinutes(clock)
  if (minutes === null) return 'morning'
  if (minutes < 12 * 60) return 'morning'
  if (minutes < 17 * 60) return 'afternoon'
  return 'evening'
}

export function parseDurationMinutes(value: string | undefined): number | null {
  if (!value) return null
  const hours = value.match(/(\d+(?:\.\d+)?)\s*(?:小時|小时|hrs?|hours?)/i)
  if (hours) return Math.round(Number(hours[1]) * 60)
  const minutes = value.match(/(\d+)\s*(?:分鐘|分钟|mins?|minutes?|min\b)/i)
  if (minutes) return Number(minutes[1])
  const bare = value.trim().match(/^(\d{1,3})$/)
  if (bare) {
    const amount = Number(bare[1])
    if (amount >= 10 && amount <= 240) return amount
  }
  return null
}

export function formatTimeRange(start?: string, end?: string): string | null {
  const from = parseClock(start)
  const to = parseClock(end)
  if (from && to) return `${from} – ${to}`
  if (from) return from
  return null
}
