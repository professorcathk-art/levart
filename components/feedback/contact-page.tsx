'use client'

import { FeedbackForm } from '@/components/feedback/feedback-form'
import { useLocale } from '@/components/i18n/locale-provider'

export function ContactPageCopy({ type }: { type: 'contact' | 'bug' }) {
  const { t } = useLocale()

  return (
    <main className="mx-auto max-w-xl px-4 py-10">
      <h1 className="text-3xl font-extrabold text-[#E07A5F]">{type === 'bug' ? t('bugTitle') : t('contactTitle')}</h1>
      <p className="mt-2 text-sm font-medium leading-relaxed text-slate-600">
        {type === 'bug' ? t('bugBody') : t('contactBody')}
      </p>
      <div className="mt-6">
        <FeedbackForm type={type} />
      </div>
    </main>
  )
}
