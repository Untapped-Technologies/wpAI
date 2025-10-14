'use client'

import CandidateProfile from '@/components/candidate-profile'
import { useAuthUser } from '@/hooks/useAuthUser'
import { useCandidateStatus } from '@/hooks/useCandidateStatus'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function CandidateProfilePage() {
  const router = useRouter()
  const { data: user, loading: userLoading, error: userError } = useAuthUser()
  const {
    data: candidateStatus,
    loading: statusLoading,
    error: statusError
  } = useCandidateStatus()

  useEffect(() => {
    if (!userLoading && userError) {
      if (userError === 'Unauthorized') {
        router.push('/auth/login')
      }
    }
  }, [userLoading, userError, router])

  useEffect(() => {
    if (!statusLoading && candidateStatus) {
      const { isCandidate, onboardingCompleted } = candidateStatus

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
    }
  }, [candidateStatus, statusLoading, router])

  if (userLoading || statusLoading) {
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

  if (userError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Error loading user: {userError}</p>
          <button
            onClick={() => router.push('/auth/login')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Login
          </button>
        </div>
      </div>
    )
  }

  if (statusError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Error loading profile: {statusError}</p>
          <button
            onClick={() => router.push('/user/profile')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go to Profile
          </button>
        </div>
      </div>
    )
  }

  if (!user || !candidateStatus?.isCandidate) {
    return null // Will redirect in useEffect
  }

  return <CandidateProfile userId={user.id} />
}
