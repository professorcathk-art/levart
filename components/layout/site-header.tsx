import { Suspense, type ReactNode } from 'react'
import Link from 'next/link'
import { getCurrentProfile } from '@/lib/supabase/auth'
import { UserMenu } from '@/components/layout/user-menu'
import { HeaderNav, MyTripsLink, SignInLink } from '@/components/layout/header-nav'

function SiteLogo() {
  return (
    <svg width={22} height={22} viewBox="0 0 100 100" aria-hidden>
      <ellipse cx="50" cy="65" rx="20" ry="15" fill="#FF9A76" />
      <ellipse cx="30" cy="40" rx="12" ry="10" fill="#FF9A76" />
      <ellipse cx="50" cy="35" rx="12" ry="10" fill="#FF9A76" />
      <ellipse cx="70" cy="40" rx="12" ry="10" fill="#FF9A76" />
      <ellipse cx="40" cy="25" rx="10" ry="8" fill="#FF9A76" />
      <ellipse cx="60" cy="25" rx="10" ry="8" fill="#FF9A76" />
    </svg>
  )
}

function HeaderChrome({ children }: { children: ReactNode }) {
  return (
    <header className="sticky top-0 z-40 border-b border-[#E07A5F]/10 bg-[#FAF6F0]/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-2 px-3 sm:h-16 sm:px-4">
        <Link href="/" className="flex shrink-0 items-center gap-2 text-lg font-bold text-[#E07A5F] sm:text-xl">
          <SiteLogo />
          Levart
        </Link>
        <HeaderNav>{children}</HeaderNav>
      </div>
    </header>
  )
}

async function SiteHeaderAuth() {
  const profile = await getCurrentProfile()

  if (!profile) {
    return <SignInLink />
  }

  return (
    <>
      <MyTripsLink />
      <UserMenu profile={profile} />
    </>
  )
}

export function SiteHeader() {
  return (
    <HeaderChrome>
      <Suspense fallback={<SignInLink />}>
        <SiteHeaderAuth />
      </Suspense>
    </HeaderChrome>
  )
}
