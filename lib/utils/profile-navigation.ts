import { getCandidateStatus } from '@/hooks/useCandidateStatus'
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
    const { isCandidate } = await getCandidateStatus()
    return isCandidate ? '/candidate-profile' : '/user/profile'
  } catch (error) {
    // Silently fallback to user profile for any errors (expected for non-candidates)
    // The API should handle all cases gracefully, but this is a safe fallback
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
export async function getCandidateStatusData(user: User | null): Promise<{
  isCandidate: boolean
  approved: boolean | null
  onboardingCompleted: boolean | null
}> {
  if (!user) {
    return { isCandidate: false, approved: null, onboardingCompleted: null }
  }

  try {
    const { isCandidate, approved, onboardingCompleted } =
      await getCandidateStatus()
    return { isCandidate, approved, onboardingCompleted }
  } catch (error) {
    // Silently return default values for any errors (expected for non-candidates)
    // The API should handle all cases gracefully, but this is a safe fallback
    return { isCandidate: false, approved: null, onboardingCompleted: null }
  }
}
