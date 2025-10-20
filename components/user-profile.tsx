'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useUserProfile } from '@/hooks/useUserProfile'
import {
  extractLocationData,
  extractNotificationData
} from '@/lib/utils/debugPreferences'
import { Clock, CreditCard, Settings, User } from 'lucide-react'
import PaymentHistory from './payment-history'
import UserProfileEditTabs from './user-profile-edit-tabs'
import UserProfileHeader from './user-profile-header'
import UserProfileSections from './user-profile-sections'

interface UserProfileData {
  basic_info: {
    display_name: string
    email: string
    user_type_id: string
    bio: string
  }
  preferences: {
    city: string
    state: string
    country: string
    postalCode: string
    timezone: string
    smsNotifs: boolean
    emailNotifs: boolean
    avatar: string
  }
  profile_picture?: string | null
}

interface UserProfileProps {
  userId: string
}

export default function UserProfile({ userId }: UserProfileProps) {
  const [profileData, setProfileData] = useState<UserProfileData | null>(null)
  const [locationData, setLocationData] = useState<any>(null)
  const [notificationData, setNotificationData] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()
  const {
    data: userProfile,
    loading: profileLoading,
    error: profileError
  } = useUserProfile()

  useEffect(() => {
    if (userProfile) {
      // Transform the data to match our interface
      const transformedData: UserProfileData = {
        basic_info: {
          display_name: userProfile.display_name || '',
          email: userProfile.email || '',
          user_type_id: userProfile.user_type_id || '',
          bio: userProfile.bio || ''
        },
        preferences: userProfile.preferences || {
          city: '',
          state: '',
          country: 'US',
          postalCode: '',
          timezone: '',
          smsNotifs: true,
          emailNotifs: true,
          avatar: ''
        },
        profile_picture: userProfile.profile_picture || null
      }
      setProfileData(transformedData)
    }
  }, [userProfile])

  useEffect(() => {
    if (profileError) {
      toast.error('Failed to load profile data')
    }
  }, [profileError])

  useEffect(() => {
    if (userProfile?.preferences) {
      const location = extractLocationData(userProfile.preferences)
      const notifications = extractNotificationData(userProfile.preferences)
      setLocationData(location)
      setNotificationData(notifications)
    }
  }, [userProfile])

  const handleEditProfile = () => {
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
  }

  const handleSaveProfile = async (updatedData: any) => {
    setIsSaving(true)
    try {
      // Transform the nested data structure to match API expectations
      const apiData = {
        display_name: updatedData.basic_info?.display_name,
        user_type_id: updatedData.basic_info?.user_type_id,
        bio: updatedData.basic_info?.bio,
        preferences: updatedData.preferences,
        profile_picture: updatedData.profile_picture
      }

      console.log('Sending profile data:', apiData)

      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(apiData)
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Profile save failed:', response.status, errorText)
        throw new Error(`Failed to save profile: ${response.status}`)
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.message || 'Failed to save profile')
      }

      toast.success('Profile updated successfully!')
      setProfileData(updatedData)
      setIsEditing(false)

      // Invalidate cache to refresh data
      import('@/hooks/useUserProfile').then(
        ({ invalidateUserProfileCache }) => {
          invalidateUserProfileCache()
        }
      )
    } catch (error) {
      console.error('Error saving profile:', error)
      toast.error(
        error instanceof Error ? error.message : 'Failed to save profile'
      )
    } finally {
      setIsSaving(false)
    }
  }

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4 animate-spin" />
            <h2 className="text-xl font-semibold mb-2">Loading Profile</h2>
            <p className="text-gray-600">
              Please wait while we load your profile data...
            </p>
          </CardContent>
        </Card>
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
              It looks like you haven't completed your profile yet.
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
      <UserProfileEditTabs
        profileData={profileData}
        locationData={locationData}
        notificationData={notificationData}
        onSave={handleSaveProfile}
        onCancel={handleCancelEdit}
        isLoading={isSaving}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <UserProfileHeader
          profileData={profileData}
          onEditProfile={handleEditProfile}
        />

        <Tabs defaultValue="profile" className="mt-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Payment History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            <UserProfileSections
              profileData={profileData}
              location={locationData}
              notifications={notificationData}
            />
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
                <p className="text-gray-600 mb-4">
                  Manage your account preferences and settings.
                </p>
                <Button onClick={handleEditProfile} className="w-full">
                  Edit Profile Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="mt-6">
            <PaymentHistory userId={userId} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
