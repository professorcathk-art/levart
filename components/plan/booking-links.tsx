'use client'

import { useEffect, useState } from 'react'
import { useLocale } from '@/components/i18n/locale-provider'

interface BookingLinksProps {
  destination: string
  checkIn?: string | null
  checkOut?: string | null
  tripId?: string
}

interface AffiliateConfig {
  allianceId: string
  sid: string
  tripSub1: string
  tripSub3?: string
}

export function BookingLinks({ destination, checkIn, checkOut, tripId }: BookingLinksProps) {
  const { t } = useLocale()
  const [config, setConfig] = useState<AffiliateConfig | null>(null)
  const start = checkIn || new Date().toISOString().split('T')[0]
  const end = checkOut || start

  useEffect(() => {
    fetch('/api/affiliate/config')
      .then((res) => res.json())
      .then((data) => {
        if (data.allianceId && data.sid && data.tripSub1) {
          setConfig({
            allianceId: data.allianceId,
            sid: data.sid,
            tripSub1: data.tripSub1,
            tripSub3: data.tripSub3,
          })
        }
      })
      .catch((error) => console.error('Failed to load affiliate config:', error))
  }, [])

  const suffix = config
    ? `&Allianceid=${config.allianceId}&SID=${config.sid}&trip_sub1=${config.tripSub1}${
        config.tripSub3 ? `&trip_sub3=${config.tripSub3}` : ''
      }`
    : ''

  const logClick = (clickType: 'hotel' | 'flight') => {
    fetch('/api/affiliate/click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clickType, destination, tripId }),
    }).catch((error) => console.error('Failed to log affiliate click:', error))
  }

  return (
    <section className="rounded-3xl bg-white p-6 shadow-lg">
      <h3 className="mb-4 text-2xl font-bold text-[#FF9A76]">{t('mapTabBooking')}</h3>
      <div className="grid gap-4 md:grid-cols-2">
        <a
          href={`https://www.trip.com/hotels?city=${encodeURIComponent(destination)}&checkIn=${start}&checkOut=${end}${suffix}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => logClick('hotel')}
          className="rounded-xl bg-gradient-to-r from-[#FF9A76] to-[#FFB86C] px-6 py-4 text-center font-semibold text-white"
        >
          {t('bookHotels')}
        </a>
        <a
          href={`https://www.trip.com/flights?to=${encodeURIComponent(destination)}&departureDate=${start}${suffix}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => logClick('flight')}
          className="rounded-xl bg-gradient-to-r from-[#7ECCC4] to-[#87CEEB] px-6 py-4 text-center font-semibold text-white"
        >
          {t('bookFlights')}
        </a>
      </div>
    </section>
  )
}
