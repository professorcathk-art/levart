'use client'

import { PawPrint } from '../paw-print'

const steps = [
  {
    number: '01',
    title: 'Chat about the trip',
    description: 'Tell Levart the destination, dates, and vibe. No forms to grind through.',
    icon: '💬',
    color: '#FF9A76',
  },
  {
    number: '02',
    title: 'Watch the plan appear',
    description: 'A live itinerary updates on the side as you refine morning, food, and routes.',
    icon: '🗺️',
    color: '#7ECCC4',
  },
  {
    number: '03',
    title: 'Confirm when it feels right',
    description: 'Freeze a beautiful plan, then share a private link or publish it for others.',
    icon: '✨',
    color: '#FFB86C',
  },
]

export function HowItWorks() {
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">
            <span className="text-[#FF9A76]">How it</span>{' '}
            <span className="text-[#7ECCC4]">works</span>
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-[#2D2D2D]">
            Plan like a conversation. Confirm only when you are satisfied.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number} className="group relative">
              <div className="relative rounded-3xl border-2 border-transparent bg-gradient-to-br from-white to-gray-50 p-8 shadow-lg transition hover:-translate-y-2 hover:border-[#FF9A76]/20 hover:shadow-2xl">
                <div className="absolute right-4 top-4 opacity-0 transition group-hover:opacity-100">
                  <PawPrint size={30} color={step.color} opacity={0.3} bounce />
                </div>
                <div className="mb-4 text-6xl font-bold opacity-20" style={{ color: step.color }}>
                  {step.number}
                </div>
                <div className="mb-4 text-5xl">{step.icon}</div>
                <h3 className="mb-3 text-2xl font-bold">{step.title}</h3>
                <p className="leading-relaxed text-[#2D2D2D]">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
