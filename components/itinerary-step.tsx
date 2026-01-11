'use client'

import { useState, useEffect } from 'react'
import { MapComponent } from '@/components/map-component'
import { EnhancedDayCard } from '@/components/itinerary/enhanced-day-card'
import { PDFExport } from '@/components/itinerary/pdf-export'
import type { Attraction, TripFocus, Itinerary, TripPreferences } from '@/types'

interface ItineraryStepProps {
  destination: string
  tripFocus: TripFocus[]
  selectedAttractions: Attraction[]
  checkIn: string
  checkOut: string
  dayCount: number
  preferences?: TripPreferences
  onItineraryGenerated: (itinerary: Itinerary) => void
  itinerary: Itinerary | null
  onBack: () => void
}

export function ItineraryStep({
  destination,
  tripFocus,
  selectedAttractions,
  checkIn,
  checkOut,
  dayCount,
  preferences,
  onItineraryGenerated,
  itinerary,
  onBack,
}: ItineraryStepProps) {
  const [loading, setLoading] = useState(!itinerary)
  const [error, setError] = useState<string | null>(null)
  const [affiliateConfig, setAffiliateConfig] = useState<{
    allianceId: string
    sid: string
    tripSub1: string
    tripSub3?: string
  } | null>(null)

  const generateItinerary = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/itinerary/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination,
          tripFocus,
          selectedAttractions,
          checkIn,
          dayCount,
          preferences,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.error || `HTTP ${response.status}: Failed to generate itinerary`
        throw new Error(errorMessage)
      }

      const data = await response.json()
      if (data.error) {
        throw new Error(data.error)
      }
      
      const generatedItinerary = data.itinerary
      if (!generatedItinerary) {
        throw new Error('No itinerary data returned from server')
      }
      
      // Save itinerary to Supabase
      try {
        await fetch('/api/itinerary/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            destination,
            tripFocus,
            selectedAttractions,
            routeData: generatedItinerary.route,
            finalItinerary: generatedItinerary,
            checkIn,
            checkOut: checkIn, // Can be calculated from checkIn + dayCount
          }),
        })
      } catch (err) {
        console.error('Failed to save itinerary:', err)
        // Don't block the UI if save fails
      }
      
      onItineraryGenerated(generatedItinerary)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Fetch affiliate config
    fetch('/api/affiliate/config')
      .then((res) => res.json())
      .then((data) => {
        if (data.allianceId && data.sid && data.tripSub1) {
          setAffiliateConfig({
            allianceId: data.allianceId,
            sid: data.sid,
            tripSub1: data.tripSub1,
            tripSub3: data.tripSub3,
          })
        }
      })
      .catch(() => {})

    if (!itinerary) {
      generateItinerary()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleAffiliateClick = async (
    clickType: 'hotel' | 'flight',
    itineraryId?: string
  ) => {
    try {
      await fetch('/api/affiliate/click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itineraryId,
          clickType,
          destination,
        }),
      })
    } catch (err) {
      console.error('Failed to log affiliate click:', err)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Generating your itinerary...</p>
        <p className="mt-2 text-sm text-gray-500">
          This may take a moment
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-red-600 mb-4">Error: {error}</div>
        <button
          onClick={generateItinerary}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Retry
        </button>
      </div>
    )
  }

  if (!itinerary) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold text-[#FF9A76]">{destination}</h2>
            <p className="text-gray-600 text-lg">
              {dayCount} days • {checkIn}
            </p>
          </div>
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            ← Back
          </button>
        </div>

        {/* Map */}
        <div className="mb-6 rounded-xl overflow-hidden shadow-md">
          <MapComponent
            attractions={selectedAttractions}
            routePolyline={itinerary.route.polyline}
          />
        </div>
      </div>

      {/* Enhanced Itinerary Display */}
      <div className="space-y-8">
        {itinerary.days.map((day, index) => (
          <EnhancedDayCard
            key={day.day}
            day={day}
            destination={destination}
            dayIndex={index}
          />
        ))}
      </div>

      {/* PDF Export Component */}
      <PDFExport itinerary={itinerary} />

      {/* Booking CTAs */}
      <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 mt-8">
        <h3 className="text-2xl font-bold mb-6 text-[#FF9A76]">Book Your Trip</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href={
              affiliateConfig
                ? `https://www.trip.com/hotels?city=${encodeURIComponent(destination)}&checkIn=${checkIn}&checkOut=${checkOut || checkIn}&Allianceid=${affiliateConfig.allianceId}&SID=${affiliateConfig.sid}&trip_sub1=${affiliateConfig.tripSub1}${affiliateConfig.tripSub3 ? `&trip_sub3=${affiliateConfig.tripSub3}` : ''}`
                : `https://www.trip.com/hotels?city=${encodeURIComponent(destination)}&checkIn=${checkIn}&checkOut=${checkOut || checkIn}`
            }
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleAffiliateClick('hotel')}
            className="block px-6 py-4 bg-gradient-to-r from-[#FF9A76] to-[#FFB86C] text-white rounded-xl text-center font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            🏨 Book Hotels on Trip.com
          </a>
          <a
            href={
              affiliateConfig
                ? `https://www.trip.com/flights?to=${encodeURIComponent(destination)}&departureDate=${checkIn}&Allianceid=${affiliateConfig.allianceId}&SID=${affiliateConfig.sid}&trip_sub1=${affiliateConfig.tripSub1}${affiliateConfig.tripSub3 ? `&trip_sub3=${affiliateConfig.tripSub3}` : ''}`
                : `https://www.trip.com/flights?to=${encodeURIComponent(destination)}&departureDate=${checkIn}`
            }
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleAffiliateClick('flight')}
            className="block px-6 py-4 bg-gradient-to-r from-[#7ECCC4] to-[#87CEEB] text-white rounded-xl text-center font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            ✈️ Book Flights on Trip.com
          </a>
        </div>
      </div>
    </div>
  )
}
