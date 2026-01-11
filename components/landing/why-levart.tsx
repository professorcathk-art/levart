'use client'

import { PawPrint } from '../paw-print'

const values = [
  {
    emoji: '💝',
    title: 'Warm & Friendly',
    description: 'We make travel planning feel personal, not robotic',
  },
  {
    emoji: '⚡',
    title: 'Lightning Fast',
    description: 'Get your complete itinerary in seconds, not hours',
  },
  {
    emoji: '🎯',
    title: 'Personalized',
    description: 'Every itinerary is tailored to your unique interests',
  },
  {
    emoji: '🆓',
    title: 'Completely Free',
    description: 'No hidden fees, no credit card required',
  },
]

export function WhyLevart() {
  return (
    <section className="py-20 bg-gradient-to-br from-[#7ECCC4]/10 via-[#FF9A76]/10 to-[#FFB86C]/10">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-[#FF9A76]">Why</span>{' '}
              <span className="text-[#7ECCC4]">Levart?</span>
            </h2>
            <p className="text-xl text-[#1A1A1A] font-medium">
              We believe travel planning should be{' '}
              <span className="text-[#FF9A76] font-bold">warm, easy, and fun</span>
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {values.map((value, index) => (
              <div
                key={value.title}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{value.emoji}</div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-[#1A1A1A]">{value.title}</h3>
                    <p className="text-[#2D2D2D] font-medium">{value.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Main value prop */}
          <div className="relative bg-gradient-to-r from-[#FF9A76] to-[#FFB86C] rounded-3xl p-8 md:p-12 text-white text-center shadow-2xl overflow-hidden">
            {/* Paw prints decoration */}
            <div className="absolute top-4 left-4 opacity-20">
              <PawPrint size={40} color="#FFFFFF" opacity={0.3} />
            </div>
            <div className="absolute bottom-4 right-4 opacity-20">
              <PawPrint size={35} color="#FFFFFF" opacity={0.3} />
            </div>

            <div className="relative z-10">
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                Your Friendly Travel Companion
              </h3>
              <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
                We combine the power of AI with a warm, human touch. No cold algorithms,
                just thoughtful recommendations that feel like they came from a friend.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
