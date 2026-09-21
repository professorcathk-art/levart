import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

interface IconBadgeProps {
  icon: LucideIcon
  children: ReactNode
  href?: string
  onClick?: () => void
  type?: 'button'
  disabled?: boolean
  className?: string
  tone?: 'default' | 'primary' | 'dark' | 'danger'
  expanded?: boolean
}

const TONE: Record<NonNullable<IconBadgeProps['tone']>, string> = {
  default:
    'border-orange-200 bg-white text-[#2B2D42] hover:bg-[#FAF6F0]',
  primary:
    'border-transparent bg-[#E07A5F] text-white hover:bg-[#d96c51]',
  dark:
    'border-transparent bg-[#2B2D42] text-white hover:bg-[#1d1f30]',
  danger:
    'border-red-200 bg-white text-red-600 hover:bg-red-50',
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
  const classes = `inline-flex min-h-9 items-center gap-1.5 rounded-full border px-2.5 text-xs font-semibold shadow-sm transition-all hover:scale-[1.03] hover:shadow-md ${TONE[tone]} ${className}`
  const content = (
    <>
      <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={2.25} aria-hidden />
      <span className="whitespace-nowrap">{children}</span>
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
