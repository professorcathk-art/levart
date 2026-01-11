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
  photoReference?: string
  rating?: number
  userRatingsTotal?: number
  priceLevel?: number // 0-4, where 0 is free and 4 is very expensive
  openingHours?: string[]
  website?: string
  phoneNumber?: string
  placeId?: string // Google Place ID for deduplication
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
  distance?: string
  type?: 'attraction' | 'restaurant' | 'shopping' | 'nightlife' | 'nature' | 'culture'
  photo?: string
  address?: string
  openingHours?: string
  difficulty?: 'easy' | 'moderate' | 'hard'
  crowdLevel?: 'low' | 'medium' | 'high'
  accessibility?: boolean
  popular?: boolean
  free?: boolean
  tips?: string[]
  nearbyAlternatives?: string[]
}

export interface DayItinerary {
  day: number
  date: string
  weather?: {
    temperature: number
    condition: string
    description: string
  }
  activities: DayActivity[]
  restaurants: Array<{
    name: string
    cuisine?: string
    cost?: string
    photoUrl?: string
    photo?: string // Legacy support
    address?: string
  }>
  transport: string[]
  estimatedCost: string
  totalDistance?: number
  totalDuration?: number
  difficulty?: 'easy' | 'moderate' | 'hard'
  destinationPhoto?: string
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

export interface WeatherForecast {
  date: string
  temperature: number
  condition: string
  description: string
}

export interface TripPreferences {
  budget?: 'budget' | 'moderate' | 'luxury' | 'flexible'
  cuisinePreferences?: string[] // e.g., ['Italian', 'Japanese', 'Local']
  transportPreference?: 'walking' | 'public' | 'taxi' | 'rental' | 'flexible'
  departureTime?: 'morning' | 'afternoon' | 'evening' | 'flexible'
  arrivalTime?: 'morning' | 'afternoon' | 'evening' | 'flexible'
  travelRadius?: number // in kilometers, default 20km
}
