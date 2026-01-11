/**
 * Generate Trip.com hotel affiliate link
 * @param destination - City name (e.g., "Tokyo", "Bangkok")
 * @param checkIn - Check-in date (YYYY-MM-DD)
 * @param checkOut - Check-out date (YYYY-MM-DD)
 * @param affiliateId - Trip.com affiliate ID
 * @param options - Optional parameters (guests, rooms, etc.)
 */
export function generateHotelAffiliateLink(
  destination: string,
  checkIn: string,
  checkOut: string,
  affiliateId: string,
  options?: {
    adults?: number
    rooms?: number
    children?: number
  }
): string {
  const baseUrl = 'https://www.trip.com/hotels'
  const params = new URLSearchParams({
    city: destination,
    checkIn,
    checkOut,
  })

  // Add affiliate ID (Trip.com format: usually as query param or in path)
  params.append('affiliateId', affiliateId)

  // Add optional parameters
  if (options?.adults) {
    params.append('adults', options.adults.toString())
  }
  if (options?.rooms) {
    params.append('rooms', options.rooms.toString())
  }
  if (options?.children) {
    params.append('children', options.children.toString())
  }

  return `${baseUrl}?${params.toString()}`
}

/**
 * Generate Trip.com flight affiliate link
 * @param origin - Origin city/code (e.g., "New York", "NYC", "JFK")
 * @param destination - Destination city/code (e.g., "Tokyo", "TYO", "NRT")
 * @param departureDate - Departure date (YYYY-MM-DD)
 * @param affiliateId - Trip.com affiliate ID
 * @param options - Optional parameters (return date, passengers, class, etc.)
 */
export function generateFlightAffiliateLink(
  origin: string,
  destination: string,
  departureDate: string,
  affiliateId: string,
  options?: {
    returnDate?: string
    adults?: number
    children?: number
    infants?: number
    cabinClass?: 'economy' | 'business' | 'first'
    tripType?: 'oneway' | 'roundtrip'
  }
): string {
  const baseUrl = 'https://www.trip.com/flights'
  const params = new URLSearchParams({
    from: origin,
    to: destination,
    departureDate,
  })

  // Add affiliate ID
  params.append('affiliateId', affiliateId)

  // Add return date if round trip
  if (options?.returnDate) {
    params.append('returnDate', options.returnDate)
    params.append('tripType', 'roundtrip')
  } else {
    params.append('tripType', 'oneway')
  }

  // Add passenger information
  if (options?.adults) {
    params.append('adults', options.adults.toString())
  }
  if (options?.children) {
    params.append('children', options.children.toString())
  }
  if (options?.infants) {
    params.append('infants', options.infants.toString())
  }

  // Add cabin class
  if (options?.cabinClass) {
    params.append('cabinClass', options.cabinClass)
  }

  return `${baseUrl}?${params.toString()}`
}
