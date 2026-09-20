'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useLocale } from '@/components/i18n/locale-provider'
import { BoardingPass } from '@/components/landing/boarding-pass'
import { guessBoardingCity, saveHeroPrompt } from '@/lib/landing/hero-prompt'
import type { MessageKey } from '@/lib/i18n/dictionaries'

const CHIPS: Array<{ label: MessageKey; prompt: MessageKey }> = [
  { label: 'heroChipTokyoLabel', prompt: 'heroChipTokyo' },
  { label: 'heroChipParisLabel', prompt: 'heroChipParis' },
  { label: 'heroChipTaipeiLabel', prompt: 'heroChipTaipei' },
  { label: 'heroChipHongKongLabel', prompt: 'heroChipHongKong' },
]

export function PromptBar() {
  const { t } = useLocale()
  const router = useRouter()
  const [prompt, setPrompt] = useState('')
  const [boarding, setBoarding] = useState(false)
  const [city, setCity] = useState('')

  const launch = (text: string) => {
    const next = text.trim()
    if (!next || boarding) return
    saveHeroPrompt(next)
    setCity(guessBoardingCity(next))
    setBoarding(true)
    window.setTimeout(() => {
      router.push('/plan')
    }, 1100)
  }

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    launch(prompt)
  }

  return (
    <>
      <div className="mx-auto w-full max-w-2xl space-y-4">
        <form
          onSubmit={onSubmit}
          className="flex flex-col gap-2 rounded-3xl border border-white/70 bg-white/75 p-2 shadow-[0_20px_50px_rgba(224,122,95,0.15)] backdrop-blur-md focus-within:ring-2 focus-within:ring-[#E07A5F]/40 sm:flex-row sm:items-center"
        >
          <label className="sr-only" htmlFor="hero-prompt">
            {t('heroPromptLabel')}
          </label>
          <input
            id="hero-prompt"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder={t('heroPlaceholder')}
            className="min-h-12 flex-1 bg-transparent px-4 text-base text-[#2B2D42] outline-none placeholder:text-[#2B2D42]/40 md:text-lg"
          />
          <motion.button
            type="submit"
            whileTap={{ scale: 0.97 }}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#E07A5F] to-[#FFB86C] px-5 font-semibold text-white shadow-md"
          >
            {t('heroGenerate')}
            <span aria-hidden>🐾</span>
          </motion.button>
        </form>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs font-medium text-[#2B2D42]/50">{t('heroTry')}</span>
          {CHIPS.map((chip) => (
            <button
              key={chip.prompt}
              type="button"
              onClick={() => {
                const next = t(chip.prompt)
                setPrompt(next)
                launch(next)
              }}
              className="min-h-11 rounded-full border border-[#E07A5F]/20 bg-white/70 px-3 py-1.5 text-sm text-[#2B2D42] transition hover:bg-[#FFF1E6]"
            >
              {t(chip.label)}
            </button>
          ))}
        </div>
      </div>
      <BoardingPass open={boarding} city={city} />
    </>
  )
}
