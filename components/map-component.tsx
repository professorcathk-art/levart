'use client'

import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import type { Attraction } from '@/types'

interface MapComponentProps {
  attractions: Attraction[]
  routePolyline: string
}

export function MapComponent({
  attractions,
  routePolyline,
}: MapComponentProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [mapboxToken, setMapboxToken] = useState<string | null>(null)

  useEffect(() => {
    // Fetch Mapbox token from API
    fetch('/api/mapbox/config')
      .then((res) => res.json())
      .then((data) => {
        if (data.mapboxToken) {
          setMapboxToken(data.mapboxToken)
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!mapContainer.current || map.current || !mapboxToken) return

    mapboxgl.accessToken = mapboxToken

    // Calculate center from attractions
    const centerLat =
      attractions.reduce((sum, a) => sum + a.lat, 0) / attractions.length
    const centerLon =
      attractions.reduce((sum, a) => sum + a.lon, 0) / attractions.length

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [centerLon, centerLat],
      zoom: 12,
    })

    map.current.on('load', () => {
      setMapLoaded(true)
    })

    return () => {
      map.current?.remove()
    }
  }, [attractions, mapboxToken])

  useEffect(() => {
    if (!map.current || !mapLoaded || !routePolyline) return

    try {
      const coordinates = JSON.parse(routePolyline) as number[]
      const routePoints: [number, number][] = []
      for (let i = 0; i < coordinates.length; i += 2) {
        routePoints.push([coordinates[i + 1], coordinates[i]])
      }

      // Add route line
      if (map.current.getSource('route')) {
        ;(map.current.getSource('route') as mapboxgl.GeoJSONSource).setData({
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: routePoints,
          },
        })
      } else {
        map.current.addLayer({
          id: 'route',
          type: 'line',
          source: {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: routePoints,
              },
            },
          },
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#3b82f6',
            'line-width': 4,
          },
        })
      }

      // Add markers for attractions
      attractions.forEach((attraction) => {
        const marker = new mapboxgl.Marker({ color: '#ef4444' })
          .setLngLat([attraction.lon, attraction.lat])
          .setPopup(
            new mapboxgl.Popup().setHTML(`<strong>${attraction.name}</strong>`)
          )
          .addTo(map.current!)
      })
    } catch (error) {
      console.error('Error rendering map:', error)
    }
  }, [mapLoaded, routePolyline, attractions])

  if (!mapboxToken) {
    return (
      <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Loading map...</p>
      </div>
    )
  }

  return (
    <div
      ref={mapContainer}
      className="w-full h-64 md:h-96 rounded-lg overflow-hidden"
    />
  )
}
