'use client'

import { useMemo, useState } from 'react'
import { AuthPrompt } from '@/components/auth/auth-prompt'
import type { TripComment } from '@/types'

interface CommentThreadProps {
  tripId: string
  slug: string
  signedIn: boolean
  currentUserId?: string
  initialComments: TripComment[]
}

export function CommentThread({
  tripId,
  slug,
  signedIn,
  currentUserId,
  initialComments,
}: CommentThreadProps) {
  const [comments, setComments] = useState(initialComments)
  const [body, setBody] = useState('')
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [authOpen, setAuthOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const roots = useMemo(
    () => comments.filter((comment) => !comment.parentId),
    [comments]
  )

  const submit = async () => {
    if (!signedIn) {
      setAuthOpen(true)
      return
    }
    const text = body.trim()
    if (!text) return
    setBusy(true)
    setError(null)
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tripId, body: text, parentId: replyTo }),
      })
      const payload = (await response.json()) as { comment?: TripComment; error?: string }
      if (!response.ok || !payload.comment) {
        throw new Error(payload.error || 'Could not post comment')
      }
      setComments((current) => [...current, payload.comment!])
      setBody('')
      setReplyTo(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not post comment')
    } finally {
      setBusy(false)
    }
  }

  const remove = async (id: string) => {
    const response = await fetch(`/api/comments?id=${id}`, { method: 'DELETE' })
    if (response.ok) {
      setComments((current) => current.filter((comment) => comment.id !== id && comment.parentId !== id))
    }
  }

  return (
    <section className="rounded-3xl bg-white p-6 shadow">
      <h2 className="text-xl font-bold text-[#1A1A1A]">Comments</h2>

      <div className="mt-4 space-y-4">
        {roots.length === 0 && <p className="text-sm text-gray-500">Be the first to leave a note.</p>}
        {roots.map((comment) => (
          <article key={comment.id} className="rounded-2xl bg-[#FFF8F3] p-4">
            <p className="text-sm font-semibold text-[#FF9A76]">
              {comment.author?.displayName ?? 'Traveler'}
            </p>
            <p className="mt-1 text-sm text-gray-800">{comment.body}</p>
            <div className="mt-2 flex gap-3 text-xs text-gray-500">
              <button type="button" onClick={() => setReplyTo(comment.id)}>
                Reply
              </button>
              {currentUserId === comment.userId && (
                <button type="button" onClick={() => remove(comment.id)}>
                  Delete
                </button>
              )}
            </div>
            {comments
              .filter((item) => item.parentId === comment.id)
              .map((reply) => (
                <article key={reply.id} className="mt-3 ml-4 border-l-2 border-[#FF9A76]/20 pl-3">
                  <p className="text-sm font-semibold text-[#7ECCC4]">
                    {reply.author?.displayName ?? 'Traveler'}
                  </p>
                  <p className="mt-1 text-sm text-gray-800">{reply.body}</p>
                  {currentUserId === reply.userId && (
                    <button
                      type="button"
                      onClick={() => remove(reply.id)}
                      className="mt-1 text-xs text-gray-500"
                    >
                      Delete
                    </button>
                  )}
                </article>
              ))}
          </article>
        ))}
      </div>

      <form
        className="mt-6"
        onSubmit={(event) => {
          event.preventDefault()
          void submit()
        }}
      >
        {replyTo && (
          <p className="mb-2 text-xs text-gray-500">
            Replying to a comment.{' '}
            <button type="button" onClick={() => setReplyTo(null)} className="underline">
              Cancel
            </button>
          </p>
        )}
        <textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          maxLength={2000}
          rows={3}
          placeholder={signedIn ? 'Share a tip or ask a question…' : 'Sign in to comment'}
          className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-[#FF9A76]"
        />
        {error && (
          <p className="mt-2 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={busy || !body.trim()}
          className="mt-3 rounded-full bg-gradient-to-r from-[#FF9A76] to-[#FFB86C] px-5 py-2 font-semibold text-white disabled:opacity-50"
        >
          Post comment
        </button>
      </form>

      <AuthPrompt
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        title="Sign in to comment"
        nextPath={`/p/${slug}`}
      />
    </section>
  )
}
