import type { Attraction, DayItinerary, Trip } from '@/types'

function matchesPlace(attraction: Attraction, day: DayItinerary) {
  const haystack = [
    ...day.activities.map((activity) => `${activity.activity} ${activity.location}`),
    ...day.restaurants.map((restaurant) => `${restaurant.name} ${restaurant.address ?? ''}`),
  ]
    .join(' | ')
    .toLowerCase()
  const name = attraction.name.toLowerCase()
  if (!name) return false
  if (haystack.includes(name)) return true
  return name
    .split(/[\s,/]+/)
    .filter((word) => word.length > 3)
    .some((word) => haystack.includes(word))
}

export function pinsForDay(trip: Trip, dayNumber?: number): Attraction[] {
  const all = trip.selectedAttractions ?? []
  if (all.length === 0) return []
  const day = trip.itinerary.days.find((item) => item.day === dayNumber)
  if (!day) return all
  const matched = all.filter((pin) => matchesPlace(pin, day))
  return matched.length > 0 ? matched : all
}
