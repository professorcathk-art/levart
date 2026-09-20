import { Suspense, type ReactNode } from 'react'
import { getCurrentProfile } from '@/lib/supabase/auth'
import { UserMenu } from '@/components/layout/user-menu'
import { HeaderNav, MyTripsLink, SignInLink } from '@/components/layout/header-nav'
import { SiteBrand } from '@/components/layout/site-brand'

function HeaderChrome({ children }: { children: ReactNode }) {
  return (
    <header className="sticky top-0 z-40 border-b border-[#E07A5F]/10 bg-[#FAF6F0]/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-2 px-3 sm:h-16 sm:px-4">
        <SiteBrand />
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
