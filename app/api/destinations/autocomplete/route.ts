import { NextRequest, NextResponse } from 'next/server'

const GEOAPIFY_BASE_URL = 'https://api.geoapify.com/v1/geocode/autocomplete'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')

    if (!query || query.length < 2) {
      return NextResponse.json({ suggestions: [] })
    }

    const apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY
    if (!apiKey) {
      return NextResponse.json({ suggestions: [] })
    }

    const response = await fetch(
      `${GEOAPIFY_BASE_URL}?` +
        new URLSearchParams({
          text: query,
          limit: '10',
          type: 'city',
          apiKey,
        })
    )

    if (!response.ok) {
      return NextResponse.json({ suggestions: [] })
    }

    const data = (await response.json()) as {
      features?: Array<{
        properties: {
          name: string
          country: string
          state?: string
          formatted: string
        }
      }>
    }

    const suggestions = (data.features || []).map((feature) => ({
      name: feature.properties.name,
      country: feature.properties.country,
      state: feature.properties.state,
      formatted: feature.properties.formatted,
      display: feature.properties.formatted,
    }))

    return NextResponse.json({ suggestions })
  } catch (error) {
    console.error('Error fetching destination suggestions:', error)
    return NextResponse.json({ suggestions: [] })
  }
}
