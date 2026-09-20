'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLocale } from '@/components/i18n/locale-provider'
import type { Profile } from '@/types'

interface UserMenuProps {
  profile: Profile
}

export function UserMenu({ profile }: UserMenuProps) {
  const [open, setOpen] = useState(false)
  const { t } = useLocale()

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-2 rounded-full bg-white/80 px-3 py-1.5 text-sm font-semibold text-[#2B2D42] shadow-sm"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E07A5F] text-white">
          {(profile.displayName || profile.username || '?').slice(0, 1).toUpperCase()}
        </span>
        <span className="hidden sm:inline">{profile.displayName || profile.username}</span>
      </button>
      {open && (
        <div
          className="absolute right-0 z-50 mt-2 w-48 rounded-2xl border border-orange-100/80 bg-white p-2 text-[#2B2D42] shadow-xl"
          role="menu"
        >
          <Link
            href="/trips"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="block rounded-xl px-3 py-2 text-sm hover:bg-[#FAF6F0]"
          >
            {t('navMyTrips')}
          </Link>
          <Link
            href={`/u/${profile.username}`}
            role="menuitem"
            onClick={() => setOpen(false)}
            className="block rounded-xl px-3 py-2 text-sm hover:bg-[#FAF6F0]"
          >
            {t('navProfile')}
          </Link>
          <form action="/auth/sign-out" method="post">
            <button
              type="submit"
              role="menuitem"
              className="block w-full rounded-xl px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
            >
              {t('navSignOut')}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
