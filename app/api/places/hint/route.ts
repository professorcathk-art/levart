import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

interface WikiSummary {
  title?: string
  extract?: string
  content_urls?: { desktop?: { page?: string } }
}

async function wikiSummary(lang: 'zh' | 'en', query: string) {
  const url = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Catpawtrip/1.0 (https://catpawtrip.com; travel planner place hints)',
      Accept: 'application/json',
    },
    next: { revalidate: 86400 },
  })
  if (!response.ok) return null
  const data = (await response.json()) as WikiSummary
  if (!data.extract) return null
  return {
    title: data.title || query,
    extract: data.extract,
    url: data.content_urls?.desktop?.page,
  }
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q')?.trim()
  const locale = request.nextUrl.searchParams.get('locale') || 'en'
  if (!query || query.length < 2) {
    return NextResponse.json({ error: 'Missing place' }, { status: 400 })
  }

  const first = locale.startsWith('zh') ? 'zh' : 'en'
  const second = first === 'zh' ? 'en' : 'zh'
  const place = query.split(/[·,，/|]/)[0]?.trim() || query

  try {
    const hint = (await wikiSummary(first, place)) || (await wikiSummary(second, place))
    if (!hint) {
      return NextResponse.json({ extract: null })
    }
    return NextResponse.json(hint)
  } catch (error) {
    console.error('Place hint failed:', error)
    return NextResponse.json({ extract: null }, { status: 502 })
  }
}
