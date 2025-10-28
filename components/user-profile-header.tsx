'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Edit, Mail, MapPin, User } from 'lucide-react'
import Image from 'next/image'

interface UserProfileHeaderProps {
  profileData: {
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
      smsNotifs: boolean
      emailNotifs: boolean
      avatar: string
    }
    profile_picture?: string | null
  }
  onEditProfile: () => void
}

export default function UserProfileHeader({
  profileData,
  onEditProfile
}: UserProfileHeaderProps) {
  const { basic_info, preferences } = profileData

  const getUserTypeLabel = (userTypeId: string) => {
    switch (userTypeId) {
      case 'Pol':
        return 'Political Professional'
      case 'Cit':
        return 'Citizen'
      case 'Med':
        return 'Media Professional'
      case 'Aca':
        return 'Academic'
      default:
        return 'User'
    }
  }

  return (
    <Card className="mb-8 shadow-none">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 rounded-full flex items-center justify-center overflow-hidden">
              {profileData.profile_picture ? (
                <Image
                  src={profileData.profile_picture}
                  alt="Profile picture"
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-10 h-10 text-white" />
              )}
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                {basic_info.display_name || 'User Profile'}
              </CardTitle>
              <CardDescription className="text-lg text-gray-600 mt-1">
                {getUserTypeLabel(basic_info.user_type_id)}
              </CardDescription>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center text-sm text-gray-500">
                  <Mail className="w-4 h-4 mr-1" />
                  {basic_info.email}
                </div>
                {(preferences.city || preferences.state) && (
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="w-4 h-4 mr-1" />
                    {[preferences.city, preferences.state]
                      .filter(Boolean)
                      .join(', ')}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="text-sm">
              Active User
            </Badge>
            <Button onClick={onEditProfile} variant="outline" size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>
      </CardHeader>
      {basic_info.bio && (
        <CardContent className="pt-0">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">About</h4>
            <p className="text-gray-700 leading-relaxed">{basic_info.bio}</p>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
