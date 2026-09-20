'use client'

import { useState } from 'react'
import { useLocale } from '@/components/i18n/locale-provider'

interface FeedbackFormProps {
  type: 'contact' | 'bug'
}

export function FeedbackForm({ type }: FeedbackFormProps) {
  const { t } = useLocale()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setStatus('sending')
    setError(null)
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          name,
          email,
          message,
          page: typeof window !== 'undefined' ? window.location.href : '',
        }),
      })
      const payload = (await response.json()) as { error?: string }
      if (!response.ok) {
        throw new Error(payload.error || t('feedbackFailed'))
      }
      setStatus('sent')
      setMessage('')
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : t('feedbackFailed'))
    }
  }

  if (status === 'sent') {
    return <p className="rounded-2xl bg-white p-6 text-slate-700 shadow-sm">{t('feedbackSent')}</p>
  }

  return (
    <form onSubmit={submit} className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
      <label className="block text-sm">
        <span className="mb-1 block font-medium text-slate-700">{t('feedbackName')}</span>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="w-full rounded-xl border border-slate-200 px-3 py-2"
          autoComplete="name"
        />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block font-medium text-slate-700">{t('feedbackEmail')}</span>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-xl border border-slate-200 px-3 py-2"
          autoComplete="email"
        />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block font-medium text-slate-700">{t('feedbackMessage')}</span>
        <textarea
          required
          minLength={8}
          rows={6}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className="w-full rounded-xl border border-slate-200 px-3 py-2"
        />
      </label>
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={status === 'sending'}
        className="rounded-full bg-[#E07A5F] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
      >
        {status === 'sending' ? t('feedbackSending') : t('feedbackSend')}
      </button>
    </form>
  )
}
