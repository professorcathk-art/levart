import type { Metadata } from 'next'
import { ContactPageCopy } from '@/components/feedback/contact-page'

export const metadata: Metadata = {
  title: 'Contact · Catpawtrip',
  description: 'Write to Catpawtrip 貓爪印 about a question, partnership, or a bug.',
}

export default function ContactPage({
  searchParams,
}: {
  searchParams: { type?: string }
}) {
  const type = searchParams.type === 'bug' ? 'bug' : 'contact'
  return <ContactPageCopy type={type} />
}
