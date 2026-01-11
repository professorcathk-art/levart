import Anthropic from '@anthropic-ai/sdk'
import type { Attraction, DayItinerary, TripFocus, WeatherForecast } from '@/types'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
})

export async function generateItinerary(
  destination: string,
  tripFocus: TripFocus[],
  selectedAttractions: Attraction[],
  routeInfo: {
    totalDistance: number
    totalDuration: number
  },
  weatherForecasts: WeatherForecast[],
  dayCount: number
): Promise<DayItinerary[]> {
  const systemPrompt = `You are an expert travel planner. Generate detailed day-by-day itineraries in JSON format.
Each day should include morning, afternoon, and evening activities based on the selected attractions and route.
Include restaurant suggestions, transport recommendations, and cost estimates.
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

Generate a JSON array with ${dayCount} day objects. Each day object should have:
{
  "day": number (1-based),
  "date": string (YYYY-MM-DD),
  "weather": {
    "temperature": number,
    "condition": string,
    "description": string
  },
  "activities": [
    {
      "time": "morning" | "afternoon" | "evening",
      "activity": string,
      "location": string,
      "duration": string (optional),
      "cost": string (optional)
    }
  ],
  "restaurants": [
    {
      "name": string,
      "cuisine": string (optional),
      "cost": string (optional)
    }
  ],
  "transport": string[],
  "estimatedCost": string
}

Return ONLY valid JSON, no markdown, no code blocks.`

  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    })

    const content = message.content[0]
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude')
    }

    // Extract JSON from response (handle potential markdown code blocks)
    let jsonText = content.text.trim()
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```(?:json)?\n/, '').replace(/\n```$/, '')
    }

    const itinerary = JSON.parse(jsonText) as DayItinerary[]

    // Merge weather data from API
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
    throw error
  }
}
