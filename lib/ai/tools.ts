import { tool } from 'ai'
import { z } from 'zod'
import { searchDestinations } from '@/lib/apis/destinations'
import { geocodePlace, hasGeoapifyKey, hasGooglePlacesKey, isValidCoord } from '@/lib/apis/geocode'
import { searchAttractions as searchGooglePlaces } from '@/lib/apis/google-places'
import { searchAttractions as searchGeoapify } from '@/lib/apis/geoapify'
import { getWeatherForecast } from '@/lib/apis/weather'
import { optimizeRoute } from '@/lib/apis/osrm'
import { emptyItinerary, isTripFocus } from '@/lib/trips/itinerary'
import { expandDayActivities } from '@/lib/trips/atomic-stops'
import { addVersion, formatItineraryForPrompt, preserveUserEdits, summarizeDiff } from '@/lib/trips/versions'
import { searchTravelKnowledge } from '@/lib/trips/knowledge'
import { guessCurrency } from '@/lib/trips/currency'
import type { Attraction, DayItinerary, Itinerary, TripFocus } from '@/types'

const activitySchema = z.object({
  time: z.enum(['morning', 'afternoon', 'evening']),
  activity: z
    .string()
    .describe('One stop only, e.g. "Arrive Narita T2" or "Check in at Mitsui Garden Hotel". Do not chain multiple places with arrows.'),
  location: z
    .string()
    .describe('This stop’s place name only. No "A → B → C" routes.'),
  duration: z.string().optional(),
  cost: z.string().optional(),
  photoReference: z.string().optional(),
  distance: z
    .string()
    .optional()
    .describe('How to get from the previous stop to this stop only. Never describe an earlier hop.'),
  type: z.enum(['attraction', 'restaurant', 'shopping', 'nightlife', 'nature', 'culture']).optional(),
  address: z.string().optional(),
  openingHours: z.string().optional(),
  difficulty: z.enum(['easy', 'moderate', 'hard']).optional(),
  crowdLevel: z.enum(['low', 'medium', 'high']).optional(),
  accessibility: z.boolean().optional(),
  popular: z.boolean().optional(),
  free: z.boolean().optional(),
  tips: z.array(z.string()).optional(),
  nearbyAlternatives: z.array(z.string()).optional(),
})

const daySchema = z.object({
  day: z.number(),
  date: z.string(),
  weather: z
    .object({
      temperature: z.number(),
      condition: z.string(),
      description: z.string(),
    })
    .optional(),
  activities: z.array(activitySchema),
  restaurants: z.array(
    z.object({
      name: z.string(),
      cuisine: z.string().optional(),
      cost: z.string().optional(),
      address: z.string().optional(),
    })
  ),
  transport: z.array(z.string()),
  estimatedCost: z.string(),
  totalDistance: z.number().optional(),
  totalDuration: z.number().optional(),
  difficulty: z.enum(['easy', 'moderate', 'hard']).optional(),
})

export interface PlannerContext {
  itinerary: Itinerary
  dirty: boolean
  lastChange?: string
}

const attractionLookups = new Map<string, Promise<Attraction[]>>()

async function findAttractions(
  destination: string,
  focus: string[],
  radiusKm: number
): Promise<Attraction[]> {
  const key = `${destination.toLowerCase()}|${[...focus].sort().join(',')}|${radiusKm}`
  const inflight = attractionLookups.get(key)
  if (inflight) return inflight

  const pending = (async () => {
    if (hasGooglePlacesKey()) {
      try {
        return await searchGooglePlaces(destination, focus, radiusKm)
      } catch (googleError) {
        console.warn('Google Places failed, using Geoapify:', googleError)
      }
    }
    if (hasGeoapifyKey()) {
      try {
        return await searchGeoapify(destination, focus)
      } catch (geoError) {
        console.warn('Geoapify attraction search failed:', geoError)
      }
    }
    return [] as Attraction[]
  })()

  attractionLookups.set(key, pending)
  try {
    return await pending
  } finally {
    attractionLookups.delete(key)
  }
}

async function pinPlacesOnPlan(
  destination: string,
  focus: TripFocus[],
  days: DayItinerary[],
  existing: Attraction[]
): Promise<Attraction[]> {
  let attractions = existing
  if (attractions.length === 0 && (hasGooglePlacesKey() || hasGeoapifyKey())) {
    try {
      attractions = await findAttractions(destination, focus, 20)
    } catch (error) {
      console.warn('Could not pin map places:', error)
      return existing
    }
  }

  const haystack = days
    .flatMap((day) => day.activities.map((activity) => `${activity.activity} ${activity.location}`.toLowerCase()))
    .join(' | ')

  const matched = attractions.filter((item) => {
    const name = item.name.toLowerCase()
    if (!name) return false
    if (haystack.includes(name)) return true
    return name
      .split(/[\s,/]+/)
      .filter((word) => word.length > 3)
      .some((word) => haystack.includes(word))
  })

  return (matched.length > 0 ? matched : attractions).slice(0, 16)
}

function attachPlacePhotos(days: DayItinerary[], attractions: Attraction[]): DayItinerary[] {
  return days.map((day) => ({
    ...day,
    activities: day.activities.map((activity) => {
      if (activity.photo || activity.photoReference) return activity
      const match = attractions.find((place) => {
        const name = place.name.toLowerCase()
        return (
          activity.location.toLowerCase().includes(name) ||
          activity.activity.toLowerCase().includes(name) ||
          name.includes(activity.location.toLowerCase())
        )
      })
      return match?.photoReference ? { ...activity, photoReference: match.photoReference } : activity
    }),
  }))
}

export function createPlannerTools(ctx: PlannerContext) {
  return {
    search_destinations: tool({
      description: 'Search for city or destination names the traveler might mean.',
      inputSchema: z.object({
        query: z.string().describe('Partial destination name'),
      }),
      execute: async ({ query }) => {
        try {
          return { suggestions: await searchDestinations(query) }
        } catch (error) {
          console.error('Destination search failed:', error)
          return { suggestions: [], error: 'Could not search destinations' }
        }
      },
    }),
    search_attractions: tool({
      description: 'Find attractions, restaurants, and places for a destination and trip focus.',
      inputSchema: z.object({
        destination: z.string(),
        focus: z.array(z.string()).describe('Trip focus tags such as food, culture, beach'),
        radiusKm: z.number().optional(),
      }),
      execute: async ({ destination, focus, radiusKm }) => {
        let attractions: Attraction[] = []
        try {
          attractions = await findAttractions(destination, focus, radiusKm ?? 20)
        } catch (error) {
          console.error('Attraction search failed:', error)
          return { count: 0, attractions: [], error: 'Could not search attractions' }
        }
        if (attractions.length > 0) {
          ctx.itinerary.selectedAttractions = attractions.slice(0, 16)
          ctx.itinerary.destination = destination
          ctx.itinerary.tripFocus = focus.filter(isTripFocus)
          ctx.dirty = true
        }
        return {
          count: attractions.length,
          hint:
            attractions.length === 0
              ? 'No live place search is configured. Draft a realistic itinerary from your own knowledge and community notes.'
              : undefined,
          attractions: attractions.slice(0, 16).map((item) => ({
            id: item.id,
            name: item.name,
            category: item.category,
            lat: item.lat,
            lon: item.lon,
            address: item.address,
            rating: item.rating,
          })),
        }
      },
    }),
    get_weather: tool({
      description: 'Get a daily weather forecast. Prefer a destination name; coordinates are optional.',
      inputSchema: z.object({
        destination: z.string().optional(),
        lat: z.number().optional(),
        lon: z.number().optional(),
        startDate: z.string().describe('YYYY-MM-DD'),
        days: z.number().min(1).max(14),
      }),
      execute: async ({ destination, lat, lon, startDate, days }) => {
        let coords = isValidCoord(lat, lon) ? { lat: lat as number, lon: lon as number } : null
        if (!coords) {
          coords = await geocodePlace(destination || ctx.itinerary.destination)
        }
        if (!coords) {
          return {
            forecasts: [],
            error: 'Could not locate that destination for weather. Continue without a forecast.',
          }
        }
        try {
          return { forecasts: await getWeatherForecast(coords.lat, coords.lon, startDate, days) }
        } catch (error) {
          console.error('Weather tool failed:', error)
          return {
            forecasts: [],
            error: 'Weather unavailable. Continue the plan without a forecast.',
          }
        }
      },
    }),
    optimize_route: tool({
      description:
        'Estimate walking or driving time between selected attractions. Use walking for city sightseeing clusters. This is travel time, not a bus/train timetable.',
      inputSchema: z.object({
        points: z.array(
          z.object({
            lat: z.number(),
            lon: z.number(),
            attractionId: z.string().optional(),
          })
        ),
        profile: z.enum(['walking', 'driving']).optional(),
      }),
      execute: async ({ points, profile }) => {
        if (points.length < 2) {
          return { error: 'Need at least two points' }
        }
        try {
          const route = await optimizeRoute(points, profile ?? 'walking')
          ctx.itinerary.route = route
          ctx.dirty = true
          return {
            profile: profile ?? 'walking',
            totalDistanceKm: Number((route.totalDistance / 1000).toFixed(1)),
            totalDurationMin: Math.round(route.totalDuration / 60),
            note: 'Use this duration as a walking/driving estimate. Do not invent exact bus or train departure times.',
          }
        } catch (error) {
          console.error('Route tool failed:', error)
          return { error: 'Could not optimize route' }
        }
      },
    }),
    search_community_guides: tool({
      description:
        'Retrieve real traveler notes from published Catpawtrip trips and curated destination guides. Call this before writing a first itinerary.',
      inputSchema: z.object({
        destination: z.string(),
      }),
      execute: async ({ destination }) => {
        try {
          const snippets = await searchTravelKnowledge(destination)
          return {
            count: snippets.length,
            notes: snippets,
            hint:
              snippets.length === 0
                ? 'No community notes yet. Build a realistic plan from attractions, weather, and typical local transit patterns.'
                : 'Reuse workable sequencing and transit ideas. Do not copy a plan word for word.',
          }
        } catch (error) {
          console.error('Community guide search failed:', error)
          return { count: 0, notes: [], error: 'Could not load community notes' }
        }
      },
    }),
    get_current_itinerary: tool({
      description: 'Read the current live draft itinerary before editing it.',
      inputSchema: z.object({}),
      execute: async () => ({
        plan: formatItineraryForPrompt(ctx.itinerary),
        destination: ctx.itinerary.destination,
        dayCount: ctx.itinerary.days.length,
      }),
    }),
    update_itinerary: tool({
      description:
        'Update the live itinerary. Use this after every requested change. Locked traveler notes and activities are preserved automatically.',
      inputSchema: z.object({
        destination: z.string(),
        tripFocus: z.array(z.string()),
        checkIn: z.string().optional(),
        checkOut: z.string().optional(),
        currency: z
          .string()
          .optional()
          .describe('ISO 4217 currency code for this destination, e.g. TWD, JPY, HKD, USD'),
        days: z.array(daySchema),
        changeSummary: z
          .string()
          .optional()
          .describe('One sentence describing what you changed so the traveler can see the difference'),
        selectedAttractionIds: z.array(z.string()).optional(),
      }),
      execute: async ({
        destination,
        tripFocus,
        checkIn,
        checkOut,
        currency,
        days,
        changeSummary,
        selectedAttractionIds,
      }) => {
        const previous = ctx.itinerary
        const focus = tripFocus.filter(isTripFocus) as TripFocus[]
        const selected = await pinPlacesOnPlan(
          destination,
          focus,
          days,
          selectedAttractionIds
            ? ctx.itinerary.selectedAttractions.filter((item) => selectedAttractionIds.includes(item.id))
            : ctx.itinerary.selectedAttractions
        )
        const daysWithPhotos = attachPlacePhotos(days, selected).map((day) => ({
          ...day,
          activities: expandDayActivities(day.activities),
        }))
        const money = (currency || previous.currency || guessCurrency(destination).code).toUpperCase()

        const drafted = emptyItinerary({
          ...ctx.itinerary,
          destination,
          tripFocus: focus,
          checkIn,
          checkOut,
          currency: money,
          days: daysWithPhotos,
          selectedAttractions: selected,
        })
        const merged = preserveUserEdits(previous, drafted)
        const summary = changeSummary || summarizeDiff(previous, merged)
        ctx.itinerary = addVersion(previous, merged, 'ai', summary)
        ctx.lastChange = summary
        ctx.dirty = true

        return {
          ok: true,
          destination,
          currency: money,
          dayCount: merged.days.length,
          mapPins: selected.length,
          checkIn,
          checkOut,
          changeSummary: summary,
          preservedLockedEdits: true,
        }
      },
    }),
  }
}
