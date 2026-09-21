'use client'

import { useState } from 'react'
import { useLocale } from '@/components/i18n/locale-provider'
import { TRANSIT_ICONS, mapsDirectionsUrl, type TransitLeg } from '@/lib/trips/transit'
import { mapsRouteQueries } from '@/lib/trips/place-query'
import type { MessageKey } from '@/lib/i18n/dictionaries'

const MODE_KEYS: Record<TransitLeg['mode'], MessageKey> = {
  walk: 'transitWalk',
  train: 'transitTrain',
  bus: 'transitBus',
  taxi: 'transitTaxi',
  other: 'transitOther',
}

interface TransitConnectorProps {
  fromQuery: string
  toQuery: string
  destination?: string
  leg: TransitLeg
}

export function TransitConnector({ fromQuery, toQuery, destination, leg }: TransitConnectorProps) {
  const { t } = useLocale()
  const [open, setOpen] = useState(false)
  const hop = [leg.from || fromQuery, leg.to || toQuery].filter(Boolean).join(' → ')
  const route = mapsRouteQueries(fromQuery, toQuery, destination)
  const hasDrawer = Boolean(leg.detail || (hop && hop !== leg.lineName))

  return (
    <div className="my-1 space-y-1.5">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#E8F3F1] px-2 py-0.5 font-bold text-[#2B6F68]">
            <span aria-hidden>{TRANSIT_ICONS[leg.mode]}</span>
            {t(MODE_KEYS[leg.mode])}
          </span>
          {leg.lineName ? <span className="font-semibold text-slate-700">{leg.lineName}</span> : null}
          {leg.duration ? (
            <span className="text-slate-600">
              ⏱️ {leg.duration}
            </span>
          ) : null}
          {leg.fare ? <span className="text-slate-600">💰 {leg.fare}</span> : null}
        </div>
        {route.usable && (
          <a
            href={mapsDirectionsUrl(route.origin, route.destination, leg.mode)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-9 items-center rounded-full bg-white px-2.5 font-semibold text-[#2B2D42] ring-1 ring-orange-200 hover:bg-[#FAF6F0]"
          >
            {leg.mode === 'taxi' ? `🚕 ${t('getRide')}` : t('getDirections')}
          </a>
        )}
      </div>
      {hasDrawer && (
        <div>
          <button
            type="button"
            className="min-h-8 text-[11px] font-semibold text-slate-500"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {t('transitDetails')}
          </button>
          {open ? (
            <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
              {hop}
              {leg.detail && hop && !leg.detail.includes(hop) ? ` · ${leg.detail}` : null}
              {leg.detail && !hop ? leg.detail : null}
            </p>
          ) : null}
        </div>
      )}
    </div>
  )
}
