'use client'

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

  useEffect(() => {
    // Hide sidebar on marketing/static pages
    const marketingPages = [
      '/',
      '/about',
      '/faqs',
      '/privacy',
      '/terms',
      '/auth/sign-up',
      '/auth/login',
      '/pricing'
    ]
    setHideSidebar(marketingPages.includes(pathname))
  }, [pathname])

  if (hideSidebar) {
    return (
      <div className="flex flex-col flex-1 min-h-screen">
        <main className="flex flex-1 min-h-0 overflow-auto">{children}</main>
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
