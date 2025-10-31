'use client'

import { useEffect, useState } from 'react'

const CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutes
const CACHE_KEY_PREFIX = 'pricing_raw_'

// Shared in-memory cache
const getGlobalCache = (): Record<string, { ts: number; data: any[] }> => {
  if (typeof window === 'undefined') return {}
  const root: any = (window as any).__pricingRawCache
  return root || {}
}

const setGlobalCache = (key: string, data: any[]) => {
  if (typeof window === 'undefined') return
  const root = getGlobalCache()
  root[key] = { ts: Date.now(), data }
  ;(window as any).__pricingRawCache = root
}

const readCache = (interval: string): any[] | null => {
  try {
    if (typeof window === 'undefined') return null

    // 1) Try in-memory global cache first
    const globalCache = getGlobalCache()
    const globalEntry = globalCache[interval]
    if (
      globalEntry &&
      Array.isArray(globalEntry.data) &&
      Date.now() - globalEntry.ts < CACHE_TTL_MS
    ) {
      return globalEntry.data
    }

    // 2) Try localStorage cache
    const raw = localStorage.getItem(`${CACHE_KEY_PREFIX}${interval}`)
    if (!raw) return null

    const parsed = JSON.parse(raw)
    if (
      parsed &&
      typeof parsed.ts === 'number' &&
      Date.now() - parsed.ts < CACHE_TTL_MS &&
      Array.isArray(parsed.data)
    ) {
      // Populate global cache from localStorage
      setGlobalCache(interval, parsed.data)
      return parsed.data
    }
  } catch {
    // ignore errors
  }
  return null
}

const writeCache = (interval: string, data: any[]) => {
  try {
    if (typeof window === 'undefined') return

    // Write to both global and localStorage
    setGlobalCache(interval, data)
    localStorage.setItem(
      `${CACHE_KEY_PREFIX}${interval}`,
      JSON.stringify({ ts: Date.now(), data })
    )
  } catch {
    // ignore errors
  }
}

export function usePricing(interval: 'month' | 'annual' | 'all' = 'month') {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Try cache first
        const cached = readCache(interval)
        if (cached) {
          setData(cached)
          setLoading(false)
          return
        }

        // Fetch from API
        const res = await fetch(`/api/pricing?interval=${interval}`)
        const json = await res.json()

        if (!res.ok) {
          throw new Error(json?.error || 'Failed to load pricing')
        }

        const rawData = Array.isArray(json?.data) ? json.data : []

        // Cache raw data (not transformed)
        writeCache(interval, rawData)
        setData(rawData)
      } catch (e: any) {
        setError(e?.message || 'Failed to load pricing')
        setData([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [interval])

  return { data, loading, error }
}

// Helper to invalidate cache
export function invalidatePricingCache() {
  try {
    if (typeof window === 'undefined') return
    const intervals = ['month', 'annual', 'all']
    intervals.forEach(int => {
      localStorage.removeItem(`${CACHE_KEY_PREFIX}${int}`)
    })
    ;(window as any).__pricingRawCache = {}
  } catch {
    // ignore
  }
}
