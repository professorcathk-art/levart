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
  return dlat * dlat + dlon * dlon < 4
}

function isCloseToAnyAnchor(anchors: Array<{ lat: number; lon: number }>, lat: number, lon: number) {
  if (anchors.length === 0) return true
  return anchors.some((anchor) => isCloseToAnchor(anchor, lat, lon))
}

function parseStops(raw: unknown) {
  const values = Array.isArray(raw)
    ? raw.map((item) => (typeof item === 'string' ? item : ''))
    : typeof raw === 'string'
      ? raw.split('|')
      : []
  return values
    .map((stop) => cleanPlaceName(stop))
    .filter((stop) => stop.length >= 2)
    .filter((stop, index, all) => all.indexOf(stop) === index)
    .slice(0, 8)
}

async function buildPins(destination: string, stopsRaw: unknown) {
  const cities = destination
    .split(/[·・‧•,，/|]+/)
    .map((part) => part.trim())
    .filter(Boolean)
  const pins: Attraction[] = []
  const anchors: Array<{ lat: number; lon: number }> = []

  for (const city of cities.slice(0, 4)) {
    const hit = await geocodePlace(city)
    if (!hit || isNearDuplicate(pins, hit.lat, hit.lon)) continue
    anchors.push({ lat: hit.lat, lon: hit.lon })
    pins.push({
      id: pinId(city, pins.length),
      name: hit.name || city,
      category: 'city',
      lat: hit.lat,
      lon: hit.lon,
    })
  }

  const stops = parseStops(stopsRaw)
  const stopHits = await Promise.all(
    stops.map((stop) => geocodePlace(stop))
  )

  stopHits.forEach((hit, index) => {
    if (!hit || isNearDuplicate(pins, hit.lat, hit.lon)) return
    if (!isCloseToAnyAnchor(anchors, hit.lat, hit.lon)) return
    pins.push({
      id: pinId(stops[index], pins.length),
      name: hit.name || stops[index],
      category: 'stop',
      lat: hit.lat,
      lon: hit.lon,
    })
  })

  return { pins, destination }
}

export async function GET(request: NextRequest) {
  const destination = request.nextUrl.searchParams.get('q')?.trim()
  if (!destination) {
    return NextResponse.json({ error: 'Missing destination' }, { status: 400 })
  }

  try {
    const result = await buildPins(destination, request.nextUrl.searchParams.get('stops') || '')
    return NextResponse.json(result)
  } catch (error) {
    console.error('Geocode route failed:', error)
    return NextResponse.json({ pins: [] }, { status: 502 })
  }
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as { q?: unknown; destination?: unknown; stops?: unknown } | null
  const destination = (typeof body?.q === 'string' ? body.q : typeof body?.destination === 'string' ? body.destination : '')
    .trim()
  if (!destination) {
    return NextResponse.json({ error: 'Missing destination' }, { status: 400 })
  }

  try {
    const result = await buildPins(destination, body?.stops)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Geocode route failed:', error)
    return NextResponse.json({ pins: [] }, { status: 502 })
  }
}
