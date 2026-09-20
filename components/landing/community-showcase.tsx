'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useLocale } from '@/components/i18n/locale-provider'
import { ShowcaseCard } from '@/components/landing/showcase-card'
import type { Trip } from '@/types'

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

  const tabs: Array<{ id: Region; label: string }> = [
    { id: 'all', label: t('regionAll') },
    { id: 'japan', label: t('regionJapan') },
    { id: 'europe', label: t('regionEurope') },
    { id: 'asia', label: t('regionAsia') },
  ]

  return (
    <section className="bg-[#FAF6F0] py-20">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-3xl font-extrabold text-[#2B2D42] md:text-5xl">{t('popularTitle')}</h2>
            <p className="mt-2 max-w-xl text-[#2B2D42]/70">{t('popularBody')}</p>
          </div>
          <Link href="/community" className="font-semibold text-[#E07A5F]">
            {t('teaserSeeAll')}
          </Link>
        </div>

        <div className="mb-8 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label={t('regionFilter')}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={region === tab.id}
              onClick={() => setRegion(tab.id)}
              className={`min-h-11 shrink-0 rounded-full border px-4 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] transition-all ${
                region === tab.id
                  ? 'border-[#2B2D42] bg-[#2B2D42] text-white shadow-md'
                  : 'border-orange-100/80 bg-white/90 text-[#2B2D42] shadow-sm hover:scale-[1.03] hover:shadow-md'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-[28px] border border-orange-100/80 bg-white/90 p-8 text-center shadow-sm">
            <p className="text-[#2B2D42]/70">{t('popularEmpty')}</p>
            <a
              href="#hero-prompt"
              className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-[#E07A5F] px-5 font-semibold text-white"
            >
              {t('startPlanning')}
            </a>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.slice(0, 6).map((trip) => (
              <ShowcaseCard key={trip.id} trip={trip} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
