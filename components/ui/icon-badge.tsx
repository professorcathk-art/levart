import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

const SURFACE =
  'inline-flex min-h-9 items-center gap-1.5 rounded-full border border-orange-100/80 bg-white/90 px-2.5 text-xs font-semibold text-slate-600 shadow-sm backdrop-blur-sm transition-all hover:scale-[1.03] hover:shadow-md'

interface IconBadgeProps {
  icon: LucideIcon
  children: ReactNode
  href?: string
  onClick?: () => void
  type?: 'button'
  disabled?: boolean
  className?: string
  tone?: 'default' | 'primary'
  expanded?: boolean
}

export function IconBadge({
  icon: Icon,
  children,
  href,
  onClick,
  type = 'button',
  disabled,
  className = '',
  tone = 'default',
  expanded,
}: IconBadgeProps) {
  const toneClass =
    tone === 'primary'
      ? 'border-[#E07A5F]/20 bg-[#E07A5F] text-white hover:bg-[#E07A5F]'
      : ''
  const classes = `${SURFACE} ${toneClass} ${className}`
  const content = (
    <>
      <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={2.25} aria-hidden />
      <span>{children}</span>
    </>
  )

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {content}
      </a>
    )
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-expanded={expanded}
      className={`${classes} disabled:opacity-60`}
    >
      {content}
    </button>
  )
}
