'use client'

import { useMemo } from 'react'
import { useLocale } from '@/components/i18n/locale-provider'
import { ActivityCard } from '@/components/itinerary/activity-card'
import { TransitConnector } from '@/components/itinerary/transit-connector'
import { useTripView } from '@/components/itinerary/trip-view-provider'
import { formatMoney, guessCurrency } from '@/lib/trips/currency'
import { buildTimeline, filterTimeline } from '@/lib/trips/timeline'
import { inferTransitLeg } from '@/lib/trips/transit'
import type { DayItinerary } from '@/types'

interface DaySectionProps {
  day: DayItinerary
  destination: string
  currency?: string
}

export function DaySection({ day, destination, currency }: DaySectionProps) {
  const { t } = useLocale()
  const { viewStyle, filter, collapsedDays, toggleDay } = useTripView()
  const collapsed = Boolean(collapsedDays[day.day])
  const money = currency || guessCurrency(destination).code
  const timeline = useMemo(() => filterTimeline(buildTimeline(day), filter), [day, filter])

  const numericCost = day.activities.reduce((sum, act) => {
    const value = act.cost ? Number(act.cost.replace(/[^0-9.]/g, '')) : 0
    return sum + (Number.isFinite(value) ? value : 0)
  }, 0)

  const handbook = viewStyle === 'handbook'

  return (
    <section
      id={`day-${day.day}`}
      className={
        handbook
          ? 'relative overflow-hidden rounded-[28px] border border-[#E8DFD1] bg-[#FAF7F2] p-4 shadow-sm md:p-5'
          : 'rounded-3xl bg-white p-4 shadow-sm md:p-5'
      }
    >
      {handbook && (
        <span
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-3 w-16 -translate-x-1/2 -translate-y-1 rotate-2 bg-yellow-200/80"
        />
      )}
      <header>
        <button
          type="button"
          onClick={() => toggleDay(day.day)}
          aria-expanded={!collapsed}
          className="flex min-h-11 w-full items-start justify-between gap-3 text-left"
        >
          <div>
            <h3 className={`text-xl font-bold ${handbook ? 'font-serif text-[#3F3428]' : ''}`}>
              {t('planDay', { day: day.day })}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {day.date ? `${day.date} · ` : ''}
              {t(timeline.length === 1 ? 'daySummaryOne' : 'daySummary', {
                stops: timeline.length,
                cost: formatMoney(numericCost, money, destination),
              })}
              {day.weather ? ` · ${day.weather.temperature}°C ${day.weather.description}` : ''}
            </p>
          </div>
          <span className="mt-1 text-lg text-gray-400" aria-hidden>
            {collapsed ? '+' : '–'}
          </span>
        </button>
        {day.notes && !collapsed && (
          <p className="mt-3 rounded-2xl bg-white/70 px-3 py-2 text-sm text-gray-600">{day.notes}</p>
        )}
      </header>

      {!collapsed && (
        <div className="relative mt-4 space-y-2">
          {timeline.length === 0 && (
            <p className="text-sm text-gray-500">{t('filterEmpty')}</p>
          )}
          {timeline.map((item, index) => {
            const next = timeline[index + 1]
            const fromQuery = `${item.location} ${destination}`
            const toQuery = next ? `${next.location} ${destination}` : ''
            const leg = next
              ? inferTransitLeg(item.activity, next.activity, day.transport, index)
              : null
            return (
              <div key={item.id}>
                <ActivityCard item={item} destination={destination} currency={money} />
                {next && leg && (
                  <TransitConnector fromQuery={fromQuery} toQuery={toQuery} leg={leg} />
                )}
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
