'use client'

import Link from 'next/link'
import { Mail, MessagesSquare, PawPrint as PawIcon } from 'lucide-react'
import { PawPrint } from '../paw-print'
import { useLocale } from '@/components/i18n/locale-provider'

export function Footer() {
  const { t } = useLocale()

  return (
    <footer className="relative overflow-hidden bg-[#2B2D42] py-16 text-white">
      <div className="absolute bottom-0 left-0 right-0 flex h-20 items-center justify-around opacity-10">
        {Array.from({ length: 8 }).map((_, i) => (
          <PawPrint key={i} size={30} color="#FF9A76" opacity={0.3} delay={i * 200} bounce />
        ))}
      </div>
      <div className="relative z-10 mx-auto max-w-6xl px-4">
        <div className="mb-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <h3 className="mb-1 text-2xl font-extrabold tracking-tight text-[#E07A5F]">Catpawtrip</h3>
            <p className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#E07A5F]/80">
              {t('brandNameZh')}
            </p>
            <p className="text-sm leading-relaxed text-white/60">{t('footerTagline')}</p>
          </div>
          <div>
            <h4 className="mb-4 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7ECCC4]">
              {t('footerSitemap')}
            </h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li>
                <Link href="/plan" className="hover:text-[#E07A5F]">
                  {t('footerPlan')}
                </Link>
              </li>
              <li>
                <Link href="/community" className="hover:text-[#E07A5F]">
                  {t('navCommunity')}
                </Link>
              </li>
              <li>
                <Link href="/trips" className="hover:text-[#E07A5F]">
                  {t('navMyTrips')}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7ECCC4]">
              {t('footerAccount')}
            </h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li>
                <Link href="/login" className="hover:text-[#E07A5F]">
                  {t('navSignIn')}
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-[#E07A5F]">
                  {t('footerCreate')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#E07A5F]">
                  {t('footerContact')}
                </Link>
              </li>
              <li>
                <Link href="/contact?type=bug" className="hover:text-[#E07A5F]">
                  {t('footerBug')}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7ECCC4]">
              {t('footerLegal')}
            </h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li>
                <Link href="/about" className="hover:text-[#E07A5F]">
                  {t('footerAbout')}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#E07A5F]">
                  {t('footerPrivacy')}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#E07A5F]">
                  {t('footerTerms')}
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-[#E07A5F]">
                  {t('footerCookies')}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7ECCC4]">
              {t('footerSocial')}
            </h4>
            <ul className="space-y-3 text-sm text-white/60">
              <li>
                <Link href="/community" className="inline-flex items-center gap-2 hover:text-[#E07A5F]">
                  <MessagesSquare className="h-4 w-4" strokeWidth={2.25} />
                  {t('navCommunity')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="inline-flex items-center gap-2 hover:text-[#E07A5F]">
                  <Mail className="h-4 w-4" strokeWidth={2.25} />
                  {t('footerContact')}
                </Link>
              </li>
              <li>
                <Link href="/plan" className="inline-flex items-center gap-2 hover:text-[#E07A5F]">
                  <PawIcon className="h-4 w-4" strokeWidth={2.25} />
                  {t('footerPlan')}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col gap-3 border-t border-white/10 pt-8 text-sm text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Catpawtrip. {t('footerCredit')}
          </p>
          <p className="flex flex-wrap gap-4 font-mono text-[10px] uppercase tracking-[0.14em]">
            <Link href="/privacy" className="hover:text-[#E07A5F]">
              {t('footerPrivacy')}
            </Link>
            <Link href="/terms" className="hover:text-[#E07A5F]">
              {t('footerTerms')}
            </Link>
            <Link href="/contact" className="hover:text-[#E07A5F]">
              {t('footerContact')}
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
