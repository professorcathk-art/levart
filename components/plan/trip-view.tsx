'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { MapComponent } from '@/components/map-component'
import { PDFExport } from '@/components/itinerary/pdf-export'
import { ItineraryBoard } from '@/components/itinerary/itinerary-board'
import { BookingLinks } from '@/components/plan/booking-links'
import { ReopenButton } from '@/components/plan/reopen-button'
import { ShareSheet } from '@/components/plan/share-sheet'
import { useLocale } from '@/components/i18n/locale-provider'
import { collectTravelTips } from '@/lib/trips/versions'
import type { Trip } from '@/types'

interface TripViewProps {
  trip: Trip
  isOwner?: boolean
  showShare?: boolean
}

type TripTab = 'overview' | 'itinerary' | 'tips' | 'map'

export function TripView({ trip, isOwner = false, showShare = false }: TripViewProps) {
  const { t } = useLocale()
  const [tab, setTab] = useState<TripTab>('itinerary')
  const tips = useMemo(() => collectTravelTips(trip.itinerary), [trip.itinerary])
  const tabs: Array<{ id: TripTab; label: string }> = [
    { id: 'overview', label: t('tabOverview') },
    { id: 'itinerary', label: t('tabItinerary') },
    { id: 'tips', label: t('tabTips') },
    { id: 'map', label: t('tabMap') },
  ]

  return (
    <div className="space-y-6 pb-10">
      <header className="overflow-hidden rounded-3xl bg-gradient-to-br from-[#FF9A76] to-[#7ECCC4] p-6 text-white shadow-xl md:p-8">
        <p className="text-sm uppercase tracking-wide text-white/80">
          {trip.status === 'confirmed' ? t('statusConfirmed') : t('statusDraft')}
        </p>
        <h1 className="mt-2 text-3xl font-bold md:text-5xl">{trip.destination || t('untitledTrip')}</h1>
        <p className="mt-2 text-base text-white/90 md:text-lg">
          {t('planDays', { count: trip.itinerary.days.length })}
          {trip.checkIn ? ` • ${trip.checkIn}` : ''}
          {trip.checkOut ? ` – ${trip.checkOut}` : ''}
        </p>
        <p className="mt-2 inline-flex rounded-full bg-white/20 px-3 py-1 text-sm">
          {trip.visibility === 'public'
            ? t('visibilityBadgePublic')
            : trip.visibility === 'unlisted'
              ? t('visibilityBadgeUnlisted')
              : t('visibilityBadgePrivate')}
        </p>
        {trip.owner && (
          <Link href={`/u/${trip.owner.username}`} className="mt-3 inline-block text-sm text-white/90 underline">
            {t('byAuthor', { name: trip.owner.displayName })}
          </Link>
        )}
        {(trip.tripFocus ?? []).length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {(trip.tripFocus ?? []).map((focus) => (
              <span key={focus} className="rounded-full bg-white/20 px-3 py-1 text-sm capitalize">
                {focus}
              </span>
            ))}
          </div>
        )}
        <div className="mt-6 flex flex-wrap gap-3">
          {isOwner && trip.status === 'confirmed' && <ReopenButton tripId={trip.id} />}
          {isOwner && trip.status === 'draft' && (
            <Link
              href={`/plan/${trip.id}`}
              className="rounded-full bg-white px-5 py-2 font-semibold text-[#FF9A76]"
            >
              {t('keepEditing')}
            </Link>
          )}
          {showShare && isOwner && trip.status === 'confirmed' && (
            <ShareSheet
              tripId={trip.id}
              destination={trip.destination}
              visibility={trip.visibility}
              slug={trip.slug}
            />
          )}
        </div>
      </header>

      <div className="sticky top-14 z-30 -mx-4 bg-[#FFF8F3]/95 px-4 py-2 backdrop-blur md:top-16 md:mx-0 md:px-0">
        <div className="flex gap-2 overflow-x-auto rounded-full bg-white p-1 shadow">
          {tabs.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`min-h-11 min-w-[5.5rem] rounded-full px-4 text-sm font-semibold ${
                tab === item.id ? 'bg-[#FF9A76] text-white' : 'text-gray-600'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {tab === 'overview' && (
        <section className="space-y-6">
          {trip.itinerary.notes && (
            <div className="rounded-3xl bg-white p-6 shadow">
              <h2 className="text-xl font-bold text-[#FF9A76]">{t('tripNotes')}</h2>
              <p className="mt-2 whitespace-pre-wrap text-gray-700">{trip.itinerary.notes}</p>
            </div>
          )}
          <div className="grid gap-4 sm:grid-cols-3">
            {trip.itinerary.days.slice(0, 3).map((day) => (
              <button
                key={day.day}
                type="button"
                onClick={() => setTab('itinerary')}
                className="min-h-11 rounded-3xl bg-white p-5 text-left shadow transition hover:shadow-lg"
              >
                <p className="text-sm font-semibold text-[#7ECCC4]">{t('planDay', { day: day.day })}</p>
                <p className="mt-2 font-bold">{day.activities[0]?.activity || day.date}</p>
                <p className="mt-1 text-sm text-gray-500">
                  {day.activities.length} {t('stops')}
                </p>
              </button>
            ))}
          </div>
          <PDFExport itinerary={trip.itinerary} />
        </section>
      )}

      {tab === 'itinerary' && (
        <ItineraryBoard itinerary={trip.itinerary} destination={trip.destination} trip={trip} />
      )}

      {tab === 'tips' && (
        <section className="space-y-4">
          {tips.map((section) => (
            <article key={section.id} className="rounded-3xl bg-white p-6 shadow">
              <h2 className="text-xl font-bold text-[#FF9A76]">
                {section.id === 'fromPlan'
                  ? t('tipsFromPlan')
                  : section.id === 'style'
                    ? t('tipsStyle')
                    : t('tipsPractical')}
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-gray-700">
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
          {tips.length === 0 && (
            <p className="rounded-3xl bg-white p-6 text-gray-600 shadow">{t('noTips')}</p>
          )}
        </section>
      )}

      {tab === 'map' && (
        <section className="space-y-6">
          <p className="rounded-3xl bg-white p-5 text-sm text-gray-600 shadow md:text-base">
            {t('mapTabIntro')}
          </p>
          {(trip.selectedAttractions ?? []).length > 0 ? (
            <div className="overflow-hidden rounded-3xl shadow-lg">
              <MapComponent
                attractions={trip.selectedAttractions ?? []}
                routePolyline={trip.route?.polyline || '[]'}
              />
            </div>
          ) : (
            <p className="rounded-3xl bg-white p-6 text-gray-600 shadow">{t('noMap')}</p>
          )}
          <BookingLinks
            destination={trip.destination}
            checkIn={trip.checkIn}
            checkOut={trip.checkOut}
            tripId={trip.id}
          />
        </section>
      )}
    </div>
  )
}
