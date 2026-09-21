'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { useLocale } from '@/components/i18n/locale-provider'
import { IconBadge } from '@/components/ui/icon-badge'

interface DeleteTripButtonProps {
  tripId: string
  redirectTo?: string
  appearance?: 'pill' | 'menu'
}

export function DeleteTripButton({ tripId, redirectTo, appearance = 'pill' }: DeleteTripButtonProps) {
  const { t } = useLocale()
  const router = useRouter()
  const [busy, setBusy] = useState(false)

  const onDelete = async () => {
    if (busy) return
    if (!window.confirm(t('deleteTripConfirm'))) return

    setBusy(true)
    try {
      const response = await fetch(`/api/trips/${tripId}`, { method: 'DELETE' })
      if (!response.ok) {
        const payload = (await response.json().catch(() => ({}))) as { error?: string }
        throw new Error(payload.error || t('deleteTripFailed'))
      }
      if (redirectTo) {
        router.push(redirectTo)
      } else {
        router.refresh()
      }
    } catch (error) {
      window.alert(error instanceof Error ? error.message : t('deleteTripFailed'))
      setBusy(false)
    }
  }

  if (appearance === 'menu') {
    return (
      <button
        type="button"
        role="menuitem"
        onClick={() => void onDelete()}
        disabled={busy}
        className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60"
      >
        <Trash2 className="h-4 w-4" aria-hidden />
        {busy ? t('deletingTrip') : t('deleteTrip')}
      </button>
    )
  }

  return (
    <IconBadge
      icon={Trash2}
      onClick={() => void onDelete()}
      disabled={busy}
      tone="danger"
      className="min-h-11 px-4 text-sm"
    >
      {busy ? t('deletingTrip') : t('deleteTrip')}
    </IconBadge>
  )
}
