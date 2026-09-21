import type { Locale } from '@/lib/i18n/locales'
import type {
  DayActivity,
  Itinerary,
  StructuredTags,
  TripBudgetTag,
  TripCompanionTag,
  TripFocus,
  TripVibeTag,
} from '@/types'

export const TRIP_BUDGET_TAGS = ['luxury', 'comfort', 'budget', 'backpacker'] as const
export const TRIP_VIBE_TAGS = ['experience', 'foodie', 'shopping', 'photo_spot', 'culture', 'relax'] as const
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

const SKIP_ACTIVITY =
  /抵達|機場|入境|領行李|check-?in|check-?out|退房|接駁至|接駁車至|搭計程車|搭地鐵|搭巴士|返港|出境|航班|火車前往|前往下一/i

const LUXURY_STAY =
  /虹夕諾雅|hoshinoya|星のや|星野リゾート|ritz|リッツ|four seasons|四季酒店|aman\b|アマン|peninsula|半島酒店|bulgari|ブルガリ|park hyatt|パークハイアット|conrad|コンラッド|st\.?\s*regis|mandarin oriental|文華東方|waldorf|bellagio|鐘山苑|私人露天|私人風呂|kaiseki|懷石|和牛割烹|頂級和牛|游玄亭/i

const COMFORT_STAY =
  /三井花園|mitsui garden|celestine|セレスティン|sheraton|喜來登|hilton|希爾頓|hyatt(?!\s*place)|君悅|premier|プレミア|onsen hotel|溫泉旅館/i

const BUDGET_STAY = /東橫inn|toyoko|apa hotel|スーパーホテル|business hotel|商務飯店|comfort inn/i

const BACKPACKER_STAY = /hostel|青年旅|膠囊|capsule|ドミトリー|guest house|ゲストハウス/i

const EXPERIENCE_RE =
  /體驗|手作|工房|工作坊|富士|河口湖|忍野|箱根|輕井澤|纜車|遊船|遊覽船|溫泉|風呂|泡湯|露台|日出|e-?bike|騎行|營火|自然|公園|滑雪|登山|ハイキング|glamping|野奢|雲端|赤富士|逆富士|農場|酒莊|茶道|着物|浴衣/i

const FOODIE_RE = /美食巡|美食之旅|吃貨|food crawl|ramen crawl|壽司店|立食|市場吃|夜市|米其林餐廳巡/i

const SHOPPING_RE = /購物行程|outlet|奧特萊斯|免稅店|百貨|三越|松屋|GINZA SIX|銀座三越|採購/i

const PHOTO_RE = /網美|instagram|拍照點|夜景展望|展望台打卡/i

const CULTURE_DEEP_RE = /博物館|美術館|古城|二条城|金閣|銀閣|奈良公園|清水寺|和服體驗全日|歷史街區深度/i

const RELAX_RE = /海灘度假|beach resort|spa 全日|慢活|發呆|躺|渡假村放空/i

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

function activityText(activity: DayActivity) {
  return [activity.activity, activity.location, activity.notes, ...(activity.tips ?? [])].join(' ')
}

function isSkippable(activity: DayActivity) {
  return SKIP_ACTIVITY.test(activity.activity) || SKIP_ACTIVITY.test(activity.location)
}

function yenAmounts(text: string) {
  const amounts: number[] = []
  const re = /(?:JPY|¥|￥)\s*([\d,]+)|([\d,]+)\s*(?:yen|円)/gi
  for (const match of text.matchAll(re)) {
    const n = Number((match[1] || match[2] || '').replace(/,/g, ''))
    if (Number.isFinite(n) && n > 0) amounts.push(n)
  }
  return amounts
}

function blobFor(itinerary: Pick<Itinerary, 'destination' | 'days' | 'notes'>) {
  const days = itinerary.days ?? []
  const parts = [itinerary.destination, itinerary.notes ?? '']
  for (const day of days) {
    parts.push(day.notes ?? '', day.estimatedCost ?? '')
    for (const activity of day.activities) {
      parts.push(activityText(activity), activity.cost ?? '')
    }
  }
  return parts.join('\n')
}

function meaningfulActivities(itinerary: Pick<Itinerary, 'days'>) {
  return (itinerary.days ?? []).flatMap((day) => day.activities.filter((activity) => !isSkippable(activity)))
}

export function inferBudgetFromItinerary(
  itinerary: Pick<Itinerary, 'destination' | 'days' | 'notes' | 'currency'>
): TripBudgetTag | undefined {
  const blob = blobFor(itinerary)
  const scores: Record<TripBudgetTag, number> = {
    luxury: 0,
    comfort: 0,
    budget: 0,
    backpacker: 0,
  }

  if (LUXURY_STAY.test(blob)) scores.luxury += 6
  if (COMFORT_STAY.test(blob)) scores.comfort += 3
  if (BUDGET_STAY.test(blob)) scores.budget += 3
  if (BACKPACKER_STAY.test(blob)) scores.backpacker += 5

  const meals = (itinerary.days ?? []).flatMap((day) => [
    ...day.activities.map((activity) => activity.cost ?? ''),
    ...day.restaurants.map((item) => item.cost ?? ''),
  ])
  const mealYen = meals.flatMap(yenAmounts)
  const maxMeal = mealYen.length > 0 ? Math.max(...mealYen) : 0
  if (maxMeal >= 12000) scores.luxury += 3
  else if (maxMeal >= 6000) scores.comfort += 2
  else if (maxMeal >= 2500) scores.budget += 1

  const ranked = (Object.entries(scores) as Array<[TripBudgetTag, number]>)
    .filter(([, score]) => score > 0)
    .sort((a, b) => b[1] - a[1])
  if (ranked.length === 0) return undefined
  return ranked[0][0]
}

export function inferVibeFromItinerary(
  itinerary: Pick<Itinerary, 'destination' | 'tripFocus' | 'days' | 'notes'>
): TripVibeTag | undefined {
  const activities = meaningfulActivities(itinerary)
  const dest = itinerary.destination ?? ''
  const scores: Record<TripVibeTag, number> = {
    experience: 0,
    foodie: 0,
    shopping: 0,
    photo_spot: 0,
    culture: 0,
    relax: 0,
  }

  if (/河口湖|富士|箱根|輕井澤|沖繩|墾丁|花蓮/.test(dest)) scores.experience += 4
  if (LUXURY_STAY.test(blobFor(itinerary))) scores.experience += 2

  const total = Math.max(activities.length, 1)
  let shoppingStops = 0
  let foodStops = 0
  for (const activity of activities) {
    const text = activityText(activity)
    const type = activity.type
    const isShop = type === 'shopping' || SHOPPING_RE.test(text)
    const isFood = type === 'restaurant' || FOODIE_RE.test(text)
    if (isShop) {
      shoppingStops += 1
      scores.shopping += 2
    }
    if (isFood) {
      foodStops += 1
      scores.foodie += 2
    }
    if (CULTURE_DEEP_RE.test(text)) scores.culture += 2
    if (type === 'nature' || EXPERIENCE_RE.test(text)) scores.experience += 2
    if (PHOTO_RE.test(text)) scores.photo_spot += 2
    if (RELAX_RE.test(text)) scores.relax += 2
  }

  // Meals and a Ginza afternoon do not define the trip unless they dominate it.
  if (foodStops / total < 0.35 && !FOODIE_RE.test(dest)) scores.foodie = 0
  if (shoppingStops / total < 0.35) scores.shopping = 0
  if (scores.culture > 0 && scores.culture <= scores.experience) scores.culture = 0

  const ranked = (Object.entries(scores) as Array<[TripVibeTag, number]>)
    .filter(([, score]) => score > 0)
    .sort((a, b) => b[1] - a[1])

  if (ranked.length === 0) {
    if ((itinerary.tripFocus ?? []).includes('family')) return 'experience'
    return dest ? 'experience' : undefined
  }

  const [winner, winScore] = ranked[0]
  const second = ranked[1]?.[1] ?? 0
  if (winScore >= 4 && winScore >= second + 2) return winner
  if (scores.experience >= 3) return 'experience'
  return winner === 'shopping' && winScore < 8 ? 'experience' : winner
}

export function inferCompanion(focus: TripFocus[]): TripCompanionTag | undefined {
  if (focus.includes('family')) return 'family'
  return undefined
}

export function inferStructuredTags(
  itinerary: Pick<Itinerary, 'destination' | 'tripFocus' | 'days' | 'notes' | 'currency'>,
  locale: Locale
): StructuredTags {
  return {
    themeHeadline: defaultThemeHeadline(itinerary.destination, locale),
    budget: inferBudgetFromItinerary(itinerary),
    vibe: inferVibeFromItinerary(itinerary),
    companion: inferCompanion(itinerary.tripFocus ?? []),
  }
}

export function resolveStructuredTags(
  itinerary: Pick<Itinerary, 'destination' | 'tripFocus' | 'structuredTags' | 'days' | 'notes' | 'currency'>,
  locale: Locale
): {
  themeHeadline: string
  budget?: TripBudgetTag
  vibes: TripVibeTag[]
  companion?: TripCompanionTag
} {
  const inferred = inferStructuredTags(itinerary, locale)
  const stored = itinerary.structuredTags
  const vibe = inferred.vibe || stored?.vibe
  return {
    themeHeadline:
      stored?.themeHeadline?.trim() || inferred.themeHeadline || defaultThemeHeadline(itinerary.destination, locale),
    budget: inferred.budget || stored?.budget,
    vibes: vibe ? [vibe] : [],
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
    budget: inferred.budget || incoming?.budget || previous?.budget,
    vibe: inferred.vibe || incoming?.vibe || previous?.vibe,
    companion: incoming?.companion || previous?.companion || inferred.companion,
  }
}

export function tagSearchHaystack(tags: {
  themeHeadline?: string
  budget?: TripBudgetTag
  vibes?: TripVibeTag[]
  companion?: TripCompanionTag
}) {
  const bits = [tags.themeHeadline ?? '', tags.budget ?? '', tags.companion ?? '', ...(tags.vibes ?? [])]
  if (tags.budget === 'luxury') bits.push('奢華享受', 'luxury')
  if (tags.budget === 'comfort') bits.push('輕奢舒適', 'comfort')
  if (tags.budget === 'budget') bits.push('經濟小資', 'budget')
  if (tags.budget === 'backpacker') bits.push('背包窮遊', 'backpacker')
  if (tags.vibes?.includes('experience')) bits.push('體驗探索', '體驗類', 'experience')
  if (tags.vibes?.includes('foodie')) bits.push('饕客吃貨', '美食', 'foodie')
  if (tags.vibes?.includes('shopping')) bits.push('購物狂人', 'shopping')
  if (tags.vibes?.includes('photo_spot')) bits.push('網美打卡', 'photo')
  if (tags.vibes?.includes('culture')) bits.push('深度文化', 'culture')
  if (tags.vibes?.includes('relax')) bits.push('慢活步調', 'relax')
  if (tags.companion === 'family') bits.push('親子同遊', 'family')
  if (tags.companion === 'couples') bits.push('情侶約會', 'couples')
  if (tags.companion === 'solo') bits.push('獨旅自由', 'solo')
  if (tags.companion === 'friends') bits.push('閨蜜同遊', 'friends')
  return bits.join(' ')
}
