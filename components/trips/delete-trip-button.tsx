'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { useLocale } from '@/components/i18n/locale-provider'
import { IconBadge } from '@/components/ui/icon-badge'

interface DeleteTripButtonProps {
  tripId: string
  redirectTo?: string
}

export function DeleteTripButton({ tripId, redirectTo }: DeleteTripButtonProps) {
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

  return (
    <IconBadge
      icon={Trash2}
      onClick={() => void onDelete()}
      disabled={busy}
      className="min-h-11 border-red-200 px-4 text-sm text-red-600"
    >
      {busy ? t('deletingTrip') : t('deleteTrip')}
    </IconBadge>
  )
}
