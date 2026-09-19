'use client'

import { PawTrail, PawPrint } from '../paw-print'
import { WalkingPawPrints } from './walking-paw-prints'
import Link from 'next/link'

export function Hero() {
  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden bg-gradient-to-br from-[#FFF8F3] via-[#FFE8E0] to-[#FFD4C4]">
      <WalkingPawPrints />
      <PawTrail count={8} startDelay={500} duration={4000} />

      <div className="container relative z-10 mx-auto px-4 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 animate-fade-in-up text-5xl font-bold md:text-7xl">
            <span className="text-[#FF9A76]">Chat your trip</span>
            <br />
            <span className="text-[#7ECCC4]">into a beautiful plan</span>
          </h1>
          <p className="mb-8 animate-fade-in-up text-xl text-gray-700 animation-delay-200">
            Talk with Levart like ChatGPT. Watch a live itinerary appear beside you.
            Confirm when it feels right, then share it or publish it to the community.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/plan"
              className="rounded-full bg-gradient-to-r from-[#FF9A76] to-[#FFB86C] px-8 py-4 text-lg font-semibold text-white shadow-lg transition hover:scale-105"
            >
              Start planning
            </Link>
            <Link
              href="/community"
              className="rounded-full border-2 border-[#FF9A76]/30 bg-white/80 px-8 py-4 text-lg font-semibold text-[#FF9A76]"
            >
              See community trips
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute left-10 top-20 animate-float opacity-20">
        <PawPrint size={60} color="#FF9A76" />
      </div>
      <div className="absolute bottom-20 right-10 animate-float opacity-20 animation-delay-1000">
        <PawPrint size={50} color="#7ECCC4" />
      </div>
    </section>
  )
}
