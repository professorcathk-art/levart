'use client'

import { useState } from 'react'
import { useLocale } from '@/components/i18n/locale-provider'
import { bucketFromClock, parseClock } from '@/lib/trips/clock'
import type { DayActivity, DayItinerary, Itinerary } from '@/types'

interface PlanEditorProps {
  itinerary: Itinerary
  onSave: (itinerary: Itinerary) => void
  onClose: () => void
}

export function PlanEditor({ itinerary, onSave, onClose }: PlanEditorProps) {
  const { t } = useLocale()
  const [draft, setDraft] = useState<Itinerary>(itinerary)

  const updateDay = (index: number, patch: Partial<DayItinerary>) => {
    setDraft((current) => ({
      ...current,
      days: current.days.map((day, dayIndex) => (dayIndex === index ? { ...day, ...patch } : day)),
    }))
  }

  const updateActivity = (dayIndex: number, activityIndex: number, patch: Partial<DayActivity>) => {
    setDraft((current) => ({
      ...current,
      days: current.days.map((day, index) =>
        index === dayIndex
          ? {
              ...day,
              activities: day.activities.map((activity, inner) =>
                inner === activityIndex ? { ...activity, ...patch } : activity
              ),
            }
          : day
      ),
    }))
  }

  const addActivity = (dayIndex: number) => {
    updateDay(dayIndex, {
      activities: [
        ...draft.days[dayIndex].activities,
        { time: 'afternoon', activity: '', location: '', userLocked: true },
      ],
    })
  }

  const removeActivity = (dayIndex: number, activityIndex: number) => {
    updateDay(dayIndex, {
      activities: draft.days[dayIndex].activities.filter((_, index) => index !== activityIndex),
    })
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4">
      <div className="flex h-[92dvh] w-full max-w-3xl flex-col rounded-t-3xl bg-white text-[#1A1A1A] shadow-2xl sm:h-[85dvh] sm:rounded-3xl">
        <header className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="text-lg font-bold text-[#FF9A76]">{t('editPlan')}</h2>
          <button type="button" onClick={onClose} className="text-sm text-gray-500">
            {t('close')}
          </button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 space-y-4">
          <label className="block text-sm">
            <span className="mb-1 block font-medium">{t('destination')}</span>
            <input
              value={draft.destination}
              onChange={(event) => setDraft({ ...draft, destination: event.target.value })}
              className="w-full rounded-xl border px-3 py-2"
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-sm">
              <span className="mb-1 block font-medium">{t('checkIn')}</span>
              <input
                type="date"
                value={draft.checkIn ?? ''}
                onChange={(event) => setDraft({ ...draft, checkIn: event.target.value })}
                className="w-full rounded-xl border px-3 py-2"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-medium">{t('checkOut')}</span>
              <input
                type="date"
                value={draft.checkOut ?? ''}
                onChange={(event) => setDraft({ ...draft, checkOut: event.target.value })}
                className="w-full rounded-xl border px-3 py-2"
              />
            </label>
          </div>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">{t('tripNotes')}</span>
            <textarea
              value={draft.notes ?? ''}
              onChange={(event) => setDraft({ ...draft, notes: event.target.value })}
              rows={3}
              className="w-full rounded-xl border px-3 py-2"
              placeholder={t('tripNotesHint')}
            />
          </label>

          {draft.days.map((day, dayIndex) => (
            <section key={day.day} className="rounded-2xl border border-[#FF9A76]/20 p-3">
              <h3 className="font-bold">{t('planDay', { day: day.day })}</h3>
              <input
                value={day.date}
                onChange={(event) => updateDay(dayIndex, { date: event.target.value })}
                className="mt-2 w-full rounded-xl border px-3 py-2 text-sm"
              />
              <textarea
                value={day.notes ?? ''}
                onChange={(event) => updateDay(dayIndex, { notes: event.target.value })}
                rows={2}
                className="mt-2 w-full rounded-xl border px-3 py-2 text-sm"
                placeholder={t('dayNotesHint')}
              />
              <div className="mt-3 space-y-3">
                {day.activities.map((activity, activityIndex) => (
                  <div key={`${day.day}-${activityIndex}`} className="rounded-xl bg-[#FFF8F3] p-3">
                    <div className="grid grid-cols-2 gap-2">
                      <label className="block text-xs font-medium text-slate-500">
                        {t('startTime')}
                        <input
                          type="time"
                          value={activity.startTime ?? ''}
                          onChange={(event) => {
                            const startTime = parseClock(event.target.value)
                            updateActivity(dayIndex, activityIndex, {
                              startTime,
                              time: bucketFromClock(startTime),
                              userLocked: true,
                            })
                          }}
                          className="mt-1 w-full rounded-lg border px-2 py-2 font-mono text-sm"
                        />
                      </label>
                      <label className="block text-xs font-medium text-slate-500">
                        {t('endTime')}
                        <input
                          type="time"
                          value={activity.endTime ?? ''}
                          onChange={(event) =>
                            updateActivity(dayIndex, activityIndex, {
                              endTime: parseClock(event.target.value),
                              userLocked: true,
                            })
                          }
                          className="mt-1 w-full rounded-lg border px-2 py-2 font-mono text-sm"
                        />
                      </label>
                    </div>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7ECCC4]">
                        {t(
                          activity.time === 'evening'
                            ? 'timeEvening'
                            : activity.time === 'afternoon'
                              ? 'timeAfternoon'
                              : 'timeMorning'
                        )}
                      </p>
                      <label className="flex items-center gap-2 text-xs font-semibold">
                        <input
                          type="checkbox"
                          checked={Boolean(activity.userLocked)}
                          onChange={(event) =>
                            updateActivity(dayIndex, activityIndex, { userLocked: event.target.checked })
                          }
                        />
                        {t('lockFromAi')}
                      </label>
                    </div>
                    <input
                      value={activity.activity}
                      onChange={(event) =>
                        updateActivity(dayIndex, activityIndex, {
                          activity: event.target.value,
                          userLocked: true,
                        })
                      }
                      placeholder={t('activityName')}
                      className="mt-2 w-full rounded-lg border px-3 py-2 text-sm"
                    />
                    <input
                      value={activity.location}
                      onChange={(event) =>
                        updateActivity(dayIndex, activityIndex, {
                          location: event.target.value,
                          userLocked: true,
                        })
                      }
                      placeholder={t('activityLocation')}
                      className="mt-2 w-full rounded-lg border px-3 py-2 text-sm"
                    />
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <input
                        value={activity.duration ?? ''}
                        onChange={(event) =>
                          updateActivity(dayIndex, activityIndex, { duration: event.target.value })
                        }
                        placeholder={t('duration')}
                        className="rounded-lg border px-3 py-2 text-sm"
                      />
                      <input
                        value={activity.cost ?? ''}
                        onChange={(event) =>
                          updateActivity(dayIndex, activityIndex, { cost: event.target.value })
                        }
                        placeholder={t('cost')}
                        className="rounded-lg border px-3 py-2 text-sm"
                      />
                    </div>
                    <textarea
                      value={activity.notes ?? ''}
                      onChange={(event) =>
                        updateActivity(dayIndex, activityIndex, {
                          notes: event.target.value,
                          userLocked: true,
                        })
                      }
                      rows={2}
                      placeholder={t('activityNotesHint')}
                      className="mt-2 w-full rounded-lg border px-3 py-2 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeActivity(dayIndex, activityIndex)}
                      className="mt-2 text-xs text-red-600"
                    >
                      {t('removeActivity')}
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => addActivity(dayIndex)}
                className="mt-3 text-sm font-semibold text-[#FF9A76]"
              >
                {t('addActivity')}
              </button>
            </section>
          ))}
        </div>
        <footer className="flex gap-3 border-t px-4 py-3">
          <button type="button" onClick={onClose} className="flex-1 rounded-full border border-slate-200 px-4 py-3 font-semibold text-[#1A1A1A]">
            {t('cancel')}
          </button>
          <button
            type="button"
            onClick={() => onSave(draft)}
            className="flex-1 rounded-full bg-gradient-to-r from-[#FF9A76] to-[#FFB86C] px-4 py-3 font-semibold text-white"
          >
            {t('saveEdits')}
          </button>
        </footer>
      </div>
    </div>
  )
}
