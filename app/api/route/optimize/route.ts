import { NextRequest, NextResponse } from 'next/server'
import { optimizeRoute } from '@/lib/apis/osrm'
import type { RoutePoint } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { points } = body

    if (!points || !Array.isArray(points) || points.length < 2) {
      return NextResponse.json(
        { error: 'At least 2 points are required' },
        { status: 400 }
      )
    }

    const routePoints: RoutePoint[] = points.map((p: unknown) => {
      const point = p as { lat: number; lon: number }
      return {
        lat: point.lat,
        lon: point.lon,
      }
    })

    const route = await optimizeRoute(routePoints)
    return NextResponse.json({ route })
  } catch (error) {
    console.error('Error optimizing route:', error)
    return NextResponse.json(
      { error: 'Failed to optimize route' },
      { status: 500 }
    )
  }
}
