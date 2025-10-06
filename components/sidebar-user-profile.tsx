'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { User } from '@supabase/supabase-js'
import { ChevronRight, Fingerprint, Home, LogOut } from 'lucide-react'

import { createClient } from '@/lib/supabase/client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

interface SidebarUserProfileProps {
  user: User
}

export function SidebarUserProfile({ user }: SidebarUserProfileProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const userName =
    user.user_metadata?.full_name || user.user_metadata?.name || 'User'
  const userEmail = user.email || ''
  const avatarUrl =
    user.user_metadata?.avatar_url || user.user_metadata?.picture

  const getInitials = (name: string, email: string) => {
    if (name && name !== 'User') {
      const names = name.split(' ')
      if (names.length > 1) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
      }
      return name.substring(0, 2).toUpperCase()
    }
    if (email) {
      return email.split('@')[0].substring(0, 2).toUpperCase()
    }
    return 'U'
  }

  const handleLogout = async () => {
    const supabase = createClient()

    // Clear chat history
    try {
      await fetch('/api/chats', { method: 'DELETE' })
    } catch (error) {
      console.error('Failed to clear chat history:', error)
    }

    // Clear sidebar cookie
    if (typeof document !== 'undefined') {
      document.cookie =
        'sidebar:state=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    }

    // Sign out from Supabase
    await supabase.auth.signOut()

    // Dispatch events to reset sidebar components
    window.dispatchEvent(new CustomEvent('chat-history-updated'))
    window.dispatchEvent(new CustomEvent('sidebar-reset'))

    // Force a full page reload to ensure sidebar updates
    window.location.href = '/'
  }

  return (
    <div className="mt-auto p-2">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-start h-auto p-2 hover:bg-muted/50"
          >
            <div className="flex items-center gap-3 w-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={avatarUrl} alt={userName} />
                <AvatarFallback className="text-xs">
                  {getInitials(userName, userEmail)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm font-medium truncate">{userName}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {userEmail}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="w-64"
          align="end"
          side="top"
          sideOffset={8}
        >
          {/* Account Actions */}
          <DropdownMenuItem asChild>
            <Link href="/" className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                <span>Home</span>
              </div>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href="/user/profile"
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Fingerprint className="h-4 w-4" />
                <span>Account Settings</span>
              </div>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem className="flex items-center justify-between p-2">
            <div className="flex items-center gap-3">
              <Avatar className="h-6 w-6">
                <AvatarImage src={avatarUrl} alt={userName} />
                <AvatarFallback className="text-xs">
                  {getInitials(userName, userEmail)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{userName}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {userEmail}
                </p>
              </div>
            </div>
            <div className="h-2 w-2 rounded-full bg-primary" />
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Sign Out */}
          <DropdownMenuItem
            onClick={handleLogout}
            className="flex items-center justify-between text-red-600 focus:text-red-600"
          >
            <div className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              <span>Sign out</span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
