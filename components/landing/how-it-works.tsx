'use client'

import { PawPrint } from '../paw-print'

const steps = [
  {
    number: '01',
    title: 'Choose Your Destination',
    description: 'Tell us where you want to go and what you love to do',
    icon: '🌍',
    color: '#FF9A76',
  },
  {
    number: '02',
    title: 'AI Finds Attractions',
    description: 'Our AI discovers the best places matching your interests',
    icon: '✨',
    color: '#7ECCC4',
  },
  {
    number: '03',
    title: 'Get Your Itinerary',
    description: 'Receive a personalized day-by-day plan with routes & tips',
    icon: '📅',
    color: '#FFB86C',
  },
]

export function HowItWorks() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-[#FF9A76]">How It</span>{' '}
            <span className="text-[#7ECCC4]">Works</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Planning your perfect trip is as easy as 1, 2, 3
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="relative group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-[#FF9A76]/20">
                {/* Paw print accent */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <PawPrint size={30} color={step.color} opacity={0.3} bounce />
                </div>

                {/* Step number */}
                <div
                  className="text-6xl font-bold mb-4 opacity-20"
                  style={{ color: step.color }}
                >
                  {step.number}
                </div>

                {/* Icon */}
                <div className="text-5xl mb-4">{step.icon}</div>

                {/* Title */}
                <h3 className="text-2xl font-bold mb-3 text-gray-800">{step.title}</h3>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed">{step.description}</p>

                {/* Decorative corner */}
                <div
                  className="absolute bottom-0 right-0 w-20 h-20 rounded-tl-full opacity-10"
                  style={{ background: `linear-gradient(135deg, ${step.color}, transparent)` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
