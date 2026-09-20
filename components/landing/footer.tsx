'use client'

import Link from 'next/link'
import { PawPrint } from '../paw-print'
import { useLocale } from '@/components/i18n/locale-provider'

export function Footer() {
  const { t } = useLocale()

  return (
    <footer className="relative overflow-hidden bg-[#1A1A1A] py-12 text-white">
      <div className="absolute bottom-0 left-0 right-0 flex h-20 items-center justify-around opacity-20">
        {Array.from({ length: 8 }).map((_, i) => (
          <PawPrint key={i} size={30} color="#FF9A76" opacity={0.3} delay={i * 200} bounce />
        ))}
      </div>
      <div className="container relative z-10 mx-auto px-4">
        <div className="mb-8 grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-1 text-2xl font-extrabold text-[#E07A5F]">Catpawtrip</h3>
            <p className="mb-3 text-sm font-semibold tracking-[0.18em] text-[#E07A5F]/80">{t('brandNameZh')}</p>
            <p className="text-sm text-gray-400">{t('footerTagline')}</p>
          </div>
          <div>
            <h4 className="mb-4 font-semibold text-[#7ECCC4]">{t('footerExplore')}</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/plan" className="hover:text-[#FF9A76]">
                  {t('footerPlan')}
                </Link>
              </li>
              <li>
                <Link href="/community" className="hover:text-[#FF9A76]">
                  {t('navCommunity')}
                </Link>
              </li>
              <li>
                <Link href="/trips" className="hover:text-[#FF9A76]">
                  {t('navMyTrips')}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-semibold text-[#7ECCC4]">{t('footerAccount')}</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/login" className="hover:text-[#FF9A76]">
                  {t('navSignIn')}
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-[#FF9A76]">
                  {t('footerCreate')}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col gap-3 border-t border-gray-800 pt-8 text-sm text-gray-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Catpawtrip. {t('footerCredit')}
          </p>
          <p className="flex gap-4 text-xs">
            <Link href="/contact" className="hover:text-[#FF9A76]">
              {t('footerContact')}
            </Link>
            <Link href="/contact?type=bug" className="hover:text-[#FF9A76]">
              {t('footerBug')}
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
