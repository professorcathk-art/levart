'use client'

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
  const hop = [leg.from || fromQuery, leg.to || toQuery].filter(Boolean).join(' → ')
  const rawLabel = leg.label.trim()
  const showLabel =
    Boolean(rawLabel) &&
    !/^(walk|local transit)(?:\s|$)/i.test(rawLabel) &&
    rawLabel !== hop &&
    !rawLabel.includes(hop)
  const details = [leg.duration, leg.fare]
    .filter((part): part is string => Boolean(part))
    .filter((part) => (showLabel ? !rawLabel.includes(part) : true))
    .join(' · ')
  const route = mapsRouteQueries(fromQuery, toQuery, destination)

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 py-1 text-xs text-slate-500">
      <p className="min-w-0">
        <span aria-hidden className="mr-1.5">
          {TRANSIT_ICONS[leg.mode]}
        </span>
        <span className="font-semibold text-slate-600">{t(MODE_KEYS[leg.mode])}</span>
        {hop ? <span> · {hop}</span> : null}
        {showLabel ? <span> · {rawLabel}</span> : null}
        {details ? <span> · {details}</span> : null}
      </p>
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
  )
}
