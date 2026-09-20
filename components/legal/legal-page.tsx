'use client'

import Link from 'next/link'
import { useLocale } from '@/components/i18n/locale-provider'
import { TicketMark } from '@/components/ui/ticket-mark'
import { getLegalDoc, type LegalSlug } from '@/lib/legal/content'
import type { MessageKey } from '@/lib/i18n/dictionaries'

const LINKS: Array<{ href: string; label: MessageKey }> = [
  { href: '/about', label: 'footerAbout' },
  { href: '/privacy', label: 'footerPrivacy' },
  { href: '/terms', label: 'footerTerms' },
  { href: '/cookies', label: 'footerCookies' },
]

export function LegalPage({ slug }: { slug: LegalSlug }) {
  const { locale, t } = useLocale()
  const doc = getLegalDoc(slug, locale)

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <TicketMark>{t('legalUpdated', { date: doc.updated })}</TicketMark>
      <h1 className="mt-3 text-4xl font-extrabold text-[#2B2D42]">{doc.title}</h1>
      <p className="mt-4 font-medium leading-relaxed text-slate-600">{doc.intro}</p>

      <nav aria-label={t('footerLegal')} className="mt-6 flex flex-wrap gap-2">
        {LINKS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-all hover:scale-[1.03] ${
              item.href === `/${slug}`
                ? 'border-[#2B2D42] bg-[#2B2D42] text-white'
                : 'border-orange-100/80 bg-white/90 text-slate-600 shadow-sm'
            }`}
          >
            {t(item.label)}
          </Link>
        ))}
      </nav>

      <div className="mt-10 space-y-8">
        {doc.sections.map((section) => (
          <section key={section.heading} className="rounded-2xl border border-orange-100/80 bg-white/90 p-6 shadow-sm">
            <h2 className="text-xl font-extrabold text-[#E07A5F]">{section.heading}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 48)} className="mt-3 leading-relaxed text-slate-700">
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </div>
    </main>
  )
}
