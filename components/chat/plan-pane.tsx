'use client'

import { MapComponent } from '@/components/map-component'
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
}

export function PlanPane({ itinerary }: PlanPaneProps) {
  const { t } = useLocale()

  if (!itineraryHasPlan(itinerary) || !itinerary) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-8 text-center text-gray-500">
        <p className="text-5xl">🗺️</p>
        <h2 className="mt-4 text-xl font-bold text-[#1A1A1A]">{t('planEmptyTitle')}</h2>
        <p className="mt-2 max-w-sm text-sm">{t('planEmptyBody')}</p>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6">
      <header className="mb-4">
        <p className="text-sm font-semibold uppercase tracking-wide text-[#7ECCC4]">{t('planLiveDraft')}</p>
        <h2 className="text-3xl font-bold text-[#FF9A76]">{itinerary.destination}</h2>
        <p className="text-gray-600">
          {t('planDays', { count: itinerary.days.length })}
          {itinerary.checkIn ? ` • ${itinerary.checkIn}` : ''}
          {itinerary.checkOut ? ` – ${itinerary.checkOut}` : ''}
        </p>
        {itinerary.tripFocus.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {itinerary.tripFocus.map((focus) => (
              <span key={focus} className="rounded-full bg-[#FF9A76]/10 px-3 py-1 text-xs font-semibold text-[#FF9A76]">
                {t(FOCUS_KEYS[focus])}
              </span>
            ))}
          </div>
        )}
      </header>

      {itinerary.selectedAttractions.length > 0 && itinerary.route?.polyline && (
        <div className="mb-6 overflow-hidden rounded-2xl shadow">
          <MapComponent
            attractions={itinerary.selectedAttractions}
            routePolyline={itinerary.route.polyline}
          />
        </div>
      )}

      <div className="space-y-4">
        {itinerary.days.map((day) => (
          <section key={day.day} className="rounded-2xl bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-baseline justify-between">
              <h3 className="text-lg font-bold text-[#1A1A1A]">
                {t('planDay', { day: day.day })}
                <span className="ml-2 text-sm font-normal text-gray-500">{day.date}</span>
              </h3>
              {day.weather && (
                <span className="text-sm text-gray-500">
                  {day.weather.temperature}°C · {day.weather.description}
                </span>
              )}
            </div>
            <ol className="space-y-3">
              {day.activities.map((activity, index) => (
                <li key={`${day.day}-${index}`} className="border-l-2 border-[#FF9A76]/40 pl-3">
                  <p className="text-xs font-semibold uppercase text-[#7ECCC4]">{t(TIME_KEYS[activity.time])}</p>
                  <p className="font-semibold">{activity.activity}</p>
                  <p className="text-sm text-gray-600">{activity.location}</p>
                  <div className="mt-1 flex flex-wrap gap-3 text-xs text-gray-500">
                    {activity.duration && <span>{activity.duration}</span>}
                    {activity.cost && <span>{activity.cost}</span>}
                  </div>
                </li>
              ))}
            </ol>
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
