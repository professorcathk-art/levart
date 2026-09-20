'use client'

import { Map, MessagesSquare, Sparkles } from 'lucide-react'
import { useLocale } from '@/components/i18n/locale-provider'
import type { MessageKey } from '@/lib/i18n/dictionaries'
import type { LucideIcon } from 'lucide-react'

const steps: Array<{ number: string; title: MessageKey; body: MessageKey; icon: LucideIcon }> = [
  { number: '01', title: 'how1Title', body: 'how1Body', icon: MessagesSquare },
  { number: '02', title: 'how2Title', body: 'how2Body', icon: Map },
  { number: '03', title: 'how3Title', body: 'how3Body', icon: Sparkles },
]

export function HowItWorks() {
  const { t } = useLocale()

  return (
    <section className="bg-[#FAF6F0] py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-extrabold tracking-tight md:text-5xl">
            <span className="text-[#2B2D42]">{t('howTitle1')}</span>{' '}
            <span className="text-[#E07A5F]">{t('howTitle2')}</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-[#2B2D42]/70">{t('howSubtitle')}</p>
        </div>

        <div className="grid items-stretch gap-6 md:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon
            return (
              <article
                key={step.number}
                className="relative flex h-full flex-col rounded-3xl border border-orange-100/80 bg-white p-8 shadow-[0_8px_24px_rgba(43,45,66,0.04)]"
              >
                <p className="mb-4 font-mono text-5xl font-semibold leading-none text-[#E07A5F]/20">{step.number}</p>
                <span className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-orange-100/80 bg-[#FAF6F0] shadow-sm">
                  <Icon className="h-5 w-5 text-[#E07A5F]" strokeWidth={2.25} />
                </span>
                <h3 className="mb-3 text-2xl font-extrabold tracking-tight text-[#2B2D42]">{t(step.title)}</h3>
                <p className="leading-relaxed text-[#2B2D42]/70">{t(step.body)}</p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
