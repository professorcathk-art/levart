'use client'

import { useEffect, useState } from 'react'
import { useLocale } from '@/components/i18n/locale-provider'
import { PlaceHint } from '@/components/itinerary/place-hint'
import type { DayActivity } from '@/types'
import type { MessageKey } from '@/lib/i18n/dictionaries'

const TIME_KEYS: Record<DayActivity['time'], MessageKey> = {
  morning: 'timeMorning',
  afternoon: 'timeAfternoon',
  evening: 'timeEvening',
}

const TIMES: Array<DayActivity['time']> = ['morning', 'afternoon', 'evening']

interface EditableStopProps {
  activity: DayActivity
  destination: string
  onCommit: (patch: Partial<DayActivity>) => void
}

export function EditableStop({ activity, destination, onCommit }: EditableStopProps) {
  const { t } = useLocale()
  const [title, setTitle] = useState(activity.activity)
  const [location, setLocation] = useState(activity.location)
  const [notes, setNotes] = useState(activity.notes ?? '')

  useEffect(() => {
    setTitle(activity.activity)
    setLocation(activity.location)
    setNotes(activity.notes ?? '')
  }, [activity.activity, activity.location, activity.notes])

  const commit = (patch: Partial<DayActivity>) => {
    onCommit({ ...patch, userLocked: true })
  }

  return (
    <li className="rounded-2xl border border-orange-100/80 bg-[#FFF8F3] p-3">
      <div className="flex items-start justify-between gap-2">
        <div
          role="radiogroup"
          aria-label={t('timeOfDay')}
          className="flex min-w-0 flex-1 gap-1 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {TIMES.map((time) => {
            const selected = activity.time === time
            return (
              <button
                key={time}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => commit({ time })}
                className={`min-h-9 shrink-0 rounded-full px-2.5 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] ${
                  selected ? 'bg-[#2B2D42] text-white' : 'bg-white text-slate-500'
                }`}
              >
                {t(TIME_KEYS[time])}
              </button>
            )
          })}
        </div>
        <PlaceHint
          title={title || activity.activity}
          location={location || activity.location}
          destination={destination}
          tips={activity.tips}
          notes={activity.notes}
          address={activity.address}
        />
      </div>
      <input
        value={title}
        aria-label={t('activityName')}
        onChange={(event) => setTitle(event.target.value)}
        onBlur={() => {
          if (title.trim() && title.trim() !== activity.activity) commit({ activity: title.trim() })
        }}
        className="mt-3 min-h-11 w-full rounded-xl bg-white/80 px-3 text-base font-semibold text-[#2B2D42] outline-none ring-1 ring-transparent focus:ring-[#E07A5F]/40"
      />
      <input
        value={location}
        aria-label={t('activityLocation')}
        onChange={(event) => setLocation(event.target.value)}
        onBlur={() => {
          if (location.trim() !== activity.location) commit({ location: location.trim() })
        }}
        className="mt-2 min-h-11 w-full rounded-xl bg-white/80 px-3 text-sm text-slate-600 outline-none ring-1 ring-transparent focus:ring-[#E07A5F]/40"
      />
      <textarea
        value={notes}
        aria-label={t('activityNotesHint')}
        placeholder={t('tapToEditNote')}
        onChange={(event) => setNotes(event.target.value)}
        onBlur={() => {
          if ((notes.trim() || undefined) !== activity.notes) commit({ notes: notes.trim() || undefined })
        }}
        rows={2}
        className="mt-2 w-full resize-none rounded-xl bg-white/80 px-3 py-2 text-sm text-[#E07A5F] outline-none placeholder:text-slate-400 ring-1 ring-transparent focus:ring-[#E07A5F]/40"
      />
      {activity.userLocked && <p className="mt-1 text-[11px] font-semibold text-slate-400">{t('locked')}</p>}
    </li>
  )
}
