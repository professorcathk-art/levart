'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ReopenButton } from '@/components/plan/reopen-button'
import { ShareSheet } from '@/components/plan/share-sheet'
import { TripOwnerMenu } from '@/components/plan/trip-owner-menu'
import { TripTags } from '@/components/plan/trip-tags'
import { useLocale } from '@/components/i18n/locale-provider'
import { saveHeroPrompt } from '@/lib/landing/hero-prompt'
import type { Trip } from '@/types'

interface TripHeaderProps {
  trip: Trip
  isOwner?: boolean
  preview?: boolean
}

export function TripHeader({ trip, isOwner = false, preview = false }: TripHeaderProps) {
  const { t } = useLocale()
  const router = useRouter()
  const previewPath = trip.slug ? `/p/${trip.slug}` : `/trips/${trip.id}`
  const remixPrompt = t('remixPrompt', {
    destination: trip.destination,
    days: trip.itinerary.days.length,
  })

  return (
    <header className={`relative overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-[#FF9A76] to-[#7ECCC4] p-4 text-white shadow-xl sm:p-6 md:p-8 ${isOwner ? 'pr-12 sm:pr-14' : ''}`}>
      {isOwner && <TripOwnerMenu tripId={trip.id} />}
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-white/80">
        {trip.status === 'confirmed' ? t('statusConfirmed') : t('statusDraft')}
      </p>
      <h1 className="mt-2 break-words text-2xl font-extrabold sm:text-3xl md:text-5xl">
        {trip.destination || t('untitledTrip')}
      </h1>
      <p className="mt-2 text-sm text-white/90 sm:text-base md:text-lg">
        {t('planDays', { count: trip.itinerary.days.length })}
        {trip.checkIn ? ` • ${trip.checkIn}` : ''}
        {trip.checkOut ? ` – ${trip.checkOut}` : ''}
      </p>
      <p className="mt-2 inline-flex rounded-full bg-white/20 px-3 py-1 text-sm">
        {trip.visibility === 'public'
          ? t('visibilityBadgePublic')
          : trip.visibility === 'unlisted'
            ? t('visibilityBadgeUnlisted')
            : t('visibilityBadgePrivate')}
      </p>
      {trip.owner && (
        <Link href={`/u/${trip.owner.username}`} className="mt-3 inline-block text-sm text-white/90 underline">
          {t('byAuthor', { name: trip.owner.displayName })}
        </Link>
      )}
      <TripTags
        itinerary={{
          destination: trip.destination || trip.itinerary.destination,
          tripFocus: trip.itinerary.tripFocus.length > 0 ? trip.itinerary.tripFocus : trip.tripFocus,
          structuredTags: trip.itinerary.structuredTags,
        }}
      />
      <div className="mt-5 flex flex-wrap gap-2 text-[#2B2D42] sm:mt-6 sm:gap-3">
        {isOwner && trip.status === 'confirmed' && <ReopenButton tripId={trip.id} />}
        {isOwner && trip.status === 'draft' && (
          <Link
            href={`/plan/${trip.id}`}
            className="inline-flex min-h-11 items-center rounded-full bg-white px-5 py-2 font-semibold text-[#E07A5F]"
          >
            {t('keepEditing')}
          </Link>
        )}
        {isOwner && (
          <ShareSheet
            tripId={trip.id}
            destination={trip.destination}
            visibility={trip.visibility}
            slug={trip.slug}
          />
        )}
        {preview && (
          <>
            <Link
              href={`/login?next=${encodeURIComponent(previewPath)}`}
              className="inline-flex min-h-11 items-center rounded-full bg-white px-5 py-2 font-semibold text-[#E07A5F]"
            >
              {t('previewSignIn')}
            </Link>
            <button
              type="button"
              onClick={() => {
                saveHeroPrompt(remixPrompt)
                router.push('/plan')
              }}
              className="inline-flex min-h-11 items-center rounded-full bg-[#2B2D42] px-5 py-2 font-semibold text-white"
            >
              {t('previewRemix')}
            </button>
          </>
        )}
      </div>
      {isOwner && trip.visibility === 'public' && trip.itinerary.publishedCopy && trip.status === 'draft' && (
        <p className="mt-4 rounded-2xl bg-white/90 px-4 py-3 text-sm font-medium text-[#2B2D42]">
          {t('publicSnapshotBanner')}
        </p>
      )}
    </header>
  )
}
