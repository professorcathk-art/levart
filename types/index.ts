export type TripFocus =
  | 'shopping'
  | 'food'
  | 'climbing'
  | 'culture'
  | 'nightlife'
  | 'beach'
  | 'family'

export type TripStatus = 'draft' | 'confirmed'
export type TripVisibility = 'private' | 'unlisted' | 'public'

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
  priceLevel?: number
  openingHours?: string[]
  website?: string
  phoneNumber?: string
  placeId?: string
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
  photoReference?: string
  address?: string
  openingHours?: string
  difficulty?: 'easy' | 'moderate' | 'hard'
  crowdLevel?: 'low' | 'medium' | 'high'
  accessibility?: boolean
  popular?: boolean
  free?: boolean
  tips?: string[]
  nearbyAlternatives?: string[]
  notes?: string
  userLocked?: boolean
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
    photo?: string
    address?: string
  }>
  transport: string[]
  estimatedCost: string
  totalDistance?: number
  totalDuration?: number
  difficulty?: 'easy' | 'moderate' | 'hard'
  destinationPhoto?: string
  notes?: string
  userLocked?: boolean
}

export interface PlanVersion {
  id: string
  createdAt: string
  source: 'ai' | 'user' | 'restore'
  summary: string
  itinerary: Itinerary
}

export interface Itinerary {
  destination: string
  tripFocus: TripFocus[]
  selectedAttractions: Attraction[]
  route: RouteData
  days: DayItinerary[]
  checkIn?: string
  checkOut?: string
  notes?: string
  currency?: string
  versions?: PlanVersion[]
  lastChange?: string
  publishedCopy?: Itinerary
}

export interface AffiliateClick {
  userId?: string
  itineraryId?: string
  tripId?: string
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
  cuisinePreferences?: string[]
  transportPreference?: 'walking' | 'public' | 'taxi' | 'rental' | 'flexible'
  departureTime?: 'morning' | 'afternoon' | 'evening' | 'flexible'
  arrivalTime?: 'morning' | 'afternoon' | 'evening' | 'flexible'
  travelRadius?: number
}

export interface Profile {
  id: string
  username: string
  displayName: string
  avatarUrl?: string | null
}

export interface Trip {
  id: string
  ownerId: string | null
  destination: string
  tripFocus: TripFocus[]
  checkIn?: string | null
  checkOut?: string | null
  status: TripStatus
  visibility: TripVisibility
  slug?: string | null
  itinerary: Itinerary
  selectedAttractions: Attraction[]
  route: RouteData
  coverPhoto?: string | null
  createdAt: string
  updatedAt: string
  confirmedAt?: string | null
  owner?: Profile
  avgRating?: number
  ratingCount?: number
  commentCount?: number
}

export interface TripComment {
  id: string
  tripId: string
  userId: string
  parentId?: string | null
  body: string
  createdAt: string
  author?: Profile
}

export interface DestinationSuggestion {
  name: string
  country: string
  state?: string
  formatted: string
  display: string
}

export const TRIP_FOCUS_OPTIONS: { id: TripFocus; label: string; emoji: string }[] = [
  { id: 'food', label: 'Food', emoji: '🍜' },
  { id: 'culture', label: 'Culture', emoji: '🎭' },
  { id: 'shopping', label: 'Shopping', emoji: '🛍️' },
  { id: 'beach', label: 'Beach', emoji: '🏖️' },
  { id: 'nightlife', label: 'Nightlife', emoji: '🌃' },
  { id: 'family', label: 'Family', emoji: '👨‍👩‍👧' },
  { id: 'climbing', label: 'Outdoors', emoji: '🧗' },
]
