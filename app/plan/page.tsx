'use client'

import { useState } from 'react'
import { DestinationStep } from '@/components/destination-step'
import { AttractionsStep } from '@/components/attractions-step'
import { ItineraryStep } from '@/components/itinerary-step'
import type { Attraction, TripFocus, Itinerary } from '@/types'
import Link from 'next/link'

type Step = 'destination' | 'attractions' | 'itinerary'

export default function PlanPage() {
  const [step, setStep] = useState<Step>('destination')
  const [destination, setDestination] = useState('')
  const [tripFocus, setTripFocus] = useState<TripFocus[]>([])
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [dayCount, setDayCount] = useState(3)
  const [attractions, setAttractions] = useState<Attraction[]>([])
  const [selectedAttractions, setSelectedAttractions] = useState<Attraction[]>([])
  const [itinerary, setItinerary] = useState<Itinerary | null>(null)

  const handleDestinationSubmit = (
    dest: string,
    focus: TripFocus[],
    checkInDate: string,
    checkOutDate: string,
    days: number
  ) => {
    setDestination(dest)
    setTripFocus(focus)
    setCheckIn(checkInDate)
    setCheckOut(checkOutDate)
    setDayCount(days)
    setStep('attractions')
  }

  const handleAttractionsSubmit = (
    fetchedAttractions: Attraction[],
    selected: Attraction[]
  ) => {
    setAttractions(fetchedAttractions)
    setSelectedAttractions(selected)
    setStep('itinerary')
  }

  const handleItineraryGenerated = (generatedItinerary: Itinerary) => {
    setItinerary(generatedItinerary)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#FFF8F3] via-[#FFE8E0] to-[#FFD4C4]">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-[#FF9A76] hover:text-[#7ECCC4] transition-colors">
            ← Levart
          </Link>
        </header>

        <div className="max-w-4xl mx-auto">
          {step === 'destination' && (
            <DestinationStep onSubmit={handleDestinationSubmit} />
          )}
          {step === 'attractions' && (
            <AttractionsStep
              destination={destination}
              tripFocus={tripFocus}
              onSubmit={handleAttractionsSubmit}
              onBack={() => setStep('destination')}
            />
          )}
          {step === 'itinerary' && (
            <ItineraryStep
              destination={destination}
              tripFocus={tripFocus}
              selectedAttractions={selectedAttractions}
              checkIn={checkIn}
              checkOut={checkOut}
              dayCount={dayCount}
              onItineraryGenerated={handleItineraryGenerated}
              itinerary={itinerary}
              onBack={() => setStep('attractions')}
            />
          )}
        </div>
      </div>
    </main>
  )
}
