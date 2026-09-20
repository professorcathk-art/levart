'use client'

import { motion } from 'framer-motion'
import { useLocale } from '@/components/i18n/locale-provider'
import { PromptBar } from '@/components/landing/prompt-bar'
import { SkyBackdrop } from '@/components/landing/sky-backdrop'

export function Hero() {
  const { t } = useLocale()

  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden bg-[#FAF6F0] px-4 py-16 md:py-24">
      <SkyBackdrop />
      <div className="container relative z-10 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-100/80 bg-white/90 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#E07A5F] shadow-sm backdrop-blur">
            <span aria-hidden>🐾</span>
            {t('heroEyebrow')}
          </p>
          <h1 className="text-4xl font-extrabold leading-tight text-[#2B2D42] md:text-6xl">
            {t('heroTitle1')}
            <span className="mt-2 block text-[#E07A5F]">{t('heroTitle2')}</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg font-medium leading-relaxed text-[#2B2D42]/70 md:text-xl">{t('heroBody')}</p>
          <div className="mt-10">
            <PromptBar />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
