import Link from 'next/link'
import { EnhancedDayCard } from '@/components/itinerary/enhanced-day-card'
import { MapComponent } from '@/components/map-component'
import { PDFExport } from '@/components/itinerary/pdf-export'
import { BookingLinks } from '@/components/plan/booking-links'
import { ShareSheet } from '@/components/plan/share-sheet'
import type { Trip } from '@/types'

interface TripViewProps {
  trip: Trip
  isOwner?: boolean
  showShare?: boolean
}

export function TripView({ trip, isOwner = false, showShare = false }: TripViewProps) {
  return (
    <div className="space-y-8">
      <header className="overflow-hidden rounded-3xl bg-gradient-to-br from-[#FF9A76] to-[#7ECCC4] p-8 text-white shadow-xl">
        <p className="text-sm uppercase tracking-wide text-white/80">
          {trip.status === 'confirmed' ? 'Confirmed plan' : 'Draft'}
        </p>
        <h1 className="mt-2 text-4xl font-bold md:text-5xl">{trip.destination || 'Untitled trip'}</h1>
        <p className="mt-2 text-lg text-white/90">
          {trip.itinerary.days.length} days
          {trip.checkIn ? ` • ${trip.checkIn}` : ''}
          {trip.checkOut ? ` – ${trip.checkOut}` : ''}
        </p>
        {trip.owner && (
          <Link href={`/u/${trip.owner.username}`} className="mt-3 inline-block text-sm text-white/90 underline">
            By {trip.owner.displayName}
          </Link>
        )}
        {(trip.tripFocus ?? []).length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {(trip.tripFocus ?? []).map((focus) => (
              <span key={focus} className="rounded-full bg-white/20 px-3 py-1 text-sm capitalize">
                {focus}
              </span>
            ))}
          </div>
        )}
        <div className="mt-6 flex flex-wrap gap-3">
          {isOwner && trip.status === 'confirmed' && (
            <Link
              href={`/plan/${trip.id}`}
              className="rounded-full bg-white/20 px-5 py-2 font-semibold backdrop-blur"
            >
              Keep editing
            </Link>
          )}
          {isOwner && trip.status === 'draft' && (
            <Link
              href={`/plan/${trip.id}`}
              className="rounded-full bg-white px-5 py-2 font-semibold text-[#FF9A76]"
            >
              Continue chatting
            </Link>
          )}
          {showShare && isOwner && trip.status === 'confirmed' && (
            <ShareSheet
              tripId={trip.id}
              destination={trip.destination}
              visibility={trip.visibility}
              slug={trip.slug}
            />
          )}
        </div>
      </header>

      {(trip.selectedAttractions ?? []).length > 0 && (
        <div className="overflow-hidden rounded-3xl shadow-lg">
          <MapComponent
            attractions={trip.selectedAttractions ?? []}
            routePolyline={trip.route?.polyline || '[]'}
          />
        </div>
      )}

      <div>
        {trip.itinerary.days.map((day, index) => (
          <EnhancedDayCard
            key={day.day}
            day={day}
            destination={trip.destination}
            dayIndex={index}
          />
        ))}
      </div>

      <PDFExport itinerary={trip.itinerary} />
      <BookingLinks
        destination={trip.destination}
        checkIn={trip.checkIn}
        checkOut={trip.checkOut}
        tripId={trip.id}
      />
    </div>
  )
}
