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
import { mapsPlaceQuery } from '@/lib/trips/place-query'
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
  const [open, setOpen] = useState(false)
  const panelId = useId()

  useEffect(() => {
    setOpen(viewStyle === 'handbook')
  }, [viewStyle])

  const activity = item.activity
  const query = mapsPlaceQuery(item.location || activity.location || activity.activity, destination)
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
    <div className="flex w-full flex-wrap items-center justify-start gap-2 sm:w-auto sm:justify-end">
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

  if (viewStyle === 'handbook') {
    return (
      <article className="relative rounded-[28px] border border-[#E8DFD1] bg-[#FFFDF9] p-3 shadow-[2px_4px_0_rgba(90,70,40,0.08)] sm:p-4">
        <div className="flex gap-3 sm:gap-4">
          <figure className="w-16 shrink-0 bg-white p-1 pb-3 shadow-md sm:w-24 sm:p-1.5 sm:pb-5">
            <PlaceThumb
              title={item.title}
              photo={activity.photo}
              type={activity.type}
              kind={item.kind}
              className="h-16 w-full sm:h-20"
            />
          </figure>
          <div className="min-w-0 flex-1">
            <TicketMark className="bg-[#F6E6C8] text-[#C4A574]">{t(TIME_KEYS[item.time])}</TicketMark>
            <h4 className="mt-1 break-words font-serif text-lg leading-snug text-[#3F3428] sm:text-xl">{item.title}</h4>
            <p className="break-words text-xs text-[#7A6A58]">{item.location}</p>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
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
    <article className="rounded-xl border border-orange-100/80 bg-white/90 p-3 shadow-sm transition-all hover:shadow-md sm:p-4">
      <div className="flex gap-3 sm:gap-4">
        <PlaceThumb
          title={item.title}
          photo={activity.photo}
          type={activity.type}
          kind={item.kind}
          className="h-14 w-14 shrink-0 rounded-xl sm:h-16 sm:w-16"
        />
        <div className="min-w-0 flex-1">
          <TicketMark>{t(TIME_KEYS[item.time])}</TicketMark>
          <h4 className="mt-1 break-words text-base font-extrabold text-slate-800">{item.title}</h4>
          <p className="break-words text-xs text-slate-500">{item.location}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
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
