import { useEffect, useState } from 'react'

type AuthUser = {
  id: string
  email?: string
  user_metadata?: any
  app_metadata?: any
  aud?: string
  created_at?: string
  updated_at?: string
  email_confirmed_at?: string
  phone?: string
  phone_confirmed_at?: string
  last_sign_in_at?: string
  role?: string
  factors?: any[]
  identities?: any[]
}

type AuthUserState = {
  data: AuthUser | null
  loading: boolean
  error: string | null
}

// Global cache to prevent multiple API calls
let globalCache: {
  data: AuthUser | null
  timestamp: number
  promise: Promise<AuthUser> | null
} = {
  data: null,
  timestamp: 0,
  promise: null
}

const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

async function fetchAuthUser(): Promise<AuthUser> {
  const response = await fetch('/api/auth/user')

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Unauthorized')
    }
    throw new Error('Failed to fetch user')
  }

  const result = await response.json()

  if (!result.success) {
    throw new Error('Failed to get user data')
  }

  return result.data.user
}

export function useAuthUser() {
  const [state, setState] = useState<AuthUserState>({
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

    globalCache.promise = fetchAuthUser()

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
export async function getAuthUser(): Promise<AuthUser> {
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
  globalCache.promise = fetchAuthUser()

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

// Function to invalidate cache (useful after auth changes)
export function invalidateAuthUserCache() {
  globalCache.data = null
  globalCache.timestamp = 0
  globalCache.promise = null
}
