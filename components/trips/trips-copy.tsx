'use client'

import Link from 'next/link'
import { T, useLocale } from '@/components/i18n/locale-provider'

export function TripsHeader() {
  const { t } = useLocale()

  return (
    <div className="mb-8 flex items-center justify-between">
      <div>
        <h1 className="text-4xl font-bold text-[#FF9A76]">{t('tripsTitle')}</h1>
        <p className="mt-2 text-gray-600">{t('tripsBody')}</p>
      </div>
      <Link
        href="/plan"
        className="rounded-full bg-gradient-to-r from-[#FF9A76] to-[#FFB86C] px-5 py-3 font-semibold text-white"
      >
        {t('newPlan')}
      </Link>
    </div>
  )
}

export function TripsEmpty() {
  return (
    <div className="rounded-3xl bg-white p-10 text-center shadow">
      <p className="text-gray-600">
        <T k="tripsEmpty" />
      </p>
      <Link href="/plan" className="mt-4 inline-block font-semibold text-[#FF9A76]">
        <T k="startPlanning" />
      </Link>
    </div>
  )
}

export function TripStatusLabel({ status }: { status: string }) {
  const { t } = useLocale()
  return <>{status === 'confirmed' ? t('statusConfirmed') : t('statusDraft')}</>
}

export function UntitledTrip() {
  return <T k="untitledTrip" />
}

export function TripDays({ count }: { count: number }) {
  const { t } = useLocale()
  return <>{t('planDays', { count })}</>
}
