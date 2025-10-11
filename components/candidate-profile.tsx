'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  extractLocationData,
  extractNotificationData
} from '@/lib/utils/debugPreferences'
import { User } from 'lucide-react'
import CandidateProfileEditTabs from './candidate-profile-edit-tabs'
import CandidateProfileHeader from './candidate-profile-header'
import CandidateProfileSections from './candidate-profile-sections'
import CandidatePublicProfile from './candidate-public-profile'

interface CandidateProfileData {
  basic_info: {
    fullName: string
    office: string
    district: string
    party: string
    website: string
    bio: string
    jurisdiction: string[]
  }
  key_issues: {
    issue1: string
    issue2: string
    issue3: string
  }
  policies: {
    policy1: string
    policy2: string
    policy3: string
  }
  onboarding_completed: boolean
  onboarding_completed_at?: string
}

interface CandidateProfileProps {
  userId: string
}

export default function CandidateProfile({ userId }: CandidateProfileProps) {
  const [profileData, setProfileData] = useState<CandidateProfileData | null>(
    null
  )
  const [locationData, setLocationData] = useState<any>(null)
  const [notificationData, setNotificationData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isPublicView, setIsPublicView] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchCandidateProfile()
  }, [userId])

  const fetchCandidateProfile = async () => {
    try {
      const response = await fetch('/api/candidate/profile')

      if (!response.ok) {
        const errorText = await response.text()
        toast.error('Failed to load profile data')
        return
      }

      const result = await response.json()

      if (!result.success) {
        toast.error('Failed to load profile data')
        return
      }

      const {
        candidateProfile,
        preferences,
        onboardingCompleted,
        onboardingCompletedAt
      } = result.data

      if (candidateProfile) {
        setProfileData(candidateProfile)
      } else {
        toast.error('No candidate profile data found')
      }

      // Set additional data from preferences column
      if (preferences) {
        // Extract location and notification data using utility functions
        const locationData = preferences
        const notificationData = {
          onboarding_completed: onboardingCompleted,
          onboarding_completed_at: onboardingCompletedAt
        }

        setLocationData(locationData)
        setNotificationData(notificationData)
      } else {
        // Set default values if no preferences exist
        setLocationData(extractLocationData(null))
        setNotificationData(extractNotificationData(null))
      }
    } catch (error) {
      toast.error('Failed to load profile')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditProfile = () => {
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
  }

  const handleSaveProfile = async (updatedData: any) => {
    setIsSaving(true)
    try {
      // Extract the core candidate profile data (excluding location and notifications)
      const candidateProfileData = {
        basic_info: updatedData.basic_info,
        key_issues: updatedData.key_issues,
        policies: updatedData.policies
      }

      // Get current preferences to merge with new data
      const { data: currentProfile } = await supabase
        .from('profiles')
        .select('preferences')
        .eq('user_id', userId)
        .single()

      const currentPreferences = currentProfile?.preferences || {}

      // Prepare updated preferences with location and notifications
      const updatedPreferences = {
        ...currentPreferences,
        candidate_profile: candidateProfileData,
        location: updatedData.location,
        notifications: updatedData.notifications
      }

      // Try to save to candidate_profile column first, then update preferences
      let candidateProfileError = null

      try {
        const { error } = await supabase
          .from('profiles')
          .update({
            candidate_profile: candidateProfileData,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)

        if (error) {
          candidateProfileError = error
        }
      } catch (err) {
        candidateProfileError = err
      }

      // Always update preferences column with all data
      const { data, error: preferencesError } = await supabase
        .from('profiles')
        .update({
          preferences: updatedPreferences,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()

      if (preferencesError) {
        console.error('Error saving preferences:', preferencesError)
        throw preferencesError
      }

      console.log('Successfully saved preferences:', data)

      // Update local state
      setProfileData(candidateProfileData)
      setLocationData(updatedData.location)
      setNotificationData(updatedData.notifications)
      setIsEditing(false)

      // Log if candidate_profile column doesn't exist
      if (
        candidateProfileError &&
        candidateProfileError.message?.includes('candidate_profile')
      ) {
        console.log(
          'candidate_profile column not found, data saved to preferences only'
        )
      }
    } catch (error) {
      console.error('Error saving profile:', error)
      throw error
    } finally {
      setIsSaving(false)
    }
  }

  const handleTogglePublicView = () => {
    setIsPublicView(!isPublicView)
  }

  const handleDownloadProfile = () => {
    // Create a printable version of the profile
    const printWindow = window.open('', '_blank')
    if (printWindow && profileData) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${profileData.basic_info.fullName} - Candidate Profile</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 40px; }
              .header { border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
              .section { margin-bottom: 30px; }
              .issue { background: #f5f5f5; padding: 15px; margin: 10px 0; border-radius: 5px; }
              .policy { margin: 15px 0; padding: 15px; border-left: 4px solid #007bff; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>${profileData.basic_info.fullName}</h1>
              <h2>Candidate for ${profileData.basic_info.office}</h2>
              <p>${profileData.basic_info.district} | ${profileData.basic_info.party}</p>
            </div>
            
            ${
              profileData.basic_info.bio
                ? `
              <div class="section">
                <h3>About</h3>
                <p>${profileData.basic_info.bio}</p>
              </div>
            `
                : ''
            }
            
            <div class="section">
              <h3>Key Issues</h3>
              ${profileData.key_issues.issue1 ? `<div class="issue"><strong>Priority Issue #1:</strong><br>${profileData.key_issues.issue1}</div>` : ''}
              ${profileData.key_issues.issue2 ? `<div class="issue"><strong>Priority Issue #2:</strong><br>${profileData.key_issues.issue2}</div>` : ''}
              ${profileData.key_issues.issue3 ? `<div class="issue"><strong>Priority Issue #3:</strong><br>${profileData.key_issues.issue3}</div>` : ''}
            </div>
            
            <div class="section">
              <h3>Policy Positions</h3>
              ${profileData.policies.policy1 ? `<div class="policy"><strong>Policy Position #1:</strong><br>${profileData.policies.policy1}</div>` : ''}
              ${profileData.policies.policy2 ? `<div class="policy"><strong>Policy Position #2:</strong><br>${profileData.policies.policy2}</div>` : ''}
              ${profileData.policies.policy3 ? `<div class="policy"><strong>Policy Position #3:</strong><br>${profileData.policies.policy3}</div>` : ''}
            </div>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  const handleDebugPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('preferences, candidate_profile')
        .eq('user_id', userId)
        .single()

      if (error) {
        console.error('Debug: Error fetching preferences:', error)
        toast.error('Failed to fetch preferences for debugging')
        return
      }
      toast.success('Check console for debug information')
    } catch (error) {
      console.error('Debug: Error:', error)
      toast.error('Debug failed')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Profile Found</h2>
            <p className="text-gray-600 mb-4">
              It looks like you haven't completed your candidate profile yet.
            </p>
            <Button onClick={handleEditProfile} className="w-full">
              Complete Your Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Render edit mode if editing
  if (isEditing && profileData) {
    return (
      <CandidateProfileEditTabs
        profileData={profileData}
        locationData={locationData}
        notificationData={notificationData}
        onSave={handleSaveProfile}
        onCancel={handleCancelEdit}
        isLoading={isSaving}
      />
    )
  }

  // Render public view if toggled
  if (isPublicView) {
    return <CandidatePublicProfile profileData={profileData} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Action Bar */}
        <div className="flex justify-end mb-6">
          <div className="flex space-x-3">
            {/* <Button
              variant="outline"
              onClick={handleDownloadProfile}
              className="flex items-center"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button
              variant="outline"
              onClick={() => window.print()}
              className="flex items-center"
            >
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button> */}
          </div>
        </div>

        {/* Profile Header */}
        <CandidateProfileHeader
          profileData={profileData}
          onEditProfile={handleEditProfile}
          onTogglePublicView={handleTogglePublicView}
          isPublicView={isPublicView}
        />

        {/* Profile Sections */}
        <CandidateProfileSections
          profileData={profileData}
          location={locationData}
          notifications={notificationData}
        />
      </div>
    </div>
  )
}
