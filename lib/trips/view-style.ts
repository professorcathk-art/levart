export type ViewStyle = 'clean' | 'handbook'
export type DayFilter = 'all' | 'attractions' | 'food' | 'stay'

export const VIEW_STYLE_KEY = 'levart-view-style'

export function isViewStyle(value: string | null | undefined): value is ViewStyle {
  return value === 'clean' || value === 'handbook'
}

export function readViewStyle(): ViewStyle {
  if (typeof window === 'undefined') return 'clean'
  const stored = window.localStorage.getItem(VIEW_STYLE_KEY)
  return isViewStyle(stored) ? stored : 'clean'
}

export function writeViewStyle(style: ViewStyle) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(VIEW_STYLE_KEY, style)
}
