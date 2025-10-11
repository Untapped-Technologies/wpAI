'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  AlertTriangle,
  Building,
  CheckCircle,
  Clock,
  Edit,
  ExternalLink,
  Eye,
  EyeOff,
  Globe,
  MapPin,
  Share2
} from 'lucide-react'

interface CandidateProfileHeaderProps {
  profileData: {
    basic_info: {
      fullName: string
      office: string
      district: string
      party: string
      website: string
      bio: string
      jurisdiction: string[]
      approved: boolean
    }
    onboarding_completed: boolean
    onboarding_completed_at?: string
  }
  onEditProfile: () => void
  onTogglePublicView: () => void
  isPublicView: boolean
}

export default function CandidateProfileHeader({
  profileData,
  onEditProfile,
  onTogglePublicView,
  isPublicView
}: CandidateProfileHeaderProps) {
  const getStatusBadge = () => {
    if (!profileData.onboarding_completed) {
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
          <Clock className="w-3 h-3 mr-1" />
          Pending Review
        </Badge>
      )
    }

    if (profileData.basic_info.approved === false) {
      return (
        <Badge variant="destructive" className="bg-red-100 text-red-800">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Profile Rejected
        </Badge>
      )
    }

    if (
      profileData.basic_info.approved === null ||
      profileData.basic_info.approved === undefined
    ) {
      return (
        <Badge variant="secondary" className="bg-orange-100 text-orange-800">
          <Clock className="w-3 h-3 mr-1" />
          Under Review
        </Badge>
      )
    }

    return (
      <Badge variant="default" className="bg-green-100 text-green-800">
        <CheckCircle className="w-3 h-3 mr-1" />
        Profile Approved
      </Badge>
    )
  }

  const getJurisdictionBadges = () => {
    if (!profileData.basic_info?.jurisdiction) return null

    return profileData.basic_info.jurisdiction.map((jurisdiction, index) => (
      <Badge key={index} variant="outline" className="mr-2 mb-2">
        {jurisdiction}
      </Badge>
    ))
  }

  const handleShare = () => {
    // Only allow sharing if profile is approved
    if (profileData.basic_info.approved !== true) {
      // You might want to show a toast here explaining the profile is not public
      return
    }

    // Create public share URL
    const publicUrl = `${window.location.origin}/candidate/${window.location.pathname.split('/').pop()}`

    if (navigator.share) {
      navigator.share({
        title: `${profileData.basic_info.fullName} - Candidate Profile`,
        text: `Check out ${profileData.basic_info.fullName}'s candidate profile`,
        url: publicUrl
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(publicUrl)
      // You might want to show a toast here
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
      {/* Main Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h1 className="text-4xl font-bold text-gray-900">
              {profileData.basic_info.fullName}
            </h1>
            {getStatusBadge()}
          </div>

          <p className="text-2xl text-gray-600 mb-4">
            Candidate for {profileData.basic_info.office}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              {profileData.basic_info.district}
            </div>
            <div className="flex items-center">
              <Building className="w-4 h-4 mr-1" />
              {profileData.basic_info.party}
            </div>
            {profileData.basic_info.website && (
              <div className="flex items-center">
                <Globe className="w-4 h-4 mr-1" />
                <a
                  href={profileData.basic_info.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 flex items-center transition-colors"
                >
                  Campaign Website
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </div>
            )}
          </div>

          {/* Jurisdiction Badges */}
          <div className="flex flex-wrap">{getJurisdictionBadges()}</div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 lg:mt-0 flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={onTogglePublicView}
            className="flex items-center"
          >
            {isPublicView ? (
              <>
                <EyeOff className="w-4 h-4 mr-2" />
                Private View
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-2" />
                Public View
              </>
            )}
          </Button>

          <Button
            variant="outline"
            onClick={handleShare}
            disabled={profileData.basic_info.approved !== true}
            className="flex items-center"
            title={
              profileData.basic_info.approved !== true
                ? 'Profile must be approved to share publicly'
                : 'Share profile'
            }
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>

          <Button
            onClick={onEditProfile}
            className="flex items-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Bio Section */}
      {profileData.basic_info.bio && (
        <div className="mt-8 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
          <p className="text-gray-700 leading-relaxed text-lg">
            {profileData.basic_info.bio}
          </p>
        </div>
      )}
    </div>
  )
}
