'use client'

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
  if (!itineraryHasPlan(itinerary)) {
    return null
  }

  if (status === 'confirmed') {
    return (
      <div className="flex items-center justify-between gap-3 rounded-2xl border border-[#7ECCC4]/40 bg-white px-4 py-3">
        <p className="text-sm text-gray-700">This plan is confirmed.</p>
        {onReopen && (
          <button
            type="button"
            onClick={onReopen}
            className="rounded-full border border-[#FF9A76]/40 px-4 py-2 text-sm font-semibold text-[#FF9A76]"
          >
            Keep editing
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-gradient-to-r from-[#FF9A76] to-[#FFB86C] px-4 py-3 text-white shadow-lg">
      <div>
        <p className="font-semibold">Happy with this plan?</p>
        <p className="text-xs text-white/80">Confirm anytime. You can still edit later.</p>
      </div>
      <button
        type="button"
        disabled={confirming}
        onClick={onConfirm}
        className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#FF9A76] disabled:opacity-60"
      >
        {confirming ? 'Confirming…' : 'Confirm plan'}
      </button>
    </div>
  )
}
