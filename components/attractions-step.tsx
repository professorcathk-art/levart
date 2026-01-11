'use client'

import { useState, useEffect } from 'react'
import type { Attraction, TripFocus } from '@/types'

interface AttractionsStepProps {
  destination: string
  tripFocus: TripFocus[]
  travelRadius?: number
  onSubmit: (attractions: Attraction[], selected: Attraction[]) => void
  onBack: () => void
}

export function AttractionsStep({
  destination,
  tripFocus,
  travelRadius = 20,
  onSubmit,
  onBack,
}: AttractionsStepProps) {
  const [attractions, setAttractions] = useState<Attraction[]>([])
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true) // Start with loading true
  const [error, setError] = useState<string | null>(null)

  // Fetch attractions automatically when component mounts
  useEffect(() => {
    fetchAttractions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only run once on mount

  const fetchAttractions = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/attractions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destination, focus: tripFocus, travelRadius }),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch attractions')
      }

      const data = await response.json()
      const attractionsList = data.attractions || []
      
      if (attractionsList.length === 0 && data.error) {
        setError(`No attractions found. ${data.error}`)
      } else {
        setAttractions(attractionsList)
        // Auto-select first 10 attractions
        const autoSelected = new Set<string>(
          attractionsList.slice(0, 10).map((a: Attraction) => a.id)
        )
        setSelectedIds(autoSelected)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const handleSubmit = () => {
    const selected = attractions.filter((a) => selectedIds.has(a.id))
    if (selected.length === 0) {
      alert('Please select at least one attraction')
      return
    }
    onSubmit(attractions, selected)
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Finding attractions...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-red-600 mb-4">Error: {error}</div>
        <button
          onClick={fetchAttractions}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Select Attractions</h2>
        <button
          onClick={onBack}
          className="text-gray-600 hover:text-gray-900"
        >
          ← Back
        </button>
      </div>

      <p className="text-gray-600 mb-4">
        Found {attractions.length} attractions in {destination}. Select the ones
        you&apos;d like to visit.
      </p>

      <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
        {attractions.map((attraction) => (
          <label
            key={attraction.id}
            className="flex items-start p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selectedIds.has(attraction.id)}
              onChange={() => toggleSelection(attraction.id)}
              className="mt-1 mr-3"
            />
            <div className="flex-1">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="font-semibold">{attraction.name}</div>
                  <div className="text-sm text-gray-500">{attraction.category}</div>
                </div>
                {attraction.rating && (
                  <div className="flex items-center gap-1 text-sm">
                    <span className="text-yellow-500">⭐</span>
                    <span className="font-semibold">{attraction.rating.toFixed(1)}</span>
                    {attraction.userRatingsTotal && (
                      <span className="text-gray-500 text-xs">
                        ({attraction.userRatingsTotal.toLocaleString()})
                      </span>
                    )}
                  </div>
                )}
              </div>
              {attraction.address && (
                <div className="text-xs text-gray-400 mt-1">{attraction.address}</div>
              )}
              {attraction.priceLevel !== undefined && (
                <div className="text-xs text-gray-500 mt-1">
                  Price: {'$'.repeat(attraction.priceLevel + 1)}
                  {attraction.priceLevel === 0 && ' (Free)'}
                </div>
              )}
              {attraction.openingHours && attraction.openingHours.length > 0 && (
                <div className="text-xs text-gray-500 mt-1">
                  {attraction.openingHours[0]}
                </div>
              )}
            </div>
          </label>
        ))}
      </div>

      <div className="flex gap-4">
        <button
          onClick={onBack}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700"
        >
          Generate Itinerary ({selectedIds.size} selected)
        </button>
      </div>
    </div>
  )
}
