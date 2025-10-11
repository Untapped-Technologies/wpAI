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

        // Check if user is a candidate using API
        try {
          const response = await fetch('/api/candidate/status')

          if (!response.ok) {
            throw new Error('Failed to fetch user status')
          }

          const result = await response.json()

          if (!result.success) {
            throw new Error('Failed to get user status')
          }

          const { isCandidate, onboardingCompleted } = result.data

          if (!isCandidate) {
            // Not a candidate, redirect to regular profile
            router.push('/user/profile')
            return
          }

          // If onboarding is not completed, redirect to onboarding
          if (!onboardingCompleted) {
            router.push('/candidate-onboarding')
            return
          }

          setIsCandidate(true)
        } catch (error) {
          console.error('Profile fetch failed:', error)
          router.push('/user/profile')
          return
        }
      } catch (error) {
        console.error('Error in candidate profile check:', error)
        router.push('/auth/login')
      } finally {
        setIsLoading(false)
      }
    }

    checkUserAndLoadProfile()
  }, [router])

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
