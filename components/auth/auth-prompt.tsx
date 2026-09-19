'use client'

import Link from 'next/link'

interface AuthPromptProps {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  nextPath: string
}

export function AuthPrompt({
  open,
  onClose,
  title = 'Sign in to continue',
  description = 'Create a free account to save, confirm, share, rate, or comment.',
  nextPath,
}: AuthPromptProps) {
  if (!open) return null

  const next = encodeURIComponent(nextPath)

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
        <h2 className="text-2xl font-bold text-[#FF9A76]">{title}</h2>
        <p className="mt-2 text-gray-600">{description}</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href={`/login?next=${next}`}
            className="flex-1 rounded-full bg-gradient-to-r from-[#FF9A76] to-[#FFB86C] px-5 py-3 text-center font-semibold text-white"
          >
            Sign in
          </Link>
          <Link
            href={`/signup?next=${next}`}
            className="flex-1 rounded-full border border-[#FF9A76]/40 px-5 py-3 text-center font-semibold text-[#FF9A76]"
          >
            Sign up
          </Link>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full text-sm text-gray-500 hover:text-gray-800"
        >
          Keep chatting without saving
        </button>
      </div>
    </div>
  )
}
