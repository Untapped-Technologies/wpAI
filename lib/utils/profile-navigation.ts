import { User } from '@supabase/supabase-js'

/**
 * Determines the appropriate profile URL for a user based on their user type
 * @param user - The Supabase user object
 * @returns Promise<string> - The profile URL ('/candidate-profile' for candidates, '/user/profile' for others)
 */
export async function getProfileUrl(user: User | null): Promise<string> {
  if (!user) {
    return '/user/profile'
  }

  try {
    // Check if user is a candidate using the existing API
    const response = await fetch('/api/candidate/status')

    if (!response.ok) {
      // If API fails, default to regular profile
      return '/user/profile'
    }

    const result = await response.json()

    if (!result.success) {
      // If API returns error, default to regular profile
      return '/user/profile'
    }

    const { isCandidate } = result.data

    // Return candidate profile URL if user is a candidate, otherwise regular profile
    return isCandidate ? '/candidate-profile' : '/user/profile'
  } catch (error) {
    console.error('Error checking user candidate status:', error)
    // If any error occurs, default to regular profile
    return '/user/profile'
  }
}

/**
 * Hook to get the appropriate profile URL for the current user
 * @param user - The Supabase user object
 * @returns Promise<string> - The profile URL
 */
export function useProfileUrl(user: User | null): string {
  // For now, return a default value. The actual URL will be determined
  // when the component renders and calls getProfileUrl
  return '/user/profile'
}

/**
 * Gets the full candidate status including approval status
 * @param user - The Supabase user object
 * @returns Promise<{isCandidate: boolean, approved: boolean | null, onboardingCompleted: boolean | null}>
 */
export async function getCandidateStatus(user: User | null): Promise<{
  isCandidate: boolean
  approved: boolean | null
  onboardingCompleted: boolean | null
}> {
  if (!user) {
    return { isCandidate: false, approved: null, onboardingCompleted: null }
  }

  try {
    // Check if user is a candidate using the existing API
    const response = await fetch('/api/candidate/status')

    if (!response.ok) {
      // If API fails, return default values
      return { isCandidate: false, approved: null, onboardingCompleted: null }
    }

    const result = await response.json()

    if (!result.success) {
      // If API returns error, return default values
      return { isCandidate: false, approved: null, onboardingCompleted: null }
    }

    const { isCandidate, approved, onboardingCompleted } = result.data

    return { isCandidate, approved, onboardingCompleted }
  } catch (error) {
    console.error('Error checking candidate status:', error)
    // If any error occurs, return default values
    return { isCandidate: false, approved: null, onboardingCompleted: null }
  }
}
