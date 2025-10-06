'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

import { User } from '@supabase/supabase-js'
import { MessageCircleMore } from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger
} from '@/components/ui/sidebar'

import { homePage } from '@/components/_constants/staticData'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'
import { SidebarAuthSection } from './sidebar-auth-section'
import { SidebarUserProfile } from './sidebar-user-profile'
import { ChatHistorySection } from './sidebar/chat-history-section'

export default function AppSidebar() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    // Get initial user
    const getUser = async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    getUser()

    // Listen for auth changes
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])
  return (
    <Sidebar side="left" variant="sidebar" collapsible="offcanvas">
      <SidebarHeader className="flex flex-row justify-between items-center">
        <Link href="/" className="flex items-center gap-2 px-2 py-3">
          <Image
            src="/images/logos/icononly_transparent_nobuffer.png"
            alt="World Politics Logo"
            width={36}
            height={36}
          />
          <span className="font-semibold text-sm">{homePage.title}</span>
        </Link>
        <SidebarTrigger />
      </SidebarHeader>
      <SidebarContent className="flex flex-col px-2 py-4 h-full">
        <div className="flex-1">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/newprompt" className="flex items-center gap-2">
                  <MessageCircleMore className="size-4" />
                  <span>Talk World Politics</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <SidebarAuthSection />
          <ChatHistorySection />
        </div>

        {/* User Profile Section at Bottom */}
        {!loading && user && <SidebarUserProfile user={user} />}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
