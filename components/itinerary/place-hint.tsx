'use client'

import { useEffect, useId, useState } from 'react'
import { Info } from 'lucide-react'
import { useLocale } from '@/components/i18n/locale-provider'
import { IconBadge } from '@/components/ui/icon-badge'
import { PawMark } from '@/components/ui/paw-mark'

interface PlaceHintProps {
  title: string
  location?: string
  destination?: string
  tips?: string[]
  notes?: string
  address?: string
}

interface HintPayload {
  title?: string
  extract?: string | null
  url?: string
}

export function PlaceHint({ title, location, destination, tips, notes, address }: PlaceHintProps) {
  const { locale, t } = useLocale()
  const panelId = useId()
  const [open, setOpen] = useState(false)
  const [hint, setHint] = useState<HintPayload | null>(null)
  const [loading, setLoading] = useState(false)

  const query = [title, location, destination].filter(Boolean).join(' ')

  useEffect(() => {
    if (!open || hint || loading) return
    setLoading(true)
    fetch(`/api/places/hint?q=${encodeURIComponent(query)}&locale=${encodeURIComponent(locale)}`)
      .then((response) => response.json())
      .then((data: HintPayload) => setHint(data))
      .catch(() => setHint({ extract: null }))
      .finally(() => setLoading(false))
  }, [open, hint, loading, query, locale])

  return (
    <div className="relative">
      <IconBadge icon={Info} expanded={open} onClick={() => setOpen((value) => !value)}>
        {t('whatIsThis')}
      </IconBadge>
      {open && (
        <div
          id={panelId}
          className="absolute left-0 z-20 mt-2 w-72 rounded-xl border border-orange-100/80 bg-white/95 p-3 text-left text-xs text-slate-600 shadow-md backdrop-blur-sm"
        >
          {address && <p className="mb-2">📍 {address}</p>}
          {notes && <p className="mb-2">{notes}</p>}
          {tips && tips.length > 0 && (
            <ul className="mb-2 list-disc space-y-1 pl-4">
              {tips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          )}
          {loading && <p>{t('placeHintLoading')}</p>}
          {!loading && hint?.extract && (
            <p>
              <PawMark size={12} className="mr-1 align-text-bottom" />
              {hint.extract}
              {hint.url && (
                <a
                  href={hint.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 block font-semibold text-[#E07A5F]"
                >
                  {t('placeHintMore')}
                </a>
              )}
            </p>
          )}
          {!loading && !hint?.extract && !notes && !tips?.length && (
            <p>{t('placeHintEmpty')}</p>
          )}
        </div>
      )}
    </div>
  )
}
