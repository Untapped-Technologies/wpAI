'use client'
import { Skeleton } from '@/components/ui/skeleton'
import { Globe, MapPin, Users } from 'lucide-react'
import Link from 'next/link'
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
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 [column-fill:_balance]">
        {trending.map((topic: any) => {
          // Prefer real images; if none exist, generate random demo images
          let images: string[] =
            topic?.images ||
            topic?.image_urls ||
            (topic?.image_url ? [topic.image_url] : [])

          if (!images || images.length === 0) {
            const count = 1 + Math.floor(Math.random() * 3) // 1-3 images
            images = Array.from({ length: count }).map((_, i) => {
              const height = 220 + Math.floor(Math.random() * 260) // 220-480px
              return `https://picsum.photos/seed/${encodeURIComponent(
                String(topic.id)
              )}-${i}/800/${height}`
            })
          }

          const primaryImage = images?.[0]
          const extraCount = Math.max((images?.length || 0) - 3, 0)

          return (
            <div key={topic.id} className="break-inside-avoid mb-4">
              <div className="rounded-xl overflow-hidden bg-white ring-1 ring-slate-200 hover:shadow-md transition-shadow duration-200">
                {primaryImage && (
                  <div className="relative">
                    <img
                      src={primaryImage}
                      alt={topic.title}
                      className="w-full h-auto object-cover"
                      loading="lazy"
                    />
                  </div>
                )}

                {images && images.length > 1 && (
                  <div className="flex gap-2 p-3">
                    {images.slice(1, 3).map((src: string, idx: number) => (
                      <img
                        key={idx}
                        src={src}
                        alt="thumbnail"
                        className="h-14 w-14 rounded-md object-cover"
                        loading="lazy"
                      />
                    ))}
                    {extraCount > 0 && (
                      <div className="h-14 w-14 rounded-md bg-slate-900 text-white text-sm font-medium grid place-items-center">
                        +{extraCount}
                      </div>
                    )}
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-lg leading-tight pr-4">
                      <Link href="/search/wlwbFf5U8gt6gIit">{topic.title}</Link>
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
                    <span>
                      {new Date(topic.published_at).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
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
