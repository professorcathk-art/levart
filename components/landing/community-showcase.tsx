'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Compass, Globe2, MapPin } from 'lucide-react'
import { useLocale } from '@/components/i18n/locale-provider'
import { ShowcaseCard } from '@/components/landing/showcase-card'
import { COMMUNITY_PREVIEWS, PreviewTripCard } from '@/components/landing/preview-trip-card'
import type { Trip } from '@/types'
import type { LucideIcon } from 'lucide-react'

type Region = 'all' | 'japan' | 'europe' | 'asia'

const REGION_MATCH: Record<Region, RegExp | null> = {
  all: null,
  japan: /japan|tokyo|osaka|kyoto|hokkaido|okinawa|東京|大阪|京都|北海道|沖繩/i,
  europe: /paris|rome|london|barcelona|amsterdam|berlin|lisbon|florence|venice|europe|france|italy|spain|英國|巴黎|羅馬|倫敦/i,
  asia: /taipei|taiwan|hong kong|seoul|bangkok|singapore|busan|hanoi|台北|台灣|香港|首爾|曼谷|新加坡|韓國/i,
}

export function CommunityShowcase({ trips }: { trips: Trip[] }) {
  const { t } = useLocale()
  const [region, setRegion] = useState<Region>('all')

  const filtered = useMemo(() => {
    const rule = REGION_MATCH[region]
    if (!rule) return trips
    return trips.filter((trip) => rule.test(trip.destination))
  }, [region, trips])

  const previewCards = useMemo(() => {
    if (region === 'all') return COMMUNITY_PREVIEWS
    return COMMUNITY_PREVIEWS.filter((preview) => preview.region === region)
  }, [region])

  const tabs: Array<{ id: Region; label: string; icon: LucideIcon; flag?: string }> = [
    { id: 'all', label: t('regionAll'), icon: Globe2 },
    { id: 'japan', label: t('regionJapan'), icon: MapPin, flag: '🇯🇵' },
    { id: 'europe', label: t('regionEurope'), icon: Compass, flag: '🇪🇺' },
    { id: 'asia', label: t('regionAsia'), icon: MapPin, flag: '🌏' },
  ]

  const showPreviews = trips.length === 0

  return (
    <section className="bg-[#FAF6F0] py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-10 grid gap-4 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <h2 className="text-4xl font-extrabold tracking-tight text-[#2B2D42] md:text-5xl">{t('popularTitle')}</h2>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-[#2B2D42]/70">{t('popularBody')}</p>
          </div>
          <div className="md:col-span-4 md:text-right">
            <Link href="/community" className="font-semibold text-[#E07A5F]">
              {t('teaserSeeAll')}
            </Link>
          </div>
        </div>

        <div className="mb-8 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label={t('regionFilter')}>
          {tabs.map((tab) => {
            const Icon = tab.icon
            const selected = region === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setRegion(tab.id)}
                className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-4 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] shadow-sm transition-all ${
                  selected
                    ? 'border-[#2B2D42] bg-[#2B2D42] text-white shadow-md'
                    : 'border-orange-100/80 bg-white/90 text-[#2B2D42] hover:scale-[1.03] hover:shadow-md'
                }`}
              >
                {tab.flag ? <span aria-hidden>{tab.flag}</span> : <Icon className="h-3.5 w-3.5" strokeWidth={2.25} />}
                {tab.label}
              </button>
            )
          })}
        </div>

        {showPreviews ? (
          <div>
            <p className="mb-6 text-sm leading-relaxed text-[#2B2D42]/60">{t('communityPreview')}</p>
            <div className="grid items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">
              {previewCards.map((preview) => (
                <PreviewTripCard key={preview.destination} preview={preview} />
              ))}
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-[28px] border border-orange-100/80 bg-white/90 p-8 text-center shadow-sm">
            <p className="leading-relaxed text-[#2B2D42]/70">{t('popularEmpty')}</p>
            <a
              href="#hero-prompt"
              className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-[#E07A5F] px-5 font-semibold text-white"
            >
              {t('startPlanning')}
            </a>
          </div>
        ) : (
          <div className="grid items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.slice(0, 6).map((trip) => (
              <ShowcaseCard key={trip.id} trip={trip} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
