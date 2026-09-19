'use client'

import { useState } from 'react'
import type { UIMessage } from 'ai'
import { MessageList } from '@/components/chat/message-list'
import { StarterChips } from '@/components/chat/starter-chips'

interface ChatPaneProps {
  messages: UIMessage[]
  status: 'submitted' | 'streaming' | 'ready' | 'error'
  error?: Error
  onSend: (text: string) => void
  disabled?: boolean
}

export function ChatPane({ messages, status, error, onSend, disabled }: ChatPaneProps) {
  const [input, setInput] = useState('')
  const busy = status === 'submitted' || status === 'streaming' || disabled

  const submit = (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || busy) return
    onSend(trimmed)
    setInput('')
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {messages.length === 0 ? (
          <div className="mx-auto max-w-xl space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-[#FF9A76]">Chat your trip into shape</h1>
              <p className="mt-2 text-gray-600">
                Tell Levart where you want to go, when, and what you love. Watch the plan appear on the right.
              </p>
            </div>
            <StarterChips onSelect={submit} disabled={busy} />
          </div>
        ) : (
          <div className="mx-auto max-w-xl">
            <MessageList messages={messages} />
            {busy && (
              <p className="mt-4 text-sm text-gray-500" aria-live="polite">
                Levart is thinking…
              </p>
            )}
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
        <div className="mx-auto flex max-w-xl gap-2">
          <label className="sr-only" htmlFor="planner-input">
            Message Levart
          </label>
          <input
            id="planner-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            disabled={busy}
            placeholder="Ask to add a food day, swap a museum, change dates…"
            className="flex-1 rounded-full border border-gray-200 px-4 py-3 outline-none focus:border-[#FF9A76] focus:ring-2 focus:ring-[#FF9A76]/20 disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={busy || !input.trim()}
            className="rounded-full bg-gradient-to-r from-[#FF9A76] to-[#FFB86C] px-5 py-3 font-semibold text-white disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  )
}
