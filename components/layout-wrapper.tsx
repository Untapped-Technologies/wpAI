'use client'

import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import AppSidebar from './app-sidebar'
import ArtifactRoot from './artifact/artifact-root'

interface LayoutWrapperProps {
  children: React.ReactNode
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname()
  const [hideSidebar, setHideSidebar] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
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
  }, [supabase.auth])

  useEffect(() => {
    // Hide sidebar on marketing/static pages OR when user is not authenticated
    const marketingPages = [
      '/',
      '/about',
      '/auth/login',
      '/auth/sign-up',
      '/contact',
      '/faqs',
      '/pricing',
      '/privacy',
      '/terms',
      '/trending-topics',
      '/success'
    ]
    const shouldHideSidebar = marketingPages.includes(pathname) || !user
    setHideSidebar(shouldHideSidebar)
  }, [pathname, user])

  if (hideSidebar) {
    return (
      <div className="flex flex-col flex-1 min-h-screen">
        <main className="flex flex-1 min-h-0 overflow-auto">
          <ArtifactRoot>{children}</ArtifactRoot>
        </main>
      </div>
    )
  }

  return (
    <>
      <AppSidebar />
      <div className="flex flex-col flex-1 min-h-screen">
        <main className="flex flex-1 min-h-0 overflow-auto">
          <ArtifactRoot>{children}</ArtifactRoot>
        </main>
      </div>
    </>
  )
}
