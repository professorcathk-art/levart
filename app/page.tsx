import { Hero } from '@/components/landing/hero'
import { HowItWorks } from '@/components/landing/how-it-works'
import { CommunityShowcase } from '@/components/landing/community-showcase'
import { ViewModesDemo } from '@/components/landing/view-modes-demo'
import { Features } from '@/components/landing/features'
import { WhyCatpawtrip } from '@/components/landing/why-catpawtrip'
import { CTA } from '@/components/landing/cta'
import { Footer } from '@/components/landing/footer'
import { getCommunityTrips } from '@/lib/trips/queries'

export default async function HomePage() {
  let trips: Awaited<ReturnType<typeof getCommunityTrips>> = []
  try {
    trips = await getCommunityTrips({ sort: 'rating' })
  } catch (error) {
    console.error('Failed to load landing community trips:', error)
  }

  return (
    <main className="min-h-screen bg-[#FAF6F0] text-[#2B2D42]">
      <Hero />
      <CommunityShowcase trips={trips} />
      <HowItWorks />
      <ViewModesDemo />
      <Features />
      <WhyCatpawtrip />
      <CTA />
      <Footer />
    </main>
  )
}
