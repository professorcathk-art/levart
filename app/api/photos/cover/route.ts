import { NextRequest, NextResponse } from 'next/server'
import { resolveCoverPhotos } from '@/lib/photos/search'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const destination = request.nextUrl.searchParams.get('destination')?.trim() ?? ''
    const hints = (request.nextUrl.searchParams.get('hints') ?? '')
      .split('|')
      .map((item) => item.trim())
      .filter(Boolean)
    if (!destination) {
      return NextResponse.json({ error: 'destination is required', photos: [] }, { status: 400 })
    }
    const photos = await resolveCoverPhotos(destination, hints)
    return NextResponse.json({ photos })
  } catch (error) {
    console.error('Cover photo lookup failed:', error)
    return NextResponse.json({ error: 'Failed to load cover photos', photos: [] }, { status: 500 })
  }
}
