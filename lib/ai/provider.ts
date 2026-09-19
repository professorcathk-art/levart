import { createOpenAI } from '@ai-sdk/openai'

export function getPlannerModel() {
  const apiKey = process.env.DEEPSEEK_API_KEY
  if (!apiKey) {
    throw new Error('DEEPSEEK_API_KEY is not configured')
  }

  const deepseek = createOpenAI({
    name: 'deepseek',
    baseURL: 'https://api.deepseek.com',
    apiKey,
  })

  return deepseek('deepseek-flash')
}
