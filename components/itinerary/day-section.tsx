'use client'

import { useMemo } from 'react'
import { useLocale } from '@/components/i18n/locale-provider'
import { ActivityCard } from '@/components/itinerary/activity-card'
import { TransitConnector } from '@/components/itinerary/transit-connector'
import { TimelineNode, VerticalTimeline } from '@/components/itinerary/vertical-timeline'
import { useTripView } from '@/components/itinerary/trip-view-provider'
import { formatMoney, guessCurrency } from '@/lib/trips/currency'
import { buildTimeline } from '@/lib/trips/timeline'
import { inferTransitLeg } from '@/lib/trips/transit'
import type { DayItinerary, Trip } from '@/types'

interface DaySectionProps {
  day: DayItinerary
  destination: string
  currency?: string
  trip?: Trip
}

export function DaySection({ day, destination, currency, trip }: DaySectionProps) {
  const { t } = useLocale()
  const { viewStyle } = useTripView()
  const money = currency || guessCurrency(destination).code
  const timeline = useMemo(() => buildTimeline(day), [day])

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
          ? 'relative overflow-hidden rounded-[28px] border border-[#E8DFD1] bg-[#FAF7F2] p-3 shadow-sm sm:p-4 md:p-5'
          : 'rounded-xl border border-orange-100/80 bg-white/90 p-3 shadow-sm transition-all hover:shadow-md sm:p-4 md:p-5'
      }
    >
      {handbook && (
        <span
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-3 w-16 -translate-x-1/2 -translate-y-1 rotate-2 bg-yellow-200/80"
        />
      )}
      <header className="mb-6">
        <h3 className={`text-xl font-extrabold ${handbook ? 'font-serif text-[#3F3428]' : 'text-slate-800'}`}>
          {t('planDay', { day: day.day })}
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          {day.date ? `${day.date} · ` : ''}
          {t(timeline.length === 1 ? 'daySummaryOne' : 'daySummary', {
            stops: timeline.length,
            cost: formatMoney(numericCost, money, destination),
          })}
        </p>
        {day.weather && (
          <p className="mt-1 text-sm text-slate-500">
            {t('dayWeather', {
              temp: day.weather.temperature,
              description: day.weather.description,
            })}
          </p>
        )}
        {day.notes && (
          <p className="mt-3 rounded-2xl bg-white/70 px-3 py-2 text-sm text-slate-600">{day.notes}</p>
        )}
        {day.restaurants.length > 0 && (
          <p className="mt-3 text-sm text-slate-500">
            {t('planEatSuggest')}: {day.restaurants.map((restaurant) => restaurant.name).join(' · ')}
          </p>
        )}
      </header>

      <VerticalTimeline>
        {timeline.length === 0 && <p className="text-sm text-slate-500">{t('filterEmpty')}</p>}
        {timeline.map((item, index) => {
          const next = timeline[index + 1]
          const fromEnd = item.endLocation || item.location
          const toStart = next?.startLocation || next?.location || ''
          const leg = next ? inferTransitLeg(fromEnd, toStart, next.activity, day.transport) : null
          return (
            <div key={item.id} className="space-y-4">
              <TimelineNode kind={item.kind}>
                <ActivityCard item={item} destination={destination} currency={money} trip={trip} />
              </TimelineNode>
              {next && leg && (
                <TimelineNode kind="transit">
                  <TransitConnector fromQuery={fromEnd} toQuery={toStart} destination={destination} leg={leg} />
                </TimelineNode>
              )}
            </div>
          )
        })}
      </VerticalTimeline>
    </section>
  )
}
