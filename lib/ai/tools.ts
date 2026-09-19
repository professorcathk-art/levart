import { tool } from 'ai'
import { z } from 'zod'
import { searchDestinations } from '@/lib/apis/destinations'
import { searchAttractions as searchGooglePlaces } from '@/lib/apis/google-places'
import { searchAttractions as searchGeoapify } from '@/lib/apis/geoapify'
import { getWeatherForecast } from '@/lib/apis/weather'
import { optimizeRoute } from '@/lib/apis/osrm'
import { addDays, emptyItinerary, isTripFocus } from '@/lib/trips/itinerary'
import type { Attraction, Itinerary, TripFocus } from '@/types'

const activitySchema = z.object({
  time: z.enum(['morning', 'afternoon', 'evening']),
  activity: z.string(),
  location: z.string(),
  duration: z.string().optional(),
  cost: z.string().optional(),
  distance: z.string().optional(),
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
}

async function findAttractions(
  destination: string,
  focus: string[],
  radiusKm: number
): Promise<Attraction[]> {
  try {
    return await searchGooglePlaces(destination, focus, radiusKm)
  } catch (googleError) {
    console.warn('Google Places failed, using Geoapify:', googleError)
    return searchGeoapify(destination, focus)
  }
}

export function createPlannerTools(ctx: PlannerContext) {
  return {
    search_destinations: tool({
      description: 'Search for city or destination names the traveler might mean.',
      inputSchema: z.object({
        query: z.string().describe('Partial destination name'),
      }),
      execute: async ({ query }) => {
        const suggestions = await searchDestinations(query)
        return { suggestions }
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
        const attractions = await findAttractions(destination, focus, radiusKm ?? 20)
        if (attractions.length > 0) {
          ctx.itinerary.selectedAttractions = attractions.slice(0, 16)
          ctx.itinerary.destination = destination
          ctx.itinerary.tripFocus = focus.filter(isTripFocus)
          ctx.dirty = true
        }
        return {
          count: attractions.length,
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
      description: 'Get a daily weather forecast for a destination using coordinates.',
      inputSchema: z.object({
        lat: z.number(),
        lon: z.number(),
        startDate: z.string().describe('YYYY-MM-DD'),
        days: z.number().min(1).max(14),
      }),
      execute: async ({ lat, lon, startDate, days }) => {
        try {
          return { forecasts: await getWeatherForecast(lat, lon, startDate, days) }
        } catch (error) {
          console.error('Weather tool failed:', error)
          return {
            forecasts: Array.from({ length: days }, (_, index) => ({
              date: addDays(startDate, index),
              temperature: 22,
              condition: 'clear',
              description: 'Forecast unavailable',
            })),
          }
        }
      },
    }),
    optimize_route: tool({
      description: 'Optimize a walking/driving route between selected attractions.',
      inputSchema: z.object({
        points: z.array(
          z.object({
            lat: z.number(),
            lon: z.number(),
            attractionId: z.string().optional(),
          })
        ),
      }),
      execute: async ({ points }) => {
        if (points.length < 2) {
          return { error: 'Need at least two points' }
        }
        try {
          const route = await optimizeRoute(points)
          ctx.itinerary.route = route
          ctx.dirty = true
          return {
            totalDistanceKm: Number((route.totalDistance / 1000).toFixed(1)),
            totalDurationMin: Math.round(route.totalDuration / 60),
          }
        } catch (error) {
          console.error('Route tool failed:', error)
          return { error: 'Could not optimize route' }
        }
      },
    }),
    update_itinerary: tool({
      description:
        'Create or replace the live itinerary shown beside the chat. Call this whenever the plan should change.',
      inputSchema: z.object({
        destination: z.string(),
        tripFocus: z.array(z.string()),
        checkIn: z.string().optional(),
        checkOut: z.string().optional(),
        days: z.array(daySchema),
        selectedAttractionIds: z.array(z.string()).optional(),
      }),
      execute: async ({ destination, tripFocus, checkIn, checkOut, days, selectedAttractionIds }) => {
        const focus = tripFocus.filter(isTripFocus) as TripFocus[]
        const selected = selectedAttractionIds
          ? ctx.itinerary.selectedAttractions.filter((item) => selectedAttractionIds.includes(item.id))
          : ctx.itinerary.selectedAttractions

        ctx.itinerary = emptyItinerary({
          ...ctx.itinerary,
          destination,
          tripFocus: focus,
          checkIn,
          checkOut,
          days,
          selectedAttractions: selected,
        })
        ctx.dirty = true

        return {
          ok: true,
          destination,
          dayCount: days.length,
          checkIn,
          checkOut,
        }
      },
    }),
  }
}
