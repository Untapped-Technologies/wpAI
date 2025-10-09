'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { FileText, Save, Target, User, X } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

interface CandidateProfileEditProps {
  profileData: {
    basic_info: {
      fullName: string
      office: string
      district: string
      party: string
      website: string
      bio: string
      jurisdiction: string[]
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
  }
  onSave: (updatedData: any) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export default function CandidateProfileEdit({
  profileData,
  onSave,
  onCancel,
  isLoading = false
}: CandidateProfileEditProps) {
  const [formData, setFormData] = useState({
    basic_info: {
      fullName: profileData.basic_info.fullName || '',
      office: profileData.basic_info.office || '',
      district: profileData.basic_info.district || '',
      party: profileData.basic_info.party || '',
      website: profileData.basic_info.website || '',
      bio: profileData.basic_info.bio || '',
      jurisdiction: profileData.basic_info.jurisdiction || []
    },
    key_issues: {
      issue1: profileData.key_issues.issue1 || '',
      issue2: profileData.key_issues.issue2 || '',
      issue3: profileData.key_issues.issue3 || ''
    },
    policies: {
      policy1: profileData.policies.policy1 || '',
      policy2: profileData.policies.policy2 || '',
      policy3: profileData.policies.policy3 || ''
    }
  })

  const handleInputChange = (section: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }))
  }

  const handleJurisdictionChange = (jurisdiction: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      basic_info: {
        ...prev.basic_info,
        jurisdiction: checked
          ? [...prev.basic_info.jurisdiction, jurisdiction]
          : prev.basic_info.jurisdiction.filter(j => j !== jurisdiction)
      }
    }))
  }

  const handleSave = async () => {
    try {
      await onSave(formData)
      toast.success('Profile updated successfully!')
    } catch (error) {
      toast.error('Failed to update profile. Please try again.')
    }
  }

  const isFormValid = () => {
    return (
      formData.basic_info.fullName.trim() &&
      formData.basic_info.office.trim() &&
      formData.basic_info.district.trim() &&
      formData.basic_info.jurisdiction.length > 0 &&
      formData.key_issues.issue1.trim() &&
      formData.key_issues.issue2.trim() &&
      formData.key_issues.issue3.trim() &&
      formData.policies.policy1.trim() &&
      formData.policies.policy2.trim() &&
      formData.policies.policy3.trim()
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Edit Candidate Profile
              </h1>
              <p className="text-gray-600">
                Update your candidate information and policy positions
              </p>
            </div>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
                className="flex items-center"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={!isFormValid() || isLoading}
                className="flex items-center bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              >
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="w-5 h-5 mr-2" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={formData.basic_info.fullName}
                  onChange={e =>
                    handleInputChange('basic_info', 'fullName', e.target.value)
                  }
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <Label htmlFor="office">Office Sought *</Label>
                <Input
                  id="office"
                  value={formData.basic_info.office}
                  onChange={e =>
                    handleInputChange('basic_info', 'office', e.target.value)
                  }
                  placeholder="e.g., Mayor, City Council, State Representative"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="district">District/Area *</Label>
                <Input
                  id="district"
                  value={formData.basic_info.district}
                  onChange={e =>
                    handleInputChange('basic_info', 'district', e.target.value)
                  }
                  placeholder="e.g., District 5, Ward 3"
                />
              </div>
              <div>
                <Label htmlFor="party">Political Party</Label>
                <Input
                  id="party"
                  value={formData.basic_info.party}
                  onChange={e =>
                    handleInputChange('basic_info', 'party', e.target.value)
                  }
                  placeholder="e.g., Democratic, Republican, Independent"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="website">Campaign Website</Label>
              <Input
                id="website"
                value={formData.basic_info.website}
                onChange={e =>
                  handleInputChange('basic_info', 'website', e.target.value)
                }
                placeholder="https://your-campaign-website.com"
              />
            </div>

            <div>
              <Label>Jurisdiction Level *</Label>
              <div className="flex flex-wrap gap-3 mt-2">
                {['Local', 'State', 'Federal'].map(level => (
                  <label
                    key={level}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <Checkbox
                      checked={formData.basic_info.jurisdiction.includes(level)}
                      onCheckedChange={checked =>
                        handleJurisdictionChange(level, checked as boolean)
                      }
                    />
                    <span className="text-sm">{level}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="bio">Brief Bio (150 words max)</Label>
              <Textarea
                id="bio"
                value={formData.basic_info.bio}
                onChange={e =>
                  handleInputChange('basic_info', 'bio', e.target.value)
                }
                placeholder="Tell voters about yourself, your background, and why you're running..."
                maxLength={150}
                rows={4}
              />
              <div className="text-xs text-gray-500 mt-1">
                {formData.basic_info.bio.length}/150 characters
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Issues */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Key Issues
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                Share your top 3 key issues that you'll focus on if elected. Be
                specific and concise (2-3 sentences each).
              </p>
            </div>

            <div>
              <Label htmlFor="keyIssue1">Key Issue #1 *</Label>
              <Textarea
                id="keyIssue1"
                value={formData.key_issues.issue1}
                onChange={e =>
                  handleInputChange('key_issues', 'issue1', e.target.value)
                }
                placeholder="e.g., Economic development and job creation in our community..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="keyIssue2">Key Issue #2 *</Label>
              <Textarea
                id="keyIssue2"
                value={formData.key_issues.issue2}
                onChange={e =>
                  handleInputChange('key_issues', 'issue2', e.target.value)
                }
                placeholder="e.g., Education funding and school improvements..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="keyIssue3">Key Issue #3 *</Label>
              <Textarea
                id="keyIssue3"
                value={formData.key_issues.issue3}
                onChange={e =>
                  handleInputChange('key_issues', 'issue3', e.target.value)
                }
                placeholder="e.g., Infrastructure and transportation improvements..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Policy Positions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Policy Positions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-800">
                Provide more detailed policy positions on 3 important topics.
                This helps voters understand your specific plans and priorities.
              </p>
            </div>

            <div>
              <Label htmlFor="policy1">Policy Position #1 *</Label>
              <Textarea
                id="policy1"
                value={formData.policies.policy1}
                onChange={e =>
                  handleInputChange('policies', 'policy1', e.target.value)
                }
                placeholder="e.g., Healthcare: I support expanding access to affordable healthcare by..."
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="policy2">Policy Position #2 *</Label>
              <Textarea
                id="policy2"
                value={formData.policies.policy2}
                onChange={e =>
                  handleInputChange('policies', 'policy2', e.target.value)
                }
                placeholder="e.g., Environment: My environmental plan includes..."
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="policy3">Policy Position #3 *</Label>
              <Textarea
                id="policy3"
                value={formData.policies.policy3}
                onChange={e =>
                  handleInputChange('policies', 'policy3', e.target.value)
                }
                placeholder="e.g., Public Safety: I will work to improve public safety by..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Button at Bottom */}
        <div className="flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            className="flex items-center"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!isFormValid() || isLoading}
            className="flex items-center bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
          >
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  )
}
