'use client'

import { History, Pencil, Share2 } from 'lucide-react'
import { MapComponent } from '@/components/map-component'
import { EditableStop } from '@/components/itinerary/editable-stop'
import { PlaceHint } from '@/components/itinerary/place-hint'
import { IconBadge } from '@/components/ui/icon-badge'
import { MapPlaceholder } from '@/components/ui/map-placeholder'
import { useLocale } from '@/components/i18n/locale-provider'
import { itineraryHasPlan } from '@/lib/trips/itinerary'
import type { DayActivity, Itinerary, TripFocus } from '@/types'
import type { MessageKey } from '@/lib/i18n/dictionaries'

const TIME_KEYS: Record<DayActivity['time'], MessageKey> = {
  morning: 'timeMorning',
  afternoon: 'timeAfternoon',
  evening: 'timeEvening',
}

const FOCUS_KEYS: Record<TripFocus, MessageKey> = {
  food: 'focusFood',
  culture: 'focusCulture',
  shopping: 'focusShopping',
  beach: 'focusBeach',
  nightlife: 'focusNightlife',
  family: 'focusFamily',
  climbing: 'focusClimbing',
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
    <div className="h-full overflow-y-auto p-4 md:p-6">
      <header className="mb-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7ECCC4]">{t('planLiveDraft')}</p>
          <div className="flex flex-wrap items-center gap-2">
            {onShare && (
              <IconBadge icon={Share2} onClick={onShare}>
                {t('share')}
              </IconBadge>
            )}
            {onHistory && (
              <IconBadge icon={History} onClick={onHistory}>
                {t('versionHistory')}
              </IconBadge>
            )}
            {onEdit && (
              <IconBadge icon={Pencil} tone="primary" onClick={onEdit}>
                {t('addRemoveStops')}
              </IconBadge>
            )}
            {saveState === 'saving' && <span className="text-xs text-slate-500">{t('savingEdits')}</span>}
            {saveState === 'saved' && <span className="text-xs text-[#7ECCC4]">{t('editsSaved')}</span>}
            {saveState === 'error' && <span className="text-xs text-red-600">{t('editsSaveFailed')}</span>}
          </div>
        </div>
        <h2 className="mt-2 text-2xl font-extrabold text-[#FF9A76] md:text-3xl">{itinerary.destination}</h2>
        <p className="text-gray-600">
          {t('planDays', { count: itinerary.days.length })}
          {itinerary.checkIn ? ` • ${itinerary.checkIn}` : ''}
          {itinerary.checkOut ? ` – ${itinerary.checkOut}` : ''}
          {itinerary.currency ? ` • ${itinerary.currency}` : ''}
        </p>
        {itinerary.notes && (
          <p className="mt-2 rounded-2xl bg-white/80 px-3 py-2 text-sm text-gray-700">{itinerary.notes}</p>
        )}
        {lastChange && (
          <p className="mt-2 rounded-2xl bg-[#7ECCC4]/15 px-3 py-2 text-sm text-[#1A1A1A]" aria-live="polite">
            {t('planChanged')}: {lastChange}
          </p>
        )}
        {itinerary.tripFocus.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {itinerary.tripFocus.map((focus) => (
              <span key={focus} className="rounded-full border border-orange-100/80 bg-[#FF9A76]/10 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#FF9A76]">
                {t(FOCUS_KEYS[focus])}
              </span>
            ))}
          </div>
        )}
      </header>

      {itinerary.selectedAttractions.length > 0 && (
        <div className="mb-6 overflow-hidden rounded-2xl shadow">
          <MapComponent
            attractions={itinerary.selectedAttractions}
            routePolyline={itinerary.route.polyline || '[]'}
          />
        </div>
      )}

      <div className="space-y-4 pb-8">
        {itinerary.days.map((day, dayIndex) => (
          <section key={day.day} className="rounded-2xl border border-orange-100/80 bg-white/90 p-4 shadow-sm transition-all hover:shadow-md">
            <div className="mb-3 flex items-baseline justify-between gap-2">
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
                  <li key={`${day.day}-${index}`} className="border-l-2 border-[#FF9A76]/40 pl-3">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7ECCC4]">
                        {t(TIME_KEYS[activity.time])}
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
                    <p className="font-semibold">{activity.activity}</p>
                    <p className="text-sm text-gray-600">{activity.location}</p>
                    {activity.notes && <p className="mt-1 text-sm text-[#FF9A76]">{activity.notes}</p>}
                    <div className="mt-1 flex flex-wrap gap-3 text-xs text-gray-500">
                      {activity.duration && <span>{activity.duration}</span>}
                      {activity.cost && <span>{activity.cost}</span>}
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
                {t('planEat')}: {day.restaurants.map((restaurant) => restaurant.name).join(', ')}
              </p>
            )}
          </section>
        ))}
      </div>
    </div>
  )
}
