'use client'

import { useEffect, useMemo, useState } from 'react'
import { Compass, Globe2, MapPin, Search } from 'lucide-react'
import { useLocale } from '@/components/i18n/locale-provider'
import { TripCard } from '@/components/community/trip-card'
import {
  searchCommunityTrips,
  suggestCommunityQueries,
  type CommunityRegion,
  type CommunitySort,
  type DurationBucket,
} from '@/lib/trips/community-search'
import type { Trip, TripFocus } from '@/types'
import type { LucideIcon } from 'lucide-react'
import type { MessageKey } from '@/lib/i18n/dictionaries'

const FOCUS_KEYS: Array<{ id: TripFocus | 'all'; label: MessageKey }> = [
  { id: 'all', label: 'filterAll' },
  { id: 'food', label: 'focusFood' },
  { id: 'culture', label: 'focusCulture' },
  { id: 'shopping', label: 'focusShopping' },
  { id: 'beach', label: 'focusBeach' },
  { id: 'nightlife', label: 'focusNightlife' },
  { id: 'family', label: 'focusFamily' },
  { id: 'climbing', label: 'focusClimbing' },
]

interface CommunityExplorerProps {
  trips: Trip[]
  initialQuery?: string
  initialSort?: CommunitySort
}

export function CommunityExplorer({ trips, initialQuery = '', initialSort = 'recent' }: CommunityExplorerProps) {
  const { t } = useLocale()
  const [query, setQuery] = useState(initialQuery)
  const [sort, setSort] = useState<CommunitySort>(initialQuery && initialSort === 'recent' ? 'relevance' : initialSort)
  const [region, setRegion] = useState<CommunityRegion>('all')
  const [duration, setDuration] = useState<DurationBucket>('all')
  const [focus, setFocus] = useState<TripFocus | 'all'>('all')
  const [openSuggestions, setOpenSuggestions] = useState(false)

  const results = useMemo(
    () => searchCommunityTrips(trips, { query, region, duration, focus, sort }),
    [trips, query, region, duration, focus, sort]
  )
  const suggestions = useMemo(() => suggestCommunityQueries(trips, query), [trips, query])

  useEffect(() => {
    const params = new URLSearchParams()
    if (query.trim()) params.set('q', query.trim())
    if (sort && sort !== 'recent') params.set('sort', sort)
    const href = params.toString() ? `/community?${params.toString()}` : '/community'
    if (`${window.location.pathname}${window.location.search}` === href) return
    window.history.replaceState(null, '', href)
  }, [query, sort])

  const regions: Array<{ id: CommunityRegion; label: string; icon: LucideIcon; flag?: string }> = [
    { id: 'all', label: t('regionAll'), icon: Globe2 },
    { id: 'japan', label: t('regionJapan'), icon: MapPin, flag: '🇯🇵' },
    { id: 'europe', label: t('regionEurope'), icon: Compass, flag: '🇪🇺' },
    { id: 'asia', label: t('regionAsia'), icon: MapPin, flag: '🌏' },
  ]

  const durations: Array<{ id: DurationBucket; label: MessageKey }> = [
    { id: 'all', label: 'durationAny' },
    { id: 'short', label: 'durationShort' },
    { id: 'week', label: 'durationWeek' },
    { id: 'long', label: 'durationLong' },
  ]

  return (
    <div>
      <form
        className="mt-6 space-y-3"
        action="/community"
        onSubmit={(event) => {
          event.preventDefault()
          setOpenSuggestions(false)
        }}
      >
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
          <input
            type="search"
            name="q"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              if (event.target.value.trim()) setSort('relevance')
              setOpenSuggestions(true)
            }}
            onFocus={() => setOpenSuggestions(true)}
            onBlur={() => window.setTimeout(() => setOpenSuggestions(false), 150)}
            placeholder={t('searchPlaceholder')}
            autoComplete="off"
            className="min-h-12 w-full rounded-full border border-orange-100/80 bg-white py-3 pl-11 pr-4 outline-none focus:border-[#E07A5F]"
          />
          {openSuggestions && suggestions.length > 0 && (
            <ul className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-orange-100/80 bg-white py-2 shadow-lg">
              <li className="px-4 pb-1 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                {t('searchSuggestions')}
              </li>
              {suggestions.map((suggestion) => (
                <li key={suggestion}>
                  <button
                    type="button"
                    className="w-full px-4 py-2 text-left text-sm text-[#2B2D42] hover:bg-[#FAF6F0]"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => {
                      setQuery(suggestion)
                      setSort('relevance')
                      setOpenSuggestions(false)
                    }}
                  >
                    {suggestion}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <p className="text-xs text-slate-500">{t('searchHint')}</p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <select
            name="sort"
            value={sort}
            onChange={(event) => setSort(event.target.value as CommunitySort)}
            className="min-h-12 rounded-full border border-orange-100/80 bg-white px-4"
          >
            <option value="relevance">{t('sortRelevance')}</option>
            <option value="recent">{t('sortRecent')}</option>
            <option value="rating">{t('sortRating')}</option>
          </select>
          <button
            type="submit"
            className="min-h-12 rounded-full bg-gradient-to-r from-[#E07A5F] to-[#FFB86C] px-6 font-semibold text-white sm:ml-auto"
          >
            {t('search')}
          </button>
        </div>
      </form>

      <div className="mt-5 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label={t('regionFilter')}>
        {regions.map((tab) => {
          const Icon = tab.icon
          const selected = region === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setRegion(tab.id)}
              className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-4 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] ${
                selected ? 'border-[#2B2D42] bg-[#2B2D42] text-white' : 'border-orange-100/80 bg-white text-[#2B2D42]'
              }`}
            >
              {tab.flag ? <span aria-hidden>{tab.flag}</span> : <Icon className="h-3.5 w-3.5" strokeWidth={2.25} />}
              {tab.label}
            </button>
          )
        })}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {durations.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setDuration(item.id)}
            className={`min-h-9 rounded-full px-3 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] ${
              duration === item.id ? 'bg-[#E07A5F] text-white' : 'bg-white text-slate-600 ring-1 ring-orange-100'
            }`}
          >
            {t(item.label)}
          </button>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {FOCUS_KEYS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setFocus(item.id)}
            className={`min-h-9 rounded-full px-3 text-xs font-semibold ${
              focus === item.id ? 'bg-[#2B2D42] text-white' : 'bg-white text-slate-600 ring-1 ring-orange-100'
            }`}
          >
            {t(item.label)}
          </button>
        ))}
      </div>

      {results.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-orange-100/80 bg-white p-10 text-center text-[#2B2D42]/70 shadow-sm">
          {trips.length === 0 ? t('communityEmpty') : t('searchNoResults')}
        </div>
      ) : (
        <>
          <p className="mt-6 text-sm text-slate-500">{t('searchResultCount', { count: results.length })}</p>
          <div className="mt-4 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {results.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
