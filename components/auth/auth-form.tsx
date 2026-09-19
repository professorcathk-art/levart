'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface AuthFormProps {
  mode: 'login' | 'signup'
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') ?? '/'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setInfo(null)
    setLoading(true)

    const supabase = createClient()

    try {
      if (mode === 'signup') {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
          },
        })
        if (signUpError) {
          throw signUpError
        }
        setInfo('Check your email to confirm your account, then sign in.')
        return
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (signInError) {
        throw signInError
      }

      router.replace(next)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setError(null)
    const supabase = createClient()
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    })
    if (oauthError) {
      setError(oauthError.message)
    }
  }

  return (
    <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
      <h1 className="mb-2 text-3xl font-bold text-[#FF9A76]">
        {mode === 'login' ? 'Welcome back' : 'Create your account'}
      </h1>
      <p className="mb-6 text-gray-600">
        {mode === 'login'
          ? 'Sign in to save, confirm, and share your trip.'
          : 'Save plans, publish to the community, and comment on others.'}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-700">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#FF9A76] focus:ring-2 focus:ring-[#FF9A76]/20"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-700">Password</span>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#FF9A76] focus:ring-2 focus:ring-[#FF9A76]/20"
          />
        </label>

        {error && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
            {error}
          </p>
        )}
        {info && (
          <p className="rounded-xl bg-teal-50 px-4 py-3 text-sm text-teal-800" role="status">
            {info}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-gradient-to-r from-[#FF9A76] to-[#FFB86C] px-6 py-3 font-semibold text-white shadow-lg transition hover:shadow-xl disabled:opacity-60"
        >
          {loading ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Sign up'}
        </button>
      </form>

      <button
        type="button"
        onClick={handleGoogle}
        className="mt-4 w-full rounded-full border border-gray-200 bg-white px-6 py-3 font-semibold text-gray-700 transition hover:border-[#7ECCC4]"
      >
        Continue with Google
      </button>

      <p className="mt-6 text-center text-sm text-gray-600">
        {mode === 'login' ? (
          <>
            New here?{' '}
            <Link href={`/signup?next=${encodeURIComponent(next)}`} className="font-semibold text-[#FF9A76]">
              Create an account
            </Link>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <Link href={`/login?next=${encodeURIComponent(next)}`} className="font-semibold text-[#FF9A76]">
              Sign in
            </Link>
          </>
        )}
      </p>
    </div>
  )
}
