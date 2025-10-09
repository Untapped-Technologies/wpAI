'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Award, Calendar } from 'lucide-react'

interface ProfileStatusProps {
  profileData: {
    onboarding_completed: boolean
    onboarding_completed_at?: string
  }
}

export default function ProfileStatus({ profileData }: ProfileStatusProps) {
  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
        <CardTitle className="flex items-center text-2xl">
          <Award className="w-6 h-6 mr-3 text-purple-600" />
          Profile Status
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {profileData.onboarding_completed ? (
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-lg">Profile Submitted</p>
                  <p className="text-gray-600">
                    Your profile has been submitted for review
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="font-semibold text-lg">Profile Pending</p>
                  <p className="text-gray-600">
                    Complete your profile to submit for review
                  </p>
                </div>
              </div>
            )}
          </div>

          {profileData.onboarding_completed_at && (
            <div className="text-right">
              <p className="text-sm text-gray-500">Submitted on</p>
              <p className="text-lg font-semibold">
                {new Date(
                  profileData.onboarding_completed_at
                ).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          )}
        </div>

        {!profileData.onboarding_completed && (
          <div className="mt-6 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">Next Steps</h4>
                <p className="text-blue-800">
                  Your profile will be reviewed by our team. Please allow up to
                  7 business days for approval. You will be notified via email
                  once your profile has been approved and is live on the
                  platform.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
