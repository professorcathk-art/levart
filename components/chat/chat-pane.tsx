'use client'

import { useRef, useState } from 'react'
import { Paperclip, Send } from 'lucide-react'
import type { UIMessage } from 'ai'
import { MessageList } from '@/components/chat/message-list'
import { StarterChips } from '@/components/chat/starter-chips'
import { ThinkingCat } from '@/components/companion/thinking-cat'
import { useLocale } from '@/components/i18n/locale-provider'

const MAX_BYTES = 5 * 1024 * 1024

interface ChatPaneProps {
  messages: UIMessage[]
  status: 'submitted' | 'streaming' | 'ready' | 'error'
  error?: Error
  onSend: (text: string, files?: FileList) => void
  disabled?: boolean
}

export function ChatPane({ messages, status, error, onSend, disabled }: ChatPaneProps) {
  const { t } = useLocale()
  const [input, setInput] = useState('')
  const [fileName, setFileName] = useState<string | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const busy = status === 'submitted' || status === 'streaming' || disabled

  const submit = (text: string) => {
    const trimmed = text.trim()
    const files = fileRef.current?.files
    const hasFile = Boolean(files && files.length > 0)
    if ((!trimmed && !hasFile) || busy) return
    onSend(trimmed || t('attachNoCaption'), hasFile ? files ?? undefined : undefined)
    setInput('')
    setFileName(null)
    setFileError(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {messages.length === 0 ? (
          <div className="mx-auto max-w-xl space-y-6">
            <div>
              <h1 className="text-3xl font-extrabold text-[#FF9A76]">{t('chatTitle')}</h1>
              <p className="mt-2 font-medium leading-relaxed text-gray-600">{t('chatSubtitle')}</p>
            </div>
            <StarterChips onSelect={submit} disabled={busy} />
            {status === 'submitted' || status === 'streaming' ? <ThinkingCat /> : null}
          </div>
        ) : (
          <div className="mx-auto max-w-xl">
            <MessageList messages={messages} />
            {(status === 'submitted' || status === 'streaming') && <ThinkingCat />}
          </div>
        )}
        {error && (
          <p className="mx-auto mt-4 max-w-xl rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
            {error.message}
          </p>
        )}
      </div>

      <form
        className="border-t border-[#FF9A76]/10 bg-white/80 p-4"
        onSubmit={(event) => {
          event.preventDefault()
          submit(input)
        }}
      >
        <div className="mx-auto flex max-w-xl flex-col gap-2">
          <div className="flex gap-2">
            <label className="sr-only" htmlFor="planner-input">
              {t('chatLabel')}
            </label>
            <input
              id="planner-input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              disabled={busy}
              placeholder={t('chatPlaceholder')}
              className="flex-1 rounded-full border border-gray-200 px-4 py-3 outline-none focus:border-[#FF9A76] focus:ring-2 focus:ring-[#FF9A76]/20 disabled:opacity-60"
            />
            <label className="inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-full border border-orange-100/80 bg-white/90 px-3 text-sm font-semibold text-slate-600 shadow-sm backdrop-blur-sm transition-all hover:scale-[1.03] hover:shadow-md">
              <Paperclip className="h-3.5 w-3.5" aria-hidden />
              {t('attachFile')}
              <input
                ref={fileRef}
                type="file"
                accept="image/*,.pdf,application/pdf"
                className="sr-only"
                disabled={busy}
                onChange={(event) => {
                  const file = event.target.files?.[0]
                  if (!file) {
                    setFileName(null)
                    setFileError(null)
                    return
                  }
                  if (file.size > MAX_BYTES) {
                    setFileName(null)
                    setFileError(t('attachTooBig'))
                    event.target.value = ''
                    return
                  }
                  setFileError(null)
                  setFileName(file.name)
                }}
              />
            </label>
            <button
              type="submit"
              disabled={busy || (!input.trim() && !fileName)}
              className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#FF9A76] to-[#FFB86C] px-5 py-3 font-semibold text-white disabled:opacity-50"
            >
              <Send className="h-3.5 w-3.5" aria-hidden />
              {t('chatSend')}
            </button>
          </div>
          {fileName && <p className="text-xs text-slate-500">{t('attachReady', { name: fileName })}</p>}
          {fileError && (
            <p className="text-xs text-red-600" role="alert">
              {fileError}
            </p>
          )}
          <p className="text-[11px] text-slate-400">{t('attachHint')}</p>
        </div>
      </form>
    </div>
  )
}
