const SCENIC_COVERS: Array<{ test: RegExp; queries: string[] }> = [
  {
    test: /河口湖|kawaguchiko|富士|fuji|山梨|yamanashi/i,
    queries: ['Chureito Pagoda Mount Fuji', 'Mount Fuji Japan', 'Lake Kawaguchi Japan'],
  },
  {
    test: /箱根|hakone/i,
    queries: ['Hakone Lake Ashi', 'Mount Fuji Hakone', 'Hakone shrine torii'],
  },
  {
    test: /京都|kyoto/i,
    queries: ['Fushimi Inari Kyoto', 'Kiyomizu-dera Kyoto', 'Arashiyama bamboo grove'],
  },
  {
    test: /大阪|osaka/i,
    queries: ['Osaka Castle', 'Dotonbori Osaka night', 'Universal Studios Japan'],
  },
  {
    test: /沖繩|okinawa|naha/i,
    queries: ['Okinawa beach', 'Shuri Castle Okinawa', 'Okinawa blue sea'],
  },
  {
    test: /北海道|hokkaido|札幌|sapporo/i,
    queries: ['Biei Hokkaido hills', 'Sapporo night view', 'Otaru canal'],
  },
  {
    test: /台北|taipei|台灣|台湾/i,
    queries: ['Taipei 101', 'Jiufen Taiwan', 'Yangmingshan'],
  },
  {
    test: /香港|hong kong/i,
    queries: ['Hong Kong Victoria Harbour', 'Hong Kong Peak night', 'Hong Kong skyline'],
  },
]

const CURATED: Array<{ test: RegExp; photos: string[] }> = [
  {
    test: /河口湖|kawaguchiko|富士|fuji/i,
    photos: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1400&q=80',
    ],
  },
]

export function coverSearchQueries(destination: string, hints: string[] = []) {
  const haystack = [destination, ...hints].join(' ')
  const queries: string[] = []
  const add = (query: string) => {
    const trimmed = query.trim()
    if (trimmed && !queries.includes(trimmed)) queries.push(trimmed)
  }

  for (const rule of SCENIC_COVERS) {
    if (rule.test.test(haystack)) {
      for (const query of rule.queries) add(query)
      break
    }
  }

  for (const hint of hints) {
    if (hint.trim().length >= 2) add(`${hint.trim()} Japan landmark`)
    if (queries.length >= 4) break
  }

  const parts = destination.split(/[・·、,，/|]/).map((part) => part.trim()).filter(Boolean)
  for (const part of parts.reverse()) add(`${part} landmark`)
  if (destination.trim()) add(`${destination.trim()} landmark`)
  return queries.slice(0, 4)
}

export function curatedCoverPhotos(destination: string, hints: string[] = []) {
  const haystack = [destination, ...hints].join(' ')
  for (const rule of CURATED) {
    if (rule.test.test(haystack)) return [...rule.photos]
  }
  return []
}

export function locationHintsFromItinerary(
  itinerary?: { days?: Array<{ activities?: Array<{ location?: string; activity?: string }> }> }
) {
  const hints: string[] = []
  for (const day of itinerary?.days ?? []) {
    for (const activity of day.activities ?? []) {
      for (const value of [activity.location, activity.activity]) {
        if (!value) continue
        if (/富士|河口湖|忍野|箱根|京都|淺草|銀座|富士山/.test(value) && !hints.includes(value)) {
          hints.push(value)
        }
      }
    }
  }
  return hints.slice(0, 6)
}
