import type { Metadata } from 'next'
import { LegalPage } from '@/components/legal/legal-page'

export const metadata: Metadata = {
  title: 'Terms of Use · Catpawtrip',
  description: 'Rules for using Catpawtrip, including accounts, AI plans, and community posts.',
}

export default function TermsPage() {
  return <LegalPage slug="terms" />
}
