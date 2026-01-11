'use client'

import { PawPrint } from '../paw-print'

const features = [
  {
    icon: '🤖',
    title: 'AI-Powered Planning',
    description: 'Advanced AI creates personalized itineraries based on your preferences',
    color: '#FF9A76',
  },
  {
    icon: '🗺️',
    title: 'Smart Route Optimization',
    description: 'Automatically optimizes your route to save time and maximize experiences',
    color: '#7ECCC4',
  },
  {
    icon: '🌤️',
    title: 'Weather-Aware',
    description: 'Considers weather forecasts to suggest the best activities for each day',
    color: '#FFB86C',
  },
  {
    icon: '🍽️',
    title: 'Restaurant Recommendations',
    description: 'Discover local favorites and hidden gems for every meal',
    color: '#C9A9DD',
  },
  {
    icon: '💰',
    title: 'Budget-Friendly',
    description: 'Get cost estimates and find ways to save without compromising fun',
    color: '#87CEEB',
  },
  {
    icon: '📱',
    title: 'Mobile-Friendly',
    description: 'Access your itinerary anywhere, anytime, on any device',
    color: '#FF9A76',
  },
]

export function Features() {
  return (
    <section className="py-20 bg-gradient-to-b from-[#FFF8F3] to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-[#FF9A76]">Everything You</span>{' '}
            <span className="text-[#7ECCC4]">Need</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            All the tools to plan your perfect adventure
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-transparent hover:border-[#FF9A76]/20"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Paw print on hover */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <PawPrint size={25} color={feature.color} opacity={0.3} bounce />
              </div>

              {/* Icon */}
              <div className="text-4xl mb-4">{feature.icon}</div>

              {/* Title */}
              <h3 className="text-xl font-bold mb-2 text-gray-800">{feature.title}</h3>

              {/* Description */}
              <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>

              {/* Color accent */}
              <div
                className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ backgroundColor: feature.color }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
