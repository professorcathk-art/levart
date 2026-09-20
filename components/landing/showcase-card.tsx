'use client'

import Link from 'next/link'
import { useLocale } from '@/components/i18n/locale-provider'
import { DestinationCover } from '@/components/community/destination-cover'
import { saveHeroPrompt } from '@/lib/landing/hero-prompt'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { BoardingPass } from '@/components/landing/boarding-pass'
import { PawMark } from '@/components/ui/paw-mark'
import type { Trip } from '@/types'

interface ShowcaseCardProps {
  trip: Trip
}

export function ShowcaseCard({ trip }: ShowcaseCardProps) {
  const { t } = useLocale()
  const router = useRouter()
  const [boarding, setBoarding] = useState(false)
  const href = trip.slug ? `/p/${trip.slug}` : `/trips/${trip.id}`
  const days = trip.itinerary.days.length
  const pawsome = (trip.avgRating ?? 0) >= 4.5 && (trip.ratingCount ?? 0) > 0

  const remix = () => {
    saveHeroPrompt(
      t('remixPrompt', {
        destination: trip.destination,
        days,
      })
    )
    setBoarding(true)
    window.setTimeout(() => router.push('/plan'), 900)
  }

  return (
    <>
      <article className="group relative overflow-hidden rounded-3xl border border-white/80 bg-white shadow-[0_12px_40px_rgba(43,45,66,0.06)] transition hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(224,122,95,0.16)]">
        <div className="relative">
          <DestinationCover destination={trip.destination} coverPhoto={trip.coverPhoto} className="h-44" />
          {pawsome && (
            <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/50 bg-white/70 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#E07A5F] shadow-sm backdrop-blur-md">
              <PawMark size={12} />
              {t('pawsomePick')}
            </span>
          )}
          <span className="absolute bottom-3 right-3 rounded-full bg-[#2B2D42]/80 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-white">
            {t('planDays', { count: days })}
          </span>
        </div>
        <div className="p-5">
          <h3 className="text-xl font-bold text-[#2B2D42]">{trip.destination}</h3>
          {trip.owner && (
            <p className="mt-1 text-sm text-[#2B2D42]/60">{t('byAuthor', { name: trip.owner.displayName })}</p>
          )}
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-[#2B2D42]/70">
            {(trip.ratingCount ?? 0) > 0 && (
              <span>
                ★ {(trip.avgRating ?? 0).toFixed(1)}
              </span>
            )}
            {(trip.tripFocus ?? []).slice(0, 3).map((focus) => (
              <span key={focus} className="rounded-full bg-[#FFF1E6] px-2 py-0.5 text-xs capitalize">
                {focus}
              </span>
            ))}
          </div>
          <div className="mt-4 flex gap-2 opacity-100 md:opacity-0 md:transition md:group-hover:opacity-100">
            <Link
              href={href}
              className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full bg-[#2B2D42] px-3 text-sm font-semibold text-white"
            >
              {t('viewPlan')}
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
      <BoardingPass open={boarding} city={trip.destination} />
    </>
  )
}
