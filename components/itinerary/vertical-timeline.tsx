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
    <div className="relative ml-4 space-y-4 border-l-2 border-slate-200 pl-6">
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
        className={`absolute -left-[33px] top-4 h-4 w-4 rounded-full ring-2 ring-white ${KIND_DOT[kind]}`}
      />
      {children}
    </div>
  )
}
