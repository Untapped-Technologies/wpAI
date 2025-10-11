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
import {
  Award,
  Building,
  Download,
  ExternalLink,
  EyeOff,
  FileText,
  Globe,
  Heart,
  MapPin,
  MessageSquare,
  Printer,
  Share2,
  Target,
  TrendingUp,
  Users
} from 'lucide-react'

interface CandidatePublicProfileProps {
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
  onTogglePublicView?: () => void
}

export default function CandidatePublicProfile({
  profileData,
  onTogglePublicView
}: CandidatePublicProfileProps) {
  const getJurisdictionBadges = () => {
    if (!profileData.basic_info?.jurisdiction) return null

    return profileData.basic_info.jurisdiction.map((jurisdiction, index) => (
      <Badge key={index} variant="outline" className="mr-2 mb-2">
        {jurisdiction}
      </Badge>
    ))
  }

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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${profileData.basic_info.fullName} - Candidate Profile`,
        text: `Check out ${profileData.basic_info.fullName}'s candidate profile`,
        url: window.location.href
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      // You might want to show a toast here
    }
  }

  const handleDownloadProfile = () => {
    // Create a printable version of the profile
    const printWindow = window.open('', '_blank')
    if (printWindow && profileData) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${profileData.basic_info.fullName} - Candidate Profile</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 40px; }
              .header { border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
              .section { margin-bottom: 30px; }
              .issue { background: #f5f5f5; padding: 15px; margin: 10px 0; border-radius: 5px; }
              .policy { margin: 15px 0; padding: 15px; border-left: 4px solid #007bff; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>${profileData.basic_info.fullName}</h1>
              <h2>Candidate for ${profileData.basic_info.office}</h2>
              <p>${profileData.basic_info.district} | ${profileData.basic_info.party}</p>
            </div>
            
            ${
              profileData.basic_info.bio
                ? `
              <div class="section">
                <h3>About</h3>
                <p>${profileData.basic_info.bio}</p>
              </div>
            `
                : ''
            }
            
            <div class="section bg-white">
              <h3>Key Issues</h3>
              ${profileData.key_issues.issue1 ? `<div class="issue"><strong>Priority Issue #1:</strong><br>${profileData.key_issues.issue1}</div>` : ''}
              ${profileData.key_issues.issue2 ? `<div class="issue"><strong>Priority Issue #2:</strong><br>${profileData.key_issues.issue2}</div>` : ''}
              ${profileData.key_issues.issue3 ? `<div class="issue"><strong>Priority Issue #3:</strong><br>${profileData.key_issues.issue3}</div>` : ''}
            </div>
            
            <div class="section">
              <h3>Policy Positions</h3>
              ${profileData.policies.policy1 ? `<div class="policy"><strong>Policy Position #1:</strong><br>${profileData.policies.policy1}</div>` : ''}
              ${profileData.policies.policy2 ? `<div class="policy"><strong>Policy Position #2:</strong><br>${profileData.policies.policy2}</div>` : ''}
              ${profileData.policies.policy3 ? `<div class="policy"><strong>Policy Position #3:</strong><br>${profileData.policies.policy3}</div>` : ''}
            </div>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Action Bar */}
        <div className="flex justify-between mb-6">
          {/* Back to Private View Button */}
          {onTogglePublicView && (
            <Button
              variant="outline"
              onClick={onTogglePublicView}
              className="flex items-center"
            >
              <EyeOff className="w-4 h-4 mr-2" />
              Back to Private View
            </Button>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={handleShare}
              className="flex items-center"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button
              variant="outline"
              onClick={handleDownloadProfile}
              className="flex items-center"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button
              variant="outline"
              onClick={() => window.print()}
              className="flex items-center"
            >
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
          </div>
        </div>

        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {profileData.basic_info.fullName}
            </h1>
            <p className="text-2xl text-gray-600 mb-4">
              Candidate for {profileData.basic_info.office}
            </p>

            <div className="flex flex-wrap justify-center items-center gap-4 text-sm text-gray-500 mb-4">
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
            <div className="flex flex-wrap justify-center">
              {getJurisdictionBadges()}
            </div>
          </div>

          {/* Bio Section */}
          {profileData.basic_info.bio && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">
                About
              </h3>
              <p className="text-gray-700 leading-relaxed text-lg text-center max-w-4xl mx-auto">
                {profileData.basic_info.bio}
              </p>
            </div>
          )}
        </div>

        {/* Key Issues Section */}
        <Card className="shadow-lg border-0 mb-8">
          <CardHeader className="bg-gradient-to-r bg-white">
            <CardTitle className="flex items-center text-2xl justify-center">
              <Target className="w-6 h-6 mr-3 text-green-800" />
              Key Issues
            </CardTitle>
            <CardDescription className="text-lg text-center">
              The top priorities I'll focus on if elected
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {keyIssues.map((issue, index) => {
                if (!issue.content) return null

                const colors = getColorClasses(issue.color)

                return (
                  <div
                    key={index}
                    className={`${colors.bg} ${colors.border} p-6 rounded-xl border-2 hover:shadow-md transition-shadow`}
                  >
                    <div
                      className={`flex items-center justify-center ${colors.text} mb-3`}
                    >
                      {issue.icon}
                      <h4 className="font-bold ml-2">{issue.title}</h4>
                    </div>
                    <p
                      className={`${colors.content} leading-relaxed text-center`}
                    >
                      {issue.content}
                    </p>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Policy Positions Section */}
        <Card className="shadow-lg border-0 mb-8">
          <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
            <CardTitle className="flex items-center text-2xl justify-center">
              <FileText className="w-6 h-6 mr-3 text-green-600" />
              Policy Positions
            </CardTitle>
            <CardDescription className="text-lg text-center">
              Detailed policy positions on important topics
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-8">
              {profileData.policies.policy1 && (
                <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                  <h4 className="font-bold text-gray-900 mb-3 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 mr-2 text-blue-600" />
                    Policy Position #1
                  </h4>
                  <p className="text-gray-700 leading-relaxed text-center">
                    {profileData.policies.policy1}
                  </p>
                </div>
              )}

              {profileData.policies.policy2 && (
                <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                  <h4 className="font-bold text-gray-900 mb-3 flex items-center justify-center">
                    <Users className="w-5 h-5 mr-2 text-green-600" />
                    Policy Position #2
                  </h4>
                  <p className="text-gray-700 leading-relaxed text-center">
                    {profileData.policies.policy2}
                  </p>
                </div>
              )}

              {profileData.policies.policy3 && (
                <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                  <h4 className="font-bold text-gray-900 mb-3 flex items-center justify-center">
                    <Award className="w-5 h-5 mr-2 text-purple-600" />
                    Policy Position #3
                  </h4>
                  <p className="text-gray-700 leading-relaxed text-center">
                    {profileData.policies.policy3}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="shadow-lg border-0">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Support {profileData.basic_info.fullName}
            </h3>
            <p className="text-gray-600 mb-6">
              Learn more about this candidate and their vision for our
              community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {profileData.basic_info.website && (
                <Button
                  asChild
                  className="bg-gradient-to-r from-blue-600 to-purple-600"
                >
                  <a
                    href={profileData.basic_info.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center"
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    Visit Campaign Website
                  </a>
                </Button>
              )}
              <Button variant="outline" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Share This Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
