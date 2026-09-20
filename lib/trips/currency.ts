export interface CurrencyInfo {
  code: string
  symbol: string
}

const RULES: Array<{ test: RegExp; info: CurrencyInfo }> = [
  { test: /japan|tokyo|osaka|kyoto|hokkaido|okinawa|名古屋|東京|大阪|京都/i, info: { code: 'JPY', symbol: '¥' } },
  { test: /taiwan|taipei|taichung|kaohsiung|tainan|台灣|台湾|台北|台中|高雄/i, info: { code: 'TWD', symbol: 'NT$' } },
  { test: /hong kong|hongkong|\bhk\b|香港/i, info: { code: 'HKD', symbol: 'HK$' } },
  { test: /korea|seoul|busan|韓國|韩国|首爾|釜山/i, info: { code: 'KRW', symbol: '₩' } },
  { test: /china|beijing|shanghai|guangzhou|shenzhen|chengdu|hangzhou|中國|中国|北京|上海/i, info: { code: 'CNY', symbol: '¥' } },
  { test: /thailand|bangkok|phuket|chiang mai|thai|泰國|曼谷|普吉/i, info: { code: 'THB', symbol: '฿' } },
  { test: /singapore|新加坡/i, info: { code: 'SGD', symbol: 'S$' } },
  { test: /malaysia|kuala lumpur|馬來|吉隆坡/i, info: { code: 'MYR', symbol: 'RM' } },
  { test: /vietnam|hanoi|ho chi minh|越南/i, info: { code: 'VND', symbol: '₫' } },
  { test: /united kingdom|london|england|scotland|英國|倫敦/i, info: { code: 'GBP', symbol: '£' } },
  { test: /france|paris|italy|rome|germany|berlin|spain|madrid|netherlands|amsterdam|euro|法國|巴黎|義大利|羅馬/i, info: { code: 'EUR', symbol: '€' } },
  { test: /australia|sydney|melbourne|澳洲/i, info: { code: 'AUD', symbol: 'A$' } },
]

export function guessCurrency(destination?: string | null): CurrencyInfo {
  const text = destination?.trim() || ''
  for (const rule of RULES) {
    if (rule.test.test(text)) return rule.info
  }
  return { code: 'USD', symbol: 'US$' }
}

export function formatMoney(
  amount: number,
  currencyCode?: string | null,
  destination?: string | null
) {
  const code = (currencyCode || guessCurrency(destination).code).toUpperCase()
  try {
    return new Intl.NumberFormat('en', {
      style: 'currency',
      currency: code,
      maximumFractionDigits: 0,
    }).format(amount)
  } catch {
    const { symbol } = guessCurrency(destination)
    return `${symbol}${Math.round(amount)}`
  }
}

export function displayCost(
  cost: string | undefined,
  currencyCode?: string | null,
  destination?: string | null
) {
  if (!cost || !cost.trim()) return ''
  if (/[A-Za-z$€£¥₩₫฿]/.test(cost)) return cost
  const numeric = Number(cost.replace(/[^0-9.]/g, ''))
  if (Number.isFinite(numeric) && numeric > 0) {
    return formatMoney(numeric, currencyCode, destination)
  }
  return cost
}
