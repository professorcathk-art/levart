'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { PawMark } from '@/components/ui/paw-mark'
import { useLocale } from '@/components/i18n/locale-provider'
import { DestinationCover } from '@/components/community/destination-cover'
import { BoardingPass } from '@/components/landing/boarding-pass'
import { saveHeroPrompt } from '@/lib/landing/hero-prompt'
import type { MessageKey } from '@/lib/i18n/dictionaries'
import type { TripFocus } from '@/types'

export interface PreviewTrip {
  destination: string
  destinationZh: string
  days: number
  focus: TripFocus[]
  rating: number
  author: string
  region: 'japan' | 'europe' | 'asia'
  prompt: MessageKey
}

export const COMMUNITY_PREVIEWS: PreviewTrip[] = [
  {
    destination: 'Tokyo',
    destinationZh: '東京',
    days: 5,
    focus: ['food', 'culture'],
    rating: 4.8,
    author: 'Mika',
    region: 'japan',
    prompt: 'heroChipTokyo',
  },
  {
    destination: 'Paris',
    destinationZh: '巴黎',
    days: 7,
    focus: ['culture', 'food'],
    rating: 4.9,
    author: 'Léa',
    region: 'europe',
    prompt: 'heroChipParis',
  },
  {
    destination: 'Taipei',
    destinationZh: '台北',
    days: 3,
    focus: ['food', 'nightlife'],
    rating: 4.7,
    author: 'Chen',
    region: 'asia',
    prompt: 'heroChipTaipei',
  },
]

export function PreviewTripCard({ preview }: { preview: PreviewTrip }) {
  const { t, locale } = useLocale()
  const router = useRouter()
  const [boarding, setBoarding] = useState(false)
  const city = locale === 'zh-Hant' ? preview.destinationZh : preview.destination

  const remix = () => {
    saveHeroPrompt(t(preview.prompt))
    setBoarding(true)
    window.setTimeout(() => router.push('/plan'), 900)
  }

  return (
    <>
      <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/80 bg-white shadow-[0_12px_40px_rgba(43,45,66,0.06)] transition hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(224,122,95,0.16)]">
        <div className="relative">
          <DestinationCover destination={preview.destination} className="h-44" />
          <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/50 bg-white/70 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#E07A5F] shadow-sm backdrop-blur-md">
            <PawMark size={12} />
            {t('pawsomeVerified')}
          </span>
          <span className="absolute bottom-3 right-3 rounded-full bg-[#2B2D42]/80 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-white">
            {t('planDays', { count: preview.days })}
          </span>
        </div>
        <div className="flex flex-1 flex-col p-5">
          <h3 className="text-xl font-extrabold tracking-tight text-[#2B2D42]">{city}</h3>
          <p className="mt-1 text-sm leading-relaxed text-[#2B2D42]/60">{t('byAuthor', { name: preview.author })}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-[#2B2D42]/70">
            <span className="font-mono text-xs font-semibold">★ {preview.rating.toFixed(1)}</span>
            {preview.focus.map((focus) => (
              <span
                key={focus}
                className="rounded-full bg-[#FFF1E6] px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[#E07A5F]"
              >
                {focus}
              </span>
            ))}
          </div>
          <div className="mt-auto flex gap-2 pt-4">
            <Link
              href="#hero-prompt"
              className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full bg-[#2B2D42] px-3 text-sm font-semibold text-white"
            >
              {t('startPlanning')}
            </Link>
            <button
              type="button"
              onClick={remix}
              className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full bg-[#FFF1E6] px-3 text-sm font-semibold text-[#E07A5F]"
            >
              {t('remixWithAi')}
            </button>
          </div>
        </div>
      </article>
      <BoardingPass open={boarding} city={city} />
    </>
  )
}
