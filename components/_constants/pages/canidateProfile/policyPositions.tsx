import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Award, FileText, MessageSquare, Users } from 'lucide-react'

const PolicyPositions = ({ profileData }) => {
  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="">
        <CardTitle className="flex items-center text-2xl">
          <FileText className="w-6 h-6 mr-3" />
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
                <MessageSquare className="w-5 h-5 mr-2 text-blue-600" />
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
                <Users className="w-5 h-5 mr-2 text-green-600" />
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
                <Award className="w-5 h-5 mr-2 text-purple-600" />
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

export default PolicyPositions
