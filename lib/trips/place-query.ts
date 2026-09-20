function firstCity(destination?: string) {
  if (!destination) return ''
  return destination.split(/[·・‧•,，/|]+/)[0]?.trim() || destination.trim()
}

function stripPlaceNoise(raw: string) {
  return raw
    .replace(/\d{1,2}:\d{2}/g, ' ')
    .replace(/check-?in/gi, ' ')
    .replace(/（.*?）|\(.*?\)/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function placeChain(raw: string) {
  return stripPlaceNoise(raw)
    .split(/\s*[→➜➡>／/]\s*/)
    .map((part) => part.trim())
    .filter((part) => part.length >= 2)
}

export function cleanPlaceName(raw: string) {
  return placeChain(raw)[0] || stripPlaceNoise(raw)
}

export function startPlaceName(raw: string) {
  return cleanPlaceName(raw)
}

export function endPlaceName(raw: string) {
  const parts = placeChain(raw)
  return parts[parts.length - 1] || stripPlaceNoise(raw)
}

export function placeTokens(raw: string) {
  return startPlaceName(raw)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .split(' ')
    .map((token) => token.trim())
    .filter((token) => token.length >= 2)
}

export function textMentionsPlace(text: string, place: string) {
  const hay = stripPlaceNoise(text).toLowerCase()
  if (!hay) return false
  if (place && hay.includes(stripPlaceNoise(place).toLowerCase())) return true
  return placeTokens(place).some((token) => token.length >= 2 && hay.includes(token))
}

export function mapsPlaceQuery(location: string, destination?: string) {
  const place = cleanPlaceName(location)
  const city = firstCity(destination)
  if (!place) return city
  if (!city) return place
  if (place.includes(city) || city.includes(place)) return place
  return `${place} ${city}`
}

export function mapsRouteQueries(fromRaw: string, toRaw: string, destination?: string) {
  const origin = mapsPlaceQuery(fromRaw, destination)
  const destinationQuery = mapsPlaceQuery(toRaw, destination)
  const usable = origin.length >= 2 && destinationQuery.length >= 2 && origin !== destinationQuery
  return { origin, destination: destinationQuery, usable }
}
