'use client'

import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import type { Attraction } from '@/types'

interface MapComponentProps {
  attractions: Attraction[]
  routePolyline: string
  className?: string
}

export function MapComponent({ attractions, routePolyline, className }: MapComponentProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const markers = useRef<mapboxgl.Marker[]>([])
  const [mapLoaded, setMapLoaded] = useState(false)
  const [mapboxToken, setMapboxToken] = useState<string | null>(null)

  useEffect(() => {
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

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [0, 0],
      zoom: 1,
    })

    map.current.on('load', () => {
      setMapLoaded(true)
    })

    return () => {
      markers.current.forEach((marker) => marker.remove())
      markers.current = []
      map.current?.remove()
      map.current = null
      setMapLoaded(false)
    }
  }, [mapboxToken])

  useEffect(() => {
    if (!map.current || !mapLoaded) return

    markers.current.forEach((marker) => marker.remove())
    markers.current = attractions.map((attraction) =>
      new mapboxgl.Marker({ color: '#E07A5F' })
        .setLngLat([attraction.lon, attraction.lat])
        .setPopup(new mapboxgl.Popup().setHTML(`<strong>${attraction.name}</strong>`))
        .addTo(map.current!)
    )

    if (attractions.length === 1) {
      map.current.easeTo({
        center: [attractions[0].lon, attractions[0].lat],
        zoom: 13,
      })
    } else if (attractions.length > 1) {
      const bounds = new mapboxgl.LngLatBounds()
      attractions.forEach((attraction) => bounds.extend([attraction.lon, attraction.lat]))
      map.current.fitBounds(bounds, { padding: 48, maxZoom: 14, duration: 400 })
    }

    if (!routePolyline) return

    try {
      const coordinates = JSON.parse(routePolyline) as number[]
      const routePoints: [number, number][] = []
      for (let i = 0; i < coordinates.length; i += 2) {
        routePoints.push([coordinates[i + 1], coordinates[i]])
      }

      if (routePoints.length < 2) return

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
            'line-color': '#7ECCC4',
            'line-width': 4,
          },
        })
      }
    } catch (error) {
      console.error('Error rendering map:', error)
    }
  }, [mapLoaded, routePolyline, attractions])

  if (!mapboxToken) {
    return (
      <div className={`flex items-center justify-center bg-slate-100 ${className ?? 'h-64 rounded-lg'}`}>
        <p className="text-sm text-slate-500">Loading map...</p>
      </div>
    )
  }

  return <div ref={mapContainer} className={className ?? 'h-64 w-full overflow-hidden rounded-lg md:h-96'} />
}
