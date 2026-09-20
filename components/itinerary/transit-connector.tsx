'use client'

import { useLocale } from '@/components/i18n/locale-provider'
import { TRANSIT_ICONS, mapsDirectionsUrl, type TransitLeg } from '@/lib/trips/transit'
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
  leg: TransitLeg
}

export function TransitConnector({ fromQuery, toQuery, leg }: TransitConnectorProps) {
  const { t } = useLocale()
  const showLabel = Boolean(leg.label) && !/^(walk|local transit)(?:\s|$)/i.test(leg.label.trim())
  const details = [leg.duration, leg.fare]
    .filter((part): part is string => Boolean(part))
    .filter((part) => (showLabel ? !leg.label.includes(part) : true))
    .join(' · ')

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 py-1 text-xs text-slate-500">
      <p className="min-w-0">
        <span aria-hidden className="mr-1.5">
          {TRANSIT_ICONS[leg.mode]}
        </span>
        <span className="font-semibold text-slate-600">{t(MODE_KEYS[leg.mode])}</span>
        {showLabel ? <span> · {leg.label}</span> : null}
        {details ? <span> · {details}</span> : null}
      </p>
      <a
        href={mapsDirectionsUrl(fromQuery, toQuery, leg.mode)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-9 items-center rounded-full px-2.5 font-semibold text-slate-600 ring-1 ring-slate-200 hover:bg-white"
      >
        {leg.mode === 'taxi' ? `🚕 ${t('getRide')}` : t('getDirections')}
      </a>
    </div>
  )
}
