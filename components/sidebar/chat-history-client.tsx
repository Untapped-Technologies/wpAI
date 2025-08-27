'use client'

import { useCallback, useEffect, useRef, useState, useTransition } from 'react'

import { toast } from 'sonner'

import { Chat } from '@/lib/types'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu
} from '@/components/ui/sidebar'

import { Handshake, LogIn } from 'lucide-react'
import Link from 'next/link'
import { CompanyLinkItems } from '../company-menu-items'
import { Button } from '../ui'
import { ChatHistorySkeleton } from './chat-history-skeleton'
import { ChatMenuItem } from './chat-menu-item'
import { ClearHistoryAction } from './clear-history-action'

// interface ChatHistoryClientProps {} // Removed empty interface

interface ChatPageResponse {
  chats: Chat[]
  nextOffset: number | null
}

export function ChatHistoryClient() {
  // Removed props from function signature
  const [chats, setChats] = useState<Chat[]>([])
  const [nextOffset, setNextOffset] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const [isPending, startTransition] = useTransition()

  const fetchInitialChats = useCallback(async () => {
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
  }, [])

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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="w-full border-2 text-[#1F574C] border-[#1F574C] bg-transparent hover:bg-[#274743] text-sm hover:text-white">
            Company Information
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuItem asChild>
            <Link href="/auth/login">
              <LogIn className="mr-2 h-4 w-4" />
              <span>Sign In</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Handshake className="mr-2 h-4 w-4" />
              <span>Company</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <CompanyLinkItems />
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
