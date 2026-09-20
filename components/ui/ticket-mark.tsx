import type { ReactNode } from 'react'

export function TicketMark({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded bg-orange-50 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#E07A5F] ${className}`}
    >
      {children}
    </span>
  )
}
