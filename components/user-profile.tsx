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
import { Clock, User } from 'lucide-react'
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
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchUserProfile()
  }, [userId])

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/user/profile')

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/auth/login')
          return
        }
        const errorText = await response.text()
        toast.error('Failed to load profile data')
        return
      }

      const result = await response.json()

      if (!result.success) {
        toast.error('Failed to load profile data')
        return
      }

      const data = result.data

      if (data) {
        // Transform the data to match our interface
        const transformedData: UserProfileData = {
          basic_info: {
            display_name: data.display_name || '',
            email: data.email || '',
            user_type_id: data.user_type_id || '',
            bio: data.bio || ''
          },
          preferences: data.preferences || {
            city: '',
            state: '',
            country: 'US',
            postalCode: '',
            timezone: '',
            smsNotifs: true,
            emailNotifs: true,
            avatar: ''
          },
          profile_picture: data.profile_picture || null
        }
        setProfileData(transformedData)
      } else {
        toast.error('No user profile data found')
      }

      // Set additional data from preferences column
      if (data.preferences) {
        const location = extractLocationData(data.preferences)
        const notifications = extractNotificationData(data.preferences)
        setLocationData(location)
        setNotificationData(notifications)
      }

      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching user profile:', error)
      toast.error('Failed to load profile data')
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
    } catch (error) {
      console.error('Error saving profile:', error)
      toast.error(
        error instanceof Error ? error.message : 'Failed to save profile'
      )
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
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
      <div className="max-w-4xl mx-auto px-4">
        <UserProfileHeader
          profileData={profileData}
          onEditProfile={handleEditProfile}
        />
        <UserProfileSections
          profileData={profileData}
          location={locationData}
          notifications={notificationData}
        />
      </div>
    </div>
  )
}
