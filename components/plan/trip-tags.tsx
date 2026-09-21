'use client'

import { Sparkles } from 'lucide-react'
import { useLocale } from '@/components/i18n/locale-provider'
import { resolveStructuredTags } from '@/lib/trips/structured-tags'
import type { MessageKey } from '@/lib/i18n/dictionaries'
import type { Itinerary, TripBudgetTag, TripCompanionTag, TripVibeTag } from '@/types'

const BUDGET_KEYS: Record<TripBudgetTag, MessageKey> = {
  luxury: 'tagBudgetLuxury',
  comfort: 'tagBudgetComfort',
  budget: 'tagBudgetBudget',
  backpacker: 'tagBudgetBackpacker',
}

const VIBE_KEYS: Record<TripVibeTag, MessageKey> = {
  foodie: 'tagVibeFoodie',
  shopping: 'tagVibeShopping',
  photo_spot: 'tagVibePhotoSpot',
  culture: 'tagVibeCulture',
  relax: 'tagVibeRelax',
}

const COMPANION_KEYS: Record<TripCompanionTag, MessageKey> = {
  family: 'tagCompanionFamily',
  couples: 'tagCompanionCouples',
  solo: 'tagCompanionSolo',
  friends: 'tagCompanionFriends',
}

const BUDGET_EMOJI: Record<TripBudgetTag, string> = {
  luxury: '💎',
  comfort: '⚜️',
  budget: '💰',
  backpacker: '🎒',
}

const VIBE_EMOJI: Record<TripVibeTag, string> = {
  foodie: '😋',
  shopping: '🛍️',
  photo_spot: '📷',
  culture: '🏛️',
  relax: '☕',
}

const COMPANION_EMOJI: Record<TripCompanionTag, string> = {
  family: '👨‍👩‍👧',
  couples: '👩‍❤️‍👨',
  solo: '👤',
  friends: '👯',
}

type TripTagsVariant = 'banner' | 'panel'

interface TripTagsProps {
  itinerary: Pick<Itinerary, 'destination' | 'tripFocus' | 'structuredTags'>
  variant?: TripTagsVariant
}

function attributeBadges(
  tags: { budget: TripBudgetTag; vibes: TripVibeTag[]; companion?: TripCompanionTag },
  t: (key: MessageKey) => string
) {
  const items: Array<{ key: string; emoji: string; label: string }> = []
  items.push({ key: `budget-${tags.budget}`, emoji: BUDGET_EMOJI[tags.budget], label: t(BUDGET_KEYS[tags.budget]) })
  for (const vibe of tags.vibes) {
    items.push({ key: `vibe-${vibe}`, emoji: VIBE_EMOJI[vibe], label: t(VIBE_KEYS[vibe]) })
  }
  if (tags.companion) {
    items.push({
      key: `companion-${tags.companion}`,
      emoji: COMPANION_EMOJI[tags.companion],
      label: t(COMPANION_KEYS[tags.companion]),
    })
  }
  return items
}

export function TripTags({ itinerary, variant = 'banner' }: TripTagsProps) {
  const { t, locale } = useLocale()
  const tags = resolveStructuredTags(itinerary, locale)
  const attributes = attributeBadges(tags, t)
  const themeClass =
    variant === 'banner'
      ? 'bg-orange-500/90 text-white font-bold px-3 py-1 rounded-lg text-sm shadow-sm backdrop-blur-md flex items-center gap-1'
      : 'inline-flex items-center gap-1 rounded-lg bg-[#E07A5F] px-3 py-1 text-sm font-bold text-white shadow-sm'
  const attrClass =
    variant === 'banner'
      ? 'inline-flex items-center gap-1 rounded-full border border-white/40 bg-white/30 px-2.5 py-1 text-xs font-medium text-slate-800 shadow-sm backdrop-blur-md transition-all hover:bg-white/50'
      : 'inline-flex items-center gap-1 rounded-full border border-orange-100/80 bg-[#FFF1E6] px-2.5 py-1 text-xs font-medium text-[#2B2D42]'

  return (
    <div className={variant === 'banner' ? 'mt-4 flex flex-wrap items-center gap-2' : 'mt-2 flex flex-wrap items-center gap-2'}>
      <span className={themeClass}>
        <Sparkles className="h-3.5 w-3.5" aria-hidden />
        {tags.themeHeadline}
      </span>
      {attributes.map((item) => (
        <span key={item.key} className={attrClass}>
          <span aria-hidden>{item.emoji}</span>
          {item.label}
        </span>
      ))}
    </div>
  )
}
