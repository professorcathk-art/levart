'use client'

import { useEffect, useState } from 'react'
import { useLocale } from '@/components/i18n/locale-provider'
import { useTripView } from '@/components/itinerary/trip-view-provider'
import {
  cacheCurrentPage,
  isTripSavedOffline,
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
    setSaved(isTripSavedOffline(trip.id))
  }, [trip.id])

  const save = async () => {
    setBusy(true)
    try {
      saveTripOffline(trip)
      await cacheCurrentPage()
      setSaved(true)
    } catch (error) {
      console.error('Offline save failed:', error)
    } finally {
      setBusy(false)
    }
  }

  const remove = () => {
    removeTripOffline(trip.id)
    setSaved(false)
  }

  return (
    <div className="flex min-w-0 flex-col items-start gap-1">
      {isOffline && (
        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
          {t('offlineUsingSaved')}
        </span>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => void save()}
          disabled={busy}
          aria-pressed={saved}
          className={`inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold disabled:opacity-60 ${
            saved
              ? 'border border-[#7ECCC4]/50 bg-[#E8F3F1] text-[#1A1A1A]'
              : 'bg-[#1A1A1A] text-white'
          }`}
        >
          <span aria-hidden>{saved ? '✓' : '↓'}</span>
          {busy ? t('offlineSaving') : saved ? t('offlineReady') : t('saveOffline')}
        </button>
        {saved && (
          <button
            type="button"
            onClick={remove}
            disabled={busy}
            className="min-h-11 rounded-full px-3 text-xs font-semibold text-gray-500 underline-offset-2 hover:underline"
          >
            {t('unsaveOffline')}
          </button>
        )}
      </div>
      <p className="max-w-xs text-xs text-gray-500">{saved ? t('offlineReadyHint') : t('offlineHint')}</p>
    </div>
  )
}
