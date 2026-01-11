export function generateHotelAffiliateLink(
  destination: string,
  checkIn: string,
  checkOut: string,
  affiliateId: string
): string {
  const baseUrl = 'https://www.trip.com/hotels'
  const params = new URLSearchParams({
    city: destination,
    checkIn,
    checkOut,
    affiliateId,
  })
  return `${baseUrl}?${params.toString()}`
}

export function generateFlightAffiliateLink(
  origin: string,
  destination: string,
  departureDate: string,
  returnDate?: string,
  affiliateId?: string
): string {
  const baseUrl = 'https://www.trip.com/flights'
  const params = new URLSearchParams({
    from: origin,
    to: destination,
    departureDate,
  })
  if (returnDate) {
    params.append('returnDate', returnDate)
  }
  if (affiliateId) {
    params.append('affiliateId', affiliateId)
  }
  return `${baseUrl}?${params.toString()}`
}
