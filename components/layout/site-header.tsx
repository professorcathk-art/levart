import { Suspense, type ReactNode } from 'react'
import Link from 'next/link'
import { getCurrentProfile } from '@/lib/supabase/auth'
import { UserMenu } from '@/components/layout/user-menu'

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
    <header className="sticky top-0 z-40 border-b border-[#FF9A76]/10 bg-[#FFF8F3]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-[#FF9A76]">
          <SiteLogo />
          Levart
        </Link>
        <nav className="flex items-center gap-4 text-sm font-semibold text-[#1A1A1A]">
          <Link href="/plan" className="hover:text-[#FF9A76]">
            Plan
          </Link>
          <Link href="/community" className="hover:text-[#FF9A76]">
            Community
          </Link>
          {children}
        </nav>
      </div>
    </header>
  )
}

function SignInLink() {
  return (
    <Link
      href="/login"
      className="rounded-full bg-gradient-to-r from-[#FF9A76] to-[#FFB86C] px-4 py-2 text-white shadow"
    >
      Sign in
    </Link>
  )
}

async function SiteHeaderAuth() {
  const profile = await getCurrentProfile()

  if (!profile) {
    return <SignInLink />
  }

  return (
    <>
      <Link href="/trips" className="hidden hover:text-[#FF9A76] sm:inline">
        My trips
      </Link>
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
