import type { Locale } from '@/lib/i18n/locales'
import type {
  Itinerary,
  StructuredTags,
  TripBudgetTag,
  TripCompanionTag,
  TripFocus,
  TripVibeTag,
} from '@/types'

export const TRIP_BUDGET_TAGS = ['luxury', 'comfort', 'budget', 'backpacker'] as const
export const TRIP_VIBE_TAGS = ['foodie', 'shopping', 'photo_spot', 'culture', 'relax'] as const
export const TRIP_COMPANION_TAGS = ['family', 'couples', 'solo', 'friends'] as const

const CITY_ZH: Record<string, string> = {
  tokyo: '東京',
  kyoto: '京都',
  osaka: '大阪',
  nara: '奈良',
  yokohama: '橫濱',
  sapporo: '札幌',
  fukuoka: '福岡',
  okinawa: '沖繩',
  taipei: '台北',
  tainan: '台南',
  taichung: '台中',
  kaohsiung: '高雄',
  hongkong: '香港',
  'hong kong': '香港',
  seoul: '首爾',
  busan: '釜山',
  bangkok: '曼谷',
  singapore: '新加坡',
  paris: '巴黎',
  london: '倫敦',
  rome: '羅馬',
  barcelona: '巴塞隆納',
  newyork: '紐約',
  'new york': '紐約',
}

function isBudgetTag(value: string): value is TripBudgetTag {
  return (TRIP_BUDGET_TAGS as readonly string[]).includes(value)
}

function isVibeTag(value: string): value is TripVibeTag {
  return (TRIP_VIBE_TAGS as readonly string[]).includes(value)
}

function isCompanionTag(value: string): value is TripCompanionTag {
  return (TRIP_COMPANION_TAGS as readonly string[]).includes(value)
}

export function parseStructuredTags(value: unknown): StructuredTags | undefined {
  if (!value || typeof value !== 'object') return undefined
  const raw = value as Record<string, unknown>
  const themeHeadline =
    typeof raw.themeHeadline === 'string'
      ? raw.themeHeadline.trim()
      : typeof raw.theme_headline === 'string'
        ? raw.theme_headline.trim()
        : undefined
  const budget = typeof raw.budget === 'string' && isBudgetTag(raw.budget) ? raw.budget : undefined
  const vibe = typeof raw.vibe === 'string' && isVibeTag(raw.vibe) ? raw.vibe : undefined
  const companion =
    typeof raw.companion === 'string' && isCompanionTag(raw.companion) ? raw.companion : undefined
  if (!themeHeadline && !budget && !vibe && !companion) return undefined
  return { themeHeadline: themeHeadline || undefined, budget, vibe, companion }
}

function cityStem(destination: string) {
  const cjk = destination.match(/[\u3400-\u9FFF]{2,4}/)
  if (cjk) return cjk[0].slice(0, 2)
  const key = destination
    .split(/[·,，、/|]/)[0]
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
  return CITY_ZH[key] || CITY_ZH[key.replace(/\s/g, '')] || destination.split(/[·,，、\s]/)[0] || destination
}

export function defaultThemeHeadline(destination: string, locale: Locale) {
  const city = cityStem(destination.trim() || (locale === 'zh-Hant' ? '旅程' : 'Trip'))
  if (/[\u3400-\u9FFF]/.test(city)) {
    return `${city.replace(/[^\u3400-\u9FFF]/g, '').slice(0, 2) || '旅程'}漫遊`
  }
  if (locale === 'zh-Hant') return '旅程漫遊'
  return `${city} wander`
}

export function inferVibe(focus: TripFocus[]): TripVibeTag | undefined {
  return vibesFromFocus(focus)[0]
}

export function vibesFromFocus(focus: TripFocus[]): TripVibeTag[] {
  const vibes: TripVibeTag[] = []
  const add = (vibe: TripVibeTag) => {
    if (!vibes.includes(vibe)) vibes.push(vibe)
  }
  for (const item of focus) {
    if (item === 'food') add('foodie')
    else if (item === 'shopping') add('shopping')
    else if (item === 'culture') add('culture')
    else if (item === 'beach' || item === 'climbing') add('relax')
    else if (item === 'nightlife') add('photo_spot')
  }
  return vibes
}

export function inferCompanion(focus: TripFocus[]): TripCompanionTag | undefined {
  if (focus.includes('family')) return 'family'
  if (focus.includes('nightlife')) return 'friends'
  return undefined
}

export function inferStructuredTags(itinerary: Pick<Itinerary, 'destination' | 'tripFocus'>, locale: Locale): StructuredTags {
  return {
    themeHeadline: defaultThemeHeadline(itinerary.destination, locale),
    budget: 'budget',
    vibe: inferVibe(itinerary.tripFocus ?? []),
    companion: inferCompanion(itinerary.tripFocus ?? []),
  }
}

export function resolveStructuredTags(
  itinerary: Pick<Itinerary, 'destination' | 'tripFocus' | 'structuredTags'>,
  locale: Locale
): {
  themeHeadline: string
  budget: TripBudgetTag
  vibes: TripVibeTag[]
  companion?: TripCompanionTag
} {
  const inferred = inferStructuredTags(itinerary, locale)
  const stored = itinerary.structuredTags
  const vibes = [...vibesFromFocus(itinerary.tripFocus ?? [])]
  if (stored?.vibe && !vibes.includes(stored.vibe)) vibes.unshift(stored.vibe)
  return {
    themeHeadline: stored?.themeHeadline?.trim() || inferred.themeHeadline || defaultThemeHeadline(itinerary.destination, locale),
    budget: stored?.budget || inferred.budget || 'budget',
    vibes,
    companion: stored?.companion || inferred.companion,
  }
}

export function mergeStructuredTags(
  incoming: StructuredTags | undefined,
  previous: StructuredTags | undefined,
  inferred: StructuredTags
): StructuredTags {
  return {
    themeHeadline: incoming?.themeHeadline?.trim() || previous?.themeHeadline || inferred.themeHeadline,
    budget: incoming?.budget || previous?.budget || inferred.budget,
    vibe: incoming?.vibe || previous?.vibe || inferred.vibe,
    companion: incoming?.companion || previous?.companion || inferred.companion,
  }
}
