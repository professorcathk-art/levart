import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LevarTrip - AI Trip Planner',
  description: 'Generate AI-powered itineraries and book hotels/flights via Trip.com',
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
