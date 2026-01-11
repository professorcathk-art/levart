'use client'

import { useEffect, useState } from 'react'
import { PawPrint } from '../paw-print'

interface PawPrintStep {
  id: string
  x: number
  y: number
  isLeft: boolean
  opacity: number
  scale: number
  timestamp: number
}

interface WalkingCat {
  id: number
  speed: number // pixels per second
  startY: number // vertical position (percentage)
  delay: number // start delay in ms
  direction: 'left' | 'right'
  stepInterval: number // pixels between steps
}

export function WalkingPawPrints() {
  const [pawPrints, setPawPrints] = useState<PawPrintStep[]>([])

  useEffect(() => {
    // Create multiple cats walking at different speeds and positions
    const cats: WalkingCat[] = [
      { id: 1, speed: 40, startY: 15, delay: 0, direction: 'right', stepInterval: 80 },
      { id: 2, speed: 35, startY: 35, delay: 1500, direction: 'left', stepInterval: 75 },
      { id: 3, speed: 45, startY: 55, delay: 3000, direction: 'right', stepInterval: 85 },
      { id: 4, speed: 38, startY: 75, delay: 4500, direction: 'left', stepInterval: 78 },
    ]

    let animationFrame: number
    const startTime = Date.now()

    const animate = () => {
      const now = Date.now()
      const newPrints: PawPrintStep[] = []

      cats.forEach((cat) => {
        const elapsed = now - startTime - cat.delay
        if (elapsed < 0) return

        // Calculate current X position based on speed and elapsed time
        const totalDistance = (elapsed * cat.speed) / 1000
        const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1920
        
        let currentX: number
        if (cat.direction === 'right') {
          currentX = totalDistance % (screenWidth + 400) - 200
        } else {
          currentX = screenWidth - (totalDistance % (screenWidth + 400)) + 200
        }

        // Create paw prints in walking pattern (alternating left/right)
        const steps = Math.floor(Math.abs(totalDistance) / cat.stepInterval)
        
        // Add recent paw prints (last 4 steps for each cat)
        for (let i = 0; i < 4; i++) {
          const stepDistance = i * cat.stepInterval
          let stepX: number
          
          if (cat.direction === 'right') {
            stepX = currentX - stepDistance
          } else {
            stepX = currentX + stepDistance
          }

          // Only show prints that are on screen or just off screen
          if (stepX > -100 && stepX < screenWidth + 100) {
            const fadeDistance = stepDistance
            const opacity = Math.max(0, 0.5 - (fadeDistance / 400))
            const scale = Math.max(0.5, 1 - (fadeDistance / 500))
            
            // Alternate between left and right paws, and slight vertical offset
            const isLeft = (steps - i) % 2 === 0
            const verticalOffset = (steps - i) % 2 === 0 ? 0 : 8

            newPrints.push({
              id: `cat-${cat.id}-${steps - i}-${isLeft ? 'left' : 'right'}`,
              x: stepX + (isLeft ? -25 : 25),
              y: cat.startY + verticalOffset,
              isLeft,
              opacity,
              scale,
              timestamp: now - (i * 100),
            })
          }
        }
      })

      // Keep only prints that are visible and not too old
      setPawPrints((prev) => {
        const combined = [...prev, ...newPrints]
        const filtered = combined.filter((p) => {
          const age = now - p.timestamp
          return p.opacity > 0.05 && age < 2000 // Remove prints older than 2 seconds
        })
        
        // Remove duplicates by ID
        const unique = Array.from(
          new Map(filtered.map((p) => [p.id, p])).values()
        )
        
        return unique
      })

      animationFrame = requestAnimationFrame(animate)
    }

    animationFrame = requestAnimationFrame(animate)

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {pawPrints.map((paw) => (
        <div
          key={paw.id}
          className="absolute"
          style={{
            left: `${paw.x}px`,
            top: `${paw.y}%`,
            opacity: paw.opacity,
            transform: `scale(${paw.scale})`,
            transition: 'opacity 0.3s ease-out',
          }}
        >
          <PawPrint
            size={32}
            color={paw.isLeft ? '#FF9A76' : '#7ECCC4'}
            opacity={paw.opacity}
            className="drop-shadow-md"
          />
        </div>
      ))}
    </div>
  )
}
