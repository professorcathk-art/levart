'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import type { DayItinerary } from '@/types'
import { PawPrint } from '../paw-print'

interface EnhancedDayCardProps {
  day: DayItinerary
  destination: string
  dayIndex: number
}

const activityIcons: Record<string, string> = {
  attraction: '🎯',
  restaurant: '🍽️',
  shopping: '🛍️',
  nightlife: '🌃',
  nature: '🏞️',
  culture: '🎭',
}

const weatherIcons: Record<string, string> = {
  clear: '☀️',
  'partly-cloudy': '⛅',
  cloudy: '☁️',
  rain: '🌧️',
  snow: '❄️',
  thunderstorm: '⛈️',
}

const difficultyColors = {
  easy: 'bg-green-100 text-green-800 border-green-300',
  moderate: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  hard: 'bg-red-100 text-red-800 border-red-300',
}

const crowdLevelColors = {
  low: 'text-green-600',
  medium: 'text-yellow-600',
  high: 'text-red-600',
}

const typeColors: Record<string, string> = {
  attraction: 'bg-blue-100 text-blue-800 border-blue-300',
  restaurant: 'bg-[#FF9A76]/20 text-[#FF9A76] border-[#FF9A76]/30',
  shopping: 'bg-pink-100 text-pink-800 border-pink-300',
  nightlife: 'bg-purple-100 text-purple-800 border-purple-300',
  nature: 'bg-green-100 text-green-800 border-green-300',
  culture: 'bg-indigo-100 text-indigo-800 border-indigo-300',
  rest: 'bg-teal-100 text-teal-800 border-teal-300',
}

export function EnhancedDayCard({ day, destination, dayIndex }: EnhancedDayCardProps) {
  const [destinationPhoto, setDestinationPhoto] = useState<string | null>(null)
  const [loadingPhotos, setLoadingPhotos] = useState(true)

  useEffect(() => {
    // Fetch destination photo using Google Places Photos
    fetch(`/api/photos/search?q=${encodeURIComponent(destination)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.photo) {
          setDestinationPhoto(data.photo)
        } else if (data.placeholder) {
          setDestinationPhoto(data.placeholder)
        }
        setLoadingPhotos(false)
      })
      .catch(() => setLoadingPhotos(false))
  }, [destination])

  const getActivityPhoto = async (activityName: string) => {
    try {
      const res = await fetch(`/api/photos/search?q=${encodeURIComponent(activityName)}`)
      const data = await res.json()
      return data.photo || data.placeholder || null
    } catch {
      return null
    }
  }

  const totalCost = day.activities.reduce((sum, act) => {
    const cost = act.cost ? parseFloat(act.cost.replace(/[^0-9.]/g, '')) : 0
    return sum + cost
  }, 0)

  const totalDistance = day.totalDistance || day.activities.reduce((sum, act) => {
    const dist = act.distance ? parseFloat(act.distance.replace(/[^0-9.]/g, '')) : 0
    return sum + dist
  }, 0)

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8 print:break-after-page print:mb-0">
      {/* Day Header with Destination Photo */}
      <div className="relative h-64 md:h-80 overflow-hidden bg-gradient-to-br from-[#FF9A76] to-[#7ECCC4]">
        {destinationPhoto && (
          <Image
            src={destinationPhoto}
            alt={destination}
            fill
            className="object-cover opacity-80"
            priority={dayIndex === 0}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        
        {/* Day Number & Date */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
          <div className="flex items-center gap-3 mb-2">
            <PawPrint size={40} color="#FFFFFF" opacity={0.6} />
            <h2 className="text-4xl md:text-5xl font-bold">
              Day {day.day}
            </h2>
          </div>
          <p className="text-xl md:text-2xl opacity-90">{day.date}</p>
          
          {/* Weather */}
          {day.weather && (
            <div className="mt-4 flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 w-fit">
              <span className="text-2xl">
                {weatherIcons[day.weather.condition] || '🌤️'}
              </span>
              <span className="font-semibold">
                {day.weather.temperature}°C - {day.weather.description}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Daily Summary Card */}
      <div className="p-6 bg-gradient-to-r from-[#FFF8F3] to-[#FFE8E0] border-b-2 border-[#FF9A76]/20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl mb-1">💰</div>
            <div className="text-sm text-gray-600">Total Cost</div>
            <div className="text-lg font-bold text-[#FF9A76]">
              ${totalCost.toFixed(0)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">🚶</div>
            <div className="text-sm text-gray-600">Distance</div>
            <div className="text-lg font-bold text-[#7ECCC4]">
              {totalDistance.toFixed(1)} km
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">⏱️</div>
            <div className="text-sm text-gray-600">Duration</div>
            <div className="text-lg font-bold text-[#FFB86C]">
              {day.totalDuration ? `${Math.round(day.totalDuration / 60)}h` : 'Full Day'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">📊</div>
            <div className="text-sm text-gray-600">Difficulty</div>
            <div className={`text-xs font-semibold px-2 py-1 rounded-full inline-block ${
              difficultyColors[day.difficulty || 'easy']
            }`}>
              {(day.difficulty || 'easy').toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      {/* Activities */}
      <div className="p-6 space-y-6">
        {day.activities.map((activity, index) => (
          <ActivityCard key={index} activity={activity} index={index} />
        ))}

        {/* Restaurants Section */}
        {day.restaurants.length > 0 && (
          <div className="mt-8 pt-6 border-t-2 border-[#FF9A76]/20">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span>🍽️</span>
              <span>Restaurants</span>
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {day.restaurants.map((restaurant, index) => (
                <RestaurantCard key={index} restaurant={restaurant} />
              ))}
            </div>
          </div>
        )}

        {/* Transport */}
        {day.transport.length > 0 && (
          <div className="mt-6 pt-6 border-t-2 border-[#FF9A76]/20">
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
              <span>🚇</span>
              <span>Transportation</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {day.transport.map((method, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-[#7ECCC4]/20 text-[#7ECCC4] rounded-full text-sm font-medium"
                >
                  {method}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function ActivityCard({ activity, index }: { activity: any; index: number }) {
  const [photo, setPhoto] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/photos/search?q=${encodeURIComponent(activity.activity)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.photo) {
          setPhoto(data.photo)
        } else if (data.placeholder) {
          setPhoto(data.placeholder)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [activity.activity])

  const timeLabels = {
    morning: '6 AM - 12 PM',
    afternoon: '12 PM - 6 PM',
    evening: '6 PM - 11 PM',
  }

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-[#FF9A76]/20">
      {/* Photo */}
      <div className="relative h-48 md:h-64 bg-gradient-to-br from-[#FF9A76] to-[#7ECCC4]">
        {photo ? (
          <Image
            src={photo}
            alt={activity.activity}
            fill
            className="object-cover"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-30">
            {activityIcons[activity.type || 'attraction'] || '🎯'}
          </div>
        )}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {activity.popular && (
            <span className="px-3 py-1 bg-[#FF9A76] text-white rounded-full text-xs font-bold">
              ⭐ Popular
            </span>
          )}
          {activity.free && (
            <span className="px-3 py-1 bg-green-500 text-white rounded-full text-xs font-bold">
              🆓 Free
            </span>
          )}
          {activity.accessibility && (
            <span className="px-3 py-1 bg-blue-500 text-white rounded-full text-xs font-bold">
              ♿ Accessible
            </span>
          )}
        </div>
      </div>

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">
                {activityIcons[activity.type || 'attraction'] || '🎯'}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                typeColors[activity.type || 'attraction'] ?? typeColors.attraction
              }`}>
                {activity.type || 'attraction'}
              </span>
              <span className="text-sm text-gray-500 font-medium">
                {timeLabels[activity.time] || activity.time}
              </span>
            </div>
            <h4 className="text-2xl font-bold text-gray-800 mb-2">
              {activity.activity}
            </h4>
          </div>
        </div>

        {/* Description */}
        {activity.location && (
          <p className="text-gray-600 mb-4">{activity.location}</p>
        )}

        {/* Details Row */}
        <div className="flex flex-wrap gap-4 mb-4 text-sm">
          {activity.duration && (
            <div className="flex items-center gap-1 text-gray-600">
              <span>⏱️</span>
              <span className="font-medium">{activity.duration}</span>
            </div>
          )}
          {activity.cost && (
            <div className="flex items-center gap-1 text-[#FF9A76]">
              <span>💰</span>
              <span className="font-bold">{activity.cost}</span>
            </div>
          )}
          {activity.distance && (
            <div className="flex items-center gap-1 text-[#7ECCC4]">
              <span>🚶</span>
              <span className="font-medium">{activity.distance} away</span>
            </div>
          )}
          {activity.crowdLevel && (
            <div className={`flex items-center gap-1 font-medium ${crowdLevelColors[activity.crowdLevel]}`}>
              <span>👥</span>
              <span>{activity.crowdLevel} crowds</span>
            </div>
          )}
        </div>

        {/* Address */}
        {activity.address && (
          <div className="mb-4 text-sm text-gray-500">
            📍 {activity.address}
          </div>
        )}

        {/* Opening Hours */}
        {activity.openingHours && (
          <div className="mb-4 text-sm text-gray-600">
            🕐 {activity.openingHours}
          </div>
        )}

        {/* Tips */}
        {activity.tips && activity.tips.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="text-sm font-semibold text-gray-700 mb-2">💡 Pro Tips:</div>
            <ul className="space-y-1 text-sm text-gray-600">
              {activity.tips.map((tip: string, i: number) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[#FFB86C]">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Nearby Alternatives */}
        {activity.nearbyAlternatives && activity.nearbyAlternatives.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="text-sm font-semibold text-gray-700 mb-2">🔀 Nearby Alternatives:</div>
            <div className="flex flex-wrap gap-2">
              {activity.nearbyAlternatives.map((alt: string, i: number) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                >
                  {alt}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function RestaurantCard({ restaurant }: { restaurant: any }) {
  const [photo, setPhoto] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/photos/search?q=${encodeURIComponent(restaurant.name + ' restaurant')}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.photo) {
          setPhoto(data.photo)
        } else if (data.placeholder) {
          setPhoto(data.placeholder)
        }
      })
      .catch(() => {})
  }, [restaurant.name])

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow border-2 border-[#FF9A76]/20">
      {photo && (
        <div className="relative h-32">
          <Image
            src={photo}
            alt={restaurant.name}
            fill
            className="object-cover"
            loading="lazy"
          />
        </div>
      )}
      <div className="p-4">
        <h4 className="font-bold text-lg mb-1">{restaurant.name}</h4>
        {restaurant.cuisine && (
          <p className="text-sm text-gray-600 mb-2">{restaurant.cuisine}</p>
        )}
        {restaurant.cost && (
          <p className="text-sm font-semibold text-[#FF9A76]">{restaurant.cost}</p>
        )}
        {restaurant.address && (
          <p className="text-xs text-gray-500 mt-2">📍 {restaurant.address}</p>
        )}
      </div>
    </div>
  )
}
