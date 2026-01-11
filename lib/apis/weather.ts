import type { WeatherForecast } from '@/types'

const OPEN_METEO_BASE_URL = 'https://api.open-meteo.com/v1/forecast'

export async function getWeatherForecast(
  lat: number,
  lon: number,
  startDate: string,
  days: number
): Promise<WeatherForecast[]> {
  try {
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + days - 1)

    const response = await fetch(
      `${OPEN_METEO_BASE_URL}?` +
        new URLSearchParams({
          latitude: lat.toString(),
          longitude: lon.toString(),
          daily: 'temperature_2m_max,temperature_2m_min,weathercode',
          start_date: startDate,
          end_date: endDate.toISOString().split('T')[0],
          timezone: 'auto',
        })
    )

    if (!response.ok) {
      throw new Error(`Open-Meteo API error: ${response.statusText}`)
    }

    const data = await response.json()
    const daily = data.daily

    const forecasts: WeatherForecast[] = []
    for (let i = 0; i < days; i++) {
      const date = daily.time[i]
      const tempMax = daily.temperature_2m_max[i]
      const tempMin = daily.temperature_2m_min[i]
      const weatherCode = daily.weathercode[i]

      forecasts.push({
        date,
        temperature: Math.round((tempMax + tempMin) / 2),
        condition: getWeatherCondition(weatherCode),
        description: getWeatherDescription(weatherCode),
      })
    }

    return forecasts
  } catch (error) {
    console.error('Error fetching weather:', error)
    throw error
  }
}

function getWeatherCondition(code: number): string {
  // WMO Weather interpretation codes
  if (code === 0) return 'clear'
  if (code <= 3) return 'partly-cloudy'
  if (code <= 49) return 'cloudy'
  if (code <= 59) return 'rain'
  if (code <= 69) return 'snow'
  if (code <= 79) return 'snow'
  if (code <= 84) return 'rain'
  if (code <= 86) return 'snow'
  if (code <= 99) return 'thunderstorm'
  return 'unknown'
}

function getWeatherDescription(code: number): string {
  if (code === 0) return 'Clear sky'
  if (code <= 3) return 'Partly cloudy'
  if (code <= 49) return 'Cloudy'
  if (code <= 59) return 'Drizzle or light rain'
  if (code <= 69) return 'Rain'
  if (code <= 79) return 'Snow'
  if (code <= 84) return 'Heavy rain'
  if (code <= 86) return 'Heavy snow'
  if (code <= 99) return 'Thunderstorm'
  return 'Unknown'
}
