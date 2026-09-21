'use client'

import { useMemo, useState } from 'react'
import { PDFExport } from '@/components/itinerary/pdf-export'
import { ItineraryBoard } from '@/components/itinerary/itinerary-board'
import { TripHeader } from '@/components/plan/trip-header'
import { TripViewProvider, useTripView } from '@/components/itinerary/trip-view-provider'
import { useLocale } from '@/components/i18n/locale-provider'
import { collectTravelTips } from '@/lib/trips/versions'
import { PreviewUnlock } from '@/components/plan/preview-unlock'
import type { Trip } from '@/types'

interface TripViewProps {
  trip: Trip
  isOwner?: boolean
  preview?: boolean
}

type TripTab = 'overview' | 'itinerary' | 'tips'

function TripViewInner({ trip, isOwner = false, preview = false }: TripViewProps) {
  const { t } = useLocale()
  const { setSelectedDay, setMobilePane } = useTripView()
  const [tab, setTab] = useState<TripTab>(preview ? 'overview' : 'itinerary')
  const tips = useMemo(() => collectTravelTips(trip.itinerary, t), [trip.itinerary, t])
  const firstDay = trip.itinerary.days[0]?.day
  const previewPath = trip.slug ? `/p/${trip.slug}` : `/trips/${trip.id}`
  const remixPrompt = t('remixPrompt', {
    destination: trip.destination,
    days: trip.itinerary.days.length,
  })
  const tabs: Array<{ id: TripTab; label: string }> = [
    { id: 'overview', label: t('tabOverview') },
    { id: 'itinerary', label: t('tabItinerary') },
    { id: 'tips', label: t('tabTips') },
  ]

  return (
    <div className="space-y-5 pb-24 lg:pb-10">
      <TripHeader trip={trip} isOwner={isOwner} preview={preview} />

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
                  if (preview && firstDay !== undefined && day.day !== firstDay) {
                    setTab('itinerary')
                    setSelectedDay(day.day)
                    return
                  }
                  setSelectedDay(day.day)
                  setMobilePane('list')
                  setTab('itinerary')
                }}
                className={`min-h-11 rounded-xl p-5 text-left shadow-sm transition-all hover:shadow-md ${
                  preview && firstDay !== undefined && day.day !== firstDay
                    ? 'border border-dashed border-orange-200 bg-white/70'
                    : 'border border-orange-100/80 bg-white/90'
                }`}
              >
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7ECCC4]">{t('planDay', { day: day.day })}</p>
                <p className="mt-2 font-extrabold">
                  {preview && firstDay !== undefined && day.day !== firstDay
                    ? t('previewLockedDay')
                    : day.activities[0]?.activity || day.date}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {day.activities.length} {t('stops')}
                </p>
              </button>
            ))}
          </div>
          {preview ? <PreviewUnlock nextPath={previewPath} remixPrompt={remixPrompt} compact /> : <PDFExport itinerary={trip.itinerary} />}
        </section>
      )}

      {tab === 'itinerary' && (
        <ItineraryBoard
          itinerary={trip.itinerary}
          destination={trip.destination}
          trip={trip}
          preview={preview}
          previewNextPath={previewPath}
          remixPrompt={remixPrompt}
        />
      )}

      {tab === 'tips' && (
        <section className="space-y-4">
          {preview ? (
            <>
              {tips[0] && (
                <article className="rounded-xl border border-orange-100/80 bg-white/90 p-6 shadow-sm">
                  <h2 className="text-xl font-extrabold text-[#E07A5F]">{t('tipsFromPlan')}</h2>
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
                    {tips[0].items.slice(0, 2).map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              )}
              <PreviewUnlock nextPath={previewPath} remixPrompt={remixPrompt} />
            </>
          ) : (
            <>
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
            </>
          )}
        </section>
      )}
    </div>
  )
}

export function TripView({ trip, isOwner = false, preview = false }: TripViewProps) {
  const dayNumbers = useMemo(() => trip.itinerary.days.map((day) => day.day), [trip.itinerary.days])

  return (
    <TripViewProvider dayNumbers={dayNumbers}>
      <TripViewInner trip={trip} isOwner={isOwner} preview={preview} />
    </TripViewProvider>
  )
}
