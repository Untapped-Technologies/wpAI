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
      <CardHeader className="bg-white">
        <CardTitle className="flex items-center text-2xl">
          <FileText className="w-6 h-6 mr-3" />
          Policy Positions
        </CardTitle>
        <CardDescription className="text-lg">
          Detailed policy positions on important topics
        </CardDescription>
      </CardHeader>
      <CardContent className="p-8">
        <div className="flex flex-col gap-4">
          {profileData.policies.policy1 && (
            <div>
              <h4 className="font-bold text-gray-900 pb-2 pl-1">
                Policy Position #1
              </h4>
              <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                <p className="text-gray-700 leading-relaxed">
                  {profileData.policies.policy1}
                </p>
              </div>
            </div>
          )}

          {profileData.policies.policy2 && (
            <div>
              <h4 className="font-bold text-gray-900 pb-2 pl-1">
                Policy Position #2
              </h4>
              <div className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                <p className="text-gray-700 leading-relaxed">
                  {profileData.policies.policy2}
                </p>
              </div>
            </div>
          )}

          {profileData.policies.policy3 && (
            <div>
              <h4 className="font-bold text-gray-900 pb-2 pl-1">
                Policy Position #3
              </h4>
              <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                <p className="text-gray-700 leading-relaxed">
                  {profileData.policies.policy3}
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
