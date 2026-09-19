'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale } from '@/components/i18n/locale-provider'

export function ReopenButton({ tripId }: { tripId: string }) {
  const router = useRouter()
  const { t } = useLocale()
  const [loading, setLoading] = useState(false)

  const reopen = async () => {
    setLoading(true)
    try {
      await fetch(`/api/trips/${tripId}/reopen`, { method: 'POST' })
      router.push(`/plan/${tripId}`)
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={() => void reopen()}
      disabled={loading}
      className="rounded-full bg-white px-5 py-2 font-semibold text-[#FF9A76] disabled:opacity-60"
    >
      {loading ? t('pleaseWait') : t('returnToEdit')}
    </button>
  )
}
