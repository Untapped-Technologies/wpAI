'use client'

import { usePathname } from 'next/navigation'
import AppSidebar from './app-sidebar'
import ArtifactRoot from './artifact/artifact-root'

interface LayoutWrapperProps {
  children: React.ReactNode
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname()

  // Hide sidebar on homepage
  const isHomepage = pathname === '/'

  if (isHomepage) {
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
