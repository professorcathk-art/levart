'use client'

import { useLocale } from '@/components/i18n/locale-provider'
import { itineraryHasPlan } from '@/lib/trips/itinerary'
import type { Itinerary, TripStatus } from '@/types'

interface ConfirmBarProps {
  itinerary: Itinerary | null
  status: TripStatus
  confirming: boolean
  onConfirm: () => void
  onReopen?: () => void
}

export function ConfirmBar({
  itinerary,
  status,
  confirming,
  onConfirm,
  onReopen,
}: ConfirmBarProps) {
  const { t } = useLocale()
  if (!itineraryHasPlan(itinerary)) {
    return null
  }

  if (status === 'confirmed') {
    return (
      <div className="flex items-center justify-between gap-3 rounded-2xl border border-[#7ECCC4]/40 bg-white px-4 py-3">
        <p className="text-sm text-gray-700">{t('confirmed')}</p>
        {onReopen && (
          <button
            type="button"
            onClick={onReopen}
            className="rounded-full border border-[#FF9A76]/40 px-4 py-2 text-sm font-semibold text-[#FF9A76]"
          >
            {t('keepEditing')}
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-gradient-to-r from-[#E07A5F] to-[#FFB86C] px-4 py-3 text-white shadow-lg sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-semibold">{t('confirmHappy')}</p>
        <p className="text-xs text-white/80">{t('confirmHint')}</p>
      </div>
      <button
        type="button"
        disabled={confirming}
        onClick={onConfirm}
        className="relative min-h-11 overflow-hidden rounded-full bg-white px-5 text-sm font-semibold text-[#E07A5F] shadow-sm transition-all hover:scale-[1.03] disabled:opacity-60"
      >
        {confirming ? t('confirming') : t('confirmPlan')}
      </button>
    </div>
  )
}
