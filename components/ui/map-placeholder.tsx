import { MapPin } from 'lucide-react'
import { PawMark } from '@/components/ui/paw-mark'

export function MapPlaceholder({
  title,
  action,
}: {
  title: string
  action?: { href: string; label: string }
}) {
  return (
    <div className="relative flex h-full min-h-[22rem] flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#FFF8F3] via-white to-[#E8F3F1] p-6">
      <svg viewBox="0 0 320 180" className="absolute inset-x-6 top-8 h-28 w-auto opacity-70" aria-hidden>
        <path
          d="M20 110 C70 40, 130 150, 180 70 S270 40, 300 90"
          fill="none"
          stroke="#E07A5F"
          strokeWidth="2"
          strokeDasharray="6 8"
        />
        <circle cx="70" cy="72" r="6" fill="#E07A5F" />
        <circle cx="180" cy="70" r="6" fill="#7ECCC4" />
        <circle cx="270" cy="56" r="6" fill="#2B2D42" />
      </svg>
      <span className="relative mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-orange-100/80 bg-white/90 shadow-sm">
        <MapPin className="h-5 w-5 text-[#E07A5F]" />
      </span>
      <p className="relative max-w-xs text-center text-sm font-medium leading-relaxed text-slate-600">{title}</p>
      {action && (
        <a
          href={action.href}
          target="_blank"
          rel="noopener noreferrer"
          className="relative mt-4 inline-flex min-h-11 items-center gap-1.5 rounded-full border border-orange-100/80 bg-white/90 px-4 text-sm font-semibold text-[#E07A5F] shadow-sm transition-all hover:scale-[1.03] hover:shadow-md"
        >
          <PawMark size={14} />
          {action.label}
        </a>
      )}
    </div>
  )
}
