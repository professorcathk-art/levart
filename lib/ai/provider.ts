import { createOpenAI } from '@ai-sdk/openai'

export function getPlannerModel() {
  const apiKey = process.env.AIML_API_KEY
  if (!apiKey) {
    throw new Error('AIML_API_KEY is not configured')
  }

  const aiml = createOpenAI({
    name: 'aiml',
    baseURL: 'https://api.aimlapi.com/v1',
    apiKey,
  })

  return aiml('claude-sonnet-4-5')
}
