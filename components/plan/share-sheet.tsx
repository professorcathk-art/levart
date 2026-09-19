'use client'

import { useState } from 'react'
import Link from 'next/link'

interface ShareSheetProps {
  tripId: string
  destination: string
  visibility: 'private' | 'unlisted' | 'public'
  slug?: string | null
}

export function ShareSheet({ tripId, destination, visibility, slug }: ShareSheetProps) {
  const [open, setOpen] = useState(false)
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [publicUrl, setPublicUrl] = useState(slug ? `/p/${slug}` : null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [busy, setBusy] = useState(false)

  const handleShare = async () => {
    setBusy(true)
    setError(null)
    try {
      const response = await fetch(`/api/trips/${tripId}/share`, { method: 'POST' })
      const payload = (await response.json()) as { url?: string; error?: string }
      if (!response.ok || !payload.url) {
        throw new Error(payload.error || 'Could not create share link')
      }
      const absolute = `${window.location.origin}${payload.url}`
      setShareUrl(absolute)
      await navigator.clipboard.writeText(absolute)
      setCopied(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not share')
    } finally {
      setBusy(false)
    }
  }

  const handlePublish = async () => {
    setBusy(true)
    setError(null)
    try {
      const response = await fetch(`/api/trips/${tripId}/publish`, { method: 'POST' })
      const payload = (await response.json()) as { url?: string; error?: string }
      if (!response.ok || !payload.url) {
        throw new Error(payload.error || 'Could not publish')
      }
      setPublicUrl(payload.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not publish')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full bg-white px-5 py-2 font-semibold text-[#FF9A76] shadow"
      >
        Share
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <h2 className="text-2xl font-bold text-[#FF9A76]">Share {destination}</h2>
            <p className="mt-2 text-sm text-gray-600">
              Send a private link, or publish to the Levart community.
            </p>

            <div className="mt-6 space-y-3">
              <button
                type="button"
                disabled={busy}
                onClick={handleShare}
                className="w-full rounded-full bg-gradient-to-r from-[#FF9A76] to-[#FFB86C] px-4 py-3 font-semibold text-white disabled:opacity-60"
              >
                {copied ? 'Private link copied' : 'Copy private link'}
              </button>
              {shareUrl && <p className="break-all text-xs text-gray-500">{shareUrl}</p>}

              {publicUrl ? (
                <Link
                  href={publicUrl}
                  className="block w-full rounded-full border border-[#7ECCC4] px-4 py-3 text-center font-semibold text-[#1A1A1A]"
                >
                  View in community
                </Link>
              ) : (
                <button
                  type="button"
                  disabled={busy}
                  onClick={handlePublish}
                  className="w-full rounded-full border border-[#7ECCC4] px-4 py-3 font-semibold text-[#1A1A1A] disabled:opacity-60"
                >
                  {visibility === 'public' ? 'Already published' : 'Publish to community'}
                </button>
              )}
            </div>

            {error && (
              <p className="mt-3 text-sm text-red-600" role="alert">
                {error}
              </p>
            )}

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-4 w-full text-sm text-gray-500"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
