import { NextRequest, NextResponse } from 'next/server'
import { generateItinerary } from '@/lib/apis/claude'
import { getWeatherForecast } from '@/lib/apis/weather'
import { optimizeRoute } from '@/lib/apis/osrm'
import type { Attraction, TripFocus } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      destination,
      tripFocus,
      selectedAttractions,
      checkIn,
      dayCount,
    } = body

    if (
      !destination ||
      !tripFocus ||
      !selectedAttractions ||
      !dayCount
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Optimize route
    const routePoints = selectedAttractions.map((a: Attraction) => ({
      lat: a.lat,
      lon: a.lon,
      attractionId: a.id,
    }))

    const route = await optimizeRoute(routePoints)

    // Get weather forecast
    const centerLat =
      selectedAttractions.reduce((sum: number, a: Attraction) => sum + a.lat, 0) /
      selectedAttractions.length
    const centerLon =
      selectedAttractions.reduce((sum: number, a: Attraction) => sum + a.lon, 0) /
      selectedAttractions.length

    const startDate = checkIn || new Date().toISOString().split('T')[0]
    const weatherForecasts = await getWeatherForecast(
      centerLat,
      centerLon,
      startDate,
      dayCount
    )

    // Generate AI itinerary
    const days = await generateItinerary(
      destination,
      tripFocus as TripFocus[],
      selectedAttractions as Attraction[],
      {
        totalDistance: route.totalDistance,
        totalDuration: route.totalDuration,
      },
      weatherForecasts,
      dayCount
    )

    return NextResponse.json({
      itinerary: {
        destination,
        tripFocus,
        selectedAttractions,
        route,
        days,
        checkIn,
      },
    })
  } catch (error) {
    console.error('Error generating itinerary:', error)
    return NextResponse.json(
      { error: 'Failed to generate itinerary' },
      { status: 500 }
    )
  }
}
