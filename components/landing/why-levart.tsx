'use client'

import { PawPrint } from '../paw-print'

const values = [
  {
    emoji: '💬',
    title: 'Conversation first',
    description: 'No more one-shot wizard. Keep talking until the plan feels like yours.',
  },
  {
    emoji: '✅',
    title: 'You confirm',
    description: 'Nothing is locked until you tap Confirm. Edit again whenever you want.',
  },
  {
    emoji: '🌍',
    title: 'Share the good ones',
    description: 'Private links for friends, or publish so the community can rate and comment.',
  },
  {
    emoji: '🧡',
    title: 'Warm, not robotic',
    description: 'The same friendly Levart voice, now with a real planning loop.',
  },
]

export function WhyLevart() {
  return (
    <section className="bg-gradient-to-br from-[#7ECCC4]/10 via-[#FF9A76]/10 to-[#FFB86C]/10 py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold md:text-5xl">
              <span className="text-[#FF9A76]">Why</span> <span className="text-[#7ECCC4]">Levart?</span>
            </h2>
            <p className="text-xl text-[#1A1A1A]">
              Travel planning should feel like chatting with a friend who also makes maps.
            </p>
          </div>
          <div className="mb-12 grid gap-6 md:grid-cols-2">
            {values.map((value) => (
              <div key={value.title} className="rounded-2xl bg-white/80 p-6 shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{value.emoji}</div>
                  <div>
                    <h3 className="mb-2 text-xl font-bold">{value.title}</h3>
                    <p className="text-[#2D2D2D]">{value.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#FF9A76] to-[#FFB86C] p-8 text-center text-white shadow-2xl md:p-12">
            <div className="absolute left-4 top-4 opacity-20">
              <PawPrint size={40} color="#FFFFFF" opacity={0.3} />
            </div>
            <h3 className="mb-4 text-3xl font-bold md:text-4xl">Your friendly travel companion</h3>
            <p className="mx-auto max-w-2xl text-lg opacity-90">
              Start chatting with no account. Sign in when you want to save, confirm, share, or join the community.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
