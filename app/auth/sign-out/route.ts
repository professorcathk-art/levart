import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { getSupabasePublicEnv } from '@/lib/supabase/env'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const url = new URL('/', request.url)
  const response = NextResponse.redirect(url, { status: 303 })
  const env = getSupabasePublicEnv()
  if (!env) {
    return response
  }

  const cookieStore = await cookies()
  const supabase = createServerClient(env.url, env.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          try {
            cookieStore.set(name, value, options)
          } catch {
            // Route still returns Set-Cookie on the redirect below.
          }
          response.cookies.set(name, value, options)
        })
      },
    },
  })

  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error('Failed to sign out:', error)
  }

  return response
}
