'use client'

import { useEffect, useState } from 'react'

interface DestinationCoverProps {
  destination: string
  coverPhoto?: string | null
  hints?: string[]
  className?: string
}

function CoverImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false)
  if (failed) return <div className="absolute inset-0 bg-gradient-to-br from-[#FF9A76] to-[#7ECCC4]" />
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className="absolute inset-0 h-full w-full object-cover" onError={() => setFailed(true)} />
  )
}

export function DestinationCover({
  destination,
  coverPhoto,
  hints = [],
  className = 'h-32',
}: DestinationCoverProps) {
  const [photos, setPhotos] = useState<string[]>(coverPhoto ? [coverPhoto] : [])

  useEffect(() => {
    let cancelled = false
    const params = new URLSearchParams({ destination })
    if (hints.length > 0) params.set('hints', hints.join('|'))
    fetch(`/api/photos/cover?${params.toString()}`)
      .then((res) => res.json())
      .then((data: { photos?: string[] }) => {
        if (cancelled) return
        const next = [coverPhoto, ...(data.photos ?? [])].filter((item): item is string => Boolean(item))
        setPhotos(Array.from(new Set(next)).slice(0, 3))
      })
      .catch((error) => console.error('Cover photo lookup failed:', error))
    return () => {
      cancelled = true
    }
  }, [coverPhoto, destination, hints.join('|')])

  if (photos.length === 0) {
    return <div className={`${className} bg-gradient-to-br from-[#FF9A76] to-[#7ECCC4]`} />
  }

  if (photos.length === 1) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <CoverImage src={photos[0]} alt={destination} />
      </div>
    )
  }

  if (photos.length === 2) {
    return (
      <div className={`grid grid-cols-2 overflow-hidden ${className}`}>
        {photos.map((src) => (
          <div key={src} className="relative h-full min-h-0">
            <CoverImage src={src} alt={destination} />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={`grid h-full min-h-[9rem] grid-cols-5 overflow-hidden ${className}`}>
      <div className="relative col-span-3 min-h-[9rem]">
        <CoverImage src={photos[0]} alt={destination} />
      </div>
      <div className="relative col-span-2 grid min-h-[9rem] grid-rows-2">
        {photos.slice(1, 3).map((src) => (
          <div key={src} className="relative min-h-0">
            <CoverImage src={src} alt="" />
          </div>
        ))}
      </div>
    </div>
  )
}
