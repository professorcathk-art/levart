import type { ReactNode } from 'react'
import type { TimelineKind } from '@/lib/trips/timeline'

const KIND_DOT: Record<TimelineKind | 'transit', string> = {
  place: 'bg-[#E07A5F]',
  food: 'bg-[#7ECCC4]',
  stay: 'bg-[#2B2D42]',
  transit: 'bg-slate-300',
}

export function VerticalTimeline({ children }: { children: ReactNode }) {
  return (
    <div className="relative ml-2 space-y-4 border-l-2 border-slate-200 pl-4 sm:ml-4 sm:pl-6">
      {children}
    </div>
  )
}

export function TimelineNode({
  children,
  kind = 'place',
}: {
  children: ReactNode
  kind?: TimelineKind | 'transit'
}) {
  return (
    <div className="relative">
      <span
        aria-hidden
        className={`absolute -left-[25px] top-4 h-3.5 w-3.5 rounded-full ring-2 ring-white sm:-left-[33px] sm:h-4 sm:w-4 ${KIND_DOT[kind]}`}
      />
      {children}
    </div>
  )
}
