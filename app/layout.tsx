import type { Metadata } from 'next'
import { Suspense } from 'react'
import './globals.css'
import { SiteHeader } from '@/components/layout/site-header'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Levart - Chat with AI to plan your trip',
  description:
    'Chat with Levart to refine your itinerary, confirm when it feels right, then share or publish it for others to view, rate, and comment.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#FFF8F3] text-[#1A1A1A]">
        <Suspense fallback={null}>
          <SiteHeader />
        </Suspense>
        {children}
      </body>
    </html>
  )
}
