'use client'

import Link from 'next/link'
import type { Trip } from '@/types'
import { useLocale } from '@/components/i18n/locale-provider'

interface TripCardProps {
  trip: Trip
}

export function TripCard({ trip }: TripCardProps) {
  const { t } = useLocale()
  return (
    <Link
      href={trip.slug ? `/p/${trip.slug}` : `/trips/${trip.id}`}
      className="block overflow-hidden rounded-3xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="h-32 bg-gradient-to-br from-[#FF9A76] to-[#7ECCC4]" />
      <div className="p-5">
        <h2 className="text-xl font-bold text-[#1A1A1A]">{trip.destination}</h2>
        <p className="mt-1 text-sm text-gray-600">
          {t('planDays', { count: trip.itinerary.days.length })}
          {trip.checkIn ? ` • ${trip.checkIn}` : ''}
        </p>
        {trip.owner && (
          <p className="mt-2 text-sm text-gray-500">{t('byAuthor', { name: trip.owner.displayName })}</p>
        )}
        <div className="mt-3 flex items-center gap-4 text-sm text-gray-600">
          <span>★ {(trip.avgRating ?? 0).toFixed(1)}</span>
          <span>{trip.commentCount ?? 0} {t('comments')}</span>
        </div>
      </div>
    </Link>
  )
}
