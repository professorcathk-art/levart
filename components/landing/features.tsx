'use client'

import { PawPrint } from '../paw-print'

const features = [
  {
    icon: '💬',
    title: 'Conversational planning',
    description: 'Refine days, swap restaurants, and change dates just by chatting.',
    color: '#FF9A76',
  },
  {
    icon: '🧭',
    title: 'Live itinerary pane',
    description: 'See the plan update beside the chat, Gemini-style, as Levart works.',
    color: '#7ECCC4',
  },
  {
    icon: '🌤️',
    title: 'Weather-aware days',
    description: 'Forecasts help shape indoor and outdoor time for each day.',
    color: '#FFB86C',
  },
  {
    icon: '🔗',
    title: 'Private share links',
    description: 'Send an unlisted link to friends when the plan is confirmed.',
    color: '#C9A9DD',
  },
  {
    icon: '⭐',
    title: 'Community rates & comments',
    description: 'Publish a finished plan so others can view, rate, and leave tips.',
    color: '#87CEEB',
  },
  {
    icon: '📄',
    title: 'Beautiful export',
    description: 'Keep the rich day cards, map, and PDF for the trip you confirmed.',
    color: '#FF9A76',
  },
]

export function Features() {
  return (
    <section className="bg-gradient-to-b from-[#FFF8F3] to-white py-20">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">
            <span className="text-[#FF9A76]">Everything you</span>{' '}
            <span className="text-[#7ECCC4]">need</span>
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-[#2D2D2D]">
            Chat, confirm, share, and collect feedback in one warm place.
          </p>
        </div>
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative rounded-2xl border-2 border-transparent bg-white p-6 shadow-md transition hover:-translate-y-1 hover:border-[#FF9A76]/20 hover:shadow-xl"
            >
              <div className="absolute right-2 top-2 opacity-0 transition group-hover:opacity-100">
                <PawPrint size={25} color={feature.color} opacity={0.3} bounce />
              </div>
              <div className="mb-4 text-4xl">{feature.icon}</div>
              <h3 className="mb-2 text-xl font-bold">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-[#2D2D2D]">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
