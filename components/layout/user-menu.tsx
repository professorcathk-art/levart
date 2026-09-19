'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types'

interface UserMenuProps {
  profile: Profile
}

export function UserMenu({ profile }: UserMenuProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
    } catch (error) {
      console.error('Failed to sign out:', error)
    }
    setOpen(false)
    router.refresh()
    router.push('/')
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-2 rounded-full bg-white/80 px-3 py-1.5 text-sm font-semibold text-[#1A1A1A] shadow-sm"
        aria-expanded={open}
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FF9A76] text-white">
          {(profile.displayName || profile.username || '?').slice(0, 1).toUpperCase()}
        </span>
        <span className="hidden sm:inline">{profile.displayName || profile.username}</span>
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-48 rounded-2xl bg-white p-2 shadow-xl">
          <Link
            href="/trips"
            onClick={() => setOpen(false)}
            className="block rounded-xl px-3 py-2 text-sm hover:bg-[#FFF8F3]"
          >
            My trips
          </Link>
          <Link
            href={`/u/${profile.username}`}
            onClick={() => setOpen(false)}
            className="block rounded-xl px-3 py-2 text-sm hover:bg-[#FFF8F3]"
          >
            Profile
          </Link>
          <button
            type="button"
            onClick={handleSignOut}
            className="block w-full rounded-xl px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}
