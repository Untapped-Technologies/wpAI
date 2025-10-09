'use client'

import CandidatePublicProfile from '@/components/candidate-public-profile'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface CandidatePublicPageProps {
  params: {
    id: string
  }
}

export default function CandidatePublicPage({
  params
}: CandidatePublicPageProps) {
  const [profileData, setProfileData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    fetchCandidateProfile()
  }, [params.id])

  const fetchCandidateProfile = async () => {
    try {
      // First, get the user profile to find the candidate profile data
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('candidate_profile, preferences, onboarding_completed')
        .eq('user_id', params.id)
        .single()

      if (profileError) {
        console.error('Error fetching candidate profile:', profileError)
        toast.error('Candidate profile not found')
        router.push('/')
        return
      }

      // Try candidate_profile column first, then fallback to preferences
      const candidateData =
        profile.candidate_profile || profile.preferences?.candidate_profile

      if (!candidateData) {
        toast.error('No candidate profile data found')
        router.push('/')
        return
      }

      // Check if profile is approved (onboarding completed)
      if (!profile.onboarding_completed) {
        toast.error('This candidate profile is not yet approved')
        router.push('/')
        return
      }

      setProfileData(candidateData)
    } catch (error) {
      console.error('Error fetching profile:', error)
      toast.error('Failed to load candidate profile')
      router.push('/')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading candidate profile...</p>
        </div>
      </div>
    )
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Profile Not Found</h2>
          <p className="text-gray-600 mb-4">
            The candidate profile you're looking for doesn't exist or isn't
            available.
          </p>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  return <CandidatePublicProfile profileData={profileData} />
}
