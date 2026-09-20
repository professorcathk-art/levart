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
  const [copied, setCopied] = useState<'unlisted' | 'public' | null>(null)
  const [busy, setBusy] = useState(false)

  const copyAbsolute = async (path: string, kind: 'unlisted' | 'public') => {
    const absolute = path.startsWith('http') ? path : `${window.location.origin}${path}`
    try {
      await navigator.clipboard.writeText(absolute)
      setCopied(kind)
    } catch (error) {
      console.error('Failed to copy share URL:', error)
    }
    return absolute
  }

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
        await copyAbsolute(payload.url, 'public')
      }
      if (next === 'private') {
        setShareUrl(null)
        setCopied(null)
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
      await copyAbsolute(absolute, 'unlisted')
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
      await copyAbsolute(payload.url, 'public')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not publish')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <IconBadge icon={Share2} onClick={() => setOpen(true)} className="min-h-11 px-4 text-sm">
        {t('share')}
      </IconBadge>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 text-[#1A1A1A] sm:items-center sm:p-4">
          <div className="max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-orange-100/80 bg-white p-5 text-[#1A1A1A] shadow-2xl sm:rounded-3xl sm:p-6">
            <h2 className="text-2xl font-extrabold text-[#E07A5F]">{t('shareTitle', { destination })}</h2>
            <p className="mt-2 text-sm text-slate-600">{t('shareBody')}</p>

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
                    <p className="font-semibold text-[#1A1A1A]">{t('visibilityPrivate')}</p>
                    <p className="mt-1 text-sm text-slate-600">{t('visibilityPrivateHint')}</p>
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
                    <p className="font-semibold text-[#1A1A1A]">{t('visibilityLink')}</p>
                    <p className="mt-1 text-sm text-slate-600">{t('visibilityLinkHint')}</p>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={handleShare}
                      className="mt-3 inline-flex min-h-11 items-center justify-center rounded-full bg-gradient-to-r from-[#FF9A76] to-[#FFB86C] px-4 text-sm font-semibold text-white disabled:opacity-60"
                    >
                      {copied === 'unlisted' ? t('privateLinkCopied') : t('copyPrivateLink')}
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
                    <p className="font-semibold text-[#1A1A1A]">{t('visibilityPublic')}</p>
                    <p className="mt-1 text-sm text-slate-600">{t('visibilityPublicHint')}</p>
                    {publicUrl && currentVisibility === 'public' ? (
                      <div className="mt-3 space-y-2">
                        <div className="flex flex-col gap-2 sm:flex-row">
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => void copyAbsolute(publicUrl, 'public')}
                          className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#2B2D42] px-4 text-sm font-semibold text-white disabled:opacity-60"
                        >
                          {copied === 'public' ? t('publicLinkCopied') : t('copyPublicLink')}
                        </button>
                        <Link
                          href={publicUrl}
                          className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#2B2D42] px-4 text-sm font-semibold text-[#2B2D42]"
                        >
                          {t('viewInCommunity')}
                        </Link>
                        </div>
                        <p className="break-all font-mono text-[11px] text-slate-500">{publicUrl}</p>
                      </div>
                    ) : (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={handlePublish}
                        className="mt-3 inline-flex min-h-11 items-center justify-center rounded-full bg-[#2B2D42] px-4 text-sm font-semibold text-white disabled:opacity-60"
                      >
                        {t('publishToCommunity')}
                      </button>
                    )}
                  </div>
                </div>
              </label>
            </div>

            <p className="mt-4 text-xs text-slate-500">{t('shareRatingsNote')}</p>

            {error && (
              <p className="mt-3 text-sm text-red-600" role="alert">
                {error}
              </p>
            )}

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-4 min-h-11 w-full text-sm font-semibold text-slate-600"
            >
              {t('close')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
