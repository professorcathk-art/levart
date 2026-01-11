'use client'

import { PawPrint } from '../paw-print'
import Link from 'next/link'

export function CTA() {
  return (
    <section className="py-20 bg-gradient-to-br from-[#FF9A76] via-[#FFB86C] to-[#7ECCC4] relative overflow-hidden">
      {/* Animated paw prints */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 animate-float">
          <PawPrint size={50} color="#FFFFFF" opacity={0.4} />
        </div>
        <div className="absolute top-20 right-20 animate-float animation-delay-500">
          <PawPrint size={40} color="#FFFFFF" opacity={0.4} />
        </div>
        <div className="absolute bottom-20 left-1/4 animate-float animation-delay-1000">
          <PawPrint size={45} color="#FFFFFF" opacity={0.4} />
        </div>
        <div className="absolute bottom-10 right-1/3 animate-float animation-delay-1500">
          <PawPrint size={35} color="#FFFFFF" opacity={0.4} />
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Ready to Plan Your
            <br />
            <span className="text-[#FFF8F3]">Perfect Adventure?</span>
          </h2>
          <p className="text-xl md:text-2xl text-white/90 mb-8">
            Get started in seconds. No sign-up required.
          </p>
          <Link
            href="/plan"
            className="group inline-block relative"
          >
            <button className="relative px-10 py-5 bg-white text-[#FF9A76] rounded-full text-xl font-bold shadow-2xl transform hover:scale-110 transition-all duration-300 hover:rotate-1">
              <span className="relative z-10">Create Free Itinerary</span>
              <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300" />
              {/* Dancing paw prints */}
              <div className="absolute -top-3 -left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-bounce">
                <PawPrint size={25} color="#FF9A76" opacity={0.8} bounce />
              </div>
              <div className="absolute -top-3 -right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 animate-bounce">
                <PawPrint size={25} color="#7ECCC4" opacity={0.8} bounce />
              </div>
              <div className="absolute -bottom-3 -left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200 animate-bounce">
                <PawPrint size={25} color="#FFB86C" opacity={0.8} bounce />
              </div>
              <div className="absolute -bottom-3 -right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-300 animate-bounce">
                <PawPrint size={25} color="#C9A9DD" opacity={0.8} bounce />
              </div>
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}
