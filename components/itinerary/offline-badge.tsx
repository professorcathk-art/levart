'use client'

import { useEffect, useState } from 'react'
import { Smartphone } from 'lucide-react'
import { useLocale } from '@/components/i18n/locale-provider'
import { IconBadge } from '@/components/ui/icon-badge'
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
    <div className="flex shrink-0 items-center gap-2">
      {isOffline && (
        <span className="whitespace-nowrap rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
          {t('offlineUsingSaved')}
        </span>
      )}
      <IconBadge
        icon={Smartphone}
        onClick={() => void (saved ? remove() : save())}
        disabled={busy}
        tone={saved ? 'default' : 'dark'}
        className="min-h-11 whitespace-nowrap px-3 text-sm"
      >
        {busy ? t('offlineSaving') : saved ? t('offlineReady') : t('saveOffline')}
      </IconBadge>
    </div>
  )
}
