'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, Lock, User } from 'lucide-react'

interface CandidateProfileLockedProps {
  profileData: {
    basic_info: {
      fullName: string
      office: string
      district: string
      party: string
      approved: boolean
    }
    onboarding_completed: boolean
  }
  rejectedMessage?: string
}

export default function CandidateProfileLocked({
  profileData,
  rejectedMessage
}: CandidateProfileLockedProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-red-100 rounded-full">
              <Lock className="h-12 w-12 text-red-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Profile Locked
          </h1>
          <p className="text-lg text-gray-600">
            Your candidate profile has been reviewed and is currently not
            approved
          </p>
        </div>

        {/* Profile Info Card */}
        <Card className="mb-8">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-gray-100 rounded-full">
                <User className="h-8 w-8 text-gray-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              {profileData.basic_info.fullName}
            </CardTitle>
            <div className="flex justify-center mt-4">
              <Badge variant="destructive" className="bg-red-100 text-red-800">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Profile Rejected
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="text-center">
            <div className="space-y-2 text-gray-600">
              <p className="text-lg">
                <span className="font-medium">Office:</span>{' '}
                {profileData.basic_info.office}
              </p>
              <p className="text-lg">
                <span className="font-medium">District:</span>{' '}
                {profileData.basic_info.district}
              </p>
              <p className="text-lg">
                <span className="font-medium">Party:</span>{' '}
                {profileData.basic_info.party}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Rejection Message */}
        {rejectedMessage && (
          <Card className="mb-8 border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center text-red-800">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Review Feedback
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-white p-4 rounded-lg border border-red-200">
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {rejectedMessage}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-gray-800">
              <Lock className="h-5 w-5 mr-2" />
              What This Means
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-gray-700">
              <p>
                Your candidate profile has been reviewed and is currently not
                approved for public display. This means:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Your profile is not visible to the public</li>
                <li>You cannot edit or modify your profile at this time</li>
                <li>Your profile cannot be shared or accessed by visitors</li>
                <li>You may need to address the feedback provided above</li>
              </ul>
              <p className="mt-4">
                If you have questions about this decision or need assistance,
                please contact our support team.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
