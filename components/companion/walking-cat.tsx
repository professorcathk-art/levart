'use client'

import { useLocale } from '@/components/i18n/locale-provider'

export function WalkingCat() {
  const { t } = useLocale()

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-3 z-30 overflow-hidden" aria-hidden>
      <div className="cat-walk relative h-16 w-24">
        <svg viewBox="0 0 120 80" className="h-16 w-24 drop-shadow-md" role="img" aria-label={t('companionLabel')}>
          <ellipse cx="62" cy="52" rx="28" ry="16" fill="#FFB86C" />
          <circle cx="38" cy="38" r="16" fill="#FF9A76" />
          <path d="M26 28 L22 14 L34 26 Z" fill="#FF9A76" />
          <path d="M50 28 L54 14 L42 26 Z" fill="#FF9A76" />
          <circle cx="33" cy="36" r="2" fill="#1A1A1A" />
          <circle cx="43" cy="36" r="2" fill="#1A1A1A" />
          <path d="M36 42 Q38 45 40 42" fill="none" stroke="#1A1A1A" strokeWidth="1.4" />
          <path d="M18 38 H28" stroke="#C9A9DD" strokeWidth="1.2" />
          <path d="M48 38 H58" stroke="#C9A9DD" strokeWidth="1.2" />
          <path className="cat-tail" d="M88 48 C108 28 104 72 90 58" fill="none" stroke="#7ECCC4" strokeWidth="6" strokeLinecap="round" />
          <ellipse cx="50" cy="66" rx="4" ry="3" fill="#FF9A76" />
          <ellipse cx="70" cy="66" rx="4" ry="3" fill="#FF9A76" />
        </svg>
      </div>
    </div>
  )
}
