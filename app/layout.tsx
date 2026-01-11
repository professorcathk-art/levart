import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Levart - Your Friendly AI Travel Companion',
  description: 'Plan perfect trips with AI-powered itineraries. Warm, friendly, and completely free.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
