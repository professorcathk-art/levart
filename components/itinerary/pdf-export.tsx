'use client'

import { useRef } from 'react'
import type { Itinerary } from '@/types'
import { PawPrint } from '../paw-print'

interface PDFExportProps {
  itinerary: Itinerary
}

export function PDFExport({ itinerary }: PDFExportProps) {
  const printRef = useRef<HTMLDivElement>(null)

  const handleDownloadPDF = () => {
    if (!printRef.current) return

    // Hide non-printable elements
    const style = document.createElement('style')
    style.innerHTML = `
      @media print {
        body * {
          visibility: hidden;
        }
        .print-area, .print-area * {
          visibility: visible;
        }
        .print-area {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
        }
        .no-print {
          display: none !important;
        }
        @page {
          size: A4;
          margin: 20mm;
        }
        .page-break {
          page-break-after: always;
        }
      }
    `
    document.head.appendChild(style)

    window.print()

    // Clean up
    setTimeout(() => {
      document.head.removeChild(style)
    }, 1000)
  }

  const totalCost = itinerary.days.reduce((sum, day) => {
    const cost = parseFloat(day.estimatedCost.replace(/[^0-9.]/g, '')) || 0
    return sum + cost
  }, 0)

  return (
    <>
      <button
        onClick={handleDownloadPDF}
        className="no-print fixed bottom-8 right-8 z-50 px-6 py-3 bg-gradient-to-r from-[#FF9A76] to-[#FFB86C] text-white rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 flex items-center gap-2 font-semibold"
      >
        <span>📄</span>
        <span>Download PDF</span>
      </button>

      <div ref={printRef} className="print-area hidden print:block">
        {/* Cover Page */}
        <div className="page-break bg-gradient-to-br from-[#FF9A76] to-[#7ECCC4] min-h-screen flex flex-col items-center justify-center text-white p-20 print:min-h-[297mm]">
          <div className="text-center">
            <div className="mb-8">
              <PawPrint size={80} color="#FFFFFF" opacity={0.6} />
            </div>
            <h1 className="text-6xl font-bold mb-4">Levart</h1>
            <h2 className="text-4xl mb-8">Trip to {itinerary.destination}</h2>
            <div className="text-xl space-y-2">
              <p>{itinerary.checkIn} - {itinerary.checkOut || itinerary.checkIn}</p>
              <p>{itinerary.days.length} Days</p>
              <p className="mt-6 text-2xl font-semibold">Total Estimated Cost: ${totalCost.toFixed(0)}</p>
            </div>
          </div>
        </div>

        {/* Trip Overview */}
        <div className="page-break p-20">
          <h2 className="text-3xl font-bold mb-6 text-[#FF9A76]">Trip Overview</h2>
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="font-semibold mb-2">Destination</h3>
              <p className="text-gray-600">{itinerary.destination}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Trip Focus</h3>
              <p className="text-gray-600">{itinerary.tripFocus.join(', ')}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Duration</h3>
              <p className="text-gray-600">{itinerary.days.length} days</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Total Distance</h3>
              <p className="text-gray-600">
                {(itinerary.route.totalDistance / 1000).toFixed(1)} km
              </p>
            </div>
          </div>
        </div>

        {/* Days */}
        {itinerary.days.map((day, index) => (
          <div key={day.day} className="page-break p-20">
            <div className="mb-8 pb-4 border-b-2 border-[#FF9A76]">
              <h2 className="text-3xl font-bold text-[#FF9A76] mb-2">
                Day {day.day} - {day.date}
              </h2>
              {day.weather ? (
                <p className="text-gray-600">
                  {day.weather.temperature}°C - {day.weather.description}
                </p>
              ) : (
                <p className="text-gray-600">Weather information not available</p>
              )}
            </div>

            {/* Daily Summary */}
            <div className="bg-gradient-to-r from-[#FFF8F3] to-[#FFE8E0] p-6 rounded-xl mb-8">
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-sm text-gray-600">Cost</div>
                  <div className="text-xl font-bold text-[#FF9A76]">
                    {day.estimatedCost}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Distance</div>
                  <div className="text-xl font-bold text-[#7ECCC4]">
                    {day.totalDistance ? `${day.totalDistance.toFixed(1)} km` : 'N/A'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Duration</div>
                  <div className="text-xl font-bold text-[#FFB86C]">
                    {day.totalDuration ? `${Math.round(day.totalDuration / 60)}h` : 'Full Day'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Difficulty</div>
                  <div className="text-xl font-bold">
                    {(day.difficulty || 'easy').toUpperCase()}
                  </div>
                </div>
              </div>
            </div>

            {/* Activities */}
            <div className="space-y-6">
              {['morning', 'afternoon', 'evening'].map((time) => {
                const activities = day.activities.filter((a) => a.time === time)
                if (activities.length === 0) return null
                return (
                  <div key={time} className="mb-6">
                    <h3 className="text-xl font-bold capitalize mb-4 text-[#7ECCC4]">
                      {time}
                    </h3>
                    {activities.map((activity, idx) => (
                      <div key={idx} className="mb-4 p-4 border-l-4 border-[#FF9A76] bg-gray-50">
                        <h4 className="font-bold text-lg mb-2">{activity.activity}</h4>
                        <p className="text-gray-600 mb-2">{activity.location}</p>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                          {activity.duration && <span>⏱️ {activity.duration}</span>}
                          {activity.cost && <span>💰 {activity.cost}</span>}
                          {activity.distance && <span>🚶 {activity.distance}</span>}
                        </div>
                        {activity.address && (
                          <p className="text-sm text-gray-500 mt-2">📍 {activity.address}</p>
                        )}
                        {activity.tips && activity.tips.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm font-semibold">Tips:</p>
                            <ul className="text-sm text-gray-600 list-disc list-inside">
                              {activity.tips.map((tip, i) => (
                                <li key={i}>{tip}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>

            {/* Restaurants */}
            {day.restaurants.length > 0 && (
              <div className="mt-8 pt-6 border-t-2 border-gray-200">
                <h3 className="text-xl font-bold mb-4">🍽️ Restaurants</h3>
                <div className="space-y-2">
                  {day.restaurants.map((restaurant, idx) => (
                    <div key={idx} className="p-3 bg-gray-50 rounded">
                      <p className="font-semibold">{restaurant.name}</p>
                      {restaurant.cuisine && <p className="text-sm text-gray-600">{restaurant.cuisine}</p>}
                      {restaurant.cost && <p className="text-sm text-[#FF9A76] font-semibold">{restaurant.cost}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Transport */}
            {day.transport.length > 0 && (
              <div className="mt-6 pt-6 border-t-2 border-gray-200">
                <h3 className="text-xl font-bold mb-2">🚇 Transportation</h3>
                <p className="text-gray-600">{day.transport.join(' • ')}</p>
              </div>
            )}
          </div>
        ))}

        {/* Footer on each page */}
        <style jsx>{`
          @media print {
            @page {
              @bottom-center {
                content: 'Levart by 貓爪印 | Trip to ${itinerary.destination} | Page ' counter(page);
                font-size: 10pt;
                color: #666;
              }
            }
          }
        `}</style>
      </div>
    </>
  )
}
