import { NextRequest, NextResponse } from 'next/server'
import { searchAttractions } from '@/lib/apis/geoapify'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { destination, focus } = body

    if (!destination || !focus || !Array.isArray(focus)) {
      return NextResponse.json(
        { error: 'Missing destination or focus' },
        { status: 400 }
      )
    }

    const attractions = await searchAttractions(destination, focus)
    return NextResponse.json({ attractions })
  } catch (error) {
    console.error('Error fetching attractions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch attractions' },
      { status: 500 }
    )
  }
}
