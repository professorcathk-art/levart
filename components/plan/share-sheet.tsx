'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Share2 } from 'lucide-react'
import { useLocale } from '@/components/i18n/locale-provider'
import { IconBadge } from '@/components/ui/icon-badge'
import type { TripVisibility } from '@/types'

interface ShareSheetProps {
  tripId: string
  destination: string
  visibility: TripVisibility
  slug?: string | null
}

export function ShareSheet({ tripId, destination, visibility, slug }: ShareSheetProps) {
  const { t } = useLocale()
  const [open, setOpen] = useState(false)
  const [currentVisibility, setCurrentVisibility] = useState<TripVisibility>(visibility)
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [publicUrl, setPublicUrl] = useState(slug ? `/p/${slug}` : null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [busy, setBusy] = useState(false)

  const setVisibility = async (next: TripVisibility) => {
    setBusy(true)
    setError(null)
    try {
      const response = await fetch(`/api/trips/${tripId}/visibility`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visibility: next }),
      })
      const payload = (await response.json()) as { error?: string; url?: string | null; slug?: string }
      if (!response.ok) {
        throw new Error(payload.error || 'Could not update sharing')
      }
      setCurrentVisibility(next)
      if (next === 'public' && payload.url) {
        setPublicUrl(payload.url)
      }
      if (next === 'private') {
        setShareUrl(null)
        setCopied(false)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update sharing')
    } finally {
      setBusy(false)
    }
  }

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
      setCurrentVisibility((prev) => (prev === 'public' ? prev : 'unlisted'))
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
      setCurrentVisibility('public')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not publish')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <IconBadge icon={Share2} onClick={() => setOpen(true)} className="min-h-11 bg-white px-4 text-sm text-[#E07A5F]">
        {t('share')}
      </IconBadge>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-3xl border border-orange-100/80 bg-white/95 p-6 shadow-2xl backdrop-blur-sm">
            <h2 className="text-2xl font-extrabold text-[#FF9A76]">{t('shareTitle', { destination })}</h2>
            <p className="mt-2 text-sm text-gray-600">{t('shareBody')}</p>

            <div className="mt-6 space-y-3">
              <label className={`block cursor-pointer rounded-2xl border p-4 ${currentVisibility === 'private' ? 'border-[#FF9A76] bg-[#FFF8F3]' : 'border-gray-200'}`}>
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="visibility"
                    className="mt-1"
                    checked={currentVisibility === 'private'}
                    disabled={busy}
                    onChange={() => setVisibility('private')}
                  />
                  <div>
                    <p className="font-semibold">{t('visibilityPrivate')}</p>
                    <p className="mt-1 text-sm text-gray-600">{t('visibilityPrivateHint')}</p>
                  </div>
                </div>
              </label>

              <label className={`block cursor-pointer rounded-2xl border p-4 ${currentVisibility === 'unlisted' ? 'border-[#FF9A76] bg-[#FFF8F3]' : 'border-gray-200'}`}>
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="visibility"
                    className="mt-1"
                    checked={currentVisibility === 'unlisted'}
                    disabled={busy}
                    onChange={() => void handleShare()}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">{t('visibilityLink')}</p>
                    <p className="mt-1 text-sm text-gray-600">{t('visibilityLinkHint')}</p>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={handleShare}
                      className="mt-3 rounded-full bg-gradient-to-r from-[#FF9A76] to-[#FFB86C] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                    >
                      {copied ? t('privateLinkCopied') : t('copyPrivateLink')}
                    </button>
                    {shareUrl && <p className="mt-2 break-all text-xs text-gray-500">{shareUrl}</p>}
                  </div>
                </div>
              </label>

              <label className={`block cursor-pointer rounded-2xl border p-4 ${currentVisibility === 'public' ? 'border-[#7ECCC4] bg-[#F3FFFD]' : 'border-gray-200'}`}>
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="visibility"
                    className="mt-1"
                    checked={currentVisibility === 'public'}
                    disabled={busy}
                    onChange={() => void handlePublish()}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">{t('visibilityPublic')}</p>
                    <p className="mt-1 text-sm text-gray-600">{t('visibilityPublicHint')}</p>
                    {publicUrl && currentVisibility === 'public' ? (
                      <Link
                        href={publicUrl}
                        className="mt-3 inline-block rounded-full border border-[#7ECCC4] px-4 py-2 text-sm font-semibold text-[#1A1A1A]"
                      >
                        {t('viewInCommunity')}
                      </Link>
                    ) : (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={handlePublish}
                        className="mt-3 rounded-full border border-[#7ECCC4] px-4 py-2 text-sm font-semibold disabled:opacity-60"
                      >
                        {t('publishToCommunity')}
                      </button>
                    )}
                  </div>
                </div>
              </label>
            </div>

            <p className="mt-4 text-xs text-gray-500">{t('shareRatingsNote')}</p>

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
              {t('close')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
