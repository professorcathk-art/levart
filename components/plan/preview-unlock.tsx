'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Lock } from 'lucide-react'
import { useLocale } from '@/components/i18n/locale-provider'
import { saveHeroPrompt } from '@/lib/landing/hero-prompt'

interface PreviewUnlockProps {
  nextPath: string
  remixPrompt?: string
  compact?: boolean
}

export function PreviewUnlock({ nextPath, remixPrompt, compact = false }: PreviewUnlockProps) {
  const { t } = useLocale()
  const router = useRouter()
  const next = encodeURIComponent(nextPath)

  const remix = () => {
    if (remixPrompt) saveHeroPrompt(remixPrompt)
    router.push('/plan')
  }

  return (
    <aside
      className={`rounded-[28px] border border-orange-100/80 bg-white/95 text-center shadow-sm ${
        compact ? 'p-5' : 'p-8'
      }`}
    >
      <span className="mx-auto mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-orange-100 bg-[#FAF6F0] text-[#E07A5F]">
        <Lock className="h-4 w-4" strokeWidth={2.25} aria-hidden />
      </span>
      <h2 className="text-xl font-extrabold text-[#2B2D42]">{t('previewUnlockTitle')}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#2B2D42]/70">{t('previewUnlockBody')}</p>
      <div className="mt-5 flex flex-col justify-center gap-2 sm:flex-row">
        <Link
          href={`/login?next=${next}`}
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#E07A5F] px-5 text-sm font-semibold text-white"
        >
          {t('previewSignIn')}
        </Link>
        <Link
          href={`/signup?next=${next}`}
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#2B2D42] px-5 text-sm font-semibold text-[#2B2D42]"
        >
          {t('authSignUp')}
        </Link>
        {remixPrompt && (
          <button
            type="button"
            onClick={remix}
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#FFF1E6] px-5 text-sm font-semibold text-[#E07A5F]"
          >
            {t('previewRemix')}
          </button>
        )}
      </div>
      <p className="mt-3 text-xs text-[#2B2D42]/55">{t('previewSaveHint')}</p>
    </aside>
  )
}
