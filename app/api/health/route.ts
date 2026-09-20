import { NextResponse } from 'next/server'
import { createPublicClient } from '@/lib/supabase/public'
import { getSupabasePublicEnv, getSupabaseServiceRoleKey } from '@/lib/supabase/env'

export const dynamic = 'force-dynamic'

export async function GET() {
  const publicEnv = getSupabasePublicEnv()
  let supabaseReachable = false

  if (publicEnv) {
    try {
      const client = createPublicClient()
      if (client) {
        const { error } = await client.from('profiles').select('id').limit(1)
        supabaseReachable = !error
      }
    } catch (error) {
      console.error('Health check: Supabase unreachable:', error)
    }
  }

  const checks = {
    supabaseConfigured: Boolean(publicEnv),
    supabaseReachable,
    serviceRoleConfigured: Boolean(getSupabaseServiceRoleKey()),
    deepseekConfigured: Boolean(process.env.DEEPSEEK_API_KEY),
    mapboxConfigured: Boolean(
      process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || process.env.MAPBOX_ACCESS_TOKEN
    ),
    siteUrlConfigured: Boolean(process.env.NEXT_PUBLIC_SITE_URL),
    resendConfigured: Boolean(process.env.RESEND_API_KEY),
    googlePlacesConfigured: Boolean(
      process.env.GOOGLE_PLACES_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY
    ),
  }

  return NextResponse.json({
    status: 'ok',
    checks,
  })
}
