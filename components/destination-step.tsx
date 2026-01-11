'use client'

import { useState } from 'react'
import type { TripFocus } from '@/types'

const TRIP_FOCUS_OPTIONS: { value: TripFocus; label: string }[] = [
  { value: 'shopping', label: 'Shopping' },
  { value: 'food', label: 'Food' },
  { value: 'climbing', label: 'Climbing' },
  { value: 'culture', label: 'Culture' },
  { value: 'nightlife', label: 'Nightlife' },
  { value: 'beach', label: 'Beach' },
  { value: 'family', label: 'Family' },
]

interface DestinationStepProps {
  onSubmit: (
    destination: string,
    focus: TripFocus[],
    checkIn: string,
    checkOut: string,
    days: number
  ) => void
}

export function DestinationStep({ onSubmit }: DestinationStepProps) {
  const [destination, setDestination] = useState('')
  const [selectedFocus, setSelectedFocus] = useState<TripFocus[]>([])
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [dayCount, setDayCount] = useState(3)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!destination || selectedFocus.length === 0) {
      alert('Please select a destination and at least one trip focus')
      return
    }
    onSubmit(destination, selectedFocus, checkIn, checkOut, dayCount)
  }

  const toggleFocus = (focus: TripFocus) => {
    setSelectedFocus((prev) =>
      prev.includes(focus)
        ? prev.filter((f) => f !== focus)
        : [...prev, focus]
    )
  }

  const handleDateChange = (startDate: string) => {
    setCheckIn(startDate)
    if (startDate && dayCount > 0) {
      const endDate = new Date(startDate)
      endDate.setDate(endDate.getDate() + dayCount - 1)
      setCheckOut(endDate.toISOString().split('T')[0])
    }
  }

  const handleDayCountChange = (days: number) => {
    setDayCount(days)
    if (checkIn) {
      const endDate = new Date(checkIn)
      endDate.setDate(endDate.getDate() + days - 1)
      setCheckOut(endDate.toISOString().split('T')[0])
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
      <h2 className="text-2xl font-bold mb-6">Plan Your Trip</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="destination" className="block text-sm font-medium mb-2">
            Destination
          </label>
          <input
            id="destination"
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="e.g. Tokyo, Bangkok, Seoul"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Trip Focus (select multiple)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {TRIP_FOCUS_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => toggleFocus(option.value)}
                className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                  selectedFocus.includes(option.value)
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="checkIn" className="block text-sm font-medium mb-2">
              Check-in Date
            </label>
            <input
              id="checkIn"
              type="date"
              value={checkIn}
              onChange={(e) => handleDateChange(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="dayCount" className="block text-sm font-medium mb-2">
              Number of Days
            </label>
            <input
              id="dayCount"
              type="number"
              min="1"
              max="14"
              value={dayCount}
              onChange={(e) => handleDayCountChange(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="checkOut" className="block text-sm font-medium mb-2">
              Check-out Date
            </label>
            <input
              id="checkOut"
              type="date"
              value={checkOut}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Find Attractions
        </button>
      </form>
    </div>
  )
}
