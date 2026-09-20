'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useLocale } from '@/components/i18n/locale-provider'

interface BoardingPassProps {
  open: boolean
  city: string
}

export function BoardingPass({ open, city }: BoardingPassProps) {
  const { t } = useLocale()

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="boarding-pass-title"
          className="fixed inset-0 z-[60] flex items-center justify-center bg-[#2B2D42]/55 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.article
            initial={{ scale: 0.92, y: 18, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 1.06, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 22 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl bg-[#FFF1E6] text-[#2B2D42] shadow-2xl"
          >
            <div className="bg-gradient-to-r from-[#E07A5F] to-[#FFB86C] px-6 py-3 text-sm font-semibold tracking-[0.2em] text-white">
              LEVART AIR
            </div>
            <div className="grid grid-cols-[1fr_auto] gap-4 p-6">
              <div>
                <p className="text-xs uppercase tracking-widest text-[#E07A5F]">{t('boardingNow')}</p>
                <h2 id="boarding-pass-title" className="mt-1 text-2xl font-bold leading-tight">
                  {city}
                </h2>
                <p className="mt-3 text-sm text-[#2B2D42]/70">{t('boardingSeat')}</p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-widest text-[#2B2D42]/50">{t('boardingGate')}</p>
                <p className="text-3xl font-bold text-[#E07A5F]">AI</p>
                <motion.span
                  className="mt-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#E07A5F] text-white"
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 8 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 400, damping: 14 }}
                  aria-hidden
                >
                  <svg width="22" height="22" viewBox="0 0 100 100" fill="currentColor">
                    <ellipse cx="50" cy="68" rx="22" ry="16" />
                    <ellipse cx="28" cy="42" rx="12" ry="10" />
                    <ellipse cx="50" cy="32" rx="12" ry="10" />
                    <ellipse cx="72" cy="42" rx="12" ry="10" />
                  </svg>
                </motion.span>
              </div>
            </div>
            <div className="flex items-center gap-2 border-t border-dashed border-[#E07A5F]/30 px-6 py-3 text-xs text-[#2B2D42]/60">
              <span className="h-2 w-2 rounded-full bg-[#E07A5F]" />
              {t('boardingHint')}
            </div>
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
