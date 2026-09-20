import type { WeatherForecast } from '@/types'

const OPEN_METEO_BASE_URL = 'https://api.open-meteo.com/v1/forecast'

function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

function clampForecastWindow(startDate: string, days: number) {
  const today = todayIso()
  const start = /^\d{4}-\d{2}-\d{2}$/.test(startDate) && startDate >= today ? startDate : today
  const count = Math.min(Math.max(Math.round(days) || 1, 1), 14)
  const end = new Date(`${start}T00:00:00Z`)
  end.setUTCDate(end.getUTCDate() + count - 1)
  return { startDate: start, endDate: end.toISOString().slice(0, 10), days: count }
}

export async function getWeatherForecast(
  lat: number,
  lon: number,
  startDate: string,
  days: number
): Promise<WeatherForecast[]> {
  const window = clampForecastWindow(startDate, days)

  try {
    const response = await fetch(
      `${OPEN_METEO_BASE_URL}?` +
        new URLSearchParams({
          latitude: lat.toFixed(4),
          longitude: lon.toFixed(4),
          daily: 'temperature_2m_max,temperature_2m_min,weathercode',
          start_date: window.startDate,
          end_date: window.endDate,
          timezone: 'auto',
        }),
      { signal: AbortSignal.timeout(5000) }
    )

    if (!response.ok) {
      throw new Error(`Open-Meteo API error: ${response.statusText}`)
    }

    const data = await response.json()
    const daily = data.daily
    if (!daily?.time) {
      throw new Error('Open-Meteo API error: missing daily forecast')
    }

    const forecasts: WeatherForecast[] = []
    for (let i = 0; i < window.days; i++) {
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
