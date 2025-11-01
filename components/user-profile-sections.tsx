'use client'

import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Bell, MapPin, Settings, User } from 'lucide-react'
import { useEffect, useState } from 'react'

interface UserProfileSectionsProps {
  profileData: {
    basic_info: {
      display_name: string
      email: string
      user_type_id: string | null
      bio: string
    }
    preferences: {
      city: string
      state: string
      country: string
      postalCode: string
      smsNotifs: boolean
      emailNotifs: boolean
      avatar: string
    }
  }
  location?: any
  notifications?: any
}

interface UserType {
  id: string
  label: string | null
  description: string | null
  country_code?: string | null
}

export default function UserProfileSections({
  profileData,
  location,
  notifications
}: UserProfileSectionsProps) {
  const { basic_info, preferences } = profileData
  const [userTypes, setUserTypes] = useState<UserType[]>([])

  // Fetch user types from API filtered by country code
  useEffect(() => {
    const fetchUserTypes = async () => {
      try {
        // Get country code from user's preferences, default to 'US' if not set
        const countryCode = preferences.country || 'US'
        const url = `/api/usertypes?country_code=${encodeURIComponent(countryCode)}`
        
        const response = await fetch(url)
        if (response.ok) {
          const data = await response.json()
          setUserTypes(data)
        } else {
          console.error('Failed to fetch user types')
        }
      } catch (error) {
        console.error('Error fetching user types:', error)
      }
    }

    fetchUserTypes()
  }, [preferences.country])

  const getUserTypeLabel = (userTypeId: string | null) => {
    if (!userTypeId) return 'Not specified'
    
    const userType = userTypes.find(ut => ut.id === userTypeId)
    return userType?.label || 'Unknown'
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Account Information */}
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <User className="w-5 h-5 mr-2 text-blue-600" />
            Account Information
          </CardTitle>
          <CardDescription>
            Your basic account details and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Display Name
            </label>
            <p className="text-gray-900">{basic_info.display_name}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <p className="text-gray-900">{basic_info.email}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">
              User Type
            </label>
            <Badge variant="outline" className="ml-2">
              {getUserTypeLabel(basic_info.user_type_id)}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Location Information */}
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <MapPin className="w-5 h-5 mr-2 text-green-600" />
            Location
          </CardTitle>
          <CardDescription>Your location preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">City</label>
            <p className="text-gray-900">
              {preferences.city || 'Not specified'}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">State</label>
            <p className="text-gray-900">
              {preferences.state || 'Not specified'}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Country</label>
            <p className="text-gray-900">
              {preferences.country || 'Not specified'}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">
              Postal Code
            </label>
            <p className="text-gray-900">
              {preferences.postalCode || 'Not specified'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Bell className="w-5 h-5 mr-2 text-purple-600" />
            Notifications
          </CardTitle>
          <CardDescription>
            Your notification preferences and settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              Email Notifications
            </span>
            <Badge variant={preferences.emailNotifs ? 'default' : 'secondary'}>
              {preferences.emailNotifs ? 'Enabled' : 'Disabled'}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              SMS Notifications
            </span>
            <Badge variant={preferences.smsNotifs ? 'default' : 'secondary'}>
              {preferences.smsNotifs ? 'Enabled' : 'Disabled'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Profile Summary */}
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Settings className="w-5 h-5 mr-2 text-orange-600" />
            Profile Summary
          </CardTitle>
          <CardDescription>
            Overview of your profile completeness
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Profile Completeness
              </span>
              <span className="text-sm font-medium">85%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: '85%' }}
              ></div>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            <p>✓ Basic information completed</p>
            <p>✓ Location preferences set</p>
            <p>✓ Notification preferences configured</p>
            <p className="text-orange-600">• Bio could be enhanced</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
