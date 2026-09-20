import type { Metadata } from 'next'
import { LegalPage } from '@/components/legal/legal-page'

export const metadata: Metadata = {
  title: 'Privacy Policy · Catpawtrip',
  description: 'How Catpawtrip collects, uses, and stores your trip and account data.',
}

export default function PrivacyPage() {
  return <LegalPage slug="privacy" />
}
