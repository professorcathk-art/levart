import { NextRequest, NextResponse } from 'next/server'
import { searchDestinations } from '@/lib/apis/destinations'

export async function GET(request: NextRequest) {
  try {
    const query = request.nextUrl.searchParams.get('q') ?? ''
    const suggestions = await searchDestinations(query)
    return NextResponse.json({ suggestions })
  } catch (error) {
    console.error('Error fetching destination suggestions:', error)
    return NextResponse.json({ suggestions: [] })
  }
}
