'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  readViewStyle,
  writeViewStyle,
  type DayFilter,
  type ViewStyle,
} from '@/lib/trips/view-style'

interface TripViewContextValue {
  viewStyle: ViewStyle
  setViewStyle: (style: ViewStyle) => void
  filter: DayFilter
  setFilter: (filter: DayFilter) => void
  selectedDay: number | null
  setSelectedDay: (dayNumber: number) => void
  mobilePane: 'list' | 'map'
  setMobilePane: (pane: 'list' | 'map') => void
  collapsedDays: Record<number, boolean>
  toggleDay: (dayNumber: number) => void
  isOffline: boolean
}

const TripViewContext = createContext<TripViewContextValue | null>(null)

export function TripViewProvider({
  children,
  dayNumbers,
}: {
  children: ReactNode
  dayNumbers: number[]
}) {
  const [viewStyle, setViewStyleState] = useState<ViewStyle>('clean')
  const [filter, setFilter] = useState<DayFilter>('all')
  const [selectedDay, setSelectedDay] = useState<number | null>(dayNumbers[0] ?? null)
  const [mobilePane, setMobilePane] = useState<'list' | 'map'>('list')
  const [collapsedDays, setCollapsedDays] = useState<Record<number, boolean>>({})
  const [isOffline, setIsOffline] = useState(false)

  useEffect(() => {
    setViewStyleState(readViewStyle())
    setIsOffline(typeof navigator !== 'undefined' && navigator.onLine === false)
    const on = () => setIsOffline(false)
    const off = () => setIsOffline(true)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => {
      window.removeEventListener('online', on)
      window.removeEventListener('offline', off)
    }
  }, [])

  useEffect(() => {
    if (dayNumbers.length === 0) return
    setSelectedDay((current) => (current && dayNumbers.includes(current) ? current : dayNumbers[0]))
    setCollapsedDays((current) => {
      const next = { ...current }
      for (const day of dayNumbers) {
        if (next[day] === undefined) next[day] = false
      }
      return next
    })
  }, [dayNumbers])

  const setViewStyle = useCallback((style: ViewStyle) => {
    setViewStyleState(style)
    writeViewStyle(style)
  }, [])

  const toggleDay = useCallback((dayNumber: number) => {
    setCollapsedDays((current) => ({
      ...current,
      [dayNumber]: !current[dayNumber],
    }))
  }, [])

  const value = useMemo(
    () => ({
      viewStyle,
      setViewStyle,
      filter,
      setFilter,
      selectedDay,
      setSelectedDay,
      mobilePane,
      setMobilePane,
      collapsedDays,
      toggleDay,
      isOffline,
    }),
    [viewStyle, setViewStyle, filter, selectedDay, mobilePane, collapsedDays, toggleDay, isOffline]
  )

  return <TripViewContext.Provider value={value}>{children}</TripViewContext.Provider>
}

export function useOptionalTripView() {
  return useContext(TripViewContext)
}

export function useTripView() {
  const ctx = useContext(TripViewContext)
  if (!ctx) {
    throw new Error('useTripView must be used inside TripViewProvider')
  }
  return ctx
}
