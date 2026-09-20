'use client'

import type { UIMessage } from 'ai'
import { useLocale } from '@/components/i18n/locale-provider'

interface MessageListProps {
  messages: UIMessage[]
}

export function MessageList({ messages }: MessageListProps) {
  const { t } = useLocale()
  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <article
          key={message.id}
          className={`max-w-[92%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
            message.role === 'user'
              ? 'ml-auto bg-gradient-to-r from-[#FF9A76] to-[#FFB86C] text-white'
              : 'bg-white text-[#1A1A1A] shadow-sm'
          }`}
        >
          {message.parts.map((part, index) => {
            if (part.type === 'text') {
              return (
                <p key={`${message.id}-${index}`} className="whitespace-pre-wrap">
                  {part.text}
                </p>
              )
            }
            if (part.type === 'file') {
              const name = 'filename' in part && part.filename ? part.filename : t('attachFile')
              return (
                <p key={`${message.id}-${index}`} className="mt-1 text-xs opacity-80">
                  📎 {name}
                </p>
              )
            }
            if (part.type.startsWith('tool-') && 'state' in part) {
              const state = (part as { state?: string }).state
              if (state === 'output-available' || state === 'done') {
                return null
              }
              return (
                <p key={`${message.id}-${index}`} className="text-xs opacity-70">
                  {t('chatUpdating')}
                </p>
              )
            }
            return null
          })}
        </article>
      ))}
    </div>
  )
}
