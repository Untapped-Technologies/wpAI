import { cookies } from 'next/headers'

import { getCurrentUserId } from '@/lib/auth/get-current-user'
import { createManualToolStreamResponse } from '@/lib/streaming/create-manual-tool-stream'
import { createToolCallingStreamResponse } from '@/lib/streaming/create-tool-calling-stream'
import { Model } from '@/lib/types/models'
import { checkPromptWithGPT } from '@/lib/utils/checkPromptWithGPT'
import { isLikelyPolitical } from '@/lib/utils/isPoliticalPrompt'
import { isProviderEnabled } from '@/lib/utils/registry'

export const maxDuration = 30

const DEFAULT_MODEL: Model = {
  id: 'gpt-4o-mini',
  name: 'GPT-4o mini',
  provider: 'OpenAI',
  providerId: 'openai',
  enabled: true,
  toolCallType: 'native'
}

export async function POST(req: Request) {
  try {
    const { messages, id: chatId } = await req.json()
    const referer = req.headers.get('referer')
    const isSharePage = referer?.includes('/share/')
    const userId = await getCurrentUserId()

    // 🔒 Political Filter Start
    const latestMessage = messages
      ?.slice()
      ?.reverse()
      ?.find((msg: any) => msg.role === 'user')?.content

    let valid = isLikelyPolitical(latestMessage)
    if (!valid) {
      const error = {
        error:
          '🛑 This assistant only responds to political topics. Try asking about elections, lawmakers, or public policy.'
      }
      const status = {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      }
      return new Response(JSON.stringify(error), status)
    }

    if (!valid) {
      valid = await checkPromptWithGPT(latestMessage)
    }

    if (!valid) {
      return new Response(
        JSON.stringify({
          error:
            'Only political topics are allowed. Try asking about elections, public policy, or lawmakers.'
        }),
        {
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }
    // 🔒 Political Filter End

    if (isSharePage) {
      return new Response('Chat API is not available on share pages', {
        status: 403,
        statusText: 'Forbidden'
      })
    }

    const cookieStore = await cookies()
    const modelJson = cookieStore.get('selectedModel')?.value
    const searchMode = cookieStore.get('search-mode')?.value === 'true'

    let selectedModel = DEFAULT_MODEL

    if (modelJson) {
      try {
        selectedModel = JSON.parse(modelJson) as Model
      } catch (e) {
        console.error('Failed to parse selected model:', e)
      }
    }

    if (
      !isProviderEnabled(selectedModel.providerId) ||
      selectedModel.enabled === false
    ) {
      return new Response(
        `Selected provider is not enabled ${selectedModel.providerId}`,
        {
          status: 404,
          statusText: 'Not Found'
        }
      )
    }

    const supportsToolCalling = selectedModel.toolCallType === 'native'

    return supportsToolCalling
      ? createToolCallingStreamResponse({
          messages,
          model: selectedModel,
          chatId,
          searchMode,
          userId
        })
      : createManualToolStreamResponse({
          messages,
          model: selectedModel,
          chatId,
          searchMode,
          userId
        })
  } catch (error) {
    console.error('API route error:', error)
    return new Response('Error processing your request', {
      status: 500,
      statusText: 'Internal Server Error'
    })
  }
}
