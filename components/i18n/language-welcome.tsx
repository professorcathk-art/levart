'use client'

import { PawMark } from '@/components/ui/paw-mark'
import type { Locale } from '@/lib/i18n/locales'

interface LanguageWelcomeProps {
  onChoose: (locale: Locale) => void
}

export function LanguageWelcome({ onChoose }: LanguageWelcomeProps) {
  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-[#2B2D42]/40 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="language-welcome-title"
        className="w-full max-w-md rounded-t-3xl border border-orange-100/80 bg-[#FAF6F0] p-6 shadow-2xl sm:rounded-3xl"
      >
        <p className="inline-flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[#E07A5F]">
          <PawMark size={14} />
          Catpawtrip 貓爪印
        </p>
        <h2 id="language-welcome-title" className="mt-4 text-2xl font-extrabold tracking-tight text-[#2B2D42]">
          選擇語言
        </h2>
        <p className="mt-1 text-lg font-semibold text-[#2B2D42]/70">Choose your language</p>
        <p className="mt-3 text-sm leading-relaxed text-[#2B2D42]/65">
          之後可在頁首隨時切換。You can change this anytime in the header.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => onChoose('zh-Hant')}
            className="min-h-12 rounded-full bg-[#E07A5F] px-5 text-base font-extrabold text-white shadow-md"
          >
            繁體中文
          </button>
          <button
            type="button"
            onClick={() => onChoose('en')}
            className="min-h-12 rounded-full border border-[#2B2D42] bg-white px-5 text-base font-extrabold text-[#2B2D42]"
          >
            English
          </button>
        </div>
      </div>
    </div>
  )
}
