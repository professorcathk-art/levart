'use client'

import { PawTrail, PawPrint } from '../paw-print'
import Link from 'next/link'

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#FFF8F3] via-[#FFE8E0] to-[#FFD4C4]">
      {/* Paw prints walking across */}
      <PawTrail count={8} startDelay={500} duration={4000} />
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main headline */}
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 animate-fade-in-up">
            <span className="text-[#FF9A76]">Plan Perfect</span>
            <br />
            <span className="text-[#7ECCC4]">Trips</span>
            <span className="inline-block ml-4 animate-bounce">✨</span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-gray-700 mb-8 animate-fade-in-up animation-delay-200">
            Your AI-powered travel companion that creates personalized itineraries
            <br />
            <span className="text-[#FFB86C] font-semibold">with a warm, friendly touch</span>
          </p>
          
          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up animation-delay-400">
            <Link
              href="/plan"
              className="group relative px-8 py-4 bg-gradient-to-r from-[#FF9A76] to-[#FFB86C] text-white rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 hover:rotate-1"
            >
              <span className="relative z-10">Create Free Itinerary</span>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#FF9A76] to-[#FFB86C] opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300" />
              {/* Paw prints around button on hover */}
              <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <PawPrint size={20} color="#FF9A76" opacity={0.6} bounce />
              </div>
              <div className="absolute -bottom-2 -left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                <PawPrint size={20} color="#7ECCC4" opacity={0.6} bounce />
              </div>
            </Link>
            
            <button className="px-8 py-4 bg-white/80 backdrop-blur-sm text-[#FF9A76] rounded-full text-lg font-semibold border-2 border-[#FF9A76]/30 hover:border-[#FF9A76] hover:bg-white transition-all duration-300">
              Watch Demo
            </button>
          </div>
          
          {/* Trust indicators */}
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-gray-600 animate-fade-in-up animation-delay-600">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              <span>AI-Powered</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚡</span>
              <span>Instant Results</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🆓</span>
              <span>100% Free</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 opacity-20 animate-float">
        <PawPrint size={60} color="#FF9A76" />
      </div>
      <div className="absolute bottom-20 right-10 opacity-20 animate-float animation-delay-1000">
        <PawPrint size={50} color="#7ECCC4" />
      </div>
    </section>
  )
}
