import type { RouteData, RoutePoint } from '@/types'

const OSRM_BASE_URL = 'https://router.project-osrm.org'

export async function optimizeRoute(
  points: RoutePoint[]
): Promise<RouteData> {
  if (points.length < 2) {
    throw new Error('At least 2 points are required for routing')
  }

  // Build coordinates string: lon,lat;lon,lat;...
  const coordinates = points.map((p) => `${p.lon},${p.lat}`).join(';')

  try {
    // Use OSRM route service
    const response = await fetch(
      `${OSRM_BASE_URL}/route/v1/driving/${coordinates}?overview=full&geometries=geojson`
    )

    if (!response.ok) {
      throw new Error(`OSRM API error: ${response.statusText}`)
    }

    const data = await response.json()

    if (data.code !== 'Ok') {
      throw new Error(`OSRM routing failed: ${data.code}`)
    }

    const route = data.routes[0]
    const geometry = route.geometry

    // Extract polyline coordinates
    const polyline = geometry.coordinates
      .map((coord: [number, number]) => [coord[1], coord[0]]) // Convert lon,lat to lat,lon
      .flat()

    return {
      points,
      polyline: JSON.stringify(polyline),
      totalDistance: route.distance, // in meters
      totalDuration: route.duration, // in seconds
    }
  } catch (error) {
    console.error('Error optimizing route:', error)
    throw error
  }
}
