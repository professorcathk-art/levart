import type { Trip, TripFocus } from '@/types'

export type CommunitySort = 'recent' | 'rating' | 'relevance'
export type DurationBucket = 'all' | 'short' | 'week' | 'long'
export type CommunityRegion = 'all' | 'japan' | 'europe' | 'asia'

const REGION_MATCH: Record<Exclude<CommunityRegion, 'all'>, RegExp> = {
  japan: /japan|tokyo|osaka|kyoto|hokkaido|okinawa|fukuoka|nagoya|nara|hiroshima|kawaguchiko|fuji|東京|大阪|京都|北海道|沖繩|福岡|名古屋|奈良|廣島|広島|河口湖|富士/i,
  europe:
    /paris|rome|london|barcelona|amsterdam|berlin|lisbon|florence|venice|europe|france|italy|spain|prague|vienna|munich|英國|巴黎|羅馬|倫敦|歐洲|法國|義大利|意大利|西班牙|阿姆斯特丹/i,
  asia: /taipei|taiwan|hong kong|seoul|bangkok|singapore|busan|hanoi|osaka|tokyo|kyoto|seoul|台北|台灣|台湾|香港|首爾|서울|曼谷|新加坡|韓國|韩国|東京|大阪|京都/i,
}

const SYNONYM_GROUPS: string[][] = [
  ['tokyo', '東京', 'toky', 'shinjuku', '新宿', 'shibuya', '渋谷', '淺草', '浅草', 'asakusa', 'akihabara', '秋葉原'],
  ['osaka', '大阪', 'namba', '難波', 'umeda', '梅田'],
  ['kyoto', '京都', 'gion', '祇園', 'arashiyama', '嵐山'],
  ['kawaguchiko', '河口湖', 'fuji', '富士', '富士山', 'mt fuji', 'yamanashi', '山梨'],
  ['hokkaido', '北海道', 'sapporo', '札幌', 'otaru', '小樽'],
  ['okinawa', '沖繩', '沖縄', 'naha', '那霸', '那覇'],
  ['taipei', '台北', '臺北', 'taiwan', '台灣', '台湾', 'jiufen', '九份'],
  ['hong kong', '香港', 'hk', 'kowloon', '九龍'],
  ['seoul', '首爾', '서울', 'korea', '韓國', '韩国'],
  ['bangkok', '曼谷', 'thailand', '泰國', '泰国'],
  ['singapore', '新加坡', 'sg'],
  ['paris', '巴黎', 'france', '法國', '法国'],
  ['rome', '羅馬', '罗马', 'italy', '義大利', '意大利'],
  ['london', '倫敦', '伦敦'],
  ['ramen', '拉麵', '拉面', 'tsukemen', '沾麵'],
  ['sushi', '壽司', '寿司'],
  ['food', '美食', '吃貨', 'gourmet', 'foodie'],
  ['anime', '動畫', '动漫', 'manga', '漫畫', '秋葉原', 'akihabara'],
]

function normalize(text: string) {
  return text
    .toLowerCase()
    .replace(/[・·、,，。.!！?？/\\|_\-–—()[\]{}]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function compact(text: string) {
  return normalize(text).replace(/\s+/g, '')
}

const STOPWORDS = new Set([
  'day',
  'days',
  'the',
  'a',
  'an',
  'in',
  'for',
  'and',
  'to',
  'of',
  'trip',
  'plan',
  '天',
  '日',
  '行程',
  '旅行',
])

export function tokenizeQuery(query: string) {
  const tokens = normalize(query)
    .split(' ')
    .map((token) => token.trim())
    .filter((token) => token.length >= 1)

  const extra: string[] = []
  for (const token of tokens) {
    if (!/^[\u4e00-\u9fff]{4,}$/.test(token)) continue
    for (let size = 2; size <= 3 && size < token.length; size += 1) {
      for (let index = 0; index + size <= token.length; index += 1) {
        extra.push(token.slice(index, index + size))
      }
    }
  }

  return Array.from(new Set([...tokens, ...extra])).filter((token) => token.length >= 1 && !STOPWORDS.has(token))
}

export function durationFromQuery(query: string): DurationBucket | null {
  const n = normalize(query)
  if (/(weekend|週末|周末|短途)/.test(n)) return 'short'
  const match = n.match(/(\d+)\s*(days?|天)/) ?? compact(query).match(/(\d+)天/)
  if (!match) return null
  const days = Number(match[1])
  if (!Number.isFinite(days) || days <= 0) return null
  if (days <= 3) return 'short'
  if (days <= 7) return 'week'
  return 'long'
}

function expandToken(token: string) {
  const expanded = new Set<string>([token])
  const compactToken = compact(token)
  for (const group of SYNONYM_GROUPS) {
    const hit = group.some((alias) => {
      const compactAlias = compact(alias)
      if (alias === token || compactAlias === compactToken) return true
      if (compactToken.length < 3 || compactAlias.length < 3) return false
      return compactAlias.includes(compactToken) || compactToken.includes(compactAlias)
    })
    if (hit) {
      for (const alias of group) expanded.add(alias)
    }
  }
  return Array.from(expanded)
}

function haystackFor(trip: Trip) {
  const stops = trip.itinerary.days.flatMap((day) =>
    day.activities.flatMap((activity) => [activity.activity, activity.location, activity.notes ?? '', ...(activity.tips ?? [])])
  )
  const restaurants = trip.itinerary.days.flatMap((day) => day.restaurants.map((item) => item.name))
  return normalize(
    [
      trip.destination,
      trip.itinerary.notes ?? '',
      trip.owner?.displayName ?? '',
      trip.owner?.username ?? '',
      ...(trip.tripFocus ?? []),
      trip.itinerary.structuredTags?.themeHeadline ?? '',
      trip.itinerary.structuredTags?.budget ?? '',
      trip.itinerary.structuredTags?.vibe ?? '',
      trip.itinerary.structuredTags?.companion ?? '',
      String(trip.itinerary.days.length),
      `${trip.itinerary.days.length} days`,
      `${trip.itinerary.days.length}天`,
      ...stops,
      ...restaurants,
    ].join(' ')
  )
}

function durationBucket(days: number): Exclude<DurationBucket, 'all'> {
  if (days <= 3) return 'short'
  if (days <= 7) return 'week'
  return 'long'
}

export function tripMatchesRegion(trip: Trip, region: CommunityRegion) {
  if (region === 'all') return true
  return REGION_MATCH[region].test(trip.destination)
}

function aliasHits(alias: string, haystack: string, compactHay: string) {
  const compactAlias = compact(alias)
  if (!compactAlias) return false
  if (/^\d+$/.test(compactAlias)) {
    return new RegExp(`(?:^|\\s)${compactAlias}(?:\\s|天|days?|$)`).test(haystack) || compactHay.includes(`${compactAlias}天`)
  }
  return haystack.includes(alias) || compactHay.includes(compactAlias)
}

export function scoreCommunityTrip(trip: Trip, query: string) {
  const tokens = tokenizeQuery(query)
  const compactQuery = compact(query)
  if (tokens.length === 0 && compactQuery.length < 2) return 0

  const haystack = haystackFor(trip)
  const compactHay = compact(haystack)
  const destination = normalize(trip.destination)
  const compactDestination = compact(trip.destination)
  let score = 0
  let matched = 0

  if (compactQuery.length >= 2 && compactHay.includes(compactQuery)) {
    score += 18
    matched += 1
  }

  for (const token of tokens) {
    const aliases = expandToken(token)
    const hit = aliases.some((alias) => aliasHits(alias, haystack, compactHay))
    if (!hit) continue
    matched += 1
    if (aliases.some((alias) => destination.includes(alias) || compactDestination.includes(compact(alias)))) score += 14
    else score += 6
    if (aliases.some((alias) => destination === alias || compactDestination === compact(alias))) score += 8
  }

  if (matched === 0) return 0
  if (tokens.length > 0 && matched >= tokens.length) score += 10
  const impliedDuration = durationFromQuery(query)
  if (impliedDuration && durationBucket(trip.itinerary.days.length) === impliedDuration) score += 8
  score += Math.min(trip.avgRating ?? 0, 5)
  return score
}

export function searchCommunityTrips(
  trips: Trip[],
  options?: {
    query?: string
    region?: CommunityRegion
    duration?: DurationBucket
    focus?: TripFocus | 'all'
    sort?: CommunitySort
  }
) {
  const query = options?.query?.trim() ?? ''
  const region = options?.region ?? 'all'
  const duration = options?.duration ?? 'all'
  const focus = options?.focus ?? 'all'
  const sort = options?.sort ?? (query ? 'relevance' : 'recent')

  const filtered = trips.filter((trip) => {
    if (!tripMatchesRegion(trip, region)) return false
    if (duration !== 'all' && durationBucket(trip.itinerary.days.length) !== duration) return false
    if (focus !== 'all' && !(trip.tripFocus ?? []).includes(focus)) return false
    if (!query) return true
    return scoreCommunityTrip(trip, query) > 0
  })

  if (sort === 'rating') {
    return filtered.sort((a, b) => (b.avgRating ?? 0) - (a.avgRating ?? 0) || (b.ratingCount ?? 0) - (a.ratingCount ?? 0))
  }
  if (sort === 'relevance' && query) {
    return filtered.sort((a, b) => scoreCommunityTrip(b, query) - scoreCommunityTrip(a, query))
  }
  return filtered.sort((a, b) => {
    const aTime = a.confirmedAt || a.updatedAt || a.createdAt
    const bTime = b.confirmedAt || b.updatedAt || b.createdAt
    return bTime.localeCompare(aTime)
  })
}

export function suggestCommunityQueries(trips: Trip[], query: string, limit = 6) {
  const needle = normalize(query)
  if (!needle) {
    return Array.from(new Set(trips.map((trip) => trip.destination).filter(Boolean))).slice(0, limit)
  }

  const compactNeedle = compact(query)
  const suggestions = new Set<string>()
  const ranked = [...trips].sort((a, b) => scoreCommunityTrip(b, query) - scoreCommunityTrip(a, query))

  for (const trip of ranked) {
    const destination = trip.destination
    if (
      normalize(destination).includes(needle) ||
      compact(destination).includes(compactNeedle) ||
      scoreCommunityTrip(trip, query) > 0
    ) {
      suggestions.add(destination)
    }
    for (const day of trip.itinerary.days) {
      for (const activity of day.activities) {
        if (!activity.location) continue
        if (normalize(activity.location).includes(needle) || compact(activity.location).includes(compactNeedle)) {
          suggestions.add(activity.location)
        }
      }
    }
    if (suggestions.size >= limit) break
  }
  return Array.from(suggestions).slice(0, limit)
}
