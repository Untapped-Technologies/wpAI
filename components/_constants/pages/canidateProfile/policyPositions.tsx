'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Award, FileText, MessageSquare, Users } from 'lucide-react'

interface PolicyPositionsProps {
  profileData: {
    policies: {
      policy1: string
      policy2: string
      policy3: string
    }
  }
}

export default function PolicyPositions({ profileData }: PolicyPositionsProps) {
  const policyIcons = [
    <MessageSquare className="w-5 h-5 mr-2 text-blue-600" />,
    <Users className="w-5 h-5 mr-2 text-green-600" />,
    <Award className="w-5 h-5 mr-2 text-purple-600" />
  ]

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
        <CardTitle className="flex items-center text-2xl">
          <FileText className="w-6 h-6 mr-3 text-green-600" />
          Policy Positions
        </CardTitle>
        <CardDescription className="text-lg">
          Detailed policy positions on important topics
        </CardDescription>
      </CardHeader>
      <CardContent className="p-8">
        <div className="space-y-8">
          {profileData.policies.policy1 && (
            <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
              <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                {policyIcons[0]}
                Policy Position #1
              </h4>
              <p className="text-gray-700 leading-relaxed">
                {profileData.policies.policy1}
              </p>
            </div>
          )}

          {profileData.policies.policy2 && (
            <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
              <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                {policyIcons[1]}
                Policy Position #2
              </h4>
              <p className="text-gray-700 leading-relaxed">
                {profileData.policies.policy2}
              </p>
            </div>
          )}

          {profileData.policies.policy3 && (
            <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
              <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                {policyIcons[2]}
                Policy Position #3
              </h4>
              <p className="text-gray-700 leading-relaxed">
                {profileData.policies.policy3}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
