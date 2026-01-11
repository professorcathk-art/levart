import OpenAI from 'openai'
import type { Attraction, DayItinerary, TripFocus, WeatherForecast } from '@/types'

// AIML API is OpenAI-compatible
const openai = new OpenAI({
  baseURL: 'https://api.aimlapi.com/v1',
  apiKey: process.env.AIML_API_KEY || '',
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

  const apiKey = process.env.AIML_API_KEY
  if (!apiKey) {
    throw new Error('AIML_API_KEY is not configured')
  }

  try {
    // Use correct AIML API model name: claude-sonnet-4-5 (Claude 4.5 Sonnet)
    // See: https://docs.aimlapi.com/api-references/text-models-llm/anthropic/claude-4-5-sonnet
    console.log('Calling AIML API with model: claude-sonnet-4-5')
    console.log('API Key present:', !!apiKey)
    console.log('API Key length:', apiKey.length)
    console.log('Prompt length:', userPrompt.length)
    
    const completion = await openai.chat.completions.create({
      model: 'claude-sonnet-4-5', // Correct AIML API model name for Claude 4.5 Sonnet
      max_tokens: 4096,
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      throw new Error('No response content from Claude')
    }

    // Extract JSON from response (handle potential markdown code blocks)
    let jsonText = content.trim()
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```(?:json)?\n/, '').replace(/\n```$/, '')
    }

    let itinerary: DayItinerary[]
    try {
      itinerary = JSON.parse(jsonText) as DayItinerary[]
    } catch (parseError) {
      console.error('Failed to parse Claude response:', jsonText)
      throw new Error(`Invalid JSON response from Claude: ${parseError instanceof Error ? parseError.message : 'Unknown parse error'}`)
    }

    if (!Array.isArray(itinerary)) {
      throw new Error('Claude response is not an array')
    }

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
    
    // Try to extract more details from OpenAI SDK error
    if (error && typeof error === 'object') {
      const errorObj = error as Record<string, unknown>
      if (errorObj.status === 400) {
        const errorMessage = errorObj.message || errorObj.error || 'Bad Request'
        const errorDetails = errorObj.details || ''
        throw new Error(`AIML API returned 400 Bad Request: ${errorMessage} ${errorDetails}`)
      }
      if (errorObj.status === 401) {
        throw new Error('AIML API authentication failed. Check your API key.')
      }
      if (errorObj.status === 429) {
        throw new Error('AIML API rate limit exceeded. Please try again later.')
      }
    }
    
    const errorMessage = error instanceof Error ? error.message : String(error)
    throw new Error(`Failed to generate itinerary: ${errorMessage}`)
  }
}
