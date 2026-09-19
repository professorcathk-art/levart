import Link from 'next/link'
import { getCurrentProfile } from '@/lib/supabase/auth'
import { UserMenu } from '@/components/layout/user-menu'
import { PawPrint } from '@/components/paw-print'

export async function SiteHeader() {
  const profile = await getCurrentProfile()

  return (
    <header className="sticky top-0 z-40 border-b border-[#FF9A76]/10 bg-[#FFF8F3]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-[#FF9A76]">
          <PawPrint size={22} color="#FF9A76" bounce={false} />
          Levart
        </Link>

        <nav className="flex items-center gap-4 text-sm font-semibold text-[#1A1A1A]">
          <Link href="/plan" className="hover:text-[#FF9A76]">
            Plan
          </Link>
          <Link href="/community" className="hover:text-[#FF9A76]">
            Community
          </Link>
          {profile ? (
            <>
              <Link href="/trips" className="hidden hover:text-[#FF9A76] sm:inline">
                My trips
              </Link>
              <UserMenu profile={profile} />
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-gradient-to-r from-[#FF9A76] to-[#FFB86C] px-4 py-2 text-white shadow"
            >
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
