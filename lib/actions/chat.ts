'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { getRedisClient, RedisWrapper } from '@/lib/redis/config'
import {
  clearChatsFromSupabase,
  deleteChatFromSupabase,
  getChatFromSupabase,
  getChatsFromSupabase,
  getSharedChatFromSupabase,
  saveChatToSupabase
} from '@/lib/supabase/chat-storage'
import { type Chat } from '@/lib/types'

async function getRedis(): Promise<RedisWrapper> {
  return await getRedisClient()
}

// Configuration: Redis TTL in seconds (30 days = 2592000 seconds)
// Set to 0 to disable TTL (data stays forever in Redis)
const REDIS_CHAT_TTL = 30 * 24 * 60 * 60 // 30 days

const CHAT_VERSION = 'v2'
function getUserChatKey(userId: string) {
  return `user:${CHAT_VERSION}:chat:${userId}`
}

export async function getChats(userId?: string | null) {
  if (!userId) {
    return []
  }

  try {
    // Try Redis first
    const redis = await getRedis()
    const chats = await redis.zrange(getUserChatKey(userId), 0, -1, {
      rev: true
    })

    if (chats.length > 0) {
      const results = await Promise.all(
        chats.map(async chatKey => {
          const chat = await redis.hgetall(chatKey)
          return chat
        })
      )

      const redisChats = results
        .filter((result): result is Record<string, any> => {
          if (result === null || Object.keys(result).length === 0) {
            return false
          }
          return true
        })
        .map(chat => {
          const plainChat = { ...chat }
          if (typeof plainChat.messages === 'string') {
            try {
              plainChat.messages = JSON.parse(plainChat.messages)
            } catch (error) {
              plainChat.messages = []
            }
          }
          if (plainChat.createdAt && !(plainChat.createdAt instanceof Date)) {
            plainChat.createdAt = new Date(plainChat.createdAt)
          }
          return plainChat as Chat
        })

      // If we have chats in Redis, return them
      if (redisChats.length > 0) {
        return redisChats
      }
    }

    // If Redis is empty, fallback to Supabase
    console.log(
      `No chats found in Redis for user ${userId}, checking Supabase...`
    )
    const supabaseChats = await getChatsFromSupabase(userId, 100, 0)

    // Optionally restore to Redis for future fast access
    if (supabaseChats.length > 0) {
      const redis = await getRedis()
      const pipeline = redis.pipeline()

      for (const chat of supabaseChats) {
        const chatToSave = {
          ...chat,
          messages: JSON.stringify(chat.messages)
        }

        pipeline.hmset(`chat:${chat.id}`, chatToSave)
        pipeline.zadd(
          getUserChatKey(userId),
          chat.createdAt?.getTime() || Date.now(),
          `chat:${chat.id}`
        )

        if (REDIS_CHAT_TTL > 0) {
          pipeline.expire(`chat:${chat.id}`, REDIS_CHAT_TTL)
        }
      }

      await pipeline.exec().catch(error => {
        console.error('Failed to restore chats to Redis:', error)
        // Don't throw - we have the data from Supabase
      })
    }

    return supabaseChats
  } catch (error) {
    console.error('Error in getChats:', error)
    // Final fallback: try Supabase directly
    return await getChatsFromSupabase(userId, 100, 0)
  }
}

export async function getChatsPage(
  userId: string,
  limit = 20,
  offset = 0
): Promise<{ chats: Chat[]; nextOffset: number | null }> {
  try {
    const redis = await getRedis()
    const userChatKey = getUserChatKey(userId)
    const start = offset
    const end = offset + limit - 1

    const chatKeys = await redis.zrange(userChatKey, start, end, {
      rev: true
    })

    if (chatKeys.length === 0) {
      return { chats: [], nextOffset: null }
    }

    const results = await Promise.all(
      chatKeys.map(async chatKey => {
        const chat = await redis.hgetall(chatKey)
        return chat
      })
    )

    const chats = results
      .filter((result): result is Record<string, any> => {
        if (result === null || Object.keys(result).length === 0) {
          return false
        }
        return true
      })
      .map(chat => {
        const plainChat = { ...chat }
        if (typeof plainChat.messages === 'string') {
          try {
            plainChat.messages = JSON.parse(plainChat.messages)
          } catch (error) {
            plainChat.messages = []
          }
        }
        if (plainChat.createdAt && !(plainChat.createdAt instanceof Date)) {
          plainChat.createdAt = new Date(plainChat.createdAt)
        }
        return plainChat as Chat
      })

    const nextOffset = chatKeys.length === limit ? offset + limit : null
    return { chats, nextOffset }
  } catch (error) {
    console.error('Error fetching chat page:', error)
    return { chats: [], nextOffset: null }
  }
}

export async function getChat(id: string, userId: string = 'anonymous') {
  try {
    // Try Redis first (fast)
    const redis = await getRedis()
    const chat = await redis.hgetall<Chat>(`chat:${id}`)

    if (chat && Object.keys(chat).length > 0) {
      // Parse the messages if they're stored as a string
      if (typeof chat.messages === 'string') {
        try {
          chat.messages = JSON.parse(chat.messages)
        } catch (error) {
          chat.messages = []
        }
      }

      // Ensure messages is always an array
      if (!Array.isArray(chat.messages)) {
        chat.messages = []
      }

      return chat
    }

    // If not in Redis, try Supabase (fallback)
    console.log(`Chat ${id} not found in Redis, checking Supabase...`)
    const supabaseChat = await getChatFromSupabase(id, userId)

    if (supabaseChat) {
      // Restore to Redis for future fast access
      const redis = await getRedis()
      const pipeline = redis.pipeline()

      const chatToSave = {
        ...supabaseChat,
        messages: JSON.stringify(supabaseChat.messages)
      }

      pipeline.hmset(`chat:${id}`, chatToSave)
      pipeline.zadd(getUserChatKey(userId), Date.now(), `chat:${id}`)

      if (REDIS_CHAT_TTL > 0) {
        pipeline.expire(`chat:${id}`, REDIS_CHAT_TTL)
      }

      await pipeline.exec().catch(error => {
        console.error('Failed to restore chat to Redis:', error)
        // Don't throw - we have the data from Supabase
      })

      return supabaseChat
    }

    return null
  } catch (error) {
    console.error('Error in getChat:', error)
    // Final fallback: try Supabase directly
    return await getChatFromSupabase(id, userId)
  }
}

export async function clearChats(
  userId: string = 'anonymous'
): Promise<{ error?: string }> {
  try {
    // Clear from Redis
    const redis = await getRedis()
    const userChatKey = getUserChatKey(userId)
    const chats = await redis.zrange(userChatKey, 0, -1)

    if (chats.length > 0) {
      const pipeline = redis.pipeline()

      for (const chat of chats) {
        pipeline.del(chat)
        pipeline.zrem(userChatKey, chat)
      }

      await pipeline.exec()
    }

    // Clear from Supabase
    await clearChatsFromSupabase(userId).catch(error => {
      console.error('Failed to clear chats from Supabase:', error)
      // Don't throw - Redis clear succeeded
    })

    revalidatePath('/')
    redirect('/')
  } catch (error) {
    console.error('Error clearing chats:', error)
    return { error: 'Failed to clear chats' }
  }
}

export async function deleteChat(
  chatId: string,
  userId = 'anonymous'
): Promise<{ error?: string }> {
  try {
    // Delete from Redis
    const redis = await getRedis()
    const userKey = getUserChatKey(userId)
    const chatKey = `chat:${chatId}`

    const chatDetails = await redis.hgetall<Chat>(chatKey)

    if (chatDetails && Object.keys(chatDetails).length > 0) {
      const pipeline = redis.pipeline()
      pipeline.del(chatKey)
      pipeline.zrem(userKey, chatKey)
      await pipeline.exec()
    }

    // Delete from Supabase
    await deleteChatFromSupabase(chatId, userId).catch(error => {
      console.error('Failed to delete chat from Supabase:', error)
      // Don't throw - Redis delete succeeded
    })

    // Revalidate the root path where the chat history is displayed
    revalidatePath('/')

    return {}
  } catch (error) {
    console.error(`Error deleting chat ${chatId}:`, error)
    return { error: 'Failed to delete chat' }
  }
}

export async function saveChat(chat: Chat, userId: string = 'anonymous') {
  try {
    // Save to Redis for fast access
    const redis = await getRedis()
    const pipeline = redis.pipeline()

    const chatToSave = {
      ...chat,
      messages: JSON.stringify(chat.messages)
    }

    pipeline.hmset(`chat:${chat.id}`, chatToSave)
    pipeline.zadd(getUserChatKey(userId), Date.now(), `chat:${chat.id}`)

    // Optional: Set TTL on the chat key (30 days)
    if (REDIS_CHAT_TTL > 0) {
      pipeline.expire(`chat:${chat.id}`, REDIS_CHAT_TTL)
    }

    const results = await pipeline.exec()

    // Save to Supabase for permanent storage (non-blocking)
    // We don't await this to keep Redis writes fast
    saveChatToSupabase(chat, userId).catch(error => {
      console.error('Failed to save chat to Supabase (background):', error)
      // Don't throw - Redis save succeeded, Supabase is backup
    })

    return results
  } catch (error) {
    console.error('Failed to save chat to Redis:', error)
    // Try to save to Supabase as fallback
    await saveChatToSupabase(chat, userId)
    throw error
  }
}

export async function getSharedChat(id: string) {
  try {
    // Try Redis first
    const redis = await getRedis()
    const chat = await redis.hgetall<Chat>(`chat:${id}`)

    if (chat && chat.sharePath) {
      // Parse messages if needed
      if (typeof chat.messages === 'string') {
        try {
          chat.messages = JSON.parse(chat.messages)
        } catch (error) {
          chat.messages = []
        }
      }
      return chat
    }

    // Fallback to Supabase
    const supabaseChat = await getSharedChatFromSupabase(id)
    return supabaseChat
  } catch (error) {
    console.error('Error in getSharedChat:', error)
    // Final fallback
    return await getSharedChatFromSupabase(id)
  }
}

export async function shareChat(id: string, userId: string = 'anonymous') {
  try {
    const redis = await getRedis()
    const chat = await redis.hgetall<Chat>(`chat:${id}`)

    // If not in Redis, try Supabase
    let chatToShare = chat
    if (!chatToShare || Object.keys(chatToShare).length === 0) {
      const supabaseChat = await getChatFromSupabase(id, userId)
      if (!supabaseChat) {
        return null
      }
      chatToShare = supabaseChat as any
    }

    if (chatToShare?.userId !== userId) {
      return null
    }

    const payload = {
      ...chatToShare,
      sharePath: `/share/${id}`
    }

    // Update in Redis
    await redis.hmset(`chat:${id}`, {
      ...payload,
      messages:
        typeof payload.messages === 'string'
          ? payload.messages
          : JSON.stringify(payload.messages)
    })

    // Update in Supabase
    await saveChatToSupabase(payload as Chat, userId).catch(error => {
      console.error('Failed to update shared chat in Supabase:', error)
    })

    return payload
  } catch (error) {
    console.error('Error in shareChat:', error)
    return null
  }
}
