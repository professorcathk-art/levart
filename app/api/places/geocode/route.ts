import { NextRequest, NextResponse } from 'next/server'
import { geocodePlace } from '@/lib/apis/geocode'
import { cleanPlaceName } from '@/lib/trips/place-query'
import type { Attraction } from '@/types'

export const dynamic = 'force-dynamic'

function pinId(name: string, index: number) {
  return `geo-${index}-${name.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fff]+/g, '-').slice(0, 32)}`
}

function isNearDuplicate(pins: Attraction[], lat: number, lon: number) {
  return pins.some((pin) => Math.abs(pin.lat - lat) < 0.0008 && Math.abs(pin.lon - lon) < 0.0008)
}

function isCloseToAnchor(anchor: { lat: number; lon: number }, lat: number, lon: number) {
  const dlat = anchor.lat - lat
  const dlon = anchor.lon - lon
  return dlat * dlat + dlon * dlon < 16
}

export async function GET(request: NextRequest) {
  const destination = request.nextUrl.searchParams.get('q')?.trim()
  const stopsRaw = request.nextUrl.searchParams.get('stops')?.trim() || ''
  if (!destination) {
    return NextResponse.json({ error: 'Missing destination' }, { status: 400 })
  }

  try {
    const cities = destination
      .split(/[·・‧•,，/|]+/)
      .map((part) => part.trim())
      .filter(Boolean)
    const pins: Attraction[] = []
    let proximity: { lon: number; lat: number } | undefined

    for (const city of cities.slice(0, 3)) {
      let hit = await geocodePlace(city, {
        types: 'place,region,locality,district,poi',
        proximity,
        language: /[\u4e00-\u9fff]/.test(city) ? 'zh' : 'en',
      })
      if (hit && proximity && !isCloseToAnchor({ lat: proximity.lat, lon: proximity.lon }, hit.lat, hit.lon)) {
        hit = null
      }
      if (!hit && proximity) {
        hit = await geocodePlace(`${city}, ${cities[0]}`, {
          types: 'place,region,locality,poi',
          proximity,
        })
        if (hit && !isCloseToAnchor({ lat: proximity.lat, lon: proximity.lon }, hit.lat, hit.lon)) {
          hit = null
        }
      }
      if (!hit) continue
      if (isNearDuplicate(pins, hit.lat, hit.lon)) continue
      if (!proximity) proximity = { lon: hit.lon, lat: hit.lat }
      pins.push({
        id: pinId(city, pins.length),
        name: hit.name || city,
        category: 'city',
        lat: hit.lat,
        lon: hit.lon,
      })
    }

    const stops = stopsRaw
      .split('|')
      .map((stop) => cleanPlaceName(stop))
      .filter((stop) => stop.length >= 2)
      .slice(0, 6)

    const stopHits = await Promise.all(
      stops.map((stop) =>
        geocodePlace(stop, {
          types: 'poi,address,place,neighborhood,locality',
          proximity,
          language: /[\u4e00-\u9fff]/.test(stop) ? 'zh' : 'en',
        })
      )
    )

    stopHits.forEach((hit, index) => {
      if (!hit || isNearDuplicate(pins, hit.lat, hit.lon)) return
      if (proximity && !isCloseToAnchor({ lat: proximity.lat, lon: proximity.lon }, hit.lat, hit.lon)) {
        return
      }
      pins.push({
        id: pinId(stops[index], pins.length),
        name: hit.name || stops[index],
        category: 'stop',
        lat: hit.lat,
        lon: hit.lon,
      })
    })

    return NextResponse.json({ pins, destination })
  } catch (error) {
    console.error('Geocode route failed:', error)
    return NextResponse.json({ pins: [] }, { status: 502 })
  }
}
