const BLOCKED_PHOTOS = ['photo-1506905925346-21bda4d32df4']

export function isUsablePhoto(url?: string | null) {
  if (!url) return false
  if (!/^https?:\/\//i.test(url)) return false
  return !BLOCKED_PHOTOS.some((id) => url.includes(id))
}

const TYPE_GRADIENT: Record<string, string> = {
  attraction: 'from-[#FF9A76] to-[#FFB86C]',
  restaurant: 'from-[#FFB86C] to-[#FF9A76]',
  shopping: 'from-[#F9A8D4] to-[#FF9A76]',
  nightlife: 'from-[#C9A9DD] to-[#7ECCC4]',
  nature: 'from-[#7ECCC4] to-[#86EFAC]',
  culture: 'from-[#C9A9DD] to-[#FFB86C]',
  stay: 'from-[#87CEEB] to-[#7ECCC4]',
}

export function gradientForPlace(type?: string, kind?: string) {
  if (kind === 'food') return TYPE_GRADIENT.restaurant
  if (kind === 'stay') return TYPE_GRADIENT.stay
  if (type && TYPE_GRADIENT[type]) return TYPE_GRADIENT[type]
  return 'from-[#FF9A76] to-[#7ECCC4]'
}

export function placeGlyph(type?: string, kind?: string) {
  if (kind === 'food' || type === 'restaurant') return '🍽️'
  if (kind === 'stay') return '🏨'
  if (type === 'shopping') return '🛍️'
  if (type === 'nightlife') return '🌃'
  if (type === 'nature') return '🌿'
  if (type === 'culture') return '🎭'
  return '📍'
}
