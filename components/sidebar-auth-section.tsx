'use client'

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { KeyIcon, UserRoundPlus } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export function SidebarAuthSection() {
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

  if (loading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton disabled>
            <span>Loading...</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  return (
    <SidebarMenu>
      {!user ? (
        <>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/auth/sign-up" className="flex items-center gap-2">
                <UserRoundPlus size={24} />
                <span>Register</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/auth/login" className="flex items-center gap-2">
                <KeyIcon size={24} />
                <span>Login</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </>
      ) : null}
    </SidebarMenu>
  )
}
