/**
 * Generate Trip.com hotel affiliate link
 * Uses Trip.com affiliate format: Allianceid, SID, trip_sub1, trip_sub3
 * @param destination - City name (e.g., "Tokyo", "Bangkok")
 * @param checkIn - Check-in date (YYYY-MM-DD)
 * @param checkOut - Check-out date (YYYY-MM-DD)
 * @param affiliateConfig - Trip.com affiliate configuration
 * @param options - Optional parameters (guests, rooms, etc.)
 */
export function generateHotelAffiliateLink(
  destination: string,
  checkIn: string,
  checkOut: string,
  affiliateConfig: {
    allianceId: string
    sid: string
    tripSub1: string
    tripSub3?: string
  },
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
    Allianceid: affiliateConfig.allianceId,
    SID: affiliateConfig.sid,
    trip_sub1: affiliateConfig.tripSub1,
  })

  // Add trip_sub3 if provided
  if (affiliateConfig.tripSub3) {
    params.append('trip_sub3', affiliateConfig.tripSub3)
  }

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
 * Uses Trip.com affiliate format: Allianceid, SID, trip_sub1, trip_sub3
 * @param origin - Origin city/code (e.g., "New York", "NYC", "JFK")
 * @param destination - Destination city/code (e.g., "Tokyo", "TYO", "NRT")
 * @param departureDate - Departure date (YYYY-MM-DD)
 * @param affiliateConfig - Trip.com affiliate configuration
 * @param options - Optional parameters (return date, passengers, class, etc.)
 */
export function generateFlightAffiliateLink(
  origin: string,
  destination: string,
  departureDate: string,
  affiliateConfig: {
    allianceId: string
    sid: string
    tripSub1: string
    tripSub3?: string
  },
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
    Allianceid: affiliateConfig.allianceId,
    SID: affiliateConfig.sid,
    trip_sub1: affiliateConfig.tripSub1,
  })

  // Add trip_sub3 if provided
  if (affiliateConfig.tripSub3) {
    params.append('trip_sub3', affiliateConfig.tripSub3)
  }

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
