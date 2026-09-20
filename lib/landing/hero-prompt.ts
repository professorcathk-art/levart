export const HERO_PROMPT_KEY = 'levart-hero-prompt'

export function saveHeroPrompt(prompt: string) {
  if (typeof window === 'undefined') return
  const text = prompt.trim()
  if (!text) return
  window.sessionStorage.setItem(HERO_PROMPT_KEY, text)
}

export function consumeHeroPrompt() {
  if (typeof window === 'undefined') return null
  const text = window.sessionStorage.getItem(HERO_PROMPT_KEY)?.trim() || null
  if (text) window.sessionStorage.removeItem(HERO_PROMPT_KEY)
  return text
}

export function guessBoardingCity(prompt: string) {
  const cleaned = prompt.replace(/\s+/g, ' ').trim()
  const first = cleaned.split(/[,.!?，。]/)[0]?.trim() ?? cleaned
  return first.slice(0, 42) || 'Your trip'
}
