'use client'

import Link from 'next/link'
import { T, useLocale } from '@/components/i18n/locale-provider'

export function CommunityHeading() {
  return (
    <>
      <h1 className="text-4xl font-bold text-[#FF9A76]">
        <T k="communityTitle" />
      </h1>
      <p className="mt-2 text-gray-600">
        <T k="communityBody" />
      </p>
    </>
  )
}

export function CommunitySearch({ destination, sort }: { destination?: string; sort: string }) {
  const { t } = useLocale()

  return (
    <form className="mt-6 flex flex-col gap-3 sm:flex-row" action="/community">
      <input
        type="search"
        name="q"
        defaultValue={destination}
        placeholder={t('filterDestination')}
        className="flex-1 rounded-full border border-gray-200 px-5 py-3 outline-none focus:border-[#FF9A76]"
      />
      <select
        name="sort"
        defaultValue={sort}
        className="rounded-full border border-gray-200 px-4 py-3"
      >
        <option value="recent">{t('sortRecent')}</option>
        <option value="rating">{t('sortRating')}</option>
      </select>
      <button
        type="submit"
        className="rounded-full bg-gradient-to-r from-[#FF9A76] to-[#FFB86C] px-6 py-3 font-semibold text-white"
      >
        {t('search')}
      </button>
    </form>
  )
}

export function CommunityEmpty() {
  return <T k="communityEmpty" />
}

export function CommunityTeaserCopy() {
  const { t } = useLocale()

  return (
    <div className="mb-10 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-4xl font-bold">
          <span className="text-[#FF9A76]">{t('teaserTitle1')}</span>{' '}
          <span className="text-[#7ECCC4]">{t('teaserTitle2')}</span>
        </h2>
        <p className="mt-2 text-gray-600">{t('teaserBody')}</p>
      </div>
      <Link href="/community" className="font-semibold text-[#FF9A76]">
        {t('teaserSeeAll')}
      </Link>
    </div>
  )
}

export function TeaserEmpty() {
  return <T k="teaserEmpty" />
}
