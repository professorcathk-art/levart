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
    <li className="rounded-xl border border-slate-100 bg-[#FFF8F3] p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <select
          value={activity.time}
          aria-label={t('timeOfDay')}
          onChange={(event) => commit({ time: event.target.value as DayActivity['time'] })}
          className="rounded-lg bg-white px-2 py-1 text-xs font-semibold uppercase text-[#7ECCC4]"
        >
          <option value="morning">{t(TIME_KEYS.morning)}</option>
          <option value="afternoon">{t(TIME_KEYS.afternoon)}</option>
          <option value="evening">{t(TIME_KEYS.evening)}</option>
        </select>
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
        className="mt-2 w-full bg-transparent text-base font-semibold outline-none focus:rounded-lg focus:bg-white focus:px-2 focus:py-1"
      />
      <input
        value={location}
        aria-label={t('activityLocation')}
        onChange={(event) => setLocation(event.target.value)}
        onBlur={() => {
          if (location.trim() !== activity.location) commit({ location: location.trim() })
        }}
        className="mt-1 w-full bg-transparent text-sm text-slate-600 outline-none focus:rounded-lg focus:bg-white focus:px-2 focus:py-1"
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
        className="mt-2 w-full resize-none bg-transparent text-sm text-[#E07A5F] outline-none placeholder:text-slate-400 focus:rounded-lg focus:bg-white focus:px-2 focus:py-1"
      />
      {activity.userLocked && <p className="mt-1 text-[11px] font-semibold text-slate-400">{t('locked')}</p>}
    </li>
  )
}
