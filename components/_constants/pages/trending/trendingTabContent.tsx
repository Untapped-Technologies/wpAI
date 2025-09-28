'use client'
import { Skeleton } from '@/components/ui/skeleton'
import { Globe, MapPin, Users } from 'lucide-react'
import { useEffect } from 'react'

const scopes = [
  { value: 'local', label: 'Local', icon: MapPin },
  { value: 'national', label: 'National', icon: Users },
  { value: 'international', label: 'International', icon: Globe }
]

export function TrendingTabContent({
  scope,
  page,
  onPageChange,
  trending,
  totalPages,
  isLoading,
  error
}: {
  scope: string
  page: number
  onPageChange: (page: number) => void
  trending: any[]
  totalPages: number
  isLoading: boolean
  error: any
}) {
  useEffect(() => {
    const onScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 100 &&
        !isLoading &&
        page < totalPages
      ) {
        onPageChange(page + 1)
      }
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [isLoading, page, totalPages, onPageChange])

  if (isLoading && page === 1) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="border rounded-lg p-4">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-2">Error loading data</div>
        <p className="text-sm text-muted-foreground">{error.message}</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid gap-4">
        {trending.map((topic: any) => (
          <div
            key={topic.id}
            className="border rounded-lg p-6 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-lg leading-tight pr-4">
                {topic.title}
              </h3>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {new Date(topic.published_at).toLocaleDateString()}
              </span>
            </div>

            {topic.description && (
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                {topic.description}
              </p>
            )}

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="capitalize">
                {scopes.find(s => s.value === scope)?.label} Politics
              </span>
              <span>{new Date(topic.published_at).toLocaleTimeString()}</span>
            </div>
          </div>
        ))}
      </div>

      {trending.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-2">
            No trending topics found for{' '}
            {scopes.find(s => s.value === scope)?.label.toLowerCase()} scope
          </div>
          <p className="text-sm text-muted-foreground">
            Check back later for the latest political discussions
          </p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => onPageChange(i + 1)}
                className={`px-3 py-2 text-sm rounded-md transition-colors ${
                  i + 1 === page
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80'
                }`}
                disabled={isLoading}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}

      {isLoading && page > 1 && (
        <div className="flex justify-center py-4">
          <Skeleton className="h-4 w-32" />
        </div>
      )}
    </>
  )
}
