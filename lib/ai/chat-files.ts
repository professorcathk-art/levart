import type { UIMessage } from 'ai'

const MAX_PERSISTED_DATA_URL = 8_000

function fileNote(part: { filename?: string; mediaType?: string }): string {
  const name = part.filename || 'attachment'
  const media = part.mediaType || 'file'
  return `[Attached file: ${name} (${media}). The traveler wants this considered in the plan.]`
}

export function filePartsToText(messages: UIMessage[]): UIMessage[] {
  return messages.map((message) => ({
    ...message,
    parts: (message.parts ?? []).map((part) => {
      if (part.type !== 'file') return part
      if ('mediaType' in part && part.mediaType.startsWith('image/')) return part
      return { type: 'text' as const, text: fileNote(part) }
    }),
  }))
}

export function stripHeavyFiles(messages: UIMessage[]): UIMessage[] {
  return messages.map((message) => ({
    ...message,
    parts: (message.parts ?? []).map((part) => {
      if (part.type !== 'file') return part
      const url = 'url' in part && typeof part.url === 'string' ? part.url : ''
      if (url.startsWith('data:') && url.length > MAX_PERSISTED_DATA_URL) {
        return { type: 'text' as const, text: fileNote(part) }
      }
      return part
    }),
  }))
}
