import type { Metadata } from 'next'
import { LegalPage } from '@/components/legal/legal-page'

export const metadata: Metadata = {
  title: 'About Catpawtrip 貓爪印',
  description: 'Catpawtrip is an AI travel companion that turns a chat into a day-by-day itinerary.',
}

export default function AboutPage() {
  return <LegalPage slug="about" />
}
