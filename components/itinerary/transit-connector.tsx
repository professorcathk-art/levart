'use client'

import { useLocale } from '@/components/i18n/locale-provider'
import { TRANSIT_ICONS, mapsDirectionsUrl, type TransitLeg } from '@/lib/trips/transit'
import { useTripView } from '@/components/itinerary/trip-view-provider'
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
  const { viewStyle } = useTripView()
  const concise = viewStyle === 'concise'
  const showLabel = Boolean(leg.label) && !/^(walk|local transit)(?:\s|$)/i.test(leg.label.trim())
  const details = [leg.duration, leg.fare]
    .filter((part): part is string => Boolean(part))
    .filter((part) => (showLabel ? !leg.label.includes(part) : true))
    .join(' · ')

  return (
    <div className={`relative flex items-stretch gap-3 ${concise ? 'py-1 pl-1' : 'py-2 pl-1'}`}>
      <div className="flex w-8 flex-col items-center" aria-hidden>
        <div className="w-px flex-1 bg-[#FF9A76]/30" />
        <span className="text-base leading-none">{TRANSIT_ICONS[leg.mode]}</span>
        <div className="w-px flex-1 bg-[#FF9A76]/30" />
      </div>
      <div
        className={`flex min-w-0 flex-1 flex-wrap items-center justify-between gap-2 rounded-2xl px-3 py-2 text-sm ${
          viewStyle === 'handbook'
            ? 'border border-dashed border-[#E8DFD1] bg-[#FFFDF9] text-[#6B5E4F]'
            : 'bg-[#FFF8F3] text-gray-600'
        }`}
      >
        <p className="min-w-0">
          <span className="font-semibold text-[#1A1A1A]">{t(MODE_KEYS[leg.mode])}</span>
          {showLabel ? <span> · {leg.label}</span> : null}
          {details ? <span className="text-gray-500"> · {details}</span> : null}
        </p>
        <a
          href={mapsDirectionsUrl(fromQuery, toQuery, leg.mode)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full bg-white px-3 text-xs font-semibold text-[#FF9A76] shadow-sm ring-1 ring-[#FF9A76]/20"
        >
          {t('getDirections')}
        </a>
      </div>
    </div>
  )
}
