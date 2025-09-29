'use client'

import MainHeader from '@/components/_constants/pages/mainHeader'
import { TrendingTabContent } from '@/components/_constants/pages/trending/trendingTabContent'
import AuthAwareFooter from '@/components/auth-aware-footer'
import AuthAwareNavigation from '@/components/auth-aware-navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useTrending } from '@/hooks/useTrending'
import { Globe, MapPin, Users } from 'lucide-react'
import { useEffect, useState } from 'react'

const scopes = [
  { value: 'local', label: 'Local', icon: MapPin },
  { value: 'national', label: 'National', icon: Users },
  { value: 'international', label: 'International', icon: Globe }
]

export default function TrendingTabs() {
  const [activeTab, setActiveTab] = useState('local')
  const [pageMap, setPageMap] = useState<Record<string, number>>({
    local: 1,
    national: 1,
    international: 1
  })

  // Track if each tab was loaded at least once
  const [loadedTabs, setLoadedTabs] = useState<Record<string, boolean>>({
    local: true, // default tab is preloaded
    national: false,
    international: false
  })

  // Fetch data for current active tab
  const filters = (() => {
    if (activeTab === 'local') {
      return { country_code: 'US', postal_code: '15212' }
    } else if (activeTab === 'national') {
      return { country_code: 'US' }
    } else {
      return {} // international has no filters
    }
  })()

  // Filter out undefined values to match Record<string, string>
  const cleanFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, value]) => value !== undefined)
  ) as Record<string, string>

  const {
    trending: activeTrending,
    totalPages: activeTotalPages,
    isLoading: activeLoading,
    error: activeError
  } = useTrending(activeTab, pageMap[activeTab], 10, cleanFilters)

  const [cachedTrending, setCachedTrending] = useState<Record<string, any[]>>({
    local: [],
    national: [],
    international: []
  })
  const [cachedPages, setCachedPages] = useState<Record<string, number>>({
    local: 1,
    national: 1,
    international: 1
  })

  // Cache the result per tab on first load
  // 1️⃣ Effect: Mark tab as loaded on tab change
  useEffect(() => {
    if (!loadedTabs[activeTab]) {
      setLoadedTabs(prev => ({ ...prev, [activeTab]: true }))
    }
  }, [activeTab, loadedTabs])

  // 2️⃣ Effect: Cache trending data only when it changes
  useEffect(() => {
    if (activeTrending.length > 0) {
      setCachedTrending(prev => ({
        ...prev,
        [activeTab]: activeTrending
      }))
      setCachedPages(prev => ({
        ...prev,
        [activeTab]: activeTotalPages
      }))
    }
  }, [activeTrending, activeTotalPages, activeTab])

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  const handlePageChange = (newPage: number) => {
    setPageMap(prev => ({
      ...prev,
      [activeTab]: newPage
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 w-full">
      <AuthAwareNavigation />
      <div className="max-w-6xl mx-auto mb-8">
        <MainHeader
          title="Trending Topics"
          // subTitle="Stay updated with the latest political discussions and news"
        />
        <div className="text-left space-y-4 text-[#203c39]">
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3 mb-6">
              {scopes.map(scope => {
                const Icon = scope.icon
                return (
                  <TabsTrigger
                    key={scope.value}
                    value={scope.value}
                    className="flex items-center gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {scope.label}
                  </TabsTrigger>
                )
              })}
            </TabsList>

            {scopes.map(scope => (
              <TabsContent
                key={scope.value}
                value={scope.value}
                className="space-y-4"
              >
                {loadedTabs[scope.value] && (
                  <TrendingTabContent
                    scope={scope.value}
                    page={pageMap[scope.value]}
                    onPageChange={handlePageChange}
                    trending={
                      scope.value === activeTab
                        ? activeTrending
                        : cachedTrending[scope.value]
                    }
                    totalPages={
                      scope.value === activeTab
                        ? activeTotalPages
                        : cachedPages[scope.value]
                    }
                    isLoading={
                      scope.value === activeTab ? activeLoading : false
                    }
                    error={scope.value === activeTab ? activeError : undefined}
                  />
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
      <AuthAwareFooter />
    </div>
  )
}
