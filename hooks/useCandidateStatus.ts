import { useEffect, useState } from 'react'

type CandidateStatus = {
  isCandidate: boolean
  approved: boolean | null
  onboardingCompleted: boolean | null
  onboardingCompletedAt: string | null
  userTypeId: string | null
}

type CandidateStatusState = {
  data: CandidateStatus | null
  loading: boolean
  error: string | null
}

// Global cache to prevent multiple API calls
let globalCache: {
  data: CandidateStatus | null
  timestamp: number
  promise: Promise<CandidateStatus> | null
} = {
  data: null,
  timestamp: 0,
  promise: null
}

const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

async function fetchCandidateStatus(): Promise<CandidateStatus> {
  const response = await fetch('/api/candidate/status')

  if (!response.ok) {
    throw new Error('Failed to fetch candidate status')
  }

  const result = await response.json()

  if (!result.success) {
    throw new Error('Failed to get candidate status')
  }

  return result.data
}

export function useCandidateStatus() {
  const [state, setState] = useState<CandidateStatusState>({
    data: null,
    loading: true,
    error: null
  })

  useEffect(() => {
    const now = Date.now()

    // Check if we have valid cached data
    if (globalCache.data && now - globalCache.timestamp < CACHE_DURATION) {
      setState({
        data: globalCache.data,
        loading: false,
        error: null
      })
      return
    }

    // If there's already a request in progress, wait for it
    if (globalCache.promise) {
      globalCache.promise
        .then(data => {
          setState({
            data,
            loading: false,
            error: null
          })
        })
        .catch(error => {
          setState({
            data: null,
            loading: false,
            error: error.message
          })
        })
      return
    }

    // Start new request
    setState(prev => ({ ...prev, loading: true, error: null }))

    globalCache.promise = fetchCandidateStatus()

    globalCache.promise
      .then(data => {
        globalCache.data = data
        globalCache.timestamp = now
        globalCache.promise = null

        setState({
          data,
          loading: false,
          error: null
        })
      })
      .catch(error => {
        globalCache.promise = null

        setState({
          data: null,
          loading: false,
          error: error.message
        })
      })
  }, [])

  return state
}

// Utility function for non-React contexts
export async function getCandidateStatus(): Promise<CandidateStatus> {
  const now = Date.now()

  // Check cache first
  if (globalCache.data && now - globalCache.timestamp < CACHE_DURATION) {
    return globalCache.data
  }

  // If there's already a request in progress, wait for it
  if (globalCache.promise) {
    return globalCache.promise
  }

  // Start new request
  globalCache.promise = fetchCandidateStatus()

  try {
    const data = await globalCache.promise
    globalCache.data = data
    globalCache.timestamp = now
    globalCache.promise = null
    return data
  } catch (error) {
    globalCache.promise = null
    throw error
  }
}

// Function to invalidate cache (useful after profile updates)
export function invalidateCandidateStatusCache() {
  globalCache.data = null
  globalCache.timestamp = 0
  globalCache.promise = null
}
