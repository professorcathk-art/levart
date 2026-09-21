'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { MoreVertical } from 'lucide-react'
import { useLocale } from '@/components/i18n/locale-provider'
import { DeleteTripButton } from '@/components/trips/delete-trip-button'

interface TripOwnerMenuProps {
  tripId: string
}

export function TripOwnerMenu({ tripId }: TripOwnerMenuProps) {
  const { t } = useLocale()
  const [open, setOpen] = useState(false)
  const menuId = useId()
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onPointer = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={rootRef} className="absolute right-3 top-3 z-10 sm:right-4 sm:top-4">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={t('moreActions')}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/15 text-white backdrop-blur-sm hover:bg-black/25"
      >
        <MoreVertical className="h-4 w-4" aria-hidden />
      </button>
      {open && (
        <div
          id={menuId}
          role="menu"
          className="absolute right-0 mt-2 min-w-[10rem] overflow-hidden rounded-2xl border border-white/60 bg-white py-1 shadow-lg"
        >
          <DeleteTripButton tripId={tripId} redirectTo="/trips" appearance="menu" />
        </div>
      )}
    </div>
  )
}
