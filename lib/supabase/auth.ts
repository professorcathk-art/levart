import { createClient } from '@/lib/supabase/server'
import type { User } from '@supabase/supabase-js'
import type { Profile } from '@/types'

export async function getAuthUser(): Promise<User | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  if (error) {
    console.error('Failed to get auth user:', error)
    return null
  }
  return data.user
}

export async function getCurrentProfile(): Promise<Profile | null> {
  const user = await getAuthUser()
  if (!user) return null

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, display_name, avatar_url')
    .eq('id', user.id)
    .maybeSingle()

  if (error || !data) {
    if (error) {
      console.error('Failed to load profile:', error)
    }
    return {
      id: user.id,
      username: user.email?.split('@')[0] ?? 'traveler',
      displayName: user.email?.split('@')[0] ?? 'Traveler',
      avatarUrl: null,
    }
  }

  return {
    id: data.id as string,
    username: data.username as string,
    displayName: data.display_name as string,
    avatarUrl: (data.avatar_url as string | null) ?? null,
  }
}
