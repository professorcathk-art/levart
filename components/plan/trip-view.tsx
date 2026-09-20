'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { PDFExport } from '@/components/itinerary/pdf-export'
import { ItineraryBoard } from '@/components/itinerary/itinerary-board'
import { ReopenButton } from '@/components/plan/reopen-button'
import { ShareSheet } from '@/components/plan/share-sheet'
import { DeleteTripButton } from '@/components/trips/delete-trip-button'
import { TripViewProvider, useTripView } from '@/components/itinerary/trip-view-provider'
import { useLocale } from '@/components/i18n/locale-provider'
import { collectTravelTips } from '@/lib/trips/versions'
import type { Trip } from '@/types'

interface TripViewProps {
  trip: Trip
  isOwner?: boolean
}

type TripTab = 'overview' | 'itinerary' | 'tips'

function TripViewInner({ trip, isOwner = false }: TripViewProps) {
  const { t } = useLocale()
  const { setSelectedDay, setMobilePane } = useTripView()
  const [tab, setTab] = useState<TripTab>('itinerary')
  const tips = useMemo(() => collectTravelTips(trip.itinerary), [trip.itinerary])
  const tabs: Array<{ id: TripTab; label: string }> = [
    { id: 'overview', label: t('tabOverview') },
    { id: 'itinerary', label: t('tabItinerary') },
    { id: 'tips', label: t('tabTips') },
  ]

  return (
    <div className="space-y-5 pb-24 lg:pb-10">
      <header className="overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-[#FF9A76] to-[#7ECCC4] p-4 text-white shadow-xl sm:p-6 md:p-8">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-white/80">
          {trip.status === 'confirmed' ? t('statusConfirmed') : t('statusDraft')}
        </p>
        <h1 className="mt-2 break-words text-2xl font-extrabold sm:text-3xl md:text-5xl">{trip.destination || t('untitledTrip')}</h1>
        <p className="mt-2 text-sm text-white/90 sm:text-base md:text-lg">
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
              <span
                key={focus}
                className="rounded-full border border-white/30 bg-white/15 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.16em]"
              >
                {focus}
              </span>
            ))}
          </div>
        )}
        <div className="mt-5 flex flex-wrap gap-2 sm:mt-6 sm:gap-3">
          {isOwner && trip.status === 'confirmed' && <ReopenButton tripId={trip.id} />}
          {isOwner && trip.status === 'draft' && (
            <Link
              href={`/plan/${trip.id}`}
              className="inline-flex min-h-11 items-center rounded-full bg-white px-5 py-2 font-semibold text-[#FF9A76]"
            >
              {t('keepEditing')}
            </Link>
          )}
          {isOwner && <DeleteTripButton tripId={trip.id} redirectTo="/trips" />}
          {isOwner && (
            <ShareSheet
              tripId={trip.id}
              destination={trip.destination}
              visibility={trip.visibility}
              slug={trip.slug}
            />
          )}
        </div>
      </header>

      <div className="-mx-3 border-b border-slate-200/80 px-3 sm:-mx-4 sm:px-4 md:mx-0 md:px-0">
        <div className="grid grid-cols-3" role="tablist" aria-label={t('tabItinerary')}>
          {tabs.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={tab === item.id}
              onClick={() => setTab(item.id)}
              className={`min-h-11 px-2 text-sm font-semibold sm:px-4 ${
                tab === item.id
                  ? 'border-b-2 border-[#E07A5F] text-[#E07A5F]'
                  : 'text-slate-500 hover:text-slate-800'
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
            <div className="rounded-xl border border-orange-100/80 bg-white/90 p-6 shadow-sm">
              <h2 className="text-xl font-extrabold text-[#E07A5F]">{t('tripNotes')}</h2>
              <p className="mt-2 whitespace-pre-wrap text-slate-700">{trip.itinerary.notes}</p>
            </div>
          )}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {trip.itinerary.days.map((day) => (
              <button
                key={day.day}
                type="button"
                onClick={() => {
                  setSelectedDay(day.day)
                  setMobilePane('list')
                  setTab('itinerary')
                }}
                className="min-h-11 rounded-xl border border-orange-100/80 bg-white/90 p-5 text-left shadow-sm transition-all hover:shadow-md"
              >
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7ECCC4]">{t('planDay', { day: day.day })}</p>
                <p className="mt-2 font-extrabold">{day.activities[0]?.activity || day.date}</p>
                <p className="mt-1 text-sm text-slate-500">
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
            <article key={section.id} className="rounded-xl border border-orange-100/80 bg-white/90 p-6 shadow-sm transition-all hover:shadow-md">
              <h2 className="text-xl font-extrabold text-[#E07A5F]">
                {section.id === 'fromPlan'
                  ? t('tipsFromPlan')
                  : section.id === 'style'
                    ? t('tipsStyle')
                    : t('tipsPractical')}
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
          {tips.length === 0 && (
            <p className="rounded-xl border border-slate-100 bg-white p-6 text-slate-600 shadow-sm">
              {t('noTips')}
            </p>
          )}
        </section>
      )}
    </div>
  )
}

export function TripView({ trip, isOwner = false }: TripViewProps) {
  const dayNumbers = useMemo(() => trip.itinerary.days.map((day) => day.day), [trip.itinerary.days])

  return (
    <TripViewProvider dayNumbers={dayNumbers}>
      <TripViewInner trip={trip} isOwner={isOwner} />
    </TripViewProvider>
  )
}
