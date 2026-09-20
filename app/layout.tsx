import type { Metadata, Viewport } from 'next'
import { Suspense } from 'react'
import { JetBrains_Mono, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { LocaleProvider } from '@/components/i18n/locale-provider'
import { WalkingCat } from '@/components/companion/walking-cat'
import { SiteHeader } from '@/components/layout/site-header'
import { ServiceWorkerRegister } from '@/components/pwa/service-worker-register'

export const dynamic = 'force-dynamic'

const sans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const viewport: Viewport = {
  themeColor: '#E07A5F',
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://catpawtrip.com'),
  title: 'Catpawtrip 貓爪印 - Chat with AI to plan your trip',
  description:
    'Chat with Catpawtrip 貓爪印 to refine your itinerary, confirm when it feels right, then share or publish it for others to view, rate, and comment.',
  applicationName: 'Catpawtrip 貓爪印',
  appleWebApp: {
    capable: true,
    title: '貓爪印',
    statusBarStyle: 'default',
  },
  icons: {
    icon: '/icon.svg',
    apple: '/apple-icon',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body className="min-h-screen bg-[#FAF6F0] font-sans font-medium leading-relaxed text-[#2B2D42]">
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
