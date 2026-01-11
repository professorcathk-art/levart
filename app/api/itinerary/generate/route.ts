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

    let route
    try {
      route = await optimizeRoute(routePoints)
    } catch (routeError) {
      console.error('Route optimization error:', routeError)
      // If route optimization fails, use default values
      route = {
        points: routePoints,
        polyline: JSON.stringify([]),
        totalDistance: 0,
        totalDuration: 0,
      }
    }

    // Get weather forecast
    const centerLat =
      selectedAttractions.reduce((sum: number, a: Attraction) => sum + a.lat, 0) /
      selectedAttractions.length
    const centerLon =
      selectedAttractions.reduce((sum: number, a: Attraction) => sum + a.lon, 0) /
      selectedAttractions.length

    const startDate = checkIn || new Date().toISOString().split('T')[0]
    let weatherForecasts
    try {
      weatherForecasts = await getWeatherForecast(
        centerLat,
        centerLon,
        startDate,
        dayCount
      )
    } catch (weatherError) {
      console.error('Weather forecast error:', weatherError)
      // If weather fails, create default forecasts
      weatherForecasts = Array.from({ length: dayCount }, (_, i) => {
        const date = new Date(startDate)
        date.setDate(date.getDate() + i)
        return {
          date: date.toISOString().split('T')[0],
          temperature: 20,
          condition: 'clear',
          description: 'Clear sky',
        }
      })
    }

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
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorDetails = error instanceof Error ? error.stack : String(error)
    console.error('Error details:', errorDetails)
    
    return NextResponse.json(
      { 
        error: `Failed to generate itinerary: ${errorMessage}`,
        details: process.env.NODE_ENV === 'development' ? errorDetails : undefined
      },
      { status: 500 }
    )
  }
}
