'use client'

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
import { useEffect, useState } from 'react'
import MembershipInfo from './_constants/pages/user/membershipInfo'

interface UserProfileHeaderProps {
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
    profile_picture?: string | null
  }
  onEditProfile: () => void
}

export default function UserProfileHeader({
  profileData,
  onEditProfile
}: UserProfileHeaderProps) {
  const { basic_info, preferences } = profileData

  const [membership, setMembership] = useState<string>('free')
  const [trialDaysLeft, setTrialDaysLeft] = useState<number | null>(null)
  const [hasPaidSub, setHasPaidSub] = useState<boolean>(false)
  const [features, setFeatures] = useState<Record<string, any>>({})
  const [limits, setLimits] = useState<Record<string, any>>({})

  useEffect(() => {
    const fetchAccess = async () => {
      try {
        const res = await fetch('/api/user/access', { cache: 'no-store' })
        const data = await res.json()
        const level = data?.level || data?.access_level || 'free'
        setMembership(level)
        setFeatures(data?.features || {})
        setLimits(data?.limits || {})
        const sub = data?.subscription
        const paid = !!sub?.stripe_subscription_id
        setHasPaidSub(paid)
        if (sub?.trial_end && !paid) {
          const end = new Date(sub.trial_end).getTime()
          const msLeft = end - Date.now()
          const days = Math.max(0, Math.ceil(msLeft / (1000 * 60 * 60 * 24)))
          setTrialDaysLeft(days)
        } else {
          setTrialDaysLeft(null)
        }
      } catch {
        // noop
      }
    }
    fetchAccess()
  }, [])

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
              {/* Membership and trial badges */}

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
              <MembershipInfo
                membership={membership}
                hasPaidSub={hasPaidSub}
                trialDaysLeft={trialDaysLeft}
                features={features}
                limits={limits}
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
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
