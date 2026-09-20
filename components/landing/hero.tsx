'use client'

import { motion } from 'framer-motion'
import { PawMark } from '@/components/ui/paw-mark'
import { useLocale } from '@/components/i18n/locale-provider'
import { PromptBar } from '@/components/landing/prompt-bar'
import { SkyBackdrop } from '@/components/landing/sky-backdrop'

export function Hero() {
  const { t } = useLocale()

  return (
    <section className="relative flex items-center justify-center overflow-hidden bg-[#FAF6F0] px-4 py-14 md:min-h-[calc(100vh-4rem)] md:py-24">
      <SkyBackdrop />
      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/75 px-5 py-2 font-mono text-sm font-semibold tracking-[0.18em] text-[#E07A5F] shadow-[0_8px_24px_rgba(224,122,95,0.12)] backdrop-blur-md">
            <PawMark size={16} />
            {t('heroEyebrow')}
          </p>
          <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight text-[#2B2D42] sm:text-5xl md:text-7xl">
            {t('heroTitle1')}
            <span className="mt-2 block text-[#E07A5F]">{t('heroTitle2')}</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-[#2B2D42]/70 md:text-xl">{t('heroBody')}</p>
          <div className="mt-10">
            <PromptBar />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
