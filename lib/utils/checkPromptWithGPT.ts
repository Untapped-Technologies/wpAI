import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function checkPromptWithGPT(prompt: string): Promise<boolean> {
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content:
          "You're a filter. Reply only with 'true' if the user prompt is about politics, policy, elections, government, laws, or public service. Reply 'false' for everything else."
      },
      { role: 'user', content: prompt }
    ]
  })

  return (
    response?.choices[0]?.message?.content?.toLowerCase().includes('true') ??
    false
  )
}
