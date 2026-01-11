'use client'

import { useState, useEffect, useRef } from 'react'
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
  const [checkIn, setCheckIn] = useState(() => {
    // Set default to today
    return new Date().toISOString().split('T')[0]
  })
  const [checkOut, setCheckOut] = useState('')
  const [dayCount, setDayCount] = useState(3)
  const [suggestions, setSuggestions] = useState<Array<{ display: string; formatted: string }>>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // Update checkOut when checkIn or dayCount changes
  useEffect(() => {
    if (checkIn && dayCount > 0) {
      const endDate = new Date(checkIn)
      endDate.setDate(endDate.getDate() + dayCount - 1)
      setCheckOut(endDate.toISOString().split('T')[0])
    }
  }, [checkIn, dayCount])

  // Fetch destination suggestions
  useEffect(() => {
    if (destination.length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    const timeoutId = setTimeout(() => {
      fetch(`/api/destinations/autocomplete?q=${encodeURIComponent(destination)}`)
        .then((res) => res.json())
        .then((data) => {
          setSuggestions(data.suggestions || [])
          setShowSuggestions(true)
        })
        .catch(() => {
          setSuggestions([])
        })
    }, 300) // Debounce 300ms

    return () => clearTimeout(timeoutId)
  }, [destination])

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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
  }

  const handleDayCountChange = (days: number) => {
    setDayCount(days)
  }

  const handleSuggestionClick = (suggestion: { display: string; formatted: string }) => {
    setDestination(suggestion.formatted)
    setShowSuggestions(false)
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
      <h2 className="text-2xl font-bold mb-6">Plan Your Trip</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <label htmlFor="destination" className="block text-sm font-medium mb-2">
            Destination
          </label>
          <input
            ref={inputRef}
            id="destination"
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            onFocus={() => {
              if (suggestions.length > 0) {
                setShowSuggestions(true)
              }
            }}
            placeholder="e.g. Tokyo, Bangkok, Seoul"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            autoComplete="off"
          />
          {showSuggestions && suggestions.length > 0 && (
            <div
              ref={suggestionsRef}
              className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
            >
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                >
                  <div className="font-medium">{suggestion.display}</div>
                </button>
              ))}
            </div>
          )}
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
