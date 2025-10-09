'use client'

import CandidateProfile from '@/components/candidate-profile'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function CandidateProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCandidate, setIsCandidate] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkUserAndLoadProfile = async () => {
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

        // Check if user is a candidate
        let profile
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('user_type_id, onboarding_completed')
            .eq('user_id', user.id)
            .single()

          if (error) {
            throw error
          }

          profile = data
        } catch (error) {
          console.error('Profile fetch failed:', error)
          router.push('/user/profile')
          return
        }

        if (!profile) {
          router.push('/user/profile')
          return
        }

        // Check if user is a candidate (ID: 3dad0f25-2b3b-491b-9e82-9f9e71adad6f)
        const candidateTypeId = '3dad0f25-2b3b-491b-9e82-9f9e71adad6f'

        if (profile.user_type_id !== candidateTypeId) {
          // Not a candidate, redirect to regular profile
          router.push('/user/profile')
          return
        }

        // If onboarding is not completed, redirect to onboarding
        if (!profile.onboarding_completed) {
          router.push('/candidate-onboarding')
          return
        }

        setIsCandidate(true)
      } catch (error) {
        console.error('Error in candidate profile check:', error)
        router.push('/auth/login')
      } finally {
        setIsLoading(false)
      }
    }

    checkUserAndLoadProfile()
  }, [router, supabase.auth])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            Loading your candidate profile...
          </p>
        </div>
      </div>
    )
  }

  if (!user || !isCandidate) {
    return null // Will redirect in useEffect
  }

  return <CandidateProfile userId={user.id} />
}
