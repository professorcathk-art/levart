export function PawMark({ className = '', size = 12 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      aria-hidden
      className={`inline-block text-[#E07A5F] ${className}`}
    >
      <ellipse cx="50" cy="68" rx="20" ry="15" fill="currentColor" />
      <ellipse cx="28" cy="42" rx="11" ry="9" fill="currentColor" />
      <ellipse cx="50" cy="34" rx="11" ry="9" fill="currentColor" />
      <ellipse cx="72" cy="42" rx="11" ry="9" fill="currentColor" />
    </svg>
  )
}
