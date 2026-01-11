import { NextResponse } from 'next/server'

export async function GET() {
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || ''
  return NextResponse.json({ mapboxToken })
}
