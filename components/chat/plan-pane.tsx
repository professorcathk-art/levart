'use client'

import { History, Pencil, Share2 } from 'lucide-react'
import { MapComponent } from '@/components/map-component'
import { EditableStop } from '@/components/itinerary/editable-stop'
import { PlaceHint } from '@/components/itinerary/place-hint'
import { IconBadge } from '@/components/ui/icon-badge'
import { MapPlaceholder } from '@/components/ui/map-placeholder'
import { TripTags } from '@/components/plan/trip-tags'
import { useLocale } from '@/components/i18n/locale-provider'
import { itineraryHasPlan } from '@/lib/trips/itinerary'
import { formatTimeRange } from '@/lib/trips/clock'
import type { DayActivity, Itinerary } from '@/types'
import type { MessageKey } from '@/lib/i18n/dictionaries'

const TIME_KEYS: Record<DayActivity['time'], MessageKey> = {
  morning: 'timeMorning',
  afternoon: 'timeAfternoon',
  evening: 'timeEvening',
}

interface PlanPaneProps {
  itinerary: Itinerary | null
  lastChange?: string | null
  saveState?: 'idle' | 'saving' | 'saved' | 'error'
  editable?: boolean
  onEdit?: () => void
  onHistory?: () => void
  onShare?: () => void
  onActivityChange?: (dayIndex: number, activityIndex: number, patch: Partial<DayActivity>) => void
}

export function PlanPane({
  itinerary,
  lastChange,
  saveState = 'idle',
  editable = false,
  onEdit,
  onHistory,
  onShare,
  onActivityChange,
}: PlanPaneProps) {
  const { t } = useLocale()

  if (!itineraryHasPlan(itinerary) || !itinerary) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-4 text-center md:px-8">
        <div className="w-full max-w-md overflow-hidden rounded-3xl border border-orange-100/80 bg-white/90 shadow-sm">
          <MapPlaceholder title={t('planEmptyTitle')} />
        </div>
        <p className="mt-4 max-w-sm text-sm font-medium leading-relaxed text-slate-500">{t('planEmptyBody')}</p>
      </div>
    )
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <header className="shrink-0 border-b border-orange-100/70 bg-white/80 px-3 py-3 backdrop-blur sm:px-4 md:px-6">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7ECCC4]">{t('planLiveDraft')}</p>
        <h2 className="mt-1 break-words text-xl font-extrabold text-[#E07A5F] sm:text-2xl md:text-3xl">{itinerary.destination}</h2>
        <p className="mt-1 text-sm text-slate-600">
          {t('planDays', { count: itinerary.days.length })}
          {itinerary.checkIn ? ` • ${itinerary.checkIn}` : ''}
          {itinerary.checkOut ? ` – ${itinerary.checkOut}` : ''}
          {itinerary.currency ? ` • ${itinerary.currency}` : ''}
        </p>
        <div className="mt-3 flex gap-1.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {onShare && (
            <IconBadge icon={Share2} onClick={onShare} className="min-h-11 shrink-0">
              {t('share')}
            </IconBadge>
          )}
          {onHistory && (
            <IconBadge icon={History} onClick={onHistory} className="min-h-11 shrink-0">
              {t('versionHistory')}
            </IconBadge>
          )}
          {onEdit && (
            <IconBadge icon={Pencil} tone="primary" onClick={onEdit} className="min-h-11 shrink-0">
              {t('addRemoveStops')}
            </IconBadge>
          )}
        </div>
        {(saveState === 'saving' || saveState === 'saved' || saveState === 'error') && (
          <p className={`mt-2 text-xs ${saveState === 'error' ? 'text-red-600' : 'text-slate-500'}`}>
            {saveState === 'saving' ? t('savingEdits') : saveState === 'saved' ? t('editsSaved') : t('editsSaveFailed')}
          </p>
        )}
        {itinerary.notes && (
          <p className="mt-2 rounded-2xl bg-white/80 px-3 py-2 text-sm text-gray-700">{itinerary.notes}</p>
        )}
        {lastChange && (
          <p className="mt-2 rounded-2xl bg-[#7ECCC4]/15 px-3 py-2 text-sm text-[#1A1A1A]" aria-live="polite">
            {t('planChanged')}: {lastChange}
          </p>
        )}
        <TripTags itinerary={itinerary} variant="panel" />
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {itinerary.days.map((day) => (
            <a
              key={day.day}
              href={`#draft-day-${day.day}`}
              className="inline-flex min-h-9 shrink-0 items-center rounded-full border border-orange-100/80 bg-white px-3 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-[#2B2D42]"
            >
              {t('planDay', { day: day.day })}
            </a>
          ))}
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-4 sm:px-4 md:px-6">

      {itinerary.selectedAttractions.length > 0 && (
        <div className="mb-5 h-36 overflow-hidden rounded-2xl border border-orange-100/80 shadow-sm sm:h-48 md:h-64">
          <MapComponent
            attractions={itinerary.selectedAttractions}
            routePolyline={itinerary.route.polyline || '[]'}
            className="h-full w-full"
          />
        </div>
      )}

      <div className="space-y-4 pb-8">
        {itinerary.days.map((day, dayIndex) => (
          <section
            id={`draft-day-${day.day}`}
            key={day.day}
            className="scroll-mt-3 rounded-2xl border border-orange-100/80 bg-white/90 p-3 shadow-sm sm:p-4"
          >
            <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-lg font-extrabold text-[#1A1A1A]">
                {t('planDay', { day: day.day })}
                <span className="ml-2 font-mono text-[11px] font-semibold uppercase tracking-wide text-gray-500">{day.date}</span>
              </h3>
              {day.weather && (
                <span className="text-sm text-gray-500">
                  {day.weather.temperature}°C · {day.weather.description}
                </span>
              )}
            </div>
            {day.notes && <p className="mb-3 text-sm text-gray-600">{day.notes}</p>}
            <ol className="space-y-3">
              {day.activities.map((activity, index) =>
                editable && onActivityChange ? (
                  <EditableStop
                    key={`${day.day}-${index}`}
                    activity={activity}
                    destination={itinerary.destination}
                    onCommit={(patch) => onActivityChange(dayIndex, index, patch)}
                  />
                ) : (
                  <li key={`${day.day}-${index}`} className="rounded-xl border-l-4 border-[#E07A5F]/70 bg-[#FFF8F3] px-3 py-2">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7ECCC4]">
                        {formatTimeRange(activity.startTime, activity.endTime) || t(TIME_KEYS[activity.time])}
                        {activity.userLocked ? ` · ${t('locked')}` : ''}
                      </p>
                      <PlaceHint
                        title={activity.activity}
                        location={activity.location}
                        destination={itinerary.destination}
                        tips={activity.tips}
                        notes={activity.notes}
                        address={activity.address}
                      />
                    </div>
                    <p className="break-words font-semibold">{activity.activity}</p>
                    <p className="break-words text-sm text-gray-600">{activity.location}</p>
                    {activity.notes && <p className="mt-1 text-sm text-[#FF9A76]">{activity.notes}</p>}
                    <div className="mt-1 flex flex-wrap gap-3 text-xs text-gray-500">
                      {activity.duration && <span>⏱️ {activity.duration}</span>}
                      {activity.cost && <span>💰 {activity.cost}</span>}
                    </div>
                  </li>
                )
              )}
            </ol>
            {day.estimatedCost && (
              <p className="mt-3 text-sm font-semibold text-[#FF9A76]">
                {t('costEstimate')}: {day.estimatedCost}
              </p>
            )}
            {day.restaurants.length > 0 && (
              <p className="mt-3 text-sm text-gray-600">
                {t('planEatSuggest')}: {day.restaurants.map((restaurant) => restaurant.name).join(', ')}
              </p>
            )}
          </section>
        ))}
      </div>
    </div>
    </div>
  )
}
