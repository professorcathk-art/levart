'use client'

import { useEffect, useState } from 'react'
import { Hotel } from 'lucide-react'
import { useLocale } from '@/components/i18n/locale-provider'
import { IconBadge } from '@/components/ui/icon-badge'

interface BookingLinksProps {
  destination: string
  checkIn?: string | null
  checkOut?: string | null
  tripId?: string
  variant?: 'panel' | 'compact'
}

interface AffiliateConfig {
  allianceId: string
  sid: string
  tripSub1: string
  tripSub3?: string
}

let cachedAffiliate: AffiliateConfig | null | undefined

function useAffiliateConfig() {
  const [config, setConfig] = useState<AffiliateConfig | null>(cachedAffiliate ?? null)

  useEffect(() => {
    if (cachedAffiliate !== undefined) {
      setConfig(cachedAffiliate)
      return
    }

    fetch('/api/affiliate/config')
      .then((res) => res.json())
      .then((data) => {
        const next =
          data.allianceId && data.sid && data.tripSub1
            ? {
                allianceId: data.allianceId as string,
                sid: data.sid as string,
                tripSub1: data.tripSub1 as string,
                tripSub3: data.tripSub3 as string | undefined,
              }
            : null
        cachedAffiliate = next
        setConfig(next)
      })
      .catch((error) => {
        cachedAffiliate = null
        console.error('Failed to load affiliate config:', error)
      })
  }, [])

  return config
}

function affiliateSuffix(config: AffiliateConfig | null) {
  if (!config) return ''
  return `&Allianceid=${config.allianceId}&SID=${config.sid}&trip_sub1=${config.tripSub1}${
    config.tripSub3 ? `&trip_sub3=${config.tripSub3}` : ''
  }`
}

function logAffiliateClick(
  clickType: 'hotel' | 'flight',
  destination: string,
  tripId?: string
) {
  fetch('/api/affiliate/click', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clickType, destination, tripId }),
  }).catch((error) => console.error('Failed to log affiliate click:', error))
}

export function StayBookLink({
  destination,
  checkIn,
  checkOut,
  tripId,
}: {
  destination: string
  checkIn?: string | null
  checkOut?: string | null
  tripId?: string
}) {
  const { t } = useLocale()
  const config = useAffiliateConfig()
  const start = checkIn || new Date().toISOString().split('T')[0]
  const end = checkOut || start

  return (
    <span onClick={() => logAffiliateClick('hotel', destination, tripId)}>
      <IconBadge
        icon={Hotel}
        href={`https://www.trip.com/hotels?city=${encodeURIComponent(destination)}&checkIn=${start}&checkOut=${end}${affiliateSuffix(config)}`}
      >
        {t('bookStay')}
      </IconBadge>
    </span>
  )
}

export function BookingLinks({
  destination,
  checkIn,
  checkOut,
  tripId,
  variant = 'panel',
}: BookingLinksProps) {
  const { t } = useLocale()
  const config = useAffiliateConfig()
  const start = checkIn || new Date().toISOString().split('T')[0]
  const end = checkOut || start
  const suffix = affiliateSuffix(config)
  const compact = variant === 'compact'

  return (
    <section
      className={
        compact
          ? 'rounded-xl border border-slate-100 bg-white p-4 shadow-sm'
          : 'rounded-3xl bg-white p-6 shadow-lg'
      }
    >
      <h3 className={`font-bold text-[#E07A5F] ${compact ? 'mb-3 text-sm' : 'mb-4 text-2xl'}`}>
        {t('mapTabBooking')}
      </h3>
      <div className={`grid gap-2 ${compact ? 'grid-cols-2' : 'gap-4 md:grid-cols-2'}`}>
        <a
          href={`https://www.trip.com/hotels?city=${encodeURIComponent(destination)}&checkIn=${start}&checkOut=${end}${suffix}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => logAffiliateClick('hotel', destination, tripId)}
          className={`text-center font-semibold text-white ${
            compact
              ? 'rounded-lg bg-[#E07A5F] px-3 py-2 text-xs'
              : 'rounded-xl bg-gradient-to-r from-[#FF9A76] to-[#FFB86C] px-6 py-4'
          }`}
        >
          {t('bookHotels')}
        </a>
        <a
          href={`https://www.trip.com/flights?to=${encodeURIComponent(destination)}&departureDate=${start}${suffix}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => logAffiliateClick('flight', destination, tripId)}
          className={`text-center font-semibold text-white ${
            compact
              ? 'rounded-lg bg-[#7ECCC4] px-3 py-2 text-xs'
              : 'rounded-xl bg-gradient-to-r from-[#7ECCC4] to-[#87CEEB] px-6 py-4'
          }`}
        >
          {t('bookFlights')}
        </a>
      </div>
    </section>
  )
}
