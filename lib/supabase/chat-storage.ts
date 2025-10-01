import { type Chat } from '@/lib/types'
import { supabaseAdmin } from './supabaseAdmin'

/**
 * Save chat to Supabase for permanent storage
 */
export async function saveChatToSupabase(
  chat: Chat,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const chatData = {
      id: chat.id,
      user_id: userId,
      title: chat.title,
      messages: chat.messages,
      path: chat.path,
      share_path: chat.sharePath || null,
      created_at: chat.createdAt || new Date(),
      updated_at: new Date()
    }

    const { error } = await supabaseAdmin
      .from('chat_history')
      .upsert(chatData, {
        onConflict: 'id'
      })

    if (error) {
      console.error('Error saving chat to Supabase:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Exception saving chat to Supabase:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Get a single chat from Supabase
 */
export async function getChatFromSupabase(
  chatId: string,
  userId: string
): Promise<Chat | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from('chat_history')
      .select('*')
      .eq('id', chatId)
      .eq('user_id', userId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // Not found
        return null
      }
      console.error('Error fetching chat from Supabase:', error)
      return null
    }

    if (!data) {
      return null
    }

    // Convert Supabase format to Chat type
    return {
      id: data.id,
      userId: data.user_id,
      title: data.title,
      messages: data.messages,
      path: data.path,
      sharePath: data.share_path,
      createdAt: new Date(data.created_at)
    }
  } catch (error) {
    console.error('Exception fetching chat from Supabase:', error)
    return null
  }
}

/**
 * Get all chats for a user from Supabase
 */
export async function getChatsFromSupabase(
  userId: string,
  limit = 100,
  offset = 0
): Promise<Chat[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('chat_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Error fetching chats from Supabase:', error)
      return []
    }

    if (!data) {
      return []
    }

    // Convert Supabase format to Chat type
    return data.map(chat => ({
      id: chat.id,
      userId: chat.user_id,
      title: chat.title,
      messages: chat.messages,
      path: chat.path,
      sharePath: chat.share_path,
      createdAt: new Date(chat.created_at)
    }))
  } catch (error) {
    console.error('Exception fetching chats from Supabase:', error)
    return []
  }
}

/**
 * Delete a chat from Supabase
 */
export async function deleteChatFromSupabase(
  chatId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabaseAdmin
      .from('chat_history')
      .delete()
      .eq('id', chatId)
      .eq('user_id', userId)

    if (error) {
      console.error('Error deleting chat from Supabase:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Exception deleting chat from Supabase:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Delete all chats for a user from Supabase
 */
export async function clearChatsFromSupabase(
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabaseAdmin
      .from('chat_history')
      .delete()
      .eq('user_id', userId)

    if (error) {
      console.error('Error clearing chats from Supabase:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Exception clearing chats from Supabase:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Get shared chat from Supabase (no auth required)
 */
export async function getSharedChatFromSupabase(
  chatId: string
): Promise<Chat | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from('chat_history')
      .select('*')
      .eq('id', chatId)
      .not('share_path', 'is', null)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // Not found
        return null
      }
      console.error('Error fetching shared chat from Supabase:', error)
      return null
    }

    if (!data) {
      return null
    }

    // Convert Supabase format to Chat type
    return {
      id: data.id,
      userId: data.user_id,
      title: data.title,
      messages: data.messages,
      path: data.path,
      sharePath: data.share_path,
      createdAt: new Date(data.created_at)
    }
  } catch (error) {
    console.error('Exception fetching shared chat from Supabase:', error)
    return null
  }
}
