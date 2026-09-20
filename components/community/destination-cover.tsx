'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

interface DestinationCoverProps {
  destination: string
  coverPhoto?: string | null
  className?: string
}

export function DestinationCover({
  destination,
  coverPhoto,
  className = 'h-32',
}: DestinationCoverProps) {
  const [src, setSrc] = useState<string | null>(coverPhoto ?? null)

  useEffect(() => {
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

  if (!src) {
    return <div className={`${className} bg-gradient-to-br from-[#FF9A76] to-[#7ECCC4]`} />
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image src={src} alt={destination} fill className="object-cover" sizes="(max-width: 768px) 100vw, 400px" />
    </div>
  )
}
