'use client'

import { useEffect, useId, useState } from 'react'
import { useLocale } from '@/components/i18n/locale-provider'
import { PlaceThumb } from '@/components/itinerary/place-thumb'
import { MapPin } from 'lucide-react'
import { PlaceHint } from '@/components/itinerary/place-hint'
import { StayBookLink } from '@/components/plan/booking-links'
import { IconBadge } from '@/components/ui/icon-badge'
import { TicketMark } from '@/components/ui/ticket-mark'
import { useTripView } from '@/components/itinerary/trip-view-provider'
import { displayCost } from '@/lib/trips/currency'
import { mapsSearchUrl } from '@/lib/trips/transit'
import type { TimelineItem } from '@/lib/trips/timeline'
import type { MessageKey } from '@/lib/i18n/dictionaries'
import type { Trip } from '@/types'

const TIME_KEYS: Record<TimelineItem['time'], MessageKey> = {
  morning: 'timeMorning',
  afternoon: 'timeAfternoon',
  evening: 'timeEvening',
}

interface ActivityCardProps {
  item: TimelineItem
  destination: string
  currency?: string
  trip?: Trip
}

export function ActivityCard({ item, destination, currency, trip }: ActivityCardProps) {
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
  const meta = [cost, activity.duration].filter(Boolean).join(' · ')

  const actions = (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <PlaceHint
        title={item.title}
        location={item.location}
        destination={destination}
        tips={activity.tips}
        notes={activity.notes}
        address={activity.address}
      />
      <IconBadge icon={MapPin} href={mapsSearchUrl(query)}>
        {t('openMaps')}
      </IconBadge>
      {item.kind === 'stay' && (
        <StayBookLink
          destination={activity.location || destination}
          checkIn={trip?.checkIn}
          checkOut={trip?.checkOut}
          tripId={trip?.id}
        />
      )}
    </div>
  )

  const details = hasDetails && (
    <div id={panelId} hidden={!open} className="space-y-2 text-sm text-slate-600">
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
      <article className="rounded-xl border border-orange-100/80 bg-white/90 p-4 shadow-sm transition-all hover:shadow-md">
        <TicketMark>{t(TIME_KEYS[item.time])}</TicketMark>
        <h4 className="mt-1 text-base font-extrabold text-slate-800">{item.title}</h4>
        <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">{item.location}</p>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-wide text-slate-500">{meta || '—'}</p>
          {actions}
        </div>
        {hasDetails && (
          <button
            type="button"
            className="mt-2 min-h-9 text-xs font-semibold text-[#E07A5F]"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? t('hideDetails') : t('showDetails')}
          </button>
        )}
        {open ? <div className="mt-2">{details}</div> : null}
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
            <TicketMark className="bg-[#F6E6C8] text-[#C4A574]">{t(TIME_KEYS[item.time])}</TicketMark>
            <h4 className="mt-1 font-serif text-xl leading-snug text-[#3F3428]">{item.title}</h4>
            <p className="flex items-center gap-1 text-xs text-[#7A6A58]">{item.location}</p>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-wide text-[#7A6A58]">{meta}</p>
              {actions}
            </div>
          </div>
        </div>
        {hasDetails && <div className="mt-3 border-t border-dashed border-[#E8DFD1] pt-3">{details}</div>}
      </article>
    )
  }

  return (
    <article className="rounded-xl border border-orange-100/80 bg-white/90 p-4 shadow-sm transition-all hover:shadow-md">
      <div className="flex gap-4">
        <PlaceThumb
          title={item.title}
          photo={activity.photo}
          type={activity.type}
          kind={item.kind}
          className="h-16 w-16 shrink-0 rounded-xl"
        />
        <div className="min-w-0 flex-1">
          <TicketMark>{t(TIME_KEYS[item.time])}</TicketMark>
          <h4 className="mt-1 text-base font-extrabold text-slate-800">{item.title}</h4>
          <p className="flex items-center gap-1 text-xs text-slate-500">{item.location}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-wide text-slate-500">{meta || '—'}</p>
        {actions}
      </div>
      {hasDetails && (
        <div className="mt-3">
          <button
            type="button"
            className="min-h-9 text-xs font-semibold text-[#E07A5F]"
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
