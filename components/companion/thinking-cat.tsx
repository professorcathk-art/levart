'use client'

import { useLocale } from '@/components/i18n/locale-provider'

export function ThinkingCat() {
  const { t } = useLocale()

  return (
    <div className="mt-4 flex items-end gap-3" aria-live="polite">
      <div className="relative h-16 w-16">
        <svg viewBox="0 0 80 80" className="h-16 w-16 cat-bob" aria-hidden>
          <ellipse cx="40" cy="50" rx="18" ry="14" fill="#FFB86C" />
          <circle cx="40" cy="34" r="16" fill="#FF9A76" />
          <path d="M28 24 L24 10 L36 22 Z" fill="#FF9A76" />
          <path d="M52 24 L56 10 L44 22 Z" fill="#FF9A76" />
          <circle cx="34" cy="33" r="2" fill="#1A1A1A" />
          <circle cx="46" cy="33" r="2" fill="#1A1A1A" />
          <circle cx="40" cy="38" r="1.6" fill="#C9A9DD" />
          <path d="M36 42 Q40 46 44 42" fill="none" stroke="#1A1A1A" strokeWidth="1.4" />
          <path className="cat-tail" d="M56 54 C72 40 70 74 58 62" fill="none" stroke="#7ECCC4" strokeWidth="5" strokeLinecap="round" />
        </svg>
        <span className="think-dot absolute -right-1 top-1 h-2 w-2 rounded-full bg-[#FF9A76]" />
        <span className="think-dot animation-delay-200 absolute right-2 -top-2 h-2.5 w-2.5 rounded-full bg-[#7ECCC4]" />
        <span className="think-dot animation-delay-400 absolute right-6 -top-3 h-3 w-3 rounded-full bg-[#FFB86C]" />
      </div>
      <p className="text-sm text-gray-500">{t('chatThinking')}</p>
    </div>
  )
}
