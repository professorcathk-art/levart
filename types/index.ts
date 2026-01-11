export type TripFocus = 
  | 'shopping'
  | 'food'
  | 'climbing'
  | 'culture'
  | 'nightlife'
  | 'beach'
  | 'family'

export interface Attraction {
  id: string
  name: string
  category: string
  lat: number
  lon: number
  address?: string
  description?: string
}

export interface RoutePoint {
  lat: number
  lon: number
  attractionId?: string
}

export interface RouteData {
  points: RoutePoint[]
  polyline: string
  totalDistance: number
  totalDuration: number
}

export interface DayActivity {
  time: 'morning' | 'afternoon' | 'evening'
  activity: string
  location: string
  duration?: string
  cost?: string
}

export interface DayItinerary {
  day: number
  date: string
  weather: {
    temperature: number
    condition: string
    description: string
  }
  activities: DayActivity[]
  restaurants: Array<{
    name: string
    cuisine?: string
    cost?: string
  }>
  transport: string[]
  estimatedCost: string
}

export interface Itinerary {
  destination: string
  tripFocus: TripFocus[]
  selectedAttractions: Attraction[]
  route: RouteData
  days: DayItinerary[]
  checkIn?: string
  checkOut?: string
}

export interface AffiliateClick {
  userId?: string
  itineraryId?: string
  clickType: 'hotel' | 'flight' | 'activity'
  destination: string
  timestamp: string
}
