import type { Metadata, Viewport } from 'next'
import { Suspense } from 'react'
import './globals.css'
import { LocaleProvider } from '@/components/i18n/locale-provider'
import { WalkingCat } from '@/components/companion/walking-cat'
import { SiteHeader } from '@/components/layout/site-header'
import { ServiceWorkerRegister } from '@/components/pwa/service-worker-register'

export const dynamic = 'force-dynamic'

export const viewport: Viewport = {
  themeColor: '#FF9A76',
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: 'Levart - Chat with AI to plan your trip',
  description:
    'Chat with Levart to refine your itinerary, confirm when it feels right, then share or publish it for others to view, rate, and comment.',
  applicationName: 'Levart',
  appleWebApp: {
    capable: true,
    title: 'Levart',
    statusBarStyle: 'default',
  },
  icons: {
    icon: '/icon',
    apple: '/apple-icon',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#FFF8F3] text-[#1A1A1A]">
        <LocaleProvider>
          <Suspense fallback={null}>
            <SiteHeader />
          </Suspense>
          {children}
          <div className="hidden md:block">
            <WalkingCat />
          </div>
          <ServiceWorkerRegister />
        </LocaleProvider>
      </body>
    </html>
  )
}
