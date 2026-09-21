import { generateText } from 'ai'
import { getPlannerModel } from '@/lib/ai/provider'
import type { Attraction, DayItinerary, TripFocus, WeatherForecast, TripPreferences } from '@/types'

export async function generateItinerary(
  destination: string,
  tripFocus: TripFocus[],
  selectedAttractions: Attraction[],
  routeInfo: {
    totalDistance: number
    totalDuration: number
  },
  weatherForecasts: WeatherForecast[],
  dayCount: number,
  preferences?: TripPreferences
): Promise<DayItinerary[]> {
  void preferences

  const systemPrompt = `You are an expert travel planner. Generate detailed day-by-day itineraries in JSON format.
Each activity needs startTime and endTime as HH:mm clocks, plus morning/afternoon/evening.
At most one lunch and one dinner per day. Never schedule consecutive restaurant stops.
Include restaurant suggestions as activities (type restaurant), short transport notes, and cost estimates.
Be practical and realistic about timing and distances.`

  const attractionsList = selectedAttractions
    .map((a) => `- ${a.name} (${a.category}) at ${a.lat}, ${a.lon}`)
    .join('\n')

  const weatherList = weatherForecasts
    .map((w) => `Day ${w.date}: ${w.temperature}°C, ${w.description}`)
    .join('\n')

  const userPrompt = `Create a ${dayCount}-day itinerary for ${destination}.

Trip Focus: ${tripFocus.join(', ')}

Selected Attractions:
${attractionsList}

Route Info:
- Total distance: ${(routeInfo.totalDistance / 1000).toFixed(1)} km
- Total duration: ${Math.round(routeInfo.totalDuration / 60)} minutes

Weather Forecast:
${weatherList}

Generate a JSON array with ${dayCount} day objects. Return ONLY valid JSON, no markdown, no code blocks.`

  try {
    const { text } = await generateText({
      model: getPlannerModel(),
      system: systemPrompt,
      prompt: userPrompt,
    })

    if (!text) {
      throw new Error('No response content from Claude')
    }

    let jsonText = text.trim()
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```(?:json)?\n/, '').replace(/\n```$/, '')
    }

    let itinerary: DayItinerary[]
    try {
      itinerary = JSON.parse(jsonText) as DayItinerary[]
    } catch (parseError) {
      console.error('Failed to parse Claude response:', jsonText)
      throw new Error(
        `Invalid JSON response from Claude: ${parseError instanceof Error ? parseError.message : 'Unknown parse error'}`
      )
    }

    if (!Array.isArray(itinerary)) {
      throw new Error('Claude response is not an array')
    }

    return itinerary.map((day, index) => {
      if (weatherForecasts[index]) {
        day.weather = {
          temperature: weatherForecasts[index].temperature,
          condition: weatherForecasts[index].condition,
          description: weatherForecasts[index].description,
        }
        day.date = weatherForecasts[index].date
      }
      return day
    })
  } catch (error) {
    console.error('Error generating itinerary:', error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    throw new Error(`Failed to generate itinerary: ${errorMessage}`)
  }
}
