// hooks/useTrending.ts
import useSWR from 'swr'

const fetcher = (url: string) => {
  return fetch(url).then(res => {
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }
    return res.json()
  })
}

export function useTrending(
  scope: string,
  page = 1,
  limit = 10,
  filters: Record<string, string> = {}
) {
  // Create a stable cache key that includes all parameters
  const cacheKey = `trending-${scope}-${page}-${limit}-${JSON.stringify(filters)}`

  const url = new URL(
    '/api/trending',
    typeof window !== 'undefined'
      ? window.location.origin
      : 'http://localhost:3000'
  )
  url.searchParams.set('scope', scope)
  url.searchParams.set('page', page.toString())
  url.searchParams.set('limit', limit.toString())

  Object.entries(filters).forEach(([key, value]) => {
    if (value) url.searchParams.set(key, value)
  })

  const { data, error, isLoading, mutate } = useSWR(
    scope ? url.toString() : null, // use full URL as the key
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 0,
      refreshInterval: 0,
      revalidateOnMount: true,
      revalidateIfStale: true
    }
  )

  return {
    trending: data?.data || [],
    total: data?.total || 0,
    totalPages: data?.totalPages || 1,
    isLoading,
    error,
    mutate
  }
}
