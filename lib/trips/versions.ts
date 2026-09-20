import type { DayActivity, DayItinerary, Itinerary, PlanVersion } from '@/types'

function hasPlan(itinerary: Itinerary | null | undefined) {
  return Boolean(itinerary && itinerary.destination && itinerary.days.length > 0)
}

const MAX_VERSIONS = 15
export const ORIGINAL_PREFIX = 'Original draft'

export function isOriginalVersion(version: PlanVersion) {
  return version.summary.startsWith(ORIGINAL_PREFIX)
}

export function ensureOriginal(itinerary: Itinerary): Itinerary {
  if (!hasPlan(itinerary)) return itinerary
  const versions = [...(itinerary.versions ?? [])]
  if (versions.some(isOriginalVersion) || versions.length === 0) return itinerary
  const oldest = versions[versions.length - 1]
  versions[versions.length - 1] = {
    ...oldest,
    summary: `${ORIGINAL_PREFIX} · ${oldest.itinerary.destination || itinerary.destination || 'trip'}`,
  }
  return { ...itinerary, versions }
}

function samePlan(a: Itinerary, b: Itinerary) {
  return (
    a.destination === b.destination &&
    flattenActivities(a).join('\n') === flattenActivities(b).join('\n')
  )
}

function trimVersions(versions: PlanVersion[]) {
  if (versions.length <= MAX_VERSIONS) return versions
  const original = versions.find(isOriginalVersion) ?? versions[versions.length - 1]
  const rest = versions.filter((version) => version.id !== original.id).slice(0, MAX_VERSIONS - 1)
  return [...rest, original]
}

export function stripVersions(itinerary: Itinerary): Itinerary {
  return {
    ...itinerary,
    versions: undefined,
    lastChange: undefined,
  }
}

export function summarizeDiff(previous: Itinerary | null, next: Itinerary): string {
  if (!previous || !hasPlan(previous)) {
    return `Created ${next.days.length}-day plan for ${next.destination || 'a new trip'}`
  }

  const changes: string[] = []
  if (previous.destination !== next.destination) {
    changes.push(`destination → ${next.destination}`)
  }
  if (previous.days.length !== next.days.length) {
    changes.push(`days ${previous.days.length} → ${next.days.length}`)
  }
  if (previous.notes !== next.notes && next.notes) {
    changes.push('trip notes updated')
  }

  const prevActs = flattenActivities(previous)
  const nextActs = flattenActivities(next)
  const added = nextActs.filter((item) => !prevActs.includes(item))
  const removed = prevActs.filter((item) => !nextActs.includes(item))
  if (added.length > 0) changes.push(`+${added.length} activities`)
  if (removed.length > 0) changes.push(`-${removed.length} activities`)

  const lockedKept = next.days.some((day) =>
    day.activities.some((activity) => activity.userLocked) || day.notes || day.userLocked
  )
  if (lockedKept && previous.days.some((day) => day.activities.some((activity) => activity.userLocked))) {
    changes.push('kept your locked edits')
  }

  return changes.length > 0 ? changes.join(' · ') : `Updated ${next.destination || 'plan'}`
}

function flattenActivities(itinerary: Itinerary) {
  return itinerary.days.flatMap((day) =>
    day.activities.map((activity) => `${day.day}|${activity.time}|${activity.activity}|${activity.location}`)
  )
}

export function addVersion(
  previous: Itinerary | null,
  next: Itinerary,
  source: PlanVersion['source'],
  summary?: string
): Itinerary {
  const versions = [...(next.versions ?? previous?.versions ?? [])]
  if (previous && hasPlan(previous)) {
    const alreadyOriginal = versions.some(
      (version) => isOriginalVersion(version) && samePlan(version.itinerary, previous)
    )
    if (!alreadyOriginal) {
      versions.unshift({
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        source,
        summary: summary ?? summarizeDiff(previous, next),
        itinerary: stripVersions(previous),
      })
    }
  }

  if (hasPlan(next) && !versions.some(isOriginalVersion)) {
    const seed = previous && hasPlan(previous) ? previous : next
    versions.push({
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      source: 'ai',
      summary: `${ORIGINAL_PREFIX} · ${seed.destination || 'trip'}`,
      itinerary: stripVersions(seed),
    })
  }

  return {
    ...next,
    lastChange: summary ?? summarizeDiff(previous, next),
    versions: trimVersions(versions),
  }
}

export function preserveUserEdits(previous: Itinerary, next: Itinerary): Itinerary {
  const mergedDays = next.days.map((day) => {
    const prevDay = previous.days.find((item) => item.day === day.day)
    if (!prevDay) return day

    const locked = prevDay.activities.filter((activity) => activity.userLocked)
    const activities = [...day.activities]
    for (const lockedActivity of locked) {
      const index = activities.findIndex(
        (activity) =>
          activity.activity === lockedActivity.activity && activity.location === lockedActivity.location
      )
      if (index >= 0) {
        activities[index] = {
          ...activities[index],
          notes: lockedActivity.notes || activities[index].notes,
          userLocked: true,
          tips: lockedActivity.tips?.length ? lockedActivity.tips : activities[index].tips,
        }
      } else {
        activities.unshift(lockedActivity)
      }
    }

    return {
      ...day,
      notes: prevDay.notes || day.notes,
      userLocked: prevDay.userLocked || day.userLocked,
      activities,
    }
  })

  return {
    ...next,
    notes: previous.notes || next.notes,
    days: mergedDays,
    versions: previous.versions,
  }
}

export function formatItineraryForPrompt(itinerary: Itinerary): string {
  if (!hasPlan(itinerary)) {
    return 'No draft yet. Create the first plan with update_itinerary when you have enough details.'
  }

  const lines = [
    `Destination: ${itinerary.destination}`,
    `Focus: ${itinerary.tripFocus.join(', ') || 'none'}`,
    `Dates: ${itinerary.checkIn || '?'} to ${itinerary.checkOut || '?'}`,
    `Currency: ${itinerary.currency || 'guess from destination'}`,
  ]
  if (itinerary.notes) lines.push(`Traveler notes (do not delete): ${itinerary.notes}`)

  for (const day of itinerary.days) {
    lines.push('')
    lines.push(`Day ${day.day} (${day.date})${day.userLocked ? ' [DAY LOCKED]' : ''}`)
    if (day.notes) lines.push(`  Day notes (keep): ${day.notes}`)
    if (day.weather) lines.push(`  Weather: ${day.weather.temperature}°C ${day.weather.description}`)
    for (const activity of day.activities) {
      const lock = activity.userLocked ? ' [LOCKED by traveler]' : ''
      lines.push(`  - ${activity.time}: ${activity.activity} @ ${activity.location}${lock}`)
      if (activity.notes) lines.push(`    traveler note: ${activity.notes}`)
      if (activity.duration || activity.cost) {
        lines.push(`    ${[activity.duration, activity.cost].filter(Boolean).join(' · ')}`)
      }
    }
    if (day.restaurants.length > 0) {
      lines.push(`  Eat: ${day.restaurants.map((item) => item.name).join(', ')}`)
    }
    if (day.transport.length > 0) {
      lines.push(`  Transport: ${day.transport.join(', ')}`)
    }
  }

  return lines.join('\n')
}

export function collectTravelTips(
  itinerary: Itinerary
): { id: 'fromPlan' | 'style' | 'practical'; items: string[] }[] {
  const fromActivities = itinerary.days.flatMap((day) =>
    day.activities.flatMap((activity) => activity.tips ?? [])
  )
  const fromNotes = [
    itinerary.notes,
    ...itinerary.days.map((day) => day.notes),
    ...itinerary.days.flatMap((day) => day.activities.map((activity) => activity.notes)),
  ].filter((item): item is string => Boolean(item))

  const focusTips: string[] = []
  if (itinerary.tripFocus.includes('food')) {
    focusTips.push('Book popular restaurants a few days ahead, especially weekend dinners.')
    focusTips.push('Keep one flexible meal slot each day for a local stall or bakery find.')
  }
  if (itinerary.tripFocus.includes('culture')) {
    focusTips.push('Check temple, museum, and gallery closed days before you go.')
    focusTips.push('Carry a light layer for air-conditioned indoor sites.')
  }
  if (itinerary.tripFocus.includes('beach')) {
    focusTips.push('Pack reef-safe sunscreen, a dry bag, and extra water for beach days.')
  }
  if (itinerary.tripFocus.includes('family')) {
    focusTips.push('Plan a slower midday break and keep walking stretches under 20 minutes when possible.')
  }
  if (itinerary.tripFocus.includes('nightlife')) {
    focusTips.push('Save one quieter morning after a late night so the next day still works.')
  }
  if (itinerary.tripFocus.includes('shopping')) {
    focusTips.push('Leave extra bag space on the last day and confirm shop opening hours.')
  }
  if (itinerary.tripFocus.includes('climbing')) {
    focusTips.push('Check weather and trail closures the night before outdoor days.')
  }

  const general = [
    `Carry a screenshot of each day in ${itinerary.destination || 'your destination'} in case data is slow.`,
    'Keep tickets and hotel addresses offline, and note the nearest station for every stop.',
    'Build 15–20 minutes of buffer between neighborhoods.',
  ]

  return [
    { id: 'fromPlan' as const, items: Array.from(new Set([...fromActivities, ...fromNotes])) },
    { id: 'style' as const, items: focusTips },
    { id: 'practical' as const, items: general },
  ].filter((section) => section.items.length > 0)
}

export function restoreVersion(current: Itinerary, version: PlanVersion): Itinerary {
  return addVersion(current, { ...version.itinerary, versions: current.versions }, 'restore', `Restored: ${version.summary}`)
}

export function markUserEdits(itinerary: Itinerary): Itinerary {
  return {
    ...itinerary,
    days: itinerary.days.map((day) => ({
      ...day,
      activities: day.activities.map((activity) =>
        activity.notes || activity.userLocked ? { ...activity, userLocked: true } : activity
      ),
    })),
  }
}

export function parseVersionList(value: unknown): PlanVersion[] {
  if (!Array.isArray(value)) return []
  return value
    .filter((item): item is PlanVersion => Boolean(item && typeof item === 'object' && 'itinerary' in item))
    .map((item) => ({
      id: typeof item.id === 'string' ? item.id : crypto.randomUUID(),
      createdAt: typeof item.createdAt === 'string' ? item.createdAt : new Date().toISOString(),
      source: item.source === 'user' || item.source === 'restore' ? item.source : 'ai',
      summary: typeof item.summary === 'string' ? item.summary : 'Saved version',
      itinerary: item.itinerary,
    }))
}

export function activityKey(day: DayItinerary, activity: DayActivity) {
  return `${day.day}-${activity.time}-${activity.activity}`
}
