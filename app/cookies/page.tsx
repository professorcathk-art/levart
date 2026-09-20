import type { Metadata } from 'next'
import { LegalPage } from '@/components/legal/legal-page'

export const metadata: Metadata = {
  title: 'Cookies · Catpawtrip',
  description: 'How Catpawtrip uses cookies and browser storage to keep you signed in and remember drafts.',
}

export default function CookiesPage() {
  return <LegalPage slug="cookies" />
}
