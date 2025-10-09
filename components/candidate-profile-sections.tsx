'use client'

import { Heart, Target, TrendingUp } from 'lucide-react'
import KeyIssues from './_constants/pages/canidateProfile/keyIssues'
import PolicyPositions from './_constants/pages/canidateProfile/policyPositions'
import ProfileStatus from './_constants/pages/canidateProfile/profileStatus'
import CandidateProfileAdditionalInfo from './candidate-profile-additional-info'

interface CandidateProfileSectionsProps {
  profileData: {
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
  location?: {
    address?: string
    city?: string
    state?: string
    zipCode?: string
    phone?: string
    email?: string
  }
  notifications?: {
    emailNotifications?: boolean
    smsNotifications?: boolean
    campaignUpdates?: boolean
    voterMessages?: boolean
    policyAlerts?: boolean
    eventReminders?: boolean
  }
}

export default function CandidateProfileSections({
  profileData,
  location,
  notifications
}: CandidateProfileSectionsProps) {
  const keyIssues = [
    {
      title: 'Priority Issue #1',
      content: profileData.key_issues.issue1,
      color: 'blue',
      icon: <Target className="w-5 h-5" />
    },
    {
      title: 'Priority Issue #2',
      content: profileData.key_issues.issue2,
      color: 'green',
      icon: <TrendingUp className="w-5 h-5" />
    },
    {
      title: 'Priority Issue #3',
      content: profileData.key_issues.issue3,
      color: 'purple',
      icon: <Heart className="w-5 h-5" />
    }
  ]

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return {
          bg: 'bg-blue-50',
          text: 'text-blue-900',
          content: 'text-blue-800',
          border: 'border-blue-200'
        }
      case 'green':
        return {
          bg: 'bg-green-50',
          text: 'text-green-900',
          content: 'text-green-800',
          border: 'border-green-200'
        }
      case 'purple':
        return {
          bg: 'bg-purple-50',
          text: 'text-purple-900',
          content: 'text-purple-800',
          border: 'border-purple-200'
        }
      default:
        return {
          bg: 'bg-gray-50',
          text: 'text-gray-900',
          content: 'text-gray-800',
          border: 'border-gray-200'
        }
    }
  }

  return (
    <div className="space-y-8">
      {/* Key Issues Section */}
      <KeyIssues keyIssues={keyIssues} getColorClasses={getColorClasses} />

      {/* Policy Positions Section */}
      <PolicyPositions profileData={profileData} />

      {/* Profile Status Section */}
      <ProfileStatus profileData={profileData} />

      {/* Additional Information */}
      <CandidateProfileAdditionalInfo
        location={location}
        notifications={notifications}
      />
    </div>
  )
}
