'use client'

import CandidateOnboardingWizard from '@/components/candidate-onboarding-wizard'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function CandidateOnboardingPage() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCandidate, setIsCandidate] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkUserAndRedirect = async () => {
      try {
        const {
          data: { user },
          error
        } = await supabase.auth.getUser()

        if (error || !user) {
          router.push('/auth/login')
          return
        }

        setUser(user)

        // Check if user is a candidate - use a more flexible approach
        let profile
        try {
          // First try with onboarding fields
          let { data, error } = await supabase
            .from('profiles')
            .select(
              'user_type_id, onboarding_completed, onboarding_completed_at'
            )
            .eq('user_id', user.id)
            .single()

          // If that fails, try without onboarding fields (they might not exist yet)
          if (error && error.message?.includes('onboarding_completed')) {
            console.log('Onboarding fields not found, trying without them...')
            const fallbackResult = await supabase
              .from('profiles')
              .select('user_type_id')
              .eq('user_id', user.id)
              .single()

            if (fallbackResult.error) {
              throw fallbackResult.error
            }

            // Add default values for onboarding fields
            profile = {
              ...fallbackResult.data,
              onboarding_completed: false,
              onboarding_completed_at: null
            }
          } else if (error) {
            throw error
          } else {
            profile = data
          }
        } catch (error) {
          console.error('Profile fetch failed:', error)

          // If profile doesn't exist, redirect to profile creation
          if (error.code === 'PGRST116') {
            console.log('Profile does not exist, redirecting to profile page')
            router.push('/user/profile')
            return
          }

          router.push('/user/profile')
          return
        }

        if (!profile) {
          console.log('No profile found, redirecting to profile page')
          router.push('/user/profile')
          return
        }

        // Check if user is a candidate (ID: 3dad0f25-2b3b-491b-9e82-9f9e71adad6f)
        const candidateTypeId = '3dad0f25-2b3b-491b-9e82-9f9e71adad6f'

        if (profile.user_type_id !== candidateTypeId) {
          // Not a candidate, redirect to profile
          router.push('/user/profile')
          return
        }

        // If onboarding is already completed, redirect to candidate profile
        // Handle case where onboarding_completed field might not exist yet
        if (profile.onboarding_completed === true) {
          router.push('/candidate-profile')
          return
        }

        setIsCandidate(true)
      } catch (error) {
        console.error('Error in candidate onboarding check:', error)
        router.push('/auth/login')
      } finally {
        setIsLoading(false)
      }
    }

    checkUserAndRedirect()
  }, [router, supabase.auth])

  const handleOnboardingComplete = () => {
    // Redirect to candidate profile page after completion
    router.push('/candidate-profile')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your candidate setup...</p>
        </div>
      </div>
    )
  }

  if (!user || !isCandidate) {
    return null // Will redirect in useEffect
  }

  return (
    <CandidateOnboardingWizard
      userId={user.id}
      onComplete={handleOnboardingComplete}
    />
  )
}
