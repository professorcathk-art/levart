import { Hero } from '@/components/landing/hero'
import { HowItWorks } from '@/components/landing/how-it-works'
import { Features } from '@/components/landing/features'
import { WhyLevart } from '@/components/landing/why-levart'
import { CTA } from '@/components/landing/cta'
import { Footer } from '@/components/landing/footer'

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Hero />
      <HowItWorks />
      <Features />
      <WhyLevart />
      <CTA />
      <Footer />
    </main>
  )
}
