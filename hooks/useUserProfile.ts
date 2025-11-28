import { useEffect, useState } from 'react'

type UserProfile = {
  id?: string
  user_id?: string
  display_name?: string
  user_type_id?: string
  email?: string
  phone_number?: string
  bio?: string
  preferences?: any
  profile_picture?: string
  onboarding_completed?: boolean
  onboarding_completed_at?: string
  approved?: boolean
  created_at?: string
  updated_at?: string
}

type UserProfileState = {
  data: UserProfile | null
  loading: boolean
  error: string | null
}

// Global cache to prevent multiple API calls
let globalCache: {
  data: UserProfile | null
  timestamp: number
  promise: Promise<UserProfile> | null
} = {
  data: null,
  timestamp: 0,
  promise: null
}

const CACHE_DURATION = 2 * 60 * 1000 // 2 minutes (shorter than auth user since profile changes more often)

async function fetchUserProfile(): Promise<UserProfile> {
  const response = await fetch('/api/user/profile')

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Unauthorized')
    }
    throw new Error('Failed to fetch user profile')
  }

  const result = await response.json()

  if (!result.success) {
    throw new Error('Failed to get user profile data')
  }

  return result.data
}

export function useUserProfile() {
  const [state, setState] = useState<UserProfileState>({
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

    globalCache.promise = fetchUserProfile()

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
export async function getUserProfile(): Promise<UserProfile> {
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
  globalCache.promise = fetchUserProfile()

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
export function invalidateUserProfileCache() {
  globalCache.data = null
  globalCache.timestamp = 0
  globalCache.promise = null
}

// Function to update cache with new data (useful after PATCH operations)
export function updateUserProfileCache(newData: UserProfile) {
  globalCache.data = newData
  globalCache.timestamp = Date.now()
}
