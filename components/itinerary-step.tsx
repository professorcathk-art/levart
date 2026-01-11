'use client'

import { useState, useEffect } from 'react'
import { MapComponent } from '@/components/map-component'
import type { Attraction, TripFocus, Itinerary } from '@/types'

interface ItineraryStepProps {
  destination: string
  tripFocus: TripFocus[]
  selectedAttractions: Attraction[]
  checkIn: string
  checkOut: string
  dayCount: number
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
      <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">{destination}</h2>
            <p className="text-gray-600">
              {dayCount} days • {checkIn}
            </p>
          </div>
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-gray-900"
          >
            ← Back
          </button>
        </div>

        <div className="mb-6">
          <MapComponent
            attractions={selectedAttractions}
            routePolyline={itinerary.route.polyline}
          />
        </div>

        <div className="space-y-6">
          {itinerary.days.map((day) => (
            <div
              key={day.day}
              className="border border-gray-200 rounded-lg p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold">Day {day.day}</h3>
                  <p className="text-sm text-gray-500">{day.date}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold">
                    {day.weather.temperature}°C
                  </div>
                  <div className="text-sm text-gray-500">
                    {day.weather.description}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {['morning', 'afternoon', 'evening'].map((time) => {
                  const activities = day.activities.filter(
                    (a) => a.time === time
                  )
                  if (activities.length === 0) return null
                  return (
                    <div key={time}>
                      <h4 className="font-semibold capitalize mb-2">{time}</h4>
                      <ul className="space-y-2 ml-4">
                        {activities.map((activity, idx) => (
                          <li key={idx} className="text-gray-700">
                            <span className="font-medium">{activity.activity}</span>
                            {activity.location && (
                              <span className="text-gray-500">
                                {' '}
                                • {activity.location}
                              </span>
                            )}
                            {activity.duration && (
                              <span className="text-gray-500">
                                {' '}
                                • {activity.duration}
                              </span>
                            )}
                            {activity.cost && (
                              <span className="text-gray-500">
                                {' '}
                                • {activity.cost}
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
                })}

                {day.restaurants.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Restaurants</h4>
                    <ul className="space-y-1 ml-4">
                      {day.restaurants.map((restaurant, idx) => (
                        <li key={idx} className="text-gray-700">
                          {restaurant.name}
                          {restaurant.cuisine && (
                            <span className="text-gray-500">
                              {' '}
                              • {restaurant.cuisine}
                            </span>
                          )}
                          {restaurant.cost && (
                            <span className="text-gray-500">
                              {' '}
                              • {restaurant.cost}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {day.transport.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Transport</h4>
                    <ul className="space-y-1 ml-4">
                      {day.transport.map((t, idx) => (
                        <li key={idx} className="text-gray-700">{t}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {day.estimatedCost && (
                  <div className="pt-2 border-t border-gray-200">
                    <span className="font-semibold">Estimated Cost: </span>
                    <span className="text-gray-700">{day.estimatedCost}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-xl font-bold mb-4">Book Your Trip</h3>
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
              className="block px-6 py-4 bg-blue-600 text-white rounded-lg text-center font-semibold hover:bg-blue-700 transition-colors"
            >
              Book Hotels on Trip.com
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
              className="block px-6 py-4 bg-green-600 text-white rounded-lg text-center font-semibold hover:bg-green-700 transition-colors"
            >
              Book Flights on Trip.com
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
