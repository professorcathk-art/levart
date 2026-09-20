'use client'

import { useEffect, useId, useState } from 'react'
import { useLocale } from '@/components/i18n/locale-provider'
import { PlaceThumb } from '@/components/itinerary/place-thumb'
import { useTripView } from '@/components/itinerary/trip-view-provider'
import { displayCost } from '@/lib/trips/currency'
import { mapsRideUrl, mapsSearchUrl } from '@/lib/trips/transit'
import type { TimelineItem } from '@/lib/trips/timeline'
import type { MessageKey } from '@/lib/i18n/dictionaries'

const TIME_KEYS: Record<TimelineItem['time'], MessageKey> = {
  morning: 'timeMorning',
  afternoon: 'timeAfternoon',
  evening: 'timeEvening',
}

interface ActivityCardProps {
  item: TimelineItem
  destination: string
  currency?: string
}

export function ActivityCard({ item, destination, currency }: ActivityCardProps) {
  const { t } = useLocale()
  const { viewStyle } = useTripView()
  const [open, setOpen] = useState(viewStyle !== 'concise')
  const panelId = useId()

  useEffect(() => {
    setOpen(viewStyle !== 'concise')
  }, [viewStyle])
  const activity = item.activity
  const query = `${activity.location || activity.activity} ${destination}`
  const hasDetails = Boolean(
    activity.tips?.length ||
      activity.notes ||
      activity.openingHours ||
      activity.address ||
      activity.nearbyAlternatives?.length
  )
  const cost = displayCost(activity.cost, currency, destination)

  const actions = (
    <div className="flex flex-wrap gap-2">
      <a
        href={mapsSearchUrl(query)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#FF9A76] px-3 text-xs font-semibold text-white"
      >
        {t('openMaps')}
      </a>
      <a
        href={mapsRideUrl(query)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-11 items-center justify-center rounded-full bg-white px-3 text-xs font-semibold text-[#1A1A1A] ring-1 ring-black/10"
      >
        {t('getRide')}
      </a>
    </div>
  )

  const details = hasDetails && (
    <div id={panelId} hidden={!open} className="space-y-2 text-sm text-gray-600">
      {activity.address && <p>📍 {activity.address}</p>}
      {activity.openingHours && <p>🕐 {activity.openingHours}</p>}
      {activity.notes && <p>{activity.notes}</p>}
      {activity.tips && activity.tips.length > 0 && (
        <ul className="list-disc space-y-1 pl-4">
          {activity.tips.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
      )}
      {activity.nearbyAlternatives && activity.nearbyAlternatives.length > 0 && (
        <p>
          {t('nearbyAlternatives')}: {activity.nearbyAlternatives.join(' · ')}
        </p>
      )}
    </div>
  )

  if (viewStyle === 'concise') {
    return (
      <article className="rounded-r-xl border-l-4 border-[#FF9A76] bg-white/90 px-3 py-2.5 shadow-sm">
        <div className="flex items-start gap-3">
          <p className="w-16 shrink-0 text-xs font-bold uppercase tracking-wide text-[#7ECCC4]">
            {t(TIME_KEYS[item.time])}
          </p>
          <div className="min-w-0 flex-1">
            <h4 className="font-semibold leading-snug">{item.title}</h4>
            <p className="truncate text-sm text-gray-500">{item.location}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {cost && <span className="text-xs font-semibold text-[#FF9A76]">{cost}</span>}
              {activity.duration && <span className="text-xs text-gray-500">{activity.duration}</span>}
              {actions}
            </div>
            {hasDetails && (
              <button
                type="button"
                className="mt-1 min-h-11 text-xs font-semibold text-[#FF9A76]"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpen((value) => !value)}
              >
                {open ? t('hideDetails') : t('showDetails')}
              </button>
            )}
            {open ? details : null}
          </div>
        </div>
      </article>
    )
  }

  if (viewStyle === 'handbook') {
    return (
      <article className="relative rounded-[28px] border border-[#E8DFD1] bg-[#FFFDF9] p-4 shadow-[2px_4px_0_rgba(90,70,40,0.08)]">
        <div className="flex gap-4">
          <figure className="w-24 shrink-0 bg-white p-1.5 pb-5 shadow-md">
            <PlaceThumb
              title={item.title}
              photo={activity.photo}
              type={activity.type}
              kind={item.kind}
              className="h-20 w-full"
            />
          </figure>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#C4A574]">
              {t(TIME_KEYS[item.time])}
            </p>
            <h4 className="mt-1 font-serif text-xl leading-snug text-[#3F3428]">{item.title}</h4>
            <p className="text-sm text-[#7A6A58]">{item.location}</p>
            <div className="mt-2 flex flex-wrap gap-2 text-xs text-[#7A6A58]">
              {cost && <span className="rounded-full bg-[#F6E6C8] px-2 py-1">{cost}</span>}
              {activity.duration && (
                <span className="rounded-full bg-[#E8F3F1] px-2 py-1">{activity.duration}</span>
              )}
            </div>
            <div className="mt-3">{actions}</div>
          </div>
        </div>
        {hasDetails && (
          <div className="mt-3 border-t border-dashed border-[#E8DFD1] pt-3">
            {details}
          </div>
        )}
      </article>
    )
  }

  return (
    <article className="rounded-2xl border border-slate-100 bg-white p-3 shadow-sm transition hover:shadow-md">
      <div className="flex gap-3">
        <PlaceThumb
          title={item.title}
          photo={activity.photo}
          type={activity.type}
          kind={item.kind}
          className="h-16 w-16 shrink-0 rounded-2xl"
        />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#7ECCC4]">
            {t(TIME_KEYS[item.time])}
          </p>
          <h4 className="font-semibold leading-snug">{item.title}</h4>
          <p className="text-sm text-gray-500">{item.location}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {cost && <span className="text-xs font-semibold text-[#FF9A76]">{cost}</span>}
            {activity.duration && <span className="text-xs text-gray-500">{activity.duration}</span>}
            {actions}
          </div>
        </div>
      </div>
      {hasDetails && (
        <div className="mt-3">
          <button
            type="button"
            className="min-h-11 text-xs font-semibold text-[#FF9A76]"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? t('hideDetails') : t('showDetails')}
          </button>
          {open ? <div className="mt-2">{details}</div> : null}
        </div>
      )}
    </article>
  )
}
