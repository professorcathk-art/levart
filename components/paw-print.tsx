'use client'

import { useEffect, useState } from 'react'

interface PawPrintProps {
  size?: number
  color?: string
  opacity?: number
  className?: string
  delay?: number
  bounce?: boolean
}

export function PawPrint({ 
  size = 40, 
  color = '#FF9A76', 
  opacity = 0.25,
  className = '',
  delay = 0,
  bounce = true
}: PawPrintProps) {
  const [visible, setVisible] = useState(false)
  const [bouncing, setBouncing] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true)
      if (bounce) {
        setBouncing(true)
        setTimeout(() => setBouncing(false), 300)
      }
    }, delay)

    return () => clearTimeout(timer)
  }, [delay, bounce])

  if (!visible) return null

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`paw-print ${className} ${bouncing ? 'animate-bounce' : ''}`}
      style={{
        opacity: visible ? opacity : 0,
        transition: 'opacity 0.3s ease-in',
      }}
    >
      {/* Paw pad */}
      <ellipse cx="50" cy="65" rx="20" ry="15" fill={color} />
      {/* Toes */}
      <ellipse cx="30" cy="40" rx="12" ry="10" fill={color} />
      <ellipse cx="50" cy="35" rx="12" ry="10" fill={color} />
      <ellipse cx="70" cy="40" rx="12" ry="10" fill={color} />
      <ellipse cx="40" cy="25" rx="10" ry="8" fill={color} />
      <ellipse cx="60" cy="25" rx="10" ry="8" fill={color} />
    </svg>
  )
}

interface PawTrailProps {
  count?: number
  startDelay?: number
  duration?: number
  className?: string
}

export function PawTrail({ 
  count = 5, 
  startDelay = 0,
  duration = 3000,
  className = ''
}: PawTrailProps) {
  const [paws, setPaws] = useState<Array<{ id: number; delay: number; x: number; y: number }>>([])

  useEffect(() => {
    const newPaws = Array.from({ length: count }, (_, i) => ({
      id: i,
      delay: startDelay + i * 200,
      x: Math.random() * 100,
      y: Math.random() * 100,
    }))
    setPaws(newPaws)

    // Remove paws after duration
    const timer = setTimeout(() => {
      setPaws([])
    }, duration)

    return () => clearTimeout(timer)
  }, [count, startDelay, duration])

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      {paws.map((paw) => (
        <div
          key={paw.id}
          className="absolute"
          style={{
            left: `${paw.x}%`,
            top: `${paw.y}%`,
            animation: `fadeOut ${duration}ms ease-out ${paw.delay}ms forwards`,
          }}
        >
          <PawPrint size={30} opacity={0.2} bounce />
        </div>
      ))}
    </div>
  )
}
