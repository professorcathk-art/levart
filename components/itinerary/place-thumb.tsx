import { gradientForPlace, isUsablePhoto, placeGlyph } from '@/lib/trips/place-art'

interface PlaceThumbProps {
  title: string
  photo?: string | null
  type?: string
  kind?: string
  className?: string
}

export function PlaceThumb({ title, photo, type, kind, className = 'h-16 w-16' }: PlaceThumbProps) {
  const usable = isUsablePhoto(photo)
  const glyph = placeGlyph(type, kind)

  if (usable && photo) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={photo} alt="" className={`object-cover ${className}`} />
    )
  }

  return (
    <div
      aria-hidden
      className={`flex items-center justify-center bg-gradient-to-br text-2xl text-white ${gradientForPlace(type, kind)} ${className}`}
      title={title}
    >
      {glyph}
    </div>
  )
}
