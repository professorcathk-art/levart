'use client'

import { useState } from 'react'
import { AuthPrompt } from '@/components/auth/auth-prompt'

interface RatingControlProps {
  tripId: string
  slug: string
  signedIn: boolean
  initialStars?: number | null
  avgRating: number
  ratingCount: number
}

export function RatingControl({
  tripId,
  slug,
  signedIn,
  initialStars,
  avgRating,
  ratingCount,
}: RatingControlProps) {
  const [stars, setStars] = useState(initialStars ?? 0)
  const [average, setAverage] = useState(avgRating)
  const [count, setCount] = useState(ratingCount)
  const [authOpen, setAuthOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const rate = async (value: number) => {
    if (!signedIn) {
      setAuthOpen(true)
      return
    }

    const previous = stars
    setStars(value)
    setError(null)
    const response = await fetch('/api/ratings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tripId, stars: value }),
    })
    if (!response.ok) {
      setStars(previous)
      const payload = (await response.json().catch(() => ({}))) as { error?: string }
      setError(payload.error || 'Could not save rating')
      return
    }
    if (!previous) {
      setAverage(((average * count) + value) / (count + 1))
      setCount(count + 1)
    } else {
      setAverage(((average * count) - previous + value) / count)
    }
  }

  return (
    <section className="rounded-3xl bg-white p-6 shadow">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#1A1A1A]">Rate this plan</h2>
          <p className="text-sm text-gray-500">
            {average.toFixed(1)} average from {count} {count === 1 ? 'rating' : 'ratings'}
          </p>
        </div>
        <div className="flex gap-1" role="group" aria-label="Star rating">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => rate(value)}
              className={`text-2xl ${value <= stars ? 'text-[#FFB86C]' : 'text-gray-300'}`}
              aria-label={`${value} star${value === 1 ? '' : 's'}`}
            >
              ★
            </button>
          ))}
        </div>
      </div>
      {error && (
        <p className="mt-3 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      <AuthPrompt
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        title="Sign in to rate"
        description="Ratings help other travelers find great plans."
        nextPath={`/p/${slug}`}
      />
    </section>
  )
}
