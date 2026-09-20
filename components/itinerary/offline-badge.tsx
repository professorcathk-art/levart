'use client'

import { useEffect, useState } from 'react'
import { useLocale } from '@/components/i18n/locale-provider'
import { useTripView } from '@/components/itinerary/trip-view-provider'
import {
  cacheCurrentPage,
  removeTripOffline,
  saveTripOffline,
} from '@/lib/trips/offline-store'
import type { Trip } from '@/types'

export function OfflineBadge({ trip }: { trip: Trip }) {
  const { t } = useLocale()
  const { isOffline } = useTripView()
  const [saved, setSaved] = useState(false)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    saveTripOffline(trip)
    setSaved(true)
  }, [trip])

  const toggle = async () => {
    setBusy(true)
    try {
      if (saved) {
        removeTripOffline(trip.id)
        setSaved(false)
      } else {
        saveTripOffline(trip)
        await cacheCurrentPage()
        setSaved(true)
      }
    } catch (error) {
      console.error('Offline save failed:', error)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {isOffline && (
        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
          {t('offlineUsingSaved')}
        </span>
      )}
      <button
        type="button"
        onClick={() => void toggle()}
        disabled={busy}
        className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#7ECCC4]/40 bg-white px-4 text-sm font-semibold text-[#1A1A1A] disabled:opacity-60"
      >
        <span aria-hidden>{saved ? '✓' : '↓'}</span>
        {saved ? t('offlineReady') : t('saveOffline')}
      </button>
    </div>
  )
}
