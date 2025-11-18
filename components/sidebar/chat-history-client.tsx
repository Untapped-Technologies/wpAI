'use client'

import { useCallback, useEffect, useRef, useState, useTransition } from 'react'

import { toast } from 'sonner'

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu
} from '@/components/ui/sidebar'
import { Chat } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'

import { ChatHistorySkeleton } from './chat-history-skeleton'
import { ChatMenuItem } from './chat-menu-item'
import { ClearHistoryAction } from './clear-history-action'

interface ChatPageResponse {
  chats: Chat[]
  nextOffset: number | null
}

export function ChatHistoryClient() {
  const [chats, setChats] = useState<Chat[]>([])
  const [nextOffset, setNextOffset] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const [isPending, startTransition] = useTransition()

  // Check authentication before fetching chats
  useEffect(() => {
    const supabase = createClient()
    const checkAuth = async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser()
      setUser(user)
    }
    checkAuth()

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchInitialChats = useCallback(async () => {
    // Don't fetch if user is not authenticated
    if (!user) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/chats?offset=0&limit=20`)
      if (!response.ok) {
        throw new Error('Failed to fetch initial chat history')
      }
      const { chats: newChats, nextOffset: newNextOffset } =
        (await response.json()) as ChatPageResponse

      setChats(newChats)
      setNextOffset(newNextOffset)
    } catch (error) {
      console.error('Failed to load initial chats:', error)
      toast.error('Failed to load chat history.')
      setNextOffset(null)
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchInitialChats()
  }, [fetchInitialChats])

  useEffect(() => {
    const handleHistoryUpdate = () => {
      startTransition(() => {
        fetchInitialChats()
      })
    }
    window.addEventListener('chat-history-updated', handleHistoryUpdate)
    return () => {
      window.removeEventListener('chat-history-updated', handleHistoryUpdate)
    }
  }, [fetchInitialChats])

  const fetchMoreChats = useCallback(async () => {
    if (isLoading || nextOffset === null) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/chats?offset=${nextOffset}&limit=20`)
      if (!response.ok) {
        throw new Error('Failed to fetch more chat history')
      }
      const { chats: newChats, nextOffset: newNextOffset } =
        (await response.json()) as ChatPageResponse

      setChats(prevChats => [...prevChats, ...newChats])
      setNextOffset(newNextOffset)
    } catch (error) {
      console.error('Failed to load more chats:', error)
      toast.error('Failed to load more chat history.')
      setNextOffset(null)
    } finally {
      setIsLoading(false)
    }
  }, [nextOffset, isLoading])

  useEffect(() => {
    const observerRefValue = loadMoreRef.current
    if (!observerRefValue || nextOffset === null || isPending) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isLoading && !isPending) {
          fetchMoreChats()
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(observerRefValue)

    return () => {
      if (observerRefValue) {
        observer.unobserve(observerRefValue)
      }
    }
  }, [fetchMoreChats, nextOffset, isLoading, isPending])

  const isHistoryEmpty = !isLoading && !chats.length && nextOffset === null

  return (
    <div className="flex flex-col flex-1 max-h-screen justify-between">
      <div>
        <SidebarGroup>
          <div className="flex items-center justify-between w-full">
            <SidebarGroupLabel className="p-0">History</SidebarGroupLabel>
            <ClearHistoryAction empty={isHistoryEmpty} />
          </div>
        </SidebarGroup>
        <div className="flex-1 overflow-y-auto mb-2 relative max-h-80 overflow-scroll">
          {isHistoryEmpty && !isPending ? (
            <div className="px-2 text-foreground/30 text-sm text-center py-4">
              No search history
            </div>
          ) : (
            <SidebarMenu>
              {chats.map(
                (chat: Chat) =>
                  chat && <ChatMenuItem key={chat.id} chat={chat} />
              )}
            </SidebarMenu>
          )}
          <div ref={loadMoreRef} style={{ height: '1px' }} />
          {(isLoading || isPending) && (
            <div className="py-2">
              <ChatHistorySkeleton />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
