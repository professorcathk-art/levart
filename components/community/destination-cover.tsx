'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

interface DestinationCoverProps {
  destination: string
  coverPhoto?: string | null
  className?: string
}

const OPTIMIZED_HOSTS = new Set(['maps.googleapis.com', 'images.unsplash.com', 'lh3.googleusercontent.com'])

function canOptimizeCover(src: string) {
  if (src.startsWith('/')) return true
  try {
    return OPTIMIZED_HOSTS.has(new URL(src).hostname)
  } catch {
    return false
  }
}

export function DestinationCover({
  destination,
  coverPhoto,
  className = 'h-32',
}: DestinationCoverProps) {
  const [src, setSrc] = useState<string | null>(coverPhoto ?? null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setFailed(false)
    if (coverPhoto) {
      setSrc(coverPhoto)
      return
    }
    if (!destination) return

    fetch(`/api/photos/search?q=${encodeURIComponent(`${destination} city landmark`)}`)
      .then((res) => res.json())
      .then((data: { photo?: string | null }) => {
        if (data.photo) setSrc(data.photo)
      })
      .catch((error) => console.error('Cover photo lookup failed:', error))
  }, [coverPhoto, destination])

  if (!src || failed) {
    return <div className={`${className} bg-gradient-to-br from-[#FF9A76] to-[#7ECCC4]`} />
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {canOptimizeCover(src) ? (
        <Image
          src={src}
          alt={destination}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 400px"
          onError={() => setFailed(true)}
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={destination} className="h-full w-full object-cover" onError={() => setFailed(true)} />
      )}
    </div>
  )
}
